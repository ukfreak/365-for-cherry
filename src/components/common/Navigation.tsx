import React from 'react';
import { Heart, BookOpen, Camera, Mic, Gift } from 'lucide-react';

export type TabType = 'home' | 'reasons' | 'memories' | 'voice' | 'surprise';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  isDay365: boolean;
  journalBadgeCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  isDay365,
  journalBadgeCount,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Today', icon: Heart },
    { id: 'reasons' as TabType, label: 'Journal', icon: BookOpen, badge: journalBadgeCount },
    { id: 'memories' as TabType, label: 'Memories', icon: Camera },
    { id: 'voice' as TabType, label: 'Voice Notes', icon: Mic },
    { id: 'surprise' as TabType, label: 'Day 365', icon: Gift, isSpecial: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-romantic-cream/95 backdrop-blur-md border-t border-romantic-pastel/60 pb-safe shadow-[0_-4px_20px_rgba(199,125,152,0.08)]">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-romantic-rose scale-105 font-semibold'
                  : 'text-romantic-brown/65 hover:text-romantic-brown'
              }`}
            >
              {/* Active pill background */}
              {isActive && (
                <span className="absolute inset-0 bg-romantic-pastel/50 rounded-2xl -z-10 animate-fade-in" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'
                  } ${tab.isSpecial && isDay365 ? 'text-romantic-gold fill-romantic-gold/30 animate-bounce' : ''}`}
                />

                {/* Optional small notification badge */}
                {tab.badge !== undefined && tab.badge > 0 && !isActive && (
                  <span className="absolute -top-1 -right-2 bg-romantic-blush text-romantic-brown text-[9px] font-bold px-1 rounded-full border border-romantic-cream">
                    {tab.badge}
                  </span>
                )}

                {tab.isSpecial && isDay365 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-romantic-rose rounded-full animate-ping" />
                )}
              </div>

              <span className="text-[11px] mt-1 font-sans">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
