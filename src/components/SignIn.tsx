/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Shield, Briefcase, UserCheck, Lock, Landmark, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth, backendRoleToFrontend } from '../lib/AuthContext';
import { ApiError } from '../lib/api';

interface SignInProps {
  targetRole: 'personal' | 'business' | 'insurance' | 'government' | 'police';
  onSuccess: (role: 'personal' | 'business' | 'insurance' | 'government' | 'police') => void;
  onCancel: () => void;
}

export default function SignIn({ targetRole, onSuccess, onCancel }: SignInProps) {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'personal' | 'business' | 'insurance' | 'government' | 'police'>(targetRole);
  
  // Input fields for Personal Portal
  const [personalEmail, setPersonalEmail] = useState('');
  const [personalPass, setPersonalPass] = useState('');

  // Input fields for Business Portal
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessEin, setBusinessEin] = useState('');
  const [businessPass, setBusinessPass] = useState('');

  // Input fields for Insurance Portal
  const [insuranceEmail, setInsuranceEmail] = useState('');
  const [insuranceLicense, setInsuranceLicense] = useState('');
  const [insurancePass, setInsurancePass] = useState('');

  // Input fields for Government Portal
  const [govId, setGovId] = useState('');
  const [govKey, setGovKey] = useState('');

  // Input fields for Police Portal
  const [policeBadge, setPoliceBadge] = useState('');
  const [policeKey, setPoliceKey] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let email = '';
    let password = '';

    if (selectedRole === 'personal') {
      if (!personalEmail.includes('@') || personalPass.length < 4) {
        setErrorMsg('Invalid email format or password must be at least 4 characters.');
        return;
      }
      email = personalEmail;
      password = personalPass;
    } else if (selectedRole === 'business') {
      if (!businessEmail.includes('@') || !businessEin.trim() || businessPass.length < 4) {
        setErrorMsg('Company email, EIN Tax Code, and password are all required.');
        return;
      }
      email = businessEmail;
      password = businessPass;
    } else if (selectedRole === 'insurance') {
      if (!insuranceEmail.includes('@') || !insuranceLicense.trim() || insurancePass.length < 4) {
        setErrorMsg('Invalid organization email, Underwriter license code, or passcode.');
        return;
      }
      email = insuranceEmail;
      password = insurancePass;
    } else if (selectedRole === 'government') {
      if (!govId.trim() || !govKey.trim()) {
        setErrorMsg('Terminal ID and Authorization Key are required for Government Staff access.');
        return;
      }
      email = govId;
      password = govKey;
    } else if (selectedRole === 'police') {
      if (!policeBadge.trim() || !policeKey.trim()) {
        setErrorMsg('Officer Badge ID and Secure LEO passphrase are required for Police Force access.');
        return;
      }
      email = policeBadge;
      password = policeKey;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      const mappedRole = backendRoleToFrontend(user.role);
      onSuccess(mappedRole as 'personal' | 'business' | 'insurance' | 'government' | 'police');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unable to sign in. Please check your credentials.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 animate-in fade-in duration-300 select-none pb-16" id="separate-roles-signin-container">
      
      {/* Upper Brand / Welcome */}
      <div className="text-center mb-8 space-y-4">
        <div className="flex justify-center mb-1">
          <img 
            src="https://files.catbox.moe/jhta7v.png" 
            alt="Logo" 
            className="h-11 md:h-12 w-auto object-contain brightness-95"
            referrerPolicy="no-referrer" 
          />
        </div>
        <h2 className="text-zinc-900 text-2xl font-black tracking-tight font-display">
          Sign In to <span className="text-red-650">Your Workspace</span>
        </h2>
        <p className="text-zinc-500 text-[13px] font-medium max-w-sm mx-auto leading-relaxed">
          Access your personalized dashboard, inventory analytics, and tools.
        </p>
      </div>

      {/* Role Switcher Tabs (5 Separated Choices) */}
      <div className="bg-neutral-100 p-1.5 rounded-2xl md:rounded-full border border-neutral-200/40 grid grid-cols-2 md:grid-cols-5 gap-1.5 mb-6 font-semibold shadow-sm select-none">
        <button
          type="button"
          onClick={() => { setSelectedRole('personal'); setErrorMsg(null); }}
          className={`py-2 text-[10px] sm:text-xs rounded-xl md:rounded-full transition-all flex items-center justify-center gap-1.5 ${
            selectedRole === 'personal' ? 'bg-white text-black shadow-sm font-bold' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" /> Personal
        </button>
        <button
          type="button"
          onClick={() => { setSelectedRole('business'); setErrorMsg(null); }}
          className={`py-2 text-[10px] sm:text-xs rounded-xl md:rounded-full transition-all flex items-center justify-center gap-1.5 ${
            selectedRole === 'business' ? 'bg-white text-black shadow-sm font-bold' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> Business
        </button>
        <button
          type="button"
          onClick={() => { setSelectedRole('insurance'); setErrorMsg(null); }}
          className={`py-2 text-[10px] sm:text-xs rounded-xl md:rounded-full transition-all flex items-center justify-center gap-1.5 ${
            selectedRole === 'insurance' ? 'bg-white text-black shadow-sm font-bold' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Insurance
        </button>
        <button
          type="button"
          onClick={() => { setSelectedRole('government'); setErrorMsg(null); }}
          className={`py-2 text-[10px] sm:text-xs rounded-xl md:rounded-full transition-all flex items-center justify-center gap-1.5 ${
            selectedRole === 'government' ? 'bg-white text-black shadow-sm font-bold' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" /> Government
        </button>
        <button
          type="button"
          onClick={() => { setSelectedRole('police'); setErrorMsg(null); }}
          className={`py-2 text-[10px] sm:text-xs rounded-xl md:rounded-full transition-all flex items-center justify-center gap-1.5 col-span-2 md:col-span-1 ${
            selectedRole === 'police' ? 'bg-white text-black shadow-sm font-bold' : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Police
        </button>
      </div>

      {/* Form Container */}
      <div className="p-8 rounded-[28px] border transition-all duration-500 bg-white border-neutral-200/50 text-neutral-900 shadow-sm space-y-6">
        
        {/* Helper header based on role */}
        <div className="flex gap-3 items-center border-b pb-4 border-neutral-100">
          {selectedRole === 'personal' && (
            <>
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-black flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 font-sans">Consumer Portal</h4>
                <p className="text-[10px] text-neutral-450">Inspect personal history certificates &amp; purchase bids</p>
              </div>
            </>
          )}
          {selectedRole === 'business' && (
            <>
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-black flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 font-sans">Dealer Business Suite</h4>
                <p className="text-[10px] text-neutral-450">Audit bulk listings, escrow releases &amp; port customs</p>
              </div>
            </>
          )}
          {selectedRole === 'insurance' && (
            <>
              <div className="w-8 h-8 rounded-full bg-neutral-100 text-black flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 font-sans">Insurance &amp; Compliance Hub</h4>
                <p className="text-[10px] text-neutral-450">Review physical claims, VIN cloning alerts &amp; DMV checks</p>
              </div>
            </>
          )}
          {selectedRole === 'government' && (
            <>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 font-sans">Government Staff Hub</h4>
                <p className="text-[10px] text-neutral-450">Audit regulatory registration compliance &amp; emission records</p>
              </div>
            </>
          )}
          {selectedRole === 'police' && (
            <>
              <div className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-neutral-900 font-sans">Law Enforcement Desk</h4>
                <p className="text-[10px] text-zinc-500">Authorized police database check &amp; investigations</p>
              </div>
            </>
          )}
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-xs font-medium border border-red-100 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          
          {selectedRole === 'personal' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Registered Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                    value={personalEmail}
                    onChange={e => setPersonalEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                    value={personalPass}
                    onChange={e => setPersonalPass(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {selectedRole === 'business' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Authorized Company Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="partner@dealership.com"
                    className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                    value={businessEmail}
                    onChange={e => setBusinessEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Corporate EIN / Tax ID</label>
                <div className="relative">
                  <Landmark className="w-3.5 h-3.5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12-3456789"
                    className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full pl-10 pr-4 py-2.5 text-xs font-mono outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                    value={businessEin}
                    onChange={e => setBusinessEin(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Passcode</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                    value={businessPass}
                    onChange={e => setBusinessPass(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {selectedRole === 'insurance' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Underwriter Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="compliance@insurer-group.org"
                    className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                    value={insuranceEmail}
                    onChange={e => setInsuranceEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Underwriter License Number</label>
                <div className="relative">
                  <Landmark className="w-3.5 h-3.5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. INS-992-XYZ"
                    className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full pl-10 pr-4 py-2.5 text-xs font-mono outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                    value={insuranceLicense}
                    onChange={e => setInsuranceLicense(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Secure Passcode</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                    value={insurancePass}
                    onChange={e => setInsurancePass(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {selectedRole === 'government' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Government Terminal ID</label>
                <div className="relative">
                  <Landmark className="w-3.5 h-3.5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter secure terminal ID (e.g. GOV-453)"
                    className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                    value={govId}
                    onChange={e => setGovId(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Authorization Key</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-[#888890] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                    value={govKey}
                    onChange={e => setGovKey(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          {selectedRole === 'police' && (
            <>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Officer Badge / ID Number</label>
                <div className="relative">
                  <Shield className="w-3.5 h-3.5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter badge number (e.g. LEO-8820)"
                    className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                    value={policeBadge}
                    onChange={e => setPoliceBadge(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Secure LEO Passphrase</label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                    value={policeKey}
                    onChange={e => setPoliceKey(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-full font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 bg-black text-white hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  <span>Verifying credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to {selectedRole.toUpperCase()} Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 text-neutral-400 hover:text-black font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Security Disclaimer info block */}
      <div className="mt-6 text-center select-none space-y-1">
        <p className="text-[10px] text-neutral-400 font-medium">🔒 Secure &amp; Encrypted Connection</p>
        <p className="text-[9px] text-neutral-400 font-normal leading-relaxed">
          Sessions are isolated into separate sandboxes of JustCarSale registry databases. Backends never leak keys or cross-share user credentials.
        </p>
      </div>
    </div>
  );
}
