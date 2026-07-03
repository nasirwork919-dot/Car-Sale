import React, { useState, useMemo } from 'react';
import { 
  Shield, AlertTriangle, FileText, Search, Activity, Users, Download, Plus, 
  MapPin, CheckCircle, RefreshCw, Layers, BrainCircuit, ExternalLink, Calendar,
  Paperclip, Tag, ArrowRight, CornerDownRight, Scale, Trash2, CheckCircle2, X
} from 'lucide-react';
import { VEHICLES } from '../../data';
import { Vehicle } from '../../types';
import { NumericTransition } from '../AnimatedCounter';

interface Evidence {
  id: string;
  title: string;
  type: string;
  timestamp: string;
  custodian: string;
  notes: string;
  fileUrl?: string;
}

interface Case {
  id: string;
  title: string;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Seized';
  severity: 'High' | 'Medium' | 'Low';
  suspectName: string;
  primaryVin: string;
  description: string;
  reportedAt: string;
  badgeId: string;
  evidence: Evidence[];
}

interface WatchlistVehicle {
  vin: string;
  year: number;
  make: string;
  model: string;
  reason: 'Stolen' | 'Cloned VIN' | 'Customs Export Fraud' | 'Odometer Rollback';
  reportedAt: string;
  status: 'Active' | 'Interrogated' | 'Recovered';
  notes: string;
}

interface AlertFeedItem {
  id: string;
  sender: 'Car Portal' | 'Insurance API' | 'Government Customs' | 'Field Report';
  message: string;
  timestamp: string;
  urgency: 'Flagrant' | 'Suspicious' | 'Notice';
  vin: string;
  resolved: boolean;
}

interface NetworkNode {
  id: string;
  label: string;
  type: 'VIN' | 'Suspect' | 'Dealer' | 'Address' | 'IP';
  x: number;
  y: number;
  ip?: string;
  role?: string;
}

interface NetworkEdge {
  from: string;
  to: string;
  label: string;
}

export default function PoliceDashboard() {
  const [activeTab, setActiveTab] = useState<'cases' | 'watchlist' | 'ai-net' | 'alerts'>('cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CASE-2026-01');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create / Edit Case Forms State
  const [showCreateCaseModal, setShowCreateCaseModal] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseVin, setNewCaseVin] = useState('');
  const [newCaseSuspect, setNewCaseSuspect] = useState('');
  const [newCaseSeverity, setNewCaseSeverity] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newCaseDesc, setNewCaseDesc] = useState('');
  const [newCaseBadge, setNewCaseBadge] = useState('LEO-8820');

  // Evidence Form State
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [evidenceName, setEvidenceName] = useState('');
  const [evidenceType, setEvidenceType] = useState('Physical Component');
  const [evidenceCustodian, setEvidenceCustodian] = useState('Off. Sarah Connor');
  const [evidenceNotes, setEvidenceNotes] = useState('');

  // Seizure report rendering overlay
  const [selectedSeizureReport, setSelectedSeizureReport] = useState<Case | null>(null);

  // Stateful watchlists
  const [watchlist, setWatchlist] = useState<WatchlistVehicle[]>([
    {
      vin: 'WAUB8AF21MN05XXXX',
      year: 2021,
      make: 'Audi',
      model: 'RS6 Avant',
      reason: 'Cloned VIN',
      reportedAt: '2026-06-01 10:24',
      status: 'Active',
      notes: 'Marketplace listing matches cloned VIN from California parts ring.'
    },
    {
      vin: 'SAJGV2RE8MA124850',
      year: 2022,
      make: 'Land Rover',
      model: 'Range Rover Sport',
      reason: 'Stolen',
      reportedAt: '2026-06-08 14:15',
      status: 'Active',
      notes: 'Reported stolen in West Palm Beach, Florida. Tracker deactivated near port.'
    },
    {
      vin: 'WP0AB2A92MS299212',
      year: 2021,
      make: 'Porsche',
      model: '911 Carrera S',
      reason: 'Customs Export Fraud',
      reportedAt: '2026-05-18 09:12',
      status: 'Recovered',
      notes: 'Import tariff undervalued by 70%. Cleared after audit adjustment.'
    }
  ]);

  const [newWatchlistVin, setNewWatchlistVin] = useState('');
  const [newWatchlistMake, setNewWatchlistMake] = useState('');
  const [newWatchlistModel, setNewWatchlistModel] = useState('');
  const [newWatchlistReason, setNewWatchlistReason] = useState<'Stolen' | 'Cloned VIN' | 'Customs Export Fraud' | 'Odometer Rollback'>('Stolen');
  const [newWatchlistNotes, setNewWatchlistNotes] = useState('');
  const [showAddToWatchlist, setShowAddToWatchlist] = useState(false);

  // Live Alerts State
  const [alerts, setAlerts] = useState<AlertFeedItem[]>([
    {
      id: 'AL-109',
      sender: 'Car Portal',
      message: 'Suspicious dual transfer request detected for VIN: WAUB8AF21MN05XXXX. Two dealers trying to clear escrow simultaneously.',
      timestamp: '12 mins ago',
      urgency: 'Flagrant',
      vin: 'WAUB8AF21MN05XXXX',
      resolved: false
    },
    {
      id: 'AL-110',
      sender: 'Insurance API',
      message: 'Theft report filed for Land Rover Range Rover Sport (VIN: SAJGV2RE8MA124850). Immediate locator query compiled.',
      timestamp: '42 mins ago',
      urgency: 'Flagrant',
      vin: 'SAJGV2RE8MA124850',
      resolved: false
    },
    {
      id: 'AL-111',
      sender: 'Government Customs',
      message: 'Foreign port mismatch flagged for Tesla Model S (VIN: 5YJSA1E4XPF231495). Bill of lading list declares 2020 trim, registry indicates 2023.',
      timestamp: '2 hours ago',
      urgency: 'Suspicious',
      vin: '5YJSA1E4XPF231495',
      resolved: false
    },
    {
      id: 'AL-112',
      sender: 'Field Report',
      message: 'Routine inspection completed at local depot. Re-stamped fire-wall rivets observed on chassis WAUB8AF21...',
      timestamp: '1 day ago',
      urgency: 'Suspicious',
      vin: 'WAUB8AF21MN05XXXX',
      resolved: true
    }
  ]);

  // Case states
  const [cases, setCases] = useState<Case[]>([
    {
      id: 'CASE-2026-01',
      title: 'Cloned Audi RS6 Avant Port Extraction Ring',
      status: 'Open',
      severity: 'High',
      suspectName: 'Victor "Nardo" Gerasimov',
      primaryVin: 'WAUB8AF21MN05XXXX',
      description: 'Chassis re-stamped with legal California VIN. Currently listed on JustCarSale marketplace portal to wash title before export pipeline to Rotterdam.',
      reportedAt: '2026-06-02 08:30',
      badgeId: 'DET-4015',
      evidence: [
        {
          id: 'EVID-9920',
          title: 'Tampered firewall VIN stamping photo',
          type: 'Digital Media',
          timestamp: '2026-06-02 11:15',
          custodian: 'Insp. Jack Vance',
          notes: 'Laser micro-stg on rivets lacks German manufacturer indentation patterns.',
          fileUrl: 'https://images.unsplash.com/photo-1537984822441-cff310ae7c90?q=80&w=200&auto=format&fit=crop'
        },
        {
          id: 'EVID-9921',
          title: 'Forged Nevada Title Document Certificate',
          type: 'Secure PDF Document',
          timestamp: '2026-06-03 14:22',
          custodian: 'Det. Sarah Connor',
          notes: 'Printer ink analysis matches low-grade dye printers linked to illegal workshop raids.',
          fileUrl: '#'
        }
      ]
    },
    {
      id: 'CASE-2026-02',
      title: 'Intercept Range Rover West Palm Stolen Transshipment',
      status: 'Under Review',
      severity: 'High',
      suspectName: 'Alicia Croft & Partners Logistics ltd.',
      primaryVin: 'SAJGV2RE8MA124850',
      description: 'Vehicle reported stolen from West Palm Beach beach villa. Insurance API triggered an automatic alert when the electronic key code was queried via JustCarSale dealer storefront.',
      reportedAt: '2026-06-08 15:45',
      badgeId: 'DET-1102',
      evidence: [
        {
          id: 'EVID-1029',
          title: 'Insurance Claim File #CLAIM-2980-A',
          type: 'InsurTech Telemetry Log',
          timestamp: '2026-06-08 16:00',
          custodian: 'Det. Sarah Connor',
          notes: 'Claims agent verified cellular GPS ping matching local Port Everglades trans container.'
        }
      ]
    },
    {
      id: 'CASE-2026-03',
      title: 'Customs Valuation Tariff Avoidance Group',
      status: 'Resolved',
      severity: 'Medium',
      suspectName: 'Apex European Motors Import Corp',
      primaryVin: 'WP0AB2A92MS299212',
      description: 'Suspicious import invoicing declaring vehicle valuation below salvage limits, while actual marketplace lookup demonstrates premium pristine condition pricing ($124,500).',
      reportedAt: '2026-05-18 10:00',
      badgeId: 'FUS-9904',
      evidence: [
        {
          id: 'EVID-0988',
          title: 'Foreign Custom Invoice Declarations',
          type: 'Customs Statement Paper',
          timestamp: '2026-05-18 12:40',
          custodian: 'Admin. Elena Rossi',
          notes: 'Fines settled, taxes retroactively collected in full. Status converted to resolved.'
        }
      ]
    }
  ]);

  // AI Suggestion Queue - strictly interactive, no auto-accusation
  const [aiSuggestions, setAiSuggestions] = useState([
    {
      id: 'AI-LEAD-01',
      title: 'Potential Double IP Registration Cloned Ring',
      confidence: '94%',
      insight: 'The same dealer console IP Address (192.168.44.112) updated listing metadata for WAUB8AF21MN05XXXX (Audi RS6) AND requested background certificate lookup for SAJGV2RE8MA124850 (Range Rover, Stolen).',
      source: 'Car Portal IP Telemetry Logs',
      actionTaken: null as 'approved' | 'dismissed' | null
    },
    {
      id: 'AI-LEAD-02',
      title: 'Suspicious Odometer Rollback Divergence',
      confidence: '81%',
      insight: 'The BMW M5 Competition (VIN: WBA53BJ0XPX881270) has workshop service history logs showing 32,400 kms in Germany. However, current JustCarSale import documents specify 12,402 miles. Possible cluster rollback.',
      source: 'State Workshop API Scrape',
      actionTaken: null as 'approved' | 'dismissed' | null
    }
  ]);

  // Selection computed case
  const activeCase = useMemo(() => {
    return cases.find(c => c.id === selectedCaseId) || cases[0];
  }, [cases, selectedCaseId]);

  // Filter cases by search query
  const filteredCases = useMemo(() => {
    if (!searchQuery.trim()) return cases;
    const q = searchQuery.toLowerCase();
    return cases.filter(c => 
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.suspectName.toLowerCase().includes(q) ||
      c.primaryVin.toLowerCase().includes(q)
    );
  }, [cases, searchQuery]);

  // Filter watchlists
  const filteredWatchlist = useMemo(() => {
    if (!searchQuery.trim()) return watchlist;
    const q = searchQuery.toLowerCase();
    return watchlist.filter(w => 
      w.vin.toLowerCase().includes(q) ||
      w.make.toLowerCase().includes(q) ||
      w.model.toLowerCase().includes(q) ||
      w.reason.toLowerCase().includes(q)
    );
  }, [watchlist, searchQuery]);

  // SVG network nodes for interactive entity relationship map
  const nodes: NetworkNode[] = [
    { id: 'S-GERASIMOV', label: 'V. Gerasimov (Suspect)', type: 'Suspect', x: 200, y: 150, role: 'Ring Leader' },
    { id: 'V-AUDI', label: 'RS6 Avant (WAUB8AF21...)', type: 'VIN', x: 100, y: 250 },
    { id: 'V-ROVER', label: 'Range Rover (SAJGV2RE8...)', type: 'VIN', x: 250, y: 320 },
    { id: 'D-APEX', label: 'Apex Euro Motors (Dealer)', type: 'Dealer', x: 400, y: 180 },
    { id: 'A-PORT', label: 'Warehouse Port Everglades', type: 'Address', x: 380, y: 340 },
    { id: 'IP-RING', label: 'IP Console 192.168.44.112', type: 'IP', x: 120, y: 80, ip: '192.168.44.112' },
  ];

  const edges: NetworkEdge[] = [
    { from: 'S-GERASIMOV', to: 'V-AUDI', label: 'Chassis Cloned' },
    { from: 'S-GERASIMOV', to: 'V-ROVER', label: 'Target Transit' },
    { from: 'S-GERASIMOV', to: 'IP-RING', label: 'Terminal Logs' },
    { from: 'D-APEX', to: 'V-AUDI', label: 'Listed for Sale' },
    { from: 'D-APEX', to: 'A-PORT', label: 'Corporate Address' },
    { from: 'V-ROVER', to: 'A-PORT', label: 'GPS Locator Ping' },
    { from: 'IP-RING', to: 'D-APEX', label: 'Proxy Logins' }
  ];

  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);

  // Form submit handlers
  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle.trim() || !newCaseVin.trim()) return;

    const newCase: Case = {
      id: `CASE-2026-${String(cases.length + 1).padStart(2, '0')}`,
      title: newCaseTitle,
      status: 'Open',
      severity: newCaseSeverity,
      suspectName: newCaseSuspect || 'Unknown Ring Entity',
      primaryVin: newCaseVin.toUpperCase(),
      description: newCaseDesc || 'No manual description captured yet.',
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      badgeId: newCaseBadge,
      evidence: []
    };

    setCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    
    // Clear forms
    setNewCaseTitle('');
    setNewCaseVin('');
    setNewCaseSuspect('');
    setNewCaseSeverity('High');
    setNewCaseDesc('');
    setShowCreateCaseModal(false);

    alert(`CONGRATULATIONS: Secure National Case file ${newCase.id} initiated on chain.`);
  };

  const handleAddEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceName.trim()) return;

    const newEvidence: Evidence = {
      id: `EVID-${Math.floor(1000 + Math.random() * 9000)}`,
      title: evidenceName,
      type: evidenceType,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      custodian: evidenceCustodian,
      notes: evidenceNotes || 'Logged on secure terminal under strict chain of custody protocols.'
    };

    setCases(prev => prev.map(c => {
      if (c.id === selectedCaseId) {
        return {
          ...c,
          evidence: [...c.evidence, newEvidence]
        };
      }
      return c;
    }));

    setEvidenceName('');
    setEvidenceNotes('');
    setShowAddEvidence(false);
  };

  const handleCreateWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatchlistVin.trim()) return;

    const newV: WatchlistVehicle = {
      vin: newWatchlistVin.toUpperCase(),
      year: parseInt(newWatchlistVin.substring(0, 4)) || 2022,
      make: newWatchlistMake || 'Unconfirmed',
      model: newWatchlistModel || 'Dossier',
      reason: newWatchlistReason,
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Active',
      notes: newWatchlistNotes || 'Reported on state watchlist.'
    };

    setWatchlist(prev => [newV, ...prev]);
    setNewWatchlistVin('');
    setNewWatchlistMake('');
    setNewWatchlistModel('');
    setNewWatchlistNotes('');
    setShowAddToWatchlist(false);

    alert(`Warning: VIN ${newV.vin} broadcasted with immediate search intercept protocols.`);
  };

  const promoteAIToCase = (sID: string, title: string, insight: string) => {
    const vinExtract = insight.match(/[A-Z0-9]{17}/)?.[0] || 'WAUB8AF21MN05XXXX';
    
    const newCase: Case = {
      id: `CASE-2026-${String(cases.length + 1).padStart(2, '0')}`,
      title: `AI Flagged: ${title}`,
      status: 'Open',
      severity: 'Medium',
      suspectName: 'Identified Network Ring Co-conspirators',
      primaryVin: vinExtract,
      description: `Case established following authorization of intelligent analytics recommendations. Details: ${insight}`,
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      badgeId: 'AI-DEPUTY',
      evidence: [
        {
          id: `EVID-${Math.floor(1000 + Math.random() * 9000)}`,
          title: 'Algorithmic Correlation Log',
          type: 'Secure Metadata Log',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          custodian: 'Secure Neural Correlator Unit',
          notes: `Telemetry match of suspicious coordinates matching network graph. Source: ${insight}`
        }
      ]
    };

    setCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    setActiveTab('cases');

    // Update AI state
    setAiSuggestions(prev => prev.map(s => {
      if (s.id === sID) {
        return { ...s, actionTaken: 'approved' };
      }
      return s;
    }));

    alert(`Neural target authorized. Case file established for investigation.`);
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  return (
    <div className="bg-white text-[#0b1431] min-h-screen font-sans border-0 rounded-2xl overflow-hidden relative shadow-sm">
      
      {/* Subtle Border Line */}
      <div className="h-[1px] bg-slate-200 w-full"></div>

      {/* Police Terminal Header (Apple Light Style) */}
      <header className="p-6 md:px-8 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/95 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="bg-red-50 border border-red-100 p-2 rounded-xl text-red-650 shadow-xs animate-pulse">
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[9px] font-mono uppercase bg-slate-100 border border-slate-200 text-red-600 px-2 py-0.5 rounded-md tracking-wider font-extrabold">SECURE DESK V74-CAD</span>
                <span className="h-1.5 w-1.5 bg-red-500 rounded-full animate-ping"></span>
                <span className="text-[9px] text-red-600 font-mono tracking-wider font-extrabold uppercase">LEADS MONITOR STATUS: ONLINE (TLS-256)</span>
              </div>
              <h1 className="text-lg font-black tracking-tight text-[#0b1431] mt-0.5">Criminal Investigations &amp; Authority Desk</h1>
            </div>
          </div>
        </div>

        {/* Global Stats bar */}
        <div className="flex gap-4 border-l border-slate-200 pl-6 shrink-0 font-mono text-[11px] text-slate-500 flex-wrap">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase tracking-wider text-[#8e8e93] font-bold">ACTIVE SCANS</span>
            <p className="text-emerald-600 font-black flex items-center gap-1.5 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> <NumericTransition text="142 SEC/MIN" />
            </p>
          </div>
          <div className="space-y-0.5 ml-4">
            <span className="text-[9px] uppercase tracking-wider text-[#8e8e93] font-bold">WATCHED VINS</span>
            <p className="text-blue-600 font-extrabold font-mono">
              <NumericTransition text={`${watchlist.filter(w => w.status === 'Active').length} SUSPECTS`} />
            </p>
          </div>
          <div className="space-y-0.5 ml-4">
            <span className="text-[9px] uppercase tracking-wider text-[#8e8e93] font-bold">INTELLIGENCE LEADS</span>
            <p className="text-red-650 font-extrabold font-mono">
              <NumericTransition text={`${aiSuggestions.filter(s => !s.actionTaken).length} UNRESOLVED`} />
            </p>
          </div>
        </div>
      </header>

      {/* Sub Navigation (Apple Light Segmented Style) */}
      <div className="px-6 md:px-8 py-3 bg-slate-50 border-b border-slate-250 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'cases', label: 'Investigation Files', count: cases.length, icon: FileText },
            { id: 'watchlist', label: 'Stolen Watchlist', count: watchlist.filter(w => w.status === 'Active').length, icon: Tag },
            { id: 'ai-net', label: 'AI Entity Map', count: 'Live', icon: BrainCircuit },
            { id: 'alerts', label: 'External Fraud Alerts', count: alerts.filter(a => !a.resolved).length, icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-sans transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-red-50 border border-red-105 text-red-600 shadow-xs'
                  : 'text-slate-500 hover:text-[#0b1431] hover:bg-slate-100'
              }`}
            >
              <tab.icon size={13} className={activeTab === tab.id ? 'text-red-505 animate-pulse' : 'text-slate-500'} />
              <span>{tab.label}</span>
              <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                activeTab === tab.id ? 'bg-red-100 text-red-650 border border-red-200' : 'bg-slate-250 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tactical Search Bar */}
        <div className="relative w-full md:w-64">
          <input
            className="w-full bg-white border border-slate-250 text-xs rounded-lg px-4 py-1.5 pl-9 text-[#0b1431] outline-none focus:border-red-600 font-sans transition-all placeholder-slate-400"
            placeholder="Search VIN, suspect, badge..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
        </div>
      </div>

      {/* Body Layout Grid */}
      <main className="p-6 md:p-8">
        
        {/* TAB 1: CASE LIST & CASE MANAGEMENT */}
        {activeTab === 'cases' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            
            {/* LEO Case List Panel */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">National Case Archives</span>
                <button 
                  type="button"
                  onClick={() => setShowCreateCaseModal(true)}
                  className="bg-red-650 hover:bg-red-705 text-white px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <Plus size={14} /> NEW FILE
                </button>
              </div>

              <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1">
                {filteredCases.map(c => {
                  const hasMarketplaceMatch = VEHICLES.some(v => v.vin.toUpperCase() === c.primaryVin.toUpperCase());
                  return (
                    <div
                      key={c.id}
                      onClick={() => { setSelectedCaseId(c.id); setShowAddEvidence(false); }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                        selectedCaseId === c.id
                          ? 'bg-red-50/60 border-red-200 shadow-sm'
                          : 'bg-slate-50/40 border-slate-200 hover:border-slate-350'
                      }`}
                    >
                      {/* Priority Tag line */}
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{c.id}</span>
                        <div className="flex items-center gap-1.5">
                          {hasMarketplaceMatch && (
                            <span className="text-[9px] font-mono uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded border border-red-200 font-bold animate-pulse">
                              MATCHED MARKETPLACE
                            </span>
                          )}
                          <span className={`text-[9.5px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                            c.severity === 'High' ? 'bg-red-50 text-red-650 border border-red-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                          }`}>
                            {c.severity} Severity
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xs font-bold leading-relaxed text-[#0b1431] mb-1.5">{c.title}</h3>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-505">
                        <div className="truncate">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold text-[8.5px]">Primary Target Suspect</span>
                          <span className="text-slate-900 font-sans font-semibold">{c.suspectName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold text-[8.5px]">Linked VIN Entry</span>
                          <span className="text-slate-900 text-[10px] font-bold">{c.primaryVin.substring(0, 8)}...</span>
                        </div>
                      </div>

                      <div className="mt-3.5 pt-3 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span>Reported Ledger: {c.reportedAt}</span>
                        <span className={`font-bold uppercase tracking-widest ${
                          c.status === 'Open' ? 'text-red-650' : c.status === 'Resolved' ? 'text-green-600' : 'text-blue-600'
                        }`}>{c.status}</span>
                      </div>
                    </div>
                  );
                })}

                {filteredCases.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-mono">
                    No dossier files matched search queries.
                  </div>
                )}
              </div>
            </div>

            {/* Case File Details Panel */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-slate-50 rounded-2xl border border-slate-250 p-6 md:p-8 relative overflow-hidden">
                
                {/* Decorative Tech Grid overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>

                <div className="relative space-y-6">
                  
                  {/* Detailed Title */}
                  <div className="border-b border-slate-200 pb-5 space-y-3">
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-red-650 tracking-wider font-extrabold">DEPARTMENT OF CRIMINAL COMPLIANCE // DOSSIER VIEW</span>
                        <h2 className="text-base font-extrabold text-[#0b1431] tracking-tight leading-snug mt-1">{activeCase.title}</h2>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSeizureReport(activeCase)}
                          className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs"
                        >
                          <Layers size={13} /> GENERATE SEIZURE REPORT
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 font-mono text-[10px] text-slate-500">
                      <div>
                        <span>ARCHIVE REFERENCE</span>
                        <p className="text-slate-800 font-bold">{activeCase.id}</p>
                      </div>
                      <div>
                        <span>CASE DIRECTING OFFICER</span>
                        <p className="text-slate-800 font-bold">{activeCase.badgeId}</p>
                      </div>
                      <div>
                        <span>CHASSIS VIN UNDER CHARGE</span>
                        <p className="text-slate-800 font-bold max-w-full truncate text-[11px] select-all">{activeCase.primaryVin}</p>
                      </div>
                      <div>
                        <span>PORT CASE STATUS</span>
                        <span className={`font-extrabold uppercase block text-[10px] ${
                          activeCase.status === 'Open' ? 'text-red-650' : activeCase.status === 'Resolved' ? 'text-green-600' : 'text-blue-600'
                        }`}>{activeCase.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary / Narration */}
                  <div className="space-y-1 bg-white p-4 border border-slate-200 rounded-2xl shadow-xs">
                    <span className="text-[9px] font-mono uppercase text-slate-400 block font-bold">INVESTIGATION SUMMARY BRIEFING</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans font-normal">{activeCase.description}</p>
                  </div>

                  {/* Marketplace Match Intercept Alert */}
                  {(() => {
                    const matchedCar = VEHICLES.find(v => v.vin.toUpperCase() === activeCase.primaryVin.toUpperCase());
                    if (matchedCar) {
                      return (
                        <div className="bg-red-50 border border-red-200 p-4.5 rounded-2xl flex items-start gap-3.5 shadow-xs">
                          <AlertTriangle className="text-red-650 shrink-0 mt-0.5 animate-pulse" size={18} />
                          <div className="text-xs space-y-1 leading-relaxed">
                            <span className="text-red-600 font-bold font-mono text-[10px] tracking-wider block">⚠️ NATIONAL ESCROW WATCH STRIKE: CONFLICT DETECTED</span>
                            <p className="text-slate-705 font-normal">
                              This VIN has was cross-referenced matching a current **JustCarSale.com Marketplace Listing** (<em>{matchedCar.year} {matchedCar.make} {matchedCar.model}</em>) valued at **${matchedCar.price.toLocaleString()}** in <strong>{matchedCar.location}</strong>.
                            </p>
                            <span className="text-[10px] text-red-550 block font-mono font-bold">WARNING: Attempted transfer of this escrow asset triggers port security isolation intercepts automatically.</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  {/* Evidence Chain of Custody Section */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <span className="text-xs font-mono font-bold uppercase text-slate-500 tracking-wider">Secure Evidence Ledger (Chain of Custody)</span>
                      <button 
                        type="button"
                        onClick={() => setShowAddEvidence(!showAddEvidence)}
                        className="text-xs font-mono font-bold text-red-600 hover:text-red-550 flex items-center gap-1.5 transition-colors"
                      >
                        <Plus size={13} /> SECURE EVIDENCE ITEM
                      </button>
                    </div>

                    {showAddEvidence && (
                      <form onSubmit={handleAddEvidenceSubmit} className="bg-slate-950 p-4.5 border border-red-950/50 rounded-2xl space-y-4 animate-in slide-in-from-top-4 duration-300">
                        <h4 className="text-[10px] font-mono font-bold uppercase text-red-400">File Certified Chain Statement</h4>
                        
                        <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-slate-500 uppercase">Evidence Item Name</label>
                            <input
                              required
                              placeholder="e.g. Confiscated transponder keys"
                              className="w-full bg-[#050816] border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-red-900"
                              value={evidenceName}
                              onChange={e => setEvidenceName(e.target.value)}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-slate-500 uppercase">Evidence Classification Type</label>
                            <select
                              className="w-full bg-[#050816] border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-red-900 font-sans"
                              value={evidenceType}
                              onChange={e => setEvidenceType(e.target.value)}
                            >
                              <option>Physical Component</option>
                              <option>Digital Media / Photograph</option>
                              <option>Secure PDF Document</option>
                              <option>InsurTech Telemetry Log</option>
                              <option>Witness Recitation Paper</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-slate-500 uppercase">Authorized Officer Custodian</label>
                            <input
                              required
                              placeholder="Off. Sarah Connor"
                              className="w-full bg-[#050816] border border-slate-800 text-xs rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-red-900"
                              value={evidenceCustodian}
                              onChange={e => setEvidenceCustodian(e.target.value)}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-mono text-slate-500 uppercase">Terminal Authentication Station</label>
                            <input
                              disabled
                              value="PORT-SECURE-ID-992-E"
                              className="w-full bg-[#020409] border border-slate-900 text-xs rounded-xl px-3 py-2 text-slate-500 font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 text-xs">
                          <label className="text-[9px] font-mono text-slate-500 uppercase">Micro Analysis / Rivet Notes</label>
                          <textarea
                            placeholder="Identify scratch marks, serial codes, or electronic memory hashes..."
                            rows={2}
                            className="w-full bg-[#050816] border border-slate-800 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-red-900"
                            value={evidenceNotes}
                            onChange={e => setEvidenceNotes(e.target.value)}
                          />
                        </div>

                        <div className="flex justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => setShowAddEvidence(false)}
                            className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 font-semibold"
                          >
                            Dismiss
                          </button>
                          <button
                            type="submit"
                            className="bg-red-950/75 hover:bg-red-900 border border-red-850 px-4 py-1.5 rounded-xl text-xs font-mono font-bold text-red-200"
                          >
                            Authorize Entry
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="space-y-3 font-sans">
                      {activeCase.evidence.map(item => (
                        <div key={item.id} className="p-3.5 bg-[#020511] border border-slate-900 rounded-xl flex items-start justify-between gap-4 hover:border-slate-850 transition-all">
                          <div className="flex gap-3">
                            <div className="bg-slate-900 text-slate-400 p-2 rounded-xl shrink-0 border border-slate-800">
                              <Paperclip size={15} />
                            </div>
                            <div className="text-xs space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-200">{item.title}</span>
                                <span className="text-[9px] font-mono uppercase bg-slate-900 text-slate-500 px-1.5 py-0.2 rounded border border-slate-800">
                                  {item.type}
                                </span>
                              </div>
                              <p className="text-slate-400 font-normal leading-relaxed">{item.notes}</p>
                              
                              <div className="flex gap-4 pt-1 font-mono text-[9px] text-slate-500 leading-none">
                                <span>SECURE HASH ID: {item.id}</span>
                                <div>CUSTODIAN: <strong className="text-slate-400">{item.custodian}</strong></div>
                                <span>DATE LOGGED: {item.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {activeCase.evidence.length === 0 && (
                        <div className="text-center py-8 border border-dashed border-slate-900 rounded-xl text-slate-500 text-xs font-mono leading-relaxed">
                          No evidence logged. Initiating a new investigation requires appending verified components above.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: POLICE VEHICLE WATCHLIST */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-[#0b1431] font-display">Federal Stolen &amp; Cloned Watchlist Broadcasts</h2>
                <p className="text-xs text-slate-500 mt-1">Integrates live lookup queries directly against the dealer marketplace cluster.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddToWatchlist(!showAddToWatchlist)}
                className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <Plus size={14} /> ADVERTISE TARGET VIN
              </button>
            </div>

            {showAddToWatchlist && (
              <form onSubmit={handleCreateWatchlist} className="bg-slate-950 p-6 rounded-2xl border border-red-950/40 max-w-2xl space-y-4">
                <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest border-b border-slate-900 pb-2">Record Search &amp; Seize Broadcast</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase">17-Digit Target VIN</label>
                    <input
                      required
                      placeholder="e.g. WP0AB2A92MS299212"
                      maxLength={17}
                      className="w-full bg-[#050816] border border-slate-800 text-xs rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-red-900 font-mono"
                      value={newWatchlistVin}
                      onChange={e => setNewWatchlistVin(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase">Make Identifier</label>
                    <input
                      placeholder="e.g. Porsche"
                      className="w-full bg-[#050816] border border-slate-800 text-xs rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-red-900"
                      value={newWatchlistMake}
                      onChange={e => setNewWatchlistMake(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase">Model Identifier</label>
                    <input
                      placeholder="e.g. 911 Carrera"
                      className="w-full bg-[#050816] border border-slate-800 text-xs rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-red-900"
                      value={newWatchlistModel}
                      onChange={e => setNewWatchlistModel(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase">Reason for Search Warrant</label>
                    <select
                      className="w-full bg-[#050816] border border-slate-800 text-xs rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-red-900"
                      value={newWatchlistReason}
                      onChange={e => setNewWatchlistReason(e.target.value as any)}
                    >
                      <option value="Stolen">Reported Stolen / GTA Warrant</option>
                      <option value="Cloned VIN">Cloned / Re-stamped Chassis</option>
                      <option value="Customs Export Fraud">Customs Bill of Lading Arbitrage</option>
                      <option value="Odometer Rollback">Odometer Manipulation Scrape</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-slate-500 uppercase">Action Broadcast Status</label>
                    <input
                      disabled
                      value="Active Search Command (IMMEDIATE DETENTION)"
                      className="w-full bg-[#020409] border border-slate-900 text-red-500 text-xs rounded-xl px-3 py-2.5 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold">Investigation Lead / Watch Notes</label>
                  <textarea
                    placeholder="Provide DMV file numbers, missing equipment, active transponders, or geographical port corridors of suspicion..."
                    rows={2}
                    className="w-full bg-[#050816] border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-red-900"
                    value={newWatchlistNotes}
                    onChange={e => setNewWatchlistNotes(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddToWatchlist(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-950/75 hover:bg-red-900 border border-red-850 px-5 py-1.5 rounded-xl text-xs font-mono font-bold text-red-200"
                  >
                    Broadcast Watch Intercept
                  </button>
                </div>
              </form>
            )}

            {/* Watchlist Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-slate-500 uppercase text-[10px] tracking-wider select-none">
                    <th className="p-4 pl-6">Target VIN</th>
                    <th className="p-4">Vehicle Specs</th>
                    <th className="p-4">Detention Reason</th>
                    <th className="p-4">Report Date</th>
                    <th className="p-4">Market Connection</th>
                    <th className="p-4 text-center">Operational state</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-205 text-slate-700">
                  {filteredWatchlist.map(w => {
                    const matchedMarketplaceItem = VEHICLES.find(v => v.vin.toUpperCase() === w.vin.toUpperCase());
                    
                    return (
                      <tr key={w.vin} className="hover:bg-slate-50/70 transition-all font-sans">
                        <td className="p-4 pl-6 font-mono font-bold text-red-600 tracking-wider border-b border-slate-205">
                          {w.vin}
                        </td>
                        <td className="p-4 border-b border-slate-205">
                          <span className="font-bold text-[#0b1431] block">{w.year} {w.make} {w.model}</span>
                          <span className="text-[10px] text-slate-500 font-mono leading-none">{w.notes}</span>
                        </td>
                        <td className="p-4 border-b border-slate-205">
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                            w.reason === 'Stolen' || w.reason === 'Cloned VIN' ? 'bg-red-50 text-red-650 border-red-150' : 'bg-amber-50 text-amber-600 border-amber-150'
                          }`}>
                            {w.reason}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 font-mono border-b border-slate-205">
                          {w.reportedAt}
                        </td>
                        <td className="p-4 border-b border-slate-205">
                          {matchedMarketplaceItem ? (
                            <div className="space-y-1 select-none">
                              <span className="text-[10px] uppercase font-mono font-bold bg-red-50 text-red-650 px-2 py-0.5 rounded border border-red-200 animate-pulse block text-center">
                                LISTED FOR SALE
                              </span>
                              <span className="text-[9px] text-slate-505 block leading-snug">
                                Located: <strong>{matchedMarketplaceItem.location}</strong>
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 font-mono text-[10px]">No Marketplace Listing</span>
                          )}
                        </td>
                        <td className="p-4 text-center border-b border-slate-205">
                          <span className={`text-[10px] uppercase font-mono font-bold ${
                            w.status === 'Active' ? 'text-red-650' : w.status === 'Recovered' ? 'text-emerald-600' : w.status === 'Resolved' ? 'text-blue-600' : 'text-slate-400'
                          }`}>
                            {w.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* TAB 3: AI ENTITY RELATIONSHIP MAP & COMPONENT CORRELATOR */}
        {activeTab === 'ai-net' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
            
            {/* SVG Visual Graph Container */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#0b1431] font-display">Cloned &amp; Stolen Network Vector Map</h2>
                  <p className="text-xs text-slate-500">Intelligent nodal links scraped based on telemetry overlap (Console logins, phone sharing, coordinates).</p>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span> Suspect
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span> VIN / Asset
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Address
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span> Registry Dealer
                  </div>
                </div>
              </div>

              {/* Graphic Canvas */}
              <div className="border border-slate-200 rounded-3xl bg-slate-50 relative h-[500px] overflow-hidden shadow-inner">
                <svg className="w-full h-full absolute inset-0">
                                 {/* Draw Lines */}
                  {edges.map((edge, idx) => {
                    const fromNode = nodes.find(n => n.id === edge.from);
                    const toNode = nodes.find(n => n.id === edge.to);
                    if (!fromNode || !toNode) return null;
                    
                    return (
                      <g key={idx}>
                        <line
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke="#cbd5e1"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                        {/* Edge Label */}
                        <text
                          x={(fromNode.x + toNode.x) / 2}
                          y={(fromNode.y + toNode.y) / 2 - 4}
                          fill="#475569"
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {edge.label}
                        </text>
                      </g>
                    );
                  })}

                  {/* Draw Nodes */}
                  {nodes.map(node => {
                    const isSuspect = node.type === 'Suspect';
                    const isVIN = node.type === 'VIN';
                    const isDealer = node.type === 'Dealer';
                    const isAddress = node.type === 'Address';
                    const isIP = node.type === 'IP';

                    let color = 'fill-slate-100 stroke-slate-400';
                    if (isSuspect) color = 'fill-red-50 stroke-red-500';
                    if (isVIN) color = 'fill-blue-50 stroke-blue-500';
                    if (isAddress) color = 'fill-emerald-50 stroke-emerald-500';
                    if (isDealer) color = 'fill-amber-50 stroke-amber-505';
                    if (isIP) color = 'fill-purple-50 stroke-purple-500';

                    return (
                      <g
                        key={node.id}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredNode(node)}
                        onMouseLeave={() => setHoveredNode(null)}
                      >
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={hoveredNode?.id === node.id ? '14' : '10'}
                          className={`${color} stroke-[2px] transition-all drop-shadow-xs`}
                        />
                        <text
                          x={node.x}
                          y={node.y + 24}
                          fill="#334155"
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                          textAnchor="middle"
                        >
                          {node.label.split(' (')[0]}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Hover metadata card */}
                {hoveredNode && (
                  <div 
                    className="absolute p-4 rounded-2xl bg-white border border-slate-200 w-56 text-xs shadow-2xl font-mono text-slate-800 space-y-1.5 z-10"
                    style={{ left: `${hoveredNode.x + 20}px`, top: `${hoveredNode.y - 40}px` }}
                  >
                    <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                      <span className="text-red-450 font-bold uppercase">{hoveredNode.type} Entry</span>
                      <span className="text-[9px] text-slate-400">ID: {hoveredNode.id.substring(0,6)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[9px] block">LABEL VALUE</span>
                      <span className="text-slate-900 font-bold">{hoveredNode.label}</span>
                    </div>
                    {hoveredNode.role && (
                      <div>
                        <span className="text-slate-400 text-[9px] block">LEO DESIGNATION</span>
                        <span className="text-red-650 font-bold">{hoveredNode.role}</span>
                      </div>
                    )}
                    {hoveredNode.ip && (
                      <div>
                        <span className="text-slate-400 text-[9px] block">ELECTRONIC LOCATION</span>
                        <span className="text-purple-650 font-bold">{hoveredNode.ip}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Overlay instructions */}
                <span className="absolute bottom-4 left-4 text-[10px] text-slate-500 font-mono italic">
                  Hover over network nodes to extract telemetry coordinates and linked warrant files.
                </span>
              </div>
            </div>

            {/* AI Core Interaction Panel */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Intelligent Lead Analyzer</span>
              
              <div className="bg-slate-50 rounded-2xl border border-slate-205 p-5 space-y-4 relative overflow-hidden">
                <div className="flex items-center gap-2 text-[#0b1431] border-b border-slate-200 pb-3">
                  <BrainCircuit className="text-purple-650 animate-pulse" size={18} />
                  <span className="text-[11px] font-mono font-bold tracking-widest uppercase">JustCarSale LEO Neural Desk</span>
                </div>

                <div className="text-xs text-slate-600 leading-relaxed font-sans font-normal space-y-3">
                  <p>
                    The neural scanner queries registry records, insurance database outputs, and public port APIs to identify correlated criminal circles.
                  </p>
                  <p className="text-[10px] bg-white p-2.5 border border-slate-200 rounded-xl text-slate-500 font-mono">
                    ⚠️ CONSTRAINTS VERIFIED: All suggestions strictly require certified human officer authorization. Artificial models do **not** file warrants or freeze transfer escrow accounts autonomously.
                  </p>
                </div>

                {/* AI Leads List */}
                <div className="space-y-4 pt-2">
                  {aiSuggestions.map(lead => (
                    <div key={lead.id} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono text-purple-600 font-bold">{lead.id} Entry</span>
                        <span className="text-[10px] font-mono font-extrabold text-emerald-600">{lead.confidence} AI MATCH</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#0b1431] leading-normal">{lead.title}</h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{lead.insight}</p>

                      <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 text-[10px] font-mono">
                        <span className="text-slate-400 font-bold">Source: {lead.source}</span>
                        {lead.actionTaken === 'approved' ? (
                          <span className="text-green-600 font-bold uppercase">AUTHORIZED</span>
                        ) : lead.actionTaken === 'dismissed' ? (
                          <span className="text-slate-400 font-bold uppercase">DISMISSED</span>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setAiSuggestions(prev => prev.map(s => s.id === lead.id ? { ...s, actionTaken: 'dismissed' } : s))}
                              className="text-slate-405 hover:text-slate-700 transition-colors"
                            >
                              Ignore
                            </button>
                            <button
                              type="button"
                              onClick={() => promoteAIToCase(lead.id, lead.title, lead.insight)}
                              className="text-red-650 hover:text-red-800 font-bold flex items-center gap-0.5 transition-colors"
                            >
                              Authorize File <ArrowRight size={10} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ALERTS FEED */}
        {activeTab === 'alerts' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-[#0b1431] font-display">Regional Escalation Intercept Alerts</h2>
                <p className="text-xs text-slate-500 mt-1">Real-time indicators pushed on the JustCarSale network channel.</p>
              </div>
            </div>

            <div className="space-y-4">
              {alerts.map(alertItem => (
                <div 
                  key={alertItem.id} 
                  className={`p-5 rounded-2xl border flex items-start gap-4 transition-all ${
                    alertItem.resolved 
                      ? 'bg-slate-50 border-slate-200 opacity-60' 
                      : 'bg-white border-red-200 shadow-xs'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    alertItem.resolved 
                      ? 'bg-slate-100 border-slate-200 text-slate-400' 
                      : alertItem.urgency === 'Flagrant'
                        ? 'bg-red-50 border-red-150 text-red-600 animate-pulse'
                        : 'bg-amber-50 border-amber-150 text-amber-600'
                  }`}>
                    <AlertTriangle size={18} />
                  </div>

                  <div className="flex-1 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0b1431] font-sans">{alertItem.sender}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-mono">{alertItem.timestamp}</span>
                      </div>
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                        alertItem.urgency === 'Flagrant' ? 'bg-red-50 text-red-650 border border-red-150' : 'bg-slate-100 text-slate-650 border border-slate-205'
                      }`}>
                        {alertItem.urgency} Channel
                      </span>
                    </div>

                    <p className="text-slate-650 font-normal leading-relaxed pt-1 font-sans">{alertItem.message}</p>
                    
                    <div className="pt-3 flex items-center justify-between font-mono text-[9px] text-slate-500">
                      <span>TARGET VIN REF: <strong className="text-slate-700">{alertItem.vin}</strong></span>
                      {alertItem.resolved ? (
                        <span className="text-slate-400 block font-bold uppercase">FILE DISMISSED/LINKED</span>
                      ) : (
                        <div className="flex gap-2.5">
                          <button 
                            type="button"
                            onClick={() => handleResolveAlert(alertItem.id)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-205 px-3 py-1.5 rounded-lg transition-all"
                          >
                            Mark Handled
                          </button>
                          <button 
                            type="button"
                            onClick={() => {
                              // Trigger automatic setup
                              setNewCaseTitle(`Investigation: Mismatch reported by ${alertItem.sender}`);
                              setNewCaseVin(alertItem.vin);
                              setNewCaseDesc(alertItem.message);
                              setNewCaseSeverity(alertItem.urgency === 'Flagrant' ? 'High' : 'Medium');
                              setShowCreateCaseModal(true);
                              setActiveTab('cases');
                            }}
                            className="bg-red-50 hover:bg-red-100/90 border border-red-205 px-3 py-1.5 rounded-lg text-red-650 transition-all font-bold"
                          >
                            Initiate Full Dossier File
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* MODAL 1: CREATE CASE ARCHIVE */}
      {showCreateCaseModal && (
        <div className="fixed inset-0 bg-slate-955/80 backdrop-blur-sm z-[110] flex justify-center items-center p-4">
          <div className="bg-[#050816] border border-slate-800 p-6 md:p-8 rounded-3xl max-w-lg w-full text-slate-100 space-y-6 shadow-2xl relative">
            <button 
              onClick={() => setShowCreateCaseModal(false)}
              className="absolute right-4 top-4 hover:bg-slate-900 text-slate-400 p-1.5 rounded-xl transition-all"
            >
              <X size={16} />
            </button>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">National Security Infrastructure</span>
              <h3 className="text-base font-bold font-display tracking-tight text-slate-100">Establish Criminal Investigation File</h3>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1 shadow-sm">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Case Title / Ring Focus</label>
                <input
                  required
                  placeholder="e.g. Cloned Range Rover Sport Transshipment Everglades"
                  className="w-full bg-[#020409] border border-slate-800 text-xs rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:border-red-900"
                  value={newCaseTitle}
                  onChange={e => setNewCaseTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Target Chassis VIN</label>
                  <input
                    required
                    placeholder="WBA53BJ0XPX881270..."
                    maxLength={17}
                    className="w-full bg-[#020409] border border-slate-800 text-xs rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:border-red-900 font-mono uppercase"
                    value={newCaseVin}
                    onChange={e => setNewCaseVin(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Primary Suspect Name</label>
                  <input
                    placeholder="e.g. Alicia Croft"
                    className="w-full bg-[#020409] border border-slate-800 text-xs rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:border-red-900"
                    value={newCaseSuspect}
                    onChange={e => setNewCaseSuspect(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Authorized Officer Badge</label>
                  <input
                    required
                    placeholder="LEO-8820"
                    className="w-full bg-[#020409] border border-slate-800 text-xs text-slate-500 rounded-xl px-4 py-2.5 font-mono"
                    value={newCaseBadge}
                    onChange={e => setNewCaseBadge(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Target Severity</label>
                  <select
                    className="w-full bg-[#020409] border border-slate-800 text-xs rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:border-red-900"
                    value={newCaseSeverity}
                    onChange={e => setNewCaseSeverity(e.target.value as any)}
                  >
                    <option value="High">🚨 High Severity Intercept</option>
                    <option value="Medium">⚠️ Medium Priority Lead</option>
                    <option value="Low">⚡ Low Administrative Review</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Geographical &amp; Coordinate Description</label>
                <textarea
                  placeholder="Summarize suspicious actions observed on JustCarSale, port transit logs, or vehicle database rollbacks..."
                  rows={3}
                  className="w-full bg-[#020409] border border-slate-800 rounded-xl px-4 py-2 text-slate-200 outline-none focus:border-red-900"
                  value={newCaseDesc}
                  onChange={e => setNewCaseDesc(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateCaseModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Dismiss Request
                </button>
                <button
                  type="submit"
                  className="bg-red-950/80 hover:bg-red-900/90 border border-red-800 text-red-200 px-5 py-2.5 rounded-xl text-xs font-mono font-bold transition-all uppercase"
                >
                  Establish Secure Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PRINTABLE SEIZURE REPORT */}
      {selectedSeizureReport && (
        <div className="fixed inset-0 bg-slate-955/90 backdrop-blur-md z-[120] flex justify-center items-center p-4">
          <div className="bg-white text-slate-900 p-8 md:p-12 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-8 shadow-2xl relative font-sans border-t-8 border-slate-900">
            <button 
              onClick={() => setSelectedSeizureReport(null)}
              className="absolute right-6 top-6 hover:bg-slate-100 text-slate-500 p-2 rounded-xl transition-all"
            >
              <X size={18} />
            </button>

            {/* Document Header */}
            <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6 relative">
              <div className="mx-auto w-10 h-10 border-2 border-slate-900 rounded-full flex items-center justify-center text-slate-900 font-bold text-lg select-none">
                ★
              </div>
              <span className="text-[9px] uppercase tracking-widest block font-bold text-slate-500">NATIONAL SECURITY SERVICE AUTOMOTIVE COMPLIANCE</span>
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">WARRANT &amp; SEIZURE DISCLOSURE REGISTER</h2>
              <p className="text-[10px] text-slate-450 font-mono">STRICT INTEGRITY CHAIN RECORD // DO NOT DUPLICATE OUTSIDE AGENCY CONTROL</p>
            </div>

            {/* Document Details Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-xs font-medium border-b border-slate-200 pb-5">
              <div>
                <span className="text-slate-400 text-[10px] font-mono uppercase block">LEDGER REFERENCE ID</span>
                <strong className="text-slate-900 text-sm font-mono">{selectedSeizureReport.id}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] font-mono uppercase block">RECORD STAMP DATE</span>
                <span className="text-slate-900 font-mono">{selectedSeizureReport.reportedAt}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] font-mono uppercase block">PRIMARY TARGET SUSPECT</span>
                <span className="text-slate-900">{selectedSeizureReport.suspectName}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] font-mono uppercase block">CHASSIS SERIAL (VIN)</span>
                <span className="text-slate-900 font-mono font-bold">{selectedSeizureReport.primaryVin}</span>
              </div>
            </div>

            {/* Brief Segment */}
            <div className="space-y-2">
              <span className="text-slate-400 text-[10px] font-mono uppercase block">AFFIDAVIT DEPOSITION ANALYSIS</span>
              <p className="text-xs text-slate-700 leading-relaxed italic">{selectedSeizureReport.description}</p>
            </div>

            {/* Itemized Evidence list */}
            <div className="space-y-3">
              <span className="text-slate-400 text-[10px] font-mono uppercase block">ITEMIZED CONFISCATION LOGS</span>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {selectedSeizureReport.evidence.map(e => (
                  <div key={e.id} className="p-3 bg-slate-50 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900 block">{e.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono uppercase">Custodian: {e.custodian}</span>
                    </div>
                    <span className="text-[11px] text-slate-600 font-mono font-bold bg-slate-200/50 px-2.5 py-0.5 rounded border border-slate-300/10">
                      {e.id}
                    </span>
                  </div>
                ))}

                {selectedSeizureReport.evidence.length === 0 && (
                  <div className="p-4 text-center text-slate-400 text-[11px] font-mono">
                    No physical, digital, or statement components have been attached to this record.
                  </div>
                )}
              </div>
            </div>

            {/* Signatures block */}
            <div className="grid grid-cols-2 gap-12 pt-8 text-xs font-mono">
              <div className="space-y-4">
                <div className="border-b border-slate-300 h-10 flex items-end">
                  <span className="text-[10px] italic font-serif text-slate-600 pl-4">{selectedSeizureReport.badgeId} Signature</span>
                </div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">ISSUING OFFICER STAMP</span>
              </div>
              <div className="space-y-4">
                <div className="border-b border-slate-300 h-10 flex items-end">
                  <span className="text-[10px] italic font-serif text-slate-600 pl-4">SYSTEM VERIFIED // SHA-256</span>
                </div>
                <span className="text-[9px] uppercase tracking-wider text-slate-400">Escrow Oversight Division Seal</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-6 border-t border-slate-200 flex justify-end gap-3 font-sans">
              <button
                onClick={() => setSelectedSeizureReport(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold select-none flex items-center gap-1.5 transition-all"
              >
                <Download size={13} /> DOWNLOAD OFFICIAL DEPOSITION PDF
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
