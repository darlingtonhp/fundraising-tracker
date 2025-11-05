// resources/js/Pages/Projects/Index.jsx
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState, useMemo } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export default function Index({ auth, projects, permissions }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { canEdit, canDelete, canCreate, canExport } = permissions;

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  // Calculate totals
  const totalProjects = projects.length;
  const totalCost = projects.reduce((sum, project) => {
    return sum + parseFloat(project.project_cost);
  }, 0);
  const totalRevenue = projects.reduce((sum, project) => {
    return sum + parseFloat(project.revenue);
  }, 0);
  const totalProfit = projects.reduce((sum, project) => {
    return sum + parseFloat(project.profit);
  }, 0);

  const handleExport = () => {
    // General users cannot export, this will be handled by the backend
    window.location.href = route("projects.export");
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Projects
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
                href={route("projects.create")}
                className="bg-emerald-500 px-3 py-2 text-white rounded shadow transition-all hover:bg-emerald-600 text-sm font-medium"
              >
                Add New Project
              </Link>
            )}
          </div>
        </div>
      }
    >
      <Head title="Projects" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Search Controls */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputLabel htmlFor="search" value="Search Projects" />
                  <TextInput
                    id="search"
                    type="text"
                    value={searchTerm}
                    className="mt-1 block w-full"
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by project name or description..."
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📊</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Projects
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {totalProjects}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">💰</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Cost
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${totalCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">📈</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">💵</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Profit
                  </p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    ${totalProfit.toFixed(2)}
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
                      As a <strong>General User</strong>, you can view all
                      projects but cannot create, edit, delete, or export
                      records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Projects Table */}
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">
                    🏗️
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    {projects.length === 0
                      ? "No projects found."
                      : "No projects match your search criteria."}
                  </p>
                  {projects.length === 0 && canCreate ? (
                    <Link
                      href={route("projects.create")}
                      className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
                    >
                      Add Your First Project
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
                          Project Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Profit
                        </th>
                        {(canEdit || canDelete) && (
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredProjects.map((project) => (
                        <tr
                          key={project.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {project.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              Added by: {project.user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                              {project.description || "No description"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-red-600 dark:text-red-400">
                              ${parseFloat(project.project_cost).toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-green-600 dark:text-green-400">
                              ${parseFloat(project.revenue).toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`text-sm font-semibold ${
                                parseFloat(project.profit) >= 0
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              ${parseFloat(project.profit).toFixed(2)}
                            </div>
                          </td>
                          {(canEdit || canDelete) && (
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-3">
                                {canEdit && (
                                  <Link
                                    href={route("projects.edit", project.id)}
                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                                  >
                                    Edit
                                  </Link>
                                )}
                                {canDelete && (
                                  <Link
                                    href={route("projects.destroy", project.id)}
                                    method="delete"
                                    as="button"
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                    onClick={(e) => {
                                      if (
                                        !confirm(
                                          "Are you sure you want to delete this project?"
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
