import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-neo-blue-950/20 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Tạo chatbot AI by Plugai
          </h1>
          <p className="text-xl text-muted-foreground">
            Nền tảng tạo chatbot AI thông minh với Google Gemini
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="neo-card p-6">
            <h2 className="text-2xl font-bold mb-4">🤖 Tính năng chính</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>✅ Tích hợp Google Gemini AI</li>
              <li>✅ Mã nhúng responsive (JS + Iframe)</li>
              <li>✅ ID riêng cho từng chatbot</li>
              <li>✅ Analytics và tracking</li>
              <li>✅ Dashboard quản lý</li>
              <li>✅ Admin panel</li>
            </ul>
          </div>

          <div className="neo-card p-6">
            <h2 className="text-2xl font-bold mb-4">🚀 Bắt đầu</h2>
            <div className="space-y-4">
              <Link to="/register" className="block">
                <button className="w-full neo-button text-white py-3 px-6 rounded-lg">
                  Đăng ký miễn phí
                </button>
              </Link>

              <Link to="/login" className="block">
                <button className="w-full border border-border py-3 px-6 rounded-lg hover:bg-secondary">
                  Đăng nhập
                </button>
              </Link>

              <Link to="/demo" className="block">
                <button className="w-full border border-neo-blue-500 text-neo-blue-500 py-3 px-6 rounded-lg hover:bg-neo-blue-500/10">
                  Xem Demo
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">📱 Mã nhúng hoạt động</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="neo-card p-6">
              <h3 className="text-xl font-bold mb-4">JavaScript Embed</h3>
              <div className="text-left space-y-2 text-sm">
                <p>✅ Responsive hoàn toàn</p>
                <p>✅ Tải nhanh (~15KB)</p>
                <p>✅ Analytics chi tiết</p>
                <p>✅ Tùy chỉnh giao diện</p>
              </div>
            </div>

            <div className="neo-card p-6">
              <h3 className="text-xl font-bold mb-4">Iframe Embed</h3>
              <div className="text-left space-y-2 text-sm">
                <p>✅ Tương thích cao</p>
                <p>✅ Bảo mật nghiêm ngặt</p>
                <p>✅ Đơn giản cài đặt</p>
                <p>⚠️ Ít tính năng hơn</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 neo-card">
          <h2 className="text-2xl font-bold mb-4 text-center">
            🔑 ID riêng cho từng chatbot
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="font-mono text-sm bg-secondary/50 p-3 rounded">
                plugai-chatbot-123
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                User A - Chatbot 1
              </p>
            </div>
            <div>
              <div className="font-mono text-sm bg-secondary/50 p-3 rounded">
                plugai-chatbot-456
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                User B - Chatbot 1
              </p>
            </div>
            <div>
              <div className="font-mono text-sm bg-secondary/50 p-3 rounded">
                plugai-chatbot-789
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                User A - Chatbot 2
              </p>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-4">
            Mỗi chatbot có ID riêng để tách biệt dữ liệu hoàn toàn
          </p>
        </div>

        <div className="mt-8 text-center text-muted-foreground">
          <p>
            Liên hệ hỗ trợ: <strong>07.927.627.94</strong>
          </p>
          <p className="mt-2">
            &copy; 2024 Plugai.top - Nền tảng chatbot AI hàng đầu Việt Nam
          </p>
        </div>
      </div>
    </div>
  );
}
