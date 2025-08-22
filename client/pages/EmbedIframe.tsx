import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function EmbedIframe() {
  const [searchParams] = useSearchParams();
  const chatbotId = searchParams.get("chatbotId") || "demo";
  const position = searchParams.get("position") || "bottom-right";
  const theme = searchParams.get("theme") || "light";
  const primaryColor = searchParams.get("primaryColor") || "#0066cc";
  const greeting =
    searchParams.get("greeting") || "Xin chào! Tôi có thể giúp gì cho bạn?";
  const placeholder = searchParams.get("placeholder") || "Nhập tin nhắn...";
  const title = searchParams.get("title") || "Hỗ trợ trực tuyến";
  const showBranding = searchParams.get("showBranding") !== "false";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: greeting,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Apply iframe-specific styles
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.body.style.overflow = "hidden";
    document.body.style.fontFamily =
      '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  }, []);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: message,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          chatbotId: chatbotId,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response || "Xin lỗi, tôi gặp vấn đề kỹ thuật.",
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Xin lỗi, tôi gặp vấn đề kỹ thuật. Vui lòng thử lại sau.",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: primaryColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "transform 0.3s ease",
        }}
        onClick={() => setIsOpen(true)}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <MessageCircle size={32} color="white" />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "400px",
        height: "600px",
        backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
        border: `1px solid ${theme === "dark" ? "#333" : "#e1e5e9"}`,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: primaryColor,
          color: "white",
          padding: "16px",
          fontWeight: "600",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>{title}</span>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "18px",
            padding: 0,
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          backgroundColor: theme === "dark" ? "#2a2a2a" : "#f8f9fa",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "12px",
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "250px",
                padding: "10px 14px",
                borderRadius: "18px",
                fontSize: "14px",
                lineHeight: "1.4",
                wordWrap: "break-word",
                backgroundColor:
                  msg.role === "user"
                    ? primaryColor
                    : theme === "dark"
                      ? "#3a3a3a"
                      : "#ffffff",
                color:
                  msg.role === "user"
                    ? "white"
                    : theme === "dark"
                      ? "#ffffff"
                      : "#333333",
                border:
                  msg.role === "assistant"
                    ? `1px solid ${theme === "dark" ? "#444" : "#e1e5e9"}`
                    : "none",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div
              style={{
                backgroundColor: theme === "dark" ? "#3a3a3a" : "#ffffff",
                border: `1px solid ${theme === "dark" ? "#444" : "#e1e5e9"}`,
                borderRadius: "18px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <div className="typing-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          padding: "16px",
          borderTop: `1px solid ${theme === "dark" ? "#333" : "#e1e5e9"}`,
          backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
        }}
      >
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            style={{
              flex: 1,
              padding: "10px 14px",
              border: `1px solid ${theme === "dark" ? "#444" : "#e1e5e9"}`,
              borderRadius: "20px",
              fontSize: "14px",
              outline: "none",
              backgroundColor: theme === "dark" ? "#2a2a2a" : "#ffffff",
              color: theme === "dark" ? "#ffffff" : "#333333",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            style={{
              backgroundColor: primaryColor,
              border: "none",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: isLoading ? 0.5 : 1,
            }}
          >
            <Send size={16} color="white" />
          </button>
        </div>
      </div>

      {/* Branding */}
      {showBranding && (
        <div
          style={{
            textAlign: "center",
            padding: "8px",
            fontSize: "11px",
            color: theme === "dark" ? "#888" : "#666",
            borderTop: `1px solid ${theme === "dark" ? "#333" : "#e1e5e9"}`,
          }}
        >
          Powered by{" "}
          <a
            href="https://plugai.top"
            target="_blank"
            style={{ color: primaryColor, textDecoration: "none" }}
          >
            Plugai
          </a>
        </div>
      )}

      <style>{`
        .typing-dots div {
          width: 6px;
          height: 6px;
          background: ${theme === "dark" ? "#888" : "#999"};
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
          display: inline-block;
          margin-right: 2px;
        }
        .typing-dots div:nth-child(1) { animation-delay: -0.32s; }
        .typing-dots div:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
