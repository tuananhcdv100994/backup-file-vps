import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Crown,
  Users,
  Bot,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
  UserPlus,
  Shield,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: "active" | "banned";
  chatbotsUsed: number;
  chatbotsLimit: number;
  createdAt: string;
  lastLogin: string;
}

interface Chatbot {
  id: string;
  name: string;
  userId: string;
  conversations: number;
  embedViews: number;
  status: string;
  createdAt: string;
}

export default function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [adminSettings, setAdminSettings] = useState(() => {
    return JSON.parse(
      localStorage.getItem("adminSettings") ||
        '{"email":"tuananhcdv2021@gmail.com","password":"12345678"}',
    );
  });
  const [paymentSettings, setPaymentSettings] = useState(() => {
    return JSON.parse(
      localStorage.getItem("paymentSettings") ||
        '{"momoPhone":"0898289574","zaloPhone":"07.927.627.94"}',
    );
  });
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "free",
  });

  // Check if user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.type !== "admin") {
      navigate("/login");
      return;
    }

    // Load mock data
    loadMockData();
  }, [navigate]);

  const loadMockData = () => {
    // Load real users from localStorage
    const registeredUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]",
    );
    const realUsers: User[] = registeredUsers.map(
      (user: any, index: number) => ({
        id: (index + 1).toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        plan: user.plan || "free",
        status: "active",
        chatbotsUsed: user.chatbotsUsed || 0,
        chatbotsLimit: user.chatbotsLimit || 1,
        createdAt: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : new Date().toLocaleDateString(),
        lastLogin: "Hôm nay",
      }),
    );

    // Add some demo users if no real users exist
    if (realUsers.length === 0) {
      realUsers.push({
        id: "1",
        name: "Demo User",
        email: "demo@plugai.top",
        phone: "0123456789",
        plan: "free",
        status: "active",
        chatbotsUsed: 1,
        chatbotsLimit: 1,
        createdAt: new Date().toLocaleDateString(),
        lastLogin: "Hôm nay",
      });
    }

    // Load real chatbots from localStorage
    const savedChatbots = JSON.parse(localStorage.getItem("chatbots") || "[]");
    const realChatbots: Chatbot[] = savedChatbots.map((bot: any) => ({
      id: bot.id.toString(),
      name: bot.name,
      userId: bot.userId,
      conversations: bot.conversations || 0,
      embedViews: bot.embedViews || 0,
      status: "active",
      createdAt: bot.createdAt
        ? new Date(bot.createdAt).toLocaleDateString()
        : new Date().toLocaleDateString(),
    }));

    setUsers(realUsers);
    setChatbots(realChatbots);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    navigate("/");
  };

  const handleUserStatusToggle = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "banned" : "active" }
          : user,
      ),
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  const handleUpgradeUser = (userId: string, newPlan: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              plan: newPlan,
              chatbotsLimit:
                newPlan === "free" ? 1 : newPlan === "pro" ? 5 : 999,
            }
          : user,
      ),
    );
  };

  const handleCreateUser = () => {
    if (!newUser.name || !newUser.email || !newUser.phone) return;

    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      status: "active",
      chatbotsUsed: 0,
      chatbotsLimit:
        newUser.plan === "free" ? 1 : newUser.plan === "pro" ? 5 : 999,
      createdAt: new Date().toISOString().split("T")[0],
      lastLogin: "Chưa đăng nhập",
    };

    setUsers((prev) => [...prev, user]);
    setNewUser({ name: "", email: "", phone: "", plan: "free" });
  };

  const handleUpdateAdminSettings = () => {
    const updatedSettings = { ...adminSettings };
    if (adminSettings.newPassword) {
      updatedSettings.password = adminSettings.newPassword;
      delete updatedSettings.newPassword;
    }
    localStorage.setItem("adminSettings", JSON.stringify(updatedSettings));
    setAdminSettings(updatedSettings);
    alert("Cài đặt admin đã được cập nhật!");
  };

  const handleUpdatePaymentSettings = () => {
    localStorage.setItem("paymentSettings", JSON.stringify(paymentSettings));
    alert("Thông tin thanh toán đã được cập nhật!");
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    totalChatbots: chatbots.length,
    totalConversations: chatbots.reduce(
      (sum, bot) => sum + bot.conversations,
      0,
    ),
    revenue: users.filter((u) => u.plan !== "free").length * 299000,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-neo-blue-950/20">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 neo-glow">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-muted-foreground">
                  Quản trị hệ thống Plugai
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Super Admin
              </Badge>

              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Tổng quan
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Người dùng
            </TabsTrigger>
            <TabsTrigger value="chatbots" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Chatbots
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Báo cáo
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Cài đặt
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card className="neo-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Tổng người dùng
                      </p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                      <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        +12%
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Người dùng hoạt động
                      </p>
                      <p className="text-2xl font-bold">{stats.activeUsers}</p>
                      <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        +8%
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Tổng chatbots
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.totalChatbots}
                      </p>
                      <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        +15%
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Cuộc hội thoại
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.totalConversations}
                      </p>
                      <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        +24%
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Doanh thu (VNĐ)
                      </p>
                      <p className="text-2xl font-bold">
                        {stats.revenue.toLocaleString()}
                      </p>
                      <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        +18%
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Người dùng mới gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neo-blue-500 flex items-center justify-center text-white text-sm">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            user.plan === "free" ? "secondary" : "default"
                          }
                        >
                          {user.plan.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Chatbots hoạt động</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chatbots.map((bot) => (
                      <div
                        key={bot.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{bot.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {bot.conversations} cuộc hội thoại
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                          Hoạt động
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="space-y-6">
              {/* Create User */}
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-neo-blue-500" />
                    Tạo người dùng mới
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-5 gap-4 items-end">
                    <div>
                      <Label>Họ tên</Label>
                      <Input
                        placeholder="Nhập họ tên"
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        placeholder="email@example.com"
                        value={newUser.email}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Số điện thoại</Label>
                      <Input
                        placeholder="0123456789"
                        value={newUser.phone}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Gói</Label>
                      <select
                        className="w-full p-2 rounded border bg-background"
                        value={newUser.plan}
                        onChange={(e) =>
                          setNewUser((prev) => ({
                            ...prev,
                            plan: e.target.value,
                          }))
                        }
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </div>
                    <Button
                      onClick={handleCreateUser}
                      className="neo-button text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Users List */}
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Danh sách người dùng</CardTitle>
                  <CardDescription>
                    Quản lý tất cả người dùng trong hệ thống
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="p-4 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-neo-blue-500 flex items-center justify-center text-white">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold">{user.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {user.email}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {user.phone}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-sm font-medium">
                                {user.chatbotsUsed}/{user.chatbotsLimit}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Chatbots
                              </p>
                            </div>

                            <Badge
                              variant={
                                user.plan === "free" ? "secondary" : "default"
                              }
                            >
                              {user.plan.toUpperCase()}
                            </Badge>

                            <Badge
                              variant={
                                user.status === "active"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {user.status === "active"
                                ? "Hoạt động"
                                : "Bị khóa"}
                            </Badge>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleUpgradeUser(
                                    user.id,
                                    user.plan === "free" ? "pro" : "free",
                                  )
                                }
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleUserStatusToggle(user.id)}
                              >
                                {user.status === "active" ? (
                                  <Ban className="w-4 h-4" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Chatbots Tab */}
          <TabsContent value="chatbots">
            <Card className="neo-card">
              <CardHeader>
                <CardTitle>Quản lý Chatbots</CardTitle>
                <CardDescription>
                  Tất cả chatbot được tạo trong hệ thống
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chatbots.map((bot) => (
                    <div
                      key={bot.id}
                      className="p-4 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{bot.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Người tạo: {bot.userId}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Tạo ngày: {bot.createdAt}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {bot.conversations}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Cuộc hội thoại
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">
                              {bot.embedViews}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Lượt xem
                            </p>
                          </div>

                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                            {bot.status}
                          </Badge>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Báo cáo theo thời gian</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                      <span>Hôm nay</span>
                      <div className="text-right">
                        <p className="font-semibold">12 người dùng mới</p>
                        <p className="text-sm text-muted-foreground">
                          +8% so với hôm qua
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                      <span>Tuần này</span>
                      <div className="text-right">
                        <p className="font-semibold">67 người dùng mới</p>
                        <p className="text-sm text-muted-foreground">
                          +15% so với tuần trước
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                      <span>Tháng này</span>
                      <div className="text-right">
                        <p className="font-semibold">234 người dùng mới</p>
                        <p className="text-sm text-muted-foreground">
                          +22% so với tháng trước
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Doanh thu</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/10">
                      <span>Doanh thu tháng</span>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {stats.revenue.toLocaleString()} VNĐ
                        </p>
                        <p className="text-sm text-muted-foreground">
                          +18% so với tháng trước
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Gói Pro (299k/tháng)</span>
                        <span>
                          {users.filter((u) => u.plan === "pro").length} người
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Gói Enterprise (999k/tháng)</span>
                        <span>
                          {users.filter((u) => u.plan === "enterprise").length}{" "}
                          người
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-neo-blue-500" />
                    Cài đặt Admin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">
                        Thông tin đăng nhập Admin
                      </h3>
                      <div className="grid gap-4">
                        <div>
                          <Label>Email Admin</Label>
                          <Input
                            value={adminSettings.email}
                            onChange={(e) =>
                              setAdminSettings((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="bg-background/50"
                          />
                        </div>
                        <div>
                          <Label>Mật khẩu mới</Label>
                          <Input
                            type="password"
                            placeholder="Nhập mật khẩu mới (để trống nếu không đổi)"
                            onChange={(e) =>
                              setAdminSettings((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                            className="bg-background/50"
                          />
                        </div>
                        <Button
                          onClick={handleUpdateAdminSettings}
                          className="neo-button text-white"
                        >
                          Cập nhật thông tin Admin
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Cài đặt thanh toán</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Số điện thoại MoMo</Label>
                      <Input
                        value={paymentSettings.momoPhone}
                        onChange={(e) =>
                          setPaymentSettings((prev) => ({
                            ...prev,
                            momoPhone: e.target.value,
                          }))
                        }
                        placeholder="0898289574"
                        className="bg-background/50"
                      />
                    </div>
                    <div>
                      <Label>Zalo hỗ trợ</Label>
                      <Input
                        value={paymentSettings.zaloPhone}
                        onChange={(e) =>
                          setPaymentSettings((prev) => ({
                            ...prev,
                            zaloPhone: e.target.value,
                          }))
                        }
                        placeholder="07.927.627.94"
                        className="bg-background/50"
                      />
                    </div>
                    <Button
                      onClick={handleUpdatePaymentSettings}
                      className="neo-button text-white"
                    >
                      Cập nhật thông tin thanh toán
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="neo-card">
                <CardHeader>
                  <CardTitle>Thông tin hệ thống</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <h3 className="font-semibold text-yellow-600 mb-2">
                        Thông tin liên hệ
                      </h3>
                      <p className="text-sm">
                        Hotline hỗ trợ:{" "}
                        <strong>{paymentSettings.zaloPhone}</strong>
                      </p>
                      <p className="text-sm">
                        Email admin: <strong>{adminSettings.email}</strong>
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-neo-blue-500/10 border border-neo-blue-500/20">
                      <h3 className="font-semibold text-neo-blue-600 mb-2">
                        API Google Gemini
                      </h3>
                      <p className="text-sm">
                        Status:{" "}
                        <Badge className="bg-green-500/10 text-green-500">
                          Hoạt động
                        </Badge>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Kết nối AI engine thành công
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
