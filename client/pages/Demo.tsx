import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Bot,
  ArrowLeft,
  Send,
  MessageCircle,
  Zap,
  Globe,
  Users,
  Phone,
  User,
  Sparkles,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface UserInfo {
  name?: string;
  phone?: string;
  email?: string;
}

export default function Demo() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Xin chào! Tôi là chatbot AI demo của Plugai. Tôi có thể giúp bạn tìm hiểu về dịch vụ chatbot AI của chúng tôi. Bạn có thể hỏi tôi về tính năng, giá cả, hoặc cách sử dụng. Trước tiên, cho tôi biết tên của bạn là gì?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [askingForInfo, setAskingForInfo] = useState("name");

  const demoData = `
Plugai là nền tảng tạo chatbot AI thông minh hàng đầu Việt Nam.

Tính năng chính:
- Tạo chatbot từ dữ liệu riêng (text, file, website)
- Tích hợp Google Gemini AI để trả lời thông minh
- Embed dễ dàng vào website
- Thu thập thông tin khách hàng tự động
- Phân tích cuộc hội thoại chi tiết
- Hỗ trợ 24/7

Gói dịch vụ:
- Miễn phí: 1 chatbot, 1000 tin nhắn/tháng
- Pro (299k/tháng): 5 chatbot, 10k tin nhắn/tháng 
- Enterprise (999k/tháng): Không giới hạn

Liên hệ: 07.927.627.94
Website: plugai.top
`;

  const callDemoAI = async (userMessage: string) => {
    try {
      // Check if we're collecting user info
      if (askingForInfo === "name" && !userInfo.name) {
        setUserInfo((prev) => ({ ...prev, name: userMessage }));
        setAskingForInfo("phone");
        return `Rất vui được làm quen với ${userMessage}! 😊

Để tôi có thể hỗ trợ bạn tốt nhất và gửi thông tin chi tiết qua tin nhắn sau này, bạn có thể chia sẻ số điện thoại không ạ?

(Thông tin của bạn sẽ được bảo mật tuyệt đối)`;
      }

      if (askingForInfo === "phone" && !userInfo.phone) {
        setUserInfo((prev) => ({ ...prev, phone: userMessage }));
        setAskingForInfo("done");
        return `Hoàn h���o! Tôi đã lưu thông tin của bạn:
👤 **${userInfo.name}**
📱 **${userMessage}**

Bây giờ tôi có thể tư vấn chi tiết về Plugai cho bạn rồi! Bạn quan tâm đến điều gì nhất:
• 💰 Bảng giá và các gói dịch vụ
• 🛠️ Cách tạo và tùy chỉnh chatbot
• 📈 Tính năng phân tích và báo cáo
• 🔧 Cách tích hợp vào website của bạn

Hoặc bạn có thể hỏi bất cứ điều gì khác!`;
      }

      // Enhanced AI responses using Gemini API
      const enhancedPrompt = `Bạn là chuyên gia tư vấn chatbot AI của Plugai.top - một nền tảng tạo chatbot thông minh hàng đầu Việt Nam.

THÔNG TIN PLUGAI:
${demoData}

KHÁCH HÀNG:
- Tên: ${userInfo.name || "Khách hàng"}
- SĐT: ${userInfo.phone || "Chưa có"}

NHIỆM VỤ: Trả lời câu hỏi "${userMessage}" một cách:
- Thân thiện, chuyên nghiệp
- Chi tiết nhưng dễ hiểu
- Sử dụng emoji phù hợp
- Đưa ra lời khuyên cụ thể
- Khuyến khích dùng thử dịch vụ

Hãy trả lời như một chuyên gia tư vấn giàu kinh nghiệm.`;

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: enhancedPrompt,
          chatbotId: "demo",
        }),
      });

      if (!response.ok) {
        throw new Error("API call failed");
      }

      const data = await response.json();
      return (
        data.response ||
        "Xin lỗi, tôi gặp vấn đề kỹ thuật. Vui lòng thử lại sau."
      );
    } catch (error) {
      console.error("Demo AI error:", error);

      // Enhanced fallback responses
      const lowerMessage = userMessage.toLowerCase();

      if (
        lowerMessage.includes("giá") ||
        lowerMessage.includes("phí") ||
        lowerMessage.includes("tiền") ||
        lowerMessage.includes("cost")
      ) {
        return `💰 **Bảng giá Plugai - Rất cạnh tranh so với thị trường:**

🆓 **Gói Miễn Phí**
• 1 chatbot hoàn toàn miễn phí
• 1,000 tin nhắn/tháng
• Tích hợp website cơ bản
• Hỗ trợ qua email

💼 **Gói Pro - 299,000đ/tháng**
• 5 chatbot chuyên nghiệp
• 10,000 tin nhắn/tháng
• Phân tích nâng cao & báo cáo
• Tùy chỉnh giao diện thương hiệu
• Hỗ trợ ưu tiên 24/7

🏢 **Gói Enterprise - 999,000đ/tháng**
• Không giới hạn chatbot
• Không giới hạn tin nhắn
• API riêng + White label
• Dedicated support team

**Bắt đầu miễn phí ngay không cần thẻ tín dụng!** 🚀`;
      }

      if (
        lowerMessage.includes("tính năng") ||
        lowerMessage.includes("chức năng") ||
        lowerMessage.includes("feature")
      ) {
        return `🛠️ **Tính năng đáng chú ý của Plugai:**

🤖 **AI Thông Minh**
• Sử dụng Google Gemini 2.0 mới nhất
• Trả lời chính xác dựa trên dữ liệu riêng
• Học hỏi từ cuộc hội thoại thực tế

📊 **Phân Tích Chuyên Sâu**
• Theo dõi hiệu suất realtime
• Báo cáo tương tác chi tiết
• Phân tích cảm xúc khách hàng

🌐 **Tích Hợp Đa Nền Tảng**
• Website, Facebook, Zalo
• WordPress, Shopify, Wix
• API RESTful cho developers

📱 **Thu Thập Lead Tự Động**
• Lưu thông tin khách hàng
• Xuất Excel, CRM integration
• Follow-up marketing tự động

Bạn quan tâm tính năng nào nhất? Tôi có thể demo chi tiết! 😊`;
      }

      if (
        lowerMessage.includes("tích hợp") ||
        lowerMessage.includes("cài đặt") ||
        lowerMessage.includes("install")
      ) {
        return `🔧 **Tích hợp Plugai vào website cực kỳ đơn giản:**

**Chỉ 3 bước trong 5 phút:**
1️⃣ Tạo chatbot từ dữ liệu của bạn
2️⃣ Copy 1 đoạn code JavaScript
3️⃣ Dán vào website → Hoàn thành!

**Hỗ trợ mọi nền tảng:**
✅ WordPress, Joomla, Drupal
✅ Shopify, WooCommerce
✅ React, Vue, Angular
✅ HTML tĩnh bất kỳ

**Không cần kỹ thuật:**
• Không cần coding
• Tự động responsive mobile
• Tải nhanh, không ảnh hưởng website
• Tùy chỉnh màu sắc, vị trí dễ dàng

Bạn muốn tôi hướng dẫn chi tiết cho loại website nào? 🤔`;
      }

      if (
        lowerMessage.includes("demo") ||
        lowerMessage.includes("test") ||
        lowerMessage.includes("thử")
      ) {
        return `🎯 **Bạn muốn trải nghiệm Plugai?**

**Các cách dùng thử:**
🔍 Bạn đang chat với chatbot demo ngay đây!
🆓 Đăng ký tài khoản miễn phí
📱 Tạo chatbot đầu tiên trong 5 phút
🌐 Test embed code trên website riêng

**Demo này cho thấy:**
• AI trả lời thông minh bằng tiếng Việt
• Thu thập thông tin khách hàng tự động
• Giao diện đẹp, responsive
• Tùy chỉnh theo thương hiệu

Ready để tạo chatbot riêng của bạn chưa?
→ Đăng ký miễn phí chỉ mất 30 giây! 🚀`;
      }

      return `Tôi hiểu bạn đang quan tâm đến "${userMessage}".

Là chuyên gia tư vấn Plugai, tôi có thể giúp bạn với:
🔹 Tư vấn giá cả và gói dịch vụ phù hợp
🔹 Hướng dẫn tính năng và cách sử dụng
🔹 Demo trực tiếp và setup chatbot
🔹 Tích hợp vào website/fanpage

Bạn muốn tìm hiểu vấn đề gì cụ th��� nhất? Hoặc để tôi tư vấn tổng quan về Plugai cho bạn? 😊`;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    const aiResponse = await callDemoAI(message);

    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-neo-blue-950/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Về trang chủ
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 neo-glow">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Demo Chatbot AI
                </h1>
                <p className="text-xs text-muted-foreground">
                  Trải nghiệm thực tế
                </p>
              </div>
            </div>
            <div className="w-32">
              <Link to="/register">
                <Button className="neo-button text-white">Tạo tài khoản</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-4 bg-neo-blue-500/10 text-neo-blue-400 border-neo-blue-500/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Demo trực tiếp
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trò chuyện với
              <span className="bg-gradient-to-r from-neo-blue-400 to-neo-blue-600 bg-clip-text text-transparent">
                {" "}
                Chatbot AI
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Thử ngay chatbot AI được tạo bởi Plugai
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-neo-blue-500" />
                    Chatbot Demo - Plugai AI
                  </CardTitle>
                  <CardDescription>
                    Bot này sử dụng Google Gemini AI và được training với dữ
                    liệu về Plugai
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Chat Messages */}
                    <div className="h-96 border border-border/50 rounded-lg p-4 overflow-y-auto bg-background/30">
                      {chatMessages.map((msg, index) => (
                        <div
                          key={index}
                          className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}
                        >
                          <div
                            className={`inline-block max-w-[85%] p-3 rounded-lg ${
                              msg.role === "user"
                                ? "bg-neo-blue-500 text-white"
                                : "bg-secondary text-foreground border border-border/50"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {msg.content}
                            </p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isLoading && (
                        <div className="text-left">
                          <div className="inline-block bg-secondary text-foreground p-3 rounded-lg border border-border/50">
                            <div className="flex items-center gap-2">
                              <div className="animate-spin w-4 h-4 border-2 border-neo-blue-500 border-t-transparent rounded-full"></div>
                              <span className="text-sm">Đang trả lời...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập tin nhắn của bạn..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                        className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                        disabled={isLoading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={isLoading || !message.trim()}
                        className="neo-button text-white px-4"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* User Info Display */}
                    {(userInfo.name || userInfo.phone) && (
                      <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                        <h3 className="font-semibold text-green-600 mb-2">
                          Thông tin đã lưu:
                        </h3>
                        <div className="text-sm text-green-600 space-y-1">
                          {userInfo.name && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>Tên: {userInfo.name}</span>
                            </div>
                          )}
                          {userInfo.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>SĐT: {userInfo.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-neo-blue-500" />
                    Tính năng Demo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span>Thu thập thông tin tự động</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neo-blue-500" />
                      <span>Trả lời bằng Google Gemini AI</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Lưu lịch sử cuộc hội thoại</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span>Tùy chỉnh giao diện</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Câu hỏi gợi ý</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      "Giá cả như thế nào?",
                      "Có những tính năng gì?",
                      "Làm sao tích hợp vào website?",
                      "Khác gì so với ChatGPT?",
                      "Có hỗ trợ tiếng Việt không?",
                    ].map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full text-left justify-start text-sm"
                        onClick={() => setMessage(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Sẵn sàng tạo chatbot?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Tạo chatbot AI như demo này chỉ trong 5 phút
                    </p>
                    <div className="space-y-2">
                      <Link to="/register">
                        <Button className="w-full neo-button text-white">
                          <Users className="w-4 h-4 mr-2" />
                          Đăng ký miễn phí
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button variant="outline" className="w-full">
                          Đăng nhập
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
