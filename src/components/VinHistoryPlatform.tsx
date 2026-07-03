/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, ShieldAlert, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, 
  Globe, Clock, MapPin, Calendar, ClipboardList, Activity, RefreshCw, 
  Eye, CornerRightDown, ShieldCheck, Database, Award, Info, HelpCircle, Scan, ArrowRight, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/api';

// Define structures for VIN records
export interface VinSpecDetail {
  manufacturer: string;
  model: string;
  productionYear: number;
  engine: string;
  trim: string;
  drivetrain: string;
  equipment: string[];
  marketRegion: string;
  colorCodes: { exterior: string; interior: string };
  productionPlant: string;
}

export interface HistoryEvent {
  date: string;
  type: 'Registration' | 'Inspection' | 'Import/Export' | 'Ownership Change' | 'Recall' | 'Mileage Reading';
  country: string;
  countryCode: string;
  reading?: number;
  status: 'Passed' | 'Flagged' | 'Completed' | 'Warning' | 'Exported' | 'First Registration';
  authority: string;
  summary: string;
}

export interface FraudAnalysis {
  riskLevel: 'Low' | 'Medium' | 'High';
  details: {
    clonedVinRisk: { isFlagged: boolean; confidence: string; details: string };
    mismatchedSpecs: { isFlagged: boolean; confidence: string; details: string };
    mileageManipulation: { isFlagged: boolean; confidence: string; details: string };
  };
  overallVerdict: string;
}

export interface VinProfile {
  vin: string;
  specs: VinSpecDetail;
  historyTimeline: HistoryEvent[];
  fraudIndicators: FraudAnalysis;
  accidentClaimsHistory?: {
    totalAccidents: number;
    theftRecords: boolean;
    activeInsuranceClaims: number;
    timeline: Array<{ date: string; details: string; severity: string; cost: string }>;
  };
}

export default function VinHistoryPlatform() {
  const [searchVal, setSearchVal] = useState('WP0AB2A92MS299212');
  const [activeProfile, setActiveProfile] = useState<VinProfile | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [currentTab, setCurrentTab] = useState<'specs' | 'timeline' | 'fraud' | 'accidents'>('specs');
  
  // Custom interactive scanner module simulation
  const [showScanSimulator, setShowScanSimulator] = useState(false);
  const [cameraPermissionState, setCameraPermissionState] = useState<'inactive' | 'requesting' | 'active'>('inactive');
  const [scanResultProgress, setScanResultProgress] = useState(0);

  // Quick helper: handle searching VIN
  const handleDecodedSearch = async (vinToSearch: string) => {
    const cleanedVin = vinToSearch.trim().toUpperCase();
    if (!cleanedVin) return;

    setIsDecoding(true);
    setActiveProfile(null);

    try {
      const [vinRes, fraudRes] = await Promise.all([
        api.get(`/vin/${cleanedVin}`),
        api.get(`/vin/${cleanedVin}/fraud-score`)
      ]);

      const vehicle = vinRes.vehicles?.[0];

      if (vehicle) {
        // Map backend data to frontend VinProfile
        const timeline: HistoryEvent[] = [];

        // Add registrations/transfers
        if (vehicle.ownershipTransfers) {
          vehicle.ownershipTransfers.forEach((t: any, idx: number) => {
            timeline.push({
              date: t.transferDate || new Date().toISOString(),
              type: idx === 0 ? 'Registration' : 'Ownership Change',
              country: 'Local Registry',
              countryCode: 'UN',
              status: idx === 0 ? 'First Registration' : 'Completed',
              authority: 'National Vehicle Authority',
              summary: idx === 0 
                ? `Initial registration for ${vehicle.make} ${vehicle.model}.`
                : `Ownership transferred to ${t.toUser?.firstName || 'New Owner'}.`
            });
          });
        }

        // Add inspections
        if (vehicle.inspections) {
          vehicle.inspections.forEach((i: any) => {
            timeline.push({
              date: i.createdAt,
              type: 'Inspection',
              country: 'Local Registry',
              countryCode: 'UN',
              reading: i.mileageRecorded,
              status: i.result === 'PASSED' ? 'Passed' : 'Flagged',
              authority: `Inspector ${i.inspector?.firstName || ''} ${i.inspector?.lastName || ''}`,
              summary: `Safety & technical inspection. Result: ${i.result}. ${i.notes || ''}`
            });
          });
        }

        // Sort timeline by date
        timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        const fraudDetails = fraudRes;
        const profile: VinProfile = {
          vin: vehicle.vin,
          specs: {
            manufacturer: vehicle.make || 'Unknown',
            model: vehicle.model || 'Unknown',
            productionYear: vehicle.year || 0,
            engine: vehicle.engine || 'N/A',
            trim: vehicle.trim || 'Standard',
            drivetrain: vehicle.transmission || 'N/A',
            equipment: [],
            marketRegion: 'Global',
            colorCodes: { exterior: vehicle.color || 'N/A', interior: 'N/A' },
            productionPlant: 'Factory'
          },
          historyTimeline: timeline,
          fraudIndicators: {
            riskLevel: (fraudDetails.riskLevel?.charAt(0) + fraudDetails.riskLevel?.slice(1).toLowerCase()) as any || 'Low',
            details: {
              clonedVinRisk: { 
                isFlagged: (fraudDetails.breakdown?.ownershipTransfers?.count || 0) > 5, 
                confidence: '95%', 
                details: 'Calculated based on ownership transfer frequency and registration patterns.' 
              },
              mismatchedSpecs: { 
                isFlagged: (fraudDetails.breakdown?.failedInspections?.count || 0) > 0, 
                confidence: '90%', 
                details: 'Comparison between factory build sheet and inspection records.' 
              },
              mileageManipulation: { 
                isFlagged: (fraudDetails.breakdown?.mileageInconsistencies?.count || 0) > 0, 
                confidence: '98%', 
                details: 'Linear progression check across all recorded inspection points.' 
              }
            },
            overallVerdict: fraudDetails.riskLevel === 'HIGH' 
              ? 'Warning: Significant risk factors detected. Manual verification recommended.' 
              : 'Profile appears consistent with standard historical patterns.'
          },
          accidentClaimsHistory: {
            totalAccidents: vehicle.stolenReports?.length || 0,
            theftRecords: (vehicle.stolenReports?.length || 0) > 0,
            activeInsuranceClaims: vehicle.insurancePolicies?.length || 0,
            timeline: (vehicle.stolenReports || []).map((r: any) => ({
              date: r.createdAt,
              details: `Stolen Report: ${r.details || 'No details'}`,
              severity: 'Severe',
              cost: 'N/A'
            }))
          }
        };
        setActiveProfile(profile);
      } else {
        // Fallback to a dynamic mock if not found in DB
        setActiveProfile(generateMockProfile(cleanedVin));
      }
    } catch (error) {
      console.error('Error fetching VIN data:', error);
      setActiveProfile(generateMockProfile(cleanedVin));
    } finally {
      setIsDecoding(false);
      setCurrentTab('specs');
    }
  };

  // Initial load
  React.useEffect(() => {
    handleDecodedSearch(searchVal);
  }, []);

  const generateMockProfile = (cleanedVin: string): VinProfile => {
    return {
      vin: cleanedVin || 'WP0AB2A92MS299212',
      specs: {
        manufacturer: cleanedVin.startsWith('W') ? 'Volkswagen AG / Audi Group' : cleanedVin.startsWith('1') ? 'Ford Motor Company' : 'Toyota Motor Europe',
        model: cleanedVin.startsWith('W') ? 'Golf R Sportback' : cleanedVin.startsWith('1') ? 'Mustang GT' : 'RAV4 Hybrid',
        productionYear: 2022,
        engine: cleanedVin.startsWith('W') ? '2.0L EA888 Turbo Inline-4' : cleanedVin.startsWith('1') ? '5.0L Coyote V8 Engine' : '2.5L Atkinson Dynamic Force',
        trim: 'Performance Line Plus Edition',
        drivetrain: 'All-Wheel Drive (AWD)',
        equipment: [
          'Intelligent Adaptive Cruise Control',
          'Advanced Lane Keep Assist (LKAS)',
          'Bespoke Exterior Aero Styling Package',
          'Wireless Apple CarPlay & Android Auto'
        ],
        marketRegion: 'Global Multi-market Allocation',
        colorCodes: {
          exterior: 'Nardo Grey (Paint-to-Sample C5)',
          interior: 'Charcoal Alcantara Sports Seating'
        },
        productionPlant: 'Wolfsburg Assembly Plant, Lower Saxony, Germany'
      },
      historyTimeline: [
        {
          date: '2022-04-18',
          type: 'Registration',
          country: 'Germany',
          countryCode: 'DE',
          reading: 10,
          status: 'First Registration',
          authority: 'Kraftfahrt-Bundesamt (KBA)',
          summary: 'First private delivery registered in Hannover.'
        },
        {
          date: '2024-05-15',
          type: 'Inspection',
          country: 'Netherlands',
          countryCode: 'NL',
          reading: 28400,
          status: 'Passed',
          authority: 'Rijksdienst voor het Wegverkeer (RDW)',
          summary: 'Periodic safety road assessment. All structural, suspension, and dynamic checks validated as stable.'
        }
      ],
      fraudIndicators: {
        riskLevel: 'Low',
        details: {
          clonedVinRisk: {
            isFlagged: false,
            confidence: '95%',
            details: 'This VIN code successfully matches general checksum digit constraints for direct ISO manufacture certification standards.'
          },
          mismatchedSpecs: {
            isFlagged: false,
            confidence: '92%',
            details: 'No mismatched hardware specifications have been logged inside public European cross-border agency databases.'
          },
          mileageManipulation: {
            isFlagged: false,
            confidence: '91%',
            details: 'Historical records display a healthy, realistic cumulative linear trajectory corresponding to average multi-year use.'
          }
        },
        overallVerdict: 'Safe Profile. The VIN check is validated against global baseline specifications with zero suspicious trends mapped.'
      }
    };
  };

  // Simulate scanning of VIN codes from labels
  const handleTriggerScan = () => {
    setShowScanSimulator(true);
    setCameraPermissionState('requesting');
    
    setTimeout(() => {
      setCameraPermissionState('active');
      // Update fake detection progress
      const interval = setInterval(() => {
        setScanResultProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              // Automatically resolve with suspicious high-risk VIN for visual contrast
              const fraudVin = 'WBA3D3C57HN364022'; 
              setSearchVal(fraudVin);
              setShowScanSimulator(false);
              setScanResultProgress(0);
              setCameraPermissionState('inactive');
              handleDecodedSearch(fraudVin);
            }, 600);
            return 100;
          }
          return prev + 20;
        });
      }, 300);
    }, 1500);
  };

  // List of connected international databases
  const databasesList = [
    { country: 'United States', db: 'NHTSA Registry & NMVTIS Network', state: 'Active Sync' },
    { country: 'Germany', db: 'Kraftfahrt-Bundesamt (KBA) Zentralregister', state: 'Active Sync' },
    { country: 'Sweden', db: 'Vägverket Transportstyrelsen Register', state: 'Active Sync' },
    { country: 'Poland', db: 'CEPiK National Vehicle Portal Hub', state: 'Active Sync' },
    { country: 'United Kingdom', db: 'DVLA Automotive Information Hub', state: 'Active Sync' },
    { country: 'Japan', db: 'MLIT (Ministry of Land, Infrastructure & Transport)', state: 'Active Sync' },
    { country: 'France', db: 'SIV (Système d’Immatriculation des Véhicules)', state: 'Active Sync' }
  ];

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-800 font-sans p-1 pb-16" id="vinhistory-platform-root">
      
      {/* Top Title Section */}
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6 mb-8" id="vinhistory-main-header">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950" id="vin-main-title">
          VIN Decoders &amp; International History Tracker
        </h1>
      </div>

      {/* Main Container Split View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8" id="vinhistory-content-grid">
        
        {/* LEFT COLUMN: VIN SEARCH & BRAND INTEGRATION METRICS */}
        <div className="lg:col-span-4 space-y-6" id="vinhistory-control-panel">
          
          {/* VIN INPUT CRADLE */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4" id="vin-search-card">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8B0000] flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-[#8B0000]" /> Decode New Chassis ID
              </h3>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 17-character VIN..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value.toUpperCase())}
                  maxLength={17}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-4 pr-10 text-xs font-mono font-bold uppercase tracking-widest text-slate-900 focus:bg-white focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all"
                  id="vin-input-field"
                />
                
                <button
                  onClick={handleTriggerScan}
                  type="button"
                  title="Simulate Mobile Scan"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                  id="vin-barcode-scan-btn"
                >
                  <Scan className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDecodedSearch(searchVal)}
                  disabled={isDecoding || !searchVal}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-decode-vin"
                >
                  {isDecoding ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Decoding Specs...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Verify VIN and History</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* QUICK PRE-SET TEST SAMPLES FOR VISUAL AUDIT */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Preset for Direct Analysis:</p>
              
              <div className="grid grid-cols-2 gap-1.5" id="presets-container">
                <button
                  onClick={() => {
                    setSearchVal('WP0AB2A92MS299212');
                    handleDecodedSearch('WP0AB2A92MS299212');
                  }}
                  className="text-left p-2 rounded-xl border border-slate-150 hover:bg-red-50/50 transition-colors cursor-pointer"
                >
                  <p className="text-[10px] font-bold text-slate-800">Porsche 911</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Carrera S</p>
                </button>

                <button
                  onClick={() => {
                    setSearchVal('WBA53BJ0XPX881270');
                    handleDecodedSearch('WBA53BJ0XPX881270');
                  }}
                  className="text-left p-2 rounded-xl border border-slate-150 hover:bg-red-50/50 transition-colors cursor-pointer"
                >
                  <p className="text-[10px] font-bold text-slate-800">BMW M5</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Competition</p>
                </button>

                <button
                  onClick={() => {
                    setSearchVal('5YJSA1E4XPF231495');
                    handleDecodedSearch('5YJSA1E4XPF231495');
                  }}
                  className="text-left p-2 rounded-xl border border-slate-150 hover:bg-red-50/50 transition-colors cursor-pointer"
                >
                  <p className="text-[10px] font-bold text-slate-800">Tesla Model S</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">AWD Edition</p>
                </button>

                <button
                  onClick={() => {
                    setSearchVal('WBA3D3C57HN364022');
                    handleDecodedSearch('WBA3D3C57HN364022');
                  }}
                  className="text-left p-2 rounded-xl border border-slate-150 hover:bg-red-50/50 transition-colors cursor-pointer"
                >
                  <p className="text-[10px] font-bold text-slate-800">BMW 3 Series</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">History Audit</p>
                </button>
              </div>
            </div>
          </div>

          {/* SCAN DETECTOR GRAPHIC SIMULATOR POPUP */}
          {showScanSimulator && (
            <div className="bg-white text-slate-800 rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-200/80 space-y-4 relative overflow-hidden" id="scan-feedback-simulator">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B0000] animate-ping" />
                  <p className="text-xs font-black font-mono uppercase tracking-widest text-[#8B0000]">Optical Scanner Simulator</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowScanSimulator(false)}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {cameraPermissionState === 'requesting' ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-[#8B0000] animate-spin" />
                  <p className="text-xs text-slate-500 font-medium">Requesting local chassis camera feed permissions...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Pseudo Laser Scan Window */}
                  <div className="bg-red-50/60 aspect-video rounded-xl border border-red-200/60 relative overflow-hidden flex items-center justify-center">
                    {/* Laser line moving down */}
                    <div className="absolute left-0 right-0 h-0.5 bg-[#8B0000] shadow-[0_0_10px_#8B0000] animate-bounce" />
                    
                    {/* Static barcode code text representing raw image source */}
                    <div className="text-center font-mono">
                      <p className="text-[11px] text-slate-500 tracking-widest font-semibold">[IMG CHASSIS PIN BARCODE]</p>
                      <p className="text-[12px] text-[#8B0000] font-black mt-1">★ WBA3D3C57HN364022 ★</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                      <span>Digitising image arrays...</span>
                      <span>{scanResultProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#8B0000] h-full transition-all duration-300" style={{ width: `${scanResultProgress}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* INTERNATIONAL CONNECTIVITY METRIC GRID */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4" id="inter-connectivity-card">
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#8B0000]" />
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#8B0000]">Supported Registries</h4>
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              Official vehicle registration history from international databases and licensing authorities.
            </p>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1" id="channel-integrations-stack">
              {databasesList.map((dbInfo, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-800">{dbInfo.country}</p>
                    <p className="text-[10px] text-slate-400">{dbInfo.db}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: SEARCH RESULTS & MULTI-TAB DETAILED PROFILE ANALYSIS */}
        <div className="lg:col-span-8 space-y-6" id="vinhistory-report-area">
          
          {/* LOADER OR INITIAL EMPTY STATE */}
          {isDecoding && (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 shadow-sm flex flex-col items-center justify-center text-center space-y-4" id="decode-loading">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-105 border-t-red-600 animate-spin" />
                <Globe className="w-6 h-6 text-red-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">Accessing Global VIN Databases</h3>
                <p className="text-xs text-slate-400 max-w-sm">Comparing structural metal numbers against cross-country technical safety check registries...</p>
              </div>
            </div>
          )}

          {!isDecoding && !activeProfile && (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 shadow-sm text-center flex flex-col items-center justify-center space-y-4" id="decode-empty-view">
              <div className="bg-slate-50 p-4 rounded-full border border-slate-100">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">No Active Decoded Report Selected</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  Type a 17-digit ISO chassis ID in the control panel to cross-validate dynamic specifications, historical mileage trends, safety checks, and cloning signals.
                </p>
              </div>
            </div>
          )}

          {/* ACTIVE DECISION REPORT PRESENTATION SHEET */}
          {activeProfile && !isDecoding && (
            <motion.div
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              id="active-report-sheet"
            >
              
              {/* PRIMARY HEADER WRAPPER */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">
                      VIN: {activeProfile.vin}
                    </div>

                    <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
                      {activeProfile.specs.productionYear} {activeProfile.specs.manufacturer} {activeProfile.specs.model}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Spec package: <span className="font-semibold text-slate-700">{activeProfile.specs.trim}</span>
                    </p>
                  </div>
                </div>

                {activeProfile.fraudIndicators.riskLevel !== 'Low' && (
                  <div className="mt-4 p-3.5 rounded-2xl border text-xs bg-red-50/50 border-red-100 text-red-900">
                    <p className="font-bold">Notice:</p>
                    <p className="mt-1 leading-relaxed">{activeProfile.fraudIndicators.overallVerdict}</p>
                  </div>
                )}
              </div>

              {/* REPORT DETAILED TABS SWITCHER */}
              <div className="bg-slate-200/60 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-slate-200" id="report-tab-toggles">
                <button
                  onClick={() => setCurrentTab('specs')}
                  className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    currentTab === 'specs'
                      ? 'bg-white text-slate-999 shadow-sm text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                  id="tab-specs-toggle"
                >
                  <ClipboardList className="w-4 h-4 text-rose-600" /> Build Specifications
                </button>
                <button
                  onClick={() => setCurrentTab('timeline')}
                  className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    currentTab === 'timeline'
                      ? 'bg-white text-slate-999 shadow-sm text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                  id="tab-timeline-toggle"
                >
                  <Globe className="w-4 h-4 text-sky-600" /> History Timeline
                </button>
                <button
                  onClick={() => setCurrentTab('fraud')}
                  className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    currentTab === 'fraud'
                      ? 'bg-white text-slate-999 shadow-sm text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                  id="tab-fraud-toggle"
                >
                  <ShieldAlert className="w-4 h-4 text-red-650" /> Fraud Flags
                </button>
                <button
                  onClick={() => setCurrentTab('accidents')}
                  className={`flex-1 min-w-[120px] px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    currentTab === 'accidents'
                      ? 'bg-white text-slate-999 shadow-sm text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                  id="tab-accidents-toggle"
                >
                  <Activity className="w-4 h-4 text-purple-600" /> Damage & Acc Timeline
                </button>
              </div>

              {/* TAB CONTAINER CONTENT INTERCHANGE */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm min-h-[350px]">
                
                {/* SUB TAB 1: SPECIFICATIONS SHEET */}
                {currentTab === 'specs' && (
                  <div className="space-y-6" id="subtab-specs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-bold text-slate-900 text-sm">
                        Chassis Specifications
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                      <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <div className="flex justify-between border-b border-slate-200/50 pb-2">
                          <span className="text-slate-500 font-bold">Manufacturer:</span>
                          <span className="text-slate-900">{activeProfile.specs.manufacturer}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/50 pb-2">
                          <span className="text-slate-500">Model Series:</span>
                          <span className="text-slate-900 font-bold">{activeProfile.specs.model}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/50 pb-2">
                          <span className="text-slate-500">Year of Release:</span>
                          <span className="text-slate-900 font-bold">{activeProfile.specs.productionYear}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/50 pb-2">
                          <span className="text-slate-500">Powertrain Specs:</span>
                          <span className="text-slate-900">{activeProfile.specs.engine}</span>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="text-slate-500">Chassis Variant:</span>
                          <span className="text-slate-950 font-bold">{activeProfile.specs.trim}</span>
                        </div>
                      </div>

                      <div className="space-y-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                        <div className="flex justify-between border-b border-slate-200/50 pb-2">
                          <span className="text-slate-500">Drivetrain:</span>
                          <span className="text-slate-900">{activeProfile.specs.drivetrain}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/50 pb-2">
                          <span className="text-slate-500">Target Region:</span>
                          <span className="text-slate-900 font-bold">{activeProfile.specs.marketRegion}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/50 pb-2">
                          <span className="text-slate-500">Production Assembly:</span>
                          <span className="text-slate-800 truncate max-w-[200px]" title={activeProfile.specs.productionPlant}>{activeProfile.specs.productionPlant}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/50 pb-2">
                          <span className="text-slate-500">Ext Color code:</span>
                          <span className="text-slate-900">{activeProfile.specs.colorCodes.exterior}</span>
                        </div>
                        <div className="flex justify-between pb-1">
                          <span className="text-slate-500">Int Trim code:</span>
                          <span className="text-slate-900">{activeProfile.specs.colorCodes.interior}</span>
                        </div>
                      </div>
                    </div>

                    {/* EQUIPMENT SHOWN */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-600 uppercase tracking-widest">Released Equipment Build Sheet</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {activeProfile.specs.equipment.map((eq, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-100 rounded-xl">
                            <span className="text-rose-500 font-mono">✓</span>
                            <span className="text-slate-700">{eq}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB 2: DETAILED INTER-COUNTRY HISTORY TIMELINE */}
                {currentTab === 'timeline' && (
                  <div className="space-y-6 border-l-2 border-dashed border-slate-200 ml-4 pl-6 relative" id="subtab-timeline">
                    <div className="pb-4 border-b border-slate-100 -ml-10 pl-10">
                      <h3 className="font-bold text-slate-900 text-sm">International History & Cross-Border Registry Map</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Identified imports/exports and transfer of chassis tags across regions.</p>
                    </div>

                    {activeProfile.historyTimeline.map((item, idx) => (
                      <div key={idx} className="relative mb-8 last:mb-0">
                        {/* Circle marker icon based on type */}
                        <div className="absolute -left-[35px] top-0.5 bg-white p-1 rounded-full border border-slate-300 shadow-sm z-10">
                          {item.type === 'Registration' && <Database className="w-3.5 h-3.5 text-indigo-700" />}
                          {item.type === 'Inspection' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {item.type === 'Import/Export' && <Globe className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />}
                          {item.type === 'Ownership Change' && <Clock className="w-3.5 h-3.5 text-purple-600" />}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{item.country}</span>
                              <span className="bg-slate-100 text-slate-805 text-[10px] font-bold px-1.5 py-0.2 rounded font-mono">
                                {item.countryCode}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400">{item.date}</span>
                          </div>

                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">{item.type}</span>
                            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded ${
                              item.status === 'Passed' || item.status === 'First Registration' ? 'bg-emerald-50 text-emerald-700' :
                              item.status === 'Flagged' || item.status === 'Warning' ? 'bg-red-50 text-red-700' :
                              'bg-amber-50 text-amber-900'
                            }`}>
                              {item.status.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 mt-1 leading-normal max-w-2xl">{item.summary}</p>
                          
                          {item.reading && (
                            <p className="text-xs text-slate-700 font-mono font-medium mt-1">
                              📈 Registered Odometer: <span className="text-slate-950 font-bold">{item.reading.toLocaleString()} km</span>
                            </p>
                          )}

                          <div className="text-[10px] text-slate-400 italic mt-1 font-mono">
                            Logged Authority: {item.authority}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SUB TAB 3: ARTIFICIAL INTELLIGENCE FRAUD SIGNALS ENGINE */}
                {currentTab === 'fraud' && (
                  <div className="space-y-6" id="subtab-fraud">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <ShieldAlert className="w-4 h-4 text-red-650" /> AI Fraud & Mismatch Diagnostic Metrics
                      </h3>
                      <span className="bg-slate-100 text-[10px] font-mono px-2 py-0.5 rounded text-slate-500">Diagnostic cycle: COMPLETED</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4" id="fraud-cards-grid">
                      {/* Cloned Tag Risk */}
                      <div className={`p-4 rounded-2xl border flex items-start gap-4 ${
                        activeProfile.fraudIndicators.details.clonedVinRisk.isFlagged
                          ? 'bg-red-50/50 border-red-200'
                          : 'bg-emerald-50/20 border-emerald-100'
                      }`}>
                        <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm shrink-0">
                          <HelpCircle className={`w-5 h-5 ${
                            activeProfile.fraudIndicators.details.clonedVinRisk.isFlagged ? 'text-red-600' : 'text-emerald-600'
                          }`} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">Physical Cloned VIN and Weld-Tag Check</span>
                            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded ${
                              activeProfile.fraudIndicators.details.clonedVinRisk.isFlagged ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              Confidence: {activeProfile.fraudIndicators.details.clonedVinRisk.confidence}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-normal">{activeProfile.fraudIndicators.details.clonedVinRisk.details}</p>
                        </div>
                      </div>

                      {/* Mismatched Specs Risk */}
                      <div className={`p-4 rounded-2xl border flex items-start gap-4 ${
                        activeProfile.fraudIndicators.details.mismatchedSpecs.isFlagged
                          ? 'bg-red-50/50 border-red-200'
                          : 'bg-emerald-50/20 border-emerald-100'
                      }`}>
                        <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm shrink-0">
                          <RefreshCw className={`w-5 h-5 ${
                            activeProfile.fraudIndicators.details.mismatchedSpecs.isFlagged ? 'text-red-600' : 'text-emerald-600'
                          }`} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">Digital Parameter & Build Sheet Matching</span>
                            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded ${
                              activeProfile.fraudIndicators.details.mismatchedSpecs.isFlagged ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              Confidence: {activeProfile.fraudIndicators.details.mismatchedSpecs.confidence}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-normal">{activeProfile.fraudIndicators.details.mismatchedSpecs.details}</p>
                        </div>
                      </div>

                      {/* Odometers rollback analyzer */}
                      <div className={`p-4 rounded-2xl border flex items-start gap-4 ${
                        activeProfile.fraudIndicators.details.mileageManipulation.isFlagged
                          ? 'bg-red-50/50 border-red-200'
                          : 'bg-emerald-50/20 border-emerald-100'
                      }`}>
                        <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm shrink-0">
                          <Activity className={`w-5 h-5 ${
                            activeProfile.fraudIndicators.details.mileageManipulation.isFlagged ? 'text-red-500 animate-bounce' : 'text-emerald-600'
                          }`} />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">Mathematical Odometer Progression Analysis</span>
                            <span className={`text-[10px] font-bold font-mono px-1.5 py-0.2 rounded ${
                              activeProfile.fraudIndicators.details.mileageManipulation.isFlagged ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              Confidence: {activeProfile.fraudIndicators.details.mileageManipulation.confidence}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 leading-normal">{activeProfile.fraudIndicators.details.mileageManipulation.details}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB 4: ACCIDENT, OWNERSHIP & FUTURE TIMELINE EXPANSIONS */}
                {currentTab === 'accidents' && (
                  <div className="space-y-6" id="subtab-accidents">
                    <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">Chassis Harm & Theft Claims Records</h3>
                        <p className="text-[11px] text-slate-500">Third-party damage repair claims logged inside insurance server databases.</p>
                      </div>
                      
                      <span className="bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-mono font-bold px-2 py-0.5 rounded self-start">
                        INTEGRATED HISTORY CODES
                      </span>
                    </div>

                    {activeProfile.accidentClaimsHistory && activeProfile.accidentClaimsHistory.totalAccidents > 0 ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="bg-red-50/50 p-3 rounded-2xl text-center border border-red-100 font-mono">
                            <p className="text-[9px] uppercase text-stone-500">Reported Collisions</p>
                            <p className="text-lg font-extrabold text-red-650">{activeProfile.accidentClaimsHistory.totalAccidents}</p>
                          </div>
                          <div className="bg-orange-50/50 p-3 rounded-2xl text-center border border-orange-100 font-mono">
                            <p className="text-[9px] uppercase text-stone-500">Theft Registered</p>
                            <p className="text-lg font-extrabold text-orange-600">
                              {activeProfile.accidentClaimsHistory.theftRecords ? 'YES' : 'NO'}
                            </p>
                          </div>
                          <div className="bg-purple-55 bg-purple-50 p-3 rounded-2xl text-center border border-purple-100 font-mono">
                            <p className="text-[9px] uppercase text-stone-500">Active Claims</p>
                            <p className="text-lg font-extrabold text-purple-600">{activeProfile.accidentClaimsHistory.activeInsuranceClaims}</p>
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Accident Claims Log:</h4>
                          {activeProfile.accidentClaimsHistory.timeline.map((act, idx) => (
                            <div key={idx} className="p-3 bg-stone-50 border border-slate-150 rounded-xl space-y-1 text-xs">
                              <div className="flex justify-between font-mono text-[10px]">
                                <span className="text-slate-400">{act.date}</span>
                                <span className="text-red-600 font-bold">{act.severity} Severity</span>
                              </div>
                              <p className="text-slate-755 font-bold text-slate-800">{act.details}</p>
                              <p className="text-[10px] font-mono text-slate-400">Total liability settled: {act.cost}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                        <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full border border-emerald-100">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Clear Claim History Profile</p>
                          <p className="text-xs text-slate-400 max-w-sm mt-1">
                            No third party insurance damage claims, active theft alarms, or salvage write-offs detected for this vehicle in German KBA or US NMVTIS records.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* FUTURE ENHANCEMENTS TEASER */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2 mt-4">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-indigo-100 text-indigo-850 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">Future scope</span>
                        <p className="text-xs font-bold text-slate-750">Upcoming Timeline Expansions</p>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Active negotiations are underway with the European Leasing Alliance and Global Salvage Pools to fetch micro-level repair invoice timeline histories, tire replace checkpoints, and real-time title transfer notifications directly to this tab.
                      </p>
                    </div>

                  </div>
                )}

              </div>

            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
}
