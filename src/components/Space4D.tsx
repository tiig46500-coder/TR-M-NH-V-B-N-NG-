import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  MessageSquare, 
  Sparkles, 
  Leaf, 
  MapPin, 
  Pin, 
  Send, 
  Heart, 
  Plus, 
  Check, 
  ArrowRight,
  Smile,
  Compass as CompassIcon,
  Tent
} from "lucide-react";
import { INITIAL_CONFESSIONS, LẠNG_SƠN_PLACES } from "../data";
import { Confession, HabitChallenge, LạngSơnPlace } from "../types";

export default function Space4D() {
  const [activeSubTab, setActiveSubTab] = useState<"define" | "devirtualize" | "detox" | "do">("define");

  // ==========================================
  // Tab 1: Define (Định vị) State & Logic
  // ==========================================
  const [defineStep, setDefineStep] = useState(0);
  const [defineAnswers, setDefineAnswers] = useState<string[]>([]);
  const [defineResult, setDefineResult] = useState<{ title: string; icon: string; desc: string } | null>(null);

  const defineQuestions = [
    {
      q: "Cậu thường chọn làm gì khi cảm thấy quá tải thông tin?",
      options: [
        { key: "A", text: "Vẽ vời, viết nhật ký hoặc nghe nhạc mộc mạc" },
        { key: "B", text: "Tìm người bạn đáng tin cậy để tâm sự trực tiếp" },
        { key: "C", text: "Đi bộ một mình ngoài trời, im lặng hít thở" }
      ]
    },
    {
      q: "Đối với cậu, một ngày bình yên thật sự là ngày...",
      options: [
        { key: "A", text: "Làm được điều gì đó mới mẻ, tự do sáng tạo" },
        { key: "B", text: "Giúp đỡ ai đó mỉm cười hoặc cảm thấy ấm áp" },
        { key: "C", text: "Kế hoạch đề ra được hoàn thành trọn vẹn, ngăn nắp" }
      ]
    },
    {
      q: "Cậu thấy mình có xu hướng kết nối tốt nhất qua...",
      options: [
        { key: "A", text: "Các bức ảnh nghệ thuật, bài viết cảm xúc" },
        { key: "B", text: "Những cuộc trò chuyện sâu sắc, thấu hiểu tâm lý" },
        { key: "C", text: "Những hành động thiết thực, giúp đỡ âm thầm" }
      ]
    }
  ];

  const handleDefineAnswer = (key: string) => {
    const nextAnswers = [...defineAnswers, key];
    setDefineAnswers(nextAnswers);

    if (defineStep < 2) {
      setDefineStep(defineStep + 1);
    } else {
      // Calculate Personality Strength Result
      const countA = nextAnswers.filter((x) => x === "A").length;
      const countB = nextAnswers.filter((x) => x === "B").length;
      
      let res = {
        title: "Sức Mạnh Sáng Tạo Độc Bản 🎨",
        icon: "🎨",
        desc: "Cậu sở hữu trí tưởng tượng phong phú và khả năng tự chữa lành bằng nghệ thuật. Khi gặp áp lực, việc sáng tạo (viết, vẽ, làm đồ thủ công) sẽ giúp cậu cân bằng lại bản ngã tuyệt vời nhất."
      };

      if (countB > countA) {
        res = {
          title: "Sức Mạnh Thấu Cảm Tri Kỷ 🌸",
          icon: "🌸",
          desc: "Trái tim cậu tràn ngập sự thấu cảm và lắng nghe sâu sắc. Cậu là chỗ dựa tinh thần tuyệt vời cho bạn bè. Hãy nhớ bảo vệ năng lượng của bản thân bằng cách chia sẻ với 'Người Lắng Nghe' khi mỏi mệt nhé."
        };
      } else if (nextAnswers.filter((x) => x === "C").length >= 2) {
        res = {
          title: "Sức Mạnh Kiên Cường Thầm Lặng 🏔️",
          icon: "🏔️",
          desc: "Cậu có nội lực vững vàng, điềm tĩnh và vô cùng thực tế. Cậu thích giải quyết vấn đề bằng hành động và rất phù hợp với các trải nghiệm leo núi Phai Vệ hay cắm trại Mẫu Sơn để tiếp đất phục hồi sức khỏe."
        };
      }

      setDefineResult(res);
      setDefineStep(3);
    }
  };

  const resetDefine = () => {
    setDefineStep(0);
    setDefineAnswers([]);
    setDefineResult(null);
  };

  // ==========================================
  // Tab 2: De-virtualize (Chấp nhận) State & Logic
  // ==========================================
  const [confessions, setConfessions] = useState<Confession[]>(INITIAL_CONFESSIONS);
  const [newConfession, setNewConfession] = useState("");
  const colorPalettes = [
    "bg-amber-50 text-slate-700 border-amber-200",
    "bg-sky-50 text-slate-700 border-sky-200",
    "bg-emerald-50 text-slate-700 border-emerald-200",
    "bg-pink-50 text-slate-700 border-pink-100"
  ];
  const rotations = ["rotate-1", "-rotate-2", "rotate-2", "-rotate-1", "rotate-3", "-rotate-3"];

  const handlePostConfession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConfession.trim()) return;

    const randomColor = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
    const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

    const added: Confession = {
      id: `conf-${Date.now()}`,
      content: newConfession,
      timestamp: "Vừa xong",
      color: randomColor,
      rotation: randomRotation
    };

    setConfessions([added, ...confessions]);
    setNewConfession("");
  };

  // ==========================================
  // Tab 3: Detox (Thải độc) State & Logic
  // ==========================================
  const [challenge, setChallenge] = useState<HabitChallenge>({
    id: "tiktok-detox",
    title: "24H Không TikTok & Mạng Xã Hội",
    description: "Thử thách ngắt kết nối ảo, quay về kết nối thật trong một ngày để xoa dịu thần kinh.",
    daysCompleted: 3,
    totalDays: 7,
    isCheckedToday: false,
    streak: 3
  });

  const handleCheckIn = () => {
    if (challenge.isCheckedToday) return;

    setChallenge(prev => {
      const nextDays = Math.min(prev.daysCompleted + 1, prev.totalDays);
      return {
        ...prev,
        daysCompleted: nextDays,
        isCheckedToday: true,
        streak: prev.streak + 1
      };
    });
  };

  const resetDetox = () => {
    setChallenge({
      id: "tiktok-detox",
      title: "24H Không TikTok & Mạng Xã Hội",
      description: "Thử thách ngắt kết nối ảo, quay về kết nối thật trong một ngày để xoa dịu thần kinh.",
      daysCompleted: 0,
      totalDays: 7,
      isCheckedToday: false,
      streak: 0
    });
  };

  // ==========================================
  // Tab 4: Do (Hành động) State & Logic
  // ==========================================
  const [selectedPlace, setSelectedPlace] = useState<LạngSơnPlace>(LẠNG_SƠN_PLACES[0]);

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4 font-sans relative z-10">
      {/* 4D Space Tab Navigator */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-white/40 backdrop-blur-md rounded-2xl mb-8 border border-white/40 shadow-sm">
        {[
          { id: "define", label: "Define", desc: "Định vị", icon: Compass },
          { id: "devirtualize", label: "Accept", desc: "Chấp nhận", icon: MessageSquare },
          { id: "detox", label: "Detox", desc: "Thải độc", icon: Leaf },
          { id: "do", label: "Do", desc: "Hành động", icon: MapPin }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl text-center transition-all ${
                isActive
                  ? "bg-white text-emerald-600 shadow-sm font-bold border border-white/40"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 mb-1 ${isActive ? "text-emerald-500" : "text-slate-400"}`} />
              <span className="text-[11px] font-bold tracking-tight uppercase leading-none">{tab.label}</span>
              <span className="text-[10px] text-slate-400 mt-0.5 leading-none hidden sm:inline-block">{tab.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Render active subtab content */}
      <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/40 p-5 sm:p-8 shadow-sm min-h-[460px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: DEFINE */}
          {activeSubTab === "define" && (
            <motion.div
              key="define-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="border-b border-white/40 pb-4">
                <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#34D399]" />
                  Define (Định Vị Sức Mạnh Nội Tại)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Trả lời nhanh 3 câu hỏi trực giác để tìm ra thế mạnh tiềm ẩn giúp cậu kiềm chế lo âu và làm chủ bản ngã.
                </p>
              </div>

              {defineStep < 3 ? (
                <div className="max-w-xl mx-auto py-2">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-3 font-mono">
                    <span>Trắc nghiệm nhanh</span>
                    <span>Bước {defineStep + 1} / 3</span>
                  </div>

                  <h4 className="font-serif text-base sm:text-lg font-medium text-slate-700 leading-relaxed mb-6">
                    “ {defineQuestions[defineStep].q} ”
                  </h4>

                  <div className="space-y-3">
                    {defineQuestions[defineStep].options.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => handleDefineAnswer(opt.key)}
                        className="w-full text-left p-4 rounded-2xl border border-white/40 bg-white/40 backdrop-blur-sm hover:border-[#34D399] hover:bg-[#34D399]/10 text-slate-600 text-sm sm:text-base transition-all flex items-center gap-3.5 hover:translate-x-1 hover:shadow-sm"
                      >
                        <span className="w-6.5 h-6.5 rounded-full bg-white/85 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-150">
                          {opt.key}
                        </span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Define result screen */
                defineResult && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl mx-auto text-center py-6"
                  >
                    <div className="text-5xl mb-4 animate-bounce">{defineResult.icon}</div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full mb-2 inline-block border border-emerald-100/50">
                      Thế mạnh của cậu là
                    </span>
                    <h4 className="font-serif text-xl font-bold text-slate-800 mb-3.5">
                      {defineResult.title}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/40 mb-6 text-justify shadow-sm">
                      {defineResult.desc}
                    </p>
                    <button
                      onClick={resetDefine}
                      className="px-6 py-2 rounded-xl border border-slate-200 bg-white hover:text-slate-800 hover:bg-slate-50 text-sm transition-all shadow-sm"
                    >
                      Thực hiện lại
                    </button>
                  </motion.div>
                )
              )}
            </motion.div>
          )}

          {/* TAB 2: DE-VIRTUALIZE */}
          {activeSubTab === "devirtualize" && (
            <motion.div
              key="devirtualize-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="border-b border-white/40 pb-4">
                <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-sky-400" />
                  De-virtualize (Bức Tường Ẩn Danh)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Đưa những áp lực từ cõi ảo về thực tại. Nơi cậu có thể tự do viết ra áp lực FOMO, ghen tị mạng xã hội để trút bỏ gánh nặng nội tâm ẩn danh.
                </p>
              </div>

              {/* Confession Submission Form */}
              <form onSubmit={handlePostConfession} className="flex gap-2.5">
                <input
                  type="text"
                  placeholder="Nhập áp lực FOMO, mệt mỏi cậu muốn trút bỏ ngay lúc này..."
                  value={newConfession}
                  onChange={(e) => setNewConfession(e.target.value)}
                  maxLength={180}
                  className="flex-1 px-4 py-3 rounded-xl border border-white/40 bg-white/45 backdrop-blur-sm focus:border-sky-300 focus:outline-none text-slate-700 text-sm placeholder:text-slate-400 shadow-inner"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-sky-400 hover:bg-sky-500 text-white font-semibold text-sm flex items-center gap-1.5 transition-all shadow-lg shadow-sky-200/50 active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Ghim Lên</span>
                </button>
              </form>

              {/* The Corkboard Mock Layout */}
              <div className="relative rounded-[24px] border border-amber-200/40 bg-amber-50/45 p-5 min-h-[300px] shadow-inner overflow-hidden backdrop-blur-md">
                {/* Board pins style background */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-300/40 shadow-sm" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
                  <AnimatePresence>
                    {confessions.map((conf) => (
                      <motion.div
                        key={conf.id}
                        initial={{ scale: 0.9, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className={`p-4 rounded-lg border shadow-sm relative ${conf.color} ${conf.rotation} hover:rotate-0 hover:scale-105 hover:shadow-md transition-all duration-300 font-sans max-h-[160px] flex flex-col justify-between`}
                      >
                        {/* Decorative Pin */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-red-400 drop-shadow-sm">
                          <Pin className="w-4 h-4 fill-red-400 stroke-red-500 rotate-45" />
                        </div>

                        <p className="text-xs sm:text-[13px] leading-relaxed text-justify overflow-y-auto pr-1 line-clamp-4 font-sans text-slate-700">
                          {conf.content}
                        </p>

                        <div className="flex justify-between items-center text-[10px] text-slate-400/80 border-t border-slate-200/20 pt-1.5 mt-2">
                          <span>#ẩn_danh</span>
                          <span>{conf.timestamp}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: DETOX */}
          {activeSubTab === "detox" && (
            <motion.div
              key="detox-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="border-b border-white/40 pb-4">
                <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-[#34D399]" />
                  Detox (Thải Độc Thói Quen Số)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Thử thách lành mạnh rèn luyện bản thân mỗi ngày. Cậu đã sẵn sàng detox những luồng tin giả mệt mỏi từ mạng xã hội?
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Circular Progress Meter */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-white/40 backdrop-blur-sm rounded-[24px] border border-white/40 shadow-sm">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    {/* SVG Circle progress */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="stroke-white/30 fill-none"
                        strokeWidth="10"
                      />
                      <motion.circle
                        cx="72"
                        cy="72"
                        r="60"
                        className="stroke-[#34D399] fill-none"
                        strokeWidth="10"
                        strokeDasharray={377} // 2 * PI * r = 2 * 3.14159 * 60 = 377
                        initial={{ strokeDashoffset: 377 }}
                        animate={{ 
                          strokeDashoffset: 377 - (377 * (challenge.daysCompleted / challenge.totalDays)) 
                        }}
                        transition={{ duration: 1 }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3.5xl font-bold text-slate-700 font-mono">
                        {Math.round((challenge.daysCompleted / challenge.totalDays) * 100)}%
                      </span>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Hoàn thành</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-4 font-medium">
                    Đã hoàn thành <span className="text-[#34D399] font-bold">{challenge.daysCompleted}</span> trên <span className="font-bold">{challenge.totalDays}</span> ngày
                  </p>
                </div>

                {/* Challenge Checklist Action Card */}
                <div className="md:col-span-7 space-y-4">
                  <div className="p-6 rounded-[24px] bg-white/50 backdrop-blur-md border border-white/40 shadow-sm space-y-3 relative overflow-hidden">
                    {/* Sparkle decorator */}
                    <div className="absolute top-3 right-3 text-amber-400 animate-pulse">
                      <Sparkles className="w-4 h-4 fill-amber-300/10" />
                    </div>

                    <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase border border-emerald-100/40">
                      Thử thách tuần này
                    </span>
                    
                    <h4 className="font-serif text-lg font-bold text-slate-800">
                      {challenge.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {challenge.description}
                    </p>

                    <div className="flex gap-4 pt-1 border-t border-white/40 mt-3 text-xs text-slate-500">
                      <div>
                        Chuỗi hiện tại: <span className="font-bold text-emerald-600 font-mono">{challenge.streak} 🔥</span>
                      </div>
                      <div>
                        Trạng thái: <span className="font-bold text-slate-600">{challenge.isCheckedToday ? "Đã check-in" : "Chưa hoàn thành hôm nay"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Habit Action Button */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleCheckIn}
                      disabled={challenge.isCheckedToday || challenge.daysCompleted >= challenge.totalDays}
                      className={`flex-1 py-3.5 px-4 rounded-2xl text-sm font-semibold transition-all shadow-lg flex items-center justify-center gap-2 ${
                        challenge.isCheckedToday
                          ? "bg-white/30 text-slate-400 border border-white/30 cursor-not-allowed shadow-none"
                          : "bg-[#34D399] hover:bg-[#34D399]/90 text-white cursor-pointer active:scale-95 shadow-emerald-200/40"
                      }`}
                    >
                      {challenge.isCheckedToday ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Đã Check-in Hôm Nay • Giỏi Lắm!</span>
                        </>
                      ) : (
                        <>
                          <Smile className="w-4 h-4" />
                          <span>Check-in Hoàn Thành Hôm Nay</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={resetDetox}
                      className="px-4 py-3 rounded-2xl border border-white/40 hover:bg-white/50 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors bg-white/20 shadow-sm"
                      title="Làm mới thử thách"
                    >
                      Đặt lại
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: DO */}
          {activeSubTab === "do" && (
            <motion.div
              key="do-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="border-b border-white/40 pb-4">
                <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#34D399]" />
                  Do (Hành Động Trải Nghiệm Xứ Lạng)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Đóng màn hình ảo và bước ra thế giới chân thực. Khám phá các địa điểm văn hóa - thiên nhiên kỳ vĩ tại Lạng Sơn để thanh lọc tâm trí.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Destination Selector Sidebar */}
                <div className="md:col-span-5 space-y-2.5">
                  {LẠNG_SƠN_PLACES.map((place) => {
                    const isSelected = selectedPlace.id === place.id;
                    return (
                      <button
                        key={place.id}
                        onClick={() => setSelectedPlace(place)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                          isSelected
                            ? "bg-[#34D399] border-[#34D399] text-white shadow-md shadow-emerald-200"
                            : "bg-white/40 backdrop-blur-sm border-white/40 text-slate-600 hover:border-[#34D399]/40 hover:bg-white/60"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg transition-colors ${
                            isSelected ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100"
                          }`}>
                            <Tent className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-serif text-[14px] font-bold leading-tight">
                              {place.name}
                            </h4>
                            <p className={`text-[10px] mt-0.5 leading-none ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                              {place.locationDetails.split(",")[0]}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className={`w-4 h-4 transition-transform ${
                          isSelected ? "translate-x-1 text-white" : "text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1"
                        }`} />
                      </button>
                    );
                  })}
                </div>

                {/* Destination Detailed Panel */}
                <div className="md:col-span-7 bg-white/45 backdrop-blur-md rounded-[24px] border border-white/40 p-5 sm:p-6 shadow-sm space-y-4">
                  {/* Title and metadata */}
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full w-fit uppercase mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{selectedPlace.locationDetails}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-slate-800">
                      {selectedPlace.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed text-justify">
                      {selectedPlace.description}
                    </p>
                  </div>

                  {/* Calming Action Recommendation Callout */}
                  <div className="p-4 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
                    
                    <span className="text-[9px] font-bold tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase font-sans">
                      Hành động chấn hưng năng lượng
                    </span>

                    <h4 className="font-serif text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <CompassIcon className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                      {selectedPlace.activityName}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                      {selectedPlace.activityDesc}
                    </p>
                  </div>

                  {/* Prompt Suggestion & Image placeholder representation */}
                  <div className="text-[10px] text-slate-400 bg-white/30 p-2.5 rounded-xl border border-white/30 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                    <span className="font-medium italic text-center w-full">“Hãy thử tạm xa cõi mạng, xách balo lên và khám phá thực tế Xứ Lạng nhé!”</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
