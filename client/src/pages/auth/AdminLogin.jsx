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
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-0 sm:p-4 text-zinc-100">
      {/* Container adapts from an edge-to-edge frame on mobile to a centered card on desktop */}
      <div className="w-full max-w-sm bg-brand-darkGray border-y sm:border border-zinc-900/80 rounded-none sm:rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Neon Accent Header Bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neonCyan to-transparent" />
        
        {/* Branding & Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-brand-neonCyan/10 border border-brand-neonCyan/20 flex items-center justify-center text-brand-neonCyan mx-auto shadow-[0_0_15px_rgba(0,243,255,0.05)]">
            <ShieldAlert size={18} />
          </div>
          <div className="space-y-1">
            <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Root Admin Gateway</h1>
            <p className="text-[11px] sm:text-xs text-zinc-500">Core structural terminal access</p>
          </div>
        </div>

        {/* Input Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Admin Identifier</label>
            <div className="relative">
              <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="email" 
                required 
                placeholder="admin@domain.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-neonCyan/40 font-mono text-xs transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Authorization Key</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="password" 
                required 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-neonCyan/40 font-mono text-xs transition-colors" 
              />
            </div>
          </div>

          <div className="pt-1">
            <button 
              type="submit" 
              className="w-full py-3 bg-brand-neonCyan hover:scale-[1.01] active:scale-[0.99] transition-all text-zinc-950 font-black uppercase tracking-wider rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_0_25px_rgba(0,243,255,0.12)] cursor-pointer"
            >
              <span>Unlock Main Command</span>
              <ChevronRight size={14} className="shrink-0" />
            </button>
          </div>
        </form>

        {/* Multi-role Navigation Footer */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-between sm:items-center pt-3 border-t border-zinc-900 text-[10px] sm:text-xs text-zinc-500 font-medium">
          <a href="/keeper-login" className="hover:text-brand-neonGreen text-left transition-colors py-1">
            Switch to Keeper
          </a>
          <a href="/incharge-login" className="hover:text-brand-neonCyan text-right sm:text-left transition-colors py-1">
            Switch to InCharge
          </a>
        </div>
      </div>
    </div>
  );
}