import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useMemo } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export default function Index({ auth, mitupos }) {
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [descriptionFilter, setDescriptionFilter] = useState("all"); // all, with, without

  // Check if user is admin
  const isAdmin = auth.user.role === "admin";

  const {
    data: createData,
    setData: setCreateData,
    post: createPost,
    errors: createErrors,
    reset: resetCreate,
  } = useForm({
    name: "",
    description: "",
  });

  const {
    data: editData,
    setData: setEditData,
    put: editPut,
    errors: editErrors,
    reset: resetEdit,
  } = useForm({
    name: "",
    description: "",
  });

  // Filter and sort mitupos
  const filteredAndSortedMitupos = useMemo(() => {
    let filtered = mitupos.filter((mitupo) => {
      // Search filter
      const matchesSearch =
        mitupo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mitupo.description &&
          mitupo.description.toLowerCase().includes(searchTerm.toLowerCase()));

      // Description filter
      const matchesDescription =
        descriptionFilter === "all" ||
        (descriptionFilter === "with" && mitupo.description) ||
        (descriptionFilter === "without" && !mitupo.description);

      return matchesSearch && matchesDescription;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "description":
          aValue = a.description ? a.description.toLowerCase() : "";
          bValue = b.description ? b.description.toLowerCase() : "";
          break;
        case "created_at":
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [mitupos, searchTerm, sortField, sortDirection, descriptionFilter]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createPost(route("mitupos.store"), {
      onSuccess: () => {
        resetCreate();
        setShowCreateForm(false);
      },
    });
  };

  const handleEditSubmit = (e, mitupo) => {
    e.preventDefault();
    editPut(route("mitupos.update", mitupo.id), {
      onSuccess: () => {
        setEditingId(null);
        resetEdit();
      },
    });
  };

  const startEditing = (mitupo) => {
    if (!isAdmin) return; // Prevent editing if not admin
    setEditingId(mitupo.id);
    setEditData({
      name: mitupo.name,
      description: mitupo.description || "",
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    resetEdit();
  };

  const cancelCreate = () => {
    setShowCreateForm(false);
    resetCreate();
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDescriptionFilter("all");
    setSortField("name");
    setSortDirection("asc");
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Mitupo/Totems
          </h2>
          {isAdmin && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-emerald-500 px-3 py-2 text-white rounded shadow transition-all hover:bg-emerald-600 text-sm font-medium"
            >
              Add New Mutupo
            </button>
          )}
        </div>
      }
    >
      <Head title="Mitupo" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Create Form - Only show for admin */}
          {showCreateForm && isAdmin && (
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Add New Mutupo
                </h3>
                <form onSubmit={handleCreateSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <InputLabel htmlFor="create_name" value="Mutupo Name *" />
                      <TextInput
                        id="create_name"
                        type="text"
                        value={createData.name}
                        className="mt-1 block w-full"
                        onChange={(e) => setCreateData("name", e.target.value)}
                        placeholder="Enter mutupo name"
                      />
                      <InputError
                        message={createErrors.name}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <InputLabel
                        htmlFor="create_description"
                        value="Description"
                      />
                      <TextInput
                        id="create_description"
                        type="text"
                        value={createData.description}
                        className="mt-1 block w-full"
                        onChange={(e) =>
                          setCreateData("description", e.target.value)
                        }
                        placeholder="Enter description (optional)"
                      />
                      <InputError
                        message={createErrors.description}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={cancelCreate}
                      className="bg-gray-100 px-4 py-2 text-gray-800 rounded shadow transition-all hover:bg-gray-200 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-500 px-4 py-2 text-white shadow transition-all hover:bg-emerald-600 text-sm"
                    >
                      Create Mutupo
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Search and Filter Controls */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search Input */}
                <div>
                  <InputLabel htmlFor="search" value="Search Mitupo" />
                  <TextInput
                    id="search"
                    type="text"
                    value={searchTerm}
                    className="mt-1 block w-full"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or description..."
                  />
                </div>

                {/* Description Filter */}
                <div>
                  <InputLabel
                    htmlFor="descriptionFilter"
                    value="Description Filter"
                  />
                  <select
                    id="descriptionFilter"
                    value={descriptionFilter}
                    onChange={(e) => setDescriptionFilter(e.target.value)}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                  >
                    <option value="all">All Mitupo</option>
                    <option value="with">With Description</option>
                    <option value="without">Without Description</option>
                  </select>
                </div>

                {/* Sort Field */}
                <div>
                  <InputLabel htmlFor="sortField" value="Sort By" />
                  <select
                    id="sortField"
                    value={sortField}
                    onChange={(e) => setSortField(e.target.value)}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                  >
                    <option value="name">Name</option>
                    <option value="description">Description</option>
                    <option value="created_at">Created Date</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded shadow transition-all text-sm w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {/* Active Filters Summary */}
              {(searchTerm || descriptionFilter !== "all") && (
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
                    {descriptionFilter !== "all" && (
                      <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                        {descriptionFilter === "with"
                          ? "With Description"
                          : "Without Description"}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mitupo Table */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              {filteredAndSortedMitupos.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                    🏛️
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    {mitupos.length === 0
                      ? "No mitupo found."
                      : "No mitupo match your search criteria."}
                  </p>
                  {mitupos.length === 0 && isAdmin ? (
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Add Your First Mutupo
                    </button>
                  ) : (
                    <button
                      onClick={clearFilters}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => handleSort("name")}
                        >
                          <div className="flex items-center">
                            Mutupo Name
                            <SortIcon field="name" />
                          </div>
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => handleSort("description")}
                        >
                          <div className="flex items-center">
                            Description
                            <SortIcon field="description" />
                          </div>
                        </th>
                        <th
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                          onClick={() => handleSort("created_at")}
                        >
                          <div className="flex items-center">
                            Created Date
                            <SortIcon field="created_at" />
                          </div>
                        </th>
                        {isAdmin && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredAndSortedMitupos.map((mitupo) => (
                        <tr
                          key={mitupo.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          {editingId === mitupo.id ? (
                            // Edit Mode Row - Only show for admin
                            <td colSpan={isAdmin ? 4 : 3} className="px-6 py-4">
                              <form
                                onSubmit={(e) => handleEditSubmit(e, mitupo)}
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <InputLabel
                                      htmlFor={`edit_name_${mitupo.id}`}
                                      value="Mutupo Name *"
                                    />
                                    <TextInput
                                      id={`edit_name_${mitupo.id}`}
                                      type="text"
                                      value={editData.name}
                                      className="mt-1 block w-full"
                                      onChange={(e) =>
                                        setEditData("name", e.target.value)
                                      }
                                    />
                                    <InputError
                                      message={editErrors.name}
                                      className="mt-2"
                                    />
                                  </div>
                                  <div>
                                    <InputLabel
                                      htmlFor={`edit_description_${mitupo.id}`}
                                      value="Description"
                                    />
                                    <TextInput
                                      id={`edit_description_${mitupo.id}`}
                                      type="text"
                                      value={editData.description}
                                      className="mt-1 block w-full"
                                      onChange={(e) =>
                                        setEditData(
                                          "description",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <InputError
                                      message={editErrors.description}
                                      className="mt-2"
                                    />
                                  </div>
                                  <div className="flex items-end space-x-2">
                                    <button
                                      type="submit"
                                      className="bg-blue-500 px-4 py-2 text-white rounded shadow transition-all hover:bg-blue-600 text-sm"
                                    >
                                      Update
                                    </button>
                                    <button
                                      type="button"
                                      onClick={cancelEditing}
                                      className="bg-gray-100 px-4 py-2 text-gray-800 rounded shadow transition-all hover:bg-gray-200 text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </form>
                            </td>
                          ) : (
                            // Display Mode Row
                            <>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                  {mitupo.name}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 dark:text-gray-100">
                                  {mitupo.description || (
                                    <span className="text-gray-400 dark:text-gray-500 italic">
                                      No description
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {new Date(
                                    mitupo.created_at
                                  ).toLocaleDateString()}
                                </div>
                              </td>
                              {isAdmin && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex space-x-3">
                                    <button
                                      onClick={() => startEditing(mitupo)}
                                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                    >
                                      Edit
                                    </button>
                                    <Link
                                      href={route("mitupos.destroy", mitupo.id)}
                                      method="delete"
                                      as="button"
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                      onClick={(e) => {
                                        if (
                                          !confirm(
                                            "Are you sure you want to delete this mutupo?"
                                          )
                                        ) {
                                          e.preventDefault();
                                        }
                                      }}
                                    >
                                      Delete
                                    </Link>
                                  </div>
                                </td>
                              )}
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {mitupos.length > 0 && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-800 dark:text-blue-300 font-semibold">
                    Showing {filteredAndSortedMitupos.length} of{" "}
                    {mitupos.length} mitupo
                    {searchTerm && ` matching "${searchTerm}"`}
                  </p>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
