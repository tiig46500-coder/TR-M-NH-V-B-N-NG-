import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Trash2, Quote, Sparkles, Flower2 } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho bài viết
export interface FavoritePost {
  id: string;
  authorName: string;
  aiAdvice: string;
  category?: string;
  timestamp?: string;
}

// Interface cho cánh hoa đào bay Parallax với hiệu ứng 3D & dao động quang học
interface ParallaxPetal {
  id: number;
  layer: "back" | "mid" | "front"; // 3 lớp Parallax tạo chiều sâu
  type: "single" | "double" | "blossom"; // 3 kiểu dạng cánh/bông hoa
  left: number; // %
  size: number; // px (dao động phong phú từ 8px đến 48px)
  duration: number; // s
  delay: number; // s
  rotation: number;
  sway: number;
  blur: string;
  opacityPeak: number;
  opacityKeyframes: number[];
  scaleKeyframes: number[];
  rotateXKeyframes: number[];
  rotateYKeyframes: number[];
}

// Component Cánh Hoa Đào Bay Parallax 3 Lớp Chuyên Sâu (Enhanced 3D Parallax Cherry Blossom Petals)
const ParallaxFallingPetals: React.FC<{ count?: number }> = ({ count = 32 }) => {
  const [petals, setPetals] = useState<ParallaxPetal[]>([]);

  useEffect(() => {
    const generated: ParallaxPetal[] = Array.from({ length: count }, (_, i) => {
      const layerRand = Math.random();
      let layer: "back" | "mid" | "front" = "mid";
      let size = 18;
      let duration = 10;
      let blur = "";
      let opacityPeak = 0.85;
      let sway = Math.random() * 50 + 20;

      if (layerRand < 0.38) {
        // Lớp xa (Background - Nhỏ, mờ nhẹ, trôi rất chậm)
        layer = "back";
        size = Math.random() * 8 + 8; // 8px - 16px
        duration = Math.random() * 8 + 14; // 14s - 22s
        blur = "blur-[1.5px]";
        opacityPeak = 0.55;
        sway = Math.random() * 25 + 15;
      } else if (layerRand < 0.78) {
        // Lớp vừa (Midground - Vừa tầm mắt, chi tiết sắc nét)
        layer = "mid";
        size = Math.random() * 14 + 18; // 18px - 32px
        duration = Math.random() * 6 + 8; // 8s - 14s
        blur = "";
        opacityPeak = 0.88;
        sway = Math.random() * 50 + 25;
      } else {
        // Lớp gần mắt (Foreground - To rực rỡ, chiều sâu 3D rõ nét)
        layer = "front";
        size = Math.random() * 16 + 32; // 32px - 48px
        duration = Math.random() * 4 + 5; // 5s - 9s
        blur = "blur-[0.5px]";
        opacityPeak = 0.98;
        sway = Math.random() * 70 + 35;
      }

      // Chọn ngẫu nhiên loại cánh hoa
      const typeRand = Math.random();
      const type: "single" | "double" | "blossom" =
        typeRand < 0.6 ? "single" : typeRand < 0.85 ? "double" : "blossom";

      // Mảng dao động độ mờ (opacity fluctuations) nhịp nhàng như phản chiếu ánh sáng khi xoay trong không trung
      const opacityKeyframes = [
        0,
        opacityPeak * 0.4,
        opacityPeak,
        opacityPeak * 0.5,
        opacityPeak * 0.95,
        opacityPeak * 0.35,
        opacityPeak * 0.8,
        opacityPeak * 0.2,
        0,
      ];

      // Mảng dao động kích thước & lật 3D
      const scaleKeyframes = [0.65, 1, 0.78, 1.2, 0.7, 1.1, 0.6];
      const rotateXKeyframes = [0, 180, 360, 540];
      const rotateYKeyframes = [0, 360, 180, 0];

      return {
        id: i,
        layer,
        type,
        left: Math.random() * 96,
        size,
        duration,
        delay: Math.random() * 6,
        rotation: Math.random() * 360,
        sway,
        blur,
        opacityPeak,
        opacityKeyframes,
        scaleKeyframes,
        rotateXKeyframes,
        rotateYKeyframes,
      };
    });

    setPetals(generated);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20 [perspective:1000px]">
      {petals.map((p) => {
        const zIndexClass =
          p.layer === "back" ? "z-0" : p.layer === "mid" ? "z-10" : "z-30";

        return (
          <motion.div
            key={p.id}
            initial={{
              y: "-12vh",
              x: 0,
              opacity: 0,
              rotateZ: p.rotation,
              rotateX: 0,
              rotateY: 0,
              scale: 0.6,
            }}
            animate={{
              y: "112vh",
              x: [0, p.sway, -p.sway * 1.2, p.sway * 0.8, -p.sway * 0.5, 0],
              opacity: p.opacityKeyframes,
              scale: p.scaleKeyframes,
              rotateZ: p.rotation + (p.layer === "front" ? 540 : 360),
              rotateX: p.rotateXKeyframes,
              rotateY: p.rotateYKeyframes,
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              transformStyle: "preserve-3d",
            }}
            className={`flex items-center justify-center filter drop-shadow-sm select-none ${p.blur} ${zIndexClass}`}
          >
            {p.type === "single" && (
              /* Cánh Hoa Đào Đơn */
              <svg
                viewBox="0 0 30 30"
                className={`w-full h-full ${
                  p.layer === "back"
                    ? "fill-pink-200/60 stroke-pink-300/30"
                    : p.layer === "mid"
                    ? "fill-pink-300/85 stroke-pink-400/50"
                    : "fill-pink-400/90 stroke-pink-500/60"
                }`}
              >
                <path d="M15 2 C21 7, 28 12, 25 21 C22 28, 15 28, 15 28 C15 28, 8 28, 5 21 C2 12, 9 7, 15 2 Z" />
                <circle cx="15" cy="21" r="1.5" className="fill-rose-400" />
              </svg>
            )}

            {p.type === "double" && (
              /* Cặp Cánh Hoa Đôi Bay Đan Xen */
              <svg
                viewBox="0 0 40 40"
                className={`w-full h-full ${
                  p.layer === "back"
                    ? "fill-pink-200/70"
                    : p.layer === "mid"
                    ? "fill-pink-300/90"
                    : "fill-pink-400"
                }`}
              >
                <path
                  d="M15 5 C20 10, 26 14, 23 22 C20 28, 15 28, 15 28 C15 28, 9 28, 7 22 C4 14, 10 10, 15 5 Z"
                  className="stroke-pink-400/40"
                />
                <path
                  d="M25 12 C30 17, 36 21, 33 28 C30 34, 25 34, 25 34 C25 34, 19 34, 17 28 C14 21, 20 17, 25 12 Z"
                  className="fill-rose-300/80 stroke-pink-500/40"
                />
              </svg>
            )}

            {p.type === "blossom" && (
              /* Bông Hoa Đào 5 Cánh Nở Trọn Vẹn */
              <svg
                viewBox="0 0 40 40"
                className="w-full h-full filter drop-shadow-xs"
              >
                <g transform="translate(20, 20)">
                  {[0, 72, 144, 216, 288].map((angle) => (
                    <path
                      key={angle}
                      d="M 0 0 C -6 -12, -8 -18, 0 -20 C 8 -18, 6 -12, 0 0"
                      className={`${
                        p.layer === "back"
                          ? "fill-pink-200/80 stroke-pink-300/40"
                          : p.layer === "mid"
                          ? "fill-pink-300 stroke-pink-400/60"
                          : "fill-pink-400 stroke-rose-400"
                      }`}
                      transform={`rotate(${angle})`}
                    />
                  ))}
                  {/* Nhụy hoa vàng óng tỏa sáng */}
                  <circle cx="0" cy="0" r="3.5" className="fill-amber-300 stroke-rose-500 stroke-[0.8]" />
                  <circle cx="0" cy="0" r="1.5" className="fill-rose-500" />
                </g>
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

// Component Cành Hoa Đào Trang Trí Góc Trên Khung Cảnh (Decorative Sakura Branch Header)
const SakuraBranchHeader: React.FC = () => (
  <div className="absolute top-0 left-0 right-0 pointer-events-none z-10 overflow-hidden h-28 opacity-90 select-none">
    {/* Cành đào góc trái vươn sang */}
    <motion.svg
      viewBox="0 0 200 100"
      className="absolute top-0 -left-4 w-48 sm:w-64 h-auto filter drop-shadow-sm origin-top-left"
      animate={{ rotate: [0, 1.5, -1, 0] }}
      transition={{ repeat: Infinity, duration: 9, ease: "easeInOut" }}
    >
      <path
        d="M 0 0 C 40 10, 80 25, 130 20 C 150 18, 170 12, 190 25"
        fill="none"
        stroke="#5c2c16"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 60 16 C 80 32, 100 40, 120 48"
        fill="none"
        stroke="#5c2c16"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M 110 21 C 125 8, 140 5, 155 2"
        fill="none"
        stroke="#5c2c16"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Các đóa hoa đào nở trên cành trái */}
      <g transform="translate(130, 20) scale(0.7)">
        <circle cx="0" cy="0" r="10" className="fill-pink-300 stroke-pink-400" />
        <circle cx="0" cy="0" r="3" className="fill-amber-300" />
      </g>
      <g transform="translate(190, 25) scale(0.6)">
        <circle cx="0" cy="0" r="10" className="fill-pink-400 stroke-rose-400" />
        <circle cx="0" cy="0" r="3" className="fill-amber-300" />
      </g>
      <g transform="translate(80, 32) scale(0.55)">
        <circle cx="0" cy="0" r="10" className="fill-pink-300 stroke-pink-400" />
      </g>
      <g transform="translate(120, 48) scale(0.65)">
        <circle cx="0" cy="0" r="10" className="fill-pink-300 stroke-rose-300" />
      </g>
      <g transform="translate(155, 2) scale(0.5)">
        <circle cx="0" cy="0" r="8" className="fill-pink-200 stroke-pink-400" />
      </g>
    </motion.svg>

    {/* Cành đào góc phải rủ xuống */}
    <motion.svg
      viewBox="0 0 200 100"
      className="absolute top-0 -right-4 w-48 sm:w-64 h-auto filter drop-shadow-sm origin-top-right scale-x-[-1]"
      animate={{ rotate: [0, -1.8, 1, 0] }}
      transition={{ repeat: Infinity, duration: 11, ease: "easeInOut" }}
    >
      <path
        d="M 0 0 C 40 12, 90 28, 140 22 C 160 20, 180 30, 195 42"
        fill="none"
        stroke="#5c2c16"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 70 20 C 90 35, 110 42, 130 52"
        fill="none"
        stroke="#5c2c16"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Các đóa hoa nở trên cành phải */}
      <g transform="translate(140, 22) scale(0.75)">
        <circle cx="0" cy="0" r="10" className="fill-pink-300 stroke-pink-400" />
        <circle cx="0" cy="0" r="3" className="fill-amber-300" />
      </g>
      <g transform="translate(195, 42) scale(0.6)">
        <circle cx="0" cy="0" r="10" className="fill-pink-400 stroke-rose-400" />
      </g>
      <g transform="translate(130, 52) scale(0.55)">
        <circle cx="0" cy="0" r="10" className="fill-pink-300 stroke-pink-400" />
      </g>
    </motion.svg>
  </div>
);

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
  const savedPosts = JSON.parse(localStorage.getItem('corez_favorite_posts') || '[]');
  const isExist = savedPosts.find((p: any) => p.id === post.id);
  
  if (!isExist) {
    if (!post.authorName) {
      post.authorName = generateAnonymousName();
    }
    savedPosts.push(post);
    localStorage.setItem('corez_favorite_posts', JSON.stringify(savedPosts));
    return true;
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
  const [myFavoritePosts, setMyFavoritePosts] = useState<FavoritePost[]>([]);
  const [dailyAffirmation, setDailyAffirmation] = useState("");
  const [showPetals, setShowPetals] = useState(true);

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('corez_favorite_posts') || '[]');
    setMyFavoritePosts(storedPosts);

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
    <>
      {/* Hiệu ứng cánh hoa đào bay Parallax 3 Lớp & Cành hoa đào trang trí */}
      {showPetals && (
        <>
          <SakuraBranchHeader />
          <ParallaxFallingPetals count={36} />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-4xl mx-auto py-2 px-4 font-sans space-y-6 relative z-10"
      >
        <div className="border-b border-white/40 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500/10 animate-pulse" />
              Góc Bình Yên Của Bạn
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Nơi lưu trữ những lời khuyên thông thái, bí kíp 1 phút và thông điệp chữa lành từ CoreZ.
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Toggle Hoa Đào Bay */}
            <button
              onClick={() => setShowPetals(!showPetals)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-semibold border flex items-center gap-1.5 transition-all duration-300 cursor-pointer shadow-xs ${
                showPetals
                  ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
                  : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
              }`}
              title="Bật/Tắt hiệu ứng Hoa Đào Bay Parallax"
            >
              <Flower2 className={`w-3.5 h-3.5 ${showPetals ? "animate-spin" : ""}`} style={{ animationDuration: '12s' }} />
              <span>Hoa đào Parallax {showPetals ? "🌸" : "Off"}</span>
            </button>

            {myFavoritePosts.length > 0 && (
              <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-full shrink-0 font-bold">
                Đã lưu {myFavoritePosts.length} 💖
              </span>
            )}
          </div>
        </div>

        {/* Daily Positive Affirmation Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          id="daily-affirmation-card"
          className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-rose-500/10 border border-emerald-500/20 rounded-[28px] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden backdrop-blur-xl"
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
                Hãy trò chuyện cùng <strong>CoreZ • AI Mentor</strong> hoặc xem các <strong>Bí Kíp 1 Phút</strong>, sau đó nhấn nút thả tim hoặc nút lưu để lưu giữ những thông điệp thông thái tại đây nhé! 🌱
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

