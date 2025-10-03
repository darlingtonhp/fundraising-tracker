import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function Create({ auth }) {
    const { data, setData, post, errors, reset } = useForm({
        name: "",
        description: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("mitupos.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Add New Mutupo
                    </h2>
                </div>
            }
        >
            <Head title="Add Mutupo" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                        >
                            <div className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <InputLabel htmlFor="name" value="Mutupo Name *" />
                                    <TextInput
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData("name", e.target.value)}
                                        placeholder="Enter mutupo name (e.g., Shava, Mhofu, Moyo)"
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        This name must be unique.
                                    </p>
                                </div>

                                {/* Description Field */}
                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={data.description}
                                        rows={4}
                                        className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        onChange={(e) => setData("description", e.target.value)}
                                        placeholder="Enter description about this mutupo/totem (optional)"
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                {/* Example Mutupo */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                                        Example Mutupo Names:
                                    </h4>
                                    <ul className="text-sm text-blue-700 dark:text-blue-400 list-disc list-inside space-y-1">
                                        <li>Shava (Eland Totem)</li>
                                        <li>Mhofu (Eland Totem)</li>
                                        <li>Moyo (Heart Totem)</li>
                                        <li>Shumba (Lion Totem)</li>
                                        <li>Ngwena (Crocodile Totem)</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 text-right">
                                <Link
                                    href={route("mitupos.index")}
                                    className="bg-gray-100 px-4 py-2 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2 text-sm h-10 inline-flex items-center"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className="bg-emerald-500 px-4 py-2 text-white shadow transition-all hover:bg-emerald-600 text-sm h-10 inline-flex items-center"
                                >
                                    Create Mutupo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}