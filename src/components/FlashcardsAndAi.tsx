import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Send, 
  User, 
  Sparkles,
  ShieldAlert,
  Bot
} from "lucide-react";
import { FLASHCARDS } from "../data";
import { ChatMessage } from "../types";
import { useUserData } from "../context/UserContext";
import { saveFavoritePost } from "./GocBinhYen";

export default function FlashcardsAndAi() {
  const { userData } = useUserData();
  // ==========================================
  // Section 1: Flashcards State & Logic
  // ==========================================
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Cache for dynamic Gemini tips
  const [customTips, setCustomTips] = useState<Record<number, string>>({});
  const [loadingTipIds, setLoadingTipIds] = useState<Record<number, boolean>>({});

  const [savedCardIds, setSavedCardIds] = useState<Record<number, boolean>>({});
  const [savedMsgIds, setSavedMsgIds] = useState<Record<string, boolean>>({});

  const handleSaveCard = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chặn lật thẻ khi bấm nút lưu
    const cardId = currentCard.id;
    const adviceText = customTips[cardId] || currentCard.back;
    
    const postToSave = {
      id: `card-${cardId}-${Date.now()}`,
      aiAdvice: adviceText,
      category: currentCard.category,
      timestamp: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})
    };
    
    saveFavoritePost(postToSave);
    setSavedCardIds((prev) => ({ ...prev, [cardId]: true }));
  };

  const handleSaveMessage = (msg: ChatMessage) => {
    const postToSave = {
      id: msg.id,
      aiAdvice: msg.content,
      category: "AI Mentor",
      timestamp: new Date().toLocaleDateString("vi-VN") + " " + new Date().toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})
    };
    saveFavoritePost(postToSave);
    setSavedMsgIds((prev) => ({ ...prev, [msg.id]: true }));
  };

  const currentCard = FLASHCARDS[currentCardIdx];

  const handleCardClick = async () => {
    const cardId = currentCard.id;
    const nextFlippedState = !isFlipped;
    
    setIsFlipped(nextFlippedState);

    // If flipping to back and there's no custom tip generated yet, fetch it dynamically from Gemini
    if (nextFlippedState && !customTips[cardId]) {
      setLoadingTipIds((prev) => ({ ...prev, [cardId]: true }));
      try {
        const res = await fetch("/api/gemini-flashcard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            category: currentCard.category,
            front: currentCard.front
          })
        });

        if (!res.ok) {
          throw new Error("API request failed");
        }

        const data = await res.json();
        setCustomTips((prev) => ({ ...prev, [cardId]: data.reply }));
      } catch (error) {
        console.error("Error fetching Gemini flashcard solution:", error);
        // Fallback to pre-configured solution in case of network issue
        setCustomTips((prev) => ({ ...prev, [cardId]: currentCard.back }));
      } finally {
        setLoadingTipIds((prev) => ({ ...prev, [cardId]: false }));
      }
    }
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIdx((prev) => (prev + 1) % FLASHCARDS.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIdx((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
    }, 150);
  };

  // ==========================================
  // Section 2: AI Mentor ("Người Lắng Nghe") State & Logic
  // ==========================================
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      role: "model",
      content: "Chào cậu! Mình là CoreZ - góc nhỏ bình yên của cậu đây. Hôm nay cậu cảm thấy thế nào? Cứ thoải mái kể cho mình nghe nhé, mình luôn ở đây lắng nghe và giữ bí mật tuyệt đối cho cậu. 🌱",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: chatInput,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsLoading(true);

    try {
      // Send chat log to express backend
      const payloadMessages = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          messages: payloadMessages,
          moodLogs: userData.moodLogs
        })
      });

      if (!res.ok) {
        throw new Error("API call failed");
      }

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "model",
        content: data.reply,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Soothing local error response
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "model",
        content: "Cậu ơi, kết nối của mình đang hơi chập chờn một chút. Nhưng cậu nhớ nhé: cậu luôn tuyệt vời và xứng đáng được yêu thương. Hãy hít thở sâu cùng mình và thử nhắn lại sau vài giây nha! 🌱",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 px-4 font-sans grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
      
      {/* COLUMN 1: FLASHCARDS (Bí kíp 1 phút) - 5 Cols */}
      <div className="md:col-span-5 space-y-6">
        <div className="border-b border-white/40 pb-3">
          <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-amber-500 fill-amber-500/10" />
            Bí Kíp 1 Phút Chữa Lành
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Những mẹo tâm lý học đường nhỏ gọn nhưng hiệu lực, giúp cậu đánh tan lo âu tức thì. Click để lật thẻ!
          </p>
        </div>

        {/* CSS 3D Flippable Card with full 3D browser optimization */}
        <div 
          className="relative h-72 w-full"
          style={{ perspective: "1000px" }}
        >
          <div
            onClick={handleCardClick}
            style={{
              transformStyle: "preserve-3d",
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
            className="relative w-full h-full cursor-pointer select-none"
          >
            {/* Front Side */}
            <div 
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden", // Safari compatibility
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              className="bg-gradient-to-br from-amber-50/85 to-amber-100/40 backdrop-blur-md rounded-2xl border border-white/50 p-6 flex flex-col justify-between shadow-sm"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-wider text-amber-600 bg-amber-100/70 px-2 py-0.5 rounded uppercase border border-amber-200/20">
                  {currentCard.category}
                </span>
                <HelpCircle className="w-4.5 h-4.5 text-amber-400" />
              </div>

              <div className="text-center py-4">
                <h4 className="font-serif text-sm sm:text-base font-bold text-slate-700 leading-relaxed">
                  “ {currentCard.front} ”
                </h4>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-500 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>Bấm vào thẻ để lật xem giải pháp</span>
              </div>
            </div>

            {/* Back Side (Flipped & styled in modern healing Dark Mode) */}
            <div 
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden", // Safari compatibility
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                transform: "rotateY(180deg)",
              }}
              className="bg-slate-900/95 backdrop-blur-lg rounded-2xl border border-slate-700/65 p-6 flex flex-col justify-between shadow-xl"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded uppercase border border-emerald-500/30">
                  {loadingTipIds[currentCard.id] ? "Đang đúc kết..." : "Bí kíp 1 phút - CoreZ"}
                </span>
                <Heart className="w-4.5 h-4.5 text-rose-400 fill-rose-500/10" />
              </div>

              {/* Display loading skeleton or the beautiful result */}
              {loadingTipIds[currentCard.id] ? (
                <div className="flex-1 flex flex-col items-center justify-center py-4 space-y-3.5">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="text-2xl"
                  >
                    🌱
                  </motion.div>
                  <div className="space-y-2 w-full px-4">
                    <div className="h-3 bg-emerald-500/15 rounded-full w-3/4 mx-auto animate-pulse" />
                    <div className="h-3 bg-emerald-500/15 rounded-full w-5/6 mx-auto animate-pulse" style={{ animationDelay: "200ms" }} />
                    <div className="h-3 bg-emerald-500/15 rounded-full w-2/3 mx-auto animate-pulse" style={{ animationDelay: "400ms" }} />
                  </div>
                  <span className="text-[10px] text-emerald-400/80 font-mono tracking-wide animate-pulse">
                    Mầm non đang lớn mầm chữa lành...
                  </span>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center py-2 overflow-y-auto max-h-[160px] pr-1">
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-xs sm:text-[13px] leading-relaxed text-emerald-50/90 text-center font-medium font-sans px-2"
                  >
                    {customTips[currentCard.id] || currentCard.back}
                  </motion.p>
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-2.5 border-t border-slate-800/60 w-full">
                <span className="text-[10px] text-emerald-400 font-semibold">
                  Thực hành ngay cậu nhé! 🫧
                </span>
                <button
                  onClick={handleSaveCard}
                  className={`text-[10px] font-bold px-2 py-1 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border select-none ${
                    savedCardIds[currentCard.id]
                      ? "bg-rose-950/40 text-rose-300 border-rose-500/30"
                      : "bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/50"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${savedCardIds[currentCard.id] ? "fill-rose-400 text-rose-400" : ""}`} />
                  <span>{savedCardIds[currentCard.id] ? "Đã lưu" : "Lưu bí kíp"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card Navigator Buttons */}
        <div className="flex justify-between items-center bg-white/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/40 shadow-sm">
          <button
            onClick={handlePrevCard}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/50 transition-all cursor-pointer"
            title="Thẻ trước"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <span className="text-xs font-mono font-medium text-slate-400">
            Mẹo {currentCardIdx + 1} / {FLASHCARDS.length}
          </span>

          <button
            onClick={handleNextCard}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/50 transition-all cursor-pointer"
            title="Thẻ tiếp"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* COLUMN 2: AI MENTOR (Người Lắng Nghe) - 7 Cols */}
      <div className="md:col-span-7 flex flex-col h-[500px] border border-white/40 bg-white/50 backdrop-blur-xl rounded-[28px] overflow-hidden shadow-sm relative">
        {/* Chat Header */}
        <div className="px-5 py-4 bg-white/30 border-b border-white/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-slate-800">
                CoreZ • Bạn Đồng Hành
              </h3>
              <p className="text-[10px] text-slate-400 leading-none flex items-center gap-1">
                <span>Trợ lý ảo thấu cảm 24/7 • Đảm bảo riêng tư</span>
              </p>
            </div>
          </div>
        </div>

        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-transparent">
          {messages.map((msg) => {
            const isModel = msg.role === "model";
            return (
              <div
                key={msg.id}
                className={`flex ${isModel ? "justify-start" : "justify-end"} items-end gap-2`}
              >
                {isModel && (
                  <div className="p-1 rounded-lg bg-emerald-100 text-emerald-600 shrink-0 hidden sm:block">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed relative group/msg ${
                    isModel
                      ? "bg-white/60 backdrop-blur-sm text-slate-700 border border-white/40 rounded-bl-none shadow-sm pb-8"
                      : "bg-[#34D399] text-white rounded-br-none font-medium shadow-md shadow-emerald-200/30"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  
                  {isModel && (
                    <button
                      type="button"
                      onClick={() => handleSaveMessage(msg)}
                      className={`absolute bottom-1.5 right-2 px-2 py-0.5 text-[9px] rounded-md font-bold cursor-pointer transition-all flex items-center gap-1 border select-none ${
                        savedMsgIds[msg.id]
                          ? "bg-rose-50 text-rose-500 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900/40"
                          : "bg-slate-50 text-slate-400 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:text-emerald-500 hover:bg-emerald-50 hover:border-emerald-200 dark:hover:text-emerald-300 dark:hover:bg-emerald-950/30 dark:hover:border-emerald-800/40 opacity-100 sm:opacity-0 sm:group-hover/msg:opacity-100 focus:opacity-100"
                      }`}
                    >
                      <Heart className={`w-2.5 h-2.5 ${savedMsgIds[msg.id] ? "fill-rose-400 text-rose-400" : ""}`} />
                      <span>{savedMsgIds[msg.id] ? "Đã lưu" : "Lưu Góc Bình Yên"}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Assistant Processing status indicator */}
          {isLoading && (
            <div className="flex justify-start items-end gap-2">
              <div className="p-1 rounded-lg bg-emerald-100 text-emerald-600 shrink-0 hidden sm:block animate-bounce">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-white/60 backdrop-blur-sm text-slate-400 border border-white/40 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-[11px] text-slate-400 font-light font-sans ml-1">Người Lắng Nghe đang cảm nhận...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Form Input */}
        <form onSubmit={handleSendMessage} className="p-3.5 bg-white/40 backdrop-blur-md border-t border-white/40 flex gap-2">
          <input
            type="text"
            placeholder="Chia sẻ nỗi lòng cậu với Người Lắng Nghe..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/40 focus:outline-none focus:border-[#34D399] text-xs sm:text-sm bg-white/50 placeholder:text-slate-400 disabled:opacity-60 shadow-inner"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isLoading}
            className={`p-2.5 rounded-xl text-white transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0 ${
              chatInput.trim() && !isLoading
                ? "bg-[#34D399] hover:bg-emerald-500 cursor-pointer shadow-md shadow-emerald-200"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Send className="w-4.5 h-4.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
