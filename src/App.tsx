import React, { useState, useEffect } from "react";
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
import CuteStar from "./components/CuteStar";
import { useUserData } from "./context/UserContext";
import { RiskLevel } from "./types";

const StarryBackground = ({ theme }: { theme: "dark-indigo" | "dark-moss" }) => {
  const [standingStars] = useState(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 0.8,
      delay: `${Math.random() * 5}s`,
      duration: `${4 + Math.random() * 4}s`,
    }))
  );

  const [driftingStars] = useState(() =>
    Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.2 + 1.2,
      delay: `${Math.random() * 6}s`,
      duration: `${8 + Math.random() * 8}s`,
      driftY: -(120 + Math.random() * 100),
    }))
  );

  // Tiny twinkle particles overlay (twinkle 3s infinite) with different opacities
  const [particles] = useState(() =>
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.2 + 0.5,
      opacity: Math.random() * 0.5 + 0.25,
      delay: `${Math.random() * 3}s`,
    }))
  );

  const starColorClass = theme === "dark-indigo" 
    ? "bg-sky-100 shadow-[0_0_6px_rgba(125,211,252,0.8)]" 
    : "bg-amber-100 shadow-[0_0_6px_rgba(253,230,138,0.8)]";

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
      {/* 1. Standing/twinkling stars */}
      {standingStars.map((star) => (
        <div
          key={`stand-${star.id}`}
          className={`absolute rounded-full animate-twinkle ${starColorClass}`}
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      {/* 2. Tiny gentle twinkle particles (twinkle 3s infinite) */}
      {particles.map((p) => (
        <div
          key={`part-${p.id}`}
          className={`absolute rounded-full bg-white/95 shadow-[0_0_3px_rgba(255,255,255,0.7)]`}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `twinkle 3s ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* 3. Drifting/flying upward stars */}
      {driftingStars.map((star) => (
        <div
          key={`drift-${star.id}`}
          className={`absolute rounded-full animate-star-drift ${starColorClass}`}
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
            animationDuration: star.duration,
            "--drift-y": `${star.driftY}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

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

  // Sync theme to document.body class list
  useEffect(() => {
    document.body.classList.remove(
      "theme-light",
      "theme-indigo",
      "theme-moss",
      "dark-theme-indigo",
      "dark-theme-moss",
      "theme-dark-indigo",
      "theme-dark-moss"
    );
    if (theme === "dark-indigo") {
      document.body.classList.add("theme-indigo", "dark-theme-indigo", "theme-dark-indigo");
    } else if (theme === "dark-moss") {
      document.body.classList.add("theme-moss", "dark-theme-moss", "theme-dark-moss");
    } else {
      document.body.classList.add("theme-light");
    }
  }, [theme]);

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
        return "min-h-screen text-slate-100 font-sans antialiased selection:bg-indigo-900 selection:text-indigo-100 transition-colors duration-500 pb-16 relative overflow-hidden dark-theme-indigo theme-indigo";
      case "dark-moss":
        return "min-h-screen text-slate-100 font-sans antialiased selection:bg-emerald-950 selection:text-emerald-100 transition-colors duration-500 pb-16 relative overflow-hidden dark-theme-moss theme-moss";
      default:
        return "min-h-screen bg-[#F8FAFC] text-[#334155] font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-500 pb-16 relative overflow-hidden theme-light";
    }
  };

  return (
    <div id="app-root" key={theme} className={getThemeClasses()}>
      {/* CSS overrides for dark-indigo & dark-moss therapeutic modes */}
      <style>{`
        /* Deep Dark Indigo overrides */
        .dark-theme-indigo {
          --card-bg: rgba(255, 255, 255, 0.05);
          --card-border: rgba(255, 255, 255, 0.12);
          background: linear-gradient(135deg, #050515 0%, #0c0b24 45%, #180d3d 100%) !important;
          color: #ffffff !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }

        /* Glassmorphism card & button overrides for Indigo */
        .dark-theme-indigo .bg-white:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo .bg-white\\/40:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo .bg-white\\/50:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo .bg-white\\/60:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo .bg-white\\/65:not(.no-dark-override):not(.no-dark-override *), 
        .dark-theme-indigo .bg-white\\/70:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo .bg-white\\/75:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo .bg-white\\/80:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo .bg-white\\/85:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo .bg-white\\/90:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo .bg-white\\/95:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo .bg-amber-50\\/90:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo .card:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo .bg-slate-50:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo button:not(.no-dark-override):not(.bg-gradient-to-r) {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3) !important;
          transform: translate3d(0, 0, 0) !important;
        }

        /* Active active tab button glassmorphism override */
        .dark-theme-indigo .bg-white\\/85 {
          background: rgba(255, 255, 255, 0.15) !important;
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
        }

        /* Typography optimizations for Indigo mode to ensure absolute clarity and zero blur */
        .dark-theme-indigo p:not(.no-dark-override):not(.no-dark-override *), 
        .dark-theme-indigo span:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo div:not(.no-dark-override):not(.no-dark-override *), 
        .dark-theme-indigo h1:not(.no-dark-override):not(.no-dark-override *), 
        .dark-theme-indigo h2:not(.no-dark-override):not(.no-dark-override *), 
        .dark-theme-indigo h3:not(.no-dark-override):not(.no-dark-override *), 
        .dark-theme-indigo h4:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo h5:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo label:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo li:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-indigo strong:not(.no-dark-override):not(.no-dark-override *) {
          color: #f8f9fa !important;
          text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.15), 0px 1px 4px rgba(0, 0, 0, 0.6) !important;
          font-weight: 500 !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          transform: translate3d(0, 0, 0) !important;
        }

        /* Bold elements for maximum punch and crispness in cards */
        .dark-theme-indigo h1,
        .dark-theme-indigo h2,
        .dark-theme-indigo h3,
        .dark-theme-indigo h4,
        .dark-theme-indigo h5,
        .dark-theme-indigo strong,
        .dark-theme-indigo .font-bold,
        .dark-theme-indigo .font-extrabold,
        .dark-theme-indigo .font-semibold {
          font-weight: 700 !important;
          color: #ffffff !important;
          text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.2), 0px 1px 6px rgba(0, 0, 0, 0.7) !important;
        }

        .dark-theme-indigo .text-slate-800,
        .dark-theme-indigo .text-slate-700,
        .dark-theme-indigo .text-slate-600,
        .dark-theme-indigo .text-slate-500,
        .dark-theme-indigo .text-slate-400 {
          color: #f8f9fa !important;
        }

        /* Brightness & contrast boost for images and icons in Indigo */
        .dark-theme-indigo img,
        .dark-theme-indigo svg {
          filter: brightness(1.15) contrast(1.15) saturate(1.15) !important;
          transform: translate3d(0, 0, 0) !important;
        }

        .dark-theme-indigo input,
        .dark-theme-indigo textarea,
        .dark-theme-indigo select {
          background-color: rgba(15, 17, 26, 0.9) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: #ffffff !important;
        }

        /* Deep Dark Moss Green overrides */
        .dark-theme-moss {
          --card-bg: rgba(255, 255, 255, 0.05);
          --card-border: rgba(255, 255, 255, 0.12);
          background: linear-gradient(135deg, #020b08 0%, #051a14 45%, #0f2c22 100%) !important;
          color: #ffffff !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
        }

        /* Glassmorphism card & button overrides for Moss */
        .dark-theme-moss .bg-white:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss .bg-white\\/40:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss .bg-white\\/50:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss .bg-white\\/60:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss .bg-white\\/65:not(.no-dark-override):not(.no-dark-override *), 
        .dark-theme-moss .bg-white\\/70:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss .bg-white\\/75:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss .bg-white\\/80:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss .bg-white\\/85:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss .bg-white\\/90:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss .bg-white\\/95:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss .bg-amber-50\\/90:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss .card:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss .bg-slate-50:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss button:not(.no-dark-override):not(.bg-gradient-to-r) {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(10px) !important;
          -webkit-backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3) !important;
          transform: translate3d(0, 0, 0) !important;
        }

        /* Active active tab button glassmorphism override */
        .dark-theme-moss .bg-white\\/85 {
          background: rgba(255, 255, 255, 0.15) !important;
          border: 1px solid rgba(255, 255, 255, 0.25) !important;
        }

        /* Typography optimizations for Moss mode to ensure absolute clarity and zero blur */
        .dark-theme-moss p:not(.no-dark-override):not(.no-dark-override *), 
        .dark-theme-moss span:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss div:not(.no-dark-override):not(.no-dark-override *), 
        .dark-theme-moss h1:not(.no-dark-override):not(.no-dark-override *), 
        .dark-theme-moss h2:not(.no-dark-override):not(.no-dark-override *), 
        .dark-theme-moss h3:not(.no-dark-override):not(.no-dark-override *), 
        .dark-theme-moss h4:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss h5:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss label:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss li:not(.no-dark-override):not(.no-dark-override *),
        .dark-theme-moss strong:not(.no-dark-override):not(.no-dark-override *) {
          color: #f8f9fa !important;
          text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.15), 0px 1px 4px rgba(0, 0, 0, 0.6) !important;
          font-weight: 500 !important;
          text-rendering: optimizeLegibility !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          transform: translate3d(0, 0, 0) !important;
        }

        /* Bold elements for maximum punch and crispness in Moss cards */
        .dark-theme-moss h1,
        .dark-theme-moss h2,
        .dark-theme-moss h3,
        .dark-theme-moss h4,
        .dark-theme-moss h5,
        .dark-theme-moss strong,
        .dark-theme-moss .font-bold,
        .dark-theme-moss .font-extrabold,
        .dark-theme-moss .font-semibold {
          font-weight: 700 !important;
          color: #ffffff !important;
          text-shadow: 0px 0px 1px rgba(255, 255, 255, 0.2), 0px 1px 6px rgba(0, 0, 0, 0.7) !important;
        }

        .dark-theme-moss .text-slate-800,
        .dark-theme-moss .text-slate-700,
        .dark-theme-moss .text-slate-600,
        .dark-theme-moss .text-slate-500,
        .dark-theme-moss .text-slate-400 {
          color: #f8f9fa !important;
        }

        /* Brightness & contrast boost for images and icons in Moss */
        .dark-theme-moss img,
        .dark-theme-moss svg {
          filter: brightness(1.15) contrast(1.15) saturate(1.15) !important;
          transform: translate3d(0, 0, 0) !important;
        }

        .dark-theme-moss input,
        .dark-theme-moss textarea,
        .dark-theme-moss select {
          background-color: rgba(10, 16, 13, 0.9) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: #ffffff !important;
        }

        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.85); }
          50% { opacity: 0.95; transform: scale(1.15); }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        @keyframes starryDriftUp {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(var(--drift-y, -150px)) scale(1.3);
            opacity: 0;
          }
        }
        .animate-star-drift {
          animation: starryDriftUp 10s linear infinite;
        }
      `}</style>

      {/* Dynamic Glowing Backdrops for Frosted Glass Theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {theme === "light" && (
          <>
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#7DD3FC] opacity-20 blur-[100px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#34D399] opacity-15 blur-[120px] rounded-full"></div>
            <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-amber-200/10 blur-[90px] rounded-full"></div>
          </>
        )}
        {theme === "dark-indigo" && (
          <>
            {/* Left side cosmic purples / blues as shown in user's image */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#4338ca] opacity-40 blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#6d28d9] opacity-35 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '12s' }}></div>
            <div className="absolute top-[30%] left-[20%] w-[500px] h-[500px] bg-[#db2777] opacity-20 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }}></div>
            <StarryBackground theme="dark-indigo" />
          </>
        )}
        {theme === "dark-moss" && (
          <>
            {/* Right side serene deep moss greens as shown in user's image */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#064e3b] opacity-45 blur-[140px] rounded-full animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#022c22] opacity-45 blur-[150px] rounded-full animate-pulse" style={{ animationDuration: '12s' }}></div>
            <div className="absolute top-[30%] left-[25%] w-[500px] h-[500px] bg-[#10b981] opacity-25 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }}></div>
            <StarryBackground theme="dark-moss" />
          </>
        )}
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
                  <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center sm:justify-start gap-2 leading-tight">
                    <CuteStar size={36} className="shrink-0 animate-float" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-emerald-800 to-emerald-500">
                      CoreZ - Kết nối giá trị, định hình tương lai
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium italic mt-1 text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5">
                    <span>Trạm Định Vị Bản Ngã Cho Gen Z</span>
                    <span className="text-slate-300 dark:text-slate-500">•</span>
                    <span className="text-emerald-500 dark:text-emerald-400 font-semibold not-italic">Identity Compass</span>
                  </p>
                </div>
              </div>

              {/* Theme Toggle & Psychological Indicators & Reset */}
              <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-end">
                {/* Advanced Theme Selectors */}
                <div className="flex items-center bg-slate-500/10 backdrop-blur-md p-1 rounded-full border border-white/20 shadow-md gap-1">
                  <button
                    onClick={() => setTheme("light")}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer font-sans select-none ${
                      theme === "light"
                        ? "bg-white text-slate-700 shadow-sm font-bold"
                        : "text-slate-400 hover:text-slate-300"
                    }`}
                    title="Giao diện Sáng"
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Sáng</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark-indigo")}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer font-sans select-none ${
                      theme === "dark-indigo"
                        ? "bg-indigo-950/70 text-indigo-200 shadow-md font-bold border border-indigo-500/40"
                        : "text-indigo-300/80 hover:text-indigo-200"
                    }`}
                    title="Giao diện Chàm Dịu Mắt"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-[11px]">Tối Chàm</span>
                  </button>
                  <button
                    onClick={() => setTheme("dark-moss")}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer font-sans select-none ${
                      theme === "dark-moss"
                        ? "bg-emerald-950/70 text-emerald-200 shadow-md font-bold border border-emerald-500/40"
                        : "text-emerald-300/80 hover:text-emerald-200"
                    }`}
                    title="Giao diện Rêu Trầm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px]">Tối Rêu</span>
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
            <main className="py-2 relative">
              {/* Soft decorative blurred stars on left/right edges to float around the section headings and content */}
              <div className="absolute top-[-40px] left-[-30px] pointer-events-none z-0 select-none opacity-40 animate-float" style={{ animationDuration: "6s" }}>
                <CuteStar variant="blur" size={120} showSurroundings={false} />
              </div>
              <div className="absolute top-[160px] right-[-40px] pointer-events-none z-0 select-none opacity-30 animate-float" style={{ animationDuration: "8s", animationDelay: "1s" }}>
                <CuteStar variant="blur" size={90} showSurroundings={false} />
              </div>
              <div className="absolute bottom-[20px] left-[15%] pointer-events-none z-0 select-none opacity-25 animate-float" style={{ animationDuration: "7s", animationDelay: "2s" }}>
                <CuteStar variant="blur" size={80} showSurroundings={false} />
              </div>

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
              <p>© 2026 Trạm Định Vị Bản Ngã Cho Gen Z (Identity Compass) • Nghiên cứu hành vi học đường Việt Nam</p>
              <p>Phòng Nghiên cứu Tâm lí học Ứng dụng&Phát triển Hành vi Xứ Lạng</p>
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
