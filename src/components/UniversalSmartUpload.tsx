import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Camera, Check, RefreshCcw, Loader2, QrCode, Phone, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UniversalSmartUploadProps {
  photoKey: string;
  uploadedImageSrc: string | null;
  onUploadSuccess: (dataUrl: string, fileName: string) => void;
  onClear: () => void;
  label?: string;
  description?: string;
  className?: string;
}

export default function UniversalSmartUpload({
  photoKey,
  uploadedImageSrc,
  onUploadSuccess,
  onClear,
  label = "Upload Document",
  description = "Take a high-quality photo using your mobile camera or desktop.",
  className = ""
}: UniversalSmartUploadProps) {
  const [sessionId] = useState(() => 'session_' + Math.random().toString(36).substring(2, 11));
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  
  // Custom camera capture states (for inline mobile camera)
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isUploadingMobile, setIsUploadingMobile] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const nativeFileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Detect if mobile or desktop
  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const mobileRegex = /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
      const isMobileAgent = mobileRegex.test(userAgent);
      const isSmallScreen = window.innerWidth < 768;
      setIsMobile(isMobileAgent || isSmallScreen);
    };

    detectDevice();
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  // 2. Generate QR code for Desktop
  useEffect(() => {
    if (!isMobile && !uploadedImageSrc) {
      const origin = window.location.origin;
      const path = window.location.pathname;
      const mobileUploadUrl = `${origin}${path}?mobile-upload=true&sessionId=${sessionId}&photoKey=${photoKey}`;
      
      QRCode.toDataURL(mobileUploadUrl, {
        margin: 1,
        width: 140,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
        .then(url => {
          setQrCodeDataUrl(url);
          setIsPolling(true);
        })
        .catch(err => {
          console.error("QR Code generation error:", err);
        });
    } else {
      setIsPolling(false);
    }
  }, [isMobile, sessionId, photoKey, uploadedImageSrc]);

  // 3. Desktop polling to check for mobile uploads
  useEffect(() => {
    if (!isPolling || isMobile || uploadedImageSrc) return;

    let timer: NodeJS.Timeout;
    const checkSyncStatus = async () => {
      try {
        const res = await fetch(`/api/photo-sync/session/${sessionId}`);
        const data = await res.json();
        if (data.success && data.photos && data.photos[photoKey]) {
          const base64Image = data.photos[photoKey];
          onUploadSuccess(base64Image, `${photoKey}_synced.jpg`);
          setIsPolling(false);
        }
      } catch (err) {
        console.error("Error checking mobile upload sync:", err);
      }
    };

    timer = setInterval(checkSyncStatus, 2000);
    return () => clearInterval(timer);
  }, [isPolling, isMobile, sessionId, photoKey, uploadedImageSrc, onUploadSuccess]);

  // 4. Custom Mobile Camera API
  const startMobileCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(err => console.error("Video element play error:", err));
      }
    } catch (err) {
      console.warn("Direct stream failed, trying fallback input", err);
      // Fallback: trigger native forced camera capture input click
      setIsCameraActive(false);
      nativeFileInputRef.current?.click();
    }
  };

  const stopMobileCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        stopMobileCamera();
        onUploadSuccess(dataUrl, `${photoKey}_captured.jpg`);
      }
    }
  };

  // 5. Fallback native forced capture handler
  const handleNativeCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMobile(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onUploadSuccess(dataUrl, file.name || `${photoKey}_fallback.jpg`);
      setIsUploadingMobile(false);
    };
    reader.onerror = () => {
      setCameraError("Failed to load selected photo.");
      setIsUploadingMobile(false);
    };
    reader.readAsDataURL(file);
  };

  // Cleanup stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  return (
    <div className={`w-full font-sans ${className}`}>
      
      {/* 2D Smooth Wrapper */}
      <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs transition-all duration-300">
        
        {/* Header bar */}
        <div className="bg-zinc-50 border-b border-zinc-150 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#8B0000]" />
            <span className="text-[11px] font-bold text-zinc-800 uppercase tracking-wider">{label}</span>
          </div>
          {uploadedImageSrc && (
            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">
              <Check className="w-3 h-3 stroke-[3.5]" /> Ready
            </span>
          )}
        </div>

        {/* Dynamic State Layout */}
        <div className="p-5 flex flex-col items-center justify-center text-center">
          
          <AnimatePresence mode="wait">
            {uploadedImageSrc ? (
              // Case 1: Image exists (Synced/Uploaded)
              <motion.div 
                key="uploaded-preview"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="w-full space-y-4"
              >
                <div className="relative max-w-xs mx-auto aspect-4/3 rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50 flex items-center justify-center">
                  <img 
                    src={uploadedImageSrc} 
                    alt="Uploaded file preview" 
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={onClear}
                    className="px-4 py-2 border border-zinc-200 text-zinc-700 bg-white hover:bg-zinc-50 hover:text-zinc-950 font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" /> Reset Slot
                  </button>
                </div>
              </motion.div>

            ) : isMobile ? (
              // Case 2: Mobile device view (Direct Camera Capture)
              <motion.div 
                key="mobile-workflow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full py-2 space-y-4"
              >
                {!isCameraActive ? (
                  <div className="space-y-4">
                    <p className="text-[11px] text-zinc-500 max-w-xs mx-auto leading-relaxed">
                      {description} Secure auto-upload uses direct live-camera frames.
                    </p>
                    
                    {/* Native Fallback Input for Camera Capture */}
                    <input 
                      type="file"
                      ref={nativeFileInputRef}
                      accept="image/*"
                      capture="environment"
                      onChange={handleNativeCapture}
                      className="hidden"
                    />

                    <button
                      onClick={startMobileCamera}
                      disabled={isUploadingMobile}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#700000] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                    >
                      {isUploadingMobile ? (
                        <>
                          <Loader2 className="w-4.5 h-4.5 animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <Camera className="w-4.5 h-4.5" /> Open Mobile Camera
                        </>
                      )}
                    </button>
                    
                    {cameraError && (
                      <p className="text-[10px] text-red-650 font-medium">{cameraError}</p>
                    )}
                  </div>
                ) : (
                  // Custom HTML5 Viewfinder View
                  <div className="space-y-4">
                    <div className="relative w-full max-w-sm mx-auto aspect-4/3 bg-black rounded-xl overflow-hidden border border-zinc-800">
                      <video 
                        ref={videoRef}
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                      {/* Grid Guide Overlay */}
                      <div className="absolute inset-x-0 top-1/2 border-b border-white/10 pointer-events-none"></div>
                      <div className="absolute inset-y-0 left-1/2 border-r border-white/10 pointer-events-none"></div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <button
                        onClick={stopMobileCamera}
                        className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={captureFrame}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4 stroke-[3]" /> Capture Photo
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>

            ) : (
              // Case 3: Desktop browser view (QR Code Link to phone)
              <motion.div 
                key="desktop-workflow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex flex-col md:flex-row items-center justify-center gap-6 py-2"
              >
                {/* QR Code Column */}
                <div className="bg-zinc-50 border border-zinc-150 p-3.5 rounded-2xl shadow-inner relative flex flex-col items-center shrink-0">
                  {qrCodeDataUrl ? (
                    <img 
                      src={qrCodeDataUrl} 
                      alt="Scan to upload" 
                      className="w-28 h-28 mix-blend-multiply"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-28 h-28 flex items-center justify-center bg-zinc-100 rounded-lg">
                      <Loader2 className="w-5 h-5 animate-spin text-[#8B0000]" />
                    </div>
                  )}
                  <span className="text-[8px] font-mono font-bold text-zinc-400 mt-2 uppercase tracking-widest flex items-center gap-1">
                    <QrCode className="w-2.5 h-2.5" /> Dynamic QR Link
                  </span>
                </div>

                {/* Info Text Column */}
                <div className="text-center md:text-left space-y-3.5 max-w-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#8B0000] font-black uppercase tracking-widest block font-mono">
                      Fast Mobile Upload Link
                    </span>
                    <h4 className="text-xs font-extrabold text-zinc-800 uppercase tracking-tight">
                      Scan QR code with your phone
                    </h4>
                    <p className="text-[10.5px] text-zinc-500 leading-normal">
                      Scan this code to directly connect your phone's camera. Captured photos will instantly stream onto this screen.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-red-50/40 border border-red-100 px-3 py-2 rounded-xl text-left">
                    <Loader2 className="w-4 h-4 text-[#8B0000] animate-spin shrink-0" />
                    <div>
                      <span className="text-[9px] font-mono font-bold text-zinc-500 block uppercase tracking-wider">Sync State</span>
                      <p className="text-[10px] text-zinc-650 leading-none">Awaiting live mobile sync...</p>
                    </div>
                  </div>

                  {/* Fallback Desktop Input link */}
                  <div className="pt-1.5">
                    <button
                      onClick={() => nativeFileInputRef.current?.click()}
                      className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-wider hover:text-zinc-600 transition-all underline cursor-pointer"
                    >
                      Or upload file manually from computer
                    </button>
                    <input 
                      type="file"
                      ref={nativeFileInputRef}
                      accept="image/*"
                      onChange={handleNativeCapture}
                      className="hidden"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Hidden canvas for video captures */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
