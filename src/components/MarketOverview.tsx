import React, { useState } from 'react';
import { MarketItem, MarketNews, EconomicEvent } from '../types/market';
import { Sparkline } from './Sparkline';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Calendar, 
  Newspaper, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Flame,
  Globe2
} from 'lucide-react';

interface MarketOverviewProps {
  items: MarketItem[];
  news: MarketNews[];
  economicEvents: EconomicEvent[];
  onSelectItem: (item: MarketItem) => void;
  onNavigateToTab: (tab: any) => void;
  flashingSymbols: Record<string, 'up' | 'down'>;
}

export const MarketOverview: React.FC<MarketOverviewProps> = ({
  items,
  news,
  economicEvents,
  onSelectItem,
  onNavigateToTab,
  flashingSymbols,
}) => {
  const [moversTab, setMoversTab] = useState<'gainers' | 'losers' | 'volume'>('gainers');

  // Benchmark indices
  const spx = items.find((i) => i.symbol === 'SPX') || items[0];
  const ndx = items.find((i) => i.symbol === 'NDX') || items[1];
  const btc = items.find((i) => i.symbol === 'BTCUSD') || items[7];
  const gold = items.find((i) => i.symbol === 'XAUUSD') || items[11];

  const benchmarks = [spx, ndx, btc, gold];

  // Calculate market movers
  const gainers = [...items].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  const losers = [...items].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  const mostActive = [...items].sort((a, b) => b.volumeNum - a.volumeNum).slice(0, 5);

  const currentMovers = moversTab === 'gainers' ? gainers : moversTab === 'losers' ? losers : mostActive;

  return (
    <div className="w-full space-y-8 pb-12">
      {/* Top Hero Section: Global Markets Snapshot & Market Hours */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e0e3eb] dark:border-[#2a2e39]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#131722] dark:text-[#f0f3fa]">
            Global Financial Markets
          </h1>
          <p className="text-xs text-[#787b86] mt-0.5">
            Real-time streaming prices, benchmark indices, heatmaps, and economic data
          </p>
        </div>

        {/* Global Market Trading Session Statuses */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f0f3fa] dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
            <span className="text-[#131722] dark:text-[#d1d4dc] font-semibold">New York</span>
            <span className="text-[#787b86]">Open</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f0f3fa] dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
            <span className="text-[#131722] dark:text-[#d1d4dc] font-semibold">London</span>
            <span className="text-[#787b86]">Open</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f0f3fa] dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#787b86]" />
            <span className="text-[#131722] dark:text-[#d1d4dc] font-semibold">Tokyo</span>
            <span className="text-[#787b86]">Closed</span>
          </div>
        </div>
      </div>

      {/* Benchmark Indices 4-Card Hero Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {benchmarks.map((item) => {
          if (!item) return null;
          const isPositive = item.change >= 0;
          const flash = flashingSymbols[item.symbol];

          return (
            <div
              key={item.symbol}
              onClick={() => onSelectItem(item)}
              className={`p-4 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#1e222d] hover:border-[#2962ff]/60 transition-all cursor-pointer group flex flex-col justify-between shadow-xs ${
                flash === 'up'
                  ? 'ring-2 ring-[#089981]/50'
                  : flash === 'down'
                  ? 'ring-2 ring-[#f23645]/50'
                  : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-sm text-[#131722] dark:text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors">
                    {item.symbol}
                  </span>
                  <span className="text-[10px] uppercase font-mono text-[#787b86]">
                    {item.exchange}
                  </span>
                </div>
                <div className="text-xs text-[#787b86] font-medium truncate mb-3">
                  {item.name}
                </div>
              </div>

              {/* Sparkline Canvas */}
              <div className="my-2 py-1 flex items-center justify-center">
                <Sparkline data={item.sparkline} width={200} height={42} isPositive={isPositive} />
              </div>

              {/* Price & Change */}
              <div className="flex items-end justify-between pt-2 border-t border-[#e0e3eb]/60 dark:border-[#2a2e39]/60 font-mono">
                <div>
                  <div className="text-lg font-bold text-[#131722] dark:text-[#f0f3fa] tabular-nums">
                    {item.price >= 1000
                      ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : item.price.toFixed(2)}
                  </div>
                </div>

                <div
                  className={`flex items-center text-xs font-semibold tabular-nums ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main 2-Column Section: Market Movers & Heatmap Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Movers Leaderboard (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-[#131722] dark:text-[#f0f3fa] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#ff9800]" />
                Market Movers
              </h2>
              <span className="text-xs text-[#787b86]">Stocks with highest volatility and active volume</span>
            </div>

            {/* Segmented Filter Buttons */}
            <div className="flex items-center gap-1 bg-[#f0f3fa] dark:bg-[#131722] p-1 rounded-md border border-[#e0e3eb] dark:border-[#2a2e39] self-start sm:self-auto">
              <button
                onClick={() => setMoversTab('gainers')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  moversTab === 'gainers'
                    ? 'bg-white dark:bg-[#1e222d] text-[#089981] font-semibold shadow-xs'
                    : 'text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc]'
                }`}
              >
                Top Gainers
              </button>
              <button
                onClick={() => setMoversTab('losers')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  moversTab === 'losers'
                    ? 'bg-white dark:bg-[#1e222d] text-[#f23645] font-semibold shadow-xs'
                    : 'text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc]'
                }`}
              >
                Top Losers
              </button>
              <button
                onClick={() => setMoversTab('volume')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  moversTab === 'volume'
                    ? 'bg-white dark:bg-[#1e222d] text-[#2962ff] font-semibold shadow-xs'
                    : 'text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc]'
                }`}
              >
                Most Active
              </button>
            </div>
          </div>

          {/* Movers Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86] font-medium">
                  <th className="py-2.5 pl-1">Symbol</th>
                  <th className="py-2.5 text-right">Last Price</th>
                  <th className="py-2.5 text-right">Change $</th>
                  <th className="py-2.5 text-right">Change %</th>
                  <th className="py-2.5 text-right">Rating</th>
                  <th className="py-2.5 text-right pr-1">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e3eb]/60 dark:divide-[#2a2e39]/60 font-mono">
                {currentMovers.map((item) => {
                  const isPositive = item.change >= 0;
                  return (
                    <tr
                      key={item.symbol}
                      onClick={() => onSelectItem(item)}
                      className="hover:bg-[#f0f3fa] dark:hover:bg-[#131722]/60 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 pl-1 font-sans">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#131722] dark:text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors">
                            {item.symbol}
                          </span>
                          <span className="text-[11px] text-[#787b86] truncate max-w-[140px] hidden sm:inline">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right font-medium text-[#131722] dark:text-[#d1d4dc] tabular-nums">
                        {item.category === 'forex' ? item.price.toFixed(4) : item.price.toFixed(2)}
                      </td>
                      <td
                        className={`py-3 text-right font-medium tabular-nums ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.change.toFixed(2)}
                      </td>
                      <td
                        className={`py-3 text-right font-bold tabular-nums ${
                          isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </td>
                      <td className="py-3 text-right font-sans">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.rating === 'Strong Buy'
                              ? 'bg-[#089981]/15 text-[#089981]'
                              : item.rating === 'Buy'
                              ? 'bg-[#22ab94]/15 text-[#22ab94]'
                              : item.rating === 'Neutral'
                              ? 'bg-gray-500/15 text-[#787b86]'
                              : item.rating === 'Sell'
                              ? 'bg-[#ff9800]/15 text-[#ff9800]'
                              : 'bg-[#f23645]/15 text-[#f23645]'
                          }`}
                        >
                          {item.rating}
                        </span>
                      </td>
                      <td className="py-3 text-right pr-1 text-[#787b86] tabular-nums">
                        {item.volume}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Heatmap Fast Peek Card (1 Col) */}
        <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-[#131722] dark:text-[#f0f3fa] flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#2962ff]" />
                S&P 500 Heatmap
              </h2>
              <button
                onClick={() => onNavigateToTab('heatmap')}
                className="text-xs text-[#2962ff] hover:underline flex items-center gap-0.5 font-medium"
              >
                Full View
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-[#787b86] mb-4">
              Real-time market capitalization weights & daily percentage change
            </p>

            {/* Mini Treemap Grid */}
            <div className="grid grid-cols-3 gap-1.5 h-56 select-none font-mono">
              <div 
                onClick={() => {
                  const itm = items.find(i => i.symbol === 'NVDA');
                  if (itm) onSelectItem(itm);
                }}
                className="col-span-2 row-span-2 bg-[#089981] text-white p-2.5 rounded flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div>
                  <span className="font-bold text-sm block">NVDA</span>
                  <span className="text-[10px] opacity-90">$3.61T</span>
                </div>
                <span className="font-bold text-sm text-right">+3.41%</span>
              </div>

              <div 
                onClick={() => {
                  const itm = items.find(i => i.symbol === 'AAPL');
                  if (itm) onSelectItem(itm);
                }}
                className="col-span-1 row-span-1 bg-[#22ab94] text-white p-2 rounded flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity"
              >
                <span className="font-bold text-xs">AAPL</span>
                <span className="font-bold text-xs text-right">+0.51%</span>
              </div>

              <div 
                onClick={() => {
                  const itm = items.find(i => i.symbol === 'MSFT');
                  if (itm) onSelectItem(itm);
                }}
                className="col-span-1 row-span-1 bg-[#22ab94] text-white p-2 rounded flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity"
              >
                <span className="font-bold text-xs">MSFT</span>
                <span className="font-bold text-xs text-right">+0.76%</span>
              </div>

              <div 
                onClick={() => {
                  const itm = items.find(i => i.symbol === 'TSLA');
                  if (itm) onSelectItem(itm);
                }}
                className="col-span-2 row-span-1 bg-[#089981] text-white p-2 rounded flex items-center justify-between cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs">TSLA</span>
                  <span className="text-[10px] opacity-90">$1.05T</span>
                </div>
                <span className="font-bold text-xs">+4.72%</span>
              </div>

              <div 
                onClick={() => {
                  const itm = items.find(i => i.symbol === 'INTC');
                  if (itm) onSelectItem(itm);
                }}
                className="col-span-1 row-span-1 bg-[#f23645] text-white p-2 rounded flex flex-col justify-between cursor-pointer hover:opacity-90 transition-opacity"
              >
                <span className="font-bold text-xs">INTC</span>
                <span className="font-bold text-xs text-right">-3.40%</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('heatmap')}
            className="w-full mt-4 py-2 px-3 text-xs font-semibold rounded bg-[#f0f3fa] dark:bg-[#131722] hover:bg-[#2962ff] hover:text-white dark:hover:bg-[#2962ff] text-[#131722] dark:text-[#d1d4dc] transition-all border border-[#e0e3eb] dark:border-[#2a2e39] text-center"
          >
            Explore Interactive Heatmap
          </button>
        </div>
      </div>

      {/* Financial News & Economic Calendar Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Market Stories */}
        <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#131722] dark:text-[#f0f3fa] flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-[#2962ff]" />
              Market Top Stories
            </h2>
            <span className="text-xs text-[#787b86]">Updated continuously</span>
          </div>

          <div className="space-y-3.5">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  const symbolItem = items.find((i) => i.symbol === item.relatedSymbol);
                  if (symbolItem) onSelectItem(symbolItem);
                }}
                className="p-3 rounded-md hover:bg-[#f0f3fa] dark:hover:bg-[#131722]/60 border border-transparent hover:border-[#e0e3eb] dark:hover:border-[#2a2e39] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-[11px] text-[#787b86] mb-1">
                  <span className="font-semibold text-[#2962ff]">{item.source}</span>
                  <span>·</span>
                  <span>{item.timeAgo}</span>
                  <span>·</span>
                  <span className="font-mono font-medium text-[#131722] dark:text-[#d1d4dc]">
                    ${item.relatedSymbol}
                  </span>
                </div>
                <h3 className="text-xs font-semibold text-[#131722] dark:text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors leading-relaxed">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>
        </div>

        {/* Economic Calendar */}
        <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#131722] dark:text-[#f0f3fa] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2962ff]" />
              Economic Calendar
            </h2>
            <span className="text-xs text-[#787b86]">Today's Key Releases</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86] font-medium">
                  <th className="py-2">Time</th>
                  <th className="py-2">Event</th>
                  <th className="py-2 text-right">Actual</th>
                  <th className="py-2 text-right">Forecast</th>
                  <th className="py-2 text-right">Previous</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0e3eb]/60 dark:divide-[#2a2e39]/60 font-mono">
                {economicEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#f0f3fa] dark:hover:bg-[#131722]/50 transition-colors">
                    <td className="py-2.5 text-[#787b86] whitespace-nowrap">
                      {ev.time}
                    </td>
                    <td className="py-2.5 font-sans">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{ev.flag}</span>
                        <span className="font-medium text-[#131722] dark:text-[#f0f3fa] truncate max-w-[180px]">
                          {ev.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-bold text-[#089981]">
                      {ev.actual || '—'}
                    </td>
                    <td className="py-2.5 text-right text-[#787b86]">
                      {ev.forecast}
                    </td>
                    <td className="py-2.5 text-right text-[#787b86]">
                      {ev.previous}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
