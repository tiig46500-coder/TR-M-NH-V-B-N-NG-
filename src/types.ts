export interface QuizQuestion {
  id: number;
  text: string;
}

export type RiskLevel = "GREEN" | "YELLOW" | "ORANGE" | "RED";

export interface QuizResult {
  score: number;
  level: RiskLevel;
  title: string;
  description: string;
  tips: string[];
}

export interface Confession {
  id: string;
  content: string;
  timestamp: string;
  color: string; // Tailwind bg-color class
  rotation: string; // Tailwind rotation class for realistic look
}

export interface HabitChallenge {
  id: string;
  title: string;
  description: string;
  daysCompleted: number;
  totalDays: number;
  isCheckedToday: boolean;
  streak: number;
}

export interface LạngSơnPlace {
  id: string;
  name: string;
  description: string;
  locationDetails: string;
  activityName: string;
  activityDesc: string;
  imagePrompt: string;
}

export interface FlashcardItem {
  id: number;
  front: string;
  back: string;
  category: "FOMO" | "Peer Pressure" | "Mindfulness" | "Social Detox";
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
}

export interface MoodLogEntry {
  id: string;
  date: string; // Định dạng YYYY-MM-DD
  timestamp: number;
  moodId: string; // 'happy' | 'calm' | 'unsteady' | 'tired' | 'anxious' | 'sad'
  activities: string[]; // Danh sách ID các hoạt động đã làm
  note: string; // Nhật ký chia sẻ ngắn
  energyLevel: number; // Chỉ số năng lượng thực tế (1 - 5)
}
