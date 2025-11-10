import { initLowStockNotifications, initNotifications } from "./notificationSocket.js";

let defaultNamespace;

export default function registerSockets(io) {
    defaultNamespace = io;
    initLowStockNotifications(io);
    initNotifications(io);
}

export function successCheckout(id) {
    if(!defaultNamespace) return;
    defaultNamespace.to(id).emit('successCheckout');
}