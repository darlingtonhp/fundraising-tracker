// resources/js/Pages/FundDayContributions/Index.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useMemo } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export default function Index({ auth, contributions, permissions }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { canEdit, canDelete, canCreate, canExport } = permissions;

  // Filter contributions
  const filteredContributions = useMemo(() => {
    return contributions.filter((contribution) =>
      contribution.contributor_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [contributions, searchTerm]);

  // Calculate totals
  const totalContributions = contributions.reduce((sum, contribution) => {
    return sum + parseFloat(contribution.total_contributed);
  }, 0);

  const totalCementBags = contributions.reduce((sum, contribution) => {
    return sum + parseInt(contribution.cement_bags);
  }, 0);

  const totalCementAmount = contributions.reduce((sum, contribution) => {
    return sum + parseFloat(contribution.cement_amount);
  }, 0);

  const handleExport = () => {
    // General users cannot export, this will be handled by the backend
    window.location.href = route("fund-day-contributions.export");
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Fund Day Contributions
          </h2>
          <div className="flex space-x-2">
            {/* Show export button only for admin and regular users, not for general users */}
            {canExport && (
              <button
                onClick={handleExport}
                className="bg-green-500 px-3 py-2 text-white rounded shadow transition-all hover:bg-green-600 text-sm font-medium"
              >
                Export CSV
              </button>
            )}
            {canCreate && (
              <Link
                href={route("fund-day-contributions.create")}
                className="bg-emerald-500 px-3 py-2 text-white rounded shadow transition-all hover:bg-emerald-600 text-sm font-medium"
              >
                Add New Contribution
              </Link>
            )}
          </div>
        </div>
      }
    >
      <Head title="Fund Day Contributions" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Search Controls */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputLabel htmlFor="search" value="Search Contributors" />
                  <TextInput
                    id="search"
                    type="text"
                    value={searchTerm}
                    className="mt-1 block w-full"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by contributor name..."
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setSearchTerm("")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow transition-all text-sm w-full"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
          {auth.user.role === "general" && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    View Only Access
                  </h3>
                  <div className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                    <p>
                      As a <strong>General User</strong>, you can view all fund
                      day contributions but cannot create, edit, delete, or
                      export records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contributions Table */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              {filteredContributions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                    💰
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    {contributions.length === 0
                      ? "No fund day contributions found."
                      : "No contributions match your search criteria."}
                  </p>
                  {contributions.length === 0 && canCreate ? (
                    <Link
                      href={route("fund-day-contributions.create")}
                      className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      Add Your First Contribution
                    </Link>
                  ) : (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-600">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Contributor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Cement Bags
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Cement Amount
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
                      {filteredContributions.map((contribution) => (
                        <tr
                          key={contribution.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {contribution.contributor_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Added by: {contribution.user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              {contribution.cement_bags} bags
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">
                              $
                              {parseFloat(contribution.cement_amount).toFixed(
                                2
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                              $
                              {parseFloat(
                                contribution.total_contributed
                              ).toFixed(2)}
                            </div>
                          </td>
                          {(canEdit || canDelete) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                {canEdit && (
                                  <Link
                                    href={route(
                                      "fund-day-contributions.edit",
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
                                      "fund-day-contributions.destroy",
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
                        <td className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 text-right">
                          Total:
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {totalCementBags} bags
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                          ${totalCementAmount.toFixed(2)}
                        </td>
                        <td className="px-6 py-3 text-sm font-bold text-green-600 dark:text-green-400">
                          ${totalContributions.toFixed(2)}
                        </td>
                        {(canEdit || canDelete) && <td></td>}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
