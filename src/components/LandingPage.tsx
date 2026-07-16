import { useState } from "react";
import { motion } from "motion/react";
import { Heart, Check, Sparkles } from "lucide-react";
import { ONBOARDING_LETTER } from "../data";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const [hasConsented, setHasConsented] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden bg-transparent">
      {/* Decorative Healing Backdrop Elements */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-emerald-100/30 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-sky-100/40 blur-3xl animate-pulse" />
      <div className="absolute top-10 right-1/4 w-48 h-48 rounded-full bg-amber-100/20 blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-sm p-6 sm:p-10 relative z-10"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="p-3.5 rounded-2xl bg-white/80 text-emerald-500 mb-4 inline-block border border-white/40 shadow-sm"
          >
            <Heart className="w-8 h-8 fill-emerald-500/10" />
          </motion.div>
          <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50 mb-2">
            Identity Compass
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight leading-snug">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-emerald-500">Trạm Định Vị Bản Ngã</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-md">
            Dự án nghiên cứu hành vi tâm lý & Hỗ trợ phục hồi bản ngã học đường
          </p>
        </div>

        {/* The Open Letter Card */}
        <div className="bg-white/40 backdrop-blur-md rounded-[24px] border border-white/40 p-6 sm:p-8 shadow-sm mb-8 leading-relaxed text-slate-600 font-sans">
          <h2 className="font-serif text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500 fill-emerald-500/10" />
            {ONBOARDING_LETTER.title}
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-slate-600 font-light whitespace-pre-line">
            {ONBOARDING_LETTER.content}
          </div>
        </div>

        {/* Ethical Consent & Launch Area */}
        <div className="space-y-6">
          <label className="flex items-start gap-3 p-4 rounded-xl bg-white/30 border border-white/30 hover:border-slate-200 transition-all cursor-pointer group backdrop-blur-sm">
            <div className="relative flex items-center mt-1">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-5.5 h-5.5 rounded-md border flex items-center justify-center transition-all ${
                  hasConsented
                    ? "bg-[#34D399] border-[#34D399] text-white"
                    : "bg-white border-slate-300 group-hover:border-slate-400"
                }`}
              >
                {hasConsented && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
              </div>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 leading-normal">
              <span className="font-medium text-slate-700">Đạo đức Nghiên cứu: </span>
              Tớ đồng ý tham gia khảo sát ẩn danh và các hoạt động trải nghiệm thực hành phục vụ nghiên cứu khoa học hành vi của dự án. Thông tin của tớ hoàn toàn được bảo mật và ẩn danh.
            </div>
          </label>

          <div className="flex flex-col items-center">
            <button
              id="start-onboarding-btn"
              onClick={() => {
                if (hasConsented) onStart();
              }}
              disabled={!hasConsented}
              className={`w-full sm:w-auto sm:px-12 py-4 rounded-2xl font-semibold text-base transition-all duration-300 shadow-lg ${
                hasConsented
                  ? "bg-[#34D399] text-white cursor-pointer hover:scale-[1.02] active:scale-95 shadow-emerald-200"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              Bắt Đầu Định Vị
            </button>
            <p className="text-xs text-slate-400 mt-2.5">
              Mất khoảng 2 phút • Nhẹ nhàng, chữa lành và thấu cảm
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
