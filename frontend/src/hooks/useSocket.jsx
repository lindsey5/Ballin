import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';

const SOCKET_URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

export const useSocket = (namespace) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (namespace === undefined) return; 

    const newSocket = io(`${SOCKET_URL}${namespace}`, {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log(`Connected to Socket: ${namespace}`);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
        console.log('Socket disconnected');
      }
    };
  }, [namespace]);

  return { socket }
};
