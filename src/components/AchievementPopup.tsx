import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Share2, Check } from 'lucide-react';

interface AchievementProps {
  completedCount: number; // Số nhiệm vụ đã tích (VD: 3)
  targetCount: number;    // Mục tiêu (VD: 3)
  badgeTitle?: string;
  badgeIcon?: string;
  quote?: string;
  xpReward?: number;
  onClose?: () => void;
}

export const AchievementPopup: React.FC<AchievementProps> = ({ 
  completedCount, 
  targetCount,
  badgeTitle = "Chiến Binh Kỷ Luật",
  badgeIcon = "🛡️",
  quote = '💬 "Cậu đã làm chủ thực tại hôm nay. Đừng để ánh sáng xanh làm mờ định vị bản ngã của cậu!"',
  xpReward = 50,
  onClose
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Tự động bật hiệu ứng "Rầm" khi đạt đủ mục tiêu nhiệm vụ
    if (completedCount >= targetCount && targetCount > 0) {
      setShowPopup(true);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback if confetti fails
      }
    }
  }, [completedCount, targetCount]);

  if (!showPopup) return null;

  const handleClose = () => {
    setShowPopup(false);
    if (onClose) onClose();
  };

  const shareText = `🎉 Tớ vừa mở khóa thành tựu "${badgeTitle}" ${badgeIcon} (+${xpReward} XP) trên CoreZ!\n${quote}\n👉 Khám phá bản ngã & rèn luyện kỷ luật tại CoreZ App!`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Thành Tựu CoreZ: ${badgeTitle}`,
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // User cancelled or share failed, fallback to copy
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <>
      {/* Lớp mờ nền */}
      <div className="achievement-overlay" onClick={handleClose} />

      {/* Thẻ Thưởng Bật Tung */}
      <div className="achievement-modal">
        <span style={{ color: '#00F0FF', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px' }}>
          MỞ KHÓA THÀNH TỰU MỚI!
        </span>

        <div className="badge-glow-icon">{badgeIcon}</div>

        <h2 className="section-title">
          {badgeTitle}
        </h2>

        <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
          +{xpReward} XP • Chuỗi Thanh Lọc Số +1 Ngày
        </p>

        <div className="quote-box">
          {quote}
        </div>

        {copied && (
          <div className="my-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-bounce">
            <Check className="w-3.5 h-3.5" />
            <span>Đã sao chép thông điệp thành tựu! 📋</span>
          </div>
        )}

        <div className="achievement-modal-actions">
          <button className="btn-share" onClick={handleShare}>
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? "Đã sao chép!" : "Chia sẻ thành tựu ✨"}</span>
          </button>

          <button className="btn-claim" onClick={handleClose}>
            Nhận Thưởng 🚀
          </button>
        </div>
      </div>
    </>
  );
};

export default AchievementPopup;
