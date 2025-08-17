import { createContext, useEffect, useState } from "react";
import { fetchData } from "../services/api";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true)
      try{
        const response = await fetchData('/api/user');
        if (response.success) setUser(response.user);
      }catch(err){
        console.log(err)
      }
      setLoading(false)
    };

    getUser()
  }, []);

  return (
      <UserContext.Provider value={{ user, setUser, loading }}>
        {children}
      </UserContext.Provider>
  );
};