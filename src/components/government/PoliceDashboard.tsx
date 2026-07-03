/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shield, AlertTriangle, FileText, Search, Activity, Users, Download, Plus, 
  MapPin, CheckCircle, RefreshCw, Layers, BrainCircuit, ExternalLink, Calendar,
  Paperclip, Tag, ArrowRight, CornerDownRight, Scale, Trash2, CheckCircle2, X
} from 'lucide-react';
import { NumericTransition } from '../AnimatedCounter';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/AuthContext';
import { VEHICLES } from '../../data';

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
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'cases' | 'watchlist' | 'ai-net' | 'alerts'>('cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  
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
  const [watchlist, setWatchlist] = useState<WatchlistVehicle[]>([]);

  const [newWatchlistVin, setNewWatchlistVin] = useState('');
  const [newWatchlistMake, setNewWatchlistMake] = useState('');
  const [newWatchlistModel, setNewWatchlistModel] = useState('');
  const [newWatchlistReason, setNewWatchlistReason] = useState<'Stolen' | 'Cloned VIN' | 'Customs Export Fraud' | 'Odometer Rollback'>('Stolen');
  const [newWatchlistNotes, setNewWatchlistNotes] = useState('');
  const [showAddToWatchlist, setShowAddToWatchlist] = useState(false);

  // Live Alerts State
  const [alerts, setAlerts] = useState<AlertFeedItem[]>([]);

  // Case states
  const [cases, setCases] = useState<Case[]>([]);

  // AI Suggestion Queue - strictly interactive, no auto-accusation
  const [aiSuggestions, setAiSuggestions] = useState([
    {
      id: 'AI-LEAD-01',
      title: 'Potential Double IP Registration Cloned Ring',
      confidence: '94%',
      insight: 'The same dealer console IP Address (192.168.44.112) updated listing metadata for WAUB8AF21MN05XXXX (Audi RS6) AND requested background certificate lookup for SAJGV2RE8MA124850 (Range Rover, Stolen).',
      source: 'Car Portal IP Telemetry Logs',
      actionTaken: null as 'approved' | 'dismissed' | null
    }
  ]);

  const fetchPoliceDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const dashboardData = await api.get('/dashboard/police');
      setStats(dashboardData);

      // Map stolen reports to cases
      const mappedCases = (dashboardData.recentReports || []).map((report: any) => ({
        id: report.id,
        title: `Stolen Vehicle Report: ${report.vehicle?.make} ${report.vehicle?.model}`,
        status: report.status === 'OPEN' ? 'Open' : report.status === 'INVESTIGATING' ? 'Under Review' : report.status === 'RECOVERED' ? 'Resolved' : 'Seized',
        severity: 'High',
        suspectName: 'Unknown',
        primaryVin: report.vehicle?.vin || 'N/A',
        description: report.description || 'Stolen report filed.',
        reportedAt: new Date(report.createdAt).toLocaleString(),
        badgeId: 'DET-4015',
        evidence: []
      }));
      setCases(mappedCases);
      if (mappedCases.length > 0 && !selectedCaseId) {
        setSelectedCaseId(mappedCases[0].id);
      }

      // Map flagged vehicles to watchlist
      const mappedWatchlist = (dashboardData.flaggedVehicles || []).map((v: any) => ({
        vin: v.vin,
        year: v.year,
        make: v.make,
        model: v.model,
        reason: 'Stolen', // Default reason for flagged vehicles
        reportedAt: new Date(v.createdAt).toLocaleString(),
        status: 'Active',
        notes: `Flagged by seller ${v.seller?.firstName} ${v.seller?.lastName}`
      }));
      setWatchlist(mappedWatchlist);

      // Alerts could be derived from flagged vehicles or a separate system
      setAlerts([
        {
          id: 'AL-109',
          sender: 'Car Portal',
          message: 'Suspicious activity detected.',
          timestamp: 'Recent',
          urgency: 'Flagrant',
          vin: 'N/A',
          resolved: false
        }
      ]);

    } catch (err: any) {
      console.error('Failed to fetch police dashboard', err);
      setError(err.message || 'Failed to load police dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoliceDashboard();
  }, []);

  const handleUpdateStatus = async (reportId: string, status: string) => {
    try {
      await api.patch(`/stolen-reports/${reportId}/status`, { status });
      fetchPoliceDashboard();
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    }
  };

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

    // In a real app, this might create a stolen report or a case record
    alert(`Secure National Case file initiated.`);
    setShowCreateCaseModal(false);
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
    alert(`Warning: VIN ${newWatchlistVin.toUpperCase()} broadcasted with immediate search intercept protocols.`);
    setShowAddToWatchlist(false);
  };

  const promoteAIToCase = (sID: string, title: string, insight: string) => {
    alert(`Neural target authorized. Case file established for investigation.`);
    setActiveTab('cases');
  };

  const handleResolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 inline-block">
          <Shield className="mx-auto mb-2 text-red-600" />
          <h2 className="font-bold">Authorization Error</h2>
          <p className="text-sm">{error}</p>
          <button onClick={() => fetchPoliceDashboard()} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold">Retry Terminal Access</button>
        </div>
      </div>
    );
  }

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
                    <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">Operational Narrative</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{activeCase.description}</p>
                  </div>

                  {/* Evidence Tracker */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">Physical & Digital Evidence Logs</span>
                      <button 
                        onClick={() => setShowAddEvidence(!showAddEvidence)}
                        className="text-[10px] font-bold text-red-650 hover:text-red-705 transition-colors flex items-center gap-1"
                      >
                        <Plus size={12} /> ADD ITEM
                      </button>
                    </div>

                    {showAddEvidence && (
                      <div className="bg-slate-100/80 p-4 rounded-xl border border-slate-200 animate-in slide-in-from-top-2 duration-300">
                        <form onSubmit={handleAddEvidenceSubmit} className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <input 
                              placeholder="Evidence Name" 
                              className="bg-white border border-slate-250 text-[11px] px-3 py-1.5 rounded-lg outline-none focus:border-red-650"
                              value={evidenceName}
                              onChange={e => setEvidenceName(e.target.value)}
                            />
                            <select 
                              className="bg-white border border-slate-250 text-[11px] px-3 py-1.5 rounded-lg outline-none"
                              value={evidenceType}
                              onChange={e => setEvidenceType(e.target.value)}
                            >
                              <option>Physical Component</option>
                              <option>Digital Media</option>
                              <option>Document / Title</option>
                              <option>Telemetry Log</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <input 
                              placeholder="Custodian Agent" 
                              className="flex-1 bg-white border border-slate-250 text-[11px] px-3 py-1.5 rounded-lg outline-none"
                              value={evidenceCustodian}
                              onChange={e => setEvidenceCustodian(e.target.value)}
                            />
                            <button type="submit" className="bg-[#0b1431] text-white px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                              Register Log
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activeCase.evidence.map(item => (
                        <div key={item.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-start gap-3 group">
                          <div className="bg-slate-50 p-2 rounded-lg text-slate-400 group-hover:text-red-650 transition-colors">
                            {item.type.includes('Media') ? <Activity size={16} /> : <Paperclip size={16} />}
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-[11px] font-bold text-slate-800">{item.title}</h4>
                            <p className="text-[9px] text-slate-500 font-mono uppercase tracking-tight">{item.type} • {item.id}</p>
                            <p className="text-[9.5px] text-slate-600 leading-tight mt-1 italic line-clamp-2">"{item.notes}"</p>
                          </div>
                        </div>
                      ))}

                      {activeCase.evidence.length === 0 && !showAddEvidence && (
                        <div className="col-span-full py-12 text-center bg-slate-100/40 rounded-xl border border-dashed border-slate-250">
                          <div className="text-slate-300 mb-2"><FileText size={24} className="mx-auto" /></div>
                          <p className="text-[10px] font-mono text-slate-400">NO EVIDENCE LOGGED FOR THIS DOSSIER</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STOLEN WATCHLIST (STRICT TACTICAL) */}
        {activeTab === 'watchlist' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-end flex-wrap gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-red-650 font-extrabold uppercase tracking-widest">Border & National Watchlist</span>
                <h2 className="text-xl font-black text-[#0b1431]">Immediate Recovery Targets</h2>
                <p className="text-xs text-slate-500">Vehicles flagged with active seizure warrants or recovery protocols.</p>
              </div>
              <button 
                onClick={() => setShowAddToWatchlist(true)}
                className="bg-[#0b1431] text-white px-5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-xs"
              >
                <Plus size={15} /> BROADCAST NEW VIN TARGET
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredWatchlist.map((item, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-red-650 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-slate-50 p-2.5 rounded-xl text-slate-400 group-hover:bg-red-50 group-hover:text-red-650 transition-all">
                      <Shield size={20} />
                    </div>
                    <span className={`text-[9px] font-mono uppercase font-black px-2 py-0.5 rounded-full ${
                      item.status === 'Active' ? 'bg-red-100 text-red-650 border border-red-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="space-y-1 mb-4">
                    <h3 className="text-xs font-black text-[#0b1431]">{item.year} {item.make} {item.model}</h3>
                    <p className="text-[11px] font-mono text-slate-500 select-all font-bold">{item.vin}</p>
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100 font-mono text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400 uppercase font-bold text-[9px]">Alert Reason</span>
                      <span className="text-red-650 font-bold">{item.reason}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 uppercase font-bold text-[9px]">Entry Date</span>
                      <span className="text-slate-700">{item.reportedAt}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-2.5 bg-slate-50 rounded-xl text-[10px] text-slate-600 italic leading-snug border border-slate-100">
                    "{item.notes}"
                  </div>
                </div>
              ))}
            </div>

            {filteredWatchlist.length === 0 && (
              <div className="py-24 text-center border-2 border-dashed border-slate-150 rounded-3xl">
                <p className="text-slate-400 font-mono text-xs">NO TARGETS MATCHING CURRENT SEARCH FILTER</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AI ENTITY MAP */}
        {activeTab === 'ai-net' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in zoom-in-95 duration-500">
            
            {/* SVG Relationship Graph */}
            <div className="lg:col-span-8 bg-[#0b1431] rounded-[32px] border border-slate-800 h-[600px] relative overflow-hidden shadow-2xl">
              <div className="absolute top-6 left-6 z-10">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  Neural Relationship Correlation Graph
                </span>
              </div>
              
              <svg className="w-full h-full cursor-grab active:cursor-grabbing">
                {/* Edges */}
                {edges.map((edge, i) => {
                  const from = nodes.find(n => n.id === edge.from)!;
                  const to = nodes.find(n => n.id === edge.to)!;
                  return (
                    <line 
                      key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} 
                      stroke="#1e293b" strokeWidth="1" strokeDasharray="4 2" 
                    />
                  );
                })}
                
                {/* Nodes */}
                {nodes.map(node => (
                  <g 
                    key={node.id} 
                    transform={`translate(${node.x},${node.y})`}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    <circle 
                      r={node.type === 'Suspect' ? 12 : 8} 
                      fill={node.type === 'Suspect' ? '#ef4444' : node.type === 'VIN' ? '#3b82f6' : '#94a3b8'} 
                      className="drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                    />
                    <text y={24} textAnchor="middle" fill="#94a3b8" className="text-[9px] font-mono font-bold uppercase tracking-tight pointer-events-none">
                      {node.label}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Hover Node Card overlay */}
              {hoveredNode && (
                <div className="absolute top-6 right-6 w-64 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-xl animate-in fade-in duration-200">
                   <div className="flex items-center gap-2 mb-3">
                     <div className={`h-2 w-2 rounded-full ${hoveredNode.type === 'Suspect' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                     <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{hoveredNode.type} Entity</span>
                   </div>
                   <h4 className="text-white text-xs font-bold mb-1">{hoveredNode.label}</h4>
                   {hoveredNode.role && <p className="text-[10px] text-cyan-400 font-mono mb-2">{hoveredNode.role}</p>}
                   {hoveredNode.ip && <p className="text-[10px] text-slate-500 font-mono">{hoveredNode.ip}</p>}
                   <div className="mt-4 pt-4 border-t border-slate-800">
                     <button className="w-full bg-slate-800 hover:bg-slate-700 text-white text-[9px] font-bold py-2 rounded-lg uppercase tracking-wider transition-colors">
                       Deep Profile Scan
                     </button>
                   </div>
                </div>
              )}
            </div>

            {/* AI Insights Sidebar */}
            <div className="lg:col-span-4 space-y-4">
               <div className="flex items-center gap-2 text-red-650 mb-2">
                 <BrainCircuit size={18} />
                 <h3 className="text-xs font-black uppercase tracking-widest">Intelligent Leads</h3>
               </div>
               
               <div className="space-y-4">
                 {aiSuggestions.map(s => (
                   <div key={s.id} className={`p-5 rounded-3xl border transition-all ${
                     s.actionTaken === 'approved' ? 'bg-emerald-50/40 border-emerald-100 opacity-60' : 'bg-slate-50 border-slate-200 hover:border-red-650'
                   }`}>
                     <div className="flex justify-between items-start mb-3">
                       <span className="text-[10px] font-mono text-slate-400 font-bold">{s.confidence} Match Confidence</span>
                       {s.actionTaken === 'approved' ? (
                         <CheckCircle2 size={16} className="text-emerald-500" />
                       ) : (
                         <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                       )}
                     </div>
                     
                     <h4 className="text-xs font-bold text-slate-900 mb-2">{s.title}</h4>
                     <p className="text-[10px] text-slate-600 leading-relaxed mb-4">"{s.insight}"</p>
                     
                     <div className="flex items-center justify-between">
                       <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-tight">Source: {s.source}</span>
                       {!s.actionTaken && (
                         <button 
                           onClick={() => promoteAIToCase(s.id, s.title, s.insight)}
                           className="bg-red-650 hover:bg-red-705 text-white text-[9px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest transition-colors shadow-sm"
                         >
                           Open Dossier
                         </button>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* TAB 4: EXTERNAL ALERTS */}
        {activeTab === 'alerts' && (
          <div className="space-y-4 max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h2 className="text-xl font-black text-[#0b1431]">Cross-Agency Fraud Alerts</h2>
              <p className="text-xs text-slate-500">Live feed of anomalous activities pushed from Marketplace, Customs, and Insurance nodes.</p>
            </div>

            <div className="space-y-3">
              {alerts.map(a => (
                <div key={a.id} className={`p-5 rounded-2xl border flex gap-5 items-start transition-all ${
                  a.resolved ? 'bg-slate-50 border-slate-100 grayscale' : 'bg-white border-slate-200 hover:shadow-md'
                }`}>
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    a.urgency === 'Flagrant' ? 'bg-red-50 text-red-650' : a.urgency === 'Suspicious' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {a.urgency === 'Flagrant' ? <Shield size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{a.sender}</span>
                          <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{a.timestamp}</span>
                        </div>
                        <h4 className={`text-xs font-bold ${a.resolved ? 'text-slate-500' : 'text-slate-900'}`}>{a.message}</h4>
                      </div>
                      {!a.resolved && (
                        <button 
                          onClick={() => handleResolveAlert(a.id)}
                          className="text-slate-400 hover:text-emerald-500 transition-colors"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        <Tag size={12} /> VIN: {a.vin}
                      </div>
                      <button className="text-[10px] font-bold text-red-650 hover:underline uppercase tracking-wider">
                        Initiate Query
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MODALS */}
      {showCreateCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0b1431]/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl w-full max-w-lg p-8 space-y-6 relative overflow-hidden">
             {/* Modal Header */}
             <div className="space-y-1">
               <span className="text-[10px] font-mono text-red-650 font-bold uppercase tracking-widest">New Investigation Protocol</span>
               <h3 className="text-xl font-black text-[#0b1431]">Establish Case File</h3>
             </div>
             
             <form onSubmit={handleCreateCase} className="space-y-4">
               <div className="space-y-1.5">
                 <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest ml-1">Case Designation / Title</label>
                 <input 
                   required
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-red-650 transition-all font-sans"
                   placeholder="e.g. Export Ring Intercept Miami Hub"
                   value={newCaseTitle}
                   onChange={e => setNewCaseTitle(e.target.value)}
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest ml-1">Linked VIN</label>
                   <input 
                     required
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono outline-none focus:border-red-650 transition-all"
                     placeholder="17 CHAR CODE"
                     maxLength={17}
                     value={newCaseVin}
                     onChange={e => setNewCaseVin(e.target.value)}
                   />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest ml-1">Priority Level</label>
                   <select 
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-red-650 transition-all"
                     value={newCaseSeverity}
                     onChange={e => setNewCaseSeverity(e.target.value as any)}
                   >
                     <option>High</option>
                     <option>Medium</option>
                     <option>Low</option>
                   </select>
                 </div>
               </div>
               
               <div className="space-y-1.5">
                 <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest ml-1">Suspect Description / Entity</label>
                 <input 
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-red-650 transition-all"
                   placeholder="Name or Corporate Identity"
                   value={newCaseSuspect}
                   onChange={e => setNewCaseSuspect(e.target.value)}
                 />
               </div>
               
               <div className="space-y-1.5">
                 <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest ml-1">Briefing Summary</label>
                 <textarea 
                   rows={3}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-red-650 transition-all resize-none"
                   placeholder="Enter initial field observations..."
                   value={newCaseDesc}
                   onChange={e => setNewCaseDesc(e.target.value)}
                 />
               </div>
               
               <div className="pt-4 flex gap-3">
                 <button 
                   type="button" 
                   onClick={() => setShowCreateCaseModal(false)}
                   className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="flex-1 bg-red-650 hover:bg-red-705 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-red-200"
                 >
                   Commit to Archive
                 </button>
               </div>
             </form>

             {/* Close trigger */}
             <button 
               onClick={() => setShowCreateCaseModal(false)}
               className="absolute top-6 right-6 text-slate-300 hover:text-red-650 transition-colors"
             >
               <X size={20} />
             </button>
           </div>
        </div>
      )}

      {showAddToWatchlist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0b1431]/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-2xl w-full max-w-md p-8 space-y-6 relative overflow-hidden">
             <div className="space-y-1">
               <span className="text-[10px] font-mono text-red-650 font-bold uppercase tracking-widest">Immediate Recovery Broadcast</span>
               <h3 className="text-xl font-black text-[#0b1431]">Add Watchlist Target</h3>
             </div>
             
             <form onSubmit={handleCreateWatchlist} className="space-y-4">
               <div className="space-y-1.5">
                 <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest ml-1">VIN Code</label>
                 <input 
                   required
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono outline-none focus:border-red-650"
                   placeholder="17 CHAR VIN"
                   maxLength={17}
                   value={newWatchlistVin}
                   onChange={e => setNewWatchlistVin(e.target.value)}
                 />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest ml-1">Make</label>
                   <input 
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-red-650"
                     placeholder="e.g. BMW"
                     value={newWatchlistMake}
                     onChange={e => setNewWatchlistMake(e.target.value)}
                   />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest ml-1">Model</label>
                   <input 
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-red-650"
                     placeholder="e.g. M5"
                     value={newWatchlistModel}
                     onChange={e => setNewWatchlistModel(e.target.value)}
                   />
                 </div>
               </div>
               
               <div className="space-y-1.5">
                 <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest ml-1">Flag Reason</label>
                 <select 
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-red-650"
                   value={newWatchlistReason}
                   onChange={e => setNewWatchlistReason(e.target.value as any)}
                 >
                   <option>Stolen</option>
                   <option>Cloned VIN</option>
                   <option>Customs Export Fraud</option>
                   <option>Odometer Rollback</option>
                 </select>
               </div>
               
               <div className="space-y-1.5">
                 <label className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest ml-1">Tactical Notes</label>
                 <textarea 
                   rows={2}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-red-650 resize-none"
                   placeholder="Enter descriptive markers..."
                   value={newWatchlistNotes}
                   onChange={e => setNewWatchlistNotes(e.target.value)}
                 />
               </div>
               
               <div className="pt-4 flex gap-3">
                 <button 
                   type="button" 
                   onClick={() => setShowAddToWatchlist(false)}
                   className="flex-1 bg-slate-100 py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="flex-1 bg-[#0b1431] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg"
                 >
                   Broadcast Alert
                 </button>
               </div>
             </form>
          </div>
        </div>
      )}

      {selectedSeizureReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#0b1431]/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
             
             {/* Print View Simulation Header */}
             <div className="bg-slate-100 px-10 py-6 border-b border-slate-200 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="bg-red-650 text-white p-2.5 rounded-2xl shadow-lg shadow-red-200">
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#0b1431] uppercase tracking-tighter italic">Seizure Warrant Summary</h3>
                    <p className="text-[10px] font-mono text-slate-500 font-bold">GENERATED: {new Date().toUTCString()}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="bg-white border border-slate-250 p-2 rounded-xl text-slate-600 hover:text-red-650 transition-colors shadow-sm">
                    <Download size={18} />
                  </button>
                  <button 
                    onClick={() => setSelectedSeizureReport(null)}
                    className="bg-white border border-slate-250 p-2 rounded-xl text-slate-600 hover:text-red-650 transition-colors shadow-sm"
                  >
                    <X size={18} />
                  </button>
                </div>
             </div>
             
             {/* Report Body */}
             <div className="flex-1 overflow-y-auto p-10 font-sans space-y-10">
                
                {/* Official Stamp Decoration */}
                <div className="absolute top-24 right-12 opacity-10 rotate-12 pointer-events-none select-none">
                  <div className="border-4 border-red-650 text-red-650 rounded-full w-48 h-48 flex flex-col items-center justify-center font-black uppercase text-center p-4">
                    <div className="text-xl">DEPARTMENT OF</div>
                    <div className="text-3xl">POLICE</div>
                    <div className="text-sm mt-1 tracking-[0.2em]">SECURE SEAL</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-12 border-b border-slate-200 pb-10 relative z-10">
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">Primary Subject Account</span>
                      <h4 className="text-base font-black text-[#0b1431]">{selectedSeizureReport.suspectName}</h4>
                      <p className="text-xs text-slate-500 mt-1 italic leading-relaxed">Identity linked via cross-platform correlation of dealer IPs and title history logs.</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">Physical Asset Target</span>
                      <p className="text-sm font-bold text-slate-800">VIN: {selectedSeizureReport.primaryVin}</p>
                      <p className="text-xs text-slate-500 mt-0.5 uppercase font-bold tracking-tight">Status: WARRANT_ISSUED</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">Legal Jurisdiction</span>
                      <p className="text-sm font-bold text-slate-800 font-mono">FED-LEO-NODES-V9</p>
                      <p className="text-xs text-slate-500 mt-1">Authorized under national emergency recovery protocols for high-value asset theft.</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block mb-2">Case Reference ID</span>
                      <p className="text-sm font-bold text-slate-800 font-mono underline decoration-red-650/40">{selectedSeizureReport.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Operational Findings Summary</h5>
                  <p className="text-xs text-slate-700 leading-relaxed indent-8">
                    {selectedSeizureReport.description} Evidence gathered across multiple nodes (DMV, Marketplace, Insurance Telemetry) indicates a persistent pattern of fraudulent activity 
                    linked to this asset. Immediate recovery is mandated by the Department of Criminal Compliance. All linked corporate accounts have been frozen pending 
                    full investigation. Direct intercept at port or roadside is authorized.
                  </p>
                </div>

                <div className="space-y-4">
                  <h5 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 pb-2">Cataloged Evidence Chain</h5>
                  <div className="space-y-2">
                    {selectedSeizureReport.evidence.map(e => (
                      <div key={e.id} className="flex justify-between items-center text-[10px] bg-slate-50 p-3 rounded-xl border border-slate-200">
                        <div className="font-mono font-bold">
                          <span className="text-slate-400 mr-2">[{e.id}]</span>
                          <span className="text-slate-800">{e.title}</span>
                        </div>
                        <span className="text-slate-400 uppercase italic">Verified by {e.custodian}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-10 flex justify-between items-end border-t border-slate-200">
                  <div className="space-y-2">
                    <div className="h-12 w-48 border-b border-slate-400 flex items-end px-2">
                      <span className="text-[10px] font-mono text-slate-400 pb-1 italic">Electronically Signed</span>
                    </div>
                    <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 ml-2">Authorized LEO Dispatcher</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">Security Hash Verification</p>
                    <p className="text-[10px] font-mono text-slate-300 max-w-xs break-all leading-tight mt-1">882a92-f0291-8921-ac91-0021-9921-ff02-092-229</p>
                  </div>
                </div>
             </div>

             {/* Footer Action */}
             <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
                <button 
                  onClick={() => setSelectedSeizureReport(null)}
                  className="bg-[#0b1431] text-white px-10 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-slate-200 transition-transform active:scale-95"
                >
                  Close Document Workspace
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
