import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Lock, User, ChevronRight } from 'lucide-react';

export default function KeeperLogin() {
  const navigate = useNavigate();
  const [keeperID, setKeeperID] = useState('');
  const [passcode, setPasscode] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    localStorage.setItem("app_session", JSON.stringify({ keeperID, role: 'keeper' }));
    navigate('/keeper/floor-check');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-brand-darkGray border border-zinc-900 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neonGreen to-transparent" />
        
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-brand-neonGreen/10 border border-brand-neonGreen/20 flex items-center justify-center text-brand-neonGreen mx-auto">
            <Radio size={18} className="animate-pulse" />
          </div>
          <h1 className="text-lg font-black text-white uppercase tracking-wider">Keeper Floor Deck</h1>
          <p className="text-xs text-zinc-500">Floor-wide scanning & dispatch link</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Keeper Duty Code</label>
            <div className="relative">
              <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="text" required placeholder="KP-9082" value={keeperID} onChange={(e)=>setKeeperID(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-neonGreen/40 font-mono uppercase tracking-wide" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Duty Passcode</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="password" required placeholder="••••••••" value={passcode} onChange={(e)=>setPasscode(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-neonGreen/40 font-mono" />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-brand-neonGreen hover:scale-[1.01] active:scale-[0.99] transition-all text-zinc-950 font-black uppercase tracking-wider rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_0_25px_rgba(46,213,115,0.1)]">
            <span>Initialize Floor Check</span>
            <ChevronRight size={14} />
          </button>
        </form>

        <div className="flex justify-between items-center pt-3 border-t border-zinc-900 text-[10px] text-zinc-500 font-medium">
          <a href="/admin-login" className="hover:text-brand-neonCyan transition-colors">Admin Portal</a>
          <a href="/incharge-login" className="hover:text-brand-neonCyan transition-colors">InCharge Portal</a>
        </div>
      </div>
    </div>
  );
}