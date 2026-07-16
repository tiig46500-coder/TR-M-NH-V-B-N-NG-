import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  Smile, 
  Sparkles, 
  Check, 
  Flame, 
  TrendingUp, 
  Trash2, 
  Heart, 
  Coffee, 
  ChevronRight, 
  BookOpen, 
  Info,
  CalendarDays,
  Compass
} from "lucide-react";
import { MoodLogEntry } from "../types";
import BreathExercisePopup from "./BreathExercisePopup";

// Seed data to make the UI beautiful and fully illustrated on first load
const SEED_LOGS: MoodLogEntry[] = [
  {
    id: "seed-1",
    date: "2026-07-11",
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    moodId: "tired",
    activities: ["sleep", "detox"],
    note: "Hôm nay áp lực học tập dồn dập khiến mình hơi mỏi mệt. Đã tắt bớt thông báo mạng xã hội lúc tối muộn và đi ngủ sớm hơn thường ngày để sạc lại năng lượng.",
    energyLevel: 2
  },
  {
    id: "seed-2",
    date: "2026-07-12",
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    moodId: "unsteady",
    activities: ["connect", "read"],
    note: "Vừa lướt Facebook thấy các bạn đăng ảnh nhận học bổng xịn quá, cảm giác FOMO lại trỗi dậy. May mắn là đã chủ động gọi điện rủ đứa bạn thân đi uống nước mía, trò chuyện thực tế giúp lòng dịu đi rất nhiều.",
    energyLevel: 3
  },
  {
    id: "seed-3",
    date: "2026-07-13",
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    moodId: "calm",
    activities: ["meditate", "nature"],
    note: "Thực hành bài hít thở sâu 4D buổi sáng rồi đi dạo quanh công viên hồ Kỳ Lừa. Tiết trời mát lành làm đầu óc thông thoáng, bớt đi sự hối hả thường ngày.",
    energyLevel: 4
  },
  {
    id: "seed-4",
    date: "2026-07-14",
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    moodId: "happy",
    activities: ["creative", "exercise", "detox"],
    note: "Một ngày trọn vẹn quay về với bản ngã! Chạy bộ 3km quanh phố phường, sau đó vẽ phác thảo một vài bức tranh nhỏ mộc mạc. Không hề đụng vào TikTok cả ngày, thấy tâm trí thật thảnh thơi và tập trung.",
    energyLevel: 5
  }
];

interface MoodConfig {
  emoji: string;
  label: string;
  color: string;
  bgLight: string;
  text: string;
  border: string;
  gradient: string;
  desc: string;
}

const MOODS: Record<string, MoodConfig> = {
  happy: { 
    emoji: "🌟", 
    label: "Tươi vui", 
    color: "bg-amber-100", 
    bgLight: "bg-amber-50/70", 
    text: "text-amber-700", 
    border: "border-amber-200",
    gradient: "from-amber-400 to-yellow-500",
    desc: "Yêu đời, tràn đầy năng lượng tích cực" 
  },
  calm: { 
    emoji: "🍃", 
    label: "Bình yên", 
    color: "bg-emerald-100", 
    bgLight: "bg-emerald-50/70", 
    text: "text-emerald-700", 
    border: "border-emerald-200",
    gradient: "from-emerald-400 to-teal-500",
    desc: "Thư thái, dễ chịu và kết nối sâu sắc" 
  },
  unsteady: { 
    emoji: "🍂", 
    label: "Chông chênh", 
    color: "bg-amber-100/60", 
    bgLight: "bg-amber-50/30", 
    text: "text-amber-800", 
    border: "border-amber-200/55",
    gradient: "from-orange-300 to-amber-500",
    desc: "Hơi bất an, lo sợ bị bỏ lỡ (FOMO)" 
  },
  tired: { 
    emoji: "😴", 
    label: "Uể oải", 
    color: "bg-violet-100", 
    bgLight: "bg-violet-50/70", 
    text: "text-violet-700", 
    border: "border-violet-200",
    gradient: "from-violet-400 to-indigo-500",
    desc: "Thiếu ngủ, mệt mỏi hoặc cạn pin tinh thần" 
  },
  anxious: { 
    emoji: "🚨", 
    label: "Lo âu", 
    color: "bg-rose-100", 
    bgLight: "bg-rose-50/70", 
    text: "text-rose-700", 
    border: "border-rose-200",
    gradient: "from-rose-400 to-red-500",
    desc: "Áp lực đồng lứa (peer pressure), căng thẳng" 
  },
  sad: { 
    emoji: "🌧️", 
    label: "Buồn bã", 
    color: "bg-slate-150", 
    bgLight: "bg-slate-100/75", 
    text: "text-slate-700", 
    border: "border-slate-200",
    gradient: "from-slate-400 to-slate-500",
    desc: "Cần một khoảng lặng để cân bằng nội tâm" 
  }
};

interface ActivityConfig {
  emoji: string;
  label: string;
  desc: string;
}

const ACTIVITIES: Record<string, ActivityConfig> = {
  detox: { emoji: "📴", label: "Detox mạng xã hội", desc: "Tắt thông báo, tạm xa cõi mạng" },
  nature: { emoji: "🌳", label: "Hòa mình thiên nhiên", desc: "Đi dạo ngoài trời, hít thở tự nhiên" },
  connect: { emoji: "🗣️", label: "Trò chuyện tri kỷ", desc: "Gặp gỡ trực tiếp, tâm sự chân thật" },
  creative: { emoji: "🎨", label: "Sáng tạo nghệ thuật", desc: "Viết lách, vẽ tranh, thủ công mộc mạc" },
  read: { emoji: "📖", label: "Sách & Podcast", desc: "Đọc sách hay nghe nội dung chữa lành" },
  exercise: { emoji: "🏃", label: "Vận động cơ thể", desc: "Thể dục, thể thao xả bớt cortisol" },
  meditate: { emoji: "🧘", label: "Thiền & Tập thở", desc: "Hít thở sâu 4D điều hòa nhịp tim" },
  sleep: { emoji: "💤", label: "Chăm sóc giấc ngủ", desc: "Ngủ sớm, thư thái đầu óc" }
};

export default function MoodLogger() {
  const [logs, setLogs] = useState<MoodLogEntry[]>([]);
  const [isBreathOpen, setIsBreathOpen] = useState(false);
  const [breathReason, setBreathReason] = useState("");
  
  // Logger Form State
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toLocaleDateString("en-CA") // Định dạng YYYY-MM-DD local
  );
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  
  // UI Helpers
  const [successMsg, setSuccessMsg] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hoveredLog, setHoveredLog] = useState<MoodLogEntry | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Load logs on mount
  useEffect(() => {
    const stored = localStorage.getItem("remix_corez_mood_logs");
    if (stored) {
      try {
        setLogs(JSON.parse(stored));
      } catch (e) {
        // Fallback to seed data if error parsing
        setLogs(SEED_LOGS);
      }
    } else {
      // Initialize with seed data if first time
      setLogs(SEED_LOGS);
      localStorage.setItem("remix_corez_mood_logs", JSON.stringify(SEED_LOGS));
    }
  }, []);

  // Sync state with form when selectedDate changes (to allow editing existing logs for that day)
  useEffect(() => {
    const existingLog = logs.find(l => l.date === selectedDate);
    if (existingLog) {
      setSelectedMood(existingLog.moodId);
      setSelectedActivities(existingLog.activities);
      setNote(existingLog.note);
      setEnergyLevel(existingLog.energyLevel);
    } else {
      // Reset form to default for new days
      setSelectedMood(null);
      setSelectedActivities([]);
      setNote("");
      setEnergyLevel(3);
    }
  }, [selectedDate, logs]);

  // Handle saving log
  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!selectedMood) {
      setValidationError("Vui lòng chọn một trạng thái tâm trạng đại diện cho hôm nay của cậu nhé!");
      return;
    }

    const updatedLogs = [...logs];
    const existingIndex = updatedLogs.findIndex(l => l.date === selectedDate);

    const logEntry: MoodLogEntry = {
      id: existingIndex >= 0 ? updatedLogs[existingIndex].id : `mood-${Date.now()}`,
      date: selectedDate,
      timestamp: existingIndex >= 0 ? updatedLogs[existingIndex].timestamp : new Date(selectedDate).getTime(),
      moodId: selectedMood,
      activities: selectedActivities,
      note: note.trim(),
      energyLevel: energyLevel
    };

    if (existingIndex >= 0) {
      updatedLogs[existingIndex] = logEntry;
    } else {
      updatedLogs.push(logEntry);
    }

    // Sắp xếp các mục nhật ký theo ngày giảm dần (mới nhất lên đầu)
    updatedLogs.sort((a, b) => b.date.localeCompare(a.date));

    setLogs(updatedLogs);
    localStorage.setItem("remix_corez_mood_logs", JSON.stringify(updatedLogs));
    
    // Trigger success animations
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);

      // Auto Breathing suggestive trigger!
      // Check if current logged mood is negative OR last 3 logs are negative (anxious, tired, sad)
      const negativeMoods = ["anxious", "sad", "tired"];
      if (selectedMood) {
        const currentMoodIsNegative = negativeMoods.includes(selectedMood);
        
        // Check if last 3 consecutive logs are negative
        let consecutiveNegativeCount = 0;
        for (let i = 0; i < Math.min(updatedLogs.length, 3); i++) {
          if (negativeMoods.includes(updatedLogs[i].moodId)) {
            consecutiveNegativeCount++;
          }
        }

        if (consecutiveNegativeCount >= 3) {
          setBreathReason("Dữ liệu cảm xúc 3 ngày gần đây của cậu hơi chông chênh và mệt mỏi. Hãy dành ra 1 phút quý giá cùng CoreZ hít thở sâu theo phương pháp hộp 4D để sạc lại pin tinh thần nhé! 🌱");
          setIsBreathOpen(true);
        } else if (currentMoodIsNegative) {
          setBreathReason("Hôm nay cậu cảm thấy hơi mỏi mệt hoặc áp lực. Hít thở sâu bằng phương pháp thở hộp 4D của CoreZ sẽ giúp xoa dịu thần kinh và mang lại sự bình yên tức thì.");
          setIsBreathOpen(true);
        }
      }
    }, 3000);
  };

  // Toggle activity selection
  const handleToggleActivity = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  // Delete a log entry
  const handleDeleteLog = (id: string) => {
    const updated = logs.filter(l => l.id !== id);
    setLogs(updated);
    localStorage.setItem("remix_corez_mood_logs", JSON.stringify(updated));
  };

  // Reset database back to seed data
  const handleResetData = () => {
    setLogs(SEED_LOGS);
    localStorage.setItem("remix_corez_mood_logs", JSON.stringify(SEED_LOGS));
    setSelectedDate(new Date().toLocaleDateString("en-CA"));
    setShowConfirmReset(false);
  };

  // Calculate Habits Streak
  const calculateStreak = (): number => {
    if (logs.length === 0) return 0;
    
    // Lấy danh sách các ngày đã ghi nhận duy nhất, sắp xếp giảm dần
    const uniqueDates = Array.from(new Set(logs.map(l => l.date))) as string[];
    uniqueDates.sort((a, b) => b.localeCompare(a));
    
    const todayStr = new Date().toLocaleDateString("en-CA");
    const yesterdayStr = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString("en-CA");
    
    // Nếu ngày ghi nhận gần nhất không phải là hôm nay hoặc hôm qua thì streak đã bị gián đoạn (trả về 0)
    const latestDate = uniqueDates[0];
    if (latestDate !== todayStr && latestDate !== yesterdayStr) {
      return 0;
    }

    let streak = 0;
    let expectedDate = new Date(latestDate);

    for (let i = 0; i < uniqueDates.length; i++) {
      const currentStr = uniqueDates[i];
      const expectedStr = expectedDate.toLocaleDateString("en-CA");

      if (currentStr === expectedStr) {
        streak++;
        // Giảm đi 1 ngày để kiểm tra ngày kế tiếp trong chuỗi
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break; // Chuỗi liên tiếp bị đứt quãng
      }
    }

    return streak;
  };

  // Get localized Day name
  const getFormattedDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const weekdays = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    const weekday = weekdays[date.getDay()];
    return `${weekday}, Ngày ${day} tháng ${month}`;
  };

  // Filter logs for the last 7 entries for chart rendering (sorted by date ascending)
  const sortedChronologicalLogs = [...logs]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  const streakCount = calculateStreak();

  // Helper to generate coordinates for SVG Line Chart based on 7 days of logs
  const generateSvgPathAndPoints = () => {
    if (sortedChronologicalLogs.length === 0) return { path: "", points: [] };
    
    const width = 500;
    const height = 120;
    const paddingX = 40;
    const paddingY = 20;
    
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;
    
    const pointCount = sortedChronologicalLogs.length;
    const stepX = pointCount > 1 ? chartWidth / (pointCount - 1) : chartWidth;
    
    const points = sortedChronologicalLogs.map((log, index) => {
      // energy level is 1-5, map to Y axis (5: top, 1: bottom)
      // Height coordinates are inverted in SVG (0 is top)
      const x = paddingX + index * stepX;
      const normalizedEnergy = (log.energyLevel - 1) / 4; // value from 0 to 1
      const y = paddingY + chartHeight * (1 - normalizedEnergy);
      return { x, y, log };
    });
    
    if (points.length === 0) return { path: "", areaPath: "", points: [] };
    
    // Create quadratic curve / straight lines path
    let linePath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      linePath += ` L ${points[i].x} ${points[i].y}`;
    }
    
    // Create filled gradient area path
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;
    
    return { linePath, areaPath, points };
  };

  const { linePath, areaPath, points: chartPoints } = generateSvgPathAndPoints();

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4 font-sans relative z-10" id="mood-logger-module">
      
      {/* Intro Header */}
      <div className="mb-8 text-center sm:text-left bg-white/40 backdrop-blur-md border border-white/50 rounded-[24px] p-5 shadow-sm relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-2">
            <Smile className="w-5.5 h-5.5 text-emerald-500 animate-pulse" />
            Nhật Ký Bản Ngã & Sức Bền Hành Vi
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 max-w-xl text-center sm:text-left">
            Theo dõi dòng chảy cảm xúc, chỉ số năng lượng thực tế và duy trì các hành động tự chữa lành lành mạnh để vượt qua áp lực đồng lứa và hội chứng FOMO của thế giới ảo.
          </p>
        </div>

        {/* Dynamic Interactive Streak Card */}
        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 mx-auto sm:mx-0">
          <button
            type="button"
            onClick={() => {
              setBreathReason("Cậu muốn dành ra 1 phút tĩnh lặng lúc này chứ? Hãy hít một hơi thật sâu cùng CoreZ nhé.");
              setIsBreathOpen(true);
            }}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <span>🧘 Luyện Thở Hộp 4D</span>
          </button>

          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/60 shadow-sm shrink-0">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-500">
              <Flame className={`w-5 h-5 ${streakCount > 0 ? "animate-bounce" : ""}`} />
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold font-mono leading-none">Chuỗi ghi nhật ký</p>
              <p className="text-xs font-bold text-slate-800 mt-1 leading-none">
                {streakCount > 0 ? `${streakCount} Ngày liên tiếp 🔥` : "Hãy bắt đầu ngay! 🌱"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* COLUMN 1: FORM INPUT LOGGER (7 COLS) */}
        <div className="lg:col-span-7 bg-white/65 backdrop-blur-xl rounded-[32px] border border-white/40 p-5 sm:p-6.5 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-white/40 pb-3">
            <h4 className="font-serif text-[17px] font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-emerald-500" />
              Ghi nhận hôm nay của cậu
            </h4>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toLocaleDateString("en-CA")}
                className="text-xs font-medium text-slate-600 bg-white/60 rounded-lg px-2.5 py-1 focus:outline-none border border-slate-200/50 cursor-pointer shadow-inner"
              />
            </div>
          </div>

          <form onSubmit={handleSaveLog} className="space-y-6">
            
            {/* 1. MOOD MATRIX */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                1. Hôm nay tâm trạng cậu chủ yếu là gì? <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-2.5">
                {Object.entries(MOODS).map(([id, config]) => {
                  const isSelected = selectedMood === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedMood(id)}
                      className={`group p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center relative cursor-pointer ${
                        isSelected 
                          ? `bg-white ${config.border} shadow-sm border-2` 
                          : "bg-white/30 hover:bg-white/60 border-white/40 hover:border-slate-300"
                      }`}
                    >
                      {/* Active Indicator Line */}
                      {isSelected && (
                        <div className={`absolute top-0 inset-x-4 h-1 rounded-b-full bg-gradient-to-r ${config.gradient}`} />
                      )}
                      
                      <span className={`text-2.5xl mb-1.5 transition-transform duration-300 ${isSelected ? "scale-115" : "group-hover:scale-110"}`}>
                        {config.emoji}
                      </span>
                      <span className={`text-xs font-bold ${isSelected ? config.text : "text-slate-500 group-hover:text-slate-800"}`}>
                        {config.label}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-0.5 leading-none hidden sm:inline-block font-light">
                        {config.desc.split(",")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. ENERGY LEVEL METER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Mức độ Năng lượng / Sức bền tinh thần:
                </label>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200/70 text-slate-700">
                  {energyLevel}/5
                </span>
              </div>
              <div className="bg-white/40 p-4 rounded-2xl border border-white/50 space-y-3 shadow-inner">
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span className={energyLevel === 1 ? "text-rose-500 font-bold" : ""}>🪫 Cạn kiệt (1)</span>
                  <span className={energyLevel === 3 ? "text-amber-500 font-bold" : ""}>🔋 Bình thường (3)</span>
                  <span className={energyLevel === 5 ? "text-emerald-500 font-bold" : ""}>⚡ Tràn đầy (5)</span>
                </div>
              </div>
            </div>

            {/* 3. HEALTHY ACTION CHECKBOXES */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                3. Hoạt động tích cực cậu đã thực hiện hôm nay:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.entries(ACTIVITIES).map(([id, config]) => {
                  const isChecked = selectedActivities.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleToggleActivity(id)}
                      className={`text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isChecked 
                          ? "bg-emerald-50 border-emerald-300 text-slate-800 shadow-sm" 
                          : "bg-white/30 border-white/40 hover:bg-white/55 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{config.emoji}</span>
                        <div>
                          <h5 className="text-[12px] font-bold leading-tight">{config.label}</h5>
                          <p className="text-[9px] text-slate-400 font-light leading-none mt-0.5">{config.desc}</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                        isChecked ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. DIARY REFLECTION TEXT */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                4. Góc tự chữa lành (Bầu bạn cùng tâm hồn):
              </label>
              <textarea
                rows={3}
                placeholder="Ghi lại đôi dòng phản tư mộc mạc... Cậu cảm nhận điều gì quý giá nhất ngoài đời thực hôm nay? Có bớt bận lòng vì mạng xã hội không?"
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 300))}
                maxLength={300}
                className="w-full p-3 text-xs sm:text-sm rounded-2xl border border-white/40 bg-white/45 backdrop-blur-sm focus:border-emerald-400 focus:outline-none text-slate-700 placeholder:text-slate-400 shadow-inner resize-none transition-all"
              />
              <div className="flex justify-between text-[10px] text-slate-400 px-1 font-mono">
                <span>Nhật ký mang tính bảo mật, lưu trữ cục bộ</span>
                <span>{note.length}/300 ký tự</span>
              </div>
            </div>

            {/* ERROR DISPLAY */}
            {validationError && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-xs font-bold text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-100 text-center"
              >
                {validationError}
              </motion.p>
            )}

            {/* SUBMIT BUTTON */}
            <div className="flex gap-3 justify-end items-center pt-2">
              <AnimatePresence>
                {successMsg && (
                  <motion.span 
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl flex items-center gap-1"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    Đã ghi nhận thành công!
                  </motion.span>
                )}
              </AnimatePresence>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4.5 h-4.5 stroke-[2.5]" />
                Lưu Nhật Ký Hôm Nay
              </button>
            </div>

          </form>
        </div>

        {/* COLUMN 2: PROGRESS ANALYSIS & REFLECTIONS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* VISUAL A: ENERGY LEVEL GRAPH (CUSTOM COMPACT SVG CURVE) */}
          <div className="bg-white/65 backdrop-blur-xl rounded-[28px] border border-white/40 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-white/30 pb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                Dòng chảy năng lượng 7 ngày
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Chỉ số tự đánh giá</span>
            </div>

            {sortedChronologicalLogs.length <= 1 ? (
              <div className="h-28 flex items-center justify-center text-center p-4 bg-white/20 rounded-xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-400">
                  Hãy ghi nhận thêm nhật ký nhiều ngày khác nhau để vẽ sơ đồ sóng năng lượng nhé! 🌱
                </p>
              </div>
            ) : (
              <div className="relative pt-2">
                <div className="absolute left-2 top-0 text-[9px] text-slate-400 flex flex-col justify-between h-20 pointer-events-none font-mono">
                  <span>Sức khỏe đỉnh cao (5)</span>
                  <span>Cạn kiệt (1)</span>
                </div>
                
                <svg viewBox="0 0 500 120" className="w-full h-32 overflow-visible">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="460" y2="20" stroke="#f1f5f9" strokeDasharray="3,3" />
                  <line x1="40" y1="60" x2="460" y2="60" stroke="#f1f5f9" strokeDasharray="3,3" />
                  <line x1="40" y1="100" x2="460" y2="100" stroke="#f1f5f9" strokeDasharray="3,3" />
                  
                  {/* Filled Area */}
                  {areaPath && <path d={areaPath} fill="url(#chartGradient)" />}
                  
                  {/* Line */}
                  {linePath && <path d={linePath} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}
                  
                  {/* Points */}
                  {chartPoints.map((pt, i) => {
                    const moodConf = MOODS[pt.log.moodId];
                    return (
                      <g key={pt.log.id} className="cursor-pointer" onMouseEnter={() => setHoveredLog(pt.log)} onMouseLeave={() => setHoveredLog(null)}>
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r="5" 
                          fill="#ffffff" 
                          stroke="#10B981" 
                          strokeWidth="2.5" 
                        />
                        <text 
                          x={pt.x} 
                          y={pt.y - 12} 
                          textAnchor="middle" 
                          className="text-[11px] select-none"
                        >
                          {moodConf?.emoji || "🌟"}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Tooltip on hovering point */}
                <div className="min-h-[36px] flex items-center justify-center bg-white/40 p-1.5 rounded-xl border border-white/50 text-[10.5px] text-slate-500 text-center font-sans mt-1">
                  {hoveredLog ? (
                    <div>
                      <span className="font-bold text-slate-700">{getFormattedDateLabel(hoveredLog.date).split(",")[1]}</span>:{" "}
                      Tâm trạng <span className="font-bold text-emerald-600">{MOODS[hoveredLog.moodId]?.label}</span> (Năng lượng {hoveredLog.energyLevel}/5)
                    </div>
                  ) : (
                    <span className="italic text-slate-400">Rê chuột lên các điểm tròn để xem thông tin</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* VISUAL B: MOOD PIXEL GARDEN (CALENDAR GRID REPRESENTATION) */}
          <div className="bg-white/65 backdrop-blur-xl rounded-[28px] border border-white/40 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-white/30 pb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-emerald-500" />
                Vườn Cảm Xúc (Lưu Trữ Pixel)
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Dữ liệu gần đây</span>
            </div>

            <p className="text-[10.5px] text-slate-500 leading-relaxed">
              Mỗi ô vuông tượng trưng cho một ngày của cậu. Hãy phủ xanh khu vườn bằng sự bình yên và thăng hoa từ trải nghiệm đời thực.
            </p>

            {/* Pixel Grid representing the last 24 days */}
            <div className="flex flex-wrap gap-2 justify-center py-2 bg-white/20 p-3 rounded-2xl border border-white/30">
              {Array.from({ length: 24 }).map((_, i) => {
                // Generate relative dates backward from today
                const date = new Date();
                date.setDate(date.getDate() - (23 - i));
                const dateStr = date.toLocaleDateString("en-CA");
                
                const logged = logs.find(l => l.date === dateStr);
                const moodConf = logged ? MOODS[logged.moodId] : null;

                return (
                  <div
                    key={i}
                    title={logged ? `${getFormattedDateLabel(dateStr)}: ${moodConf?.label} ${moodConf?.emoji}` : `${getFormattedDateLabel(dateStr)}: Chưa ghi nhận`}
                    className={`w-7 h-7 rounded-lg border transition-all flex items-center justify-center text-xs shadow-sm relative group cursor-help ${
                      logged 
                        ? `${moodConf?.color} ${moodConf?.border} font-bold scale-100 hover:scale-110 hover:shadow` 
                        : "bg-white/40 border-slate-100 hover:bg-slate-50 text-slate-300"
                    }`}
                  >
                    {logged ? moodConf?.emoji : ""}
                    
                    {/* Tooltip effect */}
                    <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] px-2 py-1 rounded shadow-md pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                      {logged ? `${moodConf?.label} (${logged.energyLevel}/5)` : "Chưa ghi nhận"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* VISUAL C: TIMELINE READ-ONLY LIST OF PAST LOGS */}
          <div className="bg-white/65 backdrop-blur-xl rounded-[28px] border border-white/40 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-white/30 pb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                Dòng thời gian phản tư
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">Tổng cộng: {logs.length} mục</span>
            </div>

            <div className="max-h-[290px] overflow-y-auto space-y-3.5 pr-1">
              {logs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 italic text-xs">
                  Chưa có dòng tâm sự nào được lưu lại.
                </div>
              ) : (
                logs.map((log) => {
                  const moodConfig = MOODS[log.moodId];
                  return (
                    <div 
                      key={log.id} 
                      className="p-3.5 rounded-2xl bg-white/45 backdrop-blur-sm border border-white/50 shadow-sm relative group hover:shadow-md transition-all space-y-2.5"
                    >
                      {/* Entry Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block font-bold uppercase leading-none">
                            {getFormattedDateLabel(log.date)}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${moodConfig?.text} mt-1`}>
                            {moodConfig?.emoji} {moodConfig?.label} 
                            <span className="text-slate-300 font-light">•</span>
                            <span className="text-[10px] text-slate-500 font-normal">Năng lượng: {log.energyLevel}/5</span>
                          </span>
                        </div>

                        {/* Delete entry action button */}
                        <button
                          onClick={() => {
                            if (window.confirm("Cậu chắc chắn muốn xóa mục nhật ký ngày này chứ?")) {
                              handleDeleteLog(log.id);
                            }
                          }}
                          className="p-1 rounded bg-white hover:bg-rose-50 border border-slate-150 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Xóa trang nhật ký này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Log text */}
                      {log.note && (
                        <p className="text-[12px] text-slate-600 leading-relaxed text-justify bg-white/20 p-2.5 rounded-xl border border-white/20">
                          {log.note}
                        </p>
                      )}

                      {/* Logged Activities Badges */}
                      {log.activities.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {log.activities.map(actId => {
                            const actConf = ACTIVITIES[actId];
                            if (!actConf) return null;
                            return (
                              <span 
                                key={actId} 
                                className="text-[9px] bg-emerald-50/50 text-emerald-700 border border-emerald-100/50 px-2 py-0.5 rounded-full font-medium"
                              >
                                {actConf.emoji} {actConf.label.split(" ")[0]}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Clear all local data option */}
            {logs.length > 0 && (
              <div className="pt-2 text-center border-t border-slate-150/50">
                {!showConfirmReset ? (
                  <button
                    onClick={() => setShowConfirmReset(true)}
                    className="text-[10.5px] text-slate-400 hover:text-rose-500 transition-colors font-medium flex items-center gap-1 mx-auto"
                  >
                    <Trash2 className="w-3 h-3" />
                    Đặt lại tất cả dữ liệu gốc
                  </button>
                ) : (
                  <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-center space-y-2">
                    <p className="text-[10.5px] text-rose-700 font-bold">
                      Xác nhận xóa sạch nhật ký và khôi phục dữ liệu mẫu gốc?
                    </p>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleResetData}
                        className="text-[10px] bg-rose-600 text-white px-2.5 py-1 rounded-md font-bold hover:bg-rose-700 transition-colors"
                      >
                        Đồng ý xóa sạch
                      </button>
                      <button
                        onClick={() => setShowConfirmReset(false)}
                        className="text-[10px] bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-bold hover:bg-slate-300 transition-colors"
                      >
                        Hủy bỏ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      <BreathExercisePopup 
        isOpen={isBreathOpen} 
        onClose={() => setIsBreathOpen(false)} 
        reason={breathReason} 
      />
    </div>
  );
}
