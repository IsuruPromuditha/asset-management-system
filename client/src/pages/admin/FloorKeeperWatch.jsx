import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  User, 
  Layers,
  Search,
  RefreshCw,
  Send,
  BellRing,
  Plus,
  UserPlus,
  LayoutGrid,
  X,
  Edit2,
  Trash2,
  Laptop,
  Smartphone
} from 'lucide-react';

const initialFloorMeta = {
  1: { name: "Floor 1 - IT & Dev", keeper: "Amara Silva" },
  2: { name: "Floor 2 - Operations", keeper: "Gayan Perera" },
  3: { name: "Floor 3 - Executive", keeper: "Nimal Jayasinghe" },
  4: { name: "Floor 4 - Marketing", keeper: "Dilini Cooray" }
};

// Structural Data Hydration updating itemsChecked to individual device categories
const initialPlatformsData = {
  1: [
    { id: "P1-A", name: "Platform Alpha", responsible: "Asanka Perera", status: "completed", lastChecked: "10:30 AM", assets: { laptops: { checked: 15, total: 15 }, phones: { checked: 10, total: 10 } } },
    { id: "P1-B", name: "Platform Beta", responsible: "Kasun Silva", status: "completed", lastChecked: "11:15 AM", assets: { laptops: { checked: 8, total: 8 }, phones: { checked: 10, total: 10 } } },
    { id: "P1-C", name: "Platform Gamma", responsible: "Nimmi Fernando", status: "completed", lastChecked: "08:45 AM", assets: { laptops: { checked: 20, total: 20 }, phones: { checked: 10, total: 10 } } },
    { id: "P1-D", name: "Platform Delta", responsible: "Ruwan Kumara", status: "completed", lastChecked: "11:40 AM", assets: { laptops: { checked: 6, total: 6 }, phones: { checked: 6, total: 6 } } },
  ],
  2: [
    { id: "P2-A", name: "Platform Alpha", responsible: "Suresh Fernando", status: "completed", lastChecked: "09:15 AM", assets: { laptops: { checked: 10, total: 10 }, phones: { checked: 5, total: 5 } } },
    { id: "P2-B", name: "Platform Beta", responsible: "Dilhani Cooray", status: "in-progress", lastChecked: "Running Now", assets: { laptops: { checked: 5, total: 12 }, phones: { checked: 3, total: 10 } } },
    { id: "P2-C", name: "Platform Gamma", responsible: "Thilina Jayasinghe", status: "pending", lastChecked: "Not Started", assets: { laptops: { checked: 0, total: 8 }, phones: { checked: 0, total: 6 } } },
    { id: "P2-D", name: "Platform Delta", responsible: "Menaka Perera", status: "completed", lastChecked: "10:05 AM", assets: { laptops: { checked: 12, total: 12 }, phones: { checked: 7, total: 7 } } },
    { id: "P2-E", name: "Platform Epsilon", responsible: "Priyanka Silva", status: "pending", lastChecked: "Not Started", assets: { laptops: { checked: 0, total: 10 }, phones: { checked: 0, total: 10 } } },
  ],
  3: [
    { id: "P3-A", name: "Platform Alpha", responsible: "Nalin de Silva", status: "failed", lastChecked: "10:15 AM", assets: { laptops: { checked: 9, total: 10 }, phones: { checked: 5, total: 5 } }, discrepancy: "1 Laptop Missing" },
    { id: "P3-B", name: "Platform Beta", responsible: "Shani Alwis", status: "completed", lastChecked: "09:40 AM", assets: { laptops: { checked: 5, total: 5 }, phones: { checked: 6, total: 6 } } },
    { id: "P3-C", name: "Platform Gamma", responsible: "Rohan Fernando", status: "completed", lastChecked: "11:00 AM", assets: { laptops: { checked: 14, total: 14 }, phones: { checked: 10, total: 10 } } },
  ],
  4: [
    { id: "P4-A", name: "Platform Alpha", responsible: "Kavindi Perera", status: "completed", lastChecked: "09:00 AM", assets: { laptops: { checked: 10, total: 10 }, phones: { checked: 5, total: 5 } } },
    { id: "P4-B", name: "Platform Beta", responsible: "Roshan Silva", status: "completed", lastChecked: "10:30 AM", assets: { laptops: { checked: 12, total: 12 }, phones: { checked: 10, total: 10 } } }
  ]
};

export default function FloorKeeperWatch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { floorSlug } = useParams();
  
  const [floors, setFloors] = useState(initialFloorMeta);
  const [platformsData, setPlatformsData] = useState(initialPlatformsData);
  const [activeFloor, setActiveFloor] = useState(2); 
  const [search, setSearch] = useState("");
  const [alertStatus, setAlertStatus] = useState({ visible: false, type: '', message: '' });

  const [isKeeperModalOpen, setIsKeeperModalOpen] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [isEditPlatformModalOpen, setIsEditPlatformModalOpen] = useState(false);
  const [isDeletePlatformModalOpen, setIsDeletePlatformModalOpen] = useState(false);

  const [newKeeper, setNewKeeper] = useState({ targetFloor: "2", keeperName: "" });
  const [newPlatform, setNewPlatform] = useState({ name: "", responsible: "", targetLaptops: "10", targetPhones: "10" });
  
  const [editingPlatform, setEditingPlatform] = useState(null);
  const [platformIdToDelete, setPlatformIdToDelete] = useState(null);

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
  };

  useEffect(() => {
    if (floorSlug) {
      const matchedFloorId = Object.keys(floors).find(
        (id) => generateSlug(floors[id].name) === floorSlug
      );
      if (matchedFloorId) setActiveFloor(parseInt(matchedFloorId));
    } else if (location.state?.floorId) {
      setActiveFloor(location.state.floorId);
    }
  }, [floorSlug, location.state, floors]);

  useEffect(() => {
    if (alertStatus.visible) {
      const timer = setTimeout(() => setAlertStatus({ ...alertStatus, visible: false }), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertStatus.visible]);

  const currentFloorInfo = floors[activeFloor] || { name: `Floor ${activeFloor}`, keeper: "Unassigned" };
  const platforms = platformsData[activeFloor] || [];

  const totalPlatforms = platforms.length;
  const completedCount = platforms.filter(p => p.status === 'completed').length;
  const pendingCount = platforms.filter(p => p.status === 'pending' || p.status === 'in-progress').length;
  const anomalyCount = platforms.filter(p => p.status === 'failed').length;
  const isFloorFullyChecked = completedCount === totalPlatforms && totalPlatforms > 0;

  // Real-time aggregate count computations for devices across active floor metrics
  const floorTotals = platforms.reduce((acc, p) => {
    acc.laptopsChecked += p.assets.laptops.checked;
    acc.laptopsTotal += p.assets.laptops.total;
    acc.phonesChecked += p.assets.phones.checked;
    acc.phonesTotal += p.assets.phones.total;
    return acc;
  }, { laptopsChecked: 0, laptopsTotal: 0, phonesChecked: 0, phonesTotal: 0 });

  const filteredPlatforms = platforms.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.responsible.toLowerCase().includes(search.toLowerCase())
  );

  const handleTabChange = (floorId) => {
    const slug = generateSlug(floors[floorId].name);
    navigate(`/floors/${slug}`);
  };

  const handleSendKeeperAlert = () => {
    if (totalPlatforms === 0) return;
    if (isFloorFullyChecked) {
      setAlertStatus({ visible: true, type: 'success', message: `Check-ins for ${currentFloorInfo.name} are complete!` });
      return;
    }
    setAlertStatus({ visible: true, type: 'dispatched', message: `System dispatch sent to ${currentFloorInfo.keeper}` });
  };

  const handleAddKeeper = (e) => {
    e.preventDefault();
    if (!newKeeper.keeperName.trim()) return;
    const floorIdNum = parseInt(newKeeper.targetFloor);
    setFloors(prev => ({ ...prev, [floorIdNum]: { ...prev[floorIdNum], keeper: newKeeper.keeperName.trim() } }));
    setAlertStatus({ visible: true, type: 'success', message: `Assigned ${newKeeper.keeperName} to Floor ${floorIdNum}` });
    setIsKeeperModalOpen(false);
    setNewKeeper(prev => ({ ...prev, keeperName: "" }));
  };

  const handleAddPlatform = (e) => {
    e.preventDefault();
    if (!newPlatform.name.trim() || !newPlatform.responsible.trim()) return;

    const uniqueId = `P${activeFloor}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    const totalLaps = parseInt(newPlatform.targetLaptops) || 0;
    const totalPhon = parseInt(newPlatform.targetPhones) || 0;

    const constructedPlatform = {
      id: uniqueId,
      name: newPlatform.name.trim(),
      responsible: newPlatform.responsible.trim(),
      status: "pending",
      lastChecked: "Not Started",
      assets: {
        laptops: { checked: 0, total: totalLaps },
        phones: { checked: 0, total: totalPhon }
      }
    };

    setPlatformsData(prev => ({ ...prev, [activeFloor]: [...(prev[activeFloor] || []), constructedPlatform] }));
    setAlertStatus({ visible: true, type: 'success', message: `Platform ${newPlatform.name} created.` });
    setIsPlatformModalOpen(false);
    setNewPlatform({ name: "", responsible: "", targetLaptops: "10", targetPhones: "10" });
  };

  const handleUpdatePlatform = (e) => {
    e.preventDefault();
    if (!editingPlatform.name.trim() || !editingPlatform.responsible.trim()) return;

    setPlatformsData(prev => ({
      ...prev,
      [activeFloor]: prev[activeFloor].map(p => p.id === editingPlatform.id ? editingPlatform : p)
    }));

    setAlertStatus({ visible: true, type: 'success', message: `Updated configuration for ${editingPlatform.name}` });
    setIsEditPlatformModalOpen(false);
    setEditingPlatform(null);
  };

  const handleDeletePlatform = () => {
    setPlatformsData(prev => ({ ...prev, [activeFloor]: prev[activeFloor].filter(p => p.id !== platformIdToDelete) }));
    setAlertStatus({ visible: true, type: 'success', message: "Platform record purged successfully." });
    setIsDeletePlatformModalOpen(false);
    setPlatformIdToDelete(null);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Toast Alert Frame */}
      {alertStatus.visible && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl border shadow-xl animate-bounce bg-zinc-900 ${alertStatus.type === 'success' ? 'border-brand-neonGreen text-brand-neonGreen' : 'border-brand-neonRed text-brand-neonRed'}`}>
          <BellRing size={18} />
          <span className="text-xs font-semibold tracking-wide text-zinc-100">{alertStatus.message}</span>
        </div>
      )}

      {/* Header Profile Frame */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-brand-darkGray pb-5">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="p-2.5 bg-brand-darkGray border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-neonCyan uppercase tracking-wider">
              <Layers size={12} />
              <span>Floor Supervisor Monitoring Hub</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight mt-1">{currentFloorInfo.name}</h1>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => { setNewKeeper(prev => ({ ...prev, targetFloor: activeFloor.toString() })); setIsKeeperModalOpen(true); }} className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors">
            <UserPlus size={14} className="text-brand-neonCyan" />
            <span>Manage Keepers</span>
          </button>

          <button onClick={() => setIsPlatformModalOpen(true)} className="flex items-center gap-2 px-3.5 py-2 bg-brand-neonCyan/10 border border-brand-neonCyan/20 text-brand-neonCyan hover:bg-brand-neonCyan/20 rounded-lg text-xs font-medium transition-all">
            <Plus size={14} />
            <span>Add New Platform</span>
          </button>

          <div className="bg-brand-darkGray border border-zinc-800 px-4 py-2.5 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-neonCyan/10 border border-brand-neonCyan/20 flex items-center justify-center text-brand-neonCyan shrink-0">
              <User size={14} />
            </div>
            <div>
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Floor Keeper</p>
              <p className="text-xs font-semibold text-zinc-200">{currentFloorInfo.keeper}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Tab Menu */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-900 scrollbar-none">
        {Object.keys(floors).map((id) => {
          const floorId = parseInt(id);
          return (
            <button key={floorId} onClick={() => { handleTabChange(floorId); setSearch(""); }} className={`px-4 py-2 text-xs font-semibold rounded-lg tracking-wide border transition-all shrink-0 ${activeFloor === floorId ? 'bg-brand-neonCyan/10 border-brand-neonCyan/30 text-brand-neonCyan' : 'bg-brand-darkGray/40 border-zinc-800/80 text-zinc-400 hover:text-white'}`}>
              Floor {floorId}
            </button>
          );
        })}
      </div>

      {/* Dynamic Device Category Summary Panels */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Status Metrics Block */}
        <div className="xl:col-span-3 grid grid-cols-3 gap-4 bg-zinc-950/40 border border-zinc-900 p-4 rounded-xl">
          <div className="bg-brand-darkGray/40 border border-zinc-800/60 rounded-xl p-3 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
              <CheckCircle2 size={10} className="text-brand-neonGreen" /> Verified Hubs
            </span>
            <span className="text-xl font-bold text-white mt-1">{completedCount} <span className="text-xs font-medium text-zinc-600">/ {totalPlatforms}</span></span>
          </div>
          <div className="bg-brand-darkGray/40 border border-zinc-800/60 rounded-xl p-3 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
              <Clock size={10} className="text-brand-neonCyan" /> Active / Pending
            </span>
            <span className="text-xl font-bold text-white mt-1">{pendingCount}</span>
          </div>
          <div className="bg-brand-darkGray/40 border border-zinc-800/60 rounded-xl p-3 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1">
              <AlertOctagon size={10} className="text-brand-neonRed" /> Anomalies
            </span>
            <span className="text-xl font-bold text-white mt-1">{anomalyCount}</span>
          </div>
        </div>

        {/* Global Device Count Breakdowns on Selected Floor */}
        <div className="grid grid-cols-2 gap-4 bg-zinc-950/40 border border-zinc-900 p-4 rounded-xl xl:col-span-2">
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300"><Laptop size={16} /></div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Laptops (Floor)</p>
              <p className="text-base font-bold text-white mt-0.5">{floorTotals.laptopsChecked} <span className="text-xs text-zinc-500">/ {floorTotals.laptopsTotal}</span></p>
            </div>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-300"><Smartphone size={16} /></div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Phones (Floor)</p>
              <p className="text-base font-bold text-white mt-0.5">{floorTotals.phonesChecked} <span className="text-xs text-zinc-500">/ {floorTotals.phonesTotal}</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Utility Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-brand-darkGray p-4 rounded-xl border border-zinc-800">
        <div className="relative w-full md:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text" placeholder="Filter platforms or personnel..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neonCyan/40"
          />
        </div>

        <button
          onClick={handleSendKeeperAlert} disabled={totalPlatforms === 0}
          className={`w-full md:w-auto px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2
            ${totalPlatforms === 0 ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed' :
              isFloorFullyChecked ? 'bg-brand-neonGreen/5 border-brand-neonGreen/20 text-brand-neonGreen cursor-not-allowed' : 'bg-brand-neonRed/10 border-brand-neonRed/30 text-brand-neonRed hover:bg-brand-neonRed hover:text-white'
            }`}
        >
          <Send size={13} />
          <span>{isFloorFullyChecked ? "Check-ins Cleared" : "Alert Floor Keeper"}</span>
        </button>
      </div>

      {/* Platforms Display Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredPlatforms.length > 0 ? (
          filteredPlatforms.map((platform) => {
            const lapPerc = (platform.assets.laptops.checked / (platform.assets.laptops.total || 1)) * 100;
            const phnPerc = (platform.assets.phones.checked / (platform.assets.phones.total || 1)) * 100;

            return (
              <div 
                key={platform.id}
                className={`bg-brand-darkGray border rounded-xl p-5 flex flex-col justify-between transition-all group relative
                  ${platform.status === 'completed' ? 'border-brand-neonGreen/10 hover:border-brand-neonGreen/30' : ''}
                  ${platform.status === 'in-progress' ? 'border-brand-neonCyan/30 hover:border-brand-neonCyan' : ''}
                  ${platform.status === 'pending' ? 'border-zinc-800/80' : ''}
                  ${platform.status === 'failed' ? 'border-brand-neonRed bg-brand-neonRed/[0.01]' : ''}
                `}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-brand-neonCyan transition-colors">{platform.name}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                        <User size={12} /> Lead: {platform.responsible}
                      </p>
                    </div>

                    <div className="flex items-center">
                      {platform.status === 'completed' && <span className="bg-brand-neonGreen/10 text-brand-neonGreen border border-brand-neonGreen/20 text-[10px] font-bold px-2 py-0.5 rounded-md">VERIFIED</span>}
                      {platform.status === 'in-progress' && <span className="bg-brand-neonCyan/10 text-brand-neonCyan border border-brand-neonCyan/20 text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse">AUDITING</span>}
                      {platform.status === 'pending' && <span className="bg-zinc-800 text-zinc-500 border border-zinc-700 text-[10px] font-bold px-2 py-0.5 rounded-md">PENDING</span>}
                      {platform.status === 'failed' && <span className="bg-brand-neonRed/10 text-brand-neonRed border border-brand-neonRed/30 text-[10px] font-bold px-2 py-0.5 rounded-md">ANOMALY</span>}
                    </div>
                  </div>

                  {/* Device Category Inventory Bars */}
                  <div className="mt-5 space-y-3">
                    {/* Laptop Counter Item */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400 flex items-center gap-1.5"><Laptop size={12} /> Laptops</span>
                        <span className="text-white font-mono font-semibold">{platform.assets.laptops.checked} / {platform.assets.laptops.total}</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden border border-zinc-900/60">
                        <div className={`h-full rounded-full ${platform.status === 'failed' ? 'bg-brand-neonRed' : 'bg-brand-neonGreen'}`} style={{ width: `${lapPerc}%` }} />
                      </div>
                    </div>

                    {/* Phone Counter Item */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400 flex items-center gap-1.5"><Smartphone size={12} /> Phones</span>
                        <span className="text-white font-mono font-semibold">{platform.assets.phones.checked} / {platform.assets.phones.total}</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden border border-zinc-900/60">
                        <div className={`h-full rounded-full ${platform.status === 'failed' ? 'bg-brand-neonRed' : 'bg-brand-neonCyan'}`} style={{ width: `${phnPerc}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {platform.discrepancy && (
                  <div className="mt-4 p-2 bg-brand-neonRed/10 border border-brand-neonRed/20 rounded-lg text-brand-neonRed text-xs font-semibold flex items-center gap-2">
                    <img src="" alt="" /><AlertOctagon size={14} />
                    <span>{platform.discrepancy}</span>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500 font-medium">
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditingPlatform(JSON.parse(JSON.stringify(platform))); setIsEditPlatformModalOpen(true); }} className="p-1 text-zinc-500 hover:text-brand-neonCyan hover:bg-brand-neonCyan/10 rounded">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => { setPlatformIdToDelete(platform.id); setIsDeletePlatformModalOpen(true); }} className="p-1 text-zinc-500 hover:text-brand-neonRed hover:bg-brand-neonRed/10 rounded">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="font-mono text-zinc-400">{platform.lastChecked}</div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-zinc-500 text-sm font-medium border border-dashed border-zinc-800 rounded-xl">
            No platforms matching filter parameters are operational on this level.
          </div>
        )}
      </div>

      {/* MODAL DIALOG: ASSIGN KEEPER */}
      {isKeeperModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-darkGray border border-zinc-800 rounded-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <UserPlus size={16} className="text-brand-neonCyan" /> Reassign Floor Keeper
              </h3>
              <button onClick={() => setIsKeeperModalOpen(false)} className="text-zinc-500 hover:text-white p-1 rounded-lg"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddKeeper} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Select Target Level</label>
                <select value={newKeeper.targetFloor} onChange={e => setNewKeeper({...newKeeper, targetFloor: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none">
                  {Object.entries(floors).map(([id, meta]) => (
                    <option key={id} value={id}>{meta.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Personnel Name</label>
                <input type="text" required value={newKeeper.keeperName} onChange={e => setNewKeeper({...newKeeper, keeperName: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsKeeperModalOpen(false)} className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-lg border border-zinc-800">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-neonCyan text-zinc-950 font-bold rounded-lg">Save Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: INSTANTIATE NEW PLATFORM */}
      {isPlatformModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-darkGray border border-zinc-800 rounded-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <LayoutGrid size={16} className="text-brand-neonCyan" /> Create Platform (Floor {activeFloor})
              </h3>
              <button onClick={() => setIsPlatformModalOpen(false)} className="text-zinc-500 hover:text-white p-1 rounded-lg"><X size={16} /></button>
            </div>
            <form onSubmit={handleAddPlatform} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Platform Designation Name</label>
                <input type="text" placeholder="e.g. Platform Epsilon" required value={newPlatform.name} onChange={e => setNewPlatform({...newPlatform, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Responsible Lead Officer</label>
                <input type="text" placeholder="e.g. Nimmi Fernando" required value={newPlatform.responsible} onChange={e => setNewPlatform({...newPlatform, responsible: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5 flex items-center gap-1"><Laptop size={12}/> Laptop Quota</label>
                  <input type="number" min="0" required value={newPlatform.targetLaptops} onChange={e => setNewPlatform({...newPlatform, targetLaptops: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none font-mono" />
                </div>
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5 flex items-center gap-1"><Smartphone size={12}/> Phone Quota</label>
                  <input type="number" min="0" required value={newPlatform.targetPhones} onChange={e => setNewPlatform({...newPlatform, targetPhones: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none font-mono" />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsPlatformModalOpen(false)} className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-lg border border-zinc-800">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-neonCyan text-zinc-950 font-bold rounded-lg">Instantiate Hub</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: UPDATE EXISTING PLATFORM */}
      {isEditPlatformModalOpen && editingPlatform && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-darkGray border border-zinc-800 rounded-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                <Edit2 size={15} className="text-brand-neonCyan" /> Modify Platform Metrics
              </h3>
              <button onClick={() => { setIsEditPlatformModalOpen(false); setEditingPlatform(null); }} className="text-zinc-500 hover:text-white p-1 rounded-lg"><X size={16} /></button>
            </div>
            <form onSubmit={handleUpdatePlatform} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Platform Designation Name</label>
                <input type="text" required value={editingPlatform.name} onChange={e => setEditingPlatform({...editingPlatform, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none" />
              </div>
              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Responsible Lead Officer</label>
                <input type="text" required value={editingPlatform.responsible} onChange={e => setEditingPlatform({...editingPlatform, responsible: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-zinc-950/50 p-3 rounded-lg border border-zinc-900">
                <div className="space-y-2">
                  <span className="text-zinc-400 font-bold tracking-wide flex items-center gap-1 text-[10px] uppercase"><Laptop size={11}/> Laptops</span>
                  <div className="flex items-center gap-1.5">
                    <input type="number" min="0" max={editingPlatform.assets.laptops.total} value={editingPlatform.assets.laptops.checked} onChange={e => {
                      const val = Math.min(parseInt(e.target.value) || 0, editingPlatform.assets.laptops.total);
                      const updated = { ...editingPlatform };
                      updated.assets.laptops.checked = val;
                      setEditingPlatform(updated);
                    }} className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 font-mono text-center text-white" title="Checked Count" />
                    <span className="text-zinc-600">/</span>
                    <input type="number" min="1" value={editingPlatform.assets.laptops.total} onChange={e => {
                      const val = parseInt(e.target.value) || 1;
                      const updated = { ...editingPlatform };
                      updated.assets.laptops.total = val;
                      if (updated.assets.laptops.checked > val) updated.assets.laptops.checked = val;
                      setEditingPlatform(updated);
                    }} className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 font-mono text-center text-zinc-400" title="Total Asset Count" />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-zinc-400 font-bold tracking-wide flex items-center gap-1 text-[10px] uppercase"><Smartphone size={11}/> Phones</span>
                  <div className="flex items-center gap-1.5">
                    <input type="number" min="0" max={editingPlatform.assets.phones.total} value={editingPlatform.assets.phones.checked} onChange={e => {
                      const val = Math.min(parseInt(e.target.value) || 0, editingPlatform.assets.phones.total);
                      const updated = { ...editingPlatform };
                      updated.assets.phones.checked = val;
                      setEditingPlatform(updated);
                    }} className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 font-mono text-center text-white" />
                    <span className="text-zinc-600">/</span>
                    <input type="number" min="1" value={editingPlatform.assets.phones.total} onChange={e => {
                      const val = parseInt(e.target.value) || 1;
                      const updated = { ...editingPlatform };
                      updated.assets.phones.total = val;
                      if (updated.assets.phones.checked > val) updated.assets.phones.checked = val;
                      setEditingPlatform(updated);
                    }} className="w-full bg-zinc-900 border border-zinc-800 rounded p-1.5 font-mono text-center text-zinc-400" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Audit Evaluation Status</label>
                <select 
                  value={editingPlatform.status} 
                  onChange={e => {
                    const nextStatus = e.target.value;
                    let lastCheckText = editingPlatform.lastChecked;
                    const updated = JSON.parse(JSON.stringify(editingPlatform));
                    
                    if (nextStatus === 'completed') {
                      updated.assets.laptops.checked = updated.assets.laptops.total;
                      updated.assets.phones.checked = updated.assets.phones.total;
                      lastCheckText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    } else if (nextStatus === 'pending') {
                      updated.assets.laptops.checked = 0;
                      updated.assets.phones.checked = 0;
                      lastCheckText = "Not Started";
                    } else if (nextStatus === 'in-progress') {
                      lastCheckText = "Running Now";
                    }

                    setEditingPlatform({
                      ...updated, 
                      status: nextStatus,
                      lastChecked: lastCheckText,
                      ...(nextStatus !== 'failed' && { discrepancy: undefined })
                    });
                  }}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress (Running)</option>
                  <option value="completed">Completed (Verified)</option>
                  <option value="failed">Failed (Anomaly)</option>
                </select>
              </div>

              {editingPlatform.status === 'failed' && (
                <div>
                  <label className="block text-brand-neonRed font-medium mb-1.5">Discrepancy Log Note</label>
                  <input type="text" placeholder="e.g. 1 Laptop Missing" required value={editingPlatform.discrepancy || ""} onChange={e => setEditingPlatform({...editingPlatform, discrepancy: e.target.value})} className="w-full bg-zinc-950 border border-brand-neonRed/30 rounded-lg p-2.5 text-white focus:outline-none" />
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => { setIsEditPlatformModalOpen(false); setEditingPlatform(null); }} className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-lg border border-zinc-800">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-neonCyan text-zinc-950 font-bold rounded-lg">Commit Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: DESTRUCTIVE REMOVAL */}
      {isDeletePlatformModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-darkGray border border-brand-neonRed/30 rounded-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3 text-brand-neonRed">
              <Trash2 size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Purge Platform Architecture</h3>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">Are you sure you want to completely tear down this platform workspace from Floor {activeFloor}? All structural logs will be deleted from memory.</p>
            <div className="pt-2 flex justify-end gap-2 text-xs font-semibold">
              <button type="button" onClick={() => { setIsDeletePlatformModalOpen(false); setPlatformIdToDelete(null); }} className="px-4 py-2 bg-zinc-900 text-zinc-400 rounded-lg border border-zinc-800">Abort</button>
              <button type="button" onClick={handleDeletePlatform} className="px-4 py-2 bg-brand-neonRed/20 border border-brand-neonRed/30 text-brand-neonRed hover:bg-brand-neonRed hover:text-white rounded-lg">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}