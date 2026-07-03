import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, UserCheck, Smartphone, Camera, QrCode, FileText, UploadCloud,
  CheckCircle, AlertTriangle, RefreshCw, Key, Info, HelpCircle, Landmark,
  ChevronRight, CreditCard, Star, Sparkles, LogIn, Check, Trash2, Eye, ShieldAlert
} from 'lucide-react';

interface MockIdentityDoc {
  idType: string;
  fullName: string;
  documentNumber: string;
  expiryDate: string;
  issuingCountry: string;
  isVerified: boolean;
}

interface MockLicenseDoc {
  licenseNumber: string;
  categories: string[];
  issueDate: string;
  expiryDate: string;
  fullName: string;
}

export default function IdentityCheckPlatform() {
  // Pull current role and verification status from storage
  const [currentRole, setCurrentRole] = useState<string>('guest');
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'uploaded' | 'pending' | 'verified'>('unverified');
  
  // Document states
  const [idDoc, setIdDoc] = useState<MockIdentityDoc | null>(null);
  const [licenseDoc, setLicenseDoc] = useState<MockLicenseDoc | null>(null);
  
  // Interactive wizard states
  const [activeScreen, setActiveScreen] = useState<'id_upload' | 'face_scan' | 'license_store'>('id_upload');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadingDocType, setUploadingDocType] = useState<'passport' | 'id_card'>('passport');
  
  // Face scan simulator states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStep, setCameraStep] = useState<'unstarted' | 'positioning' | 'analyzing' | 'matching' | 'success'>('unstarted');
  const [faceScanSuccess, setFaceScanSuccess] = useState(false);
  
  // Custom driver's license input fields
  const [dlName, setDlName] = useState('');
  const [dlNumber, setDlNumber] = useState('');
  const [dlExpiry, setDlExpiry] = useState('');
  const [dlCategories, setDlCategories] = useState<string[]>(['B']);

  // Logged-in user information (Simulated when logged in)
  const [userEmail, setUserEmail] = useState('');

  // Load initial settings on mount
  useEffect(() => {
    // 1. Detect role and auth status
    const cachedRole = localStorage.getItem('user_role') || 'guest';
    const personalEmail = localStorage.getItem('personal_email') || 'julius.kairy@registry.lt';
    
    // Check if user is logged in
    const isMockLogged = cachedRole !== 'guest';
    setCurrentRole(cachedRole);
    setIsLogged(isMockLogged);
    setUserEmail(personalEmail);

    // 2. Load stored document status
    const verifiedFlag = localStorage.getItem('id_verification_status');
    if (verifiedFlag === 'verified') {
      setVerificationStatus('verified');
    } else if (verifiedFlag === 'pending') {
      setVerificationStatus('pending');
    } else if (verifiedFlag === 'uploaded') {
      setVerificationStatus('uploaded');
    } else {
      setVerificationStatus('unverified');
    }

    const storedDoc = localStorage.getItem('stored_id_doc');
    if (storedDoc) {
      setIdDoc(JSON.parse(storedDoc));
    }

    const storedLicense = localStorage.getItem('stored_license_doc');
    if (storedLicense) {
      setLicenseDoc(JSON.parse(storedLicense));
      const parsed = JSON.parse(storedLicense);
      setDlName(parsed.fullName);
      setDlNumber(parsed.licenseNumber);
      setDlExpiry(parsed.expiryDate);
      setDlCategories(parsed.categories || ['B']);
    }

    // Direct event listener to refresh states if needed
    const handleStorageUpdate = () => {
      const upRole = localStorage.getItem('user_role') || 'guest';
      setCurrentRole(upRole);
      setIsLogged(upRole !== 'guest');
    };
    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, []);

  // Update localStorage helper
  const updateVerificationInStorage = (status: 'unverified' | 'uploaded' | 'pending' | 'verified') => {
    setVerificationStatus(status);
    localStorage.setItem('id_verification_status', status);
    if (status === 'verified') {
      localStorage.setItem('identity_verified', 'true');
      // Fire generic event to let other systems like Marketplace, Rentals know!
      window.dispatchEvent(new CustomEvent('identity-verified-state-change', { detail: true }));
    } else {
      localStorage.removeItem('identity_verified');
      window.dispatchEvent(new CustomEvent('identity-verified-state-change', { detail: false }));
    }
  };

  // Clear current status/docs to reset simulator
  const handleResetVerification = () => {
    if (confirm("Resetting will delete secure test documents and return profile to unverified status. Proceed?")) {
      setIdDoc(null);
      setLicenseDoc(null);
      setDlName('');
      setDlNumber('');
      setDlExpiry('');
      setDlCategories(['B']);
      localStorage.removeItem('stored_id_doc');
      localStorage.removeItem('stored_license_doc');
      updateVerificationInStorage('unverified');
      setActiveScreen('id_upload');
      setCameraStep('unstarted');
      setIsCameraActive(false);
      setFaceScanSuccess(false);
    }
  };

  // Simulate file passport upload & OCR reading
  const triggerDocumentUpload = (type: 'passport' | 'id_card') => {
    setUploadingDocType(type);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Document parsed successfully
            const mockDoc: MockIdentityDoc = type === 'passport' 
              ? {
                  idType: 'International Passport',
                  fullName: 'JULIUS KAIRYS',
                  documentNumber: 'LT981249A',
                  expiryDate: '2032-12-05',
                  issuingCountry: 'LITHUANIA (EEA)',
                  isVerified: true
                }
              : {
                  idType: 'EEA Identity Card',
                  fullName: 'JULIUS KAIRYS',
                  documentNumber: 'LTID88921J',
                  expiryDate: '2031-04-18',
                  issuingCountry: 'LITHUANIA (EEA)',
                  isVerified: true
                };

            setIdDoc(mockDoc);
            localStorage.setItem('stored_id_doc', JSON.stringify(mockDoc));
            setUploadProgress(null);
            updateVerificationInStorage('uploaded');
            setActiveScreen('face_scan');
            alert(`Document uploaded & OCR metadata parsed successfully!\nFull Name Found: "${mockDoc.fullName}"`);
          }, 300);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  // Simulate browser-webcam/companion biometric alignment
  const toggleFaceCamera = () => {
    if (isCameraActive) {
      setIsCameraActive(false);
      setCameraStep('unstarted');
    } else {
      setIsCameraActive(true);
      setCameraStep('positioning');
      setTimeout(() => {
        setCameraStep('analyzing');
        setTimeout(() => {
          setCameraStep('matching');
          setTimeout(() => {
            setCameraStep('success');
            setFaceScanSuccess(true);
            updateVerificationInStorage('verified');
            setTimeout(() => {
              setIsCameraActive(false);
              setActiveScreen('license_store');
            }, 1000);
          }, 2000);
        }, 1500);
      }, 1500);
    }
  };

  // Store Digital Driver's License
  const handleSaveLicense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dlName.trim() || !dlNumber.trim() || !dlExpiry.trim()) {
      alert("Please provide the legal name, driving licence serial string, and regulatory validity threshold.");
      return;
    }

    const newDl: MockLicenseDoc = {
      licenseNumber: dlNumber.toUpperCase(),
      categories: dlCategories,
      issueDate: "2021-02-15",
      expiryDate: dlExpiry,
      fullName: dlName.toUpperCase()
    };

    setLicenseDoc(newDl);
    localStorage.setItem('stored_license_doc', JSON.stringify(newDl));
    alert("Digital Driver License securely saved inside encrypted cookie space and synced with Baltic Highway Patrol ledger.");
  };

  // Helper checkbox category toggle
  const toggleCategory = (cat: string) => {
    if (dlCategories.includes(cat)) {
      setDlCategories(prev => prev.filter(c => c !== cat));
    } else {
      setDlCategories(prev => [...prev, cat]);
    }
  };

  // Simulate prompt to login/register if guest
  const triggerLoginPortal = () => {
    // Dispatch event to go to Sign In page
    const loginEvent = new CustomEvent('navigate-page', { detail: 'signin' });
    window.dispatchEvent(loginEvent);
  };

  return (
    <div className="space-y-8 py-4 px-1 select-none whitespace-normal hover:border-transparent transition-all" id="identity-verification-hub-and-vault">
      
      {/* Brand Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200/50 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-sans">
            Identity Verification Center
          </h1>
        </div>

        {/* Global Reset Switch to easily play with the mock */}
        <div className="flex self-start md:self-center gap-2">
          <button 
            onClick={handleResetVerification}
            className="px-4 py-2 bg-zinc-50 hover:bg-zinc-150 border border-zinc-200 text-zinc-650 text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            <RefreshCw className="w-3 h-3 text-zinc-500" /> Reset Verification State
          </button>
        </div>
      </div>

      {/* Grid: Main sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Verification Dashboard & Interactive Wizard (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">

          {/* SECTION 1: VERIFICATION STATUS DASHBOARD */}
          <div className="bg-white p-6 rounded-3xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 space-y-5">
            <div className="pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wider">
                Identity Status
              </h3>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                Check your current verification level and status below.
              </p>
            </div>

            {/* Dashboard Content for Verified users vs Unverified */}
            {verificationStatus === 'verified' ? (
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex items-start gap-4 text-xs">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-extrabold text-emerald-900 uppercase tracking-wide font-sans">Verification Completed</h4>
                  <p className="text-emerald-700 leading-relaxed font-normal">
                    Your account is fully verified. You are authorized to rent cars, list parts, and complete secure bank transfers.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 text-[10px] text-zinc-500">
                    <span className="bg-white px-2.5 py-1 rounded-full border border-emerald-200 text-emerald-800 font-medium">✓ Passport scanned successfully</span>
                    <span className="bg-white px-2.5 py-1 rounded-full border border-emerald-200 text-emerald-800 font-medium">✓ License stored safely</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200/60 flex items-start gap-4 text-xs">
                <div className="w-10 h-10 rounded-full bg-zinc-400 flex items-center justify-center text-white shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-extrabold text-zinc-700 uppercase tracking-wide font-sans">Not Verified Yet</h4>
                  <p className="text-zinc-650 leading-relaxed font-normal">
                    Please upload your ID card or passport to verify your profile and unlock all features.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* INTERACTIVE SHIELD WIZARD AREA */}
          <div className="bg-white rounded-3xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 overflow-hidden">
            
            {/* Tab switchers */}
            <div className="bg-zinc-50 p-2.5 flex justify-between border-b border-zinc-100 font-sans">
              <button
                onClick={() => setActiveScreen('id_upload')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide rounded-xl transition-all text-center cursor-pointer ${
                  activeScreen === 'id_upload' ? 'bg-white text-[#8B0000] shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                1. Passport Code Scan
              </button>
              <button
                onClick={() => {
                  if (verificationStatus === 'unverified') {
                    alert("Please complete Step 1: Upload and parse your ID / Passport Document first!");
                    return;
                  }
                  setActiveScreen('face_scan');
                }}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide rounded-xl transition-all text-center cursor-pointer relative ${
                  activeScreen === 'face_scan' ? 'bg-white text-[#8B0000] shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                } ${verificationStatus === 'unverified' ? 'opacity-55 cursor-not-allowed' : ''}`}
              >
                2. Live Biometric Cross-Match
              </button>
              <button
                onClick={() => setActiveScreen('license_store')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide rounded-xl transition-all text-center cursor-pointer ${
                  activeScreen === 'license_store' ? 'bg-white text-[#8B0000] shadow-sm' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                3. Licence Digital Wallet
              </button>
            </div>

            {/* WIZARD CONTENT WINDOW */}
            <div className="p-6">
                         {/* STEP 1 CONTENT: ID UPLOAD */}
              {activeScreen === 'id_upload' && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="max-w-xl">
                    <h4 className="text-sm font-bold text-neutral-900 tracking-tight">Passport & ID Card Scanner</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-normal mt-1">
                      Our secure scanner reads your document details automatically. Your documents are private and safely stored.
                    </p>
                  </div>

                  {/* Drag and Drop simulate panel */}
                  <div className="border-2 border-dashed border-zinc-200 hover:border-[#8B0000] bg-zinc-50/50 p-8 rounded-3xl text-center space-y-4 hover:bg-zinc-50 transition-all duration-300 relative shadow-inner">
                    {uploadProgress !== null ? (
                      <div className="py-6 space-y-4 max-w-xs mx-auto">
                        <RefreshCw className="w-8 h-8 text-[#8B0000] animate-spin mx-auto" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-zinc-700">Reading document details ({uploadProgress}%)</p>
                          <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#8B0000] transition-all rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <UploadCloud className="w-12 h-12 text-[#8B0000]/60 mx-auto" />
                        <div>
                          <p className="text-xs font-bold text-zinc-800">Drag your ID file here, or click to choose</p>
                          <p className="text-[10px] text-zinc-400 mt-1 font-normal">Supports PDF, PNG and JPG images (Max: 8 MB)</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                          <button
                            onClick={() => triggerDocumentUpload('passport')}
                            className="px-4 py-2 bg-zinc-950 hover:bg-neutral-900 text-white font-semibold text-[11px] rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                          >
                            Simulate Passport Upload
                          </button>
                          <button
                            onClick={() => triggerDocumentUpload('id_card')}
                            className="px-4 py-2 bg-white hover:bg-neutral-50 border border-zinc-200 text-zinc-800 font-semibold text-[11px] rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
                          >
                            Simulate ID Card Upload
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {idDoc && (
                    <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/60 text-xs flex flex-col md:flex-row gap-4 items-start justify-between font-mono">
                      <div className="space-y-1.5">
                        <p className="font-bold text-[#8B0000] text-[10px] uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Scanned Document Details:
                        </p>
                        <p className="text-zinc-800">Type: <strong className="text-zinc-950 font-sans">{idDoc.idType}</strong></p>
                        <p className="text-zinc-800">Name: <strong className="text-zinc-950 font-sans">{idDoc.fullName}</strong></p>
                        <p className="text-zinc-800">Number: <strong className="text-zinc-950 font-sans uppercase">{idDoc.documentNumber}</strong></p>
                        <p className="text-zinc-800">Country: <strong className="text-zinc-950 font-sans">{idDoc.issuingCountry}</strong></p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-zinc-150 flex items-center gap-2 shadow-2xs">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] text-zinc-650 font-bold">Passed global security checks</span>
                      </div>
                    </div>
                  )}
                  
                  {verificationStatus === 'uploaded' && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => setActiveScreen('face_scan')}
                        className="px-5 py-2.5 bg-[#8B0000] hover:bg-[#730000] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
                      >
                        Proceed to Face Scan <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2 CONTENT: LIVE FACE SCANNER */}
              {activeScreen === 'face_scan' && (
                <div className="space-y-6 animate-in fade-in duration-300 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 tracking-tight">
                          Face Scan Verification
                        </h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-normal mt-1">
                          Match your face with your document to verify your identity. This prevents identity theft and secures your profile.
                        </p>
                      </div>

                      {/* Companion instructions */}
                      <div className="p-4 bg-zinc-50 border border-zinc-200/50 rounded-2xl space-y-2 shadow-inner">
                        <span className="font-bold text-zinc-700 uppercase tracking-wide text-[10px] block">
                          📲 Scan with Mobile App
                        </span>
                        <div className="flex items-center gap-4">
                          <div className="bg-white p-2 rounded-xl border border-zinc-200 shadow-sm shrink-0">
                            <QrCode className="w-16 h-16 text-zinc-800" />
                          </div>
                          <div>
                            <p className="text-[11px] text-zinc-600 leading-normal font-medium">
                              Scan this QR code with your phone to open our mobile scanner instantly.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={toggleFaceCamera}
                          className="w-full mt-1.5 py-3.5 bg-zinc-950 hover:bg-neutral-900 text-white font-extrabold text-[11px] uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
                        >
                          <Camera className="w-4 h-4 text-zinc-200" /> 
                          {isCameraActive ? "Deactivate Camera Lens" : "Start Live Face Scanner"}
                        </button>
                      </div>
                    </div>

                    {/* Interactive Camera Simulator Frame */}
                    <div className="border border-zinc-200/80 rounded-3xl p-4 bg-zinc-900/95 text-center flex flex-col justify-center items-center h-[340px] text-white relative overflow-hidden shadow-2xl">
                      {isCameraActive ? (
                        <div className="relative w-full h-full flex flex-col justify-between p-2">
                          
                          {/* Top bar status */}
                          <div className="flex justify-between items-center bg-black/60 backdrop-blur px-3 py-1.5 rounded-xl border border-white/5 text-[9px] font-mono tracking-widest text-[#8B0000] z-20">
                            <span>LIVE_CAMERA_CHANNEL</span>
                            <span className="animate-pulse text-[#8B0000]">● SCANNING</span>
                          </div>

                          {/* Dynamic holographic biometric overlay frame */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                            <div className="w-[160px] h-[220px] rounded-full border-2 border-dashed border-[#8B0000] relative animate-pulse">
                              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-[#8B0000]/50 animate-bounce"></div>
                            </div>
                          </div>

                          {/* Matching message state overlays */}
                          <div className="z-10 bg-black/70 p-4 rounded-2xl mx-6 space-y-1 border border-white/5 shadow-md">
                            {cameraStep === 'positioning' && (
                              <p className="text-[10px] font-mono text-zinc-300">Position your face inside the center guidelines...</p>
                            )}
                            {cameraStep === 'analyzing' && (
                              <p className="text-[10px] font-mono text-amber-400">Scanning and verifying...</p>
                            )}
                            {cameraStep === 'matching' && (
                              <p className="text-[10px] font-mono text-indigo-400 animate-pulse">Matching face with document...</p>
                            )}
                            {cameraStep === 'success' && (
                              <p className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Verification Successful!</p>
                            )}
                          </div>

                          {/* Simulated Face Image Mock */}
                          <img 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCu8732s9UqLpxzPThvYvEWeW0S2T5iO_I6G2K54Y-w1S8k779-uTz80o08X7V-JWeK96AXY09jVxXz2X8-VwY7zT9I8NEXXw=s300"
                            alt="Face matching simulation stream feed"
                            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3 p-6">
                          <Smartphone className="w-10 h-10 text-neutral-400 mx-auto animate-bounce" />
                          <p className="text-xs font-bold font-mono text-zinc-200">Viewfinder Lens Standby Mode</p>
                          <p className="text-[11px] text-zinc-500 font-normal leading-relaxed max-w-xs mx-auto">
                            Camera simulator or phone scanner is ready. Click the button on the left to start face scan verification.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3 CONTENT: DIGIT LICENCE STORES */}
              {activeScreen === 'license_store' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="max-w-xl text-xs">
                    <h4 className="text-sm font-bold text-neutral-900 tracking-tight font-sans">Digital Driver's License Wallet</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed font-normal mt-1">
                      Save your driving license details securely. This information will be used to auto-fill your rental bookings safely.
                    </p>
                  </div>

                  {/* Vault form & Flip Card representation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Input Licence Form */}
                    <form onSubmit={handleSaveLicense} className="bg-zinc-50 p-5 rounded-3xl border border-zinc-200/60 space-y-4 text-xs shadow-inner">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Full Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. JULIUS KAIRYS"
                          value={dlName}
                          onChange={(e) => setDlName(e.target.value)}
                          className="w-full bg-white border border-zinc-200 p-2.5 rounded-xl font-medium outline-none text-zinc-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">License Number</label>
                        <input 
                          type="text" 
                          placeholder="e.g. LT0291492"
                          value={dlNumber}
                          onChange={(e) => setDlNumber(e.target.value)}
                          className="w-full bg-white border border-zinc-200 p-2.5 rounded-xl font-mono uppercase outline-none text-zinc-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-[#8B0000] uppercase tracking-widest block">Expiry Date</label>
                        <input 
                          type="date" 
                          value={dlExpiry}
                          onChange={(e) => setDlExpiry(e.target.value)}
                          className="w-full bg-white border border-zinc-200 p-2.5 rounded-xl font-semibold outline-none text-zinc-800"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">License Categories</label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {['A', 'B', 'BE', 'C', 'CE', 'D'].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => toggleCategory(cat)}
                              className={`px-3 py-1.5 rounded-lg border text-[10px] font-extrabold tracking-wider transition-all duration-150 cursor-pointer ${
                                dlCategories.includes(cat) 
                                  ? 'bg-[#8B0000] border-[#8B0000] text-white shadow-sm' 
                                  : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                              }`}
                            >
                              Class {cat}
                            </button>
                          ))}
                        </div>
                        <p className="text-[9px] text-zinc-400 leading-normal font-normal max-w-sm mt-1">
                          Select the categories printed on your physical license card to authorize your profile for rentals.
                        </p>
                      </div>

                      <button
                        type="submit"
                        className="w-full h-11 bg-zinc-950 hover:bg-neutral-900 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Save & Encrypt License Data
                      </button>
                    </form>

                    {/* Virtual ID Card Graphic */}
                    <div className="bg-gradient-to-tr from-zinc-900 to-zinc-950 p-[1.5px] rounded-3xl shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 relative min-h-[220px] text-white overflow-hidden flex flex-col justify-between">
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <span className="text-[8px] font-mono tracking-widest text-[#8B0000] uppercase font-bold block">
                              VIRTUAL DRIVER'S LICENSE
                            </span>
                            <span className="text-sm font-extrabold text-white tracking-wide block">
                              Digital Driver Card
                            </span>
                          </div>
                          <div className="w-10 h-7 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-xs">
                            EU
                          </div>
                        </div>

                        {licenseDoc ? (
                          <div className="space-y-3 font-mono text-[10px]">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[8px] text-zinc-500 uppercase block font-semibold">NAME</span>
                                <span className="text-zinc-100 font-sans font-bold text-xs">{licenseDoc.fullName}</span>
                              </div>
                              <div>
                                <span className="text-[8px] text-zinc-500 block uppercase font-semibold">LICENSE NUMBER</span>
                                <span className="text-zinc-100 font-mono tracking-wider font-bold text-xs">{licenseDoc.licenseNumber}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[8px] text-zinc-500 block uppercase font-semibold">CATEGORIES</span>
                                <div className="flex gap-1.5 mt-1">
                                  {licenseDoc.categories.map((cat) => (
                                    <span key={cat} className="px-2 py-0.5 bg-[#8B0000]/25 text-white text-[9px] font-extrabold rounded font-sans border border-[#8B0000]/30">
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-[8px] text-zinc-500 block uppercase font-semibold">EXPIRY DATE</span>
                                <span className="text-zinc-100 font-semibold">{licenseDoc.expiryDate}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-zinc-500 space-y-1.5 flex flex-col justify-center items-center">
                            <CreditCard className="w-10 h-10 text-neutral-600 animate-pulse" />
                            <p className="text-[11px] font-bold font-sans">Digital License Standby</p>
                            <p className="text-[9px] font-normal font-sans max-w-xs leading-relaxed">
                              Fill out the form on the left and save to preview your digital driver's license here.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Chip contact and watermark decoration */}
                      <div className="px-5 py-3 bg-zinc-850/60 border-t border-white/5 flex justify-between items-center text-[8px] text-zinc-500 font-mono">
                        <span>SECURE CHIP / SIGNED BY SYSTEM</span>
                        <span>0100 1102 9982</span>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Statutory Legal Warnings & Verification FAQ (4 Columns) */}
        <div className="lg:col-span-4 space-y-6 text-xs">
          
          {/* SECURE IDENTITY MANDATE CHECKLIST */}
          <div className="bg-white p-6 rounded-3xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#8B0000]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Why verify your identity?
                </h3>
                <p className="text-[10px] text-zinc-400 font-normal">
                  Verification is required for safety and security.
                </p>
              </div>
            </div>

            <div className="space-y-3.5 pt-1.5">
              
              <div className="flex gap-2.5 items-start">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[#8B0000] font-extrabold shrink-0 mt-0.5 text-[9px]">
                  ✓
                </div>
                <div>
                  <p className="font-extrabold text-neutral-900 text-xs">Selling Parts & Vehicles</p>
                  <p className="text-[10.5px] text-zinc-500 leading-relaxed font-normal mt-0.5">
                    We verify identities to prevent fake listings, fraud, and stolen parts.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[#8B0000] font-extrabold shrink-0 mt-0.5 text-[9px]">
                  ✓
                </div>
                <div>
                  <p className="font-extrabold text-neutral-900 text-xs">Renting Cars & Machinery</p>
                  <p className="text-[10.5px] text-zinc-500 leading-relaxed font-normal mt-0.5">
                    To rent a car, you must prove you have a valid driver's license.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 items-start">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-[#8B0000] font-extrabold shrink-0 mt-0.5 text-[9px]">
                  ✓
                </div>
                <div>
                  <p className="font-extrabold text-neutral-900 text-xs">Secure Payments</p>
                  <p className="text-[10.5px] text-zinc-500 leading-relaxed font-normal mt-0.5">
                    Identity checks keep escrow and bank transactions safe from online scammers.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* VERIFICATION FAQ FAQ SECTION */}
          <div className="bg-white p-6 rounded-3xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center">
                <HelpCircle className="w-4 h-4 text-zinc-650" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Frequently Asked Questions
                </h3>
                <p className="text-[10px] text-zinc-400 font-normal">
                  Simple answers to common security questions.
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-1 text-[11px] font-normal leading-relaxed text-zinc-650">
              <div className="space-y-1">
                <strong className="text-neutral-900 font-semibold block">Are my documents safe with you?</strong>
                <p>
                  Yes. Your uploaded documents are parsed directly inside your browser and never sold or shared with anyone.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-neutral-900 font-semibold block">What if face verification fails?</strong>
                <p>
                  Please make sure your face is clearly visible, with good lighting, and no direct glare on your camera lens.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-neutral-900 font-semibold block">Do I still need my physical license?</strong>
                <p>
                  Yes. This digital wallet is only for auto-filling reservations inside our app. You must always carry your physical license on public roads.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
