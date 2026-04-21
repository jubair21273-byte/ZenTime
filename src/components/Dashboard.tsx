
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FocusSlot } from '../types';
import { Trophy, Target, Star, MoreHorizontal } from 'lucide-react';

const DATA = [
  { name: 'Mon', focus: 85, active: 4 },
  { name: 'Tue', focus: 70, active: 3 },
  { name: 'Wed', focus: 95, active: 6 },
  { name: 'Thu', focus: 60, active: 2 },
  { name: 'Fri', focus: 80, active: 5 },
  { name: 'Sat', focus: 20, active: 1 },
  { name: 'Sun', focus: 10, active: 0 },
];

interface DashboardProps {
  slots: FocusSlot[];
}

export default function Dashboard({ slots }: DashboardProps) {
  const activeCount = slots.filter(s => s.isActive).length;
  const totalAppsBlocked = slots.reduce((acc, s) => acc + s.blockedApps.length, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[2.2rem] bg-white/5 border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Target size={18} className="text-brand-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none">Active Logic Paths</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-serif italic text-white">{activeCount}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Foreground Service</span>
          </div>
        </div>

        <div className="p-8 rounded-[2.2rem] bg-brand-accent text-black space-y-3 shadow-2xl shadow-brand-accent/20">
          <div className="flex items-center gap-2 text-black/50 mb-2">
            <Star size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none">Locked Clusters</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-serif italic font-bold">{totalAppsBlocked}</span>
            <span className="text-[10px] font-bold uppercase tracking-tight opacity-60">Apps Restricted</span>
          </div>
        </div>

        <div className="p-8 rounded-[2.2rem] bg-white/5 border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Trophy size={18} className="text-brand-accent" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none">Focus Threshold</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-serif italic text-white">8<span className="text-2xl ml-1 text-slate-500">h</span></span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Weekly Baseline</span>
          </div>
        </div>
      </div>

      <div className="p-10 rounded-[2.8rem] bg-white/5 border border-white/10 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 blur-[100px] -z-10 rounded-full" />
        
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-2xl font-serif italic text-white">System Pulse</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-black mt-1">Resource Utilization & Efficiency</p>
          </div>
          <button className="p-3 rounded-xl hover:bg-white/5 text-slate-500 transition-colors">
            <MoreHorizontal size={24} />
          </button>
        </div>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DATA}>
              <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 900, fill: '#64748b', letterSpacing: '0.1em' }}
                dy={15}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                contentStyle={{ 
                  backgroundColor: '#0a0a0a', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)', 
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  color: '#fff'
                }}
              />
              <Bar dataKey="focus" radius={[8, 8, 8, 8]} barSize={40}>
                {DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.focus > 80 ? '#f59e0b' : 'rgba(255,255,255,0.1)'} fillOpacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
