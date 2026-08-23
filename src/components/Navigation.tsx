import React from 'react';
import { motion } from 'motion/react';
import { ActiveTab, UserProfile } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userProfile: UserProfile;
  onOpenQuickLog?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenQuickLog
}) => {
  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Overview',
      icon: 'dashboard',
      tag: 'Overview',
      matches: (tab: ActiveTab) => tab === 'overview'
    },
    {
      id: 'meals' as ActiveTab,
      label: 'Meals',
      icon: 'palette',
      tag: 'Meals',
      matches: (tab: ActiveTab) => tab === 'meals' || tab === 'atelier' || tab === 'meal-detail'
    },
    {
      id: 'library' as ActiveTab,
      label: 'Food Library',
      icon: 'restaurant_menu',
      tag: 'Library',
      matches: (tab: ActiveTab) => tab === 'library' || tab === 'food-detail'
    },
    {
      id: 'planner' as ActiveTab,
      label: 'Planner',
      icon: 'calendar_month',
      tag: 'Planner',
      matches: (tab: ActiveTab) => tab === 'planner'
    },
    {
      id: 'nutrition' as ActiveTab,
      label: 'Nutrition',
      icon: 'menu_book',
      tag: 'Nutrition',
      matches: (tab: ActiveTab) => tab === 'nutrition' || tab === 'tracker'
    },
    {
      id: 'history' as ActiveTab,
      label: 'History',
      icon: 'monitoring',
      tag: 'History',
      matches: (tab: ActiveTab) => tab === 'history' || tab === 'vitals'
    }
  ];

  return (
    <>
      {/* Desktop Side Navigation Bar */}
      <nav className="hidden md:flex flex-col items-center py-8 bg-[#141313]/95 border-r border-[#444748]/20 fixed left-0 top-0 h-full w-24 z-50 backdrop-blur-xl">
        {/* Logo emblem */}
        <div
          onClick={() => setActiveTab('overview')}
          className="mb-8 flex flex-col items-center group cursor-pointer"
          title="Ethos Nutrition - Overview"
        >
          <div className="w-11 h-11 rounded-full border border-[#444748]/40 flex items-center justify-center mb-1 group-hover:border-[#c8c6c5] group-hover:scale-105 transition-all duration-300 bg-[#1c1b1b]">
            <span className="font-display-md text-[#e5e2e1] italic text-lg leading-none">E</span>
          </div>
          <span className="font-label-caps text-[9px] text-[#c4c7c7] tracking-widest uppercase">ETHOS</span>
        </div>

        {/* Nav Items List */}
        <div className="flex flex-col items-center gap-3 w-full flex-1">
          {navItems.map((item) => {
            const isActive = item.matches(activeTab);
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-colors duration-200 group ${
                  isActive
                    ? 'text-[#e5e2e1]'
                    : 'text-[#c4c7c7] hover:text-[#e5e2e1] hover:bg-[#1c1b1b]'
                }`}
                title={item.label}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-bg-desktop"
                    className="absolute inset-0 bg-[#222121] border border-[#bacbbc]/40 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span
                  className="material-symbols-outlined text-[21px] relative z-10"
                  style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300" }}
                >
                  {item.icon}
                </span>
                <span className="font-label-caps text-[9px] tracking-wider uppercase opacity-85 mt-0.5 relative z-10">
                  {item.tag}
                </span>
                {isActive && (
                  <motion.span 
                    layoutId="nav-indicator-desktop"
                    className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#bacbbc] rounded-r-full" 
                    initial={false}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Profile & Settings */}
        <div className="mt-auto flex flex-col items-center gap-3">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-10 h-10 rounded-full overflow-hidden border transition-colors duration-200 ${
              activeTab === 'profile'
                ? 'border-[#bacbbc] ring-1 ring-[#bacbbc]/40'
                : 'border-[#444748]/40 hover:border-[#c8c6c5]'
            }`}
            title="Profile & Settings"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-full h-full object-cover"
            />
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-[#c4c7c7] hover:text-[#e5e2e1] p-2 transition-colors duration-200"
            title="Settings"
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
            >
              settings
            </span>
          </button>
        </div>
      </nav>

      {/* Top Header Bar */}
      <header className="fixed top-0 w-full z-40 bg-[#141313]/95 backdrop-blur-md border-b border-[#444748]/20 h-16 md:pl-24 flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <div
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="font-display-md text-xl md:text-2xl text-[#e5e2e1] italic tracking-wide group-hover:text-[#bacbbc] transition-colors">
              Ethos Nutrition
            </span>
          </div>

          {/* Canonical Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1.5 ml-2">
            {navItems.map((item) => {
              const isActive = item.matches(activeTab);
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative text-[13px] font-medium px-3.5 py-1.5 rounded-full transition-colors duration-150 ${
                    isActive
                      ? 'text-[#e5e2e1]'
                      : 'text-[#c4c7c7] hover:text-[#e5e2e1] hover:bg-[#1c1b1b]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-bg-canonical"
                      className="absolute inset-0 bg-[#222121] border border-[#bacbbc]/30 rounded-full"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right side utilities */}
        <div className="flex items-center gap-3">
          {onOpenQuickLog && (
            <button
              onClick={onOpenQuickLog}
              className="bg-[#9E8E77] hover:bg-[#b0a08b] text-[#141313] text-[13px] font-medium px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Log Food</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('profile')}
            className={`p-2 rounded-full hover:bg-[#201f1f] transition-colors ${
              activeTab === 'profile' ? 'text-[#bacbbc]' : 'text-[#c4c7c7] hover:text-[#e5e2e1]'
            }`}
            title="Profile & Settings"
          >
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
          </button>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#141313]/95 backdrop-blur-md border-t border-[#444748]/20 z-50 flex justify-around items-center h-[72px] px-2 pb-safe">
        {navItems.map((item) => {
          const isActive = item.matches(activeTab);
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-[#141313]' : 'text-[#c4c7c7] hover:text-[#e5e2e1]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-bg-mobile"
                  className="absolute inset-x-2 inset-y-1.5 bg-[#bacbbc] rounded-lg"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className="material-symbols-outlined text-[22px] relative z-10"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className={`font-label-caps text-[9px] tracking-wider uppercase mt-1 relative z-10 ${isActive ? 'font-medium' : ''}`}>
                {item.tag}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
