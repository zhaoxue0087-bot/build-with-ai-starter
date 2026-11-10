export type AssetCategory = 'overview' | 'stocks' | 'crypto' | 'forex' | 'indices' | 'futures' | 'bonds' | 'heatmap';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketItem {
  symbol: string;
  name: string;
  category: 'stocks' | 'crypto' | 'forex' | 'indices' | 'futures' | 'bonds';
  subcategory?: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: string;
  volumeNum: number;
  marketCap?: string;
  marketCapNum?: number;
  peRatio?: number;
  divYield?: string;
  sparkline: number[];
  rating: TechnicalRating;
  currency: string;
  exchange: string;
  description: string;
  sector?: string;
  beta?: number;
  high52w?: number;
  low52w?: number;
  avgVolume?: string;
  eps?: number;
}

export interface MarketNews {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  relatedSymbol: string;
  url: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  flag: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast: string;
  previous: string;
}

export interface HeatmapItem {
  symbol: string;
  name: string;
  sector: string;
  marketCap: number;
  changePercent: number;
  price: number;
}
