import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Lock, User, ChevronRight, AlertCircle } from 'lucide-react';

export default function KeeperLogin() {
  const navigate = useNavigate();
  const [keeperID, setKeeperID] = useState('');
  const [passcode, setPasscode] = useState('');
  
  // Advanced Additions: Operational State Management
  const [errorMessage, setErrorMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setErrorMessage('');

    try {
      // Production Strategy Sim: Replace with actual endpoint verification payload
      // const response = await axios.post('/api/auth/gatekeeper', { keeperID, passcode });
      
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simulated network latency

      if (keeperID.trim().toUpperCase() === "KP-FAIL") {
        throw new Error("TERMINAL DENIED: Invalid Duty Code or Key Registration.");
      }

      localStorage.setItem("app_session", JSON.stringify({ 
        keeperID: keeperID.toUpperCase(), 
        role: 'keeper',
        timestamp: new Date().toISOString()
      }));
      
      navigate('/keeper/floor-check');
    } catch (err) {
      setErrorMessage(err.message || "Network timeout. Check central node link.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-0 sm:p-4 text-zinc-100">
      <div className="w-full max-w-sm bg-brand-darkGray border-y sm:border border-zinc-900/80 rounded-none sm:rounded-2xl p-5 sm:p-6 space-y-5 sm:space-y-6 shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-neonGreen to-transparent" />
        
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-brand-neonGreen/10 border border-brand-neonGreen/20 flex items-center justify-center text-brand-neonGreen mx-auto shadow-[0_0_15px_rgba(34,197,94,0.05)]">
            <Radio size={18} className={isAuthenticating ? "animate-spin" : "animate-pulse"} />
          </div>
          <div className="space-y-1">
            <h1 className="text-base sm:text-lg font-black text-white uppercase tracking-wider">Keeper Floor Deck</h1>
            <p className="text-[11px] sm:text-xs text-zinc-500">Floor-wide scanning & dispatch link</p>
          </div>
        </div>

        {/* Dynamic Change: Alert Error Presentation Unit */}
        {errorMessage && (
          <div className="p-3 bg-brand-neonRed/10 border border-brand-neonRed/20 text-brand-neonRed rounded-xl text-[11px] flex items-start gap-2 animate-fadeIn">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Keeper Duty Code</label>
            <div className="relative">
              <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="text" 
                required 
                disabled={isAuthenticating}
                placeholder="KP-9082" 
                value={keeperID} 
                onChange={(e) => setKeeperID(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 disabled:opacity-50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-neonGreen/40 font-mono uppercase tracking-wide text-xs transition-colors" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Duty Passcode</label>
            <div className="relative">
              <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="password" 
                required 
                disabled={isAuthenticating}
                placeholder="••••••••" 
                value={passcode} 
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 disabled:opacity-50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-neonGreen/40 font-mono text-xs transition-colors" 
              />
            </div>
          </div>

          <div className="pt-1">
            <button 
              type="submit" 
              disabled={isAuthenticating}
              className="w-full py-3 bg-brand-neonGreen disabled:bg-zinc-800 disabled:text-zinc-600 disabled:border-zinc-900 transition-all text-zinc-950 font-black uppercase tracking-wider rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_0_25px_rgba(34,197,94,0.12)] cursor-pointer"
            >
              <span>{isAuthenticating ? "Verifying Matrix..." : "Initialize Floor Check"}</span>
              {!isAuthenticating && <ChevronRight size={14} className="shrink-0" />}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-between sm:items-center pt-3 border-t border-zinc-900 text-[10px] sm:text-xs text-zinc-500 font-medium">
          <a href="/admin-login" className="hover:text-brand-neonCyan text-left transition-colors py-1">Admin Portal</a>
          <a href="/incharge-login" className="hover:text-brand-neonCyan text-right sm:text-left transition-colors py-1">InCharge Portal</a>
        </div>

      </div>
    </div>
  );
}