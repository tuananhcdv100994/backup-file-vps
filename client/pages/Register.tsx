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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Bot,
  Mail,
  Lock,
  User,
  Phone,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      setIsLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      alert("Vui lòng đồng ý với điều khoản sử dụng");
      setIsLoading(false);
      return;
    }

    // Save user to registered users list
    const existingUsers = JSON.parse(
      localStorage.getItem("registeredUsers") || "[]",
    );
    const newUser = {
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      password: formData.password,
      type: "user",
      plan: "free",
      chatbotsLimit: 1,
      chatbotsUsed: 0,
      createdAt: new Date().toISOString(),
    };

    // Check if user already exists
    if (existingUsers.find((u: any) => u.email === formData.email)) {
      alert("Email này đã được đăng ký!");
      setIsLoading(false);
      return;
    }

    existingUsers.push(newUser);
    localStorage.setItem("registeredUsers", JSON.stringify(existingUsers));

    setTimeout(() => {
      localStorage.setItem("userType", "user");
      localStorage.setItem("user", JSON.stringify(newUser));
      navigate("/dashboard");
      window.location.reload(); // Force reload to update state
    }, 1000);
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

        <Card className="neo-card">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 neo-glow">
                <Bot className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Tạo tài khoản</CardTitle>
              <CardDescription>
                Đăng ký miễn phí để bắt đầu tạo chatbot AI
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nhập họ và tên"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50 focus:border-neo-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50 focus:border-neo-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="0123456789"
                    value={formData.phone}
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
                    placeholder="Tạo mật khẩu mạnh"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50 focus:border-neo-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 bg-background/50 border-border/50 focus:border-neo-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      acceptTerms: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="acceptTerms" className="text-sm">
                  Tôi đồng ý với{" "}
                  <Link
                    to="/terms"
                    className="text-neo-blue-500 hover:text-neo-blue-400"
                  >
                    điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link
                    to="/privacy"
                    className="text-neo-blue-500 hover:text-neo-blue-400"
                  >
                    chính sách bảo mật
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full neo-button text-white"
                disabled={isLoading}
              >
                {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
              </Button>
            </form>

            {/* Benefits */}
            <div className="mt-6 p-4 rounded-lg bg-neo-blue-500/10 border border-neo-blue-500/20">
              <p className="text-sm font-medium text-neo-blue-600 mb-2">
                Bạn sẽ nhận được:
              </p>
              <ul className="space-y-1 text-sm text-neo-blue-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />1 chatbot miễn phí
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  1,000 tin nhắn/tháng
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3" />
                  Tích hợp website
                </li>
              </ul>
            </div>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-neo-blue-500 hover:text-neo-blue-400 font-medium"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
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
