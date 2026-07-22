import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Sparkles, X, Milestone, CheckCircle, Shield, HelpCircle } from "lucide-react";

interface IdentityCompassWidgetProps {
  assessmentLevel: string | null;
  onNavigate: (tab: string) => void;
}

export default function IdentityCompassWidget({ assessmentLevel, onNavigate }: IdentityCompassWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Define colors based on mental assessment health index
  const getGlowColor = () => {
    if (assessmentLevel === "GREEN") return "shadow-emerald-500/30 border-emerald-500/40 text-emerald-500";
    if (assessmentLevel === "YELLOW") return "shadow-amber-500/30 border-amber-500/40 text-amber-500";
    if (assessmentLevel === "ORANGE") return "shadow-orange-500/30 border-orange-500/40 text-orange-500";
    if (assessmentLevel === "RED") return "shadow-rose-500/30 border-rose-500/40 text-rose-500";
    return "shadow-teal-500/20 border-teal-500/30 text-teal-500";
  };

  const getStatusLabel = () => {
    if (assessmentLevel === "GREEN") return "An toàn 🌱";
    if (assessmentLevel === "YELLOW") return "Cảnh báo nhẹ ⚠️";
    if (assessmentLevel === "ORANGE") return "Báo động 🚨";
    if (assessmentLevel === "RED") return "Nghiêm trọng 🛑";
    return "Chưa đo lường 🧭";
  };

  return (
    <div className="fixed bottom-8 left-8 z-[100] font-sans" id="identity-compass-widget">
      {/* Floating launcher button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`relative p-3.5 rounded-full bg-slate-900/95 dark:bg-slate-950/95 text-white shadow-2xl border flex items-center justify-center cursor-pointer select-none transition-colors group ${getGlowColor()}`}
        style={{
          boxShadow: "0 0 15px currentColor"
        }}
        title="La Bàn Định Vị Bản Ngã - Identity Compass"
      >
        <Compass className="w-6.5 h-6.5 text-emerald-400 animate-spin-slow group-hover:text-emerald-300" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
      </motion.button>

      {/* Expandable interface overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="absolute bottom-16 left-0 w-[310px] bg-slate-950/95 backdrop-blur-xl border border-white/10 rounded-[28px] p-5 shadow-2xl space-y-4 text-white overflow-hidden"
          >
            {/* Visual background glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
            
            {/* Decorative small glowing circular compass badge in the top-right corner */}
            <div 
              className="absolute top-3.5 right-12 w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center shadow-[0_0_12px_rgba(52,211,153,0.35)] select-none pointer-events-none z-20 animate-spin-slow"
              style={{ animationDuration: "15s" }}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
            </div>

            {/* Header section */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 relative z-10">
              <div className="flex items-center gap-1.5">
                <Compass className="w-5 h-5 text-emerald-400 animate-spin-slow" />
                <div>
                  <h4 className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">Identity Compass</h4>
                  <p className="text-[10px] text-slate-400">La Bàn Định Vị Bản Ngã</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Glowing compass visual component representing the four cardinal directions */}
            <div className="flex flex-col items-center justify-center py-2 relative">
              <div className="w-36 h-36 rounded-full border border-emerald-500/20 relative flex items-center justify-center bg-gradient-to-tr from-slate-900/40 to-emerald-950/20 shadow-inner">
                {/* Dial layout ticks */}
                <div className="absolute inset-0.5 rounded-full border border-dashed border-emerald-400/15 animate-spin-slow" />
                
                {/* Cardinal direction lines */}
                <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-emerald-500/10" />
                <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-emerald-500/10" />

                {/* Rotating center compass arrow */}
                <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 relative flex items-center justify-center z-10"
                >
                  {/* Neon Glow pointer */}
                  <svg className="w-full h-full drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" viewBox="0 0 100 100">
                    {/* Glowing Pointer */}
                    <polygon points="50,15 56,42 50,38 44,42" fill="#34D399" />
                    <polygon points="50,85 56,58 50,62 44,58" fill="#10B981" opacity="0.4" />
                    {/* Ring ticks */}
                    <circle cx="50" cy="50" r="30" stroke="#059669" strokeWidth="1" strokeDasharray="2, 4" fill="none" />
                  </svg>
                </motion.div>

                {/* Outer Labels pointing to 4 directions */}
                <span className="absolute -top-3 text-[9px] font-mono font-bold text-emerald-400 tracking-tight">D1: Định Vị</span>
                <span className="absolute -right-5 text-[9px] font-mono font-bold text-emerald-400 tracking-tight">D2: Chấp Nhận</span>
                <span className="absolute -bottom-3 text-[9px] font-mono font-bold text-emerald-400 tracking-tight">D3: Thanh Lọc</span>
                <span className="absolute -left-5 text-[9px] font-mono font-bold text-emerald-400 tracking-tight">D4: Hành Động</span>
              </div>
            </div>

            {/* Assessment health status banner */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-2.5 text-center relative z-10">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">Chỉ số bản ngã lúc này</span>
              <p className="text-sm font-black text-emerald-400 mt-0.5">{getStatusLabel()}</p>
            </div>

            {/* Quick navigators for the 4 compass dimensions */}
            <div className="space-y-1.5 relative z-10">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold block">4 Chặng Hành Trình</span>
              
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    onNavigate("self_discovery");
                    setIsOpen(false);
                  }}
                  className="p-2 text-left bg-white/5 hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/20 rounded-xl transition-all cursor-pointer"
                >
                  <span className="text-[9px] font-bold text-emerald-400 font-mono block">D1: Định Vị</span>
                  <span className="text-[10px] text-slate-300 font-medium truncate block">Trắc Nghiệm Bản Ngã</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate("mood");
                    setIsOpen(false);
                  }}
                  className="p-2 text-left bg-white/5 hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/20 rounded-xl transition-all cursor-pointer"
                >
                  <span className="text-[9px] font-bold text-emerald-400 font-mono block">D2: Chấp Nhận</span>
                  <span className="text-[10px] text-slate-300 font-medium truncate block">Nhật Ký Cảm Xúc</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate("space4d");
                    setIsOpen(false);
                  }}
                  className="p-2 text-left bg-white/5 hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/20 rounded-xl transition-all cursor-pointer"
                >
                  <span className="text-[9px] font-bold text-emerald-400 font-mono block">D3: Thanh Lọc</span>
                  <span className="text-[10px] text-slate-300 font-medium truncate block">Không Gian 4D</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate("gamification");
                    setIsOpen(false);
                  }}
                  className="p-2 text-left bg-white/5 hover:bg-emerald-950/40 border border-white/5 hover:border-emerald-500/20 rounded-xl transition-all cursor-pointer"
                >
                  <span className="text-[9px] font-bold text-emerald-400 font-mono block">D4: Hành Động</span>
                  <span className="text-[10px] text-slate-300 font-medium truncate block">Rèn Kỷ Luật 21 Ngày</span>
                </button>
              </div>
            </div>

            {/* Motivational message */}
            <p className="text-[9.5px] text-slate-400 font-light text-center leading-normal">
              La Bàn CoreZ định hướng tư duy và dẫn dắt cậu an tâm sinh trưởng từng ngày. 🌱
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
