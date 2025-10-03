import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({ auth, stats, recentContributions, contributionsByMutupo }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">👤</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Contributors</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalContributors}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">💰</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Raised</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        ${stats.totalAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">👕</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">T-Shirts Sold</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalTshirts}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-lg font-bold">🏗️</span>
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cement Bags</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalCementBags}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Contributions */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Contributions</h3>
                                    <Link
                                        href={route("contributions.index")}
                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        View All
                                    </Link>
                                </div>
                                
                                {recentContributions.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentContributions.map((contribution) => (
                                            <div key={contribution.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {contribution.contributor_name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {contribution.mutupo.name} • {contribution.contributor_type.name}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-green-600 dark:text-green-400">
                                                        ${parseFloat(contribution.total_contributed).toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        {contribution.no_of_tshirts} shirts
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">No contributions yet.</p>
                                        <Link
                                            href={route("contributions.create")}
                                            className="inline-block mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Add your first contribution
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contributions by Mutupo */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Contributions by Mutupo</h3>
                                    <Link
                                        href={route("mitupos.index")}
                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Manage Mutupo
                                    </Link>
                                </div>
                                
                                {contributionsByMutupo.length > 0 ? (
                                    <div className="space-y-4">
                                        {contributionsByMutupo.map((mutupo) => (
                                            <div key={mutupo.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                                        {mutupo.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {mutupo.total_contributors} contributors
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-green-600 dark:text-green-400">
                                                        ${parseFloat(mutupo.total_amount || 0).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 dark:text-gray-400">No contributions by mutupo yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={route("contributions.create")}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Add New Contribution
                                </Link>
                                <Link
                                    href={route("contributions.index")}
                                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    View All Contributions
                                </Link>
                                <Link
                                    href={route("mitupos.index")}
                                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Manage Mutupo
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}