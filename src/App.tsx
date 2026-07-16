import { useState } from "react";
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
  Zap
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
import { RiskLevel } from "./types";

export default function App() {
  // Views: 'landing' | 'quiz' | 'main'
  const [currentView, setCurrentView] = useState<"landing" | "quiz" | "main">("landing");
  
  // Dashboard Tabs: 'space4d' | 'self_discovery' | 'mood' | 'journaling' | 'gamification' | 'community' | 'mentor'
  const [activeTab, setActiveTab] = useState<"space4d" | "self_discovery" | "mood" | "journaling" | "gamification" | "community" | "mentor">("space4d");
  
  // Scoring parameters stored in state
  const [assessmentLevel, setAssessmentLevel] = useState<RiskLevel | null>(null);
  const [assessmentScore, setAssessmentScore] = useState<number>(0);

  const handleStartOnboarding = () => {
    setCurrentView("quiz");
  };

  const handleCompleteQuiz = (level: RiskLevel, score: number) => {
    setAssessmentLevel(level);
    setAssessmentScore(score);
  };

  const handleNavigateToDashboard = () => {
    setCurrentView("main");
    setActiveTab("space4d");
  };

  const handleRetakeQuiz = () => {
    setCurrentView("quiz");
  };

  return (
    <div id="app-root" className="min-h-screen bg-[#F8FAFC] text-[#334155] font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-500 pb-16 relative overflow-hidden">
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

              {/* Display Current Psychological Indicator */}
              {assessmentLevel && (
                <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl px-4 py-2 shadow-sm">
                  <div className="text-left">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono leading-none">Chỉ số bản ngã</p>
                    <p className="text-xs font-bold text-slate-700 mt-1 leading-none">
                      {assessmentLevel === "GREEN" && "Ổn định 🌱"}
                      {assessmentLevel === "YELLOW" && "Chông chênh 🍂"}
                      {assessmentLevel === "RED" && "Khủng hoảng 🚨"}
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
                  onClick={() => setActiveTab("journaling")}
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
                    <Journaling />
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
    </div>
  );
}
