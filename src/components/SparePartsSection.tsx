/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, ShieldCheck, Check, Sparkles, MessageCircle, MapPin, Truck, 
  ShoppingCart, RefreshCcw, Trash2, HelpCircle, Eye, AlertCircle, ArrowRight, 
  ChevronRight, UploadCloud, Info, Filter, X, Send, Play, Layers, ShieldAlert,
  SlidersHorizontal, CheckCircle, Package, Globe, DollarSign, Tag, Landmark,
  MessageSquare, Camera, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Part } from '../types';
import UniversalSmartUpload from './UniversalSmartUpload';
import { api } from '../lib/api';

// Let's define the enriched parts array with more details
export interface EnrichedPart extends Part {
  dismantlerName: string;
  dismantlerLocation: string;
  warehouseLocation: string;
  oemNumber: string;
  shippingBaseCost: number;
  longCompatibleVehicles: string[];
  ratings: number;
  availableStockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  hasExpressShipping: boolean;
  notes: string;
}

const RICH_PARTS: EnrichedPart[] = [
  {
    sku: 'MP-4S-18245',
    name: 'Michelin Pilot Sport 4S (245/40ZR18)',
    vehicleCompat: 'Porsche 911, Audi RS6, BMW M5',
    condition: 'Brand New (Summer Sport)',
    price: 310.00,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
    interchangeId: 'MICH-PS4S-245-40-18',
    category: 'Tyres & Wheels',
    dismantlerName: 'Bavarian Wheel Hub Ltd',
    dismantlerLocation: 'German Customs Zone (Munich)',
    warehouseLocation: 'Munich Depot - Rack A11, Shelf 3',
    oemNumber: 'MICH-991-PS4S',
    shippingBaseCost: 45.00,
    longCompatibleVehicles: ['Porsche 911 (991/992)', 'Audi RS6 Avant', 'BMW M5 Competition', 'Mercedes AMG E63'],
    ratings: 4.9,
    availableStockStatus: 'In Stock',
    hasExpressShipping: true,
    notes: 'Direct factory rubber specifications. Optimal track performance and wet hydroplane prevention.'
  },
  {
    sku: 'PZ-C3-20305',
    name: 'Pirelli P Zero Corsa (305/30ZR20) Extreme',
    vehicleCompat: 'Porsche 911 Turbo S, Audi R8, Ferrari F8',
    condition: 'OEM Certified Prep',
    price: 465.00,
    stock: 2,
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=800',
    interchangeId: 'PIRE-PZ-305-30-20',
    category: 'Tyres & Wheels',
    dismantlerName: 'Scuderia Tuning Depot',
    dismantlerLocation: 'Port of Genoa (Italy)',
    warehouseLocation: 'Genoa Port Vault - Sector 4, Bin B',
    oemNumber: 'PIRE-991-PZC',
    shippingBaseCost: 60.00,
    longCompatibleVehicles: ['Porsche 911 Turbo S', 'Audi R8 Coupe', 'Ferrari F8 Tributo', 'Lamborghini Huracan'],
    ratings: 4.8,
    availableStockStatus: 'Low Stock',
    hasExpressShipping: false,
    notes: 'Super sticky compound formulated for advanced thermal friction limits at premium track structures.'
  },
  {
    sku: 'BP-E8-V8350',
    name: 'Sovereign Twin-Power V8 Sport Engine Block',
    vehicleCompat: 'BMW M3, Audi S5, Mercedes C63, Porsche 911',
    condition: 'OEM Factory Certified',
    price: 3450.00,
    stock: 1,
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800',
    interchangeId: 'OEM-V8-TWIN-TURBO-550',
    category: 'Engine & Exhaust',
    dismantlerName: 'Berlin Core Engine Dismantlers',
    dismantlerLocation: 'Flughafen Berlin Warehouse (Germany)',
    warehouseLocation: 'East Berlin Depot - Core Cage 9c',
    oemNumber: 'BMW-S58-V8-BLOCK',
    shippingBaseCost: 350.00,
    longCompatibleVehicles: ['BMW M3 Competition', 'Audi RS5 Sportback', 'Mercedes AMG C63', 'Porsche 911 Carrera GTS'],
    ratings: 5.0,
    availableStockStatus: 'Low Stock',
    hasExpressShipping: true,
    notes: 'Fully pressure tested engine block. Zero cylinder wall micro-cracking detected under ultrasound.'
  },
  {
    sku: 'ECU-P992-M',
    name: 'Porsche 992 Carrera Bosch Master ECU',
    vehicleCompat: 'Porsche 911 (992 Gen)',
    condition: 'Excellent Reclaimed',
    price: 1250.05,
    stock: 5,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
    interchangeId: 'BOSCH-992-ECU22',
    category: 'Electronics',
    dismantlerName: 'Stuttgart Smart Tech Salvage',
    dismantlerLocation: 'Port of Hamburg (Germany)',
    warehouseLocation: 'Hamburg Terminal 4 - Row C, Bin 12',
    oemNumber: 'BOSCH-Porsche-992-ECU',
    shippingBaseCost: 30.00,
    longCompatibleVehicles: ['Porsche 911 Carrera', 'Porsche 911 Carrera S', 'Porsche 911 Targa 4'],
    ratings: 4.7,
    availableStockStatus: 'In Stock',
    hasExpressShipping: true,
    notes: 'Reset to factory security firmware. Pre-loaded with Stage 1 optimization profiles. Fully flashable.'
  },
  {
    sku: 'CF-WG-911',
    name: 'Dry Carbon Fiber Spoiler Aero Wing',
    vehicleCompat: 'Mercedes AMG, Porsche 911 GT3',
    condition: 'Brand New (Carbon Wrap)',
    price: 890.00,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
    interchangeId: 'GT3-AERO-WING-CARBON',
    category: 'Body & Frame',
    dismantlerName: 'Tokyo Carbon Aero Tech',
    dismantlerLocation: 'Port of Tokyo Customs (Japan)',
    warehouseLocation: 'Tokyo Customs Locker - Rack 99',
    oemNumber: 'AERO-GT3-CF-SPOILER',
    shippingBaseCost: 120.00,
    longCompatibleVehicles: ['Porsche 911 GT3 (991/992)', 'Porsche 911 Carrera GTS', 'Mercedes Benz AMG GT'],
    ratings: 4.9,
    availableStockStatus: 'Out of Stock',
    hasExpressShipping: false,
    notes: 'Engineered from dry autoclaved carbon fiber weave. Delivers 110kg of drag-balanced downforce.'
  },
  {
    sku: 'BRK-BREM-6P',
    name: 'Brembo GT Series 6-Piston Caliper Kit',
    vehicleCompat: 'BMW M2/M3/M4, Porsche 911, Audi S4',
    condition: 'Excellent Reclaimed',
    price: 1850.00,
    stock: 4,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
    interchangeId: 'BREM-6P-CALIPER-GT',
    category: 'Suspension & Brakes',
    dismantlerName: 'Apex Track Spares',
    dismantlerLocation: 'St. Johns Terminal (USA)',
    warehouseLocation: 'Chicago Hub - Bin 44-D',
    oemNumber: 'BREM-KIT-RED-6PIST',
    shippingBaseCost: 75.00,
    longCompatibleVehicles: ['BMW M2 Competition', 'BMW M3 Gran Coupe', 'Porsche 911 Carrera S', 'Audi S4 Avant'],
    ratings: 5.0,
    availableStockStatus: 'In Stock',
    hasExpressShipping: true,
    notes: 'Brembo original calipers repainted in Rosso Scuderia. Pistons rebuild finished on June 2026.'
  }
];

interface SparePartsSectionProps {
  onOpenVehicleChat?: (vin?: string) => void;
}

export default function SparePartsSection({ onOpenVehicleChat }: SparePartsSectionProps = {}) {
  // Shopping Cart State
  const [cart, setCart] = useState<Array<{ part: EnrichedPart; quantity: number }>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'idle' | 'checkout_form' | 'shipping' | 'escrow_lock' | 'success'>('idle');
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutEscrowConsent, setCheckoutEscrowConsent] = useState(true);
  const [checkoutLog, setCheckoutLog] = useState<string[]>([]);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<'air' | 'sea' | 'eco'>('air');
  const [shippingDestCountry, setShippingDestCountry] = useState('Rotterdam, Netherlands');

  // Dedicated checkout page custom flow states
  const [isOnDedicatedCheckoutPage, setIsOnDedicatedCheckoutPage] = useState(false);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'cod' | 'card'>('card');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutZip, setCheckoutZip] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [cardExpiryDate, setCardExpiryDate] = useState('');
  const [cardCvvCode, setCardCvvCode] = useState('');
  const [cardHolderName, setCardHolderName] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderPlacementProgress, setOrderPlacementProgress] = useState<string[]>([]);
  const [orderPlacementSuccess, setOrderPlacementSuccess] = useState(false);

  // Search and filter inputs
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [selectedShippingOption, setSelectedShippingOption] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(4000);

  // Real API Data
  const [parts, setParts] = useState<EnrichedPart[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Active features modals
  const [activeDismantlerChatPart, setActiveDismantlerChatPart] = useState<EnrichedPart | null>(null);
  const [dismantlerChatMessages, setDismantlerChatMessages] = useState<Array<{ sender: 'user' | 'dismantler'; text: string; time: string }>>([]);
  const [userChatMessage, setUserChatMessage] = useState('');
  const [isDismantlerTyping, setIsDismantlerTyping] = useState(false);
  const [selectedDetailPart, setSelectedDetailPart] = useState<EnrichedPart | null>(null);
  const [partToBuyWithConfig, setPartToBuyWithConfig] = useState<EnrichedPart | null>(null);
  const [popupShippingDest, setPopupShippingDest] = useState('Rotterdam, Netherlands');
  const [popupShippingMethod, setPopupShippingMethod] = useState<'air' | 'sea' | 'eco'>('air');

  // Compatibility Checker Tool State
  const [compatCheckVin, setCompatCheckVin] = useState('');
  const [compatCheckMake, setCompatCheckMake] = useState('Porsche');
  const [compatCheckModel, setCompatCheckModel] = useState('911 Carrera');
  const [compatCheckYear, setCompatCheckYear] = useState('2021');
  const [compatSelectedPartSku, setCompatSelectedPartSku] = useState(RICH_PARTS[0].sku);
  const [compatResult, setCompatResult] = useState<{ status: 'compatible' | 'incompatible' | 'checked-error' | null; explanation: string }>({ status: null, explanation: '' });
  const [isCheckingCompat, setIsCheckingCompat] = useState(false);

  // AI Assistant section state
  const [aiAssistantQuery, setAiAssistantQuery] = useState('');
  const [aiAssistantLogs, setAiAssistantLogs] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    { role: 'ai', text: "Hello! Enter any vehicle compatibility question. For example: 'Will the 6-piston Brembo calipers fit into a standard 2018 BMW 330i with 17-inch factory rims?'" }
  ]);
  const [isAiAnswering, setIsAiAnswering] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  // AI Image Scanner Simulation State
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [mediaDropzoneResult, setMediaDropzoneResult] = useState<string | null>(null);
  const [suggestedScanMatches, setSuggestedScanMatches] = useState<EnrichedPart[]>([]);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate Subtotals & Totals
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.part.price * item.quantity), 0);
  }, [cart]);

  const shippingCostRate = useMemo(() => {
    if (cart.length === 0) return 0;
    const baseSum = cart.reduce((sum, item) => sum + (item.part.shippingBaseCost * item.quantity), 0);
    if (selectedShippingMethod === 'sea') return baseSum * 0.5;
    if (selectedShippingMethod === 'eco') return baseSum * 0.8;
    return baseSum * 1.3; // premium express
  }, [cart, selectedShippingMethod]);

  const importDutiesRate = useMemo(() => {
    // Escrow custom freight simulation (e.g., 8.5% customs duty rate + 19% VAT rate on subtotal+shipping)
    if (cart.length === 0) return 0;
    const totalSubject = cartSubtotal + shippingCostRate;
    return Math.round(totalSubject * 0.12 * 100) / 100;
  }, [cartSubtotal, shippingCostRate]);

  const cartGrandTotal = useMemo(() => {
    return Math.round((cartSubtotal + shippingCostRate + importDutiesRate) * 100) / 100;
  }, [cartSubtotal, shippingCostRate, importDutiesRate]);

  // Calculations for popup estimator
  const popupFreightCharge = useMemo(() => {
    if (!partToBuyWithConfig) return 0;
    const baseSum = partToBuyWithConfig.shippingBaseCost;
    if (popupShippingMethod === 'sea') return baseSum * 0.5;
    if (popupShippingMethod === 'eco') return baseSum * 0.8;
    return baseSum * 1.3;
  }, [partToBuyWithConfig, popupShippingMethod]);

  const popupDutyAndVat = useMemo(() => {
    if (!partToBuyWithConfig) return 0;
    const subtotal = partToBuyWithConfig.price;
    const totalSubject = subtotal + popupFreightCharge;
    return Math.round(totalSubject * 0.12 * 100) / 100;
  }, [partToBuyWithConfig, popupFreightCharge]);

  const popupGrandTotal = useMemo(() => {
    if (!partToBuyWithConfig) return 0;
    return Math.round((partToBuyWithConfig.price + popupFreightCharge + popupDutyAndVat) * 100) / 100;
  }, [partToBuyWithConfig, popupFreightCharge, popupDutyAndVat]);

  const fetchParts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const query: any = {
        limit: 100,
        name: searchQuery || undefined,
        maxPrice: maxPrice || undefined,
        condition: selectedCondition !== 'All' ? selectedCondition.toUpperCase() : undefined,
      };

      const res = await api.get('/spare-parts', query);
      const mapped = res.map((p: any) => ({
        sku: p.id,
        name: p.name,
        vehicleCompat: p.compatibleVins && Array.isArray(p.compatibleVins) ? p.compatibleVins.join(', ') : 'Multiple Vehicles',
        condition: p.condition === 'NEW' ? 'Brand New' : p.condition === 'USED' ? 'Reclaimed' : 'OEM Certified Prep',
        price: p.price,
        stock: p.stock,
        image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800',
        interchangeId: p.oem || 'N/A',
        category: p.category || 'Engine & Exhaust',
        dismantlerName: p.business?.businessName || 'Elite Dismantlers',
        dismantlerLocation: p.business?.city || 'Vilnius',
        warehouseLocation: 'Central Depot',
        oemNumber: p.oem || 'N/A',
        shippingBaseCost: 50,
        longCompatibleVehicles: p.compatibleVins || [],
        ratings: 4.8,
        availableStockStatus: p.stock > 5 ? 'In Stock' : p.stock > 0 ? 'Low Stock' : 'Out of Stock',
        hasExpressShipping: true,
        notes: 'Genuine verified part from professional dismantler.'
      }));
      setParts(mapped);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch spare parts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [searchQuery, selectedCondition, maxPrice]);

  // FILTER OUT SPARE PARTS BY VALUES
  const finalFilteredParts = useMemo(() => {
    const sourceParts = parts.length > 0 ? parts : RICH_PARTS;
    return sourceParts.filter(p => {
      // Search constraints
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        const matchesOem = p.oemNumber.toLowerCase().includes(query);
        const matchesCompatHeader = p.vehicleCompat.toLowerCase().includes(query);
        const matchesDetailedCompat = p.longCompatibleVehicles.some(v => v.toLowerCase().includes(query));
        const matchesLoc = p.dismantlerLocation.toLowerCase().includes(query);
        const matchesInterchange = p.interchangeId.toLowerCase().includes(query);

        if (!matchesName && !matchesSku && !matchesOem && !matchesCompatHeader && !matchesDetailedCompat && !matchesLoc && !matchesInterchange) {
          return false;
        }
      }

      // Dropdown category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Condition filter
      if (selectedCondition !== 'All') {
        const conditionLower = p.condition.toLowerCase();
        if (selectedCondition === 'New' && !conditionLower.includes('new')) return false;
        if (selectedCondition === 'OEM' && !conditionLower.includes('oem')) return false;
        if (selectedCondition === 'Reclaimed' && !conditionLower.includes('reclaimed')) return false;
      }

      // Max price
      if (p.price > maxPrice) {
        return false;
      }

      // Shipping option
      if (selectedShippingOption !== 'All') {
        if (selectedShippingOption === 'Express' && !p.hasExpressShipping) return false;
        if (selectedShippingOption === 'Freight' && p.price < 500) return false; // heavy freight items
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedCondition, selectedShippingOption, maxPrice]);

  // Handle Cart updates
  const handleAddToCart = (p: EnrichedPart) => {
    if (p.stock === 0) {
      alert("This part item is currently out of stock. Contact the dismantler directly to request warehouse backorders.");
      return;
    }
    setCart(prev => {
      const idx = prev.findIndex(item => item.part.sku === p.sku);
      if (idx > -1) {
        const currentQty = prev[idx].quantity;
        if (currentQty >= p.stock) {
          alert(`You have added the maximum warehouse allocated stock (${p.stock}) for this part.`);
          return prev;
        }
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      } else {
        return [...prev, { part: p, quantity: 1 }];
      }
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (sku: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.part.sku !== sku));
    } else {
      setCart(prev => prev.map(item => {
        if (item.part.sku === sku) {
          const maxStock = item.part.stock;
          if (qty > maxStock) {
            alert(`Only ${maxStock} items available in physical warehouse.`);
            return { ...item, quantity: maxStock };
          }
          return { ...item, quantity: qty };
        }
        return item;
      }));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // Compatibility engine simulation
  const checkCompatibility = async () => {
    setIsCheckingCompat(true);
    setCompatResult({ status: null, explanation: '' });

    if (compatCheckVin.length >= 5) {
      try {
        const res = await api.get(`/spare-parts/compatible/${compatCheckVin}`);
        if (res && res.length > 0) {
          // If our current selected part is in the compatible list
          const isCompatible = res.some((p: any) => p.id === compatSelectedPartSku || p.oem === compatSelectedPartSku);
          if (isCompatible) {
            setCompatResult({
              status: 'compatible',
              explanation: `FITMENT CONFIRMED via VIN: Digital handshake verified for ${compatCheckVin}. This part is officially compatible with the target vehicle's chassis and wiring harness.`
            });
            setIsCheckingCompat(false);
            return;
          }
        }
      } catch (err) {
        console.error("VIN compatibility check failed, falling back to simulation", err);
      }
    }

    setTimeout(() => {
      const currentPart = RICH_PARTS.find(p => p.sku === compatSelectedPartSku);
      if (!currentPart) {
        setCompatResult({ status: 'checked-error', explanation: 'Part sku reference not found.' });
        setIsCheckingCompat(false);
        return;
      }

      const queryMake = compatCheckMake.trim().toLowerCase();
      const queryModel = compatCheckModel.trim().toLowerCase();
      
      // Calculate realistic compatibility logic
      const belongsToMake = currentPart.vehicleCompat.toLowerCase().includes(queryMake) || 
                            currentPart.longCompatibleVehicles.some(v => v.toLowerCase().includes(queryMake));
      const modelWordFound = currentPart.vehicleCompat.toLowerCase().includes(queryModel) || 
                             currentPart.longCompatibleVehicles.some(v => v.toLowerCase().includes(queryModel));

      if (belongsToMake && modelWordFound) {
        setCompatResult({
          status: 'compatible',
          explanation: `FITMENT CONFIRMED: Genuine OEM fitment parameters matching ${compatCheckYear} ${compatCheckMake} ${compatCheckModel}. Part interchange ID [${currentPart.interchangeId}] supports digital handshake and direct wire harness couplings without physical chassis modification.`
        });
      } else if (belongsToMake) {
        setCompatResult({
          status: 'incompatible',
          explanation: `PARTIAL REJECTION: Part is fabricated for the ${compatCheckMake} manufacturer but is NOT direct bolt-on compatible for the ${compatCheckModel} model specifically. Requires performance wiring bridge, modified wheel spline diameter, or physical mounting bracket adapter.`
        });
      } else {
        setCompatResult({
          status: 'incompatible',
          explanation: `COMPATIBILITY BLOCKED: The ${currentPart.name} was manufactured exclusively for technical tolerances of ${currentPart.vehicleCompat}. Mounting this on a ${compatCheckYear} ${compatCheckMake} ${compatCheckModel} represents risk profile level and fails structural inspection audits.`
        });
      }
      setIsCheckingCompat(false);
    }, 1200);
  };

  // AI Assistant Typing Simulator
  const handleSendAiAssistantQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiAssistantQuery.trim()) return;

    const userQ = aiAssistantQuery;
    setAiAssistantLogs(prev => [...prev, { role: 'user', text: userQ }]);
    setAiAssistantQuery('');
    setIsAiAnswering(true);

    setTimeout(() => {
      let response = '';
      const lowercaseQ = userQ.toLowerCase();

      if (lowercaseQ.includes('caliper') || lowercaseQ.includes('brembo') || lowercaseQ.includes('brake')) {
        response = `**Sovereign Fitment AI Audit:**\n\nThe **Brembo GT Series 6-Piston Caliper Kit (BRK-BREM-6P)** listed at Apex Track Spares has a caliper radial offset of 52mm. It is designed as a direct plug-and-play retrofit for performance vehicles with premium steering knuckles (such as the Porsche 911 Carrera S and BMW M-series hubs).\n\n* **Rim Diameter Requirement**: Fits wheels with 19-inch diameters or larger. Standard 17-inch factory wheels on a standard BMW 330i will cause rotor weight interference.\n* **Master Cylinder Pressure**: Requires standard dual-chamber pressure rating of 180 bar. Minor brake pedal sponge might occur unless system bleeding is conducted properly.`;
      } else if (lowercaseQ.includes('michelin') || lowercaseQ.includes('pilot sport') || lowercaseQ.includes('tyre') || lowercaseQ.includes('tire')) {
        response = `**Michelin Pilot Sport 4S Fitment Diagnostics:**\n\nThe **Michelin Pilot Sport 4S 245/40ZR18 (MP-4S-18245)** has a section width of 245mm and a 40% aspect ratio designed for 18-inch wheels.\n\n* **Chassis Stance**: Ideal for steering axles on high-performance sports cars. If mounting on Rear-Engine/AWD (like Porsche 911 Targa Carrera), ensure rear tyres fit a corresponding staggered 295/30ZR19 size or bigger to preserve electronic torque vector dynamics.\n* **Thread Wear Integrity**: Rated for 30,000 miles under normal driving, but track temperature parameters reduce duty cycles. Current warehouse rating is 100% Brand New.`;
      } else if (lowercaseQ.includes('ecu') || lowercaseQ.includes('bosch') || lowercaseQ.includes('electronics')) {
        response = `**Electronics Diagnostics - Bosch Master ECU:**\n\nThe **Porsche 992 Carrera Bosch Master ECU (ECU-P992-M)** has prebuild flash settings.\n\n* **Chassis Pairing Note**: Anti-theft immobilizers require a dual digital handshake on launch. It is pre-cleared of old vehicle registration files (Wiped to OEM Zero state), meaning any certified OBD-II performance shop can marry it directly to your VIN cluster.\n* **VAT Tariff Zone**: Sourced from Stuttgart Salvage Hamburg Airport depot. Subject to minimal VAT under EU export customs schemas.`;
      } else if (lowercaseQ.includes('engine') || lowercaseQ.includes('v8') || lowercaseQ.includes('block')) {
        response = `**Structural V8 Engine Spec Report:**\n\nThe **Sovereign Twin-Power V8 Sport Engine Block (BP-E8-V8350)** represents a cast-aluminum modular core.\n\n* **Customs / Escrow clearance**: Sourced directly from Berlin Core Depot. Due to its heavy cargo mass (185kg bare), it requires Sea Core Cargo container logistics or specialized cargo flight transit.\n* **Chassis Match**: Bolt pattern is highly compatible with AMG/S5/Porsche inline performance frames. Standard export rules require clean title de-registration verification to prevent duplicate VIN crime rings.`;
      } else {
        response = `**AI Automated Part Matcher:**\n\nI have parsed your query regarding: "${userQ}". Based on active Sovereign database records:\n\n1. **Core Database Matches**: Currently matching parts under 'Engine & Exhaust', 'Tyres & Wheels', and 'Electronics'.\n2. **Compliance Guideline**: Always double-check your target vehicle's factory OEM identification number. We recommend entering the VIN in our **Compatibility Checker** below for a direct mechanical handshake check.`;
      }

      setAiAssistantLogs(prev => [...prev, { role: 'ai', text: response }]);
      setIsAiAnswering(false);
    }, 1500);
  };

  // Dismantler Chat Simulator
  const handleOpenDismantlerChat = (part: EnrichedPart) => {
    setActiveDismantlerChatPart(part);
    setDismantlerChatMessages([
      { 
        sender: 'dismantler', 
        text: `Hello! I am the warehouse lead at ${part.dismantlerName} based in ${part.dismantlerLocation}. How can I assist you with the ${part.name} (SKU: ${part.sku})?`, 
        time: 'Active' 
      }
    ]);
  };

  const handleSendDismantlerMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatMessage.trim() || !activeDismantlerChatPart) return;

    const userText = userChatMessage;
    setDismantlerChatMessages(prev => [...prev, { sender: 'user', text: userText, time: '11:04 AM' }]);
    setUserChatMessage('');
    setIsDismantlerTyping(true);

    setTimeout(() => {
      let answer = '';
      const lower = userText.toLowerCase();

      if (lower.includes('price') || lower.includes('discount') || lower.includes('cheaper')) {
        answer = `We maintain structured pricing because our inventory has passed official Sovereign physical inspections, but if you complete payment through direct Escrow wire today, I can authorize a 5% discount or apply a waiver on cargo packaging fees.`;
      } else if (lower.includes('ship') || lower.includes('freight') || lower.includes('delivery')) {
        answer = `Yes, we arrange certified global transport! We handle custom paperwork immediately. For heavy parts like this, our dock coordinates are set to ship out of ${activeDismantlerChatPart.dismantlerLocation} twice a week. We can bundle the bill of lading with your purchase.`;
      } else if (lower.includes('warranty') || lower.includes('guarantee') || lower.includes('clear')) {
        answer = `We offer an industry-leading 180-day exchange warranty. Since this component has passed the AI digital stamp test and barcode matching, you have direct claim safety. If the master seal is not tampered with, standard returns are processed immediately.`;
      } else {
        answer = `Great question. The component is kept inside climate-controlled dry racks at our ${activeDismantlerChatPart.warehouseLocation} facility. It's packaged in a secure wooden crate with custom foam inserts. I am ready to hand it over to logistics as soon as Escrow signs off.`;
      }

      setDismantlerChatMessages(prev => [...prev, { sender: 'dismantler', text: answer, time: '11:05 AM' }]);
      setIsDismantlerTyping(false);
    }, 1200);
  };

  // AI Image Scanner simulator
  const handleSimulateScanImage = (imageType: 'wheel' | 'engine' | 'spoiler') => {
    setIsScanningImage(true);
    setMediaDropzoneResult(null);
    setSuggestedScanMatches([]);

    setTimeout(() => {
      let title = '';
      let matches: EnrichedPart[] = [];

      if (imageType === 'wheel') {
        title = "AI VISION DETECTION REPORT:\nPart Type: Track Rated Alloy Hub / Tire Compound\nIdentified Specs: 245/40 or 305/30ZR radial measurements\nConfidence Rating: 99.4%\nGSP Position: Dry thermal profile matches Pirelli and Michelin performance designs.";
        matches = [RICH_PARTS[0], RICH_PARTS[1]];
      } else if (imageType === 'engine') {
        title = "AI VISION DETECTION REPORT:\nPart Type: Lightweight Engine Cast Block\nMold Specification: V8 Twin-Scroll turbo ports with block compression tolerances\nConfidence Rating: 98.2%\nCondition Audit: Clean cylinder liners without stress fatigue.";
        matches = [RICH_PARTS[2]];
      } else {
        title = "AI VISION DETECTION REPORT:\nPart Type: Rear Aerodynamic Carbon Wing Deck\nFiber Weave Pitch: autoclaved tight-dry layout\nConfidence Rating: 97.5%\nCategory Match: Body panel aerodynamics components.";
        matches = [RICH_PARTS[4]];
      }

      setMediaDropzoneResult(title);
      setSuggestedScanMatches(matches);
      setIsScanningImage(false);

      // Auto filter category or name to reflect scan
      if (matches.length > 0) {
        setSelectedCategory(matches[0].category || 'All');
        setSearchQuery(matches[0].name.split(' ').slice(0, 2).join(' '));
      }
    }, 1800);
  };

  // Checkout process simulator logs
  const executeSecureEscrowCheckout = () => {
    setCheckoutStep('shipping');
    setCheckoutLog(['Initiating Secured Sovereign Escrow gateway...']);
    
    setTimeout(() => {
      setCheckoutStep('escrow_lock');
      setCheckoutLog(prev => [...prev, `Submitting bill of lading coordinates to customs authority...`, `Target port: ${shippingDestCountry}`, `Securing cargo transport rates (Carrier Code: ${selectedShippingMethod.toUpperCase()}-FREIGHT)`]);
      
      setTimeout(() => {
        setCheckoutLog(prev => [...prev, `LOCKING FUNDS: $${cartGrandTotal.toLocaleString()} USD held in escrow account state...`, `Generating customs duty certificates...`, `Notifying dismantlers for package handover...`]);
        
        setTimeout(() => {
          setCheckoutLog(prev => [...prev, `VERIFIED: Handshake successful! Escrow vault authenticated.`, `Shipment dispatch tracker #SOV-EP-${Math.floor(Math.random() * 800000 + 100000)} generated.`]);
          setCheckoutStep('success');
          setCart([]); // Reset cart upon success!
        }, 1500);
      }, 1500);
    }, 1500);
  };


  // Dedicated checkout page custom flow placement
  const submitDedicatedCheckout = () => {
    setIsPlacingOrder(true);
    setOrderPlacementProgress(['Contacting Sovereign Dispatch Node...']);
    
    setTimeout(() => {
      setOrderPlacementProgress(prev => [...prev, 'Validating port clearances & logistics coordinates...']);
      setTimeout(() => {
        if (checkoutPaymentMethod === 'card') {
          setOrderPlacementProgress(prev => [...prev, `Authorizing Credit Block (${cardHolderName || 'HOLDER'}) via secure Stripe gateway...`]);
          setTimeout(() => {
            setOrderPlacementProgress(prev => [...prev, 'Stripe secure validation accepted. Custodial account active...']);
          }, 800);
        } else {
          setOrderPlacementProgress(prev => [...prev, 'Configuring Cash on Delivery (COD) consignment guidelines...']);
        }
        
        setTimeout(() => {
          setOrderPlacementProgress(prev => [...prev, 'LOCKING FUNDS: Capital reserves held securely in sovereign escrow...']);
          setTimeout(() => {
            setOrderPlacementProgress(prev => [...prev, 'Success! Handing bill of lading package to our logistics dispatcher.']);
            setOrderPlacementSuccess(true);
            setIsPlacingOrder(false);
            setCart([]); // Clear cart upon success!
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };


  // Device image upload custom handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedImageSrc(dataUrl);
      
      setIsScanningImage(true);
      setMediaDropzoneResult(null);

      const nameLower = file.name.toLowerCase();
      let inferredPart = "High-Performance Mechanical Assembly";
      
      if (nameLower.includes('wheel') || nameLower.includes('rim') || nameLower.includes('tire') || nameLower.includes('alloy')) {
        inferredPart = "Forged Rim Wheel";
      } else if (nameLower.includes('brake') || nameLower.includes('caliper') || nameLower.includes('disc') || nameLower.includes('pad')) {
        inferredPart = "Brembo GT Series";
      } else if (nameLower.includes('spoiler') || nameLower.includes('wing') || nameLower.includes('carbon')) {
        inferredPart = "Carbon Fiber Aero Wing";
      } else if (nameLower.includes('ecu') || nameLower.includes('computer') || nameLower.includes('bosch')) {
        inferredPart = "Bosch DME Engine ECU";
      } else if (nameLower.includes('exhaust') || nameLower.includes('muffler')) {
        inferredPart = "Titanium Exhaust";
      }

      setTimeout(() => {
        setIsScanningImage(false);
        setMediaDropzoneResult(
          `• Filename: ${file.name}\n` +
          `• Detected Component: ${inferredPart}\n` +
          `• Match Confidence: 98.2%\n` +
          `• Status: Verified Premium Component`
        );
        
        // Auto-fill catalog search to match
        setSearchQuery(inferredPart);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const handleSmartUpload = (dataUrl: string, fileName: string) => {
    setUploadedFileName(fileName);
    setUploadedImageSrc(dataUrl);
    setIsScanningImage(true);
    setMediaDropzoneResult(null);

    const nameLower = fileName.toLowerCase();
    let inferredPart = "High-Performance Mechanical Assembly";
    
    if (nameLower.includes('wheel') || nameLower.includes('rim') || nameLower.includes('tire') || nameLower.includes('alloy')) {
      inferredPart = "Forged Rim Wheel";
    } else if (nameLower.includes('brake') || nameLower.includes('caliper') || nameLower.includes('disc') || nameLower.includes('pad')) {
      inferredPart = "Brembo GT Series";
    } else if (nameLower.includes('spoiler') || nameLower.includes('wing') || nameLower.includes('carbon')) {
      inferredPart = "Carbon Fiber Aero Wing";
    } else if (nameLower.includes('ecu') || nameLower.includes('computer') || nameLower.includes('bosch')) {
      inferredPart = "Bosch DME Engine ECU";
    } else if (nameLower.includes('exhaust') || nameLower.includes('muffler')) {
      inferredPart = "Titanium Exhaust";
    }

    setTimeout(() => {
      setIsScanningImage(false);
      setMediaDropzoneResult(
        `• Filename: ${fileName}\n` +
        `• Detected Component: ${inferredPart}\n` +
        `• Match Confidence: 98.2%\n` +
        `• Status: Verified Premium Component`
      );
      
      // Auto-fill catalog search to match
      setSearchQuery(inferredPart);
    }, 1500);
  };

  const handleClearUploadedImage = () => {
    setUploadedImageSrc(null);
    setUploadedFileName('');
    setMediaDropzoneResult(null);
    setSearchQuery('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  if (isOnDedicatedCheckoutPage) {
    return (
      <div className="space-y-6 py-6 text-zinc-900 font-sans max-w-5xl mx-auto" id="dedicated-checkout-viewport">
        
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-100">
          <div className="text-left">
            <button
              onClick={() => {
                setIsOnDedicatedCheckoutPage(false);
                setOrderPlacementSuccess(false);
                setOrderPlacementProgress([]);
              }}
              className="text-[10px] font-bold text-zinc-400 hover:text-red-650 transition-colors uppercase tracking-widest flex items-center gap-1.5 cursor-pointer pb-1.5"
            >
              ← Return to Parts Catalog
            </button>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 uppercase">
              Secure Checkout
            </h2>
          </div>
          
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 py-1 px-2.5 rounded-lg text-[10px] uppercase tracking-wide font-semibold text-zinc-650 self-start sm:self-center">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
            Secure Placement Active
          </div>
        </div>

        {orderPlacementSuccess ? (
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-10 max-w-md mx-auto text-center space-y-6 shadow-xs py-10"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100">
              <Check className="w-6 h-6 stroke-[2.5]" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-zinc-950 uppercase tracking-tight">Order Confirmed</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                Thank you. Your order has been registered securely. The dismantler will prepare your shipment shortly.
              </p>
            </div>

            <div className="bg-zinc-50 border border-zinc-250/50 p-4 rounded-xl text-left font-mono text-[10.5px] space-y-2 text-zinc-600">
              <div className="flex justify-between border-b border-zinc-150 pb-1.5">
                <span className="text-zinc-400">PAYMENT TYPE:</span>
                <span className="text-zinc-800 font-bold uppercase">{checkoutPaymentMethod === 'card' ? 'CREDIT CARD' : 'CASH ON DELIVERY'}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-150 pb-1.5">
                <span className="text-zinc-450">RECIPIENT:</span>
                <span className="text-zinc-850 font-bold">{checkoutName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-150 pb-1.5">
                <span className="text-zinc-455">DESTINATION:</span>
                <span className="text-zinc-855 font-bold">{shippingDestCountry}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-455">WAYBILL:</span>
                <span className="text-red-650 font-extrabold font-mono">#WP-{Math.floor(Math.random()*80000+10000)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsOnDedicatedCheckoutPage(false);
                setOrderPlacementSuccess(false);
                setOrderPlacementProgress([]);
              }}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-850 text-white rounded-xl text-xs uppercase font-bold tracking-wider transition-all cursor-pointer font-sans"
            >
              Return to Catalog
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left forms panel: User Info and Payment configurations */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Delivery coordinates section */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-100 pb-2.5">
                  1. Delivery Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wide block">Your Full Name</span>
                    <input
                      type="text"
                      value={checkoutName}
                      onChange={(e) => setCheckoutName(e.target.value)}
                      placeholder="e.g. Christian Klein"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 rounded-xl p-2.5 text-xs text-zinc-800 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wide block">Email Address</span>
                    <input
                      type="email"
                      value={checkoutEmail}
                      onChange={(e) => setCheckoutEmail(e.target.value)}
                      placeholder="e.g. christian@example.com"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 rounded-xl p-2.5 text-xs text-zinc-800 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-450 uppercase tracking-wide block">Phone Number</span>
                    <input
                      type="tel"
                      value={checkoutPhone}
                      onChange={(e) => setCheckoutPhone(e.target.value)}
                      placeholder="e.g. +31 10 400 2120"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 rounded-xl p-2.5 text-xs text-zinc-800 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-zinc-455 uppercase tracking-wide block">Postal Code / ZIP</span>
                    <input
                      type="text"
                      value={checkoutZip}
                      onChange={(e) => setCheckoutZip(e.target.value)}
                      placeholder="e.g. 3089 JK"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 rounded-xl p-2.5 text-xs text-zinc-800 transition-all outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <span className="text-[10px] font-bold text-zinc-455 uppercase tracking-wide block">Shipping Address</span>
                    <input
                      type="text"
                      value={checkoutAddress}
                      onChange={(e) => setCheckoutAddress(e.target.value)}
                      placeholder="Street, City, Province or Terminal details"
                      className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 rounded-xl p-2.5 text-xs text-zinc-800 transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Type system selections */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-2xs">
                <div>
                  <h3 className="text-xs font-bold text-zinc-950 uppercase tracking-wider border-b border-zinc-100 pb-2.5">
                    2. Payment Method
                  </h3>
                </div>

                {/* Segmented Payment Tabs */}
                <div className="grid grid-cols-2 gap-2 bg-zinc-50 p-1 rounded-xl border border-zinc-200/60">
                  <button
                    type="button"
                    onClick={() => setCheckoutPaymentMethod('card')}
                    className={`py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      checkoutPaymentMethod === 'card'
                        ? 'bg-white text-zinc-900 shadow-xs border border-zinc-200/80 font-semibold'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutPaymentMethod('cod')}
                    className={`py-2 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      checkoutPaymentMethod === 'cod'
                        ? 'bg-white text-zinc-050 shadow-xs border border-zinc-200/80 font-semibold'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    Cash on Delivery
                  </button>
                </div>

                {checkoutPaymentMethod === 'card' ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Compact Card inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-left">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-455 uppercase tracking-wide block">Cardholder Name</span>
                        <input
                          type="text"
                          value={cardHolderName}
                          onChange={(e) => setCardHolderName(e.target.value)}
                          placeholder="CHRISTIAN KLEIN"
                          className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 rounded-xl p-2.5 text-xs text-zinc-800 transition-all outline-none uppercase font-semibold"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-455 uppercase tracking-wide block">Card Number</span>
                        <input
                          type="text"
                          maxLength={19}
                          value={cardNo}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\s?/g, '').replace(/[^0-9]/g, '');
                            if (val.length > 16) val = val.slice(0, 16);
                            let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                            setCardNo(formatted);
                          }}
                          placeholder="4111 2222 3333 4444"
                          className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 rounded-xl p-2.5 text-xs text-zinc-800 transition-all outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-455 uppercase tracking-wide block">Expiration Date (MM/YY)</span>
                        <input
                          type="text"
                          maxLength={5}
                          value={cardExpiryDate}
                          onChange={(e) => {
                            let val = e.target.value.replace(/[^0-9]/g, '');
                            if (val.length > 4) val = val.slice(0, 4);
                            if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                            setCardExpiryDate(val);
                          }}
                          placeholder="09/27"
                          className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 rounded-xl p-2.5 text-xs text-zinc-800 transition-all outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-zinc-455 uppercase tracking-wide block">CVV/CVC Code</span>
                        <input
                          type="password"
                          maxLength={3}
                          value={cardCvvCode}
                          onChange={(e) => setCardCvvCode(e.target.value.replace(/[^0-9]/g, ''))}
                          placeholder="123"
                          className="w-full bg-zinc-50 border border-zinc-200 focus:bg-white focus:border-zinc-400 rounded-xl p-2.5 text-xs text-zinc-800 transition-all outline-none font-mono"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-left"
                  >
                    <div className="flex gap-2.5 text-zinc-650">
                      <Landmark className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-xs font-bold text-zinc-900 uppercase">Pay Cash on Delivery</span>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                          Prepare the cash amount of <strong className="text-red-650 font-black">${cartGrandTotal.toLocaleString()}</strong> to hand over to the delivery agent at your terminal port on delivery.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right side panel: Selections Breakdown & Placement validation */}
            <div className="lg:col-span-5 space-y-5 text-left">
              
              {/* Items Selected breakdown */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 space-y-4 shadow-2xs">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-150 pb-2.5 block">
                  Items in Basket
                </h3>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                  {cart.length === 0 ? (
                    <p className="text-xs text-zinc-400">Empty basket. Return to catalog to select parts.</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.part.sku} className="flex gap-2.5 p-2 bg-zinc-50/50 border border-zinc-200 rounded-xl relative select-none">
                        <img 
                          src={item.part.image} 
                          alt={item.part.name} 
                          className="w-10 h-10 object-cover rounded-lg shrink-0 border border-zinc-200"
                        />
                        <div className="min-w-0 flex-1 space-y-0.5 text-left text-xs font-sans">
                          <h5 className="font-bold text-zinc-800 uppercase tracking-tight line-clamp-1 pr-6">{item.part.name}</h5>
                          <div className="flex justify-between items-center text-[10px] text-zinc-400 pt-0.5">
                            <span>SKU: {item.part.sku} ({item.quantity} qty)</span>
                            <span className="text-red-650 font-bold">${(item.part.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Logistics Freight Breakdown */}
                <div className="bg-zinc-50/60 p-4 border border-zinc-150 rounded-xl space-y-2 text-xs font-sans text-zinc-650">
                  <div className="flex justify-between">
                    <span>Shipping Route:</span>
                    <span className="text-zinc-800 font-bold uppercase">{selectedShippingMethod} Cargo</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Port of Destination:</span>
                    <span className="text-zinc-800 font-bold">{shippingDestCountry}</span>
                  </div>
                  
                  <div className="border-t border-zinc-200 pt-2.5 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-zinc-600">
                      <span>Parts Subtotal:</span>
                      <span className="text-zinc-900 font-semibold">${cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Shipping &amp; Handling:</span>
                      <span className="text-zinc-900 font-semibold">${shippingCostRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Taxes &amp; Duties (VAT):</span>
                      <span className="text-zinc-900 font-semibold">${importDutiesRate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-zinc-950 border-t border-zinc-200/60 pt-2">
                       <span className="uppercase text-[9px] font-black text-zinc-450">Grand Total</span>
                       <span className="text-red-650 text-[14px] font-black">${cartGrandTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Pristine Simple Loading State */}
                {isPlacingOrder ? (
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-150 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-800">
                      <span className="uppercase tracking-wider">Securing Transaction...</span>
                      <RefreshCcw className="w-3.5 h-3.5 animate-spin text-red-650" />
                    </div>
                    <div className="w-full bg-zinc-150 h-1 rounded-full overflow-hidden">
                      <div className="bg-red-650 h-full animate-pulse" style={{ width: '65%' }}></div>
                    </div>
                    <p className="text-[11px] text-zinc-500 font-medium italic animate-pulse text-center">
                      {orderPlacementProgress[orderPlacementProgress.length - 1]}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      disabled={
                        !checkoutName.trim() || 
                        !checkoutEmail.trim() || 
                        !checkoutPhone.trim() || 
                        !checkoutZip.trim() || 
                        !checkoutAddress.trim() ||
                        (checkoutPaymentMethod === 'card' && (!cardHolderName.trim() || !cardNo.trim() || cardCvvCode.length < 3)) ||
                        cart.length === 0
                      }
                      onClick={submitDedicatedCheckout}
                      className="w-full py-3 bg-red-600 hover:bg-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-400 disabled:opacity-40 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-xs text-center"
                    >
                      Place Secure Order
                    </button>
                    <p className="text-[9.5px] text-zinc-400 text-center leading-normal">
                      Guaranteed secure escrow holds. Funds are held safely under escrow protection policy.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    );
  }


  return (
    <div className="space-y-12 py-4 text-zinc-900 font-sans" id="spare-parts-integrated-division">
      
      {/* Elegantly Designed Minimalist Header & Basket Bar (Flat, borderless) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-zinc-100">
        
        <div className="space-y-1 text-left">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight font-sans uppercase">
            Spare Parts &amp; Dismantler Hub
          </h2>
        </div>
 
        {/* Dynamic Cart Bubble panel right - Flat and clean */}
        <div className="shrink-0 w-full md:w-auto flex items-center justify-between md:justify-end gap-8">
          <div className="text-left">
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Escrow Basket</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-zinc-900 tracking-tight">${cartSubtotal.toLocaleString()}</span>
              <span className="text-xs text-zinc-400 font-medium font-sans">({cart.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
            </div>
          </div>
 
          <button
            onClick={() => setIsCartOpen(true)}
            className="px-6 py-2.5 bg-red-600 hover:bg-zinc-900 text-white rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer"
            id="checkout-cart-action-btn"
          >
            Checkout
          </button>
        </div>
      </div>
 
      {selectedDetailPart ? (
        // STUNNING MINIMALIST PRODUCT DETAIL VIEW: Clean Flat Aesthetics
        <div className="bg-white py-4 space-y-10 text-left relative" id="part-detail-view-container">
          {/* Back to Catalogue */}
          <div className="flex justify-between items-center pb-5 border-b border-zinc-100">
            <button
              onClick={() => setSelectedDetailPart(null)}
              className="text-zinc-500 hover:text-red-650 font-bold text-xs transition-colors cursor-pointer"
            >
              ← Back to Catalogue
            </button>
            <span className="text-[11px] text-zinc-400 font-mono tracking-wider uppercase">
              SKU: {selectedDetailPart.sku}
            </span>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side: Beautiful image */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-zinc-50 rounded-xl overflow-hidden aspect-square relative">
                <img
                  src={selectedDetailPart.image}
                  alt={selectedDetailPart.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
  
              {/* Secure verification block - Flat */}
              <div className="pt-4 text-left">
                <span className="text-xs font-bold text-zinc-900 block uppercase tracking-widest mb-1.5">Sovereign Fitment Certified</span>
                <p className="text-xs text-zinc-500 leading-relaxed font-sans">
                  This component undergoes rigorous ultrasonic structural testing, electronic system diagnostics, and verified compliance with EU/Global transport standards.
                </p>
              </div>
            </div>
  
            {/* Right side: Detailed information list */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* Name & price tag */}
              <div className="space-y-4">
                <span className="text-zinc-400 text-[10px] uppercase font-bold tracking-widest block">
                  {selectedDetailPart.category}
                </span>
                <h1 className="text-xl md:text-3xl font-extrabold text-zinc-900 tracking-tight leading-none">
                  {selectedDetailPart.name}
                </h1>
                
                <div className="flex items-baseline gap-2.5 pt-2">
                  <span className="text-2xl md:text-3xl font-extrabold text-zinc-900 font-sans tracking-tight">
                    ${selectedDetailPart.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-zinc-400 font-medium font-sans">Sovereign Logistics Escrow Custody Price</span>
                </div>
              </div>
  
              {/* Main notes description */}
              <div className="space-y-1.5 py-4 border-t border-b border-zinc-100">
                <span className="text-[9px] font-bold tracking-widest text-zinc-400 block uppercase">Dismantler Report Notes</span>
                <p className="text-xs text-zinc-650 leading-relaxed font-sans">
                  {selectedDetailPart.notes}
                </p>
              </div>
  
              {/* Interactive Actions - Solid Red Default and hover transitions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                <button
                  onClick={() => {
                    if (onOpenVehicleChat) {
                      onOpenVehicleChat();
                    } else {
                      handleOpenDismantlerChat(selectedDetailPart);
                    }
                  }}
                  className="w-full bg-red-600 hover:bg-zinc-950 text-white font-bold tracking-wider uppercase transition-all duration-300 py-3.5 rounded-xl text-xs cursor-pointer"
                >
                  Message Dismantler Team
                </button>
                
                <button
                  onClick={() => {
                    setPartToBuyWithConfig(selectedDetailPart);
                    setPopupShippingDest(shippingDestCountry);
                    setPopupShippingMethod(selectedShippingMethod);
                  }}
                  className="w-full bg-red-600 hover:bg-zinc-950 text-white font-bold tracking-wider uppercase transition-all duration-300 py-3.5 rounded-xl text-xs cursor-pointer"
                >
                  Add Item to Cart
                </button>
              </div>
  
              {/* Technical Specifications - Flat, borderless list */}
              <div className="space-y-4 pt-4">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-800 block">
                  Technical Assembly Profile
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs font-sans">
                  <div className="py-2.5 border-b border-zinc-100 flex justify-between items-baseline">
                    <span className="text-zinc-400 uppercase tracking-wider font-semibold">OEM Number</span>
                    <strong className="text-zinc-900 font-medium">{selectedDetailPart.oemNumber}</strong>
                  </div>
                  <div className="py-2.5 border-b border-zinc-100 flex justify-between items-baseline">
                    <span className="text-zinc-400 uppercase tracking-wider font-semibold">Interchange Code</span>
                    <strong className="text-zinc-900 font-medium">{selectedDetailPart.interchangeId}</strong>
                  </div>
                  <div className="py-2.5 border-b border-zinc-100 flex justify-between items-baseline">
                    <span className="text-zinc-400 uppercase tracking-wider font-semibold">Wear Condition</span>
                    <strong className="text-zinc-900 font-medium">{selectedDetailPart.condition}</strong>
                  </div>
                  <div className="py-2.5 border-b border-zinc-100 flex justify-between items-baseline">
                    <span className="text-zinc-400 uppercase tracking-wider font-semibold">Rack Location</span>
                    <strong className="text-zinc-900 font-medium font-mono">{selectedDetailPart.warehouseLocation}</strong>
                  </div>
                  <div className="py-2.5 border-b border-zinc-100 flex justify-between col-span-1 md:col-span-2">
                    <span className="text-zinc-400 uppercase tracking-wider font-semibold font-sans">Facility Country</span>
                    <strong className="text-zinc-900 font-medium">{selectedDetailPart.dismantlerName} ({selectedDetailPart.dismantlerLocation})</strong>
                  </div>
                </div>
              </div>
  
              {/* Vehicle Fitment Stance */}
              <div className="space-y-3 pt-4">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-800 block">
                  Verified Chassis Layout Compatibility
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedDetailPart.longCompatibleVehicles.map((vehicle, i) => (
                    <span
                      key={i}
                      className="bg-zinc-55 text-zinc-700 text-[11px] font-bold px-3 py-1.5 rounded-full border border-zinc-200 flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></span>
                      {vehicle}
                    </span>
                  ))}
                </div>
              </div>
  
            </div>
  
          </div>
        </div>
      ) : (
        <div className="space-y-6" id="spare-parts-main-scoller-box">
          {/* TOP CONTROLS GRID: COMPATIBILITY CHECKER & NEURAL ANALYZER - Flat, borderless */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch" id="spare-parts-top-controls-grid">
            
            {/* LEFT SIDE: FITMENT VERIFICATION & CATALOG SEARCH (8 cols) */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="bg-white p-2 space-y-6 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="pb-3 border-b border-zinc-100 mb-6 font-sans">
                    <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                      Fitment Verification &amp; Catalog Search
                    </h3>
                  </div>
                  
                  <div className="space-y-6">
                    {/* GLOBAL SEARCH INPUT ELEMENT */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search premium catalog (engine components, chassis units, body mounts...)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 focus:border-red-650 text-xs outline-none px-4 py-3 rounded-xl text-zinc-900 placeholder-zinc-400 transition-all font-sans focus:bg-white"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-red-650"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    
                    {/* Filter fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left font-sans">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Vehicle Make</label>
                        <select
                          value={compatCheckMake}
                          onChange={(e) => setCompatCheckMake(e.target.value)}
                          className="w-full bg-zinc-55 border border-zinc-250 px-3 py-2 text-xs rounded-xl focus:border-zinc-500 outline-none cursor-pointer transition-all focus:bg-white"
                        >
                          <option value="Porsche">Porsche</option>
                          <option value="BMW">BMW</option>
                          <option value="Audi">Audi</option>
                          <option value="Mercedes-Benz">Mercedes-Benz</option>
                          <option value="Ferrari">Ferrari</option>
                        </select>
                      </div>
  
                      <div className="space-y-1.5 text-left font-sans">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Year / Generation</label>
                        <input
                          type="text"
                          value={compatCheckYear}
                          onChange={(e) => setCompatCheckYear(e.target.value)}
                          className="w-full bg-zinc-55 border border-zinc-250 px-3 py-2 text-xs rounded-xl focus:border-zinc-500 outline-none transition-all focus:bg-white"
                          placeholder="e.g. 2021"
                        />
                      </div>
  
                      <div className="space-y-1.5 text-left font-sans">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Specific Model</label>
                        <input
                          type="text"
                          value={compatCheckModel}
                          onChange={(e) => setCompatCheckModel(e.target.value)}
                          className="w-full bg-zinc-55 border border-zinc-250 px-3 py-2 text-xs rounded-xl focus:border-zinc-500 outline-none transition-all focus:bg-white"
                          placeholder="e.g. 911 Turbo S"
                        />
                      </div>
  
                      <div className="space-y-1.5 text-left font-sans">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Target Component</label>
                        <select
                          value={compatSelectedPartSku}
                          onChange={(e) => setCompatSelectedPartSku(e.target.value)}
                          className="w-full bg-zinc-55 border border-zinc-250 px-3 py-2 text-xs rounded-xl focus:border-zinc-500 outline-none cursor-pointer transition-all focus:bg-white"
                        >
                          {RICH_PARTS.map(p => (
                            <option key={p.sku} value={p.sku}>{p.name} (${p.price})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div className="space-y-4 pt-6">
                  <button
                    onClick={checkCompatibility}
                    disabled={isCheckingCompat}
                    className="w-full py-3.5 bg-red-600 hover:bg-zinc-950 text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all duration-300 disabled:opacity-50 text-center"
                  >
                    {isCheckingCompat ? "Verifying Compatibility..." : "Execute Fitment Verification"}
                  </button>
  
                  {/* Compatibility Result Board Container */}
                  {compatResult.status && (
                    <div className={`p-4 rounded-xl border text-[11px] leading-relaxed transition-all text-left font-sans ${
                      compatResult.status === 'compatible' 
                        ? 'bg-emerald-50/55 border-emerald-200 text-emerald-950' 
                        : 'bg-amber-50/55 border-amber-200 text-amber-950'
                    }`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider mb-1">
                        {compatResult.status === 'compatible' ? "Fitment Authorized" : "Fitment Warning Logs"}
                      </div>
                      <p className="font-sans font-medium text-xs leading-relaxed">{compatResult.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
  
            {/* RIGHT SIDE: NEURAL PART ANALYZER (4 cols) */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="bg-white p-2 space-y-6 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="pb-3 border-b border-zinc-100 mb-6 font-sans">
                    <h3 className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">
                      Neural Part Analyzer
                    </h3>
                                <UniversalSmartUpload
                    photoKey="parts_analyzer"
                    uploadedImageSrc={uploadedImageSrc}
                    onUploadSuccess={handleSmartUpload}
                    onClear={handleClearUploadedImage}
                    label="Neural Part Analyzer"
                    description="Take a live photo of any engine or chassis component."
                  />          </div>
                </div>
  
                {/* Vision Engine Output */}
                {mediaDropzoneResult && (
                  <div className="p-4 bg-zinc-50/50 border border-zinc-150 rounded-xl space-y-2.5 mt-4 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[9.5px] uppercase font-bold text-zinc-500 tracking-wider font-sans">
                        Neural Diagnostics Output
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Analyzed
                      </span>
                    </div>
                    <pre className="text-[10px] text-zinc-700 leading-relaxed font-mono whitespace-pre-wrap p-3 bg-white border border-zinc-200/80 rounded-lg">
                      {mediaDropzoneResult}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SPARE PARTS CATALOG RESULTS GRID PANEL - Full width 12 cols wide, 3 columns grid */}
          <div className="space-y-4 pt-2">
            
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                Available Spare Parts
              </span>
            </div>

            {finalFilteredParts.length === 0 ? (
              <div className="p-8 border border-dashed border-zinc-200 rounded-[20px] text-center bg-zinc-50/50 text-zinc-500 space-y-2">
                <AlertCircle className="w-6 h-6 text-zinc-400 mx-auto" />
                <h4 className="text-xs font-semibold text-zinc-700">No Components Found</h4>
                <p className="text-[10px] max-w-sm mx-auto leading-normal">
                  Refine your query or upload an assembly image above to perform deep vision parsing.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {finalFilteredParts.map(part => {
                  return (
                    <div 
                      key={part.sku} 
                      className="bg-white border border-zinc-200/80 rounded-[20px] overflow-hidden hover:shadow-lg transition-all duration-350 ease-out flex flex-col justify-between"
                      id={`part-card-${part.sku}`}
                    >
                      {/* Compact Image Header with interactive view trigger */}
                      <div 
                        className="relative h-32 bg-zinc-50 shrink-0 overflow-hidden cursor-pointer group"
                        onClick={() => setSelectedDetailPart(part)}
                      >
                        <img 
                          src={part.image} 
                          alt={part.name} 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500 ease-out"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-3xs">
                          <span className="bg-white text-zinc-900 text-[10px] px-3 py-1.5 rounded-full shadow-md font-bold flex items-center gap-1">
                            <Eye className="w-3 h-3 text-zinc-900" /> View Details
                          </span>
                        </div>
                      </div>

                      {/* Content stats - Compact style */}
                      <div className="p-4 space-y-4 text-left flex-1 flex flex-col justify-between">
                        
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-start gap-2">
                            <h4 
                              onClick={() => setSelectedDetailPart(part)}
                              className="text-[12.5px] font-bold text-zinc-900 leading-snug hover:text-zinc-650 transition-colors line-clamp-2 cursor-pointer font-sans"
                            >
                              {part.name}
                            </h4>
                            <span className="text-xs font-black text-zinc-905 shrink-0">
                              ${part.price.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-mono tracking-wider uppercase">
                            <span>SKU: {part.sku}</span>
                            <span>•</span>
                            <span>{part.category}</span>
                          </div>
                        </div>

                        {/* Bottom action controls */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <button
                            onClick={() => {
                              if (onOpenVehicleChat) {
                                onOpenVehicleChat();
                              } else {
                                handleOpenDismantlerChat(part);
                              }
                            }}
                            className="bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200/80 transition-all duration-200 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-97"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-zinc-600" /> Chat
                          </button>
                          
                          <button
                            onClick={() => {
                              setPartToBuyWithConfig(part);
                              setPopupShippingDest(shippingDestCountry);
                              setPopupShippingMethod(selectedShippingMethod);
                            }}
                            className="bg-red-650 hover:bg-zinc-800 text-white transition-all duration-200 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-97"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" /> Buy Item
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}


      {/* DISMANTLER REPS INTERACTIVE CHAT DRAWER */}
      <AnimatePresence>
        {activeDismantlerChatPart && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl text-left"
            >
              
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <MessageCircle className="w-4.5 h-4.5 text-[#8B0000]" /> {activeDismantlerChatPart.dismantlerName}
                  </h4>
                </div>

                <button
                  onClick={() => setActiveDismantlerChatPart(null)}
                  className="p-1 px-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat log displays */}
              <div className="max-h-[220px] overflow-y-auto p-4 bg-slate-50 rounded-xl space-y-4 font-mono text-xs border border-slate-200 text-left">
                {dismantlerChatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-lg max-w-[85%] leading-relaxed shadow-xs ${
                      msg.sender === 'user' 
                        ? 'bg-[#8B0000]/5 text-slate-850 border border-[#8B0000]/15' 
                        : 'bg-white text-slate-820 border border-slate-200'
                    }`}>
                      <p className="font-sans font-medium text-[11px] leading-relaxed select-text">{msg.text}</p>
                      <span className="text-[8px] text-slate-400 block text-right mt-1 font-mono uppercase">{msg.time}</span>
                    </div>
                  </div>
                ))}

                {isDismantlerTyping && (
                  <div className="flex justify-start">
                    <div className="p-2 px-3 bg-white border border-slate-200 rounded-lg text-slate-500 text-[10px] animate-pulse">
                      Warehouse team looking up inventory location...
                    </div>
                  </div>
                )}
              </div>

              {/* Prebuilt question options */}
              <div className="space-y-1.5 mt-1">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase font-mono block">Suggested Questions:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => setUserChatMessage("Do we get the official customs and de-registration papers?")}
                    className="text-[9.5px] bg-white hover:bg-slate-50 hover:border-[#8B0000]/30 p-1 px-2.5 rounded border border-slate-200 text-slate-600 font-mono transition-all cursor-pointer"
                  >
                    Customs papers?
                  </button>
                  <button
                    onClick={() => setUserChatMessage("Can you guarantee 100% no shipping stress cracks?")}
                    className="text-[9.5px] bg-white hover:bg-slate-50 hover:border-[#8B0000]/30 p-1 px-2.5 rounded border border-slate-200 text-slate-600 font-mono transition-all cursor-pointer"
                  >
                    Stress cracks audit?
                  </button>
                  <button
                    onClick={() => setUserChatMessage("What is the lead time for express harbor loading?")}
                    className="text-[9.5px] bg-white hover:bg-slate-50 hover:border-[#8B0000]/30 p-1 px-2.5 rounded border border-slate-200 text-slate-600 font-mono transition-all cursor-pointer"
                  >
                    Harbor lead time?
                  </button>
                </div>
              </div>

              {/* Input section */}
              <form onSubmit={handleSendDismantlerMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask the dismantler direct warehouse questions..."
                  value={userChatMessage}
                  onChange={(e) => setUserChatMessage(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#8B0000] outline-none rounded-xl p-2.5 text-xs text-slate-800 font-mono transition-all"
                />
                <button
                  type="submit"
                  disabled={isDismantlerTyping || !userChatMessage.trim()}
                  className="bg-red-600 hover:bg-zinc-800 text-white rounded-xl px-5 text-xs font-bold font-mono transition-all uppercase cursor-pointer"
                >
                  Ask
                </button>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ESCROW TRANSACT SHOPPING CART DRAWER PANEL (Right-side Overlapping with Dynamic Height and Blurred Backdrop) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Dark blurred Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-zinc-950/40 backdrop-blur-[2px] z-[240] cursor-pointer"
            />

            {/* Overlapping slide-out Panel - Dynamic fit height */}
            <motion.div
              initial={{ x: '120%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '120%', opacity: 0.8 }}
              transition={{ type: 'spring', damping: 26, stiffness: 210 }}
              className="fixed top-20 bottom-4 right-4 w-[460px] max-w-[calc(100vw-2.5rem)] bg-white border border-zinc-200/80 rounded-2xl z-[250] shadow-2xl p-5 flex flex-col text-left h-fit max-h-[calc(100vh-110px)] overflow-hidden"
            >
              
              <div className="space-y-4 overflow-y-auto pr-0.5 max-h-[calc(100vh-240px)] flex-1 scrollbar-thin">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-zinc-150 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <ShoppingCart className="w-4.5 h-4.5 text-red-650" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-zinc-950 tracking-wide font-sans uppercase">
                        Sovereign Escrow Basket
                      </h3>
                      <p className="text-[10px] text-zinc-500 font-sans">
                        {cart.reduce((sum, item) => sum + item.quantity, 0)} performance items selected
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 px-2.5 text-zinc-400 hover:text-zinc-800 bg-zinc-50 hover:bg-zinc-100 transition-all rounded-lg cursor-pointer text-xs"
                  >
                    Close ✕
                  </button>
                </div>

                {/* Cart Items list */}
                {cart.length === 0 ? (
                  <div className="py-12 px-4 text-center text-zinc-400 space-y-3">
                     <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto">
                       <Package className="w-6 h-6 text-zinc-300" />
                     </div>
                     <div>
                       <span className="block font-bold text-zinc-400 font-sans text-[10px] uppercase tracking-wider">Vacant Basket</span>
                       <p className="text-[11px] text-zinc-500 max-w-xs mx-auto mt-1 leading-relaxed">
                         Select high-performance dismantled parts from the catalog to configure secure checkout escrow parameters.
                       </p>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.part.sku} className="p-3 bg-zinc-50 border border-zinc-200/50 rounded-xl flex gap-3 relative hover:bg-zinc-50/80 transition-colors">
                        <img 
                          src={item.part.image} 
                          alt={item.part.name} 
                          className="w-12 h-12 object-cover rounded-lg shrink-0 border border-zinc-200 bg-white" 
                          referrerPolicy="no-referrer"
                        />
                        
                        <div className="flex-1 min-w-0 space-y-1 text-left">
                          <div className="flex justify-between items-start">
                            <h5 className="text-[11px] font-bold text-zinc-800 uppercase tracking-tight pr-6 leading-tight line-clamp-1">
                              {item.part.name}
                            </h5>
                            <button
                              onClick={() => handleUpdateQuantity(item.part.sku, 0)}
                              className="text-zinc-400 hover:text-red-650 p-1.5 absolute top-1 right-1 transition-colors cursor-pointer"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex justify-between items-center text-[10px] text-zinc-550">
                            <span>SKU: {item.part.sku}</span>
                            <span className="bg-zinc-200/50 text-zinc-700 px-1.5 py-0.5 rounded text-[9px] font-semibold">{item.part.condition}</span>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-zinc-200/30">
                            <span className="text-[12px] font-bold text-red-650">
                              ${(item.part.price * item.quantity).toLocaleString()}
                            </span>
                            
                            <div className="flex items-center gap-1 border border-zinc-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                              <button
                                onClick={() => handleUpdateQuantity(item.part.sku, item.quantity - 1)}
                                className="px-2 py-0.5 text-zinc-500 hover:text-zinc-900 transition-colors text-[11px] font-bold"
                              >
                                -
                              </button>
                              <span className="text-[11px] font-bold text-zinc-900 px-1">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity(item.part.sku, item.quantity + 1)}
                                className="px-2 py-0.5 text-zinc-500 hover:text-zinc-900 transition-colors text-[11px] font-bold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Financial calculations and Shipping Estimator */}
                {cart.length > 0 && (
                  <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-3.5 space-y-2.5 text-xs text-zinc-650">
                    {/* Port & transport method readouts */}
                    <div className="border-b border-zinc-150 pb-2 space-y-1 text-left">
                      <div className="flex justify-between items-center text-zinc-700">
                        <span className="text-[9px] font-bold tracking-wider text-zinc-400 block uppercase font-sans">DELIVERY TARGET PORT</span>
                        <span className="font-semibold text-zinc-850 font-sans text-[11px]">{shippingDestCountry}</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-700">
                        <span className="text-[9px] font-bold tracking-wider text-zinc-400 block uppercase font-sans">CARGO TRANSPORT</span>
                        <span className="font-bold text-red-650 font-sans uppercase text-[11px]">{selectedShippingMethod} Category</span>
                      </div>
                    </div>

                    {/* Invoice totals */}
                    <div className="space-y-1.5 text-[11px] text-zinc-600 text-left">
                      <div className="flex justify-between">
                        <span>Parts Subtotal:</span>
                        <span className="text-zinc-900 font-bold">${cartSubtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Freight Logistics Rate:</span>
                        <span className="text-zinc-900 font-semibold">${shippingCostRate.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-1">
                        <span>Customs Regulatory VAT:</span>
                        <span className="text-zinc-905 font-semibold">${importDutiesRate.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold text-zinc-900 border-t border-zinc-200/80 pt-2 text-sm">
                        <span className="uppercase text-[9px] font-extrabold text-zinc-400 font-sans tracking-wide">Secure Escrow Total</span>
                        <span className="text-red-650 font-extrabold">${cartGrandTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions and Controls - Positions directly beneath content dynamically, preventing separation gaps */}
              <div className="border-t border-zinc-100 pt-4 mt-2 space-y-2 text-left">
                {cart.length > 0 && (
                  <button
                    onClick={() => {
                      setIsOnDedicatedCheckoutPage(true);
                      setIsCartOpen(false);
                      // Prepopulate default details if empty
                      if (!checkoutName) setCheckoutName('Christian Klein');
                      if (!checkoutEmail) setCheckoutEmail('cointalktable@gmail.com');
                      if (!checkoutAddress) setCheckoutAddress('Eemhavenweg 50, Rotterdam Port');
                      if (!checkoutPhone) setCheckoutPhone('+31 10 400 2120');
                      if (!checkoutZip) setCheckoutZip('3089 JK');
                    }}
                    className="w-full py-3 bg-red-600 hover:bg-zinc-850 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all active:scale-97 cursor-pointer block text-center shadow-md font-sans"
                  >
                    Proceed to Dedicated Checkout Page
                  </button>
                )}

                <div className="flex justify-between gap-4">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold uppercase transition-colors text-center cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                  {cart.length > 0 && (
                    <button
                      onClick={() => {
                        setCart([]);
                        setIsCartOpen(false);
                      }}
                      className="text-center text-[10px] font-sans font-semibold text-zinc-400 hover:text-red-650 transition-colors py-1 cursor-pointer underline flex items-center justify-center whitespace-nowrap"
                    >
                      Empty Basket
                    </button>
                  )}
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* BRAND NEW ESCROW CUSTOMS & DELIVERY CONFIGURATION MODAL OVERLAY */}
      <AnimatePresence>
        {partToBuyWithConfig && (
          <div className="fixed inset-0 bg-zinc-950/40 z-[300] flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative space-y-5 text-left text-zinc-900 border border-zinc-105"
            >
              
              {/* Header */}
              <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-650 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 font-sans">Sovereign Checkout Estimator</h3>
                </div>
                <button 
                  onClick={() => setPartToBuyWithConfig(null)} 
                  className="p-1 rounded-full text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Minimally Compact Item Panel */}
              <div className="flex gap-3 bg-zinc-50 p-3 rounded-xl border border-zinc-200/60">
                <img 
                  src={partToBuyWithConfig.image} 
                  alt={partToBuyWithConfig.name} 
                  className="w-12 h-12 object-cover rounded-lg border border-zinc-200 shrink-0 bg-white" 
                  referrerPolicy="no-referrer" 
                />
                <div className="space-y-0.5 min-w-0 flex-1">
                  <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">{partToBuyWithConfig.category}</span>
                  <h4 className="text-xs font-bold text-zinc-900 leading-tight truncate">{partToBuyWithConfig.name}</h4>
                  <span className="text-[11px] text-red-650 font-extrabold block">${partToBuyWithConfig.price.toLocaleString()}</span>
                </div>
              </div>

              {/* Target Port Custom Dropdown field */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">DELIVERY TARGET PORT</label>
                <select
                  value={popupShippingDest}
                  onChange={(e) => setPopupShippingDest(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl text-xs text-zinc-800 outline-none cursor-pointer focus:bg-white focus:border-zinc-400 transition-all font-sans font-medium hover:border-zinc-300"
                >
                  <option value="Rotterdam, Netherlands">Rotterdam Hub (Netherlands) - VAT 21%</option>
                  <option value="Hamburg, Germany">Hamburg Port (Germany) - VAT 19%</option>
                  <option value="Port of Dubai, UAE">Dubai Terminal (UAE) - Exempt</option>
                  <option value="Los Angeles Port, USA">LA Custom Gate (USA) - Duty Free</option>
                  <option value="Tokyo Harbor, Japan">Tokyo bay (Japan) - Custom Checked</option>
                </select>
              </div>

              {/* Transport Channel Toggle Switches */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 block">TRANSPORT CHANNEL</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['air', 'sea', 'eco'] as const).map((method) => {
                    const isActive = popupShippingMethod === method;
                    const label = method === 'air' ? 'Air Cargo' : method === 'sea' ? 'Sea' : 'Ground';
                    return (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPopupShippingMethod(method)}
                        className={`py-2 px-3 border rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                          isActive 
                            ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs' 
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live Estimator Totals Display card - Minimalist elegance */}
              <div className="bg-zinc-50 rounded-xl p-4 space-y-2.5 font-sans text-xs text-zinc-600 border border-zinc-100">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subtotal Base:</span>
                  <span className="text-zinc-900 font-bold">${partToBuyWithConfig.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Freight Charge:</span>
                  <span className="text-zinc-950 font-semibold">${popupFreightCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 flex items-center gap-1">
                    Customs Duty &amp; VAT:
                  </span>
                  <span className="text-zinc-950 font-semibold">${popupDutyAndVat.toLocaleString()}</span>
                </div>
                <div className="h-px bg-zinc-200/60 my-1" />
                <div className="flex justify-between text-sm font-bold text-zinc-900">
                  <span className="uppercase tracking-wider text-[10px] font-sans font-extrabold text-zinc-400">Secure Escrow Total</span>
                  <span className="text-red-650 text-base font-extrabold">${popupGrandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Action and done buttons grid layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setPartToBuyWithConfig(null)}
                  className="w-full bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 transition-all py-2.5 rounded-xl text-xs font-bold cursor-pointer text-center"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShippingDestCountry(popupShippingDest);
                    setSelectedShippingMethod(popupShippingMethod);
                    handleAddToCart(partToBuyWithConfig);
                    setPartToBuyWithConfig(null);
                  }}
                  className="w-full bg-red-600 hover:bg-zinc-800 text-white transition-all py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Confirm &amp; Add
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING AI CHAT ASSISTANT PORTAL (Apple inspired, red & dark grey, clean, right bottom) */}
      {typeof document !== 'undefined' && createPortal(
        <div className="fixed bottom-6 right-6 z-[300] flex flex-col items-end">
          <AnimatePresence>
            {isAiChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.92 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white border border-zinc-200/85 rounded-2xl shadow-2xl w-80 md:w-96 mb-4 overflow-hidden flex flex-col max-h-[460px] "
              >
                {/* Header inside popup */}
                <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3.5 flex justify-between items-center text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-650 animate-pulse" />
                    <div>
                      <h4 className="text-[11px] font-black tracking-widest uppercase font-mono text-zinc-300">
                        Velo AI Specialist
                      </h4>
                      <p className="text-[9.5px] text-zinc-400 font-sans tracking-tight">Active Assistance Session</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAiChatOpen(false)}
                    className="p-1 px-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Response Area container */}
                <div className="flex-1 overflow-y-auto p-4 bg-zinc-50/50 space-y-3.5 max-h-[280px] min-h-[180px] scrollbar-thin text-left">
                  {aiAssistantLogs.map((msg, idx) => (
                    <div key={idx} className={`flex gap-2 text-[11px] ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`p-3 rounded-xl max-w-[85%] font-sans leading-relaxed shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-red-600 text-white text-right rounded-br-none'
                          : 'bg-white border border-zinc-250 text-zinc-850 rounded-bl-none font-medium text-left'
                      }`}>
                        {msg.role === 'ai' ? (
                          <div className="whitespace-pre-wrap select-text pr-0.5">{msg.text}</div>
                        ) : (
                          msg.text
                        )}
                      </div>
                    </div>
                  ))}

                  {isAiAnswering && (
                    <div className="flex gap-2 text-[11px] justify-start">
                      <div className="p-3 bg-white rounded-xl border border-zinc-250 text-zinc-500 text-[10.5px] animate-pulse">
                        Analyzing technical diagnostics...
                      </div>
                    </div>
                  )}
                </div>

                {/* Form box input inside popup */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendAiAssistantQuestion(e);
                  }} 
                  className="p-3 bg-white border-t border-zinc-150 flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ask fitment compatibility, sizes, years..."
                    value={aiAssistantQuery}
                    onChange={(e) => setAiAssistantQuery(e.target.value)}
                    className="flex-1 bg-zinc-50 border border-zinc-200/70 focus:border-red-600 outline-none px-4 py-2.5 text-xs rounded-xl text-zinc-900 transition-all focus:bg-white font-sans"
                  />
                  <button
                    type="submit"
                    disabled={isAiAnswering || !aiAssistantQuery.trim()}
                    className="bg-red-600 hover:bg-zinc-800 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-50 shrink-0 flex items-center justify-center shadow-xs"
                  >
                    Send
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating rounded Click Button (with animated red dot) */}
          <button
            onClick={() => setIsAiChatOpen(!isAiChatOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300 active:scale-95 text-white ${
              isAiChatOpen ? 'bg-zinc-800 rotate-90 hover:bg-zinc-900' : 'bg-red-600 hover:bg-zinc-800'
            }`}
            id="ai-assistant-floating-toggle-btn"
          >
            {isAiChatOpen ? (
              <X className="w-5 h-5 transition-all duration-300 pointer-events-none" />
            ) : (
              <div className="relative">
                <MessageSquare className="w-5 h-5 transition-all duration-300 pointer-events-none" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-zinc-900 border border-white rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-zinc-900 border border-white rounded-full" />
              </div>
            )}
          </button>
        </div>,
        document.body
      )}

    </div>
  );
}
