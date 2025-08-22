import { RequestHandler } from "express";

export interface GeminiRequest {
  message: string;
  context?: string;
  chatbotId?: string;
}

export interface GeminiResponse {
  response: string;
  timestamp: string;
  success: boolean;
  error?: string;
}

const GEMINI_API_KEY = "AIzaSyBraFkIuRvhXFCjt6iykWGT6NmlS_CC2jg";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export const handleGeminiChat: RequestHandler = async (req, res) => {
  try {
    const { message, context, chatbotId }: GeminiRequest = req.body;

    if (!message) {
      const errorResponse: GeminiResponse = {
        response: "Vui lòng nhập tin nhắn",
        timestamp: new Date().toISOString(),
        success: false,
        error: "Message is required",
      };
      return res.status(400).json(errorResponse);
    }

    // Get chatbot data from localStorage simulation (in real app, this would be from database)
    let chatbotData = null;
    if (chatbotId) {
      // This would normally come from database
      chatbotData = {
        instructions:
          "Bạn là một trợ lý AI thông minh. Trả lời các câu hỏi dựa trên thông tin được cung cấp một cách chính xác và hữu ích.",
        textData:
          context || "Đây là dữ liệu mẫu về sản phẩm và dịch vụ của công ty.",
      };
    }

    // Prepare prompt for Gemini
    const prompt = chatbotData
      ? `${chatbotData.instructions}\n\nDữ liệu tham khảo:\n${chatbotData.textData}\n\nCâu hỏi của người dùng: ${message}`
      : `Bạn là một trợ lý AI thông minh. Trả lời câu hỏi sau một cách hữu ích và chính xác: ${message}`;

    // Call Gemini API
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Xin lỗi, tôi không thể trả lời câu hỏi này lúc này.";

    const successResponse: GeminiResponse = {
      response: aiResponse,
      timestamp: new Date().toISOString(),
      success: true,
    };

    res.json(successResponse);
  } catch (error) {
    console.error("Gemini API error:", error);

    const errorResponse: GeminiResponse = {
      response: "Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại sau.",
      timestamp: new Date().toISOString(),
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };

    res.status(500).json(errorResponse);
  }
};

// Save conversation endpoint
export const handleSaveConversation: RequestHandler = async (req, res) => {
  try {
    const { chatbotId, userMessage, botResponse, userInfo } = req.body;

    // In a real app, this would save to database
    // For now, we'll just simulate saving
    const conversation = {
      id: Date.now().toString(),
      chatbotId,
      userMessage,
      botResponse,
      userInfo,
      timestamp: new Date().toISOString(),
    };

    console.log("Conversation saved:", conversation);

    res.json({
      success: true,
      conversationId: conversation.id,
      message: "Cuộc hội thoại đã được lưu",
    });
  } catch (error) {
    console.error("Save conversation error:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lưu cuộc hội thoại",
    });
  }
};

// Get chatbot data endpoint
export const handleGetChatbot: RequestHandler = async (req, res) => {
  try {
    const { chatbotId } = req.params;

    // In a real app, this would fetch from database
    // For now, simulate chatbot data
    const chatbot = {
      id: chatbotId,
      name: "Hỗ trợ khách hàng",
      description: "Bot trả lời câu hỏi về sản phẩm",
      instructions:
        "Bạn là một trợ lý AI thông minh của công ty. Hãy trả lời các câu hỏi một cách thân thiện và hữu ích.",
      textData:
        "Chúng tôi là công ty chuyên cung cấp giải pháp chatbot AI. Sản phẩm chính là nền tảng Plugai giúp các doanh nghiệp tạo chatbot thông minh để hỗ trợ khách hàng 24/7.",
      welcomeMessage:
        "Xin chào! Tôi là trợ lý AI của Plugai. Tôi có thể giúp gì cho bạn?",
      collectUserInfo: true,
      autoQuestions: ["Tên của bạn là gì?", "Số điện thoại của bạn là gì?"],
    };

    res.json(chatbot);
  } catch (error) {
    console.error("Get chatbot error:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy thông tin chatbot",
    });
  }
};
