import { initLowStockNotifications, initNotifications } from "./notificationSocket.js";

export default function registerSockets(io) {
    initLowStockNotifications(io);
    initNotifications(io);
}