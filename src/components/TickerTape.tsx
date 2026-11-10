import React from 'react';
import { MarketItem } from '../types/market';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TickerTapeProps {
  items: MarketItem[];
  onSelectItem: (item: MarketItem) => void;
  flashingSymbols: Record<string, 'up' | 'down'>;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ items, onSelectItem, flashingSymbols }) => {
  // Take top 10 iconic tickers for the ribbon
  const marqueeItems = items.slice(0, 12);
  // Duplicate for seamless infinite loop
  const displayList = [...marqueeItems, ...marqueeItems];

  return (
    <div className="w-full bg-[#f8f9fd] dark:bg-[#131722] border-b border-[#e0e3eb] dark:border-[#2a2e39] overflow-hidden select-none">
      <div className="flex animate-marquee py-2 hover:pause">
        {displayList.map((item, index) => {
          const isPositive = item.change >= 0;
          const flash = flashingSymbols[item.symbol];

          return (
            <div
              key={`${item.symbol}-${index}`}
              onClick={() => onSelectItem(item)}
              className={`flex items-center gap-2.5 px-4 border-r border-[#e0e3eb] dark:border-[#2a2e39] cursor-pointer hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] transition-colors shrink-0 ${
                flash === 'up'
                  ? 'bg-[#089981]/20'
                  : flash === 'down'
                  ? 'bg-[#f23645]/20'
                  : ''
              }`}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-[#131722] dark:text-[#f0f3fa] tracking-tight">
                    {item.symbol}
                  </span>
                  <span className="text-[10px] text-[#787b86] font-medium hidden sm:inline truncate max-w-[80px]">
                    {item.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 font-mono text-xs">
                <span className="font-medium text-[#131722] dark:text-[#d1d4dc] tabular-nums">
                  {item.category === 'forex' || item.price < 2
                    ? item.price.toFixed(4)
                    : item.price >= 1000
                    ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : item.price.toFixed(2)}
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
      </div>
    </div>
  );
};
