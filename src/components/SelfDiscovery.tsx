import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Compass, 
  Sparkles, 
  RefreshCw, 
  ChevronRight, 
  Award, 
  Download, 
  Share2, 
  Info, 
  MapPin, 
  ArrowRight,
  ArrowLeft,
  User,
  Heart,
  Check,
  Zap
} from "lucide-react";

interface Question {
  id: number;
  text: string;
  options: {
    key: "A" | "B" | "C" | "D";
    text: string;
    scoreType: "introvert" | "extrovert" | "analytical" | "creative";
  }[];
}

const DISCOVERY_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Khi thấy thông báo mạng xã hội liên tục đổ chuông, cậu sẽ phản ứng thế nào?",
    options: [
      { key: "A", text: "Tắt máy ngay, đọc vài trang sách hoặc đi dạo tĩnh tâm.", scoreType: "introvert" },
      { key: "B", text: "Mở ra xem ngay, rep tin nhắn cực nhanh rồi rủ bạn bè đi uống nước mía.", scoreType: "extrovert" },
      { key: "C", text: "Tự hỏi xem tại sao thuật toán lại gợi ý nội dung này cho mình lúc này.", scoreType: "analytical" },
      { key: "D", text: "Viết một dòng nhật ký hay phác thảo nét vẽ ngẫu hứng thể hiện cảm xúc.", scoreType: "creative" }
    ]
  },
  {
    id: 2,
    text: "Cách cậu xả stress tốt nhất sau một ngày học tập mệt mỏi ở trường là:",
    options: [
      { key: "A", text: "Nằm nghe nhạc ballad nhẹ nhàng hoặc ngắm mây trôi ngoài cửa sổ.", scoreType: "introvert" },
      { key: "B", text: "Chạy bộ rèn luyện thể lực hoặc rủ nhóm bạn thân đi la cà phố xá.", scoreType: "extrovert" },
      { key: "C", text: "Đọc một quyển sách kỹ năng, tự đố vui trí tuệ hoặc nghe podcast chữa lành.", scoreType: "analytical" },
      { key: "D", text: "Nấu một món ăn ngon mộc mạc, làm đồ thủ công hoặc vẽ vời tự do.", scoreType: "creative" }
    ]
  },
  {
    id: 3,
    text: "Cậu thường đối mặt với hội chứng lo âu bị bỏ lỡ (FOMO) thế nào?",
    options: [
      { key: "A", text: "Khá bình thản, tớ tin thế giới thực và sự tĩnh lặng nội tâm quý giá hơn nhiều.", scoreType: "introvert" },
      { key: "B", text: "Hơi bồn chồn, nhưng tớ sẽ lập tức alo rủ mọi người làm hoạt động thực tế để lấp đầy khoảng trống.", scoreType: "extrovert" },
      { key: "C", text: "Phân tích nguyên nhân gốc rễ và lập tức thiết lập ranh giới khóa ứng dụng trong 2 tiếng.", scoreType: "analytical" },
      { key: "D", text: "Ghi chép nỗi lòng vào sổ tay phản tư, biến lo âu thành cảm hứng sáng tác.", scoreType: "creative" }
    ]
  },
  {
    id: 4,
    text: "Trải nghiệm thực tế nào tại quê hương Lạng Sơn khiến cậu cảm thấy hào hứng nhất?",
    options: [
      { key: "A", text: "Một mình bước vào thạch nhũ mát lạnh, tĩnh lặng nghe tiếng nước nhỏ tại động Tam Thanh.", scoreType: "introvert" },
      { key: "B", text: "Leo lên đỉnh cột cờ núi Phai Vệ lúc chiều tà cùng hội bạn, đón gió lộng và ngắm phố lên đèn.", scoreType: "extrovert" },
      { key: "C", text: "Thực hiện chuyến đi 24h ngắt sóng, detox tuyệt đối giữa rừng thông sương mờ đỉnh Mẫu Sơn.", scoreType: "analytical" },
      { key: "D", text: "Chụp ảnh nghệ thuật hoặc vẽ tranh cánh đồng lúa chín vàng ươm thơ mộng tại Bắc Sơn.", scoreType: "creative" }
    ]
  },
  {
    id: 5,
    text: "Khi bạn bè xung quanh đạt thành tích học tập vượt trội hoặc liên tục khoe giải thưởng, cậu thấy thế nào?",
    options: [
      { key: "A", text: "Mỉm cười chúc mừng, tớ thầm nhủ ai cũng có một nhịp độ sinh trưởng riêng.", scoreType: "introvert" },
      { key: "B", text: "Chúc mừng nhiệt thành và lấy đó làm động lực thi đua học tập rộn ràng cùng các bạn.", scoreType: "extrovert" },
      { key: "C", text: "Học hỏi phương pháp của họ, lập thời gian biểu chi tiết để nâng cấp bản thân khoa học.", scoreType: "analytical" },
      { key: "D", text: "Cảm giác chông chênh nhẹ, nhưng tớ tự xoa dịu bằng cách trân trọng những nỗ lực mộc mạc của chính mình.", scoreType: "creative" }
    ]
  }
];

interface PersonalityType {
  title: string;
  subtitle: string;
  emoji: string;
  badge: string;
  bgGradient: string;
  textColor: string;
  borderColor: string;
  cardColor: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  recommendedPlaceId: string;
  recommendedPlaceName: string;
  recommendedActivity: string;
  growthAdvice: string;
}

const PERSONALITIES: Record<string, PersonalityType> = {
  introvert: {
    title: "Trúc Lâm Cư Sĩ",
    subtitle: "Người Bạn Yên Bình • Trọng Tâm Nội Tại",
    emoji: "🧘",
    badge: "Bình Yên • Introvert",
    bgGradient: "from-emerald-400 via-teal-500 to-emerald-600",
    textColor: "text-emerald-700",
    borderColor: "border-emerald-200",
    cardColor: "bg-emerald-50/90",
    description: "Cậu sở hữu một tâm hồn phẳng lặng như mặt nước hồ Tam Thanh. Cậu nạp lại năng lượng thông qua sự cô đơn lành mạnh và các khoảng lặng tĩnh tâm. Nhờ nội lực vững vàng, cậu ít bị cuốn theo vòng xoáy lấp lánh của thế giới ảo, nhưng đôi khi dễ thu mình lại quá mức trước các kết nối xung quanh.",
    strengths: ["Lắng nghe thấu cảm", "Tự nhận thức sâu sắc", "Bình thản trước FOMO", "Tập trung cao độ"],
    weaknesses: ["Dễ khép kín", "Ngại chia sẻ áp lực", "Khó mở lòng với bạn mới"],
    recommendedPlaceId: "place-3",
    recommendedPlaceName: "Động Chùa Tam Thanh",
    recommendedActivity: "Bước vào hang đá mát lành nghe tiếng giọt nước thánh thót rơi để thiền hành và sạc pin tinh thần ngoại tuyến.",
    growthAdvice: "Hãy thỉnh thoảng bước ra ngoài, rủ một người bạn thân thiết cùng đi bộ dạo mát để giữ sự cân bằng thực tại nhé."
  },
  extrovert: {
    title: "Sứ Giả Truyền Cảm Hứng",
    subtitle: "Chiến Binh Kết Nối • Đời Thực Năng Động",
    emoji: "🗣️",
    badge: "Năng Động • Extrovert",
    bgGradient: "from-amber-400 via-orange-500 to-amber-600",
    textColor: "text-amber-800",
    borderColor: "border-amber-200",
    cardColor: "bg-amber-50/95",
    description: "Cậu tràn đầy nhiệt lượng rực rỡ như hoàng hôn trên đỉnh Phai Vệ. Cậu thích sự tương tác, kết nối mọi người xung quanh và luôn là tâm điểm của niềm vui ngoài đời thực. Mạng xã hội giúp cậu lan tỏa, nhưng cũng dễ khiến cậu rơi vào bẫy 'áp lực đồng trang lứa' hoặc mệt mỏi vì canh cánh giữ gìn hình ảnh hoàn hảo.",
    strengths: ["Truyền cảm hứng tích cực", "Năng nổ, chủ động", "Xây dựng mối quan hệ tốt", "Thích nghi cực nhanh"],
    weaknesses: ["Dễ chịu áp lực so sánh ngầm", "Sợ cảm giác bị cô lập", "Dễ lướt mạng xã hội quá đà"],
    recommendedPlaceId: "place-1",
    recommendedPlaceName: "Cột Cờ Núi Phai Vệ",
    recommendedActivity: "Leo 80 bậc đá đón gió lộng, ngắm thành phố Lạng Sơn lung linh lên đèn để thấy nguồn năng lượng sống động thực sự.",
    growthAdvice: "Dành ra những khoảng thời gian detox mạng xã hội cố định mỗi ngày để thấu hiểu sâu hơn những mong mỏi của chính bản thân."
  },
  analytical: {
    title: "Nhà Kiến Tạo Tri Thức",
    subtitle: "Người Phân Tích Thực Tế • Kỷ Luật Thầm Lặng",
    emoji: "🧭",
    badge: "Kỷ Luật • Mindful Thinker",
    bgGradient: "from-blue-400 via-indigo-500 to-blue-600",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
    cardColor: "bg-blue-50/90",
    description: "Cậu là người sống thực tế, có đầu óc phân tích sắc sảo và yêu thích sự kỷ luật ngăn nắp. Cậu tiếp cận mọi vấn đề (kể cả cảm xúc) bằng tư duy logic, khoa học. Khi gặp stress, cậu thích lập kế hoạch giải quyết thay vì chỉ ngồi lo lắng. Tuy nhiên, sự cầu toàn quá mức đôi khi khiến cậu nghiêm khắc với chính mình.",
    strengths: ["Lập kế hoạch khoa học", "Kiểm soát thời gian tốt", "Bình tĩnh giải quyết khủng hoảng", "Thích đọc và nghiên cứu sâu"],
    weaknesses: ["Dễ rơi vào bẫy cầu toàn quá mức", "Nghiêm khắc với bản thân", "Khó chấp nhận những thiếu sót nhỏ"],
    recommendedPlaceId: "place-4",
    recommendedPlaceName: "Đỉnh Núi Mẫu Sơn",
    recommendedActivity: "Thực hiện thử thách 24 giờ ngắt kết nối sóng tuyệt đối, ngắm sương mù giăng lối để thảnh thơi đầu óc hoàn toàn.",
    growthAdvice: "Đôi khi hãy cho phép bản thân làm sai và thả lỏng đầu óc, bởi cuộc sống là một hành trình trải nghiệm chứ không phải bảng điểm."
  },
  creative: {
    title: "Họa Sĩ Tâm Hồn",
    subtitle: "Nhà Sáng Tạo Cảm Xúc • Phản Tư Sâu Sắc",
    emoji: "🎨",
    badge: "Sáng Tạo • Creative Soul",
    bgGradient: "from-rose-400 via-pink-550 to-rose-600",
    textColor: "text-rose-700",
    borderColor: "border-rose-200",
    cardColor: "bg-rose-50/90",
    description: "Cậu sở hữu một đôi mắt nhạy cảm có thể tìm thấy vẻ đẹp mộc mạc trong từng chi tiết nhỏ của cuộc sống. Cậu bộc lộ bản thân qua nét vẽ, thơ ca, viết lách, hay đơn giản là chụp lại một góc phố yên bình. Tâm hồn cậu rất giàu cảm xúc nên dễ chông chênh bởi các thông tin trái chiều hoặc những so sánh vô thức trên Threads.",
    strengths: ["Cảm quan thẩm mỹ tuyệt vời", "Đồng cảm sâu sắc với người khác", "Sáng tạo độc đáo", "Phản tư mộc mạc"],
    weaknesses: ["Dễ bị xúc cảm chi phối", "Nhạy cảm với lời phê bình ảo", "Dễ rơi vào lo âu trống rỗng"],
    recommendedPlaceId: "place-2",
    recommendedPlaceName: "Thung Lũng Bắc Sơn",
    recommendedActivity: "Tới ngắm cánh đồng lúa chín vàng thơ mộng, mang theo một cuốn sổ nhỏ để phác thảo hoặc ghi lại xúc cảm trong trẻo.",
    growthAdvice: "Hãy biến những trăn trở lo âu thành chất liệu nghệ thuật mộc mạc và đừng bận lòng về những nút 'like' trên màn hình."
  }
};

export default function SelfDiscovery() {
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [personalityResult, setPersonalityResult] = useState<PersonalityType | null>(null);
  
  // Card Flip interaction
  const [isFlipped, setIsFlipped] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleStartTest = () => {
    setTestStarted(true);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setPersonalityResult(null);
    setIsFlipped(false);
  };

  const handleSelectOption = (scoreType: string) => {
    const updatedAnswers = { ...selectedAnswers, [DISCOVERY_QUESTIONS[currentQuestionIdx].id]: scoreType };
    setSelectedAnswers(updatedAnswers);

    if (currentQuestionIdx < DISCOVERY_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIdx(currentQuestionIdx + 1);
      }, 250);
    } else {
      // Calculate Result!
      setTimeout(() => {
        calculateResult(updatedAnswers);
      }, 300);
    }
  };

  const calculateResult = (answers: Record<number, string>) => {
    const counts: Record<string, number> = { introvert: 0, extrovert: 0, analytical: 0, creative: 0 };
    Object.values(answers).forEach(type => {
      counts[type] = (counts[type] || 0) + 1;
    });

    // Find the maximum count
    let maxType = "introvert";
    let maxCount = -1;
    Object.entries(counts).forEach(([type, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxType = type;
      }
    });

    // Save result
    setPersonalityResult(PERSONALITIES[maxType]);
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  const handleShare = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  const progressPercent = Math.round(((currentQuestionIdx + 1) / DISCOVERY_QUESTIONS.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto py-2 px-4 font-sans relative z-10" id="self-discovery-module">
      
      {/* Introduction Screen / Splash */}
      {!testStarted && !personalityResult && (
        <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/40 p-6 sm:p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-md animate-float">
            <Compass className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
              Module 2: Self-Discovery
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-800">
              Bạn Là Ai Trong Thế Giới Số?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              Trắc nghiệm phản tư 5 câu hỏi mộc mạc giúp cậu định vị nhóm tính cách bản ngã, gỡ bỏ nhãn mác thế giới ảo để nhận lại "Thẻ bài năng lực" độc quyền định hướng thói quen đời thực.
            </p>
          </div>

          {/* Quick Illustrated Guide */}
          <div className="bg-white/30 rounded-2xl p-4 border border-white/30 text-left grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-2.5 items-start">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-700">Tâm lý học đường</h5>
                <p className="text-[10.5px] text-slate-400 font-light leading-snug">Thiết kế bởi các chuyên viên tham vấn dựa trên bối cảnh học sinh THPT.</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-slate-700">Thẻ bài tính cách</h5>
                <p className="text-[10.5px] text-slate-400 font-light leading-snug">Chụp màn hình hoặc lưu về chia sẻ khoe thành tích rèn luyện lành mạnh.</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartTest}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Bắt đầu trắc nghiệm ngay
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Interactive Question Screen */}
      {testStarted && !personalityResult && (
        <div className="w-full max-w-xl bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-sm p-6 sm:p-8 mx-auto relative">
          
          {/* Progress Indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                Bản Ngã Định Vị
              </span>
              <span className="text-xs font-medium text-slate-400 font-mono">
                Câu hỏi {currentQuestionIdx + 1} / {DISCOVERY_QUESTIONS.length}
              </span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>

          {/* Question text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={DISCOVERY_QUESTIONS[currentQuestionIdx].id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="min-h-[100px] flex items-center mb-6"
            >
              <h4 className="font-serif text-base sm:text-lg font-medium text-slate-700 leading-relaxed text-left">
                “{DISCOVERY_QUESTIONS[currentQuestionIdx].text}”
              </h4>
            </motion.div>
          </AnimatePresence>

          {/* Options List */}
          <div className="space-y-3 mb-6">
            {DISCOVERY_QUESTIONS[currentQuestionIdx].options.map((opt) => {
              const isSelected = selectedAnswers[DISCOVERY_QUESTIONS[currentQuestionIdx].id] === opt.scoreType;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleSelectOption(opt.scoreType)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs sm:text-sm border transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-500 border-emerald-500 text-white font-medium shadow-sm"
                      : "bg-white/45 hover:bg-white/65 backdrop-blur-sm border-white/40 text-slate-600"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono text-[10px] font-bold ${
                    isSelected ? "bg-white/25 border-white text-white" : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}>
                    {opt.key}
                  </span>
                  <span className="flex-1 text-left font-sans">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Câu trước
            </button>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              CÂU {currentQuestionIdx + 1} / {DISCOVERY_QUESTIONS.length}
            </span>
            <button
              onClick={() => {
                if (currentQuestionIdx < DISCOVERY_QUESTIONS.length - 1) {
                  setCurrentQuestionIdx(currentQuestionIdx + 1);
                } else {
                  calculateResult(selectedAnswers);
                }
              }}
              disabled={!selectedAnswers[DISCOVERY_QUESTIONS[currentQuestionIdx].id]}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIdx === DISCOVERY_QUESTIONS.length - 1 ? "Xem kết quả 🔮" : "Câu tiếp"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Result Screen */}
      {personalityResult && (
        <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-sm p-6 sm:p-8 mx-auto max-w-xl space-y-6 text-center relative">
          
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
              Bản Ngã Định Vị Thành Công!
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-800">
              Thẻ Bài Bản Ngã Của Cậu ✨
            </h3>
            <p className="text-[11px] text-slate-400">
              Lấy cảm hứng từ các triết lý sống mộc mạc & điểm đến xứ Lạng
            </p>
          </div>

          {/* FLIPPABLE 3D CARD COMPONENT */}
          <div 
            className="relative h-[430px] w-full max-w-[320px] mx-auto no-dark-override"
            style={{ perspective: "1000px" }}
          >
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
              className="relative w-full h-full cursor-pointer select-none no-dark-override"
            >
              
              {/* CARD FRONT SIDE */}
              <div 
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                className={`rounded-[36px] p-6 flex flex-col justify-between border-2 shadow-xl overflow-hidden no-dark-override ${personalityResult.cardColor} ${personalityResult.borderColor}`}
              >
                
                {/* Visual Glow Layer inside Card */}
                <div className={`absolute top-0 right-0 w-44 h-44 rounded-full bg-gradient-to-br ${personalityResult.bgGradient} opacity-20 blur-3xl no-dark-override`} />
                <div className="absolute bottom-[-10%] left-[-10%] w-36 h-36 rounded-full bg-slate-300/10 blur-2xl no-dark-override" />
 
                {/* Card Header */}
                <div className="flex justify-between items-center relative z-10 no-dark-override">
                  <div className="flex items-center gap-1.5 no-dark-override">
                    <Compass className="w-5 h-5 text-emerald-500 animate-float no-dark-override" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase no-dark-override">CoreZ Compass</span>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full bg-white shadow-sm border border-slate-150 no-dark-override ${personalityResult.textColor}`}>
                    {personalityResult.badge}
                  </span>
                </div>
 
                {/* Character Main Portrait (Text + Emoji + Subtitle) */}
                <div className="text-center space-y-4 my-auto relative z-10 no-dark-override">
                  <div className={`mx-auto w-24 h-24 rounded-full bg-gradient-to-tr ${personalityResult.bgGradient} flex items-center justify-center text-5xl shadow-lg border-4 border-white animate-float no-dark-override`}>
                    {personalityResult.emoji}
                  </div>
                  <div className="space-y-1.5 no-dark-override">
                    <h4 className="font-serif text-2xl font-black tracking-tight text-slate-800 no-dark-override">
                      {personalityResult.title}
                    </h4>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-sans no-dark-override">
                      {personalityResult.subtitle}
                    </p>
                  </div>
                </div>
 
                {/* Card Footer (Prompt helper) */}
                <div className="text-center border-t border-slate-200/50 pt-4 relative z-10 flex flex-col items-center gap-1 no-dark-override">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 no-dark-override">
                    <Zap className="w-3.5 h-3.5 fill-emerald-500/15 animate-pulse no-dark-override" />
                    <span className="no-dark-override">Bấm để lật xem bí kíp rèn luyện</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono no-dark-override">ID: CZ-{personalityResult.emoji.charCodeAt(0)}-2026</span>
                </div>
              </div>
 
              {/* CARD BACK SIDE */}
              <div 
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  transform: "rotateY(180deg)",
                }}
                className={`rounded-[36px] p-6 flex flex-col justify-between border-2 shadow-xl overflow-hidden bg-white no-dark-override ${personalityResult.borderColor}`}
              >
                
                {/* Visual Header */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Bản đồ năng lực bản ngã</span>
                  <span className={`text-[10px] font-bold text-emerald-500`}>Lật lại mặt trước ↩</span>
                </div>

                {/* Description Text */}
                <div className="flex-1 overflow-y-auto my-3 pr-1 space-y-3">
                  <p className="text-[11.5px] text-slate-600 leading-relaxed text-justify italic">
                    {personalityResult.description}
                  </p>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="space-y-1 bg-emerald-50/40 p-2 rounded-xl border border-emerald-100/30">
                      <h5 className="text-[10px] font-bold text-emerald-700 uppercase">Đặc trưng cốt lõi</h5>
                      <ul className="text-[9px] text-slate-500 space-y-0.5">
                        {personalityResult.strengths.map((st, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-1 bg-rose-50/40 p-2 rounded-xl border border-rose-100/30">
                      <h5 className="text-[10px] font-bold text-rose-700 uppercase">Điểm mù tâm lý</h5>
                      <ul className="text-[9px] text-slate-500 space-y-0.5">
                        {personalityResult.weaknesses.map((wk, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                            <span>{wk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Growth advice */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                    <h5 className="text-[9.5px] font-bold text-slate-700 uppercase flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500/10" />
                      Lời khuyên phát triển 🌱
                    </h5>
                    <p className="text-[9px] text-slate-500 leading-relaxed mt-1 font-light">
                      {personalityResult.growthAdvice}
                    </p>
                  </div>
                </div>

                {/* Recommended Place Badge */}
                <div className="border-t border-slate-100 pt-3 flex items-center gap-2 bg-emerald-50/30 p-2 rounded-2xl border">
                  <div className="p-1.5 rounded-xl bg-white text-emerald-500 shrink-0 border border-emerald-100">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-left">
                    <h5 className="text-[9px] font-bold text-slate-400 uppercase leading-none">Điểm đến chữa lành Xứ Lạng</h5>
                    <h6 className="text-[11px] font-bold text-slate-700 mt-1 leading-none">{personalityResult.recommendedPlaceName}</h6>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* ACTION BUTTONS (RETAKE) */}
          <div className="flex gap-3.5 justify-center items-center">
            
            <button
              onClick={handleStartTest}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-white/70 animate-spin-slow" />
              Đo lường lại
            </button>
          </div>

          {/* TAILORED CHALLENGE PROMPT */}
          <div className="bg-emerald-50/40 border border-emerald-150 p-4.5 rounded-[24px] space-y-3 text-center sm:text-left">
            <h5 className="font-serif text-[15px] font-bold text-emerald-900 flex items-center justify-center sm:justify-start gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Thử thách rèn luyện đề xuất cho {personalityResult.title}:
            </h5>
            <p className="text-xs text-emerald-700 leading-relaxed font-medium">
              {personalityResult.recommendedActivity}
            </p>
            <div className="text-[10px] text-slate-400 font-mono">
              *Mẹo: Chụp màn hình thẻ bài của cậu rồi đăng lên story kèm hashtag <span className="font-bold text-emerald-600">#CoreZLangSon</span> để thách thức bạn bè cùng tham gia và lan tỏa làn sóng sống khỏe đời thực nhé! 🌱
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
