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
  Smile,
  Plane,
  Lock,
  Unlock,
  Clock,
  Trash2
} from "lucide-react";
import { INITIAL_CONFESSIONS } from "../data";
import { Confession } from "../types";
import { useUserData } from "../context/UserContext";

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

// 1. Hàm tạo tên ẩn danh ngẫu nhiên mang phong cách "Chữa lành"
export const generateAnonymousName = (): string => {
  const adjectives = ['Bình Yên', 'Mạnh Mẽ', 'Lặng Lẽ', 'Bí Ẩn', 'Kiên Cường'];
  const nouns = ['Đám Mây', 'Ngôi Sao', 'Hạt Mầm', 'Lá Cây', 'Chú Mèo'];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomNoun} ${randomAdj}`; // Ví dụ: "Đám Mây Bình Yên"
};

interface FloatingParticle {
  id: number;
  emoji: string;
  x: number;
  y: number;
}

export default function Community() {
  const { userData, addFutureLetter, deleteFutureLetter, addXP } = useUserData();
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  
  // Interaction states
  const [heartCounts, setHeartCounts] = useState<Record<string, number>>({});
  const [healingQuote, setHealingQuote] = useState<string | null>(null);
  const [karmaPoints, setKarmaPoints] = useState(0);

  // Gemini Note Moderation & Sentiment states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [moderationResult, setModerationResult] = useState<{ reason: string; suggestion: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Release ritual states
  const [selectedRitual, setSelectedRitual] = useState<"fold" | "burn" | "pond">("fold");
  const [playingRitual, setPlayingRitual] = useState<"fold" | "burn" | "pond" | null>(null);
  const [ritualText, setRitualText] = useState("");
  const [postTarget, setPostTarget] = useState<"public" | "future">("public");

  // Floating particles & active tab
  const [particlesList, setParticlesList] = useState<FloatingParticle[]>([]);
  const [rightColumnTab, setRightColumnTab] = useState<"wall" | "capsule">("wall");

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
    const loadKarma = () => {
      const storedKarma = localStorage.getItem("corez_karma_points") || localStorage.getItem("remix_corez_xp");
      if (storedKarma) {
        setKarmaPoints(parseInt(storedKarma, 10));
      }
    };
    loadKarma();
    const interval = setInterval(loadKarma, 3000);
    return () => clearInterval(interval);
  }, []);

  // Helper to find client-side matching confessions (You are not alone)
  const getMatchingConfessions = (text: string) => {
    if (!text || text.trim().length < 6) return [];
    const lowerText = text.toLowerCase();
    
    // Core school/social psychological pressure keywords
    const academicTerms = ["học", "điểm", "thi", "gồng", "kỳ vọng", "bố mẹ", "áp lực", "đại học", "trường"];
    const socialTerms = ["mạng", "tik", "tok", "lướt", "story", "like", "threads", "instagram", "so sánh", "thả tim"];
    const familyTerms = ["bố", "mẹ", "gia đình", "nhà", "cha mẹ", "con nhà người ta"];
    const emotionTerms = ["buồn", "khóc", "cô đơn", "mệt", "kiệt sức", "chông chênh", "lo âu", "vô định"];

    return confessions
      .map((conf) => {
        let score = 0;
        const lowerConf = conf.content.toLowerCase();
        
        academicTerms.forEach(term => {
          if (lowerText.includes(term) && lowerConf.includes(term)) score += 3;
        });
        socialTerms.forEach(term => {
          if (lowerText.includes(term) && lowerConf.includes(term)) score += 3;
        });
        familyTerms.forEach(term => {
          if (lowerText.includes(term) && lowerConf.includes(term)) score += 4;
        });
        emotionTerms.forEach(term => {
          if (lowerText.includes(term) && lowerConf.includes(term)) score += 2;
        });

        return { conf, score };
      })
      .filter(item => item.score > 2) // Must match at least some substance
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map(item => item.conf);
  };

  const handlePostConfession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setModerationResult(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/validate-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputText }),
      });

      if (!response.ok) {
        throw new Error("Không thể liên hệ dịch vụ kiểm duyệt.");
      }

      const result = await response.json();

      if (!result.isApproved) {
        setModerationResult({
          reason: result.reason,
          suggestion: result.suggestion || "Cậu ơi, hãy diễn đạt cảm nhận bằng ngôn ngữ nhẹ nhàng, chữa lành hơn nha."
        });
        setIsAnalyzing(false);
        return;
      }

      // Approved confession: Play ritual animation first!
      let finalContent = inputText;
      if (result.sentiment === "positive") {
        finalContent += " 😊";
      } else if (result.sentiment === "sad") {
        finalContent += " 🥺";
      } else if (result.sentiment === "vulnerable") {
        finalContent += " 🌱";
      }

      setRitualText(finalContent);
      setPlayingRitual(selectedRitual);
      
      const textToSave = finalContent;
      setInputText("");
      setIsAnalyzing(false);

      // Complete ritual after delay
      setTimeout(() => {
        setPlayingRitual(null);
        setRitualText("");

        if (postTarget === "public") {
          const rotation = ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];
          const color = PASTEL_COLORS[selectedColorIdx].class;

          const newConf: Confession = {
            id: `conf-${Date.now()}`,
            content: textToSave,
            timestamp: "Vừa xong",
            color: color,
            rotation: rotation,
            author: generateAnonymousName()
          };

          const updatedConfessions = [newConf, ...confessions];
          setConfessions(updatedConfessions);
          localStorage.setItem("remix_corez_confessions", JSON.stringify(updatedConfessions));

          // Update heart counts
          const updatedHearts = { ...heartCounts, [newConf.id]: 0 };
          setHeartCounts(updatedHearts);
          localStorage.setItem("remix_corez_hearts", JSON.stringify(updatedHearts));

          addXP(15);
          setSuccessMessage("Mẩu giấy nỗi buồn đã bay vút đi và đáp xuống Bức Tường Sẻ Chia! +15 Karma 🌐");
        } else {
          // Save to Future Letter (Time Capsule)
          const writeDate = new Date();
          const unlockDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days lock
          
          const newLetter = {
            id: `letter-${Date.now()}`,
            writeDate: writeDate.toISOString(),
            unlockDate: unlockDate.toISOString(),
            content: textToSave,
            releaseTimelineLabel: "7 Ngày Sau",
            isSealed: true
          };

          addFutureLetter(newLetter);
          addXP(15);
          setSuccessMessage("Lá thư tương lai đã được gửi thành công vào Hộp thư thời gian! +15 Karma 🔒");
        }
        setTimeout(() => setSuccessMessage(null), 5500);
      }, 2800);

    } catch (error) {
      console.error("Note moderation failed:", error);
      // Fallback post: Ensure 100% availability even if Gemini api is down or rate limited
      setRitualText(inputText);
      setPlayingRitual(selectedRitual);
      
      const fallbackText = inputText;
      setInputText("");
      setIsAnalyzing(false);

      setTimeout(() => {
        setPlayingRitual(null);
        setRitualText("");

        if (postTarget === "public") {
          const rotation = ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)];
          const color = PASTEL_COLORS[selectedColorIdx].class;

          const newConf: Confession = {
            id: `conf-${Date.now()}`,
            content: fallbackText,
            timestamp: "Vừa xong",
            color: color,
            rotation: rotation,
            author: generateAnonymousName()
          };

          const updatedConfessions = [newConf, ...confessions];
          setConfessions(updatedConfessions);
          localStorage.setItem("remix_corez_confessions", JSON.stringify(updatedConfessions));

          const updatedHearts = { ...heartCounts, [newConf.id]: 0 };
          setHeartCounts(updatedHearts);
          localStorage.setItem("remix_corez_hearts", JSON.stringify(updatedHearts));

          addXP(15);
          setSuccessMessage("Dán thành công lên Bức Tường Sẻ Chia! Nhận được +15 Karma 🌱");
        } else {
          const writeDate = new Date();
          const unlockDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          
          const newLetter = {
            id: `letter-${Date.now()}`,
            writeDate: writeDate.toISOString(),
            unlockDate: unlockDate.toISOString(),
            content: fallbackText,
            releaseTimelineLabel: "7 Ngày Sau",
            isSealed: true
          };

          addFutureLetter(newLetter);
          addXP(15);
          setSuccessMessage("Gửi thành công mẩu thư gửi 7 ngày sau! Nhận được +15 Karma 💌");
        }
        setTimeout(() => setSuccessMessage(null), 5000);
      }, 2800);
    }
  };

  const handleHealingInteraction = (confId: string, type: "hug" | "same" | "pour", e: React.MouseEvent) => {
    // Spawn float particles near mouse/button
    const rect = e.currentTarget.getBoundingClientRect();
    const container = document.getElementById("community-module");
    const containerRect = container ? container.getBoundingClientRect() : { left: 0, top: 0 };
    const startX = rect.left + rect.width / 2 - containerRect.left;
    const startY = rect.top - containerRect.top;

    const emojis = {
      hug: "🫂",
      same: "✨",
      pour: "☁️"
    };

    const newParticles: FloatingParticle[] = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + Math.random() + i,
      emoji: emojis[type],
      x: startX + (Math.random() * 40 - 20),
      y: startY - Math.random() * 10
    }));

    setParticlesList((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      setParticlesList((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, 1500);

    const locations = [
      "Chi Lăng", "Mẫu Sơn", "Bắc Sơn", "Hữu Lũng", "Lộc Bình", 
      "Tràng Định", "Cao Lộc", "Bình Gia", "Văn Quan", "Đình Lập"
    ];
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];
    
    let healingText = "";
    if (type === "hug") {
      healingText = `Ai đó từ Xứ Lạng vừa gửi cho cậu một cái ôm ấm áp 🫂`;
    } else if (type === "same") {
      healingText = `Một tâm hồn thấu cảm từ Xứ Lạng nhắn nhủ: "Tớ cũng từng giống cậu..." ✨`;
    } else {
      healingText = `Một làn gió dịu từ Xứ Lạng thầm thì: "Hãy mỉm cười và trút nhẹ lòng đi nhé!" ☁️`;
    }

    setSuccessMessage(healingText);
    setTimeout(() => setSuccessMessage(null), 5000);

    // Award +10 XP/Karma
    addXP(10);
    setKarmaPoints((prev) => prev + 10);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 px-4 font-sans relative z-10" id="community-module">
      
      {/* Interactive Floating particles */}
      {particlesList.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, y: p.y, x: p.x, scale: 0.8 }}
          animate={{ 
            opacity: 0, 
            y: p.y - 130, 
            x: p.x + (Math.random() * 60 - 30), 
            scale: 1.6,
            rotate: Math.random() * 40 - 20 
          }}
          transition={{ duration: 1.3, ease: "easeOut" }}
          className="absolute pointer-events-none text-lg z-[90] select-none"
        >
          {p.emoji}
        </motion.div>
      ))}

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

      {/* GEMINI MODERATION ALERT OVERLAY */}
      <AnimatePresence>
        {moderationResult && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-white/95 border-2 border-amber-300 rounded-[30px] p-6 text-center max-w-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/50 to-orange-50/10 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                  <ShieldAlert className="w-6 h-6 text-amber-500 animate-bounce" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono font-bold tracking-widest text-amber-600 uppercase">Kiểm Duyệt Từ Gemini</h4>
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed text-justify">
                    {moderationResult.reason}
                  </p>
                  <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 text-left">
                    <span className="text-[9px] font-bold text-amber-800 block mb-1 font-mono uppercase">💡 Gợi ý viết lại của bạn Gemini:</span>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {moderationResult.suggestion}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModerationResult(null)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                >
                  Để tớ chỉnh sửa lại nha 🧡
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS TOAST MESSAGE */}
      <AnimatePresence>
        {successMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-md w-11/12">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-slate-900/90 backdrop-blur text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-xs border border-white/10"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PLAYING RITUAL SCREEN OVERLAY */}
      <AnimatePresence>
        {playingRitual && (
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[120] flex flex-col items-center justify-center p-4 overflow-hidden">
            <div className="max-w-md w-full text-center space-y-6">
              <h4 className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                ⚙️ Nghi Thức Giải Phóng Bản Ngã
              </h4>
              
              <div className="relative h-64 flex items-center justify-center">
                {playingRitual === "fold" && (
                  <motion.div
                    initial={{ scale: 1, rotate: 0, opacity: 1 }}
                    animate={[
                      { scale: 0.9, rotate: 5, y: 0, transition: { duration: 0.5 } },
                      { scale: 0.6, rotate: -20, x: -50, y: 30, skewX: 10, transition: { duration: 0.6, delay: 0.6 } },
                      { scale: 0, x: 500, y: -400, opacity: 0, transition: { duration: 1.2, ease: "easeIn" } }
                    ]}
                    className="bg-amber-50 p-6 rounded-2xl shadow-2xl border-2 border-amber-200 text-slate-700 w-72 text-left font-serif text-xs relative animate-pulse"
                  >
                    <div className="absolute top-2 right-2 text-xl">✈️</div>
                    <p className="line-clamp-6 text-slate-600 font-light">“ {ritualText} ”</p>
                    <p className="text-[10px] text-slate-400 mt-4 text-right font-light">— Mẩu giấy đang bay xa</p>
                  </motion.div>
                )}

                {playingRitual === "burn" && (
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 1, opacity: 1 }}
                      animate={{ 
                        scale: 0.85, 
                        filter: ["brightness(1) contrast(1)", "brightness(1.5) sepia(0.5) hue-rotate(15deg)", "brightness(0.3) grayscale(1)"],
                        opacity: [1, 1, 0]
                      }}
                      transition={{ duration: 2.6, times: [0, 0.4, 1] }}
                      className="bg-amber-50 p-6 rounded-2xl shadow-2xl border-2 border-amber-200 text-slate-700 w-72 text-left font-serif text-xs"
                    >
                      <p className="line-clamp-6 text-slate-600 font-light">“ {ritualText} ”</p>
                      <p className="text-[10px] text-slate-400 mt-4 text-right">— Đang giải phóng</p>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: [0, 1, 0.8, 0], scale: [0.8, 1.2, 1.3, 1] }}
                      transition={{ duration: 2.4, times: [0, 0.3, 0.7, 1] }}
                      className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-end items-center pointer-events-none"
                    >
                      <span className="text-6xl animate-bounce">🔥</span>
                      <span className="text-4xl animate-pulse">✨</span>
                    </motion.div>
                  </div>
                )}

                {playingRitual === "pond" && (
                  <div className="relative w-72 h-64 flex items-center justify-center">
                    <motion.div
                      initial={{ y: -100, scale: 1.1, opacity: 0 }}
                      animate={{ 
                        y: [ -100, 120 ],
                        scale: [ 1.1, 0.3 ],
                        opacity: [ 0, 1, 0 ]
                      }}
                      transition={{ duration: 1.2, ease: "easeIn" }}
                      className="bg-sky-50 p-6 rounded-2xl shadow-2xl border-2 border-sky-200 text-slate-700 w-64 text-left font-serif text-xs absolute"
                    >
                      <p className="line-clamp-6 text-slate-600 font-light">“ {ritualText} ”</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0.8, 0] }}
                      transition={{ delay: 1, duration: 1.6 }}
                      className="absolute flex items-center justify-center w-full h-full pointer-events-none"
                    >
                      <motion.div 
                        initial={{ width: 10, height: 5, opacity: 1 }}
                        animate={{ width: 280, height: 140, opacity: 0 }}
                        transition={{ delay: 1.1, duration: 1.4, ease: "easeOut" }}
                        className="border-2 border-sky-400/80 rounded-full absolute"
                      />
                      <motion.div 
                        initial={{ width: 10, height: 5, opacity: 1 }}
                        animate={{ width: 180, height: 90, opacity: 0 }}
                        transition={{ delay: 1.3, duration: 1.2, ease: "easeOut" }}
                        className="border border-sky-300/60 rounded-full absolute"
                      />
                    </motion.div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {playingRitual === "fold" && (
                  <p className="text-xs text-slate-400 italic font-light leading-relaxed">Mẩu giấy nỗi buồn được gấp gọn thành máy bay ảo, bay vút lên bầu trời cao Lạng Sơn rộng lớn, mang theo lo lắng tan vào gió mây đại ngàn...</p>
                )}
                {playingRitual === "burn" && (
                  <p className="text-xs text-slate-400 italic font-light leading-relaxed">Ánh lửa ấm áp đang sưởi ấm, xoa dịu tâm hồn cậu. Toàn bộ áp lực thi cử, mệt mỏi đang hóa thành tro lấp lánh và bay theo gió ngàn...</p>
                )}
                {playingRitual === "pond" && (
                  <p className="text-xs text-slate-400 italic font-light leading-relaxed">Mẩu giấy chứa muộn phiền chìm xuống hồ Tam Thanh mát dịu, hòa tan vào làn nước mát trong lành, trôi xuôi trả lại sự thảnh thơi...</p>
                )}
                <div className="flex justify-center gap-1.5 pt-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-mono text-emerald-400 uppercase">Hệ Thống Đang Giải Phóng...</span>
                </div>
              </div>
            </div>
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
                rows={4}
                placeholder="Ví dụ: 'Tớ cảm thấy mệt mỏi khi lướt TikTok thấy các bạn giỏi giang, các video đăng lên nhận được quả ngọt, tớ lo sợ mình tụt hậu so với các bạn...' (Tối đa 250 ký tự)"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 rounded-2xl border border-white/40 focus:outline-none focus:border-[#34D399] text-xs sm:text-sm bg-white/50 placeholder:text-slate-400 shadow-inner resize-none flex-1 min-h-[110px]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>🔒 Ẩn danh tuyệt đối</span>
                <span>{inputText.length}/250</span>
              </div>
            </div>

            {/* AI Reflection Mirror */}
            <AnimatePresence>
              {inputText.trim().length >= 6 && getMatchingConfessions(inputText).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-4 overflow-hidden shadow-inner space-y-2 my-1"
                >
                  <div className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span>Tấm Gương Phản Chiếu Bản Ngã ✨</span>
                  </div>
                  <p className="text-[9.5px] text-slate-500 leading-relaxed">
                    Cậu ơi, cậu không đơn độc đâu. Có những tâm hồn cũng đang sẻ chia và bộc bạch nỗi niềm tương tự như cậu này:
                  </p>
                  <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1">
                    {getMatchingConfessions(inputText).map((mConf) => (
                      <div key={mConf.id} className="p-2.5 rounded-xl bg-white/90 border border-white/45 text-[10px] font-serif text-slate-600 leading-normal relative">
                        <span className="font-mono text-[8px] font-bold text-emerald-600 block mb-0.5">👤 Bạn học Ẩn danh:</span>
                        “ {mConf.content} ”
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Direction Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Hướng Giải Phóng Nỗi Buồn</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPostTarget("public")}
                  className={`py-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                    postTarget === "public"
                      ? "border-emerald-500 bg-emerald-50/60 text-emerald-700"
                      : "border-slate-100 bg-slate-50/40 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  🌐 Bức Tường Sẻ Chia
                </button>
                <button
                  type="button"
                  onClick={() => setPostTarget("future")}
                  className={`py-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                    postTarget === "future"
                      ? "border-emerald-500 bg-emerald-50/60 text-emerald-700"
                      : "border-slate-100 bg-slate-50/40 text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  💌 Thư Gửi 7 Ngày Sau
                </button>
              </div>
            </div>

            {/* Release Ritual Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block">
                🌿 Chọn Nghi Thức Giải Phóng
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "fold", label: "Gấp máy bay", icon: "✈️", desc: "Bay vào hư không" },
                  { id: "burn", label: "Đốt bỏ mẩu giấy", icon: "🔥", desc: "Hóa thành tro ấm" },
                  { id: "pond", label: "Ném xuống hồ", icon: "🌊", desc: "Hòa tan yên bình" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRitual(r.id as any)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                      selectedRitual === r.id
                        ? "border-emerald-500 bg-emerald-50/60 shadow-sm scale-[1.02]"
                        : "border-slate-100 bg-slate-50/40 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm mb-0.5">{r.icon}</span>
                    <span className="text-[9px] font-bold text-slate-700 block leading-tight">{r.label}</span>
                    <span className="text-[7.5px] text-slate-400 block mt-0.5 leading-none">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pastel color picker (Only shown for public walls) */}
            {postTarget === "public" && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Chọn màu mẩu giấy ảo</label>
                <div className="flex gap-2">
                  {PASTEL_COLORS.map((color, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedColorIdx(idx)}
                      className={`w-6 h-6 rounded-lg border transition-transform cursor-pointer ${color.label} ${
                        selectedColorIdx === idx ? "border-slate-800 scale-110 shadow-xs" : "border-transparent"
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Post Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={!inputText.trim() || isAnalyzing}
                className={`w-full py-3.5 rounded-xl font-bold text-xs text-white shadow-md active:scale-95 flex items-center justify-center gap-2 transition-all ${
                  inputText.trim() && !isAnalyzing
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 cursor-pointer shadow-emerald-100"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
                    <span>Gemini đang sạc cảm xúc...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{postTarget === "public" ? "Kích Hoạt Nghi Thức Sẻ Chia" : "Phong Ấn Gửi Bản Ngã Tương Lai"}</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

        {/* COLUMN 2: THE WALL - COLLAGE OR TIME CAPSULE (7 COLS) */}
        <div className="md:col-span-7 bg-white/65 backdrop-blur-xl rounded-[32px] border border-white/40 p-5 shadow-sm flex flex-col justify-between h-[520px]">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRightColumnTab("wall")}
                className={`text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                  rightColumnTab === "wall"
                    ? "text-emerald-600 border-b-2 border-emerald-500"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Bức Tường Sẻ Chia ({confessions.length})
              </button>
              <button
                type="button"
                onClick={() => setRightColumnTab("capsule")}
                className={`text-xs font-bold uppercase tracking-wider pb-1 transition-all cursor-pointer flex items-center gap-1 ${
                  rightColumnTab === "capsule"
                    ? "text-emerald-600 border-b-2 border-emerald-500"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Hộp Thư Tương Lai ({userData.futureLetters.length})
              </button>
            </div>
            
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-emerald-600 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 shadow-sm">
              <Smile className="w-3.5 h-3.5" />
              <span>{karmaPoints} Karma</span>
            </div>
          </div>

          {/* Tab 1: Wall Container */}
          {rightColumnTab === "wall" && (
            <div className="flex-1 overflow-y-auto space-y-4 my-3 pr-1.5 select-none relative p-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {confessions.map((conf) => {
                  return (
                    <motion.div
                      key={conf.id}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`p-4 rounded-2xl border shadow-sm transition-all relative overflow-hidden flex flex-col justify-between min-h-[145px] hover:shadow-md ${conf.color} ${conf.rotation}`}
                    >
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-slate-300/30" />

                      <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-slate-500 mb-2.5 border-b border-slate-200/40 pb-1.5 font-light">
                        <UserCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">Sứ giả: {conf.author || "Bạn học Ẩn danh"}</span>
                      </div>

                      <p className="text-[11px] leading-relaxed text-justify font-serif text-slate-700 whitespace-pre-wrap flex-1 pr-1 font-light">
                        “ {conf.content} ”
                      </p>

                      <div className="flex flex-col gap-2 border-t border-slate-200/20 pt-2 mt-2 relative z-10 w-full">
                        <div className="flex justify-between items-center text-[8px] font-mono text-slate-400 font-light">
                          <span>{conf.timestamp}</span>
                          <span>Yêu thương ẩn danh 👇</span>
                        </div>
                        
                        <div className="flex gap-1 justify-end">
                          <button
                            type="button"
                            onClick={(e) => handleHealingInteraction(conf.id, "hug", e)}
                            className="p-1 px-2 rounded-lg bg-white/80 hover:bg-white text-rose-600 border border-rose-150/50 shadow-xs transition-all cursor-pointer flex items-center gap-0.5 text-[9px] font-medium active:scale-90"
                            title="Ôm một cái"
                          >
                            <span>🫂</span> <span>Ôm cái</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleHealingInteraction(conf.id, "same", e)}
                            className="p-1 px-2 rounded-lg bg-white/80 hover:bg-white text-emerald-600 border border-emerald-150/50 shadow-xs transition-all cursor-pointer flex items-center gap-0.5 text-[9px] font-medium active:scale-90"
                            title="Tớ cũng từng như vậy"
                          >
                            <span>✨</span> <span>Tớ cũng vậy</span>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleHealingInteraction(conf.id, "pour", e)}
                            className="p-1 px-2 rounded-lg bg-white/80 hover:bg-white text-sky-600 border border-sky-150/50 shadow-xs transition-all cursor-pointer flex items-center gap-0.5 text-[9px] font-medium active:scale-90"
                            title="Trút lòng đi nhé"
                          >
                            <span>☁️</span> <span>Trút lòng</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Time Capsule Container */}
          {rightColumnTab === "capsule" && (
            <div className="flex-1 overflow-y-auto space-y-3 my-3 pr-1.5 select-none relative p-1">
              {userData.futureLetters.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
                    <Clock className="w-6 h-6 text-slate-400 animate-pulse" />
                  </div>
                  <p className="text-xs font-serif text-slate-500 font-medium max-w-xs leading-relaxed">
                    Cậu chưa gửi bức thư thời gian nào cả. Hãy viết một nỗi lo lo vào mẫu giấy bên trái, chọn nghi thức giải phóng và gửi cho chính mình 7 ngày sau nhé! 💌
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userData.futureLetters.map((letter) => {
                    const writeDateObj = new Date(letter.writeDate);
                    const unlockDateObj = new Date(letter.unlockDate);
                    const isCurrentlyLocked = Date.now() < unlockDateObj.getTime();
                    
                    // Format unlock timer
                    const remainingTimeMs = unlockDateObj.getTime() - Date.now();
                    const remainingDays = Math.max(0, Math.floor(remainingTimeMs / (1000 * 60 * 60 * 24)));
                    const remainingHours = Math.max(0, Math.floor((remainingTimeMs / (1000 * 60 * 60)) % 24));
                    const remainingMins = Math.max(0, Math.floor((remainingTimeMs / (1000 * 60)) % 60));

                    // Time leap handler
                    const handleTimeLeap = () => {
                      const bypassedLetter = {
                        ...letter,
                        unlockDate: new Date(Date.now() - 1000).toISOString()
                      };
                      deleteFutureLetter(letter.id);
                      addFutureLetter(bypassedLetter);
                      setSuccessMessage("🚀 Đã kích hoạt Cỗ Máy Thời Gian! Thời gian nhảy vọt 7 ngày, bức thư đã sẵn sàng mở khóa.");
                      setTimeout(() => setSuccessMessage(null), 5000);
                    };

                    return (
                      <motion.div
                        key={letter.id}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`p-4 rounded-2xl border shadow-xs transition-all relative overflow-hidden flex flex-col justify-between min-h-[160px] ${
                          isCurrentlyLocked 
                            ? "bg-slate-50 text-slate-400 border-slate-200" 
                            : "bg-gradient-to-tr from-amber-50 to-orange-50 border-amber-200/60 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center justify-between border-b border-slate-200/50 pb-1.5 mb-2 text-[9px] font-mono font-medium">
                          <span className="text-slate-400">Viết ngày: {writeDateObj.toLocaleDateString("vi-VN")}</span>
                          {isCurrentlyLocked ? (
                            <span className="text-amber-600 font-bold flex items-center gap-0.5">
                              <Lock className="w-3 h-3" /> KHÓA
                            </span>
                          ) : (
                            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                              <Unlock className="w-3 h-3 animate-bounce" /> MỞ KHÓA
                            </span>
                          )}
                        </div>

                        {isCurrentlyLocked ? (
                          <div className="flex-1 flex flex-col justify-between py-2">
                            <div className="space-y-1">
                              <div className="text-xs font-serif italic text-slate-400">
                                "Bức thư đang được niêm phong..."
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Mở khóa sau {remainingDays} ngày {remainingHours} giờ {remainingMins} phút
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={handleTimeLeap}
                              className="mt-3 w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-mono font-bold text-[9px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 shadow-xs"
                            >
                              <Plane className="w-2.5 h-2.5 rotate-45" />
                              <span>DU HÀNH THỜI GIAN (MỞ KHÓA NGAY)</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="text-[10px] text-amber-800 font-semibold flex items-center gap-1 bg-amber-100/50 px-2 py-0.5 rounded-md border border-amber-100 w-fit">
                                <span>💌</span> Chào cậu, nỗi buồn của 7 ngày trước, cậu đã vượt qua nó chưa?
                              </div>
                              <p className="text-[11px] leading-relaxed text-slate-700 font-serif font-light whitespace-pre-wrap">
                                “ {letter.content} ”
                              </p>
                            </div>
                            
                            <div className="mt-3 pt-2 border-t border-amber-100/50 text-[9px] text-slate-500 leading-normal italic">
                               ✨ CoreZ: Tớ tin rằng thời gian đã mài dũa nỗi lo âu này thành hạt cát trôi xuôi. Cậu tuyệt vời lắm!
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Guidelines info */}
          <div className="pt-2 text-center text-[9px] text-slate-400 font-light border-t border-slate-150/40 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3 h-3 text-emerald-500" />
            <span>Tương tác chữa lành nâng cao sự tự tin, sẻ chia sâu sắc nỗi lo âu và sạc lại năng lượng bản ngã.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
