import React, { useState, useMemo } from 'react';
import { HeatmapItem, MarketItem } from '../types/market';
import { MOCK_HEATMAP_DATA } from '../data/mockMarketData';
import { Sparkles, ZoomIn, Info, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface HeatmapViewProps {
  onSelectItem: (item: MarketItem) => void;
  marketItems: MarketItem[];
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({ onSelectItem, marketItems }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M' | 'YTD'>('1D');
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [hoveredTile, setHoveredTile] = useState<HeatmapItem | null>(null);

  // Sectors list
  const sectors = useMemo(() => {
    const list = Array.from(new Set(MOCK_HEATMAP_DATA.map((i) => i.sector)));
    return ['All', ...list];
  }, []);

  // Filtered heatmap items
  const filteredData = useMemo(() => {
    if (selectedSector === 'All') return MOCK_HEATMAP_DATA;
    return MOCK_HEATMAP_DATA.filter((i) => i.sector === selectedSector);
  }, [selectedSector]);

  // Compute color based on % change
  const getColor = (pct: number) => {
    if (pct >= 3.0) return 'bg-[#089981] hover:bg-[#07856f] text-white';
    if (pct >= 1.0) return 'bg-[#22ab94] hover:bg-[#1e9783] text-white';
    if (pct > 0.0) return 'bg-[#2e7d32] hover:bg-[#276a2b] text-white';
    if (pct === 0.0) return 'bg-gray-500 hover:bg-gray-600 text-white';
    if (pct >= -1.5) return 'bg-[#d32f2f] hover:bg-[#b71c1c] text-white';
    return 'bg-[#f23645] hover:bg-[#d82a39] text-white';
  };

  const handleTileClick = (tile: HeatmapItem) => {
    // Find matching market item or create minimal representation
    const found = marketItems.find((i) => i.symbol === tile.symbol);
    if (found) {
      onSelectItem(found);
    } else {
      const fallbackItem: MarketItem = {
        symbol: tile.symbol,
        name: tile.name,
        category: 'stocks',
        subcategory: tile.sector,
        price: tile.price,
        change: Number(((tile.price * tile.changePercent) / 100).toFixed(2)),
        changePercent: tile.changePercent,
        high24h: tile.price * 1.02,
        low24h: tile.price * 0.98,
        volume: '24.5M',
        volumeNum: 24500000,
        marketCap: `$${(tile.marketCap / 1000).toFixed(2)}T`,
        marketCapNum: tile.marketCap * 1000000000,
        sparkline: [tile.price * 0.98, tile.price * 0.99, tile.price * 1.01, tile.price],
        rating: tile.changePercent > 1 ? 'Strong Buy' : tile.changePercent > 0 ? 'Buy' : 'Sell',
        currency: 'USD',
        exchange: 'NASDAQ / NYSE',
        description: `${tile.name} is a leading component in the ${tile.sector} index.`,
        sector: tile.sector,
      };
      onSelectItem(fallbackItem);
    }
  };

  // Group items by sector for treemap blocks
  const sectorGroups = useMemo(() => {
    const map = new Map<string, HeatmapItem[]>();
    filteredData.forEach((item) => {
      const current = map.get(item.sector) || [];
      current.push(item);
      map.set(item.sector, current);
    });
    return Array.from(map.entries());
  }, [filteredData]);

  return (
    <div className="w-full space-y-4 pb-12">
      {/* Heatmap Header */}
      <div className="pb-3 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#131722] dark:text-[#f0f3fa]">
            S&P 500 Market Heatmap
          </h1>
          <p className="text-xs text-[#787b86] mt-0.5">
            Hierarchical market map weighted by market capitalization and color-coded by daily performance
          </p>
        </div>

        {/* Timeframe & Legend Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Color Scale Legend */}
          <div className="flex items-center gap-1 text-[10px] font-mono select-none">
            <span className="text-[#f23645] font-bold">-3%</span>
            <div className="flex h-3 w-28 rounded overflow-hidden">
              <span className="flex-1 bg-[#f23645]" />
              <span className="flex-1 bg-[#d32f2f]" />
              <span className="flex-1 bg-gray-500" />
              <span className="flex-1 bg-[#2e7d32]" />
              <span className="flex-1 bg-[#089981]" />
            </div>
            <span className="text-[#089981] font-bold">+3%</span>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-0.5 bg-[#f0f3fa] dark:bg-[#1e222d] p-0.5 rounded border border-[#e0e3eb] dark:border-[#2a2e39]">
            {(['1D', '1W', '1M', 'YTD'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  selectedTimeframe === tf
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sector Category Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSector(sec)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap shrink-0 ${
              selectedSector === sec
                ? 'bg-[#2962ff] text-white font-semibold'
                : 'bg-[#f0f3fa] dark:bg-[#1e222d] text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc] border border-[#e0e3eb] dark:border-[#2a2e39]'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Main Treemap Canvas */}
      <div className="bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg p-3 min-h-[580px] flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sectorGroups.map(([sectorName, items]) => (
            <div
              key={sectorName}
              className="bg-[#f8f9fd] dark:bg-[#1e222d]/50 border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg p-2.5 flex flex-col"
            >
              <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[#e0e3eb] dark:border-[#2a2e39]/60">
                <span className="text-[11px] font-bold text-[#787b86] uppercase tracking-wider truncate max-w-[180px]">
                  {sectorName}
                </span>
                <span className="text-[10px] text-[#787b86] font-mono">
                  {items.length} {items.length === 1 ? 'asset' : 'assets'}
                </span>
              </div>

              {/* Sub-grid of stocks in this sector */}
              <div className="grid grid-cols-2 gap-1.5 flex-1 min-h-[140px]">
                {items.map((stock) => {
                  const isLarge = stock.marketCap >= 1500;
                  const isPositive = stock.changePercent >= 0;

                  return (
                    <div
                      key={stock.symbol}
                      onClick={() => handleTileClick(stock)}
                      onMouseEnter={() => setHoveredTile(stock)}
                      onMouseLeave={() => setHoveredTile(null)}
                      className={`${
                        isLarge ? 'col-span-2 min-h-[85px]' : 'col-span-1 min-h-[70px]'
                      } ${getColor(
                        stock.changePercent
                      )} rounded p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-150 transform hover:scale-[1.01] hover:shadow-md select-none`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-bold text-sm tracking-tight block">
                            {stock.symbol}
                          </span>
                          <span className="text-[10px] opacity-85 truncate max-w-[120px] block font-sans">
                            {stock.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono opacity-85">
                          ${(stock.marketCap / 1000).toFixed(1)}T
                        </span>
                      </div>

                      <div className="flex items-end justify-between font-mono">
                        <span className="text-xs font-medium opacity-95">
                          ${stock.price.toFixed(2)}
                        </span>
                        <span className="font-bold text-sm tracking-tight">
                          {isPositive ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Hover Card Detail */}
      {hoveredTile && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-white dark:bg-[#1e222d] border border-[#2962ff] rounded-lg shadow-xl px-4 py-2.5 flex items-center gap-6 font-mono text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2 font-sans">
            <span className="font-bold text-sm text-[#131722] dark:text-[#f0f3fa]">
              {hoveredTile.symbol}
            </span>
            <span className="text-xs text-[#787b86]">{hoveredTile.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-[10px] text-[#787b86] block">Price</span>
              <span className="font-semibold text-[#131722] dark:text-[#f0f3fa]">
                ${hoveredTile.price.toFixed(2)}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#787b86] block">Change</span>
              <span
                className={`font-bold ${
                  hoveredTile.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                }`}
              >
                {hoveredTile.changePercent >= 0 ? '+' : ''}
                {hoveredTile.changePercent.toFixed(2)}%
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#787b86] block">Market Cap</span>
              <span className="font-semibold text-[#131722] dark:text-[#f0f3fa]">
                ${(hoveredTile.marketCap / 1000).toFixed(2)}T
              </span>
            </div>
          </div>

          <span className="text-[10px] text-[#2962ff] font-sans font-medium">Click to open chart →</span>
        </div>
      )}
    </div>
  );
};
