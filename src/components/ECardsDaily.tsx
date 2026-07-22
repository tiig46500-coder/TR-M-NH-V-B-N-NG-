import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  CheckCircle2, 
  Shuffle, 
  MessageCircle, 
  ShieldCheck, 
  Bookmark, 
  X,
  Copy,
  Check,
  Trophy,
  WifiOff,
  Utensils,
  Heart,
  GraduationCap,
  Sprout,
  Compass,
  Zap,
  Edit3,
  Flame,
  VolumeX,
  UserCheck
} from "lucide-react";
import { useUserData } from "../context/UserContext";
import { saveFavoritePost } from "./GocBinhYen";
import confetti from "canvas-confetti";

export interface ECardItem {
  id: string;
  categoryTag: string; // e.g. "NGẮT SÓNG", "PHÁ BĂNG", "SOI CHIẾU", "GIA SƯ", "ĐỒNG ĐẢNG", "DÃ NGOẠI"
  icon: string; // e.g. "off", "utensils", "handshake", "school", "sprout", "letter"
  title: string; // Tên nhiệm vụ (Gợi ý hành động thực tế)
  xp: number;
  dialogueSample: string; // Lời thoại mẫu giao tiếp
  psychologicalGoal: string; // Mục tiêu tâm lý chữa lành bản ngã / giảm FOMO
  targetRole: string; // Học sinh, Cha mẹ, Thầy cô
}

export const DAILY_E_CARDS: ECardItem[] = [
  {
    id: "card-1",
    categoryTag: "NGẮT SÓNG",
    icon: "off",
    title: "Thử thách 2h không Notification",
    xp: 15,
    dialogueSample: "Hôm nay con/tớ muốn dành 2 tiếng trọn vẹn để tập trung làm điều mình thích mà không bị xao nhãng bởi tiếng chuông thông báo. Cùng ngắt chuông với tớ nhé!",
    psychologicalGoal: "Giúp tái khẳng định giá trị cốt lõi, giảm hội chứng sợ bị bỏ lỡ (FOMO) và giảm áp lực so sánh trên không gian mạng.",
    targetRole: "Học sinh & Giới trẻ"
  },
  {
    id: "card-2",
    categoryTag: "PHÁ BĂNG",
    icon: "utensils",
    title: "Phá băng bàn ăn gia đình",
    xp: 15,
    dialogueSample: "Ba/Mẹ ơi, hôm nay con cất điện thoại sang một bên để ăn cơm cùng nhà. Ba mẹ kể cho con nghe ngày xưa tuổi xì-tin ba mẹ có kỷ niệm gì vui nhất không?",
    psychologicalGoal: "Chữa lành tổn thương do thiếu hụt sự hiện diện thực tế (Presence Deficit), củng cố cảm giác gia đình là bệ đỡ an toàn.",
    targetRole: "Cha mẹ & Học sinh"
  },
  {
    id: "card-3",
    categoryTag: "SOI CHIẾU",
    icon: "handshake",
    title: "Gương mặt thật của con",
    xp: 15,
    dialogueSample: "Hôm nay con cảm thấy hơi mệt mỏi và chông chênh. Con không muốn giấu cảm xúc nữa. Mẹ có thể ôm con 10 giây mà không cần khuyên bảo gì không?",
    psychologicalGoal: "Bộc lộ tổn thương bản ngã chông chênh, gỡ bỏ chiếc mặt nạ gượng gạo trên mạng xã hội để đón nhận tình thương thực tế.",
    targetRole: "Cha mẹ & Con cái"
  },
  {
    id: "card-4",
    categoryTag: "GIA SƯ",
    icon: "school",
    title: "Mở lòng với Thầy Cô giáo",
    xp: 15,
    dialogueSample: "Thầy/Cô ơi, em rất muốn cố gắng môn học này nhưng dạo này tâm trí em hơi xao nhãng. Em xin phép thầy/cô hướng dẫn em cách tập trung lại ạ.",
    psychologicalGoal: "Tái khẳng định giá trị bản thân, gỡ bỏ rào cản tự ti và xây dựng mối liên kết tin cậy giữa thầy cô và học sinh.",
    targetRole: "Thầy Cô & Học sinh"
  },
  {
    id: "card-5",
    categoryTag: "ĐỒNG ĐẢNG",
    icon: "sprout",
    title: "Hỏi thăm người thầm lặng",
    xp: 15,
    dialogueSample: "Cậu ơi, dạo này thấy cậu hơi im lặng. Tớ mua tặng cậu hộp sữa này, nếu cần người lắng nghe tớ luôn ở đây nhé!",
    psychologicalGoal: "Xây dựng sự thấu cảm học đường, chống lại xu hướng cô lập hóa trên không gian mạng và nuôi dưỡng mầm chánh niệm.",
    targetRole: "Bạn bè & Học sinh"
  },
  {
    id: "card-6",
    categoryTag: "DÃ NGOẠI",
    icon: "letter",
    title: "Kêu gọi dã ngoại ngắt kết nối",
    xp: 15,
    dialogueSample: "Cuối tuần này cả nhóm mình cùng đi công viên cắm trại không mang laptop được không? Chúng mình cùng chơi boardgame và ngắm mây trời nhé!",
    psychologicalGoal: "Tái tạo năng lượng chánh niệm từ thiên nhiên, kéo người trẻ rời khỏi không gian ảo để tìm lại nhịp thở tự nhiên.",
    targetRole: "Học sinh & Nhóm bạn"
  }
];

export const ECardsDaily: React.FC = () => {
  const { userData, addXP, updateProfile } = useUserData();
  
  // User ID binding for state persistence isolation
  const activeUserId = userData?.userId || localStorage.getItem("USER_ID") || "default_user";
  const storageKeyCompleted = "corez_completed_ecards_daily_" + activeUserId;
  const storageKeyPopupDate = "corez_ecard_daily_popup_date_" + activeUserId;

  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const activeUserId = userData?.userId || localStorage.getItem("USER_ID") || "default_user";
      const key = "corez_completed_ecards_daily_" + activeUserId;
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      const oldSaved = localStorage.getItem("corez_completed_ecards_daily");
      return oldSaved ? JSON.parse(oldSaved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCard, setSelectedCard] = useState<ECardItem | null>(null);
  const [dailyPopupOpen, setDailyPopupOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Profile Edit Modal State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(userData.name || "");
  const [editVibe, setEditVibe] = useState(userData.vibe || "");
  const [editGoal, setEditGoal] = useState(userData.goal || "");

  // Sync completion list on user change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKeyCompleted);
      if (saved) {
        setCompletedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeUserId, storageKeyCompleted]);

  // Auto show daily pop-up once per day per user
  useEffect(() => {
    const lastPopDate = localStorage.getItem(storageKeyPopupDate);
    const todayStr = new Date().toDateString();
    if (lastPopDate !== todayStr) {
      // Pick random card
      const randomCard = DAILY_E_CARDS[Math.floor(Math.random() * DAILY_E_CARDS.length)];
      setSelectedCard(randomCard);
      setDailyPopupOpen(true);
      localStorage.setItem(storageKeyPopupDate, todayStr);
    }
  }, [activeUserId, storageKeyPopupDate]);

  const handleDrawRandom = () => {
    const randomIndex = Math.floor(Math.random() * DAILY_E_CARDS.length);
    setSelectedCard(DAILY_E_CARDS[randomIndex]);
    setDailyPopupOpen(true);
    confetti({ particleCount: 35, spread: 65, origin: { y: 0.6 } });
  };

  const handleAiWeave = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      const aiCard: ECardItem = {
        id: "ai-card-" + Date.now(),
        categoryTag: "COREZ AI",
        icon: "sparkles",
        title: customPrompt ? `Nhiệm vụ: ${customPrompt.slice(0, 25)}...` : "Dệt chánh niệm riêng cho cậu",
        xp: 20,
        dialogueSample: `Chào cậu, dựa trên năng lượng "${userData.vibe || "Mầm non"}", CoreZ gửi tặng lời thoại: "Tớ muốn gác lại thông báo 1 giờ để cảm nhận hiện tại rõ hơn."`,
        psychologicalGoal: `Giải tỏa áp lực lo âu FOMO, củng cố mục tiêu "${userData.goal || "Bình yên"}".`,
        targetRole: "Bản ngã & Bạn đồng hành"
      };
      setSelectedCard(aiCard);
      setIsAiGenerating(false);
      setDailyPopupOpen(true);
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    }, 1200);
  };

  const handleCompleteCard = (cardId: string) => {
    if (completedIds.includes(cardId)) return;
    const updated = [...completedIds, cardId];
    setCompletedIds(updated);
    localStorage.setItem(storageKeyCompleted, JSON.stringify(updated));
    addXP(15);
    confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToGocBinhYen = (card: ECardItem) => {
    saveFavoritePost({
      id: "ecard_" + card.id,
      authorName: "CoreZ E-Card",
      aiAdvice: `${card.title}: "${card.dialogueSample}"\n💡 ${card.psychologicalGoal}`,
      category: card.categoryTag
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="w-full font-sans rounded-[32px] bg-[#0c2217] dark:bg-[#07170f] text-slate-100 p-6 sm:p-8 border border-emerald-900/60 shadow-2xl space-y-6">
      
      {/* 1. TOP HEADER BANNER matching exact dark green screenshot UI */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-emerald-900/40 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>CÔNG CỤ ĐẶC BIỆT VÒNG 4</span>
          </div>
          
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-emerald-100 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
            <span>Bộ E-Cards “Chạm Vào Bản Ngã”</span>
          </h2>

          <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed font-light">
            Thẻ bài điện tử chứa nhiệm vụ thực tế, mẫu lời thoại phá băng khoảng cách và cơ sở tâm lý chữa lành tổn thương bản ngã, giúp cậu kết nối thật với gia đình, nhà trường và bè bạn.
          </p>
        </div>

        {/* Progress Box top right */}
        <div className="shrink-0 bg-[#122e20] border border-emerald-800/80 rounded-2xl p-4 flex items-center gap-4 shadow-inner">
          <div className="w-10 h-10 rounded-xl bg-emerald-800/60 flex items-center justify-center text-amber-400 border border-emerald-700/50">
            <Trophy className="w-5 h-5 fill-amber-400/20" />
          </div>
          <div>
            <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-emerald-400 block">TIẾN TRÌNH</span>
            <span className="text-base font-bold text-white font-mono">
              Đã làm: <strong className="text-emerald-400">{completedIds.length}</strong>/{DAILY_E_CARDS.length} thẻ
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: VŨ TRỤ DỆT NHIỆM VỤ & THÔNG TIN CHÒM SAO */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card: VŨ TRỤ DỆT NHIỆM VỤ */}
          <div className="bg-[#122b1e] border border-emerald-800/60 rounded-[28px] p-6 space-y-5 text-center relative overflow-hidden">
            <h3 className="text-xs font-extrabold tracking-widest text-emerald-300 uppercase font-mono">
              VŨ TRỤ DỆT NHIỆM VỤ
            </h3>

            {/* Crystal Ball Visual */}
            <div className="py-4 flex justify-center">
              <motion.div 
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="w-28 h-28 rounded-2xl bg-gradient-to-br from-emerald-800 to-teal-950 border border-emerald-600/40 flex items-center justify-center text-4xl shadow-lg relative cursor-pointer group"
                onClick={handleDrawRandom}
              >
                <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-md group-hover:bg-emerald-500/20 transition-all" />
                <span className="relative z-10 filter drop-shadow">🔮</span>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleDrawRandom}
                className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔮</span>
                <span>Rút ngẫu nhiên</span>
              </button>

              <button
                onClick={handleAiWeave}
                disabled={isAiGenerating}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isAiGenerating ? "Đang dệt..." : "CoreZ AI dệt riêng"}</span>
              </button>
            </div>
          </div>

          {/* Card: THÔNG TIN CHÒM SAO CÁ NHÂN */}
          <div className="bg-[#122b1e] border border-emerald-800/60 rounded-[28px] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2.5">
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-300 uppercase flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                THÔNG TIN CHÒM SAO CÁ NHÂN:
              </span>
              <button 
                onClick={() => {
                  setEditName(userData.name || "");
                  setEditVibe(userData.vibe || "🌱 Mầm non chữa lành (Bắt đầu tìm lại sự tích cực)");
                  setEditGoal(userData.goal || "Tìm người lắng nghe");
                  setIsEditingProfile(true);
                }}
                className="text-[10px] text-emerald-400 hover:underline font-bold cursor-pointer"
              >
                Chỉnh sửa
              </button>
            </div>

            <div className="space-y-1.5 text-xs text-emerald-100">
              <p className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">Cậu là:</span>
                <span className="font-medium text-white">{userData.name || "Bạn nhỏ ẩn danh"}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">Năng lượng:</span>
                <span className="bg-emerald-900/60 px-2 py-0.5 rounded text-emerald-200 text-[11px]">
                  {userData.vibe || "🌱 Mầm non chữa lành"}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">Mục tiêu:</span>
                <span className="text-emerald-200 text-[11px] italic">
                  {userData.goal || "Tìm người lắng nghe"}
                </span>
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: THƯ VIỆN THẺ CHẠM BẢN NGÃ (6 THẺ) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-xs font-extrabold tracking-widest text-emerald-300 uppercase font-mono flex items-center gap-2">
            <span>📖</span>
            <span>THƯ VIỆN THẺ CHẠM BẢN NGÃ ({DAILY_E_CARDS.length} THẺ):</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DAILY_E_CARDS.map((card) => {
              const isDone = completedIds.includes(card.id);

              return (
                <div
                  key={card.id}
                  onClick={() => {
                    setSelectedCard(card);
                    setDailyPopupOpen(true);
                  }}
                  className={`relative rounded-2xl border p-4 bg-[#122d1f] hover:bg-[#163726] transition-all cursor-pointer space-y-3 shadow-sm hover:border-emerald-500/60 ${
                    isDone ? "border-emerald-500/80 bg-emerald-950/40" : "border-emerald-800/60"
                  }`}
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold tracking-widest text-emerald-300 uppercase">
                      {card.categoryTag}
                    </span>
                    <span className="p-1 rounded bg-emerald-900/50 text-emerald-400 text-xs">
                      {card.icon === "off" && "🔕"}
                      {card.icon === "utensils" && "🍽️"}
                      {card.icon === "handshake" && "🤝"}
                      {card.icon === "school" && "🏫"}
                      {card.icon === "sprout" && "🌱"}
                      {card.icon === "letter" && "💌"}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-serif text-sm font-bold text-emerald-100 leading-snug">
                    {card.title}
                  </h4>

                  {/* Footer Stats */}
                  <div className="pt-2 border-t border-emerald-800/40 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                    <span className="flex items-center gap-1">
                      Chi tiết • +{card.xp} XP
                      {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />}
                    </span>
                    <span className="font-extrabold text-emerald-300">COREZ</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 3. POP-UP NOTIFICATION MODAL (ECardsDaily - Popup ngẫu nhiên 1 lần/ngày) */}
      <AnimatePresence>
        {dailyPopupOpen && selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0d261a] border border-emerald-500/50 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 overflow-hidden"
            >
              {/* Header Alert */}
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase font-mono">
                      THÔNG BÁO DAILY E-CARD • COREZ
                    </span>
                    <h3 className="font-serif text-lg font-bold text-emerald-100">
                      Chạm Vào Bản Ngã Hôm Nay 🎴
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setDailyPopupOpen(false)}
                  className="p-2 rounded-full hover:bg-emerald-900/60 text-emerald-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 3 MANDATORY CARD SECTIONS as requested */}
              <div className="space-y-4">
                
                {/* 1. TÊN NHIỆM VỤ (Gợi ý hành động thực tế) */}
                <div className="bg-[#133323] border border-emerald-700/50 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      1. Tên Nhiệm Vụ (Gợi ý hành động thực tế):
                    </span>
                    <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono">
                      +{selectedCard.xp} XP
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white">
                    {selectedCard.title}
                  </h4>
                  <p className="text-[11px] text-emerald-200/80 font-light">
                    Đối tượng hướng tới: <strong>{selectedCard.targetRole}</strong>
                  </p>
                </div>

                {/* 2. LỜI THOẠI MẪU (Mẫu câu giao tiếp giữa Thầy/Cô/Cha mẹ và Học sinh) */}
                <div className="bg-[#133323] border border-emerald-700/50 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
                      2. Lời Thoại Mẫu Phá Bằng Giao Tiếp:
                    </span>
                    <button
                      onClick={() => handleCopy(selectedCard.dialogueSample)}
                      className="text-[10px] font-bold text-emerald-300 hover:text-emerald-100 flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "Đã chép" : "Sao chép"}</span>
                    </button>
                  </div>

                  <p className="italic text-xs sm:text-sm text-emerald-100 leading-relaxed font-serif bg-black/30 p-3 rounded-xl border border-emerald-900/40">
                    "{selectedCard.dialogueSample}"
                  </p>
                </div>

                {/* 3. MỤC TIÊU TÂM LÝ (Chú thích chữa lành tổn thương bản ngã/giảm FOMO) */}
                <div className="bg-[#133323] border border-emerald-700/50 p-4 rounded-2xl space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    3. Mục Tiêu Tâm Lý Chữa Lành Bản Ngã:
                  </span>
                  <p className="text-xs text-emerald-200/90 leading-relaxed font-light">
                    {selectedCard.psychologicalGoal}
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    handleCompleteCard(selectedCard.id);
                    setDailyPopupOpen(false);
                  }}
                  disabled={completedIds.includes(selectedCard.id)}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                    completedIds.includes(selectedCard.id)
                      ? "bg-emerald-900/60 text-emerald-400 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedIds.includes(selectedCard.id) 
                      ? "Đã Hoàn Thành Nhiệm Vụ" 
                      : `Xác Nhận Thực Hiện Ngay (+${selectedCard.xp} XP)`}
                  </span>
                </button>

                <button
                  onClick={() => handleSaveToGocBinhYen(selectedCard)}
                  className="py-3 px-4 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-700/50"
                >
                  <Bookmark className={`w-4 h-4 ${saved ? "fill-emerald-400 text-emerald-400" : ""}`} />
                  <span>{saved ? "Đã Lưu" : "Lưu Góc Bình Yên"}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. PROFILE EDIT MODAL */}
      <AnimatePresence>
        {isEditingProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0d261a] border border-emerald-500/50 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase font-mono">
                      HỒ SƠ CÁ NHÂN • COREZ
                    </span>
                    <h3 className="font-serif text-lg font-bold text-emerald-100">
                      Chỉnh Sửa Thông Tin Cá Nhân 🏷️
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="p-2 rounded-full hover:bg-emerald-900/60 text-emerald-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* 🏷️ Tên gọi (Custom Nickname) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <span>🏷️</span> Tên gọi (Custom Nickname)
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nhập biệt danh hoặc tên của cậu..."
                    className="w-full px-4 py-3 rounded-xl bg-[#123323] border border-emerald-700/60 text-emerald-100 placeholder:text-emerald-500/60 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 text-sm font-medium"
                  />
                </div>

                {/* 🌌 Mức năng lượng hiện tại (Energy Status) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <span>🌌</span> Mức năng lượng hiện tại (Energy Status)
                  </label>
                  <div className="space-y-2">
                    {[
                      {
                        id: "☁️ Đám mây u tím mệt mỏi (Cần nghỉ ngơi, lắng đọng)",
                        label: "☁️ Đám mây u tím mệt mỏi (Cần nghỉ ngơi, lắng đọng)",
                      },
                      {
                        id: "🌱 Mầm non chữa lành (Bắt đầu tìm lại sự tích cực)",
                        label: "🌱 Mầm non chữa lành (Bắt đầu tìm lại sự tích cực)",
                      },
                      {
                        id: "🔥 Lửa nhỏ động lực (Sẵn sàng chia sẻ và kết nối)",
                        label: "🔥 Lửa nhỏ động lực (Sẵn sàng chia sẻ và kết nối)",
                      },
                      {
                        id: "🌊 Dòng nước chông chênh (Đang có nhiều xáo trộn, cần điểm tựa)",
                        label: "🌊 Dòng nước chông chênh (Đang có nhiều xáo trộn, cần điểm tựa)",
                      },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setEditVibe(opt.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                          editVibe === opt.id
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-100 font-bold"
                            : "bg-[#123323]/60 border-emerald-900/60 text-emerald-300/80 hover:bg-[#123323]"
                        }`}
                      >
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🎯 Mục tiêu tham gia (Personal Goal) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 uppercase tracking-wider">
                    <span>🎯</span> Mục tiêu tham gia (Personal Goal)
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "Tìm người lắng nghe", label: "👂 Tìm người lắng nghe" },
                      { id: "Tìm lối thoát áp lực", label: "🚪 Tìm lối thoát áp lực" },
                      { id: "Tìm một không gian yên tĩnh", label: "🍃 Tìm một không gian yên tĩnh" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setEditGoal(opt.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                          editGoal === opt.id
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-100 font-bold"
                            : "bg-[#123323]/60 border-emerald-900/60 text-emerald-300/80 hover:bg-[#123323]"
                        }`}
                      >
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Save Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/70 text-emerald-300 font-bold text-xs border border-emerald-800/60 transition-all cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateProfile(
                      editName.trim() || "Cậu",
                      editVibe || "🌱 Mầm non chữa lành (Bắt đầu tìm lại sự tích cực)",
                      editGoal || "Tìm người lắng nghe"
                    );
                    setIsEditingProfile(false);
                    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Lưu thay đổi
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ECardsDaily;
