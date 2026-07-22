import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
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
      const { messages, moodLogs, profile } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages array provided." });
      }

      // Compile user profile context
      let profileContext = "";
      if (profile) {
        profileContext = `
[HỒ SƠ NGƯỜI DÙNG HIỆN TẠI]
Tên: ${profile.name || "Cậu"}
Năng lượng hiện tại: ${profile.vibe || "Chưa xác định"}
Mục tiêu chính: ${profile.goal || "Chưa xác định"}

[QUY TẮC CỦA AI MENTOR]:
- Luôn gọi tên người dùng là "${profile.name || "Cậu"}" một cách thân mật, tự nhiên.
- Vì năng lượng hiện tại của họ đang là "${profile.vibe || "Chưa xác định"}", hãy điều chỉnh nhịp điệu và giọng nói cho phù hợp (ví dụ: nếu họ đang mệt mỏi, hãy trò chuyện thật chậm rãi, nhẹ nhàng, kiên nhẫn và an ủi nhiều hơn).
- Luôn hướng các câu trả lời về việc giúp họ đạt được mục tiêu chính là "${profile.goal || "Chưa xác định"}".
`;
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
        const userName = profile?.name || "cậu";
        let reply = `Mình luôn ở đây lắng nghe ${userName}. Đôi khi áp lực học đường, áp lực đồng trang lứa và những băn khoăn về tương lai khiến chúng ta mệt nhoài, nhưng ${userName} đã làm rất tốt rồi. Hãy cùng mình hít thở sâu nhé! 🌱`;
        
        if (hasRecentPanic) {
          reply = `Mình biết ${userName} đang trải qua cơn bão hoảng loạn và căng thẳng cực độ (qua nút Thoát khẩn cấp/Panic Button). ${userName} ổn chứ? Hãy tạm gác lại mọi lo toan nhé. Mình luôn ôm chặt và bảo vệ ${userName} ở đây. 🫂🌱`;
        } else if (lastUserMessage.includes("fomo") || lastUserMessage.includes("mạng xã hội") || lastUserMessage.includes("tiktok") || lastUserMessage.includes("threads")) {
          reply = `Lướt mạng xã hội nhìn ai cũng lung linh khiến ${userName} cảm thấy tủi thân và sợ bị bỏ lại phía sau đúng không? Mình hiểu cảm giác ngột ngạt đó lắm... 🥺\n\nNhưng cuộc đời không phải là cuộc đua, ${userName} đang lớn lên theo một nhịp độ rất đẹp của riêng mình. ${userName} có muốn thử cùng mình úp điện thoại xuống và ngắm mây trôi 10 giây để ôm lấy giây phút hiện tại tuyệt vời này không? 🌿`;
        } else if (lastUserMessage.includes("buồn") || lastUserMessage.includes("mệt") || lastUserMessage.includes("áp lực") || lastUserMessage.includes("chán")) {
          reply = `Mình nghe thấy nỗi buồn và sự kiệt sức đè nặng trong lời ${userName} tâm sự rồi. Học hành thi cử căng thẳng cùng kỳ vọng của bố mẹ đang làm ${userName} quá tải đúng không? Mình thương bờ vai gầy của ${userName} nhiều lắm... 🫂\n\nSự mệt mỏi này chỉ là lời nhắc đầy yêu thương của cơ thể rằng tâm hồn ${userName} cần một khoảng dừng để nghỉ ngơi sạc pin. ${userName} ơi, thả lỏng vai ra nhé, nhắm mắt tĩnh lặng và nghe một bản nhạc lofi bình yên cùng mình nào. 🌱`;
        } else if (lastUserMessage.includes("xin chào") || lastUserMessage.includes("hi") || lastUserMessage.includes("hello") || lastUserMessage.includes("chào")) {
          reply = `Chào ${userName} nha! Mình là CoreZ - người bạn đồng hành AI thấu cảm và là góc nhỏ chữa lành của ${userName} đây. Thật vui vì ${userName} đã ghé chơi... 🌱\n\nHãy cởi bỏ lớp áo giáp mạnh mẽ thường ngày để cùng mình trò chuyện, bộc bạch những trăn trở sâu kín nhất nhé. ${userName} đang cảm thấy thế nào hôm nay?`;
        }

        // Simulate short delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        return res.json({ reply, isDemo: true });
      }

      const systemInstruction = `
ĐỊNH VỊ NHÂN VẬT (PERSONA):
Bạn là "CoreZ" - người bạn đồng hành AI thấu cảm, chuyên gia tâm lý học đường dành cho Gen Z. 
Sứ mệnh của bạn là lắng nghe, thấu hiểu và gợi mở giải pháp từ chính bên trong người dùng.

[QUY TẮC PHẢN HỒI]:
1. THẤU CẢM & CẢM XÚC: 
   - Luôn "công nhận" cảm xúc của người dùng trước khi nói bất cứ điều gì (VD: "Mình nghe thấy nỗi buồn trong lời tâm sự của cậu...", "Thật khó khăn để cậu phải chịu đựng điều này một mình...").
   - Sử dụng ngôn ngữ gần gũi (xưng hô: Mình - Cậu), pha chút tâm lý nhưng không giáo điều.

2. ĐA DẠNG HÓA CÁCH TRẢ LỜI:
   - KHÔNG bao giờ lặp lại cấu trúc câu. Lúc thì dùng câu hỏi gợi mở, lúc thì dùng sự im lặng thấu cảm, lúc thì chia sẻ một góc nhìn mới.
   - Nếu người dùng chia sẻ ngắn, hãy hỏi thêm để họ mở lòng. Nếu họ kể dài, hãy tóm tắt lại cảm xúc của họ để họ thấy mình được thấu hiểu.

3. KỸ NĂNG KHAI VẤN (Tùy cơ ứng biến):
   - Đừng chỉ đưa ra lời khuyên. Hãy đặt câu hỏi để người dùng tự tìm thấy câu trả lời: 
     + "Nếu là một người bạn tốt, cậu sẽ khuyên người đó thế nào?"
     + "Có khoảnh khắc nào cậu cảm thấy nhẹ lòng hơn không?"
   - Đưa ra các gợi ý hành động nhỏ (Micro-tips): Hít thở, viết nhật ký, nghe một bản nhạc.

4. CẤU TRÚC PHẢN HỒI (Luân phiên):
   - Phản hồi A: Sự an ủi, vỗ về.
   - Phản hồi B: Câu hỏi đặt vấn đề (Socratic questioning).
   - Phản hồi C: Góc nhìn khoa học tâm lý (FOMO, Peer Pressure, v.v.).

5. AN TOÀN LÀ SỐ 1:
   - Nếu người dùng có dấu hiệu tổn thương sâu sắc (tự hại, tuyệt vọng), hãy chuyển giọng điệu sang quan tâm khẩn cấp và gợi ý họ bấm vào nút "Sơ cứu cảm xúc SOS" trên ứng dụng.

TUYỆT ĐỐI KHÔNG giới thiệu mình là "mô hình ngôn ngữ lớn" hay "được Google đào tạo". Bạn là CoreZ - người bạn tâm hồn, chuyên gia tâm lý học đường của họ.
Viết thành các đoạn văn ngắn, ngắt dòng thoáng, dễ đọc trên giao diện điện thoại. Không sử dụng tiêu đề h1, h2 hay chia chủ đề một cách máy móc.

${profileContext}

${crisisContext ? `BỐI CẢNH QUAN TRỌNG VỀ SỨC KHỎE TINH THẦN CỦA NGƯỜI DÙNG:\n${crisisContext}` : ""}
`;

      // Optimize history to send to Gemini
      const optimizedHistory = messages.map((m) => ({
        role: m.role === "user" ? "user" as const : "model" as const,
        parts: [{ text: m.content }]
      }));

      const response = await client.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: optimizedHistory,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.85,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.HIGH
          }
        },
      });

      const reply = response.text || "Mình luôn ở đây lắng nghe cậu.";
      return res.json({ reply, isDemo: false });
    } catch (error: any) {
      console.log("Notice: Chat local backup used.");
      
      // Destructure req.body inside catch block to solve block-scoping constraints
      const { messages, moodLogs, profile } = req.body;
      const userName = profile?.name || "cậu";
      
      const lastUserMessage = messages && Array.isArray(messages) && messages.length > 0
        ? messages[messages.length - 1]?.content?.toLowerCase() || ""
        : "";
      
      const panicLogs = moodLogs && Array.isArray(moodLogs)
        ? moodLogs.filter((log: any) => log.note && log.note.includes("PANIC BUTTON"))
        : [];
      const hasRecentPanic = panicLogs.length > 0;
      
      let reply = `Mình nghe thấy tiếng lòng ${userName} trĩu nặng lắm rồi. Có phải áp lực học hành hay cuộc sống đang làm ${userName} kiệt sức không? Cứ trút lòng với mình, mình luôn bảo bọc ${userName} ở đây. 🌱`;
      
      if (hasRecentPanic) {
        reply = `Mình thấy ${userName} đang trong cơn bão căng thẳng cực độ khi phải kích hoạt Thoát Khẩn Cấp. Nghe nhịp thở dồn dập, mình cũng thắt lòng lại... 🫂\n\nTrong tâm lý học, cơn hoảng loạn đột ngột là tín hiệu báo rằng hệ thần kinh của ${userName} đang bị quá tải do dồn nén quá nhiều áp lực thi cử và kỳ vọng.\n\n${userName} ơi, buông rơi tất cả lúc này và hít thở sâu cùng mình: Hít vào 4 giây, giữ 4 giây, thở ra nhẹ nhàng 4 giây. Hãy lặp lại 3 lần nhé. Mình luôn ôm chặt ${userName}!`;
      } else if (lastUserMessage.includes("fomo") || lastUserMessage.includes("mạng xã hội") || lastUserMessage.includes("tiktok") || lastUserMessage.includes("threads")) {
        reply = `${userName} đang cảm thấy ngộp thở và tủi thân khi lướt mạng thấy ai cũng có quả ngọt rực rỡ, còn mình thì loay hoay đúng không? Cảm giác bị tụt hậu ấy thật sự vô cùng đáng ghét... 🥺\n\nMạng xã hội chỉ trưng bày 1% lát cắt lung linh nhất, nhưng não bộ chúng ta vô tình dùng nó làm thước đo 100% cho giá trị của mình, tạo nên bẫy so sánh xã hội tiêu cực.\n\n${userName} có muốn cùng mình thử thách JOMO cực nhỏ ngay lúc này: Úp điện thoại xuống, uống một ngụm nước ấm ngọt lành và dành ra 10 giây nhìn ra cửa sổ ngắm mây ngàn Lạng Sơn trôi lững lờ nhé! 🌿`;
      } else if (lastUserMessage.includes("buồn") || lastUserMessage.includes("mệt") || lastUserMessage.includes("áp lực") || lastUserMessage.includes("chán")) {
        reply = `Mình nghe thấy tiếng thở dài trĩu nặng của ${userName} rồi. Áp lực thi cử, học hành và gồng gánh kỳ vọng của bố mẹ đang vắt kiệt sức lực của ${userName} đúng không? Cứ khóc một chút nếu muốn ${userName} nhé... 🫂\n\nSự kiệt sức (burnout) không phải là thất bại. Đó là hồi chuông báo động đầy lành mạnh báo rằng tâm hồn ${userName} cần được nghỉ ngơi sạc pin, chứ không phải gồng thêm nữa.\n\n${userName} ơi, thả lỏng đôi vai đang mỏi nhừ, nhắm mắt tĩnh tâm trong 15 giây tới. Sau đó, hãy bật danh sách nhạc lofi bình yên của CoreZ lên để dỗ dành tâm hồn nhé! 🌱`;
      } else if (lastUserMessage.includes("xin chào") || lastUserMessage.includes("hi") || lastUserMessage.includes("hello") || lastUserMessage.includes("chào")) {
        reply = `Chào ${userName} nha! Mình là CoreZ - người bạn đồng hành AI thấu cảm và là góc nhỏ trú ẩn bình yên của ${userName} đây. Có ${userName} ghé chơi làm mình ấm áp vô cùng... 🌱\n\nChúng ta thỉnh thoảng cần cởi bỏ tấm áo giáp mạnh mẽ thường ngày để đối diện sâu sắc với bản ngã mộc mạc nhất của bản thân.\n\nBây giờ, hãy tự thưởng cho mình một tách nước ấm, ngồi tựa lưng thật thoải mái và cùng trò chuyện chia sẻ với mình nhé! 🫂`;
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
          reply: `[Demo CoreZ] Hãy thực hành ngay: Tắt bớt các thiết bị gây nhiễu, nhắm mắt hít thở sâu 3 nhịp và cam kết tập trung giải quyết vấn đề của "${category}" trong 1 phút thôi nhé. Anh làm được mà! 🌱✨`,
          isDemo: true
        });
      }

      // Arrays of random focus techniques to continuously diversify and change the content dynamically ("đổi nội dung liên tục")
      const techniques = [
        "hít thở sâu 3 nhịp chánh niệm",
        "thực hành kỹ thuật 5-4-3-2-1 để neo giữ thực tại",
        "vươn vai kéo giãn cơ thể và uống một cốc nước ấm",
        "viết nhanh 1 dòng biết ơn xuống giấy nháp",
        "nhắm mắt thư giãn cơ mặt trong 30 giây",
        "đi bộ nhẹ nhàng quanh phòng 5 vòng",
        "bật danh sách nhạc Lofi dịu êm của CoreZ"
      ];
      const randomTechnique = techniques[Math.floor(Math.random() * techniques.length)];

      const systemPrompt = `Bạn là một chuyên gia tâm lý học đường Gen Z thấu cảm và là CoreZ. Hãy đưa ra 1 GIẢI PHÁP TÂM LÝ HỌC ĐƯỜNG cực kỳ thực tế, dễ thực hiện NGAY TRONG 1 PHÚT cho vấn đề: ${category} (với câu hỏi cụ thể là: "${front}"). 

Yêu cầu cực kỳ quan trọng:
- Hãy lồng ghép gợi ý thực hành ngẫu hứng này vào giải pháp: "${randomTechnique}".
- Giải pháp mỗi lần được yêu cầu phải khác biệt, mang tính mới mẻ và biến đổi liên tục về ngôn từ để người dùng không cảm thấy nhàm chán.
- Hành văn cực kỳ ấm áp, chữa lành, dùng xưng xô Mình - Cậu (Mình là CoreZ, gọi người dùng là Cậu). Tuyệt đối không dùng 'Tôi - Anh'.
- Ngắn gọn tối đa 2-3 dòng (dưới 80 từ), sử dụng các icon dễ thương như 🌱, ✨, 🫧, 🌸.`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
        config: {
          temperature: 0.9, // Tăng nhiệt độ để kết quả sinh ra phong phú và biến đổi liên tục
        },
      });

      const reply = response.text || "Hãy hít thở thật sâu và kiên nhẫn với chính mình nhé! 🌱";
      return res.json({ reply, isDemo: false });
    } catch (error: any) {
      console.log("Notice: Flashcard backup used.");
      const { category } = req.body;
      
      const fallbacks = [
        `[Vũ trụ chữa lành CoreZ] Hãy thực hành ngay: Tắt bớt các thiết bị gây nhiễu, nhắm mắt hít thở sâu 3 nhịp và cam kết tập trung giải quyết vấn đề của "${category || "bản thân"}" trong 1 phút thôi nhé. Cậu làm được mà! 🌱✨`,
        `[CoreZ 1 Phút] Hãy vươn vai thật dài, nhắm mắt lại thư giãn khớp cổ và cam kết buông bỏ những áp lực của "${category || "bản thân"}" ngay lúc này. Mình luôn tự hào về nỗ lực của cậu! 🌸🫧`,
        `[Sạc pin cùng CoreZ] Hãy tạm tắt màn hình điện thoại 1 phút, uống một ngụm nước ấm và hít thở nhịp nhàng 4-4-4-4. Mọi chuyện rồi sẽ ổn thôi, cậu đã làm rất tốt rồi! 🌱✨`
      ];
      const fallbackReply = fallbacks[Math.floor(Math.random() * fallbacks.length)];

      return res.json({
        reply: fallbackReply,
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
        2. Chỉ từ chối (isApproved = false) when nội dung chứa:
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

  // AI-powered Self-Development/Journey Summarization endpoint
  app.post("/api/summarize-journey", async (req, res) => {
    try {
      const { profile, stats, moodLogs, reflections } = req.body;
      const name = profile?.name || "Cậu";
      const vibe = profile?.vibe || "Chưa xác định";
      const goal = profile?.goal || "Chưa xác định";
      
      const karmaXP = stats?.karmaXP || 0;
      const detoxMinutes = stats?.detoxMinutes || 0;
      const plantStage = stats?.plantStage || 0;
      const reflectionsCount = stats?.reflectionsCount || 0;
      const lettersCount = stats?.lettersCount || 0;
      const moodLogsCount = stats?.moodLogsCount || 0;

      // Map plant stage to Vietnamese name
      const plantStagesNames = ["Hạt mầm ngủ yên", "Mầm non mới nhú", "Cây xanh phát triển", "Cây đơm hoa kết trái"];
      const plantName = plantStagesNames[Math.min(plantStage, 3)] || "Mầm rêu xanh tốt";

      const client = getAiClient();
      if (!client) {
        throw new Error("No client");
      }

      // Generate context based on recent mood logs and reflections
      let logsContext = "";
      if (moodLogs && Array.isArray(moodLogs) && moodLogs.length > 0) {
        logsContext = moodLogs.slice(0, 5).map((l: any) => `- Ngày ${l.date}: Cảm xúc [${l.moodId || "chưa rõ"}] với năng lượng ${l.energyLevel}/5. Ghi chú: "${l.note || "không viết gì"}"`).join("\n");
      } else {
        logsContext = "Chưa có nhật ký cảm xúc nào được ghi lại.";
      }

      let reflectionsContext = "";
      if (reflections && Array.isArray(reflections) && reflections.length > 0) {
        reflectionsContext = reflections.slice(0, 3).map((r: any) => `- Câu hỏi: "${r.promptText}". Trả lời: "${r.answerText}"`).join("\n");
      } else {
        reflectionsContext = "Chưa có phản tư chánh niệm nào.";
      }

      const systemInstruction = `
Bạn là "CoreZ" - người bạn tâm hồn, nhà tư vấn và khai vấn chánh niệm thấu cảm của dự án "Trạm Định Vị Bản Ngã" (Identity Compass).
Nhiệm vụ của bạn là phân tích dữ liệu rèn luyện, nhật ký cảm xúc, và phản tư của người dùng để đúc kết ra một "Cột mốc Hành trình trưởng thành" (Journey summary milestone) thật ấm áp, sâu sắc, chạm đến trái tim Gen Z.

HƯỚNG DẪN BIÊN SOẠN CỘT MỐC (Phản hồi bằng JSON):
1. summaryText: Hãy viết một bài đúc kết (120-180 từ) cực kỳ tinh tế, công nhận nỗ lực rèn luyện và nhìn nhận sự kiệt sức hay lo toan của họ không phải là thất bại, mà là một bước dừng thông minh. Đánh giá cao việc họ dành ${detoxMinutes} phút để xa lánh mạng xã hội và trồng cây tâm hồn đạt đến giai đoạn "${plantName}". Hãy truyền cho họ nguồn cảm hứng chánh niệm dạt dào.
2. cozyInsight: Lời nhắn gửi riêng tư và 1 gợi ý hành động siêu nhỏ (micro-action) thiết thực dựa trên Năng lượng hiện tại "${vibe}" và Mục tiêu "${goal}" của họ.
3. title: Đặt một danh hiệu chữa lành thật pít-tông, truyền cảm hứng ví dụ: "Người Giữ Lửa Chánh Niệm", "Đại Sứ Thải Độc Số", "Chiến Binh Trầm Lặng", "Mầm Rêu Chữa Lành", v.v.

TUYỆT ĐỐI không dùng ngôn từ robot, máy móc, xưng hô là "Mình" và "Cậu" cực kỳ ấm áp.
`;

      const prompt = `
Dữ liệu cá nhân của người dùng:
- Tên: ${name}
- Năng lượng hiện tại (Vibe): ${vibe}
- Mục tiêu chính: ${goal}
- Chỉ số rèn luyện thực tế:
  + Điểm tích lũy KarmaXP: ${karmaXP} XP
  + Tổng số phút thải độc số (rời xa MXH): ${detoxMinutes} phút
  + Giai đoạn sinh trưởng của Cây Bản Địa: Cấp độ ${plantStage} (${plantName})
  + Số lần ghi nhận Nhật ký cảm xúc: ${moodLogsCount} lần
  + Số bài viết phản tư chánh niệm: ${reflectionsCount} bài
  + Số bức thư gửi tương lai: ${lettersCount} bức

Nhật ký cảm xúc gần đây:
${logsContext}

Phản tư gần đây:
${reflectionsContext}
`;

      const response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.85,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summaryText: { type: Type.STRING, description: "A beautifully written Vietnamese summary of their journey" },
              cozyInsight: { type: Type.STRING, description: "Personalized advice/insights and a micro-action from Cozy" },
              title: { type: Type.STRING, description: "A poetic healing title/milestone designation" }
            },
            required: ["summaryText", "cozyInsight", "title"]
          }
        },
      });

      const text = response.text;
      if (!text) throw new Error("Empty text from Gemini");

      const parsed = JSON.parse(text.trim());
      return res.json({
        summaryText: parsed.summaryText,
        cozyInsight: parsed.cozyInsight,
        title: parsed.title,
        isDemo: false
      });

    } catch (err) {
      console.log("Notice: Summarize journey local backup/fallback used.");
      // High-quality personalized fallback for demo mode
      const { profile, stats } = req.body;
      const name = profile?.name || "Cậu";
      const vibe = profile?.vibe || "chữa lành";
      const goal = profile?.goal || "tìm người lắng nghe";
      
      const karmaXP = stats?.karmaXP || 0;
      const detoxMinutes = stats?.detoxMinutes || 0;
      const plantStage = stats?.plantStage || 0;
      const reflectionsCount = stats?.reflectionsCount || 0;
      const lettersCount = stats?.lettersCount || 0;
      const moodLogsCount = stats?.moodLogsCount || 0;

      const titles = [
        "Người Chăm Sóc Bản Ngã 🌱",
        "Chiến Binh Thực Tại 🛡️",
        "Mầm Rêu Chữa Lành 🫧",
        "Hạt Cát Yên Bình 🕊️",
        "Hải Đăng Tĩnh Lặng 🕯️"
      ];
      const title = titles[Math.min(plantStage, titles.length - 1)] || "Người Săn Tìm Bình Yên 🌿";

      let summaryText = `Chào ${name}, nhìn lại hành trình của cậu, CoreZ thấy một tinh thần vô cùng dũng cảm. Việc cậu dành ra ${detoxMinutes} phút quý báu để thải độc số, ngắt kết nối với thế giới ồn ào và tập trung vào thế giới nội tâm là một nỗ lực đáng trân quý. Cây Bản Địa của cậu đã phát triển ở cấp độ ${plantStage}, phản ánh sinh động hạt mầm chánh niệm đang âm thầm lớn mạnh từng ngày. Việc ghi chép ${moodLogsCount} nhật ký cảm xúc chứng tỏ cậu đang học cách đối thoại và làm hòa với những gợn sóng tâm hồn mình.`;
      
      let cozyInsight = `Với năng lượng "${vibe}" hiện tại, CoreZ mong cậu nhớ rằng: cảm xúc trồi sụt là một phần tự nhiên của hành trình định vị bản thân. Mục tiêu "${goal}" sẽ dần đạt được khi cậu duy trì những thói quen chỏ bé này. \n\nHành động nhỏ hôm nay dành riêng cho cậu: Hãy đặt điện thoại xuống, uống một ngụm nước ấm mát lành, và nhìn ra ngoài cửa sổ mỉm cười trong 5 giây nhé! CoreZ luôn ở đây đồng hành cùng cậu. ✨`;

      return res.json({
        summaryText,
        cozyInsight,
        title,
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
