import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import useFetch from '../hooks/useFetch';
import { useSocket } from '../hooks/useSocket';
import { UserContext } from './User';
import { fetchData } from '../services/api';
import { signout } from '../services/auth';

export const LowStockNotificationContext = createContext();

export const NotificationContext = createContext();

export const LowStockNotificationsContextProvider = ({ children }) => {
  const [lowStockNotifications, setLowStockNotifications] = useState([]);
  const { data : lowStockRes } = useFetch('/api/low-stocks');
  const { socket } = useSocket('/low-stock-notifications');

  useEffect(() => {
    if(!lowStockRes?.lowStockNotifications) return;

    setLowStockNotifications(lowStockRes?.lowStockNotifications)

  }, [lowStockRes])

  useEffect(() => {
    if(!socket) return;

    socket.on("receiveLowStockNotification", (notification) => {
        setLowStockNotifications(prev => [...prev, notification])
    });

    return () => {
        socket.off("receiveLowStockNotification");
    };
  }, [socket]);

  return (
    <LowStockNotificationContext.Provider value={{ lowStockNotifications }}>
      {children}
    </LowStockNotificationContext.Provider>
  );
};

export const NotificationsContextProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useContext(UserContext);
  const [unread, setUnread] = useState(0);

  const { socket } = useSocket("/notifications");

  // Fetch notifications when page changes
  const fetchNotifications = async (pageToFetch = 1) => {
    const role = user?.role === "Admin" || user?.role === "Owner" ? "admin" : "";

    const response = await fetchData(`/api/notifications/${role}?page=${pageToFetch}&limit=${limit}`);

    if (response.success) {
      if (pageToFetch === 1) {
        setNotifications(response.notifications);
      } else {
        setNotifications((prev) => [...prev, ...response.notifications]);
      }
      setUnread(response.unread);
      setHasMore(pageToFetch < response.totalPages);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications(1);
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    socket.on("receiveNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnread(prev => prev + 1)
    });

    socket.on('logout', async () => {
      await signout();
    })

    socket.on('successCheckout', () => window.close())

    return () => {
      socket.off('logout');
      socket.off("receiveNotification");
    };
  }, [socket]);

  const loadNextPage = () => {
    if (hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchNotifications(nextPage);
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, loadNextPage, hasMore, page, unread }}
    >
      {children}
    </NotificationContext.Provider>
  );
};