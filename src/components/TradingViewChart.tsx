import React, { useState, useMemo, useRef } from 'react';
import { MarketItem, CandlePoint } from '../types/market';
import { generateCandleHistory } from '../data/mockMarketData';
import { CandlestickChart, LineChart, Eye } from 'lucide-react';

interface TradingViewChartProps {
  item: MarketItem;
}

export const TradingViewChart: React.FC<TradingViewChartProps> = ({ item }) => {
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '3M' | '1Y' | 'ALL'>('1M');
  const [chartType, setChartType] = useState<'candlestick' | 'area'>('candlestick');
  const [showMA20, setShowMA20] = useState(true);
  const [showMA50, setShowMA50] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [hoveredCandle, setHoveredCandle] = useState<CandlePoint | null>(null);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate data based on selected timeframe
  const candles = useMemo(() => {
    const count = timeframe === '1D' ? 24 : timeframe === '5D' ? 35 : timeframe === '1M' ? 45 : timeframe === '3M' ? 60 : 75;
    return generateCandleHistory(item.price, count);
  }, [item.price, timeframe]);

  // Compute Moving Averages
  const ma20Data = useMemo(() => {
    const period = 10;
    return candles.map((c, idx) => {
      if (idx < period - 1) return null;
      const slice = candles.slice(idx - period + 1, idx + 1);
      const avg = slice.reduce((sum, item) => sum + item.close, 0) / period;
      return avg;
    });
  }, [candles]);

  const ma50Data = useMemo(() => {
    const period = 20;
    return candles.map((c, idx) => {
      if (idx < period - 1) return null;
      const slice = candles.slice(idx - period + 1, idx + 1);
      const avg = slice.reduce((sum, item) => sum + item.close, 0) / period;
      return avg;
    });
  }, [candles]);

  // Dimensions
  const chartHeight = 360;
  const volumeHeight = 70;
  const paddingRight = 65; // Price axis on right
  const paddingBottom = 26; // Time axis
  const paddingTop = 15;

  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;

  const maxVolume = Math.max(...candles.map((c) => c.volume)) || 1;

  const activeCandle = hoveredCandle || candles[candles.length - 1];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const plotWidth = rect.width - paddingRight;
    if (x >= 0 && x <= plotWidth) {
      const idx = Math.floor((x / plotWidth) * candles.length);
      const clampedIdx = Math.max(0, Math.min(candles.length - 1, idx));
      setHoveredCandle(candles[clampedIdx]);
      setCrosshairPos({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setHoveredCandle(null);
    setCrosshairPos(null);
  };

  const isUp = item.change >= 0;

  return (
    <div className="w-full bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg overflow-hidden flex flex-col">
      {/* Top Chart Toolbar */}
      <div className="p-3 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex flex-wrap items-center justify-between gap-3 bg-[#f8f9fd] dark:bg-[#1e222d]/60">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base text-[#131722] dark:text-[#f0f3fa]">
              {item.symbol}
            </span>
            <span className="text-xs text-[#787b86] font-medium hidden md:inline">
              {item.exchange}
            </span>
          </div>

          <div className="h-4 w-[1px] bg-[#e0e3eb] dark:border-[#2a2e39]" />

          {/* Timeframe Selector Buttons */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-[#131722] p-0.5 rounded border border-[#e0e3eb] dark:border-[#2a2e39]">
            {(['1D', '5D', '1M', '3M', '1Y', 'ALL'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                  timeframe === tf
                    ? 'bg-[#2962ff] text-white font-semibold'
                    : 'text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Style Switcher */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-[#131722] p-0.5 rounded border border-[#e0e3eb] dark:border-[#2a2e39]">
            <button
              onClick={() => setChartType('candlestick')}
              title="Candlestick Chart"
              className={`p-1 rounded text-xs transition-colors ${
                chartType === 'candlestick'
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc]'
              }`}
            >
              <CandlestickChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('area')}
              title="Area Chart"
              className={`p-1 rounded text-xs transition-colors ${
                chartType === 'area'
                  ? 'bg-[#2962ff] text-white'
                  : 'text-[#787b86] hover:text-[#131722] dark:hover:text-[#d1d4dc]'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Indicators Toolbar */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setShowMA20(!showMA20)}
            className={`px-2 py-0.5 rounded border text-[11px] font-mono transition-colors ${
              showMA20
                ? 'border-[#2962ff] bg-[#2962ff]/10 text-[#2962ff] font-semibold'
                : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86]'
            }`}
          >
            MA 20
          </button>
          <button
            onClick={() => setShowMA50(!showMA50)}
            className={`px-2 py-0.5 rounded border text-[11px] font-mono transition-colors ${
              showMA50
                ? 'border-[#ff9800] bg-[#ff9800]/10 text-[#ff9800] font-semibold'
                : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86]'
            }`}
          >
            MA 50
          </button>
          <button
            onClick={() => setShowRSI(!showRSI)}
            className={`px-2 py-0.5 rounded border text-[11px] font-mono transition-colors ${
              showRSI
                ? 'border-[#ab47bc] bg-[#ab47bc]/10 text-[#ab47bc] font-semibold'
                : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86]'
            }`}
          >
            RSI 14
          </button>
        </div>
      </div>

      {/* Real-time OHLC Legend Header */}
      <div className="px-3 py-2 bg-white dark:bg-[#131722] border-b border-[#e0e3eb]/60 dark:border-[#2a2e39]/60 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <span className="text-[#787b86]">{activeCandle?.time}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#787b86]">O:</span>
          <span className="text-[#131722] dark:text-[#f0f3fa] font-medium">{activeCandle?.open.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#787b86]">H:</span>
          <span className="text-[#089981] font-medium">{activeCandle?.high.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#787b86]">L:</span>
          <span className="text-[#f23645] font-medium">{activeCandle?.low.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#787b86]">C:</span>
          <span className={`font-semibold ${activeCandle && activeCandle.close >= activeCandle.open ? 'text-[#089981]' : 'text-[#f23645]'}`}>
            {activeCandle?.close.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[#787b86]">Vol:</span>
          <span className="text-[#131722] dark:text-[#d1d4dc] font-medium">{activeCandle?.volume.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Interactive SVG Chart Canvas */}
      <div ref={containerRef} className="relative w-full h-[380px] bg-white dark:bg-[#131722] select-none cursor-crosshair">
        <svg
          className="w-full h-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          viewBox={`0 0 800 ${chartHeight}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2962ff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + ratio * (chartHeight - paddingTop - paddingBottom - volumeHeight);
            const priceVal = maxPrice - ratio * priceRange;
            return (
              <g key={`grid-h-${ratio}`}>
                <line
                  x1={0}
                  y1={y}
                  x2={800 - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-gray-100 dark:text-[#1e222d]"
                  strokeDasharray="3 3"
                />
                {/* Price Axis Label */}
                <text
                  x={800 - paddingRight + 8}
                  y={y + 4}
                  className="text-[10px] font-mono fill-[#787b86]"
                >
                  {priceVal >= 1000 ? priceVal.toFixed(1) : priceVal.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Vertical Gridlines */}
          {candles.filter((_, idx) => idx % 8 === 0).map((c, i) => {
            const originalIdx = candles.findIndex((item) => item.time === c.time);
            const x = (originalIdx / (candles.length - 1)) * (800 - paddingRight);
            return (
              <g key={`grid-v-${i}`}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={chartHeight - paddingBottom}
                  stroke="currentColor"
                  className="text-gray-100 dark:text-[#1e222d]"
                  strokeDasharray="3 3"
                />
                <text
                  x={x}
                  y={chartHeight - 8}
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-[#787b86]"
                >
                  {c.time.split(' ')[0]}
                </text>
              </g>
            );
          })}

          {/* Volume Bars */}
          {candles.map((c, idx) => {
            const plotWidth = 800 - paddingRight;
            const barWidth = Math.max(2, (plotWidth / candles.length) * 0.65);
            const x = (idx / (candles.length - 1)) * plotWidth - barWidth / 2;
            const barH = (c.volume / maxVolume) * (volumeHeight - 10);
            const y = chartHeight - paddingBottom - barH;
            const isBull = c.close >= c.open;

            return (
              <rect
                key={`vol-${idx}`}
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                fill={isBull ? '#089981' : '#f23645'}
                opacity="0.35"
              />
            );
          })}

          {/* Chart Representation: Area or Candlestick */}
          {chartType === 'area' ? (
            (() => {
              const plotWidth = 800 - paddingRight;
              const usableHeight = chartHeight - paddingTop - paddingBottom - volumeHeight;
              const points = candles.map((c, idx) => {
                const x = (idx / (candles.length - 1)) * plotWidth;
                const y = paddingTop + (1 - (c.close - minPrice) / priceRange) * usableHeight;
                return `${x.toFixed(1)},${y.toFixed(1)}`;
              });
              const lineD = `M ${points.join(' L ')}`;
              const areaD = `${lineD} L ${plotWidth},${chartHeight - paddingBottom - volumeHeight} L 0,${chartHeight - paddingBottom - volumeHeight} Z`;

              return (
                <g>
                  <path d={areaD} fill="url(#areaGrad)" />
                  <path d={lineD} fill="none" stroke="#2962ff" strokeWidth="2" />
                </g>
              );
            })()
          ) : (
            // Candlesticks
            candles.map((c, idx) => {
              const plotWidth = 800 - paddingRight;
              const usableHeight = chartHeight - paddingTop - paddingBottom - volumeHeight;
              const x = (idx / (candles.length - 1)) * plotWidth;
              const candleWidth = Math.max(3, (plotWidth / candles.length) * 0.6);

              const highY = paddingTop + (1 - (c.high - minPrice) / priceRange) * usableHeight;
              const lowY = paddingTop + (1 - (c.low - minPrice) / priceRange) * usableHeight;
              const openY = paddingTop + (1 - (c.open - minPrice) / priceRange) * usableHeight;
              const closeY = paddingTop + (1 - (c.close - minPrice) / priceRange) * usableHeight;

              const isBull = c.close >= c.open;
              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));
              const color = isBull ? '#089981' : '#f23645';

              return (
                <g key={`candle-${idx}`}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={color}
                    strokeWidth="1.2"
                  />
                  {/* Candle Body */}
                  <rect
                    x={x - candleWidth / 2}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    stroke={color}
                    strokeWidth="0.8"
                  />
                </g>
              );
            })
          )}

          {/* Moving Average 20 Overlay */}
          {showMA20 && (
            (() => {
              const plotWidth = 800 - paddingRight;
              const usableHeight = chartHeight - paddingTop - paddingBottom - volumeHeight;
              const maPoints: string[] = [];

              ma20Data.forEach((val, idx) => {
                if (val !== null) {
                  const x = (idx / (candles.length - 1)) * plotWidth;
                  const y = paddingTop + (1 - (val - minPrice) / priceRange) * usableHeight;
                  maPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
                }
              });

              if (maPoints.length > 1) {
                return (
                  <path
                    d={`M ${maPoints.join(' L ')}`}
                    fill="none"
                    stroke="#2962ff"
                    strokeWidth="1.5"
                    opacity="0.85"
                  />
                );
              }
              return null;
            })()
          )}

          {/* Moving Average 50 Overlay */}
          {showMA50 && (
            (() => {
              const plotWidth = 800 - paddingRight;
              const usableHeight = chartHeight - paddingTop - paddingBottom - volumeHeight;
              const maPoints: string[] = [];

              ma50Data.forEach((val, idx) => {
                if (val !== null) {
                  const x = (idx / (candles.length - 1)) * plotWidth;
                  const y = paddingTop + (1 - (val - minPrice) / priceRange) * usableHeight;
                  maPoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
                }
              });

              if (maPoints.length > 1) {
                return (
                  <path
                    d={`M ${maPoints.join(' L ')}`}
                    fill="none"
                    stroke="#ff9800"
                    strokeWidth="1.5"
                    opacity="0.85"
                  />
                );
              }
              return null;
            })()
          )}

          {/* Current Live Price Indicator Line on Right Axis */}
          {(() => {
            const plotWidth = 800 - paddingRight;
            const usableHeight = chartHeight - paddingTop - paddingBottom - volumeHeight;
            const currentY = paddingTop + (1 - (item.price - minPrice) / priceRange) * usableHeight;
            const badgeColor = isUp ? '#089981' : '#f23645';

            return (
              <g>
                <line
                  x1={0}
                  y1={currentY}
                  x2={plotWidth}
                  y2={currentY}
                  stroke={badgeColor}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <rect
                  x={plotWidth}
                  y={currentY - 10}
                  width={paddingRight}
                  height={20}
                  fill={badgeColor}
                  rx="2"
                />
                <text
                  x={plotWidth + 6}
                  y={currentY + 4}
                  className="text-[11px] font-mono font-semibold fill-white"
                >
                  {item.price.toFixed(2)}
                </text>
              </g>
            );
          })()}

          {/* Interactive Crosshairs */}
          {crosshairPos && (
            <g>
              {/* Vertical line */}
              <line
                x1={crosshairPos.x}
                y1={paddingTop}
                x2={crosshairPos.x}
                y2={chartHeight - paddingBottom}
                stroke="#787b86"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.75"
              />
              {/* Horizontal line */}
              <line
                x1={0}
                y1={crosshairPos.y}
                x2={800 - paddingRight}
                y2={crosshairPos.y}
                stroke="#787b86"
                strokeWidth="1"
                strokeDasharray="3 3"
                opacity="0.75"
              />
              {/* Price badge on axis */}
              {(() => {
                const usableHeight = chartHeight - paddingTop - paddingBottom - volumeHeight;
                const hoveredPrice = maxPrice - ((crosshairPos.y - paddingTop) / usableHeight) * priceRange;
                return (
                  <g>
                    <rect
                      x={800 - paddingRight}
                      y={crosshairPos.y - 9}
                      width={paddingRight}
                      height={18}
                      className="fill-[#131722] dark:fill-[#2a2e39]"
                      rx="2"
                    />
                    <text
                      x={800 - paddingRight + 6}
                      y={crosshairPos.y + 4}
                      className="text-[10px] font-mono fill-white"
                    >
                      {hoveredPrice.toFixed(2)}
                    </text>
                  </g>
                );
              })()}
            </g>
          )}
        </svg>
      </div>

      {/* RSI 14 Sub-Panel (if toggled) */}
      {showRSI && (
        <div className="border-t border-[#e0e3eb] dark:border-[#2a2e39] p-3 bg-[#f8f9fd] dark:bg-[#1e222d]/40">
          <div className="flex items-center justify-between text-xs mb-1 font-mono">
            <span className="text-[#ab47bc] font-semibold">RSI (14, Close)</span>
            <span className="text-[#131722] dark:text-[#f0f3fa] font-bold">58.42 (Neutral / Bullish)</span>
          </div>
          <div className="h-12 w-full bg-white dark:bg-[#131722] rounded border border-[#e0e3eb] dark:border-[#2a2e39] relative overflow-hidden flex items-center px-2">
            <div className="w-full flex items-center justify-between text-[9px] text-[#787b86] font-mono absolute top-1 px-2">
              <span>70 (Overbought)</span>
              <span>30 (Oversold)</span>
            </div>
            {/* Simple RSI wave */}
            <svg className="w-full h-8" viewBox="0 0 400 30" preserveAspectRatio="none">
              <line x1="0" y1="9" x2="400" y2="9" stroke="#787b86" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.4" />
              <line x1="0" y1="21" x2="400" y2="21" stroke="#787b86" strokeDasharray="2 2" strokeWidth="0.8" opacity="0.4" />
              <path
                d="M 0 16 Q 50 12, 100 20 T 200 14 T 300 18 T 400 12"
                fill="none"
                stroke="#ab47bc"
                strokeWidth="1.8"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};
