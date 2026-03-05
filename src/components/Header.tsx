import React from 'react';

interface HeaderProps {
    globalSearch: string;
    setGlobalSearch: (s: string) => void;
    darkMode: boolean;
    handleThemeToggle: () => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (o: boolean) => void;
    freeOnly: boolean;
    setFreeOnly: (f: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ globalSearch, setGlobalSearch, darkMode, handleThemeToggle, isSidebarOpen, setIsSidebarOpen, freeOnly, setFreeOnly }) => {
    return (
        <header className="glass-panel sticky top-0 z-40 px-4 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between border-b gap-3 md:gap-0 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-1.5 md:hidden text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors flex-shrink-0"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
                        <span className="material-symbols-outlined text-xl">auto_awesome</span>
                    </div>
                    <h1 className="text-lg md:text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden lg:block whitespace-nowrap">Kilo Models</h1>
                </div>

                <div className="flex items-center gap-1 ml-auto sm:hidden">
                    <button
                        onClick={() => setFreeOnly(!freeOnly)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors focus:outline-none ${freeOnly
                                ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                    >
                        <span className="material-symbols-outlined text-sm">sell</span>
                        Free
                    </button>
                    <button
                        onClick={handleThemeToggle}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                    >
                        <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center w-full sm:w-auto flex-1 max-w-2xl px-0 sm:px-6">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg leading-5 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-colors"
                        placeholder="Search models..."
                        value={globalSearch}
                        onChange={(e) => setGlobalSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="hidden sm:flex items-center gap-3">
                <button
                    onClick={() => setFreeOnly(!freeOnly)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors focus:outline-none ${freeOnly
                            ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                >
                    <span className="material-symbols-outlined text-base">sell</span>
                    Free only
                </button>
                <button
                    onClick={handleThemeToggle}
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                >
                    <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
                </button>
            </div>
        </header>
    );
};
