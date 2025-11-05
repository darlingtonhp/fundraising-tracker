import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Edit({ auth, contribution }) {
  const { data, setData, put, errors, processing } = useForm({
    contributor_name: contribution.contributor_name || "",
    cement_bags: contribution.cement_bags || 0,
    cement_amount: contribution.cement_amount || 0,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    put(route("fund-day-contributions.update", contribution.id));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Edit Fund Day Contribution - {contribution.contributor_name}
          </h2>
        </div>
      }
    >
      <Head title="Edit Fund Day Contribution" />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <form
              onSubmit={onSubmit}
              className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
            >
              {/* Contributor Name */}
              <div className="mt-4">
                <InputLabel
                  htmlFor="contributor_name"
                  value="Contributor Name *"
                />
                <TextInput
                  id="contributor_name"
                  type="text"
                  name="contributor_name"
                  value={data.contributor_name}
                  className="mt-1 block w-full"
                  isFocused={true}
                  onChange={(e) => setData("contributor_name", e.target.value)}
                  placeholder="Enter contributor's full name"
                />
                <InputError
                  message={errors.contributor_name}
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {/* Cement Bags */}
                <div>
                  <InputLabel
                    htmlFor="cement_bags"
                    value="Number of Cement Bags *"
                  />
                  <TextInput
                    id="cement_bags"
                    type="number"
                    name="cement_bags"
                    value={data.cement_bags}
                    className="mt-1 block w-full"
                    min="0"
                    onChange={(e) =>
                      setData("cement_bags", parseInt(e.target.value) || 0)
                    }
                  />
                  <InputError
                    message={errors.cement_bags}
                    className="mt-2"
                  />
                </div>

                {/* Cement Amount */}
                <div>
                  <InputLabel
                    htmlFor="cement_amount"
                    value="Cement Amount ($) *"
                  />
                  <TextInput
                    id="cement_amount"
                    type="number"
                    name="cement_amount"
                    value={data.cement_amount}
                    className="mt-1 block w-full"
                    min="0"
                    step="0.01"
                    onChange={(e) =>
                      setData("cement_amount", parseFloat(e.target.value) || 0)
                    }
                    placeholder="0.00"
                  />
                  <InputError message={errors.cement_amount} className="mt-2" />
                </div>
              </div>

              {/* Current Values Display */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  Current Contribution Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Cement Bags:
                    </span>
                    <div className="font-medium">
                      {contribution.cement_bags} bags
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Cement Amount:
                    </span>
                    <div className="font-medium">
                      ${parseFloat(contribution.cement_amount).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Added by:
                    </span>
                    <div className="font-medium">
                      {contribution.user.name}
                    </div>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">
                      Current Total:
                    </span>
                    <span className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      ${parseFloat(contribution.total_contributed).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Updated Total Calculation */}
              {(data.cement_bags > 0 || data.cement_amount > 0) && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-green-800 dark:text-green-300">
                      Updated Total Contribution:
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${(parseFloat(data.cement_amount) || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 mt-2">
                    Breakdown: {data.cement_bags} cement bags at ${(parseFloat(data.cement_amount) || 0).toFixed(2)}
                  </div>
                  {parseFloat(data.cement_amount) > parseFloat(contribution.cement_amount) && (
                    <div className="mt-2 text-sm text-green-600 dark:text-green-400 font-medium">
                      Contribution amount will increase after update!
                    </div>
                  )}
                  {parseFloat(data.cement_amount) < parseFloat(contribution.cement_amount) && (
                    <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                      Contribution amount will decrease after update.
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 text-right">
                <Link
                  href={route("fund-day-contributions.index")}
                  className="bg-gray-100 px-4 py-2 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2 text-sm h-10 inline-flex items-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-emerald-500 px-4 py-2 text-white shadow transition-all hover:bg-emerald-600 text-sm h-10 inline-flex items-center disabled:opacity-50"
                >
                  {processing ? "Updating..." : "Update Contribution"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}