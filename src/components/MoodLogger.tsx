import React, { useState, useEffect, useRef } from "react";
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
import { useUserData } from "../context/UserContext";
import { D3EnergyChart } from "./D3EnergyChart";
import { MoodTrendChart } from "./MoodTrendChart";
import { MoodCalendar } from "./MoodCalendar";

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

interface SvgFlowerProps {
  scale?: number;
  isExpanded: boolean;
  isClicked: boolean;
  isWithered?: boolean;
}

const SvgPeachBlossom: React.FC<SvgFlowerProps & { isWatered?: boolean }> = ({ scale = 1, isExpanded, isClicked, isWithered = false, isWatered = false }) => {
  const isGlowing = (isExpanded || isClicked) && !isWithered;
  const isBloomed = (isExpanded || isClicked || isWatered) && !isWithered;
  
  return (
    <g 
      className={`origin-center transition-all duration-[1200ms] ease-out ${isGlowing ? "animate-flower-bloom" : ""}`}
      style={{ 
        transform: `scale(${scale * (isBloomed ? 1.25 : 0.85)})`
      }}
    >
      {/* Thân cuống / Đế hoa (Stem & Sepals Layer) */}
      {!isWithered && (
        <g className="origin-bottom">
          {/* Small curved stem */}
          <path
            d="M 0 0 Q -1.5 5, -3 10"
            fill="none"
            stroke="#451a03"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* 3 dark red sepals (đế hoa) - alternating with 3 petals */}
          {[60, 180, 300].map((angle) => (
            <path
              key={`sepal-${angle}`}
              d="M 0 0 C -1.5 -2, -2 -4, 0 -5 C 2 -4, 1.5 -2, 0 0"
              fill="#991b1b"
              stroke="#450a0a"
              strokeWidth="0.25"
              transform={`rotate(${angle}) scale(0.8)`}
            />
          ))}
        </g>
      )}

      {/* Cánh hoa Layer (Petals) - EXACTLY 3 petals */}
      <g className="origin-center">
        {[0, 120, 240].map((angle, idx) => (
          <path
            key={`petal-${angle}`}
            // A beautiful, wider petal shape for 3-petal design
            d="M 0 0 C -7 -11, -11 -18, 0 -21 C 11 -18, 7 -11, 0 0"
            fill={isWithered ? "#cbd5e1" : (idx % 2 === 0 ? "#f43f5e" : "#fbcfe8")}
            stroke={isWithered ? "#94a3b8" : (idx % 2 === 0 ? "#e11d48" : "#fda4af")}
            strokeWidth="0.5"
            className="transition-all duration-[1200ms] ease-out"
            style={{ 
              transform: isBloomed 
                ? `rotate(${angle}deg) scale(1.15)` 
                : `rotate(${angle - 15}deg) scale(0.65)`,
              transformOrigin: '0px 0px'
            }}
          />
        ))}
      </g>

      {/* Nhị hoa Layer (Stamens & Center Core) */}
      <g className={isBloomed ? "animate-stamen-pulse origin-center" : "origin-center"}>
        {/* 6 beautiful stamens arranged symmetrically */}
        {!isWithered && [30, 90, 150, 210, 270, 330].map((angle) => (
          <g key={`stamen-group-${angle}`} transform={`rotate(${angle})`}>
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-8"
              stroke="#fef08a"
              strokeWidth="0.8"
              className="transition-all duration-[1200ms] ease-out"
              style={{ transform: isBloomed ? 'scaleY(1.25)' : 'scaleY(0.7)' }}
            />
            <circle
              cx="0"
              cy="-8.5"
              r="0.9"
              fill="#f59e0b"
              className="transition-all duration-[1200ms] ease-out"
              style={{ transform: isBloomed ? 'translateY(-1.5px) scale(1.3)' : 'scale(1)' }}
            />
          </g>
        ))}

        {/* Core Center */}
        <circle cx="0" cy="0" r="3" fill={isWithered ? "#78716c" : "#be123c"} />
        {!isWithered && (
          <circle 
            cx="0" 
            cy="0" 
            r="1.5" 
            fill="#fef08a" 
            className="animate-stamen-pulse"
          />
        )}
      </g>
    </g>
  );
};

const SvgStarAnise: React.FC<SvgFlowerProps & { isWatered?: boolean }> = ({ scale = 1, isExpanded, isClicked, isWithered = false, isWatered = false }) => {
  const isGlowing = (isExpanded || isClicked) && !isWithered;
  const isBloomed = (isExpanded || isClicked || isWatered) && !isWithered;
  
  return (
    <g 
      className={`origin-center transition-all duration-[1200ms] ease-out ${isGlowing ? "animate-flower-bloom" : ""}`}
      style={{ 
        transform: `scale(${scale * (isBloomed ? 1.25 : 0.85)})`
      }}
    >
      {/* Thân cuống Layer (Woody Stem) */}
      {!isWithered && (
        <path
          d="M 0 0 Q -2.5 7, -5 14"
          fill="none"
          stroke="#451a03"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="origin-bottom"
        />
      )}

      {/* Cánh hoa Layer (Carpels as Petals) - EXACTLY 5 carpels */}
      <g className="origin-center">
        {/* 5 Outer carpels */}
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <path
            key={`back-${angle}`}
            d="M 0 0 C -5 -9, -9 -18, 0 -22 C 9 -18, 5 -9, 0 0"
            fill={isWithered ? "#78716c" : "#78350f"}
            stroke={isWithered ? "#57534e" : "#451a03"}
            strokeWidth="0.8"
            className="transition-all duration-[1200ms] ease-out origin-bottom"
            style={{ 
              transform: isBloomed 
                ? `rotate(${angle}deg) scale(1.1)` 
                : `rotate(${angle - 10}deg) scale(0.6)`,
              transformOrigin: '0px 0px'
            }}
          />
        ))}

        {/* 5 Inner carpels (slightly smaller/offset to add depth) */}
        {[0, 72, 144, 216, 288].map((angle, idx) => (
          <path
            key={`front-${angle}`}
            d="M 0 0 C -4 -8, -8 -16, 0 -20 C 8 -16, 4 -8, 0 0"
            fill={isWithered ? "#a8a29e" : "#b45309"}
            stroke={isWithered ? "#78716c" : "#78350f"}
            strokeWidth="0.8"
            className="transition-all duration-[1200ms] ease-out origin-bottom"
            style={{ 
              transform: isBloomed 
                ? `rotate(${angle + 5}deg) scale(1.05)` 
                : `rotate(${angle - 5}deg) scale(0.55)`,
              transformOrigin: '0px 0px'
            }}
          />
        ))}
      </g>

      {/* Nhị / Hạt bên trong (Seeds inside carpels & core center) */}
      <g className={isBloomed ? "animate-stamen-pulse origin-center" : "origin-center"}>
        {!isWithered && [0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={`seed-${angle}`}
            cx="0"
            cy="-11"
            rx="2.2"
            ry="3.5"
            fill="#fef08a"
            stroke="#ca8a04"
            strokeWidth="0.5"
            className="transition-all duration-[1200ms] ease-out origin-bottom"
            style={{ 
              transform: isBloomed ? 'translateY(-2px) scale(1.2)' : 'scale(0.6)',
              transformOrigin: '0px -11px',
              filter: isBloomed ? 'drop-shadow(0 0 3px #fef08a)' : 'none'
            }}
          />
        ))}

        {/* Central core detail */}
        <circle cx="0" cy="0" r="4.5" fill={isWithered ? "#57534e" : "#451a03"} />
        {!isWithered && (
          <circle 
            cx="0" 
            cy="0" 
            r="2" 
            fill="#ca8a04" 
            className="animate-stamen-pulse"
          />
        )}
      </g>
    </g>
  );
};

export default function MoodLogger() {
  const { userData, setMoodLogs, setPlantStage, addDetoxMinutes } = useUserData();
  const logs = userData.moodLogs;

  const setLogs = (updated: MoodLogEntry[]) => {
    setMoodLogs(updated);
  };

  const [isBreathOpen, setIsBreathOpen] = useState(false);
  const [breathReason, setBreathReason] = useState("");
  
  // Evolving Mood Garden Local States (Lạng Sơn Localization)
  const [isWatered, setIsWatered] = useState(false);
  const [gardenPlant, setGardenPlant] = useState<"dao" | "hoi">("dao");

  // Karma points, wooden bottles and growth progress state sync
  const [karmaPoints, setKarmaPoints] = useState(() => {
    const stored = localStorage.getItem("corez_karma_points") || localStorage.getItem("remix_corez_xp");
    return stored ? parseInt(stored, 10) : 0;
  });

  const [woodenBottles, setWoodenBottles] = useState(() => {
    const stored = localStorage.getItem("corez_wooden_water_bottles");
    return stored ? parseInt(stored, 10) : 0;
  });

  const [plantProgress, setPlantProgressState] = useState(() => {
    const storedProgress = localStorage.getItem("corez_plant_progress");
    if (storedProgress) {
      return Math.min(100, Math.max(0, parseFloat(storedProgress)));
    }
    return 20; // default initial progress
  });

  const [isPlantGlowing, setIsPlantGlowing] = useState(false);
  const [isFlowerClicked, setIsFlowerClicked] = useState(false);

  // Canvas refs for watering effects and falling petals
  const gardenCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);
  const fallingPetalsRef = useRef<any[]>([]);

  // Function to refresh state values from localStorage
  const refreshStorageValues = () => {
    const kp = localStorage.getItem("corez_karma_points") || localStorage.getItem("remix_corez_xp");
    if (kp) setKarmaPoints(parseInt(kp, 10));
    
    const wb = localStorage.getItem("corez_wooden_water_bottles");
    if (wb) setWoodenBottles(parseInt(wb, 10));

    const prog = localStorage.getItem("corez_plant_progress");
    if (prog) setPlantProgressState(parseFloat(prog));
  };

  useEffect(() => {
    refreshStorageValues();
    // Poll every 3 seconds to ensure real-time synchronization between sections (e.g. Community)
    const interval = setInterval(refreshStorageValues, 3000);
    return () => clearInterval(interval);
  }, []);

  // Exchange Karma for Wooden Water Bottles
  const handleExchangeWater = () => {
    if (karmaPoints < 10) return;
    
    const newKarma = karmaPoints - 10;
    const newBottles = woodenBottles + 1;
    
    setKarmaPoints(newKarma);
    setWoodenBottles(newBottles);
    
    localStorage.setItem("corez_karma_points", newKarma.toString());
    localStorage.setItem("remix_corez_xp", newKarma.toString());
    localStorage.setItem("corez_wooden_water_bottles", newBottles.toString());
  };

  // Water the plant using a wooden bottle
  const handleWaterWithWoodBottle = () => {
    if (woodenBottles <= 0) return;
    
    const newBottles = woodenBottles - 1;
    const newProgress = Math.min(100, plantProgress + 20);
    
    setWoodenBottles(newBottles);
    setPlantProgressState(newProgress);
    setIsWatered(true); // heals withered state too!
    
    localStorage.setItem("corez_wooden_water_bottles", newBottles.toString());
    localStorage.setItem("corez_plant_progress", newProgress.toString());
    
    // Trigger canvas particles
    triggerWateringParticles();
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

  const streakCount = calculateStreak();

  // Check garden status helper
  const getGardenStatus = () => {
    const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    
    let streakLevel = 1;
    const streak = streakCount;
    if (streak >= 5) {
      streakLevel = 5;
    } else if (streak >= 4) {
      streakLevel = 4;
    } else if (streak >= 3) {
      streakLevel = 3;
    } else if (streak >= 2) {
      streakLevel = 2;
    } else {
      streakLevel = 1;
    }

    // Determine derived level from the plantProgress percentage (0-100%)
    const progressLevel = Math.min(5, Math.max(1, Math.floor(plantProgress / 20) + 1));
    const level = Math.max(streakLevel, progressLevel);

    if (sortedLogs.length === 0) {
      return { 
        isBlooming: false, 
        isWithered: false, 
        growthLevel: level,
        reason: "Hãy ghi nhận nhật ký ngày đầu tiên để ươm mầm hạt giống nhé! 🌱" 
      };
    }

    const last3 = sortedLogs.slice(0, 3);
    const negativeMoodIds = ["sad", "tired", "anxious"];
    const hasStress = last3.some(l => negativeMoodIds.includes(l.moodId) || l.energyLevel <= 2);
    
    // Determine bloom/wither status
    let withered = hasStress && !isWatered;
    let blooming = (level >= 3 || isWatered) && !withered;

    let reasonStr = "";
    if (withered) {
      reasonStr = `[Cấp ${level}] Nhánh thảo mộc héo rũ do stress (Tiến trình: ${plantProgress}%). Cậu hãy tưới nước bằng Bình Nước Gỗ hoặc tập thở sâu Hộp 4D để phục hồi và nở hoa nhé! 🍂`;
    } else if (level === 5) {
      reasonStr = `[Cấp 5 - Rực rỡ nhất] Nhánh thảo mộc nở rộ viên mãn! Tiến trình chăm sóc đạt ${plantProgress}% giúp khu vườn ngát hương. Cậu làm tuyệt lắm! 🌸✨`;
    } else if (level === 4) {
      reasonStr = `[Cấp 4] Nhánh cây đã lớn mạnh và hé nở 2-3 bông hoa rực rỡ (Tiến trình: ${plantProgress}%). 🌱✨`;
    } else if (level === 3) {
      reasonStr = `[Cấp 3] Xuất hiện các nụ hoa chúm chím căng đầy nhựa sống (Tiến trình: ${plantProgress}%). Cố gắng duy trì nhé! 🌱`;
    } else if (level === 2) {
      reasonStr = `[Cấp 2] Nhánh cây mọc thêm các cành nhỏ và lá xanh mơn mởn (Tiến trình: ${plantProgress}%). Hãy tiếp tục phản tư để cây ra nụ nhé! 🌿`;
    } else {
      reasonStr = `[Cấp 1] Cành cây mộc mạc nguyên bản bắt đầu bén rễ (Tiến trình: ${plantProgress}%). Hãy đều đặn ghi nhận nhật ký để tưới tắm cho cây lớn nhé! 🌱`;
    }

    return { 
      isBlooming: blooming, 
      isWithered: withered, 
      growthLevel: level, 
      reason: reasonStr 
    };
  };

  const { isBlooming, isWithered, growthLevel, reason: gardenReason } = getGardenStatus();

  useEffect(() => {
    if (growthLevel !== userData.plantStage) {
      setPlantStage(growthLevel);
    }
  }, [growthLevel, userData.plantStage, setPlantStage]);

  const handleFlowerClick = () => {
    setIsFlowerClicked(true);
    setIsPlantGlowing(true);
    triggerWateringParticles();
    setTimeout(() => {
      setIsFlowerClicked(false);
      setIsPlantGlowing(false);
    }, 1500);
  };

  // Triggering the Canvas-based particle water stream
  const triggerWateringParticles = () => {
    const canvas = gardenCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const newParticles = [];
    const count = 45;
    
    const targetX = canvas.width / 2;
    const targetY = canvas.height * 0.55;

    for (let i = 0; i < count; i++) {
      const startFromLeft = Math.random() > 0.5;
      const startX = startFromLeft ? 20 + Math.random() * 40 : canvas.width - 20 - Math.random() * 40;
      const startY = canvas.height - 30;

      const speed = 1.6 + Math.random() * 2.2;
      const size = 2.5 + Math.random() * 4.5;
      
      newParticles.push({
        x: startX,
        y: startY,
        targetX,
        targetY,
        size,
        speed,
        progress: 0,
        angleOffset: Math.random() * Math.PI * 2,
        waveFrequency: 2 + Math.random() * 3,
        waveAmplitude: 15 + Math.random() * 25,
        opacity: 0.85 + Math.random() * 0.15
      });
    }

    particlesRef.current = [...particlesRef.current, ...newParticles];

    // Trigger plant shake & glow after particles land
    setTimeout(() => {
      setIsPlantGlowing(true);
      setTimeout(() => setIsPlantGlowing(false), 1200);
    }, 900);
  };

  // Handle particle animation frames on canvas
  useEffect(() => {
    let animationFrameId: number;
    
    const updateAndDrawParticles = () => {
      const canvas = gardenCanvasRef.current;
      if (!canvas) {
        animationFrameId = requestAnimationFrame(updateAndDrawParticles);
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animationFrameId = requestAnimationFrame(updateAndDrawParticles);
        return;
      }

      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      if (particles.length > 0) {
        particlesRef.current = particles.filter((p) => {
          p.progress += 0.014 * p.speed;
          if (p.progress >= 1) return false;

          const currentX = p.x + (p.targetX - p.x) * p.progress;
          const currentY = p.y + (p.targetY - p.y) * p.progress;

          const wave = Math.sin(p.progress * Math.PI * p.waveFrequency + p.angleOffset) * p.waveAmplitude * (1 - p.progress);
          const finalX = currentX + wave;
          const finalY = currentY;

          ctx.beginPath();
          if (gardenPlant === "dao") {
            const hue = 325 + Math.random() * 25;
            ctx.fillStyle = `hsla(${hue}, 100%, 78%, ${p.opacity * (1 - p.progress)})`;
            ctx.shadowBlur = p.size * 2.5;
            ctx.shadowColor = "rgba(244, 63, 94, 0.65)";
          } else {
            const goldHue = 35 + Math.random() * 20;
            ctx.fillStyle = `hsla(${goldHue}, 100%, 62%, ${p.opacity * (1 - p.progress)})`;
            ctx.shadowBlur = p.size * 2.5;
            ctx.shadowColor = "rgba(217, 119, 6, 0.65)";
          }

          ctx.arc(finalX, finalY, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;

          return true;
        });
      }

      // Maintain and update falling peach blossom petals (when flower is blooming)
      if (isBlooming) {
        if (fallingPetalsRef.current.length < 20) {
          fallingPetalsRef.current.push({
            x: Math.random() * canvas.width,
            y: -10 - Math.random() * 50,
            size: 3.5 + Math.random() * 4,
            speedY: 0.35 + Math.random() * 0.5,
            speedX: -0.25 + Math.random() * 0.5,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: -0.015 + Math.random() * 0.03,
            swingSpeed: 0.01 + Math.random() * 0.015,
            swingRange: 4 + Math.random() * 8,
            swingOffset: Math.random() * Math.PI * 2,
            opacity: 0.75 + Math.random() * 0.25,
          });
        }

        fallingPetalsRef.current.forEach((p) => {
          p.y += p.speedY;
          p.swingOffset += p.swingSpeed;
          const currentX = p.x + p.speedX + Math.sin(p.swingOffset) * 0.3;
          p.rotation += p.rotationSpeed;

          if (p.y > canvas.height + 10) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
            p.speedY = 0.35 + Math.random() * 0.5;
            p.speedX = -0.25 + Math.random() * 0.5;
            p.opacity = 0.75 + Math.random() * 0.25;
          }

          ctx.save();
          ctx.translate(currentX, p.y);
          ctx.rotate(p.rotation);
          
          // Outer petal curve
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(-p.size, -p.size * 0.5, -p.size * 1.2, p.size * 0.8, 0, p.size * 1.5);
          ctx.bezierCurveTo(p.size * 1.2, p.size * 0.8, p.size, -p.size * 0.5, 0, 0);
          ctx.fillStyle = `rgba(251, 207, 232, ${p.opacity * 0.85})`; // Light pink
          ctx.fill();

          // Darker center vein detail
          ctx.beginPath();
          ctx.moveTo(0, p.size * 0.25);
          ctx.bezierCurveTo(-p.size * 0.4, p.size * 0.35, -p.size * 0.5, p.size * 0.8, 0, p.size * 1.2);
          ctx.bezierCurveTo(p.size * 0.5, p.size * 0.8, p.size * 0.4, p.size * 0.35, 0, p.size * 0.25);
          ctx.fillStyle = `rgba(244, 63, 94, ${p.opacity * 0.5})`; // Rose pink
          ctx.fill();

          ctx.restore();
        });
      } else {
        fallingPetalsRef.current = [];
      }

      animationFrameId = requestAnimationFrame(updateAndDrawParticles);
    };

    animationFrameId = requestAnimationFrame(updateAndDrawParticles);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gardenPlant, growthLevel, isBlooming]);
  
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
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Do not auto-seed logs so that new users start with a clean slate
  useEffect(() => {
    // Left empty intentionally to support clean-slate onboarding
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
    
    // Reset watered state
    setIsWatered(false);
    
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
  };

  // Reset database to completely empty state
  const handleResetData = () => {
    setLogs([]);
    setSelectedDate(new Date().toLocaleDateString("en-CA"));
    setShowConfirmReset(false);
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
              <D3EnergyChart logs={sortedChronologicalLogs} moodsConfig={MOODS} />
            )}
          </div>

          {/* RECHARTS MOOD TREND CHART */}
          <MoodTrendChart logs={logs} onResetLogs={() => setLogs([])} />

          {/* VISUAL B: EVOLVING MOOD GARDEN (LẠNG SƠN LOCALIZATION) */}
          <div className="bg-white/65 backdrop-blur-xl rounded-[28px] border border-white/40 p-5 shadow-sm space-y-4 relative overflow-hidden">
            <style>{`
              @keyframes plant-shake-glow {
                0% { transform: scale(1) rotate(0deg); filter: brightness(1) drop-shadow(0 0 0px rgba(52, 211, 153, 0)); }
                20% { transform: scale(1.08) rotate(-3deg); filter: brightness(1.45) drop-shadow(0 0 10px rgba(52, 211, 153, 0.7)); }
                40% { transform: scale(1.08) rotate(3deg); filter: brightness(1.45) drop-shadow(0 0 10px rgba(52, 211, 153, 0.7)); }
                60% { transform: scale(1.03) rotate(-1deg); filter: brightness(1.2) drop-shadow(0 0 5px rgba(52, 211, 153, 0.45)); }
                80% { transform: scale(1.03) rotate(1deg); filter: brightness(1.2) drop-shadow(0 0 5px rgba(52, 211, 153, 0.45)); }
                100% { transform: scale(1) rotate(0deg); filter: brightness(1) drop-shadow(0 0 0px rgba(52, 211, 153, 0)); }
              }
              .animate-plant-shake-glow {
                animation: plant-shake-glow 1.2s ease-in-out;
              }

              @keyframes flower-bloom {
                0% { transform: scale(0.4) rotate(-12deg); opacity: 0; filter: saturate(0.6) brightness(0.8); }
                55% { transform: scale(1.15) rotate(4deg); opacity: 0.95; filter: saturate(1.2) brightness(1.15) drop-shadow(0 0 10px rgba(244, 63, 94, 0.5)); }
                100% { transform: scale(1) rotate(0deg); opacity: 1; filter: saturate(1) brightness(1) drop-shadow(0 0 3px rgba(244, 63, 94, 0.15)); }
              }
              .animate-flower-bloom {
                animation: flower-bloom 1.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
              }

              @keyframes stamen-pulse {
                0%, 100% { transform: scale(1); filter: brightness(1); }
                50% { transform: scale(1.12); filter: brightness(1.35) drop-shadow(0 0 6px #fef08a); }
              }
              .animate-stamen-pulse {
                animation: stamen-pulse 1.8s ease-in-out infinite;
              }
            `}</style>
            <div className="flex items-center justify-between border-b border-white/30 pb-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                Vườn Thảo Mộc Bản Địa Xứ Lạng
              </h4>
              <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => setGardenPlant("dao")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1.5 ${
                    gardenPlant === "dao" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span>Hoa Đào</span>
                  <svg viewBox="-20 -20 40 40" className="w-3.5 h-3.5 origin-center select-none">
                    <SvgPeachBlossom scale={0.8} isExpanded={true} isClicked={false} />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setGardenPlant("hoi")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1.5 ${
                    gardenPlant === "hoi" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  <span>Hoa Hồi</span>
                  <svg viewBox="-25 -25 50 50" className="w-3.5 h-3.5 origin-center select-none">
                    <SvgStarAnise scale={0.85} isExpanded={true} isClicked={false} />
                  </svg>
                </button>
              </div>
            </div>

            {/* Visual Display Stage */}
            <div className="relative h-44 w-full bg-gradient-to-b from-sky-50/25 to-slate-50/50 rounded-2xl border border-slate-100 flex items-center justify-center overflow-hidden">
              {/* Particle Effects Canvas */}
              <canvas 
                ref={gardenCanvasRef} 
                className="absolute inset-0 pointer-events-none z-10 w-full h-full" 
              />
              
              {/* Particle Effects (Framer Motion) when blooming */}
              {isBlooming && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      className="absolute rounded-full"
                      style={{
                        backgroundColor: gardenPlant === "dao" ? "#fbcfe8" : "#fef08a",
                        width: idx % 2 === 0 ? "6px" : "10px",
                        height: idx % 2 === 0 ? "6px" : "10px",
                        left: `${15 + idx * 10}%`,
                        bottom: "10%",
                      }}
                      animate={{
                        y: ["0px", "-160px"],
                        x: ["0px", idx % 2 === 0 ? "15px" : "-15px"],
                        opacity: [0, 0.8, 0],
                        scale: [1, 1.3, 0.7],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 3 + (idx % 3),
                        delay: idx * 0.4,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Plant SVG Container */}
              <div 
                onClick={handleFlowerClick}
                className="relative w-36 h-36 flex items-center justify-center cursor-pointer select-none group"
                title="Bấm vào hoa để nở bung rực rỡ nhé! 🌸"
              >
                {gardenPlant === "dao" ? (
                  /* HOA ĐÀO XỨ LẠNG SVG (DYNAMICS) */
                  <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-300 ${isPlantGlowing ? "animate-plant-shake-glow" : ""}`}>
                    {/* Dirt/Pot base */}
                    <ellipse cx="50" cy="85" rx="35" ry="6" fill="#cbd5e1" opacity="0.3" />
                    
                    {/* Branch trunk */}
                    <motion.path
                      d="M 50 85 C 48 65, 45 45, 55 30"
                      fill="none"
                      stroke={isWithered ? "#78716c" : "#7c2d12"}
                      strokeWidth="4"
                      strokeLinecap="round"
                      animate={isWithered ? { rotate: [0, 1, 0] } : { rotate: [0, -1, 1, 0] }}
                      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                    />
                    
                    {/* Side branches - Level 2+ */}
                    {growthLevel >= 2 && (
                      <>
                        {/* Left Side branch */}
                        <path
                          d="M 48 60 C 38 52, 35 48, 30 46"
                          fill="none"
                          stroke={isWithered ? "#78716c" : "#7c2d12"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {/* Right Side branch */}
                        <path
                          d="M 51 45 C 58 38, 65 35, 70 34"
                          fill="none"
                          stroke={isWithered ? "#78716c" : "#7c2d12"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </>
                    )}

                    {/* Extra branches for Level 4+ */}
                    {growthLevel >= 4 && (
                      <>
                        {/* Extra left branch */}
                        <path
                          d="M 43 50 C 37 45, 38 42, 42 38"
                          fill="none"
                          stroke={isWithered ? "#78716c" : "#7c2d12"}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        {/* Extra right branch */}
                        <path
                          d="M 53 38 C 62 34, 60 30, 65 26"
                          fill="none"
                          stroke={isWithered ? "#78716c" : "#7c2d12"}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </>
                    )}

                    {/* Green Leaves - Level 2+ */}
                    {growthLevel >= 2 && (
                      <>
                        <path d="M 32 46 Q 28 42, 30 46" fill={isWithered ? "#a8a29e" : "#10b981"} />
                        <path d="M 68 34 Q 72 30, 70 34" fill={isWithered ? "#a8a29e" : "#10b981"} />
                        <path d="M 54 30 Q 52 24, 55 30" fill={isWithered ? "#a8a29e" : "#10b981"} />
                      </>
                    )}
                    {/* Extra Leaves for Level 4+ */}
                    {growthLevel >= 4 && (
                      <>
                        <path d="M 42 38 Q 38 34, 40 38" fill={isWithered ? "#a8a29e" : "#059669"} />
                        <path d="M 65 26 Q 69 22, 67 26" fill={isWithered ? "#a8a29e" : "#059669"} />
                        <path d="M 46 58 Q 42 54, 44 58" fill={isWithered ? "#a8a29e" : "#10b981"} />
                      </>
                    )}

                    {/* Blossoms & Buds */}
                    {isWithered ? (
                      /* Withered/Closed Buds */
                      <>
                        {growthLevel >= 3 && (
                          <g transform="translate(55, 30)">
                            <SvgPeachBlossom scale={0.5} isExpanded={false} isClicked={isFlowerClicked} isWithered={true} isWatered={isWatered} />
                          </g>
                        )}
                        {growthLevel >= 3 && (
                          <g transform="translate(30, 46)">
                            <SvgPeachBlossom scale={0.5} isExpanded={false} isClicked={isFlowerClicked} isWithered={true} isWatered={isWatered} />
                          </g>
                        )}
                        {growthLevel >= 3 && (
                          <g transform="translate(70, 34)">
                            <SvgPeachBlossom scale={0.5} isExpanded={false} isClicked={isFlowerClicked} isWithered={true} isWatered={isWatered} />
                          </g>
                        )}
                      </>
                    ) : (
                      <>
                        {/* Level 3: Tiny Buds */}
                        {growthLevel === 3 && (
                          <>
                            <g transform="translate(55, 30)">
                              <SvgPeachBlossom scale={0.45} isExpanded={false} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                            <g transform="translate(30, 46)">
                              <SvgPeachBlossom scale={0.45} isExpanded={false} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                            <g transform="translate(70, 34)">
                              <SvgPeachBlossom scale={0.45} isExpanded={false} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                          </>
                        )}

                        {/* Level 4: 2-3 big blossoms */}
                        {growthLevel === 4 && (
                          <>
                            {/* Blossom 1 Left */}
                            <g transform="translate(30, 46)">
                              <SvgPeachBlossom scale={0.9} isExpanded={false} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                            {/* Blossom 2 Right */}
                            <g transform="translate(70, 34)">
                              <SvgPeachBlossom scale={0.95} isExpanded={false} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                            {/* Top is still a bud */}
                            <g transform="translate(55, 30)">
                              <SvgPeachBlossom scale={0.5} isExpanded={false} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                          </>
                        )}

                        {/* Level 5: Fully Blooming Peach Tree */}
                        {growthLevel >= 5 && (
                          <>
                            {/* Blossom 1 Top */}
                            <g transform="translate(55, 30)">
                              <SvgPeachBlossom scale={1.15} isExpanded={true} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                            {/* Blossom 2 Left */}
                            <g transform="translate(30, 46)">
                              <SvgPeachBlossom scale={1.0} isExpanded={true} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                            {/* Blossom 3 Right */}
                            <g transform="translate(70, 34)">
                              <SvgPeachBlossom scale={1.05} isExpanded={true} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                            {/* Blossom 4 Extra Lower Left */}
                            <g transform="translate(42, 38)">
                              <SvgPeachBlossom scale={0.8} isExpanded={true} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                            {/* Blossom 5 Extra Upper Right */}
                            <g transform="translate(65, 26)">
                              <SvgPeachBlossom scale={0.8} isExpanded={true} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                          </>
                        )}
                      </>
                    )}
                  </svg>
                ) : (
                  /* NHÁNH HOA HỒI SVG (DYNAMICS) */
                  <svg viewBox="0 0 100 100" className={`w-full h-full transition-all duration-300 ${isPlantGlowing ? "animate-plant-shake-glow" : ""}`}>
                    {/* Ground base */}
                    <ellipse cx="50" cy="85" rx="30" ry="5" fill="#cbd5e1" opacity="0.3" />

                    {/* Main Stem */}
                    <path
                      d="M 50 85 Q 50 65, 50 50"
                      fill="none"
                      stroke={isWithered ? "#78716c" : "#065f46"}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />

                    {/* Side stems - Level 2+ */}
                    {growthLevel >= 2 && (
                      <>
                        {/* Left Side Stem */}
                        <path
                          d="M 50 70 Q 40 65, 32 58"
                          fill="none"
                          stroke={isWithered ? "#78716c" : "#065f46"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {/* Right Side Stem */}
                        <path
                          d="M 50 65 Q 60 60, 68 55"
                          fill="none"
                          stroke={isWithered ? "#78716c" : "#065f46"}
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </>
                    )}

                    {/* Leaves - Level 2+ */}
                    {growthLevel >= 2 && (
                      <>
                        <path d="M 45 68 Q 36 62, 42 66" fill={isWithered ? "#a8a29e" : "#10b981"} />
                        <path d="M 55 62 Q 64 56, 58 60" fill={isWithered ? "#a8a29e" : "#10b981"} />
                        <path d="M 50 54 Q 48 46, 50 50" fill={isWithered ? "#a8a29e" : "#10b981"} />
                      </>
                    )}

                    {/* Star Anise Flowers */}
                    {isWithered ? (
                      /* Withered Star Anise */
                      <g transform="translate(50, 50)">
                        <SvgStarAnise scale={0.8} isExpanded={false} isClicked={isFlowerClicked} isWithered={true} isWatered={isWatered} />
                      </g>
                    ) : (
                      <>
                        {/* Level 1: Just a tiny seedling center */}
                        {growthLevel === 1 && (
                          <g transform="translate(50, 50)">
                            <SvgStarAnise scale={0.4} isExpanded={false} isClicked={isFlowerClicked} isWatered={isWatered} />
                          </g>
                        )}

                        {/* Level 2: Small main flower */}
                        {growthLevel === 2 && (
                          <g transform="translate(50, 50)">
                            <SvgStarAnise scale={0.7} isExpanded={false} isClicked={isFlowerClicked} isWatered={isWatered} />
                          </g>
                        )}

                        {/* Level 3: Medium main flower */}
                        {growthLevel === 3 && (
                          <g transform="translate(50, 50)">
                            <SvgStarAnise scale={0.9} isExpanded={false} isClicked={isFlowerClicked} isWatered={isWatered} />
                          </g>
                        )}

                        {/* Level 4: Large main flower and side buds */}
                        {growthLevel === 4 && (
                          <>
                            <g transform="translate(50, 50)">
                              <SvgStarAnise scale={1.05} isExpanded={false} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                            <g transform="translate(32, 58)">
                              <circle r="3.5" fill="#78350f" />
                            </g>
                            <g transform="translate(68, 55)">
                              <circle r="3.5" fill="#78350f" />
                            </g>
                          </>
                        )}

                        {/* Level 5: Fully blooming Star Anise group */}
                        {growthLevel >= 5 && (
                          <>
                            {/* Main flower */}
                            <g transform="translate(50, 50)">
                              <SvgStarAnise scale={1.2} isExpanded={true} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                            {/* Left side flower */}
                            <g transform="translate(32, 58)">
                              <SvgStarAnise scale={0.75} isExpanded={true} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                            {/* Right side flower */}
                            <g transform="translate(68, 55)">
                              <SvgStarAnise scale={0.8} isExpanded={true} isClicked={isFlowerClicked} isWatered={isWatered} />
                            </g>
                          </>
                        )}
                      </>
                    )}
                  </svg>
                )}
              </div>
            </div>

            {/* Watering Interaction Action */}
            <div className="space-y-4">
              <p className="text-[11px] text-slate-500 leading-relaxed text-center font-light px-2">
                {gardenReason}
              </p>

              {/* Progress Bar of the plant */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1">🌱 Tiến trình sinh trưởng: {plantProgress}%</span>
                  <span>Cấp {growthLevel}/5</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/30 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${plantProgress}%` }}
                  />
                </div>
              </div>

              {/* Karma & Wood Bottles Exchange Panel */}
              <div className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-slate-600 font-medium">
                    <span>Karma của cậu:</span>
                    <span className="font-bold text-amber-600 font-mono flex items-center gap-0.5">🌟 {karmaPoints}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 font-medium">
                    <span>Bình nước gỗ:</span>
                    <span className="font-bold text-sky-600 font-mono flex items-center gap-0.5">🧪 {woodenBottles}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {/* Exchange button */}
                  <button
                    type="button"
                    disabled={karmaPoints < 10}
                    onClick={handleExchangeWater}
                    className={`py-2 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                      karmaPoints >= 10 
                        ? "bg-amber-100/90 text-amber-800 hover:bg-amber-200/90 border border-amber-200/50 shadow-sm" 
                        : "bg-slate-100 text-slate-400 border border-slate-200/20 cursor-not-allowed"
                    }`}
                  >
                    <span>🪵 Đổi Nước Chữa Lành</span>
                    <span className="text-[8px] font-normal opacity-75">(10 Karma)</span>
                  </button>

                  {/* Water button */}
                  <button
                    type="button"
                    disabled={woodenBottles <= 0}
                    onClick={handleWaterWithWoodBottle}
                    className={`py-2 px-2 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                      woodenBottles > 0 
                        ? "bg-sky-100/90 text-sky-800 hover:bg-sky-200/90 border border-sky-200/50 shadow-sm" 
                        : "bg-slate-100 text-slate-400 border border-slate-200/20 cursor-not-allowed"
                    }`}
                  >
                    <span>💧 Tưới nước gỗ</span>
                    <span className="text-[8px] font-normal opacity-75">(+20%)</span>
                  </button>
                </div>
              </div>

              {isWithered && (
                <div className="flex justify-center pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setBreathReason("Nhánh cây thảo mộc của cậu đang héo rũ vì stress. Hãy tưới nước cho cây bằng 1 phút thở sâu Hộp 4D cùng CoreZ để cây nở hoa lấp lánh trở lại nhé! 🌱");
                      setIsBreathOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>💧 Tưới nước bằng 1 phút thở 4D</span>
                  </button>
                </div>
              )}
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

      {/* Lịch Bản Ngã & Nhịp Điệu Cảm Xúc (Lịch biểu tháng/năm) */}
      <div className="mt-8">
        <MoodCalendar logs={logs} moodsConfig={MOODS} />
      </div>

      <BreathExercisePopup 
        isOpen={isBreathOpen} 
        onClose={() => setIsBreathOpen(false)} 
        reason={breathReason} 
        onComplete={() => {
          setIsWatered(true);
          // Increment breathing sessions in localStorage
          const currentCountRaw = localStorage.getItem("remix_corez_mindfulness_sessions");
          const currentCount = currentCountRaw ? parseInt(currentCountRaw, 10) : 0;
          localStorage.setItem("remix_corez_mindfulness_sessions", (currentCount + 1).toString());
          
          // Add 5 minutes of detox progress for a job well done!
          if (addDetoxMinutes) {
            addDetoxMinutes(5);
          }
        }}
      />
    </div>
  );
}
