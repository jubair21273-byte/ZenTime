
import React, { useState } from 'react';
import { Plus, X, Clock, Calendar, Shield, Trash2, Check, Smartphone } from 'lucide-react';
import { FocusSlot, INSTALLED_APPS } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ScheduleManagerProps {
  slots: FocusSlot[];
  onAdd: (slot: FocusSlot) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}

export default function ScheduleManager({ slots, onAdd, onDelete, onToggle }: ScheduleManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSlot, setNewSlot] = useState<Partial<FocusSlot>>({
    label: '',
    startTime: '19:00',
    endTime: '20:00',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    blockedApps: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.label || !newSlot.startTime || !newSlot.endTime) return;
    
    onAdd({
      ...newSlot as FocusSlot,
      id: Math.random().toString(36).substr(2, 9),
      isActive: true,
    });
    setIsAdding(false);
    setNewSlot({
      label: '',
      startTime: '19:00',
      endTime: '20:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      blockedApps: [],
    });
  };

  const toggleDay = (day: string) => {
    setNewSlot(prev => ({
      ...prev,
      days: prev.days?.includes(day) 
        ? prev.days.filter(d => d !== day) 
        : [...(prev.days || []), day]
    }));
  };

  const toggleApp = (appId: string) => {
    setNewSlot(prev => ({
      ...prev,
      blockedApps: prev.blockedApps?.includes(appId)
        ? prev.blockedApps.filter(id => id !== appId)
        : [...(prev.blockedApps || []), appId]
    }));
  };

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-serif font-medium italic text-white tracking-tight">Study Slots</h2>
          <p className="text-xs uppercase tracking-widest text-slate-500 mt-1">Active Monitoring Service</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-brand-accent text-black px-5 py-2.5 rounded-xl hover:opacity-90 transition-all font-bold uppercase tracking-widest text-[10px]"
        >
          <Plus size={16} />
          Create Slot
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-8 rounded-[2rem] bg-white/5 border border-white/10 shadow-2xl space-y-8"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-serif italic text-2xl text-white">New Focus Configuration</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Logic Label</label>
                <input
                  type="text"
                  value={newSlot.label}
                  onChange={e => setNewSlot(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g. Quantitative Analysis"
                  className="w-full bg-white/5 px-4 py-4 rounded-xl border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-accent transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Trigger Start</label>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={e => setNewSlot(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full bg-white/5 px-4 py-4 rounded-xl border border-white/10 text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Release End</label>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={e => setNewSlot(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full bg-white/5 px-4 py-4 rounded-xl border border-white/10 text-white focus:outline-none focus:border-brand-accent"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Temporal Recurrence</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "w-11 h-11 rounded-full text-[10px] font-bold uppercase tracking-tighter border transition-all",
                        newSlot.days?.includes(day)
                          ? "bg-brand-accent text-black border-brand-accent"
                          : "bg-transparent text-slate-500 border-white/10 hover:border-white/30"
                      )}
                    >
                      {day.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Access Restrictions</label>
                <div className="flex flex-wrap gap-2">
                  {INSTALLED_APPS.map(app => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => toggleApp(app.id)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-xl border transition-all",
                        newSlot.blockedApps?.includes(app.id)
                          ? "bg-brand-accent/10 border-brand-accent text-brand-accent"
                          : "bg-transparent border-white/10 text-slate-500 hover:border-white/30"
                      )}
                    >
                      <Shield size={14} className={newSlot.blockedApps?.includes(app.id) ? "fill-brand-accent" : ""} />
                      <span className="text-xs font-bold uppercase tracking-tight">{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-slate-200 transition-all shadow-2xl"
              >
                Deploy Focus Logic
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {slots.map(slot => (
          <motion.div
            layout
            key={slot.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "p-6 rounded-2xl border transition-all group relative overflow-hidden",
              slot.isActive ? "bg-white/5 border-white/10 shadow-lg" : "bg-transparent border-white/5 grayscale opacity-30"
            )}
          >
            {slot.isActive && <div className="absolute top-0 left-0 w-1 h-full bg-brand-accent"></div>}
            
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h4 className="font-serif italic text-xl text-white">{slot.label}</h4>
                  {slot.isActive && <span className="text-[9px] bg-brand-accent/10 text-brand-accent px-2 py-0.5 rounded font-black uppercase tracking-widest">Active</span>}
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-xs mt-1">
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-brand-accent" /> {slot.startTime} — {slot.endTime}</span>
                  <span className="flex items-center gap-1.5 font-medium tracking-tight uppercase text-[10px]">{slot.days.join(' · ')}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onToggle(slot.id)}
                  className="p-2 rounded-lg border border-white/5 hover:bg-white/5 transition-colors"
                >
                  <Check size={18} className={slot.isActive ? "text-brand-accent" : "text-slate-600"} />
                </button>
                <button
                  onClick={() => onDelete(slot.id)}
                  className="p-2 rounded-lg border border-white/5 hover:bg-red-500/10 text-red-500/50 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">Restricted Cluster:</span>
                <div className="flex -space-x-2">
                  {slot.blockedApps.map(appId => {
                    const app = INSTALLED_APPS.find(a => a.id === appId);
                    return (
                      <div key={appId} className="w-7 h-7 rounded-lg bg-black border border-white/10 flex items-center justify-center shadow-inner" title={app?.name}>
                        <Shield size={12} className="text-brand-accent fill-brand-accent/10" />
                      </div>
                    );
                  })}
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">System Lock Enabled</span>
            </div>
          </motion.div>
        ))}


        {slots.length === 0 && !isAdding && (
          <div className="text-center py-12 px-6 border-2 border-dashed border-brand-primary/10 rounded-3xl">
            <p className="text-brand-primary/40 italic font-serif">No study slots configured yet. Create one to start focusing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
