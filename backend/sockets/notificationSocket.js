import jwt from "jsonwebtoken";
import cookie from "cookie";
import Admin from "../models/Admin.js";

export let lowStockNotifNamespace;
export let notifNamespace;

export function initLowStockNotifications(io) {
  lowStockNotifNamespace = io.of("/low-stock-notifications");

  lowStockNotifNamespace.on("connection", async (socket) => {
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

      const admin = await Admin.findByPk(userId);

      if(!admin){
        console.log("Admin not found");
        return socket.disconnect();
      }

      socket.join(userId);
      console.log("User connected to LowStockNotifications namespace:", userId);

      socket.on("disconnect", () => {
        console.log("User disconnected:", userId);
      });
    } catch (err) {
      console.log("Error verifying token:", err.message);
      socket.disconnect();
    }
  });
}

export function initNotifications(io) {
  notifNamespace = io.of("/notifications");

  notifNamespace.on("connection", async (socket) => {
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
      console.log("User connected to Notifications namespace:", userId);

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
  if (lowStockNotifNamespace) {
    lowStockNotifNamespace.to(to).emit("receiveLowStockNotification", data);
    console.log("📨 Notification sent to:", to);
  } else {
    console.warn("⚠️ Notifications namespace not initialized yet.");
  }
}

export function emitNotification(data, to) {
  if (notifNamespace) {
    notifNamespace.to(to).emit("receiveNotification", data);
    console.log("📨 Notification sent to:", to);
  } else {
    console.warn("⚠️ Notifications namespace not initialized yet.");
  }
}