import React, { useState } from 'react';
import { MarketItem } from '../types/market';
import { Sparkline } from './Sparkline';
import { 
  X, 
  Trash2, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Bell, 
  Bookmark,
  ExternalLink
} from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  allItems: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  onAddToWatchlist: (symbol: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  allItems,
  onSelectItem,
  onRemoveFromWatchlist,
  onAddToWatchlist,
}) => {
  const [addSymbolInput, setAddSymbolInput] = useState('');
  const [alertSymbol, setAlertSymbol] = useState<string | null>(null);
  const [alertSuccessMessage, setAlertSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Filter items in the watchlist
  const watchlistedItems = allItems.filter((i) => watchlistSymbols.includes(i.symbol));

  // Quick suggestions for adding
  const availableToAdd = allItems
    .filter((i) => !watchlistSymbols.includes(i.symbol))
    .filter(
      (i) =>
        !addSymbolInput.trim() ||
        i.symbol.toLowerCase().includes(addSymbolInput.toLowerCase()) ||
        i.name.toLowerCase().includes(addSymbolInput.toLowerCase())
    )
    .slice(0, 5);

  const handleSetAlert = (symbol: string) => {
    setAlertSymbol(symbol);
    setAlertSuccessMessage(`Alert created for ${symbol} when crossing price boundaries`);
    setTimeout(() => {
      setAlertSuccessMessage(null);
      setAlertSymbol(null);
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-sm h-full bg-white dark:bg-[#1e222d] border-l border-[#e0e3eb] dark:border-[#2a2e39] shadow-2xl flex flex-col text-[#131722] dark:text-[#d1d4dc] animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-[#2962ff]" />
            <h2 className="font-bold text-sm text-[#131722] dark:text-[#f0f3fa]">
              Watchlist
            </h2>
            <span className="text-xs font-mono text-[#787b86]">
              ({watchlistedItems.length})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-[#787b86] hover:text-[#131722] dark:hover:text-[#f0f3fa] hover:bg-[#f0f3fa] dark:hover:bg-[#2a2e39] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alert Notification Toast */}
        {alertSuccessMessage && (
          <div className="mx-4 mt-3 p-2.5 rounded bg-[#089981]/15 border border-[#089981]/30 text-[#089981] text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <Bell className="w-3.5 h-3.5 shrink-0" />
            <span>{alertSuccessMessage}</span>
          </div>
        )}

        {/* Quick Add Symbol Bar */}
        <div className="p-3 border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-[#f8f9fd] dark:bg-[#131722]/40">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add symbol (e.g. AAPL, BTC)..."
              value={addSymbolInput}
              onChange={(e) => setAddSymbolInput(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded border border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc] focus:outline-none focus:border-[#2962ff]"
            />
          </div>

          {/* Quick Suggestions dropdown */}
          {addSymbolInput.trim() && availableToAdd.length > 0 && (
            <div className="mt-2 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-md shadow-lg divide-y divide-[#e0e3eb]/60 dark:divide-[#2a2e39]/60 max-h-48 overflow-y-auto">
              {availableToAdd.map((item) => (
                <div
                  key={item.symbol}
                  onClick={() => {
                    onAddToWatchlist(item.symbol);
                    setAddSymbolInput('');
                  }}
                  className="p-2 flex items-center justify-between text-xs hover:bg-[#f0f3fa] dark:hover:bg-[#131722] cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-[#131722] dark:text-[#f0f3fa]">
                      {item.symbol}
                    </span>
                    <span className="text-[10px] text-[#787b86] truncate max-w-[150px]">
                      {item.name}
                    </span>
                  </div>
                  <Plus className="w-3.5 h-3.5 text-[#2962ff]" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Watchlist Items Scroll */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#e0e3eb]/60 dark:divide-[#2a2e39]/60">
          {watchlistedItems.map((item) => {
            const isPositive = item.change >= 0;

            return (
              <div
                key={item.symbol}
                onClick={() => onSelectItem(item)}
                className="p-3 hover:bg-[#f0f3fa] dark:hover:bg-[#131722]/50 cursor-pointer transition-colors group flex items-center justify-between gap-3"
              >
                {/* Left: Symbol & Exchange */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-[#131722] dark:text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors">
                      {item.symbol}
                    </span>
                    <span className="text-[10px] text-[#787b86] font-mono">
                      {item.category.slice(0, 3).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#787b86] truncate max-w-[110px]">
                    {item.name}
                  </span>
                </div>

                {/* Center: Sparkline */}
                <div className="hidden sm:block">
                  <Sparkline data={item.sparkline} width={65} height={22} isPositive={isPositive} />
                </div>

                {/* Right: Price & % Change */}
                <div className="flex items-center gap-2 font-mono">
                  <div className="flex flex-col items-end text-xs">
                    <span className="font-semibold text-[#131722] dark:text-[#f0f3fa] tabular-nums">
                      {item.category === 'forex' ? item.price.toFixed(4) : item.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-[11px] font-medium tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </span>
                  </div>

                  {/* Actions: Alert & Delete */}
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetAlert(item.symbol);
                      }}
                      title="Set Price Alert"
                      className="p-1 text-[#787b86] hover:text-[#2962ff] transition-colors"
                    >
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(item.symbol);
                      }}
                      title="Remove"
                      className="p-1 text-[#787b86] hover:text-[#f23645] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {watchlistedItems.length === 0 && (
            <div className="p-8 text-center text-xs text-[#787b86] space-y-2">
              <Bookmark className="w-8 h-8 text-[#787b86]/40 mx-auto" />
              <p>Your watchlist is empty.</p>
              <p className="text-[11px] text-[#787b86]/80">
                Click the bookmark icon on any ticker to follow it here.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[#e0e3eb] dark:border-[#2a2e39] bg-[#f8f9fd] dark:bg-[#131722]/50 text-center">
          <span className="text-[11px] text-[#787b86]">
            Quotes simulated in real-time · TradingView Markets
          </span>
        </div>
      </div>
    </div>
  );
};
