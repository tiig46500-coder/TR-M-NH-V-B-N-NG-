import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
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
import CommunityAcceptanceD2 from "./CommunityAcceptanceD2";

const INSPIRE_QUOTES = [
  {
    text: "Được sống làm người quý giá thật. Nhưng được sống là chính mình với những giá trị mình theo đuổi và vốn có càng quý giá hơn. Con người phải biết luôn luôn vượt qua những nghịch cảnh với chính bản thân mình để hoàn thiện nhân cách và hướng tới những giá trị cao cả trong tâm hồn.",
    author: "MC Khánh Vy (Trích thông điệp \"Hồn Trương Ba, da hàng thịt\")"
  },
  {
    text: "Ở đời này không có con đường cùng, chỉ có những ranh giới, điều cốt yếu là phải có sức mạnh để bước qua ranh giới ấy.",
    author: "Nhà văn Nguyễn Khải (Trích \"Mùa lạc\")"
  },
  {
    text: "Một con người có thể bị hủy diệt, nhưng không thể bị đánh bại.",
    author: "Nhà văn Ernest Hemingway (Trích \"Ông già và biển cả\")"
  },
  {
    text: "Điều kỳ diệu sẽ xảy ra nếu chúng ta không bao giờ bỏ cuộc bởi vì vũ trụ luôn biết lắng nghe một trái tim ngoan cường.",
    author: "Á hậu Madison Anderson"
  }
];

const GEMINI_API_KEY = "ĐIỀN_KEY_CỦA_BẠN_VÀO_ĐÂY";

const playSparklingChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const playNote = (freq: number, delay: number, duration: number, vol: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + duration);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };

    // A beautiful, sparkling upward arpeggio
    const notes = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02, 3135.96]; // C6, E6, G6, C7, E7, G7
    notes.forEach((freq, index) => {
      playNote(freq, index * 0.06, 0.6, 0.12 - (index * 0.01));
    });
  } catch (error) {
    console.error("Failed to play sparkling chime sound:", error);
  }
};

export default function Space4D() {
  const [activeSubTab, setActiveSubTab] = useState<"define" | "devirtualize" | "detox" | "do">("define");

  // ==========================================
  // Tab 1: Define (Định vị) State & Logic
  // ==========================================
  const [defineStep, setDefineStep] = useState(0);
  const [defineAnswers, setDefineAnswers] = useState<number[]>([]);
  const [defineResult, setDefineResult] = useState<{ title: string; icon: string; desc: string } | null>(null);

  const quizData = [
    // Chặng 1: Khán giả tưởng tượng
    {
      stage: "Chặng 1: Khán giả tưởng tượng",
      question: "Khi đăng một story/video lên mạng nhưng sau 1 tiếng chỉ lác đác vài người xem, phản xạ chân thực nhất của cậu là gì?",
      options: [
        { text: "Lập tức xóa hoặc ẩn đi vì thấy 'quê' và sợ người khác đánh giá.", value: 1 },
        { text: "Cảm thấy hơi buồn và bứt rứt, liên tục vào check lại xem có tăng view không.", value: 2 },
        { text: "Bình thường. Đăng vì muốn lưu lại khoảnh khắc của mình thôi.", value: 3 }
      ]
    },
    {
      stage: "Chặng 1: Khán giả tưởng tượng",
      question: "Cậu có thường xuyên xem lại trang cá nhân của mình và 'đóng vai' người khác để tự đánh giá xem profile của mình trông có ngầu không?",
      options: [
        { text: "Rất thường xuyên, mình luôn muốn kiểm soát hình ảnh hoàn hảo nhất.", value: 1 },
        { text: "Thỉnh thoảng, nhất là sau khi vừa kết bạn với một người mới.", value: 2 },
        { text: "Hầu như không, mình sao thì trên mạng vậy.", value: 3 }
      ]
    },
    // Chặng 2: Mảnh ghép đứt gãy
    {
      stage: "Chặng 2: Mảnh ghép đứt gãy",
      question: "Khi kết thúc một đợt 'lướt vô thức' (vuốt điện thoại liên tục hàng giờ liền), cậu thường đối diện với cảm giác nào?",
      options: [
        { text: "Trống rỗng, hối hận vì mất thời gian nhưng lần sau vẫn lặp lại.", value: 1 },
        { text: "Chóng mặt, mỏi mắt và cảm thấy bản thân đang bị thụ động.", value: 2 },
        { text: "Ít khi bị lướt vô thức, mình thường lên mạng có chủ đích rồi thoát.", value: 3 }
      ]
    },
    {
      stage: "Chặng 2: Mảnh ghép đứt gãy",
      question: "Nếu ngày mai toàn bộ MXH biến mất, cậu nghĩ 'cái tôi' ngoài đời thực của cậu còn lại gì?",
      options: [
        { text: "Hoang mang cực độ, cảm thấy như mất đi danh tính và kết nối xã hội.", value: 1 },
        { text: "Hụt hẫng một chút nhưng sẽ từ từ tìm lại các sở thích cũ bị bỏ quên.", value: 2 },
        { text: "Thấy nhẹ nhõm vì được quay lại sống trọn vẹn với hiện tại.", value: 3 }
      ]
    },
    // Chặng 3: Chạm vào "Gốc rễ"
    {
      stage: "Chặng 3: Chạm vào Gốc rễ",
      question: "Có một nét văn hóa mộc mạc của quê hương (VD: ăn phở chua quán vỉa hè, đi chợ phiên xứ Lạng) mà cậu rất thích, cậu có dám chia sẻ nó lên mạng không?",
      options: [
        { text: "Không dám, sợ phá hỏng hình tượng 'sang chảnh' hoặc sợ không ai quan tâm.", value: 1 },
        { text: "Sẽ đăng nhưng phải dùng filter chỉnh sửa thật kỹ hoặc lồng nhạc đang trend.", value: 2 },
        { text: "Tự hào chia sẻ luôn, đó là một phần bản sắc thật của mình.", value: 3 }
      ]
    },
    {
      stage: "Chặng 3: Chạm vào Gốc rễ",
      question: "Khi thấy bạn bè đồng trang lứa khoe đồ hiệu, check-in sang chảnh, cậu có xu hướng giấu đi hoàn cảnh thực tế của mình không?",
      options: [
        { text: "Có, mình luôn cố gắng thể hiện trên mạng rằng mình cũng không thua kém ai.", value: 1 },
        { text: "Cảm thấy hơi áp lực đồng trang lứa (peer pressure) và tự ti đôi chút.", value: 2 },
        { text: "Không quan tâm lắm, mỗi người một xuất phát điểm và giá trị riêng.", value: 3 }
      ]
    }
  ];

  const handleDefineAnswer = (val: number) => {
    const nextAnswers = [...defineAnswers, val];
    setDefineAnswers(nextAnswers);

    if (defineStep < 5) {
      setDefineStep(defineStep + 1);
    } else {
      // Calculate scores based on the new 1-2-3 values
      const count1 = nextAnswers.filter((x) => x === 1).length;
      const count2 = nextAnswers.filter((x) => x === 2).length;
      const count3 = nextAnswers.filter((x) => x === 3).length;

      let res = {
        title: "Lệ thuộc lớn vào 'Cái tôi ảo' 📱",
        icon: "📱",
        desc: "Cậu đang có xu hướng phụ thuộc nhiều vào hình ảnh ảo trên mạng xã hội, dễ lo lắng và bất an trước sự đánh giá của người khác. Hãy nhớ rằng các con số ảo không bao giờ định nghĩa được giá trị tuyệt vời và độc bản của cậu ở đời thực!"
      };

      if (count2 >= count1 && count2 >= count3) {
        res = {
          title: "Trạng thái 'Chông chênh' ⚖️",
          icon: "⚖️",
          desc: "Cậu đang ở trạng thái chông chênh, thỉnh thoảng chịu áp lực từ mạng xã hội nhưng vẫn có ý thức muốn tìm lại chính mình. Đây là bước đệm tuyệt vời để cậu thiết lập các ranh giới số lành mạnh hơn."
        };
      } else if (count3 >= count1 && count3 >= count2) {
        res = {
          title: "Nhận thức tốt về 'Cái tôi thực' 🌿",
          icon: "🌿",
          desc: "Tuyệt vời lắm! Cậu sở hữu nhận thức sâu sắc về giá trị thực của bản thân và ít chịu ảnh hưởng từ thế giới ảo. Cậu biết trân trọng những nét đẹp mộc mạc xung quanh và kiên định với lối sống lành mạnh."
        };
      }

      setDefineResult(res);
      setDefineStep(6);
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
  const [detoxTasks, setDetoxTasks] = useState(() => {
    const saved = localStorage.getItem("remix_corez_detox_tasks");
    return saved ? JSON.parse(saved) : {
      unfollowedToxic: false,       // D3-1
      interactedPositive: false,    // D3-2
      grayscaleChallenge: false,    // D3-3
      disableNotifications: false,  // D3-4
      bedtimeCurfew: false,         // D3-5
      activatedLimit: false,        // D3-6
    };
  });
  const [dailyOnlineLimit, setDailyOnlineLimit] = useState<number>(() => {
    const saved = localStorage.getItem("remix_corez_daily_online_limit");
    return saved ? parseFloat(saved) : 1.5;
  });

  const [isInspireModalOpen, setIsInspireModalOpen] = useState(false);
  const [hasAutoPopped, setHasAutoPopped] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(INSPIRE_QUOTES[0]);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState("");
  const [isLoadingGemini, setIsLoadingGemini] = useState(false);

  // New states for the requested dynamic quote and gift open tracking
  const [isGiftOpen, setIsGiftOpen] = useState(false);
  const [dynamicQuote, setDynamicQuote] = useState("");
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  // useEffect to fetch dynamic quotes when isGiftOpen is true
  React.useEffect(() => {
    if (isGiftOpen) {
      const fetchDynamicQuote = async () => {
        setIsLoadingQuote(true);
        setDynamicQuote("");
        
        const apiKey = GEMINI_API_KEY !== "ĐIỀN_KEY_CỦA_BẠN_VÀO_ĐÂY" && GEMINI_API_KEY ? GEMINI_API_KEY : "";
        const promptText = 'Hãy viết một câu trích dẫn ngắn gọn (dưới 40 từ), truyền cảm hứng, chữa lành và tạo động lực cho Gen Z đang bị áp lực học tập. Định dạng: "Câu trích dẫn" - Tên tác giả (nếu có, hoặc ghi - Thông điệp từ Vũ trụ)';

        try {
          if (apiKey) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
              }),
            });
            
            if (response.ok) {
              const data = await response.json();
              const textResult = data.candidates?.[0]?.content?.parts?.[0]?.text;
              if (textResult) {
                setDynamicQuote(textResult.trim());
                return;
              }
            }
          }
          
          // Fallback to Express backend if no direct API key is set or if Direct API call failed
          const res = await fetch("/api/gemini-inspire-card", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quote: promptText }),
          });
          
          if (!res.ok) throw new Error("Fallback API call failed");
          const data = await res.json();
          setDynamicQuote(data.reply);
        } catch (err) {
          console.error("Gemini call error:", err);
          const fallbacks = [
            "“ Đừng so sánh chương 1 của mình với chương 20 của người khác. Mỗi người đều có một múi giờ và lộ trình rực rỡ của riêng mình. ” — Thông điệp từ Vũ trụ ✨",
            "“ Cậu không cần phải gánh cả thế giới trên vai hôm nay. Hãy cứ bước từng bước nhỏ, vũ trụ sẽ luôn ôm lấy nỗ lực của cậu. ” — Thông điệp từ Vũ trụ ✨",
            "“ Áp lực tạo nên kim cương, nhưng kim cương cũng cần được bảo vệ để không vỡ vụn. Cho phép bản thân nghỉ ngơi là một sự dũng cảm. ” — Thông điệp từ Vũ trụ ✨",
            "“ Hãy kiên nhẫn với chính mình. Những bông hoa đẹp nhất thường cần thời gian lâu nhất để nở rộ rực rỡ. ” — Thông điệp từ Vũ trụ ✨"
          ];
          const randFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
          setDynamicQuote(randFallback);
        } finally {
          setIsLoadingQuote(false);
        }
      };
      
      fetchDynamicQuote();
    } else {
      setIsLoadingQuote(false);
      setDynamicQuote("");
    }
  }, [isGiftOpen]);

  const fetchInspireMessage = async (quoteText: string) => {
    setIsLoadingGemini(true);
    setGeminiResponse("");
    try {
      const res = await fetch("/api/gemini-inspire-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quote: quoteText }),
      });
      if (!res.ok) throw new Error("API call failed");
      const data = await res.json();
      setGeminiResponse(data.reply);
    } catch (err) {
      console.error(err);
      setGeminiResponse("Tớ biết con đường cậu đi không hề dễ dàng, nhưng từng bước chân kiên trì của cậu đều lấp lánh như ngàn tinh tú. Hôm nay hãy dành 10 phút tĩnh lặng để tri ân nỗ lực của chính mình nhé! Tớ luôn tin ở cậu. 🌌✨");
    } finally {
      setIsLoadingGemini(false);
    }
  };

  const openInspireModalManually = () => {
    playSparklingChime();
    const randomQuote = INSPIRE_QUOTES[Math.floor(Math.random() * INSPIRE_QUOTES.length)];
    setSelectedQuote(randomQuote);
    setCardFlipped(false);
    setIsInspireModalOpen(true);
    setIsGiftOpen(true);
    fetchInspireMessage(`"${randomQuote.text}" - ${randomQuote.author}`);
  };

  const toggleDetoxTask = (key: keyof typeof detoxTasks) => {
    setDetoxTasks(prev => {
      const updated = {
        ...prev,
        [key]: !prev[key]
      };
      localStorage.setItem("remix_corez_detox_tasks", JSON.stringify(updated));
      return updated;
    });
  };

  React.useEffect(() => {
    localStorage.setItem("remix_corez_daily_online_limit", dailyOnlineLimit.toString());
  }, [dailyOnlineLimit]);

  const completedDetoxCount = Object.values(detoxTasks).filter(Boolean).length;
  const detoxProgressPercent = Math.round((completedDetoxCount / 6) * 100);

  // Streak & Date persistence logic for D3 actions
  React.useEffect(() => {
    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local format
    let savedDates: string[] = [];
    try {
      const stored = localStorage.getItem("remix_corez_d3_dates");
      if (stored) {
        savedDates = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }

    if (completedDetoxCount >= 5) {
      if (!savedDates.includes(todayStr)) {
        savedDates.push(todayStr);
        localStorage.setItem("remix_corez_d3_dates", JSON.stringify(savedDates));
      }
    } else {
      if (savedDates.includes(todayStr)) {
        savedDates = savedDates.filter(d => d !== todayStr);
        localStorage.setItem("remix_corez_d3_dates", JSON.stringify(savedDates));
      }
    }
  }, [detoxTasks, completedDetoxCount]);

  // Auto-trigger Inspiring Card Modal on reaching 100% completed tasks (6/6)
  React.useEffect(() => {
    if (completedDetoxCount === 6) {
      if (!hasAutoPopped) {
        playSparklingChime();
        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 }
          });
        } catch (err) {
          console.error("Confetti error:", err);
        }
        const randomQuote = INSPIRE_QUOTES[Math.floor(Math.random() * INSPIRE_QUOTES.length)];
        setSelectedQuote(randomQuote);
        setCardFlipped(false);
        setIsInspireModalOpen(true);
        setIsGiftOpen(true);
        setHasAutoPopped(true);
        fetchInspireMessage(`"${randomQuote.text}" - ${randomQuote.author}`);
      }
    } else {
      // If completed tasks drop below 6, allow auto-popping again when they reach 6
      setHasAutoPopped(false);
    }
  }, [completedDetoxCount, hasAutoPopped]);

  // Reset logic: close the gift modal when changing tabs/sections
  React.useEffect(() => {
    setIsInspireModalOpen(false);
    setIsGiftOpen(false);
  }, [activeSubTab]);

  // Streak calculator helper
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

  const currentD3Streak = calculateD3Streak();

  const resetDetox = () => {
    setDetoxTasks({
      unfollowedToxic: false,
      interactedPositive: false,
      grayscaleChallenge: false,
      disableNotifications: false,
      bedtimeCurfew: false,
      activatedLimit: false,
    });
    localStorage.removeItem("remix_corez_detox_tasks");
    localStorage.removeItem("remix_corez_d3_dates");
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
                  Trả lời nhanh 6 câu hỏi soi chiếu tâm lý chia làm 3 chặng để định vị mối quan hệ giữa cậu và không gian số.
                </p>
              </div>

              {defineStep < 6 ? (
                <div className="max-w-xl mx-auto py-2">
                  <div className="flex justify-between items-center text-xs text-slate-400 mb-3 font-mono">
                    <span className="text-emerald-600 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100/40 uppercase text-[9px] tracking-wide">
                      {quizData[defineStep].stage}
                    </span>
                    <span>Bước {defineStep + 1} / 6</span>
                  </div>

                  <h4 className="font-serif text-base sm:text-lg font-medium text-slate-700 leading-relaxed mb-6">
                    “ {quizData[defineStep].question} ”
                  </h4>

                  <div className="space-y-3">
                    {quizData[defineStep].options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => handleDefineAnswer(opt.value)}
                        className="w-full text-left p-4 rounded-2xl border border-white/40 bg-white/40 backdrop-blur-sm hover:border-[#34D399] hover:bg-[#34D399]/10 text-slate-600 text-sm sm:text-base transition-all flex items-center gap-3.5 hover:translate-x-1 hover:shadow-sm cursor-pointer"
                      >
                        <span className="w-6.5 h-6.5 rounded-full bg-white/85 text-slate-500 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-150">
                          {String.fromCharCode(65 + optIdx)}
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
                    className="max-w-xl mx-auto text-center py-6 space-y-5"
                  >
                    <div className="text-5xl mb-2 animate-bounce">{defineResult.icon}</div>
                    
                    <h4 className="font-serif text-2xl font-bold text-slate-800 mb-1">
                      Hoàn tất soi chiếu D1!
                    </h4>

                    <div className="bg-emerald-50/70 border border-emerald-100/50 rounded-2xl p-4 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                        KẾT QUẢ SOI CHIẾU
                      </span>
                      <p className="text-base font-bold text-slate-800">
                        {defineResult.title}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {defineResult.desc}
                      </p>
                    </div>

                    <div className="bg-white/40 backdrop-blur-sm p-4.5 rounded-2xl border border-white/40 shadow-sm text-justify">
                      <p className="text-sm text-slate-700 leading-relaxed font-sans">
                        Cảm ơn cậu đã dũng cảm đối diện với chiếc gương tâm lý. Những con số trên mạng có thể bị thuật toán thao túng, nhưng sự chân thực của cậu ở đây là duy nhất. Dữ liệu Định Vị đã được lưu trữ.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                      <button
                        onClick={resetDefine}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:text-slate-800 hover:bg-slate-50 text-xs font-semibold text-slate-500 transition-all cursor-pointer"
                      >
                        Thực hiện lại
                      </button>
                      <button
                        onClick={() => setActiveSubTab("devirtualize")}
                        className="px-6 py-2.5 rounded-xl bg-[#34D399] hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md hover:scale-[1.02] cursor-pointer"
                      >
                        Sẵn sàng bước sang Vòng 2: Chấp Nhận
                      </button>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          )}

          {/* TAB 2: DE-VIRTUALIZE / CHẤP NHẬN & VŨ TRỤ 4D */}
          {activeSubTab === "devirtualize" && (
            <motion.div
              key="devirtualize-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <CommunityAcceptanceD2 />
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

                  {currentD3Streak > 0 ? (
                    <div className="mt-3.5 flex items-center gap-1.5 bg-purple-50 text-purple-600 px-3.5 py-2 rounded-full border border-purple-100 text-[11px] font-bold shadow-sm">
                      <span className="text-xs animate-bounce">🔥</span>
                      <span>Chuỗi {currentD3Streak} ngày Digital Minimalist 🕶️</span>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-2.5 text-center italic leading-relaxed">
                      Hoàn thành 5/6 thói quen hôm nay để kích hoạt chuỗi Digital Minimalist 🕶️
                    </p>
                  )}

                  {completedDetoxCount === 6 && (
                    <button
                      onClick={openInspireModalManually}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-purple-600 hover:from-amber-500 hover:via-orange-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-full font-bold text-xs shadow-md border border-amber-300/30 transition-all transform hover:scale-[1.03] active:scale-95 cursor-pointer"
                    >
                      <span className="animate-pulse">🔮</span>
                      <span>Mở Quà Vũ Trụ</span>
                    </button>
                  )}
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
                  Vòng D4: Hành động (Kiến Tạo Bản Ngã Thực)
                </span>
                <h3 className="font-serif text-xl font-bold text-slate-800 flex items-center gap-2 mt-2">
                  <MapPin className="w-5 h-5 text-[#34D399]" />
                  D4 - Hành động & Bộ E-Cards “Chạm Vào Bản Ngã”
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Đóng màn hình ảo, bước vào các hành động kiến tạo thói quen văn minh, trải nghiệm Bộ Thẻ Bài Điện Tử Chạm Vào Bản Ngã và tham quan các địa danh thực tại hùng vĩ tại Lạng Sơn để thanh lọc tâm trí hoàn toàn.
                </p>
              </div>

              {/* CÔNG CỤ ĐẶC BIỆT VÒNG D4: HÀNH ĐỘNG D4 */}

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

        {/* Inspiring Card Modal Pop-up */}
        <AnimatePresence>
          {activeSubTab === "detox" && isInspireModalOpen && (
            <div 
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => { setIsInspireModalOpen(false); setIsGiftOpen(false); }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="bg-slate-900/95 border border-amber-300/30 text-white rounded-[32px] p-6 text-center max-w-sm w-full shadow-2xl relative overflow-hidden space-y-5"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Decorative particles background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_50%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.08),transparent_50%)] pointer-events-none" />

                <div className="relative z-10 space-y-1">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-400/20 flex items-center justify-center mx-auto mb-2 animate-bounce">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-orange-300 to-purple-300 font-sans uppercase tracking-wider">
                    Bảo Vệ Tâm Trí Hoàn Hảo!
                  </h3>
                  <p className="text-[11px] text-slate-300 font-light leading-relaxed max-w-[280px] mx-auto">
                    Chúc mừng cậu đã hoàn thành xuất sắc việc bảo vệ tâm trí hôm nay! Đây là món quà vũ trụ gửi đến cậu ✨
                  </p>
                </div>

                {/* 3D Flip Card Container */}
                <div 
                  className="w-full h-80 mx-auto [perspective:1000px] cursor-pointer my-4 no-dark-override"
                  onClick={() => {
                    if (!cardFlipped) {
                      try {
                        confetti({
                          particleCount: 120,
                          spread: 80,
                          origin: { y: 0.6 }
                        });
                      } catch (err) {
                        console.error("Confetti error:", err);
                      }
                    }
                    setCardFlipped(!cardFlipped);
                  }}
                >
                  <div className={`relative w-full h-full transition-all duration-700 [transform-style:preserve-3d] no-dark-override ${cardFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                    
                    {/* FRONT SIDE */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl border border-amber-300/30 bg-gradient-to-br from-slate-800 to-slate-900 p-6 flex flex-col justify-between shadow-xl [backface-visibility:hidden] text-left no-dark-override">
                      <div className="flex justify-between items-center text-[9px] font-mono text-amber-300/65 tracking-wider font-semibold no-dark-override">
                        <span className="no-dark-override">MẶT TRƯỚC 🌌</span>
                        <span className="no-dark-override">TRẠM ĐỊNH VỊ BẢN NGÃ</span>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-center items-center py-4 text-center no-dark-override">
                        <span className="text-3xl mb-3 animate-pulse no-dark-override">🌟</span>
                        <p className="text-slate-100 font-medium text-xs leading-relaxed italic px-2 font-serif no-dark-override">
                          "{selectedQuote.text}"
                        </p>
                        <span className="text-[10px] text-amber-300/80 font-bold mt-3 block no-dark-override">
                          — {selectedQuote.author}
                        </span>
                      </div>

                      <div className="text-center text-[9px] text-slate-400 font-mono tracking-widest animate-pulse no-dark-override">
                        CHẠM ĐỂ NHẬN QUÀ COREZ 🔮
                      </div>
                    </div>

                    {/* BACK SIDE */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl border border-purple-400/30 bg-gradient-to-br from-slate-800 to-indigo-950 p-6 flex flex-col justify-between shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] text-left no-dark-override">
                      <div className="flex justify-between items-center text-[9px] font-mono text-purple-300/65 tracking-wider font-semibold no-dark-override">
                        <span className="no-dark-override">MẶT SAU 💫</span>
                        <span className="uppercase font-bold text-amber-200 no-dark-override">#COREZ ĐỒNG HÀNH CHỮA LÀNH, TÌM LẠI BẢN SẮC CÁ NHÂN</span>
                      </div>

                      <div className="flex-1 flex flex-col justify-center items-center py-4 text-center no-dark-override">
                        {isLoadingQuote ? (
                          <div className="space-y-3 flex flex-col items-center no-dark-override">
                            <span className="text-2xl animate-spin text-purple-400 no-dark-override">✨</span>
                            <p className="text-purple-300 font-mono text-[11px] tracking-wider animate-pulse no-dark-override">
                              Vũ trụ đang gửi thông điệp đến cậu... ✨
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2 overflow-y-auto max-h-48 pr-1 flex flex-col justify-center h-full no-dark-override">
                            <p className="text-slate-100 text-[11px] leading-relaxed text-justify whitespace-pre-line px-1 font-sans no-dark-override">
                              {dynamicQuote || "Chúc cậu một ngày bình yên và tràn ngập năng lượng tích cực! ✨"}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-center text-[9px] text-slate-400 font-mono tracking-widest no-dark-override">
                        CHẠM ĐỂ QUAY LẠI MẶT TRƯỚC 🔄
                      </div>
                    </div>

                  </div>
                </div>

                <div className="flex justify-center pt-1">
                  <button
                    onClick={() => { setIsInspireModalOpen(false); setIsGiftOpen(false); }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl font-bold text-xs border border-slate-700 transition-all cursor-pointer active:scale-95"
                  >
                    Đóng quà tặng
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
