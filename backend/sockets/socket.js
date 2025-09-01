import { initNotifications } from "./notificationSocket.js";

export default function registerSockets(io) {
    initNotifications(io);
}