import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from "recharts";
import { MoodLogEntry } from "../types";
import { useUserData } from "../context/UserContext";
import { TrendingUp, User, RefreshCw, Sparkles, Smile, HelpCircle, Activity } from "lucide-react";

interface MoodTrendChartProps {
  logs: MoodLogEntry[];
  onResetLogs: () => void;
}

// Map moodId to a numerical score for visualization
const MOOD_SCORES: Record<string, { score: number; label: string; emoji: string }> = {
  happy: { score: 5, label: "Tươi vui", emoji: "🌟" },
  calm: { score: 4, label: "Bình yên", emoji: "🍃" },
  unsteady: { score: 3, label: "Chông chênh", emoji: "🍂" },
  tired: { score: 2, label: "Uể oải", emoji: "😴" },
  anxious: { score: 1, label: "Lo âu", emoji: "🚨" },
  sad: { score: 0, label: "Buồn bã", emoji: "🌧️" }
};

export const MoodTrendChart: React.FC<MoodTrendChartProps> = ({ logs, onResetLogs }) => {
  const { userData } = useUserData();
  const [activeUser, setActiveUser] = useState<string>(() => {
    return localStorage.getItem("remix_corez_active_user") || "Người Bạn Tỉnh Thức";
  });
  const [newUserName, setNewUserName] = useState("");
  const [isChangingUser, setIsChangingUser] = useState(false);

  // Filter and sort logs chronologically
  const sortedLogs = [...logs]
    .sort((a, b) => a.date.localeCompare(b.date));

  // Format data for Recharts
  const chartData = sortedLogs.map((log) => {
    const moodConfig = MOOD_SCORES[log.moodId] || { score: 2.5, label: "Bình thường", emoji: "😐" };
    const dateObj = new Date(log.date);
    const dateLabel = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
    
    return {
      date: log.date,
      dateLabel,
      moodScore: moodConfig.score,
      moodLabel: moodConfig.label,
      moodEmoji: moodConfig.emoji,
      energyLevel: log.energyLevel,
      note: log.note || "Không ghi chú"
    };
  });

  const handleSaveUser = () => {
    if (!newUserName.trim()) return;
    localStorage.setItem("remix_corez_active_user", newUserName.trim());
    setActiveUser(newUserName.trim());
    setIsChangingUser(false);
    setNewUserName("");
    
    // Clear logs to start fresh for this specific user
    onResetLogs();
  };

  const handleQuickReset = () => {
    if (window.confirm("Cậu có chắc chắn muốn làm sạch toàn bộ nhật ký hiện tại để người dùng mới bắt đầu hành trình riêng không? 🌱")) {
      onResetLogs();
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-emerald-500/30 backdrop-blur-md p-3.5 rounded-2xl shadow-xl text-xs space-y-1.5 text-white max-w-[240px]">
          <p className="font-bold text-emerald-400 font-sans flex items-center gap-1">
            <span>📅</span> Ngày {data.dateLabel}
          </p>
          <div className="space-y-1 text-slate-200">
            <p className="flex items-center gap-1">
              <span className="font-medium text-slate-400">Cảm xúc:</span>
              <span className="font-semibold text-yellow-400">{data.moodEmoji} {data.moodLabel}</span>
            </p>
            <p className="flex items-center gap-1">
              <span className="font-medium text-slate-400">Năng lượng:</span>
              <span className="font-mono font-bold text-sky-400">{data.energyLevel}/5</span>
            </p>
          </div>
          {data.note && (
            <p className="text-[10px] text-slate-300 italic border-t border-white/10 pt-1 mt-1 leading-normal line-clamp-2">
              "{data.note}"
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white/65 backdrop-blur-xl rounded-[32px] border border-white/40 p-5 sm:p-6 shadow-sm space-y-6" id="mood-trend-chart-component">
      {/* Header and User Management */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/20 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
              <User className="w-3 h-3" />
              Hồ sơ: {activeUser}
            </span>
            <button
              onClick={() => setIsChangingUser(!isChangingUser)}
              className="text-[10px] text-slate-400 hover:text-emerald-600 font-medium transition-colors flex items-center gap-0.5"
              title="Đổi tên / Khởi tạo người dùng mới"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              Đổi người dùng
            </button>
          </div>
          
          <h3 className="font-serif text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Biểu Đồ Theo Dõi Cảm Xúc Theo Thời Gian
          </h3>
          <p className="text-[11px] text-slate-400 font-light">
            Trực quan hóa sự biến đổi cảm xúc (0-5) song song với mức năng lượng của <strong className="text-emerald-700 font-medium">{activeUser}</strong>.
          </p>
        </div>

        {/* Quick action controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickReset}
            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium px-3 py-1.5 rounded-xl transition-all border border-slate-200 flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Làm mới biểu đồ
          </button>
        </div>
      </div>

      {/* Change user panel */}
      {isChangingUser && (
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-3 animate-fade-in">
          <p className="text-xs text-slate-600 font-medium">
            📝 Nhập tên của cậu để khởi tạo một biểu đồ cảm xúc hoàn toàn riêng biệt. Việc này sẽ reset nhật ký hiện tại để bắt đầu ghi dấu hành trình của riêng cậu:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Tên của cậu (ví dụ: Minh Anh)..."
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1"
              maxLength={20}
            />
            <div className="flex gap-1.5">
              <button
                onClick={handleSaveUser}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shrink-0"
              >
                Bắt đầu biểu đồ riêng
              </button>
              <button
                onClick={() => setIsChangingUser(false)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs px-3 py-2 rounded-xl transition-colors shrink-0"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State vs. Chart display */}
      {chartData.length === 0 ? (
        <div className="h-56 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-[24px] border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
            <Smile className="w-6 h-6 animate-bounce" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-700">Chưa có dữ liệu cảm xúc nào</h4>
            <p className="text-[11px] text-slate-400 max-w-sm leading-relaxed font-light">
              Chào mừng <strong className="text-emerald-600">{activeUser}</strong> đến với Cozy! Hãy ghi nhận trạng thái cảm xúc đầu tiên của cậu ở form bên cạnh để bắt đầu vẽ nên sơ đồ tâm trí mộc mạc của riêng mình nhé. 🌱
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main Chart Container */}
          <div className="w-full h-[220px] relative select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16, 185, 129, 0.08)" />
                <XAxis
                  dataKey="dateLabel"
                  tickLine={false}
                  axisLine={{ stroke: "rgba(16, 185, 129, 0.15)" }}
                  tick={{ fill: "#64748b", fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={{ stroke: "rgba(16, 185, 129, 0.15)" }}
                  tick={{ fill: "#64748b", fontSize: 9, fontFamily: "JetBrains Mono, monospace" }}
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={32} 
                  iconType="circle"
                  iconSize={6}
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'sans-serif', paddingBottom: '10px' }} 
                />
                <Area
                  name="Chỉ số cảm xúc (Buồn -> Vui)"
                  type="monotone"
                  dataKey="moodScore"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#moodGradient)"
                  dot={{ stroke: "#10b981", strokeWidth: 1.5, fill: "#fff", r: 3.5 }}
                  activeDot={{ r: 5, strokeWidth: 2, fill: "#10b981" }}
                />
                <Area
                  name="Mức năng lượng cơ thể (1-5)"
                  type="monotone"
                  dataKey="energyLevel"
                  stroke="#0ea5e9"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#energyGradient)"
                  dot={{ stroke: "#0ea5e9", strokeWidth: 1, fill: "#fff", r: 2.5 }}
                  activeDot={{ r: 4, strokeWidth: 1.5, fill: "#0ea5e9" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Dynamic Insight for the active user */}
          <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 rounded-2xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                Đánh giá dòng chảy tâm trí của {activeUser}
              </h4>
              <p className="text-[11px] text-slate-600 leading-relaxed font-light">
                {chartData.length >= 3 ? (
                  <span>
                    Dựa vào {chartData.length} nhật ký gần nhất, cậu đang duy trì mức cảm xúc khá ổn định. Điểm sáng là sự hài hòa giữa thể trạng năng lượng và tâm thái. Hãy tiếp tục ghi nhận đều đặn để xây dựng thói quen làm chủ thùy trán và duy trì bản lĩnh thực tại nhé! 🌱🌟
                  </span>
                ) : (
                  <span>
                    Tuyệt vời! Hành trình ghi nhận cảm xúc của cậu đã bắt đầu. Hãy cố gắng ghi nhận thêm ít nhất 2 ngày nữa để AI Mentor Cozy có đủ dữ liệu phân tích sâu sắc xu hướng tâm trạng của riêng cậu nhé! 🌸
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
