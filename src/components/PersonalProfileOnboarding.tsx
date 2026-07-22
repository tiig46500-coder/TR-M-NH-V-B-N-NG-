import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, ArrowRight, ArrowLeft } from "lucide-react";
import { useUserData } from "../context/UserContext";

interface PersonalProfileOnboardingProps {
  onComplete: () => void;
}

export default function PersonalProfileOnboarding({ onComplete }: PersonalProfileOnboardingProps) {
  const { updateProfile } = useUserData();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");

  const VIBES = [
    {
      id: "☁️ Đám mây u tím mệt mỏi (Cần nghỉ ngơi, lắng đọng)",
      icon: "☁️",
      title: "Đám mây u tím mệt mỏi",
      desc: "Cần nghỉ ngơi, lắng đọng",
      color: "from-purple-500/10 to-indigo-500/10 border-purple-300/30",
    },
    {
      id: "🌱 Mầm non chữa lành (Bắt đầu tìm lại sự tích cực)",
      icon: "🌱",
      title: "Mầm non chữa lành",
      desc: "Bắt đầu tìm lại sự tích cực",
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-300/30",
    },
    {
      id: "🔥 Lửa nhỏ động lực (Sẵn sàng chia sẻ và kết nối)",
      icon: "🔥",
      title: "Lửa nhỏ động lực",
      desc: "Sẵn sàng chia sẻ và kết nối",
      color: "from-amber-500/10 to-orange-500/10 border-amber-300/30",
    },
    {
      id: "🌊 Dòng nước chông chênh (Đang có nhiều xáo trộn, cần điểm tựa)",
      icon: "🌊",
      title: "Dòng nước chông chênh",
      desc: "Đang có nhiều xáo trộn, cần điểm tựa",
      color: "from-blue-500/10 to-cyan-500/10 border-blue-300/30",
    },
  ];

  const GOALS = [
    {
      id: "Tìm người lắng nghe",
      text: "👂 Tìm người lắng nghe",
      icon: "👂",
    },
    {
      id: "Tìm lối thoát áp lực",
      text: "🚪 Tìm lối thoát áp lực",
      icon: "🚪",
    },
    {
      id: "Tìm một không gian yên tĩnh",
      text: "🍃 Tìm một không gian yên tĩnh",
      icon: "🍃",
    },
  ];

  const handleNext = () => {
    if (step === 1 && !name.trim()) return;
    if (step === 2 && !selectedVibe) return;
    if (step === 3 && !selectedGoal) return;

    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      updateProfile(name, selectedVibe, selectedGoal);
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 relative bg-transparent">
      {/* Decorative gradients */}
      <div className="absolute top-1/10 left-1/10 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/10 right-1/10 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="w-full max-w-xl bg-white/60 dark:bg-[#252e27]/80 backdrop-blur-xl rounded-[32px] border border-white/40 dark:border-[#a0a8a3]/20 shadow-sm p-6 sm:p-10 relative z-10 transition-all duration-300">
        
        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full uppercase border border-emerald-100/30">
            Bước {step} / 3 • Định Vị Bản Thân
          </span>
          <div className="flex gap-1">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-4 h-1 rounded-full transition-all duration-300 ${
                  s <= step ? "bg-emerald-500 w-6" : "bg-slate-200 dark:bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Screens */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-slate-800 dark:text-[#e0e6e2] leading-tight">
                  Chào cậu, trước khi bước vào trạm định vị ngã, hãy cho mình biết tên hoặc biệt danh cậu yêu thích nhé! ✨
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#a0a8a3]">
                  Một cái tên gần gũi sẽ giúp chúng ta kết nối thấu cảm và tự nhiên hơn trên con đường chữa lành này.
                </p>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên hoặc biệt danh cậu muốn dùng..."
                  maxLength={25}
                  className="w-full px-5 py-4 bg-white/80 dark:bg-[#1a201b]/80 border border-slate-200 dark:border-[#a0a8a3]/20 rounded-2xl text-base text-slate-800 dark:text-[#e0e6e2] placeholder:text-slate-400 dark:placeholder-[#a0a8a3]/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm"
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-slate-800 dark:text-[#e0e6e2] leading-tight">
                  Hệ năng lượng (Vibe) đại diện cho cậu lúc này là gì? 🌊
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#a0a8a3]">
                  Chọn một trạng thái phản ánh đúng nhất năng lượng tinh thần của cậu lúc này để trạm điều phối nhé.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {VIBES.map((v) => {
                  const isSelected = selectedVibe === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVibe(v.id)}
                      className={`text-left p-4 rounded-2xl border-2 transition-all duration-300 bg-gradient-to-br ${v.color} flex items-start gap-3 cursor-pointer hover:scale-[1.01] ${
                        isSelected
                          ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
                          : "border-slate-100 dark:border-[#a0a8a3]/10 hover:border-slate-300 dark:hover:border-[#a0a8a3]/30"
                      }`}
                    >
                      <span className="text-2xl mt-0.5">{v.icon}</span>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-800 dark:text-[#e0e6e2]">{v.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-[#a0a8a3] leading-relaxed">{v.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="font-serif text-2xl font-bold text-slate-800 dark:text-[#e0e6e2] leading-tight">
                  Mục tiêu lớn nhất dẫn lối cậu ghé chơi trạm dừng CoreZ? 🕊️
                </h2>
                <p className="text-xs text-slate-500 dark:text-[#a0a8a3]">
                  Hãy tâm sự cho tụi mình lý do thực sự bên trong, để AI CoreZ nâng đỡ cậu đúng định hướng nhất.
                </p>
              </div>

              <div className="space-y-3">
                {GOALS.map((g) => {
                  const isSelected = selectedGoal === g.id;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setSelectedGoal(g.id)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-[#1a201b]/40 ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10 ring-2 ring-emerald-500/20 shadow-sm"
                          : "border-slate-100 dark:border-[#a0a8a3]/10 bg-white/40 dark:bg-[#1a201b]/20 hover:border-slate-200 dark:hover:border-[#a0a8a3]/20"
                      }`}
                    >
                      <span className="text-xl p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60">{g.icon}</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-[#e0e6e2]">{g.text}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Action Buttons */}
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-slate-100 dark:border-[#a0a8a3]/10 pt-6">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-[#e0e6e2] text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={
              (step === 1 && !name.trim()) ||
              (step === 2 && !selectedVibe) ||
              (step === 3 && !selectedGoal)
            }
            className={`px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all ${
              (step === 1 && !name.trim()) || (step === 2 && !selectedVibe) || (step === 3 && !selectedGoal)
                ? "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-[1.02] shadow-sm active:scale-98"
            }`}
          >
            <span>{step === 3 ? "Hoàn tất hồ sơ 🌸" : "Tiếp theo"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
