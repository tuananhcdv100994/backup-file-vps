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
import {
  Crown,
  ArrowLeft,
  CheckCircle,
  Star,
  Zap,
  Users,
  Bot,
  BarChart3,
  Shield,
  Phone,
  User,
  CreditCard,
} from "lucide-react";

export default function Upgrade() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [paymentSettings] = useState(() => {
    return JSON.parse(
      localStorage.getItem("paymentSettings") ||
        '{"momoPhone":"0898289574","zaloPhone":"07.927.627.94"}',
    );
  });

  const plans = [
    {
      id: "pro",
      name: "Pro",
      price: "299,000đ",
      period: "/tháng",
      description: "Dành cho doanh nghiệp nhỏ",
      popular: true,
      features: [
        "5 chatbot",
        "10,000 tin nhắn/tháng",
        "Phân tích nâng cao",
        "Hỗ trợ ưu tiên",
        "Tùy chỉnh giao diện",
        "API tích hợp",
        "Xuất dữ liệu",
        "Hỗ trợ email 24/7",
      ],
      color: "from-neo-blue-500 to-neo-blue-600",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "999,000đ",
      period: "/tháng",
      description: "Cho doanh nghiệp lớn",
      popular: false,
      features: [
        "Không giới hạn chatbot",
        "Không giới hạn tin nhắn",
        "API riêng",
        "Hỗ trợ 24/7",
        "Quản lý team",
        "White-label",
        "Dedicated support",
        "Custom training",
        "SLA 99.9%",
      ],
      color: "from-purple-500 to-purple-600",
    },
  ];

  const handleUpgrade = () => {
    if (user?.name && user?.phone) {
      setShowPayment(true);
    } else {
      alert(
        "Vui lòng cập nhật thông tin cá nhân trong Settings trước khi nâng cấp!",
      );
    }
  };

  const handleConfirmPayment = () => {
    // Show Zalo contact info
    alert(
      `Đã ghi nhận yêu cầu nâng cấp! Vui lòng liên hệ Zalo: ${paymentSettings.zaloPhone} và thông báo đã chuyển khoản để được nâng cấp tài khoản trong 24h.`,
    );

    // Update user with pending upgrade
    const updatedUser = {
      ...user,
      upgradeRequest: {
        plan: selectedPlan,
        amount: selectedPlan === "pro" ? 299000 : 999000,
        submittedAt: new Date().toISOString(),
        status: "pending_confirmation",
      },
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    navigate("/dashboard");
  };

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
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 neo-glow">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Nâng Cấp Gói
                </h1>
                <p className="text-xs text-muted-foreground">
                  Mở khóa tính năng Pro
                </p>
              </div>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nâng cấp để mở khóa
              <span className="bg-gradient-to-r from-neo-blue-400 to-neo-blue-600 bg-clip-text text-transparent">
                {" "}
                toàn bộ tính năng
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Chọn gói phù hợp để phát triển chatbot AI không giới hạn
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Current Plan */}
            <Card className="neo-card">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Gói hiện tại</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">0đ</span>
                  <span className="text-muted-foreground">/tháng</span>
                </div>
                <CardDescription>Miễn phí</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>1 chatbot</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>1,000 tin nhắn/tháng</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Tích hợp website</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span>Hỗ trợ email</span>
                  </li>
                </ul>
                <Badge className="w-full justify-center bg-gray-500/10 text-gray-500">
                  Gói hiện tại
                </Badge>
              </CardContent>
            </Card>

            {/* Plans */}
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`neo-card relative ${selectedPlan === plan.id ? "ring-2 ring-neo-blue-500 neo-glow" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 text-white">
                      <Star className="w-4 h-4 mr-1" />
                      Phổ biến nhất
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-neo-blue-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${selectedPlan === plan.id ? "neo-button text-white" : ""}`}
                    variant={selectedPlan === plan.id ? "default" : "outline"}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {selectedPlan === plan.id ? "Đã chọn" : "Chọn gói này"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Upgrade Section */}
          {!showPayment ? (
            <Card className="neo-card max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <CreditCard className="w-6 h-6 text-neo-blue-500" />
                  Nâng cấp tài khoản
                </CardTitle>
                <CardDescription>
                  Nâng cấp lên gói{" "}
                  {plans.find((p) => p.id === selectedPlan)?.name} để mở khóa
                  thêm tính năng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 rounded-lg bg-neo-blue-500/10 border border-neo-blue-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-neo-blue-600">
                          Gói {plans.find((p) => p.id === selectedPlan)?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {
                            plans.find((p) => p.id === selectedPlan)
                              ?.description
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-neo-blue-600">
                          {plans.find((p) => p.id === selectedPlan)?.price}
                        </p>
                        <p className="text-sm text-muted-foreground">/tháng</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Thông tin tài khoản
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                        <span className="text-muted-foreground">Tên:</span>
                        <span className="font-medium">
                          {user?.name || "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                        <span className="text-muted-foreground">
                          Số điện thoại:
                        </span>
                        <span className="font-medium">
                          {user?.phone || "Chưa cập nhật"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{user?.email}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleUpgrade}
                    className="w-full neo-button text-white text-lg py-3"
                    disabled={!user?.name || !user?.phone}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Tiến hành nâng cấp
                  </Button>

                  {(!user?.name || !user?.phone) && (
                    <p className="text-center text-sm text-yellow-600">
                      Vui lòng cập nhật đầy đủ thông tin cá nhân trong Settings
                      trước khi nâng cấp
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="neo-card max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <CreditCard className="w-6 h-6 text-neo-blue-500" />
                  Thanh toán nâng cấp
                </CardTitle>
                <CardDescription>
                  Quét mã QR hoặc chuyển khoản đến số MoMo để hoàn tất nâng cấp
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <div className="inline-block p-4 bg-white rounded-lg">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2Fe5b69c457fee4775aab362741b19b9c2%2F9f8e929a6ea94636a3f4a9309f71c452?format=webp&width=800"
                        alt="QR Code MoMo"
                        className="w-64 h-64 mx-auto"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">
                        Số MoMo: {paymentSettings.momoPhone}
                      </p>
                      <p className="text-xl font-bold text-neo-blue-600">
                        Số tiền:{" "}
                        {plans.find((p) => p.id === selectedPlan)?.price}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Nội dung: Nâng cấp {selectedPlan.toUpperCase()} -{" "}
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <h3 className="font-semibold text-yellow-600 mb-2">
                      Hướng dẫn thanh toán:
                    </h3>
                    <ol className="text-sm text-yellow-600 space-y-1">
                      <li>1. Mở ứng dụng MoMo trên điện thoại</li>
                      <li>
                        2. Quét mã QR hoặc chuyển khoản đến số{" "}
                        {paymentSettings.momoPhone}
                      </li>
                      <li>3. Nhập đúng số tiền và nội dung chuyển khoản</li>
                      <li>4. Hoàn tất giao dịch</li>
                      <li>5. Bấm "Đã chuyển khoản" bên dưới</li>
                    </ol>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={handleConfirmPayment}
                      className="w-full neo-button text-white text-lg py-3"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Đã chuyển khoản
                    </Button>

                    <Button
                      onClick={() => setShowPayment(false)}
                      variant="outline"
                      className="w-full"
                    >
                      Quay lại
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Benefits Section */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-8">Tại sao nên nâng cấp?</h3>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  icon: Bot,
                  title: "Nhiều chatbot hơn",
                  description:
                    "Tạo không giới hạn chatbot cho nhiều mục đích khác nhau",
                },
                {
                  icon: BarChart3,
                  title: "Phân tích nâng cao",
                  description:
                    "Báo cáo chi tiết về hiệu suất và tương tác người dùng",
                },
                {
                  icon: Shield,
                  title: "Hỗ trợ ưu tiên",
                  description:
                    "Được hỗ trợ 24/7 với thời gian phản hồi nhanh nhất",
                },
                {
                  icon: Users,
                  title: "Quản lý team",
                  description:
                    "Mời thành viên, phân quyền và cộng tác hiệu quả",
                },
              ].map((benefit, index) => (
                <Card key={index} className="neo-card text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-neo-blue-500 to-neo-blue-600 flex items-center justify-center mx-auto mb-4 neo-glow">
                      <benefit.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
