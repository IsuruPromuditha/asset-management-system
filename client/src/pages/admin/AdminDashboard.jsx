import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  AlertTriangle, 
  MonitorSmartphone, 
  CheckCircle, 
  Server, 
  X, 
  Clock, 
  MapPin, 
  Cpu,
  BarChart3
} from 'lucide-react';

const floorData = [
  { id: 1, name: "Floor 1 - IT & Dev", status: "verified", platforms: 4, audited: 4, itemCount: 312, totalItems: 312 },
  { id: 2, name: "Floor 2 - Operations", status: "pending", platforms: 5, audited: 2, itemCount: 180, totalItems: 450 },
  { id: 3, name: "Floor 3 - Executive", status: "alert", platforms: 3, audited: 3, itemCount: 148, totalItems: 149 },
  { id: 4, name: "Floor 4 - Marketing", status: "verified", platforms: 6, audited: 6, itemCount: 337, totalItems: 337 },
];

const initialFeed = [
  { id: 1, time: "Just now", msg: "Floor 1 / Platform B audit submitted. All clear.", type: "success" },
  { id: 2, time: "10:15 AM", msg: "Floor 3 / Platform A reported missing asset: PHN-042.", type: "alert" },
  { id: 3, time: "09:00 AM", msg: "Floor 2 / Platform C audit started.", type: "pending" },
];

const missingAssetsRegistry = [
  { id: "PHN-042", type: "Laptop", floor: "Floor 3 - Executive", platform: "Platform Alpha", time: "10:15 AM", date: "May 22, 2026" },
  { id: "TAB-089", type: "Tablet", floor: "Floor 2 - Operations", platform: "Platform Beta", time: "Yesterday, 04:30 PM", date: "May 21, 2026" },
  { id: "MNT-114", type: "Display Hub", floor: "Floor 3 - Executive", platform: "Platform Gamma", time: "May 19, 11:20 AM", date: "May 19, 2026" }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [liveFeed] = useState(initialFeed);
  const [missingAssets] = useState(missingAssetsRegistry);
  
  // Modal Control States
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // 💡 FIXED SLUG GENERATOR: Eradicates extra dangling hyphens completely
  const handleFloorNavigation = (floorName) => {
    const floorSlug = floorName
      .toLowerCase()
      .replace(/&/g, 'and')          // Optional: converts '&' to 'and' safely if you want, or just leave it out
      .replace(/[^a-z0-9\s-]/g, '')  // Strip other random special symbols
      .trim()
      .replace(/\s+/g, '-')          // Turn spaces into single hyphens
      .replace(/-+/g, '-');          // 💡 COLLAPSE MULTIPLE HYPHENS (fixes the "---" issue)
    
    navigate(`/floors/${floorSlug}`);
  };

  return (
    <div className="space-y-8 relative">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-brand-darkGray pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Overview</h1>
          <p className="text-zinc-400 mt-1">Real-time asset tracking and audit status.</p>
        </div>
        <div className="flex items-center space-x-2 text-brand-neonGreen bg-brand-neonGreen/10 px-4 py-2 rounded-full border border-brand-neonGreen/20">
          <Activity size={18} className="animate-pulse" />
          <span className="text-sm font-medium tracking-wide">Live Sync Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Content Area (Stats + Floors) */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Total Assets Card */}
            <div 
              onClick={() => navigate('/assets')} 
              className="bg-brand-darkGray p-6 rounded-xl border border-zinc-800 cursor-pointer hover:border-brand-neonCyan/40 transition-all duration-200 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-zinc-400 text-sm font-medium group-hover:text-brand-neonCyan transition-colors">Total Assets</p>
                  <p className="text-3xl font-bold text-white mt-2">1,248</p>
                </div>
                <div className="p-3 bg-zinc-800 rounded-lg group-hover:bg-brand-neonCyan/10 transition-colors">
                  <MonitorSmartphone size={24} className="text-brand-neonCyan" />
                </div>
              </div>
            </div>
            
            {/* Missing / Alert Card */}
            <div 
              onClick={() => setIsAlertModalOpen(true)}
              className="bg-brand-darkGray p-6 rounded-xl border border-zinc-800 cursor-pointer hover:border-brand-neonRed/40 transition-all duration-200 group overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-zinc-400 text-sm font-medium group-hover:text-brand-neonRed transition-colors">Missing / Alert</p>
                  <p className="text-3xl font-bold text-brand-neonRed mt-2">{missingAssets.length}</p>
                </div>
                <div className="p-3 bg-brand-neonRed/10 rounded-lg group-hover:bg-brand-neonRed/20 transition-colors">
                  <AlertTriangle size={24} className="text-brand-neonRed animate-pulse" />
                </div>
              </div>
              <div className="mt-4 text-[11px] text-zinc-500 font-medium group-hover:text-zinc-400 transition-colors">
                <span>Click to pinpoint active anomalies</span>
              </div>
            </div>

            {/* Today's Audits Progress Card */}
            <div 
              onClick={() => setIsAuditModalOpen(true)}
              className="bg-brand-darkGray p-6 rounded-xl border border-zinc-800 cursor-pointer hover:border-brand-neonGreen/40 transition-all duration-200 group overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-zinc-400 text-sm font-medium group-hover:text-brand-neonGreen transition-colors">Today's Audits</p>
                  <p className="text-3xl font-bold text-brand-neonGreen mt-2">72%</p>
                </div>
                <div className="p-3 bg-brand-neonGreen/10 rounded-lg group-hover:bg-brand-neonGreen/20 transition-colors">
                  <CheckCircle size={24} className="text-brand-neonGreen" />
                </div>
              </div>
              <div className="mt-4 text-[11px] text-zinc-500 font-medium group-hover:text-zinc-400 transition-colors">
                <span>Click to view breakdown charts per floor</span>
              </div>
            </div>
          </div>

          {/* 4-Floor Grid */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Floor Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {floorData.map((floor) => (
                <div 
                  key={floor.id} 
                  onClick={() => handleFloorNavigation(floor.name)}
                  className={`relative p-6 rounded-xl bg-brand-darkGray border cursor-pointer transition-all duration-300 hover:scale-[1.01] group
                    ${floor.status === 'verified' ? 'border-brand-neonGreen/20 hover:border-brand-neonGreen hover:shadow-[0_0_20px_rgba(57,255,20,0.05)]' : ''}
                    ${floor.status === 'alert' ? 'border-brand-neonRed/30 hover:border-brand-neonRed hover:shadow-[0_0_20px_rgba(255,7,58,0.08)]' : ''}
                    ${floor.status === 'pending' ? 'border-zinc-800 hover:border-zinc-600' : ''}
                  `}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-neonCyan transition-colors">{floor.name}</h3>
                    <Server size={20} className={
                      floor.status === 'verified' ? 'text-brand-neonGreen' :
                      floor.status === 'alert' ? 'text-brand-neonRed animate-pulse' : 'text-zinc-500'
                    } />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Platforms Audited:</span>
                    <span className="font-medium text-white">{floor.audited} / {floor.platforms}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-zinc-900 rounded-full h-2 mt-3 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full ${floor.status === 'alert' ? 'bg-brand-neonRed' : 'bg-brand-neonGreen'}`}
                      style={{ width: `${(floor.audited / floor.platforms) * 100}%` }}
                    ></div>
                  </div>

                  <div className="mt-4 flex justify-between items-center text-[11px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    <span>Hardware Assets: {floor.itemCount} units</span>
                    <span className="text-brand-neonCyan underline underline-offset-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Manage Keepers &rarr;
                    </span>
                  </div>

                  {floor.alertMsg && (
                    <div className="mt-3 p-2 bg-brand-neonRed/10 border border-brand-neonRed/20 rounded text-brand-neonRed text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle size={14} />
                      {floor.alertMsg}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Activity Feed (Sidebar) */}
        <div className="bg-brand-darkGray border border-zinc-800 rounded-xl p-6 lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-4">
            <Activity size={18} className="text-brand-neonCyan" />
            <h2 className="text-lg font-semibold text-white">Live Feed</h2>
          </div>
          
          <div className="space-y-4">
            {liveFeed.map((feed) => (
              <div key={feed.id} className="relative pl-4 border-l-2 border-zinc-800 pb-2">
                <div className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full 
                  ${feed.type === 'success' ? 'bg-brand-neonGreen shadow-[0_0_8px_#39ff14]' : ''}
                  ${feed.type === 'alert' ? 'bg-brand-neonRed shadow-[0_0_8px_#ff073a]' : ''}
                  ${feed.type === 'pending' ? 'bg-zinc-500' : ''}
                `}></div>
                <p className="text-xs text-zinc-500 font-medium mb-1">{feed.time}</p>
                <p className={`text-sm ${feed.type === 'alert' ? 'text-brand-neonRed' : 'text-zinc-300'}`}>
                  {feed.msg}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MODAL POP-UP 1: ANOMALY REGISTRY / MISSING DEVICES LIST */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-darkGray border border-brand-neonRed/30 shadow-[0_0_30px_rgba(255,7,58,0.05)] rounded-xl max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5 text-brand-neonRed">
                <AlertTriangle size={20} className="animate-pulse" />
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide uppercase text-sm">Active Asset Incident Log</h3>
                  <p className="text-xs text-zinc-500 font-medium mt-0.5">Unresolved missing device markers</p>
                </div>
              </div>
              <button onClick={() => setIsAlertModalOpen(false)} className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-x-auto max-h-[380px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/80 text-[11px] font-bold tracking-wider text-zinc-500 uppercase">
                    <th className="pb-3 pl-2">Asset Details</th>
                    <th className="pb-3">Incident Zone</th>
                    <th className="pb-3 pr-2">Discovered Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40 text-xs">
                  {missingAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-zinc-900/30 group transition-colors">
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-brand-neonRed/10 border border-brand-neonRed/20 flex items-center justify-center text-brand-neonRed shrink-0">
                            <Cpu size={14} />
                          </div>
                          <div>
                            <p className="font-mono font-bold text-zinc-200 tracking-wide group-hover:text-brand-neonRed transition-colors">{asset.id}</p>
                            <p className="text-[10px] text-zinc-500 font-medium">{asset.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-zinc-300 flex items-center gap-1">
                            <MapPin size={11} className="text-zinc-600" />
                            {asset.floor}
                          </p>
                          <p className="text-[10px] text-brand-neonCyan font-medium pl-4">{asset.platform}</p>
                        </div>
                      </td>
                      <td className="py-3.5 pr-2">
                        <div className="space-y-0.5">
                          <p className="font-medium text-zinc-300 flex items-center gap-1">
                            <Clock size={11} className="text-zinc-600" />
                            {asset.time}
                          </p>
                          <p className="text-[10px] text-zinc-500 pl-4">{asset.date}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-zinc-800/60 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAlertModalOpen(false)} className="px-4 py-2 bg-zinc-900 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold border border-zinc-800 transition-colors">
                Dismiss View
              </button>
              <button 
                onClick={() => { setIsAlertModalOpen(false); navigate('/assets'); }}
                className="px-4 py-2 bg-brand-neonRed/10 border border-brand-neonRed/30 text-brand-neonRed hover:bg-brand-neonRed hover:text-white rounded-lg text-xs font-bold transition-all duration-200"
              >
                Investigate Assets Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL POP-UP 2: FLOOR AUDIT METRICS & METERS CHART */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-darkGray border border-brand-neonGreen/30 shadow-[0_0_30px_rgba(57,255,20,0.05)] rounded-xl max-w-2xl w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5 text-brand-neonGreen">
                <BarChart3 size={20} />
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide uppercase text-sm">Floor-by-Floor Audit Breakdown</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Operational summary and item validation counts for today</p>
                </div>
              </div>
              <button onClick={() => setIsAuditModalOpen(false)} className="text-zinc-500 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 max-h-[400px] overflow-y-auto pr-1">
              {floorData.map((floor) => {
                const platformPercent = Math.round((floor.audited / floor.platforms) * 100);
                const itemPercent = Math.round((floor.itemCount / floor.totalItems) * 100);

                return (
                  <div key={floor.id} className="bg-zinc-900/40 border border-zinc-800/70 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-white">{floor.name}</h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            floor.status === 'verified' ? 'bg-brand-neonGreen' :
                            floor.status === 'alert' ? 'bg-brand-neonRed animate-pulse' : 'bg-amber-400'
                          }`} />
                          Status: <span className="capitalize">{floor.status}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-brand-neonGreen bg-brand-neonGreen/5 border border-brand-neonGreen/10 px-2 py-0.5 rounded">
                          {itemPercent}% Verified
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-medium text-zinc-400">
                          <span>Platforms Inspected</span>
                          <span className="text-zinc-200 font-mono font-bold">{floor.audited} / {floor.platforms}</span>
                        </div>
                        <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              floor.status === 'alert' ? 'bg-brand-neonRed' : 'bg-brand-neonCyan'
                            }`}
                            style={{ width: `${platformPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-medium text-zinc-400">
                          <span>Device Audits Completed</span>
                          <span className="text-zinc-200 font-mono font-bold">{floor.itemCount} / {floor.totalItems}</span>
                        </div>
                        <div className="w-full bg-zinc-950 rounded-full h-2 overflow-hidden border border-zinc-800">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 bg-brand-neonGreen`}
                            style={{ width: `${itemPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-zinc-800/60 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAuditModalOpen(false)} className="px-4 py-2 bg-zinc-900 text-zinc-400 hover:text-white rounded-lg text-xs font-semibold border border-zinc-800 transition-colors">
                Close Metrics
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}