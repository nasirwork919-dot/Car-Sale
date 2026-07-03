/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Trophy, Calendar, Shield, Cpu, Gavel, Users, DollarSign, Wrench, Activity, CheckSquare, 
  MapPin, Check, Plus, AlertCircle, FileText, ChevronLeft, ChevronRight, User, TrendingUp, Lock
} from 'lucide-react';
import { Vehicle, Appointment, Lead, AdvisoryExpert } from '../types';
import { VEHICLES, LEADS, APPOINTMENTS, EXPERTS } from '../data';
import InsurancePlatform from './InsurancePlatform';

interface DashboardsProps {
  currentRole?: string;
}

export default function Dashboards({ currentRole }: DashboardsProps) {
  const [activeTab, setActiveTab] = useState<'dealer' | 'workshop' | 'school' | 'tire' | 'rental' | 'export' | 'auction' | 'pro_vin' | 'advisory' | 'insurance'>(
    currentRole === 'insurance' ? 'insurance' : 'dealer'
  );

  // Auction Bid States
  const [currentBid, setCurrentBid] = useState(192500);
  const [bidHistory, setBidHistory] = useState<Array<{ bidder: string; amount: number; time: string; leading: boolean }>>([
    { bidder: 'PORTFOLIO_BID_99', amount: 192500, time: '2 mins ago', leading: true },
    { bidder: 'COLLECTOR_X', amount: 191000, time: '14 mins ago', leading: false },
    { bidder: 'GERMAN_ENGINEERING_CORP', amount: 189500, time: '42 mins ago', leading: false }
  ]);
  const [nextBidVal, setNextBidVal] = useState(193000);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  // Tire configuration state
  const [tireWidth, setTireWidth] = useState('245');
  const [tireAspect, setTireAspect] = useState('45');
  const [tireDiameter, setTireDiameter] = useState('18"');

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (nextBidVal <= currentBid) {
      alert("Bid must exceed the current highest offer.");
      return;
    }
    const myBid = { bidder: 'YOU_AUTHENTICATED', amount: nextBidVal, time: 'Just now', leading: true };
    setBidHistory(prev => [myBid, ...prev.map(b => ({ ...b, leading: false }))]);
    setCurrentBid(nextBidVal);
    setNextBidVal(nextBidVal + 500);
    setIsBidModalOpen(false);
    alert("Escrow cleared! A temporary hold of $1,000 has been secured.");
  };

  return (
    <div className="space-y-8 py-4 animate-in fade-in duration-300 animate-in fade-in" id="role-dashboards-module">
      
      {/* Scrollable multi-sub tab menu (Apple segment list) */}
      <div className="flex bg-neutral-100 p-1 rounded-full border border-neutral-200/40 overflow-x-auto whitespace-nowrap hide-scrollbar select-none">
        <button
          onClick={() => setActiveTab('dealer')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'dealer' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
          }`}
        >
          Dealership CRM Terminal
        </button>
        <button
          onClick={() => setActiveTab('workshop')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'workshop' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
          }`}
        >
          Service Workshop Hub
        </button>
        <button
          onClick={() => setActiveTab('school')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'school' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
          }`}
        >
          Driving Academy Timeline
        </button>
        <button
          onClick={() => setActiveTab('tire')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'tire' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
          }`}
        >
          Tire Shop configuration
        </button>
        <button
          onClick={() => setActiveTab('rental')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'rental' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
          }`}
        >
          Rental timelines
        </button>
        <button
          onClick={() => setActiveTab('export')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'export' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
          }`}
        >
          Customs Logistics
        </button>
        <button
          onClick={() => setActiveTab('auction')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'auction' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
          }`}
        >
          Live auction floor
        </button>
        <button
          onClick={() => setActiveTab('pro_vin')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'pro_vin' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
          }`}
        >
          Pro VIN risks
        </button>
        <button
          onClick={() => setActiveTab('advisory')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'advisory' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
          }`}
        >
          Legal Advisory
        </button>
        <button
          onClick={() => setActiveTab('insurance')}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeTab === 'insurance' ? 'bg-[#8B0000] text-white shadow-sm' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Shield size={13} className={activeTab === 'insurance' ? 'text-white' : 'text-[#8B0000]'} />
          <span>Insurance Vault &amp; Portal</span>
        </button>
      </div>

      {/* Tab 1: Dealership CRM */}
      {activeTab === 'dealer' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-[20px] border border-neutral-200/50 shadow-sm">
              <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">Active Inventory</span>
              <p className="text-2xl font-bold mt-1 text-black">142 units</p>
            </div>
            <div className="bg-white p-5 rounded-[20px] border border-neutral-200/50 shadow-sm">
              <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">Turnover period</span>
              <p className="text-2xl font-bold mt-1 text-black">22 days</p>
            </div>
            <div className="bg-white p-5 rounded-[20px] border border-neutral-200/50 shadow-sm">
              <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">compliance pending</span>
              <p className="text-2xl font-bold mt-1 text-black">15 files</p>
            </div>
            <div className="bg-neutral-900 p-5 rounded-[20px]">
              <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">monthly turnover</span>
              <p className="text-2xl font-bold mt-1 text-white">$2.4M</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-8 bg-white rounded-[24px] border border-neutral-200/50 overflow-hidden shadow-sm">
              <div className="p-5 bg-neutral-50 border-b border-neutral-200/50 flex justify-between items-center text-xs font-semibold">
                <span className="text-neutral-900 font-bold uppercase tracking-wider">Regional active listings</span>
                <span className="text-neutral-400">Total: 4 elements</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans text-neutral-600">
                  <thead className="bg-neutral-50 font-semibold text-neutral-800">
                    <tr>
                      <th className="p-3.5">Vehicle classification</th>
                      <th className="p-3.5">Target VIN</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5 text-right">Escrow Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium">
                    {VEHICLES.map(car => (
                      <tr key={car.vin} className="hover:bg-neutral-50/40">
                        <td className="p-4 text-neutral-900 font-semibold">{car.year} {car.make} {car.model}</td>
                        <td className="p-4 font-mono text-[10px] tracking-widest text-neutral-500">{car.vin.slice(0, 10)}*****</td>
                        <td className="p-4 text-neutral-900 font-bold">${car.price.toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <span className="bg-neutral-100 text-neutral-800 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider">{car.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            
            <section className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-4">
              <h4 className="text-[10px] uppercase font-bold text-neutral-450 tracking-wider">Active CRM Leads</h4>
              <div className="space-y-3">
                {LEADS.map(lead => (
                  <div key={lead.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/20 flex justify-between items-center text-xs font-medium">
                    <div>
                      <p className="font-bold text-neutral-950">{lead.name}</p>
                      <p className="text-neutral-500 text-[10px] mt-0.5">{lead.inquiry}</p>
                    </div>
                    <span className="bg-neutral-200 text-neutral-800 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{lead.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* Tab 2: Workshop Hub */}
      {activeTab === 'workshop' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-8 bg-white rounded-[24px] border border-neutral-200/50 overflow-hidden shadow-sm">
              <div className="p-5 bg-neutral-50 border-b border-neutral-200/50 flex justify-between items-center text-xs font-semibold">
                <span className="text-neutral-900 font-bold uppercase tracking-wider">Active maintenance calendar</span>
                <span className="text-[10px] text-neutral-400 font-mono">PARK LANE REPAIR CENTER</span>
              </div>
              <div className="grid grid-cols-7 border-b border-neutral-100 bg-neutral-50/50 text-center font-bold text-[9px] text-neutral-400 uppercase py-3.5 tracking-wider">
                <span>Mon</span><span>Tue</span><span>Wed</span><span className="text-black">Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
              <div className="grid grid-cols-7 divide-x divide-neutral-100 h-auto text-[11px] p-3 gap-0.5 font-medium">
                <div className="p-1 space-y-1">
                  <div className="p-2 bg-neutral-100 text-neutral-800 rounded-lg font-semibold leading-tight text-[10px]">09:00 - Fluid flush</div>
                </div>
                <div className="p-1 space-y-1">
                  <div className="p-2 bg-neutral-100 text-neutral-800 rounded-lg font-semibold leading-tight text-[10px]">11:30 - Porsche PDK</div>
                </div>
                <div className="p-1"></div>
                <div className="p-1 space-y-2.5 bg-neutral-50/30">
                  <div className="p-2 bg-black text-white rounded-lg font-semibold leading-tight text-[10px]">10:00 - G80 caliper</div>
                  <div className="p-2 bg-neutral-100 text-neutral-800 rounded-lg font-semibold leading-tight text-[10px]">15:30 - alignment</div>
                </div>
                <div className="p-1"></div>
                <div className="p-1"></div>
                <div className="p-1 bg-neutral-50/50"></div>
              </div>
            </section>

            <aside className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-4">
              <h4 className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block border-b border-neutral-100 pb-2">Repair Proposals</h4>
              <div className="space-y-3 text-xs font-medium">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/20 flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-neutral-900">Overhaul dampers</h5>
                    <p className="text-neutral-500 text-[10px] mt-0.5">Porsche 911 (992)</p>
                  </div>
                  <span className="font-bold text-black font-mono">$2,180.00</span>
                </div>
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/20 flex justify-between items-center">
                  <div>
                    <h5 className="font-bold text-neutral-900">Caliper seizure fix</h5>
                    <p className="text-neutral-500 text-[10px] mt-0.5">BMW M3 G80</p>
                  </div>
                  <span className="font-bold text-black font-mono">$890.00</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* Tab 3: Driving School */}
      {activeTab === 'school' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          <section className="lg:col-span-8 bg-white rounded-[24px] border border-neutral-200/50 overflow-hidden shadow-sm">
            <div className="p-5 bg-neutral-50 border-b border-neutral-200/50 flex justify-between items-center text-xs font-semibold">
              <span className="text-neutral-900 font-bold uppercase tracking-wider">Instructor schedules</span>
              <span className="text-[10px] text-neutral-450">3 slots reserved today</span>
            </div>
            <div className="divide-y divide-neutral-100 text-xs font-semibold text-neutral-700">
              {APPOINTMENTS.map((ap, idx) => (
                <div key={idx} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-black font-mono block w-16">{ap.time}</span>
                    <div className="w-8 h-8 rounded-full bg-neutral-100 text-black font-bold text-[10px] flex items-center justify-center shrink-0">
                      {ap.initials}
                    </div>
                    <div>
                      <p className="font-bold text-neutral-900">Instruct: {ap.instructor} • Student: {ap.student}</p>
                      <p className="text-neutral-450 italic text-[10px] mt-0.5">{ap.activity}</p>
                    </div>
                  </div>
                  <span className="bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full text-[9px] uppercase font-bold tracking-wider">{ap.status}</span>
                </div>
              ))}
            </div>
          </section>

          <aside className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block border-b border-neutral-100 pb-2">Student progress tracker</h4>
            <div className="space-y-4 text-xs font-medium">
              <div className="bg-neutral-50 p-4 rounded-xl space-y-2 border border-neutral-200/10">
                <div className="flex justify-between items-center font-bold">
                  <span>Emma Wilson (Parking)</span>
                  <span className="text-black">85% Readiness</span>
                </div>
                <div className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-black w-[85%]"></div>
                </div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-xl space-y-2 border border-neutral-200/10">
                <div className="flex justify-between items-center font-bold">
                  <span>David Chen (Merging)</span>
                  <span className="text-black">60% Readiness</span>
                </div>
                <div className="h-1 w-full bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-black w-[60%]"></div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Tab 4: Tire Shop search */}
      {activeTab === 'tire' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          <section className="lg:col-span-5 bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-4 text-xs font-semibold">
            <h4 className="font-bold text-neutral-900 tracking-tight text-sm">Winter tire sizing specification</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Width</span>
                <select className="w-full bg-neutral-50 px-3 py-2 rounded-full border border-neutral-200/50 text-neutral-800 cursor-pointer" value={tireWidth} onChange={e => setTireWidth(e.target.value)}>
                  <option>205</option><option>225</option><option>245</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Aspect</span>
                <select className="w-full bg-neutral-50 px-3 py-2 rounded-full border border-neutral-200/50 text-neutral-800 cursor-pointer" value={tireAspect} onChange={e => setTireAspect(e.target.value)}>
                  <option>40</option><option>45</option><option>50</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Diameter</span>
                <select className="w-full bg-neutral-50 px-3 py-2 rounded-full border border-neutral-200/50 text-neutral-800 cursor-pointer" value={tireDiameter} onChange={e => setTireDiameter(e.target.value)}>
                  <option>17"</option><option>18"</option><option>19"</option>
                </select>
              </div>
            </div>
            <button onClick={() => alert(`Sizing query: ${tireWidth}/${tireAspect} R${tireDiameter}`)} className="w-full h-10 mt-3 bg-black hover:opacity-90 text-white rounded-full font-semibold">Query specification inventory</button>
          </section>

          <aside className="lg:col-span-7 bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block border-b border-neutral-100 pb-2">Active campaigns</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
              <div className="p-5 bg-neutral-50 border border-neutral-200/20 rounded-2xl space-y-1.5">
                <span className="text-[8px] bg-neutral-200 text-neutral-800 rounded-full px-2 py-0.5 tracking-wider uppercase font-bold block w-fit">Swap season active</span>
                <p className="text-neutral-900 text-xs">428 pending winter replacement queries active.</p>
                <button onClick={() => alert("Reminders pushed to registered list")} className="mt-4 bg-black text-white px-4 py-1.5 rounded-full text-[10px]">Push SMS Reminders</button>
              </div>
              <div className="p-5 bg-neutral-50 border border-neutral-200/20 rounded-2xl space-y-1.5">
                <span className="text-[8px] bg-neutral-200 text-neutral-800 rounded-full px-2 py-0.5 tracking-wider uppercase font-bold block w-fit">Inventory incoming</span>
                <p className="text-neutral-900 text-xs text-neutral-600 leading-relaxed font-normal">Premium Bridgestone shipments cleared custom limits. 14 items logged in hub.</p>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Tab 5: Rental Dashboard */}
      {activeTab === 'rental' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          <section className="lg:col-span-8 bg-white rounded-[24px] border border-neutral-200/50 overflow-hidden shadow-sm">
            <div className="p-5 bg-neutral-50 border-b border-neutral-200/50 flex justify-between items-center text-xs font-semibold">
              <span className="text-neutral-900 font-bold uppercase tracking-wider">Master rental calendar</span>
              <span className="text-[10px] text-neutral-400 font-mono">HEATHROW JETWAY</span>
            </div>
            <div className="p-6 overflow-x-auto">
              <div className="min-w-[500px] border-b border-neutral-100 pb-2 mb-3 flex justify-between font-bold text-[9px] text-neutral-400 uppercase tracking-wider">
                <span>Fleet Unit identifier</span><span>Mon 12</span><span>Tue 13</span><span>Wed 14</span><span>Thu 15</span>
              </div>
              <div className="space-y-4 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <span className="w-1/3 text-neutral-900">Porsche 911 (LDN-1)</span>
                  <div className="w-2/3 h-6 bg-neutral-100 border border-neutral-200/50 rounded-full flex items-center px-4 text-neutral-700 text-[10px]">Miller fleet • #8821 active</div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="w-1/3 text-neutral-900">Rover Defender (LDN-5)</span>
                  <div className="w-2/3 h-6 bg-neutral-50 border border-neutral-200/30 rounded-full flex items-center px-4 text-neutral-500 text-[10px]">M. Chen profile • #8904 active</div>
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block border-b border-neutral-100 pb-2">Active Lease Agreements</h4>
            <div className="space-y-3 font-semibold text-xs">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/20 flex justify-between items-center">
                <div>
                  <h5 className="font-bold text-neutral-900">James Miller</h5>
                  <p className="text-neutral-400 text-[10px] mt-0.5">Porsche 911 Carrera S</p>
                </div>
                <span className="bg-neutral-200 text-neutral-800 rounded-full font-bold px-2.5 py-0.5 text-[8px] uppercase tracking-wider">Active</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Tab 6: Customs Logistics */}
      {activeTab === 'export' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          <section className="lg:col-span-8 bg-white rounded-[24px] border border-neutral-200/50 overflow-hidden shadow-sm">
            <div className="p-5 bg-neutral-50 border-b border-neutral-200/50 flex justify-between items-center text-xs font-semibold">
              <span className="text-neutral-900 font-bold uppercase tracking-wider">Port transport cargo manifest</span>
              <span className="text-[10px] text-neutral-400 font-mono">OCEAN TRANSIT TRACKER</span>
            </div>
            <div className="p-6 space-y-5 text-xs font-semibold">
              <div className="flex justify-between items-center p-4 bg-neutral-50 rounded-2xl border border-neutral-200/20">
                <span className="text-neutral-900 text-xs">Container vessel: BLUE OCEAN</span>
                <span className="bg-neutral-900 text-white px-2.5 py-0.5 rounded-full text-[8px] tracking-wider font-bold">ATLANTIC WAVE</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-black w-2/3"></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                <span>Hamburg port</span>
                <span className="text-neutral-900">ETA: 4 days (Port of Detroit)</span>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-4">
            <h4 className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block border-b border-neutral-100 pb-2">Freight Carriers</h4>
            <div className="space-y-3 font-semibold text-xs animate-in font-medium">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/20 flex justify-between items-center">
                <div>
                  <h5 className="font-bold text-neutral-900">Precision Auto Haulers</h5>
                  <p className="text-neutral-450 text-[10px] mt-0.5">Est. 3-5 days cargo drop</p>
                </div>
                <span className="font-bold text-black font-mono">$1,250</span>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Tab 7: Active Bid Floor */}
      {activeTab === 'auction' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          <section className="lg:col-span-8 bg-white rounded-[24px] border border-neutral-200/50 overflow-hidden shadow-sm">
            <div className="p-5 bg-neutral-50 border-b border-neutral-200/50 flex justify-between items-center text-xs font-semibold">
              <span className="text-neutral-900 font-bold uppercase tracking-wider">Floor Bid ledger (GT3 Classic)</span>
              <span className="text-[10px] text-neutral-450">Verified bidders only</span>
            </div>
            <div className="divide-y divide-neutral-100">
              {bidHistory.map((b, idx) => (
                <div key={idx} className="p-4 flex justify-between items-center text-xs font-medium">
                  <div>
                    <span className="font-bold text-neutral-900 font-mono tracking-wide">{b.bidder}</span>
                    <p className="text-neutral-450 text-[10px] mt-0.5">{b.time}</p>
                  </div>
                  <div className="flex gap-4 items-center">
                    <span className="font-bold text-black font-mono">${b.amount.toLocaleString()}</span>
                    {b.leading && (
                      <span className="bg-neutral-100 text-neutral-800 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider">Leading</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-6">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Place Bond bid</span>
            <div className="space-y-4 font-semibold text-xs">
              <div>
                <span className="text-[10px] text-neutral-400 font-bold block uppercase mb-1">Time Remaining</span>
                <span className="text-2xl font-black text-black font-mono tracking-widest animate-pulse">23:41:04</span>
              </div>
              <div className="pt-4 border-t border-neutral-100 flex justify-between items-baseline">
                <span className="text-neutral-500">Current highest offer</span>
                <span className="text-xl font-bold text-black font-mono">${currentBid.toLocaleString()}</span>
              </div>
              <button onClick={() => setIsBidModalOpen(true)} className="w-full h-11 bg-black text-white hover:opacity-90 rounded-full font-semibold transition-all">
                Submit Escrow Bid Bond
              </button>
            </div>
          </aside>

          {/* Secure Bid Hold Modal Overlay */}
          {isBidModalOpen && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4">
              <div className="bg-white p-8 rounded-[24px] max-w-sm w-full border border-neutral-200 animate-in zoom-in duration-200 space-y-6">
                <div className="space-y-2 text-center">
                  <h4 className="text-base font-bold text-neutral-900">Bid Bond Authorizing</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                    Participating on this premium asset requires a temporary $1,000 hold on your registered card. Released instantly if outbid.
                  </p>
                </div>

                <form onSubmit={handlePlaceBid} className="space-y-4 text-xs font-semibold">
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-neutral-400 font-bold uppercase block">Your Authorized bid ($)</span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-neutral-405">$</span>
                      <input
                        type="number"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-full pl-8 pr-4 py-2.5 font-bold text-neutral-900 text-xs"
                        value={nextBidVal}
                        onChange={e => setNextBidVal(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-neutral-100">
                    <button type="button" onClick={() => setIsBidModalOpen(false)} className="flex-1 py-2 text-neutral-400 hover:text-black font-semibold text-xs uppercase">Cancel</button>
                    <button type="submit" className="flex-1 py-1.5 bg-black text-white rounded-full font-bold text-[11px]">Authorize</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 8: Pro VIN risks */}
      {activeTab === 'pro_vin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          <section className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-5">
            <div className="flex justify-between items-start border-b border-slate-50 pb-3">
              <div>
                <span className="bg-neutral-100 text-neutral-900 px-3 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider font-mono">
                  NMVTIS Risk Alert
                </span>
                <h3 className="font-bold text-neutral-900 text-base mt-2 tracking-tight">Duplicate Registration Warning</h3>
              </div>
            </div>
            <p className="text-neutral-500 text-xs leading-relaxed font-normal">
              We parsed matching title registration histories in Florida and Nevada for the identical physical vehicle chassis WBA53BJ0XPX...881. High-Precision diagnostic risk is marked high. Suggest holding escrow releasing.
            </p>
          </section>

          <aside className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm flex flex-col justify-between min-h-[220px]">
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-4">Integrity score</span>
              <div className="w-16 h-16 bg-neutral-50 border border-neutral-200 rounded-full flex items-center justify-center mx-auto text-sm font-bold text-neutral-800">
                35%
              </div>
            </div>
            <div className="pt-4 border-t border-neutral-100 italic text-[10px] text-neutral-405 font-mono">Flagged into NMVTIS federal register portals immediately.</div>
          </aside>
        </div>
      )}

      {/* Tab 9: Legal Advisory */}
      {activeTab === 'advisory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          <section className="lg:col-span-8 space-y-4">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Vetted automotive barristers</span>
            {EXPERTS.map(expert => (
              <div key={expert.id} className="bg-white p-5 rounded-[24px] border border-neutral-200/50 shadow-sm flex flex-col sm:flex-row gap-5 items-start hover:border-black transition-all">
                <img className="w-16 h-16 rounded-xl object-cover bg-neutral-100 shrink-0" src={expert.image} alt={expert.name} />
                <div className="flex-1 space-y-1 text-xs">
                  <h5 className="font-bold text-neutral-900 text-xs">{expert.name}</h5>
                  <p className="text-neutral-400 text-[10px] font-semibold">{expert.title} • {expert.firm}</p>
                  <p className="text-neutral-500 italic leading-relaxed pt-2 font-normal">"{expert.bio}"</p>
                  <button onClick={() => alert(`Consultation schedule initiated with ${expert.name}.`)} className="bg-black hover:opacity-90 text-white text-[10px] font-semibold px-4 py-1.5 rounded-full mt-3 transition-opacity">Schedule Consultation</button>
                </div>
              </div>
            ))}
          </section>

          <aside className="lg:col-span-4 bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-4">
            <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider block border-b border-neutral-100 pb-2">Logistics documents</span>
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/20 text-xs space-y-2 font-normal text-neutral-500 leading-relaxed">
              <span className="font-bold text-neutral-800 block uppercase text-[8px] tracking-wider">Power of Attorney (POA)</span>
              <p>Customs export forms require signed digitization for port clearance.</p>
              <button onClick={() => alert("Signature terminal requested")} className="text-black font-semibold hover:opacity-80 block text-[10px]">Sign digital packet</button>
            </div>
          </aside>
        </div>
      )}

      {/* Tab 10: Insurance Platform */}
      {activeTab === 'insurance' && (
        <div className="animate-in fade-in duration-300">
          <InsurancePlatform />
        </div>
      )}
    </div>
  );
}
