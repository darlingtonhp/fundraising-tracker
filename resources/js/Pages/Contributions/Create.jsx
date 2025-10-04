import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create({ auth, mitupos, contributorTypes }) {
  const { data, setData, post, errors, reset } = useForm({
    contributor_name: "",
    mutupo_id: "",
    contributor_type_id: "",
    no_of_tshirts: 0,
    no_of_cement_bags: 0,
    cement_amount: 0,
    use_discounted_tshirt: false, // New field for checkbox
  });

  const onSubmit = (e) => {
    e.preventDefault();
    post(route("contributions.store"));
  };

  // Calculate T-shirt price based on checkbox
  const tshirtPrice = data.use_discounted_tshirt ? 5 : 7;
  const tshirtAmount = data.no_of_tshirts * tshirtPrice;
  const totalAmount = tshirtAmount + (parseFloat(data.cement_amount) || 0);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Add New Contribution
          </h2>
        </div>
      }
    >
      <Head title="Add Contribution" />
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
                {/* Mutupo Selection */}
                <div>
                  <InputLabel htmlFor="mutupo_id" value="Mutupo/Totem *" />
                  <select
                    id="mutupo_id"
                    name="mutupo_id"
                    value={data.mutupo_id}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    onChange={(e) => setData("mutupo_id", e.target.value)}
                  >
                    <option value="">Select Mutupo</option>
                    {mitupos.map((mitupo) => (
                      <option key={mitupo.id} value={mitupo.id}>
                        {mitupo.name}
                      </option>
                    ))}
                  </select>
                  <InputError message={errors.mutupo_id} className="mt-2" />
                </div>

                {/* Contributor Type */}
                <div>
                  <InputLabel
                    htmlFor="contributor_type_id"
                    value="Contributor Type *"
                  />
                  <select
                    id="contributor_type_id"
                    name="contributor_type_id"
                    value={data.contributor_type_id}
                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                    onChange={(e) =>
                      setData("contributor_type_id", e.target.value)
                    }
                  >
                    <option value="">Select Type</option>
                    {contributorTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <InputError
                    message={errors.contributor_type_id}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* T-Shirts */}
                <div>
                  <InputLabel
                    htmlFor="no_of_tshirts"
                    value="Number of T-Shirts *"
                  />
                  <TextInput
                    id="no_of_tshirts"
                    type="number"
                    name="no_of_tshirts"
                    value={data.no_of_tshirts}
                    className="mt-1 block w-full"
                    min="0"
                    onChange={(e) =>
                      setData("no_of_tshirts", parseInt(e.target.value) || 0)
                    }
                  />

                  {/* Checkbox for discounted T-shirt */}
                  <div className="mt-2 flex items-center">
                    <input
                      id="use_discounted_tshirt"
                      type="checkbox"
                      checked={data.use_discounted_tshirt}
                      onChange={(e) =>
                        setData("use_discounted_tshirt", e.target.checked)
                      }
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="use_discounted_tshirt"
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      Use $5 T-Shirt price
                    </label>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Price per T-Shirt: ${tshirtPrice}
                  </div>
                  {data.no_of_tshirts > 0 && (
                    <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                      T-Shirt Amount: ${tshirtAmount.toFixed(2)}
                    </div>
                  )}
                  <InputError message={errors.no_of_tshirts} className="mt-2" />
                  <InputError
                    message={errors.use_discounted_tshirt}
                    className="mt-2"
                  />
                </div>

                {/* Cement Bags */}
                <div>
                  <InputLabel
                    htmlFor="no_of_cement_bags"
                    value="Number of Cement Bags *"
                  />
                  <TextInput
                    id="no_of_cement_bags"
                    type="number"
                    name="no_of_cement_bags"
                    value={data.no_of_cement_bags}
                    className="mt-1 block w-full"
                    min="0"
                    onChange={(e) =>
                      setData(
                        "no_of_cement_bags",
                        parseInt(e.target.value) || 0
                      )
                    }
                  />
                  <InputError
                    message={errors.no_of_cement_bags}
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

              {/* Total Calculation */}
              {(data.no_of_tshirts > 0 || data.cement_amount > 0) && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Total Contribution:
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Breakdown: T-Shirts (${tshirtAmount.toFixed(2)}) + Cement ($
                    {(parseFloat(data.cement_amount) || 0).toFixed(2)})
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 text-right">
                <Link
                  href={route("contributions.index")}
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
