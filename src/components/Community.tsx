import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Send, 
  Users, 
  Sparkles, 
  ShieldAlert, 
  Check, 
  UserCheck, 
  Flame, 
  HelpCircle,
  Quote,
  Smile
} from "lucide-react";
import { INITIAL_CONFESSIONS } from "../data";
import { Confession } from "../types";

const PASTEL_COLORS = [
  { class: "bg-rose-50 text-slate-700 border-rose-200 hover:border-rose-350 shadow-rose-100/40", name: "Hồng ấm áp", label: "bg-rose-100" },
  { class: "bg-sky-50 text-slate-700 border-sky-200 hover:border-sky-350 shadow-sky-100/40", name: "Xanh bình yên", label: "bg-sky-100" },
  { class: "bg-amber-50 text-slate-700 border-amber-200 hover:border-amber-350 shadow-amber-100/40", name: "Vàng rạng rỡ", label: "bg-amber-100" },
  { class: "bg-emerald-50 text-slate-700 border-emerald-200 hover:border-emerald-350 shadow-emerald-100/40", name: "Xanh sạc pin", label: "bg-emerald-100" },
  { class: "bg-violet-50 text-slate-700 border-violet-200 hover:border-violet-350 shadow-violet-100/40", name: "Tím mộc mạc", label: "bg-violet-100" }
];

const HEALING_QUOTES = [
  "Cậu đã làm rất tốt rồi. Hãy tự ôm lấy chính mình và tự hào vì nỗ lực thầm lặng của mình hôm nay nhé. 🧡",
  "Đừng so sánh cuộc sống thực tế của cậu với những thước phim lung linh đã qua chỉnh sửa của người khác trên mạng. Con đường của cậu là độc bản. 🌟",
  "Giông bão rồi sẽ qua, sương mù dày đặc trên đỉnh Mẫu Sơn rồi cũng tan để đón nắng ấm rạng rỡ lên. Cố lên nhé bạn ơi! 🏔️",
  "Ở Trạm Định Vị CoreZ, không ai phán xét cậu cả. Cậu luôn có quyền mệt mỏi và luôn xứng đáng được yêu thương nâng niu. 🌱",
  "Cậu không đơn độc đâu, trong hàng ngàn học sinh ngoài kia luôn có những tâm hồn thấu cảm và sẵn lòng dang rộng cánh tay nghe cậu sẻ chia.",
  "Mỗi bước đi chầm chậm của cậu đều mang ý nghĩa lớn lao. Hãy trân trọng hiện tại và tiếp tục rèn luyện kiên trì nhé. 🏃"
];

// Random rotation styles for realistic scrapbook feel
const ROTATIONS = [
  "rotate-0", "rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-1.5", "-rotate-1.5"
];

export default function Community() {
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  
  // Interaction states
  const [heartCounts, setHeartCounts] = useState<Record<string, number>>({});
  const [healingQuote, setHealingQuote] = useState<string | null>(null);
  const [karmaPoints, setKarmaPoints] = useState(0);

  useEffect(() => {
    // Load confessions
    const storedConfessions = localStorage.getItem("remix_corez_confessions");
    if (storedConfessions) {
      setConfessions(JSON.parse(storedConfessions));
    } else {
      setConfessions(INITIAL_CONFESSIONS);
      localStorage.setItem("remix_corez_confessions", JSON.stringify(INITIAL_CONFESSIONS));
    }

    // Load heart counts
    const storedHearts = localStorage.getItem("remix_corez_hearts");
    if (storedHearts) {
      setHeartCounts(JSON.parse(storedHearts));
    } else {
      const initialHearts: Record<string, number> = {
        "conf-1": 15,
        "conf-2": 24,
        "conf-3": 18,
        "conf-4": 9,
        "conf-5": 32
      };
      setHeartCounts(initialHearts);
      localStorage.setItem("remix_corez_hearts", JSON.stringify(initialHearts));
    }

    // Load karma / XP score
    const storedXp = localStorage.getItem("remix_corez_xp");
    if (storedXp) {
      setKarmaPoints(parseInt(storedXp));
    }
  }, []);

  const handlePostConfession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const rotation = ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];
    const color = PASTEL_COLORS[selectedColorIdx].class;

    const newConf: Confession = {
      id: `conf-${Date.now()}`,
      content: inputText,
      timestamp: "Vừa xong",
      color: color,
      rotation: rotation
    };

    const updatedConfessions = [newConf, ...confessions];
    setConfessions(updatedConfessions);
    localStorage.setItem("remix_corez_confessions", JSON.stringify(updatedConfessions));

    // Update heart counts
    const updatedHearts = { ...heartCounts, [newConf.id]: 0 };
    setHeartCounts(updatedHearts);
    localStorage.setItem("remix_corez_hearts", JSON.stringify(updatedHearts));

    setInputText("");
    alert("Lời bộc bạch ẩn danh của cậu đã được dán lên bức tường kết nối thành công! Ở đây, tiếng lòng cậu luôn được nâng niu an toàn. 🌱");
  };

  const handleSendComfort = (confId: string) => {
    // Increment hearts
    const currentCount = heartCounts[confId] || 0;
    const updatedHearts = { ...heartCounts, [confId]: currentCount + 1 };
    setHeartCounts(updatedHearts);
    localStorage.setItem("remix_corez_hearts", JSON.stringify(updatedHearts));

    // Float random counseling quote to soothe the user
    const randomQuote = HEALING_QUOTES[Math.floor(Math.random() * HEALING_QUOTES.length)];
    setHealingQuote(randomQuote);

    // Award +10 XP/Karma in local storage (Gamification linkage!)
    const updatedXp = karmaPoints + 10;
    setKarmaPoints(updatedXp);
    localStorage.setItem("remix_corez_xp", updatedXp.toString());
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 px-4 font-sans relative z-10" id="community-module">
      
      {/* HEALING FLOATING QUOTE OVERLAY BANNER */}
      <AnimatePresence>
        {healingQuote && (
          <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="bg-white/95 border-2 border-emerald-300 rounded-[30px] p-6 text-center max-w-sm shadow-2xl relative overflow-hidden"
            >
              {/* Soft visual glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 to-teal-50/20 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner border border-emerald-150">
                  <Quote className="w-4.5 h-4.5 text-emerald-500 fill-emerald-500/10" />
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-mono font-bold tracking-widest text-emerald-600 uppercase">Sứ Điệp Chữa Lành CoreZ</h4>
                  <p className="font-serif text-xs sm:text-sm leading-relaxed text-slate-700 text-justify">
                    “ {healingQuote} ”
                  </p>
                </div>

                <div className="bg-emerald-50 p-2 rounded-xl text-center border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Nhận ngay +10 Karma rèn luyện!
                  </span>
                </div>

                <button
                  onClick={() => setHealingQuote(null)}
                  className="w-full py-2 bg-slate-850 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Nhận Thông Điệp Bình Yên 🧡
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUMN 1: CONFESSION FORM (5 COLS) */}
        <div className="md:col-span-5 bg-white/65 backdrop-blur-xl rounded-[32px] border border-white/40 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5">
          
          <div className="space-y-1.5 border-b border-white/40 pb-3">
            <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
              Community Pillar
            </span>
            <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <Users className="w-5 h-5 text-emerald-500" />
              Góc Bộc Bạch Ẩn Danh
            </h3>
            <p className="text-[11px] text-slate-400 font-light leading-relaxed">
              Hãy viết ra những trăn trở, lo âu thầm kín của cậu về điểm số, mạng xã hội, hay áp lực gia đình. Hoàn toàn bảo mật và không phán xét.
            </p>
          </div>

          <form onSubmit={handlePostConfession} className="space-y-4 flex-1 flex flex-col justify-between">
            {/* Input field */}
            <div className="space-y-1.5 flex-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Nỗi lòng của cậu lúc này</label>
              <textarea
                maxLength={250}
                rows={5}
                placeholder="Ví dụ: 'Tớ cảm thấy mệt mỏi khi lướt TikTok thấy các bạn giỏi giang, các video đăng lên nhận được quả ngọt, tớ lo sợ mình tụt hậu so với các bạn...' (Tối đa 250 ký tự)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 rounded-2xl border border-white/40 focus:outline-none focus:border-[#34D399] text-xs sm:text-sm bg-white/50 placeholder:text-slate-400 shadow-inner resize-none flex-1 min-h-[140px]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>🔒 Ẩn danh tuyệt đối</span>
                <span>{inputText.length}/250</span>
              </div>
            </div>

            {/* Pastel color picker */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Chọn màu mẩu giấy ảo</label>
              <div className="flex gap-2">
                {PASTEL_COLORS.map((color, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedColorIdx(idx)}
                    className={`w-6.5 h-6.5 rounded-lg border-2 transition-transform cursor-pointer ${color.label} ${
                      selectedColorIdx === idx ? "border-slate-800 scale-110 shadow-sm" : "border-transparent"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Post Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`w-full py-3.5 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                  inputText.trim()
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 cursor-pointer shadow-emerald-100"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
              >
                <Send className="w-4 h-4" />
                Dán Lên Bức Tường Kết Nối
              </button>
            </div>
          </form>

        </div>

        {/* COLUMN 2: THE WALL - MASONRY COLLAGE OF CONFESSIONS (7 COLS) */}
        <div className="md:col-span-7 bg-white/65 backdrop-blur-xl rounded-[32px] border border-white/40 p-5 shadow-sm flex flex-col justify-between h-[480px]">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
              Bức Tường Sẻ Chia CoreZ ({confessions.length})
            </h4>
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shadow-sm">
              <Smile className="w-3.5 h-3.5" />
              <span>{karmaPoints} Karma</span>
            </div>
          </div>

          {/* Wall Container */}
          <div className="flex-1 overflow-y-auto space-y-4 my-3 pr-1.5 select-none relative p-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {confessions.map((conf) => {
                const count = heartCounts[conf.id] || 0;
                return (
                  <motion.div
                    key={conf.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`p-4 rounded-2xl border shadow-sm transition-all relative overflow-hidden flex flex-col justify-between min-h-[145px] hover:shadow-md ${conf.color} ${conf.rotation}`}
                  >
                    {/* Sticky note tack head design */}
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-slate-300/30" />

                    <p className="text-[11px] leading-relaxed text-justify font-serif text-slate-700 whitespace-pre-wrap flex-1 pr-1">
                      “{conf.content}”
                    </p>

                    <div className="flex justify-between items-end border-t border-slate-200/20 pt-2.5 mt-2 relative z-10">
                      <span className="text-[9px] font-mono text-slate-400 font-light">
                        {conf.timestamp}
                      </span>
                      
                      <button
                        onClick={() => handleSendComfort(conf.id)}
                        className="px-2.5 py-1 rounded-xl bg-white/70 hover:bg-white text-rose-500 border border-rose-100 shadow-sm transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/10 animate-pulse" />
                        <span>An ủi ({count})</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Guidelines info */}
          <div className="pt-2 text-center text-[9px] text-slate-400 font-light border-t border-slate-150/40 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3 h-3 text-emerald-500" />
            <span>Mỗi lượt an ủi (gửi tim) của cậu giúp lan tỏa tình thương mộc mạc và sạc pin tinh thần cho bạn bè.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
