import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, RefreshCw, Sparkles, Wind, AlertCircle } from "lucide-react";

interface BreathExercisePopupProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string; // e.g., "Dành cho cậu vì dữ liệu cảm xúc 3 ngày qua hơi chông chênh"
  onComplete?: () => void;
}

type Phase = "idle" | "inhale" | "hold1" | "exhale" | "hold2" | "completed";

export default function BreathExercisePopup({ isOpen, onClose, reason, onComplete }: BreathExercisePopupProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds total
  const [phaseTimer, setPhaseTimer] = useState(4); // 4 seconds per phase
  const [cycleCount, setCycleCount] = useState(0);

  // Box breathing timings: 4s inhale, 4s hold, 4s exhale, 4s hold
  useEffect(() => {
    if (!isOpen || phase === "idle" || phase === "completed") return;

    const mainInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setPhase("completed");
          if (onComplete) onComplete();
          clearInterval(mainInterval);
          return 0;
        }
        return prev - 1;
      });

      setPhaseTimer((prev) => {
        if (prev <= 1) {
          // Switch to next phase
          setPhase((currentPhase) => {
            switch (currentPhase) {
              case "inhale":
                return "hold1";
              case "hold1":
                return "exhale";
              case "exhale":
                return "hold2";
              case "hold2":
                setCycleCount((c) => c + 1);
                return "inhale";
              default:
                return "inhale";
            }
          });
          return 4; // Reset to 4 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(mainInterval);
  }, [isOpen, phase]);

  const handleStart = () => {
    setPhase("inhale");
    setTimeLeft(60);
    setPhaseTimer(4);
    setCycleCount(0);
  };

  const handleReset = () => {
    setPhase("idle");
    setTimeLeft(60);
    setPhaseTimer(4);
    setCycleCount(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Hít vào thật sâu...";
      case "hold1":
        return "Nín thở tĩnh tâm...";
      case "exhale":
        return "Thở ra nhẹ nhàng...";
      case "hold2":
        return "Nín thở thư giãn...";
      case "completed":
        return "Hoàn thành tuyệt vời!";
      default:
        return "Sẵn sàng?";
    }
  };

  const getPhaseDesc = () => {
    switch (phase) {
      case "inhale":
        return "Cảm nhận không khí mát lành căng tràn lồng ngực";
      case "hold1":
        return "Giữ khí trong lành, xoa dịu các tế bào thần kinh";
      case "exhale":
        return "Giải phóng mọi lo âu, áp lực và mệt mỏi ra ngoài";
      case "hold2":
        return "Tâm trí hoàn toàn phẳng lặng, bình yên";
      case "completed":
        return "Cảm ơn cậu đã dành ra 1 phút quý giá quay về chăm sóc bản thân.";
      default:
        return "Phương pháp hít thở hộp (Box Breathing) 4-4-4-4 giúp ổn định nhịp tim tức thì.";
    }
  };

  // Outer scale for circular expander
  const getCircleScale = () => {
    switch (phase) {
      case "inhale":
        return 1.4; // Expand
      case "hold1":
        return 1.4; // Stay expanded
      case "exhale":
        return 0.95; // Shrink
      case "hold2":
        return 0.95; // Stay shrunk
      default:
        return 1.0;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white rounded-[32px] p-6 shadow-2xl relative overflow-hidden"
          >
            {/* Healing Background glows */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute top-[-20%] left-[-20%] w-48 h-48 bg-emerald-300/20 blur-2xl rounded-full" />
              <div className="absolute bottom-[-20%] right-[-20%] w-48 h-48 bg-teal-300/15 blur-2xl rounded-full" />
            </div>

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
              <div className="flex items-center gap-2">
                <Wind className="w-5.5 h-5.5 text-emerald-500 animate-pulse" />
                <h4 className="font-serif text-base font-bold text-slate-800">1 Phút Hít Thở Hộp 4D</h4>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center space-y-6 py-2">
              
              {/* Suggestion Notification (if triggered by bad logs) */}
              {reason && phase === "idle" && (
                <div className="flex items-start gap-2 bg-emerald-50/80 border border-emerald-100/50 rounded-2xl p-3 text-left w-full">
                  <AlertCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-emerald-700 font-medium leading-relaxed">
                    {reason}
                  </p>
                </div>
              )}

              {/* Box Breathing Animation Container */}
              <div className="relative w-44 h-44 flex items-center justify-center">
                
                {/* Expanding Glow Pulse Ring */}
                <AnimatePresence>
                  {(phase === "inhale" || phase === "hold1") && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: [0.15, 0.4, 0.15], scale: [1, 1.6, 1] }}
                      exit={{ opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full bg-emerald-100/75 z-0"
                    />
                  )}
                </AnimatePresence>

                {/* Main Expander Circle */}
                <motion.div
                  animate={{ scale: getCircleScale() }}
                  transition={{ duration: phase === "hold1" || phase === "hold2" ? 0 : 4, ease: "easeInOut" }}
                  className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border shadow-lg z-10 transition-colors duration-1000 ${
                    phase === "inhale" ? "bg-emerald-500/10 border-emerald-400" :
                    phase === "hold1" ? "bg-amber-500/10 border-amber-400" :
                    phase === "exhale" ? "bg-teal-500/10 border-teal-400" :
                    phase === "hold2" ? "bg-sky-500/10 border-sky-400" :
                    phase === "completed" ? "bg-emerald-500 text-white border-emerald-500" :
                    "bg-white border-slate-200"
                  }`}
                >
                  {phase === "idle" ? (
                    <button
                      onClick={handleStart}
                      className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 transition-all hover:scale-105 active:scale-95 shadow-md shadow-emerald-200 cursor-pointer"
                    >
                      <Play className="w-7 h-7 fill-white ml-1" />
                    </button>
                  ) : phase === "completed" ? (
                    <motion.div 
                      initial={{ scale: 0.5 }} 
                      animate={{ scale: 1 }} 
                      className="flex flex-col items-center"
                    >
                      <Sparkles className="w-8 h-8 text-yellow-300 animate-spin-slow" />
                      <span className="text-[11px] font-bold mt-1 uppercase tracking-wider">Xong!</span>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-bold font-mono text-slate-800">
                        {phaseTimer}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">
                        giây
                      </span>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Interactive Status text */}
              <div className="space-y-1.5 w-full">
                <h5 className="font-serif text-base sm:text-lg font-bold text-slate-800 min-h-[28px] transition-all">
                  {getPhaseText()}
                </h5>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed min-h-[40px] transition-all font-light">
                  {getPhaseDesc()}
                </p>
              </div>

              {/* Progress and Stats */}
              {phase !== "idle" && phase !== "completed" && (
                <div className="w-full space-y-2">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold">
                    <span>Chu kỳ hít thở: {cycleCount + 1}</span>
                    <span>Tổng thời gian còn lại: {timeLeft}s</span>
                  </div>
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-1000"
                      style={{ width: `${(timeLeft / 60) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex gap-2.5 w-full pt-2">
                {phase !== "idle" && (
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Thực hành lại
                  </button>
                )}
                <button
                  onClick={phase === "completed" ? onClose : onClose}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    phase === "completed"
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {phase === "completed" ? "Tuyệt vời, đóng lại" : "Dừng tập thở"}
                </button>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
