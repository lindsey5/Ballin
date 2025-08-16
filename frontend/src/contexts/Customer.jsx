import { createContext, useEffect, useState } from "react";
import { fetchData } from "../services/api";

export const CustomerContext = createContext();

export const CustomerContextProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCustomer = async () => {
      setLoading(true)
      const response = await fetchData('/api/customers');
      if (response.customer) setCustomer(response.customer);
      setLoading(false)
    };

    getCustomer()
  }, []);

  return (
      <CustomerContext.Provider value={{ customer, setCustomer, loading }}>
        {children}
      </CustomerContext.Provider>
  );
};