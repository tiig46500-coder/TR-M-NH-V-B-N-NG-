import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Shuffle, 
  MessageCircle, 
  ShieldCheck, 
  Zap, 
  Bookmark, 
  Users, 
  Award, 
  Bell, 
  X,
  Copy,
  Check
} from "lucide-react";
import { useUserData } from "../context/UserContext";
import { saveFavoritePost } from "./GocBinhYen";
import confetti from "canvas-confetti";

export interface ECard {
  id: string;
  title: string; // Tên nhiệm vụ
  targetGroup: "student" | "parent" | "teacher" | "all"; // Lực lượng hướng tới
  targetGroupLabel: string;
  dialogueSample: string; // Lời thoại mẫu phá băng
  psychologicalGoal: string; // Mục tiêu tâm lý chữa lành bản ngã chông chênh
  category: "detox" | "connect" | "healing" | "discipline";
  bgGradient: string;
  accentColor: string;
  badgeEmoji: string;
}

export const E_CARDS_DATA: ECard[] = [
  {
    id: "ecard-1",
    title: "Thử thách 2h không Notification",
    targetGroup: "student",
    targetGroupLabel: "Học Sinh & Giới Trẻ",
    dialogueSample: "Hôm nay con/tớ muốn dành 2 tiếng trọn vẹn để tập trung làm điều mình thích mà không bị xao nhãng bởi tiếng chuông thông báo. Cùng cắt thông báo với tớ nhé!",
    psychologicalGoal: "Giúp tái khẳng định giá trị cốt lõi, giảm hội chứng sợ bị bỏ lỡ (FOMO) và giảm áp lực so sánh trên không gian mạng.",
    category: "detox",
    bgGradient: "from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border-emerald-300/40",
    accentColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200",
    badgeEmoji: "🔕"
  },
  {
    id: "ecard-2",
    title: "Cuộc đối thoại chân thành 3 phút",
    targetGroup: "student",
    targetGroupLabel: "Học Sinh & Giới Trẻ",
    dialogueSample: "Mẹ ơi/Bạn ơi, hôm nay mình thấy hơi chông chênh và áp lực. Bạn/Mẹ có thể ngồi ăn cùng tớ và lắng nghe tớ 3 phút mà không phán xét không?",
    psychologicalGoal: "Bộc lộ tổn thương bản ngã chông chênh, tìm kiếm bệ đỡ an toàn từ gia đình/bạn bè thay vì chịu đựng tâm lý cô độc trên mạng.",
    category: "connect",
    bgGradient: "from-sky-500/10 via-indigo-500/5 to-blue-500/10 border-sky-300/40",
    accentColor: "text-sky-600 bg-sky-50 dark:bg-sky-950/40 border-sky-200",
    badgeEmoji: "💬"
  },
  {
    id: "ecard-3",
    title: "Tháo bỏ nhãn mác tự ti học đường",
    targetGroup: "student",
    targetGroupLabel: "Học Sinh & Giới Trẻ",
    dialogueSample: "Thầy/Cô ơi, em rất muốn hiểu thêm bài học này nhưng trước đây em ngại hỏi. Hôm nay em có thể xin thầy/cô 5 phút giải đáp giúp em được không ạ?",
    psychologicalGoal: "Tái khẳng định giá trị bản thân, gỡ bỏ rào cản tự ti và xây dựng niềm tin vào sự đồng hành từ thầy cô.",
    category: "healing",
    bgGradient: "from-amber-500/10 via-orange-500/5 to-yellow-500/10 border-amber-300/40",
    accentColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200",
    badgeEmoji: "🌱"
  },
  {
    id: "ecard-4",
    title: "Bữa ăn Chánh niệm - Không màn hình",
    targetGroup: "parent",
    targetGroupLabel: "Cha Mẹ & Phụ Huynh",
    dialogueSample: "Con yêu, hôm nay ba mẹ sẽ cất điện thoại sang một bên. Con kể cho ba mẹ nghe về điều làm con mỉm cười nhiều nhất ngày hôm nay nhé!",
    psychologicalGoal: "Chữa lành tổn thương do thiếu hụt sự hiện diện thực tế (Presence Deficit), củng cố cảm giác được tôn trọng và thấu hiểu của con trẻ.",
    category: "connect",
    bgGradient: "from-rose-500/10 via-pink-500/5 to-purple-500/10 border-rose-300/40",
    accentColor: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200",
    badgeEmoji: "🍽️"
  },
  {
    id: "ecard-5",
    title: "Công nhận nỗ lực thay vì áp lực thành tích",
    targetGroup: "parent",
    targetGroupLabel: "Cha Mẹ & Phụ Huynh",
    dialogueSample: "Ba/Mẹ nhìn thấy sự kiên trì vượt khó của con mấy ngày qua rồi. Cho dù kết quả ra sao, sự cố gắng của con vẫn luôn làm ba mẹ tự hào.",
    psychologicalGoal: "Xóa bỏ bẫy tâm lý hoàn hảo (Perfectionism Trap), giúp con trẻ giải tỏa sự lo âu sợ bị so sánh với 'con nhà người ta'.",
    category: "healing",
    bgGradient: "from-teal-500/10 via-emerald-500/5 to-lime-500/10 border-teal-300/40",
    accentColor: "text-teal-600 bg-teal-50 dark:bg-teal-950/40 border-teal-200",
    badgeEmoji: "❤️"
  },
  {
    id: "ecard-6",
    title: "Lời xin lỗi dũng cảm gỡ bỏ khoảng cách",
    targetGroup: "parent",
    targetGroupLabel: "Cha Mẹ & Phụ Huynh",
    dialogueSample: "Hôm qua ba/mẹ đã quá vội vã khi trách mắng con trước mặt người khác. Cho mẹ xin lỗi vì đã chưa lắng nghe trọn vẹn góc nhìn của con nhé.",
    psychologicalGoal: "Mô hình hóa sự dũng cảm và bao dung trong gia đình, giúp con học cách đối diện với tổn thương một cách chánh niệm và chữa lành.",
    category: "connect",
    bgGradient: "from-indigo-500/10 via-purple-500/5 to-sky-500/10 border-indigo-300/40",
    accentColor: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200",
    badgeEmoji: "🫂"
  },
  {
    id: "ecard-7",
    title: "Góc sẻ chia 1 phút đầu giờ học",
    targetGroup: "teacher",
    targetGroupLabel: "Thầy Cô & Chuyên Gia",
    dialogueSample: "Thầy/Cô nhận thấy hôm nay lớp mình hơi mệt mỏi. Chúng ta dành 1 phút hít thở sâu và chia sẻ nhanh 1 từ đại diện cho cảm xúc hiện tại nhé!",
    psychologicalGoal: "Xây dựng môi trường an toàn tâm lý (Psychological Safety) trong lớp học, bình thường hóa việc bộc lộ cảm xúc mỏi mệt.",
    category: "discipline",
    bgGradient: "from-violet-500/10 via-fuchsia-500/5 to-purple-500/10 border-violet-300/40",
    accentColor: "text-violet-600 bg-violet-50 dark:bg-violet-950/40 border-violet-200",
    badgeEmoji: "🧘"
  },
  {
    id: "ecard-8",
    title: "Lời khen ngợi ngầm ẩn gửi học sinh",
    targetGroup: "teacher",
    targetGroupLabel: "Thầy Cô & Chuyên Gia",
    dialogueSample: "Thầy/Cô chú ý thấy em dạo này có nhiều tiến bộ trong thái độ lắng nghe và kiểm soát cảm xúc. Cố gắng giữ vững sự điềm tĩnh này nhé, thầy/cô tin em!",
    psychologicalGoal: "Tái khẳng định giá trị bản thân (Self-Worth), tiếp thêm động lực nội tại cho học sinh đang trong giai đoạn chông chênh định hướng.",
    category: "healing",
    bgGradient: "from-amber-500/10 via-emerald-500/5 to-teal-500/10 border-amber-300/40",
    accentColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200",
    badgeEmoji: "✨"
  },
  {
    id: "ecard-9",
    title: "Chủ động giăng lưới an sinh tinh thần",
    targetGroup: "teacher",
    targetGroupLabel: "Thầy Cô & Chuyên Gia",
    dialogueSample: "Thầy/Cô thấy em dạo này trầm ngâm hơn thường ngày. Thầy/Cô luôn ở phòng tư vấn/góc lớp nếu em cần một nơi an toàn để trút bầu tâm sự.",
    psychologicalGoal: "Chủ động nhận diện học sinh có nguy cơ thu mình cô độc, ngăn ngừa khủng hoảng tâm lý tuổi học đường.",
    category: "connect",
    bgGradient: "from-blue-500/10 via-sky-500/5 to-cyan-500/10 border-blue-300/40",
    accentColor: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200",
    badgeEmoji: "🛡️"
  }
];

export default function ECardsTouchYourSelf() {
  const { userData, addXP } = useUserData();
  const [selectedGroup, setSelectedGroup] = useState<"all" | "student" | "parent" | "teacher">("all");
  const [activeCard, setActiveCard] = useState<ECard>(E_CARDS_DATA[0]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [completedCards, setCompletedCards] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("corez_completed_ecards");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Auto daily pop-up check
  useEffect(() => {
    const lastPopDate = localStorage.getItem("corez_ecard_last_popup");
    const todayStr = new Date().toDateString();
    if (lastPopDate !== todayStr) {
      // Pick random card for today
      const randomCard = E_CARDS_DATA[Math.floor(Math.random() * E_CARDS_DATA.length)];
      setActiveCard(randomCard);
      setPopupOpen(true);
      localStorage.setItem("corez_ecard_last_popup", todayStr);
    }
  }, []);

  const handleDrawRandomCard = () => {
    const filtered = selectedGroup === "all" 
      ? E_CARDS_DATA 
      : E_CARDS_DATA.filter(c => c.targetGroup === selectedGroup || c.targetGroup === "all");
    const randomIndex = Math.floor(Math.random() * filtered.length);
    setActiveCard(filtered[randomIndex]);
    setPopupOpen(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
  };

  const handleCompleteTask = (cardId: string) => {
    if (completedCards.includes(cardId)) return;
    const next = [...completedCards, cardId];
    setCompletedCards(next);
    localStorage.setItem("corez_completed_ecards", JSON.stringify(next));
    addXP(20);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
  };

  const handleCopyDialogue = (dialogue: string, id: string) => {
    navigator.clipboard.writeText(dialogue);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToGocBinhYen = (card: ECard) => {
    saveFavoritePost({
      id: "ecard_" + card.id,
      authorName: "CoreZ E-Card",
      aiAdvice: `${card.title}: "${card.dialogueSample}"\n💡 ${card.psychologicalGoal}`,
      category: card.targetGroupLabel
    });
    setSavedId(card.id);
    setTimeout(() => setSavedId(null), 2000);
  };

  const filteredCards = selectedGroup === "all"
    ? E_CARDS_DATA
    : E_CARDS_DATA.filter(c => c.targetGroup === selectedGroup);

  return (
    <div className="w-full space-y-6 font-sans" id="ecards-chamtvoibanga">
      
      {/* Banner Header */}
      <div className="relative overflow-hidden rounded-[32px] border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 p-6 sm:p-8 backdrop-blur-xl shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vòng 4: Hành Động (Act) • Bộ Thẻ Bài Điện Tử</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-[#e0e6e2] tracking-tight">
              Bộ E-Cards "Chạm Vào Bản Ngã" 🎴
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#a0a8a3] leading-relaxed font-light">
              Công cụ hỗ trợ giao tiếp thế hệ mới dành cho <strong>Học Sinh</strong>, <strong>Cha Mẹ</strong> và <strong>Thầy Cô</strong>. Mỗi thẻ bài tựa như một nút thắt gỡ bỏ rào cản, chứa lời thoại mẫu phá băng và mục tiêu tâm lý giúp chữa lành bản ngã chông chênh.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={handleDrawRandomCard}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shuffle className="w-4 h-4 animate-spin-slow" />
              <span>Rút Thẻ Ngẫu Nhiên Hôm Nay ✨</span>
            </button>
          </div>
        </div>

        {/* Floating pop-up alert bar */}
        <div className="mt-4 pt-4 border-t border-emerald-500/15 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-medium">
            <Bell className="w-4 h-4 text-amber-500 animate-bounce shrink-0" />
            <span>Thẻ bài daily notification tự động nảy thông báo nhắc nhở rèn luyện chánh niệm mỗi ngày.</span>
          </div>
          <button
            onClick={() => setPopupOpen(true)}
            className="text-[11px] font-bold text-emerald-600 hover:underline shrink-0 cursor-pointer"
          >
            Xem pop-up ngay &rarr;
          </button>
        </div>
      </div>

      {/* Group Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", label: "Tất Cả Thẻ Bài (9)", icon: "🌟" },
          { id: "student", label: "Dành Cho Học Sinh (3)", icon: "🎓" },
          { id: "parent", label: "Dành Cho Cha Mẹ (3)", icon: "👨‍👩‍👧" },
          { id: "teacher", label: "Dành Cho Thầy Cô (3)", icon: "👨‍🏫" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedGroup(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
              selectedGroup === tab.id
                ? "bg-emerald-500 text-white shadow-md"
                : "bg-white/40 dark:bg-[#252e27]/40 text-slate-600 dark:text-[#a0a8a3] hover:bg-white/60 border border-white/40 dark:border-white/5"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Grid of E-Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCards.map((card) => {
          const isDone = completedCards.includes(card.id);
          const isCopied = copiedId === card.id;
          const isSaved = savedId === card.id;

          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -4 }}
              className={`relative rounded-[28px] border bg-gradient-to-br ${card.bgGradient} p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-4`}
            >
              {/* Header Badge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${card.accentColor} flex items-center gap-1.5`}>
                    <span>{card.badgeEmoji}</span>
                    <span>{card.targetGroupLabel}</span>
                  </span>

                  {isDone ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Đã hoàn thành
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200/50">
                      +20 KarmaXP
                    </span>
                  )}
                </div>

                {/* Task Title */}
                <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-[#e0e6e2] leading-snug">
                  {card.title}
                </h3>
              </div>

              {/* Sample Dialogue (Lời thoại mẫu) */}
              <div className="bg-white/70 dark:bg-black/30 p-4 rounded-2xl border border-white/50 dark:border-white/5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <MessageCircle className="w-3 h-3 text-emerald-500" />
                    Lời thoại mẫu phá băng:
                  </span>
                  <button
                    onClick={() => handleCopyDialogue(card.dialogueSample, card.id)}
                    className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? "Đã chép" : "Sao chép"}</span>
                  </button>
                </div>
                <p className="italic text-xs text-slate-700 dark:text-[#e0e6e2] leading-relaxed">
                  "{card.dialogueSample}"
                </p>
              </div>

              {/* Psychological Goal (Mục tiêu tâm lý) */}
              <div className="space-y-1 text-[11px] text-slate-600 dark:text-[#a0a8a3] leading-relaxed">
                <p className="text-[9.5px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Mục tiêu tâm lý chữa lành:
                </p>
                <p className="bg-emerald-500/5 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/10">
                  {card.psychologicalGoal}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleCompleteTask(card.id)}
                  disabled={isDone}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isDone
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                      : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm active:scale-95"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isDone ? "Đã Hoàn Thành" : "Xác Nhận Làm Ngay (+20 XP)"}</span>
                </button>

                <button
                  onClick={() => handleSaveToGocBinhYen(card)}
                  title="Lưu vào Góc Bình Yên"
                  className="p-2.5 rounded-xl bg-white/60 dark:bg-[#1a201b] hover:bg-white text-rose-500 border border-slate-200 dark:border-white/10 transition-all cursor-pointer active:scale-95"
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? "fill-rose-500" : ""}`} />
                </button>
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* Pop-up Notification Modal */}
      <AnimatePresence>
        {popupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#1f2520] border border-emerald-500/30 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 overflow-hidden"
            >
              {/* Decorative top alert header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Bell className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-emerald-600 uppercase">THÔNG BÁO DAILY E-CARD</span>
                    <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-[#e0e6e2]">Chạm Vào Bản Ngã Hôm Nay ✨</h3>
                  </div>
                </div>
                <button
                  onClick={() => setPopupOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Card Body */}
              <div className={`p-6 rounded-[24px] border bg-gradient-to-br ${activeCard.bgGradient} space-y-4`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${activeCard.accentColor} flex items-center gap-1.5`}>
                    <span>{activeCard.badgeEmoji}</span>
                    <span>{activeCard.targetGroupLabel}</span>
                  </span>
                  <span className="text-xs font-bold text-amber-600 font-mono">+20 KarmaXP</span>
                </div>

                <h4 className="font-serif text-xl font-bold text-slate-800 dark:text-[#e0e6e2]">
                  {activeCard.title}
                </h4>

                <div className="bg-white/80 dark:bg-black/40 p-4 rounded-2xl border border-white/50 dark:border-white/5 space-y-1">
                  <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">💬 Lời thoại mẫu phá băng:</p>
                  <p className="italic text-sm text-slate-800 dark:text-[#e0e6e2] font-serif leading-relaxed">
                    "{activeCard.dialogueSample}"
                  </p>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">🌱 Mục tiêu tâm lý chữa lành:</p>
                  <p className="text-slate-600 dark:text-[#a0a8a3] leading-relaxed">
                    {activeCard.psychologicalGoal}
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    handleCompleteTask(activeCard.id);
                    setPopupOpen(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Xác Nhận Thực Hiện Ngay (+20 XP)</span>
                </button>

                <button
                  onClick={handleDrawRandomCard}
                  className="py-3 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Đổi Thẻ Khác</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
