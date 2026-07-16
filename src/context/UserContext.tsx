import React, { createContext, useContext, useState, useEffect } from "react";
import { RiskLevel } from "../types";

export interface MoodLog {
  id: string;
  date: string;
  moodId: "happy" | "calm" | "sad" | "anxious" | "tired";
  note: string;
  energyLevel: number;
  activities: string[];
}

export interface ReflectionLog {
  id: string;
  date: string;
  promptText: string;
  answerText: string;
}

export interface FutureLetter {
  id: string;
  writeDate: string;
  unlockDate: string; // ISO string
  content: string;
  releaseTimelineLabel: string;
  isSealed: boolean;
}

export interface UserData {
  diiScore: number;
  diiLevel: RiskLevel | null;
  karmaXP: number;
  moodLogs: MoodLog[];
  detoxMinutes: number;
  plantStage: number; // Giai đoạn của Cây bản địa (0 - 3)
  reflections: ReflectionLog[];
  futureLetters: FutureLetter[];
}

interface UserContextType {
  userData: UserData;
  updateDiiScore: (score: number, level: RiskLevel) => void;
  addXP: (amount: number) => void;
  setXP: (amount: number) => void;
  addMoodLog: (log: MoodLog) => void;
  setMoodLogs: (logs: MoodLog[]) => void;
  addDetoxMinutes: (minutes: number) => void;
  setPlantStage: (stage: number) => void;
  addReflection: (log: ReflectionLog) => void;
  deleteReflection: (id: string) => void;
  addFutureLetter: (letter: FutureLetter) => void;
  deleteFutureLetter: (id: string) => void;
  resetAllData: () => void;
}

const DEFAULT_USER_DATA: UserData = {
  diiScore: 0,
  diiLevel: null,
  karmaXP: 0,
  moodLogs: [],
  detoxMinutes: 0,
  plantStage: 0,
  reflections: [],
  futureLetters: [],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>(() => {
    // 1. Check if unified user data already exists
    const savedData = localStorage.getItem("remix_corez_user_data");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Ensure all required fields exist
        return {
          diiScore: typeof parsed.diiScore === "number" ? parsed.diiScore : 0,
          diiLevel: parsed.diiLevel || null,
          karmaXP: typeof parsed.karmaXP === "number" ? parsed.karmaXP : 0,
          moodLogs: Array.isArray(parsed.moodLogs) ? parsed.moodLogs : [],
          detoxMinutes: typeof parsed.detoxMinutes === "number" ? parsed.detoxMinutes : 0,
          plantStage: typeof parsed.plantStage === "number" ? parsed.plantStage : 0,
          reflections: Array.isArray(parsed.reflections) ? parsed.reflections : [],
          futureLetters: Array.isArray(parsed.futureLetters) ? parsed.futureLetters : [],
        };
      } catch (e) {
        console.error("Error parsing user data from localStorage", e);
      }
    }

    // 2. Fallback to reading legacy individual keys to avoid losing user progress
    const legacyXP = localStorage.getItem("remix_corez_xp");
    const legacyMoodLogs = localStorage.getItem("remix_corez_mood_logs");
    const legacyDiiScore = localStorage.getItem("remix_corez_dii_score");
    const legacyDiiLevel = localStorage.getItem("remix_corez_dii_level") as RiskLevel | null;
    const legacyDetox = localStorage.getItem("remix_corez_detox_minutes");
    const legacyPlant = localStorage.getItem("remix_corez_plant_stage");
    const legacyReflections = localStorage.getItem("remix_corez_reflections");
    const legacyLetters = localStorage.getItem("remix_corez_future_letters");

    let parsedMoodLogs: MoodLog[] = [];
    if (legacyMoodLogs) {
      try {
        parsedMoodLogs = JSON.parse(legacyMoodLogs);
      } catch (e) {}
    }

    let parsedReflections: ReflectionLog[] = [];
    if (legacyReflections) {
      try {
        parsedReflections = JSON.parse(legacyReflections);
      } catch (e) {}
    }

    let parsedLetters: FutureLetter[] = [];
    if (legacyLetters) {
      try {
        parsedLetters = JSON.parse(legacyLetters);
      } catch (e) {}
    }

    return {
      diiScore: legacyDiiScore ? parseInt(legacyDiiScore, 10) : 0,
      diiLevel: legacyDiiLevel || null,
      karmaXP: legacyXP ? parseInt(legacyXP, 10) : 0,
      moodLogs: parsedMoodLogs,
      detoxMinutes: legacyDetox ? parseInt(legacyDetox, 10) : 0,
      plantStage: legacyPlant ? parseInt(legacyPlant, 10) : 0,
      reflections: parsedReflections,
      futureLetters: parsedLetters,
    };
  });

  // Automatically synchronize state changes with localStorage
  useEffect(() => {
    localStorage.setItem("remix_corez_user_data", JSON.stringify(userData));

    // Also write to legacy keys so old components remain synchronized
    localStorage.setItem("remix_corez_xp", userData.karmaXP.toString());
    localStorage.setItem("remix_corez_mood_logs", JSON.stringify(userData.moodLogs));
    if (userData.diiLevel) {
      localStorage.setItem("remix_corez_dii_level", userData.diiLevel);
    } else {
      localStorage.removeItem("remix_corez_dii_level");
    }
    localStorage.setItem("remix_corez_dii_score", userData.diiScore.toString());
    localStorage.setItem("remix_corez_detox_minutes", userData.detoxMinutes.toString());
    localStorage.setItem("remix_corez_plant_stage", userData.plantStage.toString());
    localStorage.setItem("remix_corez_reflections", JSON.stringify(userData.reflections));
    localStorage.setItem("remix_corez_future_letters", JSON.stringify(userData.futureLetters));

    // Dispatch custom event to notify external listeners of mood log updates if needed
    window.dispatchEvent(new Event("remix_corez_mood_logs_updated"));
  }, [userData]);

  const updateDiiScore = (score: number, level: RiskLevel) => {
    setUserData((prev) => ({
      ...prev,
      diiScore: score,
      diiLevel: level,
    }));
  };

  const addXP = (amount: number) => {
    setUserData((prev) => ({
      ...prev,
      karmaXP: prev.karmaXP + amount,
    }));
  };

  const setXP = (amount: number) => {
    setUserData((prev) => ({
      ...prev,
      karmaXP: amount,
    }));
  };

  const addMoodLog = (log: MoodLog) => {
    setUserData((prev) => {
      const updatedLogs = [log, ...prev.moodLogs];
      return {
        ...prev,
        moodLogs: updatedLogs,
      };
    });
  };

  const setMoodLogs = (logs: MoodLog[]) => {
    setUserData((prev) => ({
      ...prev,
      moodLogs: logs,
    }));
  };

  const addDetoxMinutes = (minutes: number) => {
    setUserData((prev) => ({
      ...prev,
      detoxMinutes: prev.detoxMinutes + minutes,
    }));
  };

  const setPlantStage = (stage: number) => {
    setUserData((prev) => ({
      ...prev,
      plantStage: Math.max(0, Math.min(3, stage)), // Limit to range [0, 3]
    }));
  };

  const addReflection = (log: ReflectionLog) => {
    setUserData((prev) => ({
      ...prev,
      reflections: [log, ...prev.reflections],
    }));
  };

  const deleteReflection = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      reflections: prev.reflections.filter((r) => r.id !== id),
    }));
  };

  const addFutureLetter = (letter: FutureLetter) => {
    setUserData((prev) => ({
      ...prev,
      futureLetters: [letter, ...prev.futureLetters],
    }));
  };

  const deleteFutureLetter = (id: string) => {
    setUserData((prev) => ({
      ...prev,
      futureLetters: prev.futureLetters.filter((l) => l.id !== id),
    }));
  };

  const resetAllData = () => {
    // Clear all related keys in localStorage
    localStorage.removeItem("remix_corez_user_data");
    localStorage.removeItem("remix_corez_xp");
    localStorage.removeItem("remix_corez_mood_logs");
    localStorage.removeItem("remix_corez_dii_score");
    localStorage.removeItem("remix_corez_dii_level");
    localStorage.removeItem("remix_corez_detox_minutes");
    localStorage.removeItem("remix_corez_plant_stage");
    localStorage.removeItem("remix_corez_task_history");
    localStorage.removeItem("remix_corez_tasks_done");
    localStorage.removeItem("remix_corez_day_counter");
    localStorage.removeItem("remix_corez_completed_today");
    localStorage.removeItem("remix_corez_reflections");
    localStorage.removeItem("remix_corez_future_letters");
    localStorage.removeItem("remix_corez_confessions");
    localStorage.removeItem("remix_corez_hearts");

    setUserData({ ...DEFAULT_USER_DATA });
    window.dispatchEvent(new Event("remix_corez_mood_logs_updated"));
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        updateDiiScore,
        addXP,
        setXP,
        addMoodLog,
        setMoodLogs,
        addDetoxMinutes,
        setPlantStage,
        addReflection,
        deleteReflection,
        addFutureLetter,
        deleteFutureLetter,
        resetAllData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be used within a UserProvider");
  }
  return context;
};
