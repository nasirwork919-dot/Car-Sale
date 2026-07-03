import React, { useState } from 'react';
import { Shield, Key, Eye, EyeOff } from 'lucide-react';

export const AuthorityPortalLogin = () => {
    const [role, setRole] = useState('Center Manager');
    const [showPassword, setShowPassword] = useState(false);

    const roles = ['National Admin', 'Center Manager', 'Inspector'];

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 font-sans select-none" id="authority-login-root">
            <header className="mb-8 text-center">
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 font-bold uppercase block mb-1">State Registry Hub</span>
                <h1 className="text-xl font-semibold text-zinc-900 tracking-tight">JustCarSale</h1>
            </header>
            
            <div className="w-full max-w-sm bg-white p-7 rounded-3xl border border-zinc-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.015)]">
                <div className="text-center mb-6">
                    <h2 className="text-base font-semibold text-zinc-900 tracking-tight">Authority Portal</h2>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5 font-medium">Restricted Personnel Only</p>
                </div>

                <div className="mb-6">
                    <label className="text-[9px] font-bold text-zinc-450 uppercase tracking-wider block mb-2 text-center">AUTHENTICATION ROLE</label>
                    <div className="bg-zinc-100 p-0.5 rounded-full flex items-center border border-zinc-200/20">
                        {roles.map(r => (
                            <button 
                                key={r}
                                onClick={() => setRole(r)}
                                className={`flex-1 py-1.5 rounded-full text-[10px] font-semibold tracking-tight transition-all cursor-pointer ${
                                    role === r 
                                        ? 'bg-white text-zinc-950 shadow-[0_1px_3px_rgba(0,0,0,0.05)] font-bold' 
                                        : 'text-zinc-550 hover:text-zinc-900'
                                    }`}
                            >
                                {r.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>

                <form className="space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-1">
                        <label className="text-[8px] font-bold text-zinc-455 uppercase tracking-wider block pl-1">TERMINAL ID</label>
                        <input className="w-full h-11 bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 focus:border-zinc-500 rounded-xl px-3.5 text-xs font-medium focus:ring-1 focus:ring-zinc-400 outline-none transition-all placeholder:text-zinc-350 text-zinc-900" placeholder="Enter secure terminal ID" />
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[8px] font-bold text-zinc-455 uppercase tracking-wider block">AUTHORIZATION SECURE KEY</label>
                            <button className="text-[9px] font-semibold text-zinc-400 hover:text-zinc-900 transition-colors">Recovery</button>
                        </div>
                        <div className="relative">
                            <input 
                                className="w-full h-11 bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 focus:border-zinc-500 rounded-xl px-3.5 pr-10 text-xs font-mono focus:ring-1 focus:ring-zinc-400 outline-none transition-all placeholder:text-zinc-350 text-zinc-900" 
                                type={showPassword ? 'text' : 'password'} 
                                placeholder="••••••••••••" 
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-900 cursor-pointer transition-colors">
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                    </div>

                    <button className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 text-white rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm">
                        <span>Initiate Secure Session</span>
                        <Shield size={13} className="text-zinc-400" />
                    </button>
                </form>
            </div>
            
            <footer className="mt-8 text-center text-zinc-400 max-w-xs text-[10px] leading-relaxed">
                AUTHORIZED PERSONNEL ONLY. All access sessions are dynamically verified and cataloged under DMV audit standards.
            </footer>
        </div>
    );
};
