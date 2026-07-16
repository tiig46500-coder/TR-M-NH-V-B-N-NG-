import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Activity, ShieldAlert, Heart, CheckCircle2 } from "lucide-react";
import { QUIZ_QUESTIONS } from "../data";
import { RiskLevel, QuizResult } from "../types";

interface AssessmentQuizProps {
  onComplete: (level: RiskLevel, score: number) => void;
  onNavigateToDashboard: () => void;
}

export default function AssessmentQuiz({ onComplete, onNavigateToDashboard }: AssessmentQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [calculatedResult, setCalculatedResult] = useState<QuizResult | null>(null);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  const LIKERT_OPTIONS = [
    { value: 1, label: "Rất không đồng ý", color: "hover:bg-white/60" },
    { value: 2, label: "Không đồng ý", color: "hover:bg-white/60" },
    { value: 3, label: "Bình thường", color: "hover:bg-white/60" },
    { value: 4, label: "Đồng ý", color: "hover:bg-amber-50/40" },
    { value: 5, label: "Rất đồng ý", color: "hover:bg-amber-50/40" },
  ];

  const handleSelectOption = (value: number) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(updatedAnswers);

    // Auto-advance with a tiny delay for satisfaction
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 250);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1 && answers[currentQuestion.id]) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const calculateScore = () => {
    let totalScore = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      totalScore += answers[q.id] || 3; // Default to neutral if somehow unanswered
    });

    let level: RiskLevel = "GREEN";
    let title = "";
    let description = "";
    let tips: string[] = [];

    if (totalScore >= 12 && totalScore <= 24) {
      level = "GREEN";
      title = "Mức độ An toàn • Chông chênh thấp";
      description =
        "Tâm lý ổn định, có khả năng làm chủ tốt không gian số, nhận thức rõ giá trị thực của bản thân. Chúc mừng cậu nhé, cậu đang có ranh giới lành mạnh tuyệt vời với các thiết bị công nghệ và không bị cuốn vào những hào nhoáng của thế giới ảo.";
      tips = [
        "Hãy tiếp tục duy trì ranh giới số lành mạnh hiện tại cậu nhé.",
        "Lan tỏa năng lượng bình yên, cân bằng này tới mọi người xung quanh.",
        "Dành thời gian rèn luyện thêm nhiều thói quen tự chăm sóc bản thân offline.",
      ];
    } else if (totalScore >= 25 && totalScore <= 36) {
      level = "YELLOW";
      title = "Mức độ Cảnh báo nhẹ • Chông chênh trung bình";
      description =
        "Bắt đầu chịu tác động của thuật toán và áp lực đồng trang lứa. Có những lúc cậu lướt mạng xã hội vô thức và cảm thấy bồn chồn lo âu về vị trí của bản thân. Đây là dấu hiệu cho thấy cậu nên kiểm soát lại thời gian và cách thức sử dụng mạng xã hội.";
      tips = [
        "Thiết lập giới hạn thời gian lướt mạng xã hội xuống dưới 1 giờ mỗi ngày.",
        "Thực hành viết nhật ký cảm xúc hoặc nhật ký biết ơn để giải tỏa bớt lo âu.",
        "Thực hiện tắt hết kết nối điện thoại trước khi đi ngủ tối thiểu 30 phút.",
      ];
    } else if (totalScore >= 37 && totalScore <= 48) {
      level = "ORANGE";
      title = "Mức độ Báo động • Chông chênh cao";
      description =
        "Bị ảnh hưởng tâm lý rõ rệt. Cậu dễ rơi vào trạng thái tự ti khi so sánh mình với người khác, cảm thấy lo âu khi thiếu tương tác hoặc bỏ lỡ thông báo số. Đã đến lúc cậu cần chủ động áp dụng các biện pháp 'Thanh lọc số' mạnh mẽ hơn để bảo vệ bản thân.";
      tips = [
        "Tắt tất cả thông báo không thực sự quan trọng từ các ứng dụng mạng xã hội.",
        "Thử thách bản thân ngắt kết nối tạm thời hoặc giới hạn sử dụng thiết bị nghiêm ngặt.",
        "Dành ít nhất 2 giờ mỗi ngày cho các hoạt động thể chất hoặc sở thích thực tế.",
      ];
    } else {
      level = "RED";
      title = "Mức độ Nghiêm trọng • Chông chênh rất cao";
      description =
        "Báo động đỏ về sức khỏe tinh thần. Cậu đang có nguy cơ rơi vào trạng thái cô lập xã hội, trầm cảm hoặc kiệt sức tinh thần do mạng xã hội. Cậu rất cần thực hiện ngay các biện pháp 'Ngắt kết nối' (Digital Detox) triệt để và tìm kiếm sự hỗ trợ tư vấn tâm lý kịp thời.";
      tips = [
        "Mạnh dạn thực hành 'Ngắt kết nối hoàn toàn' (Digital Detox) từ 2-5 ngày để thanh lọc tâm trí.",
        "Trút bỏ những lo toan ẩn giấu qua 'Bức tường ẩn danh' hoặc chia sẻ trực tiếp với người đáng tin cậy.",
        "Nhấn nút SOS ở góc dưới màn hình để liên hệ ngay phòng hỗ trợ tư vấn tâm lý học đường.",
      ];
    }

    const result: QuizResult = {
      score: totalScore,
      level,
      title,
      description,
      tips,
    };

    setCalculatedResult(result);
    setShowResult(true);
    onComplete(level, totalScore);
  };

  const isAllAnswered = QUIZ_QUESTIONS.every((q) => answers[q.id] !== undefined);
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 relative bg-transparent">
      {/* Healing decorative gradients */}
      <div className="absolute top-1/10 left-1/10 w-64 h-64 rounded-full bg-emerald-50/20 blur-3xl" />
      <div className="absolute bottom-1/10 right-1/10 w-80 h-80 rounded-full bg-sky-50/30 blur-3xl" />

      <div className="w-full max-w-xl bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-sm p-6 sm:p-8 relative z-10">
        {!showResult ? (
          <div>
            {/* Progress Bar & Header */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[10px] font-bold tracking-wider text-[#34D399] uppercase bg-emerald-50 px-2.5 py-1 rounded-full">
                  Trạm Đo Lường
                </span>
                <span className="text-xs font-medium text-slate-400 font-mono">
                  Câu hỏi {currentIndex + 1} / {totalQuestions}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-[#34D399]"
                />
              </div>
            </div>

            {/* Question Screen */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="min-h-[140px] flex items-center mb-8"
              >
                <h3 className="font-serif text-lg sm:text-xl font-medium text-slate-700 leading-relaxed">
                  “{currentQuestion.text}”
                </h3>
              </motion.div>
            </AnimatePresence>

            {/* Likert 5 Options */}
            <div className="space-y-2.5 mb-8">
              {LIKERT_OPTIONS.map((opt) => {
                const isSelected = answers[currentQuestion.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm sm:text-base border transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? "bg-[#34D399] border-[#34D399] text-white font-medium shadow-sm"
                        : `bg-white/45 backdrop-blur-sm border-white/40 text-slate-600 ${opt.color}`
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-100/60 text-slate-400 border border-slate-200/20"
                      }`}
                    >
                      Mức {opt.value}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center border-t border-white/40 pt-5">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                  currentIndex === 0
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Câu trước</span>
              </button>

              {currentIndex === totalQuestions - 1 ? (
                <button
                  id="submit-quiz-btn"
                  onClick={calculateScore}
                  disabled={!isAllAnswered}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
                    isAllAnswered
                      ? "bg-[#34D399] hover:bg-emerald-500 text-white hover:scale-[1.02]"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  Xem Kết Quả
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!answers[currentQuestion.id]}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                    !answers[currentQuestion.id]
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-[#34D399] hover:text-emerald-600 hover:bg-white/50"
                  }`}
                >
                  <span>Câu tiếp</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Result Screen */
          calculatedResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center font-sans"
            >
              {/* Risk Level Badge */}
              <div className="flex justify-center mb-5">
                {calculatedResult.level === "GREEN" && (
                  <div className="p-3 rounded-full bg-emerald-50/80 text-emerald-500 border border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-7 h-7 fill-emerald-500/10" />
                  </div>
                )}
                {calculatedResult.level === "YELLOW" && (
                  <div className="p-3 rounded-full bg-yellow-50/80 text-yellow-500 border border-yellow-100 flex items-center gap-2">
                    <Activity className="w-7 h-7" />
                  </div>
                )}
                {calculatedResult.level === "ORANGE" && (
                  <div className="p-3 rounded-full bg-orange-50/80 text-orange-500 border border-orange-100 flex items-center gap-2">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                )}
                {calculatedResult.level === "RED" && (
                  <div className="p-3 rounded-full bg-red-50/80 text-red-500 border border-red-100 flex items-center gap-2 animate-bounce">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                )}
              </div>

              {/* Score and Color Badge Indicator */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 bg-slate-50/50 backdrop-blur-md p-4 rounded-3xl border border-slate-100/50">
                <div className="text-center sm:text-left">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold font-mono">Điểm Bản Ngã DII</p>
                  <p className="text-4xl font-extrabold text-slate-800 tracking-tight mt-1 leading-none">
                    {calculatedResult.score} <span className="text-sm text-slate-400 font-normal">/ 60</span>
                  </p>
                </div>
                
                {/* Colored Box Indicator / Ô màu */}
                <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white border border-slate-100 shadow-sm shrink-0">
                  {calculatedResult.level === "GREEN" && (
                    <>
                      <div className="w-4.5 h-4.5 rounded-lg bg-emerald-500 animate-pulse shrink-0 shadow-md shadow-emerald-500/30" />
                      <span className="text-xs font-bold text-emerald-600">Mức độ An toàn (Xanh lá)</span>
                    </>
                  )}
                  {calculatedResult.level === "YELLOW" && (
                    <>
                      <div className="w-4.5 h-4.5 rounded-lg bg-yellow-400 animate-pulse shrink-0 shadow-md shadow-yellow-400/30" />
                      <span className="text-xs font-bold text-yellow-600">Mức độ Cảnh báo nhẹ (Vàng)</span>
                    </>
                  )}
                  {calculatedResult.level === "ORANGE" && (
                    <>
                      <div className="w-4.5 h-4.5 rounded-lg bg-orange-500 animate-pulse shrink-0 shadow-md shadow-orange-500/30" />
                      <span className="text-xs font-bold text-orange-500">Mức độ Báo động (Cam)</span>
                    </>
                  )}
                  {calculatedResult.level === "RED" && (
                    <>
                      <div className="w-4.5 h-4.5 rounded-lg bg-rose-600 animate-pulse shrink-0 shadow-md shadow-rose-600/30" />
                      <span className="text-xs font-bold text-rose-600">Mức độ Nghiêm trọng (Đỏ)</span>
                    </>
                  )}
                </div>
              </div>

              <h2 className="font-serif text-2xl font-bold text-slate-800 leading-tight mb-4">
                {calculatedResult.title}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed text-justify bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-white/40 mb-6 shadow-sm">
                {calculatedResult.description}
              </p>

              {/* Actionable Tips */}
              <div className="text-left mb-8">
                <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/10" />
                  Gợi ý hành động chữa lành:
                </h4>
                <ul className="space-y-2.5">
                  {calculatedResult.tips.map((tip, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-slate-600 items-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA to 4D practice space */}
              <button
                id="go-to-4d-btn"
                onClick={onNavigateToDashboard}
                className="w-full py-4 bg-[#34D399] text-white font-semibold rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                Vào Không Gian Thực Hành 4D
              </button>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
