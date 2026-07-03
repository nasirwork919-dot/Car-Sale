import React from 'react';
import { Star, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function SellerProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      id="seller-profile-anchor"
      className="bg-white border border-zinc-200/60 rounded-[24px] p-6 space-y-4 shadow-sm select-none"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#10b981]">
            Verified Partner
          </span>
          <h4 className="text-[15px] font-black text-zinc-900 leading-tight font-sans">
            Premier Dealer Group Inc
          </h4>
        </div>
      </div>

      {/* Ratings display */}
      <div className="flex items-center gap-2 py-3 border-t border-b border-zinc-100">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          ))}
        </div>
        <span className="text-xs font-black text-zinc-800 pt-0.5">4.9</span>
        <span className="text-[10px] text-zinc-400 font-bold font-sans">(284 Verified Reviews)</span>
      </div>

      {/* Location & Link - Plain & Easy */}
      <div className="space-y-2.5 text-xs font-sans">
        <div className="flex justify-between items-center text-zinc-550">
          <span className="font-medium">Location:</span>
          <span className="font-extrabold text-zinc-800 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Houston, TX
          </span>
        </div>
        <div className="flex justify-between items-center text-zinc-550">
          <span className="font-medium">Website:</span>
          <a
            href="https://www.premierdealergroup.com"
            target="_blank"
            rel="noreferrer"
            className="font-extrabold text-zinc-850 hover:text-[#8B0000] hover:underline transition-all flex items-center gap-1"
          >
            premierdealergroup.com <ExternalLink className="w-3 h-3 text-zinc-400" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
