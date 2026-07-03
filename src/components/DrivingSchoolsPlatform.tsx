import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import UniversalSmartUpload from './UniversalSmartUpload';
import { 
  Award, Calendar, CheckCircle2, ChevronRight, Compass, FileText, 
  HelpCircle, Info, Languages, MapPin, Search, Star, Users, UserCheck, 
  Clock, BookOpen, Clipboard, AlertCircle, RefreshCw, Bot, Upload, 
  X, Check, Plus, ShieldCheck, Dumbbell, Play, Trash2, Edit3, Key, 
  ChevronDown, BookMarked, UserPlus
} from 'lucide-react';

// Interfaces for our Driving School System
export interface Instructor {
  id: string;
  name: string;
  rating: number;
  completedStudents: number;
  languages: string[];
  vehicleTypes: string[];
  picture: string;
  bio: string;
  availability: string[]; // e.g. ["Mon 09:00 - 13:00", "Wed 14:00 - 18:00"]
}

export interface LicensePackage {
  id: string;
  category: string; // e.g., 'Category B (Car)', 'Category A (Motorcycle)', 'Category C (Truck)', 'Category CE (Trailer)'
  title: string;
  price: number;
  durationHours: number;
  includesTheory: boolean;
  includesExamPrep: boolean;
  description: string;
}

export interface DrivingSchool {
  id: string;
  name: string;
  logo: string;
  brandColor: string;
  rating: number;
  voters: number;
  locations: string[];
  mainAddress: string;
  languages: string[];
  transmissions: string[];
  licenseCategories: string[];
  successRate: number; // e.g. 92
  instructors: Instructor[];
  packages: LicensePackage[];
  certifications: string[];
  b2bCorporateRates: boolean;
}

export interface Booking {
  id: string;
  schoolName: string;
  instructorName: string;
  category: string;
  lessonType: 'Practical Drive' | 'Theory Lecture' | 'Mock Exam';
  dateTime: string;
  timeSlot: string;
  status: 'Confirmed' | 'Passed' | 'Action Needed';
}

export interface StudentDoc {
  id: string;
  name: string;
  type: 'Agreement Contract' | 'Medical Clearance' | 'Theory Pass Badge' | 'Identity Scan';
  status: 'Verified' | 'Pending Audit' | 'Missing Scan';
  uploadDate: string;
  fileSize: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  signsUrl?: string; // Standardized descriptions of visual elements
}

export default function DrivingSchoolsPlatform() {
  // Navigation State
  // 'directory': Filter, view schools, detail drawer
  // 'booking': Lessons & theory scheduler
  // 'progress': Student scorecard & document vault (employee roster toggle)
  // 'assistant': AI traffic assistant & practice tests
  const [activeTab, setActiveTab] = useState<'directory' | 'booking' | 'progress' | 'assistant'>('directory');

  // Directory Filters
  const [filterLocation, setFilterLocation] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterLanguage, setFilterLanguage] = useState<string>('All');
  const [filterTransmission, setFilterTransmission] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Driving School for Profile Details View
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('school-1');

  // Bookings state
  const [activeBookings, setActiveBookings] = useState<Booking[]>([
    {
      id: 'BKG-0182',
      schoolName: 'Sovereign Baltic driving Academy',
      instructorName: 'Tomas Drungilas',
      category: 'Category B (Car)',
      lessonType: 'Practical Drive',
      dateTime: '2026-06-21',
      timeSlot: '10:00 AM - 12:00 PM',
      status: 'Confirmed'
    },
    {
      id: 'BKG-0045',
      schoolName: 'Sovereign Baltic driving Academy',
      instructorName: 'Tomas Drungilas',
      category: 'Category B (Car)',
      lessonType: 'Theory Lecture',
      dateTime: '2026-06-19',
      timeSlot: '05:00 PM - 07:00 PM',
      status: 'Confirmed'
    }
  ]);

  // Document Vault State
  const [studentDocs, setStudentDocs] = useState<StudentDoc[]>([
    {
      id: 'DOC-5928',
      name: 'Baltic_Sovereign_Academy_Contract.pdf',
      type: 'Agreement Contract',
      status: 'Verified',
      uploadDate: '2026-06-12',
      fileSize: '1.4 MB'
    },
    {
      id: 'DOC-1120',
      name: 'Regitra_Medical_License_Cert.pdf',
      type: 'Medical Clearance',
      status: 'Verified',
      uploadDate: '2026-06-14',
      fileSize: '890 KB'
    }
  ]);

  // Standard interactive Quiz state
  const [quizScore, setQuizScore] = useState<number>(0);
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [quizAttempted, setQuizAttempted] = useState<boolean>(false);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);

  // AI Assistant Chatbot State
  const [aiChatQuery, setAiChatQuery] = useState<string>('');
  const [aiChatLog, setAiChatLog] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: 'Hello, I am your Regitra-aligned AI Driving Assistant. Ask me any conceptual question about traffic priority, roundabout configurations, speed regulations, or how to prepare for key theory examinations.',
      time: '11:58 PM'
    }
  ]);

  // Employee/Instructors Manager Mode for B2B dashboards
  const [b2bManagerMode, setB2bManagerMode] = useState<boolean>(false);

  // New Booking interactive temporary states
  const [bookingSchoolId, setBookingSchoolId] = useState<string>('school-1');
  const [bookingInstructorId, setBookingInstructorId] = useState<string>('inst-1');
  const [bookingCategory, setBookingCategory] = useState<string>('Category B (Car)');
  const [bookingLessonType, setBookingLessonType] = useState<'Practical Drive' | 'Theory Lecture' | 'Mock Exam'>('Practical Drive');
  const [bookingDate, setBookingDate] = useState<string>('2026-06-25');
  const [bookingTime, setBookingTime] = useState<string>('09:00 AM - 11:00 AM');
  const [newBookingStudentName, setNewBookingStudentName] = useState<string>('Gabrielius Landsbergis');

  // Instructor Custom Management States (B2B Mode)
  const [b2bInstructors, setB2bInstructors] = useState<Instructor[]>([
    {
      id: 'inst-1',
      name: 'Tomas Drungilas',
      rating: 4.9,
      completedStudents: 520,
      languages: ['Lithuanian', 'English'],
      vehicleTypes: ['Manual Transmission', 'Electric Hatchbacks'],
      picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      bio: 'Former rally circuit coach specializing in active defensive road positioning and slippery winter conditions safety.',
      availability: ['Monday afternoons', 'Wednesday mornings', 'Friday whole day']
    },
    {
      id: 'inst-2',
      name: 'Arvydas Sabonis Jr.',
      rating: 4.8,
      completedStudents: 410,
      languages: ['Lithuanian', 'German', 'Russian'],
      vehicleTypes: ['Automatic Transmissions', 'Category C Trucks'],
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      bio: 'Over 14 years of commercial transport tutoring. Specialized in Category C and CE (Heavy trailer) logistical rig lines.',
      availability: ['Tuesday mornings', 'Thursday afternoons']
    },
    {
      id: 'inst-3',
      name: 'Aistė Valuntaitė',
      rating: 5.0,
      completedStudents: 290,
      languages: ['Lithuanian', 'English', 'Spanish'],
      vehicleTypes: ['Category A Motorcycles', 'Manual Transmission Compacts'],
      picture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
      bio: 'Dynamic motorcycle enthusiast. Specializes in category A curve banking maneuvers, safe braking metrics and rider body balance.',
      availability: ['Saturdays mornings', 'Wednesday afternoons']
    }
  ]);

  const [b2bNewInstructorName, setB2bNewInstructorName] = useState('');
  const [b2bNewInstructorCategory, setB2bNewInstructorCategory] = useState('');

  // Drag and drop / file selector visual state
  const [dragOverActive, setDragOverActive] = useState(false);

  // SEEDED PRESETS
  const DRIVING_SCHOOLS: DrivingSchool[] = [
    {
      id: 'school-1',
      name: 'Sovereign Baltic Driving Academy',
      logo: '🎓',
      brandColor: 'border-l-[#8B0000]',
      rating: 4.9,
      voters: 308,
      locations: ['Vilnius', 'Kaunas', 'Klaipėda'],
      mainAddress: 'Gedimino pr. 24, Vilnius LT-01103',
      languages: ['Lithuanian', 'English', 'Russian'],
      transmissions: ['Manual', 'Automatic', 'Electric EV'],
      licenseCategories: ['Category A (Motorcycle)', 'Category B (Car)', 'Category C (Heavy Truck)', 'Category CE (Trailer)'],
      successRate: 94,
      certifications: ['Regitra Elite Accredited', 'Sovereign Transport Safety Union Certificate', 'EU Transport Hub Endorsed'],
      b2bCorporateRates: true,
      instructors: b2bInstructors,
      packages: [
        {
          id: 'pkg-1',
          category: 'Category B (Car)',
          title: 'Urban Master Class',
          price: 520,
          durationHours: 30,
          includesTheory: true,
          includesExamPrep: true,
          description: 'A comprehensive entry program focusing on Gedimino and city center roundabout structures, parallel parking mechanics and Regitra test checkpoints.'
        },
        {
          id: 'pkg-2',
          category: 'Category A (Motorcycle)',
          title: 'Asphalt Performance Rider',
          price: 450,
          durationHours: 20,
          includesTheory: false,
          includesExamPrep: true,
          description: 'Specialized maneuver yard lessons, balance and emergency braking thresholds. Perfect preparation to attain full Category A access.'
        },
        {
          id: 'pkg-3',
          category: 'Category C (Heavy Truck)',
          title: 'Trans-European Freight Logistics Program',
          price: 890,
          durationHours: 40,
          includesTheory: true,
          includesExamPrep: true,
          description: 'Tailored for corporate fleet employees. Focuses on pneumatic brake layouts, axle-weight distributions and custom trailer coupling routines.'
        }
      ]
    },
    {
      id: 'school-2',
      name: 'Mano Vairavimas (My Driver Škoda)',
      logo: '🚗',
      brandColor: 'border-l-emerald-600',
      rating: 4.7,
      voters: 184,
      locations: ['Vilnius', 'Kaunas', 'Šiauliai'],
      mainAddress: 'Vilniaus g. 82, Kaunas LT-44289',
      languages: ['Lithuanian', 'German'],
      transmissions: ['Manual', 'Automatic'],
      licenseCategories: ['Category B (Car)', 'Category BE (Car + Trailer)'],
      successRate: 89,
      certifications: ['National Standard Car Certification', 'Škoda Environmental Drive Program Co-sponsor'],
      b2bCorporateRates: false,
      instructors: [
        {
          id: 'inst-4',
          name: 'Darius Kasparaitis',
          rating: 4.6,
          completedStudents: 310,
          languages: ['Lithuanian'],
          vehicleTypes: ['Manual Hatchbacks'],
          picture: 'https://images.unsplash.com/photo-1542103749-8ef59b94f47e?q=80&w=200&auto=format&fit=crop',
          bio: 'Veteran highway examiner. Excellent at breaking down parallel parking procedures into simple geometrical ticks.',
          availability: ['Wednesday mornings']
        }
      ],
      packages: [
        {
          id: 'pkg-4',
          category: 'Category B (Car)',
          title: 'Manual Standard Course',
          price: 430,
          durationHours: 32,
          includesTheory: true,
          includesExamPrep: false,
          description: 'Solid entry-level course on standard clutch configurations and national suburban speed controls.'
        }
      ]
    },
    {
      id: 'school-3',
      name: 'Deutsche Auto-Schuldner Berlin',
      logo: '🇩🇪',
      brandColor: 'border-l-amber-500',
      rating: 4.8,
      voters: 245,
      locations: ['Munich', 'Berlin', 'Klaipėda'],
      mainAddress: 'Kurfürstendamm 188, 10707 Berlin',
      languages: ['German', 'English'],
      transmissions: ['Manual', 'Automatic'],
      licenseCategories: ['Category B (Car)', 'Category C (Heavy Truck)', 'Category D (Transit Bus)'],
      successRate: 91,
      certifications: ['TÜV Certified Drive Program', 'Bundesbank Fleet Training Auditor'],
      b2bCorporateRates: true,
      instructors: [
        {
          id: 'inst-5',
          name: 'Hans-Dieter Flick',
          rating: 4.9,
          completedStudents: 680,
          languages: ['German', 'English'],
          vehicleTypes: ['Diesel Cargo Transits', 'Regit Tourer Sedans'],
          picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          bio: 'Precision driving expert. Focuses heavily on Autobahn merge speeds and fuel-efficient diesel gear scaling.',
          availability: ['Mon - Fri, mornings only']
        }
      ],
      packages: [
        {
          id: 'pkg-5',
          category: 'Category B (Car)',
          title: 'Autobahn Speed & Merging Specialist',
          price: 680,
          durationHours: 25,
          includesTheory: true,
          includesExamPrep: true,
          description: 'High speed spatial coordination, emergency corridor navigation (Rettungsgasse) and adaptive cruise calibrations.'
        }
      ]
    }
  ];

  // SEEDED RECOGNIZED QUIZ QUESTIONS
  const TRAFFIC_QUIZ: QuizQuestion[] = [
    {
      id: 1,
      question: 'Who possesses priority/right of way in a standard double-lane roundabout with no indicators or warning signs pre-installed?',
      options: [
        'Vehicles already circling inside the roundabout possess active priority.',
        'Vehicles approaching and entering the roundabout from the right possess right of way (the classic Right-Hand Rule).',
        'Large logistics trucks or transit motor coaches always override any other priority rules.',
        'The vehicle moving at the higher velocity scale holds immediate lane entry precedence.'
      ],
      correctIdx: 1,
      explanation: 'Under general European and Baltic traffic regulations (including standard Regitra codification), if a roundabout does not feature a "Yield" (Sign 203) or "Priority Road" indicator, the intersection operates as an unregulated right-hand junction. Therefore, approaching vehicles entering from the right actually possess the right of way. However, almost all standard roundabouts feature "Yield" symbols to inverse this default ruleset.',
      signsUrl: 'Priority Roundabout Junction Layout'
    },
    {
      id: 2,
      question: 'On wet asphalt during minor autumn rainfall, how should you scale your distance tracking to comply with safe braking rules?',
      options: [
        'Keep the standard 1-second interval; tires with high Tread depth easily clear surface moisture levels.',
        'Reduce distance to 0.5 seconds to prevent adjacent commuter vehicles from cutting into your path.',
        'Increase the tracking corridor to at least 4 seconds (doubling the dry weather standard 2-second rule).',
        'Shift to neutral gear immediately upon recognizing a stopping hazard to save structural pads.'
      ],
      correctIdx: 2,
      explanation: 'The classic rule of thumb in dry driving dynamics is the 2-second rule. However, on wet, slippery, or moist pavement, tire friction parameters drop by nearly 50%, which drastically extends braking paths. Regitra examiners require increasing this to a 4-second minimum buffer.',
      signsUrl: 'Rain and Slippery Asphalt Safety Metrics'
    },
    {
      id: 3,
      question: 'In an intersection with active white road arrows but a faulty, flashing yellow traffic grid light, what rules state who crosses first?',
      options: [
        'The right of way returns to standard stationary metallic priority signs (e.g. Stop, Yield, Main Road) placed at the margins.',
        'Flashing yellow means all traffic must shut off engines and lock position until regional municipal grids reboot.',
        'The biggest vehicle holds absolute right of way priority.',
        'The driver who flashes their high-beams first secures crossing privilege.'
      ],
      correctIdx: 0,
      explanation: 'According to traffic hierarchy order: 1. Traffic regulator (Police officer), 2. Traffic lights, 3. Road signs, 4. Road markings (right-hand rule). If the traffic light is flashing yellow (inactive), drivers must immediately yield priority to the metallic traffic signs on margins.',
      signsUrl: 'Signal Grid Priority Hierarchy'
    },
    {
      id: 4,
      question: 'What does a circular blue sign containing a prominent white arrow pointing diagonally right-forward declare?',
      options: [
        'Mandatory direction rule: drivers must pass the traffic divider/structural barrier only on the right side.',
        'Optional parking recommendation for commercial cargo vehicles.',
        'Right turn indicator warning that a sharp 90-degree curve approaches.',
        'Single-lane highway border ending parameter zone.'
      ],
      correctIdx: 0,
      explanation: 'Circular blue signs are strictly "Mandatory Instruction Signs". An arrow pointing diagonally down-right dictates that you must bypass an obstacle, build divider, or traffic island on the specified right-hand side.',
      signsUrl: 'Mandatory Blue Traffic Iconography'
    }
  ];

  // Dynamic calculation for Filtering
  const filteredSchools = useMemo(() => {
    return DRIVING_SCHOOLS.filter(school => {
      // Location
      if (filterLocation !== 'All' && !school.locations.includes(filterLocation)) return false;
      // Class Category
      if (filterCategory !== 'All' && !school.licenseCategories.some(cat => cat.includes(filterCategory))) return false;
      // Language
      if (filterLanguage !== 'All' && !school.languages.includes(filterLanguage)) return false;
      // Transmission
      if (filterTransmission !== 'All' && !school.transmissions.includes(filterTransmission)) return false;
      // Text Search
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchName = school.name.toLowerCase().includes(query);
        const matchAddress = school.mainAddress.toLowerCase().includes(query);
        return matchName || matchAddress;
      }
      return true;
    });
  }, [filterLocation, filterCategory, filterLanguage, filterTransmission, searchQuery, b2bInstructors]);

  // Selected school data getter
  const activeSchool = useMemo(() => {
    return DRIVING_SCHOOLS.find(s => s.id === selectedSchoolId) || DRIVING_SCHOOLS[0];
  }, [selectedSchoolId, b2bInstructors]);

  // Handle New Booking Simulation
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const targetedSchoolName = DRIVING_SCHOOLS.find(s => s.id === bookingSchoolId)?.name || 'Baltic Academy';
    const targetedInstructorName = b2bInstructors.find(i => i.id === bookingInstructorId)?.name || 'Tomas Drungilas';
    
    const newBkg: Booking = {
      id: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      schoolName: targetedSchoolName,
      instructorName: targetedInstructorName,
      category: bookingCategory,
      lessonType: bookingLessonType,
      dateTime: bookingDate,
      timeSlot: bookingTime,
      status: 'Confirmed'
    };

    setActiveBookings(prev => [newBkg, ...prev]);
    setActiveTab('progress'); // Auto navigate to dashboard

    // Add alert
    alert(`Booking Confirmed!\nLesson: ${bookingLessonType}\nInstructor: ${targetedInstructorName}\nDate: ${bookingDate} | ${bookingTime}\nSuccessfully logged under your progress profile.`);
  };

  // AI Assistant trigger
  const handleAiQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatQuery.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: aiChatQuery,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiChatLog(prev => [...prev, userMsg]);
    const normalizedQuery = aiChatQuery.toLowerCase();
    setAiChatQuery('');

    // Responsive answers based on keywords
    setTimeout(() => {
      let responseText = '';
      if (normalizedQuery.includes('roundabout') || normalizedQuery.includes('zied') || normalizedQuery.includes('žied')) {
        responseText = '📍 ROUNDABOUT RULE DECODE: On standard European layouts, vehicles inside have absolute precedence IF the inlet features a Yield sign. When exiting roundabouts, you MUST use the outer right lane and signal right immediately BEFORE taking the exit. Never signal left upon entering unless changing interior lanes.';
      } else if (normalizedQuery.includes('wet') || normalizedQuery.includes('rain') || normalizedQuery.includes('distance') || normalizedQuery.includes('lietu')) {
        responseText = '🌧️ SAFETY WARNING: On damp tarmac or asphalt, safety margins (2-second rule) must expand to 4 seconds to compensate for heavy brake hydroplaning risk. Avoid heavy mid-curve steering; accelerate only when wheels are fully straight.';
      } else if (normalizedQuery.includes('exam') || normalizedQuery.includes('regitra') || normalizedQuery.includes('test') || normalizedQuery.includes('laikyt')) {
        responseText = '📋 REGITRA THEORY STRATEGY: Study road prioritization grids, tram bypass routes, and speed bracket markers. In the practical test, examiners track mirror awareness (3-second cadence), blind-spot visual tilts, and your ability to maintain speed limits with regional confidence.';
      } else if (normalizedQuery.includes('limit') || normalizedQuery.includes('autobahn') || normalizedQuery.includes('greit')) {
        responseText = '🚀 REGIONAL SPEED CLASSIFICATIONS: In Lithuania, urban areas carry a 50 km/h baseline. Motorways (Automagistralė) allow up to 130 km/h during summer (Apr-Oct) and scale down to 110 km/h in winter (Nov-Mar). New drivers with less than 2 years experience are capped at 90 km/h on highway lanes.';
      } else {
        responseText = `🗣️ AI TRAFFIC ADVISORY: Thank you for asking. Under national road rule regulations (KET), safe operations prioritize defensive road spacing, strict compliance with vertical signs, and protecting vulnerable non-vehicular commuters. Please check sections 4-8 on Priority Crossings for the precise theoretical frameworks.`;
      }

      const aiMsg = {
        sender: 'assistant' as const,
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChatLog(prev => [...prev, aiMsg]);
    }, 1000);
  };

  // Preset prompts for quick clicking in AI assist
  const handleTriggerPresetPrompt = (txt: string) => {
    setAiChatQuery(txt);
  };

  // Quiz interactive dynamics
  const handleCheckQuizAnswer = (selectedIdx: number) => {
    if (quizAttempted) return;
    setSelectedAnswerIdx(selectedIdx);
    setQuizAttempted(true);

    if (selectedIdx === TRAFFIC_QUIZ[currentQuizIdx].correctIdx) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    setSelectedAnswerIdx(null);
    setQuizAttempted(false);
    if (currentQuizIdx < TRAFFIC_QUIZ.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      // Quiz complete, state keeps scores
      alert(`Quiz Finished! You answered ${correctAnswersCount + (selectedAnswerIdx === TRAFFIC_QUIZ[currentQuizIdx].correctIdx ? 1 : 0)} of ${TRAFFIC_QUIZ.length} questions correctly! Excellent theory preparation.`);
      // Reset quiz for next iteration
      setCurrentQuizIdx(0);
      setCorrectAnswersCount(0);
    }
  };

  // Mock document drag & upload handler
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const newDoc: StudentDoc = {
        id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
        name: file.name,
        type: 'Medical Clearance',
        status: 'Pending Audit',
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: `${(file.size / 1024).toFixed(0)} KB`
      };
      setStudentDocs(prev => [newDoc, ...prev]);
    }
  };

  const handleManualFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDoc: StudentDoc = {
        id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
        name: file.name,
        type: 'Agreement Contract',
        status: 'Pending Audit',
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: `${(file.size / 1024).toFixed(0)} KB`
      };
      setStudentDocs(prev => [newDoc, ...prev]);
    }
  };

  const [latestUploadedSrc, setLatestUploadedSrc] = useState<string | null>(null);

  const handleSmartDocUpload = (dataUrl: string, fileName: string) => {
    setLatestUploadedSrc(dataUrl);
    const mockSize = Math.round(dataUrl.length * 0.75);
    const newDoc: StudentDoc = {
      id: `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      name: fileName,
      type: 'Agreement Contract',
      status: 'Pending Audit',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: `${(mockSize / 1024).toFixed(0)} KB`
    };
    setStudentDocs(prev => [newDoc, ...prev]);
  };

  // B2B Add Instructor to state
  const handleB2bAddInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bNewInstructorName.trim()) return;

    const newInst: Instructor = {
      id: `inst-${Date.now()}`,
      name: b2bNewInstructorName,
      rating: 5.0,
      completedStudents: 0,
      languages: ['Lithuanian', 'English'],
      vehicleTypes: [b2bNewInstructorCategory || 'Manual Transmission'],
      picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
      bio: 'Newly registered Baltic Driving Academy certified coach. Eager to tutor modern Category B cohorts.',
      availability: ['Flexible Hours', 'Weekend Drives']
    };

    setB2bInstructors(prev => [...prev, newInst]);
    setB2bNewInstructorName('');
    setB2bNewInstructorCategory('');
    alert(`Success! ${newInst.name} has been added to Sovereign Baltic Driving Academy instructor roster. All students can now view availability slots.`);
  };

  // Delete instructor from roster
  const handleB2bDeleteInstructor = (id: string) => {
    setB2bInstructors(prev => prev.filter(i => i.id !== id));
  };

    return (
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6 bg-white text-left font-sans" id="driving-hub-root">
        
        {/* Header Section */}
        <div className="pb-4 border-b border-zinc-200">
          <div className="relative space-y-2 max-w-3xl">
            <h1 id="driving-academy-heading" className="text-3xl font-extrabold tracking-tight text-zinc-900 font-sans">
              Driving Academy Hub
            </h1>
          </div>
  
          {/* Multi-Pane Tab Swapping Systems */}
          <div className="relative pt-4 flex flex-wrap gap-1.5 max-w-[850px]">
            <button
              onClick={() => setActiveTab('directory')}
              className={`py-1.5 px-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer border ${
                activeTab === 'directory'
                  ? 'bg-[#8B0000] text-white border-transparent shadow-sm'
                  : 'bg-zinc-100 text-zinc-650 border-zinc-200 hover:bg-zinc-200'
              }`}
              id="driving-tab-directory"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Schools Directory</span>
            </button>
  
            <button
              onClick={() => setActiveTab('booking')}
              className={`py-1.5 px-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer border ${
                activeTab === 'booking'
                  ? 'bg-[#8B0000] text-white border-transparent shadow-sm'
                  : 'bg-zinc-100 text-zinc-650 border-zinc-200 hover:bg-zinc-200'
              }`}
              id="driving-tab-booking"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Booking &amp; Scheduling</span>
            </button>
  
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-1.5 px-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer border ${
                activeTab === 'progress'
                  ? 'bg-[#8B0000] text-white border-transparent shadow-sm'
                  : 'bg-zinc-100 text-zinc-650 border-zinc-200 hover:bg-zinc-200'
              }`}
              id="driving-tab-progress"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Student scorecard &amp; Docs</span>
            </button>
  
            <button
              onClick={() => setActiveTab('assistant')}
              className={`py-1.5 px-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer border ${
                activeTab === 'assistant'
                  ? 'bg-[#8B0000] text-white border-transparent shadow-sm'
                  : 'bg-zinc-100 text-zinc-650 border-zinc-200 hover:bg-zinc-200'
              }`}
              id="driving-tab-assistant"
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Theory Coach AI</span>
            </button>
          </div>
        </div>

      {/* RENDER ACTIVE GRAPHICS PANELS */}
      <AnimatePresence mode="wait">

        {/* TAB 1: ACADEMY DIRECTORY & ROSTERS */}
        {activeTab === 'directory' && (
          <motion.div
            key="directory-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.15 }}
            className="space-y-8"
          >
            {/* Horizontal Filter Bar */}
            <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-lg grid grid-cols-1 md:grid-cols-5 gap-2.5 items-center text-left">
              
              {/* Search text input */}
              <div className="relative">
                <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">Search Keywords</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Sovereign, Vilnius..."
                    className="w-full pl-7 pr-2 py-1.5 text-[10px] bg-white border border-zinc-200 rounded text-zinc-800 font-semibold focus:outline-none focus:border-[#8B0000]"
                  />
                </div>
              </div>

              {/* Geographic filters */}
              <div>
                <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">Region Location</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full p-1.5 text-[10px] bg-white border border-zinc-200 rounded text-zinc-800 font-semibold focus:outline-none focus:border-[#8B0000]"
                >
                  <option value="All">All Locations</option>
                  <option value="Vilnius">Vilnius (LT 🇱🇹)</option>
                  <option value="Kaunas">Kaunas (LT 🇱🇹)</option>
                  <option value="Klaipėda">Klaipėda (LT 🇱🇹)</option>
                  <option value="Berlin">Berlin (DE 🇩🇪)</option>
                </select>
              </div>

              {/* License Class Target */}
              <div>
                <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">License Class Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-1.5 text-[10px] bg-white border border-zinc-200 rounded text-zinc-800 font-semibold focus:outline-none focus:border-[#8B0000]"
                >
                  <option value="All">All Categories</option>
                  <option value="Category B">Category B (Regular Car)</option>
                  <option value="Category A">Category A (Motorcycles)</option>
                  <option value="Category C">Category C (Cargo Rig)</option>
                </select>
              </div>

              {/* Instructor Spoken Languages */}
              <div>
                <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">Instruction Language</label>
                <select
                  value={filterLanguage}
                  onChange={(e) => setFilterLanguage(e.target.value)}
                  className="w-full p-1.5 text-[10px] bg-white border border-zinc-200 rounded text-zinc-800 font-semibold focus:outline-none focus:border-[#8B0000]"
                >
                  <option value="All">All Languages</option>
                  <option value="Lithuanian">Lithuanian</option>
                  <option value="English">English</option>
                  <option value="German">German</option>
                  <option value="Russian">Russian</option>
                </select>
              </div>

              {/* Transmission Type */}
              <div>
                <label className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">Vehicle Transmission</label>
                <select
                  value={filterTransmission}
                  onChange={(e) => setFilterTransmission(e.target.value)}
                  className="w-full p-1.5 text-[10px] bg-white border border-zinc-200 rounded text-zinc-800 font-semibold focus:outline-none focus:border-[#8B0000]"
                >
                  <option value="All">Manual &amp; Auto</option>
                  <option value="Manual">Manual Clutch Only</option>
                  <option value="Automatic">Automatic Only</option>
                  <option value="Electric EV">Electric EV Hatchbacks</option>
                </select>
              </div>

            </div>

            {/* Split layout: School Cards List (Left), In-Depth Profile (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left Column: School Selector List */}
              <div className="col-span-1 lg:col-span-4 space-y-3">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-[10px] font-bold text-zinc-855 uppercase tracking-wider">
                    Available Schools ({filteredSchools.length})
                  </h3>
                  {filteredSchools.length === 0 && (
                    <button 
                      onClick={() => { setFilterLocation('All'); setFilterCategory('All'); setFilterLanguage('All'); setFilterTransmission('All'); setSearchQuery(''); }}
                      className="text-[9px] text-[#8B0000] font-bold"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {filteredSchools.map((school) => (
                    <div
                      key={school.id}
                      onClick={() => setSelectedSchoolId(school.id)}
                      className={`border p-3.5 rounded-lg cursor-pointer transition-all border-l-4 text-zinc-800 ${
                        selectedSchoolId === school.id
                          ? 'bg-zinc-50 border-zinc-400 border-l-[#8B0000]'
                          : 'bg-white border-zinc-200 border-l-zinc-300 hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-extrabold text-xs shrink-0">
                            {school.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-zinc-900">{school.name}</h4>
                            <div className="flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-zinc-400" />
                              <span className="text-[9px] text-zinc-500 font-semibold">{school.locations.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-zinc-100 flex justify-between items-center text-[9px] font-semibold">
                        <span className="text-zinc-500">Regitra Pass Rate: <strong className="text-emerald-700 font-bold">{school.successRate}%</strong></span>
                        <span className="text-[#8B0000] uppercase tracking-wider inline-flex items-center gap-0.5 font-bold">
                          Configure <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Dynamic Deep School Profile Details */}
              <div className="col-span-1 lg:col-span-8 bg-white border border-zinc-200 rounded-lg p-4 space-y-5">
                
                {/* Brand Showcase Header */}
                <div className="flex justify-between gap-4 pb-4 border-b border-zinc-150">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-850 font-extrabold text-lg shrink-0">
                        {activeSchool.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-base font-bold text-zinc-900 tracking-tight">{activeSchool.name}</h2>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-section 1: Pricing Packages for specific License classes */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-left">
                    <h3 className="text-[10.5px] font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1">
                      <Clipboard className="w-3.5 h-3.5 text-zinc-550" />
                      Standardized License Training Packages
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                    {activeSchool.packages.map((pkg) => (
                      <div key={pkg.id} className="border border-zinc-200 bg-zinc-50/50 rounded-lg p-3 hover:border-zinc-300 transition duration-150 flex flex-col justify-between space-y-2.5">
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start">
                            <span className="text-[8px] bg-zinc-900 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                              {pkg.category.split(' ')[0]} {pkg.category.split(' ')[1] || ''}
                            </span>
                            <span className="font-mono text-[#8B0000] font-bold text-xs">€{pkg.price}</span>
                          </div>
                          <h4 className="font-bold text-zinc-900 text-[11px] leading-snug">{pkg.title}</h4>
                          <p className="text-zinc-500 text-[9.5px] leading-relaxed line-clamp-2">
                            {pkg.description}
                          </p>
                        </div>

                        <div className="border-t border-zinc-100 pt-2 flex items-center justify-between text-[8.5px] font-bold text-zinc-500">
                          <span>Hours log: <strong className="text-zinc-850">{pkg.durationHours} hrs</strong></span>
                          <span>Theory integrated: <strong className={pkg.includesTheory ? "text-emerald-700 font-bold" : "text-zinc-400"}>{pkg.includesTheory ? "Yes" : "No"}</strong></span>
                        </div>

                        <button
                          onClick={() => {
                            setBookingCategory(pkg.category);
                            setActiveTab('booking');
                          }}
                          className="w-full bg-[#8B0000] hover:bg-zinc-900 transition text-white py-1.5 rounded text-[8.5px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Book Course Package
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-section 2: Certified Instructors & Employee management */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-left">
                    <h3 className="text-[10.5px] font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-zinc-550" />
                      Certified Instructors
                    </h3>
                    
                    {activeSchool.b2bCorporateRates && (
                      <button
                        onClick={() => {
                          setB2bManagerMode(true);
                          setActiveTab('progress');
                        }}
                        className="text-[8px] bg-[#8B0000] text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider cursor-pointer"
                      >
                        B2B Staff Admin Control
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                    {activeSchool.instructors.map((inst) => (
                      <div key={inst.id} className="border border-zinc-200 bg-white rounded-lg p-3 space-y-2.5 hover:shadow-xs transition">
                        <div className="flex items-center gap-2">
                          <img
                            src={inst.picture}
                            alt={inst.name}
                            className="w-8 h-8 rounded-full object-cover border border-zinc-200 grayscale"
                          />
                          <div>
                            <h4 className="font-bold text-[10.5px] text-zinc-900">{inst.name}</h4>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              <span className="text-[9px] text-zinc-500 font-bold">{inst.rating}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-zinc-500 text-[9px] leading-relaxed italic line-clamp-2">
                          "{inst.bio}"
                        </p>

                        <button
                          onClick={() => {
                            setBookingCategory('Category B (Car)');
                            setBookingInstructorId(inst.id);
                            setActiveTab('booking');
                          }}
                          className="w-full bg-zinc-50 hover:bg-zinc-105 text-zinc-700 text-[8.5px] font-bold uppercase tracking-wider py-1 border border-zinc-200 rounded cursor-pointer transition"
                        >
                          Check Availability Slots
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: INTERACTIVE LESSONS & EXAMS BOOKING CALENDAR */}
        {activeTab === 'booking' && (
          <motion.div
            key="booking-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.15 }}
            className="space-y-8"
          >
            {/* Split Booking Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Form Input booking controls Left */}
              <form onSubmit={handleCreateBooking} className="col-span-1 lg:col-span-4 bg-zinc-50 border border-zinc-200 p-4 rounded-lg space-y-3.5 text-left">
                <div className="flex items-center gap-1.5 mb-11 flex-row">
                  <div className="w-7 h-7 rounded bg-red-50 text-[#8B0000] flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 tracking-tight">Lesson Scheduler</h3>
                  </div>
                </div>

                {/* Student Full Name */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Commuter Student Name</label>
                  <input
                    type="text"
                    value={newBookingStudentName}
                    onChange={(e) => setNewBookingStudentName(e.target.value)}
                    placeholder="E.g., Gabrielius Landsbergis"
                    className="w-full p-2 text-[10px] bg-white border border-zinc-200 rounded text-zinc-800 font-semibold focus:outline-none focus:border-[#8B0000]"
                    required
                  />
                </div>

                {/* Driving School Link */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Select Driving School</label>
                  <select
                    value={bookingSchoolId}
                    onChange={(e) => {
                      setBookingSchoolId(e.target.value);
                    }}
                    className="w-full p-2 text-[10px] bg-white border border-zinc-200 rounded text-zinc-800 font-semibold focus:outline-none focus:border-[#8B0000]"
                  >
                    {DRIVING_SCHOOLS.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                {/* License Class Range */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Target License Class</label>
                  <select
                    value={bookingCategory}
                    onChange={(e) => setBookingCategory(e.target.value)}
                    className="w-full p-2 text-[10px] bg-white border border-zinc-200 rounded text-zinc-800 font-semibold focus:outline-none focus:border-[#8B0000]"
                  >
                    <option value="Category B (Car)">Category B (Regular Car - Manual/Auto)</option>
                    <option value="Category A (Motorcycle)">Category A (High CC Motorcycles)</option>
                    <option value="Category C (Heavy Truck)">Category C (Logistics Freight Trucks)</option>
                    <option value="Category CE (Trailer)">Category CE (Heavy Logistics Trailers)</option>
                  </select>
                </div>

                {/* Instructor Link */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-[#8B0000] uppercase tracking-wider">Choose Certified Instructor</label>
                  <select
                    value={bookingInstructorId}
                    onChange={(e) => setBookingInstructorId(e.target.value)}
                    className="w-full p-2 text-[10px] bg-white border border-[#8B0000]/60 rounded text-zinc-800 font-bold focus:outline-none"
                  >
                    {b2bInstructors.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.name} ({inst.rating} ★)</option>
                    ))}
                  </select>
                </div>

                {/* Lesson Category Option */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Lesson Focus Type</label>
                  <div className="grid grid-cols-3 gap-1 border border-zinc-200 bg-white p-0.5 rounded">
                    {(['Practical Drive', 'Theory Lecture', 'Mock Exam'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setBookingLessonType(type)}
                        className={`py-1 px-0.5 text-[8.5px] font-semibold rounded transition cursor-pointer ${
                          bookingLessonType === type 
                            ? 'bg-[#8B0000] text-white shadow-xs' 
                            : 'text-zinc-650 hover:bg-zinc-100'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time Selection Picker */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[8.5px] font-bold text-zinc-500 uppercase tracking-wider">Select Lesson Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full p-2 text-[10px] bg-white border border-zinc-200 rounded text-zinc-800 font-semibold focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8.5px] font-bold text-zinc-500 uppercase tracking-wider">Available Time Slots</label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full p-2 text-[10px] bg-white border border-zinc-200 rounded text-zinc-800 font-semibold focus:outline-none"
                    >
                      <option value="08:00 AM - 10:00 AM">08:00 AM - 10:00 AM</option>
                      <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                      <option value="01:00 PM - 03:00 PM">01:00 PM - 03:00 PM</option>
                      <option value="03:00 PM - 05:00 PM">03:00 PM - 05:00 PM</option>
                      <option value="05:30 PM - 07:30 PM">05:30 PM - 07:30 PM</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8B0000] hover:bg-zinc-900 transition text-white font-bold uppercase text-[9.5px] tracking-wider py-2 rounded shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  <span>Confirm Drive Slot Appointment</span>
                </button>
              </form>

              {/* Weekly visual matrix calendar checklist Right */}
              <div className="col-span-1 lg:col-span-8 space-y-4">
                
                <div className="bg-white border border-zinc-200 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 uppercase">Live Instructor Availability Dashboard</h4>
                    </div>
                  </div>

                  {/* Seeded availability visual picker calendar */}
                  <div className="grid grid-cols-7 gap-1.5 text-center text-[9px] font-bold">
                    {['Mon 19', 'Tue 20', 'Wed 21', 'Thu 22', 'Fri 23', 'Sat 24', 'Sun 25'].map((day, idx) => (
                      <div key={idx} className="bg-zinc-50 border border-zinc-200 p-2 rounded flex flex-col justify-between h-14">
                        <span className="text-zinc-400 text-[7.5px] uppercase font-bold">{day.split(' ')[0]}</span>
                        <span className="text-zinc-850 font-bold text-xs font-mono">{day.split(' ')[1]}</span>
                        {idx === 0 || idx === 2 ? (
                          <span className="bg-amber-100 text-amber-800 text-[7px] px-1 py-0.5 rounded uppercase font-bold scale-95">Booked</span>
                        ) : idx === 3 ? (
                          <span className="bg-[#8B0000]/10 text-[#8B0000] text-[7px] px-1 py-0.5 rounded uppercase font-bold scale-95">Selected</span>
                        ) : (
                          <span className="bg-emerald-50 text-emerald-850 text-[7px] px-1 py-0.5 rounded uppercase font-bold scale-95">Available</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* List of active student bookings */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-zinc-900 uppercase tracking-wider px-1">
                    Your Scheduled appointments ({activeBookings.length})
                  </h3>

                  <div className="grid grid-cols-1 gap-2.5">
                    {activeBookings.map((bkg) => (
                      <div key={bkg.id} className="border border-zinc-200 bg-zinc-50 p-3.5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8.5px] font-bold bg-zinc-900 text-white px-1.5 py-0.5 rounded uppercase">
                              {bkg.lessonType}
                            </span>
                            <span className="font-mono text-[8.5px] text-zinc-400 font-bold">{bkg.id}</span>
                          </div>

                          <h4 className="text-[11.5px] font-bold text-zinc-900">
                            Driving School: {bkg.schoolName}
                          </h4>

                          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] font-medium text-zinc-500">
                            <span>Instructor: <strong>{bkg.instructorName}</strong></span>
                            <span>• Class: <strong>{bkg.category}</strong></span>
                            <span>• Scheduled Date: <strong>{bkg.dateTime}</strong></span>
                            <span>• Session Slot: <strong>{bkg.timeSlot}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 justify-end shrink-0">
                          <span className="bg-emerald-50 text-emerald-850 text-[8.5px] font-bold uppercase px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            {bkg.status}
                          </span>
                          <button
                            onClick={() => {
                              setActiveBookings(prev => prev.filter(b => b.id !== bkg.id));
                              alert(`Booking ${bkg.id} successfully canceled.`);
                            }}
                            className="bg-white hover:bg-red-50 text-red-600 border border-zinc-200 hover:border-red-200 transition p-1.5 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: STUDENT PROGRESS CORE & DOCUMENT LOCKER */}
        {activeTab === 'progress' && (
          <motion.div
            key="progress-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.15 }}
            className="space-y-6"
          >
            {/* Toggle B2B Employee Management Overlay view */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-1.5 text-left">
                <span className="text-lg">📊</span>
                <div>
                  <h4 className="text-[10.5px] font-bold text-zinc-900 uppercase">Scorecard Mode Selector</h4>
                </div>
              </div>

              <div className="flex gap-1.5">
                <button
                  onClick={() => setB2bManagerMode(false)}
                  className={`py-1 px-2.5 rounded text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    !b2bManagerMode 
                      ? 'bg-[#8B0000] text-white' 
                      : 'bg-white text-zinc-600 border border-zinc-200'
                  }`}
                >
                  My Learner score
                </button>
                <button
                  onClick={() => setB2bManagerMode(true)}
                  className={`py-1 px-2.5 rounded text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                    b2bManagerMode 
                      ? 'bg-[#8B0000] text-white' 
                      : 'bg-white text-zinc-650 border border-zinc-200'
                  }`}
                >
                  B2B Staff Manager Mode
                </button>
              </div>
            </div>

            {/* RENDER B2B MANAGER SCREEN */}
            {b2bManagerMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* Left Column: Manage Driving Instructors (Staff roster) */}
                  <div className="col-span-1 lg:col-span-5 border border-zinc-200 rounded-lg p-3 bg-zinc-50 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 uppercase">Manage Corporate Instructors</h4>
                    </div>

                    {/* Add Instructor Form */}
                    <form onSubmit={handleB2bAddInstructor} className="space-y-2.5 pt-2 border-t border-zinc-100">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase">Full Legal Name</label>
                        <input
                          type="text"
                          value={b2bNewInstructorName}
                          onChange={(e) => setB2bNewInstructorName(e.target.value)}
                          placeholder="Arūnas Valinskas"
                          className="w-full text-[10px] p-1.5 rounded border border-zinc-200 focus:outline-none focus:border-[#8B0000]"
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase">Class Competency</label>
                        <select
                          value={b2bNewInstructorCategory}
                          onChange={(e) => setB2bNewInstructorCategory(e.target.value)}
                          className="w-full text-[10px] p-1.5 rounded border border-zinc-200 focus:outline-none bg-white font-semibold text-zinc-700"
                        >
                          <option value="Category B - Manual Clutch">Category B (Regular Cars)</option>
                          <option value="Category A - Motorcycle Specialist">Category A (Motorcycles)</option>
                          <option value="Category C - Logistics Freight">Category C (Logistics Freight)</option>
                          <option value="Category CE - Trailer Towing">Category CE (Trailers)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#8B0000] hover:bg-zinc-900 cursor-pointer transition text-white text-[9.5px] font-bold uppercase py-1.5 rounded"
                      >
                        Add Instructor to Roster
                      </button>
                    </form>

                    {/* Simple Staff Roster Output List */}
                    <div className="space-y-2 pt-3 border-t border-zinc-200">
                      <h5 className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Active Staff Members ({b2bInstructors.length})</h5>
                      <div className="space-y-1.5">
                        {b2bInstructors.map((inst) => (
                          <div key={inst.id} className="bg-white border p-2 rounded flex items-center justify-between text-[11px] font-semibold">
                            <div>
                              <div className="font-bold text-zinc-900">{inst.name}</div>
                              <div className="text-[8px] text-zinc-400 uppercase font-mono">{inst.vehicleTypes.join(', ')}</div>
                            </div>
                            <button
                              onClick={() => handleB2bDeleteInstructor(inst.id)}
                              className="text-red-650 hover:font-bold text-[9px] px-1 py-0.5 hover:bg-red-50 rounded cursor-pointer"
                            >
                              Revoke
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Corporate Employee Progress overview */}
                  <div className="col-span-1 lg:col-span-7 bg-white border border-zinc-200 rounded-lg p-4 space-y-4 text-left font-sans">
                    <div>
                      <h3 className="text-xs font-bold text-zinc-900 uppercase">Enterprise Driver Training Matrix</h3>
                    </div>

                    <div className="space-y-3">
                      {/* Seeded enterprise progress bars */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px] font-bold text-zinc-800">
                          <span>Gabrielius L. (Category B)</span>
                          <span className="text-[#8B0000]">82% Ready</span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-1.5">
                          <div className="bg-[#8B0000] h-1.5 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                        <div className="text-[8.5px] text-zinc-400 flex justify-between">
                          <span>Drives Completed: 24 of 30 hours</span>
                          <span>Theory Scored: 94% average</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-3 border-t border-zinc-100">
                        <div className="flex justify-between items-center text-[11px] font-bold text-zinc-800">
                          <span>Mantas A. (Category CE heavy Trailer)</span>
                          <span className="text-[#8B0000]">45% Ready</span>
                        </div>
                        <div className="w-full bg-zinc-100 rounded-full h-1.5">
                          <div className="bg-[#8B0000] opacity-80 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <div className="text-[8.5px] text-zinc-400 flex justify-between">
                          <span>Drives Completed: 12 of 40 hours</span>
                          <span>Theory Scored: 75% average</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              /* PRIVATE LEARNER METRICS SCREEN */
              <div className="space-y-4">
                {/* Scorecard grids */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-left">
                  
                  {/* Metric 1 */}
                  <div className="border border-zinc-200 rounded-lg p-3 bg-white space-y-0.5">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Exam Readiness</span>
                    <span className="text-lg font-mono font-bold text-[#8B0000] block">85%</span>
                  </div>

                  {/* Metric 2 */}
                  <div className="border border-zinc-200 rounded-lg p-3 bg-white space-y-0.5 text-zinc-800">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Drives Completed</span>
                    <span className="text-lg font-mono font-bold text-zinc-900 block">18 / 30</span>
                  </div>

                  {/* Metric 3 */}
                  <div className="border border-zinc-200 rounded-lg p-3 bg-white space-y-0.5 text-zinc-800">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Theory Quizzes</span>
                    <span className="text-lg font-mono font-bold text-zinc-900 block">94%</span>
                  </div>

                  {/* Metric 4 */}
                  <div className="border border-zinc-200 rounded-lg p-3 bg-white space-y-0.5 text-zinc-800">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block">Regitra Exam Slot</span>
                    <span className="text-[9.5px] font-bold text-[#8B0000] uppercase block pt-1.5">No Registered Slot</span>
                  </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* Left Column: Lesson History & remarks from instructors */}
                  <div className="col-span-1 lg:col-span-7 bg-white border border-zinc-205 rounded-lg p-4 space-y-4 text-left">
                    <div>
                      <h3 className="text-xs font-bold text-zinc-900 uppercase">Assessment Timeline</h3>
                    </div>

                    <div className="space-y-3">
                      
                      <div className="border-l-2 border-l-[#8B0000] pl-3 space-y-0.5">
                        <div className="text-[7.5px] text-[#8B0000] font-bold uppercase font-mono">Drive #5 • Vilnius Center Route • June 15</div>
                        <h4 className="font-bold text-[10.5px] text-zinc-900">Tomas Drungilas, Sovereign Coach</h4>
                        <p className="text-[9.5px] text-zinc-500 leading-relaxed italic">
                          "Steering cadences on narrow roundabout dividers were smooth. Mirror blind spots require continuous scans before swapping lanes."
                        </p>
                      </div>

                      <div className="border-l-2 border-l-zinc-350 pl-3 space-y-0.5 pt-2 border-t border-zinc-100">
                        <div className="text-[7.5px] text-zinc-450 font-bold uppercase font-mono">Drive #4 • Maneuver Training • June 10</div>
                        <h4 className="font-bold text-[10.5px] text-zinc-900">Tomas Drungilas, Sovereign Coach</h4>
                        <p className="text-[9.5px] text-zinc-500 leading-relaxed italic">
                          "Excellent control on steep clutch slopes. Parallel parking on gravel boxes completed within 45 seconds."
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Digital Document Locker with click/drag capabilities */}
                  <div className="col-span-1 lg:col-span-5 bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-4 text-left">
                    <div>
                      <h3 className="text-xs font-bold text-zinc-900 uppercase">Digital Vault</h3>
                    </div>

                    {/* Drag and Drop Box */}
                    <UniversalSmartUpload
                      photoKey="driving_school_docs"
                      uploadedImageSrc={latestUploadedSrc}
                      onUploadSuccess={handleSmartDocUpload}
                      onClear={() => setLatestUploadedSrc(null)}
                      label="Document Registry Scanner"
                      description="Position your driver's license or medical clearance forms under the camera."
                    />

                    {/* Uploaded documents list */}
                    <div className="space-y-1.5 pt-2 border-t border-zinc-200">
                      <h6 className="text-[8.5px] font-bold text-zinc-400 uppercase tracking-wider">Active Records ({studentDocs.length})</h6>
                      
                      <div className="space-y-1">
                        {studentDocs.map((doc) => (
                          <div key={doc.id} className="bg-white border p-1.5 rounded flex items-center justify-between text-[10.5px] font-medium">
                            <div className="text-left shrink-1 truncate pr-1">
                              <div className="font-bold text-zinc-800 truncate max-w-[120px]">{doc.name}</div>
                            </div>

                            <span className={`text-[7px] font-bold uppercase px-1 py-0.5 rounded shrink-0 ${
                              doc.status === 'Verified' 
                                ? 'bg-emerald-50 text-emerald-850' 
                                : 'bg-amber-50 text-amber-850'
                            }`}>
                              {doc.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: ACCREDITED THEORY PRACTICE & TRAFFIC RULES COACH */}
        {activeTab === 'assistant' && (
          <motion.div
            key="assistant-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.15 }}
            className="space-y-8"
          >
            {/* Split layout: Interactive Quiz (Left), AI Chatbot Assist (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left Column: Interactive Multi-choice Theory Quiz Exam */}
              <div className="col-span-1 lg:col-span-7 bg-white border border-zinc-200 rounded-lg p-4 space-y-4 text-left">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-100">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 uppercase flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-zinc-500" />
                      Theory Prep Exam
                    </h3>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-400">
                    Q: <strong className="text-zinc-950">{currentQuizIdx + 1} / {TRAFFIC_QUIZ.length}</strong>
                  </span>
                </div>

                {/* Question Display */}
                <div className="space-y-3 bg-zinc-50 border border-zinc-100 p-3 rounded">
                  <div className="flex items-center gap-1.5 text-[8.5px] font-bold text-[#8B0000] bg-red-50/50 p-1 rounded">
                    <span className="w-1.5 h-1.5 bg-[#8B0000] rounded-full shrink-0"></span>
                    <span>SCENARIO: {TRAFFIC_QUIZ[currentQuizIdx].signsUrl}</span>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-950 leading-relaxed">
                    {TRAFFIC_QUIZ[currentQuizIdx].question}
                  </h4>
                </div>

                {/* Options list */}
                <div className="space-y-1.5">
                  {TRAFFIC_QUIZ[currentQuizIdx].options.map((opt, idx) => {
                    let btnColor = "bg-white border-zinc-200 hover:border-[#8B0000] text-zinc-800";
                    if (quizAttempted) {
                      if (idx === TRAFFIC_QUIZ[currentQuizIdx].correctIdx) {
                        btnColor = "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold";
                      } else if (idx === selectedAnswerIdx) {
                        btnColor = "bg-red-50 border-red-300 text-red-800 font-bold";
                      } else {
                        btnColor = "bg-zinc-50/50 border-zinc-150 text-zinc-400";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleCheckQuizAnswer(idx)}
                        disabled={quizAttempted}
                        className={`w-full text-[11px] text-left p-2.5 border rounded transition cursor-pointer flex items-start gap-2 ${btnColor}`}
                      >
                        <span className="bg-zinc-100 text-zinc-800 font-mono text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation text showing after answer check */}
                {quizAttempted && (
                  <div className="bg-blue-50 border border-blue-150 p-2.5 rounded text-[10.5px] text-zinc-800 leading-relaxed font-semibold">
                    <strong className="text-blue-900 block uppercase tracking-wider text-[8px] mb-0.5">Explanation:</strong>
                    <p>{TRAFFIC_QUIZ[currentQuizIdx].explanation}</p>
                  </div>
                )}

                {/* Navigation dynamic next quiz control */}
                {quizAttempted && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={handleNextQuizQuestion}
                      className="bg-[#8B0000] hover:bg-zinc-900 text-white text-[9px] font-bold uppercase tracking-wider py-1.5 px-3 rounded transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>
                        {currentQuizIdx < TRAFFIC_QUIZ.length - 1 ? "Next Question" : "View Score"}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: AI driving Assistant theory chatbot */}
              <div className="col-span-1 lg:col-span-5 bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-4 text-left flex flex-col justify-between min-h-[400px]">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded bg-red-105 text-[#8B0000] flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-zinc-900 uppercase">AI Driving Coach</h3>
                    </div>
                  </div>

                  {/* Preset quick prompt templates */}
                  <div className="space-y-1">
                    <span className="text-[8px] font-bold text-zinc-400 uppercase block">Presets:</span>
                    <div className="flex flex-wrap gap-1">
                      {[
                        'Roundabout exits',
                        'Autobahn speed',
                        'Safe distance',
                        'Yellow lights'
                      ].map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleTriggerPresetPrompt(preset)}
                          className="bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-[8px] font-semibold py-0.5 px-1.5 rounded transition cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chat messages log visual viewport */}
                  <div className="bg-white border rounded p-2.5 space-y-2.5 h-[200px] overflow-y-auto text-[10px] font-medium font-sans">
                    {aiChatLog.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex flex-col space-y-0.5 ${
                          msg.sender === 'user' ? 'items-end' : 'items-start'
                        }`}
                      >
                        <div
                          className={`p-2 rounded max-w-[200px] ${
                            msg.sender === 'user'
                              ? 'bg-zinc-900 text-white rounded-br-none'
                              : 'bg-zinc-100 text-zinc-800 rounded-bl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[7.5px] text-zinc-400 font-mono">
                          {msg.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Input action toolbar */}
                <form onSubmit={handleAiQuerySubmit} className="flex gap-1.5 pt-2 border-t border-zinc-200">
                  <input
                    type="text"
                    value={aiChatQuery}
                    onChange={(e) => setAiChatQuery(e.target.value)}
                    placeholder="Ask about traffic rules..."
                    className="flex-1 p-2 text-[10px] bg-white border border-zinc-200 rounded focus:border-[#8B0000] focus:outline-none font-semibold text-zinc-850"
                  />
                  <button
                    type="submit"
                    className="bg-[#8B0000] hover:bg-zinc-900 text-white font-bold uppercase text-[9px] py-1.5 px-3 rounded transition cursor-pointer shrink-0"
                  >
                    Ask
                  </button>
                </form>

              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
