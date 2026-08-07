import React, { useState } from 'react';
import { Settings, Globe, DollarSign, Bell, Shield, Eye } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState('English (US)');
  const [selectedCurrency, setSelectedCurrency] = useState('USD ($)');
  const [pushNotify, setPushNotify] = useState(true);
  const [emailNotify, setEmailNotify] = useState(true);

  const languages = [
    'English (US)', 'Spanish (Español)', 'Chinese (中文)', 'Arabic (العربية)',
    'French (Français)', 'German (Deutsch)', 'Japanese (日本語)', 'Russian (Русский)',
    'Turkish (Türkçe)', 'Hindi (हिन्दी)', 'Portuguese (Português)', 'Vietnamese (Tiếng Việt)', 'Korean (한국어)'
  ];

  const currencies = [
    'USD ($)', 'EUR (€)', 'GBP (£)', 'JPY (¥)', 'CAD ($)', 'AUD ($)', 'BRL (R$)', 'INR (₹)', 'TRY (₺)', 'USDT (₮)'
  ];

  return (
    <div className="my-6 space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="glass-gold-card p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[#F4C542] text-xs font-bold uppercase tracking-wider">
            <Settings className="w-4 h-4" /> Global Platform Settings
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 mt-1">Preferences & Localization</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Language & Currency */}
        <div className="glass-gold-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#F4C542]" /> Country Language & Display
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Platform Language</label>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:border-[#F4C542]"
            >
              {languages.map(lang => (
                <option key={lang} value={lang} className="bg-[#0D121F]">{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Select Valuation Currency</label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full bg-[#080D18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:border-[#F4C542]"
            >
              {currencies.map(curr => (
                <option key={curr} value={curr} className="bg-[#0D121F]">{curr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notifications & Privacy */}
        <div className="glass-gold-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#F4C542]" /> Notification & Alert Toggles
          </h3>

          <div className="p-3 rounded-xl bg-[#080D18] border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">Push Notifications (Trades & Deposits)</span>
            <button
              onClick={() => setPushNotify(!pushNotify)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                pushNotify ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {pushNotify ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-[#080D18] border border-slate-800 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">Email Trade Confirmations</span>
            <button
              onClick={() => setEmailNotify(!emailNotify)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                emailNotify ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {emailNotify ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
