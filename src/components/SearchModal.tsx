import React, { useState, useEffect, useRef } from 'react';
import { MarketItem } from '../types/market';
import { Search, X, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
}) => {
  const [query, setQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = items.filter((item) => {
    const matchesCat = filterCategory === 'all' || item.category === filterCategory;
    const matchesQ =
      !query.trim() ||
      item.symbol.toLowerCase().includes(query.toLowerCase()) ||
      item.name.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesQ;
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl shadow-2xl overflow-hidden text-[#131722] dark:text-[#d1d4dc]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center gap-3">
          <Search className="w-4 h-4 text-[#787b86] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search markets, symbols, indices (e.g. NVDA, BTC, S&P 500)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none text-[#131722] dark:text-[#f0f3fa] placeholder-[#787b86]"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#787b86] hover:text-[#131722] dark:hover:text-[#f0f3fa]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-3 py-2 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs bg-[#f8f9fd] dark:bg-[#131722]/50">
          {(['all', 'stocks', 'crypto', 'forex', 'indices', 'futures', 'bonds'] as const).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded capitalize transition-colors font-medium whitespace-nowrap ${
                  filterCategory === cat
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc]'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Search Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#e0e3eb]/60 dark:divide-[#2a2e39]/60">
          {filtered.map((item) => {
            const isPositive = item.change >= 0;

            return (
              <div
                key={item.symbol}
                onClick={() => {
                  onSelectItem(item);
                  onClose();
                }}
                className="p-3 hover:bg-[#f0f3fa] dark:hover:bg-[#131722] cursor-pointer transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#f0f3fa] dark:bg-[#131722] text-[#2962ff] flex items-center justify-center font-bold text-xs border border-[#e0e3eb] dark:border-[#2a2e39]">
                    {item.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#131722] dark:text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors">
                        {item.symbol}
                      </span>
                      <span className="text-[10px] text-[#787b86] font-mono">
                        {item.exchange}
                      </span>
                    </div>
                    <span className="text-xs text-[#787b86] truncate max-w-xs block">
                      {item.name}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end font-mono text-xs">
                  <span className="font-medium text-[#131722] dark:text-[#f0f3fa] tabular-nums">
                    {item.category === 'forex' ? item.price.toFixed(4) : item.price.toFixed(2)}
                  </span>
                  <span
                    className={`flex items-center text-[11px] font-semibold tabular-nums ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                    )}
                    {isPositive ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-[#787b86]">
              No instruments found matching "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#e0e3eb] dark:border-[#2a2e39] bg-[#f8f9fd] dark:bg-[#131722]/50 text-[11px] text-[#787b86] flex items-center justify-between font-mono">
          <span>Press ESC to close</span>
          <span>Click any symbol to view interactive chart</span>
        </div>
      </div>
    </div>
  );
};
