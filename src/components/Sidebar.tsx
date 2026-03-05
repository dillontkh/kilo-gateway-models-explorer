import React from 'react';
import { getModalityConfig } from '../utils/modalityConfig';

interface SidebarProps {
    visibleProviders: string[];
    selectedProviders: Set<string>;
    toggleProvider: (p: string) => void;
    providerSearch: string;
    setProviderSearch: (s: string) => void;

    allModalities: string[];
    selectedModalities: Set<string>;
    toggleModality: (m: string) => void;

    contextRange: string;
    setContextRange: (r: string) => void;

    pricing: { inMin: string, inMax: string, outMin: string, outMax: string };
    setPricing: (p: any) => void;

    freeOnly: boolean;
    setFreeOnly: (f: boolean) => void;

    isSidebarOpen: boolean;
    setIsSidebarOpen: (o: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
    visibleProviders, selectedProviders, toggleProvider, providerSearch, setProviderSearch,
    allModalities, selectedModalities, toggleModality,
    contextRange, setContextRange,
    pricing, setPricing,
    freeOnly, setFreeOnly,
    isSidebarOpen, setIsSidebarOpen
}) => {
    return (
        <aside className={`w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 overflow-y-auto bg-white/95 dark:bg-slate-900/95 custom-scrollbar backdrop-blur-xl md:backdrop-blur-none fixed inset-y-0 left-0 md:relative md:inset-auto z-50 h-screen md:h-full transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0 shadow-2xl md:shadow-none' : '-translate-x-full md:translate-x-0'} md:block`}>
            <div className="p-4 md:p-6 space-y-8 pb-32">
                <div className="md:hidden flex justify-end">
                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 -mr-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                {/* Providers */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Providers</h3>
                        {selectedProviders.size > 0 && (
                            <button onClick={() => {
                                const newSet = new Set(selectedProviders);
                                newSet.clear();
                                /* This requires clear support in parent, let's just use empty set */
                            }} className="text-xs text-primary hover:underline">Clear</button>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Filter providers..."
                        className="w-full px-3 py-1.5 mb-3 text-sm border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50 focus:ring-1 focus:ring-primary focus:border-primary text-slate-900 dark:text-slate-100"
                        value={providerSearch}
                        onChange={e => setProviderSearch(e.target.value)}
                    />
                    <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {visibleProviders.filter(p => p.toLowerCase().includes(providerSearch.toLowerCase())).map(prov => (
                            <label key={prov} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={selectedProviders.has(prov)}
                                    onChange={() => toggleProvider(prov)}
                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-primary focus:ring-offset-0 bg-white dark:bg-slate-800"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{prov}</span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Modalities */}
                {allModalities.length > 0 && (
                    <section>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Modalities</h3>
                        <div className="flex flex-wrap gap-2">
                            {allModalities.map(mod => {
                                const sel = selectedModalities.has(mod);
                                const cfg = getModalityConfig(mod);
                                return (
                                    <button
                                        key={mod}
                                        onClick={() => toggleModality(mod)}
                                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium flex items-center gap-1.5 transition-all capitalize ${sel
                                                ? cfg.selectedClasses
                                                : `border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:${cfg.selectedClasses}`
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-sm">{cfg.icon}</span> {mod}
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Context Window */}
                <section>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Context Window</h3>
                    <div className="space-y-3">
                        {['all', '<32k', '32k-128k', '128k-256k', '>256k'].map(range => (
                            <label key={range} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="context"
                                    value={range}
                                    checked={contextRange === range}
                                    onChange={e => setContextRange(e.target.value)}
                                    className="w-4 h-4 border-slate-300 dark:border-slate-600 text-primary focus:ring-primary bg-white dark:bg-slate-800"
                                />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors capitalize">
                                    {range.replace(/</g, 'Less than ').replace(/>/g, 'Greater than ')}
                                </span>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Pricing */}
                <section className="border-t border-slate-200 dark:border-slate-800 pt-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Pricing (1M Tokens)</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Input Price</label>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Min" value={pricing.inMin} onChange={e => setPricing({ ...pricing, inMin: e.target.value })} className="w-full px-2 py-1.5 text-sm bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary outline-none" />
                                <input type="number" placeholder="Max" value={pricing.inMax} onChange={e => setPricing({ ...pricing, inMax: e.target.value })} className="w-full px-2 py-1.5 text-sm bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 block">Output Price</label>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Min" value={pricing.outMin} onChange={e => setPricing({ ...pricing, outMin: e.target.value })} className="w-full px-2 py-1.5 text-sm bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary outline-none" />
                                <input type="number" placeholder="Max" value={pricing.outMax} onChange={e => setPricing({ ...pricing, outMax: e.target.value })} className="w-full px-2 py-1.5 text-sm bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-primary outline-none" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Free Only</span>
                            <button
                                type="button"
                                onClick={() => setFreeOnly(!freeOnly)}
                                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${freeOnly ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                            >
                                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${freeOnly ? 'translate-x-4' : 'translate-x-0'}`}></span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </aside>
    );
};
