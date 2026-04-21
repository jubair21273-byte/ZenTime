
import React, { useState, useEffect } from 'react';
import { Shield, Lock, Smartphone, Wifi, Battery, Clock, Bell, Signal } from 'lucide-react';
import { FocusSlot, INSTALLED_APPS } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface MobileSimulatorProps {
  activeSlot: FocusSlot | null;
}

export default function MobileSimulator({ activeSlot }: MobileSimulatorProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [openingApp, setOpeningApp] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAppClick = (appId: string) => {
    setOpeningApp(appId);
    
    // Simulate app opening delay
    setTimeout(() => {
      if (activeSlot?.blockedApps.includes(appId)) {
        setIsBlocked(true);
      } else {
        // Just briefly show "app opened"
        setTimeout(() => setOpeningApp(null), 2000);
      }
    }, 500);
  };

  const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="relative mx-auto w-[320px] h-[650px] bg-[#0a0a0a] rounded-[3.5rem] p-3 shadow-[0_0_80px_rgba(0,0,0,0.8)] border-2 border-white/5 flex-shrink-0">
      {/* Device Notches & Buttons */}
      <div className="absolute -left-1 top-24 w-1 h-12 bg-white/5 rounded-l-md" />
      <div className="absolute -left-1 top-40 w-1 h-20 bg-white/5 rounded-l-md" />
      <div className="absolute -right-1 top-32 w-1 h-24 bg-white/5 rounded-r-md" />
      
      {/* Screen */}
      <div className="w-full h-full bg-[#050505] rounded-[2.8rem] overflow-hidden relative flex flex-col border border-white/5">
        {/* Status Bar */}
        <div className="h-10 flex items-center justify-between px-7 pt-3 z-20">
          <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{timeString}</span>
          <div className="flex items-center gap-2 text-slate-600">
            <Signal size={10} />
            <Wifi size={10} />
            <Battery size={10} className="rotate-90" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 grid grid-cols-4 gap-5 auto-rows-min mt-4">
          {INSTALLED_APPS.map(app => (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              className="group flex flex-col items-center gap-2 transition-transform active:scale-95"
            >
              <div className="w-13 h-13 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl relative overflow-hidden group-hover:border-white/20 transition-all">
                <div className="absolute inset-0 bg-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Shield size={22} className={cn("text-slate-700 transition-colors", activeSlot?.blockedApps.includes(app.id) && "text-brand-accent opacity-40")} />
              </div>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter truncate w-full text-center group-hover:text-slate-300 transition-colors">{app.name}</span>
            </button>
          ))}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/10 rounded-full" />

        {/* Blocking Overlay */}
        <AnimatePresence>
          {isBlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-24 h-24 rounded-full bg-brand-accent flex items-center justify-center mb-10 shadow-[0_0_100px_rgba(245,158,11,0.2)]"
              >
                <Lock size={44} className="text-black" />
              </motion.div>
              
              <motion.h3
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white text-3xl font-serif italic mb-3"
              >
                Focus Invariant
              </motion.h3>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-1 mb-16"
              >
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Protocol Active</p>
                <p className="text-brand-accent text-lg font-serif italic">"{activeSlot?.label}"</p>
              </motion.div>
              
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => {
                  setIsBlocked(false);
                  setOpeningApp(null);
                }}
                className="w-full py-4 rounded-xl border border-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white/5 transition-all shadow-xl"
              >
                Resume Deep Work
              </motion.button>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 0.6 }}
                className="mt-12 flex items-center gap-2 text-slate-600"
              >
                <Clock size={12} />
                <span className="text-[10px] font-black tracking-widest uppercase">Release at {activeSlot?.endTime}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Spinner for app opening */}
        <AnimatePresence>
          {openingApp && !isBlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center gap-4"
            >
              <div className="w-10 h-10 border-2 border-white/5 border-t-brand-accent rounded-full animate-spin" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Initiating App Hook...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Caption */}
      <div className="absolute -bottom-20 left-0 right-0 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md">
          <Smartphone size={14} className="text-brand-accent" />
          Hardware Simulation
        </div>
      </div>
    </div>
  );
}
