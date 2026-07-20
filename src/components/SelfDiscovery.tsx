import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import { 
  Compass, 
  Sparkles, 
  RefreshCw, 
  Award, 
  MapPin, 
  ArrowRight, 
  ArrowLeft,
  Heart,
  Check,
  Zap
} from "lucide-react";

interface Option {
  id: "A" | "B" | "C" | "D";
  text: string;
}

interface Question {
  question: string;
  options: Option[];
}

interface CardResult {
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  item: string;
  docVi: string;
  nhiemVu: string;
  loiKhuyen: string[];
  phanTich: string;
  dacTrung?: string[];
  diemMu?: string[];
  loiKhuyenPhatTrien?: string;
}

const questions: Question[] = [
  {
    question: "Câu 1. [Ứng dụng thang đo RSES - Đo lường Lòng tự trọng]\nKhi chuẩn bị đăng một bức ảnh selfie lên Story/Instagram, quy trình của cậu thường là:",
    options: [
      { id: 'A', text: "Chụp 100 tấm, qua 3 lớp filter app (chỉnh da, bóp mặt), nhưng lúc đăng lên vẫn nơm nớp lo sợ người khác thấy mình chưa đẹp." },
      { id: 'B', text: "Chỉnh sửa nhẹ nhàng cho sáng sủa rồi đăng. Ai khen thì vui, không thì thôi." },
      { id: 'C', text: "Cam thường thẳng tiến! Chụp dính cả mụn cũng chẳng sao, quan trọng là lưu lại khoảnh khắc vui vẻ lúc đó." },
      { id: 'D', text: "Thường không dám đăng mặt mình, chỉ đăng meme, ảnh phong cảnh hoặc nhạc buồn vì tự ti về ngoại hình." }
    ]
  },
  {
    question: "Câu 2. [Ứng dụng thang đo INCOM - Đo lường So sánh xã hội]\n11h đêm, cậu nằm lướt TikTok và liên tục thấy các bạn đồng trang lứa \"flex\" điểm IELTS 7.5, đi du lịch sang chảnh, hay dùng đồ hiệu. Cảm giác chân thật nhất bật ra trong đầu cậu là:",
    options: [
      { id: 'A', text: "Thấy kiệt sức, áp lực bủa vây, cảm giác bản thân là một kẻ thất bại vô dụng vì xuất phát điểm của mình thua kém họ." },
      { id: 'B', text: "Nảy sinh suy nghĩ ghen tị ngầm, hoặc tự an ủi \"chắc tụi nó chỉ phông bạt thế thôi\", sau đó cố tìm kiếm những drama tiêu cực để xem cho đỡ tức." },
      { id: 'C', text: "Hơi chạnh lòng một chút tầm 5 phút, nhưng sau đó lướt qua xem video mèo hài hước rồi đi ngủ." },
      { id: 'D', text: "Bấm \"Thả tim\" chúc mừng (hoặc lướt qua nhẹ nhàng). Nhận thức rất rõ là cuộc sống trên mạng chỉ là \"highlight\" của người ta, mình có mục tiêu đời thực riêng." }
    ]
  },
  {
    question: "Câu 3. [Ứng dụng thang đo EOM-EIS - Đo lường Hoãn lưu/Nhiễu loạn bản sắc]\nGiả sử cậu có một sở thích rất cá nhân (ví dụ: thích hát then đàn tính của quê hương Lạng Sơn, thích nghe nhạc indie cũ, hay có gu ăn mặc khác người). Nhưng khi đăng lên mạng, có vài bình luận chê là \"phèn\", \"lỗi thời\". Cậu sẽ:",
    options: [
      { id: 'A', text: "Xóa vội bài đăng hoặc ẩn đi, cảm thấy xấu hổ. Từ sau chỉ đăng những thứ đang là \"trend\" để an toàn và hòa nhập." },
      { id: 'B', text: "Vẫn để đó nhưng trong lòng vô cùng bứt rứt, suy nghĩ cả ngày về bình luận đó." },
      { id: 'C', text: "Tranh cãi tay đôi trên mạng để bảo vệ sở thích, nhưng thực chất bên trong vẫn bị lung lay và tổn thương." },
      { id: 'D', text: "Kệ họ. \"Phèn\" hay \"Sang\" là thước đo của mỗi người. Mình thích thì mình trân trọng, không cần cả thế giới ảo phải công nhận." }
    ]
  },
  {
    question: "Câu 4. [Ứng dụng chéo EOM-EIS & RSES - Độ vênh giữa Ảo và Thực]\nHãy thử miêu tả sự khác biệt lớn nhất giữa \"Cậu ở trên mạng\" và \"Cậu ở trường học/nhà\":" ,
    options: [
      { id: 'A', text: "Khác một trời một vực. Trên mạng mình là \"chiến thần ngôn từ\", vui vẻ, quảng giao. Ngoài đời mình rụt rè, sợ giao tiếp mắt và ít khi dám nói lên ý kiến thật." },
      { id: 'B', text: "Đôi khi mình thấy \"cái tôi\" trên mạng giống như một nhân vật mình đang nhập vai để trốn tránh những áp lực học hành mệt mỏi ở ngoài đời." },
      { id: 'C', text: "Mình chẳng biết nữa. Mình lướt điện thoại nhiều đến mức cảm giác cả hai thế giới đang nhòe vào nhau, có lúc thấy thật trống rỗng." },
      { id: 'D', text: "Mình luôn là mình. Tất nhiên trên mạng thì mình bộc lộ vài góc độ khác, nhưng cốt lõi tính cách và những giá trị mình trân trọng vẫn không đổi." }
    ]
  },
  {
    question: "Câu 5. [Câu hỏi Tổng hợp Hiện sinh - Chốt chặng Định Vị]\nNếu ngày mai, toàn bộ các nền tảng mạng xã hội (Facebook, TikTok, Insta...) biến mất vĩnh viễn khỏi Trái Đất. Không còn ai đếm số lượt Like, không còn ai xem Story của cậu nữa. Lúc đó, cậu sẽ định nghĩa giá trị của bản thân mình bằng điều gì?",
    options: [
      { id: 'A', text: "Hoang mang tột độ. Mình cảm thấy như \"bay màu\" khỏi thế giới, vì bấy lâu nay giá trị của mình đo bằng sự chú ý của người khác trên mạng." },
      { id: 'B', text: "Bứt rứt khó chịu mất một thời gian dài vì mất đi thói quen, không biết phải tiêu tốn thời gian rảnh vào việc gì để trốn tránh sự buồn chán." },
      { id: 'C', text: "Thấy nhẹ nhõm! Cuối cùng cũng thoát khỏi áp lực phải hoàn hảo. Sẽ bắt đầu dọn dẹp phòng, đọc một cuốn sách hoặc chạy bộ." },
      { id: 'D', text: "Sẽ rủ lũ bạn thân ra quán trà chanh vỉa hè ngồi chém gió trực tiếp, lên kế hoạch cho kỳ thi sắp tới. Giá trị của mình nằm ở khối óc và tình cảm thực tế." }
    ]
  }
];
/*
];��y." }
    ]*/


const cardResults: Record<"A" | "B" | "C" | "D", CardResult> = {
  A: { 
    title: "TẮC KÈ HOA MẠNG", 
    subtitle: "The Chaser", 
    color: "bg-pink-500", 
    icon: "🛡️", 
    item: "KHIÊN CHẮN VÔ HÌNH", 
    docVi: "Cậu là người nhạy bén với xu hướng, nhưng lại đang bị 'khán giả tưởng tượng' thao túng. Cậu vay mượn quá nhiều vỏ bọc ảo để làm hài lòng người khác, khiến cái tôi thực sự bị hao mòn.", 
    nhiemVu: "Thực hành '24h không filter' – định vị lại giá trị cốt lõi của bản thân mà không cần lượt Like định giá.",
    loiKhuyen: [
      "💡 Detox bộ lọc: Thử đăng một khoảnh khắc ngớ ngẩn thường ngày không chỉnh sửa. Sự chân thật mới là thứ thu hút nhất.",
      "💡 Đừng để những con số vô hồn định giá cảm xúc của cậu. Giá trị thật của cậu không nằm ở nút thả tim!"
    ],
    phanTich: "Thích nghi cực nhanh | Dễ đánh mất bản sắc thực",
    dacTrung: [
      "Thích nghi xu hướng cực nhanh",
      "Sáng tạo, hướng ngoại, sôi nổi",
      "Kết nối và truyền tải thông điệp tốt",
      "Nhạy bén với phản hồi xã hội"
    ],
    diemMu: [
      "Phụ thuộc vào sự công nhận bên ngoài (lượt Like, thả tim)",
      "Dễ đánh mất bản sắc thật sau những filter, vỏ bọc",
      "Sợ bị lãng quên hoặc tụt hậu (FOMO)"
    ],
    loiKhuyenPhatTrien: "Tuy nhiên, việc liên tục chạy theo những tiêu chuẩn hoàn mỹ trên mạng xã hội có thể khiến cậu kiệt sức và xa rời bản ngã thực tế. Hãy nhớ rằng, sự chân thật không cần bộ lọc mới là thứ có sức hút lâu bền nhất!"
  },
  B: { 
    title: "KẺ MỘNG DU SỐ", 
    subtitle: "The Zombie Scroller", 
    color: "bg-slate-600", 
    icon: "⏳", 
    item: "ĐỒNG HỒ CÁT TỈNH THỨC", 
    docVi: "Cậu đang dùng việc 'vuốt màn hình' như liều thuốc tê né tránh thực tại. Thời gian trôi tuột đi trong vô thức, khiến năng lượng đời thực cạn kiệt và các mối quan hệ xa cách.", 
    nhiemVu: "Khởi động 'Digital Detox' – thiết lập giới hạn giờ dùng app và tìm lại một sở thích thực tế bị bỏ quên.",
    loiKhuyen: [
      "💡 Đặt báo thức 'Thức tỉnh': Cài giới hạn thời gian MXH. Khi hết giờ, hãy dứt khoát khóa máy và đi uống nước.",
      "💡 Quy tắc Vùng Cấm: Tuyệt đối không mang điện thoại lên giường ngủ để não bộ được nghỉ ngơi."
    ],
    phanTich: "Thích quan sát chiều sâu | Né tránh cảm xúc khó khăn",
    dacTrung: [
      "Thích quan sát âm thầm, tỉ mỉ",
      "Thấu hiểu thế giới nội tâm sâu sắc",
      "Độc lập, không thích tranh chấp, ồn ào",
      "Thích tìm tòi các nội dung ngách"
    ],
    diemMu: [
      "Có xu hướng né tránh cảm xúc khó khăn bằng việc cuộn màn hình vô thức",
      "Trì hoãn hành động đời thực",
      "Dễ cô lập bản thân với mọi người xung quanh"
    ],
    loiKhuyenPhatTrien: "Tuy nhiên, việc dùng không gian mạng như một liều thuốc trốn tránh thực tại chỉ khiến những lo âu của cậu kéo dài hơn. Hãy dũng cảm đặt điện thoại xuống, bước ra ngoài và đối diện với thực tế, cậu sẽ thấy mình mạnh mẽ hơn mình nghĩ!"
  },
  C: { 
    title: "KẺ DU HÀNH CHÔNG CHÊNH", 
    subtitle: "The Fragile Soul", 
    color: "bg-blue-400", 
    icon: "🔍", 
    item: "KÍNH LÚP CHÂN TÂM", 
    docVi: "Bản ngã của cậu đang dễ tổn thương nhất. Áp lực đồng lứa (Peer pressure) và sự so sánh liên tục trên mạng khiến cậu tự ti, hoang mang về định hướng của chính mình.", 
    nhiemVu: "Chữa lành sự nhiễu loạn bản sắc. Học cách chấp nhận sự không hoàn hảo và ngừng đo đếm thành công bằng thước đo của người khác.",
    loiKhuyen: [
      "💡 Dọn dẹp dòng thời gian: Dũng cảm unfollow những tài khoản luôn khiến cậu áp lực.",
      "💡 Tự soi chiếu: Tuyệt đối không so sánh 'hậu trường' bề bộn của mình với 'sân khấu' hào nhoáng của người khác."
    ],
    phanTich: "Nhạy cảm, cầu tiến | Dễ tổn thương bởi áp lực đồng lứa",
    dacTrung: [
      "Nhạy cảm, tinh tế, giàu đồng cảm",
      "Cầu tiến, luôn khao khát hoàn thiện bản thân",
      "Trân trọng cái đẹp và các giá trị nghệ thuật",
      "Biết lắng nghe và thấu hiểu người khác"
    ],
    diemMu: [
      "Dễ tổn thương bởi áp lực đồng lứa (Peer Pressure)",
      "Hay so sánh 'hậu trường' của mình với 'sân khấu' của người khác",
      "Dễ hoang mang và tự ti về định hướng cá nhân"
    ],
    loiKhuyenPhatTrien: "Tuy nhiên, mỗi người đều có một múi giờ và hành trình phát triển riêng biệt. Đừng để những hào nhoáng lấp lánh của người khác trên mạng xã hội làm lu mờ đi những bước tiến âm thầm nhưng vững chắc của chính cậu!"
  },
  D: { 
    title: "MỎ NEO TỰ TẠI", 
    subtitle: "The Grounded Anchor", 
    color: "bg-emerald-500", 
    icon: "🗼", 
    item: "NGỌN HẢI ĐĂNG", 
    docVi: "Tuyệt vời! Cậu có bản sắc vững vàng. Những 'cơn sóng' trào lưu hay thuật toán MXH không thể xô ngã được sự cân bằng giữa đời thực và không gian mạng của cậu.", 
    nhiemVu: "Duy trì phong độ nhé! Cậu sẽ là 'Người truyền cảm hứng' trên Core Z để kéo các bạn khác ra khỏi chông chênh.",
    loiKhuyen: [
      "💡 Lan tỏa năng lượng: Hãy là người chủ động rủ rê hội bạn thân tham gia các hoạt động 'offline' (trượt patin, uống trà chanh).",
      "💡 Tiếp tục phát huy việc dùng mạng xã hội như một công cụ, đừng để thuật toán dắt mũi cậu nhé!"
    ],
    phanTich: "Tự chủ, kiên định | Có xu hướng khép mình với cái mới",
    dacTrung: [
      "Lập kế hoạch khoa học",
      "Kiểm soát thời gian tốt",
      "Bình tĩnh giải quyết khó khăn",
      "Thích đọc và nghiên cứu sâu"
    ],
    diemMu: [
      "Dễ rơi vào bẫy tính toán quá mức",
      "Nghiêm khắc với bản thân",
      "Khó chấp nhận những thiếu sót nhỏ"
    ],
    loiKhuyenPhatTrien: "Tuy nhiên, sự cầu toàn quá mức đôi khi khiến cậu nghiêm khắc với chính mình. Đôi khi, hãy cho phép bản thân làm sai và thả lỏng đầu óc, bởi cuộc sống là một hành trình trải nghiệm chứ không phải bảng điểm!"
  }
};

export default function SelfDiscovery() {
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});
  const [personalityResult, setPersonalityResult] = useState<CardResult | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [resultKey, setResultKey] = useState<"A" | "B" | "C" | "D">("D");

  const handleStartTest = () => {
    setTestStarted(true);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setPersonalityResult(null);
    setIsFlipped(false);
  };

  const handleSelectOption = (optionId: "A" | "B" | "C" | "D") => {
    const updatedAnswers = { ...selectedAnswers, [currentQuestionIdx]: optionId };
    setSelectedAnswers(updatedAnswers);

    if (currentQuestionIdx < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIdx(currentQuestionIdx + 1);
      }, 250);
    } else {
      setTimeout(() => {
        calculateResult(updatedAnswers);
      }, 300);
    }
  };

  const calculateResult = (answers: Record<number, "A" | "B" | "C" | "D">) => {
    const counts: Record<"A" | "B" | "C" | "D", number> = { A: 0, B: 0, C: 0, D: 0 };
    Object.values(answers).forEach(ans => {
      counts[ans] = (counts[ans] || 0) + 1;
    });

    let maxCount = -1;
    let computedKey: "A" | "B" | "C" | "D" = "D";

    // Tie-breaker priority: C > B > A > D
    const order: ("A" | "B" | "C" | "D")[] = ["D", "A", "B", "C"];
    order.forEach(key => {
      if (counts[key] > maxCount) {
        maxCount = counts[key];
        computedKey = key;
      } else if (counts[key] === maxCount) {
        computedKey = key;
      }
    });

    setResultKey(computedKey);
    setPersonalityResult(cardResults[computedKey]);
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const getThemeClasses = (key: "A" | "B" | "C" | "D") => {
    switch (key) {
      case "A":
        return {
          glowColor: "from-pink-500/20 to-rose-500/10",
          cardAccent: "border-pink-500/30 shadow-pink-500/10",
          itemGradient: "from-pink-400 to-rose-300",
          badgeColor: "bg-pink-500/20 text-pink-300 border-pink-500/30"
        };
      case "B":
        return {
          glowColor: "from-slate-500/20 to-zinc-500/10",
          cardAccent: "border-slate-500/30 shadow-slate-500/10",
          itemGradient: "from-slate-400 to-zinc-300",
          badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30"
        };
      case "C":
        return {
          glowColor: "from-blue-500/20 to-indigo-500/10",
          cardAccent: "border-blue-500/30 shadow-blue-500/10",
          itemGradient: "from-blue-400 to-indigo-300",
          badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30"
        };
      case "D":
        return {
          glowColor: "from-emerald-500/20 to-teal-500/10",
          cardAccent: "border-emerald-500/30 shadow-emerald-500/10",
          itemGradient: "from-emerald-400 to-teal-300",
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        };
    }
  };

  const theme = getThemeClasses(resultKey);
  const progressPercent = Math.round(((currentQuestionIdx + 1) / questions.length) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto py-2 px-4 font-sans relative z-10 animate-fade-in" id="self-discovery-module">
      
      {/* Introduction Screen / Splash */}
      {!testStarted && !personalityResult && (
        <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/40 p-6 sm:p-8 shadow-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-500 text-white flex items-center justify-center shadow-md animate-float">
            <Compass className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase">
              BẠN LÀ AI TRONG THẾ GIỚI SỐ?
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-800">
              Mini-game: Bản Ngã Định Vị
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
              Trắc nghiệm phản tư 5 câu hỏi thực tế giúp cậu định vị nhóm tính cách bản ngã trong thế giới số, gỡ bỏ nhãn mác thế giới ảo để nhận lại "Thẻ bài năng lực" độc quyền định hướng thói quen đời thực.
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
                <p className="text-[10.5px] text-slate-400 font-light leading-snug">Thiết kế bởi nhóm Nghiên cứu và tham vấn các thầy cô Tâm lí học đường dựa trên bối cảnh học sinh THPT.</p>
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
            Bắt đầu khám phá ngay
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
                Câu hỏi {currentQuestionIdx + 1} / {questions.length}
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
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="min-h-[100px] flex items-center mb-6"
            >
              <h4 className="font-serif text-base sm:text-lg font-semibold text-slate-700 leading-relaxed text-left">
                {questions[currentQuestionIdx].question}
              </h4>
            </motion.div>
          </AnimatePresence>

          {/* Options List */}
          <div className="space-y-3 mb-6">
            {questions[currentQuestionIdx].options.map((opt) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-2xl text-xs sm:text-sm border transition-all duration-200 flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? "bg-emerald-500 border-emerald-500 text-white font-medium shadow-sm"
                      : "bg-white/45 hover:bg-white/65 backdrop-blur-sm border-white/40 text-slate-600"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono text-[10px] font-bold shrink-0 ${
                    isSelected ? "bg-white/25 border-white text-white" : "bg-slate-50 border-slate-200 text-slate-400"
                  }`}>
                    {opt.id}
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
              CÂU {currentQuestionIdx + 1} / {questions.length}
            </span>
            <button
              onClick={() => {
                if (currentQuestionIdx < questions.length - 1) {
                  setCurrentQuestionIdx(currentQuestionIdx + 1);
                } else {
                  calculateResult(selectedAnswers);
                }
              }}
              disabled={!selectedAnswers[currentQuestionIdx]}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIdx === questions.length - 1 ? "Xem kết quả 🔮" : "Câu tiếp"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Result Screen with 3D Flip Card */}
      {personalityResult && (
        <div className="bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-sm p-6 sm:p-8 mx-auto max-w-xl space-y-6 text-center relative">
          
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
              Bản Ngã Định Vị Thành Công!
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-800">
              BẠN LÀ AI TRONG THẾ GIỚI SỐ? ✨
            </h3>
            <p className="text-[11px] text-slate-400">
              Lấy cảm hứng từ các hành vi kỹ thuật số & lời khuyên từ các chuyên gia tâm lý
            </p>
          </div>

          {/* FLIPPABLE 3D CARD COMPONENT */}
          <div 
            className="relative h-[450px] w-full max-w-[320px] mx-auto no-dark-override"
            style={{ perspective: "1000px" }}
          >
            <div
              onClick={handleCardClick}
              style={{
                transformStyle: "preserve-3d",
                transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
              className="relative w-full h-full cursor-pointer select-none no-dark-override"
            >
              
              {/* CARD FRONT SIDE (COVER - UNREVEALED) */}
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
                className="rounded-[36px] p-6 flex flex-col justify-between border-2 border-slate-700 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl overflow-hidden no-dark-override"
              >
                {/* Mystical glow visuals */}
                <div className="absolute top-[-10%] right-[-10%] w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-56 h-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
                
                {/* Decorative borders */}
                <div className="absolute inset-3.5 border border-white/10 rounded-[28px] pointer-events-none" />
                <div className="absolute inset-4 border border-emerald-500/10 rounded-[26px] pointer-events-none" />
                
                {/* Cover Header */}
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-[9px] font-mono tracking-widest text-emerald-400 font-bold uppercase">Cozy Compass</span>
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>

                {/* Cover Body */}
                <div className="text-center space-y-4 relative z-10 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-4xl shadow-lg border-2 border-emerald-400/30 animate-float">
                    🔮
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-serif text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-100 to-indigo-200">
                      BẠN LÀ AI TRONG THẾ GIỚI SỐ?
                    </h4>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                      Thẻ Bài Định Vị Bản Ngã
                    </p>
                  </div>
                </div>

                {/* Cover Footer */}
                <div className="text-center relative z-10 border-t border-white/5 pt-3 flex flex-col items-center gap-1">
                  <p className="text-[11px] font-bold text-emerald-400 animate-pulse flex items-center gap-1">
                    <span>Chạm để lật giải mã</span>
                    <span>✨</span>
                  </p>
                  <span className="text-[9px] text-slate-500 font-mono">ID: CZ-COMPASS-2026</span>
                </div>
              </div>
  
              {/* CARD BACK SIDE (REVEALED RESULT) */}
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
                className="rounded-[36px] p-6 flex flex-col justify-between border-2 border-slate-700 text-white shadow-2xl overflow-hidden bg-slate-950 no-dark-override"
              >
                {/* Colored visual backdrop */}
                <div className={`absolute -top-12 -right-12 w-48 h-48 rounded-full ${theme?.glowColor} blur-3xl pointer-events-none`} />
                <div className="absolute inset-3.5 border border-white/10 rounded-[28px] pointer-events-none" />

                {/* Back Header */}
                <div className="flex justify-between items-center relative z-10 pb-2 border-b border-white/15 shrink-0">
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">ĐÃ ĐỊNH VỊ BẢN NGÃ</span>
                  <span className="text-[10px] font-bold text-emerald-400">Cozy ✨</span>
                </div>

                {/* Scrollable Container for all content to prevent overflow in 450px card height */}
                <div 
                  className="flex-1 overflow-y-auto mt-2.5 pr-1 space-y-4 relative z-10 text-center"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255, 255, 255, 0.15) transparent",
                  }}
                >
                  <div className="space-y-1">
                    <div className={`mx-auto w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-md border border-white/15 ${personalityResult.color} animate-bounce`}>
                      {personalityResult.icon}
                    </div>
                    <h4 className="font-serif text-lg font-black tracking-tight text-white mt-2">
                      {personalityResult.title}
                    </h4>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                      {personalityResult.subtitle}
                    </p>
                    <div className="mt-2.5 mx-auto px-3 py-1 bg-white/10 rounded-full max-w-max flex items-center justify-center border border-white/5 shadow-inner">
                      <span className="text-sm font-medium text-slate-200">
                        {personalityResult.phanTich}
                      </span>
                    </div>
                  </div>

                  {/* Read personality analysis */}
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-justify">
                    <p className="text-[11px] text-slate-200 leading-relaxed font-light italic">
                      “ {personalityResult.docVi} ”
                    </p>
                  </div>

                  {/* Đặc trưng cốt lõi & Điểm mù tâm lý */}
                  {personalityResult.dacTrung && personalityResult.diemMu && (
                    <div className="grid grid-cols-1 gap-2.5">
                      {/* Đặc trưng cốt lõi */}
                      <div className="bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-xl text-left space-y-1">
                        <span className={`text-[10px] font-extrabold uppercase tracking-widest block font-sans ${
                          resultKey === "A" ? "text-pink-400" :
                          resultKey === "B" ? "text-slate-400" :
                          resultKey === "C" ? "text-blue-400" :
                          "text-emerald-400"
                        }`}>
                          🌟 ĐẶC TRƯNG CỐT LÕI
                        </span>
                        <div className="space-y-1 text-[10.5px] text-slate-200 font-light">
                          {personalityResult.dacTrung.map((dt, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{dt}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Điểm mù tâm lý */}
                      <div className="bg-rose-500/5 border border-rose-500/10 p-2.5 rounded-xl text-left space-y-1">
                        <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest block font-sans">
                          ⚠️ ĐIỂM MÙ TÂM LÝ
                        </span>
                        <div className="space-y-1 text-[10.5px] text-slate-200 font-light">
                          {personalityResult.diemMu.map((dm, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <span className="text-rose-400 font-bold">•</span>
                              <span>{dm}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Lời khuyên phát triển */}
                  {personalityResult.loiKhuyenPhatTrien && (
                    <div className="bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-xl text-left space-y-1">
                      <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block font-sans">
                        🌱 LỜI KHUYÊN PHÁT TRIỂN
                      </span>
                      <p className="text-[10.5px] text-slate-200 leading-relaxed font-light italic">
                        “ {personalityResult.loiKhuyenPhatTrien} ”
                      </p>
                    </div>
                  )}

                  {/* Handheld Item */}
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-400">Vật Phẩm Trao Tay</span>
                    <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <span>{personalityResult.icon}</span>
                      <span className={`tracking-wide bg-gradient-to-r ${theme?.itemGradient} bg-clip-text text-transparent`}>
                        {personalityResult.item}
                      </span>
                    </span>
                  </div>

                  {/* Back Footer (Second Round Mission) */}
                  <div className="text-left space-y-1 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block font-mono">Nhiệm Vụ Rèn Luyện</span>
                    <p className="text-[10.5px] text-slate-300 leading-snug font-sans">
                      {personalityResult.nhiemVu}
                    </p>
                  </div>

                  {/* Lời khuyên tâm lý */}
                  <div className="text-left space-y-1 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                    <span className={`text-sm font-bold uppercase tracking-widest block font-sans ${
                      resultKey === "A" ? "text-pink-400" :
                      resultKey === "B" ? "text-slate-400" :
                      resultKey === "C" ? "text-blue-400" :
                      "text-emerald-400"
                    }`}>
                      LỜI KHUYÊN TỪ COREZ 🌿
                    </span>
                    <div className="space-y-1.5 mt-1.5">
                      {personalityResult.loiKhuyen.map((advice, index) => (
                        <p key={index} className="text-[10.5px] text-white/80 leading-relaxed font-sans">
                          {advice}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Helper feedback text */}
          <div className="text-center pt-2">
            <button
              onClick={handleCardClick}
              className="px-5 py-2.5 rounded-xl bg-slate-800/5 hover:bg-slate-800/10 border border-slate-200/50 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow text-emerald-500" />
              Chạm để lật Thẻ Bài Định Vị
            </button>
          </div>

          {/* Action retake */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center max-w-sm mx-auto">
            <button
              onClick={handleStartTest}
              className="w-full px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:text-slate-800 hover:bg-slate-50 text-xs font-bold text-slate-500 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              Đo lường lại từ đầu
            </button>
          </div>

          {/* Social media sharing motivation */}
          <div className="bg-emerald-50/40 border border-emerald-100 p-4.5 rounded-[24px] space-y-2 text-justify">
            <h5 className="font-serif text-sm font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Thử thách lan tỏa:
            </h5>
            <p className="text-xs text-emerald-700 leading-relaxed font-medium">
              Chụp màn hình thẻ bài của cậu rồi đăng lên story kèm hashtag #CozyLangSon để truyền cảm hứng làn sóng sống khỏe đời thực nhé! 🌱
            </p>
          </div>

        </div>
      )}

    </div>
  );
}
