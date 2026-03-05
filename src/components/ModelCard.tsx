import React from 'react';
import { getModalityConfig } from '../utils/modalityConfig';

const formatContextWindow = (ctx: any) => {
    if (!ctx) return "N/A";
    const num = parseInt(ctx, 10);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return Math.round(num / 1000) + "k";
    return num.toString();
};

interface ModelCardProps {
    model: any;
    expandedId: string | null;
    setExpandedId: (id: string | null) => void;
    handleCopy: (e: React.MouseEvent, text: string, id: string) => void;
    copiedId: string | null;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, expandedId, setExpandedId, handleCopy, copiedId }) => {
    const isExpanded = expandedId === model.id;
    const hasMultipleProviders = model.providers && model.providers.length > 1;
    const [selectedProvider, setSelectedProvider] = React.useState(model.providers[0] || model.provider_name_from_group || "Kilo");

    React.useEffect(() => {
        if (model.providers && !model.providers.includes(selectedProvider)) {
            setSelectedProvider(model.providers[0]);
        }
    }, [model.providers, selectedProvider]);

    const activeModelData = model.providerData?.[selectedProvider] || model;
    const inPrice = parseFloat(activeModelData.pricing?.prompt || activeModelData.pricing?.input || 0);
    const outPrice = parseFloat(activeModelData.pricing?.completion || activeModelData.pricing?.output || 0);

    return (
        <div
            onClick={() => setExpandedId(isExpanded ? null : model.id)}
            className={`glass-panel rounded-xl overflow-hidden flex flex-col group cursor-pointer transition-all duration-200 ${isExpanded ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5'}`}
        >
            <div className="p-5 flex-1 relative">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {model.name || model.id}
                        </h3>
                        {hasMultipleProviders && isExpanded ? (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {model.providers.map((p: string) => (
                                    <button
                                        key={p}
                                        onClick={(e) => { e.stopPropagation(); setSelectedProvider(p); }}
                                        className={`text-[10px] font-bold px-2 py-1 rounded-full border ${selectedProvider === p ? 'border-primary bg-primary/10 text-primary' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{selectedProvider}</p>
                        )}
                    </div>
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">{model.architecture?.modalities?.includes('image') ? 'image' : 'bolt'}</span>
                    </div>
                </div>

                <div className="flex gap-2 mb-4 flex-wrap">
                    {inPrice === 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                            Free Input
                        </span>
                    )}
                    {(model.architecture?.modalities || []).map((mod: string) => {
                        const cfg = getModalityConfig(mod);
                        return (
                            <span key={mod} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold capitalize border ${cfg.classes}`}>
                                <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>{cfg.icon}</span>
                                {mod}
                            </span>
                        );
                    })}
                </div>
                <p className={`text-sm text-slate-600 dark:text-slate-400 ${isExpanded ? '' : 'line-clamp-3'}`}>
                    {model.description || "No description available."}
                </p>

                {isExpanded && (
                    <div className="mt-4 border-t border-slate-100 dark:border-slate-800/50 pt-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-slate-500">Raw API JSON</span>
                            <button
                                onClick={(e) => handleCopy(e, JSON.stringify(activeModelData, null, 2), model.id)}
                                className="text-xs flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded-md hover:bg-primary/20"
                            >
                                <span className="material-symbols-outlined text-[14px]">
                                    {copiedId === model.id ? 'check' : 'content_copy'}
                                </span>
                                {copiedId === model.id ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        <pre className="text-[10px] font-mono p-3 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-x-auto custom-scrollbar text-slate-800 dark:text-slate-300 max-h-60">
                            {JSON.stringify(activeModelData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-100 dark:border-slate-800/50">
                <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-200 dark:divide-slate-700">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">Context</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{formatContextWindow(activeModelData.context_length || model.context_length)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">In / 1M</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">${inPrice.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">Out / 1M</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">${outPrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
