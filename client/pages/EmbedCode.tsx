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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code,
  ArrowLeft,
  Copy,
  Eye,
  MessageCircle,
  Settings,
  Palette,
  Globe,
  Smartphone,
  Monitor,
  Bot,
  Send,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function EmbedCode() {
  const { chatbotId } = useParams();
  const [chatbot, setChatbot] = useState<any>(null);
  const [embedConfig, setEmbedConfig] = useState({
    position: "bottom-right",
    theme: "light",
    primaryColor: "#0066cc",
    greeting: "Xin chào! Tôi có thể giúp gì cho bạn?",
    placeholder: "Nhập tin nhắn...",
    title: "Hỗ trợ trực tuyến",
    showBranding: true,
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Xin chào! Đây là demo chatbot của bạn.",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [testMessage, setTestMessage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    // Load chatbot data
    const savedChatbots = JSON.parse(localStorage.getItem("chatbots") || "[]");
    const foundChatbot = savedChatbots.find(
      (bot: any) => bot.id.toString() === chatbotId,
    );

    if (foundChatbot) {
      setChatbot(foundChatbot);
      setEmbedConfig((prev) => ({
        ...prev,
        greeting: foundChatbot.welcomeMessage || prev.greeting,
        title: foundChatbot.name || prev.title,
      }));
    }
  }, [chatbotId]);

  const generateJavaScriptEmbed = () => {
    const baseUrl = window.location.origin;
    return `<!-- Plugai Chatbot - ${chatbot?.name || "Chatbot"} -->
<script>
  window.PlugaiChatbot = {
    chatbotId: "${chatbotId}",
    config: {
      position: "${embedConfig.position}",
      theme: "${embedConfig.theme}",
      primaryColor: "${embedConfig.primaryColor}",
      greeting: "${embedConfig.greeting}",
      placeholder: "${embedConfig.placeholder}",
      title: "${embedConfig.title}",
      showBranding: ${embedConfig.showBranding}
    }
  };
</script>
<script src="${baseUrl}/embed/chatbot.js" async></script>
<!-- End Plugai Chatbot -->`;
  };

  const generateIframeEmbed = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      chatbotId: chatbotId || "",
      position: embedConfig.position,
      theme: embedConfig.theme,
      primaryColor: embedConfig.primaryColor,
      greeting: embedConfig.greeting,
      placeholder: embedConfig.placeholder,
      title: embedConfig.title,
      showBranding: embedConfig.showBranding.toString(),
    });

    return `<!-- Plugai Chatbot Iframe - ${chatbot?.name || "Chatbot"} -->
<iframe 
  src="${baseUrl}/embed/iframe?${params.toString()}"
  style="position: fixed; ${embedConfig.position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"} ${embedConfig.position.includes("right") ? "right: 20px;" : "left: 20px;"} width: 80px; height: 80px; border: none; z-index: 999999; border-radius: 50%;"
  id="plugai-chatbot-${chatbotId}"
  allow="microphone">
</iframe>
<!-- End Plugai Chatbot -->`;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(type);
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const openTestPage = () => {
    const testUrl = `/embed-test?chatbotId=${chatbotId}`;
    window.open(testUrl, "_blank");
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
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Mã Embed Chatbot
                </h1>
                <p className="text-xs text-muted-foreground">{chatbot.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={openTestPage} variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                Test Live
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="javascript" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger
                value="javascript"
                className="flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                JavaScript
              </TabsTrigger>
              <TabsTrigger value="iframe" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Iframe
              </TabsTrigger>
              <TabsTrigger
                value="customize"
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Tùy chỉnh
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Xem trước
              </TabsTrigger>
            </TabsList>

            {/* JavaScript Embed Tab */}
            <TabsContent value="javascript">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="neo-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-neo-blue-500" />
                      Mã nhúng JavaScript (Khuyến nghị)
                    </CardTitle>
                    <CardDescription>
                      Tích hợp động, responsive và có nhiều tính năng
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
                        <pre className="text-green-400 text-sm">
                          <code>{generateJavaScriptEmbed()}</code>
                        </pre>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            copyToClipboard(
                              generateJavaScriptEmbed(),
                              "javascript",
                            )
                          }
                          className="neo-button text-white flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {copySuccess === "javascript"
                            ? "Đã copy!"
                            : "Copy mã"}
                        </Button>
                        <Button variant="outline" onClick={openTestPage}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Test
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-green-600">
                          ✅ Ưu điểm:
                        </h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Responsive hoàn toàn (mobile + desktop)</li>
                          <li>• Tải nhanh, nhẹ (~15KB)</li>
                          <li>• Tùy chỉnh giao diện dễ dàng</li>
                          <li>• Theo dõi analytics chi tiết</li>
                          <li>• Tự động update khi có cải tiến</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="neo-card">
                  <CardHeader>
                    <CardTitle>Hướng dẫn cài đặt JavaScript</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-neo-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            1
                          </span>
                          <div>
                            <p className="font-medium">Copy mã JavaScript</p>
                            <p className="text-sm text-muted-foreground">
                              Sao chép toàn bộ mã ở bên trái
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-neo-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            2
                          </span>
                          <div>
                            <p className="font-medium">Dán vào website</p>
                            <p className="text-sm text-muted-foreground">
                              Dán trước thẻ đóng &lt;/body&gt;
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-neo-blue-500 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                            3
                          </span>
                          <div>
                            <p className="font-medium">Hoàn thành!</p>
                            <p className="text-sm text-muted-foreground">
                              Chatbot sẽ xuất hiện ngay lập tức
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-neo-blue-500/10 border border-neo-blue-500/20">
                        <h4 className="font-semibold text-neo-blue-600 mb-2">
                          💡 Tips:
                        </h4>
                        <ul className="text-sm text-neo-blue-600 space-y-1">
                          <li>
                            • Hoạt động với mọi CMS (WordPress, Shopify, etc.)
                          </li>
                          <li>• Không ảnh hưởng tốc độ tải trang</li>
                          <li>• Tự động nhận diện mobile/desktop</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Iframe Embed Tab */}
            <TabsContent value="iframe">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="neo-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5 text-neo-blue-500" />
                      Mã nhúng Iframe
                    </CardTitle>
                    <CardDescription>
                      Đơn giản, tương thích cao nhưng ít tính năng hơn
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
                        <pre className="text-green-400 text-sm">
                          <code>{generateIframeEmbed()}</code>
                        </pre>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            copyToClipboard(generateIframeEmbed(), "iframe")
                          }
                          className="neo-button text-white flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          {copySuccess === "iframe"
                            ? "Đã copy!"
                            : "Copy mã iframe"}
                        </Button>
                        <Button variant="outline" onClick={openTestPage}>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Test
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-orange-600">
                          ⚠️ Hạn chế:
                        </h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Ít tùy chỉnh hơn JavaScript</li>
                          <li>• Không track analytics chi tiết</li>
                          <li>• Có thể bị block bởi ad-blocker</li>
                          <li>• Responsive hạn chế trên mobile</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="neo-card">
                  <CardHeader>
                    <CardTitle>Khi nào dùng Iframe?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <h4 className="font-semibold text-green-600 mb-2">
                            ✅ Nên dùng khi:
                          </h4>
                          <ul className="text-sm text-green-600 space-y-1">
                            <li>• Website có chính sách bảo mật nghiêm ngặt</li>
                            <li>• Không được phép chạy JavaScript bên ngoài</li>
                            <li>• Cần tích hợp nhanh, đơn giản</li>
                            <li>• Website tĩnh (HTML thuần)</li>
                          </ul>
                        </div>

                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <h4 className="font-semibold text-red-600 mb-2">
                            ❌ Không nên dùng khi:
                          </h4>
                          <ul className="text-sm text-red-600 space-y-1">
                            <li>• Muốn tùy chỉnh giao diện nhiều</li>
                            <li>• Cần responsive tốt cho mobile</li>
                            <li>• Muốn analytics chi tiết</li>
                            <li>• Website có nhiều iframe khác</li>
                          </ul>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <p className="text-sm text-yellow-600">
                          <strong>Khuyến nghị:</strong> Sử dụng JavaScript embed
                          để có trải nghiệm tốt nhất.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Customize Tab */}
            <TabsContent value="customize">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="neo-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-neo-blue-500" />
                      Tùy chỉnh giao diện
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Vị trí chatbot</Label>
                      <select
                        className="w-full p-2 rounded border bg-background"
                        value={embedConfig.position}
                        onChange={(e) =>
                          setEmbedConfig((prev) => ({
                            ...prev,
                            position: e.target.value,
                          }))
                        }
                      >
                        <option value="bottom-right">
                          Góc phải dưới (khuyến nghị)
                        </option>
                        <option value="bottom-left">Góc trái dưới</option>
                        <option value="top-right">Góc phải trên</option>
                        <option value="top-left">Góc trái trên</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Chủ đề giao diện</Label>
                      <select
                        className="w-full p-2 rounded border bg-background"
                        value={embedConfig.theme}
                        onChange={(e) =>
                          setEmbedConfig((prev) => ({
                            ...prev,
                            theme: e.target.value,
                          }))
                        }
                      >
                        <option value="light">Sáng</option>
                        <option value="dark">Tối</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Màu chủ đạo</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={embedConfig.primaryColor}
                          onChange={(e) =>
                            setEmbedConfig((prev) => ({
                              ...prev,
                              primaryColor: e.target.value,
                            }))
                          }
                          className="w-16 h-10"
                        />
                        <Input
                          value={embedConfig.primaryColor}
                          onChange={(e) =>
                            setEmbedConfig((prev) => ({
                              ...prev,
                              primaryColor: e.target.value,
                            }))
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tiêu đề chatbot</Label>
                      <Input
                        value={embedConfig.title}
                        onChange={(e) =>
                          setEmbedConfig((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="VD: Hỗ trợ trực tuyến"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tin nhắn chào</Label>
                      <Textarea
                        value={embedConfig.greeting}
                        onChange={(e) =>
                          setEmbedConfig((prev) => ({
                            ...prev,
                            greeting: e.target.value,
                          }))
                        }
                        placeholder="Tin nhắn đầu tiên của chatbot"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Placeholder tin nhắn</Label>
                      <Input
                        value={embedConfig.placeholder}
                        onChange={(e) =>
                          setEmbedConfig((prev) => ({
                            ...prev,
                            placeholder: e.target.value,
                          }))
                        }
                        placeholder="VD: Nhập tin nhắn..."
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="showBranding"
                        checked={embedConfig.showBranding}
                        onChange={(e) =>
                          setEmbedConfig((prev) => ({
                            ...prev,
                            showBranding: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-border"
                      />
                      <Label htmlFor="showBranding">
                        Hiển thị "Powered by Plugai"
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card className="neo-card">
                  <CardHeader>
                    <CardTitle>Xem trước thay đổi</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border border-border bg-background/50 min-h-[300px] relative">
                        <div className="text-center text-muted-foreground py-8">
                          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>Xem trước chatbot trên website</p>
                          <p className="text-sm">
                            Vị trí:{" "}
                            {embedConfig.position === "bottom-right"
                              ? "Góc phải dưới"
                              : embedConfig.position === "bottom-left"
                                ? "Góc trái dưới"
                                : embedConfig.position === "top-right"
                                  ? "Góc phải trên"
                                  : "Góc trái trên"}
                          </p>
                        </div>

                        {/* Simulated chatbot button */}
                        <div
                          className={`absolute w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer ${
                            embedConfig.position.includes("bottom")
                              ? "bottom-4"
                              : "top-4"
                          } ${
                            embedConfig.position.includes("right")
                              ? "right-4"
                              : "left-4"
                          }`}
                          style={{ backgroundColor: embedConfig.primaryColor }}
                          onClick={() => setIsPreviewOpen(!isPreviewOpen)}
                        >
                          <MessageCircle className="w-6 h-6 text-white" />
                        </div>

                        {/* Simulated chat window */}
                        {isPreviewOpen && (
                          <div
                            className={`absolute w-80 h-96 bg-background border border-border rounded-lg shadow-xl ${
                              embedConfig.position.includes("bottom")
                                ? "bottom-20"
                                : "top-20"
                            } ${
                              embedConfig.position.includes("right")
                                ? "right-4"
                                : "left-4"
                            }`}
                          >
                            <div
                              className="p-4 rounded-t-lg text-white font-semibold"
                              style={{
                                backgroundColor: embedConfig.primaryColor,
                              }}
                            >
                              {embedConfig.title}
                            </div>
                            <div className="p-3 text-sm bg-secondary/50">
                              {embedConfig.greeting}
                            </div>
                            <div className="flex-1"></div>
                            <div className="p-3 border-t">
                              <div className="flex gap-2">
                                <Input
                                  placeholder={embedConfig.placeholder}
                                  className="flex-1 text-sm"
                                  readOnly
                                />
                                <Button
                                  size="sm"
                                  style={{
                                    backgroundColor: embedConfig.primaryColor,
                                  }}
                                >
                                  <Send className="w-4 h-4 text-white" />
                                </Button>
                              </div>
                            </div>
                            {embedConfig.showBranding && (
                              <div className="p-2 text-xs text-center text-muted-foreground border-t">
                                Powered by Plugai
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                          <Monitor className="w-4 h-4" />
                          Desktop
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded bg-secondary/50">
                          <Smartphone className="w-4 h-4" />
                          Mobile
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview">
              <div className="text-center space-y-6">
                <Card className="neo-card max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <ExternalLink className="w-5 h-5 text-neo-blue-500" />
                      Test Chatbot Live
                    </CardTitle>
                    <CardDescription>
                      Mở trang test để xem chatbot hoạt động thực tế
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-6 rounded-lg bg-gradient-to-r from-neo-blue-500/10 to-neo-blue-600/10">
                        <h3 className="font-semibold mb-3">
                          🚀 Thông tin chatbot
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">ID:</span>
                            <span className="font-mono ml-2">{chatbotId}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tên:</span>
                            <span className="ml-2">{chatbot.name}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Vị trí:
                            </span>
                            <span className="ml-2">{embedConfig.position}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">
                              Theme:
                            </span>
                            <span className="ml-2">{embedConfig.theme}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={openTestPage}
                        className="neo-button text-white text-lg px-8 py-4 h-auto"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Mở trang test chatbot
                      </Button>

                      <div className="text-sm text-muted-foreground">
                        Trang test sẽ mở trong tab mới với chatbot được nhúng
                        thực tế
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="neo-card max-w-2xl mx-auto">
                  <CardHeader>
                    <CardTitle>ID riêng cho chatbot này</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-secondary/50 font-mono text-center">
                        plugai-chatbot-{chatbotId}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Mỗi chatbot có ID riêng biệt</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Dữ liệu được tách biệt hoàn toàn</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Analytics theo từng chatbot</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Quản lý tập trung từ dashboard</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
