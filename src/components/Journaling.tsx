import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Mail, 
  Lock, 
  Unlock, 
  Send, 
  Calendar, 
  RefreshCw, 
  Clock, 
  Check, 
  Trash2, 
  Sparkles, 
  Heart,
  ChevronRight,
  Bookmark
} from "lucide-react";
import { useUserData, ReflectionLog, FutureLetter } from "../context/UserContext";

interface Prompt {
  id: number;
  text: string;
}

const DAILY_PROMPTS: Prompt[] = [
  { id: 1, text: "Điều gì đã làm cậu mỉm cười mộc mạc nhất trong ngày hôm nay?" },
  { id: 2, text: "Nếu được gửi một lời nhắn nhủ chân thành cho chính mình của một năm trước, cậu sẽ viết gì?" },
  { id: 3, text: "Một áp lực hay nỗi buồn thầm kín nào đang đè nặng lồng ngực cậu lúc này? Trút ra trang giấy nhé." },
  { id: 4, text: "Ai là người cậu muốn gửi lời cảm ơn thầm lặng nhất hôm nay? Vì lý do gì?" },
  { id: 5, text: "Mô tả một khoảng lặng bình yên cậu cảm nhận ngoài đời thực hôm nay (một ngọn gió, một tách trà, tiếng lá rụng...)." },
  { id: 6, text: "Ngày hôm nay, cậu tự hào về điều mộc mạc nào nhất của bản thân? Dù chỉ là uống đủ nước." }
];

interface JournalingProps {
  initialTab?: "daily" | "future";
}

export default function Journaling({ initialTab }: JournalingProps) {
  const { userData, addReflection, deleteReflection, addFutureLetter, deleteFutureLetter, addXP } = useUserData();
  const reflections = userData.reflections || [];
  const futureLetters = userData.futureLetters || [];

  // Reflections state
  const [currentPromptIdx, setCurrentPromptIdx] = useState(0);
  const [reflectionInput, setReflectionInput] = useState("");

  // Future Letters state
  const [letterContent, setLetterContent] = useState("");
  const [releaseTimeline, setReleaseTimeline] = useState("7"); // Days
  
  // Animation states
  const [isSealing, setIsSealing] = useState(false);
  const [activeTab, setActiveTab] = useState<"daily" | "future">(initialTab || "daily");

  // Deletion and toast states
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"reflection" | "letter" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    // Select random prompt on start
    setCurrentPromptIdx(Math.floor(Math.random() * DAILY_PROMPTS.length));
  }, []);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleNextPrompt = () => {
    let nextIdx = currentPromptIdx;
    while (nextIdx === currentPromptIdx && DAILY_PROMPTS.length > 1) {
      nextIdx = Math.floor(Math.random() * DAILY_PROMPTS.length);
    }
    setCurrentPromptIdx(nextIdx);
  };

  const handleSubmitReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;

    const newLog: ReflectionLog = {
      id: `ref-${Date.now()}`,
      date: new Date().toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      promptText: DAILY_PROMPTS[currentPromptIdx].text,
      answerText: reflectionInput
    };

    addReflection(newLog);
    addXP(15); // reward for reflection
    setReflectionInput("");
    setToastMessage("Ghi nhận nhật ký phản tư thành công! (+15 karmaXP) 🌱");
  };

  const handleDeleteReflectionClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteType("reflection");
  };

  const handleDeleteLetterClick = (id: string) => {
    setDeleteTargetId(id);
    setDeleteType("letter");
  };

  const confirmDelete = () => {
    if (!deleteTargetId || !deleteType) return;
    
    if (deleteType === "reflection") {
      deleteReflection(deleteTargetId);
      setToastMessage("Đã xóa nhật ký thành công! 🍃");
    } else {
      deleteFutureLetter(deleteTargetId);
      setToastMessage("Đã xóa lá thư thời gian thành công! 🍃");
    }
    
    setDeleteTargetId(null);
    setDeleteType(null);
  };

  const handleSealLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!letterContent.trim()) return;

    setIsSealing(true);

    // Simulate beeswax sealing animation delay
    setTimeout(() => {
      const writeDate = new Date();
      const unlockDate = new Date();
      const days = parseInt(releaseTimeline);
      unlockDate.setDate(writeDate.getDate() + days);

      const timelineLabels: Record<string, string> = {
        "7": "7 Ngày Sau",
        "30": "30 Ngày Sau",
        "90": "3 Phân Kỳ (90 Ngày Sau)",
        "365": "1 Năm Sau"
      };

      const newLetter: FutureLetter = {
        id: `let-${Date.now()}`,
        writeDate: writeDate.toLocaleDateString("vi-VN"),
        unlockDate: unlockDate.toISOString(),
        content: letterContent,
        releaseTimelineLabel: timelineLabels[releaseTimeline] || "7 Ngày",
        isSealed: true
      };

      addFutureLetter(newLetter);
      addXP(30); // reward for sealing a future letter
      setLetterContent("");
      setIsSealing(false);
      setToastMessage("Đã niêm phong thư bằng sáp ong thành công! (+30 karmaXP) ✉️");
    }, 2200);
  };

  // Check if letter is unlocked
  const isLetterUnlocked = (unlockDateStr: string) => {
    const unlock = new Date(unlockDateStr);
    return new Date() >= unlock;
  };

  // Format countdown
  const getLetterCountdown = (unlockDateStr: string) => {
    const unlock = new Date(unlockDateStr);
    const diffMs = unlock.getTime() - new Date().getTime();
    if (diffMs <= 0) return "Sẵn sàng đọc";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `Mở khóa sau ${diffDays} ngày ${diffHrs} giờ`;
    }
    return `Mở khóa sau ${diffHrs} giờ`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 px-4 font-sans relative z-10" id="journaling-module">
      
      {/* Sub tabs header */}
      <div className="flex justify-center mb-6">
        <div className="bg-white/40 border border-white/40 backdrop-blur-md p-1.5 rounded-2xl flex gap-1 shadow-sm">
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "daily"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Nhật Ký Phản Tư Hàng Ngày
          </button>
          <button
            onClick={() => setActiveTab("future")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "future"
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Mail className="w-4 h-4" />
            Lá Thư Tương Lai (Time Capsule)
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: DAILY REFLECTIVE PROMPTS */}
        {activeTab === "daily" && (
          <motion.div
            key="daily-prompt-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
          >
            {/* Input Column - 7 Cols */}
            <div className="md:col-span-7 bg-white/65 backdrop-blur-xl rounded-[32px] border border-white/40 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5">
              
              <div className="space-y-1 border-b border-white/30 pb-3">
                <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                  Daily Prompt
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-800">
                  Phản Tư Độc Bản Ngày Hôm Nay
                </h3>
                <p className="text-[11px] text-slate-400 font-light">
                  Mỗi ngày là một gợi ý phản tư khác nhau giúp cậu tập trung vào vẻ đẹp mộc mạc đời thực và xoa dịu những so sánh vụn vặt trên internet.
                </p>
              </div>

              {/* Dynamic Prompt Selector Box */}
              <div className="bg-emerald-50/50 rounded-2xl p-4.5 border border-emerald-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1 text-left flex-1">
                  <span className="text-[9px] font-mono font-black text-emerald-600 tracking-wider uppercase block">Câu hỏi gợi mở tâm hồn</span>
                  <h4 className="font-serif text-sm sm:text-base font-bold text-emerald-950 leading-relaxed">
                    “{DAILY_PROMPTS[currentPromptIdx].text}”
                  </h4>
                </div>
                <button
                  onClick={handleNextPrompt}
                  className="p-2 bg-white text-emerald-600 rounded-xl hover:bg-emerald-50 border border-emerald-100 shadow-sm transition-all cursor-pointer shrink-0"
                  title="Thay đổi câu hỏi gợi ý"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                </button>
              </div>

              {/* Journal Form */}
              <form onSubmit={handleSubmitReflection} className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase font-mono block">Nội dung phản tư của cậu</label>
                  <textarea
                    rows={6}
                    placeholder="Hãy viết thật chậm, mộc mạc và chân thực nhất những suy nghĩ ẩn sâu trong cậu ngày hôm nay... Ở CoreZ, không ai phán xét cậu cả."
                    value={reflectionInput}
                    onChange={(e) => setReflectionInput(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-white/40 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm bg-white/50 placeholder:text-slate-400 shadow-inner resize-none flex-1 min-h-[140px]"
                  />
                </div>

                <div className="flex justify-between items-center gap-4">
                  <div className="text-[10px] text-slate-400 italic">
                    *Mỗi ghi chép của cậu được bảo mật tối đa trên trình duyệt này.
                  </div>
                  <button
                    type="submit"
                    disabled={!reflectionInput.trim()}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow transition-all active:scale-95 flex items-center gap-1.5 shrink-0 ${
                      reflectionInput.trim()
                        ? "bg-emerald-500 hover:bg-emerald-600 cursor-pointer shadow-md shadow-emerald-200"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    Lưu Trang Nhật Ký
                  </button>
                </div>
              </form>

            </div>

            {/* Reflections Log Column - 5 Cols */}
            <div className="md:col-span-5 bg-white/65 backdrop-blur-xl rounded-[32px] border border-white/40 p-5 shadow-sm flex flex-col justify-between h-[450px]">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4 text-emerald-500" />
                  Ký Ức Phản Tư Của Cậu ({reflections.length})
                </h4>
                <span className="text-[9.5px] text-slate-400 font-mono">Lịch sử ghi chép</span>
              </div>

              {/* Log list */}
              <div className="flex-1 overflow-y-auto space-y-3.5 my-3 pr-1.5">
                {reflections.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-2 p-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                      📖
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-[180px] font-light leading-relaxed">
                      Sổ tay đang trống trơn. Hãy ghi nhận dòng phản tư đầu tiên để khởi đầu hành trình sạc pin tâm hồn cậu nhé!
                    </p>
                  </div>
                ) : (
                  reflections.map((log) => (
                    <div
                      key={log.id}
                      className="p-3 bg-white/40 border border-white/30 rounded-xl space-y-2 relative group hover:border-slate-300 transition-all shadow-inner"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono font-medium">
                          <Calendar className="w-3 h-3" />
                          <span>{log.date}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteReflectionClick(log.id)}
                          className="text-slate-300 hover:text-rose-500 p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100 absolute top-2.5 right-2.5 cursor-pointer"
                          title="Xóa dòng nhật ký này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <h5 className="text-[10.5px] font-bold text-emerald-800 leading-snug">
                          Q: {log.promptText}
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-wrap font-light text-justify">
                          {log.answerText}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Quote footer */}
              <div className="pt-2 text-center text-[9px] text-slate-400 font-light border-t border-slate-150/40 italic">
                “Viết lách mộc mạc chính là một liều thuốc lọc bỏ bớt bụi bặm cho tâm hồn.” 🌱
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: FUTURE TIME CAPSULE LETTERS */}
        {activeTab === "future" && (
          <motion.div
            key="future-letter-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
          >
            {/* Input Column - 7 Cols */}
            <div className="md:col-span-7 bg-white/65 backdrop-blur-xl rounded-[32px] border border-white/40 p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-5 relative">
              
              {/* Beeswax sealing overlay animation */}
              <AnimatePresence>
                {isSealing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 backdrop-blur-md rounded-[32px] z-30 flex flex-col items-center justify-center p-6 text-center space-y-4"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-5xl"
                    >
                      ✉️
                    </motion.div>
                    <div className="space-y-1.5">
                      <h4 className="font-serif text-base font-bold text-slate-800 animate-pulse">
                        Đang niêm phong thư bằng sáp ong...
                      </h4>
                      <p className="text-xs text-slate-400 font-light max-w-xs mx-auto leading-relaxed">
                        Thư của cậu đang được bọc sáp, đóng dấu mộc CoreZ và gửi vào lồng kính thời gian. Xin hãy đợi trong giây lát...
                      </p>
                    </div>
                    {/* Tiny animated spinner */}
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1 border-b border-white/30 pb-3">
                <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                  Time Capsule
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-800">
                  Lá Thư Gửi Tương Lai (Bản Ngã Khóa Sáp)
                </h3>
                <p className="text-[11px] text-slate-400 font-light">
                  Hãy viết một lá thư tâm sự cho chính bản thân của tương lai. Chọn mốc thời gian khóa sáp và lá thư sẽ hoàn toàn bí mật cho tới đúng ngày được phép mở khóa.
                </p>
              </div>

              {/* Future Letter Form */}
              <form onSubmit={handleSealLetter} className="space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Timeline Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Cậu muốn khóa thư này trong bao lâu?</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: "7", label: "7 ngày sau" },
                      { value: "30", label: "30 ngày" },
                      { value: "90", label: "90 ngày" },
                      { value: "365", label: "1 năm sau" }
                    ].map((time) => (
                      <button
                        key={time.value}
                        type="button"
                        onClick={() => setReleaseTimeline(time.value)}
                        className={`py-2 px-1 rounded-xl text-[10.5px] font-bold border transition-all text-center cursor-pointer ${
                          releaseTimeline === time.value
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                            : "bg-white/40 border-white/30 text-slate-500 hover:bg-white/60"
                        }`}
                      >
                        {time.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Viết thư cho tương lai của chính mình</label>
                  <textarea
                    rows={5}
                    placeholder="Chào tôi ở tương lai ơi, bạn thế nào rồi? Áp lực thi cử đã vơi đi chưa? Bạn đã chinh phục được đỉnh Phai Vệ chưa? Gửi gắm những câu hỏi, trăn trở, niềm hy vọng của tôi lúc này cho bạn nhé..."
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-white/40 focus:outline-none focus:border-emerald-500 text-xs sm:text-sm bg-white/50 placeholder:text-slate-400 shadow-inner resize-none flex-1 min-h-[140px]"
                  />
                </div>

                <div className="flex justify-between items-center gap-4">
                  <div className="text-[10px] text-slate-400 italic">
                    *Mỗi lá thư được lưu bảo mật cục bộ, không gửi lên bất kỳ máy chủ nào.
                  </div>
                  <button
                    type="submit"
                    disabled={!letterContent.trim() || isSealing}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow transition-all active:scale-95 flex items-center gap-1.5 shrink-0 ${
                      letterContent.trim() && !isSealing
                        ? "bg-slate-800 hover:bg-slate-900 cursor-pointer shadow"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Niêm Phong Thư (Seal Letter)
                  </button>
                </div>

              </form>

            </div>

            {/* Locked Letters Column - 5 Cols */}
            <div className="md:col-span-5 bg-white/65 backdrop-blur-xl rounded-[32px] border border-white/40 p-5 shadow-sm flex flex-col justify-between h-[450px]">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-500 animate-pulse" />
                  Hòm Thư Thời Gian ({futureLetters.length})
                </h4>
                <span className="text-[9.5px] text-slate-400 font-mono">Hòm lưu trữ sáp</span>
              </div>

              {/* Letter archive list */}
              <div className="flex-1 overflow-y-auto space-y-3 my-3 pr-1">
                {futureLetters.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-2 p-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                      ✉️
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-[180px] font-light leading-relaxed">
                      Chưa có bức thư thời gian nào. Hãy gửi gắm những lời nhắn nhủ thầm kín cho chính mình sau này nhé!
                    </p>
                  </div>
                ) : (
                  futureLetters.map((letter) => {
                    const unlocked = isLetterUnlocked(letter.unlockDate);
                    return (
                      <div
                        key={letter.id}
                        className={`p-3 rounded-xl border relative group transition-all shadow-inner ${
                          unlocked 
                            ? "bg-emerald-50/20 border-emerald-200" 
                            : "bg-slate-50 border-slate-200"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2.5">
                          <div className="flex items-center gap-1 text-[9px] text-slate-400 font-mono">
                            <Calendar className="w-2.5 h-2.5" />
                            <span>Gửi ngày: {letter.writeDate}</span>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteLetterClick(letter.id)}
                            className="text-slate-300 hover:text-rose-500 p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100 absolute top-2 right-2 cursor-pointer"
                            title="Xóa bức thư này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Lock / Unlock display status */}
                        <div className="mt-2.5 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-lg shrink-0 ${
                              unlocked ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"
                            }`}>
                              {unlocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            </div>
                            <div className="text-left">
                              <h5 className="text-[10.5px] font-bold text-slate-800 leading-none">
                                Gửi cho tôi của {letter.releaseTimelineLabel}
                              </h5>
                              <p className="text-[9.5px] text-slate-400 font-mono mt-0.5 leading-none">
                                {unlocked ? "Đã sẵn sàng đọc" : getLetterCountdown(letter.unlockDate)}
                              </p>
                            </div>
                          </div>

                          {/* Content readable only when unlocked */}
                          {unlocked ? (
                            <div className="bg-white p-2.5 rounded-lg border border-emerald-100/50 mt-1">
                              <p className="text-[11px] text-slate-600 leading-relaxed text-justify whitespace-pre-wrap font-light">
                                {letter.content}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-slate-100/70 py-2 px-3 rounded-lg border border-slate-150/50 text-center mt-1">
                              <span className="text-[9.5px] text-slate-400 font-medium tracking-tight">
                                🔒 Thư đã khóa sáp ong • Nội dung được bảo vệ tuyệt đối
                              </span>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer text */}
              <div className="pt-2 text-center text-[9px] text-slate-400 font-light border-t border-slate-150/40">
                *Thời gian trôi rất nhanh, tớ sẽ bảo vệ hòm thư này cho tới đúng ngày hẹn. 🧭
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Confirmation Deletion Modal */}
      <AnimatePresence>
        {deleteTargetId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-sm bg-white/90 dark:bg-slate-900/95 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl rounded-[28px] p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center gap-2 border-b border-slate-100/30 pb-3 mb-4">
                <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-xl">
                  <Trash2 className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="font-serif text-sm font-bold text-slate-800 dark:text-slate-100">Xác nhận xóa</h4>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed mb-5">
                {deleteType === "reflection" 
                  ? "Cậu có chắc chắn muốn xóa nhật ký của ngày này không? Hành động này không thể hoàn tác."
                  : "Cậu có chắc chắn muốn xóa lá thư thời gian này không? Hành động này không thể hoàn tác."}
              </p>

              <div className="flex gap-2.5 w-full">
                <button
                  onClick={() => {
                    setDeleteTargetId(null);
                    setDeleteType(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Xác nhận xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-slate-900/90 dark:bg-slate-850/95 border border-white/10 text-white px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl z-[120] flex items-center gap-2 text-xs font-semibold"
          >
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
