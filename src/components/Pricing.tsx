import React, { useState, useMemo } from 'react';
import { 
  Check, HelpCircle, ShieldAlert, Building, Zap, 
  Compass, Mail, User, Globe, Sliders, Award, DollarSign, 
  CheckCircle, Target, Lock, X, ChevronDown, 
  ArrowRight, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Pricing plans configuration
interface PricingPlan {
  id: 'individual' | 'business' | 'enterprise';
  name: string;
  icon: any;
  description: string;
  priceMonthly: number | 'Custom';
  priceAnnual: number | 'Custom';
  period: string;
  features: string[];
  cta: string;
  popular: boolean;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'individual',
    name: 'Car Enthusiast',
    icon: Compass,
    description: 'Perfect for single buyers who want to check a few cars before buying.',
    priceMonthly: 19,
    priceAnnual: 14,
    period: 'user / month',
    features: [
      '3 full car history reports',
      'Standard search filters',
      'Price drop estimates',
      'Email support (24-hour response)',
      'Download reports as PDF'
    ],
    cta: 'Choose Individual Plan',
    popular: false
  },
  {
    id: 'business',
    name: 'Dealership Pro',
    icon: Zap,
    description: 'Best for car dealers who scan many cars and run active showrooms.',
    priceMonthly: 149,
    priceAnnual: 119,
    period: 'monthly membership',
    features: [
      'Unlimited quick searches',
      '100 full car history reports',
      'Custom PDF brochures with your logo',
      'Targeted local ads for your area',
      'API access (5,000 requests per month)',
      'Up to 10 team member accounts',
      'Fast phone support (2-hour response)'
    ],
    cta: 'Start Pro Free Trial',
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Corporate Fleet',
    icon: Building,
    description: 'Built for large companies, finance firms, and insurance agents.',
    priceMonthly: 'Custom',
    priceAnnual: 'Custom',
    period: 'contract base',
    features: [
      'Unlimited automatic bulk scans',
      'Your own small online car shop',
      'Unlimited API requests',
      'Personal helper for your account',
      'Easy single sign-on & team controls',
      'Automatic check for stolen cars',
      '99.99% high speed and uptime guarantee'
    ],
    cta: 'Contact Sales Team',
    popular: false
  }
];

// Feature Matrix schema
interface FeatureItem {
  name: string;
  category: string;
  individual: string | boolean;
  business: string | boolean;
  enterprise: string | boolean;
  tooltip: string;
}

const FEATURE_MATRIX: FeatureItem[] = [
  {
    name: 'Monthly History Reports',
    category: 'Scans & Reports',
    individual: '3 Full Reports',
    business: '100 Reports / Month',
    enterprise: 'Unlimited Reports',
    tooltip: 'How many car history reports you can run each month.'
  },
  {
    name: 'Selling Support',
    category: 'Marketplace',
    individual: 'Standard Support',
    business: 'Premium Support',
    enterprise: 'Custom Brand Portfolios',
    tooltip: 'Help with showing and selling your cars on our platform.'
  },
  {
    name: 'Local Area Ads',
    category: 'Promotions',
    individual: false,
    business: 'Included (Boosted)',
    enterprise: 'Full Campaign Setup',
    tooltip: 'Show ads to buyers who live close to you.'
  },
  {
    name: 'Your Mini Webshop',
    category: 'Marketplace',
    individual: false,
    business: 'Custom Link',
    enterprise: 'Your Own Domain',
    tooltip: 'Create a small online store to show and sell your cars.'
  },
  {
    name: 'API Access',
    category: 'API & Tech',
    individual: false,
    business: '5,000 requests / month',
    enterprise: 'Unlimited requests',
    tooltip: 'Connect our data directly to your own system.'
  },
  {
    name: 'Team Accounts',
    category: 'Management',
    individual: '1 account',
    business: 'Up to 10 accounts',
    enterprise: 'Unlimited accounts',
    tooltip: 'Separate logins for your sales team and managers.'
  },
  {
    name: 'Stolen Car Check',
    category: 'Safety',
    individual: 'Manual search',
    business: 'Daily automatic check',
    enterprise: 'Instant automatic check',
    tooltip: 'Check if a car is reported stolen with national police databases.'
  }
];

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Signup Wizard State
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedSignupPlan, setSelectedSignupPlan] = useState<PricingPlan | null>(null);
  const [signupStep, setSignupStep] = useState<1 | 2 | 3 | 4>(1);
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    employeeCount: '2-10',
    addonDirectSms: false,
    addonPriorityVerification: false,
    addonExtendedAnalytics: false
  });
  
  // Enterprise Form State
  const [enterpriseForm, setEnterpriseForm] = useState({
    contactName: '',
    companyName: '',
    workEmail: '',
    teamSize: '11-50',
    monthlyVolume: 'Over 500 scans',
    customNotes: ''
  });
  const [enterpriseSubmitted, setEnterpriseSubmitted] = useState(false);

  // Ad Campaign Simulator State
  const [campaignName, setCampaignName] = useState('Central Europe Premium Exposure');
  const [targetRegion, setTargetRegion] = useState('Central EU (PL, DE, LT)');
  const [targetRadius, setTargetRadius] = useState(75); // inside kms
  const [targetBrands, setTargetBrands] = useState<string[]>(['Porsche', 'BMW', 'Tesla']);
  const [pricingModel, setPricingModel] = useState<'CPC' | 'CPM'>('CPC');
  const [monthlyBudget, setMonthlyBudget] = useState(500);
  const [isCampaignDeployed, setIsCampaignDeployed] = useState(false);

  // Computed metrics for geoad targeting simulation
  const computedReach = useMemo(() => {
    const multiplier = pricingModel === 'CPC' ? 0.35 : 0.08;
    const regionBoost = targetRegion.includes('Central') ? 1.2 : 0.95;
    const brandFactor = targetBrands.length * 0.15 + 0.55;
    const radiusFactor = (targetRadius / 100) * 0.3 + 0.85;

    const rawImpressions = (monthlyBudget / multiplier) * regionBoost * brandFactor * radiusFactor;
    const calculatedImpressions = Math.max(Math.round(rawImpressions), 1500);
    const calculatedClicks = pricingModel === 'CPC' 
      ? Math.round(monthlyBudget / 0.45) 
      : Math.round(calculatedImpressions * 0.022);
    
    return {
      impressions: calculatedImpressions,
      clicks: calculatedClicks,
      avgCost: pricingModel === 'CPC' ? '€0.45 per click' : '€3.20 per thousand impressions'
    };
  }, [pricingModel, targetRegion, targetRadius, targetBrands, monthlyBudget]);

  const toggleBrandFilter = (brand: string) => {
    setTargetBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand) 
        : [...prev, brand]
    );
  };

  const handleOpenSignup = (plan: PricingPlan) => {
    if (plan.id === 'enterprise') {
      const el = document.getElementById('enterprise-contact-anchor');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setSelectedSignupPlan(plan);
      setSignupStep(1);
      setShowSignupModal(true);
    }
  };

  const calculateAddonCost = () => {
    let cost = 0;
    if (signupForm.addonDirectSms) cost += 12;
    if (signupForm.addonPriorityVerification) cost += 25;
    if (signupForm.addonExtendedAnalytics) cost += 15;
    return cost;
  };

  const totalSignupPrice = () => {
    if (!selectedSignupPlan) return 0;
    const base = billingCycle === 'monthly' 
      ? (selectedSignupPlan.priceMonthly as number) 
      : (selectedSignupPlan.priceAnnual as number);
    return base + calculateAddonCost();
  };

  const handleEnterpriseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnterpriseSubmitted(true);
  };

  const handleCloseSignup = () => {
    setShowSignupModal(false);
    setSelectedSignupPlan(null);
    setSignupStep(1);
    setSignupForm({
      fullName: '',
      email: '',
      password: '',
      companyName: '',
      employeeCount: '2-10',
      addonDirectSms: false,
      addonPriorityVerification: false,
      addonExtendedAnalytics: false
    });
  };

  const AD_PACKAGES = [
    {
      name: 'Starter Ad Pack',
      cost: 99,
      reach: '4,500+ local views',
      radius: 'Up to 25km area',
      badge: 'Starter',
      description: 'Great for local garages and shops to get noticed in their neighborhood.'
    },
    {
      name: 'Popular Ad Pack',
      cost: 299,
      reach: '20,000+ city views',
      radius: 'Up to 100km area',
      badge: 'Best Seller',
      description: 'Best for larger shops and dealers wanting city-wide visitors.'
    },
    {
      name: 'Enterprise Ad Pack',
      cost: 799,
      reach: '75,000+ country views',
      radius: 'Unlimited areas',
      badge: 'Premium Growth',
      description: 'Built for nationwide dealers and large car rental brands.'
    }
  ];

  const faqs = [
    {
      question: 'Can I buy a single history report without a subscription?',
      answer: 'Yes! You can buy a single report anytime. A subscription is not required, but our monthly plans offer the best value.'
    },
    {
      question: 'How does local ad targeting work?',
      answer: 'You can select your city and search area (for example, 50km around Berlin). Our system then shows your ads to active buyers looking for cars or services in that specific area.'
    },
    {
      question: 'Can I add my team members and set their permissions?',
      answer: 'Yes! The Dealership Pro plan lets you add up to 10 team members. You can set them as managers or sales staff to control what they can see and edit.'
    },
    {
      question: 'Are there any hidden fees or long-term contracts?',
      answer: 'No. There are no hidden setup fees. You can cancel, upgrade, or downgrade your monthly or yearly plan at any time with a single click.'
    }
  ];

  return (
    <div className="bg-white py-12 px-4 transition-colors duration-300 font-sans text-zinc-900 space-y-16" id="pricing-page-root">
      
      {/* SECTION 1: HEADER & BILLING CHANGER */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#8B0000] uppercase">
          Simple Pricing Plans
        </h1>

        {/* Minimalist Switcher */}
        <div className="inline-flex items-center gap-1 bg-zinc-50 border border-[#8B0000]/20 p-1.5 rounded-xl mt-3 shadow-xs">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              billingCycle === 'monthly' 
                ? 'bg-[#8B0000] text-white shadow-sm' 
                : 'text-zinc-500 hover:text-[#8B0000]'
            }`}
          >
            Pay Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'annual' 
                ? 'bg-[#8B0000] text-white shadow-sm' 
                : 'text-zinc-500 hover:text-[#8B0000]'
            }`}
          >
            <span>Pay Yearly</span>
            <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${
              billingCycle === 'annual' ? 'bg-white text-[#8B0000]' : 'bg-[#8B0000] text-white'
            }`}>
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* THREE CARDS LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
        {PRICING_PLANS.map((plan) => {
          const PlanIcon = plan.icon;
          const isCustom = plan.priceMonthly === 'Custom';
          const displayedPrice = isCustom 
            ? 'Custom' 
            : (billingCycle === 'monthly' ? plan.priceMonthly : plan.priceAnnual);

          return (
            <div
              key={plan.id}
              className={`bg-white border p-6 sm:p-8 rounded-xl flex flex-col justify-between relative transition-all duration-200 ${
                plan.popular 
                  ? 'border-[#8B0000] shadow-md hover:shadow-lg' 
                  : 'border-zinc-200 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3.5 right-6 bg-[#8B0000] text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded border border-white">
                  Most Chosen
                </span>
              )}

              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border ${
                    plan.popular ? 'bg-red-50 border-[#8B0000]/20 text-[#8B0000]' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                  }`}>
                    <PlanIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-900 uppercase tracking-tight">{plan.name}</h3>
                  <p className="text-zinc-500 text-xs leading-relaxed font-normal min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 py-3 border-y border-zinc-100">
                  {typeof displayedPrice === 'number' ? (
                    <>
                      <span className="text-3xl font-black text-[#8B0000] font-mono">
                        €{displayedPrice}
                      </span>
                      <span className="text-xs text-zinc-400 font-medium lowercase">
                        / {plan.period}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl font-black text-[#8B0000] uppercase tracking-tight">
                        Custom Rates
                      </span>
                      <span className="text-xs text-zinc-400 font-medium">
                        / {plan.period}
                      </span>
                    </>
                  )}
                </div>

                {/* Bullet checklist */}
                <ul className="space-y-3 pt-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-xs text-zinc-650">
                      <div className="w-4 h-4 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 text-[#8B0000]" />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                type="button"
                id={`btn-select-tier-${plan.id}`}
                onClick={() => handleOpenSignup(plan)}
                className={`w-full mt-8 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer text-center border ${
                  plan.popular
                    ? 'bg-[#8B0000] hover:bg-[#700000] text-white border-[#8B0000] shadow-sm'
                    : 'bg-white hover:bg-red-50/45 text-[#8B0000] border-zinc-200 shadow-xs'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: COMPREHENSIVE FEATURE MATRIX */}
      <section className="max-w-6xl mx-auto space-y-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-black text-[#8B0000] uppercase">
            Compare Plan Features
          </h2>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#8B0000]">Features</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-700">Car Enthusiast</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#8B0000]">Dealership Pro</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-wider text-zinc-900">Corporate Fleet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 text-xs">
              {FEATURE_MATRIX.map((feature, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="p-4 font-bold text-zinc-850 border-r border-zinc-100">
                    <div className="space-y-0.5">
                      <span>{feature.name}</span>
                      <p className="text-[10px] text-zinc-400 font-normal leading-normal max-w-sm">
                        {feature.tooltip}
                      </p>
                    </div>
                  </td>
                  
                  {/* Individual Plan */}
                  <td className="p-4 text-zinc-650 border-r border-zinc-100">
                    {typeof feature.individual === 'boolean' ? (
                      feature.individual ? (
                        <Check className="w-4 h-4 text-[#8B0000]" />
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )
                    ) : (
                      <span className="font-semibold text-zinc-850">{feature.individual}</span>
                    )}
                  </td>

                  {/* Business Plan */}
                  <td className="p-4 text-[#8B0000] font-semibold border-r border-zinc-100">
                    {typeof feature.business === 'boolean' ? (
                      feature.business ? (
                        <Check className="w-4 h-4 text-[#8B0000]" />
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )
                    ) : (
                      <span>{feature.business}</span>
                    )}
                  </td>

                  {/* Enterprise Plan */}
                  <td className="p-4 text-zinc-900 font-bold">
                    {typeof feature.enterprise === 'boolean' ? (
                      feature.enterprise ? (
                        <Check className="w-4 h-4 text-[#8B0000]" />
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )
                    ) : (
                      <span className="text-zinc-900 uppercase tracking-tight text-[10px] font-black">{feature.enterprise}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: GEOGRAPHIC ADVERTISING PACKAGES & PORTAL */}
      <section className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-10 max-w-6xl mx-auto space-y-10 relative shadow-sm">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-black tracking-tight text-[#8B0000] uppercase">
            Local Ad Targeted System
          </h2>
        </div>

        {/* Interactive Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          
          {/* Left Panel builder: 7 Cols */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 sm:p-6 space-y-5 text-xs shadow-sm">
            <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Target className="w-4 h-4 text-[#8B0000]" />
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-900">
                Test Your Local Ad Reach
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold uppercase text-zinc-400 block mb-1">Campaign Name</label>
                <input 
                  type="text" 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full bg-white border border-zinc-200 p-2.5 rounded-md text-zinc-900 font-bold outline-none focus:border-[#8B0000] text-xs"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-zinc-400 block mb-1">Target Region</label>
                <select
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  className="w-full bg-white border border-zinc-200 p-2.5 rounded-md text-zinc-900 font-bold outline-none focus:border-[#8B0000] text-xs"
                >
                  <option value="Central EU (PL, DE, LT)">Central EU (Poland, Germany, Lithuania)</option>
                  <option value="Northern EU (SE, FI, DK)">Northern EU (Sweden, Finland, Denmark)</option>
                  <option value="Western EU (FR, BE, NL)">Western EU (France, Belgium, Netherlands)</option>
                  <option value="North America (US East, US West)">North America (United States East & West)</option>
                  <option value="Sovereign United Kingdom (UK)">Sovereign United Kingdom (UK)</option>
                </select>
              </div>
            </div>

            {/* Slider targeting radius */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-zinc-400 uppercase tracking-wider">Target Area (Distance)</span>
                <span className="text-zinc-800 font-mono">{targetRadius} Kilometers</span>
              </div>
              <input 
                type="range" 
                min={10} 
                max={250} 
                value={targetRadius}
                onChange={(e) => setTargetRadius(parseInt(e.target.value))}
                className="w-full accent-[#8B0000] cursor-pointer h-1.5 bg-zinc-100 rounded-lg"
              />
              <span className="text-[9.5px] text-zinc-450 leading-normal block">
                Select how far around your shop or dealership you want to show your ads.
              </span>
            </div>

            {/* Brand filter checkbox targets */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold uppercase text-zinc-400 block">Select Car Brands to Target</label>
              <div className="flex flex-wrap gap-2 animate-in fade-in duration-200">
                {['Porsche', 'BMW', 'Tesla', 'Audi', 'Toyota', 'Volkswagen'].map(b => {
                  const active = targetBrands.includes(b);
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleBrandFilter(b)}
                      className={`px-3 py-1.5 rounded transition-all font-bold text-[10px] cursor-pointer ${
                        active 
                          ? 'bg-[#8B0000] text-white shadow-xs' 
                          : 'bg-zinc-50 text-zinc-500 border border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price model slider */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[9px] font-bold uppercase text-zinc-400 block mb-1 font-mono">Pricing Method</label>
                <div className="grid grid-cols-2 gap-1 bg-zinc-50 p-1 rounded border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setPricingModel('CPC')}
                    className={`py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                      pricingModel === 'CPC' ? 'bg-white text-[#8B0000] shadow-xs' : 'text-zinc-500'
                    }`}
                  >
                    Pay-per-Click (CPC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPricingModel('CPM')}
                    className={`py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                      pricingModel === 'CPM' ? 'bg-white text-[#8B0000] shadow-xs' : 'text-zinc-500'
                    }`}
                  >
                    Views (CPM)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold uppercase text-zinc-400 block mb-1 font-mono">Monthly Ad Budget</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min={100} 
                    max={2000} 
                    step={50}
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(parseInt(e.target.value))}
                    className="flex-1 accent-[#8B0000] cursor-pointer h-1.5 bg-zinc-150 rounded"
                  />
                  <span className="text-zinc-800 font-bold font-mono text-xs bg-zinc-50 border border-zinc-200 px-2 py-1 rounded w-16 text-center shrink-0">
                    €{monthlyBudget}
                  </span>
                </div>
              </div>
            </div>

            {/* Deploy Button */}
            <div className="pt-2 border-t border-zinc-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <span className="text-zinc-400 text-[10px]">
                *Requires active verified Dealership or Service status.
              </span>
              <button
                type="button"
                id="self-service-ad-portal-setup"
                onClick={() => {
                  setIsCampaignDeployed(true);
                  setTimeout(() => {
                    setIsCampaignDeployed(false);
                    alert(`Geographic Ad Campaign "${campaignName}" initialized inside regional sandbox! Matches found centering on radius: ${targetRadius}km targeting brand searches for: ${targetBrands.join(', ')}.`);
                  }, 1200);
                }}
                className="px-5 py-2.5 bg-[#8B0000] hover:bg-[#700000] active:scale-95 text-white font-bold tracking-wider uppercase rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-transparent shadow-sm"
              >
                {isCampaignDeployed ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Setting Up Campaign...
                  </>
                ) : (
                  <>
                    Save Ad Campaign Settings <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Live forecasting results: 5 Cols */}
          <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-6 flex flex-col justify-between text-xs space-y-5 shadow-sm">
            <div className="space-y-4">
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Here is what you can get every month based on your target region and settings:
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white p-3 rounded-lg border border-zinc-200 shadow-sm">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">ESTIMATED VIEWS</span>
                  <strong className="text-zinc-900 text-lg font-black font-mono block">
                    {computedReach.impressions.toLocaleString()}
                  </strong>
                  <span className="text-[9px] text-zinc-400">Views per month</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-zinc-200 shadow-sm">
                  <span className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">ESTIMATED VISITS</span>
                  <strong className="text-[#8B0000] text-lg font-black font-mono block">
                    {computedReach.clicks.toLocaleString()}
                  </strong>
                  <span className="text-[9px] text-zinc-400">Clicks/Visits per month</span>
                </div>
              </div>

              <div className="p-3 bg-white border border-zinc-150 rounded-lg shadow-xs space-y-1">
                <span className="text-[8px] text-zinc-400 font-bold uppercase font-mono block">Ad Cost Estimate</span>
                <div className="flex justify-between items-center font-bold text-[11px]">
                  <span className="text-zinc-500 font-normal">Average Ad Cost:</span>
                  <span className="text-[#8B0000] font-mono">{computedReach.avgCost}</span>
                </div>
              </div>
            </div>

            {/* Portal link box */}
            <div className="bg-white p-4 border border-zinc-200 rounded-lg space-y-2 shadow-xs">
              <h4 className="font-bold text-[10px] text-zinc-800 flex items-center gap-1.5 uppercase font-mono">
                <Globe className="w-3.5 h-3.5 text-[#8B0000]" /> Your Ad Dashboard
              </h4>
              <p className="text-[10px] text-zinc-500 leading-normal">
                Manage your ads, set up banner locations, and reach local car buyers easily.
              </p>
              <button
                type="button"
                onClick={() => alert("Directing to Advertiser Self-Service Portal authorization token step... Live setup environment validated.")}
                className="text-[10px] font-black text-[#8B0000] hover:text-black transition-colors uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer"
              >
                Go to Ad Dashboard <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

        {/* Static Row packages */}
        <div className="pt-4 border-t border-zinc-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AD_PACKAGES.map((pkg, i) => (
              <div key={i} className="bg-white p-5 rounded-xl border border-zinc-200 space-y-3 flex flex-col justify-between shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200">
                <div className="flex justify-between items-start gap-1">
                  <span className="text-[8px] font-bold uppercase text-[#8B0000] bg-white border border-zinc-200 px-2 py-0.5 rounded-md shadow-sm">
                    {pkg.badge}
                  </span>
                  <strong className="text-[#8B0000] text-sm font-mono font-black">€{pkg.cost} <span className="text-[9px] font-normal text-zinc-400">/ m</span></strong>
                </div>

                <div className="space-y-1">
                  <h4 className="text-zinc-850 font-black text-[11px] uppercase tracking-tight">{pkg.name}</h4>
                  <p className="text-[10px] text-zinc-500 leading-normal font-normal">{pkg.description}</p>
                </div>

                <div className="bg-red-50/10 border border-[#8B0000]/10 p-2.5 rounded-lg text-zinc-800 text-[10px] font-bold flex justify-between">
                  <span>{pkg.reach}</span>
                  <span className="text-zinc-400 font-normal">{pkg.radius}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: ENTERPRISE CONTACT FORM */}
      <section id="enterprise-contact-anchor" className="max-w-[750px] mx-auto px-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-6 sm:p-8 space-y-6 relative shadow-sm">
          <div className="text-center space-y-1">
            <h2 className="text-xl md:text-2xl font-black text-[#8B0000] uppercase flex items-center justify-center gap-1.5 animate-in fade-in">
              <Building className="w-5 h-5 text-[#8B0000]" /> Enterprise Plans
            </h2>
            <p className="text-zinc-500 text-xs max-w-md mx-auto leading-normal">
              Contact us for custom pricing, team plans, or high-volume history checks. We will reply fast.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!enterpriseSubmitted ? (
              <motion.form
                key="enterprise-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleEnterpriseSubmit}
                className="space-y-4 pt-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-[9px] font-bold uppercase text-zinc-450 block mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={enterpriseForm.contactName}
                      onChange={(e) => setEnterpriseForm({ ...enterpriseForm, contactName: e.target.value })}
                      className="w-full bg-white border border-zinc-250 p-2.5 rounded-lg outline-none font-bold text-zinc-800 focus:border-[#8B0000] text-xs"
                      placeholder="e.g. Stanislaw Grabowski"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase text-zinc-450 block mb-1">Company Name</label>
                    <input 
                      type="text" 
                      required
                      value={enterpriseForm.companyName}
                      onChange={(e) => setEnterpriseForm({ ...enterpriseForm, companyName: e.target.value })}
                      className="w-full bg-white border border-zinc-250 p-2.5 rounded-lg outline-none font-bold text-zinc-800 focus:border-[#8B0000] text-xs"
                      placeholder="e.g. Warsaw Lease SA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-[9px] font-bold uppercase text-zinc-450 block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={enterpriseForm.workEmail}
                      onChange={(e) => setEnterpriseForm({ ...enterpriseForm, workEmail: e.target.value })}
                      className="w-full bg-white border border-zinc-250 p-2.5 rounded-lg outline-none font-bold text-zinc-800 focus:border-[#8B0000] text-xs"
                      placeholder="e.g. grabowski@lease.pl"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase text-zinc-450 block mb-1">How Many Employees?</label>
                    <select
                      value={enterpriseForm.teamSize}
                      onChange={(e) => setEnterpriseForm({ ...enterpriseForm, teamSize: e.target.value })}
                      className="w-full bg-white border border-zinc-250 p-2.5 rounded-lg outline-none font-bold text-zinc-800 text-xs focus:border-[#8B0000]"
                    >
                      <option value="1-10">1 - 10 employees</option>
                      <option value="11-50">11 - 50 employees</option>
                      <option value="51-200">51 - 200 employees</option>
                      <option value="Over 200">Over 200 employees</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase text-zinc-450 block mb-1">How Many Reports per Month?</label>
                    <select
                      value={enterpriseForm.monthlyVolume}
                      onChange={(e) => setEnterpriseForm({ ...enterpriseForm, monthlyVolume: e.target.value })}
                      className="w-full bg-white border border-zinc-250 p-2.5 rounded-lg outline-none font-bold text-zinc-800 text-xs focus:border-[#8B0000]"
                    >
                      <option value="Under 200 scans">Under 200 scans / month</option>
                      <option value="200-500 scans">200 - 500 scans / month</option>
                      <option value="Over 500 scans">Over 500 scans / month</option>
                      <option value="Full Database Mirroring">Full Database Mirroring</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-zinc-450 block mb-1">How Can We Help You?</label>
                  <textarea 
                    rows={3}
                    value={enterpriseForm.customNotes}
                    onChange={(e) => setEnterpriseForm({ ...enterpriseForm, customNotes: e.target.value })}
                    className="w-full bg-white border border-zinc-250 p-2.5 rounded-lg outline-none text-zinc-800 focus:border-[#8B0000] text-xs leading-normal"
                    placeholder="Describe your custom requirements here..."
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    id="submit-enterprise-form"
                    className="px-6 py-2.5 bg-[#8B0000] hover:bg-[#700000] active:scale-97 text-white font-bold uppercase text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-transparent shadow-sm"
                  >
                    Send Request <Mail className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="enterprise-success"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-3"
              >
                <div className="w-10 h-10 bg-red-50 text-[#8B0000] border border-zinc-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-5 h-5 text-[#8B0000]" />
                </div>
                <div className="space-y-1 text-xs">
                  <strong className="text-[#8B0000] text-sm font-black uppercase block">Request Sent!</strong>
                  <p className="text-zinc-550 leading-relaxed font-light text-[11px] max-w-sm mx-auto">
                    We received your request. Our team will email you back within 1 business day.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEnterpriseSubmitted(false);
                    setEnterpriseForm({
                      contactName: '',
                      companyName: '',
                      workEmail: '',
                      teamSize: '11-50',
                      monthlyVolume: 'Over 500 scans',
                      customNotes: ''
                    });
                  }}
                  className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-850 font-bold uppercase text-[10px] tracking-wider rounded transition-all cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* FAQ SECTION */}
      <div className="max-w-[750px] mx-auto px-4 space-y-6">
        <h2 className="text-xl md:text-2xl font-black text-[#8B0000] tracking-tight text-center uppercase">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white border border-zinc-200 p-4 rounded-xl transition-all shadow-sm hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs font-bold text-zinc-900 cursor-pointer uppercase tracking-tight"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-[#8B0000] ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              
              {activeFaq === idx && (
                <p className="mt-2.5 text-[11px] text-zinc-500 leading-relaxed font-normal animate-in fade-in duration-200 pl-1">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SIGNUP FLOW MODAL OVERLAY */}
      <AnimatePresence>
        {showSignupModal && selectedSignupPlan && (
          <div className="fixed inset-0 bg-zinc-950/40 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-7 max-w-md w-full shadow-xl relative my-8"
              id="signup-flow-modal"
            >
              <button
                type="button"
                onClick={handleCloseSignup}
                className="text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 border border-zinc-200 absolute right-5 top-5 p-1.5 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Progress Stepper indicators */}
              <div className="flex items-center gap-1.5 pb-4 border-b-2 border-[#8B0000]/10 mb-4">
                <div className={`p-1.5 rounded-lg ${signupStep >= 1 ? 'bg-[#8B0000] text-white shadow-sm' : 'bg-zinc-150 text-zinc-400'}`}>
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className={`flex-1 h-0.5 ${signupStep >= 2 ? 'bg-[#8B0000]' : 'bg-zinc-150'}`}></div>
                <div className={`p-1.5 rounded-lg ${signupStep >= 2 ? 'bg-[#8B0000] text-white shadow-sm' : 'bg-zinc-150 text-zinc-400'}`}>
                  <Sliders className="w-3.5 h-3.5" />
                </div>
                <div className={`flex-1 h-0.5 ${signupStep >= 3 ? 'bg-[#8B0000]' : 'bg-zinc-150'}`}></div>
                <div className={`p-1.5 rounded-lg ${signupStep >= 3 ? 'bg-[#8B0000] text-white shadow-sm' : 'bg-zinc-150 text-zinc-400'}`}>
                  <DollarSign className="w-3.5 h-3.5" />
                </div>
                <div className={`flex-1 h-0.5 ${signupStep >= 4 ? 'bg-[#8B0000]' : 'bg-zinc-150'}`}></div>
                <div className={`p-1.5 rounded-lg ${signupStep === 4 ? 'bg-[#8B0000] text-white' : 'bg-zinc-150 text-zinc-400'}`}>
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* STEP 1: Details */}
              {signupStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-[#8B0000] uppercase tracking-widest font-mono">Step 1 of 3</span>
                    <h3 className="text-base font-black text-zinc-900 uppercase">Create Your Account</h3>
                    <p className="text-zinc-500 text-[11px]">
                      Enter your name, email, and password to start your subscription for <strong className="text-[#8B0000] font-black">{selectedSignupPlan.name}</strong>.
                    </p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); setSignupStep(2); }} className="space-y-3 text-xs">
                    <div>
                      <label className="text-[9px] font-bold uppercase text-zinc-450 block mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={signupForm.fullName}
                        onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                        className="w-full bg-white border border-zinc-200 p-2.5 rounded-lg outline-none font-bold text-zinc-900 focus:border-[#8B0000]"
                        placeholder="Elena Rostova"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase text-zinc-450 block mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="w-full bg-white border border-zinc-200 p-2.5 rounded-lg outline-none font-bold text-zinc-900 focus:border-[#8B0000]"
                        placeholder="elena@example.com"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="text-[9px] font-bold uppercase text-zinc-450 block mb-1">Password</label>
                        <input 
                          type="password" 
                          required
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          className="w-full bg-white border border-zinc-200 p-2.5 rounded-lg outline-none focus:border-[#8B0000]"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold uppercase text-zinc-450 block mb-1">Company name</label>
                        <input 
                          type="text" 
                          value={signupForm.companyName}
                          onChange={(e) => setSignupForm({ ...signupForm, companyName: e.target.value })}
                          className="w-full bg-white border border-zinc-200 p-2.5 rounded-lg outline-none font-bold text-zinc-900 focus:border-[#8B0000]"
                          placeholder="Optional"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 mt-4 bg-[#8B0000] hover:bg-[#700000] text-white font-bold text-xs uppercase tracking-wider rounded-lg border border-transparent shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Next Step <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </form>
                </div>
              )}

              {/* STEP 2: Configure Add-ons */}
              {signupStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-[#8B0000] uppercase tracking-widest font-mono">Step 2 of 3</span>
                    <h3 className="text-base font-black text-zinc-900 uppercase">Choose Extra Features</h3>
                    <p className="text-zinc-500 text-[11px]">
                      Choose any extra options you would like to add to your plan.
                    </p>
                  </div>

                  <div className="space-y-2">
                    
                    {/* Addon A */}
                    <div 
                      onClick={() => setSignupForm(prev => ({ ...prev, addonDirectSms: !prev.addonDirectSms }))}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        signupForm.addonDirectSms 
                          ? 'bg-red-50/10 border-[#8B0000] shadow-sm' 
                          : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={signupForm.addonDirectSms}
                        onChange={() => {}}
                        className="mt-0.5 accent-[#8B0000]"
                      />
                      <div className="space-y-0.5 text-xs">
                        <div className="flex justify-between items-center text-zinc-800">
                          <strong className="font-bold text-[11px] uppercase">SMS Alerts</strong>
                          <span className="text-[#8B0000] font-mono font-bold text-[10px] shrink-0 ml-1">+€12 / m</span>
                        </div>
                        <p className="text-zinc-550 leading-normal font-light text-[10px]">
                          Get immediate text alerts for safety recalls.
                        </p>
                      </div>
                    </div>

                    {/* Addon B */}
                    <div 
                      onClick={() => setSignupForm(prev => ({ ...prev, addonPriorityVerification: !prev.addonPriorityVerification }))}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        signupForm.addonPriorityVerification 
                          ? 'bg-red-50/10 border-[#8B0000] shadow-sm' 
                          : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={signupForm.addonPriorityVerification}
                        onChange={() => {}}
                        className="mt-0.5 accent-[#8B0000]"
                      />
                      <div className="space-y-0.5 text-xs">
                        <div className="flex justify-between items-center text-zinc-800">
                          <strong className="font-bold text-[11px] uppercase">Priority Processing</strong>
                          <span className="text-[#8B0000] font-mono font-bold text-[10px] shrink-0 ml-1">+€25 / m</span>
                        </div>
                        <p className="text-zinc-550 leading-normal font-light text-[10px]">
                          Get your car history reports much faster.
                        </p>
                      </div>
                    </div>

                    {/* Addon C */}
                    <div 
                      onClick={() => setSignupForm(prev => ({ ...prev, addonExtendedAnalytics: !prev.addonExtendedAnalytics }))}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        signupForm.addonExtendedAnalytics 
                          ? 'bg-red-50/10 border-[#8B0000] shadow-sm' 
                          : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        checked={signupForm.addonExtendedAnalytics}
                        onChange={() => {}}
                        className="mt-0.5 accent-[#8B0000]"
                      />
                      <div className="space-y-0.5 text-xs">
                        <div className="flex justify-between items-center text-zinc-800">
                          <strong className="font-bold text-[11px] uppercase">Marketplace Trends</strong>
                          <span className="text-[#8B0000] font-mono font-bold text-[10px] shrink-0 ml-1">+€15 / m</span>
                        </div>
                        <p className="text-zinc-550 leading-normal font-light text-[10px]">
                          See pricing trends and value estimates for cars.
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="flex gap-2 pt-3 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 rounded-lg font-bold text-xs uppercase cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupStep(3)}
                      className="flex-1 py-2.5 bg-[#8B0000] hover:bg-[#700000] text-white font-bold text-xs uppercase rounded-lg border border-transparent shadow-sm transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Continue <DollarSign className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Payment Checkout */}
              {signupStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-[#8B0000] uppercase tracking-widest font-mono">Step 3 of 3</span>
                    <h3 className="text-base font-black text-zinc-900 uppercase">Checkout</h3>
                    <p className="text-zinc-500 text-[11px]">
                      Review your order details below.
                    </p>
                  </div>

                  {/* Summary card */}
                  <div className="bg-white border border-zinc-200 p-4 rounded-xl text-xs space-y-2.5 shadow-sm">
                    <div className="flex justify-between items-center text-zinc-850">
                      <span>Subscription Plan:</span>
                      <strong className="text-[#8B0000] font-black uppercase">{selectedSignupPlan.name} ({billingCycle})</strong>
                    </div>

                    {/* Addons listing */}
                    {(signupForm.addonDirectSms || signupForm.addonPriorityVerification || signupForm.addonExtendedAnalytics) && (
                      <div className="border-t border-zinc-150 pt-2 space-y-1 text-[11px] text-zinc-600 font-mono">
                        <span className="text-zinc-400 block font-sans">Active Features:</span>
                        {signupForm.addonDirectSms && <div className="flex justify-between"><span>• SMS Alerts</span><span>+€12/m</span></div>}
                        {signupForm.addonPriorityVerification && <div className="flex justify-between"><span>• Priority Processing</span><span>+€25/m</span></div>}
                        {signupForm.addonExtendedAnalytics && <div className="flex justify-between"><span>• Marketplace Trends</span><span>+€15/m</span></div>}
                      </div>
                    )}

                    <div className="border-t border-zinc-200 pt-2 flex justify-between items-center text-[#8B0000] font-black text-xs uppercase">
                      <span>Total Cost:</span>
                      <span className="font-mono text-sm font-black">€{totalSignupPrice()} {billingCycle === 'monthly' ? '/ m' : '/ y'}</span>
                    </div>
                  </div>

                  {/* Simulated Card inputs */}
                  <div className="p-3.5 bg-zinc-50 border-2 border-[#8B0000]/10 rounded-xl text-xs space-y-2.5">
                    <div className="flex items-center gap-1 text-zinc-500 pb-1 border-b border-zinc-200">
                      <Lock className="w-3 h-3 text-[#8B0000]" />
                      <span className="text-[8px] font-bold uppercase tracking-wider">Simulated Stripe Connection</span>
                    </div>

                    <div>
                      <label className="text-[8.5px] font-bold uppercase text-zinc-450 block mb-0.5">Card Number (Mock)</label>
                      <input 
                        type="text" 
                        readOnly
                        value="4111 8920 1827 5012 (Mock Sandbox)"
                        className="w-full bg-white border border-zinc-200 p-2 rounded text-zinc-650 font-mono font-bold outline-none text-[11px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[8.5px] font-bold uppercase text-zinc-450 block mb-0.5">Expiry (Mock)</label>
                        <input 
                          type="text" 
                          readOnly
                          value="12/28"
                          className="w-full bg-white border border-zinc-200 p-2 rounded text-zinc-500 font-mono text-[11px]"
                        />
                      </div>
                      <div>
                        <label className="text-[8.5px] font-bold uppercase text-zinc-450 block mb-0.5">CVV (Mock)</label>
                        <input 
                          type="password" 
                          readOnly
                          value="999"
                          className="w-full bg-white border border-zinc-200 p-2 rounded text-zinc-500 font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => setSignupStep(2)}
                      className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 rounded-lg font-bold text-xs uppercase cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignupStep(4)}
                      className="flex-1 py-2.5 bg-[#8B0000] hover:bg-[#700000] text-white font-bold text-xs uppercase rounded-lg border border-transparent shadow-sm transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Pay and Activate <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Success card */}
              {signupStep === 4 && (
                <div className="space-y-4 text-center py-2 animate-in fade-in duration-300">
                  <div className="w-10 h-10 bg-red-50 text-[#8B0000] border border-zinc-200 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-5 h-5 text-[#8B0000]" />
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest font-mono">Payment Success!</span>
                    <h3 className="text-base font-black text-[#8B0000] uppercase">Your Plan is Ready!</h3>
                    <p className="text-zinc-500 leading-relaxed font-normal text-[11px] max-w-xs mx-auto">
                      Thank you, <strong className="font-bold text-zinc-750">{signupForm.fullName}</strong>. Your subscription for <strong className="text-[#8B0000] font-black">{selectedSignupPlan.name}</strong> is now active.
                    </p>
                  </div>

                  {/* Summary receipt details */}
                  <div className="max-w-xs mx-auto bg-white border border-zinc-200 rounded-xl p-3 text-left text-[11px] space-y-1.5 font-mono text-zinc-650 shadow-sm">
                    <div className="flex justify-between uppercase text-[9px]">
                      <span>Invoice code</span>
                      <span className="text-zinc-900 font-bold">INV-2026-6401B</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Login mapping:</span>
                      <strong className="text-zinc-850">{signupForm.email}</strong>
                    </div>

                    <div className="flex justify-between border-t border-zinc-200 pt-1.5 text-zinc-900 font-bold uppercase text-[10px]">
                      <span>Setup Billing:</span>
                      <span className="text-[#8B0000]">€{totalSignupPrice()}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleCloseSignup}
                      className="w-full py-2.5 bg-[#8B0000] hover:bg-[#700000] text-white font-bold text-xs uppercase rounded-lg border border-transparent shadow-sm transition-colors cursor-pointer"
                    >
                      Go to Workspace
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
