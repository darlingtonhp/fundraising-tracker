import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";

export default function Edit({
  auth,
  contribution,
  mitupos,
  contributorTypes,
}) {
  const { data, setData, put, errors, processing } = useForm({
    contributor_name: contribution.contributor_name || "",
    mutupo_id: contribution.mutupo_id || "",
    contributor_type_id: contribution.contributor_type_id || "",
    no_of_tshirts: contribution.no_of_tshirts || 0,
    no_of_cement_bags: contribution.no_of_cement_bags || 0,
    cement_amount: contribution.cement_amount || 0,
    use_discounted_tshirt: contribution.use_discounted_tshirt || false,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    put(route("contributions.update", contribution.id));
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
            Edit Contribution - {contribution.contributor_name}
          </h2>
        </div>
      }
    >
      <Head title="Edit Contribution" />
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

              {/* Current Values Display */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  Current Contribution Details
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      T-Shirts:
                    </span>
                    <div className="font-medium">
                      {contribution.no_of_tshirts} pcs
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      T-Shirt Amount:
                    </span>
                    <div className="font-medium">
                      ${parseFloat(contribution.tshirt_amount).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">
                      Cement Bags:
                    </span>
                    <div className="font-medium">
                      {contribution.no_of_cement_bags} bags
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
              {(data.no_of_tshirts > 0 || data.cement_amount > 0) && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-green-800 dark:text-green-300">
                      Updated Total Contribution:
                    </span>
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-green-700 dark:text-green-300 mt-2">
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
