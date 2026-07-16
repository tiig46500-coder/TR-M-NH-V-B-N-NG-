import React, { useState, useEffect } from "react";
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
  }
];

export default function Gamification() {
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [totalXp, setTotalXp] = useState(120); // Base starting XP
  const [taskHistory, setTaskHistory] = useState<Record<string, number>>({
    "task-detox": 1,
    "task-physical": 1,
    "task-connect": 1,
    "task-mental": 0,
    "task-breath": 2
  });
  const [dayCounter, setDayCounter] = useState(4); // Day 4 out of 21
  const [totalTasksDone, setTotalTasksDone] = useState(5);
  
  // Confetti / Alert effects
  const [unlockedBadge, setUnlockedBadge] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const storedXp = localStorage.getItem("remix_corez_xp");
    const storedHistory = localStorage.getItem("remix_corez_task_history");
    const storedDone = localStorage.getItem("remix_corez_tasks_done");
    const storedDay = localStorage.getItem("remix_corez_day_counter");
    const storedCompletedToday = localStorage.getItem("remix_corez_completed_today");

    if (storedXp) setTotalXp(parseInt(storedXp));
    if (storedHistory) setTaskHistory(JSON.parse(storedHistory));
    if (storedDone) setTotalTasksDone(parseInt(storedDone));
    if (storedDay) setDayCounter(parseInt(storedDay));
    if (storedCompletedToday) setCompletedTaskIds(JSON.parse(storedCompletedToday));
  }, []);

  // Sync to local storage on changes
  const saveGameState = (updatedXp: number, updatedHistory: Record<string, number>, updatedDone: number, updatedDay: number, updatedCompleted: string[]) => {
    setTotalXp(updatedXp);
    setTaskHistory(updatedHistory);
    setTotalTasksDone(updatedDone);
    setDayCounter(updatedDay);
    setCompletedTaskIds(updatedCompleted);

    localStorage.setItem("remix_corez_xp", updatedXp.toString());
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
    } else {
      // Check task
      updatedCompleted.push(task.id);
      updatedXp = totalXp + task.xpAward;
      updatedHistory[task.id] = (updatedHistory[task.id] || 0) + 1;
      updatedDone = totalTasksDone + 1;

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
            <div className="grid grid-cols-1 gap-2.5 flex-1 justify-center py-1">
              {BADGES.map((badge) => {
                const isUnlocked = isBadgeUnlocked(badge.id);
                // Calculate progress
                let progressText = "0/3";
                if (badge.id === "badge-detox") progressText = `${Math.min(3, taskHistory["task-detox"] || 0)}/3`;
                if (badge.id === "badge-physical") progressText = `${Math.min(3, taskHistory["task-physical"] || 0)}/3`;
                if (badge.id === "badge-connect") progressText = `${Math.min(3, taskHistory["task-connect"] || 0)}/3`;
                if (badge.id === "badge-conqueror") progressText = `${Math.min(12, totalTasksDone)}/12`;

                return (
                  <div
                    key={badge.id}
                    className={`p-2.5 rounded-xl border flex items-center gap-3 relative overflow-hidden transition-all ${
                      isUnlocked 
                        ? `${badge.bgLight} ${badge.borderColor} shadow-sm` 
                        : "bg-white/20 border-slate-100 opacity-60"
                    }`}
                  >
                    {/* Badge Emoji container */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
                      isUnlocked ? badge.color : "bg-slate-100 text-slate-300 border border-slate-200"
                    }`}>
                      {isUnlocked ? badge.emoji : <Lock className="w-4 h-4 text-slate-300" />}
                    </div>

                    {/* Badge details */}
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
