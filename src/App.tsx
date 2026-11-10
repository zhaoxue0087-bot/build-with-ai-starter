import React, { useState, useEffect, useCallback } from 'react';
import { AssetCategory, MarketItem, MarketNews, EconomicEvent } from './types/market';
import { 
  INITIAL_MARKET_ITEMS, 
  MOCK_NEWS, 
  MOCK_ECONOMIC_EVENTS 
} from './data/mockMarketData';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { MarketOverview } from './components/MarketOverview';
import { MarketTable } from './components/MarketTable';
import { HeatmapView } from './components/HeatmapView';
import { InteractiveChartModal } from './components/InteractiveChartModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { SearchModal } from './components/SearchModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<AssetCategory>('overview');
  const [items, setItems] = useState<MarketItem[]>(INITIAL_MARKET_ITEMS);
  const [watchlist, setWatchlist] = useState<string[]>(['NVDA', 'AAPL', 'BTCUSD', 'SPX', 'TSLA', 'XAUUSD']);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('US');
  const [flashingSymbols, setFlashingSymbols] = useState<Record<string, 'up' | 'down'>>({});

  // Keyboard shortcut Ctrl+K to trigger search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Theme synchronization
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Toggle watchlist symbol
  const handleToggleWatchlist = useCallback((symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  }, []);

  // Live real-time price tick simulation
  useEffect(() => {
    if (!isLiveStreaming) return;

    const interval = setInterval(() => {
      // Pick 2 random items to update
      const indexA = Math.floor(Math.random() * items.length);
      const indexB = Math.floor(Math.random() * items.length);
      const targetIndices = [indexA, indexB];

      const newFlashes: Record<string, 'up' | 'down'> = {};

      setItems((prevItems) => {
        return prevItems.map((item, idx) => {
          if (!targetIndices.includes(idx)) return item;

          // Tiny tick delta: -0.2% to +0.22%
          const pctDelta = (Math.random() - 0.47) * 0.004;
          const newPrice = Number(Math.max(item.price * (1 + pctDelta), 0.01).toFixed(item.category === 'forex' ? 4 : 2));
          const priceDiff = newPrice - item.price;
          const isUp = priceDiff >= 0;

          newFlashes[item.symbol] = isUp ? 'up' : 'down';

          const newChange = Number((item.change + priceDiff).toFixed(item.category === 'forex' ? 4 : 2));
          const basePrevClose = item.price - item.change;
          const newChangePercent = Number(((newChange / (basePrevClose || 1)) * 100).toFixed(2));

          const newSparkline = [...item.sparkline.slice(1), newPrice];

          return {
            ...item,
            price: newPrice,
            change: newChange,
            changePercent: newChangePercent,
            high24h: Math.max(item.high24h, newPrice),
            low24h: Math.min(item.low24h, newPrice),
            sparkline: newSparkline,
          };
        });
      });

      // Also update selected item if currently open
      setSelectedItem((current) => {
        if (!current) return null;
        if (newFlashes[current.symbol]) {
          const updated = items.find((i) => i.symbol === current.symbol);
          return updated || current;
        }
        return current;
      });

      setFlashingSymbols(newFlashes);
      const timeout = setTimeout(() => {
        setFlashingSymbols({});
      }, 700);

      return () => clearTimeout(timeout);
    }, 2400);

    return () => clearInterval(interval);
  }, [isLiveStreaming, items.length]);

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] dark:bg-[#131722] text-[#131722] dark:text-[#d1d4dc] transition-colors selection:bg-[#2962ff]/30">
      {/* Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleWatchlist={() => setIsWatchlistOpen((prev) => !prev)}
        watchlistCount={watchlist.length}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        isLiveStreaming={isLiveStreaming}
        onToggleLiveStream={() => setIsLiveStreaming((prev) => !prev)}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
      />

      {/* Ticker Tape */}
      <TickerTape
        items={items}
        onSelectItem={setSelectedItem}
        flashingSymbols={flashingSymbols}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 lg:px-6 pt-5">
        {activeTab === 'overview' && (
          <MarketOverview
            items={items}
            news={MOCK_NEWS}
            economicEvents={MOCK_ECONOMIC_EVENTS}
            onSelectItem={setSelectedItem}
            onNavigateToTab={setActiveTab}
            flashingSymbols={flashingSymbols}
          />
        )}

        {activeTab === 'heatmap' && (
          <HeatmapView
            onSelectItem={setSelectedItem}
            marketItems={items}
          />
        )}

        {activeTab !== 'overview' && activeTab !== 'heatmap' && (
          <MarketTable
            category={activeTab}
            items={items}
            onSelectItem={setSelectedItem}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            flashingSymbols={flashingSymbols}
          />
        )}
      </main>

      {/* Symbol Detail Interactive Modal */}
      <InteractiveChartModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isWatchlisted={selectedItem ? watchlist.includes(selectedItem.symbol) : false}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* Watchlist Right Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlist}
        allItems={items}
        onSelectItem={setSelectedItem}
        onRemoveFromWatchlist={(sym) => setWatchlist((prev) => prev.filter((s) => s !== sym))}
        onAddToWatchlist={(sym) => {
          if (!watchlist.includes(sym)) {
            setWatchlist((prev) => [...prev, sym]);
          }
        }}
      />

      {/* Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={items}
        onSelectItem={setSelectedItem}
      />

      {/* TradingView Minimal Footer */}
      <footer className="border-t border-[#e0e3eb] dark:border-[#2a2e39] py-5 px-4 lg:px-6 text-xs text-[#787b86] bg-white dark:bg-[#131722] mt-auto">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#131722] dark:text-[#f0f3fa]">TradingView Markets</span>
            <span>·</span>
            <span>Where the world charts, chats and trades markets.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#089981] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#089981]" />
              Market Data Active
            </span>
            <span>Prices are simulated for terminal preview</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
