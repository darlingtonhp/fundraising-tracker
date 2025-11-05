import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create({ auth }) {
  const { data, setData, post, errors, reset } = useForm({
    contributor_name: "",
    cement_bags: 0,
    cement_amount: 0,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("fund-day-contributions.store"));
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Add Fund Day Contribution
          </h2>
        </div>
      }
    >
      <Head title="Add Fund Day Contribution" />
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
                  <InputError message={errors.cement_bags} className="mt-2" />
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

              {/* Total Calculation */}
              {data.cement_amount > 0 && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Total Contribution:
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${(parseFloat(data.cement_amount) || 0).toFixed(2)}
                    </span>
                  </div>
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
                  className="bg-emerald-500 px-4 py-2 text-white shadow transition-all hover:bg-emerald-600 text-sm h-10 inline-flex items-center"
                >
                  Save Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
