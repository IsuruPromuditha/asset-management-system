import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ChevronRight } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulate Admin Session Token Creation
    localStorage.setItem("app_session", JSON.stringify({ email, role: 'admin' }));
    navigate('/floors/floor-2-operations');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-brand-darkGray border border-zinc-900 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neonCyan to-transparent" />
        
        <div className="text-center space-y-1.5">
          <div className="w-10 h-10 rounded-xl bg-brand-neonCyan/10 border border-brand-neonCyan/20 flex items-center justify-center text-brand-neonCyan mx-auto shadow-[0_0_15px_rgba(0,243,255,0.05)]">
            <ShieldAlert size={18} />
          </div>
          <h1 className="text-lg font-black text-white uppercase tracking-wider">Root Admin Gateway</h1>
          <p className="text-xs text-zinc-500">Core structural terminal access</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Admin Identifier</label>
            <div className="relative">
              <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="email" required placeholder="admin@domain.com" value={email} onChange={(e)=>setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-neonCyan/40 font-mono" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Authorization Key</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input type="password" required placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-brand-neonCyan/40 font-mono" />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-brand-neonCyan hover:scale-[1.01] active:scale-[0.99] transition-all text-zinc-950 font-black uppercase tracking-wider rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_0_25px_rgba(0,243,255,0.15)]">
            <span>Unlock Main Command</span>
            <ChevronRight size={14} />
          </button>
        </form>

        <div className="flex justify-between items-center pt-3 border-t border-zinc-900 text-[10px] text-zinc-500 font-medium">
          <a href="/keeper-login" className="hover:text-brand-neonGreen transition-colors">Switch to Keeper</a>
          <a href="/incharge-login" className="hover:text-brand-neonCyan transition-colors">Switch to InCharge</a>
        </div>
      </div>
    </div>
  );
}