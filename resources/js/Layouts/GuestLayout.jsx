import { Link } from '@inertiajs/react';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="mb-8">
                <Link href="/">
                    <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-lg">
                        {/* Logo - using the same design as authenticated layout */}
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <div>
                            <div className="text-xl font-bold text-gray-800 dark:text-gray-200 leading-tight">
                                Streamview UMC
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 -mt-1">
                                Chikanga East
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="w-full sm:max-w-md px-6 py-8 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700">
                {children}
            </div>

            {/* System Info */}
            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Building Fundraising System
                </p>
            </div>
        </div>
    );
}