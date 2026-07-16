import { useState } from "react";
import { Phone, Heart, X, MessageCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SosButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* SOS Floating Action Button */}
      <button
        id="sos-button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 px-4 py-3 rounded-full bg-red-100 hover:bg-red-200 text-red-600 font-medium text-sm flex items-center gap-2 border border-red-200 shadow-md backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse"
      >
        <Phone className="w-4 h-4" />
        <span>Hỗ Trợ SOS</span>
      </button>

      {/* SOS Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md overflow-hidden rounded-[28px] bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl p-6 z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/50 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-full bg-red-50 text-red-500">
                  <Heart className="w-6 h-6 fill-red-500/10" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-800">
                    Phòng Tư Vấn Tâm Lý Học Đường
                  </h3>
                  <p className="text-xs text-red-500 font-medium">Chúng tớ luôn ở đây cùng cậu</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                Cậu ơi, nếu cậu cảm thấy lo âu tột cùng, ngột thở, hoặc gặp khủng hoảng tâm lý không thể tự giải tỏa, hãy nhấc máy gọi ngay cho các thầy cô tư vấn tâm lý học đường dưới đây. Mọi cuộc gọi đều hoàn toàn bảo mật và miễn phí.
              </p>

              <div className="space-y-3.5 mb-6">
                {/* Contact numbers */}
                <div className="p-3.5 rounded-xl bg-white/45 backdrop-blur-sm border border-white/40 flex items-center justify-between hover:border-red-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-50 text-red-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Đường dây nóng hỗ trợ học sinh</p>
                      <p className="text-sm font-bold text-slate-700">1800 1567</p>
                    </div>
                  </div>
                  <a
                    href="tel:18001567"
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                  >
                    Gọi Ngay
                  </a>
                </div>

                <div className="p-3.5 rounded-xl bg-white/45 backdrop-blur-sm border border-white/40 flex items-center justify-between hover:border-emerald-200 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Thầy Chuyên trách tâm lý Xứ Lạng</p>
                      <p className="text-sm font-bold text-slate-700">0912 345 678</p>
                    </div>
                  </div>
                  <a
                    href="tel:0912345678"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
                  >
                    Gọi Ngay
                  </a>
                </div>
              </div>

              {/* Operating Info */}
              <div className="flex items-center gap-2 text-xs text-slate-500 justify-center bg-white/30 py-2.5 rounded-lg border border-white/30 shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>Hoạt động liên tục 24/7 • Luôn lắng nghe, không phán xét</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
