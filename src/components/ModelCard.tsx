import React from 'react';
import { getModalityConfig } from '../utils/modalityConfig';
import { motion } from 'framer-motion';

const formatContextWindow = (ctx: any) => {
    if (!ctx) return "N/A";
    const num = parseInt(ctx, 10);
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return Math.round(num / 1000) + "k";
    return num.toString();
};

interface ModelCardProps {
    model: any;
    isModal?: boolean;
    setExpandedId: (id: string | null) => void;
    handleCopy: (e: React.MouseEvent, text: string, id: string) => void;
    copiedId: string | null;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, isModal = false, setExpandedId, handleCopy, copiedId }) => {
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
        <motion.div
            layoutId={`card-${model.id}`}
            onClick={() => !isModal && setExpandedId(model.id)}
            className={`glass-panel rounded-xl overflow-hidden flex flex-col group cursor-pointer ${isModal ? 'w-full max-w-2xl max-h-[90vh] shadow-2xl z-50' : 'hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-200'}`}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
            <div className={`p-5 flex-1 relative ${isModal ? 'overflow-y-auto custom-scrollbar' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                    <div className="w-full">
                        <div className="flex justify-between items-center w-full">
                            <h3
                                layoutId={`title-${model.id}`}
                                className={`${isModal ? 'text-2xl' : 'text-lg'} font-bold text-slate-900 dark:text-white flex items-center gap-2`}
                            >
                                {model.name || model.id}
                            </h3>
                            {isModal && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            )}
                        </div>
                        <div
                            layoutId={`slug-${model.id}`}
                            onClick={(e) => handleCopy(e, model.id, `${model.id}-slug`)}
                            className="group/slug relative flex items-center gap-2 mt-2 cursor-pointer max-w-full"
                        >
                            <code className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/50 group-hover/slug:border-primary/50 group-hover/slug:text-primary dark:group-hover/slug:text-primary-light transition-all block truncate min-w-0">
                                {model.id}
                            </code>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined text-[14px] text-slate-400 group-hover/slug:text-primary transition-colors">
                                    {copiedId === `${model.id}-slug` ? 'check' : 'content_copy'}
                                </span>
                                {copiedId === `${model.id}-slug` && (
                                    <span className="absolute left-6 whitespace-nowrap bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg animate-in fade-in slide-in-from-left-1 duration-200">
                                        Copied!
                                    </span>
                                )}
                            </div>
                        </div>

                        {hasMultipleProviders && (isModal) && (
                            <div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-wrap gap-1.5 mt-3"
                            >
                                {model.providers.map((p: string) => (
                                    <button
                                        key={p}
                                        onClick={(e) => { e.stopPropagation(); setSelectedProvider(p); }}
                                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all ${selectedProvider === p ? 'border-primary bg-primary/10 text-primary shadow-sm shadow-primary/20' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-slate-300 dark:hover:border-slate-600'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div layoutId={`modalities-${model.id}`} className="flex gap-2 mb-4 flex-wrap">
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
                <p
                    layoutId={`description-${model.id}`}
                    className={`text-sm text-slate-600 dark:text-slate-400 ${isModal ? 'mb-6' : 'line-clamp-3'}`}
                >
                    {model.description || "No description available."}
                </p>

                {isModal && (
                    <div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 border-t border-slate-100 dark:border-slate-800/50 pt-4"
                        onClick={e => e.stopPropagation()}
                    >
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
                        <pre className="text-[10px] font-mono p-3 bg-slate-100 dark:bg-slate-900 rounded-lg overflow-x-auto custom-scrollbar text-slate-800 dark:text-slate-300 max-h-80">
                            {JSON.stringify(activeModelData, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            <div
                layoutId={`footer-${model.id}`}
                className="bg-slate-50 dark:bg-slate-900/50 p-4 border-t border-slate-100 dark:border-slate-800/50"
            >
                <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-200 dark:divide-slate-700">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">Context</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{formatContextWindow(activeModelData.context_length || model.context_length)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">In / 1M</p>
                        <p className={`text-sm font-semibold ${inPrice === 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-slate-200'}`}>${inPrice.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-1">Out / 1M</p>
                        <p className={`text-sm font-semibold ${outPrice === 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-slate-200'}`}>${outPrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
