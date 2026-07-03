/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Shield, MapPin, AlertTriangle, AlertCircle, CheckCircle, MessageSquare, Send, Globe, Radio } from 'lucide-react';

export default function PlatformCenter() {
  const [chatFeed, setChatFeed] = useState<Array<{ sender: 'user' | 'klaus'; english: string; german: string; time: string }>>([
    {
      sender: 'klaus',
      english: `Good day. The customs clearance documents for the Porsche 911 GT3 are ready. Please confirm if the delivery address in the Jebel Ali Free Zone is correct.`,
      german: `Guten Tag. Die Unterlagen für die Zollabwicklung des Porsche 911 GT3 sind bereit. Bitte bestätigen Sie, ob die Lieferadresse in der Jebel Ali Free Zone korrekt ist.`,
      time: '10:12 AM'
    }
  ]);
  const [chatText, setInputText] = useState('');
  const [isKlausTyping, setIsKlausTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTool] = useState<'map' | 'chat'>('map');

  const handleSendTranslation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;

    const currentMsg = {
      sender: 'user' as const,
      english: chatText.trim(),
      german: `Dementsprechend: "${chatText.trim()}" (Auto-translated to German)`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatFeed(prev => [...prev, currentMsg]);
    setInputText('');
    setIsKlausTyping(true);

    setTimeout(() => {
      setIsKlausTyping(false);
      const reply = {
        sender: 'klaus' as const,
        english: `Splendid. I will append the original Certificate of Conformity for UAE registration and file the customs bond. See you inside the Escrow.`,
        german: `Hervorragend. Ich werde die Original-Konformitätsbescheinigung für die VAE-Registrierung beifügen und die Zollbürgschaft hinterlegen. Wir sehen uns im Treuhandkonto.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatFeed(prev => [...prev, reply]);
    }, 2000);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatFeed, isKlausTyping]);

  return (
    <div className="space-y-8 py-4 animate-in fade-in duration-300" id="platform-cybersecurity-center">
      
      {/* Tab select headers (Apple Switcher style) */}
      <div className="flex bg-neutral-100 p-1 rounded-full border border-neutral-200/40 select-none">
        <button
          onClick={() => setActiveTool('map')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'map' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Radio className="w-3.5 h-3.5" /> Security Command Center
        </button>
        <button
          onClick={() => setActiveTool('chat')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'chat' ? 'bg-white text-black shadow-sm' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Globe className="w-3.5 h-3.5" /> Secure Translation (DE/EN)
        </button>
      </div>

      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          
          {/* Geographical Map representation (8 Columns) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2">
              <h3 className="font-bold text-neutral-900 text-sm tracking-tight">Geographical Fraud Density Scans</h3>
              <span className="bg-neutral-100 text-neutral-800 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-neutral-950" /> Active Risks
              </span>
            </div>

            <div className="relative h-96 bg-neutral-55 rounded-[20px] overflow-hidden border border-neutral-200/40">
              <img
                className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_QgxYPW7aUHYLQhqXKnhu3NhXQOvUFVOSBu1ABMMjCrjnBEzq8jzJf3mP7Q_HoPnXRA40xUjX92XKbR3cW7F7qA19FNdFFinPESufPd4pOkebIN3Pu81XrcYTK_C10hV-2aNot_lFH3yliQFq3vLdefxO0teQt-rCCVGZ17YK6NzYH3qCDgAM9yP9EygkknXfcyWVQSBIAh4we72WiAtO-lpG5N5qAdYc3ZhDl59sZtpESJpKQNePo-EvO4cb5soiMSvRE1n-q1xl"
                alt="Bento global density coordinate plot map"
                referrerPolicy="no-referrer"
              />

              {/* Glowing Pulse indicators */}
              <div className="absolute top-[25%] left-[30%] flex flex-col items-center select-none">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-black"></span>
                </span>
                <span className="bg-black text-white text-[9px] px-2 py-0.5 rounded-full font-mono font-bold mt-1 shadow-sm">FL-NV Cloned VIN: High Threat</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            {/* Risk stats summary */}
            <div className="bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-4">
              <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Risk metrics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-250/20 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase block font-semibold mb-1">Threat Quotient</span>
                  <span className="text-2xl font-bold text-neutral-900 font-mono">8.2%</span>
                  <span className="text-[9px] text-neutral-500 block mt-1">Excellent Level</span>
                </div>

                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-250/20 text-center">
                  <span className="text-[10px] text-neutral-400 uppercase block font-semibold mb-1">Audit Queue</span>
                  <span className="text-2xl font-bold text-neutral-905 font-mono">04</span>
                  <span className="text-[9px] text-neutral-500 block mt-1">Pending approval</span>
                </div>
              </div>
            </div>

            {/* List of Flagged Records */}
            <div className="bg-white p-6 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-4 flex-1">
              <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block border-b border-neutral-100 pb-2">Flagged Incidents</h4>
              
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                <div className="p-4 bg-neutral-50 rounded-2xl flex items-start gap-2.5 border border-neutral-200/20">
                  <AlertCircle className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900 font-mono tracking-tight">WBA53BJ0XPX...881</p>
                    <p className="text-[11px] text-neutral-500 leading-relaxed font-normal">Flagged duplicate registration check Florida vs Nevada.</p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 rounded-2xl flex items-start gap-2.5 border border-neutral-200/20">
                  <CheckCircle className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-neutral-900 font-mono tracking-tight">WP0AB2A92MS...992</p>
                    <p className="text-[11px] text-neutral-500 leading-relaxed font-normal">Global salvage database check cleared. Permitted for Jebel Ali export cargo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          
          {/* Active Chats column (3 Cols) */}
          <div className="hidden lg:block lg:col-span-3 bg-white rounded-[24px] border border-neutral-200/50 shadow-sm overflow-hidden h-[500px]">
            <div className="p-4 bg-neutral-50 border-b border-neutral-200/50 text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Active escrow chats</div>
            <div className="divide-y divide-neutral-100">
              <div className="p-4 bg-neutral-50/50 flex gap-3 cursor-pointer items-center select-none">
                <div className="relative">
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAcOhGIJu64AiYO--NXrRS7i5LbbKctGcElWmv9YwXDJRR4vVaJCXMQC7MmvqU31cJkTLKmfltbmCZPTkkBarBpYKzp3M8XDH7QXKp5_ILBLwe5QvDGB-APKZE9Xf2P0jMtCbHNLkUVpeZI3uAJyM_2LFaxHRqE8x2mVu9vu7O5r55hwdcnShy0HX5Oq5_Pe9aqLlBo7pk44tiTJrUnGfyVvQj2Q5izfn5i3vOjGyznObq14A_UjjMHfCJcOyugD1IKHGusiKcoSjG"
                    alt="Klaus Meyer"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-neutral-900 rounded-full border border-white"></div>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-neutral-950">Klaus Meyer</h5>
                  <p className="text-[10px] text-neutral-400">Düsseldorf Registry, DE</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat messaging window (9 Cols) */}
          <div className="col-span-12 lg:col-span-9 bg-white rounded-[24px] border border-neutral-200/50 shadow-sm flex flex-col justify-between h-[500px] overflow-hidden">
            {/* Header info */}
            <div className="px-5 py-3 border-b border-neutral-200/50 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-neutral-50 gap-2 select-none">
              <div className="flex items-center gap-2.5">
                <span className="bg-black text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">DE ↔ EN</span>
                <span className="text-[11px] text-neutral-450 font-medium">Realtime secure machine translation live</span>
              </div>
              <span className="text-xs text-neutral-900 font-bold font-mono">TLS Security channel active</span>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6 bg-neutral-50/50 flex flex-col hide-scrollbar">
              {chatFeed.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-3xl max-w-[85%] sm:max-w-[75%] flex flex-col space-y-3 ${
                    m.sender === 'user'
                      ? 'bg-black text-white self-end rounded-tr-none shadow-sm'
                      : 'bg-white border border-neutral-200/50 text-neutral-900 self-start rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="text-xs leading-relaxed font-semibold">
                    {m.sender === 'user' ? m.english : m.german}
                  </p>

                  <div className={`pt-2.5 border-t flex gap-2.5 items-start text-[11px] ${
                    m.sender === 'user' ? 'border-white/10 text-neutral-300' : 'border-neutral-100 text-neutral-500'
                  }`}>
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold text-[9px] uppercase tracking-wider block mb-1">
                        {m.sender === 'user' ? 'AUTOTRANSLATION (DE)' : 'AUTOTRANSLATION (EN)'}
                      </p>
                      <p className="italic leading-relaxed font-normal">
                        {m.sender === 'user' ? m.german : m.english}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isKlausTyping && (
                <div className="bg-white border border-neutral-200/30 px-4 py-2 rounded-full self-start flex gap-1.5 items-center shadow-sm">
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce delay-150" />
                  <span className="text-[10px] text-neutral-400 italic">Meyer is typing translate...</span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Form */}
            <form onSubmit={handleSendTranslation} className="p-4 bg-white border-t border-neutral-200/50 flex gap-2 font-semibold">
              <input
                className="flex-1 bg-neutral-50 border border-neutral-200/50 rounded-full px-4 py-2.5 text-xs focus:bg-white focus:ring-4 focus:ring-black/5 outline-none text-neutral-800"
                placeholder="Type message in English for instant German translation..."
                value={chatText}
                onChange={e => setInputText(e.target.value)}
              />
              <button
                type="submit"
                className="bg-black text-white hover:opacity-90 w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
