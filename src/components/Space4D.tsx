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
  Tent,
  Trash2,
  Clock,
  Globe,
  Award,
  ShieldCheck,
  VolumeX,
  Smartphone,
  BellOff,
  Moon
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
  // Tab 3: Detox (Thanh lọc số) State & Logic
  // ==========================================
  const [detoxTasks, setDetoxTasks] = useState({
    unfollowedToxic: false,       // D3-1
    interactedPositive: false,    // D3-2
    grayscaleChallenge: false,    // D3-3
    disableNotifications: false,  // D3-4
    bedtimeCurfew: false,         // D3-5
    activatedLimit: false,        // D3-6
  });
  const [dailyOnlineLimit, setDailyOnlineLimit] = useState<number>(1.5); // hours/day, default 1.5

  const toggleDetoxTask = (key: keyof typeof detoxTasks) => {
    setDetoxTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const completedDetoxCount = Object.values(detoxTasks).filter(Boolean).length;
  const detoxProgressPercent = Math.round((completedDetoxCount / 6) * 100);

  const resetDetox = () => {
    setDetoxTasks({
      unfollowedToxic: false,
      interactedPositive: false,
      grayscaleChallenge: false,
      disableNotifications: false,
      bedtimeCurfew: false,
      activatedLimit: false,
    });
    setDailyOnlineLimit(1.5);
  };

  // ==========================================
  // Tab 4: Do (Hành động) State & Logic
  // ==========================================
  const [selectedPlace, setSelectedPlace] = useState<LạngSơnPlace>(LẠNG_SƠN_PLACES[0]);
  const [safeZoneRules, setSafeZoneRules] = useState<string[]>([
    "Tắt máy trước 22h",
    "Không mang điện thoại vào bàn ăn gia đình"
  ]);
  const [creatorTasks, setCreatorTasks] = useState({
    createFanpage: false,
    shareKnowledge: false,
    promoteCulture: false,
    cvPortfolio: false,
  });

  const toggleSafeZoneRule = (rule: string) => {
    setSafeZoneRules(prev =>
      prev.includes(rule) ? prev.filter(r => r !== rule) : [...prev, rule]
    );
  };

  const toggleCreatorTask = (key: keyof typeof creatorTasks) => {
    setCreatorTasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4 font-sans relative z-10">
      {/* 4D Space Tab Navigator */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 bg-white/40 backdrop-blur-md rounded-2xl mb-8 border border-white/40 shadow-sm">
        {[
          { id: "define", label: "D1: Định Vị", desc: "Thấu hiểu", icon: Compass },
          { id: "devirtualize", label: "D2: Chấp Nhận", desc: "Bản ngã", icon: MessageSquare },
          { id: "detox", label: "D3: Thanh Lọc", desc: "Lọc số", icon: Leaf },
          { id: "do", label: "D4: Hành Động", desc: "Kiến tạo", icon: MapPin }
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
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase border border-emerald-100/40">
                  Vòng 1: Định Vị Bản Ngã (D1)
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2 mt-2">
                  <Sparkles className="w-5 h-5 text-[#34D399]" />
                  Định vị Sức Mạnh Nội Tại
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
                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full uppercase border border-sky-100/40">
                  Vòng 2: Đối diện & Soi chiếu (D2)
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2 mt-2">
                  <MessageSquare className="w-5 h-5 text-sky-400" />
                  Diễn đàn ẩn danh "Bản ngã chông chênh"
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Nơi các em viết chia sẻ giấu tên về những sự tự ti, lo âu của mình. Khi đọc bài của nhau, các em nhận ra: Hóa ra ai cũng có góc khuất, sự hoàn hảo trên mạng chỉ là ảo ảnh.
                </p>
              </div>

              {/* Confession Submission Form */}
              <form onSubmit={handlePostConfession} className="flex gap-2.5">
                <input
                  type="text"
                  placeholder="Nhập nỗi lòng tự ti, lo âu hay áp lực số mà cậu muốn gửi gắm giấu tên..."
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
                  <span className="hidden sm:inline">Trút Bỏ</span>
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
                          <span>#ẩn_danh_xứ_lạng</span>
                          <span>{conf.timestamp}</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Vòng 2 Outcome Callout for D2 */}
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-sky-800 uppercase tracking-wide">Mục tiêu của sự Chấp Nhận</h4>
                  <p className="text-xs text-sky-600 mt-1 leading-relaxed">
                    Giúp các em nhận thức được rằng mọi người đều có góc khuất và những khoảnh khắc chông chênh, gạt bỏ ảo ảnh hoàn mỹ của mạng xã hội để đối diện chân thật với chính mình.
                  </p>
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
                <span className="text-[10px] font-bold text-[#34D399] bg-emerald-50 px-2.5 py-1 rounded-full uppercase border border-emerald-100/40">
                  Vòng 2: Đối diện & Soi chiếu (D3)
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2 mt-2">
                  <Leaf className="w-5 h-5 text-[#34D399]" />
                  D3 - Thanh lọc số (Thải Độc Thói Quen Không Gian Ảo)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kích hoạt các kỹ năng dọn dẹp môi trường số để xây dựng ranh giới an toàn cho tinh thần, không bị thuật toán thao túng tâm lý.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                {/* Circular Progress Meter */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-white/40 backdrop-blur-sm rounded-[24px] border border-white/40 shadow-sm">
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
                          strokeDashoffset: 377 - (377 * (completedDetoxCount / 6)) 
                        }}
                        transition={{ duration: 1 }}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3.5xl font-bold text-slate-700 font-mono">
                        {detoxProgressPercent}%
                      </span>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Thanh lọc</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-4 font-medium text-center leading-snug">
                    Đạt <span className="text-[#34D399] font-bold">{completedDetoxCount}/6</span> thói quen thanh lọc hôm nay
                  </p>
                </div>

                {/* 6 Interactive Detox Tasks */}
                <div className="md:col-span-8 space-y-3.5">
                  
                  {/* Task 1 */}
                  <div 
                    onClick={() => toggleDetoxTask("unfollowedToxic")}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                      detoxTasks.unfollowedToxic 
                        ? "bg-emerald-50/50 border-emerald-300 text-slate-800 shadow-sm" 
                        : "bg-white/40 border-white/30 hover:bg-white/65 hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                      detoxTasks.unfollowedToxic ? "bg-[#34D399] border-[#34D399] text-white" : "border-slate-300 bg-white"
                    }`}>
                      {detoxTasks.unfollowedToxic && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Trash2 className="w-4 h-4 text-emerald-500" />
                        <h4 className="text-xs sm:text-sm font-bold text-slate-700">Dọn rác không gian số</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold font-mono">D3-1</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed text-justify">
                        Hủy theo dõi các trang/hội nhóm độc hại, tiêu cực gây áp lực đồng trang lứa.
                      </p>
                    </div>
                  </div>

                  {/* Task 2 */}
                  <div 
                    onClick={() => toggleDetoxTask("interactedPositive")}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                      detoxTasks.interactedPositive 
                        ? "bg-emerald-50/50 border-emerald-300 text-slate-800 shadow-sm" 
                        : "bg-white/40 border-white/30 hover:bg-white/65 hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                      detoxTasks.interactedPositive ? "bg-[#34D399] border-[#34D399] text-white" : "border-slate-300 bg-white"
                    }`}>
                      {detoxTasks.interactedPositive && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-emerald-500" />
                        <h4 className="text-xs sm:text-sm font-bold text-slate-700">Đào tạo lại thuật toán</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold font-mono">D3-2</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed text-justify">
                        Chủ động tương tác với nội dung tích cực, kiến thức học tập hoặc kỹ năng sống.
                      </p>
                    </div>
                  </div>

                  {/* Task 3 */}
                  <div 
                    onClick={() => toggleDetoxTask("grayscaleChallenge")}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                      detoxTasks.grayscaleChallenge 
                        ? "bg-emerald-50/50 border-emerald-300 text-slate-800 shadow-sm" 
                        : "bg-white/40 border-white/30 hover:bg-white/65 hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                      detoxTasks.grayscaleChallenge ? "bg-[#34D399] border-[#34D399] text-white" : "border-slate-300 bg-white"
                    }`}>
                      {detoxTasks.grayscaleChallenge && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-500" />
                        <h4 className="text-xs sm:text-sm font-bold text-slate-700">Thử thách Màn hình xám</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold font-mono">D3-3</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed text-justify">
                        Chuyển màn hình điện thoại sang chế độ trắng đen/grayscale để giảm kích thích thị giác, bớt thèm lướt mạng xã hội.
                      </p>
                    </div>
                  </div>

                  {/* Task 4 */}
                  <div 
                    onClick={() => toggleDetoxTask("disableNotifications")}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                      detoxTasks.disableNotifications 
                        ? "bg-emerald-50/50 border-emerald-300 text-slate-800 shadow-sm" 
                        : "bg-white/40 border-white/30 hover:bg-white/65 hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                      detoxTasks.disableNotifications ? "bg-[#34D399] border-[#34D399] text-white" : "border-slate-300 bg-white"
                    }`}>
                      {detoxTasks.disableNotifications && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <BellOff className="w-4 h-4 text-emerald-500" />
                        <h4 className="text-xs sm:text-sm font-bold text-slate-700">Tắt thông báo không cần thiết</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold font-mono">D3-4</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed text-justify">
                        Tắt toàn bộ thông báo từ các ứng dụng mua sắm, giải trí, chỉ giữ lại kênh liên lạc quan trọng trong giờ học.
                      </p>
                    </div>
                  </div>

                  {/* Task 5 */}
                  <div 
                    onClick={() => toggleDetoxTask("bedtimeCurfew")}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                      detoxTasks.bedtimeCurfew 
                        ? "bg-emerald-50/50 border-emerald-300 text-slate-800 shadow-sm" 
                        : "bg-white/40 border-white/30 hover:bg-white/65 hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-0.5 shrink-0 ${
                      detoxTasks.bedtimeCurfew ? "bg-[#34D399] border-[#34D399] text-white" : "border-slate-300 bg-white"
                    }`}>
                      {detoxTasks.bedtimeCurfew && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-emerald-500" />
                        <h4 className="text-xs sm:text-sm font-bold text-slate-700">Thiết lập Giờ Giới Nghiêm Thiết Bị</h4>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold font-mono">D3-5</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed text-justify">
                        Không chạm vào điện thoại trước khi đi ngủ 30 phút để bảo vệ giấc ngủ và hệ thần kinh.
                      </p>
                    </div>
                  </div>

                  {/* Task 6 */}
                  <div 
                    className={`p-4 rounded-2xl border transition-all flex flex-col gap-3.5 select-none ${
                      detoxTasks.activatedLimit 
                        ? "bg-emerald-50/50 border-emerald-300 text-slate-800 shadow-sm" 
                        : "bg-white/40 border-white/30"
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div 
                        onClick={() => toggleDetoxTask("activatedLimit")}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-0.5 shrink-0 cursor-pointer ${
                          detoxTasks.activatedLimit ? "bg-[#34D399] border-[#34D399] text-white" : "border-slate-300 bg-white"
                        }`}
                      >
                        {detoxTasks.activatedLimit && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-500" />
                          <h4 className="text-xs sm:text-sm font-bold text-slate-700">Chủ động khoảng nghỉ</h4>
                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold font-mono">D3-6</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed text-justify">
                          Giới hạn thời gian sử dụng mạng xã hội ngoài giờ học, cài đặt ranh giới thời gian hợp lý.
                        </p>
                      </div>
                    </div>

                    {/* Interactive Slider inside Task 6 */}
                    <div className="pl-9 pr-2 space-y-2">
                      <div className="flex justify-between items-center text-[11px] text-slate-500">
                        <span>Thời gian giới hạn ngoài giờ học:</span>
                        <span className="font-bold font-mono text-emerald-600 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/50">
                          {dailyOnlineLimit} giờ/ngày
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="3" 
                        step="0.1" 
                        value={dailyOnlineLimit} 
                        onChange={(e) => setDailyOnlineLimit(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                        <span>Nghiêm ngặt (0.5h)</span>
                        <span>Khuyến nghị (1.5h)</span>
                        <span>Nới lỏng (3.0h)</span>
                      </div>

                      {dailyOnlineLimit <= 1.5 ? (
                        <div className="text-[10px] text-emerald-600 font-medium bg-emerald-50 border border-emerald-100/60 p-2 rounded-xl flex items-center gap-1.5 animate-pulse">
                          <span>🌿</span>
                          <span>Đúng chuẩn ranh giới xanh! Không quá 1,5 giờ/ngày ngoài giờ học giúp đầu óc thảnh thơi.</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500 font-light bg-slate-50 p-2 rounded-xl">
                          💡 Hãy kéo slider về mức ≤ 1.5 giờ/ngày để đạt giới hạn tối ưu nhất của cuộc sống thực nhé.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

              {/* Combined Vòng 2 Result Card */}
              <div className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 p-5 rounded-[24px] space-y-2 text-justify">
                <h5 className="font-serif text-[14px] font-bold text-emerald-900 flex items-center gap-1.5">
                  <Award className="w-4.5 h-4.5 text-emerald-500" />
                  Kết quả rèn luyện Vòng 2: Đối diện & Soi chiếu
                </h5>
                <p className="text-[11.5px] text-emerald-700 leading-relaxed font-light">
                  Học sinh biết chấp nhận các cảm xúc tiêu cực thông qua diễn đàn giấu tên, hiểu cách dọn dẹp không gian mạng và chủ động khoảng nghỉ ranh giới để không còn bị thuật toán hay "vỏ bọc ảo" của mạng xã hội thao túng tâm lý.
                </p>
              </div>

              {/* Footer controls for Detox */}
              <div className="flex justify-end pt-2 border-t border-white/40">
                <button
                  onClick={resetDetox}
                  className="px-4 py-2 rounded-xl border border-white/40 hover:bg-white/50 text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors bg-white/20 shadow-sm"
                >
                  Thiết lập lại thanh lọc
                </button>
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
                <span className="text-[10px] font-bold text-[#34D399] bg-emerald-50 px-2.5 py-1 rounded-full uppercase border border-emerald-100/40">
                  Vòng 3: Sáng suốt & Kiến tạo (D4)
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2 mt-2">
                  <MapPin className="w-5 h-5 text-[#34D399]" />
                  D4 - Hành động (Kiến Tạo Bản Ngã Thực Sống Khỏe)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Đóng màn hình ảo, bước vào các hành động kiến tạo thói quen văn minh và tham quan các địa danh thực tại hùng vĩ tại Lạng Sơn để thanh lọc tâm trí hoàn toàn.
                </p>
              </div>

              {/* Vòng 3 Interactive Planner */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Safe Device-Free Zones */}
                <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/30 space-y-3 shadow-inner">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                    <VolumeX className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-bold text-slate-700 uppercase">1. Vùng an toàn không thiết bị</h4>
                  </div>
                  <p className="text-[10px] text-slate-400">Chọn các cam kết định lượng không thiết bị mà cậu áp dụng:</p>
                  <div className="space-y-2">
                    {[
                      "Tắt máy hoàn toàn trước 22h",
                      "Không mang điện thoại vào bàn ăn gia đình",
                      "Không lướt mạng khi đã lên giường ngủ",
                      "Để điện thoại xa tầm tay khi ngồi học bài"
                    ].map((rule) => {
                      const isActive = safeZoneRules.includes(rule);
                      return (
                        <div 
                          key={rule}
                          onClick={() => toggleSafeZoneRule(rule)}
                          className={`p-2 rounded-xl border text-[11px] leading-snug cursor-pointer transition-all ${
                            isActive 
                              ? "bg-amber-50/80 border-amber-300 text-amber-800 font-medium" 
                              : "bg-white/50 border-slate-100 text-slate-500 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{isActive ? "🧡" : "⚪"}</span>
                            <span>{rule}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Passive to Active Creative */}
                <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/30 space-y-3 shadow-inner">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                    <CompassIcon className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                    <h4 className="text-xs font-bold text-slate-700 uppercase">2. Chuyển đổi thụ động sang kiến tạo</h4>
                  </div>
                  <p className="text-[10px] text-slate-400">Thay thế việc tiêu thụ vô thức bằng cách tạo giá trị bổ ích:</p>
                  <div className="space-y-2">
                    {[
                      { key: "createFanpage", label: "Cùng bạn học lập fanpage/lớp học chia sẻ kiến thức trực tuyến bổ ích" },
                      { key: "shareKnowledge", label: "Đăng tải bài viết hướng dẫn phương pháp tự học/ôn thi chất lượng" }
                    ].map((item) => {
                      const isChecked = creatorTasks[item.key as keyof typeof creatorTasks];
                      return (
                        <div 
                          key={item.key}
                          onClick={() => toggleCreatorTask(item.key as any)}
                          className={`p-3 rounded-xl border text-[11px] leading-snug cursor-pointer transition-all ${
                            isChecked 
                              ? "bg-emerald-50/60 border-emerald-300 text-emerald-800 font-medium" 
                              : "bg-white/50 border-slate-100 text-slate-500 hover:bg-white"
                          }`}
                        >
                          <div className="flex gap-2 items-start">
                            <span className="text-xs mt-0.5">{isChecked ? "✅" : "⬜"}</span>
                            <span>{item.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Spreading civilized workspace / values */}
                <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-sm border border-white/30 space-y-3 shadow-inner">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <h4 className="text-xs font-bold text-slate-700 uppercase">3. Xây dựng mạng văn minh</h4>
                  </div>
                  <p className="text-[10px] text-slate-400">Lan tỏa bản sắc tích cực quê hương thay trào lưu vô ích:</p>
                  <div className="space-y-2">
                    {[
                      { key: "promoteCulture", label: "Sử dụng mạng xã hội để quảng bá văn hóa, danh lam và đặc sản Lạng Sơn" },
                      { key: "cvPortfolio", label: "Biến trang cá nhân thành bản CV thu nhỏ thể hiện năng lực và lối sống xanh" }
                    ].map((item) => {
                      const isChecked = creatorTasks[item.key as keyof typeof creatorTasks];
                      return (
                        <div 
                          key={item.key}
                          onClick={() => toggleCreatorTask(item.key as any)}
                          className={`p-3 rounded-xl border text-[11px] leading-snug cursor-pointer transition-all ${
                            isChecked 
                              ? "bg-blue-50 border-blue-300 text-blue-800 font-medium" 
                              : "bg-white/50 border-slate-100 text-slate-500 hover:bg-white"
                          }`}
                        >
                          <div className="flex gap-2 items-start">
                            <span className="text-xs mt-0.5">{isChecked ? "✅" : "⬜"}</span>
                            <span>{item.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Real World Local Experiential Traveling Grounding (Lạng Sơn) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-100/50 pb-2">
                  <Smartphone className="w-4 h-4 text-emerald-500 shrink-0" />
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Cắt sóng, ngắt mạng & Khám phá địa điểm dã ngoại đời thực tại Lạng Sơn:</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Destination Selector Sidebar */}
                  <div className="md:col-span-5 space-y-2">
                    {LẠNG_SƠN_PLACES.map((place) => {
                      const isSelected = selectedPlace.id === place.id;
                      return (
                        <button
                          key={place.id}
                          onClick={() => setSelectedPlace(place)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group ${
                            isSelected
                              ? "bg-[#34D399] border-[#34D399] text-white shadow-md shadow-emerald-200"
                              : "bg-white/40 backdrop-blur-sm border-white/40 text-slate-600 hover:border-[#34D399]/40 hover:bg-white/60"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-lg transition-colors ${
                              isSelected ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100"
                            }`}>
                              <Tent className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <h4 className="font-serif text-[13px] font-bold leading-tight">
                                {place.name}
                              </h4>
                              <p className={`text-[9.5px] mt-0.5 leading-none ${isSelected ? "text-white/80" : "text-slate-400"}`}>
                                {place.locationDetails.split(",")[0]}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${
                            isSelected ? "translate-x-1 text-white" : "text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1"
                          }`} />
                        </button>
                      );
                    })}
                  </div>

                  {/* Destination Detailed Panel */}
                  <div className="md:col-span-7 bg-white/45 backdrop-blur-md rounded-[24px] border border-white/40 p-5 shadow-sm space-y-4">
                    {/* Title and metadata */}
                    <div>
                      <div className="flex items-center gap-1.5 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full w-fit uppercase mb-1.5">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{selectedPlace.locationDetails}</span>
                      </div>
                      <h3 className="font-serif text-base sm:text-lg font-bold text-slate-800">
                        {selectedPlace.name}
                      </h3>
                      <p className="text-[11.5px] text-slate-500 mt-1.5 leading-relaxed text-justify">
                        {selectedPlace.description}
                      </p>
                    </div>

                    {/* Calming Action Recommendation Callout */}
                    <div className="p-3.5 rounded-2xl bg-white/30 backdrop-blur-sm border border-white/40 space-y-1.5 relative overflow-hidden">
                      <span className="text-[8.5px] font-bold tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded uppercase font-sans">
                        Hành động rèn luyện đời thực đề xuất:
                      </span>

                      <h4 className="font-serif text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <CompassIcon className="w-3.5 h-3.5 text-emerald-500 animate-spin-slow" />
                        {selectedPlace.activityName}
                      </h4>

                      <p className="text-[10.5px] text-slate-600 leading-relaxed text-justify font-light">
                        {selectedPlace.activityDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Combined Vòng 3 Result Card */}
              <div className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 p-5 rounded-[24px] space-y-2 text-justify">
                <h5 className="font-serif text-[14px] font-bold text-emerald-900 flex items-center gap-1.5">
                  <Award className="w-4.5 h-4.5 text-emerald-500" />
                  Kết quả rèn luyện Vòng 3: Sáng suốt & Kiến tạo
                </h5>
                <p className="text-[11.5px] text-emerald-700 leading-relaxed font-light">
                  Học sinh làm chủ công nghệ chứ không để công nghệ thao túng. Mạng xã hội không còn là "cơn sóng" chông chênh mà trở thành công cụ đắc lực để lan tỏa một "Bản ngã thực" tự tin, trách nhiệm.
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
