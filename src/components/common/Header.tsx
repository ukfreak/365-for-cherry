import React from 'react';
import { Heart, BookOpen, Camera, Mic, Settings as SettingsIcon, Download } from 'lucide-react';
import { AppSettings } from '../../types';
import { TabType } from './Navigation';

interface HeaderProps {
  settings: AppSettings;
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  onOpenSettings: () => void;
  canInstallPWA: boolean;
  onInstallPWA: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentTab,
  onSelectTab,
  onOpenSettings,
  canInstallPWA,
  onInstallPWA,
}) => {
  const navItems = [
    { id: 'home' as TabType, label: 'Today', icon: Heart },
    { id: 'reasons' as TabType, label: 'Journal', icon: BookOpen },
    { id: 'memories' as TabType, label: 'Memories', icon: Camera },
    { id: 'voice' as TabType, label: 'Voice', icon: Mic },
  ];

  return (
    <header className="sticky top-0 z-30 bg-romantic-cream/90 backdrop-blur-md border-b border-romantic-pastel/50 px-4 sm:px-6 py-3 transition-all duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-romantic-blush to-romantic-pastel flex items-center justify-center shadow-xs text-romantic-rose group-hover:scale-105 transition-transform">
            <Heart className="w-4 h-4 fill-romantic-rose text-romantic-rose animate-heartbeat" />
          </div>
          <div>
            <h1 className="font-serif italic font-medium text-lg text-romantic-brown leading-tight tracking-tight">
              365 Reasons
            </h1>
          </div>
        </div>

        {/* Desktop / Tablet Nav Bar matching screenshot */}
        <nav className="hidden sm:flex items-center space-x-6 text-xs font-medium text-romantic-brown/75">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center space-x-1.5 py-1 transition-colors ${
                  isActive
                    ? 'text-romantic-rose font-semibold'
                    : 'hover:text-romantic-brown'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-romantic-rose stroke-[2.2]' : 'text-romantic-brown/60'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={onOpenSettings}
            className="flex items-center space-x-1.5 py-1 hover:text-romantic-brown transition-colors"
          >
            <SettingsIcon className="w-4 h-4 text-romantic-brown/60" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Mobile Action Buttons */}
        <div className="flex sm:hidden items-center space-x-2">
          {canInstallPWA && (
            <button
              onClick={onInstallPWA}
              aria-label="Install App"
              className="px-2.5 py-1 rounded-full bg-romantic-pastel/60 hover:bg-romantic-pastel text-romantic-brown text-xs font-medium flex items-center space-x-1 border border-romantic-blush/40 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-romantic-rose" />
              <span>Install</span>
            </button>
          )}

          <button
            onClick={onOpenSettings}
            aria-label="Open Settings"
            className="w-8 h-8 rounded-full bg-romantic-softBg hover:bg-romantic-pastel/50 text-romantic-brown/80 hover:text-romantic-brown flex items-center justify-center transition-colors border border-romantic-pastel/60 shadow-xs"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
