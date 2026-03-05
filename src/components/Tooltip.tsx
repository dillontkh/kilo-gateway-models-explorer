import React, { useState, useRef } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(true);
  };

  const hideTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 50);
  };

  const handleTouchStart = () => {
    showTooltip();
    timeoutRef.current = setTimeout(() => {
      hideTooltip();
    }, 1500);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-800 dark:border-t-slate-700',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-slate-800 dark:border-b-slate-700',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-l-4 border-t-transparent border-b-transparent border-l-slate-800 dark:border-l-slate-700',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-4 border-b-4 border-r-4 border-t-transparent border-b-transparent border-r-slate-800 dark:border-r-slate-700',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onTouchStart={handleTouchStart}
      onTouchEnd={hideTooltip}
    >
      {children}
      <div
        className={`
          absolute z-50 px-3 py-2 w-max max-w-[320px] min-w-[200px]
          text-xs text-white text-center
          bg-slate-800 dark:bg-slate-700
          rounded-md shadow-lg
          transition-opacity duration-200 ease-in-out
          pointer-events-none
          ${positionClasses[position]}
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        <span className="break-words whitespace-normal">{content}</span>
        <span
          className={`
            absolute w-0 h-0
            ${arrowClasses[position]}
          `}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

export default Tooltip;
