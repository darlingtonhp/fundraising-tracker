import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Edit({ auth, project }) {
  const { data, setData, put, errors, processing } = useForm({
    name: project.name || "",
    description: project.description || "",
    project_cost: project.project_cost || 0,
    revenue: project.revenue || 0,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    put(route("projects.update", project.id));
  };

  // Calculate profit
  const profit = (parseFloat(data.revenue) || 0) - (parseFloat(data.project_cost) || 0);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Edit Project - {project.name}
          </h2>
        </div>
      }
    >
      <Head title="Edit Project" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              {/* Project Name */}
              <div className="mt-4">
                <InputLabel htmlFor="name" value="Project Name *" />
                <TextInput
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Enter project name"
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* Project Description */}
              <div className="mt-4">
                <InputLabel htmlFor="description" value="Description" />
                <TextArea
                  id="description"
                  name="description"
                  value={data.description}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("description", e.target.value)}
                  placeholder="Enter project description (optional)"
                  rows={3}
                />
                <InputError message={errors.description} className="mt-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Project Cost */}
                <div>
                  <InputLabel htmlFor="project_cost" value="Project Cost ($) *" />
                  <TextInput
                    id="project_cost"
                    type="number"
                    name="project_cost"
                    value={data.project_cost}
                    className="mt-1 block w-full"
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      setData("project_cost", parseFloat(e.target.value) || 0)
                    }
                    placeholder="0.00"
                  />
                  <InputError message={errors.project_cost} className="mt-2" />
                </div>

                {/* Revenue */}
                <div>
                  <InputLabel htmlFor="revenue" value="Revenue ($) *" />
                  <TextInput
                    id="revenue"
                    type="number"
                    name="revenue"
                    value={data.revenue}
                    className="mt-1 block w-full"
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      setData("revenue", parseFloat(e.target.value) || 0)
                    }
                    placeholder="0.00"
                  />
                  <InputError message={errors.revenue} className="mt-2" />
                </div>
              </div>

              {/* Current Values Display */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  Current Project Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Project Cost:
                    </span>
                    <div className="font-medium text-red-600 dark:text-red-400">
                      ${parseFloat(project.project_cost).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Revenue:
                    </span>
                    <div className="font-medium text-green-600 dark:text-green-400">
                      ${parseFloat(project.revenue).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Profit:
                    </span>
                    <div className={`font-medium ${
                      parseFloat(project.profit) >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      ${parseFloat(project.profit).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Added by:
                    </span>
                    <div className="font-medium">
                      {project.user.name}
                    </div>
                  </div>
                </div>
              </div>

              {/* Updated Profit Calculation */}
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-green-800 dark:text-green-300">
                    Updated Profit Calculation:
                  </span>
                  <span className={`text-2xl font-bold ${
                    profit >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    ${profit.toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Breakdown: Revenue (${(parseFloat(data.revenue) || 0).toFixed(2)}) - Cost (${(parseFloat(data.project_cost) || 0).toFixed(2)})
                </div>
                {profit < 0 && (
                  <div className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                    This project will operate at a loss after update.
                  </div>
                )}
                {profit >= 0 && profit < parseFloat(project.profit) && (
                  <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                    Profit will decrease after update.
                  </div>
                )}
                {profit > parseFloat(project.profit) && (
                  <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                    Profit will increase after update!
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 text-right">
                <Link
                  href={route("projects.index")}
                  className="bg-gray-100 px-4 py-2 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2 text-sm h-10 inline-flex items-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-emerald-500 px-4 py-2 text-white shadow transition-all hover:bg-emerald-600 text-sm h-10 inline-flex items-center disabled:opacity-50"
                >
                  {processing ? "Updating..." : "Update Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}