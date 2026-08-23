import React from 'react';
import { ActiveTab } from '../types';

interface NotFoundViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({ setActiveTab }) => {
  return (
    <div className="w-full max-w-[800px] mx-auto px-4 md:px-8 py-20 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="flex flex-col items-center max-w-lg">
        {/* Typographic 404 */}
        <h1
          aria-hidden="true"
          className="font-display-lg text-7xl md:text-9xl text-[#353434] tracking-tighter italic select-none mb-4 font-light"
        >
          404
        </h1>
        <p className="font-headline-sm text-2xl text-[#e5e2e1] mb-3">
          That path isn't on today's plan.
        </p>
        <p className="font-body-lg text-sm text-[#c4c7c7] mb-8 font-light leading-relaxed">
          The space you are looking for seems to have been thoughtfully moved or does not exist. Let's redirect your focus to your daily rhythm.
        </p>
        <button
          onClick={() => setActiveTab('overview')}
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#9E8E77] hover:bg-[#b0a08b] text-[#141313] font-label-caps text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl hover:-translate-y-0.5"
        >
          <span>Return to Overview</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
