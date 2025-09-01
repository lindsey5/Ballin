import { useEffect, useState } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';
import { SocketContext } from './Socket';
import useFetch from '../hooks/useFetch';

export const NotificationContext = createContext();

export const NotificationsContextProvider = ({ children }) => {
  const [lowStockNotifications, setLowStockNotifications] = useState([]);
  const { data : lowStockRes } = useFetch('/api/low-stocks');
  const { socket } = useContext(SocketContext);

  useEffect(() => {
    if(!lowStockRes?.lowStockNotifications) return;

    setLowStockNotifications(lowStockRes?.lowStockNotifications)

  }, [lowStockRes])

  useEffect(() => {
    socket.on("receiveLowStockNotification", (notification) => {
        setLowStockNotifications(prev => [...prev, notification])
    });

    return () => {
        socket.off("receiveLowStockNotification");
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ lowStockNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};
