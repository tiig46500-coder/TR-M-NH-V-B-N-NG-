import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp, 
  increment,
  arrayUnion
} from "firebase/firestore";
import firebaseConfigData from "../../firebase-applet-config.json";

const firebaseConfig = {
  projectId: firebaseConfigData.projectId,
  appId: firebaseConfigData.appId,
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  firestoreDatabaseId: firebaseConfigData.firestoreDatabaseId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
};

// 1. Initialize Firebase App safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 2. Export Services
export const auth = getAuth(app);
export const db = firebaseConfigData.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Anonymous user handles generator
export const generateAnonymousName = (uid?: string): string => {
  const adjectives = ['Bình Yên', 'Mạnh Mẽ', 'Lặng Lẽ', 'Bí Ẩn', 'Kiên Cường', 'Dịu Dàng', 'Lực Lượng', 'Ấm Áp', 'Tươi Sáng', 'Rực Rỡ'];
  const nouns = ['Đám Mây', 'Ngôi Sao', 'Hạt Mầm', 'Lá Cây', 'Chú Mèo', 'Người Lữ Hành', 'Sông Xanh', 'Chồi Nón', 'Gió Lộng', 'Tia Nắng'];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const suffix = uid ? uid.slice(-4).toUpperCase() : Math.floor(1000 + Math.random() * 9000).toString();
  
  return `${randomNoun} ${randomAdj} #${suffix}`;
};

export interface EnergyItem {
  id: string;
  type: 'fragment' | 'star' | 'seed';
  name: string;
  icon: string;
  color: string;
  energyVal: number;
}

export interface CommunityMessage {
  id: string;
  content: string;
  authorName: string;
  authorUid: string;
  color: string;
  rotation: string;
  energyCount: number; // Thả tim / Truyền năng lượng
  hugCount: number;    // Gửi cái ôm
  shineCount: number;  // Thắp sáng
  collectCount: number;// Lượt thu thập
  energyItem: EnergyItem;
  createdAt: any;
  createdAtText?: string;
  isPublic: boolean;
  tags?: string[];
}

export interface UserFirebaseProfile {
  uid: string;
  anonymousName: string;
  avatarGradient: string;
  streak: number;
  karmaXP: number;
  collectedItems: Array<{
    id: string;
    messageId: string;
    content: string;
    authorName: string;
    energyItem: EnergyItem;
    collectedAt: string;
  }>;
  collectedCount: number;
  createdMessagesCount: number;
  updatedAt: string;
}

// 3. Initialize Anonymous Authentication safely with fallback for restricted auth environments
export const initAnonymousAuth = (onUserReady?: (user: User | null, anonProfile: UserFirebaseProfile) => void) => {
  return onAuthStateChanged(auth, async (currentUser) => {
    let user = currentUser;
    if (!user) {
      try {
        const userCred = await signInAnonymously(auth);
        user = userCred.user;
      } catch (err: any) {
        // Handle admin-restricted-operation or disabled auth provider gracefully
        console.warn("Firebase Anonymous Sign-in notice (using client session fallback):", err?.message || err);
      }
    }

    const fallbackUid = user?.uid || localStorage.getItem("corez_anon_uid") || ("anon_" + Math.random().toString(36).substring(2, 10));
    localStorage.setItem("corez_anon_uid", fallbackUid);

    const storedAnonName = localStorage.getItem("corez_anon_name") || generateAnonymousName(fallbackUid);
    localStorage.setItem("corez_anon_name", storedAnonName);

    let anonProfile: UserFirebaseProfile = {
      uid: fallbackUid,
      anonymousName: storedAnonName,
      avatarGradient: "from-emerald-400 to-teal-500",
      streak: 1,
      karmaXP: 100,
      collectedItems: [],
      collectedCount: 0,
      createdMessagesCount: 0,
      updatedAt: new Date().toISOString()
    };

    const targetUid = user?.uid || fallbackUid;
    const userRef = doc(db, "users", targetUid);

    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        anonProfile = userSnap.data() as UserFirebaseProfile;
      } else {
        await setDoc(userRef, anonProfile, { merge: true });
      }
    } catch (e) {
      console.warn("User document sync note:", e);
    }

    if (onUserReady) {
      onUserReady(user || null, anonProfile);
    }
  });
};

// 4. Real-time Subscription to Community Messages
export const subscribeCommunityMessages = (callback: (messages: CommunityMessage[]) => void) => {
  const q = query(
    collection(db, "community_messages"),
    orderBy("createdAt", "desc"),
    limit(50)
  );

  return onSnapshot(q, (snapshot) => {
    const messages: CommunityMessage[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      let createdAtText = "Vừa xong";
      if (data.createdAt) {
        if (data.createdAt.toDate) {
          const d = data.createdAt.toDate();
          createdAtText = d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) + " • " + d.toLocaleDateString("vi-VN");
        } else if (typeof data.createdAt === 'string') {
          createdAtText = data.createdAt;
        }
      }

      messages.push({
        id: docSnap.id,
        content: data.content || "",
        authorName: data.authorName || "Người Lữ Hành #000",
        authorUid: data.authorUid || "anon",
        color: data.color || "bg-[#1e293b]/80 border-emerald-500/30 text-emerald-100",
        rotation: data.rotation || "rotate-0",
        energyCount: data.energyCount || 0,
        hugCount: data.hugCount || 0,
        shineCount: data.shineCount || 0,
        collectCount: data.collectCount || 0,
        energyItem: data.energyItem || {
          id: "item-default",
          type: "star",
          name: "Ngôi Sao Đồng Cảm",
          icon: "🌟",
          color: "text-amber-400",
          energyVal: 15
        },
        createdAt: data.createdAt,
        createdAtText,
        isPublic: data.isPublic !== false,
        tags: data.tags || ["#chữalành", "#corez"]
      });
    });

    callback(messages);
  }, (error) => {
    console.error("Error in subscribeCommunityMessages:", error);
  });
};

// 5. Add New Community Message
export const addCommunityMessage = async (
  content: string, 
  authorName: string, 
  authorUid: string, 
  color: string,
  isPublic: boolean = true
) => {
  const energyItemsPool: EnergyItem[] = [
    { id: "fragment-ego", type: "fragment", name: "Mảnh Ghép Bản Ngã", icon: "🧩", color: "text-sky-400", energyVal: 20 },
    { id: "star-empathy", type: "star", name: "Ngôi Sao Đồng Cảm", icon: "🌟", color: "text-amber-400", energyVal: 25 },
    { id: "seed-accept", type: "seed", name: "Hạt Giống Chấp Nhận", icon: "🌱", color: "text-emerald-400", energyVal: 30 },
    { id: "light-soul", type: "star", name: "Đốm Sáng Chữa Lành", icon: "✨", color: "text-teal-300", energyVal: 15 },
    { id: "hug-warmth", type: "fragment", name: "Trái Tim Ấm Áp", icon: "💖", color: "text-rose-400", energyVal: 20 }
  ];

  const randomItem = energyItemsPool[Math.floor(Math.random() * energyItemsPool.length)];
  const rotations = ["rotate-0", "rotate-1", "-rotate-1", "rotate-2", "-rotate-2", "rotate-1.5", "-rotate-1.5"];
  const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

  const newMessageData = {
    content,
    authorName,
    authorUid,
    color,
    rotation: randomRotation,
    energyCount: 1,
    hugCount: 1,
    shineCount: 1,
    collectCount: 0,
    energyItem: randomItem,
    createdAt: serverTimestamp(),
    isPublic
  };

  const docRef = await addDoc(collection(db, "community_messages"), newMessageData);

  // Update global stats
  const statsRef = doc(db, "community_stats", "global");
  try {
    await setDoc(statsRef, {
      totalMessages: increment(1),
      totalStars4D: increment(1),
      lastUpdated: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn("Stats update warning:", e);
  }

  // Update user created messages count
  if (authorUid) {
    const userRef = doc(db, "users", authorUid);
    try {
      await setDoc(userRef, {
        createdMessagesCount: increment(1),
        karmaXP: increment(25)
      }, { merge: true });
    } catch (e) {}
  }

  return docRef.id;
};

// 6. Interact with Message (Energy, Hug, Shine, Collect)
export const interactMessage = async (
  messageId: string, 
  type: 'energy' | 'hug' | 'shine' | 'collect',
  userUid?: string,
  userAnonName?: string,
  messageObj?: CommunityMessage
) => {
  const msgRef = doc(db, "community_messages", messageId);
  const statsRef = doc(db, "community_stats", "global");

  const updateFields: any = {};
  const statsUpdateFields: any = {};

  if (type === 'energy') {
    updateFields.energyCount = increment(1);
    statsUpdateFields.totalEnergy = increment(1);
  } else if (type === 'hug') {
    updateFields.hugCount = increment(1);
    statsUpdateFields.totalHugs = increment(1);
  } else if (type === 'shine') {
    updateFields.shineCount = increment(1);
    statsUpdateFields.totalShines = increment(1);
  } else if (type === 'collect') {
    updateFields.collectCount = increment(1);
    statsUpdateFields.totalCollected = increment(1);

    // Also record collection in user document if userUid is present
    if (userUid && messageObj) {
      const userRef = doc(db, "users", userUid);
      const collectionItem = {
        id: `collect_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        messageId: messageObj.id,
        content: messageObj.content,
        authorName: messageObj.authorName,
        energyItem: messageObj.energyItem,
        collectedAt: new Date().toLocaleString("vi-VN")
      };

      try {
        await setDoc(userRef, {
          collectedItems: arrayUnion(collectionItem),
          collectedCount: increment(1),
          karmaXP: increment(messageObj.energyItem.energyVal || 15),
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.error("Error saving user collection item:", err);
      }
    }
  }

  await updateDoc(msgRef, updateFields);
  try {
    await setDoc(statsRef, statsUpdateFields, { merge: true });
  } catch (e) {}
};

// 7. Subscribe to Global Stats
export interface GlobalCommunityStats {
  totalMessages: number;
  totalHugs: number;
  totalShines: number;
  totalCollected: number;
  totalEnergy: number;
  totalStars4D: number;
}

export const subscribeGlobalStats = (callback: (stats: GlobalCommunityStats) => void) => {
  const statsRef = doc(db, "community_stats", "global");
  return onSnapshot(statsRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback({
        totalMessages: data.totalMessages || 128,
        totalHugs: data.totalHugs || 1250,
        totalShines: data.totalShines || 890,
        totalCollected: data.totalCollected || 430,
        totalEnergy: data.totalEnergy || 2100,
        totalStars4D: data.totalStars4D || 320
      });
    } else {
      callback({
        totalMessages: 128,
        totalHugs: 1250,
        totalShines: 890,
        totalCollected: 430,
        totalEnergy: 2100,
        totalStars4D: 320
      });
    }
  });
};

// 8. Update Anonymous Name
export const updateAnonymousName = async (uid: string, newName: string) => {
  if (!uid || !newName.trim()) return;
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    anonymousName: newName.trim(),
    updatedAt: new Date().toISOString()
  }, { merge: true });
  localStorage.setItem("corez_anon_name", newName.trim());
  window.dispatchEvent(new Event("corez_anon_name_changed"));
};
