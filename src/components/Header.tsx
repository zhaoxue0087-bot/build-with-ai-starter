import React from 'react';
import { 
  Search, 
  Bookmark, 
  Sun, 
  Moon, 
  Activity, 
  Globe2,
  TrendingUp,
  Layers,
  BarChart3,
  Coins,
  ArrowRightLeft,
  Flame,
  Landmark
} from 'lucide-react';
import { AssetCategory } from '../types/market';

interface HeaderProps {
  activeTab: AssetCategory;
  onTabChange: (tab: AssetCategory) => void;
  onOpenSearch: () => void;
  onToggleWatchlist: () => void;
  watchlistCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  isLiveStreaming: boolean;
  onToggleLiveStream: () => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenSearch,
  onToggleWatchlist,
  watchlistCount,
  isDark,
  onToggleTheme,
  isLiveStreaming,
  onToggleLiveStream,
  selectedRegion,
  onSelectRegion
}) => {
  const navTabs: { id: AssetCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'stocks', label: 'Stocks', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'crypto', label: 'Crypto', icon: <Coins className="w-3.5 h-3.5" /> },
    { id: 'forex', label: 'Forex', icon: <ArrowRightLeft className="w-3.5 h-3.5" /> },
    { id: 'indices', label: 'Indices', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'futures', label: 'Futures', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'bonds', label: 'Bonds', icon: <Landmark className="w-3.5 h-3.5" /> },
    { id: 'heatmap', label: 'Heatmap', icon: <Activity className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-white/95 dark:bg-[#131722]/95 backdrop-blur-md transition-colors">
      <div className="w-full px-4 lg:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand Wordmark */}
        <div className="flex items-center gap-6 shrink-0">
          <div 
            onClick={() => onTabChange('overview')}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            {/* Authentic TradingView Logo Icon */}
            <div className="w-7 h-7 rounded-sm bg-[#2962ff] flex items-center justify-center font-bold text-white text-base tracking-tighter shadow-sm group-hover:bg-[#1e53e5] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 14H8V20H4V14Z" fill="currentColor"/>
                <path d="M10 9H14V20H10V9Z" fill="currentColor"/>
                <path d="M16 4H20V20H16V4Z" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex items-center font-bold text-[17px] tracking-tight text-[#131722] dark:text-[#f0f3fa]">
              TradingView
              <span className="ml-1 text-xs font-semibold text-[#2962ff] uppercase tracking-wider">Markets</span>
            </div>
          </div>

          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc] bg-[#f0f3fa] dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-md transition-all hover:border-[#2962ff]/50 w-44 md:w-56"
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Search markets, symbols...</span>
            <span className="ml-auto text-[10px] bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] px-1.5 py-0.5 rounded font-mono">
              Ctrl K
            </span>
          </button>
        </div>

        {/* Center: Markets Category Nav */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                  isActive
                    ? 'text-[#2962ff] bg-[#2962ff]/10 font-semibold'
                    : 'text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc] hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Market Region selector */}
          <div className="hidden md:flex items-center gap-1 text-xs font-medium text-[#787b86]">
            <Globe2 className="w-3.5 h-3.5" />
            <select
              value={selectedRegion}
              onChange={(e) => onSelectRegion(e.target.value)}
              className="bg-transparent border-none text-xs text-[#131722] dark:text-[#d1d4dc] focus:outline-none cursor-pointer py-1 font-medium"
            >
              <option value="US" className="bg-white dark:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc]">US Markets</option>
              <option value="Global" className="bg-white dark:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc]">Global</option>
              <option value="EU" className="bg-white dark:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc]">Europe</option>
              <option value="Asia" className="bg-white dark:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc]">Asia-Pacific</option>
            </select>
          </div>

          {/* Live Feed Toggle */}
          <button
            onClick={onToggleLiveStream}
            title={isLiveStreaming ? "Live tick simulation active" : "Live simulation paused"}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
              isLiveStreaming
                ? 'border-[#089981]/40 text-[#089981] bg-[#089981]/10'
                : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isLiveStreaming ? 'bg-[#089981] animate-pulse' : 'bg-gray-400'}`} />
            <span className="hidden sm:inline font-mono">{isLiveStreaming ? 'LIVE' : 'PAUSED'}</span>
          </button>

          {/* Watchlist Drawer Button */}
          <button
            onClick={onToggleWatchlist}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded border border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc] hover:border-[#2962ff] transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#2962ff]" />
            <span className="hidden sm:inline">Watchlist</span>
            {watchlistCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#2962ff] text-white text-[10px] flex items-center justify-center font-mono">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-1.5 rounded-md border border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc] hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Secondary Category Navigation Bar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-[#e0e3eb] dark:border-[#2a2e39] px-3 py-1.5 gap-1 text-xs no-scrollbar bg-white dark:bg-[#131722]">
        {navTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'text-[#2962ff] bg-[#2962ff]/10 font-semibold'
                  : 'text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
