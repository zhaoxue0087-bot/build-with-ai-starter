import React, { useState, useMemo } from 'react';
import { MarketItem, AssetCategory } from '../types/market';
import { Sparkline } from './Sparkline';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  ArrowUpDown, 
  Bookmark, 
  Filter,
  Check
} from 'lucide-react';

interface MarketTableProps {
  category: AssetCategory;
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  flashingSymbols: Record<string, 'up' | 'down'>;
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'volumeNum' | 'marketCapNum';
type SortDirection = 'asc' | 'desc';

export const MarketTable: React.FC<MarketTableProps> = ({
  category,
  items,
  onSelectItem,
  watchlist,
  onToggleWatchlist,
  flashingSymbols,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [subFilter, setSubFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('marketCapNum');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter items matching current category
  const categoryItems = useMemo(() => {
    return items.filter((item) => item.category === category);
  }, [items, category]);

  // Extract unique subcategories
  const subcategories = useMemo(() => {
    const set = new Set<string>();
    categoryItems.forEach((i) => {
      if (i.subcategory) set.add(i.subcategory);
    });
    return Array.from(set);
  }, [categoryItems]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let result = categoryItems;

    // Subcategory filter
    if (subFilter !== 'all') {
      result = result.filter((i) => i.subcategory === subFilter);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) => i.symbol.toLowerCase().includes(q) || i.name.toLowerCase().includes(q)
      );
    }

    // Sort
    return [...result].sort((a, b) => {
      let valA = a[sortField] ?? 0;
      let valB = b[sortField] ?? 0;

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [categoryItems, subFilter, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const categoryTitles: Record<string, { title: string; desc: string }> = {
    stocks: { title: 'Stocks Screener & Quotes', desc: 'Track top global equities, market cap valuations, P/E ratios, and technical ratings' },
    crypto: { title: 'Cryptocurrency Market Overview', desc: 'Real-time prices, 24h volumes, and market trends across top digital assets' },
    forex: { title: 'Foreign Exchange Rates', desc: 'Major, minor, and commodity currency pairs with real-time pip calculations' },
    indices: { title: 'Global Benchmark Indices', desc: 'Leading equity benchmark indices tracking global and regional market sentiment' },
    futures: { title: 'Commodities & Futures Contracts', desc: 'Front-month energy, precious metals, and agricultural commodity futures' },
    bonds: { title: 'Government Sovereign Bond Yields', desc: 'Benchmark Treasury yields, yield curves, and fixed-income sovereign debt' },
  };

  const meta = categoryTitles[category] || { title: 'Markets', desc: 'Financial market overview' };

  return (
    <div className="w-full space-y-4 pb-12">
      {/* Title & Description Banner */}
      <div className="pb-3 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#131722] dark:text-[#f0f3fa]">
            {meta.title}
          </h1>
          <p className="text-xs text-[#787b86] mt-0.5">{meta.desc}</p>
        </div>

        {/* Live Filter / Search Input */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#787b86]" />
            <input
              type="text"
              placeholder={`Filter ${category}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-md bg-[#f0f3fa] dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] text-[#131722] dark:text-[#d1d4dc] focus:outline-none focus:border-[#2962ff] w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Subcategory Pills & View Options */}
      {subcategories.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSubFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap shrink-0 ${
              subFilter === 'all'
                ? 'bg-[#2962ff] text-white font-semibold'
                : 'bg-[#f0f3fa] dark:bg-[#1e222d] text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc] border border-[#e0e3eb] dark:border-[#2a2e39]'
            }`}
          >
            All {category} ({categoryItems.length})
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setSubFilter(sub)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap shrink-0 ${
                subFilter === sub
                  ? 'bg-[#2962ff] text-white font-semibold'
                  : 'bg-[#f0f3fa] dark:bg-[#1e222d] text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc] border border-[#e0e3eb] dark:border-[#2a2e39]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Main High-Density Table */}
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86] font-medium bg-[#f8f9fd] dark:bg-[#131722]/50 select-none">
                <th className="py-3 pl-4 w-10">
                  <span className="sr-only">Watchlist</span>
                </th>
                <th
                  onClick={() => handleSort('symbol')}
                  className="py-3 px-3 cursor-pointer hover:text-[#131722] dark:hover:text-[#f0f3fa]"
                >
                  <div className="flex items-center gap-1">
                    <span>Symbol</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('price')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#131722] dark:hover:text-[#f0f3fa]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Last Price</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('changePercent')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#131722] dark:hover:text-[#f0f3fa]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Change %</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Change $</th>
                <th className="py-3 px-3 text-center">Technical Rating</th>
                <th className="py-3 px-3 text-right">24h High</th>
                <th className="py-3 px-3 text-right">24h Low</th>
                <th
                  onClick={() => handleSort('volumeNum')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-[#131722] dark:hover:text-[#f0f3fa]"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Volume</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                {category === 'stocks' && (
                  <th
                    onClick={() => handleSort('marketCapNum')}
                    className="py-3 px-3 text-right cursor-pointer hover:text-[#131722] dark:hover:text-[#f0f3fa]"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Market Cap</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                )}
                <th className="py-3 pr-4 text-right">Trend (1D)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3eb]/60 dark:divide-[#2a2e39]/60 font-mono">
              {filteredItems.map((item) => {
                const isPositive = item.change >= 0;
                const isWatch = watchlist.includes(item.symbol);
                const flash = flashingSymbols[item.symbol];

                return (
                  <tr
                    key={item.symbol}
                    onClick={() => onSelectItem(item)}
                    className={`hover:bg-[#f0f3fa] dark:hover:bg-[#131722]/60 cursor-pointer transition-colors group ${
                      flash === 'up'
                        ? 'bg-[#089981]/15'
                        : flash === 'down'
                        ? 'bg-[#f23645]/15'
                        : ''
                    }`}
                  >
                    {/* Watchlist toggle */}
                    <td
                      className="py-3 pl-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(item.symbol);
                      }}
                    >
                      <button
                        title={isWatch ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        className="text-[#787b86] hover:text-[#2962ff] transition-colors p-1"
                      >
                        <Bookmark
                          className={`w-3.5 h-3.5 ${
                            isWatch ? 'text-[#2962ff] fill-current' : 'opacity-40 hover:opacity-100'
                          }`}
                        />
                      </button>
                    </td>

                    {/* Symbol & Name */}
                    <td className="py-3 px-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded bg-[#f0f3fa] dark:bg-[#131722] text-[#2962ff] flex items-center justify-center font-bold text-[11px] border border-[#e0e3eb] dark:border-[#2a2e39] shrink-0">
                          {item.symbol.slice(0, 2)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-xs text-[#131722] dark:text-[#f0f3fa] group-hover:text-[#2962ff] transition-colors">
                            {item.symbol}
                          </span>
                          <span className="text-[10px] text-[#787b86] truncate max-w-[150px]">
                            {item.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-medium text-[#131722] dark:text-[#f0f3fa] tabular-nums">
                      {item.category === 'forex' || item.price < 2
                        ? item.price.toFixed(4)
                        : item.price >= 1000
                        ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : item.price.toFixed(2)}
                    </td>

                    {/* Change % */}
                    <td
                      className={`py-3 px-3 text-right font-bold tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      <div className="flex items-center justify-end gap-0.5">
                        {isPositive ? (
                          <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                        )}
                        <span>
                          {isPositive ? '+' : ''}
                          {item.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </td>

                    {/* Change $ */}
                    <td
                      className={`py-3 px-3 text-right font-medium tabular-nums ${
                        isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.change.toFixed(2)}
                    </td>

                    {/* Technical Rating */}
                    <td className="py-3 px-3 text-center font-sans">
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

                    {/* 24h High */}
                    <td className="py-3 px-3 text-right text-[#787b86] tabular-nums">
                      {item.high24h.toFixed(2)}
                    </td>

                    {/* 24h Low */}
                    <td className="py-3 px-3 text-right text-[#787b86] tabular-nums">
                      {item.low24h.toFixed(2)}
                    </td>

                    {/* Volume */}
                    <td className="py-3 px-3 text-right text-[#787b86] tabular-nums">
                      {item.volume}
                    </td>

                    {/* Market Cap (if stocks) */}
                    {category === 'stocks' && (
                      <td className="py-3 px-3 text-right font-medium text-[#131722] dark:text-[#d1d4dc] tabular-nums">
                        {item.marketCap || '—'}
                      </td>
                    )}

                    {/* Trend Sparkline */}
                    <td className="py-3 pr-4 text-right">
                      <div className="inline-block">
                        <Sparkline data={item.sparkline} width={90} height={26} isPositive={isPositive} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="p-8 text-center text-xs text-[#787b86]">
            No matching symbols found for "{searchQuery}".
          </div>
        )}
      </div>
    </div>
  );
};
