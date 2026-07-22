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
  Info,
  X
} from "lucide-react";
import { useUserData } from "../context/UserContext";
import confetti from "canvas-confetti";
import { DigitalDetoxChart } from "./DigitalDetoxChart";
import ECardsDaily from "./ECardsDaily";

interface DailyChallengeTask {
  id: string;
  title: string;
  desc: string;
  xpAward: number;
  category: "detox" | "physical" | "mental" | "connect" | "breath";
  emoji: string;
}

const ALL_TASKS_POOL: DailyChallengeTask[] = [
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
  },
  {
    id: "task-no-screen-meal",
    title: "Thưởng thức một bữa ăn 'Không Màn Hình'",
    desc: "Cảm nhận trọn vẹn hương vị món ăn và sự hiện diện của gia đình, tuyệt đối không vừa ăn vừa lướt TikTok/Reels.",
    xpAward: 20,
    category: "detox",
    emoji: "🍽️"
  },
  {
    id: "task-clean-digital",
    title: "Dọn dẹp 'Không gian số'",
    desc: "Hủy theo dõi (unfollow) hoặc ẩn ít nhất 3 tài khoản/fanpage thường xuyên đăng tin tiêu cực, drama độc hại.",
    xpAward: 15,
    category: "detox",
    emoji: "🧹"
  },
  {
    id: "task-gratitude-journal",
    title: "Viết 3 điều khiến cậu mỉm cười hôm nay",
    desc: "Viết vào sổ tay đời thực hoặc mục 'Nhật ký cảm xúc' để nuôi dưỡng lòng biết ơn và xoa dịu tâm trí.",
    xpAward: 20,
    category: "mental",
    emoji: "✍️"
  },
  {
    id: "task-nature-touch",
    title: "15 phút quang hợp và chạm vào thiên nhiên",
    desc: "Bước ra ban công phơi nắng sớm, tưới một chậu cây hoặc ngắm nhìn bầu trời để mắt được nghỉ ngơi khỏi ánh sáng xanh.",
    xpAward: 15,
    category: "physical",
    emoji: "🌱"
  },
  {
    id: "task-offline-passion",
    title: "Đánh thức một đam mê 'Offline'",
    desc: "Dành 20 phút để vẽ tranh, chơi đàn, lắp lego, đọc truyện tranh giấy... những sở thích cậu đã lỡ bỏ quên vì bận lướt web.",
    xpAward: 30,
    category: "mental",
    emoji: "🎨"
  },
  {
    id: "task-bed-no-phone",
    title: "Quy tắc 'Giường ngủ là Vùng Cấm Số'",
    desc: "Cắm sạc điện thoại ở xa tầm tay với và không mang lên giường trước khi ngủ 30 phút để có một giấc ngủ chữa lành.",
    xpAward: 25,
    category: "detox",
    emoji: "🛌"
  },
  {
    id: "task-real-sounds",
    title: "Lắng nghe thanh âm thực tại",
    desc: "Tháo tai nghe ra khi đang đi bộ hoặc ngồi quán nước, lắng nghe âm thanh của xe cộ, tiếng chim, tiếng nói chuyện xung quanh.",
    xpAward: 15,
    category: "connect",
    emoji: "🎧"
  }
];

function getRandomTasks(pool: DailyChallengeTask[], count: number): DailyChallengeTask[] {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

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
    desc: "Đã vượt qua cám dỗ, ngắt kết nối thành công để tìm lại chính mình.",
    requirement: "Hoàn thành ít nhất 5/6 thói quen Thanh lọc (D3) liên tục trong 21 ngày.",
    emoji: "🌱",
    color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40",
    borderColor: "border-emerald-200 dark:border-emerald-800/60",
    bgLight: "bg-emerald-50/50 dark:bg-emerald-900/10"
  },
  {
    id: "badge-dawn-awakener",
    title: "Kẻ Đánh Thức Bình Minh",
    desc: "Khởi đầu ngày mới bằng năng lượng thực tế thay vì ánh sáng xanh của màn hình.",
    requirement: "21 ngày không lướt mạng xã hội trong 1 tiếng đầu tiên sau khi thức dậy.",
    emoji: "🌅",
    color: "text-amber-600 bg-amber-100 dark:bg-amber-950/40",
    borderColor: "border-amber-200 dark:border-amber-800/60",
    bgLight: "bg-amber-50/50 dark:bg-amber-900/10"
  },
  {
    id: "badge-connection-ambassador",
    title: "Đại Sứ Kết Nối",
    desc: "Đã phá vỡ bức tường ảo để xây dựng lại những mối quan hệ đời thực bền chặt.",
    requirement: "21 ngày duy trì thói quen trò chuyện trực tiếp cùng người thân, bạn bè.",
    emoji: "🤝",
    color: "text-rose-600 bg-rose-100 dark:bg-rose-950/40",
    borderColor: "border-rose-200 dark:border-rose-800/60",
    bgLight: "bg-rose-50/50 dark:bg-rose-900/10"
  },
  {
    id: "badge-mindfulness-master",
    title: "Bậc Thầy Tỉnh Thức",
    desc: "Đã làm chủ được nhịp thở, đưa tâm trí về trạng thái cân bằng tuyệt đối.",
    requirement: "Hoàn thành bài tập thở Hộp 4D trọn vẹn mỗi ngày trong 21 ngày liên tiếp.",
    emoji: "🧘",
    color: "text-purple-600 bg-purple-100 dark:bg-purple-950/40",
    borderColor: "border-purple-200 dark:border-purple-800/60",
    bgLight: "bg-purple-50/50 dark:bg-purple-900/10"
  },
  {
    id: "badge-emotion-guardian",
    title: "Người Gác Đền Cảm Xúc",
    desc: "Sở hữu màng lọc tâm lý vững chắc trước mọi tiêu cực từ không gian mạng.",
    requirement: "21 ngày liên tục vào 'Góc Bình Yên' để nhận Lời khẳng định tích cực.",
    emoji: "🛡️",
    color: "text-blue-600 bg-blue-100 dark:bg-blue-950/40",
    borderColor: "border-blue-200 dark:border-blue-800/60",
    bgLight: "bg-blue-50/50 dark:bg-blue-900/10"
  },
  {
    id: "badge-discipline-pro",
    title: "Chiến Binh Kỷ Luật",
    desc: "Kỷ luật thép, hoàn toàn làm chủ được thói quen sử dụng công nghệ của bản thân.",
    requirement: "Đạt chuỗi 21 ngày hoàn thành 100% mục tiêu đo lường.",
    emoji: "🏆",
    color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-950/40",
    borderColor: "border-yellow-200 dark:border-yellow-800/60",
    bgLight: "bg-yellow-50/50 dark:bg-yellow-900/10"
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
    id: "ach-empathy-3",
    title: "Thấu Cảm Sơ Khởi",
    desc: "Khơi dậy sự tò mò lành mạnh về thế giới nội tâm của bản thân.",
    requirement: "Ghi nhận đủ 3 nhật ký cảm xúc hàng ngày.",
    emoji: "🍃",
    color: "text-teal-600 bg-teal-100",
    borderColor: "border-teal-200",
    bgLight: "bg-teal-50/50"
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
    id: "ach-empathy-25",
    title: "Tri Kỷ Nội Tâm",
    desc: "Đã thiết lập mối giao kết bền chặt, thấu suốt từng gợn sóng cảm xúc nhỏ nhất.",
    requirement: "Ghi nhận đủ 25 nhật ký cảm xúc hàng ngày.",
    emoji: "🔮",
    color: "text-indigo-600 bg-indigo-100",
    borderColor: "border-indigo-200",
    bgLight: "bg-indigo-50/50"
  },
  {
    id: "ach-breath-3",
    title: "Hơi Thở Yên Bình",
    desc: "Đã rèn luyện cách neo giữ tâm trí thông qua hơi thở Hộp 4D mộc mạc.",
    requirement: "Hoàn thành đủ 3 bài hít thở sâu Hộp 4D.",
    emoji: "🌬️",
    color: "text-emerald-600 bg-emerald-100",
    borderColor: "border-emerald-200",
    bgLight: "bg-emerald-50/50"
  },
  {
    id: "ach-breath-10",
    title: "Hành Giả Tỉnh Thức",
    desc: "Duy trì nhịp thở điều hòa, giữ thùy trán khỏe mạnh trước các kích thích mạng xã hội.",
    requirement: "Hoàn thành đủ 10 bài hít thở sâu Hộp 4D.",
    emoji: "🌀",
    color: "text-blue-600 bg-blue-100",
    borderColor: "border-blue-200",
    bgLight: "bg-blue-50/50"
  },
  {
    id: "ach-breath-25",
    title: "Bậc Thầy Định Tâm",
    desc: "Tâm trí tựa mặt hồ phẳng lặng, hoàn toàn làm chủ mọi luồng suy nghĩ và lo âu.",
    requirement: "Hoàn thành đủ 25 bài hít thở sâu Hộp 4D.",
    emoji: "🧘‍♀️",
    color: "text-amber-600 bg-amber-100",
    borderColor: "border-amber-200",
    bgLight: "bg-amber-50/50"
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
  },
  {
    id: "ach-mindful-master",
    title: "Bậc Thầy Tỉnh Thức",
    desc: "Trở thành bậc thầy quan sát nội tâm, hòa hợp cả suy nghĩ và cảm xúc tự nhiên.",
    requirement: "Ghi nhận ít nhất 3 nhật ký cảm xúc và 3 bài phản tư.",
    emoji: "🧘",
    color: "text-purple-600 bg-purple-100",
    borderColor: "border-purple-200",
    bgLight: "bg-purple-50/50"
  },
  {
    id: "ach-consistent-user",
    title: "Bạn Đồng Hành Kiên Trì",
    desc: "Duy trì thói quen rèn luyện bản thân đều đặn mỗi ngày để làm chủ cảm xúc.",
    requirement: "Hoàn thành 5 nhiệm vụ hàng ngày hoặc ghi nhận 5 nhật ký.",
    emoji: "🗓️",
    color: "text-amber-600 bg-amber-100",
    borderColor: "border-amber-200",
    bgLight: "bg-amber-50/50"
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

interface BadgeSparklesProps {
  active: boolean;
}

const BadgeSparkles: React.FC<BadgeSparklesProps> = ({ active }) => {
  if (!active) return null;

  // Generate 24 star particles that radiate outwards
  const particles = Array.from({ length: 24 }).map((_, i) => {
    const angle = (i * 360) / 24; // evenly distributed angles
    const radialDistance = Math.random() * 45 + 65; // shoot outwards
    const speed = Math.random() * 0.9 + 0.6; // random duration
    const size = Math.random() * 11 + 7; // random size
    const colors = ["#FBBF24", "#F59E0B", "#F472B6", "#10B981", "#3B82F6", "#8B5CF6"];
    const color = colors[i % colors.length];

    return {
      id: i,
      angle,
      radialDistance,
      speed,
      size,
      color,
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-visible">
      {particles.map((p) => {
        const radians = (p.angle * Math.PI) / 180;
        const targetX = Math.cos(radians) * p.radialDistance;
        const targetY = Math.sin(radians) * p.radialDistance;

        return (
          <motion.div
            key={p.id}
            className="absolute rounded-full flex items-center justify-center select-none"
            style={{
              width: p.size,
              height: p.size,
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: targetX,
              y: targetY,
              scale: [0, 1.4, 0.5, 0],
              opacity: [1, 1, 0.7, 0],
              rotate: [0, p.angle + 180],
            }}
            transition={{
              duration: p.speed,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: Math.random() * 0.4,
            }}
          >
            {/* Custom sparkling star icon */}
            <svg
              viewBox="0 0 24 24"
              fill={p.color}
              className="w-full h-full filter drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]"
            >
              <path d="M12 0l3.09 9.51h10l-8.09 5.87 3.09 9.51-8.09-5.87-8.09 5.87 3.09-9.51-8.09-5.87h10z" />
            </svg>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function Gamification() {
  const { userData, addXP, setXP } = useUserData();
  const totalXp = userData.karmaXP;

  interface ToastConfig {
    id: string;
    title: string;
    emoji: string;
    desc: string;
  }

  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showCongratulationToast = (badgeTitle: string, emoji: string, desc: string) => {
    const newToast = {
      id: Date.now().toString() + Math.random().toString(),
      title: badgeTitle,
      emoji: emoji,
      desc: desc
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 7000);
  };

  const [dailyActiveTasks, setDailyActiveTasks] = useState<DailyChallengeTask[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("remix_corez_daily_active_tasks");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Error reading stored tasks:", e);
        }
      }
    }
    return getRandomTasks(ALL_TASKS_POOL, 5);
  });

  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [taskHistory, setTaskHistory] = useState<Record<string, number>>({
    "task-detox": 0,
    "task-physical": 0,
    "task-connect": 0,
    "task-mental": 0,
    "task-breath": 0
  });

  const [challengeProgress, setChallengeProgress] = useState<Record<string, number>>({
    "badge-detox": 12,
    "badge-dawn-awakener": 18,
    "badge-connection-ambassador": 8,
    "badge-mindfulness-master": 21,
    "badge-emotion-guardian": 15,
    "badge-discipline-pro": 4
  });

  const saveChallengeProgress = (updated: Record<string, number>) => {
    setChallengeProgress(updated);
    localStorage.setItem("remix_corez_challenge_progress", JSON.stringify(updated));
  };
  const [dayCounter, setDayCounter] = useState(1); // Day 1 out of 21
  const [totalTasksDone, setTotalTasksDone] = useState(0);
  
  // Confetti / Alert effects
  const [unlockedBadge, setUnlockedBadge] = useState<string | null>(null);
  const [justUnlockedBadgeId, setJustUnlockedBadgeId] = useState<string | null>(null);
  const [sparklingBadgeId, setSparklingBadgeId] = useState<string | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);

  // Active badge view tab: "grid" (all badges shelf) or "history" (timeline list)
  const [activeBadgeTab, setActiveBadgeTab] = useState<"grid" | "history">("grid");

  // Badges unlock history timeline
  const [unlockedHistory, setUnlockedHistory] = useState<Array<{
    badgeId: string;
    title: string;
    emoji: string;
    category: string;
    unlockedAt: string;
  }>>([]);

  // Helper to persist a newly unlocked badge to history
  const addBadgeToHistory = (badgeId: string, title: string, emoji: string, category: string) => {
    setUnlockedHistory((prev) => {
      if (prev.some((item) => item.badgeId === badgeId)) return prev;
      const newItem = {
        badgeId,
        title,
        emoji,
        category,
        unlockedAt: new Date().toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      };
      const updated = [newItem, ...prev];
      localStorage.setItem("remix_corez_badge_history", JSON.stringify(updated));
      return updated;
    });
  };

  // Longest streak tracking
  const [longestStreak, setLongestStreak] = useState(0);

  // Load from local storage
  useEffect(() => {
    const storedHistory = localStorage.getItem("remix_corez_task_history");
    const storedDone = localStorage.getItem("remix_corez_tasks_done");
    const storedDay = localStorage.getItem("remix_corez_day_counter");
    const storedCompletedToday = localStorage.getItem("remix_corez_completed_today");
    const storedLongest = localStorage.getItem("remix_corez_longest_d3_streak");
    const storedBadgeHistory = localStorage.getItem("remix_corez_badge_history");
    const storedChallengeProgress = localStorage.getItem("remix_corez_challenge_progress");
    const storedActiveTasks = localStorage.getItem("remix_corez_daily_active_tasks");

    if (storedHistory) setTaskHistory(JSON.parse(storedHistory));
    if (storedDone) setTotalTasksDone(parseInt(storedDone));
    if (storedDay) setDayCounter(parseInt(storedDay));
    if (storedCompletedToday) setCompletedTaskIds(JSON.parse(storedCompletedToday));
    if (storedLongest) setLongestStreak(parseInt(storedLongest));
    if (storedChallengeProgress) {
      try {
        setChallengeProgress(JSON.parse(storedChallengeProgress));
      } catch (e) {
        console.error(e);
      }
    }
    if (storedBadgeHistory) {
      try {
        setUnlockedHistory(JSON.parse(storedBadgeHistory));
      } catch (e) {
        console.error(e);
      }
    }
    if (!storedActiveTasks && dailyActiveTasks.length > 0) {
      localStorage.setItem("remix_corez_daily_active_tasks", JSON.stringify(dailyActiveTasks));
    }
  }, []);

  // Synchronize badge history on load or updates to catch any existing achievements
  useEffect(() => {
    let changed = false;
    const historyToUpdate = [...unlockedHistory];

    const checkUnlocked = (badgeId: string) => {
      if (badgeId.startsWith("badge-")) {
        return (challengeProgress[badgeId] || 0) >= 21;
      }
      
      if (badgeId === "ach-detox-100") return (userData.detoxMinutes || 0) >= 100;
      if (badgeId === "ach-empathy-10") return (userData.moodLogs || []).length >= 10;
      if (badgeId === "ach-reflection-5") return (userData.reflections || []).length >= 5;
      if (badgeId === "ach-gardener-3") return (userData.plantStage || 0) >= 3;
      return false;
    };

    for (const b of BADGES) {
      if (checkUnlocked(b.id) && !historyToUpdate.some(item => item.badgeId === b.id)) {
        historyToUpdate.push({
          badgeId: b.id,
          title: b.title,
          emoji: b.emoji,
          category: "Thử thách 21 ngày",
          unlockedAt: new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
        });
        changed = true;
      }
    }

    for (const ach of CORE_ACHIEVEMENTS) {
      if (checkUnlocked(ach.id) && !historyToUpdate.some(item => item.badgeId === ach.id)) {
        historyToUpdate.push({
          badgeId: ach.id,
          title: ach.title,
          emoji: ach.emoji,
          category: "Thành tựu Cốt lõi",
          unlockedAt: new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
        });
        changed = true;
      }
    }

    if (changed) {
      setUnlockedHistory(historyToUpdate);
      localStorage.setItem("remix_corez_badge_history", JSON.stringify(historyToUpdate));
    }
  }, [taskHistory, totalTasksDone, userData.detoxMinutes, userData.moodLogs, userData.reflections, userData.plantStage, unlockedHistory.length, challengeProgress]);

  // Trigger confetti celebration when a badge is unlocked
  useEffect(() => {
    if (unlockedBadge) {
      // Continuous beautiful fireworks effect with canvas-confetti
      const duration = 4.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Fireworks from the left and right sides
        confetti({ 
          ...defaults, 
          particleCount, 
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ['#34D399', '#60A5FA', '#F472B6', '#FBBF24', '#A78BFA']
        });
        confetti({ 
          ...defaults, 
          particleCount, 
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ['#34D399', '#60A5FA', '#F472B6', '#FBBF24', '#A78BFA']
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [unlockedBadge]);

  // Sync longest streak on change of completed daily tasks
  useEffect(() => {
    const todayStreak = calculateD3Streak();
    const storedLongest = localStorage.getItem("remix_corez_longest_d3_streak");
    const currentLongest = storedLongest ? parseInt(storedLongest) : 0;

    if (todayStreak > currentLongest) {
      setLongestStreak(todayStreak);
      localStorage.setItem("remix_corez_longest_d3_streak", todayStreak.toString());
    } else {
      setLongestStreak(currentLongest);
    }
  }, [completedTaskIds]);

  // Helper to fetch mindfulness breathing sessions count
  const getMindfulnessCount = () => {
    const raw = localStorage.getItem("remix_corez_mindfulness_sessions");
    return raw ? parseInt(raw, 10) : 0;
  };

  // Watch for newly unlocked core achievements
  useEffect(() => {
    const achs = [
      { id: "ach-detox-100", title: "Thải Độc Bền Bỉ", emoji: "🔋" },
      { id: "ach-empathy-3", title: "Thấu Cảm Sơ Khởi", emoji: "🍃" },
      { id: "ach-empathy-10", title: "Người Thấu Cảm", emoji: "🧡" },
      { id: "ach-empathy-25", title: "Tri Kỷ Nội Tâm", emoji: "🔮" },
      { id: "ach-reflection-5", title: "Học Giả Phản Tư", emoji: "📖" },
      { id: "ach-gardener-3", title: "Người Gieo Mầm Xanh", emoji: "🌸" },
      { id: "ach-breath-3", title: "Hơi Thở Yên Bình", emoji: "🌬️" },
      { id: "ach-breath-10", title: "Hành Giả Tỉnh Thức", emoji: "🌀" },
      { id: "ach-breath-25", title: "Bậc Thầy Định Tâm", emoji: "🧘‍♀️" }
    ];

    for (const ach of achs) {
      const isUnlocked = isAchUnlocked(ach.id);
      const isAlreadyNotified = localStorage.getItem(`remix_corez_notified_${ach.id}`);
      
      if (isUnlocked && !isAlreadyNotified) {
        setUnlockedBadge(ach.title);
        setJustUnlockedBadgeId(ach.id);
        localStorage.setItem(`remix_corez_notified_${ach.id}`, "true");
        addXP(50); // Extra reward for major core achievement!
        addBadgeToHistory(ach.id, ach.title, ach.emoji, "Thành tựu Cốt lõi");
        break;
      }
    }
  }, [userData.detoxMinutes, userData.moodLogs, userData.reflections, userData.plantStage]);

  // Core achievements check helpers
  const isAchUnlocked = (id: string) => {
    if (id === "ach-detox-100") return (userData.detoxMinutes || 0) >= 100;
    if (id === "ach-empathy-3") return (userData.moodLogs || []).length >= 3;
    if (id === "ach-empathy-10") return (userData.moodLogs || []).length >= 10;
    if (id === "ach-empathy-25") return (userData.moodLogs || []).length >= 25;
    if (id === "ach-reflection-5") return (userData.reflections || []).length >= 5;
    if (id === "ach-gardener-3") return (userData.plantStage || 0) >= 3;
    
    // Mindfulness breath sessions
    const breathCount = getMindfulnessCount();
    if (id === "ach-breath-3") return breathCount >= 3;
    if (id === "ach-breath-10") return breathCount >= 10;
    if (id === "ach-breath-25") return breathCount >= 25;
    
    return false;
  };

  const getAchProgressText = (id: string) => {
    if (id === "ach-detox-100") return `${Math.min(100, userData.detoxMinutes || 0)}/100p`;
    if (id === "ach-empathy-3") return `${Math.min(3, (userData.moodLogs || []).length)}/3`;
    if (id === "ach-empathy-10") return `${Math.min(10, (userData.moodLogs || []).length)}/10`;
    if (id === "ach-empathy-25") return `${Math.min(25, (userData.moodLogs || []).length)}/25`;
    if (id === "ach-reflection-5") return `${Math.min(5, (userData.reflections || []).length)}/5`;
    if (id === "ach-gardener-3") return `Cấp ${userData.plantStage || 1}/3`;
    
    const breathCount = getMindfulnessCount();
    if (id === "ach-breath-3") return `${Math.min(3, breathCount)}/3`;
    if (id === "ach-breath-10") return `${Math.min(10, breathCount)}/10`;
    if (id === "ach-breath-25") return `${Math.min(25, breathCount)}/25`;
    
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
    // Dynamic 21-day badges are updated when day advances, but we can trigger immediate unlock alert if progress hits 21.
  };

  const triggerBadgeAlert = (badgeId: string) => {
    const badge = BADGES.find(b => b.id === badgeId);
    if (badge) {
      setUnlockedBadge(badge.title);
      setJustUnlockedBadgeId(badge.id);
      addBadgeToHistory(badge.id, badge.title, badge.emoji, "Thử thách 21 ngày");
      showCongratulationToast(badge.title, badge.emoji, badge.desc);
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
        saveChallengeProgress({
          "badge-detox": 0,
          "badge-dawn-awakener": 0,
          "badge-connection-ambassador": 0,
          "badge-mindfulness-master": 0,
          "badge-emotion-guardian": 0,
          "badge-discipline-pro": 0
        });
        const newActive = getRandomTasks(ALL_TASKS_POOL, 5);
        setDailyActiveTasks(newActive);
        localStorage.setItem("remix_corez_daily_active_tasks", JSON.stringify(newActive));
      }
      return;
    }

    const updatedProgress = { ...challengeProgress };
    
    // 1. Digital Detox Warrior (badge-detox): At least 4 D3 habits
    if (completedTaskIds.length >= 4) {
      updatedProgress["badge-detox"] = Math.min(21, (updatedProgress["badge-detox"] || 0) + 1);
    }
    // 2. Dawn Awakener (badge-dawn-awakener): any detox task completed
    const hasDetoxCompleted = dailyActiveTasks.some(t => t.category === "detox" && completedTaskIds.includes(t.id));
    if (hasDetoxCompleted) {
      updatedProgress["badge-dawn-awakener"] = Math.min(21, (updatedProgress["badge-dawn-awakener"] || 0) + 1);
    }
    // 3. Connection Ambassador (badge-connection-ambassador): any connect task completed
    const hasConnectCompleted = dailyActiveTasks.some(t => t.category === "connect" && completedTaskIds.includes(t.id));
    if (hasConnectCompleted) {
      updatedProgress["badge-connection-ambassador"] = Math.min(21, (updatedProgress["badge-connection-ambassador"] || 0) + 1);
    }
    // 4. Mindfulness Master (badge-mindfulness-master): any breath task completed
    const hasBreathCompleted = dailyActiveTasks.some(t => t.category === "breath" && completedTaskIds.includes(t.id));
    if (hasBreathCompleted) {
      updatedProgress["badge-mindfulness-master"] = Math.min(21, (updatedProgress["badge-mindfulness-master"] || 0) + 1);
    }
    // 5. Emotion Guardian (badge-emotion-guardian): any mental task completed
    const hasMentalCompleted = dailyActiveTasks.some(t => t.category === "mental" && completedTaskIds.includes(t.id));
    if (hasMentalCompleted) {
      updatedProgress["badge-emotion-guardian"] = Math.min(21, (updatedProgress["badge-emotion-guardian"] || 0) + 1);
    }
    // 6. Discipline Pro (badge-discipline-pro): 100% daily tasks done
    if (completedTaskIds.length === dailyActiveTasks.length && dailyActiveTasks.length > 0) {
      updatedProgress["badge-discipline-pro"] = Math.min(21, (updatedProgress["badge-discipline-pro"] || 0) + 1);
    }

    saveChallengeProgress(updatedProgress);

    // Alert newly unlocked badges
    Object.keys(updatedProgress).forEach(badgeId => {
      const oldVal = challengeProgress[badgeId] || 0;
      const newVal = updatedProgress[badgeId] || 0;
      if (oldVal < 21 && newVal >= 21) {
        triggerBadgeAlert(badgeId);
      }
    });

    // Pick 5 random active tasks for the new day
    const newActive = getRandomTasks(ALL_TASKS_POOL, 5);
    setDailyActiveTasks(newActive);
    localStorage.setItem("remix_corez_daily_active_tasks", JSON.stringify(newActive));

    // Advance to next day, clear daily checked list but keep totals
    saveGameState(totalXp + 50, taskHistory, totalTasksDone, dayCounter + 1, []);
    alert("Tuyệt vời! Cậu vừa bước sang ngày mới trên hành trình 21 ngày kỷ luật. Nhận ngay 50 XP thưởng động lực và tiến trình các thử thách 21 ngày đã tự động cập nhật! 🌟");
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
      saveChallengeProgress({
        "badge-detox": 0,
        "badge-dawn-awakener": 0,
        "badge-connection-ambassador": 0,
        "badge-mindfulness-master": 0,
        "badge-emotion-guardian": 0,
        "badge-discipline-pro": 0
      });
      const newActive = getRandomTasks(ALL_TASKS_POOL, 5);
      setDailyActiveTasks(newActive);
      localStorage.setItem("remix_corez_daily_active_tasks", JSON.stringify(newActive));
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
    if (badgeId.startsWith("badge-")) {
      return (challengeProgress[badgeId] || 0) >= 21;
    }
    return false;
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 px-4 font-sans relative z-10" id="gamification-module">
      {/* Canvas-based Fireworks Celebration */}
      <Fireworks isTriggered={showFireworks} onComplete={() => setShowFireworks(false)} />
      
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
                <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-3xl shadow border-4 border-white animate-bounce relative overflow-visible">
                  🏆
                  <BadgeSparkles active={true} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-xs font-mono uppercase font-bold text-amber-500 tracking-wider">Huy hiệu mới đã mở!</h4>
                  <h3 className="font-serif text-lg font-bold text-slate-800">{unlockedBadge}</h3>
                  <p className="text-[11.5px] text-slate-500 leading-relaxed font-light">
                    Kỷ luật sắt và nỗ lực đời thực của cậu đã được ghi nhận. Cậu đang lan tỏa sức mạnh tinh thần tuyệt vời!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUnlockedBadge(null);
                    setJustUnlockedBadgeId(null);
                  }}
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
            {dailyActiveTasks.map((task) => {
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

                {/* Detailed view of Longest Streak vs Current Streak */}
                <div className="grid grid-cols-2 gap-2 bg-white/45 dark:bg-white/5 p-2 rounded-xl border border-purple-500/10">
                  <div className="text-center sm:text-left sm:pl-2">
                    <span className="text-[9px] text-slate-400 block font-mono uppercase tracking-wider">Chuỗi hiện tại</span>
                    <div className="flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                      <Flame className="w-4 h-4 text-purple-600 fill-purple-600/10" />
                      <span className="text-base font-black text-purple-700 dark:text-purple-300 font-mono leading-none">
                        {d3Streak}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium">ngày</span>
                    </div>
                  </div>
                  <div className="text-center sm:text-left sm:pl-2 border-l border-purple-500/15">
                    <span className="text-[9px] text-slate-400 block font-mono uppercase tracking-wider">Kỷ lục chuỗi</span>
                    <div className="flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                      <Trophy className="w-4 h-4 text-amber-500 fill-amber-500/10" />
                      <span className="text-base font-black text-amber-600 font-mono leading-none">
                        {longestStreak}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium">ngày</span>
                    </div>
                  </div>
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
                      strokeDashoffset={2 * Math.PI * 20 - (completedTaskIds.length / (dailyActiveTasks.length || 5)) * (2 * Math.PI * 20)}
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Text inside Ring */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-black text-purple-700 dark:text-purple-300 font-mono leading-none">
                      {completedTaskIds.length}
                    </span>
                    <span className="text-[8px] text-slate-400 font-mono leading-none mt-0.5">
                      /{dailyActiveTasks.length}
                    </span>
                  </div>
                </div>

                <div className="min-w-0">
                  <h6 className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-none">Mục Tiêu Ngày</h6>
                  <p className="text-[9px] text-slate-400 dark:text-slate-400 leading-tight mt-1.5">
                    {completedTaskIds.length === dailyActiveTasks.length 
                      ? `Đã đạt ${completedTaskIds.length}/${dailyActiveTasks.length}! 🌟` 
                      : `Còn ${dailyActiveTasks.length - completedTaskIds.length} thói quen`}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* DIGITAL BADGES WALL */}
          <div className="bg-white/65 backdrop-blur-xl rounded-[28px] border border-white/40 p-5 shadow-sm space-y-3.5 flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/30 pb-2.5 gap-2">
              <div className="flex items-center gap-1.5">
                <Award className="w-4.5 h-4.5 text-emerald-500" />
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Bộ Sưu Tập Huy Chương (Badges)
                </h4>
              </div>
              
              {/* Tab Selector */}
              <div className="flex bg-slate-100/80 p-0.5 rounded-lg border border-slate-200/50 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setActiveBadgeTab("grid")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                    activeBadgeTab === "grid" 
                      ? "bg-white text-slate-800 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Tất cả ({BADGES.length + CORE_ACHIEVEMENTS.length})
                </button>
                <button
                  onClick={() => setActiveBadgeTab("history")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${
                    activeBadgeTab === "history" 
                      ? "bg-white text-slate-800 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Lịch sử đạt được
                  {unlockedHistory.length > 0 && (
                    <span className="bg-emerald-500 text-white text-[8px] px-1 rounded-full leading-none">
                      {unlockedHistory.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Badges list */}
            <div className="flex-1 overflow-y-auto pr-1 min-h-[220px]">
              {activeBadgeTab === "grid" ? (
                <div className="space-y-4">
                  {/* SECTION A: HUY HIỆU THỬ THÁCH */}
                  <div className="space-y-2">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                      Thử thách 21 ngày
                    </h5>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-2.5">
                      {BADGES.map((badge) => {
                        const isUnlocked = isBadgeUnlocked(badge.id);
                        const progress = challengeProgress[badge.id] || 0;
                        const progressText = `${progress}/21 ngày`;
                        
                        // Decide glow effect based on badge style
                        const glowClass = isUnlocked 
                          ? "shadow-[0_0_15px_rgba(16,185,129,0.25)] border-emerald-400 bg-emerald-50/70"
                          : "";

                        return (
                          <motion.div
                            whileHover={{ y: -2 }}
                            key={badge.id}
                            onClick={() => {
                              if (isUnlocked) {
                                setSparklingBadgeId(badge.id);
                                setTimeout(() => setSparklingBadgeId(null), 3000);
                              }
                            }}
                            className={`p-3 rounded-2xl border flex flex-col justify-between items-center text-center relative overflow-hidden transition-all ${
                              isUnlocked 
                                ? `${badge.bgLight} ${badge.borderColor} ${glowClass} ring-2 ring-emerald-500/10 cursor-pointer` 
                                : "bg-slate-50/50 border-slate-200/60 opacity-60 grayscale"
                            }`}
                          >
                            {/* Glow decoration for unlocked badges */}
                            {isUnlocked && (
                              <div className="absolute -right-6 -top-6 w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 opacity-20 blur-lg" />
                            )}

                            {/* Sparkling stars animation */}
                            <BadgeSparkles active={justUnlockedBadgeId === badge.id || sparklingBadgeId === badge.id} />

                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 transition-all ${
                              isUnlocked ? badge.color + " scale-110 shadow-sm" : "bg-slate-100 text-slate-300 border border-slate-200"
                            }`}>
                              {isUnlocked ? badge.emoji : <Lock className="w-5 h-5 text-slate-400" />}
                            </div>

                            <div className="mt-3 w-full flex-1 flex flex-col justify-between">
                              <div className="space-y-1">
                                <h5 className={`text-[12px] font-bold truncate ${isUnlocked ? "text-slate-800" : "text-slate-500"}`} title={badge.title}>
                                  {badge.title}
                                </h5>
                                
                                {/* Micro progress bar */}
                                <div className="w-full bg-slate-200/70 rounded-full h-1 mt-1 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? "bg-emerald-500" : "bg-slate-300"}`}
                                    style={{ width: `${(progress / 21) * 100}%` }}
                                  />
                                </div>

                                <span className={`text-[9px] font-mono block font-bold ${isUnlocked ? "text-emerald-600" : "text-slate-400"}`}>
                                  {progressText}
                                </span>

                                <p className="text-[10px] text-slate-500 line-clamp-3 leading-snug font-light h-10 mt-1">
                                  {badge.desc}
                                </p>
                              </div>

                              <div className="border-t border-slate-200/40 pt-2 mt-2">
                                <p className="text-[8px] text-slate-400 font-light italic leading-tight text-left" title={`YC: ${badge.requirement}`}>
                                  <span className="font-semibold text-slate-500">YC:</span> {badge.requirement}
                                </p>
                              </div>

                              {/* Tester Quick Increment Button */}
                              {!isUnlocked && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const nextProg = Math.min(21, progress + 1);
                                    const updated = { ...challengeProgress, [badge.id]: nextProg };
                                    saveChallengeProgress(updated);
                                    if (nextProg === 21) {
                                      triggerBadgeAlert(badge.id);
                                    }
                                  }}
                                  className="mt-2 w-full bg-white hover:bg-slate-50 border border-slate-200 active:scale-95 text-[9px] font-bold text-slate-600 py-1 px-1.5 rounded-lg transition-all"
                                >
                                  +1 Ngày Rèn Luyện
                                </button>
                              )}
                            </div>
                          </motion.div>
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
                    <div className="flex gap-3 overflow-x-auto pb-2.5 scrollbar-thin scrollbar-thumb-slate-200">
                      {CORE_ACHIEVEMENTS.map((ach) => {
                        const isUnlocked = isAchUnlocked(ach.id);
                        const progressText = getAchProgressText(ach.id);

                        return (
                          <motion.div
                            whileHover={{ y: -2 }}
                            key={ach.id}
                            onClick={() => {
                              if (isUnlocked) {
                                setSparklingBadgeId(ach.id);
                                setTimeout(() => setSparklingBadgeId(null), 3000);
                              }
                            }}
                            className={`min-w-[145px] max-w-[145px] p-3 rounded-2xl border flex flex-col justify-between items-center text-center relative overflow-hidden transition-all shrink-0 ${
                              isUnlocked 
                                ? `${ach.bgLight} ${ach.borderColor} shadow-sm cursor-pointer` 
                                : "bg-white/20 border-slate-100 opacity-60"
                            }`}
                          >
                            {/* Sparkling stars animation */}
                            <BadgeSparkles active={justUnlockedBadgeId === ach.id || sparklingBadgeId === ach.id} />

                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 ${
                              isUnlocked ? ach.color : "bg-slate-100 text-slate-300 border border-slate-200"
                            }`}>
                              {isUnlocked ? ach.emoji : <Lock className="w-4 h-4 text-slate-300" />}
                            </div>

                            <div className="mt-2 w-full flex-1 flex flex-col justify-between">
                              <div className="space-y-0.5">
                                <h5 className="text-[11px] font-bold text-slate-800 truncate" title={ach.title}>
                                  {ach.title}
                                </h5>
                                <span className="text-[9px] font-mono text-slate-400 block">
                                  {progressText}
                                </span>
                                <p className="text-[9.5px] text-slate-500 line-clamp-2 leading-tight font-light h-6">
                                  {ach.desc}
                                </p>
                              </div>
                              <p className="text-[8px] text-slate-400 font-light italic leading-none border-t border-slate-200/40 pt-1.5 mt-1.5 truncate" title={`YC: ${ach.requirement}`}>
                                YC: {ach.requirement}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* HISTORY TIMELINE VIEW */
                <div className="space-y-3 py-1.5">
                  {unlockedHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                      <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Anh chưa có lịch sử nhận huy hiệu.</p>
                      <p className="text-[9px] text-slate-400 max-w-[240px]">Hãy tiếp tục hoàn thành các thử thách hàng ngày hoặc tích lũy hoạt động chánh niệm để mở khóa huy chương đầu tiên nhé! 🌱</p>
                    </div>
                  ) : (
                    <div className="relative pl-4 border-l-2 border-slate-150 space-y-4">
                      {unlockedHistory.map((item, idx) => (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={`${item.badgeId}-${idx}`}
                          className="relative"
                        >
                          {/* Timeline dot */}
                          <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                          
                          <div className="bg-white/80 border border-slate-150 p-3 rounded-2xl flex items-center justify-between gap-3 shadow-xs hover:border-emerald-300 transition-all">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl filter drop-shadow-sm">{item.emoji}</span>
                              <div>
                                <h6 className="text-[11px] font-bold text-slate-800">
                                  Đã đạt: {item.title}
                                </h6>
                                <p className="text-[9px] text-slate-400 font-mono">
                                  Phân loại: {item.category}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[9px] text-emerald-600 bg-emerald-50 font-bold px-2 py-0.5 rounded-md border border-emerald-100">
                                Thành công ✨
                              </span>
                              <p className="text-[8px] text-slate-400 mt-1">{item.unlockedAt}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick footer alert */}
            <div className="pt-2 text-center text-[9px] text-slate-400 font-light border-t border-slate-150/40 space-y-1">
              <p>*Huy hiệu rèn luyện giúp khẳng định bản lĩnh thực tại và thói quen tích cực.</p>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-100/50 dark:border-emerald-900/30">
                <span className="font-bold">Thử thách lan tỏa:</span> Chụp màn hình thẻ bài của cậu rồi đăng lên story kèm hashtag #CoreZLangSon để truyền cảm hứng làn sóng sống khỏe đời thực nhé! 🌱
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* E-Cards Touch Your Ego / Cham Vao Ban Nga (Vong 4: Hanh dong) */}
      <div className="mt-8">
        <ECardsDaily />
      </div>

      {/* 30-Day Digital Detox Chart */}
      <div className="mt-6">
        <DigitalDetoxChart />
      </div>

      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } }}
              className="pointer-events-auto w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-4 shadow-[0_10px_30px_rgba(16,185,129,0.15)] flex gap-3.5 relative overflow-hidden ring-1 ring-black/5"
            >
              {/* Sparkle background glow */}
              <div className="absolute -right-10 -bottom-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              
              {/* Icon / Emoji circle */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-100 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                {toast.emoji}
              </div>
              
              {/* Text details */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
                    MỞ KHÓA THỬ THÁCH 🎉
                  </span>
                  <button 
                    onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors pointer-events-auto"
                  >
                    <X className="w-3.5 h-3.5" strokeWidth={2.5} />
                  </button>
                </div>
                <h4 className="text-[13px] font-bold text-slate-950 dark:text-white leading-tight">
                  {toast.title}
                </h4>
                <p className="text-[10.5px] leading-normal font-light text-slate-500 dark:text-slate-400">
                  Chúc mừng cậu đã kiên trì hoàn thành 21 ngày rèn luyện: <span className="font-semibold text-slate-600 dark:text-slate-300">"{toast.desc}"</span>. Thật đáng tự hào! 🌟
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
