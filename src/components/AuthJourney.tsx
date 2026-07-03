/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, Lock, ArrowRight, ArrowLeft, CheckCircle, Shield, Briefcase, UserCheck, Landmark, AlertCircle } from 'lucide-react';
import { useAuth, frontendRoleToBackend } from '../lib/AuthContext';
import { ApiError } from '../lib/api';

interface AuthJourneyProps {
  onSuccess: (role: 'personal' | 'business' | 'insurance' | 'government' | 'police') => void;
}

export default function AuthJourney({ onSuccess }: AuthJourneyProps) {
  const { register, selectRole, completeProfile } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [intent, setIntent] = useState<'personal' | 'business' | 'insurance' | 'government' | 'police'>('personal');

  const [registering, setRegistering] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 2 OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpResendText, setOtpResendText] = useState('Resend Code');
  const [timerCount, setTimerCount] = useState(0);

  // Step 4 Business State
  const [companyName, setCompanyName] = useState('');
  const [businessType, setBusinessType] = useState('dealership');
  const [taxId, setTaxId] = useState('');

  const matchesLength = password.length >= 8;
  const matchesUpper = /[A-Z]/.test(password);
  const matchesNumber = /[0-9]/.test(password);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!(firstName && lastName && email && password)) {
      alert("Please ensure all required fields are filled.");
      return;
    }
    setRegistering(true);
    try {
      await register({ firstName, lastName, email, password, phone: phone || undefined });
      setStep(2);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unable to create your account. Please try again.';
      setErrorMsg(message);
    } finally {
      setRegistering(false);
    }
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const joinedOtp = otp.join('');
    if (joinedOtp.length === 6) {
      setStep(3);
    } else {
      alert("Please enter the complete 6-digit confirmation pin.");
    }
  };

  const handleIntentSelection = async (selected: 'personal' | 'business' | 'insurance' | 'government' | 'police') => {
    setIntent(selected);
    if (selected === 'personal') {
      onSuccess('personal');
      return;
    }
    if (selected === 'business' || selected === 'government') {
      setBusinessType('dealership');
      setStep(4);
      return;
    }
    if (selected === 'police') {
      alert('Registration successful! Police / Law Enforcement access requires manual provisioning by a system administrator — you will be notified once your credentials are activated.');
      onSuccess('police');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await selectRole(frontendRoleToBackend(selected));
      alert(`Registration successful! Your Insurance Portal underwriter access request has been submitted for admin approval. (${res.message})`);
      onSuccess(selected);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unable to select this account type. Please try again.';
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBusinessProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(companyName && taxId)) {
      alert("Please provide the organization name and ID.");
      return;
    }
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await completeProfile({ country: '', city: '' });
      if (intent === 'business') {
        const res = await selectRole(frontendRoleToBackend('business'));
        alert(`Registration complete! Corporate profile created for "${companyName}". ${res.message}`);
      } else {
        alert(`Registration complete! Profile created for "${companyName}". Government access requires manual provisioning by a system administrator — you will be notified once your credentials are activated.`);
      }
      onSuccess(intent);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Unable to complete your profile. Please try again.';
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpChange = (val: string, idx: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    const copy = [...otp];
    copy[idx] = val;
    setOtp(copy);

    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-input-${idx + 1}`);
      nextInput?.focus();
    }
  };

  const triggerResendCode = () => {
    setTimerCount(59);
    setOtpResendText('Code Sent!');
    const interval = setInterval(() => {
      setTimerCount(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setOtpResendText('Resend Code');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="max-w-xl mx-auto py-8 animate-in fade-in duration-300 text-slate-900" id="auth-journey-container">
      
      {/* Branding and Steps Indicator */}
      <div className="text-center mb-10 space-y-4">
        <div className="flex justify-center mb-1">
          <img 
            src="https://files.catbox.moe/jhta7v.png" 
            alt="Logo" 
            className="h-11 md:h-12 w-auto object-contain brightness-95"
            referrerPolicy="no-referrer" 
          />
        </div>
        <h2 className="text-zinc-900 text-xl font-extrabold tracking-tight">
          Create <span className="text-red-650">Your Workspace Profile</span>
        </h2>
        <p className="text-zinc-500 text-xs">Establish a profile for clean legal title clearances and marketplace queries.</p>

        {/* Global Progress Indicators */}
        <div className="flex justify-center items-center gap-1.5 pt-1">
          <div className={`h-1 rounded-full transition-all duration-350 ${step >= 1 ? 'bg-red-600 w-8' : 'bg-slate-200 w-4'}`}></div>
          <div className={`h-1 rounded-full transition-all duration-350 ${step >= 2 ? 'bg-red-600 w-8' : 'bg-slate-200 w-4'}`}></div>
          <div className={`h-1 rounded-full transition-all duration-350 ${step >= 3 ? 'bg-red-600 w-8' : 'bg-slate-200 w-4'}`}></div>
          <div className={`h-1 rounded-full transition-all duration-350 ${step >= 4 ? 'bg-red-600 w-8' : 'bg-slate-200 w-4'}`}></div>
        </div>
      </div>

      {step === 1 && (
        <fieldset className="bg-white p-8 rounded-[24px] border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#8B0000] tracking-tight">Create your credentials</h3>
            <p className="text-xs text-slate-400">Establish a profile for clean legal title clearances and marketplace queries.</p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-xs font-medium border border-red-100">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleStep1Submit} className="space-y-4 text-xs font-bold">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">First Name</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-red-105 text-slate-800"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Name</label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-red-105 text-slate-800"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Corporate/Gov Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@organization.gov"
                  className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-red-105 text-slate-800"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mobile Number (Optional)</label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+1 (555) 012-3456"
                  className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-red-105 text-slate-800"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Set Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-red-105 text-slate-800"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              {/* Password checks dashboard */}
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-[11px] text-slate-500 space-y-2">
                <div className={`flex items-center gap-2 ${matchesLength ? 'text-[#8B0000] font-semibold' : 'opacity-60'}`}>
                  <CheckCircle className={`w-3.5 h-3.5 ${matchesLength ? 'text-red-600' : 'text-slate-300'}`} /> Minimum 8 characters
                </div>
                <div className={`flex items-center gap-2 ${matchesUpper ? 'text-[#8B0000] font-semibold' : 'opacity-60'}`}>
                  <CheckCircle className={`w-3.5 h-3.5 ${matchesUpper ? 'text-red-600' : 'text-slate-300'}`} /> One uppercase letter
                </div>
                <div className={`flex items-center gap-2 ${matchesNumber ? 'text-[#8B0000] font-semibold' : 'opacity-60'}`}>
                  <CheckCircle className={`w-3.5 h-3.5 ${matchesNumber ? 'text-red-600' : 'text-slate-300'}`} /> One numerical digit
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={registering}
              className="w-full h-11 bg-[#8B0000] text-white rounded-full font-bold text-xs transition-all hover:bg-neutral-900 shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {registering ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  Continue <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="bg-white p-8 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-6 text-center">
          <div className="w-12 h-12 bg-neutral-50 border border-neutral-200 rounded-full flex items-center justify-center mx-auto text-black">
            <Mail className="w-5 h-5" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-neutral-900 tracking-tight">Check your inbox</h3>
            <p className="text-xs text-neutral-450 max-w-xs mx-auto leading-relaxed">
              We have dispatched a 6-digit verification code to <span className="font-semibold text-neutral-850">{email || 'm***@company.com'}</span>. Enter it now to approve registration.
            </p>
          </div>

          <form onSubmit={handleStep2Submit} className="space-y-6 max-w-sm mx-auto">
            <div className="flex justify-between gap-2 justify-center">
              {otp.map((item, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  maxLength={1}
                  className="w-10 h-11 bg-neutral-50 text-neutral-900 border border-neutral-200 rounded-xl text-center font-bold text-sm focus:bg-white focus:ring-4 focus:ring-black/5 outline-none transition-all"
                  value={item}
                  onChange={e => handleOtpChange(e.target.value, idx)}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                      const prevInput = document.getElementById(`otp-input-${idx - 1}`);
                      prevInput?.focus();
                    }
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-black text-white rounded-full font-semibold text-xs transition-all hover:opacity-90 shadow-sm flex items-center justify-center gap-1"
            >
              Approve &amp; Select Account Type <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-2 flex flex-col items-center gap-1 text-[11px]">
              <button
                type="button"
                className="text-black font-semibold hover:opacity-75"
                onClick={triggerResendCode}
                disabled={timerCount > 0}
              >
                {otpResendText}
              </button>
              {timerCount > 0 && (
                <span className="text-neutral-400">Cooldown period: {timerCount}s</span>
              )}
            </div>
          </form>

          <button onClick={() => setStep(1)} className="text-neutral-400 flex items-center gap-1 hover:text-neutral-600 text-xs font-semibold mx-auto transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to parameters
          </button>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset className="space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-1.5">
            <h3 className="text-xl font-bold text-neutral-900 tracking-tight">Select Account Profile Type</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              Your structural role guides compliance rules, escrow limitations, and freight authorization levels.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-xs font-medium border border-red-100 max-w-lg mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {submitting && (
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-neutral-500">
              <div className="w-3.5 h-3.5 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin"></div>
              <span>Submitting your account type...</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Card */}
            <div
              className={`p-6 rounded-[24px] bg-white border cursor-pointer transition-all flex flex-col justify-between text-left hover:border-black hover:shadow-sm ${
                intent === 'personal' ? 'border-2 border-black bg-neutral-50/50' : 'border-neutral-200/50'
              }`}
              onClick={() => handleIntentSelection('personal')}
            >
              <div>
                <div className="w-9 h-9 rounded-full bg-neutral-100 text-black flex items-center justify-center mb-4">
                  <UserCheck className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-neutral-900 text-sm mb-1">Personal</h4>
                <p className="text-neutral-500 text-[11px] leading-relaxed mb-4">
                  Acquire certified luxury inventory with integrated local registries and clean titles.
                </p>
              </div>
              <span className="text-[11px] font-bold text-black flex items-center gap-1">
                Select Personal profile <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Business Card */}
            <div
              className={`p-6 rounded-[24px] bg-white border cursor-pointer transition-all flex flex-col justify-between text-left hover:border-black hover:shadow-sm ${
                intent === 'business' ? 'border-2 border-black bg-neutral-50/50' : 'border-neutral-200/50'
              }`}
              onClick={() => handleIntentSelection('business')}
            >
              <div>
                <div className="w-9 h-9 rounded-full bg-neutral-100 text-black flex items-center justify-center mb-4">
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-neutral-900 text-sm mb-1">Business</h4>
                <p className="text-neutral-500 text-[11px] leading-relaxed mb-4">
                  Access whole-sale auctions, dispatch global auto shipments, and draft batch copy specifications.
                </p>
              </div>
              <span className="text-[11px] font-bold text-black flex items-center gap-1">
                Select Business profile <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Insurance Card */}
            <div
              className={`p-6 rounded-[24px] bg-white border cursor-pointer transition-all flex flex-col justify-between text-left hover:border-black hover:shadow-sm ${
                intent === 'insurance' ? 'border-2 border-black bg-neutral-50/50' : 'border-neutral-200/50'
              }`}
              onClick={() => handleIntentSelection('insurance')}
            >
              <div>
                <div className="w-9 h-9 rounded-full bg-neutral-100 text-black flex items-center justify-center mb-4">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-neutral-900 text-sm mb-1">Insurance</h4>
                <p className="text-neutral-500 text-[11px] leading-relaxed mb-4">
                  Validate underwriter credentials, authorize critical vehicle loss claims, and manage risk indexes.
                </p>
              </div>
              <span className="text-[11px] font-bold text-black flex items-center gap-1">
                Select Insurance profile <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Government Card */}
            <div
              className={`p-6 rounded-[24px] bg-white border cursor-pointer transition-all flex flex-col justify-between text-left hover:border-black hover:shadow-sm ${
                intent === 'government' ? 'border-2 border-black bg-neutral-50/50' : 'border-neutral-200/50'
              }`}
              onClick={() => handleIntentSelection('government')}
            >
              <div>
                <div className="w-9 h-9 rounded-full bg-neutral-100 text-black flex items-center justify-center mb-4">
                  <Landmark className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-neutral-900 text-sm mb-1">Government</h4>
                <p className="text-neutral-500 text-[11px] leading-relaxed mb-4">
                  Manage state vehicle registration compliance registries, emissions checks, and audit clearance processes.
                </p>
              </div>
              <span className="text-[11px] font-bold text-black flex items-center gap-1">
                Select Government profile <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            {/* Police Card */}
            <div
              className={`p-6 rounded-[24px] bg-white border cursor-pointer transition-all flex flex-col justify-between text-left hover:border-black hover:shadow-sm ${
                intent === 'police' ? 'border-2 border-black bg-neutral-50/50' : 'border-neutral-200/50'
              }`}
              onClick={() => handleIntentSelection('police')}
            >
              <div>
                <div className="w-9 h-9 rounded-full bg-neutral-100 text-black flex items-center justify-center mb-4">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <h4 className="font-bold text-neutral-900 text-sm mb-1">Police</h4>
                <p className="text-neutral-500 text-[11px] leading-relaxed mb-4">
                  Access restricted criminal investigations authority desks, wanted check bulletins, and hot lead watchlists.
                </p>
              </div>
              <span className="text-[11px] font-bold text-black flex items-center gap-1">
                Select Police profile <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </fieldset>
      )}

      {step === 4 && (
        <fieldset className="bg-white p-8 rounded-[24px] border border-neutral-200/50 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-neutral-900 tracking-tight">Activate Commercial Profile</h3>
            <p className="text-xs text-neutral-400">Specify institutional identifier numbers to bypass customs holds.</p>
          </div>

          <form onSubmit={handleBusinessProfileSubmit} className="space-y-5 text-xs font-semibold">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">Organization Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Liberty Automotive Group LLC / Dept of Transport"
                className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-black/5 text-neutral-900"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">Enterprise Category / Level</label>
                <select
                  className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/50 rounded-full px-3.5 py-2.5 text-xs text-neutral-700 outline-none transition-all cursor-pointer"
                  value={businessType}
                  onChange={e => setBusinessType(e.target.value)}
                >
                  <option value="dealership">Dealership / Reseller</option>
                  <option value="fleet_manager">Fleet Logistics Corporate</option>
                  <option value="logistics">Auto Dismantler Core</option>
                  <option value="insurance_verification">Insurance Underwriter / Claim Adjuster</option>
                  <option value="government_admin">Gov Administration</option>
                  <option value="government_inspector">Gov Field Officer</option>
                  <option value="police_investigator">Police LEO Criminal Intel</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 block uppercase tracking-wider">Tax / Registry ID</label>
                <input
                  type="text"
                  required
                  placeholder="ID-XXXXXXXXX"
                  className="w-full bg-neutral-50 border border-neutral-200/50 rounded-full px-4 py-2.5 text-xs font-mono text-neutral-900 focus:bg-white focus:ring-4 focus:ring-black/5 focus:ring-black/5 outline-none"
                  value={taxId}
                  onChange={e => setTaxId(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl text-[11px] text-neutral-500 flex gap-3 border border-neutral-200/20 leading-relaxed font-normal">
              <Shield className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
              <p>JustCarSale cross-checks organization identifiers automatically against state and federal registries. Access approvals complete typically under 2 hours.</p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 text-xs font-medium border border-red-100">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 bg-black text-white rounded-full font-semibold text-xs transition-all hover:opacity-90 shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                  <span>Activating...</span>
                </>
              ) : (
                <span>Verify &amp; Activate Portal</span>
              )}
            </button>
          </form>

          <button onClick={() => setStep(3)} className="text-neutral-400 flex items-center gap-1 hover:text-neutral-600 text-xs font-semibold mx-auto transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Account Type
          </button>
        </fieldset>
      )}
    </div>
  );
}
