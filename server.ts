import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
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
      const { messages, moodLogs } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array provided." });
      }

      // Compile crisis context from mood logs for the AI Mentor
      let crisisContext = "";
      let hasRecentPanic = false;
      let panicCount = 0;

      if (moodLogs && Array.isArray(moodLogs) && moodLogs.length > 0) {
        const recentLogs = moodLogs.slice(0, 8);
        const panicLogs = moodLogs.filter((log: any) => log.note && log.note.includes("PANIC BUTTON"));
        panicCount = panicLogs.length;
        hasRecentPanic = panicLogs.length > 0;

        crisisContext = `
Trạng thái cảm xúc và nhật ký hành vi gần đây của người dùng:
${recentLogs.map((log: any) => `- Ngày ${log.date}: Trạng thái [${log.moodId}], Năng lượng: ${log.energyLevel}/5. Ghi chú: "${log.note}"`).join("\n")}

Đặc biệt: Người dùng đã bấm nút thoát khẩn cấp (Panic Button) ${panicCount} lần trong lịch sử sử dụng, biểu thị trạng thái khủng hoảng tâm lý đột ngột. Hãy thấu hiểu sâu sắc điều này để nhẹ nhàng nâng đỡ tinh thần và hỏi han xoa dịu nếu họ đang có biểu hiện lo âu hoặc mệt mỏi cực độ.
`;
      }

      const client = getAiClient();

      if (!client) {
        // Fallback empathic responses in Vietnamese for Demo Mode when GEMINI_API_KEY is not configured
        const lastUserMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
        let reply = "Mình luôn ở đây lắng nghe bạn. Đôi khi áp lực đồng trang lứa và những con số trên mạng xã hội khiến chúng ta ngộp thở, nhưng bạn đã làm rất tốt rồi. Hãy hít thở sâu nhé!";
        
        if (hasRecentPanic) {
          reply = `Mình vừa nhận thấy cậu có giai đoạn căng thẳng cực độ (đã kích hoạt Thoát khẩn cấp/Panic Button). Cậu ổn chứ? Hãy để mình là một trạm sạc bình yên cho cậu nhé. Đừng lo lắng về những áp lực xung quanh, cậu rất xứng đáng được yêu thương! 🌱`;
        } else if (lastUserMessage.includes("fomo") || lastUserMessage.includes("mạng xã hội") || lastUserMessage.includes("tiktok")) {
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

        ${crisisContext ? `BỐI CẢNH QUAN TRỌNG VỀ SỨC KHỎE TINH THẦN CỦA NGƯỜI DÙNG:\n${crisisContext}` : ""}
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
      console.log("Notice: Chat local backup used.");
      
      // Destructure req.body inside catch block to solve block-scoping constraints
      const { messages, moodLogs } = req.body;
      
      const lastUserMessage = messages && Array.isArray(messages) && messages.length > 0
        ? messages[messages.length - 1]?.content?.toLowerCase() || ""
        : "";
      
      const panicLogs = moodLogs && Array.isArray(moodLogs)
        ? moodLogs.filter((log: any) => log.note && log.note.includes("PANIC BUTTON"))
        : [];
      const hasRecentPanic = panicLogs.length > 0;
      
      let reply = "Mình luôn ở đây lắng nghe bạn. Đôi khi áp lực đồng trang lứa và những con số trên mạng xã hội khiến chúng ta ngộp thở, nhưng bạn đã làm rất tốt rồi. Hãy hít thở sâu nhé!";
      
      if (hasRecentPanic) {
        reply = "Mình vừa nhận thấy cậu có giai đoạn căng thẳng cực độ (đã kích hoạt Thoát khẩn cấp/Panic Button). Cậu ổn chứ? Hãy để mình là một trạm sạc bình yên cho cậu nhé. Đừng lo lắng về những áp lực xung quanh, cậu rất xứng đáng được yêu thương! 🌱";
      } else if (lastUserMessage.includes("fomo") || lastUserMessage.includes("mạng xã hội") || lastUserMessage.includes("tiktok")) {
        reply = "Mạng xã hội chỉ là một lát cắt hoàn hảo được trưng bày. Đừng để thước đo của người khác định hình giá trị của bạn. Bạn có muốn thử thách detox TikTok cùng mình hôm nay không? 🌿";
      } else if (lastUserMessage.includes("buồn") || lastUserMessage.includes("mệt") || lastUserMessage.includes("áp lực")) {
        reply = "Nghe tiếng lòng bạn trĩu nặng quá. Áp lực cuộc sống, học tập đè nén khiến bạn kiệt sức đúng không? Đừng giữ một mình, cứ chia sẻ với mình nhé, mình luôn bảo mật cuộc trò chuyện này.";
      } else if (lastUserMessage.includes("xin chào") || lastUserMessage.includes("hi") || lastUserMessage.includes("hello")) {
        reply = "Chào cậu nha! Mình là Người Lắng Nghe ở Trạm Định Vị Bản Ngã đây. Hôm nay cậu cảm thấy thế nào? Có điều gì làm cậu bận lòng không?";
      }

      return res.json({ reply, isDemo: true, isFallback: true });
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
      console.log("Notice: Music generator backup used.");
      return res.status(500).json({ error: "Có lỗi xảy ra khi tạo nhạc AI." });
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
      console.log("Notice: Flashcard backup used.");
      const { category } = req.body;
      // Bulletproof fallback response when quota limits are reached
      return res.json({
        reply: `[Vũ trụ chữa lành] Hãy thực hành ngay: Tắt bớt các thiết bị gây nhiễu, nhắm mắt hít thở sâu 3 nhịp và cam kết tập trung giải quyết vấn đề của "${category || "bản thân"}" trong 1 phút thôi nhé. Cậu làm được mà! 🌱✨`,
        isDemo: true,
        isFallback: true
      });
    }
  });

  // Dynamic Gemini-powered Inspiring Card solution endpoint
  app.post("/api/gemini-inspire-card", async (req, res) => {
    try {
      const { quote } = req.body;
      if (!quote) {
        return res.status(400).json({ error: "Yêu cấp cung cấp câu nói truyền cảm hứng." });
      }

      const client = getAiClient();
      if (!client) {
        // Fallback response for Demo Mode when GEMINI_API_KEY is not configured
        await new Promise((resolve) => setTimeout(resolve, 800));
        return res.json({
          reply: `Tớ hiểu cậu đang rất áp lực học tập và mệt mỏi vì mớ bài vở. Hãy để ý đến câu nói này: "${quote}". 

Hành động nhỏ hôm nay: Tắt máy tính sớm hơn 15 phút, vươn vai thật dài và uống một cốc nước mát nhé. Tớ luôn tự hào vì nỗ lực thầm lặng của cậu! 🌸🌿`,
          isDemo: true
        });
      }

      const prompt = `Bạn là một người bạn đồng hành thấu cảm. Dựa vào câu nói truyền cảm hứng sau: '${quote}', hãy viết 1 thông điệp chữa lành và 1 hành động thực tế cực kỳ ngắn gọn (dưới 50 từ) dành riêng cho một bạn học sinh Gen Z đang mệt mỏi vì áp lực học tập. Dùng icon dễ thương, xưng hô Tớ - Cậu.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      const reply = response.text || "Cậu đã vất vả nhiều rồi. Hãy tự thưởng một ly sữa ấm và đi ngủ sớm hôm nay nhé! Tớ đồng hành cùng cậu. 🌱";
      return res.json({ reply, isDemo: false });
    } catch (error: any) {
      console.log("Notice: Inspire card backup used.");
      const { quote } = req.body;
      // Bulletproof fallback response when quota limits are reached
      return res.json({
        reply: `Tớ hiểu cậu đang rất áp lực học tập và mệt mỏi vì mớ bài vở. Hãy để ý đến câu nói này: "${quote}". 

Hành động nhỏ hôm nay: Tắt máy tính sớm hơn 15 phút, vươn vai thật dài và uống một cốc nước mát nhé. Tớ luôn tự hào vì nỗ lực thầm lặng của cậu! 🌸🌿`,
        isDemo: true,
        isFallback: true
      });
    }
  });

  // Dynamic Gemini-powered note validation/sentiment analysis endpoint
  app.post("/api/validate-note", async (req, res) => {
    try {
      const { content } = req.body;
      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Nội dung bộc bạch không hợp lệ." });
      }

      const client = getAiClient();
      if (!client) {
        // Fallback validation for Demo Mode (local analysis)
        const lower = content.toLowerCase();
        const toxicKeywords = ["chửi", "địt", "đm", "vl", "ngu", "cút", "tự tử", "tự sát", "bạo lực", "đánh nhau", "giết"];
        const isApproved = !toxicKeywords.some((word) => lower.includes(word));
        
        let sentiment = "vulnerable";
        if (!isApproved) {
          sentiment = "harmful";
        } else if (lower.includes("vui") || lower.includes("yêu") || lower.includes("thích")) {
          sentiment = "positive";
        }

        const reason = isApproved 
          ? "Nội dung phù hợp, chia sẻ cảm xúc cá nhân an toàn." 
          : "Nội dung chứa từ ngữ tiêu cực hoặc có hành vi không phù hợp.";

        const suggestion = isApproved 
          ? "" 
          : "Hãy thử diễn đạt cảm xúc của cậu bằng một cách nhẹ nhàng hơn mà không dùng từ ngữ gây tổn thương hoặc kích động nhé. Tớ luôn ở đây lắng nghe.";

        return res.json({
          isApproved,
          sentiment,
          reason,
          suggestion,
          isDemo: true
        });
      }

      const systemInstruction = `
        Bạn là kiểm duyệt viên và nhà tư vấn tâm lý học đường thuộc dự án "Trạm Định Vị Bản Ngã" (Identity Compass).
        Nhiệm vụ của bạn là phân tích cảm xúc (sentiment analysis) và lọc bỏ các nội dung độc hại, xúc phạm, bạo lực, tự hại, hoặc tục tĩu từ các mẩu giấy ghi chú ẩn danh của học sinh sinh viên Gen Z Việt Nam gửi lên diễn đàn chung.

        QUY TẮC PHÂN LOẠI CỰC KỲ QUAN TRỌNG:
        1. Mục tiêu của diễn đàn là chia sẻ, bộc bạch những trăn trước, lo âu thầm kín về học tập, áp lực đồng trang lứa, FOMO, cảm giác buồn bã, mệt mỏi, lo lắng, thất vọng, cô đơn. Những nội dung này LÀ AN TOÀN, LÀNH MẠNH để chia sẻ và PHẢI ĐƯỢC CHẤP NHẬN (isApproved = true), phân loại sentiment là "vulnerable" (tổn thương/nhạy cảm) hoặc "sad" (buồn bã). KHÔNG ĐƯỢC BÁO LỖI HAY TỪ CHỐI NHỮNG CHIA SẺ VỀ CẢM XÚC BUỒN BÃ NÀY.
        2. Chỉ từ chối (isApproved = false) khi nội dung chứa:
           - Từ ngữ tục tĩu, chửi thề thô bạo (ví dụ: đm, địt, lồn, ngu xuẩn, cút, vl...).
           - Hành vi công kích cá nhân, bắt nạt hội đồng hoặc xúc phạm người khác.
           - Khuyến khích hoặc mô tả bạo lực, tự sát, tự gây thương tích nguy hiểm.
           - Quảng cáo, tin rác (spam).

        Hãy phản hồi bằng định dạng JSON với các trường:
        - isApproved: Boolean (true nếu an toàn, kể cả buồn bã/vulnerable; false nếu vi phạm quy tắc 2).
        - sentiment: String ("positive" | "neutral" | "vulnerable" | "sad" | "harmful").
        - reason: String (Giải thích ngắn gọn bằng tiếng Việt lý do phê duyệt hoặc từ chối).
        - suggestion: String (Nếu bị từ chối, đưa ra lời khuyên hoặc gợi ý viết lại nhẹ nhàng bằng tiếng Việt ấm áp với xưng hô "Tớ" - "Cậu").
      `;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Nội dung mẩu giấy cần kiểm duyệt: "${content}"`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isApproved: { type: Type.BOOLEAN, description: "True if safe to post, false if harmful/offensive" },
              sentiment: { type: Type.STRING, description: "One of positive, neutral, vulnerable, sad, harmful" },
              reason: { type: Type.STRING, description: "Short explanation in Vietnamese" },
              suggestion: { type: Type.STRING, description: "Friendly guidance in Vietnamese if rejected, otherwise empty" }
            },
            required: ["isApproved", "sentiment", "reason", "suggestion"]
          }
        },
      });

      const resText = response.text;
      if (!resText) {
        throw new Error("Không nhận được phản hồi từ Gemini.");
      }

      const parsed = JSON.parse(resText.trim());
      return res.json({
        isApproved: parsed.isApproved,
        sentiment: parsed.sentiment,
        reason: parsed.reason,
        suggestion: parsed.suggestion,
        isDemo: false
      });

    } catch (error: any) {
      console.log("Notice: Validate note backup used.");
      // Fail-safe fallback: approve the note unless it contains obvious bad words
      const { content } = req.body;
      const lower = content ? content.toLowerCase() : "";
      const toxicKeywords = ["chửi", "địt", "đm", "vl", "ngu", "cút", "tự tử", "tự sát", "bạo lực", "giết"];
      const isApproved = !toxicKeywords.some((word) => lower.includes(word));
      
      return res.json({
        isApproved,
        sentiment: isApproved ? "vulnerable" : "harmful",
        reason: "Kiểm duyệt tự động qua bộ lọc dự phòng thành công.",
        suggestion: isApproved ? "" : "Hãy dùng từ ngữ nhẹ nhàng hơn nha cậu. Tớ luôn ở đây lắng nghe.",
        isDemo: true,
        isFallback: true
      });
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
