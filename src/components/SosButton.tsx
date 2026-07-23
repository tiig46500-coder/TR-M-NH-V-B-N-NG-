import { useState } from "react";
import { Phone, X, Sparkles, Check, ArrowRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SOOTHING_QUOTES = [
  // Nhóm 1: Lời an ủi nhẹ nhàng, vỗ về
  "Cậu đã vất vả nhiều rồi. Hãy tạm đặt gánh nặng xuống, hít một hơi thật sâu. Ở đây có tớ và mọi người luôn sẵn sàng lắng nghe cậu. 🫂",
  "Hôm nay cậu đã gồng gánh đủ rồi! Giờ thì cho phép bản thân nghỉ ngơi một chút nhé, thế giới ngoài kia lộn xộn quá thì cứ để mai tính. 🌱",
  "Không sao đâu nếu hôm nay cậu cảm thấy không ổn. Bất cứ ai cũng có quyền được yếu đuối mà. Tớ gửi cậu một cái ôm thật chặt từ xa nhé! ✨",
  // Nhóm 2: Giải tỏa áp lực đồng trang lứa & học tập
  "Mỗi bông hoa có một mùa nở riêng, và cậu cũng có 'múi giờ' tỏa sáng của chính mình. Cậu không hề tụt hậu, cậu chỉ đang đi trên con đường của riêng cậu thôi. 🌸",
  "Điểm số hay thành tích chưa bao giờ định nghĩa được trọn vẹn con người cậu. Trái tim lương thiện và sự nỗ lực thầm lặng của cậu mới là điều đáng tự hào nhất. ✨",
  // Nhóm 3: Xoa dịu sự cô đơn
  "Màn đêm có thể tĩnh lặng và mịt mù, nhưng cậu không hề đơn độc đâu. Nơi góc nhỏ này luôn sáng đèn và có người chờ cậu ghé qua trút bầu tâm sự. 🫂",
  "If the room feels too dark right now, let these lines be a tiny warm light for you. Remember that you are always worthy of being loved. 💚",
  // Nhóm 4: Thông điệp "Sơ cứu" tức thì
  "Nhắm mắt lại và cùng tớ đếm ngược từ 5 nhé: 5... 4... 3... 2... 1. Tốt lắm. Mọi giông bão đều dừng lại ngoài kia rồi. Ở đây cậu rất an toàn. ✨",
  "Ngay lúc này, hãy thử đứng lên uống một ngụm nước ấm, thả lỏng hai vai và bật một bản nhạc lofi nhé. Chuyện gì rồi cũng sẽ có cách giải quyết thôi. 🌱"
];

export default function SosButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Steps 1 to 5, and Step 6 is closure/soothe
  const [isSoothed, setIsSoothed] = useState(false);
  const [sootheQuote, setSootheQuote] = useState("");

  const handleOpen = () => {
    setCurrentStep(1);
    setIsSoothed(false);
    setSootheQuote("");
    setIsOpen(true);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const triggerSoothe = () => {
    const randomQuote = SOOTHING_QUOTES[Math.floor(Math.random() * SOOTHING_QUOTES.length)];
    setSootheQuote(randomQuote);
    setIsSoothed(true);
  };

  const handleNextQuote = () => {
    let nextQuote = sootheQuote;
    while (nextQuote === sootheQuote && SOOTHING_QUOTES.length > 1) {
      nextQuote = SOOTHING_QUOTES[Math.floor(Math.random() * SOOTHING_QUOTES.length)];
    }
    setSootheQuote(nextQuote);
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
      {/* 1. COLLAPSED STATE: COMPACT FLOATING ACTION BUTTON (NÚT TRÒN NỔI SOS) */}
      {!isOpen && (
        <motion.button
          id="sos-button"
          onClick={handleOpen}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex flex-col items-center justify-center border-2 border-rose-300 shadow-2xl shadow-rose-600/50 cursor-pointer group transition-all duration-300"
          title="Sơ Cứu Cảm Xúc SOS Khẩn Cấp"
        >
          {/* Pulse ring highlight around circular FAB */}
          <span className="absolute inset-0 rounded-full bg-rose-500 opacity-75 animate-ping pointer-events-none" />

          {/* Main Icon & Label inside circle */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            <Phone className="w-5 h-5 text-white animate-bounce" />
            <span className="text-[9px] font-extrabold tracking-tighter uppercase font-mono text-white leading-none mt-0.5">
              SOS
            </span>
          </div>

          {/* Red prominent badge */}
          <span className="absolute -top-1 -right-1 bg-white text-rose-600 font-black text-[9px] px-1.5 py-0.5 rounded-full border border-rose-300 shadow-md font-mono leading-none">
            SOS
          </span>
        </motion.button>
      )}

      {/* 2. EXPANDED STATE: POPUP / MODAL SOS DIALOG */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            
            {/* Backdrop with click-outside-to-close capability */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-[#0d1c15]/85 backdrop-blur-md cursor-pointer z-0 overflow-hidden"
            >
              {/* Giant pulsing therapeutic light circle in the background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full bg-emerald-500/15 blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
                <div className="absolute w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] rounded-full bg-rose-500/10 blur-[80px] animate-ping" style={{ animationDuration: '10s' }} />
              </div>
            </motion.div>

            {/* Modal Content Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="sos-first-aid-modal relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-[36px] bg-slate-900/90 backdrop-blur-3xl border border-rose-500/30 shadow-2xl p-5 sm:p-8 z-10 flex flex-col justify-between text-white scrollbar-thin scrollbar-thumb-white/10"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-rose-500/30 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer z-20"
                title="Đóng cửa sổ SOS"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header / Progress Indicator */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 pr-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center animate-pulse">
                    <Phone className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-400 font-mono">
                    Trạm Sơ Cứu Cảm Xúc SOS
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono font-bold bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
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
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="flex-1 flex flex-col justify-center space-y-4 my-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                      <span className="text-4xl">{STEPS_DATA[currentStep - 1].emoji}</span>
                      <div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider font-mono">
                          {STEPS_DATA[currentStep - 1].badge}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1 text-emerald-300">
                          {STEPS_DATA[currentStep - 1].title}
                        </h3>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed">
                        {STEPS_DATA[currentStep - 1].instruction}
                      </p>
                      <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                        {STEPS_DATA[currentStep - 1].detail}
                      </div>
                    </div>

                    {/* Grounding Respiratory Helper */}
                    <div className="flex items-center gap-3 bg-emerald-950/40 py-2.5 px-4 rounded-xl border border-emerald-500/20">
                      <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <p className="text-[11.5px] text-emerald-300 font-medium">
                        Hít vào chậm qua mũi... và thở ra thật êm bằng miệng...
                      </p>
                    </div>

                    {/* Footer Nav inside modal */}
                    <div className="pt-4 flex justify-end">
                      <button
                        onClick={handleNextStep}
                        className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Tiếp tục</span>
                        <ArrowRight className="w-4.5 h-4.5 shrink-0 text-slate-950" />
                      </button>
                    </div>
                  </motion.div>
                ) : !isSoothed ? (
                  // Step 6: Post-centering screen (closure) asking if they are okay
                  <motion.div
                    key="step-complete-question"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex-1 flex flex-col justify-center items-center space-y-6 my-6 text-center"
                  >
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/30">
                        <Sparkles className="w-8 h-8 animate-spin-slow" />
                      </div>
                      <h3 className="font-serif text-2xl font-bold text-emerald-300">
                        Cậu đã thấy ổn hơn chút nào chưa? 🌿
                      </h3>
                      <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-light">
                        Cảm ơn cậu đã kiên nhẫn đồng hành cùng cơ thể qua kỹ thuật Sơ cứu cảm xúc 5-4-3-2-1. Hãy giữ nhịp hít thở chậm rãi này nhé.
                      </p>
                    </div>

                    <div className="pt-4 w-full max-w-md flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={handleClose}
                        className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Check className="w-4.5 h-4.5 text-slate-950" />
                        <span>Tớ ổn hơn rồi</span>
                      </button>
                      <button
                        onClick={triggerSoothe}
                        className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 font-bold text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Tớ vẫn thấy chênh vênh...</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  // Advanced soothing feature: Random calming quote
                  <motion.div
                    key="soothe-quote-screen"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex-1 flex flex-col justify-center items-center space-y-6 my-6 text-center"
                  >
                    <div className="space-y-4 max-w-lg mx-auto">
                      <div className="flex justify-center gap-2.5 text-emerald-400">
                        <span className="text-2xl animate-pulse">✨</span>
                        <span className="text-2xl">🫂</span>
                        <span className="text-2xl animate-pulse">🌱</span>
                      </div>
                      <h4 className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                        Góc vỗ về của Trạm Bản Ngã
                      </h4>
                      <div className="min-h-[100px] flex items-center justify-center">
                        <p className="font-serif text-lg sm:text-xl italic leading-relaxed text-emerald-100 font-light select-none transition-all duration-500">
                          “ {sootheQuote} ”
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 w-full max-w-md flex flex-col sm:flex-row gap-3 justify-center">
                      <button
                        onClick={handleNextQuote}
                        className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-emerald-500/25 text-emerald-300 font-bold text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>Tớ muốn nghe thêm</span>
                      </button>
                      <button
                        onClick={handleClose}
                        className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Check className="w-4.5 h-4.5 text-slate-950" />
                        <span>Tớ thấy nhẹ lòng rồi</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Modal footer text */}
              <div className="text-[10px] text-slate-400 text-center mt-6 pt-3 border-t border-white/10">
                Mọi thông tin cuộc gọi và tư vấn đều được hoàn toàn bảo mật • Bạn không cô đơn 💚
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
