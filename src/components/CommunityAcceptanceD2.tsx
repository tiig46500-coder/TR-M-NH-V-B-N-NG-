import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Lock, 
  Globe, 
  Clock, 
  Download, 
  Star, 
  User, 
  Check, 
  Info, 
  Award,
  Layers,
  Zap,
  Smile,
  ShieldAlert,
  MessageSquare,
  Eye,
  RefreshCw
} from "lucide-react";
import confetti from "canvas-confetti";
import { 
  CommunityMessage, 
  subscribeCommunityMessages, 
  addCommunityMessage, 
  interactMessage, 
  subscribeGlobalStats, 
  GlobalCommunityStats,
  auth
} from "../lib/firebase";

const PASTEL_COLORS = [
  { class: "bg-rose-950/40 border-rose-500/30 text-rose-100 shadow-rose-900/20", name: "Hồng ấm áp", badge: "bg-rose-500/20 text-rose-300" },
  { class: "bg-sky-950/40 border-sky-500/30 text-sky-100 shadow-sky-900/20", name: "Xanh bình yên", badge: "bg-sky-500/20 text-sky-300" },
  { class: "bg-amber-950/40 border-amber-500/30 text-amber-100 shadow-amber-900/20", name: "Vàng rạng rỡ", badge: "bg-amber-500/20 text-amber-300" },
  { class: "bg-emerald-950/40 border-emerald-500/30 text-emerald-100 shadow-emerald-900/20", name: "Xanh sạc pin", badge: "bg-emerald-500/20 text-emerald-300" },
  { class: "bg-violet-950/40 border-violet-500/30 text-violet-100 shadow-violet-900/20", name: "Tím mộc mạc", badge: "bg-violet-500/20 text-violet-300" }
];

const playSparkleChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const playNote = (freq: number, delay: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };
    [1046.50, 1318.51, 1567.98, 2093.00, 2637.02].forEach((freq, i) => {
      playNote(freq, i * 0.05, 0.5, 0.1);
    });
  } catch (e) {}
};

export default function CommunityAcceptanceD2() {
  const [viewMode, setViewMode] = useState<"4d_universe" | "sharing_wall" | "collection_hub">("4d_universe");
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [globalStats, setGlobalStats] = useState<GlobalCommunityStats>({
    totalMessages: 128,
    totalHugs: 1250,
    totalShines: 890,
    totalCollected: 430,
    totalEnergy: 2100,
    totalStars4D: 320
  });

  // Active anonymous identity state synchronized with header
  const [activeAnonName, setActiveAnonName] = useState<string>(
    () => localStorage.getItem("corez_anon_name") || "Người Lữ Hành #88"
  );

  // Post form state
  const [postContent, setPostContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  const [safetyNotice, setSafetyNotice] = useState<string | null>(null);

  // Active 4D Selected Message Modal
  const [selected4DMsg, setSelected4DMsg] = useState<CommunityMessage | null>(null);
  const [collectedToasts, setCollectedToasts] = useState<Array<{ id: string; text: string }>>([]);

  // Toast notifier helper
  const addToast = (text: string) => {
    const id = "toast_" + Date.now();
    setCollectedToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setCollectedToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  useEffect(() => {
    // Synchronize anonymous identity from auth and storage events
    const syncAnonName = () => {
      const stored = localStorage.getItem("corez_anon_name");
      if (stored) setActiveAnonName(stored);
    };

    window.addEventListener("corez_anon_name_changed", syncAnonName);

    // 1. Real-time Firestore subscription to Community Messages
    const unsubMessages = subscribeCommunityMessages((data) => {
      setMessages(data);
      setIsLoading(false);
    });

    // 2. Real-time Firestore subscription to Global Community Stats
    const unsubStats = subscribeGlobalStats((stats) => {
      setGlobalStats(stats);
    });

    return () => {
      window.removeEventListener("corez_anon_name_changed", syncAnonName);
      if (typeof unsubMessages === "function") unsubMessages();
      if (typeof unsubStats === "function") unsubStats();
    };
  }, []);

  // AI Moderation Shield Check
  const checkSafetyContent = (text: string): boolean => {
    const lower = text.toLowerCase();
    // Check phone numbers / sensitive patterns
    const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/;
    if (phoneRegex.test(text)) {
      setSafetyNotice("Vui lòng không đính kèm số điện thoại cá nhân để bảo vệ sự riêng tư 🛡️");
      return false;
    }
    const toxicKeywords = ["chửi", "đánh", "kết liễu", "tự tử", "giết"];
    for (let k of toxicKeywords) {
      if (lower.includes(k)) {
        setSafetyNotice("Nội dung chứa từ ngữ nhạy cảm. Hãy giữ không gian chữa lành an toàn cho nhau nhé 🌱");
        return false;
      }
    }
    setSafetyNotice(null);
    return true;
  };

  // Submit Post handler
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    if (!checkSafetyContent(postContent)) return;

    setIsPosting(true);
    const currentUser = auth.currentUser;
    const authorUid = currentUser ? currentUser.uid : (localStorage.getItem("corez_anon_uid") || "anon_user");
    const authorName = activeAnonName || localStorage.getItem("corez_anon_name") || "Người Lữ Hành #88";
    const chosenColor = PASTEL_COLORS[selectedColorIdx].class;

    try {
      await addCommunityMessage(postContent.trim(), authorName, authorUid, chosenColor, isPublic);
      playSparkleChime();
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}

      setPostContent("");
      addToast(isPublic ? "Đã tỏa sáng đốm sáng mới lên Không Gian 4D & Bức Tường! ✨" : "Đã lưu riêng tư vào không gian cá nhân 🔒");
    } catch (err) {
      console.error("Error submitting post:", err);
    } finally {
      setIsPosting(false);
    }
  };

  // Interaction handlers
  const handleInteraction = async (msg: CommunityMessage, type: 'energy' | 'hug' | 'shine' | 'collect') => {
    const currentUser = auth.currentUser;
    const uid = currentUser ? currentUser.uid : "anon";
    const anonName = localStorage.getItem("corez_anon_name") || "Mầm Xanh #102";

    try {
      playSparkleChime();
      await interactMessage(msg.id, type, uid, anonName, msg);

      if (type === 'collect') {
        try {
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
        } catch (e) {}
        addToast(`Đã thu thập 1 ${msg.energyItem?.name || "Mảnh Ghép Cảm Xúc"} về Bộ Sưu Tập! 📥✨`);
      } else if (type === 'hug') {
        addToast(`Đã gửi 1 Cái Ôm Ấm Áp đến ${msg.authorName}! 🫂💖`);
      } else if (type === 'energy') {
        addToast(`Đã truyền năng lượng cho bài đăng của ${msg.authorName}! ⚡✨`);
      } else if (type === 'shine') {
        addToast(`Đã thắp sáng đốm sáng 4D! 🌟`);
      }
    } catch (err) {
      console.error("Interaction failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner & View Mode Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[10px] font-extrabold text-sky-400 bg-sky-950/50 px-3 py-1 rounded-full uppercase border border-sky-500/30 tracking-wider">
            Vòng 2: Đối Diện & Chấp Nhận (D2)
          </span>
          <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2 mt-2">
            <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" />
            Vũ Trụ Cảm Xúc & Bức Tường Sẻ Chia 4D
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Kết nối danh tính ẩn danh thời gian thực qua Firestore. Nơi mỗi nỗi niềm hay lời tự chấp nhận biến thành một đốm sáng lơ lửng chứa Mảnh Ghép Cảm Xúc truyền cảm hứng.
          </p>
        </div>

        {/* View Mode Switchers */}
        <div className="flex items-center bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 shadow-lg shrink-0 gap-1">
          <button
            onClick={() => setViewMode("4d_universe")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "4d_universe"
                ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>Vũ Trụ 4D</span>
          </button>
          <button
            onClick={() => setViewMode("sharing_wall")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "sharing_wall"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Bức Tường Sẻ Chia</span>
          </button>
          <button
            onClick={() => setViewMode("collection_hub")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === "collection_hub"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Bộ Sưu Tập</span>
          </button>
        </div>
      </div>

      {/* 2. Community Energy Real-Time Statistics Hub */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-sky-500/20 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
            <Heart className="w-5 h-5 fill-sky-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Lời Ôm Ấm Áp</p>
            <p className="text-base font-extrabold text-white">{globalStats.totalHugs.toLocaleString("vi-VN")}</p>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-amber-500/20 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Sparkles className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Đốm Sáng Thắp Sáng</p>
            <p className="text-base font-extrabold text-white">{globalStats.totalShines.toLocaleString("vi-VN")}</p>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Đã Thu Thập</p>
            <p className="text-base font-extrabold text-white">{globalStats.totalCollected.toLocaleString("vi-VN")}</p>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md p-3.5 rounded-2xl border border-purple-500/20 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
            <Zap className="w-5 h-5 fill-purple-400" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase">Đốm Sáng 4D Vũ Trụ</p>
            <p className="text-base font-extrabold text-white">{globalStats.totalStars4D.toLocaleString("vi-VN")}</p>
          </div>
        </div>
      </div>

      {/* 3. Main Dynamic Content according to viewMode */}
      <AnimatePresence mode="wait">
        
        {/* MODE 1: 4D UNIVERSE STARFIELD */}
        {viewMode === "4d_universe" && (
          <motion.div
            key="view-4d"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-4"
          >
            {/* 4D Galaxy Container */}
            <div className="relative rounded-3xl bg-slate-950 border border-indigo-500/30 p-6 min-h-[480px] overflow-hidden shadow-2xl flex flex-col justify-between">
              
              {/* Starfield animated particle background */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/60 via-slate-950 to-black">
                <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
              </div>

              {/* Header prompt inside 4D canvas */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-sky-300 font-mono uppercase tracking-wider">
                    Vũ Trụ Cảm Xúc Realtime (Chạm vào đốm sáng để mở câu chuyện)
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{messages.length} đốm sáng lơ lửng</span>
                </div>
              </div>

              {/* Floating Starfield Orbs Grid */}
              {isLoading ? (
                <div className="relative z-10 py-16 flex flex-col items-center justify-center space-y-4">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-sky-500/20 border-t-sky-400 animate-spin" />
                    <Sparkles className="w-6 h-6 text-sky-400 animate-pulse" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-extrabold text-white">Đang kết nối Vũ Trụ Cảm Xúc 4D...</p>
                    <p className="text-xs text-sky-300/80 font-mono">Đồng bộ dữ liệu thời gian thực từ Firestore Database</p>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 py-8 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 items-center justify-center min-h-[320px]">
                  {messages.slice(0, 15).map((msg, idx) => {
                    const floatDelay = (idx * 0.4) % 3;
                    const itemIcon = msg.energyItem?.icon || "🌟";

                    return (
                      <motion.button
                        key={msg.id}
                        onClick={() => setSelected4DMsg(msg)}
                        whileHover={{ scale: 1.15, y: -8 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ animationDelay: `${floatDelay}s` }}
                        className="group relative flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/15 backdrop-blur-md border border-white/20 hover:border-sky-400/60 shadow-lg cursor-pointer transition-all duration-300 animate-float"
                      >
                        {/* Floating glowing aura */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-sky-500/20 to-purple-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Item Icon & Star Orb */}
                        <div className="w-12 h-12 rounded-full bg-slate-900/80 border border-sky-400/40 flex items-center justify-center text-2xl shadow-inner group-hover:border-amber-300/80 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all">
                          <span>{itemIcon}</span>
                        </div>

                        {/* Author Anonymous Label */}
                        <span className="text-[10px] font-extrabold text-sky-200 mt-2 tracking-tight group-hover:text-amber-300 truncate max-w-[110px]">
                          {msg.authorName}
                        </span>

                        {/* Compact Energy count badge */}
                        <div className="mt-1 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/90 text-[9px] text-amber-300 font-bold border border-amber-500/30">
                          <Heart className="w-2.5 h-2.5 fill-amber-400" />
                          <span>{msg.energyCount + msg.hugCount}</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Bottom guide */}
              <div className="relative z-10 text-center text-[11px] text-slate-400 italic bg-white/5 py-2 px-4 rounded-xl border border-white/10">
                💡 Mỗi ngôi sao thể hiện một thông điệp chân thành của cộng đồng Gen Z. Thu thập thông điệp để tiếp thêm năng lượng cho hành trình của chính mình!
              </div>

            </div>
          </motion.div>
        )}

        {/* MODE 2: COMMUNITY SHARING WALL */}
        {viewMode === "sharing_wall" && (
          <motion.div
            key="view-wall"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Posting Form */}
            <form onSubmit={handleSubmitPost} className="p-5 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <span>Đăng Lời Chia Sẻ Cảm Xúc</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Trút bỏ áp lực, lo âu hoặc lời tự chấp nhận bản thân.</p>
                  </div>
                </div>

                {/* Active Anonymous Identity Badge & Toggle */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-bold text-emerald-300">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Danh tính: <strong className="text-white">{activeAnonName}</strong></span>
                  </div>

                  {/* Toggle Button: Public vs Private */}
                  <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsPublic(true)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isPublic ? "bg-emerald-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Globe className="w-3 h-3" />
                      <span>Công khai</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPublic(false)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        !isPublic ? "bg-amber-500 text-white shadow-sm" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>Riêng tư</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Input textarea */}
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  maxLength={240}
                  placeholder="Viết điều cậu đang trăn trở hoặc câu nói tự chấp nhận bản thân (Ví dụ: Mình chấp nhận rằng mình không hoàn hảo, nhưng mỗi ngày mình đều cố gắng hết sức...)"
                  className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-slate-950/80 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 leading-relaxed"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono px-1">
                  <span>AI Safety Shield: Tự động lọc từ ngữ tiêu cực & SĐT 🛡️</span>
                  <span>{postContent.length} / 240 kí tự</span>
                </div>
              </div>

              {/* Color style picker & Submit button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-[11px] font-bold text-slate-400">Màu thẻ:</span>
                  <div className="flex items-center gap-1.5">
                    {PASTEL_COLORS.map((col, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedColorIdx(idx)}
                        className={`w-6 h-6 rounded-lg ${col.class.split(" ")[0]} border border-white/20 transition-all cursor-pointer ${
                          selectedColorIdx === idx ? "ring-2 ring-emerald-400 scale-110 shadow-md" : "opacity-60 hover:opacity-100"
                        }`}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPosting || !postContent.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPublic ? "Đăng Lên Bức Tường" : "Lưu Riêng Tư"}</span>
                </button>
              </div>

              {safetyNotice && (
                <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-bounce">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{safetyNotice}</span>
                </div>
              )}
            </form>

            {/* Sharing Wall Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`p-5 rounded-3xl border backdrop-blur-xl shadow-lg flex flex-col justify-between space-y-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${msg.color}`}
                  >
                    {/* Top line: Author & Badge */}
                    <div className="flex items-center justify-between text-xs border-b border-white/10 pb-2">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 opacity-80" />
                        <span className="font-extrabold tracking-tight">{msg.authorName}</span>
                      </div>
                      <span className="text-[10px] font-mono opacity-70">{msg.createdAtText || "Vừa xong"}</span>
                    </div>

                    {/* Content text */}
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-100 font-sans text-justify">
                      “ {msg.content} ”
                    </p>

                    {/* Embedded Energy Item Badge */}
                    <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-2xl border border-white/10 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{msg.energyItem?.icon || "🧩"}</span>
                        <div>
                          <p className="font-extrabold text-[11px] text-amber-300">{msg.energyItem?.name || "Mảnh Ghép Bản Ngã"}</p>
                          <p className="text-[9px] opacity-70">Vật phẩm chữa lành</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleInteraction(msg, 'collect')}
                        className="px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-extrabold text-[10px] border border-amber-500/30 transition-all flex items-center gap-1 cursor-pointer"
                        title="Thu thập về bộ sưu tập cá nhân"
                      >
                        <Download className="w-3 h-3" />
                        <span>Thu thập</span>
                      </button>
                    </div>

                    {/* Positive Reaction Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
                      <button
                        onClick={() => handleInteraction(msg, 'energy')}
                        className="flex items-center gap-1 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-bold text-[11px]">{msg.energyCount}</span>
                      </button>

                      <button
                        onClick={() => handleInteraction(msg, 'hug')}
                        className="flex items-center gap-1 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/50" />
                        <span className="font-bold text-[11px]">{msg.hugCount} Ôm</span>
                      </button>

                      <button
                        onClick={() => handleInteraction(msg, 'shine')}
                        className="flex items-center gap-1 text-slate-300 hover:text-sky-300 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                        <span className="font-bold text-[11px]">{msg.shineCount}</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* MODE 3: COMMUNITY COLLECTION HUB */}
        {viewMode === "collection_hub" && (
          <motion.div
            key="view-hub"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-white/10 space-y-6"
          >
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Trung Tâm Thu Thập Năng Lượng Cộng Đồng
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Tổng hợp tất cả Mảnh Ghép Bản Ngã, Ngôi Sao Đồng Cảm và Hạt Giống Chấp Nhận đã được lan tỏa.
                </p>
              </div>
            </div>

            {/* Collection Grid display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🧩</span>
                  <span className="text-xs font-mono bg-amber-500/20 px-2 py-0.5 rounded-full font-bold">Thu thập nhiều nhất</span>
                </div>
                <h5 className="font-bold text-sm text-amber-300">Mảnh Ghép Bản Ngã</h5>
                <p className="text-xs opacity-80 leading-relaxed">Giúp chắp vá những vỡ vụn lo âu, đem lại sự tự tin cho tâm trí.</p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-950/40 border border-sky-500/30 text-sky-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌟</span>
                  <span className="text-xs font-mono bg-sky-500/20 px-2 py-0.5 rounded-full font-bold">Thắp sáng 24/7</span>
                </div>
                <h5 className="font-bold text-sm text-sky-300">Ngôi Sao Đồng Cảm</h5>
                <p className="text-xs opacity-80 leading-relaxed">Minh chứng cho việc cậu không bao giờ cô đơn giữa bầu trời Gen Z.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🌱</span>
                  <span className="text-xs font-mono bg-emerald-500/20 px-2 py-0.5 rounded-full font-bold">Nuôi dưỡng tự tại</span>
                </div>
                <h5 className="font-bold text-sm text-emerald-300">Hạt Giống Chấp Nhận</h5>
                <p className="text-xs opacity-80 leading-relaxed">Nảy mầm từ lòng dũng cảm đối diện với khiếm khuyết của chính mình.</p>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Interactive Modal: 4D Selected Message Detail */}
      <AnimatePresence>
        {selected4DMsg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-slate-900 border border-sky-500/40 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden"
            >
              {/* Decorative top glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selected4DMsg.energyItem?.icon || "🌟"}</span>
                  <div>
                    <h3 className="text-sm font-extrabold text-white">{selected4DMsg.authorName}</h3>
                    <p className="text-[10px] text-sky-300 font-mono">{selected4DMsg.createdAtText || "Vừa xong"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelected4DMsg(null)}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <p className="text-sm text-slate-100 leading-relaxed font-sans text-justify">
                  “ {selected4DMsg.content} ”
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-white/10 text-xs font-mono text-amber-300 font-bold">
                  <span>Chứa: {selected4DMsg.energyItem?.name || "Mảnh Ghép Bản Ngã"}</span>
                  <span>(+{selected4DMsg.energyItem?.energyVal || 20} XP)</span>
                </div>
              </div>

              {/* Action Buttons in Modal */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <button
                  onClick={() => handleInteraction(selected4DMsg, 'energy')}
                  className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-amber-400" />
                  <span>Truyền NL</span>
                </button>

                <button
                  onClick={() => handleInteraction(selected4DMsg, 'hug')}
                  className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-rose-400" />
                  <span>Gửi Ôm</span>
                </button>

                <button
                  onClick={() => handleInteraction(selected4DMsg, 'shine')}
                  className="p-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  <span>Thắp Sáng</span>
                </button>

                <button
                  onClick={() => handleInteraction(selected4DMsg, 'collect')}
                  className="p-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Thu Thập</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[120] flex flex-col gap-2 pointer-events-none max-w-sm">
        <AnimatePresence>
          {collectedToasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="p-3.5 rounded-2xl bg-slate-900/95 text-white border border-emerald-500/40 shadow-2xl text-xs font-bold flex items-center gap-2 backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toast.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
