import { createContext, useEffect, useState } from "react";
import { fetchData } from "../services/api";

export const CustomerContext = createContext();

export const CustomerContextProvider = ({ children }) => {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const getCustomer = async () => {
      const response = await fetchData('/api/customers');

      if (response.customer) setCustomer(response.customer);
    };

    getCustomer()
  }, []);

  return (
      <CustomerContext.Provider value={{ customer, setCustomer }}>
        {children}
      </CustomerContext.Provider>
  );
};