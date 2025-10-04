import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useMemo, useEffect } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export default function Index({ auth, contributions, permissions }) {
  const [selectedMitupo, setSelectedMitupo] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showImportForm, setShowImportForm] = useState(false);
  const [mitupoData, setMitupoData] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    data: importData,
    setData: setImportData,
    post: importPost,
    errors: importErrors,
    reset: resetImport,
  } = useForm({
    csv_file: null,
  });

  // Destructure permissions - now includes canViewAll
  const { canEdit, canDelete, canImport, canCreate, canViewAll } = permissions;

  // Fetch mitupo data for template - only if user can import
  useEffect(() => {
    if (canImport) {
      const fetchMitupoData = async () => {
        try {
          setLoading(true);
          const response = await fetch(route("contributions.mitupo-data"));
          if (response.ok) {
            const data = await response.json();
            setMitupoData(data);
          }
        } catch (error) {
          console.error("Failed to fetch mitupo data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchMitupoData();
    }
  }, [canImport]);

  // Group contributions by mitupo - FIXED VERSION
  const groupedContributions = useMemo(() => {
    const groups = {};

    contributions.forEach((contribution) => {
      const mutupoName = contribution.mutupo.name;
      if (!groups[mutupoName]) {
        groups[mutupoName] = {
          mutupo: contribution.mutupo,
          contributions: [],
          totalAmount: 0,
          totalTshirts: 0,
          totalCementBags: 0,
        };
      }

      groups[mutupoName].contributions.push(contribution);

      // Ensure we're working with numbers, not strings
      const tshirts = parseInt(contribution.no_of_tshirts) || 0;
      const cementBags = parseInt(contribution.no_of_cement_bags) || 0;
      const amount = parseFloat(contribution.total_contributed) || 0;

      groups[mutupoName].totalAmount += amount;
      groups[mutupoName].totalTshirts += tshirts;
      groups[mutupoName].totalCementBags += cementBags;
    });

    // Convert to array and sort by mutupo name
    return Object.values(groups).sort((a, b) =>
      a.mutupo.name.localeCompare(b.mutupo.name)
    );
  }, [contributions]);

  // Filter grouped contributions
  const filteredGroups = useMemo(() => {
    return groupedContributions.filter((group) => {
      // Filter by selected mutupo
      if (selectedMitupo !== "all" && group.mutupo.name !== selectedMitupo) {
        return false;
      }

      // Filter by search term
      if (searchTerm) {
        const hasMatchingContribution = group.contributions.some(
          (contribution) =>
            contribution.contributor_name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            contribution.contributor_type.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        );
        return hasMatchingContribution;
      }

      return true;
    });
  }, [groupedContributions, selectedMitupo, searchTerm]);

  // Get unique mitupo for filter dropdown
  const uniqueMitupos = useMemo(() => {
    const mitupos = [
      ...new Set(contributions.map((c) => c.mutupo.name)),
    ].sort();
    return ["all", ...mitupos];
  }, [contributions]);

  // Calculate overall totals - FIXED VERSION
  const totalContributions = contributions.reduce((sum, contribution) => {
    const amount = parseFloat(contribution.total_contributed) || 0;
    return sum + amount;
  }, 0);

  const totalTshirts = contributions.reduce((sum, contribution) => {
    const tshirts = parseInt(contribution.no_of_tshirts) || 0;
    return sum + tshirts;
  }, 0);

  const totalCementBags = contributions.reduce((sum, contribution) => {
    const cementBags = parseInt(contribution.no_of_cement_bags) || 0;
    return sum + cementBags;
  }, 0);

  const handleImportSubmit = (e) => {
    e.preventDefault();
    importPost(route("contributions.import"), {
      onSuccess: () => {
        resetImport();
        setShowImportForm(false);
      },
    });
  };

  const handleExport = () => {
    // General users cannot export, this will be handled by the backend
    window.location.href = route("contributions.export");
  };

  const downloadTemplate = () => {
    let template = `contributor_name,mutupo_id,contributor_type_id,no_of_tshirts,no_of_cement_bags,cement_amount\n`;

    // Add example rows
    template += `John Doe,1,1,2,0,0\n`;
    template += `Jane Smith,2,2,0,3,45.00\n`;
    template += `Mike Johnson,3,3,1,2,30.00\n\n`;

    template += `VALID MUTUPO IDs:\n`;
    if (mitupoData && mitupoData.mitupos) {
      mitupoData.mitupos.forEach((mitupo) => {
        template += `- ${mitupo.id}: ${mitupo.name}${
          mitupo.description ? ` (${mitupo.description})` : ""
        }\n`;
      });
    } else {
      template += `- 1: Shava\n- 2: Mhofu\n- 3: Moyo\n- 4: Shumba\n- 5: Soko\n- 6: Gumbo\n- 7: Ngwena\n`;
    }

    template += `\nCONTRIBUTOR TYPE IDs:\n`;
    template += `- 1: External Guest\n- 2: Internal Guest\n- 3: Fundraising Task Force Member\n`;
    template += `\nIMPORTANT NOTES:\n`;
    template += `- contributor_name must be unique (no duplicates)\n`;
    template += `- mutupo_id must match an existing mutupo ID from the list above\n`;
    template += `- contributor_type_id must be 1, 2, or 3\n`;
    template += `- no_of_tshirts and no_of_cement_bags must be whole numbers (0 or greater)\n`;
    template += `- cement_amount should be in USD format (e.g., 45.00)\n`;
    template += `- T-shirt amount is automatically calculated ($7 per shirt)\n`;
    template += `- Total contribution is automatically calculated (T-shirts + cement amount)`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contributions_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Contributions
          </h2>
          <div className="flex space-x-2">
            {canImport && (
              <button
                onClick={() => setShowImportForm(true)}
                className="bg-blue-500 px-3 py-2 text-white rounded shadow transition-all hover:bg-blue-600 text-sm font-medium"
              >
                Import CSV
              </button>
            )}
            {/* Show export button only for admin and regular users, not for general users */}
            {(auth.user.role === 'admin' || auth.user.role === 'user') && (
              <button
                onClick={handleExport}
                className="bg-green-500 px-3 py-2 text-white rounded shadow transition-all hover:bg-green-600 text-sm font-medium"
              >
                Export CSV
              </button>
            )}
            {canCreate && (
              <Link
                href={route("contributions.create")}
                className="bg-emerald-500 px-3 py-2 text-white rounded shadow transition-all hover:bg-emerald-600 text-sm font-medium"
              >
                Add New Contribution
              </Link>
            )}
          </div>
        </div>
      }
    >
      <Head title="Contributions" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Import Form - Only show if user can import */}
          {showImportForm && canImport && (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Import Contributions from CSV
                  </h3>
                  <button
                    onClick={() => setShowImportForm(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                    Import Instructions:
                  </h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-400 list-disc list-inside space-y-1">
                    <li>
                      Download the template below to see the required format
                    </li>
                    <li>
                      CSV must include these exact columns: contributor_name,
                      mutupo_id, contributor_type_id, no_of_tshirts,
                      no_of_cement_bags, cement_amount
                    </li>
                    <li>
                      mutupo_id must match existing Mitupo IDs (see template for
                      valid IDs)
                    </li>
                    <li>
                      contributor_type_id: 1=External Guest, 2=Internal Guest,
                      3=Fundraising Task Force Member
                    </li>
                    <li>File must be in CSV format with UTF-8 encoding</li>
                  </ul>
                </div>

                <div className="flex space-x-4 mb-4">
                  <button
                    onClick={downloadTemplate}
                    disabled={loading}
                    className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm transition-all"
                  >
                    {loading ? "Loading..." : "Download Template"}
                  </button>
                  <Link
                    href={route("mitupos.index")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm transition-all"
                  >
                    View Mitupo List
                  </Link>
                </div>

                {mitupoData && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                      Available Mutupo:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                      {mitupoData.mitupos.map((mitupo) => (
                        <div
                          key={mitupo.id}
                          className="text-blue-700 dark:text-blue-400"
                        >
                          <span className="font-mono">{mitupo.id}</span>:{" "}
                          {mitupo.name}
                          {mitupo.description && (
                            <span className="text-blue-600 dark:text-blue-300 text-xs block">
                              {mitupo.description}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleImportSubmit}>
                  <div className="mb-4">
                    <InputLabel htmlFor="csv_file" value="CSV File *" />
                    <input
                      id="csv_file"
                      type="file"
                      accept=".csv"
                      className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                      onChange={(e) =>
                        setImportData("csv_file", e.target.files[0])
                      }
                    />
                    <InputError
                      message={importErrors.csv_file}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Maximum file size: 10MB
                    </p>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowImportForm(false)}
                      className="bg-gray-100 px-4 py-2 text-gray-800 rounded shadow transition-all hover:bg-gray-200 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 px-4 py-2 text-white shadow transition-all hover:bg-blue-600 text-sm"
                    >
                      Import Contributions
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div>
                  <InputLabel htmlFor="search" value="Search Contributors" />
                  <TextInput
                    id="search"
                    type="text"
                    value={searchTerm}
                    className="mt-1 block w-full"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by contributor name or type..."
                  />
                </div>

                {/* Mitupo Filter */}
                <div>
                  <InputLabel htmlFor="mitupoFilter" value="Filter by Mutupo" />
                  <select
                    id="mitupoFilter"
                    value={selectedMitupo}
                    onChange={(e) => setSelectedMitupo(e.target.value)}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                  >
                    {uniqueMitupos.map((mitupo) => (
                      <option key={mitupo} value={mitupo}>
                        {mitupo === "all" ? "All Mutupo" : mitupo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedMitupo("all");
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow transition-all text-sm w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Active Filters Indicator */}
              {(searchTerm || selectedMitupo !== "all") && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-blue-700 dark:text-blue-300 font-medium">
                      Active filters:
                    </span>
                    {searchTerm && (
                      <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                        Search: "{searchTerm}"
                      </span>
                    )}
                    {selectedMitupo !== "all" && (
                      <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                        Mutupo: {selectedMitupo}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">👤</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Contributors
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {contributions.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">👕</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total T-Shirts
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {totalTshirts}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🏗️</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Cement Bags
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {totalCementBags}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">$</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Raised
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${totalContributions.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Role Information Banner */}
          {auth.user.role === 'general' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    View Only Access
                  </h3>
                  <div className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                    <p>
                      As a <strong>General User</strong>, you can view all contributions but cannot create, edit, delete, import, or export records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grouped Contributions */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                    📊
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    {contributions.length === 0
                      ? "No contributions found."
                      : "No contributions match your search criteria."}
                  </p>
                  {contributions.length === 0 && canCreate ? (
                    <Link
                      href={route("contributions.create")}
                      className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      Add Your First Contribution
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedMitupo("all");
                      }}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-8">
                  {filteredGroups.map((group) => (
                    <div
                      key={group.mutupo.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      {/* Group Header */}
                      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {group.mutupo.name}
                            </h3>
                            {group.mutupo.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {group.mutupo.description}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {group.contributions.length} contributor
                              {group.contributions.length !== 1 ? "s" : ""}
                            </div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              ${(parseFloat(group.totalAmount) || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Group Contributions Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-100 dark:bg-gray-600">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Contributor
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                T-Shirts
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Cement Bags
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Total Contribution
                              </th>
                              {(canEdit || canDelete) && (
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                  Actions
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {group.contributions.map((contribution) => (
                              <tr
                                key={contribution.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {contribution.contributor_name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      contribution.contributor_type.name ===
                                      "External Guest"
                                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                        : contribution.contributor_type.name ===
                                          "Internal Guest"
                                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    }`}
                                  >
                                    {contribution.contributor_type.name}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 dark:text-gray-100">
                                    {parseInt(contribution.no_of_tshirts) || 0}{" "}
                                    pcs
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    $
                                    {parseFloat(
                                      contribution.tshirt_amount || 0
                                    ).toFixed(2)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900 dark:text-gray-100">
                                    {parseInt(contribution.no_of_cement_bags) ||
                                      0}{" "}
                                    bags
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">
                                    $
                                    {parseFloat(
                                      contribution.cement_amount || 0
                                    ).toFixed(2)}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                                    $
                                    {parseFloat(
                                      contribution.total_contributed || 0
                                    ).toFixed(2)}
                                  </div>
                                </td>
                                {(canEdit || canDelete) && (
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-3">
                                      {canEdit && (
                                        <Link
                                          href={route(
                                            "contributions.edit",
                                            contribution.id
                                          )}
                                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                        >
                                          Edit
                                        </Link>
                                      )}
                                      {canDelete && (
                                        <Link
                                          href={route(
                                            "contributions.destroy",
                                            contribution.id
                                          )}
                                          method="delete"
                                          as="button"
                                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                          onClick={(e) => {
                                            if (
                                              !confirm(
                                                "Are you sure you want to delete this contribution?"
                                              )
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                        >
                                          Delete
                                        </Link>
                                      )}
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <td
                                colSpan="2"
                                className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 text-right"
                              >
                                Group Total:
                              </td>
                              <td className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {parseInt(group.totalTshirts) || 0} pcs
                              </td>
                              <td className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                {parseInt(group.totalCementBags) || 0} bags
                              </td>
                              <td className="px-6 py-3 text-sm font-bold text-green-600 dark:text-green-400">
                                $
                                {(parseFloat(group.totalAmount) || 0).toFixed(
                                  2
                                )}
                              </td>
                              {(canEdit || canDelete) && <td></td>}
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Grand Total */}
          {filteredGroups.length > 0 && (
            <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-green-800 dark:text-green-300 font-semibold text-lg">
                    Grand Total Across All Mutupo
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Showing{" "}
                    {filteredGroups.reduce(
                      (sum, group) => sum + group.contributions.length,
                      0
                    )}{" "}
                    of {contributions.length} contributions
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${totalContributions.toFixed(2)}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {totalTshirts} T-Shirts • {totalCementBags} Cement Bags
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}