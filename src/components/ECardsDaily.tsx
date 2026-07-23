import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  CheckCircle2, 
  Shuffle, 
  MessageCircle, 
  ShieldCheck, 
  Bookmark, 
  X,
  Copy,
  Check,
  Trophy,
  Utensils,
  Heart,
  GraduationCap,
  Sprout,
  Users,
  Compass,
  Zap,
  RotateCw,
  Home,
  BookOpen,
  Smile,
  Ear,
  Edit3,
  WifiOff,
  UserCheck,
  HelpCircle,
  Send,
  Lock,
  Layers,
  Award
} from "lucide-react";
import { useUserData } from "../context/UserContext";
import { saveFavoritePost } from "./GocBinhYen";
import confetti from "canvas-confetti";

export interface ECardItem {
  id: string;
  category: "family" | "school" | "friends" | "self"; // Chủ đề
  categoryTag: string; // Tên hiển thị chủ đề e.g. "GIA ĐÌNH", "NHÀ TRƯỜNG"
  categoryBadge: string; // e.g. "🏡 Gia đình"
  icon: string; // Key icon string
  title: string; // Tên thẻ / Nhiệm vụ thực tế
  xp: number;
  taskDetail: string; // Nhiệm vụ thực tế chi tiết
  dialogueSample: string; // Mẫu lời thoại gợi ý
  psychologicalBasis: string; // Cơ sở tâm lý chữa lành tổn thương bản ngã
  targetRole: string; // Đối tượng hướng tới
}

export const E_CARD_CATEGORIES = [
  { id: "all", label: "Tất cả", icon: "🌟", desc: "Xem toàn bộ 16 thẻ bài" },
  { id: "family", label: "Gia đình", icon: "🏡", desc: "Phá băng khoảng cách với bố mẹ, người thân" },
  { id: "school", label: "Nhà trường", icon: "🏫", desc: "Giải tỏa áp lực học tập, tương tác thầy cô" },
  { id: "friends", label: "Bè bạn", icon: "🤝", desc: "Thấu hiểu bạn bè, chữa lành mâu thuẫn" },
  { id: "self", label: "Bản thân", icon: "🪞", desc: "Phản tư & đối thoại nội tâm" },
];

export const ALL_E_CARDS: ECardItem[] = [
  // 1. GIA ĐÌNH (FAMILY)
  {
    id: "card-fam-1",
    category: "family",
    categoryTag: "GIA ĐÌNH",
    categoryBadge: "🏡 Gia đình",
    icon: "utensils",
    title: "Phá băng bàn ăn gia đình",
    xp: 15,
    taskDetail: "Cất điện thoại sang một bên 30 phút trong bữa cơm gia đình và chủ động trò chuyện với bố mẹ.",
    dialogueSample: "Ba/Mẹ ơi, hôm nay con cất điện thoại sang một bên để ăn cơm cùng nhà. Ba mẹ kể cho con nghe ngày xưa tuổi xì-tin ba mẹ có kỷ niệm gì vui nhất không?",
    psychologicalBasis: "Chữa lành tổn thương do thiếu hụt sự hiện diện thực tế (Presence Deficit), củng cố cảm giác gia đình là bệ đỡ an toàn.",
    targetRole: "Cha mẹ & Con cái"
  },
  {
    id: "card-fam-2",
    category: "family",
    categoryTag: "GIA ĐÌNH",
    categoryBadge: "🏡 Gia đình",
    icon: "heart",
    title: "Gương mặt thật của con",
    xp: 15,
    taskDetail: "Bộc lộ nỗi sợ hoặc sự mệt mỏi thực sự với cha mẹ thay vì giả vờ 'con vẫn ổn'.",
    dialogueSample: "Hôm nay con cảm thấy hơi mệt mỏi và chông chênh. Con không muốn giấu cảm xúc nữa. Mẹ có thể ôm con 10 giây mà không cần khuyên bảo gì không?",
    psychologicalBasis: "Bộc lộ tổn thương bản ngã chông chênh, gỡ bỏ chiếc mặt nạ gượng gạo trên mạng xã hội để đón nhận tình thương thực tế.",
    targetRole: "Cha mẹ & Con cái"
  },
  {
    id: "card-fam-3",
    category: "family",
    categoryTag: "GIA ĐÌNH",
    categoryBadge: "🏡 Gia đình",
    icon: "send",
    title: "Gửi tin nhắn biết ơn bất ngờ",
    xp: 15,
    taskDetail: "Gửi 1 tin nhắn ngắn cảm ơn cha mẹ vì một hành động nhỏ họ làm cho bạn hằng ngày.",
    dialogueSample: "Mẹ ơi, hôm nay món trứng chiên mẹ nấu ngon lắm ạ. Cảm ơn mẹ dạo này luôn kiên nhẫn nấu cơm cho con dù công việc bận rộn!",
    psychologicalBasis: "Nuôi dưỡng lòng biết ơn thực tế, phá vỡ khoảng cách thế hệ và kích hoạt hoóc-môn hạnh phúc Oxytocin.",
    targetRole: "Cha mẹ & Con cái"
  },
  {
    id: "card-fam-4",
    category: "family",
    categoryTag: "GIA ĐÌNH",
    categoryBadge: "🏡 Gia đình",
    icon: "home",
    title: "Trang trí góc nhà cùng người thân",
    xp: 15,
    taskDetail: "Cùng cha mẹ hoặc anh chị em dọn dẹp hoặc trang trí lại một góc nhỏ trong nhà mà không dùng điện thoại.",
    dialogueSample: "Mẹ ơi, chiều nay hai mẹ con mình cùng lau dọn góc ban công này rồi trồng thêm vài chậu cây nhỏ nhé!",
    psychologicalBasis: "Tăng cường kết nối tương tác thể chất thực tế, giảm thiểu xao nhãng bởi sóng số.",
    targetRole: "Gia đình & Người thân"
  },

  // 2. NHÀ TRƯỜNG (SCHOOL)
  {
    id: "card-sch-1",
    category: "school",
    categoryTag: "NHÀ TRƯỜNG",
    categoryBadge: "🏫 Nhà trường",
    icon: "school",
    title: "Mở lòng với Thầy Cô giáo",
    xp: 15,
    taskDetail: "Chủ động gặp thầy/cô bộ môn sau giờ học để chia sẻ về khó khăn tập trung hoặc áp lực điểm số.",
    dialogueSample: "Thầy/Cô ơi, em rất muốn cố gắng môn học này nhưng dạo này tâm trí em hơi xao nhãng. Em xin phép thầy/cô hướng dẫn em cách tập trung lại ạ.",
    psychologicalBasis: "Tái khẳng định giá trị bản thân, gỡ bỏ rào cản tự ti và xây dựng mối liên kết tin cậy giữa thầy cô và học sinh.",
    targetRole: "Thầy Cô & Học sinh"
  },
  {
    id: "card-sch-2",
    category: "school",
    categoryTag: "NHÀ TRƯỜNG",
    categoryBadge: "🏫 Nhà trường",
    icon: "users",
    title: "Gợi ý giờ giải lao 'No-Phone'",
    xp: 15,
    taskDetail: "Rủ các bạn trong bàn học gạt điện thoại sang một bên 15 phút giờ ra chơi để chơi trò đố vui hoặc trò chuyện.",
    dialogueSample: "Này các cậu, ra chơi 15 phút này tụi mình cất máy đi, chơi trò đố vui hoặc kể chuyện xem tuần này ai gặp chuyện mắc cười nhất nào!",
    psychologicalBasis: "Giảm thiểu so sánh áp lực đồng lứa (Peer Pressure) và giảm triệu chứng cô lập học đường.",
    targetRole: "Học sinh & Bạn cùng lớp"
  },
  {
    id: "card-sch-3",
    category: "school",
    categoryTag: "NHÀ TRƯỜNG",
    categoryBadge: "🏫 Nhà trường",
    icon: "help",
    title: "Chủ động đặt câu hỏi trong lớp",
    xp: 15,
    taskDetail: "Giơ tay hỏi thầy cô một thắc mắc trong bài học thay vì giấu giếm nỗi sợ bị bạn bè đánh giá.",
    dialogueSample: "Thầy ơi, phần công thức này em chưa hiểu rõ đoạn chuyển tiếp. Thầy có thể giảng lại giúp em một chút được không ạ?",
    psychologicalBasis: "Vượt qua hội chứng sợ bị phán xét (Imposter Syndrome) và xây dựng sự tự tin hành động.",
    targetRole: "Thầy Cô & Học sinh"
  },
  {
    id: "card-sch-4",
    category: "school",
    categoryTag: "NHÀ TRƯỜNG",
    categoryBadge: "🏫 Nhà trường",
    icon: "book",
    title: "Chia sẻ áp lực thi cử chân thành",
    xp: 15,
    taskDetail: "Thảo luận cùng nhóm bạn học về nỗi sợ thi cử thay vì so sánh điểm số hay thành tích.",
    dialogueSample: "Tớ cũng thấy khá áp lực trước kỳ thi tới. Chúng mình cùng chia sẻ lịch ôn tập để nhắc nhở nhau nhé, không cần áp lực điểm số đâu.",
    psychologicalBasis: "Bình thường hóa sự lo âu, chuyển hóa cạnh tranh tiêu cực thành hợp tác bình yên.",
    targetRole: "Nhóm bạn học"
  },

  // 3. BÈ BẠN (FRIENDS)
  {
    id: "card-fri-1",
    category: "friends",
    categoryTag: "BÈ BẠN",
    categoryBadge: "🤝 Bè bạn",
    icon: "sprout",
    title: "Hỏi thăm người thầm lặng",
    xp: 15,
    taskDetail: "Quan sát một người bạn dạo này im lặng hoặc khép kín trong lớp để mua tặng hộp sữa hoặc gửi lời hỏi thăm.",
    dialogueSample: "Cậu ơi, dạo này thấy cậu hơi im lặng. Tớ mua tặng cậu hộp sữa này, nếu cần người lắng nghe tớ luôn ở đây nhé!",
    psychologicalBasis: "Xây dựng sự thấu cảm học đường, chống lại xu hướng cô lập hóa trên không gian mạng và nuôi dưỡng mầm chánh niệm.",
    targetRole: "Bạn bè & Học sinh"
  },
  {
    id: "card-fri-2",
    category: "friends",
    categoryTag: "BÈ BẠN",
    categoryBadge: "🤝 Bè bạn",
    icon: "ear",
    title: "Lắng nghe chân thành không ngắt lời",
    xp: 15,
    taskDetail: "Dành 10 phút nghe bạn thân tâm sự mà không cầm điện thoại, không vội đưa ra lời khuyên hay phán xét.",
    dialogueSample: "Cậu cứ nói hết những gì đang ấm ức đi, tớ hứa sẽ ngồi nghe trọn vẹn và không ngắt lời hay phán xét cậu đâu.",
    psychologicalBasis: "Tạo dựng 'không gian an toàn' (Safe Space) giúp đối phương giải tỏa dồn nén cảm xúc.",
    targetRole: "Bạn thân & Tri kỷ"
  },
  {
    id: "card-fri-3",
    category: "friends",
    categoryTag: "BÈ BẠN",
    categoryBadge: "🤝 Bè bạn",
    icon: "compass",
    title: "Kêu gọi dã ngoại ngắt kết nối",
    xp: 15,
    taskDetail: "Rủ nhóm bạn rủ nhau đi công viên, cắm trại hoặc cà phê không mang laptop/ipad.",
    dialogueSample: "Cuối tuần này cả nhóm mình cùng đi công viên cắm trại không mang laptop được không? Chúng mình cùng chơi boardgame và ngắm mây trời nhé!",
    psychologicalBasis: "Tái tạo năng lượng chánh niệm từ thiên nhiên, kéo người trẻ rời khỏi không gian ảo để tìm lại nhịp thở tự nhiên.",
    targetRole: "Học sinh & Nhóm bạn"
  },
  {
    id: "card-fri-4",
    category: "friends",
    categoryTag: "BÈ BẠN",
    categoryBadge: "🤝 Bè bạn",
    icon: "smile",
    title: "Chữa lành mâu thuẫn bằng lời xin lỗi",
    xp: 15,
    taskDetail: "Chủ động nhắn tin hòa giải với một người bạn đã từng mâu thuẫn hoặc hiểu lầm trên mạng.",
    dialogueSample: "Tớ nhận ra hôm nọ tớ lỡ lời làm cậu buồn. Tớ rất trân trọng tình bạn của chúng mình, cho tớ xin lỗi cậu nhé!",
    psychologicalBasis: "Hạ bớt cái tôi phô trương (Ego Distortion), thực hành sự dũng cảm đối diện và bao dung.",
    targetRole: "Bạn bè mâu thuẫn"
  },

  // 4. BẢN THÂN (SELF)
  {
    id: "card-slf-1",
    category: "self",
    categoryTag: "BẢN THÂN",
    categoryBadge: "🪞 Bản thân",
    icon: "off",
    title: "Thử thách 2h không Notification",
    xp: 15,
    taskDetail: "Tắt toàn bộ thông báo ứng dụng mạng xã hội trong 2 giờ liên tục để làm điều bạn thích.",
    dialogueSample: "Hôm nay tớ muốn dành 2 tiếng trọn vẹn để tập trung làm điều mình thích mà không bị xao nhãng bởi tiếng chuông thông báo. Cùng ngắt chuông với tớ nhé!",
    psychologicalBasis: "Giúp tái khẳng định giá trị cốt lõi, giảm hội chứng sợ bị bỏ lỡ (FOMO) và giảm áp lực so sánh trên không gian mạng.",
    targetRole: "Bản thân & Tâm trí"
  },
  {
    id: "card-slf-2",
    category: "self",
    categoryTag: "BẢN THÂN",
    categoryBadge: "🪞 Bản thân",
    icon: "smile",
    title: "Soi gương và khen ngợi bản ngã",
    xp: 15,
    taskDetail: "Đứng trước gương, nhìn sâu vào mắt mình và nói 3 điều bạn tự hào về chính mình hôm nay.",
    dialogueSample: "Cảm ơn bản thân vì hôm nay dù rất mệt nhưng đã cố gắng hết sức. Cậu rất dũng cảm và xứng đáng được yêu thương!",
    psychologicalBasis: "Chữa lành sự tự ti thể xác (Self-Doubt) và nuôi dưỡng tình yêu bản thân (Self-Compassion).",
    targetRole: "Đối thoại nội tâm"
  },
  {
    id: "card-slf-3",
    category: "self",
    categoryTag: "BẢN THÂN",
    categoryBadge: "🪞 Bản thân",
    icon: "edit",
    title: "Viết 3 điều biết ơn không gian thực",
    xp: 15,
    taskDetail: "Ghi chép ra giấy 3 trải nghiệm thực tế nhỏ trong ngày khiến bạn mỉm cười (không liên quan đến Like/Share).",
    dialogueSample: "Hôm nay tớ biết ơn vì làn gió mát buổi sáng, ly trà ấm mẹ pha và nụ cười của người bạn cùng bàn.",
    psychologicalBasis: "Rèn luyện tâm trí tập trung vào những điều chân thật ở hiện tại thay vì giá trị ảo trên màn hình.",
    targetRole: "Nhật ký chánh niệm"
  },
  {
    id: "card-slf-4",
    category: "self",
    categoryTag: "BẢN THÂN",
    categoryBadge: "🪞 Bản thân",
    icon: "shield",
    title: "Dọn dẹp danh sách theo dõi mạng xã hội",
    xp: 15,
    taskDetail: "Bỏ theo dõi hoặc ẩn 5 tài khoản mạng xã hội thường xuyên khiến bạn cảm thấy tự ti, ghen tị hoặc tiêu cực.",
    dialogueSample: "Tớ chọn bảo vệ bình yên cho tâm trí mình. Bỏ qua những hào nhoáng ảo để tập trung vào hành trình riêng.",
    psychologicalBasis: "Thiết lập ranh giới số lành mạnh (Digital Boundary) và bảo vệ sức khỏe tâm thần.",
    targetRole: "Ranh giới số"
  }
];

export const playChimeAudio = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + idx * 0.08 + 0.45);
    });
  } catch (e) {}
};

export const ECardsDaily: React.FC = () => {
  const { userData, addXP, updateProfile } = useUserData();

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // User ID binding for state persistence isolation
  const activeUserId = userData?.userId || localStorage.getItem("USER_ID") || "default_user";
  const storageKeyCompleted = "corez_completed_ecards_v4_" + activeUserId;

  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    try {
      const key = "corez_completed_ecards_v4_" + (userData?.userId || localStorage.getItem("USER_ID") || "default_user");
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
      const oldSaved = localStorage.getItem("corez_completed_ecards_daily");
      return oldSaved ? JSON.parse(oldSaved) : [];
    } catch {
      return [];
    }
  });

  // Flipped card IDs tracking for 3D flip card effect
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});

  // Active modal selected card
  const [selectedCard, setSelectedCard] = useState<ECardItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  // AI Weave Custom generator
  const [customPrompt, setCustomPrompt] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Sync state on user change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKeyCompleted);
      if (saved) {
        setCompletedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeUserId, storageKeyCompleted]);

  // Filtered Cards
  const displayedCards = activeCategory === "all" 
    ? ALL_E_CARDS 
    : ALL_E_CARDS.filter(c => c.category === activeCategory);

  // Calculate Progress
  const totalCount = ALL_E_CARDS.length;
  const doneCount = completedIds.length;
  const progressPercent = Math.min(100, Math.round((doneCount / totalCount) * 100));

  // Toggle Flip state
  const handleToggleFlip = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFlippedCardIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Draw Random Card
  const handleDrawRandom = () => {
    playChimeAudio();
    const pool = displayedCards.length > 0 ? displayedCards : ALL_E_CARDS;
    const randomIndex = Math.floor(Math.random() * pool.length);
    const drawn = pool[randomIndex];
    setSelectedCard(drawn);
    setIsModalOpen(true);
    try {
      confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  // AI Weave Generator
  const handleAiWeave = () => {
    setIsAiGenerating(true);
    playChimeAudio();
    setTimeout(() => {
      const aiCard: ECardItem = {
        id: "ai-card-" + Date.now(),
        category: "self",
        categoryTag: "COREZ AI",
        categoryBadge: "✨ CoreZ AI",
        icon: "sparkles",
        title: customPrompt ? `Nhiệm vụ: ${customPrompt.slice(0, 30)}...` : "Dệt chánh niệm riêng cho cậu",
        xp: 20,
        taskDetail: customPrompt || "Tắt thông báo thiết bị 1 giờ và dành trọn vẹn sự hiện diện cho điều cậu yêu thích.",
        dialogueSample: `Chào cậu, dựa trên năng lượng "${userData?.vibe || "Mầm non"}", CoreZ gửi tặng lời thoại: "Tớ muốn gác lại thông báo 1 giờ để cảm nhận hiện tại rõ hơn."`,
        psychologicalBasis: `Giải tỏa áp lực lo âu FOMO, củng cố mục tiêu "${userData?.goal || "Bình yên"}".`,
        targetRole: "Bản ngã & Bạn đồng hành"
      };
      setSelectedCard(aiCard);
      setIsAiGenerating(false);
      setIsModalOpen(true);
      try {
        confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }, 1100);
  };

  // Complete Card Handler
  const handleCompleteCard = (cardId: string) => {
    if (completedIds.includes(cardId)) return;
    const updated = [...completedIds, cardId];
    setCompletedIds(updated);
    localStorage.setItem(storageKeyCompleted, JSON.stringify(updated));
    addXP(15);
    playChimeAudio();
    try {
      confetti({ particleCount: 60, spread: 90, origin: { y: 0.6 } });
    } catch (e) {}
  };

  // Copy sample dialogue
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Save to Góc Bình Yên
  const handleSaveToGocBinhYen = (card: ECardItem) => {
    saveFavoritePost({
      id: "ecard_" + card.id,
      authorName: "CoreZ E-Card",
      aiAdvice: `${card.title}: "${card.dialogueSample}"\n💡 ${card.psychologicalBasis}`,
      category: card.categoryBadge
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Helper render icon
  const renderCardIcon = (iconKey: string) => {
    switch (iconKey) {
      case "utensils": return <Utensils className="w-5 h-5 text-amber-400" />;
      case "heart": return <Heart className="w-5 h-5 text-rose-400 fill-rose-400/20" />;
      case "send": return <Send className="w-5 h-5 text-sky-400" />;
      case "home": return <Home className="w-5 h-5 text-emerald-400" />;
      case "school": return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      case "users": return <Users className="w-5 h-5 text-teal-400" />;
      case "help": return <HelpCircle className="w-5 h-5 text-amber-400" />;
      case "book": return <BookOpen className="w-5 h-5 text-purple-400" />;
      case "sprout": return <Sprout className="w-5 h-5 text-emerald-400" />;
      case "ear": return <Ear className="w-5 h-5 text-sky-400" />;
      case "compass": return <Compass className="w-5 h-5 text-amber-400" />;
      case "smile": return <Smile className="w-5 h-5 text-emerald-400" />;
      case "off": return <WifiOff className="w-5 h-5 text-rose-400" />;
      case "edit": return <Edit3 className="w-5 h-5 text-indigo-400" />;
      case "shield": return <ShieldCheck className="w-5 h-5 text-teal-400" />;
      default: return <Sparkles className="w-5 h-5 text-amber-300" />;
    }
  };

  return (
    <div className="w-full font-sans rounded-[32px] bg-[#0c2217] dark:bg-[#07170f] text-slate-100 p-5 sm:p-8 border border-emerald-900/60 shadow-2xl space-y-6">
      
      {/* 1. HEADER BANNER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-emerald-900/50 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>CÔNG CỤ ĐẶC BIỆT VÒNG 4</span>
          </div>
          
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-emerald-100 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
            <span>Bộ E-Cards “Chạm Vào Bản Ngã”</span>
          </h2>

          <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed font-light italic">
            Thẻ bài điện tử chứa nhiệm vụ thực tế, mẫu lời thoại phá băng khoảng cách và cơ sở tâm lý chữa lành tổn thương bản ngã, giúp cậu kết nối thật với gia đình, nhà trường và bè bạn.
          </p>
        </div>

        {/* Progress Box & Counter */}
        <div className="shrink-0 bg-[#122e20] border border-emerald-800/80 rounded-2xl p-4 space-y-2 shadow-inner w-full lg:w-auto min-w-[240px]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800/60 flex items-center justify-center text-amber-400 border border-emerald-700/50">
                <Trophy className="w-5 h-5 fill-amber-400/20" />
              </div>
              <div>
                <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-emerald-400 block">TIẾN TRÌNH</span>
                <span className="text-sm sm:text-base font-bold text-white font-mono">
                  Đã làm: <strong className="text-emerald-400">{doneCount}</strong>/{totalCount} thẻ
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-extrabold text-emerald-300 bg-emerald-950 px-2 py-1 rounded-lg border border-emerald-800">
              {progressPercent}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900/80 rounded-full h-2 overflow-hidden border border-emerald-900/60">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
            />
          </div>
        </div>
      </div>

      {/* 2. CATEGORY TABS & RANDOM DRAW ACTION BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#102b1c] p-3 rounded-2xl border border-emerald-800/50">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {E_CARD_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const countInCat = cat.id === "all" 
              ? ALL_E_CARDS.length 
              : ALL_E_CARDS.filter(c => c.category === cat.id).length;
            const doneInCat = cat.id === "all"
              ? completedIds.length
              : ALL_E_CARDS.filter(c => c.category === cat.id && completedIds.includes(c.id)).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
                    : "bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-800/40"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? "bg-slate-900/30 text-slate-900" : "bg-emerald-900/80 text-emerald-300"
                }`}>
                  {doneInCat}/{countInCat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Draw Random & AI Weave */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleDrawRandom}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Rút thẻ ngẫu nhiên ✨</span>
          </button>

          <button
            onClick={handleAiWeave}
            disabled={isAiGenerating}
            className="px-3.5 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/40 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isAiGenerating ? "Đang dệt..." : "AI Dệt Riêng"}</span>
          </button>
        </div>
      </div>

      {/* 3. INTERACTIVE 3D FLIP E-CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {displayedCards.map((card) => {
            const isDone = completedIds.includes(card.id);
            const isFlipped = !!flippedCardIds[card.id];

            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="w-full h-[320px]"
                style={{ perspective: "1000px" }}
              >
                {/* 3D Card Inner Container with Preserve-3D Transform */}
                <div
                  className={`relative w-full h-full rounded-2xl transition-transform duration-700 ease-in-out cursor-pointer shadow-lg hover:shadow-2xl ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                  }}
                  onClick={() => handleToggleFlip(card.id)}
                >
                  {/* FRONT SIDE OF E-CARD */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl border p-5 flex flex-col justify-between space-y-3 transition-colors ${
                      isDone 
                        ? "bg-[#102b1c] border-emerald-500/80" 
                        : "bg-[#122e20] hover:bg-[#163726] border-emerald-800/70"
                    }`}
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden"
                    }}
                  >
                    {/* Front Header */}
                    <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-800">
                          {renderCardIcon(card.icon)}
                        </div>
                        <span className="text-[10px] font-extrabold tracking-widest text-emerald-300 uppercase font-mono">
                          {card.categoryBadge}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                        +{card.xp} XP
                      </span>
                    </div>

                    {/* Front Title & Main Task */}
                    <div className="space-y-2 flex-1 flex flex-col justify-center">
                      <h4 className="font-serif text-base font-bold text-white leading-snug">
                        {card.title}
                      </h4>
                      <p className="text-xs text-emerald-200/80 line-clamp-3 leading-relaxed font-light">
                        “ {card.taskDetail} ”
                      </p>
                    </div>

                    {/* Front Footer Actions */}
                    <div className="pt-2.5 border-t border-emerald-800/40 flex items-center justify-between text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteCard(card.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer ${
                          isDone
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm"
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? "text-emerald-400" : ""}`} />
                        <span>{isDone ? "Đã xong" : "Hoàn thành"}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFlip(card.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-[10px] font-mono font-bold text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer border border-emerald-700/50 transition-all"
                          title="Lật thẻ 3D"
                        >
                          <span>Lật 3D</span>
                          <RotateCw className="w-3 h-3 text-emerald-400" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCard(card);
                            setIsModalOpen(true);
                          }}
                          className="text-[10px] font-mono text-emerald-400 hover:text-emerald-200 cursor-pointer underline underline-offset-2"
                        >
                          Chi tiết
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* BACK SIDE OF E-CARD (REVEALED ON 3D FLIP) */}
                  <div
                    className={`absolute inset-0 w-full h-full rounded-2xl border p-4 sm:p-5 flex flex-col justify-between space-y-2.5 bg-[#0d281b] border-emerald-500/80 shadow-2xl text-slate-100 ${
                      isDone ? "bg-[#0b2217] border-emerald-400/90" : ""
                    }`}
                    style={{
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden"
                    }}
                  >
                    {/* Back Header */}
                    <div className="flex items-center justify-between border-b border-emerald-700/60 pb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-700">
                          <MessageCircle className="w-4 h-4 text-sky-400" />
                        </div>
                        <span className="text-[10px] font-extrabold tracking-widest text-emerald-300 uppercase font-mono">
                          MẶT SAU • LỜI THOẠI & TÂM LÝ
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFlip(card.id);
                        }}
                        className="p-1 rounded-md bg-emerald-950 hover:bg-emerald-800 text-emerald-300 transition-colors cursor-pointer"
                        title="Lật lại mặt trước"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Back Body Content */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-emerald-800 text-left">
                      {/* 1. Mẫu Lời Thoại */}
                      <div className="bg-[#123624] p-2.5 rounded-xl border border-emerald-700/50 space-y-1">
                        <span className="text-[9.5px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-sky-400" />
                          Lời thoại gợi ý:
                        </span>
                        <p className="italic text-[11px] sm:text-xs text-emerald-100 font-serif leading-relaxed">
                          "{card.dialogueSample}"
                        </p>
                      </div>

                      {/* 2. Cơ sở tâm lý */}
                      <div className="bg-[#123624] p-2.5 rounded-xl border border-emerald-700/50 space-y-1">
                        <span className="text-[9.5px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          Cơ sở tâm lý chữa lành:
                        </span>
                        <p className="text-[10.5px] sm:text-[11px] text-emerald-200/90 font-light leading-relaxed">
                          {card.psychologicalBasis}
                        </p>
                      </div>
                    </div>

                    {/* Back Footer Actions */}
                    <div className="pt-2 border-t border-emerald-700/60 flex items-center justify-between text-xs">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCompleteCard(card.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[10.5px] flex items-center gap-1 transition-all cursor-pointer ${
                          isDone
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-sm"
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isDone ? "text-emerald-400" : ""}`} />
                        <span>{isDone ? "Đã xong" : `Hoàn thành (+${card.xp} XP)`}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveToGocBinhYen(card);
                          }}
                          className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 cursor-pointer border border-emerald-800"
                          title="Lưu vào Góc Bình Yên"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFlip(card.id);
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-[10px] font-mono font-bold text-emerald-300 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <span>Mặt trước</span>
                          <RotateCw className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 4. DETAIL POP-UP / FLIP CARD MODAL */}
      <AnimatePresence>
        {isModalOpen && selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0d261a] border border-emerald-500/60 rounded-[32px] p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 overflow-hidden"
            >
              {/* Top Modal Header */}
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-700/60">
                    {renderCardIcon(selectedCard.icon)}
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase font-mono">
                      {selectedCard.categoryBadge} • THẺ CHẠM BẢN NGÃ
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {selectedCard.title}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-emerald-900/60 text-emerald-400 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Card 3 Core Mechanics Sections */}
              <div className="space-y-4">
                
                {/* 1. Nhiệm vụ thực tế */}
                <div className="bg-[#133323] border border-emerald-700/50 p-4 rounded-2xl space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      1. Nhiệm Vụ Thực Tế:
                    </span>
                    <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold">
                      +{selectedCard.xp} XP
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                    {selectedCard.taskDetail}
                  </p>
                  <p className="text-[10px] text-emerald-300/80 italic font-mono">
                    Đối tượng: {selectedCard.targetRole}
                  </p>
                </div>

                {/* 2. Mẫu Lời Thoại Gợi Ý */}
                <div className="bg-[#133323] border border-emerald-700/50 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
                      2. Mẫu Lời Thoại Phá Băng Giao Tiếp:
                    </span>
                    <button
                      onClick={() => handleCopy(selectedCard.dialogueSample)}
                      className="text-[10px] font-bold text-emerald-300 hover:text-emerald-100 flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "Đã chép" : "Sao chép"}</span>
                    </button>
                  </div>

                  <p className="italic text-xs sm:text-sm text-emerald-100 leading-relaxed font-serif bg-black/40 p-3 rounded-xl border border-emerald-900/60">
                    "{selectedCard.dialogueSample}"
                  </p>
                </div>

                {/* 3. Cơ Sở Tâm Lý Chữa Lành */}
                <div className="bg-[#133323] border border-emerald-700/50 p-4 rounded-2xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    3. Cơ Sở Tâm Lý Chữa Lành Bản Ngã:
                  </span>
                  <p className="text-xs text-emerald-200/90 leading-relaxed font-light">
                    {selectedCard.psychologicalBasis}
                  </p>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    handleCompleteCard(selectedCard.id);
                    setIsModalOpen(false);
                  }}
                  disabled={completedIds.includes(selectedCard.id)}
                  className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                    completedIds.includes(selectedCard.id)
                      ? "bg-emerald-900/60 text-emerald-400 cursor-not-allowed border border-emerald-800"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {completedIds.includes(selectedCard.id) 
                      ? "Đã Hoàn Thành Nhiệm Vụ" 
                      : `Hoàn Thành Nhiệm Vụ (+${selectedCard.xp} XP)`}
                  </span>
                </button>

                <button
                  onClick={() => handleSaveToGocBinhYen(selectedCard)}
                  className="py-3 px-4 rounded-2xl bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-700/50"
                >
                  <Bookmark className={`w-4 h-4 ${saved ? "fill-emerald-400 text-emerald-400" : ""}`} />
                  <span>{saved ? "Đã Lưu" : "Lưu Góc Bình Yên"}</span>
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ECardsDaily;
