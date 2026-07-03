import React, { useState } from 'react';
import { User, Loader2, Send, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface SovereignClientChatProps {
  vehicleMake: string;
  vehicleYear: number;
  vehicleMileage: number;
  vehiclePrice: number;
  isHighlighted: boolean;
}

export default function SovereignClientChat({
  vehicleMake,
  vehicleYear,
  vehicleMileage,
  vehiclePrice,
  isHighlighted
}: SovereignClientChatProps) {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'concierge'; text: string; time: string }>>([
    { 
      sender: 'concierge', 
      text: `Greetings, John. I am Christian, your senior Client Concierge at JustCarSale Escrow. I have compiled and verified all high-definition telematics, historical title registration logs, and customs tolerances for this ${vehicleYear} ${vehicleMake}. How may I guide your procurement cycle today?`, 
      time: '10:42 AM' 
    }
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, time: currentTime }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      let replyText = "";

      if (lower.includes("price") || lower.includes("offer") || lower.includes("cost") || lower.includes("valuation") || lower.includes("buy")) {
        replyText = `Regarding the escrow pricing matrix, the listed valuation of $${vehiclePrice.toLocaleString()} is within the optimal regional median. Feel free to submit your target offer directly on our ledger panel above.`;
      } else if (lower.includes("miles") || lower.includes("mileage") || lower.includes("odometer") || lower.includes("kilometer")) {
        replyText = `This ${vehicleYear} ${vehicleMake} holds exactly ${vehicleMileage.toLocaleString()} certified miles. Our Houston Distribution sweep indicates complete historical parity with zero anomalies or tampering warnings.`;
      } else if (lower.includes("finance") || lower.includes("lease") || lower.includes("monthly") || lower.includes("down") || lower.includes("apr")) {
        replyText = `For corporate/personal financing, we support excel (4.9%), good (6.5%), and fair (8.9%) APR credit allocations. You can configure your down payment and lock in this rate securely in the Finance segment.`;
      } else if (lower.includes("shipping") || lower.includes("transport") || lower.includes("freight") || lower.includes("delivery")) {
        replyText = `Our logistics network processes fully enclosed luxury transport as well as standard car carriers. You can calculate full route expenses under Escrow Seals instantly in the Freight Booking calculator below.`;
      } else if (lower.includes("insurance") || lower.includes("warranty") || lower.includes("claims")) {
        replyText = `The sovereign liability escrow addon and Elite Powertrain Warranty lock instantly upon transaction completion. No active claims or liens are associated with this vehicle chassis, verifying a spotless integrity index.`;
      } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("greetings")) {
        replyText = `Greetings, John! I am here to facilitate secure transacting, logistics matching, and customs declaration for this ${vehicleMake}. How may I serve your procurement cycle today?`;
      } else {
        replyText = `Splendid request. I have referenced the telematics dashboard and complete title logs for this ${vehicleMake}. We can coordinate direct inspections, dealer test drives, or log escrow financing pre-approvals whenever you are ready.`;
      }

      setChatMessages(prev => [...prev, { sender: 'concierge', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <motion.div 
      id="chat-anchor"
      whileHover={{ y: -4 }}
      className={`bg-white border rounded-2xl p-4 transition-all duration-300 space-y-3.5 shadow-xs ${
        isHighlighted ? 'border-red-650 ring-2 ring-red-600/35 scale-[1.01]' : 'border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-red-700 font-extrabold shadow-inner font-mono text-xs">
            <User className="w-3.5 h-3.5 text-red-650" />
          </div>
          <div>
            <h4 className="text-[10.5px] font-black text-slate-900 leading-none">Senior Client Concierge</h4>
            <p className="text-[7.5px] font-mono text-emerald-600 font-bold uppercase mt-0.5">• Active Chat Verified</p>
          </div>
        </div>
        <span className="text-[7.5px] font-mono font-black text-slate-400 uppercase">JustCarSale ID Match</span>
      </div>

      {/* Chat messages viewport */}
      <div className="h-[180px] overflow-y-auto pr-1 space-y-2.5 text-[10px] leading-normal font-sans scrollbar-thin">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`p-2.5 rounded-xl max-w-[85%] ${
              msg.sender === 'user' 
                ? 'bg-red-600 text-white rounded-br-none' 
                : 'bg-slate-100 border border-slate-150 text-slate-800 rounded-bl-none z-10'
            }`}>
              <p>{msg.text}</p>
              <span className={`text-[7px] font-mono block text-right pt-1 font-bold ${msg.sender === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-1.5 text-[8.5px] font-bold text-slate-400 font-mono pl-1">
            <Loader2 className="w-3 h-3 animate-spin text-red-600" />
            <span>Christian is verifying telemetry data...</span>
          </div>
        )}
      </div>

      {/* Write message */}
      <form onSubmit={handleSendMessage} className="flex gap-1.5 border-t border-slate-100 pt-2.5">
        <input
          type="text"
          placeholder="Ask price, mileage, shipping, financing..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          className="flex-1 h-8 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 px-2.5 rounded-lg outline-none text-[10px] text-slate-800 focus:border-red-650 transition-all font-sans"
        />
        <button
          type="submit"
          className="h-8 w-8 bg-red-600 hover:bg-red-750 text-white rounded-lg flex items-center justify-center transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </motion.div>
  );
}
