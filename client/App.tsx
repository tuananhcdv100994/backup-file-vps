import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateChatbot from "./pages/CreateChatbot";
import AdminPanel from "./pages/AdminPanel";
import Upgrade from "./pages/Upgrade";
import EmbedCode from "./pages/EmbedCode";
import Demo from "./pages/Demo";
import Settings from "./pages/Settings";
import TestChat from "./pages/TestChat";
import EmbedTest from "./pages/EmbedTest";
import EmbedIframe from "./pages/EmbedIframe";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import {
  Bot,
  Crown,
  Settings as SettingsIcon,
  BarChart3,
  Globe,
  Users,
  Code,
  MessageCircle,
  Zap,
} from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-chatbot" element={<CreateChatbot />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/upgrade" element={<Upgrade />} />
            <Route path="/embed/:chatbotId" element={<EmbedCode />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/settings/:chatbotId" element={<Settings />} />
            <Route path="/test-chat/:chatbotId" element={<TestChat />} />
            <Route path="/embed-test" element={<EmbedTest />} />
            <Route path="/embed/iframe" element={<EmbedIframe />} />

            {/* Placeholder routes */}
            <Route
              path="/analytics"
              element={
                <Placeholder
                  title="Phân Tích"
                  description="Báo cáo và thống kê chi tiết"
                  icon={<BarChart3 className="w-8 h-8 text-white" />}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <Placeholder
                  title="Cài Đặt"
                  description="Quản lý tài khoản và cài đặt"
                  icon={<SettingsIcon className="w-8 h-8 text-white" />}
                />
              }
            />
            <Route
              path="/features"
              element={
                <Placeholder
                  title="Tính Năng"
                  description="Khám phá các tính năng"
                  icon={<Bot className="w-8 h-8 text-white" />}
                />
              }
            />
            <Route
              path="/pricing"
              element={
                <Placeholder
                  title="Bảng Giá"
                  description="Các gói dịch vụ và giá cả"
                  icon={<Crown className="w-8 h-8 text-white" />}
                />
              }
            />
            <Route
              path="/docs"
              element={
                <Placeholder
                  title="Hướng Dẫn"
                  description="Tài liệu hướng dẫn sử dụng"
                  icon={<Code className="w-8 h-8 text-white" />}
                />
              }
            />
            <Route
              path="/help"
              element={
                <Placeholder
                  title="Trợ Giúp"
                  description="Hỗ trợ khách hàng"
                  icon={<Users className="w-8 h-8 text-white" />}
                />
              }
            />
            <Route
              path="/contact"
              element={
                <Placeholder
                  title="Liên Hệ"
                  description="Thông tin liên hệ"
                  icon={<Globe className="w-8 h-8 text-white" />}
                />
              }
            />
            <Route
              path="/about"
              element={
                <Placeholder
                  title="Về Chúng Tôi"
                  description="Thông tin về Plugai"
                  icon={<Users className="w-8 h-8 text-white" />}
                />
              }
            />
            <Route
              path="/privacy"
              element={
                <Placeholder
                  title="Chính Sách Bảo Mật"
                  description="Chính sách bảo mật dữ liệu"
                  icon={<Globe className="w-8 h-8 text-white" />}
                />
              }
            />
            <Route
              path="/terms"
              element={
                <Placeholder
                  title="Điều Khoản Sử Dụng"
                  description="Điều khoản và điều kiện"
                  icon={<Globe className="w-8 h-8 text-white" />}
                />
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
