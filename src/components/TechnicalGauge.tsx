import React from 'react';
import { TechnicalRating } from '../types/market';

interface TechnicalGaugeProps {
  rating: TechnicalRating;
  symbol: string;
}

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({ rating, symbol }) => {
  // Map rating to angle in degrees from -90 to +90
  const ratingMap: Record<TechnicalRating, { angle: number; color: string; label: string; oscillators: { sell: number; neutral: number; buy: number }; ma: { sell: number; neutral: number; buy: number } }> = {
    'Strong Sell': { 
      angle: -72, 
      color: '#f23645', 
      label: 'Strong Sell',
      oscillators: { sell: 7, neutral: 2, buy: 1 },
      ma: { sell: 12, neutral: 1, buy: 1 }
    },
    'Sell': { 
      angle: -36, 
      color: '#ff6d00', 
      label: 'Sell',
      oscillators: { sell: 5, neutral: 4, buy: 2 },
      ma: { sell: 9, neutral: 2, buy: 3 }
    },
    'Neutral': { 
      angle: 0, 
      color: '#787b86', 
      label: 'Neutral',
      oscillators: { sell: 3, neutral: 6, buy: 2 },
      ma: { sell: 6, neutral: 2, buy: 6 }
    },
    'Buy': { 
      angle: 36, 
      color: '#22ab94', 
      label: 'Buy',
      oscillators: { sell: 2, neutral: 3, buy: 6 },
      ma: { sell: 3, neutral: 1, buy: 10 }
    },
    'Strong Buy': { 
      angle: 72, 
      color: '#089981', 
      label: 'Strong Buy',
      oscillators: { sell: 1, neutral: 2, buy: 8 },
      ma: { sell: 1, neutral: 0, buy: 13 }
    },
  };

  const current = ratingMap[rating] || ratingMap['Buy'];

  return (
    <div className="bg-[#f8f9fd] dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg p-4 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-[#131722] dark:text-[#f0f3fa]">
          Technical Rating
        </span>
        <span className="text-[11px] text-[#787b86] font-mono">1D Timeframe</span>
      </div>

      {/* Speedometer Gauge Arc */}
      <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden my-1">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Background Arc Sectors */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f23645" />
              <stop offset="25%" stopColor="#ff9800" />
              <stop offset="50%" stopColor="#787b86" />
              <stop offset="75%" stopColor="#22ab94" />
              <stop offset="100%" stopColor="#089981" />
            </linearGradient>
          </defs>

          {/* Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-gray-200 dark:text-[#2a2e39]"
            strokeLinecap="round"
          />

          {/* Gradient Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Center Pivot */}
          <circle cx="100" cy="100" r="7" className="fill-[#131722] dark:fill-white" />
          <circle cx="100" cy="100" r="3" fill="#2962ff" />

          {/* Gauge Needle */}
          <g
            style={{
              transform: `rotate(${current.angle}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="28"
              stroke="#2962ff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      {/* Main Rating Badge */}
      <div
        className="font-bold text-sm tracking-tight mb-3"
        style={{ color: current.color }}
      >
        {current.label.toUpperCase()}
      </div>

      {/* Breakdown: Oscillators & Moving Averages */}
      <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-[#e0e3eb] dark:border-[#2a2e39] text-center text-xs">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#787b86] font-medium uppercase tracking-wider mb-1">
            Oscillators
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-[#f23645]">{current.oscillators.sell}</span>
            <span className="text-[#787b86]">/</span>
            <span className="text-[#787b86]">{current.oscillators.neutral}</span>
            <span className="text-[#787b86]">/</span>
            <span className="text-[#089981]">{current.oscillators.buy}</span>
          </div>
          <span className="text-[10px] text-[#787b86] mt-0.5">Sell / Neutral / Buy</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#787b86] font-medium uppercase tracking-wider mb-1">
            Moving Averages
          </span>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-[#f23645]">{current.ma.sell}</span>
            <span className="text-[#787b86]">/</span>
            <span className="text-[#787b86]">{current.ma.neutral}</span>
            <span className="text-[#787b86]">/</span>
            <span className="text-[#089981]">{current.ma.buy}</span>
          </div>
          <span className="text-[10px] text-[#787b86] mt-0.5">Sell / Neutral / Buy</span>
        </div>
      </div>
    </div>
  );
};
