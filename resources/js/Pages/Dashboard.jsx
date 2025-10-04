import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Dashboard({ auth, stats, recentContributions, contributionsByMutupo, userRole, canViewAll }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Role Information Banner for General Users */}
                    {userRole === 'general' && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                        View Only Access
                                    </h3>
                                    <div className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                                        <p>
                                            As a <strong>General User</strong>, you can view all dashboard data but cannot modify any records.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Recent Contributions
                                    </h3>
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
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {canViewAll ? "No contributions yet." : "You haven't made any contributions yet."}
                                        </p>
                                        {userRole !== 'general' && (
                                            <Link
                                                href={route("contributions.create")}
                                                className="inline-block mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Add your first contribution
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contributions by Mutupo */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                        Contributions by Mutupo
                                    </h3>
                                    {userRole === 'admin' && (
                                        <Link
                                            href={route("mitupos.index")}
                                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Manage Mutupo
                                        </Link>
                                    )}
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
                                                        {mutupo.total_contributors} contributor{mutupo.total_contributors !== 1 ? 's' : ''}
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
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {canViewAll ? "No contributions by mutupo yet." : "No contributions in your mutupos yet."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions - Only show for users who can create */}
                    {userRole !== 'general' && (
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
                                    {userRole === 'admin' && (
                                        <Link
                                            href={route("mitupos.index")}
                                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                        >
                                            Manage Mutupo
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View Only Message for General Users */}
                    {userRole === 'general' && (
                        <div className="mt-8 bg-gray-50 dark:bg-gray-700 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    View Only Mode
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    As a general user, you can view all contributions but cannot create, edit, or delete records.
                                </p>
                                <Link
                                    href={route("contributions.index")}
                                    className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                >
                                    Browse All Contributions
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}