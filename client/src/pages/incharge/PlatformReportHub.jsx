import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Laptop, Smartphone, ShieldCheck, AlertOctagon, Wrench,
  CheckCircle2, FileSpreadsheet, LogOut, Radio, Clock, UserCheck, AlertCircle
} from 'lucide-react';

export default function PlatformReportHub() {
  const navigate = useNavigate();
  const [platformMeta] = useState({ name: "Platform Beta", floor: "Floor 2", supervisor: "Dilhani Cooray" });

  // Mother Architecture Change: Evolved from plain numerical counters to itemized tracking array
  const [inventoryList, setInventoryList] = useState([
    { asset_id: "LP-F2B-01", type: "laptops", status: "safe", serial: "SN-90812-A" },
    { asset_id: "LP-F2B-02", type: "laptops", status: "safe", serial: "SN-90812-B" },
    { asset_id: "LP-F2B-03", type: "laptops", status: "broken", serial: "SN-90812-C" },
    { asset_id: "PH-F2B-01", type: "phones", status: "safe", serial: "SN-44102-X" },
    { asset_id: "PH-F2B-02", type: "phones", status: "pending", serial: "SN-44102-Y" },
  ]);

  // Target assignment dropdown state map
  const [targetDiscrepancyAsset, setTargetDiscrepancyAsset] = useState("");
  const [discrepancyNote, setDiscrepancyNote] = useState("");
  const [submitStatus, setSubmitStatus] = useState(false);

  const [adminMessages] = useState([
    { id: 1, sender: "System Command (Admin)", text: "Verify serial numbers on the broken laptop immediately.", time: "09:15 AM", type: "urgent" },
    { id: 2, sender: "Floor Keeper (Gayan)", text: "Platform Beta telemetry sync confirmed. Keep scanning.", time: "09:02 AM", type: "info" }
  ]);

  // Advanced Change: Updates item profiles tracking unique elements downstream
  const toggleAssetHealth = (assetId, nextStatus) => {
    setInventoryList(prev => prev.map(item => 
      item.asset_id === assetId ? { ...item, status: nextStatus } : item
    ));
  };

  // Automated computational helper mappings
  const getMetrics = (type) => {
    const items = inventoryList.filter(i => i.type === type);
    return {
      total: items.length,
      safe: items.filter(i => i.status === 'safe').length,
      broken: items.filter(i => i.status === 'broken').length,
      pending: items.filter(i => i.status === 'pending').length
    };
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    setSubmitStatus(true);
    setTimeout(() => setSubmitStatus(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("app_session");
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 p-0 sm:p-4 min-h-screen bg-zinc-950 text-zinc-100">
      
      {/* Identity Profile Badge */}
      <div className="bg-brand-darkGray border-y sm:border border-zinc-800/80 p-4 sm:p-5 rounded-none sm:rounded-xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shadow-md">
        <div className="space-y-1">
          <span className="inline-block text-[10px] font-bold text-brand-neonCyan bg-brand-neonCyan/10 border border-brand-neonCyan/20 px-2 py-0.5 rounded uppercase tracking-wider">
            InCharge Console
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">{platformMeta.name}</h1>
          <p className="text-xs text-zinc-500">Assigned Level Location: <span className="text-zinc-300 font-semibold">{platformMeta.floor}</span></p>
        </div>
        
        <div className="flex sm:flex-col justify-between sm:items-end items-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-zinc-900">
          <div className="text-left sm:text-right text-xs">
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Unit Lead Name</p>
            <p className="text-white font-bold">{platformMeta.supervisor}</p>
          </div>
          <button type="button" onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 rounded-lg tracking-wide uppercase transition-all cursor-pointer">
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK WIRE */}
      <div className="bg-brand-darkGray/60 border-y sm:border border-zinc-900 rounded-none sm:rounded-xl p-4 sm:p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-zinc-900 pb-2">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-brand-neonCyan animate-pulse" />
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Command Console Feedback Wire</h2>
          </div>
          <span className="text-[10px] font-mono font-medium text-zinc-500 flex items-center gap-1">
            <Clock size={11} /> Real-time active link
          </span>
        </div>

        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
          {adminMessages.map((msg) => (
            <div key={msg.id} className={`p-3 rounded-lg border text-xs leading-relaxed flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1.5 ${msg.type === 'urgent' ? 'bg-brand-neonRed/[0.02] border-brand-neonRed/20 text-zinc-200' : 'bg-zinc-950/40 border-zinc-900 text-zinc-400'}`}>
              <div className="break-words min-w-0">
                <span className={`font-bold mr-1.5 inline-flex items-center gap-1 ${msg.type === 'urgent' ? 'text-brand-neonRed' : 'text-brand-neonCyan'}`}>
                  <UserCheck size={11} /> {msg.sender}:
                </span>
                <span>{msg.text}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 shrink-0 self-end sm:self-start">{msg.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Reporting Workspace Form */}
      <form onSubmit={handleSubmitReport} className="bg-brand-darkGray border-y sm:border border-zinc-900 rounded-none sm:rounded-xl p-4 sm:p-5 space-y-5 sm:space-y-6">
        <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
          <FileSpreadsheet size={16} className="text-brand-neonCyan" />
          <h2 className="text-xs sm:text-sm font-bold text-zinc-200 uppercase tracking-wide">Daily Inventory State Log</h2>
        </div>

        {/* Dynamic Category Layout Mapping loops via item states directly */}
        {['laptops', 'phones'].map((catKey) => {
          const metrics = getMetrics(catKey);
          return (
            <div key={catKey} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 sm:p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-zinc-900/60 pb-2">
                <span className="text-xs font-bold text-white capitalize flex items-center gap-2">
                  {catKey === 'laptops' ? <Laptop size={14} className="text-zinc-400" /> : <Smartphone size={14} className="text-zinc-400" />}
                  {catKey} Registry Metrics <span className="text-[11px] font-mono font-medium text-zinc-600">(Total: {metrics.total})</span>
                </span>
                {metrics.pending > 0 && (
                  <span className="text-[10px] text-brand-neonCyan font-bold bg-brand-neonCyan/5 px-2 py-0.5 rounded border border-brand-neonCyan/10">
                    {metrics.pending} Unverified Core Units
                  </span>
                )}
              </div>

              {/* Functional Modification: Item Asset Identification Mapping Matrix Grid */}
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {inventoryList.filter(i => i.type === catKey).map(asset => (
                  <div key={asset.asset_id} className="flex justify-between items-center bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 text-[11px] font-mono">
                    <div>
                      <p className="text-zinc-200 font-bold">{asset.asset_id} <span className="text-zinc-600 font-normal">({asset.serial})</span></p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => toggleAssetHealth(asset.asset_id, 'safe')} className={`px-2 py-1 rounded transition-colors ${asset.status === 'safe' ? 'bg-brand-neonGreen text-zinc-950 font-bold' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'}`}>Safe</button>
                      <button type="button" onClick={() => toggleAssetHealth(asset.asset_id, 'broken')} className={`px-2 py-1 rounded transition-colors ${asset.status === 'broken' ? 'bg-brand-neonRed text-zinc-100 font-bold shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-zinc-900 text-zinc-500 hover:text-brand-neonRed'}`}>Fault</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Advanced Feature Change: Relational Dropdown Assignment For Exceptions */}
        <div className="space-y-3 text-xs pt-2">
          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <AlertCircle size={13} className="text-brand-neonCyan" /> Target Discrepancy Hardware Node
            </label>
            <select
              value={targetDiscrepancyAsset}
              onChange={(e) => setTargetDiscrepancyAsset(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-300 focus:outline-none focus:border-brand-neonCyan/40 font-mono text-xs"
            >
              <option value="">General Exception (No Asset Linked)</option>
              {inventoryList.map(i => (
                <option key={i.asset_id} value={i.asset_id}>{i.asset_id} [{i.status.toUpperCase()}] - {i.serial}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-zinc-400 font-medium flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
              <AlertOctagon size={13} className="text-brand-neonRed" /> Exception Discrepancy Note
            </label>
            <textarea
              rows="2"
              placeholder="Provide engineering parameters or logging notes regarding asset state changes..."
              value={discrepancyNote}
              onChange={(e) => setDiscrepancyNote(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-brand-neonCyan/40 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="pt-1">
          <button type="submit" className="w-full py-3.5 bg-brand-neonCyan text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.12)] flex items-center justify-center gap-2 cursor-pointer">
            {submitStatus ? (
              <>
                <CheckCircle2 size={15} className="shrink-0" />
                <span>Telemetry Logs Dispatched</span>
              </>
            ) : (
              <span>Submit Operational Report</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}