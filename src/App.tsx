import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  HelpCircle, 
  Heart, 
  ShieldAlert, 
  Sparkles, 
  Info,
  Calendar,
  Activity,
  Award,
  Users,
  BookOpen,
  Mail,
  Zap,
  Sun,
  Moon,
  X,
  RotateCcw
} from "lucide-react";
import LandingPage from "./components/LandingPage";
import AssessmentQuiz from "./components/AssessmentQuiz";
import Space4D from "./components/Space4D";
import FlashcardsAndAi from "./components/FlashcardsAndAi";
import MoodLogger from "./components/MoodLogger";
import SelfDiscovery from "./components/SelfDiscovery";
import Gamification from "./components/Gamification";
import Journaling from "./components/Journaling";
import Community from "./components/Community";
import PanicButton from "./components/PanicButton";
import SosButton from "./components/SosButton";
import HealingAudioPlayer from "./components/HealingAudioPlayer";
import { useUserData } from "./context/UserContext";
import { RiskLevel } from "./types";

export default function App() {
  const { userData, updateDiiScore, resetAllData } = useUserData();
  const assessmentLevel = userData.diiLevel;
  const assessmentScore = userData.diiScore;

  // Views: 'landing' | 'quiz' | 'main'
  const [currentView, setCurrentView] = useState<"landing" | "quiz" | "main">("landing");
  
  // Dashboard Tabs: 'space4d' | 'self_discovery' | 'mood' | 'journaling' | 'gamification' | 'community' | 'mentor'
  const [activeTab, setActiveTab] = useState<"space4d" | "self_discovery" | "mood" | "journaling" | "gamification" | "community" | "mentor">("space4d");
  
  // State for Reset Confirmation Modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Healing Themes: 'light' | 'dark-indigo' | 'dark-moss'
  const [theme, setTheme] = useState<"light" | "dark-indigo" | "dark-moss">("light");

  // Empathetic AI Mentor Trigger state
  const [showMentorToast, setShowMentorToast] = useState(false);
  const [journalingSubTab, setJournalingSubTab] = useState<"daily" | "future">("daily");

  const checkMentorTrigger = () => {
    const logs = userData.moodLogs;
    if (logs && logs.length >= 3) {
      const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
      const last3 = sorted.slice(0, 3);
      const negativeMoods = ["sad", "tired", "anxious"];
      const all3Low = last3.every(l => l.energyLevel <= 2 || negativeMoods.includes(l.moodId));
      if (all3Low) {
        setShowMentorToast(true);
        return;
      }
    }
    setShowMentorToast(false);
  };

  // Evaluate triggers reactively when logs change
  useEffect(() => {
    checkMentorTrigger();
  }, [userData.moodLogs]);

  // Redirect to main view if already has a DII score (onboarding completed)
  useEffect(() => {
    if (userData.diiLevel && currentView === "landing") {
      setCurrentView("main");
    }
  }, [userData.diiLevel]);

  const handleStartOnboarding = () => {
    setCurrentView("quiz");
  };

  const handleCompleteQuiz = (level: RiskLevel, score: number) => {
    updateDiiScore(score, level);
  };

  const handleNavigateToDashboard = () => {
    setCurrentView("main");
    setActiveTab("space4d");
  };

  const handleRetakeQuiz = () => {
    setCurrentView("quiz");
  };

  // Determine outer container theme class name
  const getThemeClasses = () => {
    switch (theme) {
      case "dark-indigo":
        return "min-h-screen text-slate-100 font-sans antialiased selection:bg-indigo-900 selection:text-indigo-100 transition-colors duration-500 pb-16 relative overflow-hidden dark-theme-indigo";
      case "dark-moss":
        return "min-h-screen text-slate-100 font-sans antialiased selection:bg-emerald-950 selection:text-emerald-100 transition-colors duration-500 pb-16 relative overflow-hidden dark-theme-moss";
      default:
        return "min-h-screen bg-[#F8FAFC] text-[#334155] font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-500 pb-16 relative overflow-hidden";
    }
  };

  return (
    <div id="app-root" className={getThemeClasses()}>
      {/* CSS overrides for dark-indigo & dark-moss therapeutic modes */}
      <style>{`
        /* Deep Dark Indigo overrides */
        .dark-theme-indigo {
          --card-bg: rgba(21, 23, 35, 0.85);
          --card-border: rgba(255, 255, 255, 0.08);
          background-color: #0b0c12;
          color: #f1f5f9;
        }
        .dark-theme-indigo .bg-white\\/65, 
        .dark-theme-indigo .bg-white\\/70,
        .dark-theme-indigo .bg-white\\/80,
        .dark-theme-indigo .bg-white\\/90 {
          background-color: rgba(21, 23, 35, 0.85) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .dark-theme-indigo p, 
        .dark-theme-indigo span:not(.no-dark-override),
        .dark-theme-indigo div:not(.no-dark-override), 
        .dark-theme-indigo h1, 
        .dark-theme-indigo h2, 
        .dark-theme-indigo h3, 
        .dark-theme-indigo h4,
        .dark-theme-indigo label {
          color: #f1f5f9 !important;
        }
        .dark-theme-indigo .text-slate-800,
        .dark-theme-indigo .text-slate-700,
        .dark-theme-indigo .text-slate-600,
        .dark-theme-indigo .text-slate-500 {
          color: #cbd5e1 !important;
        }
        .dark-theme-indigo .text-slate-400 {
          color: #94a3b8 !important;
        }
        .dark-theme-indigo input,
        .dark-theme-indigo textarea,
        .dark-theme-indigo select {
          background-color: rgba(15, 17, 26, 0.9) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: #ffffff !important;
        }
        .dark-theme-indigo .bg-slate-50 {
          background-color: rgba(15, 17, 26, 0.7) !important;
        }

        /* Deep Dark Moss Green overrides */
        .dark-theme-moss {
          --card-bg: rgba(14, 22, 18, 0.85);
          --card-border: rgba(255, 255, 255, 0.08);
          background-color: #060907;
          color: #f0f7f3;
        }
        .dark-theme-moss .bg-white\\/65, 
        .dark-theme-moss .bg-white\\/70,
        .dark-theme-moss .bg-white\\/80,
        .dark-theme-moss .bg-white\\/90 {
          background-color: rgba(14, 22, 18, 0.85) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .dark-theme-moss p, 
        .dark-theme-moss span:not(.no-dark-override),
        .dark-theme-moss div:not(.no-dark-override), 
        .dark-theme-moss h1, 
        .dark-theme-moss h2, 
        .dark-theme-moss h3, 
        .dark-theme-moss h4,
        .dark-theme-moss label {
          color: #f0f7f3 !important;
        }
        .dark-theme-moss .text-slate-800,
        .dark-theme-moss .text-slate-700,
        .dark-theme-moss .text-slate-600,
        .dark-theme-moss .text-slate-500 {
          color: #d1e2d8 !important;
        }
        .dark-theme-moss .text-slate-400 {
          color: #a2b7aa !important;
        }
        .dark-theme-moss input,
        .dark-theme-moss textarea,
        .dark-theme-moss select {
          background-color: rgba(10, 16, 13, 0.9) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: #ffffff !important;
        }
        .dark-theme-moss .bg-slate-50 {
          background-color: rgba(10, 16, 13, 0.7) !important;
        }

        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Dynamic Glowing Backdrops for Frosted Glass Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#7DD3FC] opacity-20 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#34D399] opacity-15 blur-[120px] rounded-full"></div>
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-amber-200/10 blur-[90px] rounded-full"></div>
      </div>

      {/* 1. Global Floating Panic Button (Top-Left) */}
      <PanicButton />

      {/* 2. Global Floating SOS Hotline (Bottom-Right) */}
      <SosButton />

      {/* 3. Global Healing Audio Player (Bottom-Left) */}
      <HealingAudioPlayer />

      {/* View Switcher Container */}
      <AnimatePresence mode="wait">
        
        {/* VIEW A: LANDING PAGE */}
        {currentView === "landing" && (
          <motion.div
            key="view-landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <LandingPage onStart={handleStartOnboarding} />
          </motion.div>
        )}

        {/* VIEW B: ASSESSMENT QUIZ */}
        {currentView === "quiz" && (
          <motion.div
            key="view-quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <AssessmentQuiz 
              onComplete={handleCompleteQuiz} 
              onNavigateToDashboard={handleNavigateToDashboard} 
            />
          </motion.div>
        )}

        {/* VIEW C: FULL DASHBOARD */}
        {currentView === "main" && (
          <motion.div
            key="view-main"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-5xl mx-auto px-4 pt-12 relative z-10"
          >
            {/* Empathetic AI Mentor Toast Trigger Notification */}
            <AnimatePresence>
              {showMentorToast && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  className="mb-6 p-4 rounded-3xl bg-amber-50/90 dark:bg-slate-900/90 backdrop-blur-md border border-amber-200/50 dark:border-white/10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300 animate-bounce">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider font-mono">AI Mentor Thấu Cảm</p>
                      <p className="text-sm text-slate-700 dark:text-slate-100 font-medium leading-relaxed mt-0.5">
                        "Tớ thấy dạo này cậu có vẻ mệt. Cậu có muốn chúng mình cùng viết một Bức thư gửi tương lai để trút bỏ gánh nặng này không?"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        // Deep link navigation to Time Capsules
                        setJournalingSubTab("future");
                        setActiveTab("journaling");
                        setShowMentorToast(false);
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
                    >
                      Viết thư gửi tương lai ✉️
                    </button>
                    <button
                      onClick={() => setShowMentorToast(false)}
                      className="p-2 hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* Header / Brand Nav */}
            <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/40 pb-6 mb-8 text-center sm:text-left bg-white/40 backdrop-blur-md rounded-2xl p-4 border shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-white/60 backdrop-blur-md text-emerald-500 border border-white/40 shadow-sm animate-float">
                  <Compass className="w-6.5 h-6.5" />
                </div>
                <div>
                  <h1 className="font-serif text-2xl font-bold text-slate-800 tracking-tight flex items-center justify-center sm:justify-start gap-1.5">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-emerald-500">Trạm Định Vị Bản Ngã</span>
                    <span className="text-emerald-500 text-sm italic font-sans font-light">v1.0</span>
                  </h1>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    Identity Compass • Bản đồ định vị thế giới thực cho Gen Z
                  </p>
                </div>
              </div>

              {/* Theme Toggle & Psychological Indicators & Reset */}
              <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-end">
                {/* Advanced Theme Selectors */}
                <div className="flex items-center bg-slate-200/55 dark:bg-slate-900/40 p-1 rounded-2xl border border-white/10 shadow-inner">
                  <button
                    onClick={() => setTheme("light")}
                    className={`p-1.5 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer ${
                      theme === "light"
                        ? "bg-white text-emerald-600 shadow-sm font-bold"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                    title="Giao diện Sáng"
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden md:inline">Sáng</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark-indigo")}
                    className={`p-1.5 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer ${
                      theme === "dark-indigo"
                        ? "bg-[#1e1b4b] text-indigo-300 shadow-sm font-bold border border-indigo-900/30"
                        : "text-slate-400 hover:text-indigo-400"
                    }`}
                    title="Giao diện Chàm Dịu Mắt"
                  >
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[10px] hidden md:inline">Tối Chàm</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark-moss")}
                    className={`p-1.5 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer ${
                      theme === "dark-moss"
                        ? "bg-[#064e3b] text-emerald-300 shadow-sm font-bold border border-emerald-900/30"
                        : "text-slate-400 hover:text-emerald-400"
                    }`}
                    title="Giao diện Rêu Trầm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[10px] hidden md:inline">Tối Rêu</span>
                  </button>
                </div>

                {/* Reset Game State Button */}
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="p-1.5 rounded-2xl bg-rose-50/90 hover:bg-rose-100 text-rose-500 hover:text-rose-600 border border-rose-100 shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer text-xs font-semibold no-dark-override"
                  title="Xóa dữ liệu (Reset) và bắt đầu lại từ đầu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="text-[10px] hidden md:inline">Đặt lại dữ liệu</span>
                </button>

                {assessmentLevel && (
                  <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-2 shadow-sm">
                    <div className="text-left">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono leading-none">Chỉ số bản ngã</p>
                      <p className="text-xs font-bold text-slate-700 mt-1 leading-none">
                      {assessmentLevel === "GREEN" && "An toàn 🌱"}
                      {assessmentLevel === "YELLOW" && "Cảnh báo nhẹ ⚠️"}
                      {assessmentLevel === "ORANGE" && "Báo động 🚨"}
                      {assessmentLevel === "RED" && "Nghiêm trọng 🛑"}
                    </p>
                  </div>
                  <button
                    onClick={handleRetakeQuiz}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/50 transition-colors"
                    title="Đo lường lại chỉ số sức khỏe tinh thần"
                  >
                    <Activity className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              )}
              </div>
            </header>

            {/* Navigation Tabs (Primary Level - 7 CoreZ Pillars) */}
            <div className="flex justify-center border-b border-white/20 mb-8 bg-white/25 backdrop-blur-md p-1.5 rounded-2xl border max-w-4xl mx-auto shadow-sm">
              <nav className="flex gap-2 flex-wrap justify-center items-center w-full">
                
                {/* Tab 1: Không Gian Thực Hành 4D */}
                <button
                  id="tab-space4d"
                  onClick={() => setActiveTab("space4d")}
                  className={`py-2 px-3 text-[11px] sm:text-xs font-bold transition-all relative rounded-xl cursor-pointer ${
                    activeTab === "space4d"
                      ? "text-emerald-600 bg-white/85 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                  }`}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <Compass className="w-3.5 h-3.5 text-emerald-500 animate-spin-slow" />
                    Không Gian 4D
                  </span>
                </button>

                {/* Tab 2: Trắc Nghiệm Bản Ngã */}
                <button
                  id="tab-self-discovery"
                  onClick={() => setActiveTab("self_discovery")}
                  className={`py-2 px-3 text-[11px] sm:text-xs font-bold transition-all relative rounded-xl cursor-pointer ${
                    activeTab === "self_discovery"
                      ? "text-emerald-600 bg-white/85 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                  }`}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <Zap className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    Trắc Nghiệm Bản Ngã
                  </span>
                </button>

                {/* Tab 3: Nhật Ký Cảm Xúc (Mood Log) */}
                <button
                  id="tab-mood"
                  onClick={() => setActiveTab("mood")}
                  className={`py-2 px-3 text-[11px] sm:text-xs font-bold transition-all relative rounded-xl cursor-pointer ${
                    activeTab === "mood"
                      ? "text-emerald-600 bg-white/85 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                  }`}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                    Nhật Ký Cảm Xúc
                  </span>
                </button>

                {/* Tab 4: Góc Phản Tư (Journaling) */}
                <button
                  id="tab-journaling"
                  onClick={() => {
                    setActiveTab("journaling");
                    setJournalingSubTab("daily");
                  }}
                  className={`py-2 px-3 text-[11px] sm:text-xs font-bold transition-all relative rounded-xl cursor-pointer ${
                    activeTab === "journaling"
                      ? "text-emerald-600 bg-white/85 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                  }`}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                    Góc Phản Tư
                  </span>
                </button>

                {/* Tab 5: Kỷ Luật CoreZ (Gamification) */}
                <button
                  id="tab-gamification"
                  onClick={() => setActiveTab("gamification")}
                  className={`py-2 px-3 text-[11px] sm:text-xs font-bold transition-all relative rounded-xl cursor-pointer ${
                    activeTab === "gamification"
                      ? "text-emerald-600 bg-white/85 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                  }`}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <Award className="w-3.5 h-3.5 text-emerald-500 animate-float" />
                    Kỷ Luật CoreZ
                  </span>
                </button>

                {/* Tab 6: Bức Tường Sẻ Chia (Community Wall) */}
                <button
                  id="tab-community"
                  onClick={() => setActiveTab("community")}
                  className={`py-2 px-3 text-[11px] sm:text-xs font-bold transition-all relative rounded-xl cursor-pointer ${
                    activeTab === "community"
                      ? "text-emerald-600 bg-white/85 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                  }`}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <Users className="w-3.5 h-3.5 text-emerald-500" />
                    Bức Tường Sẻ Chia
                  </span>
                </button>

                {/* Tab 7: Bí Kíp & AI Mentor */}
                <button
                  id="tab-mentor"
                  onClick={() => setActiveTab("mentor")}
                  className={`py-2 px-3 text-[11px] sm:text-xs font-bold transition-all relative rounded-xl cursor-pointer ${
                    activeTab === "mentor"
                      ? "text-emerald-600 bg-white/85 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
                  }`}
                >
                  <span className="flex items-center gap-1.5 whitespace-nowrap">
                    <Heart className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    AI Mentor & Bí Kíp
                  </span>
                </button>

              </nav>
            </div>

            {/* Inner Tabs View Render */}
            <main className="py-2">
              <AnimatePresence mode="wait">
                {activeTab === "space4d" && (
                  <motion.div
                    key="tab-content-space4d"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Space4D />
                  </motion.div>
                )}
                {activeTab === "self_discovery" && (
                  <motion.div
                    key="tab-content-self-discovery"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SelfDiscovery />
                  </motion.div>
                )}
                {activeTab === "mentor" && (
                  <motion.div
                    key="tab-content-mentor"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FlashcardsAndAi />
                  </motion.div>
                )}
                {activeTab === "mood" && (
                  <motion.div
                    key="tab-content-mood"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MoodLogger />
                  </motion.div>
                )}
                {activeTab === "journaling" && (
                  <motion.div
                    key="tab-content-journaling"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Journaling initialTab={journalingSubTab} />
                  </motion.div>
                )}
                {activeTab === "gamification" && (
                  <motion.div
                    key="tab-content-gamification"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Gamification />
                  </motion.div>
                )}
                {activeTab === "community" && (
                  <motion.div
                    key="tab-content-community"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Community />
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            {/* Aesthetic Footer */}
            <footer className="text-center text-[11px] text-slate-400/80 mt-12 space-y-1 font-light tracking-wide">
              <p>© 2026 Trạm Định Vị Bản Ngã (Identity Compass) • Nghiên cứu hành vi học đường Việt Nam</p>
              <p>Phòng thí nghiệm Phát triển Hành vi Thượng đẳng & Tâm lý học Thực nghiệm Xứ Lạng</p>
            </footer>
          </motion.div>
        )}

      </AnimatePresence>

      {/* 4. Beautiful Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="w-full max-w-sm bg-white border border-slate-100 rounded-[28px] p-6 shadow-2xl relative overflow-hidden text-slate-800 no-dark-override"
            >
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-20%] w-48 h-48 bg-rose-200/20 blur-2xl rounded-full" />
              </div>

              <div className="relative z-10 flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <div className="p-2 bg-rose-50 text-rose-500 rounded-xl">
                  <RotateCcw className="w-5 h-5 animate-spin-slow" />
                </div>
                <h4 className="font-serif text-sm font-bold text-slate-800">Đặt lại Dữ liệu cá nhân</h4>
              </div>

              <p className="relative z-10 text-xs text-slate-500 leading-relaxed mb-5">
                Hành động này sẽ xóa hoàn toàn điểm đo lường DII, điểm tích lũy karmaXP, nhật ký cảm xúc, số phút thải độc số và tiến trình phát triển của Cây bản địa. Cậu có chắc muốn làm lại từ đầu?
              </p>

              <div className="relative z-10 flex gap-2.5 w-full">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  Quay lại
                </button>
                <button
                  onClick={() => {
                    resetAllData();
                    setTheme("light");
                    setCurrentView("landing");
                    setShowResetConfirm(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Đặt lại ngay
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
