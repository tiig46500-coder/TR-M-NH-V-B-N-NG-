import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Sparkles, 
  Smile, 
  Activity, 
  Heart, 
  BookOpen, 
  Info,
  Flame,
  LayoutGrid,
  CalendarRange
} from "lucide-react";
import { MoodLogEntry } from "../types";

interface MoodCalendarProps {
  logs: MoodLogEntry[];
  moodsConfig: Record<string, {
    emoji: string;
    label: string;
    color: string;
    bgLight: string;
    text: string;
    border: string;
    gradient: string;
    desc: string;
  }>;
}

export const MoodCalendar: React.FC<MoodCalendarProps> = ({ logs, moodsConfig }) => {
  // Navigation states
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewType, setViewType] = useState<"month" | "year">("month");
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState<boolean>(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  // Group logs by local date (YYYY-MM-DD)
  const logsByDate = useMemo(() => {
    const map: Record<string, MoodLogEntry[]> = {};
    logs.forEach(log => {
      if (!map[log.date]) {
        map[log.date] = [];
      }
      map[log.date].push(log);
    });
    return map;
  }, [logs]);

  // Helper to calculate daily stats
  const getDailyStats = (dateStr: string) => {
    const dayLogs = logsByDate[dateStr];
    if (!dayLogs || dayLogs.length === 0) return null;

    const totalEnergy = dayLogs.reduce((sum, log) => sum + log.energyLevel, 0);
    const avgEnergy = Math.round((totalEnergy / dayLogs.length) * 10) / 10;
    
    // Most common mood or the latest one
    const moodsCount: Record<string, number> = {};
    dayLogs.forEach(log => {
      moodsCount[log.moodId] = (moodsCount[log.moodId] || 0) + 1;
    });
    
    let dominantMoodId = dayLogs[dayLogs.length - 1].moodId;
    let maxCount = 0;
    Object.entries(moodsCount).forEach(([moodId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantMoodId = moodId;
      }
    });

    return {
      avgEnergy,
      dominantMoodId,
      logs: dayLogs
    };
  };

  // Intensity color config mapping based on average energy (1-5)
  const getIntensityStyle = (avgEnergy: number | null) => {
    if (avgEnergy === null) {
      return "bg-slate-100/50 dark:bg-slate-800/20 text-slate-300 dark:text-slate-600 border-slate-100/50 hover:bg-slate-200/50";
    }
    const level = Math.round(avgEnergy);
    switch (level) {
      case 1: // Severe Stress / Exhausted
        return "bg-rose-100/90 dark:bg-rose-950/40 border-rose-300 text-rose-700 dark:text-rose-300 shadow-sm shadow-rose-100/20";
      case 2: // Tired / Low Energy
        return "bg-violet-100/90 dark:bg-violet-950/40 border-violet-300 text-violet-700 dark:text-violet-300 shadow-sm shadow-violet-100/20";
      case 3: // Unsteady / Fragile Balance
        return "bg-amber-100/90 dark:bg-amber-950/30 border-amber-300 text-amber-800 dark:text-amber-300 shadow-sm shadow-amber-100/20";
      case 4: // Calm / Peaceful
        return "bg-emerald-100/90 dark:bg-emerald-950/40 border-emerald-300 text-emerald-700 dark:text-emerald-300 shadow-sm shadow-emerald-100/20";
      case 5: // Very Happy / Energized
        return "bg-yellow-100/90 dark:bg-yellow-950/40 border-yellow-200 text-yellow-700 dark:text-yellow-300 shadow-sm shadow-yellow-100/20";
      default:
        return "bg-slate-100/50 dark:bg-slate-800/20 text-slate-300 dark:text-slate-600 border-slate-100/50";
    }
  };

  const getIntensityLabel = (avgEnergy: number) => {
    const level = Math.round(avgEnergy);
    switch (level) {
      case 1: return "Cạn kiệt (1/5) 🪫";
      case 2: return "Uể oải (2/5) 😴";
      case 3: return "Chông chênh (3/5) 🍂";
      case 4: return "Bình yên (4/5) 🍃";
      case 5: return "Tràn đầy (5/5) ⚡";
      default: return `Năng lượng: ${avgEnergy}/5`;
    }
  };

  // Monthly Calendar Grid calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  
  // Adjust to start calendar from Monday (0: Mon, 1: Tue, ..., 6: Sun)
  const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const monthWeeksDays = useMemo(() => {
    const days: Array<{ dayNum: number | null; dateStr: string | null }> = [];
    
    // Padding days for previous month
    for (let i = 0; i < adjustedFirstDayIndex; i++) {
      days.push({ dayNum: null, dateStr: null });
    }
    
    // Actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ dayNum: i, dateStr: dateString });
    }
    
    return days;
  }, [year, month, daysInMonth, adjustedFirstDayIndex]);

  // Handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDayKey(null);
    setAiInsight(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDayKey(null);
    setAiInsight(null);
  };

  const handleSelectDay = (dateStr: string) => {
    setSelectedDayKey(dateStr === selectedDayKey ? null : dateStr);
    setAiInsight(null);
  };

  const selectedDayData = selectedDayKey ? getDailyStats(selectedDayKey) : null;

  // Ask Cozy AI for instant empathic insight on that selected day
  const handleGetAiInsight = async () => {
    if (!selectedDayKey || !selectedDayData) return;
    setLoadingInsight(true);
    setAiInsight(null);

    try {
      const dayNote = selectedDayData.logs.map(l => l.note).filter(Boolean).join(" | ");
      const moodsText = selectedDayData.logs.map(l => moodsConfig[l.moodId]?.label).join(", ");
      
      const response = await fetch("/api/gemini-flashcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: `Nhật ký ngày ${selectedDayKey} (Tâm trạng: ${moodsText}, Năng lượng: ${selectedDayData.avgEnergy}/5)`,
          front: dayNote || "Học sinh không ghi chú gì thêm, chỉ lưu tâm trạng."
        })
      });

      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      setAiInsight(data.reply);
    } catch (err) {
      // Friendly fallback insight
      const fallbackInsights = [
        "Cậu đã dành trọn vẹn sự chú tâm cho ngày hôm nay dẫu cho có những khoảnh khắc chông chênh. Hãy nhớ ranh giới giữa cõi mạng và đời thực là nơi cậu gieo mầm hạnh phúc đích thực. 🌱🫂",
        "Hãy nâng niu đứa trẻ bên trong cậu lúc này. Cozy luôn tự hào vì cậu đã dũng cảm ghi nhận mọi cảm xúc của mình mà không hề phán xét. Đêm nay, cậu nhớ đắp chăn ấm và đi ngủ sớm nha. ✨☁️",
        "Trạm sạc tinh thần Cozy nhận thấy cậu đang kiên nhẫn tích lũy từng chút bình yên qua các hoạt động chánh niệm. Cứ đi thong thả theo nhịp độ của riêng cậu nhé! 🌸🌱"
      ];
      setAiInsight(fallbackInsights[Math.floor(Math.random() * fallbackInsights.length)]);
    } finally {
      setLoadingInsight(false);
    }
  };

  // Yearly contribution heatmap calculations (Past 12 Months)
  // Let's draw standard 53 columns x 7 rows representing each day of the last 1 year
  const yearlyDays = useMemo(() => {
    const list: Array<{ dateStr: string; date: Date; dayOfWeek: number }> = [];
    const today = new Date();
    // Go back 364 days to build a beautiful perfect grid of exactly 365 days
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      list.push({
        dateStr,
        date: d,
        dayOfWeek: d.getDay() // 0: Sun, 1: Mon, ...
      });
    }
    return list;
  }, []);

  // Group by weeks for the contribution heatmap (each column contains Mon-Sun)
  const yearlyGridColumns = useMemo(() => {
    const columns: typeof yearlyDays[] = [];
    let currentColumn: typeof yearlyDays = [];
    
    yearlyDays.forEach((day, index) => {
      currentColumn.push(day);
      // If it's Sunday (0) or the last day in list, push the column and start a new one
      if (day.dayOfWeek === 0 || index === yearlyDays.length - 1) {
        columns.push(currentColumn);
        currentColumn = [];
      }
    });
    
    return columns;
  }, [yearlyDays]);

  return (
    <div className="bg-white/65 backdrop-blur-xl rounded-[28px] border border-white/40 p-5 sm:p-6 shadow-sm space-y-5 text-left transition-all" id="mood-calendar-section">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/30 pb-3">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-500" />
            Lịch Bản Ngã & Nhịp Điệu Cảm Xúc
          </h4>
          <p className="text-[10px] text-slate-400">
            Xem biểu đồ mật độ cảm xúc và năng lượng dài hạn của cậu
          </p>
        </div>

        {/* CONTROLS TOGGLE VIEW */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between bg-slate-100 p-0.5 rounded-xl border border-slate-200/50 self-end">
          <button
            type="button"
            onClick={() => setViewType("month")}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewType === "month" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" />
            <span>Xem theo Tháng</span>
          </button>
          <button
            type="button"
            onClick={() => setViewType("year")}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              viewType === "year" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Sóng Nhiệt Năm</span>
          </button>
        </div>
      </div>

      {/* MONTH VIEW ACCENT CONTROLLER */}
      {viewType === "month" && (
        <div className="flex justify-between items-center bg-white/40 border border-white/40 rounded-2xl px-4 py-2 shadow-inner">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-500"
            title="Tháng trước"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <h5 className="text-[12px] font-bold text-slate-700 font-serif">
            Tháng {month + 1}, Năm {year}
          </h5>

          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-500"
            title="Tháng sau"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* INTENSITY COLOR LEGEND */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-2xl bg-slate-50/50 border border-slate-100 text-[10px] text-slate-500 font-medium">
        <span className="flex items-center gap-1">Chỉ số cường độ năng lượng tinh thần:</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px]">Thấp</span>
          <span className="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-200" title="Cạn kiệt" />
          <span className="w-3.5 h-3.5 rounded bg-violet-100 border border-violet-200" title="Uể oải" />
          <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-200" title="Chông chênh" />
          <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-200" title="Bình yên" />
          <span className="w-3.5 h-3.5 rounded bg-yellow-100 border border-yellow-200" title="Tràn đầy" />
          <span className="text-[9px]">Cao</span>
        </div>
      </div>

      {/* THE GRIDS */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {viewType === "month" ? (
            <motion.div
              key="month-grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="space-y-2.5"
            >
              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-slate-400">
                <div>T2</div>
                <div>T3</div>
                <div>T4</div>
                <div>T5</div>
                <div>T6</div>
                <div>T7</div>
                <div className="text-rose-400">CN</div>
              </div>

              {/* Monthly Cells */}
              <div className="grid grid-cols-7 gap-1.5">
                {monthWeeksDays.map((day, idx) => {
                  if (!day.dayNum || !day.dateStr) {
                    return (
                      <div 
                        key={`empty-${idx}`} 
                        className="aspect-square bg-slate-50/20 rounded-xl border border-dashed border-slate-100/50"
                      />
                    );
                  }

                  const stats = getDailyStats(day.dateStr);
                  const isSelected = selectedDayKey === day.dateStr;
                  const intensityStyle = getIntensityStyle(stats ? stats.avgEnergy : null);
                  const moodConfig = stats ? moodsConfig[stats.dominantMoodId] : null;

                  return (
                    <button
                      key={day.dateStr}
                      type="button"
                      onClick={() => handleSelectDay(day.dateStr!)}
                      className={`aspect-square rounded-2xl border transition-all relative flex flex-col items-center justify-center p-1 cursor-pointer select-none group ${intensityStyle} ${
                        isSelected ? "ring-2 ring-emerald-500 ring-offset-2 scale-102 border-transparent z-10" : ""
                      }`}
                    >
                      {/* Day Number */}
                      <span className="absolute top-1 left-1.5 text-[9px] font-mono font-bold leading-none opacity-80 group-hover:opacity-100">
                        {day.dayNum}
                      </span>

                      {/* Display Emoji or Status Dot */}
                      {stats && moodConfig ? (
                        <div className="flex flex-col items-center justify-center mt-2">
                          <span className="text-base sm:text-lg animate-pulse-slow">
                            {moodConfig.emoji}
                          </span>
                          {stats.logs.length > 1 && (
                            <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded-full bg-slate-800 text-white text-[7px] font-bold scale-80 leading-none">
                              {stats.logs.length}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700/60 group-hover:scale-125 transition-transform" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="year-heatmap"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="space-y-3"
            >
              <div className="text-[10px] text-slate-400 leading-relaxed font-light mb-1">
                📌 Mỗi ô đại diện cho một ngày trong 1 năm qua. Hãy nhấn vào ô màu để xem lại cảm xúc, nhật ký lưu trữ nhé.
              </div>

              {/* Contribution Layout Container */}
              <div className="w-full overflow-x-auto pr-1 pb-2 scrollbar-thin">
                <div className="flex gap-1 min-w-[580px] p-1">
                  
                  {/* Left Column for weekday labels */}
                  <div className="flex flex-col justify-between text-[8px] font-bold text-slate-400 pr-1 select-none pt-2.5 pb-2.5 h-[98px]">
                    <div>T2</div>
                    <div>T4</div>
                    <div>T6</div>
                    <div>CN</div>
                  </div>

                  {/* Heatmap Columns */}
                  <div className="flex-1 flex gap-1">
                    {yearlyGridColumns.map((col, colIdx) => {
                      // Pad incomplete first column if needed (e.g. if we don't start on Mon)
                      // Standard contribution chart aligns rows Monday-Sunday
                      const paddedCol = [...col];
                      const firstDay = paddedCol[0];
                      if (colIdx === 0 && firstDay.dayOfWeek !== 1) {
                        const firstDayTargetIdx = firstDay.dayOfWeek === 0 ? 6 : firstDay.dayOfWeek - 1;
                        for (let p = 0; p < firstDayTargetIdx; p++) {
                          paddedCol.unshift({ dateStr: "", date: new Date(), dayOfWeek: -1 });
                        }
                      }

                      return (
                        <div key={colIdx} className="flex flex-col gap-1">
                          {paddedCol.map((day, rowIdx) => {
                            if (day.dayOfWeek === -1 || !day.dateStr) {
                              return <div key={`pad-${rowIdx}`} className="w-3.5 h-3.5 bg-transparent" />;
                            }

                            const stats = getDailyStats(day.dateStr);
                            const isSelected = selectedDayKey === day.dateStr;
                            const intensityStyle = getIntensityStyle(stats ? stats.avgEnergy : null);
                            const tooltipText = stats 
                              ? `${day.dateStr}: Năng lượng ${stats.avgEnergy}/5 (Tâm trạng: ${moodsConfig[stats.dominantMoodId]?.label})`
                              : `${day.dateStr}: Chưa ghi nhận`;

                            return (
                              <button
                                key={day.dateStr}
                                type="button"
                                onClick={() => handleSelectDay(day.dateStr)}
                                className={`w-3.5 h-3.5 rounded-sm border transition-all cursor-pointer relative hover:ring-1 hover:ring-emerald-400 ${intensityStyle} ${
                                  isSelected ? "ring-2 ring-emerald-500 ring-offset-1 scale-110 z-10 border-transparent" : "border-slate-200/30"
                                }`}
                                title={tooltipText}
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DETAILED DAILY LOG REPORT AT THE BOTTOM */}
      <AnimatePresence>
        {selectedDayKey && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 15 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 15 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-white/70 border border-emerald-500/15 shadow-sm space-y-4">
              <div className="flex justify-between items-start border-b border-slate-200/40 pb-2.5">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    Chi tiết Ngày {selectedDayKey}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {selectedDayData ? (
                      <>
                        <span className="text-xl">
                          {moodsConfig[selectedDayData.dominantMoodId]?.emoji}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800">
                          Tâm trạng chủ yếu: {moodsConfig[selectedDayData.dominantMoodId]?.label}
                        </h4>
                      </>
                    ) : (
                      <h4 className="text-xs font-bold text-slate-400 italic">
                        Chưa có dữ liệu cho ngày này
                      </h4>
                    )}
                  </div>
                </div>

                {selectedDayData && (
                  <span className="text-[10.5px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200/50">
                    {getIntensityLabel(selectedDayData.avgEnergy)}
                  </span>
                )}
              </div>

              {selectedDayData ? (
                <div className="space-y-4">
                  
                  {/* Notes Timeline List of that Day */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      Nhật ký & Chiêm nghiệm trong ngày:
                    </span>
                    <div className="space-y-2">
                      {selectedDayData.logs.map((log, index) => (
                        <div key={log.id} className="p-3 rounded-xl bg-white/50 border border-white/60 space-y-1.5 shadow-inner">
                          <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 border-b border-dashed border-slate-100 pb-1">
                            <span>Mục số #{index + 1}</span>
                            <span>{new Date(log.timestamp).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          {log.note ? (
                            <p className="text-xs text-slate-600 leading-relaxed text-justify italic">
                              “{log.note}”
                            </p>
                          ) : (
                            <p className="text-xs text-slate-400 italic">
                              (Cậu không để lại ghi chú gì ở mục nhật ký này)
                            </p>
                          )}

                          {/* Log Activities */}
                          {log.activities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {log.activities.map(actId => (
                                <span 
                                  key={actId} 
                                  className="text-[8px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full font-medium"
                                >
                                  {actId === "detox" && "📴 Detox"}
                                  {actId === "nature" && "🌳 Thiên nhiên"}
                                  {actId === "connect" && "🗣️ Tri kỷ"}
                                  {actId === "creative" && "🎨 Sáng tạo"}
                                  {actId === "read" && "📖 Học hỏi"}
                                  {actId === "exercise" && "🏃 Vận động"}
                                  {actId === "meditate" && "🧘 Thiền"}
                                  {actId === "sleep" && "😴 Ngủ ngon"}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CHÂN KÍNH COREZ AI INSIGHT */}
                  <div className="pt-2">
                    {aiInsight ? (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-300/20 text-[11.5px] text-slate-700 leading-relaxed font-serif font-medium relative text-left"
                      >
                        <div className="absolute right-3.5 top-2.5 text-3xl font-serif text-emerald-500/10 select-none pointer-events-none font-black leading-none">
                          “
                        </div>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-spin-slow" />
                          <span className="text-[9.5px] font-sans font-bold uppercase text-emerald-600 tracking-wider">
                            Lời vỗ về từ Cozy:
                          </span>
                        </div>
                        <p className="italic text-slate-800">
                          {aiInsight}
                        </p>
                      </motion.div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleGetAiInsight}
                        disabled={loadingInsight}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 text-[10.5px] font-bold transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        {loadingInsight ? (
                          <>
                            <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            <span>Đang kết nối tâm hồn cùng Cozy...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Nhận phản hồi thấu cảm từ Cozy cho ngày này ✨</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                </div>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <p className="text-xs text-slate-400 italic">
                    Hôm nay cậu chưa ghi nhận nhật ký cảm xúc ở Trạm Định Vị Bản Ngã.
                  </p>
                  <button
                    onClick={() => {
                      // Scroll smoothly to form input
                      const formElem = document.getElementById("journaling-module") || document.getElementById("mood-calendar-section");
                      formElem?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-3.5 py-1.5 bg-emerald-500 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-600 transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Smile className="w-3.5 h-3.5" />
                    Bấm để ghi nhận ngay hôm nay
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
