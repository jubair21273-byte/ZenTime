import React, { useState, useMemo } from 'react';
import { LayoutGrid, Calendar, Settings as SettingsIcon, BrainCircuit, ShieldCheck, Zap, Menu } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ScheduleManager from './components/ScheduleManager';
import MobileSimulator from './components/MobileSimulator';
import SmartInsights from './components/SmartInsights';
import { FocusSlot } from './types';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'dashboard' | 'schedules' | 'insights' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [slots, setSlots] = useState<FocusSlot[]>([
    {
      id: '1',
      label: 'Evening Deep Work',
      startTime: '19:00',
      endTime: '21:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      blockedApps: ['com.instagram.android', 'com.zhiliaoapp.musically'],
      isActive: true
    }
  ]);

  // Determine if any slot is currently active based on system time (simulated)
  const activeFocusSlot = useMemo(() => {
    // In a real app, this would check Date.now() against slots
    // For the demo, we'll just pick the first active one
    return slots.find(s => s.isActive) || null;
  }, [slots]);

  const addSlot = (slot: FocusSlot) => setSlots(prev => [...prev, slot]);
  const deleteSlot = (id: string) => setSlots(prev => prev.filter(s => s.id !== id));
  const toggleSlot = (id: string) => setSlots(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'schedules', label: 'Schedules', icon: Calendar },
    { id: 'insights', label: 'Smart Insights', icon: BrainCircuit },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen flex bg-brand-bg md:p-6 lg:p-10 gap-10 text-slate-200">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 flex-col justify-between py-6">
        <div className="space-y-12">
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 rounded-2xl bg-brand-accent flex items-center justify-center text-black">
              <Zap size={22} className="fill-black" />
            </div>
            <div>
              <h1 className="font-serif italic text-2xl tracking-tight text-white">Focus Engine</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">System v4.2.0 • Pro</p>
            </div>
          </div>

          <nav className="space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-medium text-sm",
                  activeTab === tab.id 
                    ? "bg-white/10 text-white border border-white/10" 
                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                )}
              >
                <tab.icon size={20} className={activeTab === tab.id ? "text-brand-accent" : ""} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="px-4">
          <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-slate-300 space-y-3 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-accent/5 rounded-full blur-2xl group-hover:bg-brand-accent/10 transition-all" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase text-brand-accent font-bold tracking-tighter">Service Status</span>
              <div className="w-2 h-2 rounded-full bg-brand-accent shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
            </div>
            <div className="relative z-10">
              <p className="text-sm font-medium">Foreground Active</p>
              <p className="text-[10px] text-slate-500 mt-1">Monitoring encrypted app hooks.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl space-y-8 pb-32 md:pb-0">
        <header className="flex items-center justify-between lg:hidden p-4 bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-30">
           <div className="flex items-center gap-2">
             <Zap className="text-brand-accent" size={18} />
             <h1 className="font-serif italic text-lg text-white">Focus Engine</h1>
           </div>
           <Menu className="text-slate-400" />
        </header>

        <section className="px-4 lg:px-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard slots={slots} />}
              {activeTab === 'schedules' && <ScheduleManager slots={slots} onAdd={addSlot} onDelete={deleteSlot} onToggle={toggleSlot} />}
              {activeTab === 'insights' && <SmartInsights onSuggest={(s) => { addSlot(s as FocusSlot); setActiveTab('schedules'); }} />}
              {activeTab === 'settings' && (
                <div className="p-12 text-center border-2 border-dashed border-brand-primary/10 rounded-[3rem]">
                  <p className="text-brand-primary/40 font-serif italic text-lg">System Settings & App Preferences</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Mobile Simulator Panel - Fixed on right for Desktop */}
      <aside className="hidden xl:block w-[380px] sticky top-10 h-fit">
        <MobileSimulator activeSlot={activeFocusSlot} />
      </aside>

      {/* Mobile Nav - Mobile Only */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-brand-primary rounded-2xl flex items-center justify-around px-4 z-40 shadow-2xl shadow-brand-primary/40">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={cn(
              "p-3 rounded-xl transition-all",
              activeTab === tab.id ? "bg-white text-brand-primary" : "text-white/40"
            )}
          >
            <tab.icon size={20} />
          </button>
        ))}
      </nav>
    </div>
  );
}

