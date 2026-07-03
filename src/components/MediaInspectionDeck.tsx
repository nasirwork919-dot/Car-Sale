import React, { useState } from 'react';
import { Play, Activity, FileText, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MediaInspectionDeckProps {
  images: string[];
  vehicleMake: string;
}

export default function MediaInspectionDeck({ images, vehicleMake }: MediaInspectionDeckProps) {
  const [mediaDeckTab, setMediaDeckTab] = useState<'gallery' | 'video'>('gallery');
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoType, setVideoType] = useState<'walkaround' | 'inspection' | 'damage'>('walkaround');

  return (
    <motion.div 
      whileHover={{ 
        y: -4, 
        scale: 1.005,
        boxShadow: "0 25px 50px -12px rgba(220,38,38,0.06)"
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:border-red-600/30 transition-all duration-300"
    >
      {/* Header Tabs of Deck */}
      <div className="flex items-center justify-start border-b border-zinc-200 bg-white px-3.5 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => { setMediaDeckTab('gallery'); setIsVideoPlaying(false); }}
            className={`px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
              mediaDeckTab === 'gallery' ? 'bg-[#B30000] text-white shadow-none' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-650'
            }`}
          >
            Gallery ({images.length})
          </button>
          <button
            onClick={() => setMediaDeckTab('video')}
            className={`px-4 py-1.5 text-[10px] font-mono font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer ${
              mediaDeckTab === 'video' ? 'bg-[#B30000] text-white shadow-none' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-650'
            }`}
          >
            Inspection Videos
          </button>
        </div>
      </div>

      {/* Main Stream Screen */}
      <div className="relative aspect-video bg-neutral-950 overflow-hidden group">
        {mediaDeckTab === 'gallery' ? (
          <div className="w-full h-full relative">
            <img
              className="w-full h-full object-cover"
              src={images[activePhotoIdx % images.length] || images[0]}
              alt={`${vehicleMake} perspective`}
              referrerPolicy="no-referrer"
            />
            {/* Clean Navigation Overlays */}
            {images.length > 1 && (
              <>
                {/* Arrow navigation buttons */}
                <button
                  type="button"
                  onClick={() => setActivePhotoIdx((prev) => (prev - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#B30000] text-white flex items-center justify-center transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 opacity-100 cursor-pointer shadow-lg z-10 active:scale-90 border border-white/10"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePhotoIdx((prev) => (prev + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#B30000] text-white flex items-center justify-center transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 opacity-100 cursor-pointer shadow-lg z-10 active:scale-90 border border-white/10"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 opacity-90 transition-opacity z-10">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all border border-black/20 cursor-pointer ${activePhotoIdx === idx ? 'bg-white scale-125 font-black' : 'bg-white/40 hover:bg-white/80'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-full relative flex items-center justify-center">
            {!isVideoPlaying ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10 space-y-3">
                <button
                  onClick={() => setIsVideoPlaying(true)}
                  className="w-14 h-14 rounded-full bg-[#B30000] hover:bg-[#4A4A4A] active:scale-95 text-white flex items-center justify-center shadow-lg transition-all cursor-pointer"
                >
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </button>
                <div className="text-center space-y-0.5 px-4">
                  <span className="text-[9.5px] text-white uppercase font-black tracking-widest font-mono block">
                    Initialize Sovereign Telemetric Stream
                  </span>
                  <span className="text-[8px] text-slate-400 font-mono tracking-wider block">
                    {videoType === 'walkaround' ? 'HD Exterior Drone Walkaround Scan' : videoType === 'inspection' ? 'Under-Chassis Multi-Spectral Lift Scan' : 'High-Resolution Collision & Scratch Docs'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-neutral-900 text-white flex flex-col items-center justify-center p-4 z-10">
                <div className="text-center space-y-3.5">
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-dashed border-red-600 border-t-transparent opacity-80" />
                    <Activity className="w-8 h-8 text-red-650 animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs uppercase font-black tracking-widest font-mono text-red-600">
                      Streaming Drone Channel Live
                    </h4>
                    <p className="text-[9px] text-neutral-400 font-sans max-w-[320px] mx-auto leading-normal">
                      {videoType === 'walkaround' 
                        ? '360° high-definition exterior camera loop presenting panel offsets, wheel alignment, and glass seals.' 
                        : videoType === 'inspection' 
                          ? 'Multi-spectral chassis lift scan checking exhaust welds, dry gaskets, dynamic CV boot, and link bushes.' 
                          : 'Proximity surface scanner mapping 2 documented paint flecks on hood. Alignment tolerances verify 100% factory match.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsVideoPlaying(false)}
                    className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-[9px] font-black uppercase rounded-lg border border-neutral-700 cursor-pointer"
                  >
                    Pause Sensor Stream
                  </button>
                </div>
              </div>
            )}
            <img
              className="w-full h-full object-cover opacity-25 absolute inset-0 filter blur-xs"
              src={images[0]}
              alt="drone feed background"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>



      {/* Walkaround Videos Sub-tabs */}
      {mediaDeckTab === 'video' && (
        <div className="p-4 bg-white border-t border-zinc-200 space-y-2">
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-500 block">
            Select Video Channel:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => { setVideoType('walkaround'); setIsVideoPlaying(true); }}
              className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                videoType === 'walkaround' ? 'bg-[#B30000] text-white border-[#B30000]' : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              360° Walkaround
            </button>
            <button
              onClick={() => { setVideoType('inspection'); setIsVideoPlaying(true); }}
              className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                videoType === 'inspection' ? 'bg-[#B30000] text-white border-[#B30000]' : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              Chassis Scan
            </button>
            <button
              onClick={() => { setVideoType('damage'); setIsVideoPlaying(true); }}
              className={`flex-1 py-2 text-[10px] font-mono font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                videoType === 'damage' ? 'bg-[#B30000] text-white border-[#B30000]' : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
              }`}
            >
              Damage Docs
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
