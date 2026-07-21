import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Sparkles, 
  Award, 
  Activity, 
  BookOpen, 
  Mail, 
  Heart, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Compass,
  AlertCircle
} from "lucide-react";
import { useUserData, JourneySummary } from "../context/UserContext";

const VIBES = [
  {
    id: "🌧️ Đám mây u tim (Đang mệt mỏi)",
    icon: "🌧️",
    title: "Đám mây u tim",
    desc: "Đang mệt mỏi, cần một góc nhỏ ôm ấp vỗ về",
    color: "from-sky-500/10 to-indigo-500/10 border-sky-300/30 text-sky-400",
  },
  {
    id: "🌱 Mầm non (Đang muốn chữa lành)",
    icon: "🌱",
    title: "Mầm non",
    desc: "Đang muốn chữa lành, tìm lại sự tươi mát trong tâm hồn",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-300/30 text-emerald-400",
  },
  {
    id: "🔥 Lửa nhỏ (Cần động lực)",
    icon: "🔥",
    title: "Lửa nhỏ",
    desc: "Cần động lực vượt qua khó khăn thi cử học đường",
    color: "from-amber-500/10 to-orange-500/10 border-amber-300/30 text-amber-400",
  },
  {
    id: "🌊 Dòng nước (Đang trong chênh)",
    icon: "🌊",
    title: "Dòng nước",
    desc: "Đang trong chênh giữa muôn vàn ngã rẽ cuộc đời",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-300/30 text-blue-400",
  },
];

export default function UserProfile() {
  const { userData, updateProfile, addJourneySummary } = useUserData();
  const [activeVibeId, setActiveVibeId] = useState(userData.vibe || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);
  const [vibeSelectOpen, setVibeSelectOpen] = useState(false);

  // Statistics
  const karmaXP = userData.karmaXP || 0;
  const detoxMinutes = userData.detoxMinutes || 0;
  const plantStage = userData.plantStage || 0;
  const reflectionsCount = userData.reflections?.length || 0;
  const lettersCount = userData.futureLetters?.length || 0;
  const moodLogsCount = userData.moodLogs?.length || 0;

  // Plant stage name and asset description
  const plantStages = [
    { title: "Hạt mầm ngủ yên", desc: "Hạt mầm bé nhỏ đang say giấc dưới lòng đất trầm tĩnh lặng.", icon: "🌱💤" },
    { title: "Mầm non mới nhú", desc: "Hai chiếc lá mầm bé xíu vươn mình đón những ánh nắng ấm áp đầu tiên.", icon: "🌱✨" },
    { title: "Cây xanh phát triển", desc: "Thân cây cứng cáp hơn, vươn rộng cành rêu xanh mát chữa lành.", icon: "🌿🍃" },
    { title: "Cây đơm hoa kết trái", desc: "Thành quả viên mãn! Cây cổ thụ rực rỡ tỏa ngát tình thương.", icon: "🌳🌸" }
  ];
  const currentPlant = plantStages[Math.min(plantStage, 3)] || plantStages[0];

  const handleUpdateVibe = (vibeId: string) => {
    setActiveVibeId(vibeId);
    updateProfile(userData.name || "Cậu", vibeId, userData.goal || "Tìm người lắng nghe");
    setVibeSelectOpen(false);
  };

  const handleGenerateSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/summarize-journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: {
            name: userData.name,
            vibe: userData.vibe || activeVibeId,
            goal: userData.goal
          },
          stats: {
            karmaXP,
            detoxMinutes,
            plantStage,
            reflectionsCount,
            lettersCount,
            moodLogsCount
          },
          moodLogs: userData.moodLogs || [],
          reflections: userData.reflections || []
        })
      });

      if (!response.ok) {
        throw new Error("Không thể kết nối máy chủ CoreZ.");
      }

      const data = await response.json();
      
      const newSummary: JourneySummary = {
        id: "summary_" + Date.now(),
        date: new Date().toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        }),
        summaryText: data.summaryText || "Hành trình của cậu ngập tràn dũng cảm.",
        statsSnap: {
          karmaXP,
          detoxMinutes,
          plantStage,
          reflectionsCount,
          lettersCount,
          moodLogsCount
        }
      };

      addJourneySummary(newSummary);
      setExpandedSummaryId(newSummary.id);
    } catch (err: any) {
      console.error(err);
      setError("Đã xảy ra một sự cố nhỏ khi kết nối với CoreZ. Cậu vui lòng thử lại sau nha!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-10" id="user-profile-section">
      
      {/* 1. Header Profile Banner */}
      <div className="relative overflow-hidden rounded-[32px] border border-white/40 dark:border-[#a0a8a3]/20 bg-white/40 dark:bg-[#252e27]/40 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-[-30px] left-[10%] w-36 h-36 bg-amber-500/10 blur-2xl rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Avatar frame */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[28px] bg-gradient-to-tr from-emerald-500 to-teal-400 p-1 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#1a201b] rounded-[24px] flex items-center justify-center text-emerald-300 font-serif font-extrabold text-3xl sm:text-4xl">
                {userData.name ? userData.name.charAt(0).toUpperCase() : "C"}
              </div>
            </div>
            <span className="absolute bottom-1 right-1 bg-amber-500 text-white rounded-full p-1 text-[10px] font-bold shadow animate-bounce">
              {plantStage > 0 ? `Lv.${plantStage}` : "🌱"}
            </span>
          </div>

          {/* Core Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-[#e0e6e2] tracking-tight">
                {userData.name || "Người bạn đồng hành"}
              </h2>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/30">
                Thành Viên CoreZ
              </span>
            </div>

            {/* Sub-details (Goal, Vibe) */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs text-slate-500 dark:text-[#a0a8a3]">
              <span className="flex items-center gap-1.5 bg-white/60 dark:bg-[#1a201b]/50 px-3 py-1.5 rounded-xl border border-white/40 dark:border-white/5">
                <span>Mục tiêu chính:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{userData.goal || "Tìm sự tĩnh lặng"}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white/60 dark:bg-[#1a201b]/50 px-3 py-1.5 rounded-xl border border-white/40 dark:border-white/5">
                <span>Trạng thái:</span>
                <span className="font-semibold text-indigo-500 dark:text-indigo-300">
                  {userData.vibe?.split(" ")[0]} {userData.vibe?.substring(userData.vibe?.indexOf(" ") + 1) || "Chưa xác định"}
                </span>
              </span>
            </div>

            {/* Edit Vibe Quick-Selector */}
            <div className="pt-2">
              <button
                onClick={() => setVibeSelectOpen(!vibeSelectOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Cập nhật Năng lượng (Vibe)
              </button>

              <AnimatePresence>
                {vibeSelectOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 p-3 bg-white dark:bg-[#1f2520] border border-slate-100 dark:border-[#a0a8a3]/10 rounded-2xl shadow-xl space-y-2 relative z-20"
                  >
                    <p className="text-[11px] font-bold text-slate-400 dark:text-[#a0a8a3]/60 uppercase tracking-wider">Hôm nay năng lượng của cậu thế nào?</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {VIBES.map((vb) => (
                        <button
                          key={vb.id}
                          onClick={() => handleUpdateVibe(vb.id)}
                          className={`p-2 rounded-xl text-left border transition-all text-xs flex items-center gap-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5 ${
                            userData.vibe === vb.id
                              ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/20"
                              : "border-slate-100 dark:border-[#a0a8a3]/10"
                          }`}
                        >
                          <span className="text-base leading-none shrink-0">{vb.icon}</span>
                          <div className="leading-tight">
                            <p className="font-bold text-slate-700 dark:text-[#e0e6e2]">{vb.title}</p>
                            <p className="text-[10px] text-slate-400 dark:text-[#a0a8a3] line-clamp-1">{vb.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Bento Grid Progress Tracking */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-[#e0e6e2] flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          Tiến trình rèn luyện cá nhân
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Card 1: Karma XP */}
          <div className="bg-white/40 dark:bg-[#252e27]/40 border border-white/40 dark:border-[#a0a8a3]/20 rounded-[24px] p-5 backdrop-blur-md flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#a0a8a3] uppercase tracking-wider">Tích lũy KarmaXP</p>
              <h4 className="text-2xl font-extrabold text-slate-800 dark:text-[#e0e6e2] mt-1 font-mono">{karmaXP} <span className="text-xs font-sans text-slate-400 font-normal">XP</span></h4>
              <p className="text-[11px] text-slate-500 dark:text-[#a0a8a3] mt-2">Duy trì thói quen tích cực để nhận thêm điểm lành.</p>
            </div>
          </div>

          {/* Card 2: Digital Detox */}
          <div className="bg-white/40 dark:bg-[#252e27]/40 border border-white/40 dark:border-[#a0a8a3]/20 rounded-[24px] p-5 backdrop-blur-md flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#a0a8a3] uppercase tracking-wider">Thải độc kỹ thuật số</p>
              <h4 className="text-2xl font-extrabold text-slate-800 dark:text-[#e0e6e2] mt-1 font-mono">{detoxMinutes} <span className="text-xs font-sans text-slate-400 font-normal">phút</span></h4>
              <p className="text-[11px] text-slate-500 dark:text-[#a0a8a3] mt-2">Thời gian vàng rời xa thiết bị, sạc năng lượng.</p>
            </div>
          </div>

          {/* Card 3: Indigenous Plant */}
          <div className="bg-white/40 dark:bg-[#252e27]/40 border border-white/40 dark:border-[#a0a8a3]/20 rounded-[24px] p-5 backdrop-blur-md flex items-start gap-4 sm:col-span-2 lg:col-span-1">
            <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-500 border border-teal-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#a0a8a3] uppercase tracking-wider">Cây bản địa của cậu</p>
              <h4 className="text-base font-bold text-slate-800 dark:text-[#e0e6e2] mt-1 flex items-center gap-1.5">
                <span className="text-lg">{currentPlant.icon}</span>
                {currentPlant.title}
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-[#a0a8a3] mt-1.5 leading-tight">{currentPlant.desc}</p>
            </div>
          </div>

          {/* Sub-counts section */}
          <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-3 gap-3">
            
            {/* Reflection Count */}
            <div className="bg-white/20 dark:bg-[#252e27]/20 rounded-2xl p-4 text-center border border-white/20 dark:border-white/5">
              <BookOpen className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-[9px] font-bold text-slate-400 uppercase">Phản tư</p>
              <p className="text-lg font-bold text-slate-800 dark:text-[#e0e6e2] mt-0.5 font-mono">{reflectionsCount}</p>
            </div>

            {/* Future Letters Count */}
            <div className="bg-white/20 dark:bg-[#252e27]/20 rounded-2xl p-4 text-center border border-white/20 dark:border-white/5">
              <Mail className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <p className="text-[9px] font-bold text-slate-400 uppercase">Thư tương lai</p>
              <p className="text-lg font-bold text-slate-800 dark:text-[#e0e6e2] mt-0.5 font-mono">{lettersCount}</p>
            </div>

            {/* Mood Logs Count */}
            <div className="bg-white/20 dark:bg-[#252e27]/20 rounded-2xl p-4 text-center border border-white/20 dark:border-white/5">
              <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <p className="text-[9px] font-bold text-slate-400 uppercase">Nhật ký cảm xúc</p>
              <p className="text-lg font-bold text-slate-800 dark:text-[#e0e6e2] mt-0.5 font-mono">{moodLogsCount}</p>
            </div>

          </div>

        </div>
      </div>

      {/* 3. AI Journey Summarization Console & History */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/20 pb-3">
          <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-[#e0e6e2] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            Cột mốc Hành trình trưởng thành
          </h3>
          <button
            onClick={handleGenerateSummary}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:from-amber-500/50 disabled:to-amber-600/50 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:cursor-not-allowed shrink-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                CoreZ đang phân tích sâu...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                AI Tóm tắt Hành trình ✨
              </>
            )}
          </button>
        </div>

        {/* Loading overlay with reassuring phrases */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-8 text-center bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/20 rounded-[28px] space-y-4 shadow-sm"
            >
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 border-4 border-amber-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">"CoreZ đang kết nối với hạt mầm chánh niệm của cậu..."</p>
                <p className="text-xs text-slate-400 italic">"Mọi nỗ lực tắt màn hình, phản tư hay đối thoại của cậu đều đang được lưu giữ thật trân quý. Chờ mình một chút nhé!"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-2xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Table of Contents / History list */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-slate-400 dark:text-[#a0a8a3]/60 uppercase tracking-wider">Mục lục các cuộc hội thoại & hạt tóm tắt</p>

          {!userData.journeySummaries || userData.journeySummaries.length === 0 ? (
            <div className="text-center p-8 border border-dashed border-slate-200 dark:border-[#a0a8a3]/20 rounded-[24px] bg-slate-50/50 dark:bg-[#1a201b]/20">
              <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-600 dark:text-[#a0a8a3] font-medium leading-relaxed">
                Chưa có tóm tắt hành trình nào được tạo.
              </p>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal max-w-sm mx-auto">
                Hãy nhấn nút <strong className="text-amber-500">AI Tóm tắt Hành trình ✨</strong> phía trên để CoreZ kết nối các hạt rèn luyện, bộc lộ và vẽ nên bức tranh cột mốc của cậu nhé!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {userData.journeySummaries.map((summary) => {
                const isExpanded = expandedSummaryId === summary.id;
                return (
                  <div
                    key={summary.id}
                    className="border border-slate-100 dark:border-[#a0a8a3]/10 rounded-[22px] bg-white/20 dark:bg-[#252e27]/20 overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Header trigger */}
                    <button
                      onClick={() => setExpandedSummaryId(isExpanded ? null : summary.id)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer transition-colors hover:bg-slate-50/10"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 text-xs">🌱</span>
                          <h4 className="font-serif text-sm font-bold text-slate-800 dark:text-[#e0e6e2]">
                            Tóm tắt hành trình • Ngày {summary.date}
                          </h4>
                        </div>
                        <p className="text-[10px] text-slate-400 dark:text-[#a0a8a3] font-mono pl-7">
                          Chỉ số snap: {summary.statsSnap?.karmaXP || 0} XP | {summary.statsSnap?.detoxMinutes || 0}m Thải độc | Cây Lv.{summary.statsSnap?.plantStage || 0}
                        </p>
                      </div>
                      <div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Expandable Body */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-slate-100 dark:border-[#a0a8a3]/10"
                        >
                          <div className="p-5 space-y-4 text-xs leading-relaxed text-slate-700 dark:text-[#e0e6e2] bg-[#fdfdfd]/10">
                            
                            {/* Summary Text block */}
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">🌱 Đúc kết của CoreZ</p>
                              <div className="bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-slate-100 dark:border-[#a0a8a3]/5 text-sm">
                                {summary.summaryText}
                              </div>
                            </div>

                            {/* stats snap metrics */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center pt-1">
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a201b]/50 border border-slate-100 dark:border-[#a0a8a3]/5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Ghi chép cảm xúc</p>
                                <p className="text-base font-extrabold text-slate-700 dark:text-[#e0e6e2] mt-0.5">{summary.statsSnap?.moodLogsCount || 0}</p>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a201b]/50 border border-slate-100 dark:border-[#a0a8a3]/5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Bài tập phản tư</p>
                                <p className="text-base font-extrabold text-slate-700 dark:text-[#e0e6e2] mt-0.5">{summary.statsSnap?.reflectionsCount || 0}</p>
                              </div>
                              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a201b]/50 border border-slate-100 dark:border-[#a0a8a3]/5 col-span-2 sm:col-span-1">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Bức thư sealed</p>
                                <p className="text-base font-extrabold text-slate-700 dark:text-[#e0e6e2] mt-0.5">{summary.statsSnap?.lettersCount || 0}</p>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
