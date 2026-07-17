import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Award, 
  Flame, 
  CheckCircle, 
  Check, 
  TrendingUp, 
  Sparkles, 
  RotateCcw, 
  Lock, 
  Unlock, 
  Heart, 
  Wind, 
  Compass,
  Trophy,
  Coffee,
  Info
} from "lucide-react";
import { useUserData } from "../context/UserContext";

interface DailyChallengeTask {
  id: string;
  title: string;
  desc: string;
  xpAward: number;
  category: "detox" | "physical" | "mental" | "connect" | "breath";
  emoji: string;
}

const DAILY_TASKS: DailyChallengeTask[] = [
  {
    id: "task-detox",
    title: "Ngắt kết nối mạng xã hội 1 giờ",
    desc: "Cất hoàn toàn điện thoại vào tủ hoặc balo để tận hưởng 1 giờ tĩnh lặng tuyệt đối.",
    xpAward: 25,
    category: "detox",
    emoji: "📴"
  },
  {
    id: "task-physical",
    title: "Chạy bộ hoặc đi bộ ngoài trời 15 phút",
    desc: "Vận động ngoài trời tại công viên hoặc ngõ nhỏ để giải phóng bớt cortisol căng thẳng.",
    xpAward: 20,
    category: "physical",
    emoji: "🏃"
  },
  {
    id: "task-mental",
    title: "Đọc 5 trang sách hoặc nghe podcast",
    desc: "Đọc sách kỹ năng hay nghe podcast chữa lành, hạn chế tiếp nhận tin giật gân bạo lực mạng.",
    xpAward: 20,
    category: "mental",
    emoji: "📖"
  },
  {
    id: "task-connect",
    title: "Trò chuyện trực tiếp cùng 1 người bạn",
    desc: "Tâm sự trực tiếp, hỏi han chân thành thay vì chỉ thả icon tim hời hợt trên story.",
    xpAward: 25,
    category: "connect",
    emoji: "🗣️"
  },
  {
    id: "task-breath",
    title: "Tập thở Hộp 4D trọn vẹn 1 phút",
    desc: "Thực hành bài tập thở sâu Box Breathing giúp tim mạch ổn định, tăng cường sức bền trí não.",
    xpAward: 15,
    category: "breath",
    emoji: "🧘"
  }
];

interface BadgeConfig {
  id: string;
  title: string;
  desc: string;
  requirement: string;
  emoji: string;
  color: string;
  borderColor: string;
  bgLight: string;
}

const BADGES: BadgeConfig[] = [
  {
    id: "badge-detox",
    title: "Dũng Sĩ Thải Độc Số",
    desc: "Đã vượt qua cám dỗ ảo, ngắt kết nối thành công để quay về thế giới thực tại.",
    requirement: "Hoàn thành nhiệm vụ ngắt kết nối mạng xã hội 3 lần.",
    emoji: "🌱",
    color: "text-emerald-600 bg-emerald-100",
    borderColor: "border-emerald-200",
    bgLight: "bg-emerald-50/50"
  },
  {
    id: "badge-physical",
    title: "Chiến Binh Thực Tại",
    desc: "Rèn luyện thể lực kiên trì, thoát khỏi sức ì của màn hình phẳng.",
    requirement: "Hoàn thành thử thách vận động thể chất 3 lần.",
    emoji: "🏃",
    color: "text-amber-600 bg-amber-100",
    borderColor: "border-amber-200",
    bgLight: "bg-amber-50/50"
  },
  {
    id: "badge-connect",
    title: "Trái Tim Thấu Cảm",
    desc: "Xây dựng các mối quan hệ thực tâm thấu hiểu sâu sắc, sẻ chia không phán xét.",
    requirement: "Gửi phản hồi an ủi confession hoặc trò chuyện trực tiếp 3 lần.",
    emoji: "🧡",
    color: "text-rose-600 bg-rose-100",
    borderColor: "border-rose-200",
    bgLight: "bg-rose-50/50"
  },
  {
    id: "badge-conqueror",
    title: "Đại Sứ Bản Ngã",
    desc: "Vững vàng kỷ luật thép, kiến tạo thói quen tốt để làm chủ cuộc sống thực tế.",
    requirement: "Đạt tổng cộng 12 nhiệm vụ đã hoàn thành.",
    emoji: "🏆",
    color: "text-blue-600 bg-blue-100",
    borderColor: "border-blue-200",
    bgLight: "bg-blue-50/50"
  },
  {
    id: "badge-digital-minimalist",
    title: "Digital Minimalist",
    desc: "Làm chủ không gian số, thiết lập thành công lối sống công nghệ tối giản lành mạnh.",
    requirement: "Duy trì chuỗi hoàn thành ít nhất 5/6 thói quen thanh lọc D3 liên tiếp trong 3 ngày.",
    emoji: "🕶️",
    color: "text-purple-600 bg-purple-100",
    borderColor: "border-purple-200",
    bgLight: "bg-purple-50/50"
  }
];

const CORE_ACHIEVEMENTS: BadgeConfig[] = [
  {
    id: "ach-detox-100",
    title: "Thải Độc Bền Bỉ",
    desc: "Đã rèn luyện khả năng hiện diện tuyệt đối trong cuộc sống thực tại ngoài màn hình phẳng.",
    requirement: "Tích lũy đạt 100 phút Thải độc số tại Không gian 4D.",
    emoji: "🔋",
    color: "text-indigo-600 bg-indigo-100",
    borderColor: "border-indigo-200",
    bgLight: "bg-indigo-50/50"
  },
  {
    id: "ach-empathy-10",
    title: "Người Thấu Cảm",
    desc: "Lắng nghe sâu sắc những chuyển biến tinh tế trong xúc cảm nội tâm của bản thân.",
    requirement: "Ghi nhận đủ 10 nhật ký cảm xúc hàng ngày.",
    emoji: "🧡",
    color: "text-rose-600 bg-rose-100",
    borderColor: "border-rose-200",
    bgLight: "bg-rose-50/50"
  },
  {
    id: "ach-reflection-5",
    title: "Học Giả Phản Tư",
    desc: "Dành thời gian chất lượng để đối thoại chân thành với chính mình qua ngòi bút.",
    requirement: "Hoàn thành đủ 5 dòng nhật ký Phản tư hàng ngày.",
    emoji: "📖",
    color: "text-emerald-600 bg-emerald-100",
    borderColor: "border-emerald-200",
    bgLight: "bg-emerald-50/50"
  },
  {
    id: "ach-gardener-3",
    title: "Người Gieo Mầm Xanh",
    desc: "Chăm sóc bền bỉ giúp cành thảo mộc bản địa Lạng Sơn sinh trưởng xum xuê.",
    requirement: "Cây bản địa đạt cấp độ sinh trưởng Cấp 3 trở lên.",
    emoji: "🌸",
    color: "text-pink-600 bg-pink-100",
    borderColor: "border-pink-200",
    bgLight: "bg-pink-50/50"
  }
];

interface FireworksProps {
  isTriggered: boolean;
  onComplete?: () => void;
}

const Fireworks: React.FC<FireworksProps> = ({ isTriggered, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isTriggered) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;
    }> = [];

    // Set canvas dimensions to cover full viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    const createFireworks = (x: number, y: number) => {
      for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 3;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          size: Math.random() * 2.5 + 1.5,
          color: `hsl(${Math.random() * 360}, 100%, 60%)`
        });
      }
    };

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.vy += p.vy * 0.02 + 0.07; // Gravity
        p.alpha -= 0.012; // fade
        
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    // Launch initial central blast
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 3;
    createFireworks(centerX, centerY);

    // Delayed beautiful extra blasts
    const t1 = setTimeout(() => createFireworks(centerX - 180, centerY + 60), 250);
    const t2 = setTimeout(() => createFireworks(centerX + 180, centerY + 60), 500);
    const t3 = setTimeout(() => createFireworks(centerX, centerY - 80), 750);

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isTriggered, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ display: isTriggered ? "block" : "none" }}
    />
  );
};

export default function Gamification() {
  const { userData, addXP, setXP } = useUserData();
  const totalXp = userData.karmaXP;

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [taskHistory, setTaskHistory] = useState<Record<string, number>>({
    "task-detox": 0,
    "task-physical": 0,
    "task-connect": 0,
    "task-mental": 0,
    "task-breath": 0
  });
  const [dayCounter, setDayCounter] = useState(1); // Day 1 out of 21
  const [totalTasksDone, setTotalTasksDone] = useState(0);
  
  // Confetti / Alert effects
  const [unlockedBadge, setUnlockedBadge] = useState<string | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);

  // Load from local storage
  useEffect(() => {
    const storedHistory = localStorage.getItem("remix_corez_task_history");
    const storedDone = localStorage.getItem("remix_corez_tasks_done");
    const storedDay = localStorage.getItem("remix_corez_day_counter");
    const storedCompletedToday = localStorage.getItem("remix_corez_completed_today");

    if (storedHistory) setTaskHistory(JSON.parse(storedHistory));
    if (storedDone) setTotalTasksDone(parseInt(storedDone));
    if (storedDay) setDayCounter(parseInt(storedDay));
    if (storedCompletedToday) setCompletedTaskIds(JSON.parse(storedCompletedToday));
  }, []);

  // Watch for newly unlocked core achievements
  useEffect(() => {
    const achs = [
      { id: "ach-detox-100", title: "Thải Độc Bền Bỉ" },
      { id: "ach-empathy-10", title: "Người Thấu Cảm" },
      { id: "ach-reflection-5", title: "Học Giả Phản Tư" },
      { id: "ach-gardener-3", title: "Người Gieo Mầm Xanh" }
    ];

    for (const ach of achs) {
      const isUnlocked = isAchUnlocked(ach.id);
      const isAlreadyNotified = localStorage.getItem(`remix_corez_notified_${ach.id}`);
      
      if (isUnlocked && !isAlreadyNotified) {
        setUnlockedBadge(ach.title);
        localStorage.setItem(`remix_corez_notified_${ach.id}`, "true");
        addXP(50); // Extra reward for major core achievement!
        break;
      }
    }
  }, [userData.detoxMinutes, userData.moodLogs, userData.reflections, userData.plantStage]);

  // Core achievements check helpers
  const isAchUnlocked = (id: string) => {
    if (id === "ach-detox-100") return (userData.detoxMinutes || 0) >= 100;
    if (id === "ach-empathy-10") return (userData.moodLogs || []).length >= 10;
    if (id === "ach-reflection-5") return (userData.reflections || []).length >= 5;
    if (id === "ach-gardener-3") return (userData.plantStage || 0) >= 3;
    return false;
  };

  const getAchProgressText = (id: string) => {
    if (id === "ach-detox-100") return `${Math.min(100, userData.detoxMinutes || 0)}/100p`;
    if (id === "ach-empathy-10") return `${Math.min(10, (userData.moodLogs || []).length)}/10`;
    if (id === "ach-reflection-5") return `${Math.min(5, (userData.reflections || []).length)}/5`;
    if (id === "ach-gardener-3") return `Cấp ${userData.plantStage || 1}/3`;
    return "0/1";
  };

  // Sync to local storage on changes
  const saveGameState = (updatedXp: number, updatedHistory: Record<string, number>, updatedDone: number, updatedDay: number, updatedCompleted: string[]) => {
    setXP(updatedXp);
    setTaskHistory(updatedHistory);
    setTotalTasksDone(updatedDone);
    setDayCounter(updatedDay);
    setCompletedTaskIds(updatedCompleted);

    localStorage.setItem("remix_corez_task_history", JSON.stringify(updatedHistory));
    localStorage.setItem("remix_corez_tasks_done", updatedDone.toString());
    localStorage.setItem("remix_corez_day_counter", updatedDay.toString());
    localStorage.setItem("remix_corez_completed_today", JSON.stringify(updatedCompleted));
  };

  const handleToggleTask = (task: DailyChallengeTask) => {
    const isCompleted = completedTaskIds.includes(task.id);
    let updatedCompleted = [...completedTaskIds];
    let updatedXp = totalXp;
    let updatedHistory = { ...taskHistory };
    let updatedDone = totalTasksDone;

    if (isCompleted) {
      // Uncheck task
      updatedCompleted = updatedCompleted.filter(id => id !== task.id);
      updatedXp = Math.max(0, totalXp - task.xpAward);
      updatedHistory[task.id] = Math.max(0, (updatedHistory[task.id] || 1) - 1);
      updatedDone = Math.max(0, totalTasksDone - 1);

      // Sync streak dates
      try {
        const todayStr = new Date().toLocaleDateString("en-CA");
        const stored = localStorage.getItem("remix_corez_d3_dates");
        if (stored) {
          let savedDates: string[] = JSON.parse(stored);
          if (savedDates.includes(todayStr)) {
            savedDates = savedDates.filter(d => d !== todayStr);
            localStorage.setItem("remix_corez_d3_dates", JSON.stringify(savedDates));
          }
        }
      } catch (e) {
        console.error("Error syncing streak dates:", e);
      }
    } else {
      // Check task
      updatedCompleted.push(task.id);
      updatedXp = totalXp + task.xpAward;
      updatedHistory[task.id] = (updatedHistory[task.id] || 0) + 1;
      updatedDone = totalTasksDone + 1;

      // Trigger fireworks when completing the 5th D3 habit of the day
      if (updatedCompleted.length === 5) {
        setShowFireworks(true);
        // Sync to remix_corez_d3_dates to trigger/advance streak
        try {
          const todayStr = new Date().toLocaleDateString("en-CA");
          let savedDates: string[] = [];
          const stored = localStorage.getItem("remix_corez_d3_dates");
          if (stored) {
            savedDates = JSON.parse(stored);
          }
          if (!savedDates.includes(todayStr)) {
            savedDates.push(todayStr);
            localStorage.setItem("remix_corez_d3_dates", JSON.stringify(savedDates));
          }
        } catch (e) {
          console.error("Error saving completed D3 date:", e);
        }
      }

      // Check for badge unlocks!
      checkBadgeUnlocks(task.id, updatedHistory, updatedDone);
    }

    saveGameState(updatedXp, updatedHistory, updatedDone, dayCounter, updatedCompleted);
  };

  const checkBadgeUnlocks = (taskId: string, history: Record<string, number>, totalDone: number) => {
    // 1. Detox badge
    if (taskId === "task-detox" && history["task-detox"] === 3) {
      triggerBadgeAlert("badge-detox");
    }
    // 2. Physical badge
    if (taskId === "task-physical" && history["task-physical"] === 3) {
      triggerBadgeAlert("badge-physical");
    }
    // 3. Connect badge
    if (taskId === "task-connect" && history["task-connect"] === 3) {
      triggerBadgeAlert("badge-connect");
    }
    // 4. Conqueror badge
    if (totalDone === 12) {
      triggerBadgeAlert("badge-conqueror");
    }
  };

  const triggerBadgeAlert = (badgeId: string) => {
    const badge = BADGES.find(b => b.id === badgeId);
    if (badge) {
      setUnlockedBadge(badge.title);
      // Play sound or save custom alert
    }
  };

  const handleNextDay = () => {
    if (dayCounter >= 21) {
      if (window.confirm("Chúc mừng cậu đã hoàn thành trọn vẹn 21 ngày rèn kỷ luật! Cậu có muốn thiết lập lại hành trình mới không?")) {
        // Reset game
        saveGameState(100, {
          "task-detox": 0,
          "task-physical": 0,
          "task-connect": 0,
          "task-mental": 0,
          "task-breath": 0
        }, 0, 1, []);
      }
      return;
    }

    // Advance to next day, clear daily checked list but keep totals
    saveGameState(totalXp + 50, taskHistory, totalTasksDone, dayCounter + 1, []);
    alert("Tuyệt vời! Cậu vừa bước sang ngày mới trên hành trình 21 ngày kỷ luật. Nhận ngay 50 XP thưởng động lực! 🌟");
  };

  const handleResetProgress = () => {
    if (window.confirm("Cậu chắc chắn muốn xóa lịch sử rèn kỷ luật để bắt đầu lại từ đầu chứ?")) {
      saveGameState(120, {
        "task-detox": 1,
        "task-physical": 1,
        "task-connect": 1,
        "task-mental": 0,
        "task-breath": 2
      }, 5, 4, []);
    }
  };

  // Streak calculator helper for D3 actions
  const calculateD3Streak = (): number => {
    let savedDates: string[] = [];
    try {
      const stored = localStorage.getItem("remix_corez_d3_dates");
      if (stored) {
        savedDates = JSON.parse(stored);
      }
    } catch (e) {
      return 0;
    }

    if (!Array.isArray(savedDates) || savedDates.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    let currentCheck = new Date();

    const todayStr = today.toLocaleDateString("en-CA");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-CA");

    // If neither today nor yesterday is completed, streak is 0
    if (!savedDates.includes(todayStr) && !savedDates.includes(yesterdayStr)) {
      return 0;
    }

    // Start with the latest completed day (either today or yesterday)
    if (savedDates.includes(todayStr)) {
      currentCheck = today;
    } else {
      currentCheck = yesterday;
    }

    // Guard against infinite loop in case of date errors
    let maxTries = 1000;
    while (maxTries > 0) {
      const checkStr = currentCheck.toLocaleDateString("en-CA");
      if (savedDates.includes(checkStr)) {
        streak++;
        // Go back 1 day
        currentCheck.setDate(currentCheck.getDate() - 1);
        maxTries--;
      } else {
        break;
      }
    }

    return streak;
  };

  const d3Streak = calculateD3Streak();

  // Calculate Level and XP progres
  // Level formula: level = Math.floor(totalXp / 100) + 1
  const currentLevel = Math.floor(totalXp / 100) + 1;
  const xpInCurrentLevel = totalXp % 100;
  const xpNeededForNext = 100;
  const progressPercent = Math.round((xpInCurrentLevel / xpNeededForNext) * 100);

  // Check if badge is unlocked
  const isBadgeUnlocked = (badgeId: string) => {
    if (badgeId === "badge-detox") return (taskHistory["task-detox"] || 0) >= 3;
    if (badgeId === "badge-physical") return (taskHistory["task-physical"] || 0) >= 3;
    if (badgeId === "badge-connect") return (taskHistory["task-connect"] || 0) >= 3;
    if (badgeId === "badge-conqueror") return totalTasksDone >= 12;
    if (badgeId === "badge-digital-minimalist") {
      return calculateD3Streak() >= 3;
    }
    return false;
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 px-4 font-sans relative z-10" id="gamification-module">
      
      {/* Badge Unlock Popup Overlay */}
      <AnimatePresence>
        {unlockedBadge && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 text-center border-2 border-amber-300 max-w-xs shadow-2xl relative overflow-hidden"
            >
              {/* Decorative radial blast */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/30 to-yellow-200/10 pointer-events-none z-0" />
              
              <div className="relative z-10 space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl shadow border-4 border-white animate-bounce">
                  🏆
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono uppercase font-bold text-amber-500 tracking-wider">Huy hiệu mới đã mở!</h4>
                  <h3 className="font-serif text-lg font-bold text-slate-800">{unlockedBadge}</h3>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed font-light">
                    Kỷ luật sắt và nỗ lực đời thực của cậu đã được ghi nhận. Cậu đang lan tỏa sức mạnh tinh thần tuyệt vời!
                  </p>
                </div>
                <button
                  onClick={() => setUnlockedBadge(null)}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer hover:from-amber-600 transition-colors"
                >
                  Nhận Huy Hiệu Đầy Tự Hào
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Top Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* COLUMN 1: INTERACTIVE CHECKLIST (7 COLS) */}
        <div className="md:col-span-7 bg-white/65 backdrop-blur-xl rounded-[32px] border border-white/40 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-6">
          
          <div className="space-y-1.5 border-b border-white/40 pb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                21 Ngày Rèn Kỷ Luật CoreZ
              </span>
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1 font-mono">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500/10 animate-pulse" />
                Ngày {dayCounter} / 21
              </span>
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Nhiệm Vụ Rèn Luyện Hôm Nay
            </h3>
            <p className="text-[11px] text-slate-400 font-light">
              Hoàn thành các hành động mộc mạc đời thực dưới đây để sạc pin bản ngã, nhận thêm điểm kinh nghiệm (XP) tăng cấp và rinh huy hiệu quý giá.
            </p>
          </div>

          {/* Checklist list */}
          <div className="space-y-3 flex-1 py-1">
            {DAILY_TASKS.map((task) => {
              const isChecked = completedTaskIds.includes(task.id);
              return (
                <div 
                  key={task.id}
                  onClick={() => handleToggleTask(task)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer select-none group ${
                    isChecked 
                      ? "bg-emerald-50/50 border-emerald-300 text-slate-800 shadow-sm" 
                      : "bg-white/40 border-white/30 hover:bg-white/65 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  {/* Large Check indicator circle */}
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all mt-0.5 shrink-0 ${
                    isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white group-hover:border-slate-400"
                  }`}>
                    {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5 justify-between">
                      <h4 className={`text-[12.5px] font-bold ${isChecked ? "line-through text-slate-400" : ""}`}>
                        {task.emoji} {task.title}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 shrink-0">
                        +{task.xpAward} XP
                      </span>
                    </div>
                    <p className={`text-[10.5px] leading-relaxed font-light ${isChecked ? "text-slate-400" : "text-slate-500"}`}>
                      {task.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="border-t border-white/40 pt-4 flex items-center justify-between gap-4">
            <button
              onClick={handleResetProgress}
              className="text-[10.5px] text-slate-400 hover:text-rose-500 font-medium transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Bắt đầu lại chuỗi 21 ngày
            </button>

            <button
              onClick={handleNextDay}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1"
            >
              Bước Sang Ngày Tiếp Theo ➔
            </button>
          </div>

        </div>

        {/* COLUMN 2: AVATAR & LEVEL STATS & BADGES (5 COLS) */}
        <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* XP & LEVELING HUB */}
          <div className="bg-white/65 backdrop-blur-xl rounded-[28px] border border-white/40 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3.5 border-b border-white/30 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-white font-serif font-black flex items-center justify-center text-xl shadow border-2 border-white animate-float">
                C
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Định vị của cậu</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-base font-black text-slate-800">Chiến Binh Thực Tại</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Cấp {currentLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Circular Circular/Linear progress representing Level XP */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Tiến trình cấp độ</span>
                <span>{xpInCurrentLevel} / {xpNeededForNext} XP</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/20 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Total tasks and streak counting */}
            <div className="grid grid-cols-2 gap-3.5 pt-1.5">
              <div className="bg-white/40 border border-white/30 rounded-xl p-2.5 text-center shadow-inner">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Đã xong</span>
                <span className="text-xl font-black text-slate-700">{totalTasksDone} Thói quen</span>
              </div>
              <div className="bg-white/40 border border-white/30 rounded-xl p-2.5 text-center shadow-inner">
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Điểm rèn luyện</span>
                <span className="text-xl font-black text-emerald-600">{totalXp} XP 💎</span>
              </div>
            </div>
          </div>

          {/* D3 Digital Minimalist Streak Panel with Daily Goal Progress Ring */}
          <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-[24px] p-4.5 space-y-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              
              {/* Left Column: Streak details (7/12 cols) */}
              <div className="sm:col-span-7 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-lg shadow-sm border border-purple-200/30 shrink-0">
                    <span className="text-xl animate-bounce">🔥</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 font-sans tracking-wide">Chuỗi Thanh Lọc Số (D3)</h5>
                    <p className="text-[10px] text-slate-400 dark:text-slate-400 leading-tight font-light mt-0.5">Hoàn thành ít nhất 5/6 thói quen hàng ngày</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5 pl-1">
                  <span className="text-2xl font-black text-purple-700 dark:text-purple-400 font-mono">
                    {d3Streak}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">ngày liên tiếp</span>
                </div>

                {/* Progress bar towards Digital Minimalist badge */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>Huy hiệu "Digital Minimalist"</span>
                    <span>{d3Streak} / 3 ngày</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100/60 dark:bg-slate-800/60 rounded-full overflow-hidden p-0.5 border border-purple-500/10 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.round((d3Streak / 3) * 100))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Vertical divider for larger screens */}
              <div className="hidden sm:block sm:col-span-1 h-12 w-[1px] bg-purple-500/20 mx-auto" />

              {/* Right Column: Daily Goal Circular Progress Ring (4/12 cols) */}
              <div className="sm:col-span-4 flex items-center gap-3 bg-white/20 dark:bg-white/5 p-2.5 rounded-xl border border-purple-500/10">
                {/* SVG Progress Ring */}
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      className="stroke-purple-100 dark:stroke-purple-950/40"
                      strokeWidth="3.5"
                      fill="transparent"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      className="stroke-purple-600 transition-all duration-500"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 20}
                      strokeDashoffset={2 * Math.PI * 20 - (completedTaskIds.length / DAILY_TASKS.length) * (2 * Math.PI * 20)}
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Text inside Ring */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-black text-purple-700 dark:text-purple-300 font-mono leading-none">
                      {completedTaskIds.length}
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono leading-none mt-0.5">
                      /{DAILY_TASKS.length}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <h6 className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-none">Mục Tiêu Ngày</h6>
                  <p className="text-[9px] text-slate-400 dark:text-slate-400 leading-tight mt-1.5">
                    {completedTaskIds.length === DAILY_TASKS.length 
                      ? "Đã đạt 5/5! 🌟" 
                      : `Còn ${DAILY_TASKS.length - completedTaskIds.length} thói quen`}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* DIGITAL BADGES WALL */}
          <div className="bg-white/65 backdrop-blur-xl rounded-[28px] border border-white/40 p-5 shadow-sm space-y-3.5 flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-white/30 pb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-500" />
                Huy Chương Danh Dự (Badges)
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Huy hiệu đạt được</span>
            </div>

             {/* Badges list */}
             <div className="space-y-4 flex-1 overflow-y-auto pr-1 max-h-[350px]">
               {/* SECTION A: HUY HIỆU THỬ THÁCH */}
               <div className="space-y-2">
                 <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                   Thử thách 21 ngày
                 </h5>
                 <div className="grid grid-cols-1 gap-2">
                   {BADGES.map((badge) => {
                     const isUnlocked = isBadgeUnlocked(badge.id);
                     let progressText = "0/3";
                     if (badge.id === "badge-detox") progressText = `${Math.min(3, taskHistory["task-detox"] || 0)}/3`;
                     if (badge.id === "badge-physical") progressText = `${Math.min(3, taskHistory["task-physical"] || 0)}/3`;
                     if (badge.id === "badge-connect") progressText = `${Math.min(3, taskHistory["task-connect"] || 0)}/3`;
                     if (badge.id === "badge-conqueror") progressText = `${Math.min(12, totalTasksDone)}/12`;
                     if (badge.id === "badge-digital-minimalist") progressText = `${Math.min(3, d3Streak)}/3`;

                     return (
                       <div
                         key={badge.id}
                         className={`p-2.5 rounded-xl border flex items-center gap-3 relative overflow-hidden transition-all ${
                           isUnlocked 
                             ? `${badge.bgLight} ${badge.borderColor} shadow-sm` 
                             : "bg-white/20 border-slate-100 opacity-60"
                         }`}
                       >
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
                           isUnlocked ? badge.color : "bg-slate-100 text-slate-300 border border-slate-200"
                         }`}>
                           {isUnlocked ? badge.emoji : <Lock className="w-4 h-4 text-slate-300" />}
                         </div>

                         <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-center gap-1.5">
                             <h5 className="text-[11.5px] font-bold text-slate-800 truncate">
                               {badge.title}
                             </h5>
                             <span className="text-[9px] font-mono text-slate-400 shrink-0 bg-white px-1.5 py-0.5 rounded border border-slate-100">
                               {progressText}
                             </span>
                           </div>
                           <p className="text-[9.5px] text-slate-500 truncate leading-none mt-0.5 font-light">
                             {badge.desc}
                           </p>
                           <p className="text-[8.5px] text-slate-400 font-light italic leading-none mt-1">
                             YC: {badge.requirement}
                           </p>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>

               {/* SECTION B: THÀNH TỰU BẢN NGÃ */}
               <div className="space-y-2 pt-2 border-t border-slate-150/40">
                 <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1">
                   <Sparkles className="w-3 h-3 text-emerald-500" />
                   Thành tựu Cốt lõi
                 </h5>
                 <div className="grid grid-cols-1 gap-2">
                   {CORE_ACHIEVEMENTS.map((ach) => {
                     const isUnlocked = isAchUnlocked(ach.id);
                     const progressText = getAchProgressText(ach.id);

                     return (
                       <div
                         key={ach.id}
                         className={`p-2.5 rounded-xl border flex items-center gap-3 relative overflow-hidden transition-all ${
                           isUnlocked 
                             ? `${ach.bgLight} ${ach.borderColor} shadow-sm` 
                             : "bg-white/20 border-slate-100 opacity-60"
                         }`}
                       >
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
                           isUnlocked ? ach.color : "bg-slate-100 text-slate-300 border border-slate-200"
                         }`}>
                           {isUnlocked ? ach.emoji : <Lock className="w-4 h-4 text-slate-300" />}
                         </div>

                         <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-center gap-1.5">
                             <h5 className="text-[11.5px] font-bold text-slate-800 truncate">
                               {ach.title}
                             </h5>
                             <span className="text-[9px] font-mono text-slate-400 shrink-0 bg-white px-1.5 py-0.5 rounded border border-slate-100">
                               {progressText}
                             </span>
                           </div>
                           <p className="text-[9.5px] text-slate-500 truncate leading-none mt-0.5 font-light">
                             {ach.desc}
                           </p>
                           <p className="text-[8.5px] text-slate-400 font-light italic leading-none mt-1">
                             YC: {ach.requirement}
                           </p>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             </div>

            {/* Quick footer alert */}
            <div className="pt-2 text-center text-[9px] text-slate-400 font-light border-t border-slate-150/40">
              *Huy hiệu rèn luyện giúp khẳng định bản lĩnh thực tại và thói quen tích cực.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
