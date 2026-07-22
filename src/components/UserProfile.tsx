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
  AlertCircle,
  TrendingUp,
  ShieldAlert
} from "lucide-react";
import { useUserData, JourneySummary } from "../context/UserContext";
import { MoodTrendChart } from "./MoodTrendChart";
import { DigitalDetoxChart } from "./DigitalDetoxChart";

const VIBES = [
  {
    id: "☁️ Đám mây u tím mệt mỏi (Cần nghỉ ngơi, lắng đọng)",
    icon: "☁️",
    title: "Đám mây u tím mệt mỏi",
    desc: "Cần nghỉ ngơi, lắng đọng",
    color: "from-purple-500/10 to-indigo-500/10 border-purple-300/30 text-purple-400",
  },
  {
    id: "🌱 Mầm non chữa lành (Bắt đầu tìm lại sự tích cực)",
    icon: "🌱",
    title: "Mầm non chữa lành",
    desc: "Bắt đầu tìm lại sự tích cực",
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-300/30 text-emerald-400",
  },
  {
    id: "🔥 Lửa nhỏ động lực (Sẵn sàng chia sẻ và kết nối)",
    icon: "🔥",
    title: "Lửa nhỏ động lực",
    desc: "Sẵn sàng chia sẻ và kết nối",
    color: "from-amber-500/10 to-orange-500/10 border-amber-300/30 text-amber-400",
  },
  {
    id: "🌊 Dòng nước chông chênh (Đang có nhiều xáo trộn, cần điểm tựa)",
    icon: "🌊",
    title: "Dòng nước chông chênh",
    desc: "Đang có nhiều xáo trộn, cần điểm tựa",
    color: "from-blue-500/10 to-cyan-500/10 border-blue-300/30 text-blue-400",
  },
];

const GOALS = [
  { id: "Tìm người lắng nghe", label: "👂 Tìm người lắng nghe" },
  { id: "Tìm lối thoát áp lực", label: "🚪 Tìm lối thoát áp lực" },
  { id: "Tìm một không gian yên tĩnh", label: "🍃 Tìm một không gian yên tĩnh" },
];

export default function UserProfile() {
  const { userData, updateProfile, addJourneySummary } = useUserData();
  const [activeVibeId, setActiveVibeId] = useState(userData.vibe || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);
  const [vibeSelectOpen, setVibeSelectOpen] = useState(false);

  // Profile Modal Edit State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(userData.name || "");
  const [editVibe, setEditVibe] = useState(userData.vibe || "");
  const [editGoal, setEditGoal] = useState(userData.goal || "");

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

            {/* Edit Profile Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setEditName(userData.name || "");
                    setEditVibe(userData.vibe || "🌱 Mầm non chữa lành (Bắt đầu tìm lại sự tích cực)");
                    setEditGoal(userData.goal || "Tìm người lắng nghe");
                    setEditModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  Chỉnh sửa Hồ Sơ Cá Nhân 🏷️
                </button>

                <button
                  onClick={() => setVibeSelectOpen(!vibeSelectOpen)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-[#1a201b] text-slate-700 dark:text-[#e0e6e2] border border-slate-200 dark:border-[#a0a8a3]/20 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                  Cập nhật Vibe nhanh
                </button>
              </div>

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

      {/* 2. Bento Grid Progress Tracking - 5 Main Profile Columns */}
      <div className="space-y-6">
        <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-[#e0e6e2] flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" />
          Hồ Sơ Bản Ngã & Tiến Trình Rèn Luyện
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Item 1: Cấp Độ Bản Ngã (Karma Level) */}
          <div className="bg-white/40 dark:bg-[#252e27]/40 border border-white/40 dark:border-[#a0a8a3]/20 rounded-[24px] p-5 backdrop-blur-md flex items-start gap-4 shadow-sm">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#a0a8a3] uppercase tracking-wider">Cấp Độ Bản Ngã (Karma Level)</p>
              <h4 className="text-xl font-extrabold text-slate-800 dark:text-[#e0e6e2] mt-1 font-mono flex items-center gap-2">
                Level {plantStage + 1}
                <span className="text-xs font-sans font-normal text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200">
                  {karmaXP} XP
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-[#a0a8a3] mt-1.5">
                {karmaXP >= 100 ? "Bản ngã Điềm Tĩnh & Chánh Niệm" : "Bản ngã Đang Sinh Trưởng Tự Nhiên"}
              </p>
            </div>
          </div>

          {/* Item 2: Cây Bản Địa Của Cậu */}
          <div className="bg-white/40 dark:bg-[#252e27]/40 border border-white/40 dark:border-[#a0a8a3]/20 rounded-[24px] p-5 backdrop-blur-md flex items-start gap-4 shadow-sm">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#a0a8a3] uppercase tracking-wider">Cây Bản Địa Của Cậu</p>
              <h4 className="text-base font-bold text-slate-800 dark:text-[#e0e6e2] mt-1 flex items-center gap-1.5">
                <span className="text-lg">{currentPlant.icon}</span>
                {currentPlant.title}
              </h4>
              <p className="text-[10.5px] text-slate-500 dark:text-[#a0a8a3] mt-1 leading-tight">{currentPlant.desc}</p>
            </div>
          </div>

          {/* Item 3: Chỉ Số Chông Chênh (DII) */}
          <div className="bg-white/40 dark:bg-[#252e27]/40 border border-white/40 dark:border-[#a0a8a3]/20 rounded-[24px] p-5 backdrop-blur-md flex items-start gap-4 sm:col-span-2 lg:col-span-1 shadow-sm">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#a0a8a3] uppercase tracking-wider">Chỉ Số Chông Chênh (DII)</p>
              <h4 className="text-xl font-extrabold text-slate-800 dark:text-[#e0e6e2] mt-1 font-mono flex items-center gap-2">
                {userData.diiScore || 0} <span className="text-xs font-sans text-slate-400 font-normal">/ 100</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  userData.diiScore > 60 
                    ? "bg-rose-50 text-rose-600 border-rose-200"
                    : userData.diiScore > 30 
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-emerald-50 text-emerald-600 border-emerald-200"
                }`}>
                  {userData.diiLevel || "Cân bằng chánh niệm"}
                </span>
              </h4>
              <p className="text-[10.5px] text-slate-500 dark:text-[#a0a8a3] mt-1">
                Đánh giá mức độ áp lực từ môi trường số & tự do tâm trí.
              </p>
            </div>
          </div>

          {/* Sub-counts overview */}
          <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-3 gap-3">
            <div className="bg-white/20 dark:bg-[#252e27]/20 rounded-2xl p-3.5 text-center border border-white/20 dark:border-white/5">
              <BookOpen className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-[9px] font-bold text-slate-400 uppercase">Phản tư</p>
              <p className="text-lg font-bold text-slate-800 dark:text-[#e0e6e2] font-mono">{reflectionsCount}</p>
            </div>
            <div className="bg-white/20 dark:bg-[#252e27]/20 rounded-2xl p-3.5 text-center border border-white/20 dark:border-white/5">
              <Mail className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <p className="text-[9px] font-bold text-slate-400 uppercase">Thư tương lai</p>
              <p className="text-lg font-bold text-slate-800 dark:text-[#e0e6e2] font-mono">{lettersCount}</p>
            </div>
            <div className="bg-white/20 dark:bg-[#252e27]/20 rounded-2xl p-3.5 text-center border border-white/20 dark:border-white/5">
              <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1" />
              <p className="text-[9px] font-bold text-slate-400 uppercase">Nhật ký cảm xúc</p>
              <p className="text-lg font-bold text-slate-800 dark:text-[#e0e6e2] font-mono">{moodLogsCount}</p>
            </div>
          </div>

        </div>

        {/* Item 4: Biểu Đồ Sức Khỏe Tinh Thần */}
        <div className="pt-2">
          <MoodTrendChart logs={userData.moodLogs || []} onResetLogs={() => {}} />
        </div>

        {/* Item 5: Tiến Trình Thải Độc Số (30 Ngày Gần Nhất) */}
        <div className="pt-2">
          <DigitalDetoxChart />
        </div>

      </div>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {editModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-white dark:bg-[#1f2520] border border-slate-200 dark:border-[#a0a8a3]/20 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 text-slate-800 dark:text-[#e0e6e2] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#a0a8a3]/10 pb-4">
                <h3 className="font-serif text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-500" />
                  Chỉnh Sửa Hồ Sơ Cá Nhân 🏷️
                </h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-5 text-xs">
                {/* 🏷️ Tên gọi (Custom Nickname) */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-[#e0e6e2] flex items-center gap-1.5 uppercase tracking-wider">
                    🏷️ Tên gọi (Custom Nickname)
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nhập tên gọi / biệt danh yêu thích..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#1a201b] border border-slate-200 dark:border-[#a0a8a3]/20 text-slate-800 dark:text-[#e0e6e2] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-medium"
                  />
                </div>

                {/* 🌌 Mức năng lượng hiện tại (Energy Status) */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-[#e0e6e2] flex items-center gap-1.5 uppercase tracking-wider">
                    🌌 Mức năng lượng hiện tại (Energy Status)
                  </label>
                  <div className="space-y-2">
                    {VIBES.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setEditVibe(v.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                          editVibe === v.id
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold"
                            : "border-slate-100 dark:border-[#a0a8a3]/10 bg-slate-50/50 dark:bg-[#1a201b]/40 text-slate-600 dark:text-[#a0a8a3]"
                        }`}
                      >
                        <span className="text-lg">{v.icon}</span>
                        <div>
                          <p className="font-bold text-xs">{v.title}</p>
                          <p className="text-[10px] opacity-75">{v.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 🎯 Mục tiêu tham gia (Personal Goal) */}
                <div className="space-y-2">
                  <label className="font-bold text-slate-700 dark:text-[#e0e6e2] flex items-center gap-1.5 uppercase tracking-wider">
                    🎯 Mục tiêu tham gia (Personal Goal)
                  </label>
                  <div className="space-y-2">
                    {GOALS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setEditGoal(g.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer text-xs ${
                          editGoal === g.id
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 font-bold"
                            : "border-slate-100 dark:border-[#a0a8a3]/10 bg-slate-50/50 dark:bg-[#1a201b]/40 text-slate-600 dark:text-[#a0a8a3]"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-[#a0a8a3] font-bold text-xs cursor-pointer hover:bg-slate-200"
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
                    setEditModalOpen(false);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
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
}
