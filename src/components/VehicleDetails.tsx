/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle, Shield, Calendar, MapPin, 
  Mail, Phone, Info, AlertTriangle, ChevronRight, Activity, Clock, Play, FileText, Check, Sparkles, User, MessageSquare, Loader2, Send, Search,
  Globe
} from 'lucide-react';
import { Vehicle } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import MediaInspectionDeck from './MediaInspectionDeck';
import AIFraudWarning from './AIFraudWarning';
import SovereignActionDesk from './SovereignActionDesk';
import SellerProfileCard from './SellerProfileCard';
import SovereignClientChat from './SovereignClientChat';
import { api } from '../lib/api';
import { mapBackendVehicle, MappedVehicle } from '../lib/vehicleAdapter';

interface VehicleDetailsProps {
  vehicle: Vehicle;
  onBack: () => void;
  onNavigateToFinance: () => void;
  onNavigateToInsurance: () => void;
  initialSubPage?: 'details' | 'chat' | 'booking';
}

export default function VehicleDetails({
  vehicle: initialVehicle,
  onBack,
  onNavigateToFinance,
  onNavigateToInsurance,
  initialSubPage
}: VehicleDetailsProps) {
  const [vehicle, setVehicle] = useState<Vehicle>(initialVehicle);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refresh vehicle data from API using backend ID if available
  useEffect(() => {
    const backendId = (initialVehicle as any).__id;
    if (backendId) {
      setLoading(true);
      api.get(`/vehicles/${backendId}`)
        .then(res => {
          setVehicle(mapBackendVehicle(res));
          setError(null);
        })
        .catch(err => {
          console.error('Failed to fetch vehicle details:', err);
          setError('Failed to load latest vehicle data.');
        })
        .finally(() => setLoading(false));
    }
  }, [initialVehicle]);
  
  // AI Description & Multilingual support
  const [activeDescLanguage, setActiveDescLanguage] = useState<'EN' | 'ES' | 'DE' | 'AR' | 'UR' | 'ZH'>('EN');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const languageNames: Record<'EN' | 'ES' | 'DE' | 'AR' | 'UR' | 'ZH', string> = {
    EN: 'English',
    ES: 'Español',
    DE: 'Deutsch',
    AR: 'العربية',
    UR: 'اردو',
    ZH: '中文'
  };

  const resolvedDescriptions = useMemo(() => {
    if (vehicle.descriptions) {
      return vehicle.descriptions;
    }
    
    // Generate high-integrity custom descriptions dynamically for preloaded vehicles
    const make = vehicle.make || 'Porsche';
    const model = vehicle.model || '911 Carrera S';
    const year = vehicle.year;
    const cond = (vehicle.condition || 'Excellent').toLowerCase();
    const mileage = vehicle.mileage.toLocaleString();
    const trimValue = vehicle.trim || 'Premium Spec';
    const engineValue = vehicle.engine || 'Direct Injection Twin Power';
    const driveTypeValue = vehicle.driveType || 'AWD';
    const transmissionValue = vehicle.transmission || 'Automatic Dual Clutch';
    const extColorValue = vehicle.extColor || 'Silver Pearl Metallic';
    const intColorValue = vehicle.intColor || 'Nappa Alcantara Black';

    const currConditionAdj = (c: string) => {
      if (c === 'excellent') return 'Concours Pristine (Grade AAA+)';
      if (c === 'good') return 'Healthy Profile (Grade A)';
      if (c === 'fair') return 'Operable Average (Grade B)';
      return 'Rebuilt/Restoration Candidate (Grade C)';
    };

    return {
      EN: `### Verified Private Market Specimen\n**Vehicle**: ${year} ${make} ${model} (${trimValue})\n**Condition**: Verified ${currConditionAdj(cond)} | **Odometer**: ${mileage} miles\n\n#### Summary Description\nAn outstanding, exceptionally clean, and highly maintained investment-grade vehicle. This beautiful asset has passed a comprehensive multi-point sovereign inspection, verifying drivetrain health, structural integrity, and electronic components zero-fault active readings.\n\n#### Key Specifications & Build Outline\n- **Engine**: ${engineValue} delivering thrilling propulsion\n- **Traction Core**: ${driveTypeValue} with traction-vector and chassis dampeners\n- **Transmission**: ${transmissionValue}\n- **Stance & Body**: Framed in striking ${extColorValue} with pristine ${intColorValue} interior finishes.\n- **Registry Footprint**: 1-owner clean title verified directly on state transport networks.\n\n#### Transaction Guarantees\nOffered under direct Sovereign Escrow standards. Supports immediate payment settlement verification, smart logistics port transit (for international export targets), and certified B2B claim safety protocols.`,
      ES: `### Espécimen Escrow Soberano Profesional\n**Vehículo**: ${year} ${make} ${model} (${trimValue})\n**Condición**: Verificado ${currConditionAdj(cond)} | **Odómetro**: ${mileage} millas\n\n#### Descripción Resumida\nUn dechado de ingeniería, extraordinariamente limpio y con un riguroso mantenimiento. Certifica la salud de la transmisión, la solidez estructural y un funcionamiento impecable.\n\n#### Especificaciones Clave\n- **Motor**: ${engineValue}\n- **Núcleo de Tracción**: ${driveTypeValue}\n- **Transmisión**: ${transmissionValue}\n- **Colores**: Acabados en ${extColorValue} exterior con interiores de ${intColorValue}.`,
      DE: `### Professionelles Sovereign Escrow-Fahrzeug\n**Fahrzeug**: ${year} ${make} ${model} (${trimValue})\n**Zustand**: Geprüft ${currConditionAdj(cond)} | **Kilometerstand**: ${mileage} Meilen\n\n#### Zusammenfassung\nEin herausragendes, außergewöhnlich gepflegtes und hochwertiges Fahrzeug. Dieses wunderschöne Automobil hat die umfassende mechanische Sicherheitsprüfung erfolgreich bestanden.\n\n#### Technische Daten\n- **Motor**: ${engineValue}\n- **Antrieb**: ${driveTypeValue}\n- **Getriebe**: ${transmissionValue}\n- **Lackierung**: Atemberaubendes ${extColorValue} gepaart mit edlem ${intColorValue}-Interieur.`,
      AR: `### مركبة عالية الجودة والتحقق الفني\n**المركبة**: ${year} ${make} ${model} (${trimValue})\n**الحالة**: معتمدة ومفحوصة بدقة | **عداد المسافة**: ${mileage} ميل\n\n#### الوصف التفصيلي\nسيارة استثنائية تتمتع بأعلى معايير الصيانة والاهتمام. تم التحقق من سلامة المحرك والناقل والبدن هيكليًا وفنيًا برعاية كاملة.\n\n#### المواصفات الرئيسية\n- **المحرك**: ${engineValue}\n- **نظام الدفع**: ${driveTypeValue}\n- **ناقل الحركة**: ${transmissionValue}\n- **الألوان**: طلاء خارجي ${extColorValue} مع مقصورة أنيقة باللون ${intColorValue}.`,
      UR: `### تسلی بخش اور تصدیق شدہ دستاویزاتی گاڑی\n**گاڑی**: ${year} ${make} ${model} (${trimValue})\n**حالت**: مستند معیار کے مطابق | **اوڈومیٹر**: ${mileage} میل\n\n#### خلاصہ اور تفصیل\nانتہائی شاندار، صاف ستھری اور نگہداشت کے ساتھ رکھی گئی پریمیم گاڑی۔ اس نے تمام تکنیکی معائنہ جات اور ریگولیٹری چیکس کامیابی سے مکمل کیے ہیں۔\n\n#### بنیادی خصوصیات\n- **انجن**: ${engineValue}\n- **ڈرائیو ٹائپ**: ${driveTypeValue}\n- **ٹرانسمیشن**: ${transmissionValue}\n- **رنگ**: بیرونی طلاء ${extColorValue} اور اندرونی فنشنگ ${intColorValue} کے ساتھ۔`,
      ZH: `### 特级主权托管认证车辆\n**型号**: ${year} ${make} ${model} (${trimValue})\n**车况**: 经过官方高质量多点检测 | **里程数**: ${mileage} 英里\n\n#### 精炼文案总结\n一辆表现优异且享有顶级保养维护的优质车源。全套动力总成、车身底盘以及防碰撞零故障系统均经过细致入微的技术校准。\n\n#### 核心配置说明\n- **发动机气缸**: ${engineValue}\n- **传动与驱动**: ${driveTypeValue}\n- **变速箱**: ${transmissionValue}\n- **外观内饰**: 涂装为 ${extColorValue}，搭配典雅的 ${intColorValue} 配色内饰。`
    };
  }, [vehicle]);

  // Separate view page controller state
  const [activeSubPage, setActiveSubPage] = useState<'details' | 'chat' | 'booking'>(initialSubPage || 'details');

  useEffect(() => {
    if (initialSubPage) {
      setActiveSubPage(initialSubPage);
    }
  }, [initialSubPage]);

  // Custom scrolling and highlighting anchor
  const [highlightedModule, setHighlightedModule] = useState<string | null>(null);

  const scrollToAnchor = (id: string) => {
    if (id === 'chat-anchor' || id === 'chat') {
      setActiveSubPage('chat');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (id === 'booking-anchor' || id === 'booking') {
      setActiveSubPage('booking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (id === 'configure-anchor' || id === 'configure') {
      setActiveSubPage('details');
      setHighlightedModule('finance-logistics-anchor');
      setTimeout(() => {
        const element = document.getElementById('finance-logistics-anchor');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
      setTimeout(() => {
        setHighlightedModule(null);
      }, 3000);
      return;
    }
    setHighlightedModule(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setHighlightedModule(null);
    }, 2000);
  };

  // Chat messaging panel states with WhatsApp-like multi-room setup
  interface ChatRoom {
    id: string;
    name: string;
    avatar: string;
    initials: string;
    role: string;
    isOnline: boolean;
    messages: Array<{ sender: 'user' | 'agent'; text: string; time: string }>;
    typing: boolean;
  }

  const [activeChatRoomId, setActiveChatRoomId] = useState<string>('christian');
  const [mobileShowList, setMobileShowList] = useState<boolean>(false);
  const [chatSearchQuery, setChatSearchQuery] = useState<string>('');

  const [chatRooms, setChatRooms] = useState<Record<string, ChatRoom>>({
    christian: {
      id: 'christian',
      name: 'Christian Valade',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120', // Christian Valade high-quality portrait
      initials: 'CV',
      role: 'Senior Client Concierge',
      isOnline: true,
      messages: [
        { 
          sender: 'agent', 
          text: `Greetings, John. I am Christian, your senior Client Concierge at JustCarSale Escrow. I have compiled and verified all high-definition telematics, historical title registration logs, and customs tolerances for this ${vehicle.year} ${vehicle.make}. How may I guide your procurement cycle today?`, 
          time: '10:42 AM' 
        }
      ],
      typing: false
    },
    elena: {
      id: 'elena',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120', // Elena Rostova high-quality portrait
      initials: 'ER',
      role: 'Logistics Coordinator',
      isOnline: true,
      messages: [
        {
          sender: 'agent',
          text: `Hello, John! Elena here from the Freight Logistics hub. I have pre-allocated closed trailer carriage space for this ${vehicle.make}. Do you have a preferred transit corridor or target delivery date?`,
          time: '11:15 AM'
        }
      ],
      typing: false
    },
    aria: {
      id: 'aria',
      name: 'Aria Vance',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120', // Aria Vance high-quality portrait
      initials: 'AV',
      role: 'Escrow Finance Officer',
      isOnline: true,
      messages: [
        {
          sender: 'agent',
          text: `Greetings, John. Aria here from commercial treasury operations. I am tracking the secure escrow funding schedules and customized lease limits of 5.9% APR of your ${vehicle.make} transaction. Feel free to ask about credit requirements!`,
          time: 'Yesterday'
        }
      ],
      typing: false
    },
    sovereign: {
      id: 'sovereign',
      name: 'Sovereign Protection Care',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120', // Support desk specialist portrait
      initials: 'SP',
      role: 'Warranty & Claims Desk',
      isOnline: false,
      messages: [
        {
          sender: 'agent',
          text: `Welcome to Sovereign Guard Care support desk. Here you can configure Elite Powertrain Coverage and custom secondary liability offset waivers. Please let us know if you need help with pre-authorizations.`,
          time: '3 days ago'
        }
      ],
      typing: false
    }
  });

  const [chatInput, setChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const userMsg = chatInput.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const roomId = activeChatRoomId;
    const backendVehicleId = (vehicle as any).__id;
    const sellerId = (vehicle as any).__sellerId;

    // Append user message locally for immediate feedback
    setChatRooms(prev => {
      const currentRoom = prev[roomId];
      if (!currentRoom) return prev;
      return {
        ...prev,
        [roomId]: {
          ...currentRoom,
          messages: [...currentRoom.messages, { sender: 'user', text: userMsg, time: currentTime }],
          typing: true
        }
      };
    });
    setChatInput('');
    setIsSendingChat(true);

    try {
      // If it's a real seller, send to backend
      if (roomId === 'christian' && sellerId) {
        await api.post('/messages', {
          receiverId: sellerId,
          vehicleId: backendVehicleId,
          content: userMsg
        });
      }
      
      // Dispatch custom automated response (mocking for non-seller rooms or as a fallback/simulated agent)
      setTimeout(() => {
        const lower = userMsg.toLowerCase();
        let replyText = "";

        if (roomId === 'christian') {
          if (lower.includes("price") || lower.includes("offer") || lower.includes("cost") || lower.includes("valuation") || lower.includes("buy")) {
            replyText = `Regarding the escrow pricing matrix, the listed valuation of $${vehicle.price.toLocaleString()} is within the regional median. Feel free to submit your target offer directly on our ledger panel at any time.`;
          } else if (lower.includes("miles") || lower.includes("mileage") || lower.includes("odometer") || lower.includes("kilometer")) {
            replyText = `This ${vehicle.year} ${vehicle.make} holds exactly ${vehicle.mileage.toLocaleString()} certified miles. Our Houston Distribution sweep indicates complete historical parity with zero anomalies or tampering warnings.`;
          } else if (lower.includes("finance") || lower.includes("lease") || lower.includes("monthly") || lower.includes("down") || lower.includes("apr")) {
            replyText = `For corporate or personal financing, we support excel (4.9%), good (6.5%), and fair (8.9%) APR credit allocations. You can configure down payments and lock in this rate securely in the Finance segment.`;
          } else if (lower.includes("shipping") || lower.includes("transport") || lower.includes("freight") || lower.includes("delivery")) {
            replyText = `Our logistics network processes fully enclosed luxury transport as well as standard car carriers. You can calculate full route expenses under Escrow Seals instantly in the Freight Booking calculator.`;
          } else if (lower.includes("insurance") || lower.includes("warranty") || lower.includes("claims")) {
            replyText = `The sovereign liability escrow addon and Elite Powertrain Warranty lock instantly upon transaction completion. No active claims or liens are associated with this vehicle chassis, verifying a spotless integrity index.`;
          } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("greetings")) {
            replyText = `Greetings, John! I am here to facilitate secure transacting, logistics matching, and customs declaration for this ${vehicle.make}. How may I serve your procurement cycle today?`;
          } else {
            replyText = `Splendid request. I have referenced the telematics dashboard and complete title logs for this ${vehicle.make}. We can coordinate direct inspections, dealer test drives, or log escrow financing pre-approvals whenever you are ready.`;
          }
        } else if (roomId === 'elena') {
          if (lower.includes("cost") || lower.includes("price") || lower.includes("rate") || lower.includes("freight") || lower.includes("delivery")) {
            replyText = `Our freight rate is highly competitive. Open carrier averages $0.75 per mile, while our elite Enclosed Cargo averages $1.50 per mile with complete environmental isolation. Under sovereign logistics, this remains completely locked.`;
          } else if (lower.includes("time") || lower.includes("when") || lower.includes("day") || lower.includes("schedule")) {
            replyText = `Typically, dispatch occurs within 48 hours of secure escrow clearance. The transit corridor for this route generally takes 3 to 5 calendar days depending on weather and truck route planning.`;
          } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("greetings")) {
            replyText = `Hello John! How can I assist you with the delivery setup? Ask me about transport quotes, schedules, or enclosed trailer specifications!`;
          } else {
            replyText = `Understood. I will cross-reference this requirement with our carrier log database. Let me know if you would like me to lock a premium trailer slot for this transit route.`;
          }
        } else if (roomId === 'aria') {
          if (lower.includes("apr") || lower.includes("rate") || lower.includes("interest") || lower.includes("finance")) {
            replyText = `Our tier-1 interest rate is 5.9% APR for terms up to 60 months. This is secured through premier sovereign partner banks, requiring a minimal downpayment of roughly 15%.`;
          } else if (lower.includes("deposit") || lower.includes("escrow") || lower.includes("wire") || lower.includes("payment")) {
            replyText = `All deposits are safely stored in high-tier bank vaults and only released into the dealer account on the exact moment you inspect the registration and sign the release protocol.`;
          } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("greetings")) {
            replyText = `Greetings, John! I am ready to process your escrow wire configurations or lease limits. What terms are you hoping to secure today?`;
          } else {
            replyText = `Splendid terms. I have updated our finance files with these coordinates. Once you click 'Apply Lease Approval' in the Configure center, it instantly locks in our treasury ledger.`;
          }
        } else { // sovereign protection care desk
          if (lower.includes("warranty") || lower.includes("repair") || lower.includes("break") || lower.includes("engine")) {
            replyText = `Our Elite Powertrain Warranty provides 12-month zero-deductible coverage on the engine blocks, gear housing, differential joints, and all active fuel line pumps. Let me know if you want customized durations.`;
          } else if (lower.includes("cost") || lower.includes("premium") || lower.includes("price")) {
            replyText = `Liability surcharges average $45/mo, and secondary powertrain warranty adds a standard $75/mo. Submitting these in the procurement desk adds them safely directly to your escrow ledger.`;
          } else if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey") || lower.includes("greetings")) {
            replyText = `Hello! How can Sovereign Care help secure your vehicle purchase today? Ask me about warranty plans, mechanical reviews, or immediate coverage setup.`;
          } else {
            replyText = `Understood. Your protection preferences are saved in the sovereign ledger database. Once activated, continuous status monitoring triggers immediately.`;
          }
        }

        setChatRooms(prev => {
          const currentRoom = prev[roomId];
          if (!currentRoom) return prev;
          return {
            ...prev,
            [roomId]: {
              ...currentRoom,
              messages: [...currentRoom.messages, { sender: 'agent', text: replyText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
              typing: false
            }
          };
        });
      }, 1000);
    } catch (err) {
      console.error('Failed to send message:', err);
      // local error handling could go here
    } finally {
      setIsSendingChat(false);
    }
  };

  // Service / Title / Check tabs state for the Documentation segment
  const [serviceLogsTab, setServiceLogsTab] = useState<'logs' | 'title' | 'check'>('title');

  // Interactive bid/offer variables
  const [offerAmount, setOfferAmount] = useState<string>((vehicle.price * 0.96).toFixed(0));
  const [isOfferSubmitted, setIsOfferSubmitted] = useState<boolean>(false);
  const [offerMessage, setOfferMessage] = useState<string>('');

  // Booking Schedulers states
  const [schedulingIntent, setSchedulingIntent] = useState<'testdrive' | 'checkup' | 'escrow'>('testdrive');
  const [schedulingDate, setSchedulingDate] = useState<number>(18);
  const [schedulingTime, setSchedulingTime] = useState<string>('11:00 AM');
  const [nomineeName, setNomineeName] = useState<string>('John Doe');
  const [nomineePhone, setNomineePhone] = useState<string>('+1 (555) 019-2831');
  const [displayAppointmentAlert, setDisplayAppointmentAlert] = useState<boolean>(false);

  // Freight Transport calculator states
  const [transitDistance, setTransitDistance] = useState<number>(450);
  const [carrierType, setCarrierType] = useState<'enclosed' | 'open'>('enclosed');
  const [transportBooked, setTransportBooked] = useState<boolean>(false);

  // Underwritten Leasing states
  const [downPayment, setDownPayment] = useState<number>(Math.floor(vehicle.price * 0.25));
  const [aprRating, setAprRating] = useState<'excel' | 'good' | 'fair'>('excel');
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [leaseAuthorized, setLeaseAuthorized] = useState<boolean>(false);

  // Asset Insurance states
  const [nomineeAge, setNomineeAge] = useState<number>(35);
  const [claimsHistory, setClaimsHistory] = useState<string>('0 active claims, clean record');
  const [liabilityAddon, setLiabilityAddon] = useState<boolean>(true);
  const [warrantyAddon, setWarrantyAddon] = useState<boolean>(false);
  const [insuranceAuthorized, setInsuranceAuthorized] = useState<boolean>(false);

  // Dynamic Finance values calculation
  const calculatedFinance = useMemo(() => {
    const minDownPayment = 5000;
    const maxDownPayment = Math.floor(vehicle.price * 0.8);
    const checkedDownPayment = Math.max(minDownPayment, Math.min(maxDownPayment, downPayment));
    const principalLoan = vehicle.price - checkedDownPayment;
    
    let aprVal = 4.9;
    if (aprRating === 'good') aprVal = 6.5;
    if (aprRating === 'fair') aprVal = 8.9;

    const r = aprVal / 100 / 12;
    const n = loanTerm;
    
    let estimatedLease = 0;
    if (principalLoan > 0) {
      if (r > 0) {
        estimatedLease = (principalLoan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      } else {
        estimatedLease = principalLoan / n;
      }
    }

    return {
      principalLoan,
      appliedApr: aprVal,
      estimatedLease: Math.round(estimatedLease)
    };
  }, [vehicle.price, downPayment, aprRating, loanTerm]);

  // Dynamic Carrier quote calculation
  const calculatedCarrier = useMemo(() => {
    const ratePerMile = carrierType === 'enclosed' ? 2.25 : 1.35;
    const mileageCost = transitDistance * ratePerMile;
    const escrowSeal = 180.00;
    const totalFreight = mileageCost + escrowSeal;
    return {
      mileageCost,
      escrowSeal,
      totalFreight
    };
  }, [transitDistance, carrierType]);

  // Dynamic Insurance cost calculation
  const calculatedInsurance = useMemo(() => {
    let baseRate = 95.00;
    const addonCost = (liabilityAddon ? 35.00 : 0.0) + (warrantyAddon ? 45.00 : 0.0);
    
    let ageModifier = 0;
    if (nomineeAge < 25) ageModifier = 30;
    else if (nomineeAge > 65) ageModifier = 15;
    else ageModifier = (35 - nomineeAge) * 0.4;

    const comprehensiveRate = baseRate + addonCost + ageModifier;
    return {
      baseRate,
      comprehensiveRate: Math.max(80, Math.round(comprehensiveRate))
    };
  }, [nomineeAge, liabilityAddon, warrantyAddon]);

  // Handle offer submission
  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOfferSubmitted(true);
    setOfferMessage(`Your offer of $${Number(offerAmount).toLocaleString()} has been recorded into the secure escrow ledger.`);
  };

  // Handle appointment scheduling submission
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayAppointmentAlert(true);
  };

  // Calendar dates mock generator for June 2026
  const calendarDays = useMemo(() => {
    const days: { date: number; enabled: boolean }[] = [];
    for (let i = 1; i <= 30; i++) {
      days.push({
        date: i,
        enabled: i >= 15
      });
    }
    return days;
  }, []);

  const formatPrice = (num: number) => {
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  };

  if (activeSubPage === 'chat') {
    return (
      <div className="w-full bg-zinc-50/70 text-zinc-900 font-sans min-h-screen py-4 sm:py-8 px-2 sm:px-6 select-none animate-fadeIn flex flex-col justify-center items-center">
        <div className="max-w-6xl w-full">
          <SovereignClientChat 
            standalone 
            vehicleId={vehicle.id} 
            onBack={() => setActiveSubPage('details')}
          />
        </div>
      </div>
    );
  }
  if (activeSubPage === 'booking') {
    return (
      <div className="w-full bg-white text-zinc-900 font-sans min-h-screen py-10 px-4 sm:px-6 select-none animate-fadeIn">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header & Back Button */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200/50">
            <button
              onClick={() => setActiveSubPage('details')}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-500 hover:text-zinc-600 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Details
            </button>
            <span className="text-[10px] font-mono text-zinc-400 font-black uppercase tracking-widest">
              Secure Appointment Desk
            </span>
          </div>

          {/* Apple-style intro header - Removed per user request */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Booking Configurator Columns */}
            <div className="lg:col-span-8 bg-zinc-50/40 border border-zinc-200/50 rounded-3xl p-6 space-y-6">
              
              {/* Step 1: Booking Intent */}
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#8B0000] block">
                  1. Choose Intent Action
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => { setSchedulingIntent('testdrive'); setDisplayAppointmentAlert(false); }}
                    className={`py-3 px-3 text-center rounded-2xl border text-[10px] font-sans font-black uppercase tracking-wider transition-all cursor-pointer ${
                      schedulingIntent === 'testdrive' 
                        ? 'bg-[#8B0000] text-white border-[#8B0000]' 
                        : 'bg-white hover:bg-zinc-50 border-zinc-200/60 text-zinc-700'
                    }`}
                  >
                    Dealer Test Drive
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSchedulingIntent('checkup'); setDisplayAppointmentAlert(false); }}
                    className={`py-3 px-3 text-center rounded-2xl border text-[10px] font-sans font-black uppercase tracking-wider transition-all cursor-pointer ${
                      schedulingIntent === 'checkup' 
                        ? 'bg-[#8B0000] text-white border-[#8B0000]' 
                        : 'bg-white hover:bg-zinc-50 border-zinc-200/60 text-zinc-700'
                    }`}
                  >
                    Independent Audit
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSchedulingIntent('escrow'); setDisplayAppointmentAlert(false); }}
                    className={`py-3 px-3 text-center rounded-2xl border text-[10px] font-sans font-black uppercase tracking-wider transition-all cursor-pointer ${
                      schedulingIntent === 'escrow' 
                        ? 'bg-[#8B0000] text-white border-[#8B0000]' 
                        : 'bg-white hover:bg-zinc-50 border-zinc-200/60 text-zinc-700'
                    }`}
                  >
                    Registry Hold
                  </button>
                </div>
              </div>

              {/* Steps 2 & 3: Date & Time Scheduler */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-zinc-150/40">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                    2. Select Date (June)
                  </span>
                  <div className="border border-zinc-200/65 p-3 rounded-2xl bg-white">
                    <div className="grid grid-cols-7 gap-1 text-[8px] text-center font-black text-zinc-400 pb-2 border-b border-zinc-100">
                      <span>SU</span><span>MO</span><span>TU</span><span>WE</span><span>TH</span><span>FR</span><span>SA</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 pt-2 text-[9px]">
                      <span className="py-0.5" />
                      {calendarDays.map((day) => (
                        <button
                          key={day.date}
                          type="button"
                          onClick={() => { if (day.enabled) { setSchedulingDate(day.date); setDisplayAppointmentAlert(false); } }}
                          className={`py-1 rounded-md text-[9.5px] font-bold tracking-tight transition-all ${
                            !day.enabled 
                              ? 'text-zinc-200 pointer-events-none' 
                              : schedulingDate === day.date
                                ? 'bg-[#8B0000] text-white font-black'
                                : 'hover:bg-zinc-100 text-zinc-700 cursor-pointer font-extrabold'
                          }`}
                        >
                          {day.date}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                    3. Choose Slot Time
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'].map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => { setSchedulingTime(time); setDisplayAppointmentAlert(false); }}
                        className={`py-2 rounded-xl border text-[10px] font-black transition-all cursor-pointer ${
                          schedulingTime === time 
                            ? 'bg-[#8B0000] border-[#8B0000] text-white' 
                            : 'bg-white border-zinc-200 hover:bg-[#fafafa] text-zinc-700 font-extrabold'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-[#eefdf4] border border-[#bbf7d0]/45 text-[#047857] rounded-xl text-[10px] font-black flex items-center justify-between shadow-xs">
                    <span className="uppercase tracking-wider">Slot:</span>
                    <span>June {schedulingDate}, 2026 • {schedulingTime}</span>
                  </div>
                </div>
              </div>

              {/* Nominee Form */}
              <div className="pt-5 border-t border-zinc-150/40 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block">
                  4. Designee Coordinates
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block">Designee Display Name</label>
                    <input
                      type="text"
                      required
                      value={nomineeName}
                      onChange={(e) => setNomineeName(e.target.value)}
                      className="w-full h-10 bg-white hover:bg-zinc-50/50 border border-zinc-200 hover:border-zinc-300 px-3.5 rounded-xl text-xs font-semibold text-zinc-900 focus:border-[#8B0000] focus:ring-4 focus:ring-[#8B0000]/5 focus:bg-white outline-none transition-all duration-150"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block">Contact Phone Number</label>
                    <input
                      type="text"
                      required
                      value={nomineePhone}
                      onChange={(e) => setNomineePhone(e.target.value)}
                      className="w-full h-10 bg-white hover:bg-zinc-50/50 border border-zinc-200 hover:border-zinc-300 px-3.5 rounded-xl text-xs font-semibold text-zinc-900 focus:border-[#8B0000] focus:ring-4 focus:ring-[#8B0000]/5 focus:bg-white outline-none transition-all duration-150"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-zinc-150/40">
                <button
                  type="button"
                  onClick={handleBookingSubmit}
                  className="w-full py-3.5 bg-[#8B0000] hover:bg-zinc-800 text-white text-[11px] font-black uppercase tracking-widest rounded-xl cursor-pointer transition-all active:scale-95 shadow-xs"
                >
                  Locate &amp; Reserve Appointment Slot
                </button>
              </div>

            </div>

            {/* Side Status Panel */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-zinc-200/50 rounded-3xl p-5 space-y-4">
                <div className="pb-1.5 border-b border-zinc-100">
                  <span className="inline-block text-[10px] font-black uppercase tracking-wider text-[#8B0000] bg-red-50 border border-red-100/60 px-3 py-1 rounded-full">
                    Registry Status
                  </span>
                </div>
                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500">Selected Action:</span>
                    <span className="font-extrabold text-zinc-950 uppercase text-[10.5px]">
                      {schedulingIntent === 'testdrive' ? 'Dealer Test Drive' : schedulingIntent === 'checkup' ? 'Mechanical Audit' : 'Registry Hold'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-zinc-500">Vetting Status:</span>
                    <span className="font-black text-[#047857] flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></div> Active Vetting
                    </span>
                  </div>
                  <div className="text-[9.5px]/relaxed text-zinc-400 font-sans">
                    * Confirmed scheduling blocks are holding parameters for up to 48 hours to complete inspections or payment.
                  </div>
                </div>
              </div>

              {/* Feedback Success State */}
              {displayAppointmentAlert && (
                <div className="p-5 bg-[#eefdf4] border border-[#bbf7d0]/65 text-[#047857] rounded-3xl space-y-3 shadow-xs">
                  <h5 className="text-[11px] uppercase font-black flex items-center gap-1.5 text-[#047857]">
                    <CheckCircle className="w-4.5 h-4.5 text-[#10b981]" /> Hold Secured Successfully
                  </h5>
                  <p className="text-[11px]/relaxed text-[#065f46] font-medium font-sans">
                    Hey {nomineeName}, your reservation for <strong>{schedulingIntent === 'testdrive' ? 'Dealer Test Drive' : schedulingIntent === 'checkup' ? 'Independent Audit' : 'Registry Hold'}</strong> is logged on <strong>June {schedulingDate}, 2026 at {schedulingTime}</strong>. A support coordinator will reach you at {nomineePhone} shortly!
                  </p>
                  <button 
                    type="button"
                    onClick={() => setActiveSubPage('details')} 
                    className="w-full bg-white border border-[#bbf7d0]/50 hover:bg-[#fafafa] text-[#047857] text-[10px] font-black uppercase tracking-wider py-2 rounded-xl cursor-pointer transition-all"
                  >
                    Return to Details page
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#fafafa] py-6 px-3 lg:px-6 text-zinc-800 font-sans min-h-screen" id="high-fidelity-vehicle-root">
      
      {/* Return Navigation Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-200/60 pb-4 mb-6 gap-3">
        <motion.button
          whileHover={{ x: -3 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-widest text-zinc-600 hover:text-zinc-950 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-500" /> Return to Marketplace
        </motion.button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-zinc-900 text-zinc-100 font-mono font-medium px-3 py-1 rounded-full shadow-xs tracking-wider">
            VIN: {vehicle.vin}
          </span>
        </div>
      </div>

      {/* Main Streamlined Dual Column Layout Structure */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* =========================================================
            LEFT COLUMN (col-span-8) - Core Product Specs & Tools
            ========================================================= */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* 1. HD Inspection Media Deck */}
          <MediaInspectionDeck images={vehicle.images} vehicleMake={vehicle.make} />

          {/* 2. AI Fraud Warning module */}
          <AIFraudWarning vin={vehicle.vin} mileage={vehicle.mileage} />

          {/* AI-Generated Multilingual Summary & Outline (Apple Inspired) */}
          <motion.div 
            id="ai-description-anchor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-zinc-200/60 rounded-[22px] p-6 transition-all duration-300 space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-3.5 gap-3">
              <div className="flex items-center gap-2.5">
                <div>
                  <h3 className="text-sm font-sans font-black tracking-tight text-zinc-900 uppercase">
                    AI-Generated Summary &amp; Outline
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-sans font-medium mt-0.5">
                    Real-time synthesis of vehicle history, inspections, and drivetrain metrics.
                  </p>
                </div>
              </div>

              {/* Robust low-profile language selection dropdown */}
              <div className="relative shrink-0 select-none">
                <button
                  type="button"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 px-3.5 py-1.5 rounded-full text-xs font-semibold text-zinc-750 transition-all cursor-pointer shadow-xs"
                >
                  <Globe className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{languageNames[activeDescLanguage]}</span>
                  <ChevronRight className={`w-3 h-3 text-zinc-450 transition-transform ${isLangDropdownOpen ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <>
                      {/* Click overlay to close */}
                      <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsLangDropdownOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 mt-2 w-[160px] bg-white border border-zinc-250/70 rounded-2xl p-1.5 shadow-[0_20px_40px_-8px_rgba(0,0,0,0.15)] z-50 flex flex-col gap-0.5"
                      >
                        {(Object.keys(languageNames) as Array<'EN' | 'ES' | 'DE' | 'AR' | 'UR' | 'ZH'>).map((lang) => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => {
                              setActiveDescLanguage(lang);
                              setIsLangDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2 rounded-xl text-[11.5px] font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                              activeDescLanguage === lang 
                                ? 'bg-zinc-100 text-zinc-950 font-extrabold' 
                                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                            }`}
                          >
                            <span>{languageNames[lang]}</span>
                            {activeDescLanguage === lang && (
                              <Check className="w-3.5 h-3.5 text-zinc-950 stroke-[3]" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Formatted scrollable display field */}
            <div className="p-5 sm:p-6 bg-zinc-50/50 border border-zinc-150/55 rounded-2xl min-h-[160px] max-h-[480px] overflow-y-auto overscroll-contain select-text scrollbar-thin scroll-smooth text-left">
              <div className="font-sans select-text text-zinc-700 leading-relaxed text-left">
                {renderBeautifulDescription(
                  resolvedDescriptions[activeDescLanguage],
                  activeDescLanguage === 'AR' || activeDescLanguage === 'UR'
                )}
              </div>
            </div>
          </motion.div>

          {/* 3. Specs Panel (VIN-decoded) */}
          <motion.div 
            id="tech-specs-anchor"
            className={`bg-white border rounded-[22px] p-6 transition-all duration-300 space-y-6 select-none ${
              highlightedModule === 'tech-specs-anchor' ? 'border-zinc-350 ring-4 ring-zinc-900/5' : 'border-zinc-200/60'
            }`}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h3 className="text-sm font-sans font-black tracking-tight text-zinc-900 uppercase">
                VIN-Decoded Specifications
              </h3>
            </div>

            {/* Specs Grid with smooth elements */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="bg-[#fafafa] p-3 rounded-2xl border border-zinc-100 flex flex-col justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wide text-zinc-400 block pb-1 font-sans">O.E.M. Year</span>
                <span className="text-[12px] font-black text-zinc-800 font-sans">{vehicle.year}</span>
              </div>
              <div className="bg-[#fafafa] p-3 rounded-2xl border border-zinc-100 flex flex-col justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wide text-zinc-400 block pb-1 font-sans">Engine / Power</span>
                <span className="text-[12px] font-black text-zinc-800 truncate block font-sans" title={vehicle.engine}>{vehicle.engine}</span>
              </div>
              <div className="bg-[#fafafa] p-3 rounded-2xl border border-zinc-100 flex flex-col justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wide text-zinc-400 block pb-1 font-sans">Trim Grade</span>
                <span className="text-[12px] font-black text-zinc-800 truncate block font-sans" title={vehicle.trim}>{vehicle.trim || "Standard"}</span>
              </div>
              <div className="bg-[#fafafa] p-3 rounded-2xl border border-zinc-100 flex flex-col justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wide text-zinc-400 block pb-1 font-sans">Drivetrain</span>
                <span className="text-[12px] font-black text-zinc-805 uppercase font-sans">{vehicle.driveType}</span>
              </div>
              <div className="bg-[#fafafa] p-3 rounded-2xl border border-zinc-100 flex flex-col justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wide text-zinc-400 block pb-1 font-sans">Gearbox Spec</span>
                <span className="text-[12px] font-black text-zinc-800 truncate block font-sans" title={vehicle.transmission}>{vehicle.transmission}</span>
              </div>
              <div className="bg-[#fafafa] p-3 rounded-2xl border border-zinc-100 flex flex-col justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wide text-zinc-400 block pb-1 font-sans">Odometer Log</span>
                <span className="text-[12px] font-black text-zinc-800 font-sans">{vehicle.mileage.toLocaleString()} mi</span>
              </div>
              <div className="bg-[#fafafa] p-3 rounded-2xl border border-zinc-100 flex flex-col justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wide text-zinc-400 block pb-1 font-sans">Exterior Color</span>
                <span className="text-[12px] font-black text-zinc-805 truncate block font-sans" title={vehicle.extColor}>{vehicle.extColor}</span>
              </div>
              <div className="bg-[#fafafa] p-3 rounded-2xl border border-zinc-100 flex flex-col justify-between">
                <span className="text-[9px] uppercase font-bold tracking-wide text-zinc-400 block pb-1 font-sans">Cabin Material</span>
                <span className="text-[12px] font-black text-zinc-800 truncate block font-sans" title={vehicle.intColor}>{vehicle.intColor}</span>
              </div>
            </div>

            {/* Decoded Equipment checklist without enclosing cards */}
            <div className="pt-3 border-t border-zinc-100 space-y-3.5">
              <h4 className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-zinc-400">
                Accessories &amp; Equipment
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3.5 gap-x-4 py-1">
                <div className="flex gap-2.5 items-center select-none">
                  <div className="w-5 h-5 rounded-full bg-[#eefdf4] border border-[#bbf7d0]/40 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#10b981] stroke-[3.5]" />
                  </div>
                  <span className="text-[12px] font-extrabold text-zinc-700 leading-none font-sans">Adaptive Cruise Control</span>
                </div>
                <div className="flex gap-2.5 items-center select-none">
                  <div className="w-5 h-5 rounded-full bg-[#eefdf4] border border-[#bbf7d0]/40 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#10b981] stroke-[3.5]" />
                  </div>
                  <span className="text-[12px] font-extrabold text-zinc-700 leading-none font-sans">Lane Keeping Guard</span>
                </div>
                <div className="flex gap-2.5 items-center select-none">
                  <div className="w-5 h-5 rounded-full bg-[#eefdf4] border border-[#bbf7d0]/40 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#10b981] stroke-[3.5]" />
                  </div>
                  <span className="text-[12px] font-extrabold text-zinc-700 leading-none font-sans">Active Suspension System</span>
                </div>
                <div className="flex gap-2.5 items-center select-none">
                  <div className="w-5 h-5 rounded-full bg-[#eefdf4] border border-[#bbf7d0]/40 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#10b981] stroke-[3.5]" />
                  </div>
                  <span className="text-[12px] font-extrabold text-zinc-700 leading-none font-sans">Acoustic Audio Deck</span>
                </div>
                <div className="flex gap-2.5 items-center select-none">
                  <div className="w-5 h-5 rounded-full bg-[#eefdf4] border border-[#bbf7d0]/40 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#10b981] stroke-[3.5]" />
                  </div>
                  <span className="text-[12px] font-extrabold text-zinc-700 leading-none font-sans">Wireless Apple CarPlay</span>
                </div>
                <div className="flex gap-2.5 items-center select-none">
                  <div className="w-5 h-5 rounded-full bg-[#eefdf4] border border-[#bbf7d0]/40 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#10b981] stroke-[3.5]" />
                  </div>
                  <span className="text-[12px] font-extrabold text-zinc-700 leading-none font-sans">Climate Comfort Seats</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4. Documentation Tab Component */}
          <motion.div 
            id="documentation-anchor"
            className={`bg-white border rounded-[22px] overflow-hidden transition-all duration-300 select-none ${
              highlightedModule === 'documentation-anchor' ? 'border-zinc-350 ring-4 ring-zinc-900/5' : 'border-zinc-200/60'
            }`}
          >
            {/* Apple Segmented Control Selection pill layout */}
            <div className="flex border-b border-zinc-100 bg-[#f9f9fb] p-1.5 gap-1">
              {[
                { id: 'logs', label: 'Service History' },
                { id: 'title', label: 'Registration & Title' },
                { id: 'check', label: 'Inspection Reports' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setServiceLogsTab(tab.id as any)}
                  className={`flex-1 py-1.5 px-3 text-center text-[10px] sm:text-[11px] font-sans font-black uppercase tracking-wider rounded-xl transition-all duration-200 outline-none border-none cursor-pointer ${
                    serviceLogsTab === tab.id 
                      ? 'bg-[#8B0000] text-white shadow-sm font-black' 
                      : 'text-zinc-400 hover:text-zinc-700 bg-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-6 bg-white">
              {serviceLogsTab === 'logs' && (
                <div className="space-y-4 font-sans text-xs" id="service-logs-pane">
                  <div className="relative border-l border-zinc-200 pl-4 ml-1 space-y-4">
                    <div className="relative">
                      <span className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-550 border border-white" />
                      <div>
                        <span className="text-zinc-800 font-extrabold block">March 2026 • 1,758 mi</span>
                        <p className="text-zinc-500 mt-0.5 font-sans leading-relaxed text-[11px] font-medium">
                          Standard synthetic oil update, spark gaps checked, pressure recalibrated. All system levels matching.
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-555 border border-white" />
                      <div>
                        <span className="text-zinc-805 font-extrabold block">September 2025 • 925 mi</span>
                        <p className="text-zinc-500 mt-0.5 font-sans leading-relaxed text-[11px] font-medium">
                          Full brake fluid purge, cabin microfilter swaps, diagnostic sensor checks, zero OBD faults log files.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {serviceLogsTab === 'title' && (
                <div className="space-y-4" id="title-customs-pane">
                  <div className="flex gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#eefdf4] border border-[#bbf7d0]/40 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#10b981] stroke-[3.5]" />
                    </div>
                    <div>
                      <h4 className="text-[11px] uppercase font-black text-zinc-800 font-sans tracking-wide">Sovereign Clear Title</h4>
                      <p className="text-[11px]/relaxed text-zinc-500 mt-0.5 font-sans font-medium">
                        Domestic verification confirmed. Standard customs declarations, municipal registration, and title history records are fully cleared and secure.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-100 text-[11px]">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-zinc-450 font-medium">Title Status:</span>
                      <span className="font-extrabold text-zinc-805">Clean Title (Clean Log)</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-zinc-450 font-medium">Duty Fees Status:</span>
                      <span className="font-extrabold text-[#10b981] uppercase font-mono">Paid &amp; Cleared</span>
                    </div>
                  </div>
                </div>
              )}

              {serviceLogsTab === 'check' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs" id="inspection-checks-pane">
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-sans uppercase font-extrabold text-zinc-400 tracking-wider block border-b border-zinc-100 pb-1">
                      Drivetrain Check
                    </h4>
                    <div className="space-y-1.5 pt-1 text-[11px]">
                      <div className="flex justify-between text-zinc-650">
                        <span>Cylinder Compression</span>
                        <span className="font-bold text-[#10b981] flex items-center gap-0.5"><Check className="w-3 h-3 stroke-[3.5]" /> Passes</span>
                      </div>
                      <div className="flex justify-between text-zinc-650">
                        <span>Gasket Integrity index</span>
                        <span className="font-bold text-[#10b981] flex items-center gap-0.5"><Check className="w-3 h-3 stroke-[3.5]" /> Passed</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-sans uppercase font-extrabold text-zinc-400 tracking-wider block border-b border-zinc-100 pb-1">
                      Electronics Check
                    </h4>
                    <div className="space-y-1.5 pt-1 text-[11px]">
                      <div className="flex justify-between text-zinc-650">
                        <span>ECU Integrity Handshake</span>
                        <span className="font-bold text-[#10b981] flex items-center gap-0.5"><Check className="w-3 h-3 stroke-[3.5]" /> Matches</span>
                      </div>
                      <div className="flex justify-between text-zinc-650">
                        <span>Cabin ADAS Radar Logs</span>
                        <span className="font-bold text-[#10b981] flex items-center gap-0.5"><Check className="w-3 h-3 stroke-[3.5]" /> Synced</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>



        </div>

        {/* =========================================================
            RIGHT COLUMN (col-span-4) - Actions, Price & Chat Sidebars
            ========================================================= */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* 1. Main Pricing & Valuation Meter Header */}
          <motion.div 
            id="valuation-anchor"
            whileHover={{ y: -3 }}
            className={`bg-white border rounded-3xl p-5.5 transition-all duration-300 space-y-4 shadow-lg shadow-zinc-200/40 hover:shadow-xl hover:shadow-zinc-250/45 ${
              highlightedModule === 'valuation-anchor' ? 'border-zinc-900 ring-4 ring-zinc-900/10' : 'border-zinc-200/80'
            }`}
          >
            <div className="space-y-0.5 select-none">
              <h1 className="text-[26px] font-black text-zinc-900 tracking-tight leading-none uppercase font-sans">
                {vehicle.make}
              </h1>
              <div className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400 pt-0.5 font-sans block leading-tight">
                {vehicle.model}
              </div>
              <div className="flex items-center gap-1.5 text-[10.5px] text-zinc-500 font-medium pt-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Houston, TX Hub</span>
              </div>
            </div>

            {/* Valuation & Pricing Comparison - Plain plain styled, without side boxes */}
            <div className="pt-4 border-t border-zinc-100 flex justify-between items-center text-center px-1 font-sans">
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block mb-0.5">Price</span>
                <div className="text-[15px] font-black text-zinc-950 font-mono">{formatPrice(vehicle.price)}</div>
              </div>
              <div className="h-6 w-px bg-zinc-150 shrink-0 mx-2"></div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider block mb-0.5">Market Avg</span>
                <div className="text-[14px] font-bold text-zinc-600 font-mono">{formatPrice(vehicle.marketPrice || vehicle.price * 1.02)}</div>
              </div>
              <div className="h-6 w-px bg-zinc-150 shrink-0 mx-2"></div>
              <div className="flex-1 flex flex-col items-center">
                <span className="text-[9px] uppercase font-extrabold text-[#10b981] tracking-wider block mb-0.5">AI Value</span>
                <div className="text-[15px] font-black text-[#10b981] font-mono">{formatPrice(vehicle.valuation || vehicle.price * 1.05)}</div>
              </div>
            </div>
          </motion.div>

          {/* 2. Sovereign Action Buttons block */}
          <SovereignActionDesk 
            onScrollTo={scrollToAnchor} 
            onOpenChat={() => setActiveSubPage('chat')} 
            onOpenBooking={() => setActiveSubPage('booking')} 
            onOpenConfigure={() => scrollToAnchor('configure')}
          />

          {/* 3. Make Offer / Buy Now Widget */}
          <motion.div 
            id="offer-now-anchor"
            whileHover={{ y: -3 }}
            className={`bg-white border rounded-2xl p-5 shadow-lg shadow-zinc-200/40 hover:shadow-xl hover:shadow-zinc-250/50 transition-all duration-300 space-y-3 ${
              highlightedModule === 'offer-now-anchor' ? 'border-zinc-900 ring-4 ring-zinc-900/10' : 'border-zinc-200/80'
            }`}
          >
            <div className="border-b border-zinc-100 pb-2 flex justify-between items-center">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-900 font-mono leading-none">
                Make Offer / Buy Now
              </h3>
            </div>

            {!isOfferSubmitted ? (
               <form onSubmit={handleOfferSubmit} className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase font-bold text-zinc-500 block">Offer Amount ($USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-zinc-400">$</span>
                    <input
                      type="number"
                      required
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      className="w-full h-9 bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white border border-zinc-200 pl-6 pr-3 font-mono text-[11px] font-bold rounded-xl outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                      placeholder="Enter amount..."
                    />
                  </div>
                  <p className="text-[8.5px] text-zinc-400 font-sans leading-relaxed">
                    Escrow binding locks on validation. Subject to 4% margin adjustments.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full h-9.5 bg-[#8B0000] hover:bg-[#a80d0d] text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-md shadow-[#8B0000]/20 active:scale-[0.99]"
                >
                  Submit Offer
                </button>
              </form>
            ) : (
              <div className="p-3 bg-[#eefdf4]/70 border border-[#bbf7d0]/30 rounded-xl text-center space-y-1.5">
                <CheckCircle className="w-5 h-5 text-[#10b981] mx-auto" />
                <h4 className="text-[10px] uppercase font-bold text-[#059669] font-mono">Offer Logged</h4>
                <p className="text-[10px]/relaxed text-[#065f46] font-medium font-sans">
                  {offerMessage} Vetted responses hold binding parameters.
                </p>
                <button
                  onClick={() => setIsOfferSubmitted(false)}
                  className="mt-1.5 px-3 py-1 bg-white hover:bg-zinc-50 border border-zinc-250/55 rounded-lg text-[8px] font-bold uppercase text-zinc-600 cursor-pointer transition-all"
                >
                  Modify Offer
                </button>
              </div>
            )}
          </motion.div>

          {/* 4. Seller profile card */}
          <SellerProfileCard />



        </div>

      </div>

      {/* Finance, Warranty & Logistics Options at Bottom */}
      <div className="max-w-7xl mx-auto mt-6 pt-5">
        <motion.div
          id="finance-logistics-anchor"
          className={`space-y-6 p-6 rounded-[28px] bg-white border transition-all duration-300 ${
            highlightedModule === 'finance-logistics-anchor' 
              ? 'border-zinc-400 ring-4 ring-zinc-900/5' 
              : 'border-zinc-200/60'
          }`}
        >
          {/* Section Header */}
          <div className="pb-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-[13px] font-black uppercase tracking-widest text-black">
                Finance, Warranty &amp; Logistics Options
              </h2>
              <p className="text-[11px] text-zinc-500 font-sans leading-normal font-medium">
                Tailor down payments, term durations, secure warranty plans, and delivery coordinates custom to your purchase intent.
              </p>
            </div>
          </div>

          {/* 3-Column Bento Grid Configurer */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-1">
            
            {/* Card 1: Lease and Finance */}
            <div className="bg-zinc-50/50 border border-zinc-200/55 rounded-[20px] p-5 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-4">
                <h3 className="text-[13px] font-extrabold tracking-tight text-zinc-900 font-sans">
                  Lease Configurations
                </h3>

                <div className="space-y-4 font-sans">
                  {/* Down Payment Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span className="font-semibold text-zinc-650">Down payment requirement:</span>
                      <span className="font-extrabold text-zinc-950 font-mono">${downPayment.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max={Math.floor(vehicle.price * 0.8)}
                      step="5000"
                      value={downPayment}
                      onChange={(e) => { setDownPayment(Number(e.target.value)); setLeaseAuthorized(false); }}
                      className="w-full h-1.5 bg-zinc-200/70 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                    />
                    <div className="flex justify-between text-[8px] text-zinc-400 font-bold uppercase w-full">
                      <span>$5,000 Min</span>
                      <span>${Math.floor(vehicle.price * 0.8).toLocaleString()} Max (80%)</span>
                    </div>
                  </div>

                  {/* Term Chips */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-zinc-400 block tracking-wider">Lease Term Period</span>
                    <div className="flex justify-between gap-1.5 bg-zinc-200/30 p-1 rounded-xl border border-zinc-200/50">
                      {[36, 48, 60].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => { setLoanTerm(term); setLeaseAuthorized(false); }}
                          className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                            loanTerm === term 
                              ? 'bg-[#8B0000] text-white shadow-xs' 
                              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/40'
                          }`}
                        >
                          {term} Mo
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Leasing Calculation Summary */}
                  <div className="pt-2.5 flex justify-between items-baseline border-t border-zinc-100">
                    <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-black">Estimated Monthly</span>
                    <span className="text-[15px] font-black text-black font-mono">${calculatedFinance.estimatedLease}/mo</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                {!leaseAuthorized ? (
                  <button
                    type="button"
                    onClick={() => setLeaseAuthorized(true)}
                    className="w-full py-2.5 bg-[#8B0000] hover:bg-[#a80d0d] text-white text-[9.5px] font-sans font-black uppercase tracking-widest rounded-lg cursor-pointer transition-all duration-200 shadow-xs active:scale-95 text-center"
                  >
                    Apply Lease Approval
                  </button>
                ) : (
                  <div className="py-2 bg-[#eefdf4] text-center text-[#047857] rounded-lg text-[9.5px] font-black uppercase font-sans tracking-widest border border-[#bbf7d0] flex items-center justify-center gap-1.5 animate-fadeIn">
                    <Check className="w-3.5 h-3.5 stroke-[4.5]" /> Terms Pre-Approved
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Warranty & Coverage */}
            <div className="bg-zinc-50/50 border border-zinc-200/55 rounded-[20px] p-5 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-4">
                <h3 className="text-[13px] font-extrabold tracking-tight text-zinc-900 font-sans">
                  Warranty &amp; Coverage
                </h3>

                <div className="space-y-4 font-sans text-xs">
                  <span className="text-[10px]/relaxed text-zinc-400 font-sans block">
                    Pre-authorize complete third-party asset indemnity protection.
                  </span>
                  
                  {/* Toggle Options */}
                  <div className="space-y-2">
                    <label className="flex items-center justify-between p-2.5 bg-white hover:bg-zinc-100/50 border border-zinc-200/50 rounded-xl cursor-pointer transition-all duration-150">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-zinc-900 text-[10.5px] tracking-tight">Liability Surcharge Offset</span>
                        <span className="text-[8.5px] text-zinc-400 font-medium">Increases comprehensive payout ceiling</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={liabilityAddon}
                        onChange={(e) => { setLiabilityAddon(e.target.checked); setInsuranceAuthorized(false); }}
                        className="rounded text-[#8B0000] cursor-pointer accent-[#8B0000] w-4 h-4 ml-1.5 shrink-0"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between p-2.5 bg-white hover:bg-zinc-100/50 border border-zinc-200/50 rounded-xl cursor-pointer transition-all duration-150">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-zinc-900 text-[10.5px] tracking-tight">Elite Powertrain Protection</span>
                        <span className="text-[8.5px] text-zinc-400 font-medium">Full repairs for motor &amp; gearbox limits</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={warrantyAddon}
                        onChange={(e) => { setWarrantyAddon(e.target.checked); setInsuranceAuthorized(false); }}
                        className="rounded text-[#8B0000] cursor-pointer accent-[#8B0000] w-4 h-4 ml-1.5 shrink-0"
                      />
                    </label>
                  </div>

                  {/* Premium Calculation Summary */}
                  <div className="pt-2.5 flex justify-between items-baseline border-t border-zinc-100">
                    <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-black">Estimated Premium</span>
                    <span className="text-[15px] font-black text-black font-mono">${calculatedInsurance.comprehensiveRate}/mo</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                {!insuranceAuthorized ? (
                  <button
                    type="button"
                    onClick={() => setInsuranceAuthorized(true)}
                    className="w-full py-2.5 bg-[#8B0000] hover:bg-[#a80d0d] text-white text-[9.5px] font-sans font-black uppercase tracking-widest rounded-lg cursor-pointer transition-all duration-205 shadow-xs active:scale-95 text-center"
                  >
                    Activate Secure Cover
                  </button>
                ) : (
                  <div className="py-2 bg-[#eefdf4] text-center text-[#047857] rounded-lg text-[9.5px] font-black uppercase font-sans tracking-widest border border-[#bbf7d0] flex items-center justify-center gap-1.5 animate-fadeIn">
                    <Check className="w-3.5 h-3.5 stroke-[4.5]" /> Cover Activated
                  </div>
                )}
              </div>
            </div>

            {/* Card 3: Logistics Coordinator */}
            <div className="bg-zinc-50/50 border border-zinc-200/55 rounded-[20px] p-5 flex flex-col justify-between min-h-[300px]">
              <div className="space-y-4">
                <h3 className="text-[13px] font-extrabold tracking-tight text-zinc-900 font-sans">
                  Logistics Coordinator
                </h3>

                <div className="space-y-4 font-sans">
                  {/* Distance Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-[11px] text-zinc-500">
                      <span className="font-semibold text-zinc-650">Transit distance routing:</span>
                      <span className="font-extrabold text-zinc-955 font-mono">{transitDistance} miles</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="3000"
                      step="50"
                      value={transitDistance}
                      onChange={(e) => { setTransitDistance(Number(e.target.value)); setTransportBooked(false); }}
                      className="w-full h-1.5 bg-zinc-200/70 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                    />
                    <div className="flex justify-between text-[8px] text-zinc-400 font-bold uppercase w-full">
                      <span>50 mi</span>
                      <span>3,000 mi</span>
                    </div>
                  </div>

                  {/* Carrier Tab Buttons */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-bold text-zinc-400 block tracking-wider">Trailer Type Specs</span>
                    <div className="grid grid-cols-2 gap-1.5 bg-zinc-200/30 p-1 rounded-xl border border-zinc-200/50">
                      <button
                        type="button"
                        onClick={() => { setCarrierType('enclosed'); setTransportBooked(false); }}
                        className={`py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all duration-200 ${
                          carrierType === 'enclosed' 
                            ? 'bg-[#8B0000] text-white shadow-xs font-black' 
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/40 font-extrabold'
                        }`}
                      >
                        Enclosed
                      </button>
                      <button
                        type="button"
                        onClick={() => { setCarrierType('open'); setTransportBooked(false); }}
                        className={`py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg cursor-pointer transition-all duration-200 ${
                          carrierType === 'open' 
                            ? 'bg-[#8B0000] text-white shadow-xs font-black' 
                            : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/40'
                        }`}
                      >
                        Open
                      </button>
                    </div>
                  </div>

                  {/* Rate Summary */}
                  <div className="pt-2.5 flex justify-between items-baseline border-t border-zinc-100">
                    <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-black">Estimated Freight</span>
                    <span className="text-[15px] font-black text-black font-mono">${Math.round(calculatedCarrier.totalFreight).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                {!transportBooked ? (
                  <button
                    type="button"
                    onClick={() => setTransportBooked(true)}
                    className="w-full py-2.5 bg-[#8B0000] hover:bg-[#a80d0d] text-white text-[9.5px] font-sans font-black uppercase tracking-widest rounded-lg cursor-pointer transition-all duration-200 shadow-xs active:scale-95 text-center"
                  >
                    Reserve Route
                  </button>
                ) : (
                  <div className="py-2 bg-[#eefdf4] text-center text-[#047857] rounded-lg text-[9.5px] font-black uppercase font-sans tracking-widest border border-[#bbf7d0] flex items-center justify-center gap-1.5 animate-fadeIn">
                    <Check className="w-3.5 h-3.5 stroke-[4.5]" /> Carrier Reserved
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Master Summary Card */}
          <div className="bg-[#fafafa]/75 border border-zinc-200/55 rounded-[20px] p-5 space-y-3.5 mt-4">
            <h4 className="text-[10px] uppercase font-black tracking-widest text-[#8B0000]">
              Consolidated Vetting Protocol
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
              <div className="flex justify-between border-b border-zinc-150/40 pb-2">
                <span className="text-zinc-500 font-medium">Approved Lease Down:</span>
                <span className="font-extrabold text-zinc-955 font-mono">${leaseAuthorized ? downPayment.toLocaleString() : '0'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-150/40 pb-2">
                <span className="text-zinc-500 font-medium">Liability Surcharges:</span>
                <span className="font-extrabold text-zinc-955 font-mono">{insuranceAuthorized ? (liabilityAddon ? 'Active' : 'Unused') : 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-150/40 pb-2">
                <span className="text-zinc-500 font-medium">Logistics Status:</span>
                <span className="font-black text-[#047857] flex items-center gap-1">
                  {transportBooked ? (
                    <>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></div> Secure Carrier Routed
                    </>
                  ) : (
                    <span className="text-zinc-400">Route Unscheduled</span>
                  )}
                </span>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

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
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0 self-center" />
              <div className="flex flex-wrap items-baseline gap-1.5">
                <span className="font-semibold text-zinc-800">{item.key}:</span>
                <span className="text-zinc-500 font-normal">{item.val}</span>
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
          <span className="text-[13px] sm:text-[14px] font-bold text-zinc-950 uppercase tracking-wider font-sans">{heading}</span>
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
          className={`text-[14px] sm:text-[15px] font-bold text-zinc-950 tracking-tight mt-5 mb-2.5 ${isRtl ? 'text-right' : 'text-left'}`}
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
            className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-zinc-50 rounded-2xl my-3 border border-zinc-100 ${isRtl ? 'direction-rtl' : ''}`}
            style={{ direction: isRtl ? 'rtl' : 'ltr' }}
          >
            {parts.map((p, idx) => {
              const cleanPart = p.trim().replace(/\*\*/g, '');
              const itemParts = cleanPart.split(':');
              const pKey = itemParts[0]?.trim();
              const pVal = itemParts.slice(1).join(':')?.trim();
              
              return (
                <div key={idx} className={`flex flex-col gap-0.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                  {pKey && <span className="text-[9px] font-medium text-zinc-400 uppercase tracking-widest font-mono">{pKey}</span>}
                  {pVal && <span className="text-xs sm:text-[13px] font-semibold text-zinc-805 leading-normal">{pVal}</span>}
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
          return <strong key={sIdx} className="font-semibold text-zinc-900">{seg}</strong>;
        }
        return seg;
      });

      renderedElements.push(
        <p 
          key={index} 
          className={`text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-sans mb-3 ${isRtl ? 'text-right' : 'text-left'}`}
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
        className={`text-xs sm:text-[13px] text-zinc-600 leading-relaxed font-sans mb-3 ${isRtl ? 'text-right' : 'text-left'}`}
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
