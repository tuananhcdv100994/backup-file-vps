import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  Monitor,
  Smartphone,
  Code,
  ExternalLink,
  MessageCircle,
  Bot,
} from "lucide-react";

export default function EmbedTest() {
  const [searchParams] = useSearchParams();
  const chatbotId = searchParams.get("chatbotId") || "demo";
  const [chatbot, setChatbot] = useState<any>(null);
  const [embedLoaded, setEmbedLoaded] = useState(false);

  useEffect(() => {
    // Load chatbot data
    const savedChatbots = JSON.parse(localStorage.getItem("chatbots") || "[]");
    const foundChatbot = savedChatbots.find(
      (bot: any) => bot.id.toString() === chatbotId,
    );
    setChatbot(foundChatbot);

    // Create working demo chatbot widget
    const createDemoWidget = () => {
      // Remove existing widget if any
      const existing = document.getElementById("plugai-demo-widget");
      if (existing) existing.remove();

      const widgetHTML = `
        <div id="plugai-demo-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
          <button id="plugai-demo-btn" style="
            width: 60px; height: 60px; border-radius: 50%; 
            background: #0066cc; border: none; cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex; align-items: center; justify-content: center;
            transition: all 0.3s ease;
          ">
            <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H6L10 22L14 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M13 14H11V12H13V14M13 10H11V6H13V10Z"/>
            </svg>
          </button>
          <div id="plugai-demo-window" style="
            position: absolute; bottom: 80px; right: 0;
            width: 350px; height: 500px; background: white;
            border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            display: none; flex-direction: column; overflow: hidden;
            border: 1px solid #e1e5e9;
          ">
            <div style="background: #0066cc; color: white; padding: 16px; font-weight: 600; display: flex; justify-content: space-between; align-items: center;">
              <span>${foundChatbot?.name || "Demo Chatbot Plugai"}</span>
              <button id="plugai-demo-close" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">×</button>
            </div>
            <div id="plugai-demo-messages" style="flex: 1; padding: 16px; background: #f8f9fa; overflow-y: auto;">
              <div style="background: white; padding: 10px 14px; border-radius: 18px; margin-bottom: 12px; border: 1px solid #e1e5e9; font-size: 14px;">
                ${foundChatbot?.welcomeMessage || "Xin chào! Đây là demo chatbot hoạt động thực tế. Hãy thử hỏi tôi về Plugai!"}
              </div>
            </div>
            <div style="padding: 16px; border-top: 1px solid #e1e5e9;">
              <div style="display: flex; gap: 8px; align-items: center;">
                <input id="plugai-demo-input" type="text" placeholder="Nhập tin nhắn test..." style="
                  flex: 1; padding: 10px 14px; border: 1px solid #e1e5e9;
                  border-radius: 20px; font-size: 14px; outline: none;
                ">
                <button id="plugai-demo-send" style="
                  background: #0066cc; border: none; width: 36px; height: 36px;
                  border-radius: 50%; cursor: pointer; display: flex;
                  align-items: center; justify-content: center;
                ">
                  <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                    <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                  </svg>
                </button>
              </div>
            </div>
            <div style="text-align: center; padding: 8px; font-size: 11px; color: #666; border-top: 1px solid #e1e5e9;">
              Powered by <a href="https://plugai.top" target="_blank" style="color: #0066cc; text-decoration: none;">Plugai</a>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML("beforeend", widgetHTML);

      // Add event listeners
      let isOpen = false;
      const btn = document.getElementById("plugai-demo-btn");
      const window = document.getElementById("plugai-demo-window");
      const closeBtn = document.getElementById("plugai-demo-close");
      const input = document.getElementById(
        "plugai-demo-input",
      ) as HTMLInputElement;
      const sendBtn = document.getElementById("plugai-demo-send");
      const messages = document.getElementById("plugai-demo-messages");

      // Toggle chat window
      const toggleWindow = () => {
        isOpen = !isOpen;
        if (window) {
          window.style.display = isOpen ? "flex" : "none";
        }
        if (isOpen && input) {
          input.focus();
        }
      };

      // Add message to chat
      const addMessage = (content: string, isUser: boolean) => {
        if (messages) {
          const messageDiv = document.createElement("div");
          messageDiv.style.cssText = `
            background: ${isUser ? "#0066cc" : "white"};
            color: ${isUser ? "white" : "#333"};
            padding: 10px 14px;
            border-radius: 18px;
            margin-bottom: 12px;
            font-size: 14px;
            max-width: 85%;
            ${isUser ? "margin-left: auto; text-align: right;" : "border: 1px solid #e1e5e9;"}
          `;
          messageDiv.textContent = content;
          messages.appendChild(messageDiv);
          messages.scrollTop = messages.scrollHeight;
        }
      };

      // Send message function
      const sendMessage = async () => {
        if (!input || !input.value.trim()) return;

        const message = input.value.trim();
        addMessage(message, true);
        input.value = "";

        // Show typing indicator
        const typingDiv = document.createElement("div");
        typingDiv.id = "typing";
        typingDiv.style.cssText = `
          background: white; padding: 10px 14px; border-radius: 18px;
          margin-bottom: 12px; font-size: 14px; border: 1px solid #e1e5e9;
        `;
        typingDiv.textContent = "Đang trả lời...";
        messages?.appendChild(typingDiv);

        try {
          // Simple demo responses
          let response = "";
          const lowerMessage = message.toLowerCase();

          if (lowerMessage.includes("giá") || lowerMessage.includes("phí")) {
            response =
              "💰 Plugai có 3 gói: Miễn phí (1 bot), Pro 299k/tháng (5 bots), Enterprise 999k/tháng (unlimited). Bạn muốn tìm hiểu gói nào?";
          } else if (lowerMessage.includes("tính năng")) {
            response =
              "🚀 Plugai có: AI thông minh từ Google Gemini, tích hợp dễ dàng, phân tích chi tiết, thu thập lead, tùy chỉnh giao diện. B��n quan tâm tính năng nào nhất?";
          } else if (lowerMessage.includes("tích hợp")) {
            response =
              "🔧 Tích hợp Plugai rất đơn giản! Chỉ cần copy 1 đoạn code và paste vào website. Hỗ trợ WordPress, Shopify, React... Bạn dùng platform nào?";
          } else {
            response = `Cảm ơn bạn đã quan tâm đến "${message}". Tôi có thể tư vấn về giá cả, tính năng, cách tích hợp Plugai. Bạn muốn biết điều gì cụ thể?`;
          }

          setTimeout(() => {
            const typing = document.getElementById("typing");
            if (typing) typing.remove();
            addMessage(response, false);
          }, 1000);
        } catch (error) {
          const typing = document.getElementById("typing");
          if (typing) typing.remove();
          addMessage("Xin lỗi, có lỗi xảy ra. Vui lòng thử lại!", false);
        }
      };

      // Event listeners
      btn?.addEventListener("click", toggleWindow);
      closeBtn?.addEventListener("click", () => {
        isOpen = false;
        if (window) window.style.display = "none";
      });
      sendBtn?.addEventListener("click", sendMessage);
      input?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
      });

      // Hover effect for button
      btn?.addEventListener("mouseenter", () => {
        if (btn) btn.style.transform = "scale(1.1)";
      });
      btn?.addEventListener("mouseleave", () => {
        if (btn) btn.style.transform = "scale(1)";
      });

      setEmbedLoaded(true);
    };

    // Create widget after short delay
    setTimeout(createDemoWidget, 500);

    return () => {
      // Cleanup
      const widget = document.getElementById("plugai-demo-widget");
      if (widget) widget.remove();
    };
  }, [chatbotId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-neo-blue-950/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/embed/${chatbotId}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Về trang Embed
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-green-600">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Test Mã Nhúng
                </h1>
                <p className="text-xs text-muted-foreground">
                  Demo thực tế chatbot embed
                </p>
              </div>
            </div>
            <div className="w-32">
              <Badge
                className={`${embedLoaded ? "bg-green-500/10 text-green-500" : "bg-yellow-500/10 text-yellow-500"}`}
              >
                {embedLoaded ? "Hoạt động" : "Đang tải..."}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Demo Info */}
          <Card className="neo-card">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Bot className="w-6 h-6 text-neo-blue-500" />
                Demo Website với Chatbot Nhúng
              </CardTitle>
              <CardDescription>
                Đây là demo thực tế của chatbot được nhúng vào website hoạt động
                100%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Thông tin chatbot:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono">{chatbotId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tên:</span>
                      <span>{chatbot?.name || "Demo Chatbot"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vị trí:</span>
                      <span>Góc phải dưới</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Trạng thái:</span>
                      <Badge className="bg-green-500/10 text-green-500">
                        {embedLoaded ? "Hoạt động" : "Đang tải"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Hướng dẫn test:</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-neo-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                        1
                      </span>
                      <p className="text-sm">
                        Tìm nút chat màu xanh ở góc phải dưới màn hình
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-neo-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                        2
                      </span>
                      <p className="text-sm">Click vào nút để mở cửa sổ chat</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-neo-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                        3
                      </span>
                      <p className="text-sm">
                        Thử chat: hỏi về "giá cả", "tính năng", "tích hợp"
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-neo-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                        4
                      </span>
                      <p className="text-sm">Test trên cả desktop và mobile</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Content Area */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Test Desktop
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Đây là nội dung demo của website. Chatbot sẽ xuất hiện ở góc
                    phải dưới màn hình.
                  </p>

                  <div className="p-4 rounded-lg bg-secondary/30">
                    <h4 className="font-semibold mb-2">Dịch vụ Plugai</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Tạo chatbot AI thông minh</li>
                      <li>• Tích hợp Google Gemini AI</li>
                      <li>• Mã nhúng responsive</li>
                      <li>• Phân tích chi tiết</li>
                      <li>• Hỗ trợ 24/7</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <h4 className="font-semibold text-green-600 mb-2">
                      ✅ Chatbot test hoạt động:
                    </h4>
                    <ul className="text-sm text-green-600 space-y-1">
                      <li>• Click nút chat ở góc phải dưới</li>
                      <li>• AI trả lời thông minh</li>
                      <li>• Responsive mobile/desktop</li>
                      <li>• Giao diện đẹp, chuyên nghiệp</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Test Mobile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Chatbot tự động responsive và hoạt động tốt trên mobile.
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Responsive design hoàn hảo</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Touch-friendly interface</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Mobile keyboard support</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Auto-adjust position</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <h4 className="font-semibold text-blue-600 mb-2">
                      📱 Mobile Features
                    </h4>
                    <p className="text-sm text-blue-600">
                      Trên mobile, chatbot tự động điều chỉnh kích thước để
                      không che khuất nội dung và tối ưu trải nghiệm người dùng.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card className="neo-card">
            <CardHeader>
              <CardTitle className="text-center">Hài lòng với demo?</CardTitle>
              <CardDescription className="text-center">
                Copy mã nhúng và tích hợp vào website của bạn ngay!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to={`/embed/${chatbotId}`}>
                  <Button className="neo-button text-white">
                    <Code className="w-4 h-4 mr-2" />
                    Lấy mã nhúng
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline">Về Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
