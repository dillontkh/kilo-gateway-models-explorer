import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ModelCard } from './components/ModelCard';

const MOCK_MODELS = [
    { id: "kilo-auto-v1", name: "Kilo Auto router", description: "Automatically routes requests to the most efficient model based on prompt complexity.", provider_name_from_group: "Kilo AI", context_length: 128000, pricing: { prompt: "0.50", completion: "1.50" }, architecture: { modalities: ["text", "image"] } },
    { id: "minimax-v2", name: "MiniMax Pro", description: "A high efficiency model perfect for rapid, short-context interactions.", provider_name_from_group: "MiniMax", context_length: 32000, pricing: { prompt: "0", completion: "0.20" }, architecture: { modalities: ["text"] } },
    { id: "giga-potato-max", name: "Giga Potato Ultimate", description: "Massive context window suitable for entire document analysis.", provider_name_from_group: "Giga Potato", context_length: 1000000, pricing: { prompt: "5.00", completion: "15.00" }, architecture: { modalities: ["text", "audio"] } },
];

const App = () => {
    const [models, setModels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [fallbackStatus, setFallbackStatus] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    // Filters
    const [globalSearch, setGlobalSearch] = useState('');
    const [providerSearch, setProviderSearch] = useState('');
    const [selectedProviders, setSelectedProviders] = useState<Set<string>>(new Set());
    const [selectedModalities, setSelectedModalities] = useState<Set<string>>(new Set());
    const [contextRange, setContextRange] = useState('all');
    const [pricing, setPricing] = useState({ inMin: '', inMax: '', outMin: '', outMax: '' });
    const [freeOnly, setFreeOnly] = useState(false);
    const [sortOption, setSortOption] = useState('name-asc');

    // UI State
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const res = await fetch('https://api.codetabs.com/v1/proxy/?quest=https://api.kilo.ai/api/gateway/models');
                if (!res.ok) throw new Error('API request failed');
                const data = await res.json();

                let flatData: any[] = [];
                const extractPricing = (raw: any) => {
                    const promptVal = parseFloat(raw?.prompt || raw?.input || 0);
                    const completionVal = parseFloat(raw?.completion || raw?.output || 0);
                    const needsConversion = (promptVal > 0 && promptVal < 0.01) || (completionVal > 0 && completionVal < 0.01);
                    const multiplier = needsConversion ? 1000000 : 1;
                    return { prompt: String(promptVal * multiplier), completion: String(completionVal * multiplier) };
                };

                if (data.providers && Array.isArray(data.providers)) {
                    const modelMap = new Map();
                    data.providers.forEach((p: any) => {
                        (p.models || []).forEach((m: any) => {
                            const uid = m.slug || m.name || m.id;
                            const enrichedModel = { ...m, pricing: extractPricing(m.endpoint?.pricing || m.pricing) };
                            if (!modelMap.has(uid)) {
                                modelMap.set(uid, { ...enrichedModel, id: uid, providerData: { [p.name]: enrichedModel }, providers: [p.name] });
                            } else {
                                const existing = modelMap.get(uid);
                                existing.providerData[p.name] = enrichedModel;
                                if (!existing.providers.includes(p.name)) {
                                    existing.providers.push(p.name);
                                    existing.providers.sort();
                                }
                            }
                        });
                    });
                    flatData = Array.from(modelMap.values());
                }

                if (flatData.length > 0) {
                    setModels(flatData);
                } else {
                    throw new Error("No array found");
                }
            } catch (err) {
                console.error("Fetch failed, using mock data", err);
                setModels(MOCK_MODELS.map((m: any) => {
                    const uid = m.slug || m.name || m.id;
                    return { ...m, id: uid, providerData: { [m.provider_name_from_group]: m }, providers: [m.provider_name_from_group] };
                }));
                setFallbackStatus(true);
            } finally {
                setLoading(false);
            }
        };
        fetchModels();
    }, []);

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    }, [darkMode]);

    // Derived state (Filters & Sorting logic equivalent to previous)
    const searchFilteredModels = useMemo(() => {
        let result = models;
        if (globalSearch) {
            const q = globalSearch.toLowerCase();
            result = result.filter(m =>
                (m.name || '').toLowerCase().includes(q) ||
                (m.id || '').toLowerCase().includes(q) ||
                (m.description || '').toLowerCase().includes(q) ||
                (m.providers || []).join(' ').toLowerCase().includes(q)
            );
        }
        if (selectedModalities.size > 0) {
            result = result.filter(m => {
                const mMods = (m.architecture?.modalities || []).map((x: string) => x.toLowerCase());
                return Array.from(selectedModalities).every(mod => mMods.includes(mod));
            });
        }
        if (contextRange !== 'all') {
            result = result.filter(m => {
                return m.providers.some((p: string) => {
                    const pm = m.providerData?.[p] || m;
                    const ctx = parseInt(pm.context_length || 0, 10);
                    if (contextRange === '<32k') return ctx < 32000;
                    if (contextRange === '32k-128k') return ctx >= 32000 && ctx <= 128000;
                    if (contextRange === '128k-256k') return ctx > 128000 && ctx <= 256000;
                    if (contextRange === '>256k') return ctx > 256000;
                    return true;
                });
            });
        }
        return result;
    }, [models, globalSearch, selectedModalities, contextRange]);

    const visibleProviders = useMemo(() => {
        const p = new Set(searchFilteredModels.flatMap(m => m.providers || [m.provider_name_from_group || m.provider || 'Unknown']));
        return Array.from(p).sort() as string[];
    }, [searchFilteredModels]);

    const allModalities = useMemo(() => {
        const m = new Set<string>();
        models.forEach(model => {
            if (model.architecture?.modalities) {
                model.architecture.modalities.forEach((mod: string) => m.add(mod.toLowerCase()));
            }
        });
        return Array.from(m).sort();
    }, [models]);

    const filteredAndSortedModels = useMemo(() => {
        let result = searchFilteredModels;

        if (selectedProviders.size > 0) {
            result = result.filter(m => {
                const mProvs = m.providers || [m.provider_name_from_group || m.provider || 'Unknown'];
                return mProvs.some((p: string) => selectedProviders.has(p));
            });
        }

        result = result.filter(m => {
            const providerPrices = m.providers.map((p: string) => {
                const pm = m.providerData?.[p] || m;
                return {
                    in: parseFloat(pm.pricing?.prompt || pm.pricing?.input || 0),
                    out: parseFloat(pm.pricing?.completion || pm.pricing?.output || 0)
                };
            });

            return providerPrices.some((prices: any) => {
                if (freeOnly && (prices.in !== 0 || prices.out !== 0)) return false;
                if (pricing.inMin && prices.in < parseFloat(pricing.inMin)) return false;
                if (pricing.inMax && prices.in > parseFloat(pricing.inMax)) return false;
                if (pricing.outMin && prices.out < parseFloat(pricing.outMin)) return false;
                if (pricing.outMax && prices.out > parseFloat(pricing.outMax)) return false;
                return true;
            });
        });

        result.sort((a, b) => {
            const nameA = a.name || ''; const nameB = b.name || '';
            switch (sortOption) {
                case 'name-asc': return nameA.localeCompare(nameB);
                case 'name-desc': return nameB.localeCompare(nameA);
                default: return 0; // Simplified
            }
        });

        return result;
    }, [searchFilteredModels, selectedProviders, pricing, freeOnly, sortOption]);

    const toggleProvider = (p: string) => {
        const next = new Set(selectedProviders);
        next.has(p) ? next.delete(p) : next.add(p);
        setSelectedProviders(next);
    };

    const toggleModality = (m: string) => {
        const next = new Set(selectedModalities);
        next.has(m) ? next.delete(m) : next.add(m);
        setSelectedModalities(next);
    };

    const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
        e.stopPropagation();
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) { }
        document.body.removeChild(textArea);
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Header globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} darkMode={darkMode} setDarkMode={setDarkMode} />

            {fallbackStatus && (
                <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-4 py-2 text-sm flex items-center gap-2 justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-sm">warning</span>
                    <span>API unavailable, showing fallback data.</span>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    visibleProviders={visibleProviders} selectedProviders={selectedProviders} toggleProvider={toggleProvider}
                    providerSearch={providerSearch} setProviderSearch={setProviderSearch}
                    allModalities={allModalities} selectedModalities={selectedModalities} toggleModality={toggleModality}
                    contextRange={contextRange} setContextRange={setContextRange}
                    pricing={pricing} setPricing={setPricing}
                    freeOnly={freeOnly} setFreeOnly={setFreeOnly}
                />

                <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar relative">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">API Models</h2>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Showing {filteredAndSortedModels.length} results</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Sort by:</span>
                                    <select
                                        value={sortOption} onChange={e => setSortOption(e.target.value)}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white cursor-pointer"
                                    >
                                        <option value="name-asc">Name (A-Z)</option>
                                        <option value="name-desc">Name (Z-A)</option>
                                    </select>
                                </div>
                            </div>

                            {filteredAndSortedModels.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center justify-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800/50 text-slate-400 mb-4">
                                        <span className="material-symbols-outlined text-3xl">search_off</span>
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">No models found</h3>
                                    <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search query.</p>
                                    {(globalSearch || selectedProviders.size > 0 || selectedModalities.size > 0 || contextRange !== 'all') && (
                                        <button
                                            onClick={() => { setGlobalSearch(''); setSelectedProviders(new Set()); setSelectedModalities(new Set()); setContextRange('all'); setFreeOnly(false); setPricing({ inMin: '', inMax: '', outMin: '', outMax: '' }) }}
                                            className="mt-4 text-primary hover:underline font-medium"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12 items-start">
                                    {filteredAndSortedModels.map(model => (
                                        <ModelCard
                                            key={model.id} model={model}
                                            expandedId={expandedId} setExpandedId={setExpandedId}
                                            handleCopy={handleCopy} copiedId={copiedId}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;
