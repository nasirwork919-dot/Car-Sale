/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, MapPin, Grid, List as ListIcon, Map, Filter, CheckCircle, 
  RefreshCcw, Star, X, Sparkles, Save, Bell, Trash2, SlidersHorizontal, 
  ArrowRight, ShieldCheck, HelpCircle, TrendingDown, Shield, HelpCircle as HelpIcon,
  Gavel, Globe, AlertTriangle, Calendar, History
} from 'lucide-react';
import { Vehicle } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import SellVehicleWizard from './SellVehicleWizard';
import SparePartsSection from './SparePartsSection';
import AuctionsSection from './AuctionsSection';
import ImportExportSection from './ImportExportSection';
import DamagedVehiclesSection from './DamagedVehiclesSection';
import CarRentalSection from './CarRentalSection';


// City geographic coordinate offsets for Haversine distance calculations
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'los angeles': { lat: 34.0522, lng: -118.2437 },
  'san jose': { lat: 37.3382, lng: -121.8863 },
  'chicago': { lat: 41.8781, lng: -87.6298 },
  'miami': { lat: 25.7617, lng: -80.1918 },
  'houston': { lat: 29.7604, lng: -95.3698 },
  'san francisco': { lat: 37.7749, lng: -122.4194 },
  'new york': { lat: 40.7128, lng: -74.0060 },
  'seattle': { lat: 47.6062, lng: -122.3321 },
  'dallas': { lat: 32.7767, lng: -96.7970 },
  'toronto': { lat: 43.6532, lng: -79.3832 },
  'munich': { lat: 48.1351, lng: 11.5820 },
  'dubai': { lat: 25.2048, lng: 55.2708 },
  'tokyo': { lat: 35.6762, lng: 139.6503 },
  'california': { lat: 36.7783, lng: -119.4179 },
  'illinois': { lat: 40.6331, lng: -89.3985 },
  'texas': { lat: 31.9686, lng: -99.9018 },
  'florida': { lat: 27.6648, lng: -81.5158 },
  'ontario': { lat: 51.2538, lng: -85.3232 },
  'bavaria': { lat: 48.7904, lng: 11.4975 },
  'germany': { lat: 51.1657, lng: 10.4515 },
  'united arab emirates': { lat: 23.4241, lng: 53.8478 },
  'japan': { lat: 36.2048, lng: 138.2529 }
};

function getCoordinatesOfLocation(locationText: string): { lat: number; lng: number } {
  const normalized = locationText.toLowerCase().trim();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized.includes(key)) {
      return coords;
    }
  }
  // Deterministic fallback generator for custom user search strings
  let hash1 = 0;
  let hash2 = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash1 = (hash1 * 31 + char) % 180;
    hash2 = (hash2 * 37 + char) % 360;
  }
  return { lat: hash1 - 90, lng: hash2 - 180 };
}

function getDistanceKM(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in KM
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

interface MarketplaceProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vin: string) => void;
  onOpenVehicleChat?: (vin?: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (val: string) => void;
}

export default function Marketplace({ vehicles, onSelectVehicle, onOpenVehicleChat, searchQuery, onSearchQueryChange }: MarketplaceProps) {
  // Navigation & Primary Layout State
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [activeTab, setActiveTab] = useState<'buy' | 'saved_alerts' | 'sell' | 'parts' | 'auctions' | 'import_export' | 'damaged_vehicles' | 'car_rental'>('buy');

  const [localVehicles, setLocalVehicles] = useState<Vehicle[]>(vehicles);

  useEffect(() => {
    setLocalVehicles(vehicles);
  }, [vehicles]);

  useEffect(() => {
    if (searchQuery === 'Sell') {
      setActiveTab('sell');
      if (onSearchQueryChange) {
        onSearchQueryChange('');
      }
    } else if (searchQuery === 'Spare Parts' || searchQuery === 'parts') {
      setActiveTab('parts');
      if (onSearchQueryChange) {
        onSearchQueryChange('');
      }
    } else if (searchQuery === 'Auction' || searchQuery === 'auctions') {
      setActiveTab('auctions');
      if (onSearchQueryChange) {
        onSearchQueryChange('');
      }
    } else if (searchQuery === 'Import' || searchQuery === 'export' || searchQuery === 'exports') {
      setActiveTab('import_export');
      if (onSearchQueryChange) {
        onSearchQueryChange('');
      }
    } else if (searchQuery === 'Damaged' || searchQuery === 'damaged') {
      setActiveTab('damaged_vehicles');
      if (onSearchQueryChange) {
        onSearchQueryChange('');
      }
    } else if (searchQuery === 'Rental' || searchQuery === 'rental' || searchQuery === 'car_rental') {
      setActiveTab('car_rental');
      if (onSearchQueryChange) {
        onSearchQueryChange('');
      }
    }
  }, [searchQuery, onSearchQueryChange]);

  // Hero Search Fields
  const [heroCountry, setHeroCountry] = useState<string>('All');
  const [heroRegion, setHeroRegion] = useState<string>('All');
  const [heroCity, setHeroCity] = useState<string>('');
  const [searchRadius, setSearchRadius] = useState<string>('All');
  const [selectedMake, setSelectedMake] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [heroPriceRange, setHeroPriceRange] = useState<number>(350000);

  // Advanced Sidebar Filters State
  const [vehicleType, setVehicleType] = useState<string>('All');
  const [fuelType, setFuelType] = useState<string>('All');
  const [drivetrain, setDrivetrain] = useState<string>('All');
  const [condition, setCondition] = useState<string>('All');
  const [sellerType, setSellerType] = useState<string>('All');
  const [importExport, setImportExport] = useState<string>('All');
  const [accidentHistory, setAccidentHistory] = useState<string>('All');
  const [mileageMax, setMileageMax] = useState<number>(120000);
  const [ownershipHistory, setOwnershipHistory] = useState<string>('All');

  // AI Search Assistant Toggle & State
  const [isAiSearchActive, setIsAiSearchActive] = useState<boolean>(false);
  const [aiInputText, setAiInputText] = useState<string>('');
  const [aiFilteredResults, setAiFilteredResults] = useState<Vehicle[] | null>(null);
  const [aiExplanationMap, setAiExplanationMap] = useState<Record<string, string>>({});
  const [aiAppliedQuery, setAiAppliedQuery] = useState<string>('');

  // Save Search / Set Alerts
  const [savedAlerts, setSavedAlerts] = useState<Array<{
    id: string;
    email: string;
    criteria: string;
    timestamp: string;
    country: string;
    make: string;
    maxPrice: number;
  }>>([]);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertEmail, setAlertEmail] = useState<string>('');
  const [alertSuccessMessage, setAlertSuccessMessage] = useState<string>('');

  // Interactive Price Guidance Overlay State (VIN-based)
  const [selectedPriceGuidanceVin, setSelectedPriceGuidanceVin] = useState<string | null>(null);

  // Sorting
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'mileage_asc' | 'year_desc'>('relevance');

  // Map Selected Vehicle Marker
  const [selectedMapCar, setSelectedMapCar] = useState<Vehicle | null>(null);

  // Sync Geolocation Index list scroll position with active map selections
  useEffect(() => {
    if (selectedMapCar?.vin && layoutMode === 'map') {
      const element = document.getElementById(`map-index-item-${selectedMapCar.vin}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedMapCar?.vin, layoutMode]);

  // Initialize and load saved search alerts from localStorage
  useEffect(() => {
    const cached = localStorage.getItem('justcarsale_saved_alerts');
    if (cached) {
      try {
        setSavedAlerts(JSON.parse(cached));
      } catch (e) {
        console.error("Error reading saved search alerts cache", e);
      }
    }
  }, []);

  // Prevent background scrolling when telemetry alert modal is active
  useEffect(() => {
    if (showAlertModal) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [showAlertModal]);

  // Sync prop-based search query to input values if provided
  const activeSearchQuery = onSearchQueryChange !== undefined ? (searchQuery ?? '') : '';
  const setActiveSearchQuery = onSearchQueryChange !== undefined ? onSearchQueryChange : () => {};

  // Computed Makes & Models for Dynamic Hero dropdown selection
  const uniqueMakesList = useMemo(() => {
    return ['All', ...new Set(localVehicles.map(v => v.make))];
  }, [localVehicles]);

  const uniqueModelsList = useMemo(() => {
    if (selectedMake === 'All') return ['All'];
    const filteredModels = localVehicles.filter(v => v.make === selectedMake).map(v => v.model);
    return ['All', ...new Set(filteredModels)];
  }, [localVehicles, selectedMake]);

  // Handle Save Search Alert Registration
  const handleSaveSearchAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertEmail.trim()) return;

    const newAlert = {
      id: `ALERT-${Date.now()}`,
      email: alertEmail.trim(),
      criteria: `Active filters: Make=${selectedMake}, Model=${selectedModel}, MaxPrice=$${heroPriceRange.toLocaleString()}, Region=${heroRegion === 'All' ? 'Global' : heroRegion}${searchRadius !== 'All' ? `, Radius=${searchRadius}KM` : ''}`,
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      country: heroCountry,
      make: selectedMake,
      maxPrice: heroPriceRange
    };

    const updatedAlerts = [newAlert, ...savedAlerts];
    setSavedAlerts(updatedAlerts);
    localStorage.setItem('justcarsale_saved_alerts', JSON.stringify(updatedAlerts));

    setAlertSuccessMessage(`Success! Real-time telemetry alerts configured for ${alertEmail}`);
    setAlertEmail('');
    setTimeout(() => {
      setAlertSuccessMessage('');
      setShowAlertModal(false);
    }, 2800);
  };

  // Remove saved search alert
  const handleDeleteAlert = (id: string) => {
    const updated = savedAlerts.filter(a => a.id !== id);
    setSavedAlerts(updated);
    localStorage.setItem('justcarsale_saved_alerts', JSON.stringify(updated));
  };

  // Execute Simulated AI Natural Language Search & Match Explanations
  const triggerAiLifestylesPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = aiInputText.trim();
    if (!query) return;

    setAiAppliedQuery(query);
    const lowercaseQuery = query.toLowerCase();

    // Match algorithm analyzing: sports, electric, hybrid, family cargo size, limits
    const matchScores = localVehicles.map(car => {
      let score = 0;
      const reasons: string[] = [];

      // Keyword - Sports / Fast
      if (lowercaseQuery.match(/(sport|fast|speed|track|performance|porsche|rwd|pdk|biturbo|amg|m5)/i)) {
        if (['Porsche', 'BMW', 'Mercedes-Benz', 'Audi'].includes(car.make) || car.model.toLowerCase().includes('carrera') || car.model.toLowerCase().includes('gt')) {
          score += 25;
          reasons.push("Perfect match for high-revving track caliber performance characteristics and immediate torque output");
        }
      }

      // Keyword - Electric / Eco / Hybrid
      if (lowercaseQuery.match(/(electric|ev|battery|tesla|eco|clean|save|hybrid|efficient)/i)) {
        if (car.engine.toLowerCase().includes('electric') || car.make === 'Tesla') {
          score += 30;
          reasons.push("Satisfies 100% zero-emission requirements with certified high-safety battery modules");
        } else if (car.model.toLowerCase().includes('hybrid') || car.engine.toLowerCase().includes('hybrid')) {
          score += 15;
          reasons.push("Satisfies eco objectives through hybrid efficiency and smart kinetic recovery profiles");
        }
      }

      // Keyword - Family / Large / Space / Luggage
      if (lowercaseQuery.match(/(family|kids|large|space|luggage|comfort|suv|cargo)/i)) {
        if (car.model.toLowerCase().match(/(rover|avant|series|m5|rs6)/i) || car.driveType.toLowerCase().includes('awd')) {
          score += 20;
          reasons.push("Optimized cabin footprint with spacious backseats, modular storage cargo, and all-weather traction safety");
        }
      }

      // Keyword - Budget thresholds
      if (lowercaseQuery.includes('budget') || lowercaseQuery.includes('affordable') || lowercaseQuery.includes('under') || lowercaseQuery.includes('cheap')) {
        // Extract any numeric constraints (e.g. "under 110k" or "under 150000")
        const matchesDigits = lowercaseQuery.match(/\d+/g);
        if (matchesDigits) {
          const matchedNum = Math.max(...matchesDigits.map(Number));
          const actualThresh = matchedNum < 1000 ? matchedNum * 1000 : matchedNum;
          if (car.price <= actualThresh) {
            score += 30;
            reasons.push(`Priced comfortably under your requested $${actualThresh.toLocaleString()} threshold`);
          }
        } else if (car.price < 110000) {
          score += 15;
          reasons.push("Highly economic acquisition rating within premium certified sectors");
        }
      }

      // Exact brand direct match
      if (lowercaseQuery.includes(car.make.toLowerCase())) {
        score += 35;
        reasons.push(`Fulfills precise brand focus for the engineering prestige of ${car.make}`);
      }
      if (lowercaseQuery.includes(car.model.toLowerCase())) {
        score += 40;
        reasons.push(`Direct matching specifications for the exclusive ${car.model} series`);
      }

      return { car, score, reasons };
    });

    // Sort by lifestyle conformity score
    const winningMatches = matchScores
      .filter(entry => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    if (winningMatches.length > 0) {
      setAiFilteredResults(winningMatches.map(m => m.car));
      const textMap: Record<string, string> = {};
      winningMatches.forEach(m => {
        textMap[m.car.vin] = m.reasons.length > 0 
          ? m.reasons.join(". ") + "." 
          : "Matches specified parameters with a perfect structural integrity score.";
      });
      setAiExplanationMap(textMap);
    } else {
      setAiFilteredResults([]);
      setAiExplanationMap({});
    }
  };

  // Reset natural language AI context
  const clearAiPreferences = () => {
    setAiInputText('');
    setAiFilteredResults(null);
    setAiAppliedQuery('');
    setAiExplanationMap({});
  };

  // Core Filtering System Standard + Advanced Filters Sidebar Custom Matching
  const finalFilteredVehicles = useMemo(() => {
    // If the natural language assistant is active and a query was executed, use its matched core
    const sourceList = aiFilteredResults !== null ? aiFilteredResults : localVehicles;

    return sourceList.filter(car => {
      // Hero Global Search: Country, Region, City
      const matchesCountry = heroCountry === 'All' || car.location.toLowerCase().includes(heroCountry.toLowerCase());
      
      let matchesRegion = true;
      if (heroRegion !== 'All') {
        const regCode = heroRegion === 'California' ? 'CA' 
                      : heroRegion === 'Illinois' ? 'IL' 
                      : heroRegion === 'Texas' ? 'TX' 
                      : heroRegion === 'Florida' ? 'FL'
                      : heroRegion === 'Ontario' ? 'ON'
                      : heroRegion === 'Bavaria' ? 'DE'
                      : heroRegion === 'Dubai' ? 'UAE'
                      : heroRegion === 'Tokyo' ? 'JP'
                      : '';
        matchesRegion = car.location.includes(regCode) || car.location.toLowerCase().includes(heroRegion.toLowerCase());
      }

      const matchesCity = !heroCity.trim() || car.location.toLowerCase().includes(heroCity.toLowerCase());

      // Make / Model Dropdowns
      const matchesMake = selectedMake === 'All' || car.make === selectedMake;
      const matchesModel = selectedModel === 'All' || car.model === selectedModel;

      // Price Limits
      const matchesPrice = car.price <= heroPriceRange;

      // Advanced Filters Sidebar Elements
      // 1. Vehicle Type
      let matchesType = true;
      if (vehicleType !== 'All') {
        if (vehicleType === 'SUV') matchesType = car.model.toLowerCase().match(/(rover|escalade|cruiser|ioniq)/i) !== null;
        else if (vehicleType === 'Sedan') matchesType = car.model.toLowerCase().match(/(m5|elantra|model s|ct) /i) !== null || car.driveType.includes('Drive') || car.make === 'BMW';
        else if (vehicleType === 'Coupe') matchesType = car.model.toLowerCase().match(/(carrera|black series|gt|mustang|supra)/i) !== null;
        else if (vehicleType === 'Wagon') matchesType = car.model.toLowerCase().match(/(avant|combi)/i) !== null;
        else if (vehicleType === 'EV') matchesType = car.engine.toLowerCase().includes('electric');
      }

      // 2. Fuel Type
      let matchesFuel = true;
      if (fuelType !== 'All') {
        if (fuelType === 'Electric') matchesFuel = car.engine.toLowerCase().includes('electric') || car.make === 'Tesla';
        else if (fuelType === 'Gasoline') matchesFuel = !car.engine.toLowerCase().includes('electric');
        else if (fuelType === 'Hybrid') matchesFuel = car.engine.toLowerCase().includes('hybrid') || car.model.toLowerCase().includes('hybrid');
      }

      // 3. Drivetrain
      let matchesDrivetrain = true;
      if (drivetrain !== 'All') {
        if (drivetrain === 'AWD') matchesDrivetrain = car.driveType.toLowerCase().includes('awd') || car.driveType.toLowerCase().includes('quattro');
        else if (drivetrain === 'RWD') matchesDrivetrain = car.driveType.toLowerCase().includes('rwd');
        else if (drivetrain === 'FWD') matchesDrivetrain = car.driveType.toLowerCase().includes('fwd');
      }

      // 4. Condition
      let matchesCondition = true;
      if (condition !== 'All') {
        if (condition === 'CPO') matchesCondition = car.certified === true;
        else if (condition === 'New') matchesCondition = car.mileage < 100;
        else if (condition === 'Used') matchesCondition = car.mileage >= 100;
        else if (condition === 'Classic') matchesCondition = car.year < 2018;
      }

      // 5. Seller Type
      let matchesSeller = true;
      if (sellerType !== 'All') {
        if (sellerType === 'Dealership') matchesSeller = car.certified === true;
        else if (sellerType === 'Certified Hub') matchesSeller = car.riskScore === 'Low';
        else if (sellerType === 'Private Seller') matchesSeller = car.certified === false;
      }

      // 6. Import/Export availability
      let matchesImport = true;
      if (importExport !== 'All') {
        if (importExport === 'Worldwide') matchesImport = car.status === 'Available' || car.status === 'Customs Pending';
        else if (importExport === 'Cleared') matchesImport = car.status !== 'Customs Pending';
      }

      // 7. Accident History
      let matchesAccidents = true;
      if (accidentHistory !== 'All') {
        if (accidentHistory === 'None') matchesAccidents = car.riskScore === 'Low';
        else if (accidentHistory === 'Minor') matchesAccidents = car.riskScore !== 'High';
      }

      // 8. Mileage Range Max
      const matchesMileage = car.mileage <= mileageMax;

      // 9. Ownership
      let matchesOwnership = true;
      if (ownershipHistory !== 'All') {
        if (ownershipHistory === 'Single Owner') matchesOwnership = car.mileage < 15000;
      }

      // 10. Search Radius (KM) from City, Region, or Country reference anchor
      let matchesRadius = true;
      if (searchRadius !== 'All') {
        // Fallback references: use city if provided, else current region, else current country, else general default (Los Angeles)
        const refAnchor = heroCity.trim() 
          ? heroCity 
          : (heroRegion !== 'All' ? heroRegion : (heroCountry !== 'All' ? heroCountry : 'Los Angeles'));
        
        const originCoords = getCoordinatesOfLocation(refAnchor);
        const destCoords = getCoordinatesOfLocation(car.location);
        const distanceKM = getDistanceKM(originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng);
        matchesRadius = distanceKM <= Number(searchRadius);
      }

      return matchesCountry && matchesRegion && matchesCity && matchesMake && matchesModel && 
             matchesPrice && matchesType && matchesFuel && matchesDrivetrain && matchesCondition && 
             matchesSeller && matchesImport && matchesAccidents && matchesMileage && matchesOwnership &&
             matchesRadius;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'mileage_asc') return a.mileage - b.mileage;
      if (sortBy === 'year_desc') return b.year - a.year;
      return b.valuation - a.valuation; // Default matches by high estimated conformity
    });
  }, [
    vehicles, aiFilteredResults, heroCountry, heroRegion, heroCity, searchRadius, selectedMake, 
    selectedModel, heroPriceRange, vehicleType, fuelType, drivetrain, condition, 
    sellerType, importExport, accidentHistory, mileageMax, ownershipHistory, sortBy
  ]);

  // VIN Dynamic Calculator for 5-Year Ownership & Depreciation Estimates
  const fetchPriceGuidanceReport = (car: Vehicle) => {
    const marketCompareStatus = car.price < car.valuation ? "Below Fair Value" : "At Market Average";
    const fairDifference = Math.abs(car.valuation - car.price);
    const maintenance5Year = Math.round(car.price * 0.18 + car.mileage * 0.15);
    const annualInsurance = Math.round(car.price * 0.024 + 1200);
    const residualResale = Math.round(car.price * 0.68);

    return {
      marketCompareStatus,
      fairDifference,
      maintenance5Year,
      annualInsurance,
      residualResale
    };
  };

  // Clear all filters easily
  const handleClearFilters = () => {
    setHeroCountry('All');
    setHeroRegion('All');
    setHeroCity('');
    setSearchRadius('All');
    setSelectedMake('All');
    setSelectedModel('All');
    setHeroPriceRange(350000);
    setVehicleType('All');
    setFuelType('All');
    setDrivetrain('All');
    setCondition('All');
    setSellerType('All');
    setImportExport('All');
    setAccidentHistory('All');
    setMileageMax(120000);
    setOwnershipHistory('All');
    setSortBy('relevance');
    clearAiPreferences();
  };

  // Animation variants for beautiful staggered entry transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.03
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15
      } 
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 py-4 text-slate-900" 
      id="marketplace-search-hub-container"
    >
      
      {/* Tab select Header: Hidden as requested for pure minimalistic look */}

      {activeTab === 'sell' ? (
        <div className="py-2">
          <SellVehicleWizard 
            onPublishListing={(newVehicle) => {
              setLocalVehicles(prev => [newVehicle, ...prev]);
              setActiveTab('buy');
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
            onCancel={() => {
              setActiveTab('buy');
              window.scrollTo({ top: 380, behavior: 'smooth' });
            }}
          />
        </div>
      ) : activeTab === 'parts' ? (
        <div className="py-2">
          <SparePartsSection onOpenVehicleChat={onOpenVehicleChat} />
        </div>
      ) : activeTab === 'auctions' ? (
        <div className="py-2">
          <AuctionsSection />
        </div>
      ) : activeTab === 'import_export' ? (
        <div className="py-2">
          <ImportExportSection />
        </div>
      ) : activeTab === 'damaged_vehicles' ? (
        <div className="py-2">
          <DamagedVehiclesSection sellerModifiedVehicles={localVehicles} />
        </div>
      ) : activeTab === 'car_rental' ? (
        <div className="py-2">
          <CarRentalSection />
        </div>
      ) : activeTab === 'saved_alerts' ? (
        /* SAVED SEARCH ALERTS CONTAINER PANEL */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
          <div className="flex justify-between items-center pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Active Telemetry Alerts</h3>
            </div>
            <Bell className="w-5 h-5 text-red-600" />
          </div>

          {savedAlerts.length === 0 ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
              <p className="text-xs font-semibold">You have no active notification subscriptions.</p>
              <button
                onClick={() => { setActiveTab('buy'); setShowAlertModal(true); }}
                className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-800"
              >
                Set My First Dynamic Alert
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAlerts.map(alert => (
                <div key={alert.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-start">
                  <div className="space-y-1.5 text-left">
                    <h4 className="font-bold text-xs text-slate-900">{alert.email}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{alert.criteria}</p>
                    <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1.5 pt-1">
                      <History className="w-3 h-3" /> Configured on: {alert.timestamp}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete search alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* HERO SEARCH AND SIDEBAR CATALOG FLOW */
        <div className="space-y-6">
          
          {/* HERO INTEGRATED SEARCH BOX: Country, Region, City, Make/Model, Price Range */}
          <motion.section 
            variants={itemVariants}
            className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 space-y-4 shadow-sm"
          >
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 pb-2">
              <div className="space-y-0.5 text-left">
                <h2 className="text-sm font-extrabold tracking-tight text-slate-800 font-display uppercase">
                  Direct Hub Registry
                </h2>
              </div>
            </div>

            {/* HERO CORE SEARCH BOX CONTROLS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-left">
              
              {/* Select 1: Country */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight block font-sans">1. Country</label>
                <select
                  value={heroCountry}
                  onChange={(e) => { setHeroCountry(e.target.value); setHeroRegion('All'); }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-600 font-semibold outline-none hover:bg-slate-100 cursor-pointer transition-all focus:border-[#8B0000] focus:bg-white"
                >
                  <option value="All">Global (All)</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="United Arab Emirates">U.A.E.</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              {/* Select 2: Region / State (Context based on country) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight block font-sans">2. Region / State</label>
                <select
                  value={heroRegion}
                  onChange={(e) => setHeroRegion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-600 font-semibold outline-none hover:bg-slate-100 cursor-pointer transition-all focus:border-[#8B0000] focus:bg-white"
                >
                  <option value="All">All Regions</option>
                  {heroCountry === 'All' || heroCountry === 'United States' ? (
                    <>
                      <option value="California">California (CA)</option>
                      <option value="Illinois">Illinois (IL)</option>
                      <option value="Texas">Texas (TX)</option>
                      <option value="Florida">Florida (FL)</option>
                    </>
                  ) : null}
                  {heroCountry === 'All' || heroCountry === 'Canada' ? <option value="Ontario">Ontario (ON)</option> : null}
                  {heroCountry === 'All' || heroCountry === 'Germany' ? <option value="Bavaria">Bavaria (DE)</option> : null}
                  {heroCountry === 'All' || heroCountry === 'United Arab Emirates' ? <option value="Dubai">Dubai (UAE)</option> : null}
                  {heroCountry === 'All' || heroCountry === 'Japan' ? <option value="Tokyo">Tokyo (JP)</option> : null}
                </select>
              </div>

              {/* Input 3: City (Custom String) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight block font-sans">3. City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={heroCity}
                    onChange={(e) => setHeroCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-[11px] text-slate-600 font-semibold outline-none hover:bg-slate-100 placeholder:text-slate-400 focus:border-[#8B0000] focus:bg-white transition-all shadow-inner"
                    placeholder="e.g. Los Angeles"
                  />
                </div>
              </div>

              {/* Select 4: Radius / Max Distance (KM) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight block font-sans">4. Radius (Distance)</label>
                <select
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] text-slate-600 font-semibold outline-none hover:bg-slate-100 cursor-pointer transition-all focus:border-[#8B0000] focus:bg-white"
                >
                  <option value="All">Any Distance</option>
                  <option value="50">Within 50 KM</option>
                  <option value="100">Within 100 KM</option>
                  <option value="250">Within 250 KM</option>
                  <option value="500">Within 500 KM</option>
                  <option value="1000">Within 1000 KM</option>
                  <option value="2500">Within 2500 KM</option>
                </select>
              </div>

              {/* Select 5: Make & Model Combination */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight block font-sans">5. Make / Model</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <select
                    value={selectedMake}
                    onChange={(e) => { setSelectedMake(e.target.value); setSelectedModel('All'); }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-[11px] text-slate-600 font-semibold outline-none hover:bg-slate-100 cursor-pointer focus:border-[#8B0000] focus:bg-white transition-all"
                  >
                    <option value="All">All Makes</option>
                    {uniqueMakesList.filter(m => m !== 'All').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>

                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={selectedMake === 'All'}
                    className="w-full bg-slate-55 border border-slate-200 rounded-xl px-2.5 py-2 text-[11px] text-slate-600 font-semibold outline-none hover:bg-slate-100 cursor-pointer disabled:opacity-40 focus:border-[#8B0000] focus:bg-white transition-all"
                  >
                    <option value="All">All Models</option>
                    {uniqueModelsList.filter(m => m !== 'All').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Input 6: Price Range Slider */}
              <div className="space-y-1.55 pt-0.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-tight block font-sans">6. Price Max</label>
                  <span className="text-xs text-[#8B0000] font-extrabold font-mono">${(heroPriceRange / 1000).toFixed(0)}K</span>
                </div>
                <input
                  type="range"
                  min="35000"
                  max="350000"
                  step="5000"
                  value={heroPriceRange}
                  onChange={(e) => setHeroPriceRange(Number(e.target.value))}
                  className="w-full h-1 bg-slate-100 rounded cursor-pointer accent-[#8B0000] outline-none animate-none"
                />
                <div className="flex justify-between text-[8px] text-slate-400 font-mono pt-0.5">
                  <span>$35K</span>
                  <span>$350K+</span>
                </div>
              </div>

            </div>
          </motion.section>

          {/* DYNAMIC LAYOUT SELECTORS & FILTER SUMMARIES */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
          >
            
            {/* Split segmented selectors */}
            <div className="flex bg-slate-50 p-1.5 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                  layoutMode === 'grid' 
                    ? 'bg-white text-[#8B0000] shadow-sm font-extrabold' 
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Grid className="w-3.5 h-3.5" /> Grid
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('list')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                  layoutMode === 'list' 
                    ? 'bg-white text-[#8B0000] shadow-sm font-extrabold' 
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <ListIcon className="w-3.5 h-3.5" /> List
              </button>
              <button
                type="button"
                onClick={() => { setLayoutMode('map'); setSelectedMapCar(null); }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all cursor-pointer ${
                  layoutMode === 'map' 
                    ? 'bg-white text-[#8B0000] shadow-sm font-extrabold' 
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Map className="w-3.5 h-3.5" /> Map
              </button>
            </div>

            {/* Sort & Inventory Counter Row */}
            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wide">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-600 font-semibold outline-none hover:bg-slate-100 cursor-pointer text-left focus:border-[#8B0000] focus:bg-white transition-all"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="mileage_asc">Lowest Mileage</option>
                  <option value="year_desc">Year: Newest First</option>
                </select>
              </div>

              {/* Verified Units Gauge Indicator */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wide text-slate-600">Available units:</span>
                <span className="text-[#8B0000] text-[12px] font-black font-mono">
                  {finalFilteredVehicles.length}
                </span>
              </div>
            </div>
          </motion.div>

          {/* MAIN COLUMN BODY PARTITIONS: ADVANCED FILTERS LEFT SIDEBAR + VEHICLE GRID RESULTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* ADVANCED FILTERING SIDEBAR: Type, Fuel, Drive, Condition, Seller, Accidents, Logs */}
            <aside className="lg:col-span-3 space-y-4.5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 mb-3">
                <h3 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-[9.5px] text-red-650 hover:text-[#8B0000] font-extrabold flex items-center gap-0.5 cursor-pointer transition-colors"
                >
                  <RefreshCcw className="w-2.5 h-2.5 animate-none" /> Reset
                </button>
              </div>

              {/* Filter 1: Vehicle Type */}
              <div className="space-y-1.5">
                <span className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider block">Vehicle Type</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {['All', 'SUV', 'Sedan', 'Coupe', 'Wagon', 'EV'].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVehicleType(v)}
                      className={`px-1.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all text-center cursor-pointer ${
                        vehicleType === v 
                          ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold shadow-xs' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 hover:text-[#8B0000] text-slate-500'
                      }`}
                    >
                      {v === 'All' ? 'All Types' : v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 2: Fuel Configuration */}
              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                <span className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider block">Fuel & Propulsion</span>
                <select
                  value={fuelType}
                  onChange={e => setFuelType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-600 font-semibold outline-none cursor-pointer focus:border-[#8B0000] focus:bg-white transition-all"
                >
                  <option value="All">All Drive Energies</option>
                  <option value="Gasoline">Premium Gasoline Only</option>
                  <option value="Hybrid">Hybrid/Propulsion</option>
                  <option value="Electric">Battery Electric (EV)</option>
                </select>
              </div>

              {/* Filter 3: Drivetrain Layout */}
              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                <span className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider block">Drivetrain</span>
                <div className="flex flex-wrap gap-1.5">
                  {['All', 'AWD', 'RWD', 'FWD'].map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDrivetrain(d)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        drivetrain === d 
                          ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold shadow-xs' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 hover:text-[#8B0000] text-slate-500'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter 4: Chassis Condition */}
              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                <span className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider block">Spec Condition</span>
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-600 font-semibold outline-none cursor-pointer focus:border-[#8B0000] focus:bg-white transition-all"
                >
                  <option value="All">All Conditions</option>
                  <option value="New">Brand New / Low Delivery</option>
                  <option value="CPO">CPO Certified Only</option>
                  <option value="Used">Certified Used</option>
                  <option value="Classic">Classic / Rare Collector</option>
                </select>
              </div>

              {/* Filter 5: Seller Category */}
              <div className="space-y-1.5 pt-2.5 border-t border-slate-100 font-sans">
                <span className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider block">Verified Seller Type</span>
                <div className="space-y-1 pt-1">
                  {['All', 'Dealership', 'Certified Hub', 'Private Seller'].map(sel => (
                    <label key={sel} className="flex items-center gap-2 cursor-pointer py-0.5 select-none hover:text-slate-900 text-slate-500 group transition-colors">
                      <input
                        type="radio"
                        name="sellerTypeRadio"
                        checked={sellerType === sel}
                        onChange={() => setSellerType(sel)}
                        className="rounded-full border-slate-300 text-[#8B0000] focus:ring-[#8B0000] w-3 h-3 cursor-pointer accent-[#8B0000]"
                      />
                      <span className="text-xs font-semibold group-hover:text-slate-900 text-slate-600">
                        {sel === 'All' ? 'All Sellers' : sel}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Filter 6: Import & Worldwide Export Licensing */}
              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                <span className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider block">Import / Export Logistics</span>
                <select
                  value={importExport}
                  onChange={e => setImportExport(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-600 font-semibold outline-none cursor-pointer focus:border-[#8B0000] focus:bg-white transition-all"
                >
                  <option value="All">All Clearance Status</option>
                  <option value="Worldwide">Worldwide Export Eligible</option>
                  <option value="Cleared">Customs Tax &amp; Duty Cleared</option>
                </select>
              </div>

              {/* Filter 7: Accident / Title History Sweep */}
              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                <span className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider block">Accident Integrity Sweep</span>
                <select
                  value={accidentHistory}
                  onChange={e => setAccidentHistory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-600 font-semibold outline-none cursor-pointer focus:border-[#8B0000] focus:bg-white transition-all"
                >
                  <option value="All">All Records Accepted</option>
                  <option value="None">Zero Accidents Recorded</option>
                  <option value="Minor">Zero Major Accidents</option>
                </select>
              </div>

              {/* Filter 8: Maximum Mileage Logs */}
              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                <div className="flex justify-between items-center text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <span>Max Mileage Log</span>
                  <span className="text-[#8B0000] font-black font-mono">{mileageMax.toLocaleString()} mi</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="120000"
                  step="2500"
                  value={mileageMax}
                  onChange={e => setMileageMax(Number(e.target.value))}
                  className="w-full h-1 bg-slate-200 rounded cursor-pointer accent-[#8B0000]"
                />
              </div>

              {/* Filter 9: Ownership History */}
              <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                <span className="text-[9.5px] font-extrabold text-slate-500 uppercase tracking-wider block">Ownership History</span>
                <select
                  value={ownershipHistory}
                  onChange={e => setOwnershipHistory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[11px] text-slate-600 font-semibold outline-none cursor-pointer focus:border-[#8B0000] focus:bg-white transition-all"
                >
                  <option value="All">Any Ownership Count</option>
                  <option value="Single Owner">Single Owner (1-Owner Only)</option>
                </select>
              </div>

            </aside>

            {/* MAIN RESULTS PANEL: GRID vs LIST vs MAP SCREEN OPTIONS */}
            <div className="lg:col-span-9 space-y-4">
              
              {/* LAYOUT: GRID PRESENTATION */}
              {layoutMode === 'grid' && (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  {finalFilteredVehicles.map(car => {
                    const hasMatchReasons = aiExplanationMap[car.vin];
                    const report = fetchPriceGuidanceReport(car);
                    const isGuidanceOpen = selectedPriceGuidanceVin === car.vin;

                    return (
                      <motion.div 
                        variants={itemVariants}
                        key={car.vin}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between text-left group"
                      >
                        {/* Img preview frame with metadata */}
                        <div className="h-40 relative bg-slate-50 overflow-hidden shrink-0">
                          <img
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={car.images[0]}
                            alt={car.model}
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Card Info Body */}
                        <div className="p-4.5 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-0.5">
                            <h4 className="text-slate-800 font-extrabold text-[13px] tracking-tight font-display hover:text-[#8B0000] transition-colors cursor-pointer" onClick={() => onSelectVehicle(car.vin)}>
                              {car.year} {car.make} {car.model}
                            </h4>
                          </div>

                          {/* Dynamic AI assist conform banner */}
                          {hasMatchReasons && (
                            <div className="bg-amber-50/70 border border-amber-100 rounded-lg p-2 text-[9.5px] text-amber-900 leading-snug flex items-start gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                              <p className="font-semibold">{hasMatchReasons}</p>
                            </div>
                          )}

                          {/* Main Price Action Row */}
                          <div className="flex justify-between items-center pt-1 animate-none">
                            <span className="text-[15px] font-black text-black font-mono">${car.price.toLocaleString()}</span>
                          </div>

                          <button
                            onClick={() => onSelectVehicle(car.vin)}
                            className="w-full bg-[#B30000] hover:bg-[#4A4A4A] text-white text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 select-none cursor-pointer shadow-sm"
                          >
                            Inspect Secure Dossier <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* LAYOUT: LIST VIEW */}
              {layoutMode === 'list' && (
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {finalFilteredVehicles.map(car => {
                    const hasMatchReasons = aiExplanationMap[car.vin];
                    const report = fetchPriceGuidanceReport(car);
                    const isGuidanceOpen = selectedPriceGuidanceVin === car.vin;

                    return (
                      <motion.div 
                        variants={itemVariants}
                        key={car.vin}
                        className="bg-white rounded-2xl border border-slate-200 p-4 gap-4 items-center justify-between shadow-sm flex flex-col md:flex-row text-left"
                      >
                        {/* Img column */}
                        <div className="relative w-full md:w-44 h-28 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          <img
                            className="w-full h-full object-cover"
                            src={car.images[0]}
                            alt={car.model}
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Text and stats column */}
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
                          <div className="space-y-1.5">
                            <h4 className="text-slate-800 font-extrabold text-[15px] tracking-tight hover:text-[#8B0000] cursor-pointer" onClick={() => onSelectVehicle(car.vin)}>
                              {car.year} {car.make} {car.model}
                            </h4>
                            <span className="text-[16px] font-black text-black font-mono block">${car.price.toLocaleString()}</span>
                          </div>

                          <div className="shrink-0">
                            <button
                              onClick={() => onSelectVehicle(car.vin)}
                              className="bg-[#B30000] hover:bg-[#4A4A4A] text-white text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg cursor-pointer transition-all duration-200 active:scale-95 shadow-sm"
                            >
                              Dossier Page
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}

              {/* LAYOUT: GEOGRAPHICAL MAP VIEW TOGGLE */}
              {layoutMode === 'map' && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm h-[450px] flex relative text-left">
                  
                  {/* Left Column listings lists */}
                  <div className="w-1/3 border-r border-slate-200 overflow-y-auto p-2.5 space-y-2 h-full hide-scrollbar bg-slate-50">
                    <span className="text-[9px] font-black text-slate-400 block pb-1.5 uppercase tracking-wide">CPO Geolocation Index</span>
                    {finalFilteredVehicles.map(car => (
                      <div
                        key={car.vin}
                        id={`map-index-item-${car.vin}`}
                        onClick={() => setSelectedMapCar(car)}
                        className={`p-2 rounded-xl border transition-all duration-300 cursor-pointer flex gap-1.5 text-[11px] justify-between items-center select-none ${
                          selectedMapCar?.vin === car.vin 
                            ? 'bg-red-50 border-red-400 text-[#8B0000] font-extrabold shadow-sm ring-1 ring-red-400/50' 
                            : 'bg-white hover:bg-zinc-100 border-slate-200/60 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img 
                            src={car.images[0]} 
                            alt="" 
                            className="w-7 h-7 rounded-full object-cover border border-slate-100 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-0.5 truncate">
                            <h5 className="font-extrabold text-slate-900 truncate">{car.year} {car.make}</h5>
                            <span className="text-[9px] text-slate-500 font-medium block truncate">{car.location}</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-900 text-[11px] font-mono shrink-0">${(car.price / 1000).toFixed(0)}K</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Styled Map representation */}
                  <div className="w-2/3 h-full relative bg-slate-100 overflow-hidden flex flex-col justify-between">
                    <img
                      className="w-full h-full object-cover grayscale-[0.2] opacity-90"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS3WMjlKernaZsFoE4kMdvYsb5ZttMJ8mmLJM5VSWfcgDToWN9x2ndUK_c1RV853BJCiL8Wl9ZucI2KbLczkewORN9fCwqmx4lpcRXOMuTrdBvSpeco_dsl6fPRdnQ-_MIudMzJDsgka1vGQfXg4Hyi3wxNErKYc9dsECxxul0Bzr68CxecaC0L5QgehACvN30_X17eyWUV84rKPualA8-Py5-548bNtcBaB7Vq9PnQh5ttOOLj7714A7OmYldfqG1pC3lqVim0WX4"
                      alt="Regional Hub Map Grid"
                    />

                    {/* Regional Map Pin Markers for computed final list */}
                    {finalFilteredVehicles.map((car, idx) => {
                      // Determine mock positions based on details to scatter nicely
                      const topOffset = 25 + (idx * 13) % 65;
                      const leftOffset = 20 + (idx * 17) % 70;

                      return (
                        <button
                          key={car.vin}
                          onClick={() => setSelectedMapCar(car)}
                          className={`absolute flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-mono font-black shadow-md transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 ${
                            selectedMapCar?.vin === car.vin
                              ? 'bg-[#8B0000] text-white border-2 border-white scale-110 z-20'
                              : 'bg-zinc-800 text-zinc-100 border border-zinc-700/80 hover:bg-zinc-700 hover:scale-105'
                          }`}
                          style={{ top: `${topOffset}%`, left: `${leftOffset}%` }}
                        >
                          <img 
                            src={car.images[0]} 
                            alt="" 
                            className="w-4 h-4 rounded-full object-cover border border-white/25 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <span>${(car.price / 1000).toFixed(0)}K</span>
                        </button>
                      );
                    })}

                    {/* Lower Map Preview overlay drawer */}
                    <AnimatePresence>
                      {selectedMapCar && (
                        <motion.div
                          initial={{ y: 80, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: 80, opacity: 0 }}
                          className="absolute bottom-3 left-3 right-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-lg flex items-center gap-3 text-left z-20"
                        >
                          <img
                            src={selectedMapCar.images[0]}
                            alt={selectedMapCar.model}
                            className="w-16 h-12 rounded object-cover border border-slate-100 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 space-y-0.5">
                            <h4 className="font-extrabold text-[11px] text-slate-900">
                              {selectedMapCar.year} {selectedMapCar.make} {selectedMapCar.model}
                            </h4>
                            <p className="text-[9px] text-slate-500 font-mono flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5 text-[#8B0000]" /> {selectedMapCar.location}
                            </p>
                            <span className="text-[11px] font-black text-black font-mono">${selectedMapCar.price.toLocaleString()}</span>
                          </div>
                          <div className="flex flex-col gap-1 shrink-0">
                            <button
                              onClick={() => onSelectVehicle(selectedMapCar.vin)}
                              className="bg-[#B30000] hover:bg-[#4A4A4A] text-white text-[9.5px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-200 shadow-sm active:scale-95"
                            >
                              Dossier File
                            </button>
                            <button
                              onClick={() => setSelectedMapCar(null)}
                              className="text-slate-400 hover:text-slate-600 text-[8px] uppercase font-bold text-center"
                            >
                              Close
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </div>
              )}

              {/* EMPTY CORNER fallback */}
              {finalFilteredVehicles.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg border border-slate-200 p-6 space-y-2 shadow-xs">
                  <p className="text-slate-400 font-bold text-[11px]">No active configurations match your search criteria.</p>
                  <button
                    onClick={handleClearFilters}
                    className="bg-[#B30000] hover:bg-[#4A4A4A] text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 tracking-tight cursor-pointer"
                  >
                    Clear Filter Constraints
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      )}      {/* FLOAT SAVE SEARCH DIALOG MODAL */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showAlertModal && (
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[1001] pointer-events-auto">
              {/* Backdrop with independent fade transition */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAlertModal(false)}
                className="absolute inset-0 bg-slate-950/45 backdrop-blur-md cursor-pointer"
              />

              {/* Minimalist Centered Modal Card */}
              <motion.div
                initial={{ scale: 0.96, opacity: 0, y: 12 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0, y: 12 }}
                transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-5 text-left shadow-xl space-y-4 relative overflow-hidden z-[1002]"
              >
                <div className="flex justify-between items-center pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[11px] font-black text-rose-955 uppercase tracking-widest font-mono">Configure Telemetry Alerts</h3>
                  </div>
                  <button
                    onClick={() => setShowAlertModal(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-[#8B0000] transition-colors focus:outline-none cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600 font-medium">
                  <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">
                    Register your email below to save these configuration parameters. Our central telemetry scanner actively monitors global import logistics and will contact you immediately when matching vehicles arrive.
                  </p>
                  
                  <div className="bg-red-50/40 p-3 rounded-lg border border-red-100/60 font-mono text-[9.5px] text-[#8B0000]">
                    <span className="text-[#8B0000] block uppercase text-[8px] font-extrabold tracking-wider mb-1.5">Selected constraints</span>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-bold">
                      <span className="bg-white border border-red-100/30 px-1.5 py-0.5 rounded text-rose-900 shadow-sm">Make: <span className="text-[#8B0000]">{selectedMake}</span></span>
                      <span className="text-[#8B0000]/30">•</span>
                      <span className="bg-white border border-red-100/30 px-1.5 py-0.5 rounded text-rose-900 shadow-sm">Price Limit: <span className="text-[#8B0000]">${heroPriceRange.toLocaleString()}</span></span>
                      <span className="text-[#8B0000]/30">•</span>
                      <span className="bg-white border border-red-100/30 px-1.5 py-0.5 rounded text-rose-900 shadow-sm">Country: <span className="text-[#8B0000]">{heroCountry}</span></span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveSearchAlert} className="space-y-4">
                  <div>
                    <label className="text-[8.5px] font-black text-[#8B0000] uppercase tracking-wider block mb-1.5 font-mono">Inquiry email address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. buyer@luxuryfleet.com"
                      value={alertEmail}
                      onChange={e => setAlertEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-[11px] outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] text-slate-800 font-mono transition-all font-semibold"
                    />
                  </div>

                  {alertSuccessMessage && (
                    <div className="text-[9.5px] text-[#8B0000] bg-rose-50 border border-red-100/50 p-2.5 rounded text-center font-bold font-mono">
                      {alertSuccessMessage}
                    </div>
                  )}

                  <div className="flex gap-2 font-mono text-[10px]">
                    <button
                      type="button"
                      onClick={() => setShowAlertModal(false)}
                      className="w-1/2 bg-slate-100 hover:bg-slate-150 text-slate-600 rounded py-2 font-bold cursor-pointer transition-colors border border-slate-200/50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 bg-[#B30000] hover:bg-[#4A4A4A] text-white rounded-lg py-2 font-bold transition-all duration-200 cursor-pointer flex justify-center items-center gap-1 shadow-sm"
                    >
                      <Bell className="w-3 h-3 text-white shrink-0" />
                      <span>Confirm Subscription</span>
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </motion.div>
  );
}
