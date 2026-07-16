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

    if (totalScore <= 12) {
      level = "GREEN";
      title = "Bản Ngã Vững Vàng • Tâm Trí Bình Yên";
      description =
        "Chúc mừng cậu! Cậu đang làm rất tốt trong việc làm chủ bản thân, kiểm soát thời gian trực tuyến và duy trì ranh giới khỏe mạnh với mạng xã hội. Cậu có nội lực vững vàng và ít bị lung lay bởi những con số lấp lánh trên màn hình ảo.";
      tips = [
        "Hãy duy trì những thói quen lành mạnh hiện tại cậu nhé.",
        "Chia sẻ năng lượng tích cực này đến những người bạn xung quanh cậu.",
        "Tiếp tục thực hành Detox số định kỳ để tâm trí luôn trong lành.",
      ];
    } else if (totalScore <= 18) {
      level = "YELLOW";
      title = "Bản Ngã Chông Chênh • Cần Nạp Năng Lượng";
      description =
        "Có vẻ như nhịp sống ảo và áp lực so sánh ngầm đang bắt đầu len lỏi vào tâm trí cậu rồi đấy. Có những lúc cậu cảm thấy bồn chồn, lo sợ mình bị bỏ lại phía sau (FOMO). Đây là tín hiệu cho thấy cậu cần dành thời gian yêu thương và tái tạo năng lượng cho bản thân.";
      tips = [
        "Thiết lập giới hạn thời gian lướt mạng xã hội (tối đa 45 phút/ngày).",
        "Thực hành viết nhật ký biết ơn để nhận ra những giá trị chân thực mình đang có.",
        "Dành ít nhất 1 giờ mỗi ngày hoàn toàn không điện thoại trước khi đi ngủ.",
      ];
    } else {
      level = "RED";
      title = "Khủng Hoảng Bản Ngã • Cần Hỗ Trợ Kịp Thời";
      description =
        "Cậu ơi, dường như áp lực đồng trang lứa và thế giới ảo đang đè nén khiến cậu kiệt sức. Cậu thường xuyên rơi vào vòng xoáy lo âu, trống rỗng và nghi ngờ giá trị bản thân. Đừng quá lo lắng, nhận diện được điều này đã là một bước dũng cảm rồi. Hãy để chúng mình đồng hành xoa dịu cậu nhé.";
      tips = [
        "Mạnh dạn gỡ bỏ hoặc tạm khóa các ứng dụng mạng xã hội gây lo âu trong 3 ngày.",
        "Sử dụng hộp thư 'Bức tường ẩn danh' để trút bỏ gánh nặng lòng mình.",
        "Nhấn nút SOS phía góc dưới bên phải để kết nối với phòng tham vấn tâm lý học đường.",
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
                  <div className="p-3 rounded-full bg-amber-50/80 text-amber-500 border border-amber-100 flex items-center gap-2">
                    <Activity className="w-7 h-7" />
                  </div>
                )}
                {calculatedResult.level === "RED" && (
                  <div className="p-3 rounded-full bg-red-50/80 text-red-500 border border-red-100 flex items-center gap-2 animate-bounce">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                )}
              </div>

              {/* Score label */}
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/60 border border-white/50 px-3 py-1 rounded-full font-mono mb-2.5 inline-block">
                Điểm Bản Ngã: {calculatedResult.score} / 25
              </span>

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
