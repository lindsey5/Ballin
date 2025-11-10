import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { createContext } from 'react';

const SOCKET_URL = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:3000';

export const SocketContext = createContext();

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [namespace, setNamespace] = useState('');

  useEffect(() => {
    if (namespace === undefined) return; 

    const newSocket = io(`${SOCKET_URL}${namespace}`, {
      withCredentials: true,
    });

    newSocket.on('connect', () => {
      console.log('Connected to Socket');
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [namespace]);

  return (
    <SocketContext.Provider value={{ socket, setNamespace }}>
      {children}
    </SocketContext.Provider>
  );
};
