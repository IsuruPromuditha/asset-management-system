import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Laptop, 
  Smartphone, 
  ShieldCheck, 
  AlertOctagon, 
  Wrench,
  CheckCircle2,
  FileSpreadsheet,
  LogOut,
  Radio,
  Clock,
  UserCheck
} from 'lucide-react';

export default function PlatformReportHub() {
  const navigate = useNavigate();

  // Assigned platform scope profile variables
  const [platformMeta] = useState({ name: "Platform Beta", floor: "Floor 2", supervisor: "Dilhani Cooray" });

  // Core structured data breakdown fields tracking exact equipment health metrics
  const [devices, setDevices] = useState({
    laptops: { safe: 5, broken: 2, total: 12 },
    phones: { safe: 3, broken: 1, total: 10 }
  });

  const [discrepancyNote, setDiscrepancyNote] = useState("");
  const [submitStatus, setSubmitStatus] = useState(false);

  // 🆕 Mocked Admin Broadcast Feed state for InCharges to check response statuses
  const [adminMessages, setAdminMessages] = useState([
    { id: 1, sender: "System Command (Admin)", text: "Verify serial numbers on the broken laptop immediately.", time: "09:15 AM", type: "urgent" },
    { id: 2, sender: "Floor Keeper (Gayan)", text: "Platform Beta telemetry sync confirmed. Keep scanning.", time: "09:02 AM", type: "info" }
  ]);

  const handleUpdateCount = (category, field, delta) => {
    setDevices(prev => {
      const target = prev[category];
      const nextVal = Math.max(0, target[field] + delta);
      
      // Prevent over-allocating past the strict hardware baseline limit
      if (field !== 'total' && (field === 'safe' || field === 'broken')) {
        const structuralSum = field === 'safe' ? nextVal + target.broken : nextVal + target.safe;
        if (structuralSum > target.total) return prev;
      }

      return {
        ...prev,
        [category]: { ...target, [field]: nextVal }
      };
    });
  };

  const handleSubmitReport = (e) => {
    e.preventDefault();
    setSubmitStatus(true);
    setTimeout(() => setSubmitStatus(false), 3000);
  };

  // Log Out Execution Routine
  const handleLogout = () => {
    localStorage.removeItem("app_session");
    alert("InCharge terminal link closed.");
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 min-h-screen bg-zinc-950 text-zinc-100">
      
      {/* Identity Profile Badge with Session Controls */}
      <div className="bg-brand-darkGray border border-zinc-800 p-5 rounded-xl flex justify-between items-center gap-4 shadow-md">
        <div>
          <span className="text-[10px] font-bold text-brand-neonCyan bg-brand-neonCyan/10 border border-brand-neonCyan/20 px-2 py-0.5 rounded uppercase tracking-wider">
            InCharge Console
          </span>
          <h1 className="text-2xl font-black text-white mt-1.5 tracking-tight">{platformMeta.name}</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Assigned Level Location: <span className="text-zinc-300 font-semibold">{platformMeta.floor}</span></p>
        </div>
        
        <div className="flex flex-col items-end gap-3 shrink-0">
          <div className="text-right text-xs">
            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Unit Lead Name</p>
            <p className="text-white font-bold">{platformMeta.supervisor}</p>
          </div>
          
          {/* Secure Session Terminate Trigger Button */}
          <button 
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-900 hover:bg-brand-neonRed/10 border border-zinc-800 hover:border-brand-neonRed/30 rounded-lg text-xs font-bold text-zinc-400 hover:text-brand-neonRed tracking-wide uppercase transition-all"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          🆕 ADMIN & KEEPER LIVE RESPONSE DESK FEED
          ========================================================= */}
      <div className="bg-brand-darkGray/60 border border-zinc-900 rounded-xl p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-brand-neonCyan animate-pulse" />
            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Command Console Feedback Wire</h2>
          </div>
          <span className="text-[10px] font-mono font-medium text-zinc-500 flex items-center gap-1">
            <Clock size={11} /> Real-time active link
          </span>
        </div>

        <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
          {adminMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-3 rounded-lg border text-xs leading-relaxed flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1
                ${msg.type === 'urgent' 
                  ? 'bg-brand-neonRed/[0.02] border-brand-neonRed/20 text-zinc-200' 
                  : 'bg-zinc-950/40 border-zinc-900 text-zinc-400'
                }
              `}
            >
              <div>
                <span className={`font-bold mr-1.5 inline-flex items-center gap-1
                  ${msg.type === 'urgent' ? 'text-brand-neonRed' : 'text-brand-neonCyan'}
                `}>
                  <UserCheck size={11} /> {msg.sender}:
                </span>
                <span>{msg.text}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-600 shrink-0 self-end sm:self-start">{msg.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Reporting Input Workspace */}
      <form onSubmit={handleSubmitReport} className="bg-brand-darkGray border border-zinc-900 rounded-xl p-5 space-y-6">
        <div className="flex items-center gap-2 border-b border-zinc-900 pb-3">
          <FileSpreadsheet size={16} className="text-brand-neonCyan" />
          <h2 className="text-sm font-bold text-zinc-200 uppercase tracking-wide">Daily Inventory State Log</h2>
        </div>

        {/* Device Rows Loops */}
        {Object.entries(devices).map(([key, value]) => {
          const isLaptop = key === 'laptops';
          const unassignedCount = value.total - (value.safe + value.broken);

          return (
            <div key={key} className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white capitalize flex items-center gap-2">
                  {isLaptop ? <Laptop size={14} className="text-zinc-400" /> : <Smartphone size={14} className="text-zinc-400" />}
                  {key} Hub <span className="text-[11px] font-mono font-medium text-zinc-600">(Total Limit: {value.total})</span>
                </span>
                {unassignedCount > 0 && (
                  <span className="text-[10px] text-brand-neonCyan font-bold bg-brand-neonCyan/5 px-2 py-0.5 rounded border border-brand-neonCyan/10 animate-pulse">
                    {unassignedCount} Pending Check
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Safe Operating Count Controls */}
                <div className="bg-brand-darkGray/40 border border-zinc-800/80 p-3 rounded-lg flex flex-col justify-between items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={11} className="text-brand-neonGreen" /> On Hand & Safe
                  </span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => handleUpdateCount(key, 'safe', -1)} className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800">-</button>
                    <span className="text-base font-mono font-bold text-white w-6 text-center">{value.safe}</span>
                    <button type="button" onClick={() => handleUpdateCount(key, 'safe', 1)} className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800">+</button>
                  </div>
                </div>

                {/* Faulty / Damaged Count Controls */}
                <div className="bg-brand-darkGray/40 border border-zinc-800/80 p-3 rounded-lg flex flex-col justify-between items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <Wrench size={11} className="text-brand-neonRed" /> Damaged / Broken
                  </span>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => handleUpdateCount(key, 'broken', -1)} className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800">-</button>
                    <span className="text-base font-mono font-bold text-brand-neonRed w-6 text-center">{value.broken}</span>
                    <button type="button" onClick={() => handleUpdateCount(key, 'broken', 1)} className="w-6 h-6 rounded bg-zinc-900 border border-zinc-800 text-white font-bold text-sm hover:bg-zinc-800">+</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Dynamic Discrepancy Text Entry */}
        <div className="space-y-1.5 text-xs">
          <label className="text-zinc-400 font-medium flex items-center gap-1.5">
            <AlertOctagon size={13} className="text-brand-neonRed" /> Exception Discrepancy Note
          </label>
          <textarea
            rows="2"
            placeholder="Describe damages, missing item details, or configuration faults..."
            value={discrepancyNote}
            onChange={(e) => setDiscrepancyNote(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50"
          />
        </div>

        {/* Submit CTA Trigger */}
        <button
          type="submit"
          className="w-full py-3 bg-brand-neonCyan hover:scale-[1.01] transition-transform text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.15)] flex items-center justify-center gap-2"
        >
          {submitStatus ? (
            <>
              <CheckCircle2 size={15} />
              <span>Telemetry Logs Dispatched</span>
            </>
          ) : (
            <span>Submit Operational Report</span>
          )}
        </button>
      </form>
    </div>
  );
}