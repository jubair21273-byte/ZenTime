import { GoogleGenAI, Type } from "@google/genai";
import React, { useState } from "react";
import { Sparkles, ArrowRight, BrainCircuit, Loader2 } from "lucide-react";
import { FocusSlot } from "../types";
import { motion, AnimatePresence } from "motion/react";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface SmartInsightsProps {
  onSuggest: (suggestion: Partial<FocusSlot>) => void;
}

export default function SmartInsights({ onSuggest }: SmartInsightsProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);

  const getSmartSuggestion = async () => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Suggest a 1-hour focus session for a student who wants to master complex biology concepts. Include a catchy label, best time (evening), and common distracting apps to block. Return as JSON.",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              startTime: { type: Type.STRING },
              endTime: { type: Type.STRING },
              rationale: { type: Type.STRING },
              blockedApps: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["label", "startTime", "endTime", "rationale", "blockedApps"]
          }
        }
      });
      
      const data = JSON.parse(response.text || "{}");
      setSuggestion(data);
    } catch (error) {
      console.error("AI Insight Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 text-brand-accent">
        <BrainCircuit size={200} />
      </div>
      
      <div className="relative z-10 space-y-6">
        <div className="flex items-center gap-3 text-brand-accent">
          <Sparkles size={24} className="fill-brand-accent/20" />
          <h3 className="font-bold uppercase tracking-[0.4em] text-xs">Tactical Intelligence</h3>
        </div>
        
        {!suggestion ? (
          <div className="max-w-xl space-y-6">
            <p className="text-lg font-serif italic text-slate-300 leading-relaxed">
              Analyzing background processes and application heuristics to optimize your deep-work windows.
            </p>
            <button
              onClick={getSmartSuggestion}
              disabled={loading}
              className="flex items-center gap-3 bg-brand-accent text-black px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-50 shadow-xl shadow-brand-accent/20"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Query Neural Engine"}
              <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl space-y-6 max-w-2xl"
          >
            <div>
              <h4 className="font-serif italic text-3xl text-white">{suggestion.label}</h4>
              <p className="text-[10px] text-brand-accent font-black uppercase tracking-[0.3em] bg-brand-accent/10 inline-block px-3 py-1 rounded mt-3">
                Window: {suggestion.startTime} — {suggestion.endTime}
              </p>
            </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed italic border-l-2 border-brand-accent/30 pl-5 py-1">
              "{suggestion.rationale}"
            </p>
            <div className="flex justify-between items-center pt-6 border-t border-white/5">
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-500">Predicted Efficiency Increase: +42%</span>
              <button
                onClick={() => {
                  onSuggest({
                    label: suggestion.label,
                    startTime: suggestion.startTime,
                    endTime: suggestion.endTime,
                    blockedApps: ['com.instagram.android', 'com.zhiliaoapp.musically', 'com.google.android.youtube'],
                    days: ['Mon', 'Wed', 'Fri']
                  });
                  setSuggestion(null);
                }}
                className="text-white font-black text-[10px] uppercase tracking-widest hover:text-brand-accent transition-colors underline underline-offset-8 decoration-brand-accent/30"
              >
                Apply Protocol
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
