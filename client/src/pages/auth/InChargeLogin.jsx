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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-brand-darkGray border border-zinc-900 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
        
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mx-auto">
            <FileSpreadsheet size={18} />
          </div>
          <h1 className="text-lg font-black text-white uppercase tracking-wider">InCharge Terminal</h1>
          <p className="text-xs text-zinc-500">Local sub-platform discrepancy logs</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Platform Code Assignment</label>
            <div className="relative">
              <Layers size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="text" required placeholder="PLATFORM-BETA" value={platformKey} onChange={(e)=>setPlatformKey(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-neonCyan/40 font-mono uppercase" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Secure Station Pin</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="password" required placeholder="••••" maxLength={6} value={pinCode} onChange={(e)=>setPinCode(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-neonCyan/40 font-mono text-center tracking-widest" />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-bold uppercase tracking-wider rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all">
            <span>Link Station</span>
            <ChevronRight size={14} />
          </button>
        </form>

        <div className="flex justify-between items-center pt-3 border-t border-zinc-900 text-[10px] text-zinc-500 font-medium">
          <a href="/admin-login" className="hover:text-brand-neonCyan transition-colors">Admin Portal</a>
          <a href="/keeper-login" className="hover:text-brand-neonGreen transition-colors">Keeper Portal</a>
        </div>
      </div>
    </div>
  );
}