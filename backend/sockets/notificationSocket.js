import jwt from "jsonwebtoken";
import cookie from "cookie";

export let notifNamespace;

export function initNotifications(io) {
  notifNamespace = io.of("/notifications");

  notifNamespace.on("connection", (socket) => {
    try {
      // Parse cookies safely
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.jwt;

      if (!token) {
        console.log("No token, disconnecting");
        return socket.disconnect();
      }

      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      
      const userId = decodedToken.id;
      socket.join(userId);
      console.log("User connected:", userId);

      socket.on("disconnect", () => {
        console.log("User disconnected:", userId);
      });
    } catch (err) {
      console.log("Error verifying token:", err.message);
      socket.disconnect();
    }
  });
}

// Exported emit function (can be used in controllers)
export function emitLowStockNotification(data, to) {
  if (notifNamespace) {
    notifNamespace.to(to).emit("receiveLowStockNotification", data);
    console.log("📨 Notification sent to:", to);
  } else {
    console.warn("⚠️ Notifications namespace not initialized yet.");
  }
}