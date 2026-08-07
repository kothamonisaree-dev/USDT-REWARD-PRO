import React, { useState } from 'react';
import { Gift, Sparkles, CheckCircle2, Lock, Upload, ArrowRight, ShieldCheck, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BonusRewardCenterProps {
  onClaimWelcomeBonus: (amount: number) => void;
}

export const BonusRewardCenter: React.FC<BonusRewardCenterProps> = ({ onClaimWelcomeBonus }) => {
  const [welcomeClaimed, setWelcomeClaimed] = useState(false);
  const [day1Status, setDay1Status] = useState<'available' | 'pending' | 'completed'>('available');
  const [day2Status, setDay2Status] = useState<'locked' | 'available' | 'completed'>('locked');
  const [day3Status, setDay3Status] = useState<'locked' | 'available' | 'completed'>('locked');

  // Task Submission form state
  const [taskIdInput, setTaskIdInput] = useState('');
  const [txIdInput, setTxIdInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [submittedTask, setSubmittedTask] = useState(false);

  const completedCount = (day1Status === 'completed' ? 1 : 0) + (day2Status === 'completed' ? 1 : 0) + (day3Status === 'completed' ? 1 : 0);
  const progressPercent = Math.round((completedCount / 3) * 100);

  const handleClaimWelcome = () => {
    if (welcomeClaimed) return;
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setWelcomeClaimed(true);
    onClaimWelcomeBonus(5.00);
  };

  const handleStartTask1 = () => {
    setDay1Status('pending');
  };

  const handleSubmitTaskForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskIdInput || !txIdInput) {
      alert('Please fill out Task ID and Transaction ID');
      return;
    }
    setSubmittedTask(true);
    if (day1Status === 'pending') {
      setDay1Status('completed');
      setDay2Status('available');
    } else if (day2Status === 'available') {
      setDay2Status('completed');
      setDay3Status('available');
    } else if (day3Status === 'available') {
      setDay3Status('completed');
    }
    setTimeout(() => setSubmittedTask(false), 3000);
  };

  return (
    <div className="my-6 space-y-6">
      
      {/* Header */}
      <div className="glass-gold-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#F4C542] text-xs font-bold uppercase tracking-wider mb-1">
            <Gift className="w-4 h-4" /> Platform Rewards & Incentives
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">🎁 Bonus Reward Center</h2>
          <p className="text-xs text-slate-400 mt-1">
            Complete promotional tasks, unlock new levels, and earn platform rewards.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#080D18] border border-[#F4C542]/40 text-xs font-mono font-bold text-[#F4C542]">
          <Trophy className="w-4 h-4" /> Level 1 Active Trader
        </div>
      </div>

      {/* Welcome Bonus Card */}
      <div className="glass-gold-card p-6 relative overflow-hidden bg-gradient-to-r from-[#0D121F] via-[#0B1220] to-[#121A2D]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B8860B] to-[#FFD700] p-0.5 shadow-lg shadow-[#F4C542]/20 shrink-0">
              <div className="w-full h-full bg-[#050505] rounded-[14px] flex items-center justify-center text-[#F4C542]">
                <Sparkles className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">🎉 Welcome Bonus</div>
              <h3 className="text-lg font-extrabold text-slate-100 mt-0.5">🎁 New Member Sign-Up Bonus</h3>
              <p className="text-xs text-slate-400 mt-1">Instant $5.00 USDT credited directly to your wallet balance.</p>
            </div>
          </div>

          <button
            onClick={handleClaimWelcome}
            disabled={welcomeClaimed}
            className={`px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 ${
              welcomeClaimed
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 cursor-default'
                : 'btn-gold-gradient text-black animate-gold-pulse'
            }`}
          >
            {welcomeClaimed ? '✔ $5.00 Bonus Claimed' : 'Claim $5.00 Bonus'}
          </button>
        </div>
      </div>

      {/* Level 1 Promotional Tasks */}
      <div className="glass-gold-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-100">⭐ Level 1 Promotional Tasks</h3>
            <p className="text-xs text-slate-400 mt-0.5">Complete daily tasks to unlock Level 2 rewards</p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-300">Progress: <strong className="text-[#F4C542]">{completedCount} / 3 Completed</strong></span>
            <div className="w-28 h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div className="h-full bg-gradient-to-r from-[#F4C542] to-[#FFD700] rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs font-bold text-[#F4C542]">{progressPercent}%</span>
          </div>
        </div>

        {/* 3 Day Task Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Day 1 */}
          <div className="p-4 rounded-2xl bg-[#080D18] border border-slate-800 space-y-3 relative">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-[#F4C542] font-mono">📅 Day 1 Task</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                Reward: $16.25
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-100">Complete Task 1</h4>
            <p className="text-xs text-slate-400">Execute your first trade or submit task info below.</p>
            
            {day1Status === 'completed' ? (
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Completed & Claimed
              </div>
            ) : day1Status === 'pending' ? (
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                ⏳ Task Under Review
              </div>
            ) : (
              <button
                onClick={handleStartTask1}
                className="w-full py-2.5 btn-gold-gradient text-xs font-bold text-black"
              >
                Start Task
              </button>
            )}
          </div>

          {/* Day 2 */}
          <div className={`p-4 rounded-2xl bg-[#080D18] border space-y-3 ${
            day2Status === 'locked' ? 'border-slate-800 opacity-60' : 'border-[#F4C542]/40'
          }`}>
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-[#F4C542] font-mono">📅 Day 2 Task</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                Reward: $37.75
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-100">Trading Volume Milestone</h4>
            <p className="text-xs text-slate-400">🔒 Unlocks after completing Day 1 task</p>
            {day2Status === 'locked' ? (
              <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold flex items-center gap-1 justify-center">
                <Lock className="w-3.5 h-3.5" /> Locked
              </div>
            ) : (
              <button className="w-full py-2.5 btn-gold-gradient text-xs font-bold text-black">
                Start Day 2 Task
              </button>
            )}
          </div>

          {/* Day 3 */}
          <div className={`p-4 rounded-2xl bg-[#080D18] border space-y-3 ${
            day3Status === 'locked' ? 'border-slate-800 opacity-60' : 'border-[#F4C542]/40'
          }`}>
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-[#F4C542] font-mono">📅 Day 3 Task</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                Reward: $62.35
              </span>
            </div>
            <h4 className="font-bold text-sm text-slate-100">Level 2 Unlock Task</h4>
            <p className="text-xs text-slate-400">🔒 Unlocks after completing Day 2 task</p>
            <div className="p-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold flex items-center gap-1 justify-center">
              <Lock className="w-3.5 h-3.5" /> Locked
            </div>
          </div>

        </div>

        {/* Level Up Banner */}
        {completedCount === 3 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F4C542]/20 to-emerald-500/20 border border-[#F4C542] text-center space-y-2">
            <h4 className="text-lg font-extrabold text-emerald-400">🎉 Level 2 Unlocked!</h4>
            <p className="text-xs text-slate-200">Congratulations! You have successfully completed all Level 1 promotional tasks.</p>
          </div>
        )}
      </div>

      {/* Manual Task Submission */}
      <div className="glass-gold-card p-6 max-w-2xl mx-auto space-y-4">
        <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
          <Upload className="w-5 h-5 text-[#F4C542]" /> 📝 Manual Task Submission
        </h3>
        <p className="text-xs text-slate-400">
          Upload your promotional task information and transaction hashes for review.
        </p>

        <form onSubmit={handleSubmitTaskForm} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Task ID</label>
            <input
              type="text"
              value={taskIdInput}
              onChange={(e) => setTaskIdInput(e.target.value)}
              placeholder="e.g., TASK-DAY1-881"
              className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Transaction ID / Hash</label>
            <input
              type="text"
              value={txIdInput}
              onChange={(e) => setTxIdInput(e.target.value)}
              placeholder="e.g., 0x9d8213e48102a94f..."
              className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notes (Optional)</label>
            <textarea
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              rows={2}
              placeholder="Additional information for moderator verification..."
              className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100"
            />
          </div>

          {submittedTask && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              ✅ Task submitted successfully! Verification usually takes 5-15 minutes.
            </div>
          )}

          <button type="submit" className="w-full py-3 btn-gold-gradient text-xs font-bold text-black">
            Submit Task For Verification
          </button>
        </form>
      </div>

    </div>
  );
};
