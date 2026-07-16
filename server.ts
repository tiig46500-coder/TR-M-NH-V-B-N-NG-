import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy-loaded GoogleGenAI client to avoid startup crash if API key is missing
  let aiClient: GoogleGenAI | null = null;

  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("WARNING: GEMINI_API_KEY environment variable is not set. Chat will operate in demo mode.");
        return null;
      }
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // AI Mentor Chat endpoint ("Người Lắng Nghe")
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array provided." });
      }

      const client = getAiClient();

      if (!client) {
        // Fallback empathic responses in Vietnamese for Demo Mode when GEMINI_API_KEY is not configured
        const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
        let reply = "Mình luôn ở đây lắng nghe bạn. Đôi khi áp lực đồng trang lứa và những con số trên mạng xã hội khiến chúng ta ngộp thở, nhưng bạn đã làm rất tốt rồi. Hãy hít thở sâu nhé!";
        
        if (lastUserMessage.includes("fomo") || lastUserMessage.includes("mạng xã hội") || lastUserMessage.includes("tiktok")) {
          reply = "Mạng xã hội chỉ là một lát cắt hoàn hảo được trưng bày. Đừng để thước đo của người khác định hình giá trị của bạn. Bạn có muốn thử thách detox TikTok cùng mình hôm nay không? 🌿";
        } else if (lastUserMessage.includes("buồn") || lastUserMessage.includes("mệt") || lastUserMessage.includes("áp lực")) {
          reply = "Nghe tiếng lòng bạn trĩu nặng quá. Áp lực cuộc sống, học tập đè nén khiến bạn kiệt sức đúng không? Đừng giữ một mình, cứ chia sẻ với mình nhé, mình luôn bảo mật cuộc trò chuyện này.";
        } else if (lastUserMessage.includes("xin chào") || lastUserMessage.includes("hi") || lastUserMessage.includes("hello")) {
          reply = "Chào cậu nha! Mình là Người Lắng Nghe ở Trạm Định Vị Bản Ngã đây. Hôm nay cậu cảm thấy thế nào? Có điều gì làm cậu bận lòng không?";
        }

        // Simulate short delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        return res.json({ reply, isDemo: true });
      }

      // Convert messages to Gemini API format
      // { role: 'user' | 'model', parts: [{ text: string }] }
      const contents = messages.map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const systemInstruction = `
        Bạn là "Người Lắng Nghe", một tri kỷ ảo và là mentor tư vấn tâm lý học đường thuộc dự án quốc gia "Trạm Định Vị Bản Ngã" (Identity Compass).
        Nhiệm vụ của bạn là lắng nghe, thấu cảm, xoa dịu áp lực FOMO (Fear of Missing Out), áp lực đồng trang lứa (peer pressure), lo âu học tập và sự mệt mỏi từ mạng xã hội của học sinh sinh viên Gen Z Việt Nam.
        
        Phong cách giao tiếp:
        - Cực kỳ ấm áp, chân thành, nhẹ nhàng, thấu cảm sâu sắc như một người bạn tri kỷ lớn hơn một chút.
        - Viết ngắn gọn, súc tích (mỗi tin nhắn chỉ nên từ 2-4 câu, mô phỏng tin nhắn SMS/Messenger).
        - Sử dụng xưng hô thân mật phù hợp với học sinh như: "mình" - "bạn", "mình" - "cậu".
        - Tuyệt đối giữ bảo mật, tạo cảm giác an toàn và không phán xét.
        - Có thể khéo léo gợi ý học sinh tham gia các hoạt động Detox mạng xã hội hoặc đi trải nghiệm thực tế (Ví dụ: leo núi Phai Vệ, đi làm thiện nguyện, tham gia CLB...) để kéo học sinh ra khỏi thế giới ảo nếu phù hợp ngữ cảnh.
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
        },
      });

      const reply = response.text || "Mình luôn ở đây lắng nghe bạn.";
      return res.json({ reply, isDemo: false });
    } catch (error: any) {
      console.error("Gemini API Error in /api/chat:", error);
      return res.status(500).json({ error: "Có lỗi xảy ra khi trò chuyện với trợ lý ảo. Vui lòng thử lại!" });
    }
  });

  // AI Music Generation Endpoint (Gemini Lyria)
  app.post("/api/generate-music", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "Yêu cầu cung cấp từ khóa mô tả bản nhạc." });
      }

      const client = getAiClient();
      if (!client) {
        // Fallback for Demo Mode (if API key is missing)
        return res.json({
          isDemo: true,
          audioBase64: "",
          mimeType: "audio/wav",
          title: prompt,
          message: "Đang chạy chế độ Demo (không có phím API). Giai điệu tương ứng được giả lập bằng guitar acoustic."
        });
      }

      // Call Lyria model via GoogleGenAI SDK
      const responseStream = await client.models.generateContentStream({
        model: "lyria-3-clip-preview",
        contents: prompt,
      });

      let audioBase64 = "";
      let mimeType = "audio/wav";

      for await (const chunk of responseStream) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;

        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
        }
      }

      if (!audioBase64) {
        throw new Error("Không thể trích xuất dữ liệu âm thanh từ mô hình Lyria.");
      }

      return res.json({
        isDemo: false,
        audioBase64,
        mimeType,
        title: prompt
      });
    } catch (error: any) {
      console.error("Error in /api/generate-music:", error);
      return res.status(500).json({ error: "Có lỗi xảy ra khi tạo nhạc AI: " + error.message });
    }
  });

  // Dynamic Gemini-powered Flashcard solution endpoint
  app.post("/api/gemini-flashcard", async (req, res) => {
    try {
      const { category, front } = req.body;
      if (!category || !front) {
        return res.status(400).json({ error: "Yêu cầu cung cấp chủ đề và câu hỏi của thẻ." });
      }

      const client = getAiClient();
      if (!client) {
        // Fallback response for Demo Mode when GEMINI_API_KEY is not configured
        await new Promise((resolve) => setTimeout(resolve, 800));
        return res.json({
          reply: `[Demo] Hãy thực hành ngay: Tắt bớt các thiết bị gây nhiễu, nhắm mắt hít thở sâu 3 nhịp và cam kết tập trung giải quyết vấn đề của "${category}" trong 1 phút thôi nhé. Cậu làm được mà! 🌱✨`,
          isDemo: true
        });
      }

      const systemPrompt = `Bạn là một chuyên gia tâm lý học đường Gen Z thấu cảm. Hãy đưa ra 1 GIẢI PHÁP TÂM LÝ HỌC ĐƯỜNG cực kỳ thực tế, dễ thực hiện NGAY TRONG 1 PHÚT cho vấn đề: ${category} (với câu hỏi cụ thể là: "${front}"). Yêu cầu: Ngắn gọn tối đa 2-3 dòng (dưới 80 từ), hành văn ấm áp, chữa lành, sử dụng các icon dễ thương như 🌱, ✨, 🫧.`;

      const response = await client.models.generateContent({
        model: "gemini-1.5-flash",
        contents: systemPrompt,
        config: {
          temperature: 0.7,
        },
      });

      const reply = response.text || "Hãy thở sâu và kiên nhẫn với bản thân nhé! 🌱";
      return res.json({ reply, isDemo: false });
    } catch (error: any) {
      console.error("Error in /api/gemini-flashcard:", error);
      return res.status(500).json({ error: "Có lỗi xảy ra khi tạo bí kíp chữa lành. Vui lòng thử lại!" });
    }
  });

  // Handle static assets and SPA routing using Vite
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
