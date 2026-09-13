'use client';

import React, { useState } from 'react';
import { ServerCog, ArrowRight, Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/register - in a real app this would call an API
    const displayName = isLogin ? (email.split('@')[0] || 'User') : name;
    localStorage.setItem('nexus_user', JSON.stringify({ name: displayName, email }));
    // Redirect to home page or dashboard
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#050A07] text-slate-200 font-sans selection:bg-emerald-500/40 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Dynamic Background Effects */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-6"
      >
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 p-[1px] shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            <div className="w-full h-full bg-[#050A07] rounded-xl flex items-center justify-center backdrop-blur-sm">
              <ServerCog size={24} className="text-emerald-400 drop-shadow-lg" />
            </div>
          </div>
          <span className="font-bold text-3xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/60">
            Nexus<span className="text-emerald-400 font-normal">LLD</span>
          </span>
        </div>

        {/* Auth Card */}
        <div className="bg-[#080C0A]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative ring-1 ring-white/5 overflow-hidden">
          {/* Card subtle glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm text-slate-400">
              {isLogin 
                ? 'Enter your credentials to access your workspace' 
                : 'Join NexusLLD to master system design'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: '1.25rem' }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                      <Mail size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all placeholder:text-slate-500"
                required
              />
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="relative overflow-hidden w-full group flex items-center justify-center space-x-2 bg-emerald-500 text-white px-5 py-3 rounded-xl text-sm font-bold transition-all hover:bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.3)] mt-2"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[sweep_1s_ease-in-out_infinite]" />
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 text-center relative z-10">
            <p className="text-sm text-slate-400">
              {isLogin ? "Don't have an account? " : "Already registered? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
                type="button"
              >
                {isLogin ? 'Sign up here' : 'Log in here'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
