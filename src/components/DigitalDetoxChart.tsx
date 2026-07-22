import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
} from "recharts";
import { useUserData } from "../context/UserContext";
import { Leaf, Sparkles, TrendingUp, Calendar, Zap } from "lucide-react";

interface DetoxDataPoint {
  dateLabel: string; // e.g. "12/07"
  fullDate: string;  // "2026-07-12"
  minutes: number;
}

export const DigitalDetoxChart: React.FC = () => {
  const { userData, addDetoxMinutes } = useUserData();
  const [chartData, setChartData] = useState<DetoxDataPoint[]>([]);
  const [inputMinutes, setInputMinutes] = useState<string>("30");

  useEffect(() => {
    // Generate dates for the last 30 days
    const dates: { fullDate: string; label: string }[] = [];
    const todayObj = new Date();

    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(todayObj.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      dates.push({
        fullDate: `${yyyy}-${mm}-${dd}`,
        label: `${dd}/${mm}`
      });
    }

    // Load or seed historical detox data from localStorage using user-isolated key
    const storageKey = `remix_corez_detox_history_30d_${userData.userId || "anonymous"}`;
    let storedHistory: Record<string, number> = {};
    const raw = localStorage.getItem(storageKey);
    let isNewUser = false;

    if (raw) {
      try {
        storedHistory = JSON.parse(raw);
      } catch (e) {
        console.error("Failed to parse detox history", e);
      }
    } else {
      isNewUser = true;
    }

    // Map to recharts data points - if new user, keep all at 0
    const mappedData = dates.map(({ fullDate, label }, index) => {
      let minutes = 0;
      if (!isNewUser) {
        minutes = storedHistory[fullDate] || 0;
      }
      
      // Update today's real progress from current context/state
      if (index === 29) {
        minutes = userData.detoxMinutes || 0;
      }

      return {
        dateLabel: label,
        fullDate,
        minutes
      };
    });

    setChartData(mappedData);
  }, [userData.detoxMinutes, userData.userId]);

  // Calculate statistics
  const totalMinutes = chartData.reduce((acc, curr) => acc + curr.minutes, 0);
  const averageMinutes = chartData.length > 0 ? Math.round(totalMinutes / chartData.length) : 0;
  const maxMinutes = chartData.length > 0 ? Math.max(...chartData.map(d => d.minutes)) : 0;

  // Handler for adding detox progress
  const handleRecordDetox = () => {
    const mins = parseInt(inputMinutes, 10);
    if (isNaN(mins) || mins <= 0) return;

    // Get today's date in YYYY-MM-DD format
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const storageKey = `remix_corez_detox_history_30d_${userData.userId || "anonymous"}`;
    let storedHistory: Record<string, number> = {};
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        storedHistory = JSON.parse(raw);
      } catch (e) {}
    }

    // Accumulate today's value
    storedHistory[todayStr] = (storedHistory[todayStr] || 0) + mins;
    localStorage.setItem(storageKey, JSON.stringify(storedHistory));

    // Update global state & add XP
    addDetoxMinutes(mins);
    setInputMinutes("30");
  };

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data: DetoxDataPoint = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-emerald-500/30 backdrop-blur-md p-3 rounded-2xl shadow-xl text-xs space-y-1 text-white">
          <p className="font-semibold text-emerald-300 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Ngày {data.dateLabel}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] font-light text-slate-200">
            <span>Thời gian thải độc:</span>
            <span className="font-bold text-emerald-400 font-mono">{data.minutes} phút</span>
          </div>
          {data.minutes >= 60 ? (
            <p className="text-[10px] text-amber-400 italic font-medium mt-1">✨ Đạt chuẩn Chiến Binh Thực Tại!</p>
          ) : (
            <p className="text-[10px] text-slate-400 italic font-light mt-1">Cố gắng tăng tốc ngày mai nhé!</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div id="digital-detox-chart-container" className="bg-white/65 backdrop-blur-xl rounded-[32px] border border-white/40 p-5 sm:p-6 shadow-sm space-y-5 relative overflow-hidden">
      
      {/* Header and Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/30 pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
            Biểu Đồ Sức Khỏe Tinh Thần
          </span>
          <h3 className="font-serif text-lg font-bold text-slate-800 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-500 animate-pulse" />
            Tiến Trình Thải Độc Số (30 Ngày Gần Nhất)
          </h3>
          <p className="text-[11px] text-slate-400 font-light">
            Biểu đồ trực quan hóa số phút rời xa màn hình xã hội, tích lũy năng lượng đời thực bền vững.
          </p>
        </div>

        {/* Quick stats badges */}
        <div className="flex gap-2.5">
          <div className="bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-xl text-center min-w-[75px]">
            <span className="text-[8px] text-slate-400 block font-mono uppercase">Tổng tích lũy</span>
            <span className="text-sm font-black text-emerald-600 font-mono">{totalMinutes}p</span>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-xl text-center min-w-[75px]">
            <span className="text-[8px] text-slate-400 block font-mono uppercase">Trung bình ngày</span>
            <span className="text-sm font-black text-emerald-600 font-mono">{averageMinutes}p</span>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/10 px-3 py-1.5 rounded-xl text-center min-w-[75px]">
            <span className="text-[8px] text-slate-400 block font-mono uppercase">Cao nhất</span>
            <span className="text-sm font-black text-amber-600 font-mono">{maxMinutes}p</span>
          </div>
        </div>
      </div>

      {/* The Line / Area Chart */}
      <div className="w-full h-[220px] relative mt-2 select-none">
        {totalMinutes === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/45 backdrop-blur-xs rounded-[28px] p-4 text-center z-10 border border-emerald-500/10">
            <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-400 mb-2 animate-bounce">
              <Leaf className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-emerald-300">
              Chưa có dữ liệu. Hãy ghi nhận ngày thải độc đầu tiên của bạn! 🌿
            </p>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="detoxGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16, 185, 129, 0.08)" />
            <XAxis 
              dataKey="dateLabel" 
              tickLine={false} 
              axisLine={{ stroke: 'rgba(16, 185, 129, 0.15)' }}
              tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
            />
            <YAxis 
              tickLine={false} 
              axisLine={{ stroke: 'rgba(16, 185, 129, 0.15)' }}
              tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
              unit="p"
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="minutes" 
              stroke="#10b981" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#detoxGradient)" 
              dot={{ stroke: '#10b981', strokeWidth: 1.5, fill: '#fff', r: 3 }}
              activeDot={{ r: 5, strokeWidth: 2, fill: '#10b981' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Recording Form */}
      <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-emerald-500" />
            Ghi nhận thời gian thải độc hôm nay
          </h4>
          <p className="text-[10px] text-slate-400 font-light">
            Nhập số phút rời xa MXH hôm nay để vun đắp Cây bản địa & tăng karmaXP.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick selection chips */}
          <div className="flex gap-1">
            {["15", "30", "45", "60"].map((m) => (
              <button
                key={m}
                onClick={() => setInputMinutes(m)}
                className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all border ${
                  inputMinutes === m
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {m}p
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <input
              type="number"
              min="1"
              max="480"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
              placeholder="Phút"
              className="w-16 px-2 py-1.5 text-xs text-center font-bold rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 bg-white"
            />
            <button
              onClick={handleRecordDetox}
              disabled={!inputMinutes || parseInt(inputMinutes, 10) <= 0}
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
            >
              Ghi nhận
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic educational message based on average progress */}
      <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-2xl flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
          <Sparkles className="w-4.5 h-4.5 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Nhận định từ AI Mentor CoreZ
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed font-light">
            {averageMinutes >= 60 ? (
              <span>Tuyệt vời! Cậu đang duy trì mức thải độc trung bình là <strong className="text-emerald-700 font-bold">{averageMinutes} phút/ngày</strong>. Đây là chỉ số lý tưởng giúp giảm mệt mỏi thị giác, hồi phục thùy trán và tối ưu hóa khả năng tập trung sâu. Tiếp tục giữ vững phong độ chiến binh này nhé! 🔋🌱</span>
            ) : averageMinutes >= 30 ? (
              <span>Khá tốt! Mức rèn luyện trung bình đạt <strong className="text-emerald-700 font-bold">{averageMinutes} phút/ngày</strong>. Cậu đang từng bước giải thoát bản thân khỏi guồng quay Dopamine vô thức của thuật toán. Hãy cố gắng tăng thêm 5 phút detox mỗi ngày để cảm nhận rõ rệt sự yên bình nội tâm. 🌸✨</span>
            ) : averageMinutes > 0 ? (
              <span>Cố lên cậu nhé! Chỉ số thải độc trung bình hiện đạt <strong className="text-emerald-700 font-bold">{averageMinutes} phút/ngày</strong>. Để bắt đầu, cậu chỉ cần đặt máy xuống trong 10 phút sau giờ học hoặc tắt thông báo ứng dụng lúc 10h tối. Từng bước nhỏ mộc mạc sẽ tạo nên sự chuyển biến to lớn! 🌿💪</span>
            ) : (
              <span>Chào mừng cậu ghé thăm! Hãy bắt đầu hành trình bằng cách ghi nhận số phút thải độc đầu tiên hôm nay nhé. Mỗi phút rời xa màn hình là một chút dưỡng chất nuôi dưỡng Cây bản địa của cậu đấy! 🌱✨</span>
            )}
          </p>
        </div>
      </div>

    </div>
  );
};
