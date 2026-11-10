import React from 'react';
import { MarketItem } from '../types/market';
import { TradingViewChart } from './TradingViewChart';
import { TechnicalGauge } from './TechnicalGauge';
import { 
  X, 
  Bookmark, 
  ArrowUpRight, 
  ArrowDownRight, 
  Share2, 
  ExternalLink,
  Layers,
  Info
} from 'lucide-react';

interface InteractiveChartModalProps {
  item: MarketItem | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
}

export const InteractiveChartModal: React.FC<InteractiveChartModalProps> = ({
  item,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  if (!item) return null;

  const isPositive = item.change >= 0;

  // Calculate day range progress
  const dayRangeSpread = item.high24h - item.low24h || 1;
  const dayProgress = Math.min(100, Math.max(0, ((item.price - item.low24h) / dayRangeSpread) * 100));

  // 52-week range progress
  const high52 = item.high52w || item.high24h * 1.15;
  const low52 = item.low52w || item.low24h * 0.85;
  const yearSpread = high52 - low52 || 1;
  const yearProgress = Math.min(100, Math.max(0, ((item.price - low52) / yearSpread) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-6xl max-h-[92vh] bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl shadow-2xl flex flex-col overflow-hidden text-[#131722] dark:text-[#d1d4dc]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between gap-4 bg-[#f8f9fd] dark:bg-[#1e222d]">
          <div className="flex items-center gap-3">
            {/* Symbol Avatar */}
            <div className="w-10 h-10 rounded-lg bg-[#2962ff]/10 text-[#2962ff] flex items-center justify-center font-bold text-sm tracking-tight border border-[#2962ff]/20 shrink-0">
              {item.symbol.slice(0, 3)}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-[#131722] dark:text-[#f0f3fa]">
                  {item.symbol}
                </h2>
                <span className="text-xs text-[#787b86] font-medium hidden sm:inline">
                  {item.exchange} · {item.currency}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-[#f0f3fa] dark:bg-[#2a2e39] text-[#787b86]">
                  {item.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-[#787b86] font-medium truncate max-w-sm">
                {item.name}
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(item.symbol)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                isWatchlisted
                  ? 'border-[#2962ff] bg-[#2962ff]/10 text-[#2962ff]'
                  : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span className="hidden sm:inline">{isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#787b86] hover:text-[#131722] dark:hover:text-[#f0f3fa] hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Price Overview Strip */}
          <div className="flex flex-wrap items-baseline gap-4 pb-2 border-b border-[#e0e3eb] dark:border-[#2a2e39]">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold tracking-tight text-[#131722] dark:text-[#f0f3fa] tabular-nums">
                {item.category === 'forex' || item.price < 2
                  ? item.price.toFixed(4)
                  : item.price >= 1000
                  ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : item.price.toFixed(2)}
              </span>
              <span className="text-xs text-[#787b86] font-mono">{item.currency}</span>
            </div>

            <div
              className={`flex items-center gap-1 font-mono font-semibold text-sm tabular-nums ${
                isPositive ? 'text-[#089981]' : 'text-[#f23645]'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              )}
              <span>
                {isPositive ? '+' : ''}
                {item.change.toFixed(2)} ({isPositive ? '+' : ''}
                {item.changePercent.toFixed(2)}%)
              </span>
              <span className="text-xs text-[#787b86] font-normal ml-1">Today</span>
            </div>
          </div>

          {/* Chart & Technical Gauge Split */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <TradingViewChart item={item} />
            </div>

            <div className="flex flex-col gap-4">
              <TechnicalGauge rating={item.rating} symbol={item.symbol} />

              {/* Day & 52-Week Range Meters */}
              <div className="bg-[#f8f9fd] dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg p-4 space-y-4">
                <span className="text-xs font-semibold text-[#131722] dark:text-[#f0f3fa] block">
                  Price Ranges
                </span>

                {/* Day Range */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#787b86] mb-1 font-mono">
                    <span>Day's Range</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-[#131722] dark:text-[#d1d4dc]">{item.low24h.toFixed(2)}</span>
                    <span className="text-[#131722] dark:text-[#d1d4dc]">{item.high24h.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-[#2a2e39] rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-[#2962ff] rounded-full transition-all"
                      style={{ width: `${dayProgress}%` }}
                    />
                  </div>
                </div>

                {/* 52-Week Range */}
                <div>
                  <div className="flex justify-between text-[11px] text-[#787b86] mb-1 font-mono">
                    <span>52-Week Range</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-[#131722] dark:text-[#d1d4dc]">{low52.toFixed(2)}</span>
                    <span className="text-[#131722] dark:text-[#d1d4dc]">{high52.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-[#2a2e39] rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-[#089981] rounded-full transition-all"
                      style={{ width: `${yearProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Fundamentals & Statistics Grid */}
          <div className="bg-[#f8f9fd] dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#787b86] mb-4">
              Key Market Statistics
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 font-mono text-xs">
              <div>
                <span className="text-[#787b86] block text-[11px]">Market Capitalization</span>
                <span className="font-semibold text-sm text-[#131722] dark:text-[#f0f3fa]">
                  {item.marketCap || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[#787b86] block text-[11px]">24h Volume</span>
                <span className="font-semibold text-sm text-[#131722] dark:text-[#f0f3fa]">
                  {item.volume}
                </span>
              </div>
              <div>
                <span className="text-[#787b86] block text-[11px]">P/E Ratio (TTM)</span>
                <span className="font-semibold text-sm text-[#131722] dark:text-[#f0f3fa]">
                  {item.peRatio ? item.peRatio.toFixed(1) : 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-[#787b86] block text-[11px]">Div Yield (Indicated)</span>
                <span className="font-semibold text-sm text-[#131722] dark:text-[#f0f3fa]">
                  {item.divYield || '—'}
                </span>
              </div>
              <div>
                <span className="text-[#787b86] block text-[11px]">Beta (1Y)</span>
                <span className="font-semibold text-sm text-[#131722] dark:text-[#f0f3fa]">
                  {item.beta ? item.beta.toFixed(2) : '1.00'}
                </span>
              </div>
              <div>
                <span className="text-[#787b86] block text-[11px]">EPS Diluted (TTM)</span>
                <span className="font-semibold text-sm text-[#131722] dark:text-[#f0f3fa]">
                  {item.eps ? `$${item.eps.toFixed(2)}` : 'N/A'}
                </span>
              </div>
            </div>

            {/* Profile Summary */}
            <div className="mt-5 pt-4 border-t border-[#e0e3eb] dark:border-[#2a2e39] text-xs font-sans text-[#787b86]">
              <span className="font-semibold text-[#131722] dark:text-[#d1d4dc] mr-1">About {item.name}:</span>
              {item.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
