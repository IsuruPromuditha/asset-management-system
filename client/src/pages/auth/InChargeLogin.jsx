import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, Lock, Layers, ChevronRight } from 'lucide-react';

export default function InChargeLogin() {
  const navigate = useNavigate();
  const [platformKey, setPlatformKey] = useState('');
  const [pinCode, setPinCode] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("app_session", JSON.stringify({ platformKey, role: 'incharge' }));
    navigate('/incharge/report');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-0 sm:p-4 text-zinc-100">
      {/* Adapts fluidly from zero-radius edge-to-edge on mobile to an isolated centered terminal card on desktop */}
      <div className="w-full max-w-sm bg-brand-darkGray border-y sm:border border-zinc-900/80 rounded-none sm:rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Terminal Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto shadow-inner">
            <FileSpreadsheet size={18} />
          </div>
          <div className="space-y-1">
            <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">InCharge Terminal</h1>
            <p className="text-[11px] sm:text-xs text-zinc-500">Local sub-platform discrepancy logs</p>
          </div>
        </div>

        {/* Input Interface */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Platform Code Assignment</label>
            <div className="relative">
              <Layers size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="text" 
                required 
                placeholder="PLATFORM-BETA" 
                value={platformKey} 
                onChange={(e) => setPlatformKey(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-neonCyan/40 font-mono uppercase text-xs transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Secure Station Pin</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="password" 
                required 
                placeholder="••••" 
                maxLength={6} 
                value={pinCode} 
                onChange={(e) => setPinCode(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-neonCyan/40 font-mono text-center tracking-widest text-xs transition-colors" 
              />
            </div>
          </div>

          <div className="pt-1">
            <button 
              type="submit" 
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:scale-[1.01] active:scale-[0.99] text-white font-bold uppercase tracking-wider rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Link Station</span>
              <ChevronRight size={14} className="shrink-0" />
            </button>
          </div>
        </form>

        {/* Portal Switching Sub-Footer */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-between sm:items-center pt-3 border-t border-zinc-900 text-[10px] sm:text-xs text-zinc-500 font-medium">
          <a href="/admin-login" className="hover:text-brand-neonCyan text-left transition-colors py-1">
            Admin Portal
          </a>
          <a href="/keeper-login" className="hover:text-brand-neonGreen text-right sm:text-left transition-colors py-1">
            Keeper Portal
          </a>
        </div>

      </div>
    </div>
  );
}