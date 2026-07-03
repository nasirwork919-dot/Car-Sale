/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Shield, Terminal, Smartphone, Layers, HelpCircle, Check, Info, ChevronRight,
  FileText, Lock, Users, AlertTriangle, Sparkles, Folder, Search, Eye, 
  Download, Upload, Plus, Trash2, Sliders, LogOut, CheckCircle2, Clock, 
  MapPin, ZoomIn, Play, Pause, RefreshCw, Send, Radio, Map, Activity, ShieldCheck
} from 'lucide-react';
import { VEHICLES } from '../../data';
import PoliceMobileSimulator from './PoliceMobileSimulator';
import UniversalSmartUpload from '../UniversalSmartUpload';

interface Evidence {
  id: string;
  title: string;
  type: 'Digital Media' | 'Secure PDF Document' | 'InsurTech Telemetry Log' | 'Customs Statement Paper' | 'Audio Tape Recording';
  timestamp: string;
  custodian: string;
  notes: string;
  fileUrl?: string;
  fileSize?: string;
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

interface Suspect {
  id: string;
  name: string;
  dob: string;
  role: string;
  vehicle: string;
  warrantStatus: 'Arrest Warrant' | 'Under Surveillance' | 'Cleared';
}

interface Recommendation {
  id: string;
  patternCode: string;
  confidence: string;
  title: string;
  description: string;
  notes: string;
}

interface PolicePortalProps {
  onLogout?: () => void;
}

export default function PolicePortal({ onLogout }: PolicePortalProps) {
  // Navigation active state matching your exact sidebar choices
  const [activeTab, setActiveTab] = useState<'cases' | 'evidence' | 'suspects' | 'ai-analysis' | 'settings'>('cases');
  const [flasherMode, setFlasherMode] = useState<'strobe' | 'stealth' | 'solid'>('strobe');
  const [systemTime, setSystemTime] = useState(new Date().toUTCString());
  
  // Tactical configuration parameters
  const [syncRate, setSyncRate] = useState('Continuous');
  const [beaconIntensity, setBeaconIntensity] = useState('95%');

  // Search filter across pages
  const [searchQuery, setSearchQuery] = useState('');

  // Sync digital UTC clock
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemTime(new Date().toUTCString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Shared application database states
  const [cases, setCases] = useState<Case[]>([
    {
      id: 'CR-2024-0982-A',
      title: 'Operation Silver Hawk: Northeast Narcotics & Vinyl Clone Ring',
      status: 'Under Review',
      severity: 'High',
      suspectName: 'Marcus Thorne',
      primaryVin: 'LK-4492-X',
      description: 'Northeast narcotics distribution ring. High-priority joint task force operation. Under review for final apprehension phase using cloned high-end transport vehicles.',
      reportedAt: '2026-06-02 08:30',
      badgeId: 'Badge #88219',
      evidence: [
        {
          id: 'EVID-1021',
          title: 'Tampered Firewall VIN Stamping Photo',
          type: 'Digital Media',
          timestamp: '2026-06-02 11:15',
          custodian: 'Det. Richards',
          notes: 'Laser micro-engraving on chassis rivets lacks German manufacturer indentation depth.',
          fileSize: '3.4 MB'
        },
        {
          id: 'EVID-1022',
          title: 'Forged Nevada Title Document Certificate',
          type: 'Secure PDF Document',
          timestamp: '2026-06-03 14:22',
          custodian: 'Det. Richards',
          notes: 'Printer ink analysis matches low-grade dye printers linked to illegal workshop raids.',
          fileSize: '1.2 MB'
        },
        {
          id: 'EVID-1023',
          title: 'Intercepted Audio Comms Tape Tap #3',
          type: 'Audio Tape Recording',
          timestamp: '2026-06-04 18:40',
          custodian: 'Off. J. Miller',
          notes: 'Primary suspect discussing VIN swaps at Everglades Warehouse Port.',
          fileSize: '12.8 MB'
        }
      ]
    },
    {
      id: 'CR-2024-9920-B',
      title: 'Operation Blue Lightning: Southeast Odometer Rollback',
      status: 'Open',
      severity: 'Medium',
      suspectName: 'Victor "Nardo" Gerasimov',
      primaryVin: 'WAUB8AF21MN05XXXX',
      description: 'The BMW M5 Competition has workshop service history logs showing 32,400 kms in Germany. However, current imports specify 12,402 miles. High probability of cluster digital tampering.',
      reportedAt: '2026-05-15 12:45',
      badgeId: 'Badge #88219',
      evidence: [
        {
          id: 'EVID-9920',
          title: 'Digital Cluster Board Solder Points Trace',
          type: 'Digital Media',
          timestamp: '2026-05-16 09:30',
          custodian: 'Det. Richards',
          notes: 'Microprocessor EEPROM leg 8 shows manual solder flux indicating aftermarket programming override.',
          fileSize: '1.8 MB'
        }
      ]
    },
    {
      id: 'CR-2024-1102-C',
      title: 'Operation Neon Trace: West Palm Transshipment',
      status: 'Open',
      severity: 'High',
      suspectName: 'Elena Vance',
      primaryVin: 'SAJGV2RE8MA124850',
      description: 'Tracker deactivation at West Palm beach area. Underworld shipping pipeline transporting luxury SUVs into secure metal cargo shipping containers.',
      reportedAt: '2026-06-08 15:45',
      badgeId: 'Badge #88219',
      evidence: [
        {
          id: 'EVID-1029',
          title: 'InsurTech Cell GPS Locator Telemetry Logs',
          type: 'InsurTech Telemetry Log',
          timestamp: '2026-06-08 16:00',
          custodian: 'Det. Richards',
          notes: 'Claims team verified terminal coordinate ping matching Port Everglades Terminal Sector 4.',
          fileSize: '0.4 MB'
        }
      ]
    },
    {
      id: 'CR-2024-0332-D',
      title: 'Operation Safe Harbor: Valuation Avoidance Group',
      status: 'Resolved',
      severity: 'Low',
      suspectName: 'Apex European Motors Import Corp',
      primaryVin: 'WP0AB2A92MS299212',
      description: 'Suspicious import invoicing declaring vehicle valuation below salvage limits, while actual marketplace lookup demonstrates premium pristine condition pricing.',
      reportedAt: '2026-05-18 10:00',
      badgeId: 'FUS-9904',
      evidence: [
        {
          id: 'EVID-0988',
          title: 'Foreign Custom Invoice Declaration Paperwork',
          type: 'Customs Statement Paper',
          timestamp: '2026-05-18 12:40',
          custodian: 'Admin. Rossi',
          notes: 'Fines settled, taxes retroactively collected in full. Status converted to resolved.',
          fileSize: '4.1 MB'
        }
      ]
    }
  ]);

  // Selected Active Case Focus
  const [selectedCaseId, setSelectedCaseId] = useState<string>('CR-2024-0982-A');

  const selectedCase = useMemo(() => {
    return cases.find(c => c.id === selectedCaseId) || cases[0];
  }, [cases, selectedCaseId]);

  // Suspect Profiles Database state
  const [suspects, setSuspects] = useState<Suspect[]>([
    {
      id: 'SUS-001',
      name: 'Marcus Thorne',
      dob: '04/12/1985',
      role: 'Primary Target / Syndicate Leader',
      vehicle: 'BLK DODGE RAM - XY99-23K',
      warrantStatus: 'Arrest Warrant'
    },
    {
      id: 'SUS-002',
      name: 'Elena Vance',
      dob: '11/22/1992',
      role: 'Logistics Facilitator',
      vehicle: 'None Registered',
      warrantStatus: 'Under Surveillance'
    },
    {
      id: 'SUS-003',
      name: 'Derrick Lowery',
      dob: '01/05/1978',
      role: 'Logistics Specialist / Driver',
      vehicle: 'WHT FORD F-150 - TRK-4421',
      warrantStatus: 'Arrest Warrant'
    },
    {
      id: 'SUS-004',
      name: 'Victor "Nardo" Gerasimov',
      dob: '09/30/1981',
      role: 'Lead Stamping Technician',
      vehicle: 'SLV MERCEDES E-CLASS - C300-DE',
      warrantStatus: 'Arrest Warrant'
    }
  ]);

  // AI Pattern Recommendations (dotted cards on AI Pattern Analysis)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: 'REC-01',
      patternCode: 'PATTERN: VIN_CLONE_A12',
      confidence: '94% CONFIDENCE',
      title: 'Odometer Rollback Trend Detected in Southeast Region',
      description: 'AI identified 14 vehicles of matching chassis series across 3 partner dealerships showing non-linear mileage report gaps. Highly correlated to Dealer ID: 9920 and overseas imports.',
      notes: 'Requires officer confirmation to initiate a formal dossier registry.'
    },
    {
      id: 'REC-02',
      patternCode: 'PATTERN: DOC_FORGERY_X',
      confidence: '81% CONFIDENCE',
      title: 'Synthetic Identity Link: "Michael R." Network',
      description: 'Multiple fraudulent title clearance applications sharing a common digital signature hash and PO Box. Potentially linked to the Midwest Auto Theft distribution ring.',
      notes: 'Requires human verification to link cases.'
    }
  ]);

  // Search logic across currently active view lists
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

  const filteredSuspects = useMemo(() => {
    if (!searchQuery.trim()) return suspects;
    const q = searchQuery.toLowerCase();
    return suspects.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.role.toLowerCase().includes(q) ||
      s.vehicle.toLowerCase().includes(q) ||
      s.warrantStatus.toLowerCase().includes(q)
    );
  }, [suspects, searchQuery]);

  // All Evidence items across all cases inside the vault
  const allVaultEvidence = useMemo(() => {
    const items: (Evidence & { caseId: string; caseTitle: string })[] = [];
    cases.forEach(c => {
      c.evidence.forEach(e => {
        items.push({
          ...e,
          caseId: c.id,
          caseTitle: c.title
        });
      });
    });
    return items;
  }, [cases]);

  const filteredEvidence = useMemo(() => {
    if (!searchQuery.trim()) return allVaultEvidence;
    const q = searchQuery.toLowerCase();
    return allVaultEvidence.filter(e => 
      e.id.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q) ||
      e.type.toLowerCase().includes(q) ||
      e.custodian.toLowerCase().includes(q) ||
      e.caseTitle.toLowerCase().includes(q)
    );
  }, [allVaultEvidence, searchQuery]);

  // Total active arrest warrants count computed dynamically
  const activeWarrantsCount = useMemo(() => {
    return suspects.filter(s => s.warrantStatus === 'Arrest Warrant').length;
  }, [suspects]);

  // Modals & form states
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);
  const [showNewSuspectModal, setShowNewSuspectModal] = useState(false);
  
  // Update status state targets
  const [activeCaseStatus, setActiveCaseStatus] = useState<'Open' | 'Under Review' | 'Resolved' | 'Seized'>('Under Review');

  // New Case Inputs
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseSuspect, setNewCaseSuspect] = useState('');
  const [newCaseVin, setNewCaseVin] = useState('');
  const [newCaseSeverity, setNewCaseSeverity] = useState<'High' | 'Medium' | 'Low'>('High');
  const [newCaseDescription, setNewCaseDescription] = useState('');

  // New Evidence Inputs
  const [newEvidenceTitle, setNewEvidenceTitle] = useState('');
  const [newEvidenceType, setNewEvidenceType] = useState<'Digital Media' | 'Secure PDF Document' | 'InsurTech Telemetry Log' | 'Customs Statement Paper' | 'Audio Tape Recording'>('Digital Media');
  const [newEvidenceCustodian, setNewEvidenceCustodian] = useState('Det. Richards');
  const [newEvidenceNotes, setNewEvidenceNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: number; dataUrl: string } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Suspect Inputs
  const [newSusName, setNewSusName] = useState('');
  const [newSusDob, setNewSusDob] = useState('');
  const [newSusRole, setNewSusRole] = useState('');
  const [newSusVehicle, setNewSusVehicle] = useState('');
  const [newSusWarrant, setNewSusWarrant] = useState<'Arrest Warrant' | 'Under Surveillance' | 'Cleared'>('Arrest Warrant');

  // Interactive diagnostic evidence preview focus
  const [previewEvidenceItem, setPreviewEvidenceItem] = useState<Evidence | null>(null);

  // Simulated download action
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (eId: string) => {
    setDownloadingId(eId);
    setTimeout(() => {
      setDownloadingId(null);
      alert(`Ledger check cleared! Evidence file exported containing encrypted SHA-256 seal.`);
    }, 1200);
  };

  // Switch to selected case and open modal to edit its status
  const triggerStatusEditModal = () => {
    setActiveCaseStatus(selectedCase.status);
    setShowStatusModal(true);
  };

  const handleStatusUpdate = () => {
    setCases(prev => prev.map(c => c.id === selectedCase.id ? { ...c, status: activeCaseStatus } : c));
    setShowStatusModal(false);
    alert(`Audit registry updated. Case ${selectedCase.id} status modified to "${activeCaseStatus}".`);
  };

  // Add customized cases
  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaseTitle.trim() || !newCaseVin.trim()) {
      alert("Verification failed. Please state a descriptive title and primary target VIN.");
      return;
    }

    const created: Case = {
      id: `CR-2026-${Math.floor(1000 + Math.random() * 9000)}-LE`,
      title: newCaseTitle,
      status: 'Open',
      severity: newCaseSeverity,
      suspectName: newCaseSuspect || 'Unidentified Ring Target',
      primaryVin: newCaseVin.toUpperCase(),
      description: newCaseDescription || 'Authorized docket compiled under Joint Task Force oversight.',
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      badgeId: 'Badge #88219',
      evidence: []
    };

    setCases(prev => [created, ...prev]);
    setSelectedCaseId(created.id);
    
    // Auto populate a matching suspect if custom target name entered
    if (newCaseSuspect.trim()) {
      const isSusAlreadyListed = suspects.some(s => s.name.toLowerCase() === newCaseSuspect.toLowerCase());
      if (!isSusAlreadyListed) {
        setSuspects(prev => [
          {
            id: `SUS-${Math.floor(100 + Math.random() * 900)}`,
            name: newCaseSuspect,
            dob: 'Unconfirmed',
            role: 'Investigative Target',
            vehicle: 'Unconfirmed',
            warrantStatus: 'Under Surveillance'
          },
          ...prev
        ]);
      }
    }

    // Reset inputs
    setNewCaseTitle('');
    setNewCaseSuspect('');
    setNewCaseVin('');
    setNewCaseSeverity('High');
    setNewCaseDescription('');
    setShowNewCaseModal(false);
    alert(`Authorized Secure Dossier Established: ${created.id} initiated.`);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processSelectedFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    setUploadedFile({
      name: file.name,
      size: file.size,
      dataUrl: URL.createObjectURL(file)
    });
    // Prefill title with filename
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    setNewEvidenceTitle(nameWithoutExt);

    // Auto detect format based on file extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      setNewEvidenceType('Secure PDF Document');
    } else if (['mp3', 'wav', 'm4a', 'ogg'].includes(ext || '')) {
      setNewEvidenceType('Audio Tape Recording');
    } else if (['csv', 'json', 'log', 'txt'].includes(ext || '')) {
      setNewEvidenceType('InsurTech Telemetry Log');
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      setNewEvidenceType('Digital Media');
    } else {
      setNewEvidenceType('Customs Statement Paper');
    }
  };

  const handleSmartEvidenceUpload = (dataUrl: string, fileName: string) => {
    // Approx size in bytes
    const mockSize = Math.round(dataUrl.length * 0.75);
    setUploadedFile({
      name: fileName,
      size: mockSize,
      dataUrl: dataUrl
    });
    
    const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    setNewEvidenceTitle(nameWithoutExt);

    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      setNewEvidenceType('Secure PDF Document');
    } else if (['mp3', 'wav', 'm4a', 'ogg'].includes(ext || '')) {
      setNewEvidenceType('Audio Tape Recording');
    } else if (['csv', 'json', 'log', 'txt'].includes(ext || '')) {
      setNewEvidenceType('InsurTech Telemetry Log');
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) {
      setNewEvidenceType('Digital Media');
    } else {
      setNewEvidenceType('Customs Statement Paper');
    }
  };

  // Add evidence to case
  const handleAddEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvidenceTitle.trim()) {
      alert("Evidence filing requires a valid descriptor.");
      return;
    }

    const added: Evidence = {
      id: `EVID-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newEvidenceTitle,
      type: newEvidenceType,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      custodian: newEvidenceCustodian || 'Det. Richards',
      notes: newEvidenceNotes || 'Logged on secure terminal under strict chain of custody protocols.',
      fileSize: uploadedFile ? `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB` : `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
      fileUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : undefined
    };

    setCases(prev => prev.map(c => {
      if (c.id === selectedCaseId) {
        return {
          ...c,
          evidence: [...c.evidence, added]
        };
      }
      return c;
    }));

    // Reset inputs
    setNewEvidenceTitle('');
    setNewEvidenceType('Digital Media');
    setNewEvidenceCustodian('Det. Richards');
    setNewEvidenceNotes('');
    setUploadedFile(null);
    setShowAddEvidenceModal(false);
    alert(`Evidence record added securely. Registry audit trail synchronized.`);
  };

  // Create customized suspects
  const handleCreateSuspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSusName.trim()) return;

    const created: Suspect = {
      id: `SUS-${Math.floor(100 + Math.random() * 900)}`,
      name: newSusName,
      dob: newSusDob || '01/01/1990',
      role: newSusRole || 'General Suspect',
      vehicle: newSusVehicle || 'None Registered',
      warrantStatus: newSusWarrant
    };

    setSuspects(prev => [created, ...prev]);
    
    setNewSusName('');
    setNewSusDob('');
    setNewSusRole('');
    setNewSusVehicle('');
    setShowNewSuspectModal(false);
    alert(`Suspect tracker dossier established for: ${created.name}`);
  };

  // Toggle suspect warrant state
  const handleToggleWarrant = (sId: string) => {
    setSuspects(prev => prev.map(s => {
      if (s.id === sId) {
        const nextStatus: 'Arrest Warrant' | 'Under Surveillance' | 'Cleared' = 
          s.warrantStatus === 'Arrest Warrant' ? 'Under Surveillance' : 'Arrest Warrant';
        return {
          ...s,
          warrantStatus: nextStatus
        };
      }
      return s;
    }));
  };

  // Convert AI Recommendation/Lead to active main Case file representation
  const promoteRecommendationToCase = (rec: Recommendation) => {
    const vinMatchCode = rec.id === 'REC-01' ? 'WAUB8AF21MN05XXXX' : 'LK-4492-X';
    
    const created: Case = {
      id: `CR-2026-${Math.floor(1000 + Math.random() * 9000)}-AI`,
      title: rec.title,
      status: 'Open',
      severity: 'Medium',
      suspectName: rec.id === 'REC-02' ? 'Suspect Michael R. Syndicate' : 'Unidentified Dealership Owner',
      primaryVin: vinMatchCode,
      description: `AI Nodal scrape promoted dossier. Source anomaly: ${rec.description}. Certified by Scylla-V analytics.`,
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      badgeId: 'AI-DEPUTY-7',
      evidence: [
        {
          id: `EVID-${Math.floor(1000 + Math.random() * 9000)}`,
          title: `${rec.patternCode} Algorithmic Metadata Log`,
          type: 'InsurTech Telemetry Log',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          custodian: 'JustCarSale Secure Neural Unit',
          notes: `Automatic report scraped based on telemetry overlap. Linked description: ${rec.description}`
        }
      ]
    };

    setCases(prev => [created, ...prev]);
    setSelectedCaseId(created.id);
    setRecommendations(prev => prev.filter(r => r.id !== rec.id));
    setActiveTab('cases');
    alert(`Lead approved! National Case docket ${created.id} initiated on the server.`);
  };

  // Incident field trigger from Simulator callback
  const handleSimulatorIncidentCreation = () => {
    // Adding the stolen/alert vehicle case
    const createdId = `CR-2026-${Math.floor(1000 + Math.random() * 9000)}-FL`;
    const newCase: Case = {
      id: createdId,
      title: 'Field Apprehension: Port Everglades Laser Scanner Conflict',
      status: 'Open',
      severity: 'High',
      suspectName: 'Intercepted Field Occupant',
      primaryVin: 'SAJGV2RE8MA124850',
      description: 'Vehicle intercepted on site during routine checkpoint checks. Matches GTA bulletin for Range Rover stolen from West Palm Beach beach villa.',
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      badgeId: 'Officer J. Miller',
      evidence: [
        {
          id: `EVID-F001`,
          title: 'Field Laser Optical Camera Stamp Scan',
          type: 'Digital Media',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          custodian: 'Officer Miller',
          notes: 'Windshield RFID scan match.',
          fileSize: '1.5 MB'
        }
      ]
    };

    setCases(prev => [newCase, ...prev]);
    setSelectedCaseId(newCase.id);
    alert(`Simulator linked: New active incident ${createdId} populated on case logs.`);
  };

  return (
    <div className="bg-slate-100 text-slate-900 font-sans min-h-screen flex flex-col md:flex-row relative" id="intel-portal-workspace">
      
      {/* Top emergency flasher indicator across the layout */}
      {flasherMode === 'strobe' && (
        <div className="h-1.5 w-full flex select-none absolute top-0 left-0 right-0 z-[100]">
          <div className="flex-1 bg-red-600 animate-[pulse_0.4s_infinite] shadow-[0_0_15px_rgba(239,68,68,0.4)]"></div>
          <div className="flex-1 bg-blue-600 animate-[pulse_0.4s_infinite_0.2s] shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
          <div className="flex-1 bg-red-600 animate-[pulse_0.4s_infinite] shadow-[0_0_15px_rgba(239,68,68,0.4)]"></div>
          <div className="flex-1 bg-blue-600 animate-[pulse_0.4s_infinite_0.2s] shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
        </div>
      )}
      {flasherMode === 'solid' && (
        <div className="h-1.5 w-full flex select-none absolute top-0 left-0 right-0 z-[100]">
          <div className="flex-1 bg-red-750"></div>
          <div className="flex-1 bg-blue-750"></div>
        </div>
      )}

      {/* LEFT SIDEBAR NAVIGATION: Matching the minimalistic layout requested */}
      <aside className="w-full md:w-[280px] shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col pt-4 md:pt-8" id="intel-portal-sidebar">
        <div className="px-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8B0000] text-2xl font-black">shield</span>
            <span className="font-extrabold text-lg tracking-tight text-[#8B0000]">Police Portal</span>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized Use Only</p>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <button
            onClick={() => { setActiveTab('cases'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-xs font-semibold ${
              activeTab === 'cases'
                ? 'bg-red-50 text-[#8B0000] font-bold border-l-4 border-[#8B0000]'
                : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Folder size={15} className={activeTab === 'cases' ? "text-[#8B0000]" : "text-slate-400"} />
            <span>Case Folders</span>
            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 text-[#8B0000] font-bold font-mono">
              {cases.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('evidence'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-xs font-semibold ${
              activeTab === 'evidence'
                ? 'bg-red-50 text-[#8B0000] font-bold border-l-4 border-[#8B0000]'
                : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Lock size={15} className={activeTab === 'evidence' ? "text-[#8B0000]" : "text-slate-400"} />
            <span>Secure Files</span>
            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 text-[#8B0000] font-bold">
              {allVaultEvidence.length}
            </span>
          </button>

          <button
            onClick={() => { setActiveTab('suspects'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-xs font-semibold ${
              activeTab === 'suspects'
                ? 'bg-red-50 text-[#8B0000] font-bold border-l-4 border-[#8B0000]'
                : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Users size={15} className={activeTab === 'suspects' ? "text-[#8B0000]" : "text-slate-400"} />
            <span>Watchlist</span>
            {activeWarrantsCount > 0 && (
              <span className="ml-auto bg-red-100 text-[#8B0000] text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                {activeWarrantsCount} ACTIVE
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('ai-analysis'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-xs font-semibold ${
              activeTab === 'ai-analysis'
                ? 'bg-red-50 text-[#8B0000] font-bold border-l-4 border-[#8B0000]'
                : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Sparkles size={15} className={activeTab === 'ai-analysis' ? "text-[#8B0000] animate-pulse" : "text-slate-400"} />
            <span>AI Pattern Finder</span>
            {recommendations.length > 0 && (
              <span className="ml-auto bg-red-100 text-[#8B0000] text-[8px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                {recommendations.length} NEW
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-xs font-semibold ${
              activeTab === 'settings'
                ? 'bg-red-50 text-[#8B0000] font-bold border-l-4 border-[#8B0000]'
                : 'text-slate-550 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Sliders size={15} className="text-slate-400" />
            <span>System Settings</span>
          </button>
        </nav>

        {/* Investigator Credentials Avatar Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img 
              alt="Det. Richards Avatar" 
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqWW5UuIBWeaTbXPdbWPQMs6_oCW4G2npLaVDYKZWqqfak5Mdb436wyVEemTZnv7yPJxDUirfwsvStBioJjqn0i-WjE3ne9CtY0ZdVmkwziaKFye5cUdjLJPYS9Sw362eUTJ-SpF8YgBsOfSGIUeoxPSyMkmWEJ6Fg4YLfo2TkgKmuFUk_qBEc9Kzqejg6gKnmWBqmx1fhNBCwR_tbA66axpHbNBaZ5LrqF149Zr4dj_A6057YifOoOUnCNuQZFHGk0ff7CCmk-g8m" 
            />
            <div>
              <p className="text-xs font-bold text-slate-800">Det. Richards</p>
              <p className="text-[9px] text-slate-450 font-mono">BADGE #88219</p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-between text-left text-slate-550 hover:text-[#8B0000] px-2.5 py-1.5 rounded-lg text-xs font-bold font-sans transition-colors"
          >
            <span className="flex items-center gap-2"><LogOut size={13} /> Logout Session</span>
            <span className="text-[8px] tracking-wide text-slate-400">NODE ALPHA-7</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CANVAS */}
      <div className="flex-1 flex flex-col min-w-0" id="intel-portal-main-panel">
        
        {/* Top Header App Bar: Aesthetic exact match to user provided code layout */}
        <header className="bg-white border-b border-slate-200 h-16 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 select-none">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-[#8B0000] text-sm md:text-base tracking-tight block">Secure Police Portal</span>
            <span className="h-4 w-[1.5px] bg-slate-250"></span>
            
            {/* Context breadcrumb tag */}
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-red-50 text-[#8B0000] font-mono text-[9px] rounded font-bold border border-red-100">
                ACTIVE STATUS: {flasherMode === 'stealth' ? 'SILENT_MODE' : 'ALERT_NODE_ALPHA'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden lg:inline">{systemTime}</span>
            </div>
          </div>

          {/* Top Bar Right side Search & controls */}
          <div className="flex items-center gap-4">
            
            {/* Top Bar Real time Search Filter */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <input 
                type="text"
                placeholder="Search VIN, Suspect, or Case ID..."
                className="pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-full font-sans text-xs focus:ring-2 focus:ring-[#8B0000]/10 w-64 outline-none transition-all placeholder-slate-400"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Tactical beacon controller */}
            <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-205">
              <button
                type="button"
                onClick={() => setFlasherMode(flasherMode === 'strobe' ? 'stealth' : 'strobe')}
                className={`p-1.5 rounded transition-all ${flasherMode === 'strobe' ? 'bg-red-50 text-red-655' : 'text-slate-400 hover:text-slate-700'}`}
                title="Toggle Emergency Beacon Strobe"
              >
                <Activity size={13} className={flasherMode === 'strobe' ? 'animate-pulse' : ''} />
              </button>
            </div>

            {/* Quick alert indicator */}
            <div className="relative">
              <ShieldCheck className="text-emerald-600" size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Tab Container padding */}
        <main className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto">
          
          {/* SECURE TOP ADVISORY ALERT BLOCK */}
          <div className="card-3d-tactile-neutral p-4 flex items-start gap-3.5 relative overflow-hidden">
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#8B0000]"></div>
            <Terminal className="text-[#8B0000] shrink-0 mt-0.5" size={15} />
            <div className="text-[11px] text-slate-600 leading-normal">
              <span className="text-[#8B0000] font-bold uppercase font-mono tracking-wider text-[9px] block mb-0.5">
                🚨 SECURE OFFICER PORTAL - AUTHORIZED USE ONLY
              </span>
              <span>
                Use the side menu to track cloned vehicles, inspect secure files, and view DMV history records. Connected to <strong>NODE: ALPHA-7 (EVERETT GATEWAY)</strong>.
              </span>
            </div>
          </div>

          {/* ==================== PAGE 1: CASE MANAGEMENT ==================== */}
          {activeTab === 'cases' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Context Header & Actions Row */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <nav className="flex gap-2 text-slate-400 font-mono text-[9px] font-bold tracking-wider uppercase mb-1.5">
                    <span>POLICE DIRECTORY</span>
                    <span>/</span>
                    <span className="text-[#8B0000]">{selectedCase.id}</span>
                  </nav>
                  
                  <div className="flex items-center gap-3">
                    <h2 id="police-case-title-heading" className="text-2xl font-bold tracking-tight text-slate-900 font-sans">
                      {selectedCase.title}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wide inline-block ${
                      selectedCase.severity === 'High' ? 'bg-red-50 text-[#8B0000] border border-red-100' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {selectedCase.severity} Severity
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button 
                    type="button"
                    onClick={() => setShowNewCaseModal(true)}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-250 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-3d-premium active:scale-95 transition-all"
                  >
                    <Plus size={13} />
                    <span>Create Case Folder</span>
                  </button>
                  <button 
                    type="button"
                    onClick={triggerStatusEditModal}
                    className="bg-[#8B0000] text-white hover:bg-slate-800 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-3d-premium active:scale-95 transition-all"
                  >
                    <Sliders size={13} />
                    <span>Update Case Status</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Cases selector tape */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide select-none">
                <span className="text-[10px] font-mono text-slate-400 font-bold self-center mr-1 uppercase">QUICK LOAD CASE:</span>
                {filteredCases.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 border transition-all ${
                      selectedCaseId === c.id
                        ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350'
                    }`}
                  >
                    <span className="font-mono text-[9px] mr-1 opacity-80">{c.id}</span>
                    <span>{c.title.split(':')[0]}</span>
                  </button>
                ))}
              </div>

              {/* Case Status Bento Grid: Styled exactly like user provided code layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                
                {/* Status Box */}
                <div className="card-3d-tactile p-6">
                  <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase mb-1">Case Status</p>
                  <p className="text-lg font-extrabold text-[#8B0000] leading-none">{selectedCase.status}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-slate-500 text-xs font-mono">
                    <Clock size={12} />
                    <span>Updated recently</span>
                  </div>
                </div>

                {/* Suspects Box */}
                <div className="card-3d-tactile-neutral p-6">
                  <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase mb-1">Tracked Suspects</p>
                  <p className="text-lg font-extrabold text-slate-900 leading-none">
                    {suspects.length} <span className="text-xs font-normal text-slate-500">Tracked</span>
                  </p>
                  <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-[#8B0000] h-full w-[75%] rounded-full"></div>
                  </div>
                </div>

                {/* Evidence Items Box */}
                <div className="card-3d-tactile-neutral p-6">
                  <p className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase mb-1">Evidence Files</p>
                  <p className="text-lg font-extrabold text-slate-900 leading-none">
                    {selectedCase.evidence.length} <span className="text-xs font-normal text-slate-500">Files</span>
                  </p>
                  <div className="mt-4 flex -space-x-1.5">
                    {selectedCase.evidence.map((ev, idx) => (
                      <div 
                        key={ev.id} 
                        onClick={() => { setActiveTab('evidence'); setPreviewEvidenceItem(ev); }}
                        className="w-6 h-6 rounded-full border border-white bg-slate-100 text-[10px] font-bold text-slate-700 flex items-center justify-center cursor-pointer hover:bg-slate-200"
                        title={ev.title}
                      >
                        {ev.type === 'Digital Media' && '📸'}
                        {ev.type === 'Secure PDF Document' && '📄'}
                        {ev.type === 'Audio Tape Recording' && '📻'}
                        {ev.type === 'InsurTech Telemetry Log' && '📡'}
                        {ev.type === 'Customs Statement Paper' && '🧾'}
                      </div>
                    ))}
                    {selectedCase.evidence.length === 0 && (
                      <span className="text-xs text-slate-400 italic">No files vaulted</span>
                    )}
                  </div>
                </div>

                {/* Active Warrants Box */}
                <div className="card-3d-tactile p-6 border-l-[#8B0000]">
                  <p className="text-[10px] font-mono font-bold text-[#8B0000] tracking-wider uppercase mb-1">Active Warrants</p>
                  <p className="text-lg font-extrabold text-[#8B0000] leading-none">{activeWarrantsCount} Arrests</p>
                  <div className="mt-4 flex items-center gap-1.5 text-[#8B0000] text-xs font-mono font-bold">
                    <AlertTriangle size={12} className="animate-pulse" />
                    <span>Immediate Action</span>
                  </div>
                </div>

              </div>

              {/* Main Suspects Assets Table & Details */}
              <div className="card-3d-tactile-neutral overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h3 className="font-bold text-xs font-mono text-[#8B0000] uppercase tracking-wider">Tracked Suspects &amp; Vehicles</h3>
                    <p className="text-[11px] text-slate-550 mt-0.5">List of people and target vehicles being tracked for this investigation.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowNewSuspectModal(true)}
                    className="text-xs font-mono font-bold text-[#8B0000] hover:underline flex items-center gap-1.5"
                  >
                    <Plus size={13} /> Add Suspect Tracker
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-mono text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th className="px-6 py-4 font-bold">Suspect Name</th>
                        <th className="px-6 py-4 font-bold">Date of Birth</th>
                        <th className="px-6 py-4 font-bold">Suspect Role</th>
                        <th className="px-6 py-4 font-bold">Target Vehicle Plates</th>
                        <th className="px-6 py-4 font-bold">Warrant Status</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {filteredSuspects.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#8B0000]">
                                <Users size={14} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{s.name}</p>
                                <span className="font-mono text-[9px] text-[#8B0000] font-bold">{s.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-slate-500">{s.dob}</td>
                          <td className="px-6 py-4">
                            <span className="bg-slate-100 px-2.5 py-1 rounded text-slate-550 font-mono text-[10px] font-bold">
                              {s.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {s.vehicle === 'None Registered' ? (
                              <span className="text-slate-400 italic font-mono">None registered</span>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-400 text-sm">directions_car</span>
                                <span className="font-mono text-slate-800 font-bold uppercase select-all bg-slate-50 p-1 border border-slate-200/50 rounded">{s.vehicle}</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] font-bold border ${
                              s.warrantStatus === 'Arrest Warrant'
                                ? 'bg-red-50 text-[#8B0000] border-red-100'
                                : s.warrantStatus === 'Under Surveillance'
                                ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                                : 'bg-slate-100 text-slate-500 border-slate-200'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                s.warrantStatus === 'Arrest Warrant' ? 'bg-[#8B0000]' : 'bg-amber-500'
                              }`}></span>
                              {s.warrantStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleWarrant(s.id)}
                              className="text-xs font-semibold text-[#8B0000] hover:underline"
                            >
                              Toggle Warrant
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* AI Insight escalation card */}
              <div className="bg-[#FFF5F5] border border-dashed border-[#8B0000]/40 p-gutter rounded-xl shadow-xs">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-[#8B0000] text-white rounded-xl flex items-center justify-center shadow-3d-premium shrink-0">
                    <Sparkles size={18} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h5 className="font-bold text-xs font-mono text-[#8B0000] uppercase tracking-wider">AI Pattern Alert: High Activity Predicted</h5>
                    <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                      The AI found matching vehicle signals near the port. We suggest checking this case soon to ensure there are no issues.
                    </p>
                    
                    <div className="pt-4 flex gap-3 text-xs">
                      <button 
                        type="button"
                        onClick={() => {
                          setCases(prev => prev.map(c => c.id === selectedCase.id ? { ...c, status: 'Under Review' } : c));
                          alert("System Case Status updated to Under Review.");
                        }}
                        className="bg-emerald-700 text-white hover:bg-emerald-850 px-4 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <Check size={13} /> Confirm &amp; Commit
                      </button>
                      <button 
                        type="button"
                        onClick={() => alert("Insight dismissed.")}
                        className="bg-transparent border border-slate-300 text-slate-500 hover:bg-slate-150 px-4 py-1.5 rounded-lg font-semibold"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ==================== PAGE 2: EVIDENCE VAULT ==================== */}
          {activeTab === 'evidence' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <nav className="flex gap-2 text-slate-400 font-mono text-[9px] font-bold tracking-wider uppercase mb-1.5">
                    <span>VAULT LEDGER</span>
                    <span>/</span>
                    <span className="text-[#8B0000]">SECURE FILES</span>
                  </nav>
                  <h2 id="police-evidence-vault-heading" className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
                    Evidence Files - Secure Records
                  </h2>
                </div>

                <button 
                  type="button"
                  onClick={() => setShowAddEvidenceModal(true)}
                  className="bg-[#8B0000] text-white hover:bg-slate-850 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-3d-premium shrink-0 self-start md:self-end active:scale-95 transition-all"
                >
                  <Upload size={13} />
                  <span>Upload Digital Evidence</span>
                </button>
              </div>

              {/* Grid of All Evidence Items */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* File list filters */}
                <div className="lg:col-span-3 space-y-4">
                  <div className="card-3d-tactile-neutral p-5 space-y-4">
                    <h4 className="text-[10px] font-bold font-mono text-slate-400 tracking-wider uppercase">Filter Archives</h4>
                    
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold font-mono text-slate-400 uppercase">Target Case Filter:</p>
                      <select 
                        className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700 outline-none"
                        value={selectedCaseId}
                        onChange={e => setSelectedCaseId(e.target.value)}
                      >
                        {cases.map(c => (
                          <option key={c.id} value={c.id}>{c.id} - {c.title.split(':')[0]}</option>
                        ))}
                      </select>
                    </div>

                    <div className="border-t border-slate-100 pt-3 flex flex-wrap gap-1.5">
                      <span className="text-[8px] font-mono font-bold text-slate-400 block w-full uppercase">TYPES COMPLIED:</span>
                      {['Digital Media', 'Secure PDF', 'InsurTech Telemetry', 'Audio Recording'].map((t, i) => (
                        <span key={i} className="bg-slate-100 border border-slate-200 text-slate-500 font-mono text-[8px] px-1.5 py-0.5 rounded font-bold">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="card-3d-tactile p-5">
                    <h4 className="text-[10px] font-bold font-mono text-[#8B0000] uppercase flex items-center gap-1.5">
                      <ShieldCheck size={14} /> Cryptographic Seal
                    </h4>
                    <p className="text-[10.5px] text-slate-500 mt-1 leading-relaxed">
                      Every file has a secure digital seal. Any tampering will be flagged and logged automatically.
                    </p>
                  </div>
                </div>

                {/* Evidence vault results queue */}
                <div className="lg:col-span-9 space-y-4">
                  
                  {filteredEvidence.length === 0 ? (
                    <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-mono">
                      No matching records found. Use the filters or upload new logs.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredEvidence.map(item => (
                        <div key={item.id} className="card-3d-tactile-neutral p-5 hover:border-red-600/30 flex flex-col justify-between space-y-4 relative">
                          {selectedCaseId === item.caseId && (
                            <span className="absolute top-2.5 right-2.5 text-[8px] font-mono uppercase bg-red-50 text-[#8B0000] border border-red-200 px-2 py-0.5 rounded font-bold animate-pulse">
                              Active Dossier Focus
                            </span>
                          )}
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <span className="text-[9px] font-mono text-slate-400">{item.id}</span>
                              <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                {item.type}
                              </span>
                            </div>

                            <h3 className="text-xs font-black text-slate-900 leading-normal">{item.title}</h3>
                            <p className="text-[11px] text-slate-555 leading-relaxed italic">
                              "{item.notes}"
                            </p>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10.5px] font-mono text-slate-450">
                            <div className="space-y-0.5">
                              <span>Custodian: <strong>{item.custodian}</strong></span>
                              <span className="block text-[9.5px]">Ref: {item.caseId}</span>
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setPreviewEvidenceItem(item)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors"
                                title="Inspect Digital File Preview"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownload(item.id)}
                                disabled={downloadingId === item.id}
                                className="p-1.5 text-[#8B0000] hover:text-[#8B0000]/85 transition-colors"
                                title="Download File Payload"
                              >
                                {downloadingId === item.id ? (
                                  <RefreshCw size={13} className="animate-spin text-[#8B0000]" />
                                ) : (
                                  <Download size={14} />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>

            </div>
          )}

          {/* ==================== PAGE 3: SUSPECT PROFILES & TACTICAL TRACKER ==================== */}
          {activeTab === 'suspects' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <nav className="flex gap-2 text-slate-400 font-mono text-[9px] font-bold tracking-wider uppercase mb-1.5">
                    <span>FEDERAL TRACKER</span>
                    <span>/</span>
                    <span className="text-[#8B0000]">BULLETINS</span>
                  </nav>
                  <h2 id="police-watchlist-heading" className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
                    Suspect Bulletins &amp; Watchlist
                  </h2>
                </div>
              </div>

              {/* Flex Grid merging Suspects list with Device Scanner */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Area: Brief Suspect Watch card directory */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="card-3d-tactile-neutral p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Active Watchlist Dossiers</span>
                      <span className="text-[9px] font-mono text-[#8B0000] font-bold">TOTAL: {suspects.length} targets</span>
                    </div>

                    <div className="space-y-3">
                      {suspects.map(s => (
                        <div key={s.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 shadow-inner flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{s.name}</span>
                              <span className="text-[8px] font-mono font-bold bg-red-50 text-[#8B0000] border border-red-200 px-1.5 py-0.2 rounded">
                                DOB: {s.dob}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-550 font-medium">Class: {s.role}</p>
                            {s.vehicle !== 'None Registered' && (
                              <p className="text-[10.5px] text-[#8B0000] font-mono font-bold uppercase">PLATES: {s.vehicle}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[9.5px] font-mono font-bold uppercase border px-2.5 py-0.5 rounded-md ${
                              s.warrantStatus === 'Arrest Warrant' ? 'bg-red-50 text-[#8B0000] border-red-100' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {s.warrantStatus}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleToggleWarrant(s.id)}
                              className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-250 text-[10.5px] font-mono font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                            >
                              Toggle
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card-3d-tactile p-5 space-y-2">
                    <h4 className="text-xs font-black font-display text-slate-900">Add Suspect Prospect</h4>
                    <p className="text-[11px] text-slate-500">Add a new suspect to begin immediate tracking on vehicles or persons.</p>
                    
                    <form onSubmit={handleCreateSuspect} className="grid grid-cols-2 gap-3 text-xs pt-2">
                      <div className="space-y-1 col-span-2">
                        <label className="text-[9px] font-mono text-slate-400 block uppercase">Full Legal Name</label>
                        <input 
                          type="text"
                          required
                          placeholder="e.g. Victor Gerasimov"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none focus:bg-white"
                          value={newSusName}
                          onChange={e => setNewSusName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 block uppercase">DOB</label>
                        <input 
                          type="text"
                          placeholder="MM/DD/YYYY"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none focus:bg-white font-mono"
                          value={newSusDob}
                          onChange={e => setNewSusDob(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono text-slate-400 block uppercase">Group Role</label>
                        <input 
                          type="text"
                          placeholder="e.g. Transport Specialist"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 outline-none"
                          value={newSusRole}
                          onChange={e => setNewSusRole(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-[9px] font-mono text-slate-400 block uppercase">Vehicle Plate Details</label>
                        <input 
                          type="text"
                          placeholder="e.g. SLV AUDI - AG39-44F"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 font-mono"
                          value={newSusVehicle}
                          onChange={e => setNewSusVehicle(e.target.value)}
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full col-span-2 btn-3d-red py-2 rounded-lg font-semibold shadow hover:opacity-90 transition-all mt-1"
                      >
                        Publish Threat Dossier
                      </button>
                    </form>
                  </div>
                </div>

                {/* Right Area: HIGH QUALITY PORTABLE SQUAD FIELD LASER SCANNER SIMULATOR */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="card-3d-tactile-neutral p-5">
                    <span className="text-[9px] font-mono bg-red-50 text-[#8B0000] border border-red-100 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider block w-max">
                      SQUAD CAR SIMULATOR
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">Active Field Incident Laser Cam</h3>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                      Use this screen to test plate and VIN scans on patrol vehicles. Officers can run quick searches and log vehicle incidents.
                    </p>

                    <div className="mt-4 border border-slate-200 rounded-3xl bg-slate-950 p-2 overflow-hidden shadow-2xl relative">
                      {/* Simulates squad laser sweeps */}
                      <div className="absolute top-0 bottom-0 left-0 right-0 pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-10"></div>
                      <PoliceMobileSimulator onCaseCreated={handleSimulatorIncidentCreation} />
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ==================== PAGE 4: AI PATTERN ANALYSIS ==================== */}
          {activeTab === 'ai-analysis' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Intelligent dashboard title row consistent with prompt code */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <nav className="flex gap-2 text-slate-400 font-mono text-[9px] font-bold tracking-wider uppercase mb-1.5">
                    <span>COGNITIVE BRIDGE</span>
                    <span>/</span>
                    <span className="text-[#8B0000]">SCYLLA-V SCANS</span>
                  </nav>
                  
                  <div>
                    <h2 id="police-pattern-analysis-heading" className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
                      Intelligence Command Center - Pattern Analysis
                    </h2>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setRecommendations([
                        {
                          id: 'REC-01',
                          patternCode: 'PATTERN: VIN_CLONE_A12',
                          confidence: '94% CONFIDENCE',
                          title: 'Odometer Rollback Trend Detected in Southeast Region',
                          description: 'AI identified 14 vehicles of matching chassis series across 3 partner dealerships showing non-linear mileage report gaps. Highly correlated to Dealer ID: 9920 and overseas imports.',
                          notes: 'Requires officer confirmation to initiate a formal dossier registry.'
                        },
                        {
                          id: 'REC-02',
                          patternCode: 'PATTERN: DOC_FORGERY_X',
                          confidence: '81% CONFIDENCE',
                          title: 'Synthetic Identity Link: "Michael R." Network',
                          description: 'Multiple title clearance applications sharing a common digital signature hash and PO Box. Potentially linked to the Midwest Auto Theft distribution ring.',
                          notes: 'Requires human verification to link cases.'
                        }
                      ]);
                      alert("Algorithmic neural matrix re-scraped completely.");
                    }}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-250 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <RefreshCw size={13} />
                    <span>Re-sync AI Map</span>
                  </button>
                </div>
              </div>

              {/* Bento grid Map & CCTV Feed Area */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                
                {/* Global Pattern cluster SVG Map */}
                <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono text-slate-700 uppercase flex items-center gap-1.5">
                      <Map size={14} className="text-[#8B0000]" /> Global Pattern Cluster Map
                    </h4>
                    <span className="bg-red-100 text-red-655 text-[9px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      3 CRITICAL FRAUD SPOTS
                    </span>
                  </div>

                  <div className="h-[360px] relative bg-slate-900 border-b border-slate-250 overflow-hidden">
                    {/* Topography maps backdrop */}
                    <img 
                      alt="Chicago topographic area map" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-40 select-none pointer-events-none"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqTMRoBS4Y0TlP7c4nobRiZrwJ64OX9LF1_yBzqL5XGXdy3Ti7wIN8yhaJ2tMpb2KO5WOLnUmhh_Jp8HbypxPCphtZGutzYn25D-3j7dRZEfPEu2O4tvI3RsodCfVikT4QCkYKT48NH8jcqEA32WHf9TSIr_tK-VejU6ph0RV8cQVm6JEjLrD4E3W0SjyRU2RfzdEqXdujSwPy0cGDZFcAGP32jLSgvqC15iqd_ccG9nNPsq3hLwYd-C_jeLWJGTuxlXUXntSCl-ho" 
                    />

                    {/* Laser Scanner sweeps overlay */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-white text-[10.5px] font-mono leading-normal max-w-xs space-y-1">
                      <span className="text-blue-400 uppercase font-black tracking-widest text-[8px] block">Everett Port Coverage</span>
                      <p>DENSITY RATIO: 14 REGIONS SCANNED</p>
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden w-28">
                        <div className="bg-blue-500 h-full w-[70%]"></div>
                      </div>
                    </div>

                    {/* Pulse hotspot marker matching prompt */}
                    <div className="absolute top-1/3 left-1/4 group cursor-pointer">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="hidden group-hover:block absolute top-7 left-0 bg-black/80 backdrop-blur-sm border border-red-500/35 p-2 rounded text-[9.5px] font-mono text-white whitespace-nowrap">
                        CLUST-7 HOT SPOT: CHASSIS RIG CO-ORDINATES
                      </span>
                    </div>

                    <div className="absolute bottom-1/3 right-1/3 group cursor-pointer">
                      <div className="w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center border-2 border-white animate-ping">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 text-[10.5px] font-mono text-slate-500">
                    ℹ️ Pulsing coordinates highlight telemetry matches extracted automatically from the NMVTIS federal registry base.
                  </div>
                </div>

                {/* CCTV Liveness Feed matching provided images */}
                <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h4 className="text-xs font-bold font-mono text-slate-700 uppercase flex items-center gap-1.5">
                      <Radio size={14} className="text-red-655 animate-bounce" /> Liveness Guard CCTV
                    </h4>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>

                  <div className="p-4 flex-1 space-y-3.5 max-h-[350px] overflow-y-auto">
                    
                    {/* Feed 1 */}
                    <div className="flex gap-2.5 items-center p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="w-12 h-12 bg-slate-200 rounded overflow-hidden shrink-0 border border-slate-300">
                        <img 
                          alt="Surveillance White Sedan Front Profile" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxH43LD8W0cB4sdjs2MJLv5pnfn4gTluqAfBeFsjwrGL9CzWYkjRUjBT_5ppPOQoQJTbeUEL9jl7qaum4Ce4C-t6civIBeA2ErDCFEGsDAqSLtusDMQefInbMtZ4kWRuIPinGC2MClCt6OwpI8By6FOa32galqrf-4a2l5VEDk6Ui_WimN6SU3CMIVG-9qBKy_MeKCjHRrrDdCg193rBmc5gStiLVyTbkPB26YV_fgpOAwilqE16uZjBfTxDNdBgGBF1o0jgHHTe6n" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10.5px] font-mono font-bold text-slate-800 truncate">VIN MATCH: LK-4492-X</p>
                        <span className="text-[9px] text-slate-450 block uppercase font-mono">Site: Everett Depot X-44</span>
                      </div>
                      <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-mono font-black text-[9px] px-1.5 py-0.5 rounded">LIVE</span>
                    </div>

                    {/* Feed 2 */}
                    <div className="flex gap-2.5 items-center p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="w-12 h-12 bg-slate-200 rounded overflow-hidden shrink-0 border border-slate-300">
                        <img 
                          alt="Surveillance Document Scan Verification" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6jtW2wPuhEgXiYBVg9hLErmF1IrNjir6OyffJ8Bybjtimeql-h9raU9RTBGmHNrSOZWU5h-ZIbdwwKHvSqF_4eGqYsND91-zzgVAzoHSb_iRRhaY8yPZb9DSOZOd3i7DUcRHexYTF3ZsInpyomJSwuqAtElcM1SoCTKr9vZIlac0TM_0beuGF5ccxKKgMvg8-vCup6JSviK37TFBpUdrsr6W6GF0Q3g190Yj_MWrXSr13S1WghinKMPJSnXWLkyQygz2k4J-40V7H" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10.5px] font-mono font-bold text-slate-800 truncate">DOC AUTH: SUCCESS</p>
                        <span className="text-[9px] text-slate-450 block uppercase font-mono">ID: SEC-889-ALPHA</span>
                      </div>
                      <span className="text-slate-400 font-mono text-[9px] font-bold">2M AGO</span>
                    </div>

                    {/* Feed 3 */}
                    <div className="flex gap-2.5 items-center p-2.5 rounded-xl bg-red-50 border border-red-100">
                      <div className="w-12 h-12 bg-slate-200 rounded overflow-hidden shrink-0 border border-red-200">
                        <img 
                          alt="Surveillance Stamp Inconsistency Comparison" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPQPlztICpvShpwZlOeWnwdrV92ZgMkxyZVsaj_59w4iPPTZqL2YQJinrPEePWCY0M06sboPurfE4gk9OjkIiChUIUlT4znYHmKozptT6CZgkRzM8FCbabeQmSWZnfSnHJOfel68iTo_K7WRyItbPop5ke7CNoKRZ5US1dmbJCXQJdhis6J5C1NWo5biVP9IRmETDa4UtuxAEHMV_njpx4bldKJOYRAdk4TjxM9oM8snKNTaTcPsG35cKDVoxayoffQLFOVwVKJLDy" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10.5px] font-mono font-bold text-red-655 truncate">CLONE DETECTED</p>
                        <span className="text-[9px] text-red-450 block uppercase font-mono font-bold">Everett Terminal Sector 9</span>
                      </div>
                      <span className="bg-red-100 text-red-655 font-mono font-bold text-[9px] px-1.5 py-0.5 rounded animate-pulse">ALERT</span>
                    </div>

                  </div>
                </div>

              </div>

              {/* Dynamic AI Pattern Recommendations Cards exactly matching user visual layout */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-[#8B0000]" size={16} />
                  <h3 className="font-bold text-xs uppercase font-mono text-[#8B0000] tracking-widest">AI Pattern Recommendations</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  {recommendations.map(rec => (
                    <div key={rec.id} className="bg-red-50/50 border-2 border-dashed border-red-200 rounded-xl p-gutter flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="px-3 py-1 bg-[#8B0000] text-white text-[9.5px] font-mono font-bold uppercase rounded-md tracking-wider">
                            {rec.patternCode}
                          </span>
                          <span className="text-xs font-mono font-black text-[#8B0000]">
                            {rec.confidence}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-[#8B0000] font-sans">
                          {rec.title}
                        </h4>
                        <p className="text-[11px] text-slate-700 leading-relaxed">
                          {rec.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-3.5 border-t border-red-200 flex justify-between items-center text-xs">
                        <p className="text-[10px] text-slate-500 italic font-mono">
                          {rec.notes}
                        </p>
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => {
                              setRecommendations(prev => prev.filter(r => r.id !== rec.id));
                              alert("Recommendation dismissed.");
                            }}
                            className="px-3 py-1.5 text-slate-500 hover:text-[#8B0000] font-bold transition-colors cursor-pointer"
                          >
                            Dismiss
                          </button>
                          <button 
                            type="button"
                            onClick={() => promoteRecommendationToCase(rec)}
                            className="px-4 py-1.5 bg-[#8B0000] hover:bg-slate-800 text-white font-bold rounded-lg shadow-sm cursor-pointer"
                          >
                            Confirm &amp; Commit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {recommendations.length === 0 && (
                    <div className="col-span-2 text-center py-12 border border-dashed border-slate-200 bg-white rounded-xl text-slate-400 text-xs font-mono">
                      No pending analytics referrals. Unified threat matrix resolved.
                    </div>
                  )}
                </div>
              </div>

              {/* Active Investigative Queue Table consistent with prompt code */}
              <section className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-xs font-mono text-slate-700 uppercase flex items-center gap-1.5">
                    <Layers size={14} className="text-[#8B0000]" /> Active Investigative Queue
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#fcfdfe] border-b border-slate-200 text-[10px] font-mono text-slate-550 uppercase">
                      <tr>
                        <th className="px-6 py-3 font-bold">Priority</th>
                        <th className="px-6 py-3 font-bold">Case Reference ID</th>
                        <th className="px-6 py-3 font-bold">Subject / Organization Target</th>
                        <th className="px-6 py-3 font-bold">Anomaly Classification</th>
                        <th className="px-6 py-3 font-bold">Directing Agency Origin</th>
                        <th className="px-6 py-3 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {filteredCases.map(c => (
                        <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 font-mono text-[9px] font-bold rounded border ${
                              c.severity === 'High' 
                                ? 'bg-red-50 text-red-655 border-red-100 animate-pulse' 
                                : 'bg-slate-150 text-slate-500 border-slate-250'
                            }`}>
                              {c.severity.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono select-all font-bold text-slate-900">{c.id}</td>
                          <td className="px-6 py-4 font-bold text-[#00236f]">{c.suspectName}</td>
                          <td className="px-6 py-4 text-slate-500">{c.title.split(':')[0]}</td>
                          <td className="px-6 py-4 font-mono text-[10.5px] text-slate-450">{c.badgeId}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => { setSelectedCaseId(c.id); setActiveTab('cases'); }}
                              className="text-[#00236f] hover:underline font-extrabold text-[11px]"
                            >
                              Review &amp; Confirm
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

            </div>
          )}

          {/* ==================== PAGE 5: SYSTEM SETTINGS ==================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6 bg-white p-8 rounded-xl border border-slate-200 animate-in fade-in duration-200 max-w-3xl">
              <div className="border-b border-slate-200 pb-4">
                <h3 id="police-settings-heading" className="text-3xl font-bold tracking-tight text-slate-900 font-sans">
                  SECURE COMMAND PREFERENCES
                </h3>
              </div>

              <div className="space-y-6 text-xs text-slate-700 font-medium">
                
                {/* sync speed */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 block uppercase">DMV Registry Ledger Sync Rate</label>
                  <p className="text-[10.5px] text-slate-550 leading-relaxed max-w-xl pb-1">Specifies the automatic interval rate used to scrape title escrows across state records automatically.</p>
                  <div className="flex gap-2">
                    {['Continuous', '5m Intervals', 'Manual Audit Only'].map(rate => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setSyncRate(rate)}
                        className={`text-xs px-4 py-2 border rounded-xl font-bold transition-all ${
                          syncRate === rate ? 'bg-[#00236f] text-white border-[#00236f] shadow-xs' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        {rate}
                      </button>
                    ))}
                  </div>
                </div>

                {/* beacon speed */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-mono text-slate-400 block uppercase">Active Flasher Intensity</label>
                  <div className="flex gap-2">
                    {['60%', '95%', 'Retinal Stealth (Dim)'].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setBeaconIntensity(val)}
                        className={`text-xs px-4 py-2 border rounded-xl font-bold transition-all ${
                          beaconIntensity === val ? 'bg-[#00236f] text-white border-[#00236f]' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <h4 className="text-[10px] font-bold font-mono text-slate-400 uppercase">Cryptographic Keystore (TLS-256)</h4>
                  
                  <div className="p-4 bg-slate-50 border border-slate-205 rounded-xl text-[10.5px] font-mono text-slate-600 leading-normal space-y-1 bg-slate-100 shadow-inner">
                    <span className="text-slate-800 font-bold block pb-1">UPLINK HANDSHAKE SIGNATURES:</span>
                    <p>FEDERAL_KEY: 0x9920...AF11 - STRIKE READY</p>
                    <p>DMV_ROOT: UNIFIED_NMVTIS_GCM_SECURE - SYNCHRONIZED</p>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => alert("Keystore refreshed. Global security bridges verified.")}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-250 font-bold font-mono text-xs px-4 py-2 rounded-xl transition-all"
                  >
                    REFRESH KEYSTORE HOOP
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* ========================================================= */}
      {/* ==================== COMPLEX MODALS ===================== */}
      {/* ========================================================= */}

      {/* MODAL 1: UPDATE INVESTIGATION STATUS */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-xs font-mono text-[#00236f] uppercase">Update Case Status</h3>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs font-medium">
              <p className="text-slate-550 leading-relaxed">
                Approve status transition of case file <strong>{selectedCase.id}</strong> on the secure federal database registry.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {(['Open', 'Under Review', 'Resolved', 'Seized'] as const).map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setActiveCaseStatus(st)}
                    className={`p-3.5 border-2 rounded-xl flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                      activeCaseStatus === st
                        ? 'border-[#00236f] bg-[#EFF6FF] text-[#00236f]'
                        : 'border-slate-200 hover:border-slate-350 text-slate-500'
                    }`}
                  >
                    <span>{st}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="w-1/2 py-2.5 text-center text-slate-500 hover:bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  className="w-1/2 bg-[#00236f] text-white py-2.5 rounded-lg font-bold shadow hover:opacity-90 transition-all"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ESTABLISH NEW DOSSIER */}
      {showNewCaseModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-xs font-mono text-[#00236f] uppercase">Establish Secure Dossier File</h3>
              <button onClick={() => setShowNewCaseModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateCase} className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Case Title / Syndicate Nickname</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Operation Gold Siphon"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white text-slate-800"
                  value={newCaseTitle}
                  onChange={e => setNewCaseTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Primary Suspect Target</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Victor Gerasimov"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none"
                    value={newCaseSuspect}
                    onChange={e => setNewCaseSuspect(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Primary Target VIN</label>
                  <input 
                    type="text" 
                    required
                    maxLength={17}
                    placeholder="17-Digit Windshield code"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 font-mono text-slate-750 outline-none"
                    value={newCaseVin}
                    onChange={e => setNewCaseVin(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Alert Severity Rating</label>
                <div className="flex gap-2">
                  {(['High', 'Medium', 'Low'] as const).map(sev => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setNewCaseSeverity(sev)}
                      className={`px-4 py-2 border rounded-lg font-bold transition-all ${
                        newCaseSeverity === sev 
                          ? 'bg-red-50 text-red-655 border-red-200' 
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Dossier Narrative Briefing</label>
                <textarea 
                  rows={4}
                  placeholder="State the observed cloning patterns, duplicate registration attempts, or transaction anomalies..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:bg-white text-slate-800"
                  value={newCaseDescription}
                  onChange={e => setNewCaseDescription(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="w-1/2 py-2.5 text-slate-500 hover:bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#00236f] text-white py-2.5 rounded-lg font-bold shadow hover:opacity-90"
                >
                  Establish Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SECURE EVIDENCE UPLOADER */}
      {showAddEvidenceModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-xs font-mono text-[#00236f] uppercase">Vault Evidence Item</h3>
              <button onClick={() => setShowAddEvidenceModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddEvidence} className="p-6 space-y-4 text-xs font-semibold">
              <p className="text-slate-500 italic mb-2">
                Filing evidence for Dossier Focus: <strong>{selectedCase.id}</strong>
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Descriptor / Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Scraped dealer dashboard screenshot"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none"
                  value={newEvidenceTitle}
                  onChange={e => setNewEvidenceTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block uppercase">Evidence Format</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none cursor-pointer"
                    value={newEvidenceType}
                    onChange={e => setNewEvidenceType(e.target.value as any)}
                  >
                    <option value="Digital Media">Digital Media (📸)</option>
                    <option value="Secure PDF Document">Secure PDF (📄)</option>
                    <option value="InsurTech Telemetry Log">InsurTech Telemetry Log (📡)</option>
                    <option value="Customs Statement Paper">Customs Statement (🧾)</option>
                    <option value="Audio Tape Recording">Audio tape tap (📻)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block uppercase">Directing Officer</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-150 border border-slate-200 rounded-lg p-2 text-slate-500 font-mono"
                    value={newEvidenceCustodian}
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-1 font-sans">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Evidentiary Notes</label>
                <textarea 
                  rows={3}
                  placeholder="Identify where the digital footprint was captured, verified and secured..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:bg-white"
                  value={newEvidenceNotes}
                  onChange={e => setNewEvidenceNotes(e.target.value)}
                />
              </div>

              <UniversalSmartUpload
                photoKey="police_evidence"
                uploadedImageSrc={uploadedFile ? uploadedFile.dataUrl : null}
                onUploadSuccess={handleSmartEvidenceUpload}
                onClear={() => setUploadedFile(null)}
                label="Evidence File Lockbox"
                description="Scan or photograph evidence. Files synchronize live back to your terminal."
              />

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddEvidenceModal(false)}
                  className="w-1/2 py-2.5 text-slate-500 hover:bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#00236f] text-white py-2.5 rounded-lg font-bold shadow hover:opacity-90"
                >
                  Vault Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: PROSPECT SUSPECT REGISTRATION */}
      {showNewSuspectModal && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-xs font-mono text-[#00236f] uppercase">Add Suspect Prospect</h3>
              <button onClick={() => setShowNewSuspectModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleCreateSuspect} className="p-6 space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Target Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none"
                  value={newSusName}
                  onChange={e => setNewSusName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block uppercase">Date of Birth</label>
                  <input 
                    type="text" 
                    placeholder="MM/DD/YYYY"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-mono"
                    value={newSusDob}
                    onChange={e => setNewSusDob(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 block uppercase">Assign LEO Status</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none cursor-pointer"
                    value={newSusWarrant}
                    onChange={e => setNewSusWarrant(e.target.value as any)}
                  >
                    <option value="Arrest Warrant">Arrest Warrant (🔴)</option>
                    <option value="Under Surveillance">Under Surveillance (🟡)</option>
                    <option value="Cleared">Cleared (🟢)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Class Designation</label>
                <input 
                  type="text" 
                  placeholder="e.g. Syndicate Lead Recycler"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none"
                  value={newSusRole}
                  onChange={e => setNewSusRole(e.target.value)}
                />
              </div>

              <div className="space-y-1 font-mono">
                <label className="text-[10px] font-mono text-slate-400 uppercase">Vehicle Plates (Chassis link)</label>
                <input 
                  type="text" 
                  placeholder="e.g. BLK JEEP - TR-2980-X"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 outline-none focus:bg-white"
                  value={newSusVehicle}
                  onChange={e => setNewSusVehicle(e.target.value)}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewSuspectModal(false)}
                  className="w-1/2 py-2.5 text-slate-500 hover:bg-slate-100 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#00236f] text-white py-2.5 rounded-lg font-bold shadow hover:opacity-90 animate-duration-500"
                >
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: DIAGNOSTIC PREVIEW OF EVIDENCE ITEM */}
      {previewEvidenceItem && (
        <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-slate-900 text-slate-100 w-full max-w-xl rounded-3xl overflow-hidden border border-slate-850 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-850 bg-slate-950 flex justify-between items-center text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-red-400 font-mono tracking-widest font-black uppercase">RESTRICTED FORENSIC ARCHIVE // CUSTODY VIEW</span>
                <h3 className="font-bold text-sm text-white">{previewEvidenceItem.title}</h3>
              </div>
              <button 
                onClick={() => setPreviewEvidenceItem(null)}
                className="text-slate-400 hover:text-white font-extrabold text-sm"
              >
                ✕ Close
              </button>
            </div>

            {/* Diagnostic viewer stage */}
            <div className="p-8 space-y-6 flex-1 bg-slate-950 flex flex-col items-center">
              
              <div className="relative border-2 border-dashed border-red-950 bg-slate-900 p-6 rounded-2xl w-full flex flex-col items-center gap-4 shadow-inner">
                {/* Laser scan finder lines */}
                <div className="absolute inset-x-0 h-0.5 bg-red-600 top-2 animate-[scan_3s_infinite] shadow-md shadow-red-500/50"></div>
                <div className="absolute inset-x-2.5 bottom-0 h-0.5 bg-blue-500 animate-[scan_3s_infinite_1.5s] opacity-35"></div>

                {previewEvidenceItem.type === 'Digital Media' ? (
                  <div className="text-center space-y-3">
                    <div className="w-40 h-40 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center relative shadow-2xl">
                      {previewEvidenceItem.fileUrl ? (
                        <img 
                          alt={previewEvidenceItem.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-85"
                          src={previewEvidenceItem.fileUrl} 
                        />
                      ) : previewEvidenceItem.id === 'EVID-1021' ? (
                        <img 
                          alt="Forensic Stamps" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-85"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPQPlztICpvShpwZlOeWnwdrV92ZgMkxyZVsaj_59w4iPPTZqL2YQJinrPEePWCY0M06sboPurfE4gk9OjkIiChUIUlT4znYHmKozptT6CZgkRzM8FCbabeQmSWZnfSnHJOfel68iTo_K7WRyItbPop5ke7CNoKRZ5US1dmbJCXQJdhis6J5C1NWo5biVP9IRmETDa4UtuxAEHMV_njpx4bldKJOYRAdk4TjxM9oM8snKNTaTcPsG35cKDVoxayoffQLFOVwVKJLDy" 
                        />
                      ) : (
                        <ZoomIn size={44} className="text-red-500/80 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-red-500">DIGITAL_FORENSIS_ZOOM_LOCKED_250x</p>
                  </div>
                ) : previewEvidenceItem.type === 'Secure PDF Document' ? (
                  <div className="text-center space-y-3 font-mono">
                    <div className="w-36 h-40 bg-slate-950 rounded-lg flex flex-col justify-around p-4 border border-slate-800">
                      <span className="text-[28px] mx-auto block">📄</span>
                      <span className="text-[8.5px] text-slate-500 truncate block">{previewEvidenceItem.id}.pdf</span>
                      <div className="h-1 w-full bg-red-950 rounded bg-red-800 animate-pulse"></div>
                    </div>
                    <p className="text-[9.5px] text-slate-400">SECURE FILE ENCRYPT_KEY: APPROVED</p>
                  </div>
                ) : (
                  <div className="text-center space-y-4 font-mono w-full">
                    <div className="h-28 bg-slate-950 border border-slate-800 flex items-center justify-center gap-1.5 p-4 rounded-xl relative overflow-hidden">
                      {/* Waveform loops */}
                      <div className="h-10 w-2.5 bg-red-655 animate-[pulse_0.6s_infinite]"></div>
                      <div className="h-16 w-2.5 bg-red-500 animate-[pulse_0.4s_infinite_0.1s]"></div>
                      <div className="h-12 w-2.5 bg-red-400 animate-[pulse_0.8s_infinite_0.2s]"></div>
                      <div className="h-6 w-2.5 bg-red-300 animate-[pulse_0.5s_infinite_0.3s]"></div>
                      <div className="h-14 w-2.5 bg-blue-500 animate-[pulse_0.7s_infinite_0.4s]"></div>
                      <div className="h-20 w-2.5 bg-blue-400 animate-[pulse_0.3s_infinite_0.5s]"></div>
                      <div className="h-8 w-2.5 bg-sky-305 animate-[pulse_0.9s_infinite_0.6s]"></div>
                    </div>
                    <span className="text-[9px] uppercase font-black text-red-500">VOICE OVERRIDE MATCH DETECTED</span>
                  </div>
                )}
              </div>

              {/* Custody notes */}
              <div className="space-y-2 text-xs w-full">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>SEAL TIMESTAMP: {previewEvidenceItem.timestamp}</span>
                    <span>CUSTODIAN: {previewEvidenceItem.custodian}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-normal leading-relaxed italic">
                    "{previewEvidenceItem.notes}"
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 bg-slate-950 border-t border-slate-850 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono text-[10px]">Registry Weight: {previewEvidenceItem.fileSize || 'N/A'}</span>
              <button
                type="button"
                onClick={() => { handleDownload(previewEvidenceItem!.id); setPreviewEvidenceItem(null); }}
                className="bg-[#00236f] hover:bg-[#00236f]/90 text-white font-extrabold px-5 py-2.5 rounded-xl font-sans text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Download size={13} /> Export Ledger Payload
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
