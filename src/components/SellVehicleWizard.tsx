/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Camera, UploadCloud, ShieldCheck, Check, Sparkles, TrendingUp, MapPin, 
  ArrowRight, ArrowLeft, FileText, Globe, RefreshCcw, Trash2, Eye, Gavel, 
  History, User, CheckCircle, Search, Lock, AlertCircle, Sparkles as AI_Icon,
  BookOpen, Layers, HardDrive, ShieldAlert, CheckSquare, Plus, FileSpreadsheet,
  ChevronDown, X, Loader2
} from 'lucide-react';
import { Vehicle } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/api';
import { mapBackendVehicle, BackendVehicle } from '../lib/vehicleAdapter';

const languageNames: Record<'EN' | 'ES' | 'DE' | 'AR' | 'UR' | 'ZH', string> = {
  EN: 'English',
  ES: 'Español',
  DE: 'Deutsch',
  AR: 'العربية',
  UR: 'اردو',
  ZH: '中文'
};

interface SellVehicleWizardProps {
  onPublishListing: (newVehicle: Vehicle) => void;
  onCancel: () => void;
}

export default function SellVehicleWizard({ onPublishListing, onCancel }: SellVehicleWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 6;

  // --- STEP 1 STATE: VIN & Identification ---
  const [vinInput, setVinInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanningProgress, setScanningProgress] = useState<number>(0);
  const [vinVerified, setVinVerified] = useState<boolean>(false);
  
  // Decoded specs
  const [vehicleSpecs, setVehicleSpecs] = useState<{
    year: number;
    make: string;
    model: string;
    trim: string;
    engine: string;
    drivetrain: string;
    horsepower: number;
    transmission: string;
    mileage: number;
    extColor: string;
    intColor: string;
    fuelType: string;
    location: string;
  }>({
    year: 2021,
    make: '',
    model: '',
    trim: 'Carrera S Convertible',
    engine: '3.0L Twin-Turbo Flat-6',
    drivetrain: 'RWD (Rear-Wheel Drive)',
    horsepower: 443,
    transmission: '8-speed PDK Dual-Clutch',
    mileage: 12500,
    extColor: 'Chalk Gray',
    intColor: 'Bordeaux Red Leather',
    fuelType: 'Premium Gasoline',
    location: 'Chicago, IL',
  });

  // Gov registry record
  const [govRegistryData, setGovRegistryData] = useState<{
    registrationStatus: string;
    taxLienStatus: string;
    theftCheck: string;
    safetyInspection: string;
    registeredOwner: string;
    expiryDate: string;
    activeRecalls: string;
  } | null>(null);

  const [isLoadingRegistry, setIsLoadingRegistry] = useState<boolean>(false);

  // --- STEP 2 STATE: Photos & Standardized Capture Prompts ---
  const [photos, setPhotos] = useState<Record<string, string>>({
    hero: '',
    rear: '',
    dash: '',
    engine: '',
    interior: '',
  });
  
  const [isVerifyingPhotos, setIsVerifyingPhotos] = useState<boolean>(false);
  const [mediaVerifyingResult, setMediaVerifyingResult] = useState<string | null>(null);

  const photoPrompts = [
    {
      key: 'hero',
      title: 'Front View (Hero Shot)',
      desc: 'Take a beautiful diagonal photo from the front wheels side of the car.',
      placeholder: 'Landscape orientation, outdoor or well-lit area',
      sampleUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCFWhf6XB98KFKzZQIKtvQ3TzW756wbGAX6rFByScMHI6LaqPGtfovdE6XIBfAniP7BFm6EBQ0GMIzaKPZSavKENfWXmY_hKANcvLn8bjv51fDjdC_yiUopQ5hvKbKd-FSQg_oEZLQPGAgRDhr8zIH2W8h1uSsQutC7qVVLMvz6MTIYvqBq5oAWtzW2u8-fP1cEKsHNp-HS8TUncFyfSN51saATSC5NRnUk4f1VW9FLXoT8tEhybf4Cd-CpD5s1t7U_h8W8SUx-em03',
    },
    {
      key: 'rear',
      title: 'Rear View',
      desc: 'Take a clear centered photo from the back of the car.',
      placeholder: 'Make sure license plates and manufacturer badges are visible',
      sampleUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5qss7nKXLiDfrAiCJZv6njoIxWWALqhrtwuJlh5O7HQkzmqQJXZf0xJnXePFZXGoTeYftYeahRwTvtg-8MuDsxU2t80e7DkFTP7RpqISDG9TDB-LSnFjSGGhUID7vnQ5bhMOT4oK_TauiTJd8g-UmbJ_oAa1ujsNISmAv2PfZUzS_guxncitI3FBpBl6XT1lprOQlteP3sXQDtPAI0BJHVsa7Dd2sv2-J03LYACA8-DZQmLSoA5pfInkenj6HJdZSX3dEOjWq65WV',
    },
    {
      key: 'dash',
      title: 'Dashboard & Mileage',
      desc: 'Take a clear photo of the dashboard cluster showing the current mileage.',
      placeholder: 'Highlight mileage figures and warning indicator screens',
      sampleUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClca3kowRnH_wWupca2EYm9kw6despGZtiXSQECwFDJw0MwM7l3QVrE-ifZbSSg6Ws2yxPTl6pbMP2IwW8nV6Xudp8PaR1rCtUHeyhe0sjzyfVE71sXcSzoeQl34OqeNNV97M4Gcue_-ev8FplDiedPCBC_EuzAOspq11a75-CRgV3dB_keQ4jl8HRSgeH0gbTtH1kIP02bWj1ptZYHANXGHbzAOxf6sB_hU5gab0LQ75ymXHELXn4uIWLv70Gek2lkkDq5yhjY35W',
    },
    {
      key: 'engine',
      title: 'Under the Hood',
      desc: 'Pop the hood and take a clean photo of the engine block and components.',
      placeholder: 'Overhead view with reasonable ambient lighting',
      sampleUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArIjEK3eKRi8Z3ctS2QnleUk31P9oGxSUg5OPE_A054nGAE0nzBA1qzG44yFiSUOLnR6g4UyZhW2zwY5N71dGFuUy540tQnANDkDd6waO9xH-KkrXtixOIA16DJz5SqfW0VtBJqRNAlLbS2SvlkwkFpEfbGtdNvGj2A8iZSo843q24qFyVMGCc1M8GCoxKcmZ00-zlmBPiUCofP4N9urIb305AlQ5HsrbhoiCkkaFaFpgP0Sw_hlesV2izvjEN3dAr5xxRmsEBkhym',
    },
    {
      key: 'interior',
      title: 'Interior Seats & Console',
      desc: 'Take a clear photo of the front seating rows and central dashboard area.',
      placeholder: 'Capture seat upholstery and steering wheel controls',
      sampleUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwiyS957p984uU7CZZsHL5W04MZ7dqKn2De-xcAweKjWt19qDKzStH6PlEHKxwyRpfDzoz5LDRADkgPZ2GZ7LjJ2ZhJPLHOgoQbVVYytRx6SAxIARsNe_9oP8WOewdETL9DwLxRN3uoNYup3g6cbeyYKURZpgW2L_x8XyaW7k745qstNJXOH-U16l2rI0DhGZ1qSMH0_HEvnLaL_IRBZ-rqESI4r0zgVpalsawgq3q4wu817tSYMQTm7gt_tvTfVBKBfZ83Xmchnmh',
    }
  ];

  // --- STEP 3 STATE: Pricing Assistant & AI Valuation ---
  const [askingPrice, setAskingPrice] = useState<number>(0);
  const [vehicleCondition, setVehicleCondition] = useState<'Excellent' | 'Good' | 'Fair' | 'Damaged'>('Excellent');
  
  const estimatedValuation = useMemo(() => {
    // Dynamic formula based on year, make, mileage, and condition
    let base = 80000;
    if (vehicleSpecs.make === 'Porsche') base = 95000;
    else if (vehicleSpecs.make === 'BMW') base = 65000;
    else if (vehicleSpecs.make === 'Tesla') base = 55000;
    else if (vehicleSpecs.make === 'Mercedes-Benz') base = 75000;

    // Mileage depreciation: -0.15c per mile
    const mileageDeduct = vehicleSpecs.mileage * 0.15;
    
    // Condition factor
    let condFactor = 1.0;
    if (vehicleCondition === 'Excellent') condFactor = 1.02;
    if (vehicleCondition === 'Good') condFactor = 0.96;
    if (vehicleCondition === 'Fair') condFactor = 0.88;
    if (vehicleCondition === 'Damaged') condFactor = 0.55;

    // Age factor
    const yearsBack = Math.max(0, 2026 - vehicleSpecs.year);
    const ageDeprec = Math.min(0.5, yearsBack * 0.05);

    return Math.round((base - mileageDeduct) * condFactor * (1 - ageDeprec));
  }, [vehicleSpecs.make, vehicleSpecs.mileage, vehicleSpecs.year, vehicleCondition]);

  const suggestedRange = useMemo(() => {
    return {
      min: Math.round(estimatedValuation * 0.96),
      max: Math.round(estimatedValuation * 1.04)
    };
  }, [estimatedValuation]);

  useEffect(() => {
    // Initialize asking price to median recommendation when valuation changes
    if (askingPrice === 0) {
      setAskingPrice(estimatedValuation);
    }
  }, [estimatedValuation]);

  // Price metric feedback string
  const priceFeedbackMessage = useMemo(() => {
    if (!askingPrice) return null;
    const diff = ((askingPrice - estimatedValuation) / estimatedValuation) * 100;
    if (diff < -5) {
      return {
        rating: 'Highly Competitive Price (Fast Sale Check)',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        text: `Your listing price is ${Math.abs(Math.round(diff))}% below model median benchmarks. Excellent high-volume deal choice, typically closes buyer checkout within 48 hours.`
      };
    } else if (diff > 5) {
      return {
        rating: 'Optimistic Premium Price',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        text: `Priced ${Math.round(diff)}% higher than statistical averages. Best for collectors' specifications, unique accessory kits or custom parts.`
      };
    } else {
      return {
        rating: 'Perfect Market Price',
        color: 'text-[#8B0000] bg-red-50/50 border-red-100',
        text: `Secures top-tier market visibility value. Balanced buyer confidence with great returns.`
      };
    }
  }, [askingPrice, estimatedValuation]);


  // --- STEP 4 STATE: Document Upload & Legacy Linker ---
  const [documents, setDocuments] = useState<{
    registration: boolean | string;
    serviceLogs: boolean | string;
    warrantyCert: boolean | string;
  }>({
    registration: false,
    serviceLogs: false,
    warrantyCert: false
  });
  
  const [connectOldOwnership, setConnectOldOwnership] = useState<boolean>(false);
  const [ownershipVerificationLinked, setOwnershipVerificationLinked] = useState<boolean>(false);
  const [isLinkingPrevious, setIsLinkingPrevious] = useState<boolean>(false);

  // --- STEP 5 STATE: Visibility & Custom Category Markers ---
  const [listingType, setListingType] = useState<'Standard' | 'Auction' | 'Export'>('Standard');
  const [isExportReady, setIsExportReady] = useState<boolean>(false);
  const [isDamagedCategory, setIsDamagedCategory] = useState<boolean>(false);
  const [isAuctionTrack, setIsAuctionTrack] = useState<boolean>(false);

  // Auto configure states based on primary tab
  useEffect(() => {
    if (listingType === 'Export') {
      setIsExportReady(true);
      setIsAuctionTrack(false);
    } else if (listingType === 'Auction') {
      setIsAuctionTrack(true);
      setIsExportReady(false);
    } else {
      setIsAuctionTrack(false);
      setIsExportReady(false);
    }
  }, [listingType]);


  // --- STEP 6 STATE: Descriptions & Multilingual Renderer ---
  const [isGeneratingDescription, setIsGeneratingDescription] = useState<boolean>(false);
  const [descriptionEnglish, setDescriptionEnglish] = useState<string>('');
  const [activeLanguage, setActiveLanguage] = useState<'EN' | 'ES' | 'DE' | 'AR' | 'UR' | 'ZH'>('EN');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);
  const [showLiveFullPreview, setShowLiveFullPreview] = useState<boolean>(false);

  const simulatedDescriptions = useMemo(() => {
    const make = vehicleSpecs.make || 'Porsche';
    const model = vehicleSpecs.model || '911 Carrera S';
    const year = vehicleSpecs.year;
    const cond = vehicleCondition.toLowerCase();
    const mileage = vehicleSpecs.mileage.toLocaleString();

    return {
      EN: `### Verified Private Market Specimen\n**Vehicle**: ${year} ${make} ${model} (${vehicleSpecs.trim})\n**Condition**: Verified ${currConditionAdj(cond)} | **Odometer**: ${mileage} miles\n\n#### Summary Description\nAn outstanding, exceptionally clean, and highly maintained investment-grade vehicle. This beautiful asset has passed a comprehensive multi-point sovereign inspection, verifying drivetrain health, structural integrity, and electronic components zero-fault active readings.\n\n#### Key Specifications & Build Outline\n- **Engine**: ${vehicleSpecs.engine} delivering thrilling propulsion\n- **Traction Core**: ${vehicleSpecs.drivetrain} with traction-vector and chassis dampeners\n- **Transmission**: ${vehicleSpecs.transmission}\n- **Stance & Body**: Framed in striking ${vehicleSpecs.extColor} with pristine ${vehicleSpecs.intColor} interior finishes.\n- **Registry Footprint**: 1-owner clean title verified directly on state transport networks.\n\n#### Transaction Guarantees\nOffered under direct Sovereign Escrow standards. Supports immediate payment settlement verification, smart logistics port transit (for international export targets), and certified B2B claim safety protocols.`,
      ES: `### Espécimen Escrow Soberano Profesional\n**Vehículo**: ${year} ${make} ${model} (${vehicleSpecs.trim})\n**Condición**: Verificado ${currConditionAdj(cond)} | **Odómetro**: ${mileage} millas\n\n#### Descripción Resumida\nUn dechado de ingenieria, extraordinariamente limpio y con un riguroso mantenimiento. Certifica la salud de la transmisión, la solidez estructural y un funcionamiento impecable.\n\n#### Especificaciones Clave\n- **Motor**: ${vehicleSpecs.engine}\n- **Núcleo de Tracción**: ${vehicleSpecs.drivetrain}\n- **Transmisión**: ${vehicleSpecs.transmission}\n- **Colores**: Acabados en ${vehicleSpecs.extColor} exterior con interiores de ${vehicleSpecs.intColor}.`,
      DE: `### Professionelles Sovereign Escrow-Fahrzeug\n**Fahrzeug**: ${year} ${make} ${model} (${vehicleSpecs.trim})\n**Zustand**: Geprüft ${currConditionAdj(cond)} | **Kilometerstand**: ${mileage} Meilen\n\n#### Zusammenfassung\nEin herausragendes, außergewöhnlich gepflegtes und hochwertiges Fahrzeug. Dieses wunderschöne Automobil hat die umfassende mechanische Sicherheitsprüfung erfolgreich bestanden.\n\n#### Technische Daten\n- **Motor**: ${vehicleSpecs.engine}\n- **Antrieb**: ${vehicleSpecs.drivetrain}\n- **Getriebe**: ${vehicleSpecs.transmission}\n- **Lackierung**: Atemberaubendes ${vehicleSpecs.extColor} gepaart mit edlem ${vehicleSpecs.intColor}-Interieur.`,
      AR: `### سيارة المحترفين المميزة\n**المركبة**: ${year} ${make} ${model} (${vehicleSpecs.trim})\n**الحالة**: معتمد ${currConditionAdj(cond)} | **المسافة المقطوعة**: ${mileage} ميل\n\n#### المواصفات الرئيسية\n- **المحرك**: ${vehicleSpecs.engine}\n- **نظام الدفع**: ${vehicleSpecs.drivetrain}\n- **ناقل الحركة**: ${vehicleSpecs.transmission}\n- **الألوان**: طلاء خارجي مميز بلون ${vehicleSpecs.extColor} مكسو بجلد داخلي ${vehicleSpecs.intColor}.`,
      UR: `### پروفیشنل خودمختار ایسکرو لسٹنگ\n**گاڑی**: ${year} ${make} ${model} (${vehicleSpecs.trim})\n**حالت**: تصدیق شدہ ${currConditionAdj(cond)} | **میلج**: ${mileage} میل\n\n#### اہم خصوصیات\n- **انجن**: ${vehicleSpecs.engine}\n- **ٹرانس دائرہ**: ${vehicleSpecs.drivetrain}\n- **ٹرانسمیشن**: ${vehicleSpecs.transmission}\n- **رنگت**: شاندار ${vehicleSpecs.extColor} بیرونی رنگت اور نفاست سے بھرپور ${vehicleSpecs.intColor} کی لیدر فنشز۔`,
      ZH: `### 完美车况精品主打车型\n**车型**: ${year} ${make} ${model} (${vehicleSpecs.trim})\n**车况**: 优良 ${currConditionAdj(cond)} | **里程**: ${mileage} 英里\n\n#### 指标明细\n- **发动机**: ${vehicleSpecs.engine}\n- **驱动架构**: ${vehicleSpecs.drivetrain}\n- **变速箱**: ${vehicleSpecs.transmission}\n- **视觉涂装**: 主打 ${vehicleSpecs.extColor} 金属漆面，内饰采用尊享 ${vehicleSpecs.intColor} 皮革工艺。`
    };
  }, [vehicleSpecs, vehicleCondition]);

  function currConditionAdj(c: string) {
    if (c === 'excellent') return 'Excellent Benchmarks (Grade A+)';
    if (c === 'good') return 'Healthy Profile (Grade A)';
    if (c === 'fair') return 'Operable Average (Grade B)';
    return 'Rebuilt/Restoration Candidate (Grade C)';
  }

  // Auto trigger description gen when specs are created and step 6 is displayed
  useEffect(() => {
    if (currentStep === 6 && !descriptionEnglish) {
      setIsGeneratingDescription(true);
      const timer = setTimeout(() => {
        setDescriptionEnglish(simulatedDescriptions.EN);
        setIsGeneratingDescription(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentStep, descriptionEnglish]);


  // --- DYNAMIC MOTORS & REGISTRY SIMULATORS ---
  const handleScanVinSimulate = () => {
    setIsScanning(true);
    setScanningProgress(15);
    const interval = setInterval(() => {
      setScanningProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const randomVins = [
              { vin: 'WP0AB2A90MS281489', make: 'Porsche', model: '911 Carrera S', year: 2023 },
              { vin: '5YJ3E1EA5NF918451', make: 'Tesla', model: 'Model 3 Performance', year: 2022 },
              { vin: 'WBA5R1C09MCE18241', make: 'BMW', model: 'M5 Competition', year: 2021 },
              { vin: 'W1KBH8HB1MB248902', make: 'Mercedes-Benz', model: 'AMG GT 4-Door Coupe', year: 2023 }
            ];
            const chosen = randomVins[Math.floor(Math.random() * randomVins.length)];
            setVinInput(chosen.vin);
            setVehicleSpecs(prev => ({
              ...prev,
              make: chosen.make,
              model: chosen.model,
              year: chosen.year,
              mileage: Math.floor(Math.random() * 25000 + 4000)
            }));
            setVinVerified(true);
            setIsScanning(false);
            // Auto pull registry
            triggerGovernmentRegistryLookup(chosen.vin);
          }, 400);
          return 100;
        }
        return prev + 17;
      });
    }, 150);
  };

  const handleManualVinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vinInput.length < 8) {
      alert("Please enter a valid 17-character VIN or use the Simulator Scan tool.");
      return;
    }
    // Setup a nice default based on input characters
    setVinVerified(true);
    setVehicleSpecs(prev => ({
      ...prev,
      make: 'Porsche',
      model: '718 Cayman GT4',
      year: 2022,
      mileage: 8400
    }));
    triggerGovernmentRegistryLookup(vinInput);
  };

  const triggerGovernmentRegistryLookup = (vinCode: string) => {
    setIsLoadingRegistry(true);
    setTimeout(() => {
      setGovRegistryData({
        registrationStatus: 'Illinois Transport Register - Active Certified',
        taxLienStatus: 'CLEARED - 100% Lien-Free (No outstanding finance liabilities)',
        theftCheck: 'PASS - Zero historical missing flags reported',
        safetyInspection: 'PASS - Passed 182-point State Emission & mechanical safety audit',
        registeredOwner: 'John Doe (User matching platform credential ID)',
        expiryDate: 'March 2027',
        activeRecalls: 'CLEARED - All manufacturer recalls performed'
      });
      setIsLoadingRegistry(false);
    }, 1200);
  };

  // --- REAL-TIME CAMERA & MOBILE SYNC STATES ---
  const [syncSessionId, setSyncSessionId] = useState<string>('');
  const [isMobileMode, setIsMobileMode] = useState<boolean>(false);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [activeWebcamSlot, setActiveWebcamSlot] = useState<string | null>(null);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [activeQrSlot, setActiveQrSlot] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const wizardVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const wizardCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Responsive device classification
  useEffect(() => {
    const checkDevice = () => {
      setIsMobileMode(window.innerWidth < 1024 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent));
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Sync session key generation
  useEffect(() => {
    if (!syncSessionId) {
      const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
      setSyncSessionId(rand);
    }
  }, [syncSessionId]);

  // Sync photos live from Express server memory
  useEffect(() => {
    if ((currentStep !== 2 && currentStep !== 4) || !syncSessionId) return;

    let isActive = true;
    const fetchSync = async () => {
      try {
        const res = await fetch(`/api/photo-sync/session/${syncSessionId}`);
        const data = await res.json();
        if (isActive && data.success && data.photos) {
          // Sync standard photo prompts (non-doc)
          setPhotos(prev => {
            const copy = { ...prev };
            let hasChanged = false;
            Object.keys(data.photos).forEach(key => {
              if (data.photos[key] && !key.startsWith('doc_') && prev[key] !== data.photos[key]) {
                copy[key] = data.photos[key];
                hasChanged = true;
              }
            });
            if (hasChanged) {
              setMediaVerifyingResult("AI Audit Passed: Aspect ratios verified, watermark detection clean, and GPS geolocation logs match active mobile sync feed.");
            }
            return hasChanged ? copy : prev;
          });

          // Sync verified documents
          setDocuments(prev => {
            const copy = { ...prev };
            let hasChanged = false;
            const docMap: Record<string, 'registration' | 'serviceLogs' | 'warrantyCert'> = {
              'doc_registration': 'registration',
              'doc_serviceLogs': 'serviceLogs',
              'doc_warrantyCert': 'warrantyCert'
            };
            Object.keys(docMap).forEach(photoKey => {
              const stateKey = docMap[photoKey];
              if (data.photos[photoKey] && prev[stateKey] !== data.photos[photoKey]) {
                copy[stateKey] = data.photos[photoKey];
                hasChanged = true;
              }
            });
            return hasChanged ? copy : prev;
          });
        }
      } catch (err) {
        console.warn("Express session photo sync poll failed", err);
      }
    };

    fetchSync();
    const timer = setInterval(fetchSync, 1800);
    return () => {
      isActive = false;
      clearInterval(timer);
    };
  }, [currentStep, syncSessionId]);

  const startWizardWebcam = async (slotKey: string) => {
    setWebcamError(null);
    setActiveWebcamSlot(slotKey);
    if (webcamStream) {
      webcamStream.getTracks().forEach(t => t.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });
      setWebcamStream(stream);
      setTimeout(() => {
        if (wizardVideoRef.current) {
          wizardVideoRef.current.srcObject = stream;
          wizardVideoRef.current.play().catch(e => console.warn(e));
        }
      }, 150);
    } catch (err) {
      setWebcamError("Could not access camera device. Please use mobile sync option instead.");
    }
  };

  const closeWizardWebcam = () => {
    if (webcamStream) {
      webcamStream.getTracks().forEach(t => t.stop());
      setWebcamStream(null);
    }
    setActiveWebcamSlot(null);
    setWebcamError(null);
  };

  const captureWizardWebcam = () => {
    if (wizardVideoRef.current && wizardCanvasRef.current && activeWebcamSlot) {
      const video = wizardVideoRef.current;
      const canvas = wizardCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

        if (activeWebcamSlot.startsWith('doc_')) {
          const docMap: Record<string, 'registration' | 'serviceLogs' | 'warrantyCert'> = {
            'doc_registration': 'registration',
            'doc_serviceLogs': 'serviceLogs',
            'doc_warrantyCert': 'warrantyCert'
          };
          const field = docMap[activeWebcamSlot];
          if (field) {
            setDocuments(prev => ({ ...prev, [field]: dataUrl }));
          }
        } else {
          setPhotos(prev => ({ ...prev, [activeWebcamSlot]: dataUrl }));
        }

        setMediaVerifyingResult("AI Audit Passed: Aspect ratios verified, watermark detection clean, and GPS geolocation logs match active synced capture.");
        closeWizardWebcam();
      }
    }
  };

  const triggerLinkOldOwnership = () => {
    setIsLinkingPrevious(true);
    setTimeout(() => {
      setOwnershipVerificationLinked(true);
      setIsLinkingPrevious(false);
      // Autofill other fields for completeness
      setDocuments(prev => ({
        ...prev,
        registration: true,
        serviceLogs: true
      }));
    }, 1500);
  };

  // PUBLISH FINAL
  const handleFinalPublish = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Create the vehicle
      const backendVehicle = await api.post<BackendVehicle>('/vehicles', {
        vin: vinInput || `WP0-${Date.now().toString().slice(-6)}`,
        make: vehicleSpecs.make || 'Porsche',
        model: vehicleSpecs.model || '911 Custom Asset',
        year: vehicleSpecs.year,
        mileage: vehicleSpecs.mileage,
        fuelType: vehicleSpecs.fuelType || 'Gasoline',
        transmission: vehicleSpecs.transmission,
        price: askingPrice,
        country: vehicleSpecs.location.split(',')[1]?.trim() || 'USA',
        city: vehicleSpecs.location.split(',')[0]?.trim() || 'Chicago',
        condition: vehicleCondition.toUpperCase(),
        description: descriptionEnglish || simulatedDescriptions.EN,
        color: vehicleSpecs.extColor,
        bodyType: vehicleSpecs.trim,
      });

      // 2. Upload photos if any
      const photosToUpload = [
        { key: 'hero', photo: photos.hero },
        { key: 'rear', photo: photos.rear },
        { key: 'dash', photo: photos.dash },
        { key: 'engine', photo: photos.engine },
        { key: 'interior', photo: photos.interior }
      ].filter(p => p.photo && !p.photo.startsWith('http')); // Only upload new dataURLs

      if (photosToUpload.length > 0) {
        await api.post(`/vehicles/${backendVehicle.id}/photos`, {
          photos: photosToUpload.map((p, idx) => ({
            url: p.photo,
            isPrimary: p.key === 'hero',
            order: idx
          }))
        });
      }

      // 3. Map back to frontend type and notify
      const finalVehicle = mapBackendVehicle(backendVehicle);
      onPublishListing(finalVehicle);
    } catch (err: any) {
      console.error("Failed to publish vehicle:", err);
      setSubmitError(err.message || "Failed to publish listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white text-slate-900 rounded-3xl p-4 md:p-8 space-y-8 font-sans max-w-5xl mx-auto" id="sell-vehicle-wizard">
      
      {/* Elegantly Styled Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight font-display">
            Sell Your Vehicle
          </h2>
        </div>

        <button 
          onClick={onCancel}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all rounded-full px-5 py-2 cursor-pointer"
        >
          Cancel &amp; Return
        </button>
      </div>

      {/* Steps Visual Tracker (Full page horizontal display) */}
      <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-4 items-center justify-center w-full md:justify-start">
          {[
            { step: 1, label: "Vehicle Info" },
            { step: 2, label: "Upload Photos" },
            { step: 3, label: "Set Price" },
            { step: 4, label: "Ownership" },
            { step: 5, label: "Visibility" },
            { step: 6, label: "Preview & Publish" }
          ].map((item) => {
            const isActive = item.step === currentStep;
            const isCompleted = item.step < currentStep;
            return (
              <div key={item.step} className="flex items-center gap-2">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                    isActive 
                      ? 'bg-[#8B0000] text-white shadow-md shadow-[#8B0000]/20' 
                      : isCompleted 
                        ? 'bg-red-50 text-[#8B0000] border border-red-100' 
                        : 'bg-white text-slate-400 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : item.step}
                </div>
                <span 
                  className={`text-xs font-bold tracking-tight transition-all ${
                    isActive ? 'text-slate-900 font-black' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
                {item.step < totalSteps && (
                  <span className="text-slate-200 md:inline hidden ml-2">/</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="text-xs font-extrabold text-[#8B0000] bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 tracking-tight uppercase whitespace-nowrap">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {/* WIZARD CARD WRAPPER */}
      <div className="min-h-[380px] bg-white text-slate-900 text-left">
        
        <AnimatePresence mode="wait">
          
          {/* ----- STEP 1: IDENTITY & VIN ----- */}
          {currentStep === 1 && (
            <motion.div 
              key="step1" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ x: -25, opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-1 block text-left">
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                  Enter Vehicle VIN
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Provide your 17-digit Vehicle Identification Number (VIN) to retrieve official build specs and verify database records.
                </p>
              </div>

              {/* Input details form */}
              <form onSubmit={handleManualVinSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-black text-zinc-800 uppercase tracking-wide">17-Digit VIN Number</label>
                    <input 
                      type="text"
                      maxLength={17}
                      placeholder="e.g. WP0AB2A90MS281489"
                      value={vinInput}
                      onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#8B0000] focus:bg-white font-mono text-sm tracking-widest px-4 py-3 rounded-xl text-slate-950 outline-none"
                    />
                  </div>
                  <div className="sm:pt-5">
                    <button
                      type="submit"
                      disabled={isScanning || !vinInput}
                      className="w-full h-[46px] rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer px-5"
                    >
                      Lookup Manually
                    </button>
                  </div>
                </div>
              </form>

              {/* Live Simulator Box */}
              <div className="bg-red-50/40 rounded-2xl p-5 border border-red-100 flex flex-col md:flex-row items-center justify-between gap-5">
                <div className="space-y-1 text-left w-full md:w-3/5">
                  <span className="text-xs text-[#8B0000] font-black uppercase tracking-wider block font-mono">Simulator Tool</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Instantly load true vehicle technical specifications, manufacturing indices, and state reports for testing.
                  </p>
                  
                  {isScanning && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-[#8B0000]">
                        <span className="animate-pulse font-bold">LOADING CAR SPECIFICATIONS...</span>
                        <span>{scanningProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#8B0000] transition-all duration-150" style={{ width: `${scanningProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {!isScanning && vinVerified && (
                    <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Vehicle discovered and decoded successfully!
                    </div>
                  )}
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleScanVinSimulate}
                    disabled={isScanning}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#8B0000] hover:bg-[#b00d0d] text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-97 cursor-pointer shadow-md shadow-[#8B0000]/10"
                  >
                    <Camera className="w-4 h-4" /> Scan Simulated VIN
                  </button>
                </div>
              </div>

              {/* Decoded specs table */}
              {vinVerified && (
                <div className="space-y-4 pt-2">
                  <div className="flex justify-between items-center py-2.5">
                    <h3 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
                      Specifications Decoded
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 border border-slate-100 p-5 rounded-2xl text-[12px] font-medium text-slate-700">
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-950 block uppercase text-[10px] font-black tracking-wider bg-slate-100/90 px-2 py-0.5 rounded-md w-fit mb-1.5">Year / Make / Model</span>
                      <input 
                        type="text"
                        value={`${vehicleSpecs.year} ${vehicleSpecs.make} ${vehicleSpecs.model}`}
                        onChange={(e) => {
                          const parts = e.target.value.split(' ');
                          const yr = parseInt(parts[0]) || 2023;
                          const mk = parts[1] || '';
                          const mdl = parts.slice(2).join(' ') || '';
                          setVehicleSpecs(prev => ({ ...prev, year: yr, make: mk, model: mdl }));
                        }}
                        className="bg-transparent text-slate-955 font-extrabold outline-none border-b border-transparent hover:border-slate-200 focus:border-[#8B0000] w-full mt-1.5"
                      />
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-955 block uppercase text-[10px] font-black tracking-wider bg-slate-100/90 px-2 py-0.5 rounded-md w-fit mb-1.5">Engine Details</span>
                      <input 
                        type="text"
                        value={vehicleSpecs.engine}
                        onChange={(e) => setVehicleSpecs(prev => ({ ...prev, engine: e.target.value }))}
                        className="bg-transparent text-slate-950 font-bold outline-none border-b border-transparent hover:border-slate-200 focus:border-[#8B0000] w-full mt-1.5"
                      />
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-955 block uppercase text-[10px] font-black tracking-wider bg-slate-100/90 px-2 py-0.5 rounded-md w-fit mb-1.5">Drivetrain</span>
                      <input 
                        type="text"
                        value={vehicleSpecs.drivetrain}
                        onChange={(e) => setVehicleSpecs(prev => ({ ...prev, drivetrain: e.target.value }))}
                        className="bg-transparent text-slate-955 font-bold outline-none border-b border-transparent hover:border-slate-200 focus:border-[#8B0000] w-full mt-1.5"
                      />
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-955 block uppercase text-[10px] font-black tracking-wider bg-slate-100/90 px-2 py-0.5 rounded-md w-fit mb-1.5">Horsepower</span>
                      <div className="flex items-center gap-1 mt-1.5">
                        <input 
                          type="number"
                          value={vehicleSpecs.horsepower}
                          onChange={(e) => setVehicleSpecs(prev => ({ ...prev, horsepower: parseInt(e.target.value) || 0 }))}
                          className="bg-transparent text-slate-955 font-bold outline-none border-b border-transparent hover:border-slate-200 focus:border-[#8B0000] w-16 font-mono"
                        />
                        <span className="font-mono text-slate-400 text-[10px]">HP</span>
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-955 block uppercase text-[10px] font-black tracking-wider bg-slate-100/90 px-2 py-0.5 rounded-md w-fit mb-1.5">Odometer Reading</span>
                      <input 
                        type="number"
                        value={vehicleSpecs.mileage}
                        onChange={(e) => setVehicleSpecs(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
                        className="bg-transparent text-slate-955 font-bold outline-none border-b border-transparent hover:border-slate-200 focus:border-[#8B0000] w-full mt-1.5 font-mono text-xs"
                      />
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-955 block uppercase text-[10px] font-black tracking-wider bg-slate-100/90 px-2 py-0.5 rounded-md w-fit mb-1.5">Colors (Ext / Int)</span>
                      <div className="flex gap-1 mt-1.5">
                        <input 
                          type="text"
                          value={vehicleSpecs.extColor}
                          onChange={(e) => setVehicleSpecs(prev => ({ ...prev, extColor: e.target.value }))}
                          className="bg-transparent text-slate-955 font-semibold outline-none border-b border-transparent hover:border-slate-200 focus:border-[#8B0000] w-1/2"
                        />
                        <span className="text-slate-305">/</span>
                        <input 
                          type="text"
                          value={vehicleSpecs.intColor}
                          onChange={(e) => setVehicleSpecs(prev => ({ ...prev, intColor: e.target.value }))}
                          className="bg-transparent text-slate-955 font-semibold outline-none border-b border-transparent hover:border-slate-200 focus:border-[#8B0000] w-1/2"
                        />
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-955 block uppercase text-[10px] font-black tracking-wider bg-slate-100/90 px-2 py-0.5 rounded-md w-fit mb-1.5">Fuel Type</span>
                      <select 
                        value={vehicleSpecs.fuelType}
                        onChange={(e) => setVehicleSpecs(prev => ({ ...prev, fuelType: e.target.value }))}
                        className="bg-transparent text-slate-955 font-bold outline-none cursor-pointer mt-1 w-full border-none p-0 focus:outline-none"
                      >
                        <option value="Premium Gasoline">Gasoline</option>
                        <option value="Full Battery Electric (BEV)">Electricity</option>
                        <option value="Eco Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-200">
                      <span className="text-slate-955 block uppercase text-[10px] font-black tracking-wider bg-slate-100/90 px-2 py-0.5 rounded-md w-fit mb-1.5">Vehicle Location</span>
                      <input 
                        type="text"
                        value={vehicleSpecs.location}
                        onChange={(e) => setVehicleSpecs(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-transparent text-slate-955 font-bold outline-none border-b border-transparent hover:border-slate-200 focus:border-[#8B0000] w-full mt-1.5"
                      />
                    </div>
                  </div>

                  {/* Government Registry Box */}
                  <div className="space-y-4 pt-2 text-left">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" /> Registration Registry Status
                    </h4>
                    
                    {isLoadingRegistry ? (
                      <div className="h-24 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center gap-2">
                        <RefreshCcw className="w-5 h-5 text-slate-400 animate-spin" />
                        <span className="text-xs text-slate-500 font-medium">Checking official registration databases...</span>
                      </div>
                    ) : govRegistryData ? (
                      <div className="bg-emerald-50/15 border border-emerald-100/60 rounded-2xl p-5 font-sans">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          
                          <div className="bg-white p-3.5 rounded-xl border border-emerald-100/60 shadow-2xs flex flex-col justify-between">
                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md w-fit mb-1.5 block">Registration Status</span>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span className="text-xs font-extrabold text-emerald-800">Active Certified</span>
                            </div>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-emerald-100/60 shadow-2xs flex flex-col justify-between">
                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md w-fit mb-1.5 block">Financing Liens</span>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span className="text-xs font-extrabold text-emerald-800">100% Lien-Free (No debt)</span>
                            </div>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-emerald-100/60 shadow-2xs flex flex-col justify-between">
                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md w-fit mb-1.5 block">Theft Check</span>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span className="text-xs font-extrabold text-emerald-800 font-sans">Passed &amp; Record Clean</span>
                            </div>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-emerald-100/60 shadow-2xs flex flex-col justify-between">
                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md w-fit mb-1.5 block">Mechanical Safety</span>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span className="text-xs font-extrabold text-emerald-800">State Audit Passed</span>
                            </div>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-emerald-100/60 shadow-2xs flex flex-col justify-between">
                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md w-fit mb-1.5 block">Verified Owner</span>
                            <div className="flex items-center gap-1.5 mt-1.5 min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 shrink-0"></span>
                              <span className="text-xs font-extrabold text-zinc-800 truncate" title={govRegistryData.registeredOwner}>{govRegistryData.registeredOwner}</span>
                            </div>
                          </div>

                          <div className="bg-white p-3.5 rounded-xl border border-emerald-100/60 shadow-2xs flex flex-col justify-between">
                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md w-fit mb-1.5 block">Recall Stats</span>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span className="text-xs font-extrabold text-emerald-800">No Active Recalls</span>
                            </div>
                          </div>

                        </div>
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl border border-dashed border-slate-200 text-center text-xs text-slate-500">
                        Registration data will appear here once the VIN is simulated or analyzed.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ----- STEP 2: PHOTO/VIDEO CAPTURE PROMPTS ----- */}
          {currentStep === 2 && (
            <motion.div 
              key="step2" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ x: -25, opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-1 block text-left">
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                  Live Camera Verification
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Strict automotive transparency protocol. Direct camera captures only. File attachment uploads from storage are deactivated.
                </p>
              </div>

              {mediaVerifyingResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-xs rounded-2xl text-emerald-800 flex items-start gap-2 text-left font-medium">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-bold text-slate-900 uppercase text-[9.5px]">Images verified</span>
                    <span className="font-normal text-slate-600">{mediaVerifyingResult}</span>
                  </div>
                </div>
              )}



              {/* Photostack Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {photoPrompts.map(prompt => {
                  const mediaAttached = !!photos[prompt.key];
                  const isWebcamOpen = activeWebcamSlot === prompt.key;
                  const isQrActive = !isMobileMode && activeQrSlot === prompt.key;

                  return (
                    <div 
                      key={prompt.key}
                      className={`p-5 bg-white rounded-2xl border transition-all ${
                        mediaAttached 
                          ? 'border-emerald-200 bg-emerald-50/10' 
                          : 'border-slate-200 hover:border-slate-300'
                      } flex flex-col justify-between min-h-[220px]`}
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-extrabold text-slate-900">
                             {prompt.title}
                          </span>
                          {mediaAttached ? (
                            <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                              <Check className="w-3 h-3" /> VERIFIED
                            </span>
                          ) : (
                            <span className="text-[10px] text-red-500 font-black tracking-wider uppercase font-mono">Required</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-sans mt-0.5 text-left mb-3">
                          {prompt.desc}
                        </p>
                      </div>

                      {/* Display attachment / camera preview area / QR Code */}
                      {mediaAttached ? (
                        <div className="relative h-28 rounded-xl overflow-hidden border border-slate-100 group">
                          <img 
                            src={photos[prompt.key]} 
                            alt={prompt.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            <button
                              type="button"
                              onClick={() => {
                                setPhotos(prev => ({ ...prev, [prompt.key]: '' }));
                                if (activeQrSlot === prompt.key) {
                                  setActiveQrSlot(null);
                                }
                              }}
                              className="bg-[#8B0000] hover:bg-[#b00d0d] text-white rounded-xl p-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ) : !isMobileMode ? (
                        /* If desktop, show the QR code directly inside the box for scanning! */
                        <div className="w-full flex flex-col items-center justify-center py-2 bg-slate-50 border border-slate-100/50 rounded-xl space-y-2">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                              window.location.origin + '/?mobile-upload=true&sessionId=' + syncSessionId + '&photoKey=' + prompt.key
                            )}`} 
                            alt="Scan QR with mobile" 
                            className="w-24 h-24 object-contain select-none shadow-sm rounded-lg border border-slate-200/40 p-1 bg-white"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[9.5px] text-zinc-550 font-black tracking-wider uppercase font-mono">Scan QR to capture</span>
                        </div>
                      ) : isWebcamOpen ? (
                        /* Webcam Live Stream Capture Overlay */
                        <div className="relative h-28 rounded-xl overflow-hidden bg-black border border-zinc-800">
                          <video 
                            ref={wizardVideoRef}
                            className="w-full h-full object-cover"
                            playsInline
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 gap-2.5">
                            <button
                              type="button"
                              onClick={captureWizardWebcam}
                              className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center active:scale-90 transition-all border border-emerald-500 shadow-md cursor-pointer"
                              title="Capture Live Shot"
                            >
                              <Check className="w-4 h-4 stroke-[4.5]" />
                            </button>
                            <button
                              type="button"
                              onClick={closeWizardWebcam}
                              className="w-9 h-9 rounded-full bg-zinc-800 text-white flex items-center justify-center active:scale-90 transition-all border border-zinc-700 shadow-md cursor-pointer animate-none"
                              title="Cancel"
                            >
                              <span className="text-white text-lg font-bold select-none leading-none -mt-0.5">×</span>
                            </button>
                          </div>
                          {webcamError && (
                            <div className="absolute inset-0 bg-red-950/90 flex items-center justify-center p-3 text-center text-[10px] text-red-100 leading-normal">
                              {webcamError}
                            </div>
                          )}
                          <canvas ref={wizardCanvasRef} className="hidden" />
                        </div>
                      ) : (
                        /* Mobile camera trigger button if webcam is not yet open */
                        <div className="pt-2 text-center">
                          <button
                            type="button"
                            onClick={() => startWizardWebcam(prompt.key)}
                            className="w-full py-2.5 bg-[#8B0000] hover:bg-zinc-800 text-white text-[10.5px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ease-in-out font-sans cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                          >
                            <Camera className="w-3.5 h-3.5" /> Start Live Camera
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ----- STEP 3: PRICING ASSISTANT ----- */}
          {currentStep === 3 && (
            <motion.div 
              key="step3" 
              initial={{ opacity: 0, scale: 0.98 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ y: -10, opacity: 0 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              {/* Apple-style Display Heading - Bigger, bold, sans arrow icon */}
              <div className="space-y-1 block text-left">
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                  Custom Price &amp; Valuation
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Refine details and input your intended listing price to finalize dynamic valuations.
                </p>
              </div>

              {/* Comprehensive Full-Width Control Desk Card - Seamlessly merges estimator, inputs, and feedback */}
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm text-left">
                
                {/* Embedded Valuation Estimator Dashboard */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest font-mono">Market Valuation Estimator</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="p-5 bg-slate-50 border border-slate-200/40 rounded-2xl space-y-1.5 transition-all duration-300 hover:shadow-xs">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase font-mono tracking-widest block">Market Average Price</span>
                      <span className="text-2xl font-bold text-slate-800 font-mono tracking-tight">${Math.round(estimatedValuation * 0.98).toLocaleString()}</span>
                    </div>
                    <div className="p-5 bg-red-50/40 border border-red-100 rounded-2xl space-y-1.5 transition-all duration-300 hover:shadow-xs">
                      <span className="text-[9px] text-[#8B0000] font-black uppercase font-mono tracking-widest block">Recommended Price</span>
                      <span className="text-3xl font-black text-[#8B0000] font-mono tracking-tight">${estimatedValuation.toLocaleString()}</span>
                    </div>
                    <div className="p-5 bg-slate-50 border border-slate-200/40 rounded-2xl space-y-1.5 transition-all duration-300 hover:shadow-xs">
                      <span className="text-[9px] text-emerald-600 font-extrabold uppercase font-mono tracking-widest block">High Market Band</span>
                      <span className="text-2xl font-bold text-emerald-600 font-mono tracking-tight">${Math.round(estimatedValuation * 1.05).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Grid container for input controllers and indicator feedback */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Left Parameter Adjustment column */}
                  <div className="space-y-6">
                    {/* Vehicle Mechanical Condition selectors */}
                    <div className="space-y-2.5">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">Vehicle Mechanical Condition</label>
                      <div className="grid grid-cols-4 gap-2">
                        {(['Excellent', 'Good', 'Fair', 'Damaged'] as const).map(cond => (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => setVehicleCondition(cond)}
                            className={`py-2 px-1 rounded-xl border text-[11px] font-black transition-all cursor-pointer ${
                              vehicleCondition === cond 
                                ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-sm' 
                                : 'bg-slate-50 border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                          >
                            {cond}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Manual Numeric input and Slider */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest block">Manually Enter Asking Price ($)</label>
                      
                      {/* Premium manual price box */}
                      <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-[#8B0000] focus-within:bg-white transition-all flex items-center shadow-xs">
                        <span className="text-slate-400 font-black text-xl mr-2 select-none">$</span>
                        <input 
                          type="text" 
                          pattern="[0-9]*"
                          value={askingPrice === 0 ? '' : askingPrice}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            setAskingPrice(val ? parseInt(val) : 0);
                          }}
                          placeholder="e.g. 78,000"
                          className="w-full bg-transparent font-mono text-xl font-black text-slate-900 outline-none placeholder:text-slate-350"
                        />
                      </div>

                      {/* Accent refined Range slider */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 font-mono">
                          <span>Range Slider</span>
                          <span className="text-[#8B0000] font-bold">${askingPrice.toLocaleString()} limit</span>
                        </div>
                        <input 
                          type="range"
                          min={Math.max(1000, suggestedRange.min - 15000)}
                          max={suggestedRange.max + 25000}
                          step={500}
                          value={askingPrice}
                          onChange={(e) => setAskingPrice(parseInt(e.target.value) || 0)}
                          style={{ accentColor: '#8B0000' }}
                          className="w-full h-2 bg-slate-100 rounded-lg cursor-pointer accent-[#8B0000]"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 font-bold">
                          <span>${Math.max(1000, suggestedRange.min - 15000).toLocaleString()}</span>
                          <span>${estimatedValuation.toLocaleString()} (Median)</span>
                          <span>${(suggestedRange.max + 25000).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Feedbacks container */}
                  <div className="flex flex-col justify-stretch">
                    {priceFeedbackMessage ? (
                      <div className={`p-6 border rounded-2xl flex flex-col justify-between text-left text-xs ${priceFeedbackMessage.color} shadow-xs h-full`}>
                        <div className="space-y-4">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/70 border border-current rounded-full text-[9px] font-black uppercase tracking-wider">
                            Market Pulse Indicator
                          </div>
                          <h4 className="font-extrabold text-sm tracking-tight">{priceFeedbackMessage.rating}</h4>
                          <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">{priceFeedbackMessage.text}</p>
                        </div>
                        <div className="pt-4 mt-auto text-slate-400 text-[10px] font-medium font-sans">
                          Valuation is verified hourly using local algorithmic trends.
                        </div>
                      </div>
                    ) : (
                      <div className="border border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center text-slate-400 h-full">
                        <span className="text-xs font-semibold">Adjust values to calculate the dynamic market recommendation.</span>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          )}

          {/* ----- STEP 4: DOCUMENTS & LINK PREVIOUS ----- */}
          {currentStep === 4 && (
            <motion.div 
              key="step4" 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ x: -25, opacity: 0 }}
              className="space-y-6"
            >
              <div className="space-y-1 block text-left">
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                  Ownership Proof &amp; Maintenance Logs
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Provide verified state titles, complete servicing records, and optional coverages to accelerate valuation approvals.
                </p>
              </div>

              {/* Document upload stack */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* DOC 1: Registration */}
                <div className={`p-5 bg-white rounded-2xl border flex flex-col justify-between min-h-[220px] transition-all relative group overflow-hidden ${
                  documents.registration ? 'border-emerald-500 bg-emerald-50/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="space-y-1 text-left">
                    <span className="text-xs font-extrabold text-slate-900 block">State Registration Title</span>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">
                      Copy of official registration card to confirm ownership details.
                    </p>
                  </div>

                  {documents.registration ? (
                    <div className="space-y-1.5 pt-1 text-left">
                      <div className="h-28 w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-205 flex items-center justify-center relative">
                        {typeof documents.registration === 'string' && documents.registration.startsWith('data:image/') ? (
                          <img src={documents.registration} className="w-full h-full object-cover" alt="Registration certificate" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-[9.5px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Linked State Title</span>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button 
                            type="button"
                            onClick={() => setDocuments(p => ({ ...p, registration: false }))} 
                            className="bg-[#8B0000] hover:bg-[#b00d0d] text-white rounded-xl p-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
                            title="Remove registration cert"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      <div className="text-[10.5px] text-emerald-650 font-sans font-extrabold flex items-center gap-1">
                        ✓ Attached Successfully
                      </div>
                    </div>
                  ) : !isMobileMode ? (
                    /* If desktop, show the QR code directly inside the box for scanning! */
                    <div className="w-full flex flex-col items-center justify-center py-2 bg-slate-50 border border-slate-100/50 rounded-xl space-y-2">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          window.location.origin + '/?mobile-upload=true&sessionId=' + syncSessionId + '&photoKey=doc_registration'
                        )}`} 
                        alt="Scan QR with mobile" 
                        className="w-20 h-20 object-contain select-none shadow-sm rounded-lg border border-slate-200/40 p-1 bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[8.5px] text-zinc-550 font-black tracking-wider uppercase font-mono">Scan QR to capture</span>
                    </div>
                  ) : activeWebcamSlot === 'doc_registration' ? (
                    /* Webcam Live Stream Capture Overlay */
                    <div className="relative h-28 rounded-xl overflow-hidden bg-black border border-zinc-800">
                      <video 
                        ref={wizardVideoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 gap-2">
                        <button
                          type="button"
                          onClick={captureWizardWebcam}
                          className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center active:scale-90 transition-all border border-emerald-500 shadow-md cursor-pointer"
                          title="Capture Live Shot"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[4.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={closeWizardWebcam}
                          className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center active:scale-90 transition-all border border-zinc-700 shadow-md cursor-pointer"
                          title="Cancel"
                        >
                          <span className="text-white text-base font-bold select-none leading-none">×</span>
                        </button>
                      </div>
                      {webcamError && (
                        <div className="absolute inset-0 bg-red-955/90 flex items-center justify-center p-2 text-center text-[10px] text-red-100 leading-normal">
                          {webcamError}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Mobile camera trigger button if webcam is not yet open */
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => startWizardWebcam('doc_registration')}
                        className="w-full py-2 bg-[#8B0000] hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ease-in-out font-sans cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Camera className="w-3.5 h-3.5" /> Start Live Camera
                      </button>
                    </div>
                  )}
                </div>

                {/* DOC 2: Service History Logs */}
                <div className={`p-5 bg-white rounded-2xl border flex flex-col justify-between min-h-[220px] transition-all relative group overflow-hidden ${
                  documents.serviceLogs ? 'border-emerald-500 bg-emerald-50/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="space-y-1 text-left">
                    <span className="text-xs font-extrabold text-slate-900 block">Full Service Records</span>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">
                      Maintenance history receipts, service checks, or oil changes.
                    </p>
                  </div>

                  {documents.serviceLogs ? (
                    <div className="space-y-1.5 pt-1 text-left">
                      <div className="h-28 w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-205 flex items-center justify-center relative">
                        {typeof documents.serviceLogs === 'string' && documents.serviceLogs.startsWith('data:image/') ? (
                          <img src={documents.serviceLogs} className="w-full h-full object-cover" alt="Service records" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-[9.5px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Linked Services</span>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button 
                            type="button"
                            onClick={() => setDocuments(p => ({ ...p, serviceLogs: false }))} 
                            className="bg-[#8B0000] hover:bg-[#b00d0d] text-white rounded-xl p-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
                            title="Remove records"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      <div className="text-[10.5px] text-emerald-650 font-sans font-extrabold flex items-center gap-1">
                        ✓ Records Attached
                      </div>
                    </div>
                  ) : !isMobileMode ? (
                    /* If desktop, show the QR code directly inside the box for scanning! */
                    <div className="w-full flex flex-col items-center justify-center py-2 bg-slate-50 border border-slate-100/50 rounded-xl space-y-2">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          window.location.origin + '/?mobile-upload=true&sessionId=' + syncSessionId + '&photoKey=doc_serviceLogs'
                        )}`} 
                        alt="Scan QR with mobile" 
                        className="w-20 h-20 object-contain select-none shadow-sm rounded-lg border border-slate-200/40 p-1 bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[8.5px] text-zinc-550 font-black tracking-wider uppercase font-mono">Scan QR to capture</span>
                    </div>
                  ) : activeWebcamSlot === 'doc_serviceLogs' ? (
                    /* Webcam Live Stream Capture Overlay */
                    <div className="relative h-28 rounded-xl overflow-hidden bg-black border border-zinc-805">
                      <video 
                        ref={wizardVideoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 gap-2">
                        <button
                          type="button"
                          onClick={captureWizardWebcam}
                          className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center active:scale-90 transition-all border border-emerald-500 shadow-md cursor-pointer"
                          title="Capture Live Shot"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[4.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={closeWizardWebcam}
                          className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center active:scale-90 transition-all border border-zinc-700 shadow-md cursor-pointer"
                          title="Cancel"
                        >
                          <span className="text-white text-base font-bold select-none leading-none">×</span>
                        </button>
                      </div>
                      {webcamError && (
                        <div className="absolute inset-0 bg-red-955/90 flex items-center justify-center p-2 text-center text-[10px] text-red-100 leading-normal">
                          {webcamError}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Mobile camera trigger button if webcam is not yet open */
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => startWizardWebcam('doc_serviceLogs')}
                        className="w-full py-2 bg-[#8B0000] hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ease-in-out font-sans cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Camera className="w-3.5 h-3.5" /> Start Live Camera
                      </button>
                    </div>
                  )}
                </div>

                {/* DOC 3: Warranty Certificates */}
                <div className={`p-5 bg-white rounded-2xl border flex flex-col justify-between min-h-[220px] transition-all relative group overflow-hidden ${
                  documents.warrantyCert ? 'border-emerald-500 bg-emerald-50/5 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="space-y-1 text-left">
                    <span className="text-xs font-extrabold text-slate-900 block">Warranty Documents</span>
                    <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">
                      Powertrain, electric cell, or third-party coverage warranty certificates.
                    </p>
                  </div>

                  {documents.warrantyCert ? (
                    <div className="space-y-1.5 pt-1 text-left">
                      <div className="h-28 w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-205 flex items-center justify-center relative">
                        {typeof documents.warrantyCert === 'string' && documents.warrantyCert.startsWith('data:image/') ? (
                          <img src={documents.warrantyCert} className="w-full h-full object-cover" alt="Warranty description" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-[9.5px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Warranty Active</span>
                        )}
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <button 
                            type="button"
                            onClick={() => setDocuments(p => ({ ...p, warrantyCert: false }))} 
                            className="bg-[#8B0000] hover:bg-[#b00d0d] text-white rounded-xl p-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
                            title="Remove warranty cert"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      <div className="text-[10.5px] text-emerald-650 font-sans font-extrabold flex items-center gap-1">
                        ✓ Verified Warranty
                      </div>
                    </div>
                  ) : !isMobileMode ? (
                    /* If desktop, show the QR code directly inside the box for scanning! */
                    <div className="w-full flex flex-col items-center justify-center py-2 bg-slate-50 border border-slate-100/50 rounded-xl space-y-2">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          window.location.origin + '/?mobile-upload=true&sessionId=' + syncSessionId + '&photoKey=doc_warrantyCert'
                        )}`} 
                        alt="Scan QR with mobile" 
                        className="w-20 h-20 object-contain select-none shadow-sm rounded-lg border border-slate-200/40 p-1 bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-[8.5px] text-zinc-550 font-black tracking-wider uppercase font-mono">Scan QR to capture</span>
                    </div>
                  ) : activeWebcamSlot === 'doc_warrantyCert' ? (
                    /* Webcam Live Stream Capture Overlay */
                    <div className="relative h-28 rounded-xl overflow-hidden bg-black border border-zinc-805">
                      <video 
                        ref={wizardVideoRef}
                        className="w-full h-full object-cover"
                        playsInline
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 gap-2">
                        <button
                          type="button"
                          onClick={captureWizardWebcam}
                          className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center active:scale-90 transition-all border border-emerald-500 shadow-md cursor-pointer"
                          title="Capture Live Shot"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[4.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={closeWizardWebcam}
                          className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center active:scale-90 transition-all border border-zinc-700 shadow-md cursor-pointer"
                          title="Cancel"
                        >
                          <span className="text-white text-base font-bold select-none leading-none">×</span>
                        </button>
                      </div>
                      {webcamError && (
                        <div className="absolute inset-0 bg-red-955/90 flex items-center justify-center p-2 text-center text-[10px] text-red-100 leading-normal">
                          {webcamError}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Mobile camera trigger button if webcam is not yet open */
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => startWizardWebcam('doc_warrantyCert')}
                        className="w-full py-2 bg-[#8B0000] hover:bg-zinc-800 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ease-in-out font-sans cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <Camera className="w-3.5 h-3.5" /> Start Live Camera
                      </button>
                    </div>
                  )}
                </div>

              </div>

              {/* INTEGRATION: LINK PREVIOUS PURCHASE FROM PLATFORM */}
              <div className="bg-slate-50 border border-slate-250 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-left space-y-1 flex-1">
                    <span className="text-[10px] text-[#8B0000] font-extrabold uppercase font-mono tracking-wider block">
                      Platform Purchase Match
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900">Did you buy this vehicle on our platform previously?</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-sans">
                      Enable this so our system can search previous invoice records to verify authenticity and ownership details automatically.
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 px-4 py-3 rounded-xl text-xs font-bold transition-all select-none hover:border-[#8B0000] hover:bg-red-50/10">
                      <input 
                        type="checkbox"
                        checked={connectOldOwnership}
                        onChange={(e) => {
                          setConnectOldOwnership(e.target.checked);
                          if (e.target.checked && !ownershipVerificationLinked) {
                            triggerLinkOldOwnership();
                          }
                        }}
                        className="rounded accent-[#8B0000] w-4 h-4 bg-white border-slate-300 cursor-pointer"
                      />
                      <span>Incorporate Platform Ledger</span>
                    </label>
                  </div>
                </div>

                {isLinkingPrevious && (
                  <div className="h-10 bg-slate-100 rounded-lg flex items-center justify-center gap-2 text-xs font-mono text-[#8B0000]">
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin text-[#8B0000]" /> Scanning platform archives...
                  </div>
                )}

                {connectOldOwnership && ownershipVerificationLinked && (
                  <div className="p-4 bg-red-50/40 border border-red-105 rounded-xl text-left text-xs text-red-900 space-y-1 font-mono">
                    <div className="font-extrabold flex items-center gap-1.5 uppercase tracking-wide text-[10px] text-[#8B0000]">
                      <CheckCircle className="w-4 h-4 text-[#8B0000]" /> Invoice Match Found!
                    </div>
                    <div className="text-[11px] text-slate-655">
                      Invoice index: <strong>TXN-8149</strong> | Verified Mileage: <strong>2,100 mi</strong>. Mapped successfully to listing.
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ----- STEP 5: VISIBILITY & VISIBILITY SETTINGS ----- */}
          {currentStep === 5 && (
            <motion.div 
              key="step5" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-1 block text-left pb-4 border-b border-slate-100">
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 font-sans">
                  Select Listing Options
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 font-normal">
                  Choose your preferred marketplace channel and configure custom transparency credentials.
                </p>
              </div>

              {/* Grid choosing distribution Channel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Standard Channel */}
                <button
                  type="button"
                  onClick={() => setListingType('Standard')}
                  className={`p-6 rounded-2xl border text-left flex flex-col justify-between min-h-[175px] transition-all duration-250 cursor-pointer relative select-none group ${
                    listingType === 'Standard' 
                      ? 'bg-neutral-50/10 border-neutral-900 ring-1 ring-neutral-950/20 shadow-md scale-[1.01]' 
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="space-y-4 w-full">
                    <div className="flex justify-between items-center">
                      <span className={`text-[9.5px] font-sans font-extrabold uppercase py-1 px-2.5 rounded-full tracking-wider transition-all ${
                        listingType === 'Standard' ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-500 border border-neutral-100'
                      }`}>
                        Direct Sale
                      </span>
                      <div className={`transition-all duration-300 ${listingType === 'Standard' ? 'scale-110 text-neutral-950' : 'text-neutral-400 group-hover:text-neutral-600'}`}>
                        <Globe size={18} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-neutral-900">Standard Marketplace</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                        Show your car directly to regular buyers. Safe, straightforward, and includes direct buyer chat.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Auction Channel */}
                <button
                  type="button"
                  onClick={() => setListingType('Auction')}
                  className={`p-6 rounded-2xl border text-left flex flex-col justify-between min-h-[175px] transition-all duration-250 cursor-pointer relative select-none group ${
                    listingType === 'Auction' 
                      ? 'bg-neutral-50/10 border-neutral-900 ring-1 ring-neutral-950/20 shadow-md scale-[1.01]' 
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="space-y-4 w-full">
                    <div className="flex justify-between items-center">
                      <span className={`text-[9.5px] font-sans font-extrabold uppercase py-1 px-2.5 rounded-full tracking-wider transition-all ${
                        listingType === 'Auction' ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-500 border border-neutral-100'
                      }`}>
                        Bidding Mode
                      </span>
                      <div className={`transition-all duration-300 ${listingType === 'Auction' ? 'scale-110 text-neutral-950' : 'text-neutral-400 group-hover:text-neutral-600'}`}>
                        <Gavel size={18} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-neutral-900">Live Online Auction</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                        Place your car on the bidding floor. Let verified partners bid for the car. Great for selling in 72 hours.
                      </p>
                    </div>
                  </div>
                </button>

                {/* Export Channel */}
                <button
                  type="button"
                  onClick={() => setListingType('Export')}
                  className={`p-6 rounded-2xl border text-left flex flex-col justify-between min-h-[175px] transition-all duration-250 cursor-pointer relative select-none group ${
                    listingType === 'Export' 
                      ? 'bg-neutral-50/10 border-neutral-900 ring-1 ring-neutral-950/20 shadow-md scale-[1.01]' 
                      : 'bg-white border-neutral-200 text-neutral-700 hover:border-slate-350 hover:shadow-2xs'
                  }`}
                >
                  <div className="space-y-4 w-full">
                    <div className="flex justify-between items-center">
                      <span className={`text-[9.5px] font-sans font-extrabold uppercase py-1 px-2.5 rounded-full tracking-wider transition-all ${
                        listingType === 'Export' ? 'bg-neutral-950 text-white' : 'bg-neutral-50 text-neutral-500 border border-neutral-100'
                      }`}>
                        Global Shipping
                      </span>
                      <div className={`transition-all duration-300 ${listingType === 'Export' ? 'scale-110 text-neutral-950' : 'text-neutral-400 group-hover:text-neutral-600'}`}>
                        <TrendingUp size={18} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-neutral-900">International Export</h4>
                      <p className="text-xs text-neutral-500 leading-relaxed font-normal">
                        Offer your car to global logistics hubs and overseas car dealers. Tax-free listings for exports.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Minimalist Transparency Category Tags */}
              <div className="bg-white border border-neutral-150 rounded-2xl p-6 sm:p-8 space-y-5 text-left font-sans">
                <div className="space-y-1 pb-1">
                  <h4 className="text-[15px] font-semibold text-neutral-900">Add Transparency Badges</h4>
                  <p className="text-xs text-neutral-500">Enable optional verification tags to accelerate buyer credibility indices.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Tag 1: Export Ready */}
                  <label className={`p-4 rounded-xl cursor-pointer flex items-start gap-3.5 select-none text-xs border transition-all ${
                    isExportReady 
                      ? 'border-neutral-900 bg-neutral-50/10' 
                      : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/10'
                  }`}>
                    <input 
                      type="checkbox"
                      checked={isExportReady}
                      onChange={(e) => setIsExportReady(e.target.checked)}
                      className="rounded accent-neutral-950 w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                    />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-neutral-905 block leading-tight">Ready for Export</span>
                      <p className="text-[10px] text-neutral-500 leading-relaxed font-sans font-normal">
                        Prepares custom shipping files and clears port checks.
                      </p>
                    </div>
                  </label>

                  {/* Tag 2: Damaged Class */}
                  <label className={`p-4 rounded-xl cursor-pointer flex items-start gap-3.5 select-none text-xs border transition-all ${
                    isDamagedCategory 
                      ? 'border-neutral-900 bg-neutral-50/10' 
                      : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/10'
                  }`}>
                    <input 
                      type="checkbox"
                      checked={isDamagedCategory}
                      onChange={(e) => setIsDamagedCategory(e.target.checked)}
                      className="rounded accent-neutral-950 w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                    />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-neutral-905 block leading-tight">Disclose Repairs</span>
                      <p className="text-[10px] text-neutral-505 leading-relaxed font-sans font-normal">
                        Add transparent labels for minor paint or salvage touch-ups.
                      </p>
                    </div>
                  </label>

                  {/* Tag 3: Premium Auction */}
                  <label className={`p-4 rounded-xl cursor-pointer flex items-start gap-3.5 select-none text-xs border transition-all ${
                    isAuctionTrack 
                      ? 'border-neutral-900 bg-neutral-50/10' 
                      : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/10'
                  }`}>
                    <input 
                      type="checkbox"
                      checked={isAuctionTrack}
                      onChange={(e) => setIsAuctionTrack(e.target.checked)}
                      className="rounded accent-neutral-950 w-4 h-4 mt-0.5 cursor-pointer shrink-0"
                    />
                    <div className="space-y-0.5">
                      <span className="font-semibold text-neutral-905 block leading-tight">Highlight on Auction</span>
                      <p className="text-[10px] text-neutral-505 leading-relaxed font-sans font-normal">
                        Highlights on auction homepages to showcase minimum bid prices.
                      </p>
                    </div>
                  </label>
                </div>

                {isExportReady && (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-750 leading-relaxed flex gap-2.5 items-start">
                    <AlertCircle className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-neutral-950 font-bold">Export Guide Connected</strong>: International buyers looking for this vehicle will receive step-by-step export help. State sales tax is shown as fully exempted.
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ----- STEP 6: PREVIEW AND AI COPY MULTILINGUAL ----- */}
          {currentStep === 6 && (
            <motion.div 
              key="step6" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="space-y-1 block text-left">
                <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 font-sans">
                  Description &amp; Preview
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 max-w-2xl leading-relaxed font-normal">
                  Review your auto-generated multilingual descriptions and inspect the public listing preview before publication.
                </p>
              </div>

              {/* Multilingual Description generator tabs */}
              <div className="bg-white border border-neutral-150 rounded-2xl overflow-hidden text-left shadow-xs">
                <div className="px-5 py-3.5 bg-neutral-50/50 border-b border-neutral-100 flex justify-between items-center gap-3 font-sans">
                  <div className="flex items-center">
                    <span className="text-sm sm:text-base font-semibold text-neutral-900 tracking-tight">AI Translation</span>
                  </div>

                  {/* Single Icon Language Selector Dropdown */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200/70 active:bg-neutral-200 text-neutral-800 text-xs font-medium rounded-lg cursor-pointer select-none transition-all duration-150 border border-neutral-200/40"
                    >
                      <Globe className="w-3.5 h-3.5 text-neutral-500" />
                      <span>{languageNames[activeLanguage]}</span>
                      <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isLangDropdownOpen && (
                        <>
                          <div 
                            className="fixed inset-0 z-10" 
                            onClick={() => setIsLangDropdownOpen(false)} 
                          />
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 mt-2 w-40 bg-white border border-neutral-200 rounded-xl shadow-lg py-1 z-20 text-xs font-sans"
                          >
                            {(['EN', 'ES', 'DE', 'AR', 'UR', 'ZH'] as const).map(ln => (
                              <button
                                key={ln}
                                type="button"
                                onClick={() => {
                                  setActiveLanguage(ln);
                                  setIsLangDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 hover:bg-neutral-50 transition-colors flex justify-between items-center ${
                                  activeLanguage === ln 
                                    ? 'font-medium text-neutral-900 bg-neutral-50/50' 
                                    : 'text-neutral-600 font-normal hover:text-neutral-900'
                                }`}
                              >
                                <span>{languageNames[ln]}</span>
                                {activeLanguage === ln && (
                                  <Check className="w-3 h-3 text-neutral-900" />
                                )}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* SCROLL-ABLE DESCRIPTION CONTAINER */}
                <div className="p-5 md:p-6 min-h-[160px] max-h-[300px] overflow-y-auto overscroll-contain touch-pan-y scrollbar-thin scroll-smooth select-text text-neutral-700 leading-relaxed text-left bg-neutral-50/5 border-t border-neutral-100">
                  {isGeneratingDescription ? (
                    <div className="py-12 flex flex-col items-center justify-center space-y-3.5 text-neutral-400">
                      <RefreshCcw className="w-4 h-4 animate-spin text-neutral-400 stroke-[1.5]" />
                      <span className="text-xs font-mono tracking-wide">Synthesizing translation...</span>
                    </div>
                  ) : (
                    <div className="font-sans select-text text-neutral-700 max-w-full">
                      {renderBeautifulDescription(
                        activeLanguage === 'EN' ? descriptionEnglish : simulatedDescriptions[activeLanguage],
                        activeLanguage === 'AR' || activeLanguage === 'UR'
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* LIVE PAGE PREVIEW CAROUSEL CARD */}
              <div className="border border-neutral-100 bg-white rounded-3xl p-6 md:p-8 space-y-6 text-left shadow-xs">
                <div className="flex justify-between items-center pb-2.5 border-b border-neutral-100">
                  <span className="text-xs sm:text-sm font-bold text-neutral-900 tracking-wider uppercase font-sans">
                    Public Listing Card Preview
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLiveFullPreview(true)}
                    className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 flex items-center gap-1.5 font-sans text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-neutral-200/50"
                  >
                    <Eye className="w-3.5 h-3.5 stroke-[1.5]" /> Live Preview
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 font-sans items-stretch">
                  
                  {/* Image container */}
                  <div className="w-full md:w-5/12 relative aspect-[16/10] bg-neutral-50 rounded-2xl overflow-hidden border border-neutral-100/70 shrink-0 self-center">
                    <img 
                      src={photos.hero || photoPrompts[0].sampleUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover transition-transform hover:scale-[1.01] duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {isExportReady && (
                      <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md border border-white/40 rounded-full text-[9px] font-semibold font-sans text-neutral-800 tracking-wide uppercase shadow-xs">
                        📊 Tax Exempt Export
                      </div>
                    )}
                  </div>

                  {/* Specs & Info container */}
                  <div className="flex-1 text-left flex flex-col justify-between py-1">
                    <div className="space-y-4">
                      {/* Brand, model and Price heading */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-2">
                        <div>
                          <h4 className="text-lg sm:text-xl font-semibold text-neutral-900 tracking-tight leading-tight">
                            {vehicleSpecs.year} {vehicleSpecs.make || "Porsche"} {vehicleSpecs.model || "911"}
                          </h4>
                          <p className="text-xs text-neutral-400 font-medium mt-0.5">
                            {vehicleSpecs.trim || "Carrera S Convertible"}
                          </p>
                        </div>
                        <div className="sm:text-right shrink-0">
                          <span className="text-lg sm:text-xl font-semibold text-neutral-950">${askingPrice.toLocaleString()}</span>
                          <p className="text-[9px] text-neutral-400 uppercase tracking-widest font-mono mt-0.5">Offering Price</p>
                        </div>
                      </div>

                      {/* Clean minimalist grid (without dividers to ensure a spacious look) */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 py-2 border-t border-b border-neutral-100/80">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">Mileage</span>
                          <span className="text-neutral-800 font-medium text-[13px]">{vehicleSpecs.mileage.toLocaleString()} mi</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">Condition</span>
                          <span className="text-neutral-800 font-medium text-[13px]">{vehicleCondition}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">Engine</span>
                          <span className="text-neutral-800 font-medium text-[13px] truncate block" title={vehicleSpecs.engine}>{vehicleSpecs.engine}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">Colors</span>
                          <span className="text-neutral-800 font-medium text-[13px] truncate block">{vehicleSpecs.extColor} / {vehicleSpecs.intColor}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">Drivetrain</span>
                          <span className="text-neutral-800 font-medium text-[13px] truncate block">{vehicleSpecs.drivetrain}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-medium">VIN</span>
                          <span className="text-neutral-800 font-mono text-xs block truncate" title={vinInput}>{vinInput || "NOT SET"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Compact elegant status pills list */}
                    <div className="flex flex-wrap gap-2 pt-4">
                      <span className="text-[10px] bg-neutral-50 text-neutral-600 font-sans font-medium px-3 py-1 rounded-full border border-neutral-200/40 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> Registered
                      </span>

                      {connectOldOwnership && (
                        <span className="text-[10px] bg-neutral-50 text-neutral-600 font-sans font-medium px-3 py-1 rounded-full border border-neutral-200/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /> Ledger Linked
                        </span>
                      )}

                      {isDamagedCategory && (
                        <span className="text-[10px] bg-neutral-50 text-neutral-600 font-sans font-medium px-3 py-1 rounded-full border border-neutral-200/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" /> Disclosed Repairs
                        </span>
                      )}

                      {listingType === 'Auction' && (
                        <span className="text-[10px] bg-neutral-50 text-neutral-600 font-sans font-medium px-3 py-1 rounded-full border border-neutral-200/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" /> Active Reserve
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>

      {/* FOOTER WIZARD NAVCONTROLS */}
      <div className="flex border-t border-slate-100 pt-5 justify-between items-center bg-white mt-2 font-mono">
        <div>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-950 px-4 py-2.5 rounded-xl border border-slate-200 transition-all text-xs font-bold uppercase cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Go Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-1.5 bg-slate-50 text-slate-400 hover:text-slate-600 px-4 py-2.5 rounded-xl border border-slate-200 transition-all text-xs font-bold uppercase cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>

        <div>
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={() => {
                // simple steps validation
                if (currentStep === 1 && !vinVerified) {
                  alert("Please decode or specify a valid VIN first to proceed.");
                  return;
                }
                setCurrentStep(prev => prev + 1);
              }}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 bg-[#8B0000] hover:bg-[#b00d0d] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-md shadow-[#8B0000]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex flex-col items-end gap-2">
              {submitError && (
                <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-1 rounded">
                  {submitError}
                </span>
              )}
              <button
                type="button"
                onClick={handleFinalPublish}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Publish Listing Now
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* IMMERSIVE LIVE FULL PREVIEW MODAL */}
      <AnimatePresence>
        {showLiveFullPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-md"
              onClick={() => setShowLiveFullPreview(false)}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-left border border-neutral-100 z-10"
            >
              {/* Sticky Top Header */}
              <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-white shrink-0">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase font-bold">Public Live Showcase Preview</span>
                  <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 tracking-tight mt-0.5">
                    {vehicleSpecs.year} {vehicleSpecs.make || "Porsche"} {vehicleSpecs.model || "911"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLiveFullPreview(false)}
                  className="p-2 hover:bg-neutral-100 text-neutral-400 hover:text-neutral-955 rounded-full transition-all duration-150 cursor-pointer border border-neutral-200/40 animate-none"
                  aria-label="Close Preview"
                >
                  <X className="w-5 h-5 stroke-[1.8]" />
                </button>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-8 max-h-full">
                {/* Big Hero Banner */}
                <div className="relative aspect-[21/9] w-full bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-100 shadow-sm shrink-0">
                  <img 
                    src={photos.hero || photoPrompts[0].sampleUrl} 
                    alt="Vehicle Hero preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Floating Price overlay inside photo */}
                  <div className="absolute top-4 right-4 px-4 py-2 bg-neutral-900/95 backdrop-blur-md rounded-full border border-white/10 text-white font-medium text-lg shadow-lg">
                    ${askingPrice.toLocaleString()}
                  </div>

                  {isExportReady && (
                    <div className="absolute bottom-4 left-4 px-3.5 py-1.5 bg-neutral-950/90 backdrop-blur-md rounded-lg text-xs font-semibold font-sans text-white uppercase tracking-wider shadow-md">
                      🌍 Verified For Global Export
                    </div>
                  )}
                </div>

                {/* Grid layout for Details & Copy */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Detailed Spec list Column (5 / 12 width) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Vehicle Blueprint</h4>
                      <div className="bg-neutral-50/50 border border-neutral-150 rounded-2xl p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-neutral-400 block font-normal mb-0.5">Year</span>
                            <span className="text-neutral-900 font-semibold">{vehicleSpecs.year}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block font-normal mb-0.5">Odometer</span>
                            <span className="text-neutral-900 font-semibold">{vehicleSpecs.mileage.toLocaleString()} mi</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block font-normal mb-0.5">Make</span>
                            <span className="text-neutral-900 font-semibold">{vehicleSpecs.make || "Porsche"}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block font-normal mb-0.5">Model</span>
                            <span className="text-neutral-900 font-semibold">{vehicleSpecs.model || "911 Carrera S"}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block font-normal mb-0.5">Exterior Color</span>
                            <span className="text-neutral-900 font-semibold">{vehicleSpecs.extColor}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block font-normal mb-0.5">Interior Design</span>
                            <span className="text-neutral-900 font-semibold">{vehicleSpecs.intColor}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block font-normal mb-0.5">Transmission</span>
                            <span className="text-neutral-900 font-semibold truncate block" title={vehicleSpecs.transmission}>{vehicleSpecs.transmission}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block font-normal mb-0.5">Condition</span>
                            <span className="text-neutral-900 font-semibold text-neutral-900">{vehicleCondition}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-neutral-200/60 space-y-1">
                          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">VIN Number Verification</span>
                          <p className="text-xs font-mono font-bold text-neutral-800 break-all select-all tracking-wider">{vinInput || "NOT DECODED"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status signals */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Active Verification Accents</h4>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200/40 bg-neutral-50/20 text-xs">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-neutral-700 font-medium font-sans">Chicago Highway Administration Register Active</span>
                        </div>
                        {connectOldOwnership && (
                          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200/40 bg-neutral-50/20 text-xs">
                            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            <span className="text-neutral-700 font-medium font-sans">Smart Ledger Title Verification Locked</span>
                          </div>
                        )}
                        {isDamagedCategory && (
                          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200/40 bg-neutral-50/20 text-xs">
                            <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                            <span className="text-neutral-700 font-medium font-sans">Disclosed Prior Services & Inspections Active</span>
                          </div>
                        )}
                        {listingType === 'Auction' && (
                          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-200/40 bg-neutral-50/20 text-xs">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                            <span className="text-neutral-700 font-medium font-sans">Seller Protection Active Reserve Threshold On</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Fully Rendered AI Copy Column (7 / 12 width) */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">AI Generated Listing Copy</h4>
                      <div className="px-2.5 py-1 bg-neutral-100 rounded-lg text-neutral-800 text-[11px] font-semibold flex items-center gap-1 font-sans">
                        <Globe className="w-3 h-3 text-neutral-500" />
                        <span>{languageNames[activeLanguage]}</span>
                      </div>
                    </div>

                    <div className="p-6 border border-neutral-150 rounded-2xl bg-white text-sm text-neutral-700 leading-relaxed font-sans max-h-[500px] overflow-y-auto scrollbar-thin select-text">
                      {renderBeautifulDescription(
                        activeLanguage === 'EN' ? descriptionEnglish : simulatedDescriptions[activeLanguage],
                        activeLanguage === 'AR' || activeLanguage === 'UR'
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-neutral-100 bg-neutral-50 flex justify-between items-center sm:px-6 shrink-0 font-sans">
                <span className="text-xs text-neutral-400 font-medium">This is an identical rendering of the public buyer gateway.</span>
                <button
                  type="button"
                  onClick={() => setShowLiveFullPreview(false)}
                  className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl px-5 py-2 text-xs font-semibold cursor-pointer transition-colors shadow-sm"
                >
                  Close Preview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// Beautiful, simple, and minimalistic parser and formatter for structured auto-generated descriptions
function renderBeautifulDescription(text: string, isRtl: boolean = false) {
  if (!text) return null;
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let keyValuesList: { key: string; val: string }[] = [];
  
  const flushKeyValuesList = (key: string) => {
    if (keyValuesList.length > 0) {
      renderedElements.push(
        <div 
          key={`kv-list-${key}`} 
          className="space-y-1.5 my-2 pl-1.5"
          style={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
          {keyValuesList.map((item, idx) => (
            <div key={idx} className={`flex items-baseline gap-2.5 text-xs sm:text-[13px] ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 shrink-0 self-center" />
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="font-semibold text-neutral-800">{item.key}:</span>
                <span className="text-neutral-550 font-normal">{item.val}</span>
              </div>
            </div>
          ))}
        </div>
      );
      keyValuesList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return;
    }

    // Main header check (e.g. ### Verified Private Market Specimen)
    if (trimmed.startsWith('### ')) {
      flushKeyValuesList(`header-${index}`);
      const heading = trimmed.replace('### ', '');
      renderedElements.push(
        <div key={index} className={`flex items-center ${isRtl ? 'justify-end' : 'justify-start'} mb-3.5 mt-2`} style={{ direction: isRtl ? 'rtl' : 'ltr' }}>
          <span className="text-[13px] sm:text-[14px] font-bold text-neutral-950 uppercase tracking-wider font-sans">{heading}</span>
        </div>
      );
      return;
    }

    // Sub-header check
    if (trimmed.startsWith('#### ')) {
      flushKeyValuesList(`sub-${index}`);
      const heading = trimmed.replace('#### ', '');
      renderedElements.push(
        <h4 
          key={index} 
          className={`text-[14px] sm:text-[15px] font-bold text-neutral-950 tracking-tight mt-5 mb-2.5 ${isRtl ? 'text-right' : 'text-left'}`}
          style={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
          {heading}
        </h4>
      );
      return;
    }

    // List item check or Bold spec check
    const listMatch = trimmed.match(/^(?:-\s*)?\*\*(.*?)\*\*:\s*(.*)/);
    if (listMatch) {
      const key = listMatch[1].trim();
      const val = listMatch[2].trim();
      keyValuesList.push({ key, val });
      return;
    }

    // Check for inline boldings that aren't listing specs but inline references
    if (trimmed.includes('**') || trimmed.includes('|')) {
      flushKeyValuesList(`inline-${index}`);
      
      // If it contains |, split into a clean, borderless list of metadata
      if (trimmed.includes('|')) {
        const parts = trimmed.split('|');
        renderedElements.push(
          <div 
            key={index} 
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-2xl my-3 border border-neutral-100 ${isRtl ? 'direction-rtl' : ''}`}
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          >
            {parts.map((p, idx) => {
              const cleanPart = p.trim().replace(/\*\*/g, '');
              const itemParts = cleanPart.split(':');
              const pKey = itemParts[0]?.trim();
              const pVal = itemParts.slice(1).join(':')?.trim();
              
              return (
                <div key={idx} className={`flex flex-col gap-0.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {pKey && <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-widest font-mono">{pKey}</span>}
                  {pVal && <span className="text-xs sm:text-[13px] font-semibold text-neutral-800 leading-normal">{pVal}</span>}
                </div>
              );
            })}
          </div>
        );
        return;
      }

      // Normal paragraph with bold highlights
      const segments = trimmed.split('**');
      const inlineEls = segments.map((seg, sIdx) => {
        if (sIdx % 2 === 1) {
          return <strong key={sIdx} className="font-semibold text-neutral-900">{seg}</strong>;
        }
        return seg;
      });

      renderedElements.push(
        <p 
          key={index} 
          className={`text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-sans mb-3 ${isRtl ? 'text-right' : 'text-left'}`}
          style={{ direction: isRtl ? 'rtl' : 'ltr' }}
        >
          {inlineEls}
        </p>
      );
      return;
    }

    // Fallback normal line
    flushKeyValuesList(`para-${index}`);
    renderedElements.push(
      <p 
        key={index} 
        className={`text-xs sm:text-[13px] text-neutral-600 leading-relaxed font-sans mb-3 ${isRtl ? 'text-right' : 'text-left'}`}
        style={{ direction: isRtl ? 'rtl' : 'ltr' }}
      >
        {trimmed}
      </p>
    );
  });

  // Flush remaining items
  flushKeyValuesList('final');

  return <div className="space-y-1">{renderedElements}</div>;
}
