'use client';

import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, AlertCircle, Clock, FileWarning, Terminal, Sparkles, ServerCog } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const ScoreRing = ({ score }: { score: number }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-28 h-28 transform -rotate-90">
        <circle cx="56" cy="56" r={radius} className="stroke-white/5" strokeWidth="8" fill="transparent" />
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          cx="56"
          cy="56"
          r={radius}
          className="stroke-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]"
          strokeWidth="8"
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">{score}</span>
      </div>
    </div>
  );
};

export default function LldPracticePlatform() {
  const [problems, setProblems] = useState<any[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<any | null>(null);
  const [code, setCode] = useState<string>('');
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [attemptStatus, setAttemptStatus] = useState<string>('');
  const [report, setReport] = useState<any | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isAddingCustom, setIsAddingCustom] = useState<boolean>(false);
  const [customForm, setCustomForm] = useState({ title: '', statement: '', constraints: '', rubrics: '' });
  const [userName, setUserName] = useState<string | null>(null);

  const handleCreateCustom = async () => {
    if (!customForm.title || !customForm.statement) return;
    try {
      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: customForm.title,
          statement: customForm.statement,
          constraints: customForm.constraints.split(',').map(s => s.trim()).filter(Boolean),
          rubricContracts: customForm.rubrics.split(',').map(s => s.trim()).filter(Boolean),
          baselineExpectations: ['Single Responsibility Principle']
        })
      });
      const data = await res.json();
      if (data.success) {
        setProblems([...problems, data.problem]);
        setSelectedProblem(data.problem);
        setIsAddingCustom(false);
        setCustomForm({ title: '', statement: '', constraints: '', rubrics: '' });
        setCode(`class ${data.problem.title.replace(/\s+/g, '')} {\n  // Implementation here...\n}`);
        setReport(null);
        setAttemptStatus('');
      }
    } catch (e) {
      console.error('Failed to create custom problem', e);
    }
  };

  useEffect(() => {
    fetch('/api/problems')
      .then(res => res.json())
      .then(data => {
        setProblems(data);
        if (data.length > 0) {
          setSelectedProblem(data[0]);
          setCode(`class ${data[0].title.replace(/\s+/g, '')} {\n  // Implementation here...\n}`);
        }
      });
      
    // Check if user is logged in
    try {
      const userStr = localStorage.getItem('nexus_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setUserName(user.name);
      }
    } catch (e) {
      console.error('Failed to parse user data');
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (attemptId && isEvaluating) {
      interval = setInterval(async () => {
        const res = await fetch(`/api/attempts/${attemptId}`);
        const data = await res.json();
        setAttemptStatus(data._status);
        if (data._status === 'EVALUATED' || data._status === 'FAILED') {
          setIsEvaluating(false);
          if (data._report) {
            setReport(data._report);
          }
          clearInterval(interval);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [attemptId, isEvaluating]);

  const handleSubmit = async () => {
    if (!selectedProblem) return;
    setReport(null);
    setAttemptStatus('SUBMITTING...');
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: selectedProblem.id,
          userId: 'test-user-123',
          code
        })
      });
      const data = await res.json();
      setAttemptId(data.attemptId);
      setAttemptStatus(data.status);
    } catch (e) {
      console.error(e);
      setIsEvaluating(false);
      setAttemptStatus('FAILED TO SUBMIT');
    }
  };

  return (
    <div className="min-h-screen bg-[#050A07] text-slate-200 font-sans selection:bg-emerald-500/40 relative overflow-hidden flex flex-col">
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-500 p-[1px]">
              <div className="w-full h-full bg-black/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <ServerCog size={20} className="text-white drop-shadow-lg" />
              </div>
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/60">
              Nexus<span className="text-emerald-400 font-normal">LLD</span>
            </span>
          </div>
          <div className="flex items-center space-x-4 text-sm font-medium">
            {userName ? (
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center cursor-pointer hover:bg-white/10 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                {userName}
              </motion.div>
            ) : (
              <Link href="/login">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center cursor-pointer hover:bg-emerald-500/30 transition-colors shadow-[0_0_15px_rgba(52,211,153,0.15)]"
                >
                  Sign In
                </motion.div>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-[1400px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 w-full min-h-0 relative z-10">
        
        {/* Left Column: Problem Statement or Add Custom Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-4 flex flex-col space-y-6"
        >
          <div className="flex flex-col space-y-8 h-full">
            {/* Problem Selector */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                Select Project
              </h3>
              <div className="flex flex-wrap gap-2">
                {problems.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setIsAddingCustom(false);
                      setSelectedProblem(p);
                      setCode(`class ${p.title.replace(/\s+/g, '')} {\n  // Implementation here...\n}`);
                      setReport(null);
                      setAttemptStatus('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${!isAddingCustom && selectedProblem?.id === p.id ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent'}`}
                  >
                    {p.title}
                  </button>
                ))}
                <button
                  onClick={() => setIsAddingCustom(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${isAddingCustom ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-transparent'}`}
                >
                  + Custom Project
                </button>
              </div>
            </div>

            {isAddingCustom ? (
              <div className="flex flex-col space-y-4">
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight drop-shadow-sm">Create Project</h2>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={customForm.title}
                  onChange={(e) => setCustomForm({...customForm, title: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
                <textarea
                  placeholder="Problem Statement"
                  value={customForm.statement}
                  onChange={(e) => setCustomForm({...customForm, statement: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white h-24 resize-none focus:outline-none focus:border-emerald-500/50"
                />
                <input
                  type="text"
                  placeholder="Constraints (comma separated)"
                  value={customForm.constraints}
                  onChange={(e) => setCustomForm({...customForm, constraints: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
                <input
                  type="text"
                  placeholder="Rubric Contracts (comma separated)"
                  value={customForm.rubrics}
                  onChange={(e) => setCustomForm({...customForm, rubrics: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
                <button
                  onClick={handleCreateCustom}
                  className="mt-4 px-4 py-2 bg-emerald-500 text-black font-bold rounded-lg text-sm hover:bg-emerald-400 transition-colors"
                >
                  Create & Load Project
                </button>
              </div>
            ) : selectedProblem ? (
              <>
                <div>
                  <h2 className="text-4xl font-black text-white mb-4 tracking-tight drop-shadow-sm">{selectedProblem.title}</h2>
                  <p className="text-slate-400 leading-relaxed text-base">{selectedProblem.statement}</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                    <div className="h-px bg-slate-700 flex-1 mr-4" />
                    Constraints
                  </h3>
                  <ul className="space-y-3">
                    {selectedProblem.constraints.map((c: string, i: number) => (
                      <motion.li 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        key={i} 
                        className="flex items-start text-sm text-slate-300 group"
                      >
                        <div className="mt-1 mr-3 w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(52,211,153,0.6)] shrink-0" />
                        <span className="leading-relaxed">{c}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4 pb-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                    <div className="h-px bg-slate-700 flex-1 mr-4" />
                    Rubric Requirements
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProblem.rubricContracts.map((r: string, i: number) => (
                      <motion.div 
                        whileHover={{ scale: 1.05, y: -2 }}
                        key={i} 
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-200 text-xs font-medium shadow-sm cursor-default"
                      >
                        {r}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </motion.div>

        {/* Right Column: Editor & Feedback */}
        <div className="lg:col-span-8 flex flex-col space-y-6 min-h-0 h-full overflow-y-auto custom-scrollbar pr-2 pb-8">
          
          {/* Mac-Style Editor */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 min-h-[400px] flex flex-col bg-[#080C0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative ring-1 ring-white/5"
          >
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/5">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1.5 mr-4">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="px-3 py-1 bg-white/5 rounded-md flex items-center border border-white/5">
                  <Terminal size={12} className="text-slate-400 mr-2" />
                  <span className="text-xs font-mono text-slate-300">solution.ts</span>
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={isEvaluating}
                className="relative overflow-hidden group flex items-center space-x-2 bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.3)]"
              >
                {/* Button Hover Sweep Effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[sweep_1s_ease-in-out_infinite]" />
                
                {isEvaluating ? (
                  <>
                    <Clock size={16} className="animate-spin" />
                    <span>{attemptStatus}</span>
                  </>
                ) : (
                  <>
                    <Play size={16} fill="currentColor" />
                    <span>Evaluate Design</span>
                  </>
                )}
              </button>
            </div>
            
            {/* Editor Textarea */}
            <div className="flex flex-1 relative">
              {/* Fake line numbers */}
              <div className="w-12 bg-black/20 border-r border-emerald-900/30 flex flex-col items-end py-4 pr-3 text-xs font-mono text-slate-600 select-none">
                {[...Array(15)].map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full min-h-[350px] bg-transparent text-slate-300 font-mono text-sm p-4 leading-relaxed focus:outline-none resize-none custom-scrollbar"
                spellCheck={false}
              />
            </div>
          </motion.div>

          {/* Feedback Panel */}
          <AnimatePresence>
            {report && (
               <motion.div 
                 initial={{ opacity: 0, y: 40, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                 className="bg-gradient-to-br from-[#0A120E] to-[#050A07] border border-emerald-900/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
               >
                 {/* Decorative background glow inside panel */}
                 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px]" />
                 
                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6 relative z-10">
                   <div>
                     <h3 className="text-2xl font-bold text-white mb-2 flex items-center">
                       Architecture Review
                     </h3>
                     <p className="text-sm text-slate-400">Detailed static analysis and AI-driven SOLID critique.</p>
                   </div>
                   
                   <div className="flex items-center space-x-6 bg-black/40 p-4 rounded-2xl border border-emerald-900/50 shadow-inner">
                     <div className="text-right">
                       <div className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-1">Quality Score</div>
                       <div className="text-sm text-emerald-400 font-medium">Top 15%</div>
                     </div>
                     <ScoreRing score={report.designQualityScore} />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 relative z-10">
                   {/* Deterministic Checks */}
                   <div className="space-y-5">
                      <div className="flex items-center space-x-2 text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-white/10 pb-3">
                        <CheckCircle size={16} className="text-emerald-400" />
                        <span>Static Analysis</span>
                      </div>
                      <div className="space-y-3">
                        {report.deterministicChecks.map((check: any, i: number) => (
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            key={i} 
                            className={`p-4 rounded-xl border backdrop-blur-md ${check.passed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'} flex items-start group hover:scale-[1.01] transition-transform`}
                          >
                            <div className={`mt-0.5 mr-3 shrink-0 p-1 rounded-full ${check.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                              {check.passed ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                            </div>
                            <div>
                              <div className={`text-sm font-semibold mb-1 ${check.passed ? 'text-emerald-200' : 'text-rose-200'}`}>{check.rule}</div>
                              <div className="text-xs text-slate-400 leading-relaxed">{check.message}</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                   </div>

                   {/* Actionable Advice */}
                   <div className="space-y-5">
                      <div className="flex items-center space-x-2 text-sm font-bold text-slate-300 uppercase tracking-widest border-b border-white/10 pb-3">
                        <Sparkles size={16} className="text-teal-400" />
                        <span>AI Design Critique</span>
                      </div>
                      <div className="space-y-3">
                        {report.solidViolations.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20 shadow-inner"
                          >
                             <div className="text-sm font-bold text-orange-300 flex items-center mb-2">
                               <FileWarning size={16} className="mr-2" /> SOLID Violations Detected
                             </div>
                             <ul className="list-disc pl-6 text-xs text-orange-200/80 space-y-1.5 leading-relaxed">
                               {report.solidViolations.map((v: string, i: number) => <li key={i}>{v}</li>)}
                             </ul>
                          </motion.div>
                        )}
                        
                        {report.actionableAdvice.map((advice: any, i: number) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                            key={i} 
                            className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/30 transition-colors"
                          >
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold tracking-widest uppercase bg-emerald-500/20 text-emerald-300 mb-2">
                              {advice.category}
                            </span>
                            <p className="text-sm text-emerald-100/70 leading-relaxed">{advice.suggestion}</p>
                          </motion.div>
                        ))}
                      </div>
                   </div>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
        
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
