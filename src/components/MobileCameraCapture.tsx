import React, { useState, useRef, useEffect } from 'react';
import { Camera, Check, RefreshCcw, Loader2, AlertCircle, SwitchCamera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileCameraCaptureProps {
  sessionId: string;
}

interface PhotoPrompt {
  key: string;
  title: string;
  desc: string;
}

const PHOTO_PROMPTS: PhotoPrompt[] = [
  {
    key: 'hero',
    title: 'Front View (Hero Shot)',
    desc: 'Take a diagonal photo from the front wheels side.'
  },
  {
    key: 'rear',
    title: 'Rear View',
    desc: 'Take a centered photo from the back of the car.'
  },
  {
    key: 'dash',
    title: 'Dashboard & Mileage',
    desc: 'Take a photo showing the current mileage cluster.'
  },
  {
    key: 'engine',
    title: 'Under the Hood',
    desc: 'Take a clean photo of the engine components.'
  },
  {
    key: 'interior',
    title: 'Interior Seats & Console',
    desc: 'Take a photo of the front seating rows.'
  },
  {
    key: 'doc_registration',
    title: 'State Registration Certificate',
    desc: 'Capture a clear proof shot of official ownership registration.'
  },
  {
    key: 'doc_serviceLogs',
    title: 'Full Service Records Logbook',
    desc: 'Capture physical service logs, maintenance logs or receipts.'
  },
  {
    key: 'doc_warrantyCert',
    title: 'Warranty Policy Document',
    desc: 'Capture physical warranty terms coverage certificate.'
  }
];

export default function MobileCameraCapture({ sessionId }: MobileCameraCaptureProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<PhotoPrompt | null>(null);
  
  // Real-time slot status indicating if uploaded
  const [uploadedKeys, setUploadedKeys] = useState<Record<string, boolean>>({});
  const [initialLoading, setInitialLoading] = useState(true);

  // Live Camera states
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-activate prompt based on URL parameter on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialKey = params.get('photoKey');
    if (initialKey) {
      let match = PHOTO_PROMPTS.find(p => p.key === initialKey);
      if (!match) {
        // Construct a dynamic prompt for custom upload fields
        const formattedTitle = initialKey
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
        match = {
          key: initialKey,
          title: formattedTitle,
          desc: 'Capture a clear, high-quality photo using your camera.'
        };
      }
      setSelectedPrompt(match);
      setTimeout(() => {
        startCamera('environment');
      }, 500);
    }
  }, []);

  // Fetch already uploaded photo slots for this session
  useEffect(() => {
    async function checkSessionStatus() {
      try {
        if (!sessionId) return;
        const res = await fetch(`/api/photo-sync/session/${sessionId}`);
        const data = await res.json();
        if (data.success && data.photos) {
          const statuses: Record<string, boolean> = {};
          Object.keys(data.photos).forEach(key => {
            if (data.photos[key]) {
              statuses[key] = true;
            }
          });
          setUploadedKeys(statuses);
        }
      } catch (err) {
        console.error("Error loading session:", err);
      } finally {
        setInitialLoading(false);
      }
    }
    checkSessionStatus();
    
    // Poll status every 4 seconds so if photos are deleted/changed they stay synced on mobile
    const interval = setInterval(checkSessionStatus, 4000);
    return () => clearInterval(interval);
  }, [sessionId]);

  // Handle stream cleanup
  const stopStream = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  // Launch live camera view
  const startCamera = async (mode: 'user' | 'environment' = 'environment') => {
    setErrorMsg(null);
    setCapturedPhoto(null);
    stopStream();

    try {
      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setCameraActive(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => {
          console.error("Video play failed:", err);
        });
      }
    } catch (err: any) {
      console.warn("Direct stream request failed, retrying with broader options:", err);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
        setCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error(e));
        }
      } catch (fallbackErr) {
        setErrorMsg("Camera access is blocked. Please grant camera permission on your browser settings to capture verification photos.");
      }
    }
  };

  // Toggle front/back camera
  const handleToggleCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Snap the photo from canvas
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        if (facingMode === 'user') {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        if (facingMode === 'user') {
          context.setTransform(1, 0, 0, 1, 0, 0);
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(dataUrl);
        stopStream();
      }
    }
  };

  // Save base64 photo via API
  const handleUploadPhoto = async () => {
    if (!capturedPhoto || !selectedPrompt || !sessionId) return;
    setIsUploading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/photo-sync/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          photoKey: selectedPrompt.key,
          imageBytes: capturedPhoto
        })
      });

      const data = await res.json();
      if (data.success) {
        setUploadedKeys(prev => ({ ...prev, [selectedPrompt.key]: true }));
        setCameraActive(false);
        setCapturedPhoto(null);
        setSelectedPrompt(null);
      } else {
        setErrorMsg(data.error || "Upload failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network or server connection failed. Please check connection.");
    } finally {
      setIsUploading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-8 h-8 text-[#8B0000] animate-spin mb-3" />
        <span className="text-xs font-black uppercase tracking-widest text-slate-500">Loading sync portal...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 flex flex-col justify-between select-none">
      
      {/* Top Banner & Title: Clean, icon-free layout */}
      <header className="py-4 border-b border-slate-200/60 flex justify-between items-center px-2">
        <div className="flex items-center">
          <span className="text-[11px] uppercase font-black tracking-widest text-[#8B0000]">LIVE AUTO DESK SYNC</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-bold">SESSION: {sessionId.substring(0, 8)}...</span>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-6 flex flex-col justify-center max-w-md mx-auto w-full">
        {!selectedPrompt ? (
          <div className="space-y-6">
            <div className="text-center space-y-2 pb-2">
              <h2 className="text-2xl font-black tracking-tight text-slate-900">Active Camera Portal</h2>
              <p className="text-[11px] text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                Choose a camera slot below. Photos captured in real-time transfer automatically back to your desktop workspace.
              </p>
            </div>

            {/* List photo prompts */}
            <div className="space-y-3">
              {PHOTO_PROMPTS.map((prompt) => {
                const isAttached = !!uploadedKeys[prompt.key];
                return (
                  <button
                    key={prompt.key}
                    onClick={() => {
                      setSelectedPrompt(prompt);
                      startCamera('environment');
                    }}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer ${
                      isAttached 
                        ? 'bg-emerald-50/40 border-emerald-200 text-emerald-900' 
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1 pr-4">
                      <span className="text-[13px] font-extrabold tracking-tight block text-slate-900">
                        {prompt.title}
                      </span>
                      <p className="text-[10.5px] text-slate-500 font-normal leading-normal">
                        {prompt.desc}
                      </p>
                    </div>
                    
                    <div className="shrink-0 flex items-center">
                      {isAttached ? (
                        <span className="text-[9px] uppercase font-black text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md tracking-wider">Synced</span>
                      ) : (
                        <span className="text-[9px] uppercase font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-md tracking-wider">Required</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Prompt Viewfinder/Capture container */
          <div className="space-y-5">
            
            {/* Header info */}
            <div className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="space-y-0.5">
                <span className="text-[8.5px] uppercase font-black text-slate-400 tracking-wider">CAPTURING FOR</span>
                <h4 className="text-[12.5px] font-black text-slate-900">{selectedPrompt.title}</h4>
              </div>
              <button
                onClick={() => {
                  stopStream();
                  setCameraActive(false);
                  setCapturedPhoto(null);
                  setSelectedPrompt(null);
                }}
                className="text-slate-650 hover:text-slate-950 text-[10px] font-black uppercase tracking-wider bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg active:scale-95 transition-all"
              >
                Cancel
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-900 rounded-xl p-3 text-[11px] flex gap-2 items-start font-medium leading-relaxed">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Show viewfinder or captured image */}
            <div className="relative aspect-4/3 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-lg flex items-center justify-center">
              
              {/* Direct Live Stream Status block only */}
              {!cameraActive && !capturedPhoto && (
                <div className="p-6 text-center space-y-4">
                  <Camera className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <span className="text-[12.5px] font-extrabold text-slate-800 block">Connecting to Live Feed</span>
                    <p className="text-[10px] text-slate-500 font-sans max-w-xs mx-auto leading-relaxed">
                      Please allow browser camera permissions. Secure auto-sync protocols restrict previous file uploads or gallery selection.
                    </p>
                  </div>
                  <button
                    onClick={() => startCamera(facingMode)}
                    className="inline-flex justify-center items-center px-4 py-2 bg-[#8B0000] hover:bg-zinc-800 rounded-lg text-[10px] font-black uppercase tracking-widest text-white active:scale-95 transition-all cursor-pointer"
                  >
                    Activate Camera
                  </button>
                </div>
              )}

              {/* Viewfinder block */}
              {cameraActive && !capturedPhoto && (
                <div className="w-full h-full relative">
                  <video 
                    ref={videoRef} 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  {/* Grid Overlay */}
                  <div className="absolute inset-x-0 top-1/3 border-b border-white/20 pointer-events-none"></div>
                  <div className="absolute inset-x-0 top-2/3 border-b border-white/20 pointer-events-none"></div>
                  <div className="absolute inset-y-0 left-1/3 border-r border-white/20 pointer-events-none"></div>
                  <div className="absolute inset-y-0 left-2/3 border-r border-white/20 pointer-events-none"></div>
                  
                  {/* Floating Toggle Camera Button */}
                  <button 
                    onClick={handleToggleCamera}
                    type="button"
                    className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white rounded-full p-2.5 active:scale-95 transition-all cursor-pointer border border-white/10"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Review block */}
              {capturedPhoto && (
                <img 
                  src={capturedPhoto} 
                  alt="Captured vehicle shot" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Bottom Panel Controls for Active Cam */}
            <div className="flex flex-col gap-3">
              {cameraActive && !capturedPhoto ? (
                <button
                  onClick={handleCapture}
                  className="w-16 h-16 rounded-full border-4 border-slate-350 bg-white hover:scale-105 active:scale-95 transition-all mx-auto flex items-center justify-center cursor-pointer shadow-md"
                >
                  <div className="w-11 h-11 rounded-full bg-[#8B0000]"></div>
                </button>
              ) : capturedPhoto ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setCapturedPhoto(null);
                      startCamera(facingMode);
                    }}
                    disabled={isUploading}
                    className="py-3 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-black uppercase tracking-widest text-slate-800 disabled:opacity-50 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5 px-4"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" /> Retake
                  </button>
                  <button
                    onClick={handleUploadPhoto}
                    disabled={isUploading}
                    className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5 px-4 shadow-sm"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Syncing...
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[4.5]" /> Confirm Sync
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="text-center pt-2">
                  <button
                    onClick={() => startCamera(facingMode)}
                    className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    Reload Feed
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </main>

      {/* Footer Branding: Clean and Icon-free */}
      <footer className="py-4 border-t border-slate-200/60 text-center flex items-center justify-center">
        <span className="text-[10px] text-slate-400 font-mono tracking-wider">SECURE PHOTO-CHAIN TELEMETRY ENFORCED</span>
      </footer>

      {/* Hidden layout elements for background canvas snaps */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
