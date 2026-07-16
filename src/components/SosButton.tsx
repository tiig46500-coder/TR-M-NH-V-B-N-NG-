import { useState } from "react";
import { Phone, Heart, X, MessageCircle, Clock, Eye, Sparkles, Check, ArrowRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SosButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Steps 1 to 5, and Step 6 is the final Hotline page

  const handleOpen = () => {
    setCurrentStep(1);
    setIsOpen(true);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // 5-4-3-2-1 Steps Configuration
  const STEPS_DATA = [
    {
      title: "Bước 1: Quan Sát Thị Giác 👀",
      instruction: "Hãy tìm và đếm 5 đồ vật xung quanh cậu lúc này.",
      detail: "Ưu tiên những đồ vật có màu xanh lá (xanh lục) hoặc xanh dương hiền hòa. Hãy từ tốn quan sát từng món đồ và đọc tên chúng lên thành tiếng.",
      badge: "5 Đồ Vật • Sơ Cứu Cảm Xúc",
      emoji: "🌿"
    },
    {
      title: "Bước 2: Cảm Nhận Xúc Giác 🤝",
      instruction: "Hãy chạm và cảm nhận 4 bề mặt chất liệu khác nhau xung quanh cậu.",
      detail: "Nó có thể là mặt bàn gỗ mát lạnh, sợi vải của chiếc gối êm ái, vách tường thô ráp, hay chính những đầu ngón tay của cậu. Cảm nhận độ lún, nhiệt độ và chất liệu của chúng.",
      badge: "4 Bề Mặt • Kết Nối Cơ Thể",
      emoji: "✨"
    },
    {
      title: "Bước 3: Lắng Nghe Thính Giác 👂",
      instruction: "Hãy nhắm hờ mắt và lắng nghe 3 âm thanh khác nhau trong phòng hoặc bên ngoài.",
      detail: "Hãy tập trung lắng nghe những âm thanh tự nhiên xung quanh cậu lúc này. Có thể là tiếng lá cây rì rào bên ngoài cửa sổ, tiếng quạt gió quay đều đặn êm ái, hay tiếng tích tắc thong thả của chiếc đồng hồ. Chỉ cần thấu nhận và ghi nhận chúng một cách bình thản.",
      badge: "3 Âm Thanh • Neo Đậu Thực Tại",
      emoji: "🍃"
    },
    {
      title: "Bước 4: Cảm Nhận Khứu Giác 👃",
      instruction: "Hãy hít một hơi sâu và tìm cảm nhận 2 mùi hương xung quanh.",
      detail: "Có thể là mùi hương từ vỏ một tách trà, mùi của trang sách cũ, mùi dầu thơm, hay đơn giản là không khí trong mát thoảng hương của căn phòng. Nếu không có mùi hương rõ ràng, hãy tưởng tượng một mùi oải hương hay mùi mưa mát lành.",
      badge: "2 Mùi Hương • Thư Thái Thần Kinh",
      emoji: "🌸"
    },
    {
      title: "Bước 5: Cảm Nhận Vị Giác 👅",
      instruction: "Hãy cảm nhận 1 hương vị hiện hữu trong khoang miệng của cậu.",
      detail: "Uống một ngụm nước ấm mát lành, nhai một chiếc kẹo bạc hà dịu mát, hay đơn giản là cảm nhận hương vị tự nhiên trong khoang miệng lúc này. Cảm nhận sự tươi mát dâng lên.",
      badge: "1 Vị Giác • Neo Giữ Hoàn Toàn",
      emoji: "💧"
    }
  ];

  return (
    <>
      {/* SOS Floating Action Button */}
      <button
        id="sos-button"
        onClick={handleOpen}
        className="fixed bottom-4 right-4 z-40 px-5 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-rose-400 shadow-xl shadow-rose-200 dark:shadow-none transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse cursor-pointer"
      >
        <Phone className="w-4 h-4 fill-current animate-bounce" />
        <span>Sơ Cứu Cảm Xúc SOS</span>
      </button>

      {/* SOS Dialog - Full Screen */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            
            {/* Dark Calming Background with custom breathing pulse animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#12221A] z-0 overflow-hidden"
            >
              {/* Giant pulsing therapeutic light circle in the background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] rounded-full bg-teal-500/5 blur-[80px] animate-ping" style={{ animationDuration: '12s' }} />
              </div>
            </motion.div>

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="sos-first-aid-modal relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-[36px] bg-slate-900/75 backdrop-blur-3xl border border-white/10 shadow-2xl p-5 sm:p-8 z-10 flex flex-col justify-between text-white scrollbar-thin scrollbar-thumb-white/10"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
                title="Đóng sơ cứu khẩn cấp"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Progress Indicator */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-500 flex items-center justify-center animate-ping">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-rose-400 font-mono">
                    Trạm Sơ Cứu Cảm Xúc SOS
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono font-bold">
                  {currentStep <= 5 ? `Bước ${currentStep} / 5` : "Hoàn thành Sơ cứu"}
                </div>
              </div>

              {/* Step rendering */}
              <AnimatePresence mode="wait">
                {currentStep <= 5 ? (
                  <motion.div
                    key={`step-${currentStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex-1 flex flex-col justify-center space-y-4 my-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                      <span className="text-4xl">{STEPS_DATA[currentStep - 1].emoji}</span>
                      <div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                          {STEPS_DATA[currentStep - 1].badge}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1 text-emerald-300">
                          {STEPS_DATA[currentStep - 1].title}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                        {STEPS_DATA[currentStep - 1].instruction}
                      </p>
                      <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        {STEPS_DATA[currentStep - 1].detail}
                      </div>
                    </div>

                    {/* Grounding Respiratory Helper */}
                    <div className="flex items-center gap-3 bg-emerald-950/20 py-2.5 px-4 rounded-xl border border-emerald-900/20">
                      <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <p className="text-[11.5px] text-emerald-400 font-medium">
                        Hít vào chậm qua mũi... và thở ra thật êm bằng miệng...
                      </p>
                    </div>

                    {/* Footer Nav inside modal */}
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleNextStep}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/20 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Tiếp tục</span>
                        <ArrowRight className="w-4.5 h-4.5 shrink-0 text-white" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  // Step 6: Post-centering screen (closure)
                  <motion.div
                    key="step-complete"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 flex flex-col justify-center items-center space-y-6 my-6 text-center"
                  >
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                        <Sparkles className="w-8 h-8 animate-spin-slow" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-emerald-300">
                        Cậu thấy dễ chịu hơn chút nào chưa?
                      </h3>
                      <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-light">
                        Cảm ơn cậu đã kiên nhẫn đồng hành cùng cơ thể qua kỹ thuật Sơ cứu cảm xúc 5-4-3-2-1. Hãy giữ nhịp hít thở chậm rãi này nhé.
                      </p>
                    </div>

                    <div className="pt-4 w-full max-w-xs">
                      <button
                        onClick={handleClose}
                        className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Check className="w-4.5 h-4.5 text-white" />
                        <span>Tớ đã ổn hơn</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Modal footer text */}
              <div className="text-[10px] text-slate-500 text-center mt-6 pt-3 border-t border-white/5">
                Mọi thông tin cuộc gọi và tư vấn đều được hoàn toàn bảo mật • Bạn không cô đơn 💚
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
