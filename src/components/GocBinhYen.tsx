import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Trash2, Quote, Sparkles } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho bài viết
export interface FavoritePost {
  id: string;
  authorName: string;
  aiAdvice: string;
  category?: string;
  timestamp?: string;
}

// 1. Hàm tạo tên ẩn danh ngẫu nhiên mang phong cách "Chữa lành"
export const generateAnonymousName = (): string => {
  const adjectives = ['Bình Yên', 'Mạnh Mẽ', 'Lặng Lẽ', 'Bí Ẩn', 'Kiên Cường'];
  const nouns = ['Đám Mây', 'Ngôi Sao', 'Hạt Mầm', 'Lá Cây', 'Chú Mèo'];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${randomNoun} ${randomAdj}`; // Ví dụ: "Đám Mây Bình Yên"
};

// 2. Hàm lưu bài viết / lời khuyên AI vào mục Yêu thích (Lưu cục bộ)
export const saveFavoritePost = (post: any) => {
  // Lấy danh sách từ bộ nhớ trình duyệt (localStorage), nếu chưa có thì là mảng rỗng
  const savedPosts = JSON.parse(localStorage.getItem('corez_favorite_posts') || '[]');
  
  // Kiểm tra xem bài này đã lưu chưa dựa vào ID
  const isExist = savedPosts.find((p: any) => p.id === post.id);
  
  if (!isExist) {
    // Nếu là bài đăng của người dùng, gán cho họ một tên ẩn danh nếu chưa có
    if (!post.authorName) {
      post.authorName = generateAnonymousName();
    }
    
    savedPosts.push(post);
    // Lưu ngược lại vào trình duyệt
    localStorage.setItem('corez_favorite_posts', JSON.stringify(savedPosts));
    return true; // Return true to indicate successful save
  }
  return false;
};

const AFFIRMATIONS = [
  "Cậu đang làm rất tốt, hãy hít vào sự bình an và thở ra mọi lo lắng. 🍃",
  "Tâm trí cậu là một khu vườn xinh đẹp, hãy gieo những hạt mầm yêu thương thay vì những âu lo vô cớ. 🌸",
  "Hôm nay, tớ chọn trân trọng từng khoảnh khắc đời thực và cho phép bản thân được thả lỏng hoàn toàn. ☀️",
  "Cậu là độc bản rực rỡ và quý giá, không cần phải so sánh bản thân với bất kỳ ai trên thế giới ảo. ✨",
  "Mỗi bước đi nhỏ hay những nỗ lực thầm lặng của cậu hôm nay đều vô cùng đáng quý. Hãy kiên nhẫn với chính mình nhé. 🌱",
  "Hít thật sâu, thở thật chậm. Thế giới thực tại luôn ôm ấp, nâng niu và chào đón cậu trở về. 🧘",
  "Mọi giông bão ngoài kia rồi sẽ qua đi, chỉ có sự bình yên và sức mạnh nội lực bên trong cậu là còn mãi. 🏔️",
  "Cậu xứng đáng được yêu thương, trân trọng và hạnh phúc vì chính con người thật của mình. 💛"
];

export default function GocBinhYen() {
  // Khai báo state chứa danh sách dữ liệu riêng tư của người dùng
  const [myFavoritePosts, setMyFavoritePosts] = useState<FavoritePost[]>([]);
  const [dailyAffirmation, setDailyAffirmation] = useState("");

  // useEffect tự động chạy khi tab này được mở để lấy dữ liệu từ máy
  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('corez_favorite_posts') || '[]');
    setMyFavoritePosts(storedPosts);

    // Seed the daily affirmation based on the day of the month
    const dayIndex = new Date().getDate() % AFFIRMATIONS.length;
    setDailyAffirmation(AFFIRMATIONS[dayIndex]);
  }, []);

  const handleRefreshAffirmation = () => {
    let newAff = dailyAffirmation;
    while (newAff === dailyAffirmation) {
      const randIdx = Math.floor(Math.random() * AFFIRMATIONS.length);
      newAff = AFFIRMATIONS[randIdx];
    }
    setDailyAffirmation(newAff);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-2 px-4 font-sans space-y-6 relative z-10">
      <div className="border-b border-white/40 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500/10 animate-pulse" />
            Góc Bình Yên Của Bạn
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Nơi lưu trữ những lời khuyên thông thái, bí kíp 1 phút và thông điệp chữa lành từ Cozy.
          </p>
        </div>
        
        {myFavoritePosts.length > 0 && (
          <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-full shrink-0 font-bold self-start sm:self-auto">
            Đã lưu {myFavoritePosts.length} thông điệp ✨
          </span>
        )}
      </div>

      {/* Daily Positive Affirmation Card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        id="daily-affirmation-card"
        className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-[28px] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden backdrop-blur-xl"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/85 shadow-md border border-emerald-100 dark:border-emerald-900/30 text-emerald-500 shrink-0 animate-pulse">
            <Sparkles className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="space-y-1 text-left flex-1 min-w-0">
            <h4 className="font-serif text-sm font-bold text-emerald-800 dark:text-emerald-300">
              Lời Khẳng Định Tích Cực Mỗi Ngày ✨
            </h4>
            <div className="min-h-[40px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={dailyAffirmation}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed font-sans italic font-semibold [text-shadow:_0_1px_1px_rgba(255,255,255,0.4)] dark:[text-shadow:_0_1px_3px_rgba(0,0,0,0.8)] filter drop-shadow-xs"
                >
                  “ {dailyAffirmation} ”
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <button
          id="refresh-affirmation-btn"
          onClick={handleRefreshAffirmation}
          className="px-4 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900/80 hover:bg-emerald-50 dark:hover:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800 rounded-xl shadow-xs transition-all duration-300 active:scale-95 cursor-pointer shrink-0"
        >
          Nhận thông điệp mới 🔄
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <AnimatePresence mode="popLayout">
          {myFavoritePosts.map((post, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.3) }}
              key={post.id}
              className="bg-white/65 dark:bg-slate-900/65 backdrop-blur-md p-5 rounded-2xl border border-white/40 dark:border-white/10 shadow-sm relative group flex flex-col justify-between overflow-hidden hover:border-emerald-400/50 dark:hover:border-emerald-500/50 transition-all duration-300"
            >
              {/* Soft visual glow background inside cards */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100/10 dark:bg-emerald-900/5 blur-xl rounded-full pointer-events-none" />
              
              <div className="space-y-3.5">
                {/* Header of favorite item */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-xs">
                      👤
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Ẩn danh: {post.authorName}
                    </span>
                  </div>
                  {post.category && (
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200/40 dark:border-white/5">
                      {post.category}
                    </span>
                  )}
                </div>

                {/* Main advice content */}
                <div className="relative">
                  <Quote className="absolute -top-1 -left-1.5 w-7 h-7 text-emerald-100 dark:text-emerald-900/20 pointer-events-none" />
                  <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-200 font-medium font-sans relative pl-5 pt-1 whitespace-pre-wrap">
                    {post.aiAdvice}
                  </p>
                </div>
              </div>

              {/* Action buttons & info footer */}
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-3 mt-4">
                <span className="text-[10px] text-slate-400">
                  {post.timestamp || "Đã lưu chánh niệm"}
                </span>

                <button
                  onClick={() => {
                    // Logic xóa khỏi danh sách yêu thích
                    const newPosts = myFavoritePosts.filter(p => p.id !== post.id);
                    setMyFavoritePosts(newPosts);
                    localStorage.setItem('corez_favorite_posts', JSON.stringify(newPosts));
                  }}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 hover:bg-rose-500 hover:text-white transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 select-none"
                  title="Xóa khỏi mục Yêu thích"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa lưu</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {myFavoritePosts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center space-y-4 max-w-md mx-auto"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-inner">
            <Heart className="w-7 h-7 text-slate-300 dark:text-slate-600 animate-pulse" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-serif text-sm font-bold text-slate-700 dark:text-slate-300">
              Chưa có lời khuyên nào được lưu lại...
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Hãy trò chuyện cùng <strong>Cozy • AI Mentor</strong> hoặc xem các <strong>Bí Kíp 1 Phút</strong>, sau đó nhấn nút thả tim hoặc nút lưu để lưu giữ những thông điệp thông thái tại đây nhé! 🌱
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
