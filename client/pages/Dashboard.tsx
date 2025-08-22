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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bot,
  Plus,
  Settings,
  LogOut,
  BarChart3,
  MessageCircle,
  Crown,
  Zap,
  Globe,
  Users,
  TrendingUp,
  Calendar,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const [chatbots, setChatbots] = useState(() => {
    const savedChatbots = localStorage.getItem("chatbots");
    return savedChatbots
      ? JSON.parse(savedChatbots).filter(
          (bot: any) => bot.userId === user?.email,
        )
      : [];
  });

  const stats = [
    {
      title: "Tổng cuộc hội thoại",
      value: chatbots
        .reduce((sum: number, bot: any) => sum + (bot.conversations || 0), 0)
        .toString(),
      change: "+12%",
      icon: MessageCircle,
      color: "text-green-500",
    },
    {
      title: "Chatbot đang hoạt động",
      value: chatbots.length.toString(),
      change: "",
      icon: Bot,
      color: "text-neo-blue-500",
    },
    {
      title: "Lượt xem embed",
      value: chatbots
        .reduce((sum: number, bot: any) => sum + (bot.embedViews || 0), 0)
        .toLocaleString(),
      change: "+8%",
      icon: Globe,
      color: "text-purple-500",
    },
    {
      title: "Người dùng tương tác",
      value: Math.floor(
        chatbots.reduce(
          (sum: number, bot: any) => sum + (bot.conversations || 0),
          0,
        ) * 0.6,
      ).toString(),
      change: "+15%",
      icon: Users,
      color: "text-orange-500",
    },
  ];

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-neo-blue-950/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 neo-glow">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Plugai Dashboard
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Quản lý chatbot AI
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Badge
                variant="outline"
                className="bg-neo-blue-500/10 text-neo-blue-500 border-neo-blue-500/20"
              >
                <Crown className="w-3 h-3 mr-1" />
                {user.plan === "free" ? "Miễn phí" : user.plan.toUpperCase()}
              </Badge>

              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-neo-blue-500 text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Chào mừng, {user.name}!</h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi hiệu suất chatbot AI của bạn
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="neo-card hover:scale-105 transition-all duration-300 cursor-pointer">
            <Link to="/create-chatbot">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 flex items-center justify-center mx-auto mb-4 neo-glow">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Tạo Chatbot Mới</h3>
                <p className="text-sm text-muted-foreground">
                  {user.plan === "free" && user.chatbotsUsed >= 1
                    ? "Nâng cấp để tạo thêm"
                    : "Tạo chatbot AI thông minh"}
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="neo-card hover:scale-105 transition-all duration-300 cursor-pointer">
            <Link to="/analytics">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Phân Tích</h3>
                <p className="text-sm text-muted-foreground">
                  Xem báo cáo chi tiết
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="neo-card hover:scale-105 transition-all duration-300 cursor-pointer">
            <Link to="/upgrade">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Nâng Cấp</h3>
                <p className="text-sm text-muted-foreground">
                  Mở khóa tính năng Pro
                </p>
              </CardContent>
            </Link>
          </Card>

          <Card className="neo-card hover:scale-105 transition-all duration-300 cursor-pointer">
            <Link to="/settings">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-500 to-gray-600 flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">Cài Đặt</h3>
                <p className="text-sm text-muted-foreground">
                  Quản lý tài khoản
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="neo-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    {stat.change && (
                      <p
                        className={`text-sm ${stat.color} flex items-center gap-1 mt-1`}
                      >
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </p>
                    )}
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r from-${stat.color.split("-")[1]}-500 to-${stat.color.split("-")[1]}-600 flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chatbots List */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="neo-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Chatbot của bạn</CardTitle>
                  <CardDescription>
                    Quản lý và theo dõi chatbot AI
                  </CardDescription>
                </div>
                <Link to="/create-chatbot">
                  <Button className="neo-button text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo mới
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {chatbots.length > 0 ? (
                  <div className="space-y-4">
                    {chatbots.map((bot: any) => (
                      <div
                        key={bot.id}
                        className="p-4 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 flex items-center justify-center">
                              <Bot className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{bot.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {bot.description}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-500/10 text-green-500 border-green-500/20"
                          >
                            {bot.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">
                              Cuộc hội thoại
                            </p>
                            <p className="font-semibold">{bot.conversations}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Lượt xem</p>
                            <p className="font-semibold">{bot.embedViews}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">
                              Hoạt động cuối
                            </p>
                            <p className="font-semibold">{bot.lastActive}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Link to={`/settings/${bot.id}`}>
                            <Button size="sm" variant="outline">
                              <Settings className="w-4 h-4 mr-2" />
                              Cài đ��t
                            </Button>
                          </Link>
                          <Link to={`/embed/${bot.id}`}>
                            <Button size="sm" variant="outline">
                              <Globe className="w-4 h-4 mr-2" />
                              Embed code
                            </Button>
                          </Link>
                          <Link to={`/test-chat/${bot.id}`}>
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Test chat
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Bot className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Chưa có chatbot nào</h3>
                    <p className="text-muted-foreground mb-4">
                      Tạo chatbot AI đầu tiên của bạn
                    </p>
                    <Link to="/create-chatbot">
                      <Button className="neo-button text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Tạo chatbot đầu tiên
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Plan Info */}
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-neo-blue-500" />
                  Gói hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gói:</span>
                    <Badge className="bg-neo-blue-500/10 text-neo-blue-500">
                      {user.plan === "free" ? "Miễn phí" : user.plan}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Chatbot:</span>
                    <span className="font-semibold">
                      {user.chatbotsUsed || 0}/{user.chatbotsLimit || 1}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tin nhắn:</span>
                    <span className="font-semibold">156/1,000</span>
                  </div>
                </div>

                {user.plan === "free" && (
                  <div className="mt-4">
                    <Link to="/upgrade">
                      <Button className="w-full neo-button text-white">
                        <Zap className="w-4 h-4 mr-2" />
                        Nâng cấp ngay
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-neo-blue-500" />
                  Hoạt động gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Chatbot đã trả lời 5 câu hỏi</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-neo-blue-500" />
                    <span>Người dùng mới tương tác</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Embed code được xem 12 lần</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
