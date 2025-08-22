import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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
  MessageCircle,
  ArrowLeft,
  Send,
  Bot,
  User,
  Phone,
  Settings,
  BarChart3,
  RefreshCw,
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

export default function TestChat() {
  const { chatbotId } = useParams();
  const [chatbot, setChatbot] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [askingForInfo, setAskingForInfo] = useState("none");
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    // Load chatbot data
    const savedChatbots = JSON.parse(localStorage.getItem("chatbots") || "[]");
    const foundChatbot = savedChatbots.find(
      (bot: any) => bot.id.toString() === chatbotId,
    );

    if (foundChatbot) {
      setChatbot(foundChatbot);
      // Initialize chat with welcome message
      setChatMessages([
        {
          role: "assistant",
          content:
            foundChatbot.welcomeMessage ||
            "Xin chào! Tôi có thể giúp gì cho bạn?",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      // Start collecting info if enabled
      if (
        foundChatbot.collectUserInfo &&
        foundChatbot.autoQuestions?.length > 0
      ) {
        setAskingForInfo("collecting");
      }
    }
  }, [chatbotId]);

  const callChatbotAPI = async (userMessage: string) => {
    try {
      // Handle user info collection
      if (askingForInfo === "collecting" && chatbot.autoQuestions) {
        if (questionIndex === 0 && !userInfo.name) {
          setUserInfo((prev) => ({ ...prev, name: userMessage }));
          setQuestionIndex(1);
          if (chatbot.autoQuestions.length > 1) {
            return chatbot.autoQuestions[1];
          } else {
            setAskingForInfo("done");
            return `Cảm ơn bạn ${userMessage}! Bây giờ tôi có thể giúp bạn với các câu hỏi về sản phẩm và dịch vụ.`;
          }
        }

        if (questionIndex === 1 && !userInfo.phone) {
          setUserInfo((prev) => ({ ...prev, phone: userMessage }));
          setAskingForInfo("done");
          return `Tuyệt vời! Tôi đã lưu thông tin của bạn. Bây giờ bạn có thể hỏi tôi bất cứ điều gì!`;
        }
      }

      // Regular chat response
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          context: chatbot.textData,
          chatbotId: chatbot.id,
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
      console.error("Chatbot API error:", error);

      // Fallback response based on chatbot data
      const responses = [
        "Cảm ơn bạn đã liên hệ! Dựa trên thông tin của chúng tôi, tôi có thể giúp bạn tìm hiểu thêm.",
        "Tôi sẽ cố gắng trả lời dựa trên dữ liệu được cung cấp.",
        "Vui lòng cho tôi biết thêm chi tiết để tôi có thể hỗ trợ tốt hơn.",
      ];

      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !chatbot) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    // Check if we need to ask for info first
    if (
      askingForInfo === "collecting" &&
      chatbot.autoQuestions &&
      questionIndex < chatbot.autoQuestions.length &&
      !userInfo.name
    ) {
      const nextQuestion = chatbot.autoQuestions[0];
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: nextQuestion,
        timestamp: new Date().toLocaleTimeString(),
      };
      setChatMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      return;
    }

    const aiResponse = await callChatbotAPI(message);

    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);

    // Update chatbot conversation count
    if (chatbot) {
      const savedChatbots = JSON.parse(
        localStorage.getItem("chatbots") || "[]",
      );
      const updatedChatbots = savedChatbots.map((bot: any) =>
        bot.id === chatbot.id
          ? { ...bot, conversations: (bot.conversations || 0) + 1 }
          : bot,
      );
      localStorage.setItem("chatbots", JSON.stringify(updatedChatbots));
    }
  };

  const handleReset = () => {
    setChatMessages([
      {
        role: "assistant",
        content:
          chatbot.welcomeMessage || "Xin chào! Tôi có thể giúp gì cho bạn?",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setUserInfo({});
    setAskingForInfo(chatbot.collectUserInfo ? "collecting" : "none");
    setQuestionIndex(0);
  };

  if (!chatbot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-neo-blue-950/20 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">Đang tải chatbot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-neo-blue-950/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Về Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 neo-glow">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Test Chatbot
                </h1>
                <p className="text-xs text-muted-foreground">{chatbot.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Link to={`/settings/${chatbot.id}`}>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Cài đặt
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-neo-blue-500" />
                    {chatbot.name}
                  </CardTitle>
                  <CardDescription>{chatbot.description}</CardDescription>
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
                        placeholder="Nhập tin nhắn test..."
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
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Thông tin chatbot</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Trạng thái:
                      </span>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        Hoạt động
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Thu thập thông tin:
                      </span>
                      <Badge
                        variant={
                          chatbot.collectUserInfo ? "default" : "secondary"
                        }
                      >
                        {chatbot.collectUserInfo ? "Có" : "Không"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        AI Engine:
                      </span>
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        Google Gemini
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Info Collected */}
              {(userInfo.name || userInfo.phone) && (
                <Card className="neo-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-neo-blue-500" />
                      Thông tin đã thu thập
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {userInfo.name && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>Tên: {userInfo.name}</span>
                        </div>
                      )}
                      {userInfo.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>SĐT: {userInfo.phone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Thống kê test</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Tin nhắn gửi:
                      </span>
                      <span className="font-medium">
                        {chatMessages.filter((m) => m.role === "user").length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Phản hồi AI:
                      </span>
                      <span className="font-medium">
                        {
                          chatMessages.filter((m) => m.role === "assistant")
                            .length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Thời gian test:
                      </span>
                      <span className="font-medium">
                        {Math.floor((Date.now() - Date.now()) / 60000)} phút
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Hành động</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link to={`/embed/${chatbot.id}`}>
                      <Button variant="outline" className="w-full">
                        <Bot className="w-4 h-4 mr-2" />
                        Tạo mã embed
                      </Button>
                    </Link>
                    <Link to={`/settings/${chatbot.id}`}>
                      <Button variant="outline" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Cài đặt chatbot
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Xem báo cáo
                    </Button>
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
