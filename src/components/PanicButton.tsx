import { EyeOff } from "lucide-react";

export default function PanicButton() {
  const handlePanicRedirect = () => {
    try {
      // 1. Prepare the mood log entry for panic / crisis
      const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD local format
      const timestamp = Date.now();
      const newLog = {
        id: `panic-${timestamp}`,
        date: todayStr,
        moodId: "anxious" as const,
        note: `[KÍCH HOẠT PANIC BUTTON] Người dùng rơi vào trạng thái khủng hoảng tâm lý lúc ${new Date().toLocaleTimeString("vi-VN")}. Đã kích hoạt lối thoát khẩn cấp bảo vệ riêng tư.`,
        energyLevel: 1,
        activities: ["meditate"], // recommend meditation/mindfulness after crisis
      };

      // 2. Read existing user data
      const savedDataRaw = localStorage.getItem("remix_corez_user_data");
      let userData: any = {
        diiScore: 0,
        diiLevel: null,
        karmaXP: 0,
        moodLogs: [],
        detoxMinutes: 0,
        plantStage: 0,
        reflections: [],
        futureLetters: [],
      };

      if (savedDataRaw) {
        try {
          userData = JSON.parse(savedDataRaw);
        } catch (e) {
          console.error(e);
        }
      }

      // 3. Ensure moodLogs array exists and prepend the new panic log
      if (!Array.isArray(userData.moodLogs)) {
        userData.moodLogs = [];
      }
      userData.moodLogs = [newLog, ...userData.moodLogs];

      // 4. Save back to unified storage
      localStorage.setItem("remix_corez_user_data", JSON.stringify(userData));

      // 5. Also update legacy storage for safety and compatibility
      localStorage.setItem("remix_corez_mood_logs", JSON.stringify(userData.moodLogs));

      // Dispatch custom event to let other components know they should re-sync state
      window.dispatchEvent(new Event("remix_corez_mood_logs_updated"));

    } catch (err) {
      console.error("Error logging panic mood state:", err);
    }

    // 6. Immediate escape redirect to preserve privacy
    window.location.href = "https://www.google.com";
  };

  return (
    <button
      id="panic-button"
      onClick={handlePanicRedirect}
      title="Thoát nhanh (Bảo vệ riêng tư)"
      className="fixed top-4 left-4 z-50 p-2.5 rounded-full bg-slate-100/50 hover:bg-slate-200/80 backdrop-blur-md border border-slate-200/40 text-slate-400 hover:text-slate-600 transition-all duration-300 shadow-sm opacity-60 hover:opacity-100 group"
    >
      <EyeOff className="w-4.5 h-4.5 transition-transform group-hover:scale-110" />
      <span className="sr-only">Thoát nhanh</span>
    </button>
  );
}
