import { RequestHandler } from "express";

export interface AnalyticsEvent {
  chatbotId: string;
  event: string;
  data?: any;
  timestamp: string;
  userAgent?: string;
  url?: string;
}

export const handleTrackEvent: RequestHandler = async (req, res) => {
  try {
    const eventData: AnalyticsEvent = req.body;

    // In a real app, this would save to database
    // For now, we'll just log and return success
    console.log("Analytics Event:", {
      chatbotId: eventData.chatbotId,
      event: eventData.event,
      timestamp: eventData.timestamp,
      url: eventData.url,
    });

    // Update chatbot embed views if it's a widget_loaded event
    if (eventData.event === "widget_loaded") {
      // This would normally update database
      // For demo, we could update localStorage via a different endpoint
    }

    res.json({
      success: true,
      message: "Event tracked successfully",
    });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to track event",
    });
  }
};

export const handleGetAnalytics: RequestHandler = async (req, res) => {
  try {
    const { chatbotId } = req.params;
    const { timeframe = "7d" } = req.query;

    // In a real app, this would query database for analytics
    // For demo, return mock data
    const mockAnalytics = {
      chatbotId,
      timeframe,
      metrics: {
        totalViews: 1240,
        totalConversations: 156,
        uniqueUsers: 89,
        avgSessionDuration: 180,
        bounceRate: 0.25,
        topPages: [
          { url: "/products", views: 450 },
          { url: "/contact", views: 320 },
          { url: "/support", views: 280 },
        ],
        hourlyStats: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          views: Math.floor(Math.random() * 50) + 10,
          conversations: Math.floor(Math.random() * 20) + 2,
        })),
        deviceBreakdown: {
          desktop: 65,
          mobile: 30,
          tablet: 5,
        },
        browserBreakdown: {
          chrome: 45,
          safari: 25,
          firefox: 15,
          edge: 10,
          other: 5,
        },
      },
      generatedAt: new Date().toISOString(),
    };

    res.json(mockAnalytics);
  } catch (error) {
    console.error("Get analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get analytics",
    });
  }
};
