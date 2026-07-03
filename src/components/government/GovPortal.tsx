import React, { useState } from 'react';
import { 
  Landmark, Info, Shield, Check, Smartphone, Layers, ArrowRight 
} from 'lucide-react';
import GovernmentDashboard from './GovernmentDashboard';
import InspectorMobileSimulator from './InspectorMobileSimulator';

export default function GovPortal() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulator'>('dashboard');
  const [flasherMode, setFlasherMode] = useState<'strobe' | 'stealth' | 'solid'>('stealth');
  const [systemTime, setSystemTime] = useState(new Date().toUTCString());

  // Keep digital UTC clock synced
  React.useEffect(() => {
    const interval = setInterval(() => {
      setSystemTime(new Date().toUTCString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#F5F5F7] text-[#1D1D1F] font-sans min-h-screen rounded-[28px] overflow-hidden border border-zinc-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.08)] animate-in fade-in duration-500 relative" id="gov-portal-root">
      
      {/* Apple Hardware Status Light indicator */}
      <div className="absolute top-2.5 right-6 flex items-center gap-1.5 z-40">
        <span className="text-[9px] font-mono tracking-wider text-zinc-400 font-bold uppercase select-none">PORTAL HARDWARE</span>
        <span className={`h-2 w-2 rounded-full transition-all duration-300 ${
          flasherMode === 'strobe' 
            ? 'bg-[#FF3B30] animate-[ping_1s_infinite]' 
            : flasherMode === 'solid' 
            ? 'bg-[#FF9500]' 
            : 'bg-[#34C759]'
        }`}></span>
      </div>

      {/* Safari-style Topbar navigation header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-zinc-200/60 px-8 py-4.5 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-30 select-none">
        
        <div className="flex items-center gap-3 text-left">
          <div className="bg-[#1D1D1F] text-white p-2 rounded-xl border border-zinc-800 shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
            <Landmark size={16} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-zinc-500 font-mono tracking-tight">Compliance Node v3.2</span>
              <span className="h-1 w-1 rounded-full bg-emerald-500"></span>
              <span className="text-[9px] font-medium text-emerald-600 font-mono">SECURE TRANSIT</span>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-[#1D1D1F] mt-0.5">
              National Certificate &amp; Compliance registry
            </h1>
          </div>
        </div>

        {/* Beacon and View controls */}
        <div className="flex items-center gap-3">
          
          {/* Subtle flasher settings */}
          <div className="hidden lg:flex items-center gap-1 bg-[#F5F5F7] p-0.5 rounded-lg border border-zinc-200/60">
            <span className="text-[8px] font-bold text-zinc-400 font-mono px-2">SYSTEM LIGHT:</span>
            {(['strobe', 'solid', 'stealth'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setFlasherMode(mode)}
                className={`text-[8.5px] font-bold px-2.5 py-1 rounded-md uppercase transition-all duration-200 cursor-pointer ${
                  flasherMode === mode
                    ? 'bg-white text-[#1D1D1F] shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-zinc-205/30'
                    : 'text-zinc-400 hover:text-zinc-650'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* iOS Style Segmented Control */}
          <div className="bg-[#F5F5F7] p-0.5 rounded-xl flex items-center w-full md:w-auto border border-zinc-200/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 md:flex-none px-4 py-1 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_1.5px_4px_rgba(0,0,0,0.08)] border border-zinc-205/30'
                  : 'text-zinc-500 hover:text-zinc-950'
              }`}
            >
              <Layers size={13} className="text-zinc-600" />
              <span>Analytic Desk</span>
            </button>
            
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex-1 md:flex-none px-4 py-1 rounded-lg text-xs font-semibold tracking-tight transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-white text-[#1D1D1F] shadow-[0_1.5px_4px_rgba(0,0,0,0.08)] border border-zinc-205/30'
                  : 'text-zinc-500 hover:text-zinc-950'
              }`}
            >
              <Smartphone size={13} className="text-zinc-600" />
              <span>Inspector Handset</span>
            </button>
          </div>

        </div>

      </div>

      {/* Main Container Workspace */}
      <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
        
        {/* Apple style context label */}
        <div className="bg-white border border-zinc-200 px-5 py-3.5 rounded-2xl flex items-start gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-left">
          <Info className="text-zinc-400 shrink-0 mt-0.5" size={15} />
          <div className="text-xs text-zinc-500 leading-relaxed font-sans">
            <span className="text-[#1D1D1F] font-semibold block mb-0.5">
              Federal Oversight Advisory
            </span>
            <span>This workspace manages compliance parameters, emission audits, and registry archives. Local incident actions, high-threat alerts, and emergency blocks are coordinated in sync with the </span>
            <span className="font-semibold text-zinc-800">Police Tactical Portal</span>
            <span>. All actions are cataloged on an immutable local audit track.</span>
          </div>
        </div>

        {/* Dynamic Tab Workspace */}
        <div className="transition-all duration-300">
          {activeTab === 'dashboard' ? (
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
              <GovernmentDashboard />
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 p-6 md:p-10 rounded-3xl flex flex-col xl:flex-row items-center justify-around gap-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative">
              
              <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
              
              {/* Apple-style Specs documentation card */}
              <div className="max-w-lg space-y-7 relative z-10 text-left">
                <div>
                  <span className="bg-[#F5F5F7] border border-zinc-200 text-zinc-600 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full inline-block font-sans">
                    Apple-grade Field Hardware
                  </span>
                  <h2 className="text-2.5xl font-extrabold text-[#1D1D1F] tracking-tight leading-snug mt-3">
                    State Certified Field Inspector Handset
                  </h2>
                  <p className="text-xs text-zinc-500 leading-relaxed mt-2 font-normal">
                    Designed for port-of-entry agents to run rapid, non-intrusive compliance audits. The field app reads laser-plaques on windshields, queries DMV records on the fly, and registers compliance seal signatures instantaneously.
                  </p>
                </div>

                <div className="border-t border-zinc-100 pt-6 space-y-4">
                  <span className="text-[10px] tracking-wider font-bold uppercase text-zinc-400 block font-mono">
                    COMPLIANCE CAPABILITIES
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-[#F5F5F7] rounded-xl flex items-start gap-2.5 border border-zinc-200/50">
                      <div className="text-[#34C759] shrink-0 mt-0.5">
                        <Check size={14} className="stroke-[3]" />
                      </div>
                      <div className="text-[11px]">
                        <strong className="text-[#1D1D1F] block font-semibold leading-none mb-0.5">Laser VIN Decoders</strong>
                        <span className="text-zinc-500">Optical registration scans.</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#F5F5F7] rounded-xl flex items-start gap-2.5 border border-zinc-200/50">
                      <div className="text-[#34C759] shrink-0 mt-0.5">
                        <Check size={14} className="stroke-[3]" />
                      </div>
                      <div className="text-[11px]">
                        <strong className="text-[#1D1D1F] block font-semibold leading-none mb-0.5">Registry Real-time Sync</strong>
                        <span className="text-zinc-500">Direct DMV API alignment.</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#F5F5F7] rounded-xl flex items-start gap-2.5 border border-zinc-200/50">
                      <div className="text-[#34C759] shrink-0 mt-0.5">
                        <Check size={14} className="stroke-[3]" />
                      </div>
                      <div className="text-[11px]">
                        <strong className="text-[#1D1D1F] block font-semibold leading-none mb-0.5">Signature Desk Sync</strong>
                        <span className="text-zinc-500">Live push to clearance queue.</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#F5F5F7] rounded-xl flex items-start gap-2.5 border border-zinc-200/50">
                      <div className="text-[#34C759] shrink-0 mt-0.5">
                        <Check size={14} className="stroke-[3]" />
                      </div>
                      <div className="text-[11px]">
                        <strong className="text-[#1D1D1F] block font-semibold leading-none mb-0.5">Emissions Diagnostics</strong>
                        <span className="text-zinc-500">Automatic failsafe check out.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-1 text-xs text-zinc-450 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#34C759] animate-pulse"></span>
                  <span>Use the mock physical terminal to execute inspection protocols.</span>
                </div>
              </div>

              {/* Inspector Device Simulator */}
              <div className="relative shrink-0">
                <div className="absolute -inset-6 bg-zinc-200/40 rounded-[52px] blur-2xl opacity-50"></div>
                <div className="relative z-10">
                  <InspectorMobileSimulator />
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}
