import React from 'react';

interface HeaderProps {
    globalSearch: string;
    setGlobalSearch: (s: string) => void;
    darkMode: boolean;
    setDarkMode: (d: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ globalSearch, setGlobalSearch, darkMode, setDarkMode }) => {
    return (
        <header className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
            <div className="flex items-center gap-6 flex-1">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30">
                        <span className="material-symbols-outlined text-xl">auto_awesome</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">Kilo Gateway Models</h1>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex relative max-w-md w-full ml-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                        placeholder="Search models, providers, or features..."
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <nav className="hidden lg:flex items-center gap-6 mr-4">
                    <a className="text-sm font-medium text-primary dark:text-primary transition-colors cursor-pointer">Models</a>
                    <a className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Docs</a>
                </nav>
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                </button>
            </div>
        </header>
    );
};
