import React from 'react';
import { MessageSquare, Calendar, ChevronRight, Coins, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

interface SovereignActionDeskProps {
  onScrollTo: (id: string) => void;
  onOpenChat: () => void;
  onOpenBooking: () => void;
  onOpenConfigure: () => void;
}

export default function SovereignActionDesk({ onScrollTo, onOpenChat, onOpenBooking, onOpenConfigure }: SovereignActionDeskProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-zinc-200/50 rounded-[24px] p-6 text-zinc-900 space-y-5 shadow-xs select-none"
    >
      <div className="space-y-1">
        <h3 className="text-base font-black tracking-tight text-zinc-900 font-sans">
          Sovereign Action Desk
        </h3>
      </div>
      
      <div className="space-y-4">
        {/* Primary CTA Button: Make Offer / Buy Now */}
        <button
          onClick={() => onScrollTo('offer-now-anchor')}
          className="w-full py-3 bg-[#8B0000] hover:bg-[#a80d0d] text-white text-xs font-sans font-black uppercase tracking-wider rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 shadow-xs hover:shadow-lg hover:shadow-[#8B0000]/10 active:scale-95"
        >
          <Coins className="w-4 h-4" /> Make Offer / Buy Now
        </button>
        
        {/* Elegant stacked list of links with Chevrons (Apple-inspired) */}
        <div className="border-t border-zinc-100 pt-2 space-y-1">
          
          <button
            onClick={onOpenChat}
            className="w-full flex items-center justify-between py-3 px-3 hover:bg-zinc-50 rounded-xl transition-all duration-200 cursor-pointer group text-left border-none outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200/65 transition-colors">
                <MessageSquare className="w-4 h-4 text-zinc-650" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-zinc-900 font-sans">Chat Seller</div>
                <div className="text-[10px] text-zinc-400 mt-0.5 font-sans">Inquire about telematics &amp; history</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={onOpenBooking}
            className="w-full flex items-center justify-between py-3 px-3 hover:bg-zinc-50 rounded-xl transition-all duration-200 cursor-pointer group text-left border-none outline-none"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200/65 transition-colors">
                <Calendar className="w-4 h-4 text-zinc-650" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-zinc-900 font-sans">Booking Desk</div>
                <div className="text-[10px] text-zinc-400 mt-0.5 font-sans">Schedule professional audits or test drives</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={onOpenConfigure}
            className="w-full flex items-center justify-between py-3.5 px-3 hover:bg-zinc-50 rounded-xl transition-all duration-200 cursor-pointer group text-left border-none outline-none animate-pulse-subtle"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200/65 transition-colors">
                <CreditCard className="w-4 h-4 text-zinc-650" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-zinc-900 font-sans">Finance &amp; Logistics</div>
                <div className="text-[10px] text-zinc-400 mt-0.5 font-sans">Tailor lease rates, warranty &amp; delivery options</div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

        </div>
      </div>
    </motion.div>
  );
}
