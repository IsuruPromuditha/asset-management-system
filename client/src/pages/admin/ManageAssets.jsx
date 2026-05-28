import { useState } from 'react';
import { 
  Search, 
  Laptop, 
  Smartphone, 
  Plus, 
  Layers,
  User,
  AlertCircle,
  Hash,
  Monitor,
  Box,
  X,
  Edit2,
  Trash2,
  MapPin,
  CheckCircle2
} from 'lucide-react';

// Temporary mock inventory data matching your relational DB schema
const initialAssets = [
  { id: 1, tag: "LAP-042", type: "Laptop", model: "MacBook Pro M3", floor: "Floor 1", platform: "Platform Alpha", user: "Gayan Perera", status: "Present" },
  { id: 2, tag: "PHN-109", type: "Phone", model: "iPhone 15 Pro", floor: "Floor 1", platform: "Platform Gamma", user: "Dilini Silva", status: "Present" },
  { id: 3, tag: "LAP-088", type: "Laptop", model: "Lenovo ThinkPad", floor: "Floor 3", platform: "Platform Delta", user: "Nimal Fernando", status: "Missing" },
  { id: 4, tag: "PHN-051", type: "Phone", model: "Samsung S24", floor: "Floor 2", platform: "Platform Beta", user: "Kavindi Cooray", status: "Damaged" },
  { id: 5, tag: "LAP-102", type: "Laptop", model: "Dell Latitude", floor: "Floor 4", platform: "Platform Epsilon", user: "Amara Jayasinghe", status: "Present" },
  { id: 6, tag: "LAP-105", type: "Laptop", model: "HP EliteBook", floor: "Floor 1", platform: "Platform Alpha", user: "Kasun Silva", status: "Present" },
];

export default function ManageAssets() {
  const [assets, setAssets] = useState(initialAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTypeTab, setActiveTypeTab] = useState("All");
  
  // Track currently active floor context ("All" vs specific floors)
  const [activeFloorContext, setActiveFloorContext] = useState("All");

  // State handles for context-aware modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form Management Pointers
  const [newAsset, setNewAsset] = useState({
    tag: "", type: "Laptop", model: "", floor: "Floor 1", platform: "Platform Alpha", user: "", status: "Present"
  });
  const [editingAsset, setEditingAsset] = useState(null);
  const [assetIdToDelete, setAssetIdToDelete] = useState(null);

  // Unique list of floors extracted dynamically for the sub-navigation tabs
  const floorsList = ["All", "Floor 1", "Floor 2", "Floor 3", "Floor 4"];

  // ----------------------------------------------------
  // REAL-TIME ANALYTICS CALCULATIONS
  // ----------------------------------------------------
  const globalTotalAssets = assets.length;

  const contextualFloorAssets = assets.filter(asset => 
    activeFloorContext === "All" || asset.floor === activeFloorContext
  );

  const contextualUniquePlatforms = Array.from(
    new Set(contextualFloorAssets.map(asset => asset.platform))
  ).filter(Boolean);

  const platformCountsBreakdown = contextualUniquePlatforms.reduce((acc, currentPlatform) => {
    const deviceCountOnPlatform = contextualFloorAssets.filter(a => a.platform === currentPlatform).length;
    acc[currentPlatform] = deviceCountOnPlatform;
    return acc;
  }, {});

  // ----------------------------------------------------
  // FILTER RULES FOR MAIN DIRECTORY DATA TABLE
  // ----------------------------------------------------
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = 
      asset.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.platform.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTypeTab = activeTypeTab === "All" || asset.type === activeTypeTab;
    const matchesFloorContext = activeFloorContext === "All" || asset.floor === activeFloorContext;

    return matchesSearch && matchesTypeTab && matchesFloorContext;
  });

  // ----------------------------------------------------
  // ACTION EVENT HANDLERS
  // ----------------------------------------------------
  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!newAsset.tag || !newAsset.model || !newAsset.user) return;

    const addedRecord = {
      id: assets.length > 0 ? Math.max(...assets.map(a => a.id)) + 1 : 1,
      ...newAsset
    };

    setAssets([...assets, addedRecord]);
    setIsModalOpen(false);
    setNewAsset({
      tag: "", type: "Laptop", model: "", floor: activeFloorContext === "All" ? "Floor 1" : activeFloorContext, 
      platform: "Platform Alpha", user: "", status: "Present"
    });
  };

  const handleUpdateAsset = (e) => {
    e.preventDefault();
    if (!editingAsset.tag || !editingAsset.model || !editingAsset.user) return;

    setAssets(assets.map(asset => asset.id === editingAsset.id ? editingAsset : asset));
    setIsEditModalOpen(false);
    setEditingAsset(null);
  };

  const handleDeleteAsset = () => {
    setAssets(assets.filter(asset => asset.id !== assetIdToDelete));
    setIsDeleteModalOpen(false);
    setAssetIdToDelete(null);
  };

  return (
    <div className="space-y-6 px-2 sm:px-4 max-w-7xl mx-auto text-zinc-100">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Asset Directory</h1>
          <p className="text-sm text-zinc-400 mt-1">Manage corporate inventory across floors and operational units.</p>
        </div>
        <button 
          onClick={() => {
            if (activeFloorContext !== "All") {
              setNewAsset(prev => ({ ...prev, floor: activeFloorContext }));
            }
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 w-full lg:w-auto px-4 py-2.5 bg-brand-neonCyan/10 text-brand-neonCyan hover:bg-brand-neonCyan/20 border border-brand-neonCyan/30 rounded-lg font-medium transition-all duration-200 shadow-[0_0_15px_rgba(0,243,255,0.05)] text-sm"
        >
          <Plus size={18} />
          <span>Add Device to {activeFloorContext === "All" ? "Inventory" : activeFloorContext}</span>
        </button>
      </div>

      {/* SYSTEM FLOORS PERSPECTIVE TRACK BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-900/60 scrollbar-none -mx-2 px-2 sm:mx-0 sm:px-0">
        {floorsList.map((floorOption) => {
          const isSelected = activeFloorContext === floorOption;
          return (
            <button
              key={floorOption}
              onClick={() => {
                setActiveFloorContext(floorOption);
                setSearchTerm("");
              }}
              className={`px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg tracking-wide border transition-all duration-200 shrink-0
                ${isSelected 
                  ? 'bg-brand-neonCyan/10 border-brand-neonCyan/30 text-brand-neonCyan shadow-[0_0_15px_rgba(0,243,255,0.04)]' 
                  : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:text-white hover:border-zinc-700'
                }
              `}
            >
              {floorOption === "All" ? "Global Facility Overview" : floorOption}
            </button>
          );
        })}
      </div>

      {/* CONTEXT INFRASTRUCTURE METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              {activeFloorContext === "All" ? "Total Inventory Registered" : `Devices on ${activeFloorContext}`}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {contextualFloorAssets.length} 
              {activeFloorContext !== "All" && (
                <span className="text-xs font-medium text-zinc-500 ml-1.5">
                  of {globalTotalAssets} global
                </span>
              )}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-brand-neonCyan/5 border border-brand-neonCyan/15 flex items-center justify-center text-brand-neonCyan shrink-0">
            <Monitor size={18} />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              {activeFloorContext === "All" ? "Total Active Hubs Facilitywide" : `Active Hubs on ${activeFloorContext}`}
            </p>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              {contextualUniquePlatforms.length} <span className="text-xs font-medium text-zinc-500">Platforms</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
            <Layers size={18} />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl flex flex-col justify-center min-h-[76px]">
          <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1.5 flex items-center gap-1">
            <Box size={10} /> Platform Allocation Density
          </p>
          {contextualUniquePlatforms.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 max-h-[60px] overflow-y-auto scrollbar-none">
              {Object.entries(platformCountsBreakdown).map(([platformName, deviceCount]) => (
                <span key={platformName} className="inline-flex items-center bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800/60 text-[10px] text-zinc-300 font-mono">
                  {platformName.replace("Platform ", "")}: <strong className="text-brand-neonCyan ml-1">{deviceCount}</strong>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-600 italic">No assigned platform grids available for telemetry layout.</p>
          )}
        </div>
      </div>

      {/* Control Bar: Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/80">
        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800/60 overflow-x-auto scrollbar-none">
          {["All", "Laptop", "Phone"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTypeTab(tab)}
              className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-150 shrink-0 ${
                activeTypeTab === tab
                  ? 'bg-zinc-800 text-brand-neonCyan shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab === "Laptop" && <Laptop size={14} className="inline mr-1.5 -mt-0.5" />}
              {tab === "Phone" && <Smartphone size={14} className="inline mr-1.5 -mt-0.5" />}
              {tab}{tab !== "All" ? "s" : ""}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs md:max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder={`Search asset items...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800/80 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-neonCyan/50 transition-colors"
          />
        </div>
      </div>

      {/* Directory Records Presentation Area */}
      <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-xl overflow-hidden">
        
        {/* DESKTOP MATRIX VIEWPORTS (md and up) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800/80 bg-zinc-900/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <th className="p-4">Asset Tag</th>
                <th className="p-4">Device Specs</th>
                <th className="p-4">Location Assignment</th>
                <th className="p-4">Current Holder</th>
                <th className="p-4 text-center">Audit Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-sm">
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-zinc-900/20 transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-neonCyan tracking-wide">
                      <div className="flex items-center gap-2">
                        {asset.type === "Laptop" ? <Laptop size={16} /> : <Smartphone size={16} />}
                        {asset.tag}
                      </div>
                    </td>
                    <td className="p-4 text-zinc-200 font-medium">{asset.model}</td>
                    <td className="p-4 text-zinc-300">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <Layers size={13} className="text-zinc-500" />
                        <span className="font-medium text-zinc-200">{asset.floor}</span>
                        <span className="text-zinc-600">➔</span>
                        <span className="text-zinc-300">{asset.platform}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                          <User size={12} className="text-zinc-400" />
                        </div>
                        <span className="text-xs font-medium">{asset.user}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
                          asset.status === 'Present' 
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                            : asset.status === 'Missing'
                            ? 'bg-red-500/5 border-red-500/20 text-red-400 animate-pulse'
                            : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                        }`}>
                          {asset.status !== 'Present' && <AlertCircle size={12} />}
                          {asset.status}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setEditingAsset({ ...asset });
                            setIsEditModalOpen(true);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-brand-neonCyan hover:bg-brand-neonCyan/10 rounded transition-all"
                          title="Edit Operational Asset"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setAssetIdToDelete(asset.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all"
                          title="Purge Inventory Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-zinc-500 font-medium">
                    No matching assets found within this layout layer filter parameter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* RESPONSIVE MOBILE CARD INTERFACE (Fallback for viewports < md) */}
        <div className="block md:hidden p-4 space-y-4">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <div 
                key={asset.id} 
                className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4 space-y-3 relative overflow-hidden"
              >
                {/* Mobile Card Header */}
                <div className="flex items-start justify-between border-b border-zinc-800/60 pb-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-brand-neonCyan font-mono font-bold text-sm tracking-wider">
                      {asset.type === "Laptop" ? <Laptop size={15} /> : <Smartphone size={15} />}
                      <span>{asset.tag}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white">{asset.model}</h4>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    asset.status === 'Present' 
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' 
                      : asset.status === 'Missing'
                      ? 'bg-red-500/5 border-red-500/20 text-red-400 animate-pulse'
                      : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                  }`}>
                    {asset.status}
                  </span>
                </div>

                {/* Mobile Card Metadata Grid */}
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-xs text-zinc-400">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase text-zinc-600 font-bold tracking-tight block">Deployment Node</span>
                    <div className="flex items-center gap-1 text-zinc-200">
                      <MapPin size={11} className="text-zinc-500" />
                      <span>{asset.floor}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase text-zinc-600 font-bold tracking-tight block">Functional Target</span>
                    <span className="text-zinc-300 font-medium block truncate">{asset.platform}</span>
                  </div>

                  <div className="col-span-2 space-y-1 pt-1 border-t border-zinc-800/30">
                    <span className="text-[10px] uppercase text-zinc-600 font-bold tracking-tight block">Current Account Holder</span>
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 shrink-0">
                        <User size={10} />
                      </div>
                      <span className="text-xs truncate">{asset.user}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Card Action Drawer */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/60">
                  <button
                    onClick={() => {
                      setEditingAsset({ ...asset });
                      setIsEditModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 text-zinc-400 hover:text-brand-neonCyan bg-zinc-950 border border-zinc-800 rounded-lg transition-all"
                  >
                    <Edit2 size={12} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => {
                      setAssetIdToDelete(asset.id);
                      setIsDeleteModalOpen(true);
                    }}
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 text-zinc-400 hover:text-red-400 bg-zinc-950 border border-zinc-800 rounded-lg transition-all"
                  >
                    <Trash2 size={12} />
                    <span>Purge</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-zinc-500 text-xs font-medium">
              No matching assets found within this layout layer filter parameter.
            </div>
          )}
        </div>

      </div>

      {/* MODAL DIALOG: ADD ASSET PANEL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Plus size={18} className="text-brand-neonCyan" /> 
                <span>Register New Device Module</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddAsset} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Asset Tag</label>
                  <input 
                    type="text" placeholder="e.g. LAP-120" required
                    value={newAsset.tag} onChange={e => setNewAsset({...newAsset, tag: e.target.value.toUpperCase()})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Device Type</label>
                  <select 
                    value={newAsset.type} onChange={e => setNewAsset({...newAsset, type: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50 text-xs"
                  >
                    <option value="Laptop">Laptop</option>
                    <option value="Phone">Phone</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Model Specifications</label>
                <input 
                  type="text" placeholder="e.g. Asus ZenBook / iPhone 15" required
                  value={newAsset.model} onChange={e => setNewAsset({...newAsset, model: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Floor Mapping</label>
                  <select 
                    value={newAsset.floor} onChange={e => setNewAsset({...newAsset, floor: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50 text-xs"
                  >
                    {floorsList.filter(f => f !== "All").map(floorName => (
                      <option key={floorName} value={floorName}>{floorName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Platform Assignment</label>
                  <select 
                    value={newAsset.platform} onChange={e => setNewAsset({...newAsset, platform: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50 text-xs"
                  >
                    <option value="Platform Alpha">Platform Alpha</option>
                    <option value="Platform Beta">Platform Beta</option>
                    <option value="Platform Gamma">Platform Gamma</option>
                    <option value="Platform Delta">Platform Delta</option>
                    <option value="Platform Epsilon">Platform Epsilon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Responsible Current Holder</label>
                <input 
                  type="text" placeholder="e.g. Suresh Fernando" required
                  value={newAsset.user} onChange={e => setNewAsset({...newAsset, user: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50 text-xs"
                />
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full sm:w-auto px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg font-medium transition-colors border border-zinc-800">Cancel</button>
                <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-brand-neonCyan text-zinc-950 font-bold rounded-lg hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,243,255,0.2)]">Add Device</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: UPDATE ASSET PANEL */}
      {isEditModalOpen && editingAsset && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-5 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Edit2 size={16} className="text-brand-neonCyan" /> 
                <span>Modify Inventory Asset Specs</span>
              </h3>
              <button onClick={() => { setIsEditModalOpen(false); setEditingAsset(null); }} className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateAsset} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Asset Tag</label>
                  <input 
                    type="text" required
                    value={editingAsset.tag} onChange={e => setEditingAsset({...editingAsset, tag: e.target.value.toUpperCase()})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Device Condition Status</label>
                  <select 
                    value={editingAsset.status} onChange={e => setEditingAsset({...editingAsset, status: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50 text-xs"
                  >
                    <option value="Present">Present</option>
                    <option value="Missing">Missing</option>
                    <option value="Damaged">Damaged</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Model Specifications</label>
                <input 
                  type="text" required
                  value={editingAsset.model} onChange={e => setEditingAsset({...editingAsset, model: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Floor Mapping</label>
                  <select 
                    value={editingAsset.floor} onChange={e => setEditingAsset({...editingAsset, floor: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50 text-xs"
                  >
                    {floorsList.filter(f => f !== "All").map(floorName => (
                      <option key={floorName} value={floorName}>{floorName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 font-medium mb-1.5">Platform Assignment</label>
                  <select 
                    value={editingAsset.platform} onChange={e => setEditingAsset({...editingAsset, platform: e.target.value})}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50 text-xs"
                  >
                    <option value="Platform Alpha">Platform Alpha</option>
                    <option value="Platform Beta">Platform Beta</option>
                    <option value="Platform Gamma">Platform Gamma</option>
                    <option value="Platform Delta">Platform Delta</option>
                    <option value="Platform Epsilon">Platform Epsilon</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1.5">Responsible Holder</label>
                <input 
                  type="text" required
                  value={editingAsset.user} onChange={e => setEditingAsset({...editingAsset, user: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-brand-neonCyan/50 text-xs"
                />
              </div>

              <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-2">
                <button type="button" onClick={() => { setIsEditModalOpen(false); setEditingAsset(null); }} className="w-full sm:w-auto px-4 py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg font-medium transition-colors border border-zinc-800">Cancel</button>
                <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-brand-neonCyan text-zinc-950 font-bold rounded-lg hover:bg-white transition-colors shadow-[0_0_15px_rgba(0,243,255,0.2)]">Commit Metrics</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DIALOG: DESTRUCTIVE CONFIRMATION DELETION FRAME */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-red-500/30 rounded-xl max-w-sm w-full p-6 space-y-4 shadow-[0_0_30px_rgba(239,68,68,0.05)]">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <Trash2 size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Purge System Parameter</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">Asset Directory Modification Safeguard</p>
              </div>
            </div>
            
            <p className="text-xs text-zinc-400 leading-relaxed">
              Are you certain you want to destroy this unique hardware record tracking map? This operation cannot be uncommitted.
            </p>

            <div className="pt-2 flex flex-col-reverse sm:flex-row justify-end gap-2 text-xs font-semibold">
              <button 
                type="button" 
                onClick={() => { setIsDeleteModalOpen(false); setAssetIdToDelete(null); }} 
                className="w-full sm:w-auto px-4 py-2 bg-zinc-950 text-zinc-400 hover:text-white rounded-lg border border-zinc-800"
              >
                Abort
              </button>
              <button 
                type="button" 
                onClick={handleDeleteAsset} 
                className="w-full sm:w-auto px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}