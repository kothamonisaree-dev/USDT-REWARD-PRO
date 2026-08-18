import React, { useState, useEffect, useRef } from 'react';
import { CryptoTicker, WalletState, TradeRecord } from '../types';
import { generateInitialCandles, CandlestickPoint } from '../services/binance';
import { TrendingUp, TrendingDown, Clock, ShieldCheck, Lock, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LiveTradingEngineProps {
  tickers: CryptoTicker[];
  wallet: WalletState;
  userId: string;
  onTradeCompleted: (record: TradeRecord, newWalletBalance: number) => void;
  onAddNotification: (title: string, message: string) => void;
}

export const LiveTradingEngine: React.FC<LiveTradingEngineProps> = ({
  tickers,
  wallet,
  userId,
  onTradeCompleted,
  onAddNotification
}) => {
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTCUSDT');
  const activeTicker = tickers.find(t => t.symbol === selectedSymbol) || tickers[0];

  // Duration selection
  const [tradingDuration, setTradingDuration] = useState<number>(90); // 90s, 180s, 300s
  const [returnRate, setReturnRate] = useState<number>(20); // 20%, 30%, 50%

  // Candlestick points state
  const [candles, setCandles] = useState<CandlestickPoint[]>([]);

  // Trade Modal
  const [tradeDirection, setTradeDirection] = useState<'BUY' | 'SELL' | null>(null);
  const [tradeAmount, setTradeAmount] = useState<number>(100);
  const [tradePassword, setTradePassword] = useState<string>('');
  const [tradeError, setTradeError] = useState<string>('');

  // Active Live Trade execution
  const [activeTrade, setActiveTrade] = useState<{
    asset: string;
    direction: 'BUY' | 'SELL';
    amount: number;
    entryPrice: number;
    durationSeconds: number;
    startTime: number;
    endTime: number;
    secondsRemaining: number;
    returnPercentage: number;
  } | null>(null);

  // Result card overlay
  const [lastResult, setLastResult] = useState<TradeRecord | null>(null);

  // Synchronized refs to prevent timer drift and stale closures
  const candlesRef = useRef(candles);
  candlesRef.current = candles;
  const activeTickerRef = useRef(activeTicker);
  activeTickerRef.current = activeTicker;
  const walletRef = useRef(wallet);
  walletRef.current = wallet;
  const onTradeCompletedRef = useRef(onTradeCompleted);
  onTradeCompletedRef.current = onTradeCompleted;
  const onAddNotificationRef = useRef(onAddNotification);
  onAddNotificationRef.current = onAddNotification;

  // Initialize & update candlestick data live
  useEffect(() => {
    if (activeTicker) {
      const initial = generateInitialCandles(activeTicker.price, 35);
      setCandles(initial);
    }
  }, [selectedSymbol]);

  // Live candlestick updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => {
        if (prev.length === 0) return prev;
        const last = prev[prev.length - 1];
        const variation = (Math.random() - 0.48) * (activeTicker.price * 0.002);
        const newClose = Math.max(0.01, last.close + variation);
        const newHigh = Math.max(last.high, newClose);
        const newLow = Math.min(last.low, newClose);

        const updatedLast = {
          ...last,
          high: Number(newHigh.toFixed(2)),
          low: Number(newLow.toFixed(2)),
          close: Number(newClose.toFixed(2))
        };

        return [...prev.slice(0, -1), updatedLast];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTicker.price]);

  // Precision Real-Time Active Trade Live Countdown (immune to re-render latency and drift)
  useEffect(() => {
    if (!activeTrade) return;

    const targetEndTime = activeTrade.endTime;

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingMs = targetEndTime - now;
      const remainingSecs = Math.max(0, Math.ceil(remainingMs / 1000));

      if (remainingSecs <= 0 || remainingMs <= 0) {
        clearInterval(interval);

        // When countdown reaches ZERO -> Calculate Exit Price & Win/Loss with latest data
        const latestCandles = candlesRef.current;
        const latestTicker = activeTickerRef.current;
        const currentWallet = walletRef.current;

        const exitPrice = latestCandles.length > 0 
          ? latestCandles[latestCandles.length - 1].close 
          : (latestTicker?.price || activeTrade.entryPrice);

        const isWin = activeTrade.direction === 'BUY' 
          ? exitPrice >= activeTrade.entryPrice 
          : exitPrice <= activeTrade.entryPrice;

        const profitAmount = isWin ? (activeTrade.amount * activeTrade.returnPercentage) / 100 : 0;
        const totalReturned = isWin ? activeTrade.amount + profitAmount : 0;
        const status: 'WIN' | 'LOSS' = isWin ? 'WIN' : 'LOSS';

        // Format LA Timezone
        const nowObj = new Date();
        const laTimeStr = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Los_Angeles',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(nowObj) + ' (LA, USA)';

        const record: TradeRecord = {
          id: `TRD-${Math.floor(100000 + Math.random() * 900000)}`,
          asset: activeTrade.asset,
          direction: activeTrade.direction,
          amount: activeTrade.amount,
          entryPrice: activeTrade.entryPrice,
          exitPrice,
          returnPercentage: activeTrade.returnPercentage,
          profitAmount,
          totalReturned,
          status,
          durationSeconds: activeTrade.durationSeconds,
          timestamp: laTimeStr
        };

        const newWalletBalance = isWin 
          ? currentWallet.usdtBalance + profitAmount 
          : Math.max(0, currentWallet.usdtBalance - activeTrade.amount);

        setLastResult(record);
        setActiveTrade(null);
        onTradeCompletedRef.current(record, newWalletBalance);

        if (isWin) {
          confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
          onAddNotificationRef.current(
            '✅ Trade Completed Successfully',
            `🎉 Congratulations! You earned +$${profitAmount.toFixed(2)} USD on ${record.asset}. Wallet balance updated.`
          );
        } else {
          onAddNotificationRef.current(
            '❌ Trade Finished',
            `📉 Trade finished on ${record.asset}. Better luck next time. Wallet balance updated.`
          );
        }
      } else {
        setActiveTrade(prev => {
          if (!prev || prev.secondsRemaining === remainingSecs) return prev;
          return { ...prev, secondsRemaining: remainingSecs };
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeTrade?.endTime]);

  // Handle duration choice
  const handleSelectDuration = (dur: number) => {
    setTradingDuration(dur);
    if (dur === 90) setReturnRate(20);
    else if (dur === 180) setReturnRate(30);
    else setReturnRate(50);
  };

  const handleOpenTradeModal = (dir: 'BUY' | 'SELL') => {
    if (activeTrade) {
      alert('A trade countdown is currently running! Please wait.');
      return;
    }
    setTradeDirection(dir);
    setTradeAmount(100);
    setTradePassword('');
    setTradeError('');
  };

  const handleStartTrade = () => {
    if (!tradeDirection) return;
    if (tradeAmount < 50) {
      setTradeError('Minimum investment is $50 USD');
      return;
    }
    if (tradeAmount > wallet.usdtBalance) {
      setTradeError(`Insufficient wallet balance ($${wallet.usdtBalance.toFixed(2)} available)`);
      return;
    }
    if (!tradePassword || tradePassword.length < 4) {
      setTradeError('Trading Password required (min 4 characters)');
      return;
    }

    const currentPrice = candles.length > 0 ? candles[candles.length - 1].close : activeTicker.price;
    const now = Date.now();

    setActiveTrade({
      asset: activeTicker.name,
      direction: tradeDirection,
      amount: tradeAmount,
      entryPrice: currentPrice,
      durationSeconds: tradingDuration,
      startTime: now,
      endTime: now + tradingDuration * 1000,
      secondsRemaining: tradingDuration,
      returnPercentage: returnRate
    });

    setTradeDirection(null);
  };

  // Min/Max bounds for candlestick SVG chart
  const prices = candles.flatMap(c => [c.high, c.low]);
  const minPrice = prices.length ? Math.min(...prices) * 0.999 : 1;
  const maxPrice = prices.length ? Math.max(...prices) * 1.001 : 2;
  const priceRange = maxPrice - minPrice || 1;

  return (
    <div className="my-6 space-y-6">
      
      {/* Top Asset Tickers Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tickers.map(ticker => {
          const isSelected = ticker.symbol === selectedSymbol;
          const isUp = ticker.change24h >= 0;
          return (
            <button
              key={ticker.symbol}
              onClick={() => setSelectedSymbol(ticker.symbol)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border shrink-0 transition-all font-mono text-xs ${
                isSelected 
                  ? 'bg-[#0D121F] border-[#F4C542] text-slate-100 shadow-[0_0_15px_rgba(244,197,66,0.2)]' 
                  : 'bg-[#080D18] border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <img src={ticker.icon} alt={ticker.name} className="w-5 h-5 rounded-full" />
              <div className="flex flex-col text-left">
                <span className="font-bold text-slate-200">{ticker.symbol.replace('USDT', '')}/USDT</span>
                <span className="text-[10px] text-slate-400">${ticker.price.toFixed(2)}</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isUp ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {isUp ? '+' : ''}{ticker.change24h.toFixed(2)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Trading Stage Header */}
      <div className="glass-gold-card p-4 sm:p-6 relative overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img src={activeTicker.icon} alt={activeTicker.name} className="w-8 h-8 rounded-full" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-100 font-mono">
                  {activeTicker.name} ({activeTicker.symbol})
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  LIVE BINANCE TICK
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                <span>User ID: <strong className="text-slate-200">{userId}</strong></span>
                <span>•</span>
                <span>24h High: <strong className="text-emerald-400">${activeTicker.high24h.toFixed(2)}</strong></span>
                <span>•</span>
                <span>24h Low: <strong className="text-red-400">${activeTicker.low24h.toFixed(2)}</strong></span>
              </div>
            </div>
          </div>

          {/* Current Live Market Price Display */}
          <div className="text-right font-mono">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
              ${activeTicker.price.toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">
              Live Price (USD)
            </span>
          </div>
        </div>

        {/* Duration Selectors Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 my-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Trading Duration:</span>
            {[
              { duration: 90, rate: 20 },
              { duration: 180, rate: 30 },
              { duration: 300, rate: 50 }
            ].map(item => (
              <button
                key={item.duration}
                onClick={() => handleSelectDuration(item.duration)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-mono transition-all ${
                  tradingDuration === item.duration
                    ? 'bg-[#F4C542] text-black border-[#F4C542] shadow-[0_0_12px_rgba(244,197,66,0.3)]'
                    : 'bg-[#080D18] text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {item.duration}s ({item.rate}% Return)
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-300 font-mono bg-[#080D18] px-3 py-1.5 rounded-xl border border-slate-800">
            Expected Profit Rate: <strong className="text-[#F4C542]">+{returnRate}%</strong>
          </div>
        </div>

        {/* CANDLESTICK CHART AREA */}
        <div className="relative w-full h-[320px] bg-[#050811] rounded-2xl border border-slate-800 p-3 overflow-hidden my-4">
          
          {/* Active Trade Background Countdown Overlay */}
          {activeTrade && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-4">
              <div className="relative w-36 h-36 flex items-center justify-center mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="60" stroke="rgba(244,197,66,0.2)" strokeWidth="8" fill="none" />
                  <circle 
                    cx="72" cy="72" r="60" 
                    stroke={activeTrade.direction === 'BUY' ? '#10B981' : '#EF4444'} 
                    strokeWidth="8" 
                    fill="none" 
                    strokeDasharray="377" 
                    strokeDashoffset={377 - (377 * activeTrade.secondsRemaining) / activeTrade.durationSeconds}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-white font-mono">
                    {activeTrade.secondsRemaining}
                  </span>
                  <span className="text-[10px] text-slate-300 uppercase tracking-widest">Seconds</span>
                </div>
              </div>

              <div className="text-center font-mono space-y-1">
                <div className="text-sm font-bold text-slate-200">
                  Position: <span className={activeTrade.direction === 'BUY' ? 'text-emerald-400' : 'text-red-400'}>{activeTrade.direction} ${activeTrade.amount}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Entry Price: <strong className="text-slate-100">${activeTrade.entryPrice.toFixed(2)}</strong>
                </div>
              </div>
            </div>
          )}

          {/* SVG Candlestick Chart */}
          <svg className="w-full h-full" preserveAspectRatio="none">
            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75].map((ratio, idx) => (
              <line
                key={idx}
                x1="0"
                y1={320 * ratio}
                x2="100%"
                y2={320 * ratio}
                stroke="#1e293b"
                strokeDasharray="4"
              />
            ))}

            {/* Render Candlesticks */}
            {candles.map((candle, idx) => {
              const width = 100 / candles.length;
              const x = idx * width + width / 2;
              
              const isBullish = candle.close >= candle.open;
              const color = isBullish ? '#10B981' : '#EF4444';

              const yHigh = 320 - ((candle.high - minPrice) / priceRange) * 280 - 20;
              const yLow = 320 - ((candle.low - minPrice) / priceRange) * 280 - 20;
              const yOpen = 320 - ((candle.open - minPrice) / priceRange) * 280 - 20;
              const yClose = 320 - ((candle.close - minPrice) / priceRange) * 280 - 20;

              const rectTop = Math.min(yOpen, yClose);
              const rectHeight = Math.max(2, Math.abs(yOpen - yClose));

              return (
                <g key={idx}>
                  {/* High/Low Wick */}
                  <line
                    x1={`${x}%`}
                    y1={yHigh}
                    x2={`${x}%`}
                    y2={yLow}
                    stroke={color}
                    strokeWidth="1.5"
                  />
                  {/* Body */}
                  <rect
                    x={`${idx * width + width * 0.15}%`}
                    y={rectTop}
                    width={`${width * 0.7}%`}
                    height={rectHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* BUY / SELL PANEL */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => handleOpenTradeModal('BUY')}
            disabled={!!activeTrade}
            className={`py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 active:scale-98 ${
              activeTrade ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowUpRight className="w-6 h-6" /> BUY (Call / Green)
          </button>

          <button
            onClick={() => handleOpenTradeModal('SELL')}
            disabled={!!activeTrade}
            className={`py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all hover:brightness-110 active:scale-98 ${
              activeTrade ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <ArrowDownRight className="w-6 h-6" /> SELL (Put / Red)
          </button>
        </div>

      </div>

      {/* Trade Modal */}
      {tradeDirection && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-gold-card max-w-md w-full p-6 relative">
            <button 
              onClick={() => setTradeDirection(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                tradeDirection === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                Position: {tradeDirection}
              </span>
              <span className="text-xs text-slate-400">{activeTicker.symbol} ({tradingDuration}s)</span>
            </div>

            <h3 className="text-xl font-extrabold text-slate-100">Configure Trade Position</h3>

            <div className="space-y-4 my-5">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  Investment Amount (Min $50 USD)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTradeAmount(prev => Math.max(50, prev - 50))}
                    className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-700"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-slate-100"
                  />
                  <button
                    onClick={() => setTradeAmount(prev => prev + 50)}
                    className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold text-lg hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#F4C542]" /> Trading Password
                </label>
                <input
                  type="password"
                  value={tradePassword}
                  onChange={(e) => setTradePassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#080D18] border border-slate-800 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Duration:</span>
                  <span className="font-bold text-slate-200">{tradingDuration} Seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Return Rate:</span>
                  <span className="font-bold text-emerald-400">+{returnRate}%</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800 font-bold">
                  <span className="text-slate-200">Expected Profit:</span>
                  <span className="text-[#F4C542]">+${((tradeAmount * returnRate) / 100).toFixed(2)} USD</span>
                </div>
              </div>

              {tradeError && (
                <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  ⚠️ {tradeError}
                </div>
              )}

              <button
                onClick={handleStartTrade}
                className={`w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg ${
                  tradeDirection === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                Start Trading Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result Card Modal */}
      {lastResult && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-gold-card max-w-md w-full p-6 text-center relative">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 ${
              lastResult.status === 'WIN' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500' : 'bg-red-500/20 text-red-400 border border-red-500'
            }`}>
              {lastResult.status === 'WIN' ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>

            <h3 className={`text-2xl font-extrabold ${lastResult.status === 'WIN' ? 'text-emerald-400' : 'text-red-400'}`}>
              TRADE {lastResult.status}
            </h3>

            <div className="my-4 p-4 rounded-2xl bg-[#080D18] border border-slate-800 space-y-2 text-xs font-mono text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Trade ID:</span>
                <span className="text-slate-200 font-bold">{lastResult.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Asset & Direction:</span>
                <span className="text-slate-200">{lastResult.asset} ({lastResult.direction})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Entry Price:</span>
                <span className="text-slate-200">${lastResult.entryPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Exit Price:</span>
                <span className="text-slate-200">${lastResult.exitPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Investment Amount:</span>
                <span className="text-slate-200">${lastResult.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                <span className="text-slate-200">Return Amount:</span>
                <span className={lastResult.status === 'WIN' ? 'text-emerald-400' : 'text-red-400'}>
                  ${lastResult.totalReturned.toFixed(2)}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 text-right">
                Time: {lastResult.timestamp}
              </div>
            </div>

            <button
              onClick={() => setLastResult(null)}
              className="w-full py-3 btn-gold-gradient text-xs font-bold text-black"
            >
              Continue Trading
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
