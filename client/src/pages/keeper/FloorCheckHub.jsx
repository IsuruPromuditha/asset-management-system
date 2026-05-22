import { useState } from 'react';
import { 
  Smartphone, 
  Laptop, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert,
  Radio, 
  Layers,
  Send
} from 'lucide-react';

export default function FloorCheckHub() {
  // Mocked state simulating current Active Floor data managed by Phone Keepers
  const [activeFloorName, setActiveFloorName] = useState("Floor 2 - Operations");
  const [assignedKeeper, setAssignedKeeper] = useState("Gayan Perera");
  
  const [platforms, setPlatforms] = useState([
    { id: "P2-A", name: "Platform Alpha", incharge: "Suresh Fernando", status: "completed", assets: { laptops: { checked: 10, total: 10 }, phones: { checked: 5, total: 5 } } },
    { id: "P2-B", name: "Platform Beta", incharge: "Dilhani Cooray", status: "in-progress", assets: { laptops: { checked: 5, total: 12 }, phones: { checked: 3, total: 10 } } },
    { id: "P2-C", name: "Platform Gamma", incharge: "Thilina Jayasinghe", status: "pending", assets: { laptops: { checked: 0, total: 8 }, phones: { checked: 0, total: 6 } } },
    { id: "P2-D", name: "Platform Delta", incharge: "Menaka Perera", status: "failed", assets: { laptops: { checked: 11, total: 12 }, phones: { checked: 7, total: 7 } }, discrepancy: "1 Laptop Damaged" },
  ]);

  const [activeChat, setActiveChat] = useState(null);
  const [chatMessage, setChatMessage] = useState("");

  // Handler for Phone Keepers to rapidly log verified scan passes
  const handleIncrementAsset = (platformId, type) => {
    setPlatforms(prev => prev.map(p => {
      if (p.id === platformId) {
        const asset = p.assets[type];
        if (asset.checked < asset.total) {
          const nextChecked = asset.checked + 1;
          const otherType = type === 'laptops' ? 'phones' : 'laptops';
          const isAllChecked = nextChecked === asset.total && p.assets[otherType].checked === p.assets[otherType].total;
          
          return {
            ...p,
            status: isAllChecked ? 'completed' : 'in-progress',
            assets: { ...p.assets, [type]: { ...asset, checked: nextChecked } }
          };
        }
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Floor Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-brand-darkGray pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-neonCyan uppercase tracking-wider">
            <Radio size={14} className="animate-pulse text-brand-neonCyan" />
            <span>Active Duty Floor Inspection Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1 tracking-tight">{activeFloorName}</h1>
        </div>
        <div className="bg-brand-darkGray border border-zinc-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-neonCyan/10 border border-brand-neonCyan/20 flex items-center justify-center text-brand-neonCyan">
            <Layers size={14} />
          </div>
          <div>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Assigned Duty Keeper</p>
            <p className="text-xs font-semibold text-zinc-200">{assignedKeeper}</p>
          </div>
        </div>
      </div>

      {/* Grid Layout splits into Cards & Quick Communications Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        
        {/* Main Floor Platforms Quick Audit Feed */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Operational Hubs Control Lineup</h2>
          
          {platforms.map((platform) => {
            const isCompleted = platform.status === 'completed';
            const isFailed = platform.status === 'failed';
            
            return (
              <div 
                key={platform.id} 
                className={`bg-brand-darkGray border rounded-xl p-4 transition-all duration-150
                  ${isCompleted ? 'border-brand-neonGreen/10 bg-brand-neonGreen/[0.01]' : 'border-zinc-800/80'}
                  ${isFailed ? 'border-brand-neonRed bg-brand-neonRed/[0.01]' : ''}
                `}
              >
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide">{platform.name}</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Platform Lead: <span className="text-zinc-400 font-medium">{platform.incharge}</span></p>
                  </div>
                  
                  {/* Interactive Quick Comms Hook */}
                  <button 
                    onClick={() => setActiveChat({ id: platform.id, name: platform.name, incharge: platform.incharge })}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-zinc-300 hover:text-brand-neonCyan transition-all"
                  >
                    <MessageSquare size={13} />
                    <span>Ping Lead</span>
                  </button>
                </div>

                {/* Grid Split containing Direct Tap Count Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {/* Laptop Action Tracker */}
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="text-zinc-500"><Laptop size={15} /></div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Laptops</p>
                        <p className="text-xs font-bold text-white font-mono">{platform.assets.laptops.checked} / {platform.assets.laptops.total}</p>
                      </div>
                    </div>
                    <button 
                      disabled={platform.assets.laptops.checked === platform.assets.laptops.total}
                      onClick={() => handleIncrementAsset(platform.id, 'laptops')}
                      className="px-2.5 py-1 bg-brand-neonGreen/10 border border-brand-neonGreen/20 text-brand-neonGreen hover:bg-brand-neonGreen hover:text-zinc-950 text-xs font-extrabold rounded transition-all disabled:opacity-20 disabled:pointer-events-none"
                    >
                      + Scan
                    </button>
                  </div>

                  {/* Phone Action Tracker */}
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-900 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="text-zinc-500"><Smartphone size={15} /></div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Smartphones</p>
                        <p className="text-xs font-bold text-white font-mono">{platform.assets.phones.checked} / {platform.assets.phones.total}</p>
                      </div>
                    </div>
                    <button 
                      disabled={platform.assets.phones.checked === platform.assets.phones.total}
                      onClick={() => handleIncrementAsset(platform.id, 'phones')}
                      className="px-2.5 py-1 bg-brand-neonCyan/10 border border-brand-neonCyan/20 text-brand-neonCyan hover:bg-brand-neonCyan hover:text-zinc-950 text-xs font-extrabold rounded transition-all disabled:opacity-20 disabled:pointer-events-none"
                    >
                      + Scan
                    </button>
                  </div>
                </div>

                {/* Quick Warning Notice Banner */}
                {platform.discrepancy && (
                  <div className="mt-3 p-2 bg-brand-neonRed/10 border border-brand-neonRed/20 text-brand-neonRed rounded-md text-xs font-medium flex items-center gap-2">
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Radio Dispatch Wire</h2>
          {activeChat ? (
            <div className="bg-brand-darkGray border border-brand-neonCyan/20 rounded-xl p-4 flex flex-col h-64 justify-between">
              <div>
                <div className="flex justify-between items-start border-b border-zinc-800 pb-2">
                  <div>
                    <p className="text-xs font-bold text-white">{activeChat.name}</p>
                    <p className="text-[10px] text-zinc-500">Lead: {activeChat.incharge}</p>
                  </div>
                  <button onClick={() => setActiveChat(null)} className="text-xs text-zinc-500 hover:text-white font-semibold">Close</button>
                </div>
                <div className="mt-3 text-xs text-zinc-500 text-center py-4 border border-dashed border-zinc-900 rounded-lg">
                  Secure channel connected to platform lead console.
                </div>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type instructions..." 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-neonCyan/50"
                />
                <button 
                  onClick={() => { setChatMessage(""); alert("Message broadcasted to InCharge device terminal!"); }}
                  className="p-2 bg-brand-neonCyan text-zinc-950 rounded-lg hover:scale-105 transition-transform"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-brand-darkGray/30 border border-zinc-900 rounded-xl p-6 text-center text-xs text-zinc-600 font-medium">
              Select "Ping Lead" next to any active platform to establish a dedicated real-time link.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}