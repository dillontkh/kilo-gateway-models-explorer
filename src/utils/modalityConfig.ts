export const MODALITY_CONFIG: Record<string, { icon: string; classes: string; selectedClasses: string }> = {
    text: { icon: 'text_fields', classes: 'bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-400   border-blue-200   dark:border-blue-800', selectedClasses: 'border-blue-500   bg-blue-500/15   text-blue-600   dark:text-blue-300' },
    image: { icon: 'image', classes: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800', selectedClasses: 'border-purple-500 bg-purple-500/15 text-purple-600 dark:text-purple-300' },
    audio: { icon: 'mic', classes: 'bg-green-100  dark:bg-green-900/30  text-green-700  dark:text-green-400  border-green-200  dark:border-green-800', selectedClasses: 'border-green-500  bg-green-500/15  text-green-600  dark:text-green-300' },
    video: { icon: 'videocam', classes: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800', selectedClasses: 'border-orange-500 bg-orange-500/15 text-orange-600 dark:text-orange-300' },
    file: { icon: 'description', classes: 'bg-cyan-100   dark:bg-cyan-900/30   text-cyan-700   dark:text-cyan-400   border-cyan-200   dark:border-cyan-800', selectedClasses: 'border-cyan-500   bg-cyan-500/15   text-cyan-600   dark:text-cyan-300' },
};

export const DEFAULT_MODALITY = {
    icon: 'extension',
    classes: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    selectedClasses: 'border-slate-500 bg-slate-500/15 text-slate-600 dark:text-slate-300',
};

export function getModalityConfig(mod: string) {
    return MODALITY_CONFIG[mod.toLowerCase()] ?? DEFAULT_MODALITY;
}
