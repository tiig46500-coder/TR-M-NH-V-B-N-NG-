import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Edit3, Flame, Zap, ShieldCheck, Sparkles, Check, RefreshCw } from "lucide-react";
import { initAnonymousAuth, updateAnonymousName, generateAnonymousName, UserFirebaseProfile } from "../lib/firebase";
import { useUserData } from "../context/UserContext";

const GRADIENT_AVATARS = [
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-purple-400 to-indigo-600",
  "from-teal-300 to-emerald-600"
];

export default function AnonymousHeader() {
  const { userData } = useUserData();
  const [userProfile, setUserProfile] = useState<UserFirebaseProfile | null>(null);
  const [anonName, setAnonName] = useState<string>("Đang kết nối...");
  const [avatarGrad, setAvatarGrad] = useState<string>("from-emerald-400 to-teal-500");
  const [showEditModal, setShowEditModal] = useState(false);
  const [newAnonName, setNewAnonName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // 1. Initialize Anonymous Firebase Auth & Profile Listener
    const unsubscribe = initAnonymousAuth((user, profile) => {
      setUserProfile(profile);
      setAnonName(profile.anonymousName || "Người Lữ Hành #88");
      setAvatarGrad(profile.avatarGradient || "from-emerald-400 to-teal-500");
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const handleOpenEdit = () => {
    setNewAnonName(anonName);
    setSavedSuccess(false);
    setShowEditModal(true);
  };

  const handleRandomizeName = () => {
    if (userProfile?.uid) {
      setNewAnonName(generateAnonymousName(userProfile.uid));
    } else {
      setNewAnonName(generateAnonymousName());
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnonName.trim() || !userProfile?.uid) return;
    setIsUpdating(true);

    try {
      await updateAnonymousName(userProfile.uid, newAnonName.trim());
      setAnonName(newAnonName.trim());
      setSavedSuccess(true);
      setTimeout(() => {
        setShowEditModal(false);
        setIsUpdating(false);
        setSavedSuccess(false);
      }, 700);
    } catch (err) {
      console.error("Failed to update name:", err);
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* Sticky Anonymous Header Top Bar */}
      <header className="sticky top-0 z-40 w-full bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/10 shadow-sm transition-all py-2 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
          
          {/* Left: Anonymous Identity Badge */}
          <div className="flex items-center gap-2.5">
            <div className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr ${avatarGrad} p-0.5 shadow-md flex items-center justify-center shrink-0`}>
              <div className="w-full h-full bg-white/20 dark:bg-black/20 rounded-[10px] backdrop-blur-xs flex items-center justify-center">
                <User className="w-4 h-4 text-white drop-shadow-sm" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" title="Đồng bộ Firestore thời gian thực" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-emerald-300 tracking-tight leading-tight">
                  {anonName}
                </span>
                <button
                  onClick={handleOpenEdit}
                  className="p-1 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-white/10 transition-all cursor-pointer"
                  title="Đổi biệt danh ẩn danh"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  Danh tính ẩn danh 100%
                </span>
              </div>
            </div>
          </div>

          {/* Right: Live Energy & Real-time Community Stats */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Karma XP */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 dark:bg-amber-400/15 border border-amber-500/20 px-2.5 py-1 rounded-full text-amber-700 dark:text-amber-300 text-[11px] font-extrabold shadow-xs">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{userData.karmaXP || userProfile?.karmaXP || 100} XP</span>
            </div>

            {/* Reflection Streak */}
            <div className="hidden xs:flex items-center gap-1.5 bg-rose-500/10 dark:bg-rose-400/15 border border-rose-500/20 px-2.5 py-1 rounded-full text-rose-700 dark:text-rose-300 text-[11px] font-extrabold shadow-xs">
              <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Streak {userProfile?.streak || 1} ngày</span>
            </div>

            {/* Firestore Sync Indicator */}
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Realtime</span>
            </div>
          </div>

        </div>
      </header>

      {/* Modal: Change Anonymous Handle */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-emerald-300">
                      Đổi Biệt Danh Ẩn Danh
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Tên ẩn danh giúp cậu tự do chia sẻ mà không lo lộ danh tính.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveName} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
                    Biệt Danh Mới
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAnonName}
                      onChange={(e) => setNewAnonName(e.target.value)}
                      maxLength={28}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-sm font-semibold focus:outline-none focus:border-emerald-500"
                      placeholder="Ví dụ: Người Lữ Hành #88"
                    />
                    <button
                      type="button"
                      onClick={handleRandomizeName}
                      className="px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0"
                      title="Tạo biệt danh ngẫu nhiên"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Ngẫu nhiên</span>
                    </button>
                  </div>
                </div>

                {/* Avatar selection preview */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                    Sắc Thái Cảm Xúc (Gradient Avatar)
                  </label>
                  <div className="flex items-center gap-2">
                    {GRADIENT_AVATARS.map((grad, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarGrad(grad)}
                        className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${grad} transition-all cursor-pointer ${
                          avatarGrad === grad ? "ring-2 ring-emerald-500 scale-110 shadow-md" : "opacity-70 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating || !newAnonName.trim()}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {savedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Đã Lưu!
                      </>
                    ) : (
                      <span>Cập Nhật Ngay</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
