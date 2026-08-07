import React, { useState } from 'react';
import { Headphones, MessageCircle, Send, Mail, HelpCircle, SendHorizontal } from 'lucide-react';

export const CustomerSupport: React.FC = () => {
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! Welcome to USDT REWARD PRO Support 24/7. How can we assist you today?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Thank you for contacting USDT REWARD PRO. A senior support specialist is reviewing your message. For instant response, you can also reach us on Telegram or WhatsApp!' }
      ]);
    }, 1000);
  };

  const faqs = [
    { q: 'How fast are USDT deposits credited?', a: 'TRC20 and ERC20 deposits are automatically credited after 1 block confirmation (usually under 60 seconds).' },
    { q: 'What is the minimum withdrawal amount?', a: 'The minimum withdrawal amount is $50.00 USDT. Processing is instant via automated smart routing.' },
    { q: 'How does the 90s High Yield Investment work?', a: 'When you activate a plan, a live 90-second countdown runs. Once completed, your principal + 20% fixed profit is automatically credited back.' },
    { q: 'What should I do if my loan repayment is overdue?', a: 'Please contact our Accounting Manager via Telegram or WhatsApp on the Official Loan Repayment Notice page immediately.' }
  ];

  return (
    <div className="my-6 space-y-6">
      
      {/* Header */}
      <div className="glass-gold-card p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#F4C542] text-xs font-bold uppercase tracking-wider">
            <Headphones className="w-4 h-4" /> 24/7 Customer Care
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1">Help & Direct Support</h2>
        </div>
      </div>

      {/* Quick Direct Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a
          href="https://t.me/USDTRewardProSupport"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-gold-card p-5 flex items-center gap-3 hover:border-sky-400/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">Telegram Channel</h4>
            <span className="text-xs text-sky-400">@USDTRewardProSupport</span>
          </div>
        </a>

        <a
          href="https://wa.me/18005550199"
          target="_blank"
          rel="noopener noreferrer"
          className="glass-gold-card p-5 flex items-center gap-3 hover:border-emerald-400/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">WhatsApp Support</h4>
            <span className="text-xs text-emerald-400">+1 (800) 555-0199</span>
          </div>
        </a>

        <div className="glass-gold-card p-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">Official Email</h4>
            <span className="text-xs text-slate-400">support@usdtrewardpro.com</span>
          </div>
        </div>
      </div>

      {/* Simulated Live Chat */}
      <div className="glass-gold-card p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Chat Box */}
        <div className="md:col-span-7 flex flex-col justify-between h-96 bg-[#080D18] border border-slate-800 rounded-2xl p-4">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-bold text-[#F4C542] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Support Representative
            </span>
            <span className="text-slate-500">Avg Response: &lt; 1 min</span>
          </div>

          <div className="flex-1 overflow-y-auto my-3 space-y-3 p-1">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${
                  msg.sender === 'user' 
                    ? 'bg-[#F4C542] text-black font-semibold rounded-tr-none'
                    : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 bg-[#050505] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-100"
            />
            <button type="submit" className="p-2.5 rounded-xl btn-gold-gradient text-black">
              <SendHorizontal className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* FAQ Accordion */}
        <div className="md:col-span-5 space-y-3">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#F4C542]" /> Frequently Asked Questions
          </h3>

          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <details key={idx} className="bg-[#080D18] border border-slate-800 rounded-xl p-3 group">
                <summary className="font-semibold text-xs text-slate-200 cursor-pointer list-none flex justify-between items-center">
                  <span>{faq.q}</span>
                  <span className="text-[#F4C542] group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/60 leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
