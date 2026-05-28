import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Smartphone, Laptop, MessageSquare, CheckCircle2, ShieldAlert,
  Radio, Layers, Send, LogOut, BarChart3, ShieldCheck, AlertCircle
} from 'lucide-react';

export default function FloorCheckHub() {
  const navigate = useNavigate();
  const [activeFloorName] = useState("Floor 2 - Operations");
  const [assignedKeeper] = useState("Gayan Perera");
  
  // Refactored State Framework: Added a thread log key within platform models to hold messages
  const [platforms, setPlatforms] = useState([
    { id: "P2-A", name: "Platform Alpha", incharge: "Suresh Fernando", status: "completed", assets: { laptops: { checked: 10, total: 10 }, phones: { checked: 5, total: 5 } }, transmissions: [] },
    { id: "P2-B", name: "Platform Beta", incharge: "Dilhani Cooray", status: "in-progress", assets: { laptops: { checked: 5, total: 12 }, phones: { checked: 3, total: 10 } }, transmissions: ["Double check laptop tags."] },
    { id: "P2-C", name: "Platform Gamma", incharge: "Thilina Jayasinghe", status: "pending", assets: { laptops: { checked: 0, total: 8 }, phones: { checked: 0, total: 6 } }, transmissions: [] },
    { id: "P2-D", name: "Platform Delta", incharge: "Menaka Perera", status: "failed", assets: { laptops: { checked: 11, total: 12 }, phones: { checked: 7, total: 7 } }, discrepancy: "1 Laptop Damaged", transmissions: [] },
  ]);

  const [activeChatId, setActiveChatId] = useState(null);
  const [chatMessage, setChatMessage] = useState("");

  const handleIncrementAsset = (platformId, type) => {
    setPlatforms(prev => prev.map(p => {
      if (p.id === platformId) {
        const asset = p.assets[type];
        if (asset.checked < asset.total) {
          const nextChecked = asset.checked + 1;
          const otherType = type === 'laptops' ? 'phones' : 'laptops';
          
          // Compute status transitions dynamically
          const isAllChecked = nextChecked === asset.total && p.assets[otherType].checked === p.assets[otherType].total;
          const targetStatus = p.discrepancy ? 'failed' : (isAllChecked ? 'completed' : 'in-progress');

          return {
            ...p,
            status: targetStatus,
            assets: { ...p.assets, [type]: { ...asset, checked: nextChecked } }
          };
        }
      }
      return p;
    }));
  };

  // Advanced Feature Change: Binds communications directly to corresponding relational models
  const handleSendTransmission = () => {
    if (!chatMessage.trim() || !activeChatId) return;

    setPlatforms(prev => prev.map(p => {
      if (p.id === activeChatId) {
        return {
          ...p,
          transmissions: [...p.transmissions, `[Keeper]: ${chatMessage}`]
        };
      }
      return p;
    }));
    setChatMessage("");
  };

  const handleLogout = () => {
    localStorage.removeItem("app_session");
    navigate('/login');
  };

  const selectedPlatform = platforms.find(p => p.id === activeChatId);

  // Dynamic Metrics Computations
  const totalPlatforms = platforms.length;
  const completedPlatforms = platforms.filter(p => p.status === 'completed').length;
  const flaggedDiscrepancies = platforms.filter(p => p.discrepancy).length;
  const totalLaptops = platforms.reduce((acc, p) => acc + p.assets.laptops.total, 0);
  const checkedLaptops = platforms.reduce((acc, p) => acc + p.assets.laptops.checked, 0);
  const totalPhones = platforms.reduce((acc, p) => acc + p.assets.phones.total, 0);
  const checkedPhones = platforms.reduce((acc, p) => acc + p.assets.phones.checked, 0);

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto p-0 sm:p-4 md:p-6 min-h-screen bg-zinc-950 text-zinc-100">
      
      {/* Top Floor Header Layout */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-900 p-4 sm:p-5 md:px-0 md:pt-0 pb-5 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-neonCyan uppercase tracking-wider">
            <Radio size={14} className="animate-pulse text-brand-neonCyan" />
            <span>Active Duty Floor Inspection Panel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{activeFloorName}</h1>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-brand-darkGray border border-zinc-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-neonCyan/10 border border-brand-neonCyan/20 flex items-center justify-center text-brand-neonCyan shrink-0">
              <Layers size={14} />
            </div>
            <div>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Duty Keeper</p>
              <p className="text-xs font-semibold text-zinc-200">{assignedKeeper}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="px-3 py-2.5 sm:p-3 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer">
            <LogOut size={15} />
            <span>Exit Hub</span>
          </button>
        </div>
      </div>

      {/* METRICS DASHBOARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 px-4 sm:p-0">
        <div className="bg-brand-darkGray border border-zinc-900 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-500 tracking-wider truncate">Platform Clearance</p>
            <h4 className="text-lg sm:text-xl font-black font-mono text-white mt-1">{completedPlatforms} / {totalPlatforms}</h4>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-brand-neonGreen/10 border border-brand-neonGreen/20 flex items-center justify-center text-brand-neonGreen shrink-0">
            <ShieldCheck size={16} />
          </div>
        </div>

        <div className="bg-brand-darkGray border border-zinc-900 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-500 tracking-wider truncate">Active Exceptions</p>
            <h4 className={`text-lg sm:text-xl font-black font-mono mt-1 truncate ${flaggedDiscrepancies > 0 ? 'text-brand-neonRed' : 'text-zinc-400'}`}>{flaggedDiscrepancies} Issues</h4>
          </div>
          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center border shrink-0 ${flaggedDiscrepancies > 0 ? 'bg-brand-neonRed/10 border-brand-neonRed/20 text-brand-neonRed' : 'bg-zinc-900 border-zinc-800 text-zinc-600'}`}>
            <AlertCircle size={16} />
          </div>
        </div>

        <div className="bg-brand-darkGray border border-zinc-900 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-500 tracking-wider truncate">Laptop Telemetry</p>
            <h4 className="text-lg sm:text-xl font-black font-mono text-white mt-1 truncate">{checkedLaptops} <span className="text-xs font-normal text-zinc-500">/{totalLaptops}</span></h4>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-400 shrink-0"><Laptop size={15} /></div>
        </div>

        <div className="bg-brand-darkGray border border-zinc-900 rounded-xl p-3 sm:p-4 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-500 tracking-wider truncate">Phone Telemetry</p>
            <h4 className="text-lg sm:text-xl font-black font-mono text-white mt-1 truncate">{checkedPhones} <span className="text-xs font-normal text-zinc-500">/ {totalPhones}</span></h4>
          </div>
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-400 shrink-0"><Smartphone size={15} /></div>
        </div>
      </div>

      {/* Main Structural Layout Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 sm:gap-6 items-start px-4 sm:p-0">
        
        {/* Main Floor Platforms Feed */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5"><BarChart3 size={12} /> Operational Hubs Control Lineup</h2>
          
          {platforms.map((platform) => {
            const isCompleted = platform.status === 'completed';
            const isFailed = platform.status === 'failed';
            
            return (
              <div key={platform.id} className={`bg-brand-darkGray border rounded-xl p-4 space-y-4 ${isCompleted ? 'border-brand-neonGreen/10 bg-brand-neonGreen/[0.01]' : 'border-zinc-800/80'} ${isFailed ? 'border-brand-neonRed bg-brand-neonRed/[0.01]' : ''}`}>
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">{platform.name}</h3>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase border ${isCompleted ? 'bg-brand-neonGreen/10 border-brand-neonGreen/20 text-brand-neonGreen' : ''} ${isFailed ? 'bg-brand-neonRed/10 border-brand-neonRed/20 text-brand-neonRed' : ''} ${platform.status === 'in-progress' ? 'bg-brand-neonCyan/10 border-brand-neonCyan/20 text-brand-neonCyan' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>{platform.status}</span>
                    </div>
                    <p className="text-xs text-zinc-500">Platform Lead: <span className="text-zinc-400 font-medium">{platform.incharge}</span></p>
                  </div>
                  
                  <button type="button" onClick={() => setActiveChatId(platform.id)} className={`flex items-center gap-1.5 px-2.5 py-2 sm:py-1.5 border rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${activeChatId === platform.id ? 'bg-brand-neonCyan text-zinc-950 border-brand-neonCyan font-bold' : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-brand-neonCyan'}`}>
                    <MessageSquare size={13} />
                    <span className="hidden sm:inline">Radio link</span>
                  </button>
                </div>

                {/* Scanners Mapping Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900/60 flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="text-zinc-500 shrink-0"><Laptop size={15} /></div>
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider truncate">Laptops</p>
                        <p className="text-xs font-bold text-white font-mono">{platform.assets.laptops.checked} / {platform.assets.laptops.total}</p>
                      </div>
                    </div>
                    <button disabled={platform.assets.laptops.checked === platform.assets.laptops.total} onClick={() => handleIncrementAsset(platform.id, 'laptops')} className="px-3 py-1.5 bg-brand-neonGreen/10 border border-brand-neonGreen/20 text-brand-neonGreen hover:bg-brand-neonGreen hover:text-zinc-950 text-xs font-extrabold rounded active:scale-95 transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer shrink-0">+ Scan</button>
                  </div>

                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900/60 flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="text-zinc-500 shrink-0"><Smartphone size={15} /></div>
                      <div className="min-w-0">
                        <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider truncate">Smartphones</p>
                        <p className="text-xs font-bold text-white font-mono">{platform.assets.phones.checked} / {platform.assets.phones.total}</p>
                      </div>
                    </div>
                    <button disabled={platform.assets.phones.checked === platform.assets.phones.total} onClick={() => handleIncrementAsset(platform.id, 'phones')} className="px-3 py-1.5 bg-brand-neonCyan/10 border border-brand-neonCyan/20 text-brand-neonCyan hover:bg-brand-neonCyan hover:text-zinc-950 text-xs font-extrabold rounded active:scale-95 transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer shrink-0">+ Scan</button>
                  </div>
                </div>

                {platform.discrepancy && (
                  <div className="p-2.5 bg-brand-neonRed/10 border border-brand-neonRed/20 text-brand-neonRed rounded-md text-xs font-medium flex items-center gap-2 break-words">
                    <ShieldAlert size={14} className="shrink-0" />
                    <span>Flagged Issue: {platform.discrepancy}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Comms Channel Panel Sidebar */}
        <div className="space-y-4">
          <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-zinc-500">Radio Dispatch Wire</h2>
          {selectedPlatform ? (
            <div className="bg-brand-darkGray border border-brand-neonCyan/20 rounded-xl p-4 flex flex-col h-72 justify-between shadow-xl">
              <div className="space-y-2 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-start border-b border-zinc-900 pb-2 gap-2 shrink-0">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{selectedPlatform.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">Lead Console: {selectedPlatform.incharge}</p>
                  </div>
                  <button onClick={() => setActiveChatId(null)} className="text-xs text-zinc-500 hover:text-white font-semibold shrink-0 cursor-pointer">Close</button>
                </div>
                
                {/* Advanced Integration: Interactive Display Thread Logger Output Box */}
                <div className="flex-1 bg-zinc-950 rounded-lg p-2 overflow-y-auto space-y-1.5 text-[11px] font-mono border border-zinc-900">
                  {selectedPlatform.transmissions.length === 0 ? (
                    <p className="text-zinc-600 text-center py-6">No historical transmissions logged.</p>
                  ) : (
                    selectedPlatform.transmissions.map((txt, index) => (
                      <div key={index} className="bg-zinc-900/60 p-1.5 rounded border border-zinc-800/40 text-zinc-300 break-all">
                        {txt}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-2 shrink-0">
                <input 
                  type="text" 
                  placeholder="Type dispatch info..." 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendTransmission()}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-brand-neonCyan/40 transition-colors"
                />
                <button 
                  onClick={handleSendTransmission}
                  className="p-2.5 bg-brand-neonCyan text-zinc-950 rounded-lg active:scale-95 transition-all shrink-0 flex items-center justify-center cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-brand-darkGray/30 border border-zinc-900 rounded-xl p-5 text-center text-xs text-zinc-600 font-medium">
              Select "Radio Link" next to any active platform to establish a dedicated real-time link.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}