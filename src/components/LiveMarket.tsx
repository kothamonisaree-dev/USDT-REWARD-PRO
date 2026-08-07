import React, { useState } from 'react';
import { CryptoTicker } from '../types';
import { TrendingUp, TrendingDown, Activity, Sparkles } from 'lucide-react';

interface LiveMarketProps {
  tickers: CryptoTicker[];
  onSelectTicker: (symbol: string) => void;
}

export const LiveMarket: React.FC<LiveMarketProps> = ({ tickers, onSelectTicker }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'gainers' | 'losers' | 'trending'>('all');

  const filteredTickers = [...tickers].sort((a, b) => {
    if (activeTab === 'gainers') return b.change24h - a.change24h;
    if (activeTab === 'losers') return a.change24h - b.change24h;
    if (activeTab === 'trending') return b.volume24h - a.volume24h;
    return 0;
  });

  return (
    <section className="my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 text-[#F4C542] text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" /> Live Market Feed
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-0.5">
            Cryptocurrency Market Tickers
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#080D18] border border-slate-800 text-xs">
          {[
            { id: 'all', label: 'All Coins' },
            { id: 'gainers', label: 'Top Gainers' },
            { id: 'losers', label: 'Top Losers' },
            { id: 'trending', label: 'Trending' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#F4C542] text-black shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Coins Table / Grid */}
      <div className="glass-gold-card overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-[#080D18]/80">
              <th className="p-4">Asset Name</th>
              <th className="p-4">Price (USD)</th>
              <th className="p-4">24h Change</th>
              <th className="p-4">24h High / Low</th>
              <th className="p-4">Mini Trend</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {filteredTickers.map(ticker => {
              const isUp = ticker.change24h >= 0;
              return (
                <tr 
                  key={ticker.symbol} 
                  className="hover:bg-[#F4C542]/5 transition-colors group cursor-pointer"
                  onClick={() => onSelectTicker(ticker.symbol)}
                >
                  {/* Asset */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={ticker.icon} alt={ticker.name} className="w-8 h-8 rounded-full" />
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-100 group-hover:text-[#F4C542] transition-colors">
                          {ticker.name}
                        </span>
                        <span className="text-[10px] text-slate-400">{ticker.symbol}</span>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="p-4 font-bold text-slate-100">
                    ${ticker.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  {/* 24h Change */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-[11px] ${
                      isUp ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'
                    }`}>
                      {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isUp ? '+' : ''}{ticker.change24h.toFixed(2)}%
                    </span>
                  </td>

                  {/* High / Low */}
                  <td className="p-4 text-slate-300 text-[11px]">
                    <div>H: <span className="text-emerald-400">${ticker.high24h.toLocaleString()}</span></div>
                    <div>L: <span className="text-red-400">${ticker.low24h.toLocaleString()}</span></div>
                  </td>

                  {/* Sparkline */}
                  <td className="p-4 w-32">
                    <div className="h-8 flex items-end gap-1">
                      {ticker.sparkline.map((val, i) => {
                        const min = Math.min(...ticker.sparkline);
                        const max = Math.max(...ticker.sparkline);
                        const range = max - min || 1;
                        const height = Math.max(15, ((val - min) / range) * 100);
                        return (
                          <div
                            key={i}
                            className={`flex-1 rounded-t ${isUp ? 'bg-emerald-500/80' : 'bg-red-500/80'}`}
                            style={{ height: `${height}%` }}
                          />
                        );
                      })}
                    </div>
                  </td>

                  {/* Action Button */}
                  <td className="p-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTicker(ticker.symbol);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#080D18] border border-[#F4C542]/40 text-[#F4C542] hover:bg-[#F4C542] hover:text-black font-bold text-xs transition-colors"
                    >
                      Trade Now
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
