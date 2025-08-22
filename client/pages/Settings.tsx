import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  Settings as SettingsIcon,
  ArrowLeft,
  Save,
  Bot,
  MessageCircle,
  Database,
  Users,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function Settings() {
  const { chatbotId } = useParams();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load chatbot data from localStorage
    const savedChatbots = JSON.parse(localStorage.getItem("chatbots") || "[]");
    const foundChatbot = savedChatbots.find(
      (bot: any) => bot.id.toString() === chatbotId,
    );

    if (foundChatbot) {
      setChatbot(foundChatbot);
    } else {
      navigate("/dashboard");
    }
  }, [chatbotId, navigate]);

  const handleSave = () => {
    if (!chatbot) return;

    setIsLoading(true);

    // Update chatbot in localStorage
    const savedChatbots = JSON.parse(localStorage.getItem("chatbots") || "[]");
    const updatedChatbots = savedChatbots.map((bot: any) =>
      bot.id === chatbot.id ? chatbot : bot,
    );

    localStorage.setItem("chatbots", JSON.stringify(updatedChatbots));

    setTimeout(() => {
      setIsLoading(false);
      alert("Đã lưu thay đổi thành công!");
    }, 1000);
  };

  const handleDelete = () => {
    if (!chatbot) return;

    if (
      confirm(
        "Bạn có chắc muốn xóa chatbot này? Hành động này không thể hoàn tác.",
      )
    ) {
      const savedChatbots = JSON.parse(
        localStorage.getItem("chatbots") || "[]",
      );
      const updatedChatbots = savedChatbots.filter(
        (bot: any) => bot.id !== chatbot.id,
      );

      localStorage.setItem("chatbots", JSON.stringify(updatedChatbots));

      // Update user's chatbot count
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.chatbotsUsed = Math.max(0, (user.chatbotsUsed || 0) - 1);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard");
    }
  };

  const updateField = (field: string, value: any) => {
    setChatbot((prev: any) => ({
      ...prev,
      [field]: value,
    }));
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
                <SettingsIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Cài đặt Chatbot
                </h1>
                <p className="text-xs text-muted-foreground">{chatbot.name}</p>
              </div>
            </div>
            <div className="w-32">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="neo-button text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Bot className="w-4 h-4" />
                Chung
              </TabsTrigger>
              <TabsTrigger value="training" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Dữ liệu
              </TabsTrigger>
              <TabsTrigger
                value="conversations"
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Hội thoại
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <SettingsIcon className="w-4 h-4" />
                Nâng cao
              </TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general">
              <div className="grid gap-6">
                <Card className="neo-card">
                  <CardHeader>
                    <CardTitle>Thông tin cơ bản</CardTitle>
                    <CardDescription>
                      Cài đặt thông tin chung của chatbot
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tên chatbot</Label>
                      <Input
                        id="name"
                        value={chatbot.name}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Mô tả</Label>
                      <Textarea
                        id="description"
                        value={chatbot.description}
                        onChange={(e) =>
                          updateField("description", e.target.value)
                        }
                        className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="welcomeMessage">Tin nhắn chào mừng</Label>
                      <Textarea
                        id="welcomeMessage"
                        value={chatbot.welcomeMessage}
                        onChange={(e) =>
                          updateField("welcomeMessage", e.target.value)
                        }
                        className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                        rows={2}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="collectUserInfo"
                        checked={chatbot.collectUserInfo}
                        onChange={(e) =>
                          updateField("collectUserInfo", e.target.checked)
                        }
                        className="w-4 h-4 rounded border-border"
                      />
                      <Label htmlFor="collectUserInfo">
                        Thu thập thông tin người dùng
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Card className="neo-card">
                  <CardHeader>
                    <CardTitle>Trạng thái</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Chatbot hiện tại</p>
                        <p className="text-sm text-muted-foreground">
                          Tạo ngày:{" "}
                          {new Date(chatbot.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        Hoạt động
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Training Data */}
            <TabsContent value="training">
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Dữ liệu huấn luyện</CardTitle>
                  <CardDescription>
                    Cập nhật dữ liệu để chatbot trả lời chính xác hơn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Hướng dẫn cho AI</Label>
                    <Textarea
                      id="instructions"
                      value={chatbot.instructions}
                      onChange={(e) =>
                        updateField("instructions", e.target.value)
                      }
                      className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                      rows={4}
                      placeholder="Hướng dẫn cách AI nên trả lời và hành xử..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textData">Dữ liệu văn bản</Label>
                    <Textarea
                      id="textData"
                      value={chatbot.textData}
                      onChange={(e) => updateField("textData", e.target.value)}
                      className="bg-background/50 border-border/50 focus:border-neo-blue-500 min-h-[200px]"
                      placeholder="Nhập thông tin, câu hỏi thường gặp, kiến thức mà bạn muốn chatbot biết..."
                    />
                  </div>

                  {chatbot.websiteUrl && (
                    <div className="space-y-2">
                      <Label htmlFor="websiteUrl">Website URL</Label>
                      <Input
                        id="websiteUrl"
                        value={chatbot.websiteUrl}
                        onChange={(e) =>
                          updateField("websiteUrl", e.target.value)
                        }
                        className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Conversations */}
            <TabsContent value="conversations">
              <div className="grid gap-6">
                <Card className="neo-card">
                  <CardHeader>
                    <CardTitle>Thống kê cuộc hội thoại</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-lg bg-neo-blue-500/10">
                        <p className="text-2xl font-bold text-neo-blue-600">
                          {chatbot.conversations || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Cuộc hội thoại
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-500/10">
                        <p className="text-2xl font-bold text-green-600">
                          {chatbot.embedViews || 0}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Lượt xem
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-purple-500/10">
                        <p className="text-2xl font-bold text-purple-600">
                          {Math.floor((chatbot.conversations || 0) * 0.7)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Thông tin thu thập
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-orange-500/10">
                        <p className="text-2xl font-bold text-orange-600">
                          98%
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Độ hài lòng
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="neo-card">
                  <CardHeader>
                    <CardTitle>Câu hỏi tự động</CardTitle>
                    <CardDescription>
                      Những câu hỏi chatbot sẽ tự động hỏi để thu thập thông tin
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {chatbot.autoQuestions?.map(
                        (question: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={question}
                              onChange={(e) => {
                                const newQuestions = [
                                  ...(chatbot.autoQuestions || []),
                                ];
                                newQuestions[index] = e.target.value;
                                updateField("autoQuestions", newQuestions);
                              }}
                              className="bg-background/50 border-border/50 focus:border-neo-blue-500"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                const newQuestions =
                                  chatbot.autoQuestions.filter(
                                    (_: any, i: number) => i !== index,
                                  );
                                updateField("autoQuestions", newQuestions);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ),
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newQuestions = [
                            ...(chatbot.autoQuestions || []),
                            "Câu hỏi mới",
                          ];
                          updateField("autoQuestions", newQuestions);
                        }}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Thêm câu hỏi
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced">
              <div className="grid gap-6">
                <Card className="neo-card">
                  <CardHeader>
                    <CardTitle>Cài đặt nâng cao</CardTitle>
                    <CardDescription>
                      Các tùy chọn dành cho người dùng có kinh nghiệm
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Hành động</h3>
                      <div className="grid gap-3">
                        <Link to={`/embed/${chatbot.id}`}>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <Bot className="w-4 h-4 mr-2" />
                            Tạo mã embed
                          </Button>
                        </Link>
                        <Link to={`/test-chat/${chatbot.id}`}>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Test chatbot
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <Database className="w-4 h-4 mr-2" />
                          Xuất dữ liệu
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="neo-card border-destructive/50">
                  <CardHeader>
                    <CardTitle className="text-destructive flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Vùng nguy hiểm
                    </CardTitle>
                    <CardDescription>
                      Các hành động này không thể hoàn tác
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      className="w-full"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa chatbot này
                    </Button>
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
