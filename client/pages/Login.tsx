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
import { Badge } from "@/components/ui/badge";
import { Bot, Mail, Lock, ArrowLeft, Crown, User } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"user" | "admin">("user");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check for admin credentials
      const adminSettings = JSON.parse(
        localStorage.getItem("adminSettings") ||
          '{"email":"tuananhcdv2021@gmail.com","password":"12345678"}',
      );
      if (
        formData.email === adminSettings.email &&
        formData.password === adminSettings.password
      ) {
        // Admin login
        localStorage.setItem("userType", "admin");
        localStorage.setItem(
          "user",
          JSON.stringify({
            email: formData.email,
            name: "Admin",
            type: "admin",
          }),
        );
        setTimeout(() => {
          navigate("/admin");
          window.location.reload(); // Force reload to update state
        }, 500);
      } else {
        // Regular user login - check if user exists
        const existingUsers = JSON.parse(
          localStorage.getItem("registeredUsers") || "[]",
        );
        const user = existingUsers.find((u: any) => u.email === formData.email);

        if (user && user.password === formData.password) {
          localStorage.setItem("userType", "user");
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              type: "user",
            }),
          );
          setTimeout(() => {
            navigate("/dashboard");
            window.location.reload(); // Force reload to update state
          }, 500);
        } else {
          alert("Email hoặc mật khẩu không đúng!");
          setIsLoading(false);
          return;
        }
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi đăng nhập!");
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-neo-blue-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Về trang chủ
        </Link>

        {/* Hidden Admin Access - Triple click on logo to access */}
        <div
          className="text-center mb-6"
          onClick={(e) => {
            if (e.detail === 3) {
              // Triple click
              setLoginType(loginType === "admin" ? "user" : "admin");
            }
          }}
        >
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 neo-glow">
              {loginType === "admin" ? (
                <Crown className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
          </div>
        </div>

        <Card
          className={`neo-card ${loginType === "admin" ? "ring-2 ring-neo-blue-500 neo-glow" : ""}`}
        >
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${
                  loginType === "admin"
                    ? "from-yellow-500 to-orange-500"
                    : "from-neo-blue-500 to-neo-blue-600"
                } neo-glow`}
              >
                {loginType === "admin" ? (
                  <Crown className="w-8 h-8 text-white" />
                ) : (
                  <Bot className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">
                {loginType === "admin" ? "Đăng nhập Admin" : "Đăng nhập"}
              </CardTitle>
              <CardDescription>
                {loginType === "admin"
                  ? "Truy cập bảng điều khiển quản trị"
                  : "Đăng nhập vào tài khoản Plugai của bạn"}
              </CardDescription>
            </div>
            {loginType === "admin" && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Crown className="w-3 h-3 mr-1" />
                Quyền quản trị viên
              </Badge>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={
                      loginType === "admin"
                        ? "tuananhcdv2021@gmail.com"
                        : "your@email.com"
                    }
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50 focus:border-neo-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={
                      loginType === "admin" ? "12345678" : "Nhập mật khẩu"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50 focus:border-neo-blue-500"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className={`w-full ${loginType === "admin" ? "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400" : "neo-button"} text-white`}
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            {loginType === "user" && (
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/register"
                    className="text-neo-blue-500 hover:text-neo-blue-400 font-medium"
                  >
                    Đăng ký miễn phí
                  </Link>
                </p>
              </div>
            )}

            {loginType === "admin" && (
              <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center">
                  Chỉ dành cho quản trị viên hệ thống
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-neo-blue-500 to-neo-blue-600">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Tạo chatbot AI by Plugai</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Liên hệ hỗ trợ: 07.927.627.94
          </p>
        </div>
      </div>
    </div>
  );
}
