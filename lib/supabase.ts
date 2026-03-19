import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 타입 정의
export interface Stock {
  id: string;
  symbol: string;
  name: string;
  market: 'KR' | 'US';
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  updated_at: string;
}

export interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  value: number;
  change: number;
  change_percent: number;
  updated_at: string;
}

export interface StockHistory {
  id: string;
  stock_id: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
