import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  ArrowLeft,
  Upload,
  Globe,
  FileText,
  Sparkles,
  MessageCircle,
  Settings,
  Eye,
  Save,
  Zap,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function CreateChatbot() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [testMessage, setTestMessage] = useState("");

  const [chatbotData, setChatbotData] = useState({
    name: "",
    description: "",
    dataSource: "text", // text, file, website
    textData: "",
    websiteUrl: "",
    instructions:
      "Bạn là một trợ lý AI thông minh. Trả lời các câu hỏi dựa trên thông tin được cung cấp một cách chính xác và hữu ích.",
    welcomeMessage: "Xin chào! Tôi có thể giúp gì cho bạn?",
    collectUserInfo: true,
    autoQuestions: ["Tên của bạn là gì?", "Số điện thoại của bạn là gì?"],
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const progress = (currentStep / 4) * 100;

  const handleInputChange = (field: string, value: string) => {
    setChatbotData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const callGeminiAPI = async (message: string) => {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": "AIzaSyBraFkIuRvhXFCjt6iykWGT6NmlS_CC2jg",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${chatbotData.instructions}\n\nDữ liệu tham khảo:\n${chatbotData.textData}\n\nCâu hỏi: ${message}`,
                  },
                ],
              },
            ],
          }),
        },
      );

      const data = await response.json();
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Xin lỗi, tôi không thể trả lời câu hỏi này."
      );
    } catch (error) {
      console.error("Gemini API error:", error);
      return "Có lỗi xảy ra khi kết nối với AI. Vui lòng thử lại.";
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: testMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setTestMessage("");
    setIsLoading(true);

    const aiResponse = await callGeminiAPI(testMessage);

    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toLocaleTimeString(),
    };

    setChatMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSaveChatbot = () => {
    // Save chatbot to localStorage (in real app, this would be saved to backend)
    const existingChatbots = JSON.parse(
      localStorage.getItem("chatbots") || "[]",
    );
    const newChatbot = {
      ...chatbotData,
      id: Date.now(),
      userId: user.email,
      createdAt: new Date().toISOString(),
      status: "active",
      conversations: 0,
      embedViews: 0,
    };

    localStorage.setItem(
      "chatbots",
      JSON.stringify([...existingChatbots, newChatbot]),
    );

    // Update user's chatbot count
    const updatedUser = { ...user, chatbotsUsed: (user.chatbotsUsed || 0) + 1 };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-neo-blue-950/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Về Dashboard
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 neo-glow">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Tạo Chatbot AI
                </h1>
                <p className="text-xs text-muted-foreground">
                  Bước {currentStep}/4
                </p>
              </div>
            </div>
            <div className="w-32">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-6 h-6 text-neo-blue-500" />
                  Thông tin cơ bản
                </CardTitle>
                <CardDescription>
                  Đặt tên và mô tả cho chatbot của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Tên chatbot *</Label>
                  <Input
                    id="name"
                    placeholder="VD: Hỗ trợ khách hàng"
                    value={chatbotData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả ngắn gọn về chức năng của chatbot"
                    value={chatbotData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">Tin nhắn chào mừng</Label>
                  <Input
                    id="welcomeMessage"
                    placeholder="Tin nhắn đầu tiên mà chatbot sẽ gửi"
                    value={chatbotData.welcomeMessage}
                    onChange={(e) =>
                      handleInputChange("welcomeMessage", e.target.value)
                    }
                    className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleNextStep}
                    disabled={!chatbotData.name.trim()}
                    className="neo-button text-white"
                  >
                    Tiếp tục
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Data Source */}
          {currentStep === 2 && (
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-neo-blue-500" />
                  Nguồn dữ liệu
                </CardTitle>
                <CardDescription>
                  Cung cấp dữ liệu để chatbot học và trả lời câu hỏi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={chatbotData.dataSource}
                  onValueChange={(value) =>
                    handleInputChange("dataSource", value)
                  }
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="text"
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      Văn bản
                    </TabsTrigger>
                    <TabsTrigger
                      value="file"
                      className="flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Tải file
                    </TabsTrigger>
                    <TabsTrigger
                      value="website"
                      className="flex items-center gap-2"
                    >
                      <Globe className="w-4 h-4" />
                      Website
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="mt-6">
                    <div className="space-y-4">
                      <Label htmlFor="textData">Nhập dữ liệu văn bản</Label>
                      <Textarea
                        id="textData"
                        placeholder="Nhập thông tin, câu hỏi thường gặp, kiến thức mà bạn muốn chatbot biết..."
                        value={chatbotData.textData}
                        onChange={(e) =>
                          handleInputChange("textData", e.target.value)
                        }
                        className="bg-background/50 border-border/50 focus:border-neo-blue-500 min-h-[200px]"
                      />
                      <p className="text-sm text-muted-foreground">
                        Nhập càng nhiều thông tin càng tốt để chatbot có thể trả
                        lời chính xác
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="file" className="mt-6">
                    <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Tải lên file</p>
                      <p className="text-muted-foreground mb-4">
                        Hỗ trợ: PDF, DOC, DOCX, TXT (tối đa 10MB)
                      </p>
                      <Button variant="outline">Chọn file</Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="website" className="mt-6">
                    <div className="space-y-4">
                      <Label htmlFor="websiteUrl">URL Website</Label>
                      <Input
                        id="websiteUrl"
                        placeholder="https://example.com"
                        value={chatbotData.websiteUrl}
                        onChange={(e) =>
                          handleInputChange("websiteUrl", e.target.value)
                        }
                        className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                      />
                      <p className="text-sm text-muted-foreground">
                        Chatbot sẽ crawl và học từ nội dung website này
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between mt-6">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Quay lại
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={
                      !chatbotData.textData.trim() &&
                      !chatbotData.websiteUrl.trim()
                    }
                    className="neo-button text-white"
                  >
                    Tiếp tục
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: AI Configuration */}
          {currentStep === 3 && (
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-neo-blue-500" />
                  Cấu hình AI
                </CardTitle>
                <CardDescription>
                  Tùy chỉnh cách chatbot hoạt động và tương tác
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="instructions">Hướng dẫn cho AI</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Hướng dẫn cách AI nên trả lời và hành xử..."
                    value={chatbotData.instructions}
                    onChange={(e) =>
                      handleInputChange("instructions", e.target.value)
                    }
                    className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Thu thập thông tin người dùng</Label>
                      <p className="text-sm text-muted-foreground">
                        Chatbot sẽ tự động hỏi thông tin cá nhân
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={chatbotData.collectUserInfo}
                      onChange={(e) =>
                        handleInputChange(
                          "collectUserInfo",
                          e.target.checked.toString(),
                        )
                      }
                      className="w-4 h-4 rounded border-border"
                    />
                  </div>

                  {chatbotData.collectUserInfo && (
                    <div className="space-y-2 ml-4 border-l-2 border-neo-blue-500/30 pl-4">
                      <Label>Câu hỏi tự động</Label>
                      <div className="space-y-2">
                        {chatbotData.autoQuestions.map((question, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={question}
                              onChange={(e) => {
                                const newQuestions = [
                                  ...chatbotData.autoQuestions,
                                ];
                                newQuestions[index] = e.target.value;
                                setChatbotData((prev) => ({
                                  ...prev,
                                  autoQuestions: newQuestions,
                                }));
                              }}
                              className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handlePrevStep}>
                    Quay lại
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    className="neo-button text-white"
                  >
                    Tiếp tục
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Test & Preview */}
          {currentStep === 4 && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-neo-blue-500" />
                    Test Chatbot
                  </CardTitle>
                  <CardDescription>
                    Thử nghiệm chatbot trước khi lưu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Chat Messages */}
                    <div className="h-64 border border-border/50 rounded-lg p-4 overflow-y-auto bg-background/30">
                      {chatMessages.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                          <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p>Bắt đầu cuộc hội thoại để test chatbot</p>
                        </div>
                      )}

                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
                        >
                          <div
                            className={`inline-block max-w-[80%] p-3 rounded-lg ${
                              message.role === "user"
                                ? "bg-neo-blue-500 text-white"
                                : "bg-secondary text-foreground"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isLoading && (
                        <div className="text-left">
                          <div className="inline-block bg-secondary text-foreground p-3 rounded-lg">
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
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleTestMessage()
                        }
                        className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                      />
                      <Button
                        onClick={handleTestMessage}
                        disabled={isLoading}
                        className="neo-button text-white"
                      >
                        Gửi
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-6 h-6 text-neo-blue-500" />
                    Thông tin chatbot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-neo-blue-500/10 border border-neo-blue-500/20">
                    <h3 className="font-semibold text-neo-blue-600 mb-2">
                      {chatbotData.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {chatbotData.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Nguồn dữ liệu:
                        </span>
                        <Badge variant="outline">
                          {chatbotData.dataSource === "text"
                            ? "Văn bản"
                            : chatbotData.dataSource === "file"
                              ? "File"
                              : "Website"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Thu thập thông tin:
                        </span>
                        <Badge
                          variant={
                            chatbotData.collectUserInfo
                              ? "default"
                              : "secondary"
                          }
                        >
                          {chatbotData.collectUserInfo ? "Có" : "Không"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          AI Engine:
                        </span>
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Zap className="w-3 h-3 mr-1" />
                          Google Gemini
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevStep}>
                        Quay lại
                      </Button>
                      <Button
                        onClick={handleSaveChatbot}
                        className="neo-button text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Lưu chatbot
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
