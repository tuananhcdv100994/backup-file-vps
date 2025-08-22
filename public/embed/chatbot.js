(function () {
  "use strict";

  // Get config from global variable
  const config = window.PlugaiChatbot || {};
  const chatbotId = config.chatbotId || "demo";
  const settings = config.config || {};

  // Default settings
  const defaultSettings = {
    position: "bottom-right",
    theme: "light",
    primaryColor: "#0066cc",
    greeting: "Xin chào! Tôi có thể giúp gì cho bạn?",
    placeholder: "Nhập tin nhắn...",
    title: "Hỗ trợ trực tuyến",
    showBranding: true,
    apiUrl:
      "https://4d5057eebca8483e97c914491837f220-09ce1a6997c34521826d6432f.fly.dev",
  };

  // Merge settings
  const finalSettings = { ...defaultSettings, ...settings };

  // Create unique ID for this instance
  const instanceId = "plugai-chatbot-" + chatbotId + "-" + Date.now();

  // CSS Styles
  const styles = `
    .plugai-chatbot-container {
      position: fixed;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      ${finalSettings.position.includes("bottom") ? "bottom: 20px;" : "top: 20px;"}
      ${finalSettings.position.includes("right") ? "right: 20px;" : "left: 20px;"}
    }
    
    .plugai-chatbot-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${finalSettings.primaryColor};
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }
    
    .plugai-chatbot-button:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(0,0,0,0.25);
    }
    
    .plugai-chatbot-button svg {
      width: 24px;
      height: 24px;
      fill: white;
    }
    
    .plugai-chatbot-window {
      position: absolute;
      ${finalSettings.position.includes("bottom") ? "bottom: 80px;" : "top: 80px;"}
      ${finalSettings.position.includes("right") ? "right: 0;" : "left: 0;"}
      width: 350px;
      height: 500px;
      background: ${finalSettings.theme === "dark" ? "#1a1a1a" : "#ffffff"};
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid ${finalSettings.theme === "dark" ? "#333" : "#e1e5e9"};
    }
    
    .plugai-chatbot-window.open {
      display: flex;
    }
    
    .plugai-chatbot-header {
      background: ${finalSettings.primaryColor};
      color: white;
      padding: 16px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .plugai-chatbot-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 18px;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .plugai-chatbot-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: ${finalSettings.theme === "dark" ? "#2a2a2a" : "#f8f9fa"};
    }
    
    .plugai-chatbot-message {
      margin-bottom: 12px;
      display: flex;
      align-items: flex-end;
      gap: 8px;
    }
    
    .plugai-chatbot-message.user {
      justify-content: flex-end;
    }
    
    .plugai-chatbot-message.user .message-content {
      background: ${finalSettings.primaryColor};
      color: white;
    }
    
    .plugai-chatbot-message.assistant .message-content {
      background: ${finalSettings.theme === "dark" ? "#3a3a3a" : "#ffffff"};
      color: ${finalSettings.theme === "dark" ? "#ffffff" : "#333333"};
      border: 1px solid ${finalSettings.theme === "dark" ? "#444" : "#e1e5e9"};
    }
    
    .message-content {
      max-width: 250px;
      padding: 10px 14px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
    }
    
    .plugai-chatbot-input-container {
      padding: 16px;
      border-top: 1px solid ${finalSettings.theme === "dark" ? "#333" : "#e1e5e9"};
      background: ${finalSettings.theme === "dark" ? "#1a1a1a" : "#ffffff"};
    }
    
    .plugai-chatbot-input {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .plugai-chatbot-input input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid ${finalSettings.theme === "dark" ? "#444" : "#e1e5e9"};
      border-radius: 20px;
      font-size: 14px;
      outline: none;
      background: ${finalSettings.theme === "dark" ? "#2a2a2a" : "#ffffff"};
      color: ${finalSettings.theme === "dark" ? "#ffffff" : "#333333"};
    }
    
    .plugai-chatbot-input input:focus {
      border-color: ${finalSettings.primaryColor};
    }
    
    .plugai-chatbot-send {
      background: ${finalSettings.primaryColor};
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s;
    }
    
    .plugai-chatbot-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .plugai-chatbot-send svg {
      width: 16px;
      height: 16px;
      fill: white;
    }
    
    .plugai-chatbot-branding {
      text-align: center;
      padding: 8px;
      font-size: 11px;
      color: ${finalSettings.theme === "dark" ? "#888" : "#666"};
      border-top: 1px solid ${finalSettings.theme === "dark" ? "#333" : "#e1e5e9"};
    }
    
    .plugai-chatbot-branding a {
      color: ${finalSettings.primaryColor};
      text-decoration: none;
    }
    
    .plugai-chatbot-typing {
      display: none;
      align-items: center;
      gap: 4px;
      padding: 10px 14px;
      background: ${finalSettings.theme === "dark" ? "#3a3a3a" : "#ffffff"};
      border: 1px solid ${finalSettings.theme === "dark" ? "#444" : "#e1e5e9"};
      border-radius: 18px;
      margin-bottom: 12px;
      max-width: 80px;
    }
    
    .plugai-chatbot-typing.show {
      display: flex;
    }
    
    .typing-dot {
      width: 6px;
      height: 6px;
      background: ${finalSettings.theme === "dark" ? "#888" : "#999"};
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }
    
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes typing {
      0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
      40% { transform: scale(1); opacity: 1; }
    }
    
    @media (max-width: 480px) {
      .plugai-chatbot-window {
        width: calc(100vw - 40px);
        height: calc(100vh - 120px);
        max-width: 350px;
        max-height: 500px;
      }
      
      .plugai-chatbot-container {
        ${finalSettings.position.includes("right") ? "right: 10px;" : "left: 10px;"}
        ${finalSettings.position.includes("bottom") ? "bottom: 10px;" : "top: 10px;"}
      }
    }
  `;

  // Create stylesheet
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // HTML Template
  const chatbotHTML = `
    <div class="plugai-chatbot-container" id="${instanceId}">
      <button class="plugai-chatbot-button" id="${instanceId}-button">
        <svg viewBox="0 0 24 24">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V16C2 17.1 2.9 18 4 18H6L10 22L14 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2M13 14H11V12H13V14M13 10H11V6H13V10Z"/>
        </svg>
      </button>
      
      <div class="plugai-chatbot-window" id="${instanceId}-window">
        <div class="plugai-chatbot-header">
          <span>${finalSettings.title}</span>
          <button class="plugai-chatbot-close" id="${instanceId}-close">×</button>
        </div>
        
        <div class="plugai-chatbot-messages" id="${instanceId}-messages">
          <div class="plugai-chatbot-message assistant">
            <div class="message-content">${finalSettings.greeting}</div>
          </div>
          <div class="plugai-chatbot-typing" id="${instanceId}-typing">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        </div>
        
        <div class="plugai-chatbot-input-container">
          <div class="plugai-chatbot-input">
            <input type="text" placeholder="${finalSettings.placeholder}" id="${instanceId}-input">
            <button class="plugai-chatbot-send" id="${instanceId}-send">
              <svg viewBox="0 0 24 24">
                <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
              </svg>
            </button>
          </div>
        </div>
        
        ${
          finalSettings.showBranding
            ? `
          <div class="plugai-chatbot-branding">
            Powered by <a href="https://plugai.top" target="_blank">Plugai</a>
          </div>
        `
            : ""
        }
      </div>
    </div>
  `;

  // Add chatbot to page
  document.body.insertAdjacentHTML("beforeend", chatbotHTML);

  // Get elements
  const container = document.getElementById(instanceId);
  const button = document.getElementById(instanceId + "-button");
  const window = document.getElementById(instanceId + "-window");
  const closeBtn = document.getElementById(instanceId + "-close");
  const messages = document.getElementById(instanceId + "-messages");
  const input = document.getElementById(instanceId + "-input");
  const sendBtn = document.getElementById(instanceId + "-send");
  const typingIndicator = document.getElementById(instanceId + "-typing");

  // State
  let isOpen = false;
  let userInfo = {};
  let conversationId = null;

  // Event listeners
  button.addEventListener("click", toggleWindow);
  closeBtn.addEventListener("click", closeWindow);
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
  });

  function toggleWindow() {
    isOpen = !isOpen;
    window.classList.toggle("open", isOpen);
    if (isOpen) {
      input.focus();
      trackEvent("widget_opened");
    }
  }

  function closeWindow() {
    isOpen = false;
    window.classList.remove("open");
    trackEvent("widget_closed");
  }

  function addMessage(content, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `plugai-chatbot-message ${sender}`;
    messageDiv.innerHTML = `<div class="message-content">${content}</div>`;

    // Insert before typing indicator
    messages.insertBefore(messageDiv, typingIndicator);
    messages.scrollTop = messages.scrollHeight;
  }

  function showTyping() {
    typingIndicator.classList.add("show");
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    typingIndicator.classList.remove("show");
  }

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, "user");
    input.value = "";
    sendBtn.disabled = true;

    // Show typing
    showTyping();

    try {
      // Call API
      const response = await fetch(`${finalSettings.apiUrl}/api/gemini/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
          chatbotId: chatbotId,
          conversationId: conversationId,
          userInfo: userInfo,
        }),
      });

      const data = await response.json();

      // Hide typing and show response
      hideTyping();
      addMessage(
        data.response || "Xin lỗi, tôi gặp vấn đề kỹ thuật.",
        "assistant",
      );

      // Save conversation
      if (data.success) {
        conversationId = data.conversationId || conversationId;

        // Save conversation to backend
        fetch(`${finalSettings.apiUrl}/api/conversations/save`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chatbotId: chatbotId,
            conversationId: conversationId,
            userMessage: message,
            botResponse: data.response,
            userInfo: userInfo,
            timestamp: new Date().toISOString(),
          }),
        });
      }

      trackEvent("message_sent", { message_length: message.length });
    } catch (error) {
      console.error("Chatbot error:", error);
      hideTyping();
      addMessage(
        "Xin lỗi, tôi gặp vấn đề kỹ thuật. Vui lòng thử lại sau.",
        "assistant",
      );
    }

    sendBtn.disabled = false;
  }

  function trackEvent(eventName, data = {}) {
    // Track events for analytics
    fetch(`${finalSettings.apiUrl}/api/analytics/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chatbotId: chatbotId,
        event: eventName,
        data: data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    }).catch(() => {}); // Ignore errors for tracking
  }

  // Initialize
  trackEvent("widget_loaded");

  // Auto-open on mobile if configured
  if (window.innerWidth <= 768 && finalSettings.autoOpenMobile) {
    setTimeout(toggleWindow, 1000);
  }
})();
