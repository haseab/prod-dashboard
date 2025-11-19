"use client";

import { useState, useEffect } from "react";

interface Notification {
  id: string;
  message: string;
  title: string;
  severity: string;
  createdAt: string;
  sendCount: number;
}

export default function AcknowledgePage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [acknowledging, setAcknowledging] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      const data = await response.json();
      setNotifications(data.notifications || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const acknowledgeAll = async () => {
    setAcknowledging(true);
    try {
      const response = await fetch("/api/notifications/acknowledge", {
        method: "PUT",
      });

      if (response.ok) {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error acknowledging:", error);
    } finally {
      setAcknowledging(false);
    }
  };

  const acknowledgeOne = async (id: string) => {
    setAcknowledging(true);
    try {
      const response = await fetch("/api/notifications/acknowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Error acknowledging:", error);
    } finally {
      setAcknowledging(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "error":
        return "bg-orange-500";
      case "warning":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const getTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">
            🚨 Alert Acknowledgment
          </h1>
          <div className="text-sm text-gray-400">
            {notifications.length} active
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <div className="text-xl text-white mb-2">All Clear!</div>
            <div className="text-gray-400">No pending notifications</div>
          </div>
        ) : (
          <>
            <button
              onClick={acknowledgeAll}
              disabled={acknowledging}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-4 px-6 rounded-lg mb-4 text-lg transition-colors"
            >
              {acknowledging ? "Acknowledging..." : "✓ Acknowledge All"}
            </button>

            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-gray-800 rounded-lg p-4 border-l-4"
                  style={{
                    borderLeftColor:
                      notification.severity === "critical"
                        ? "#ef4444"
                        : notification.severity === "error"
                        ? "#f97316"
                        : "#eab308",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold text-white ${getSeverityColor(
                            notification.severity
                          )}`}
                        >
                          {notification.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400">
                          {getTimeSince(notification.createdAt)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-white text-lg">
                        {notification.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-3">{notification.message}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Sent {notification.sendCount} time
                      {notification.sendCount !== 1 ? "s" : ""}
                    </div>
                    <button
                      onClick={() => acknowledgeOne(notification.id)}
                      disabled={acknowledging}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors"
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="mt-6 text-center text-gray-500 text-sm">
          Auto-refreshing every 10s
        </div>
      </div>
    </div>
  );
}
