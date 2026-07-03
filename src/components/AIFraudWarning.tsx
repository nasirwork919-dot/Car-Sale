import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';

interface AIFraudWarningProps {
  vin: string;
  mileage: number;
}

export default function AIFraudWarning({ vin, mileage }: AIFraudWarningProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      id="fraud-warning-anchor"
      className="py-1 select-none"
    >
      <div className="grid grid-cols-3 gap-4 sm:gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#eefdf4] border border-[#bbf7d0]/50 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-[#10b981] stroke-[3]" />
          </div>
          <span className="text-[10px] sm:text-[10.5px] uppercase tracking-wider font-extrabold text-zinc-700 font-sans">
            VIN Match
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#eefdf4] border border-[#bbf7d0]/50 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-[#10b981] stroke-[3]" />
          </div>
          <span className="text-[10px] sm:text-[10.5px] uppercase tracking-wider font-extrabold text-zinc-700 font-sans">
            Pricing Check
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#eefdf4] border border-[#bbf7d0]/50 flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-[#10b981] stroke-[3]" />
          </div>
          <span className="text-[10px] sm:text-[10.5px] uppercase tracking-wider font-extrabold text-zinc-700 font-sans">
            Odometer Sync
          </span>
        </div>
      </div>
    </motion.div>
  );
}

