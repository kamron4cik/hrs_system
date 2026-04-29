import React, { createContext, useContext, useState } from 'react';
import { formatCurrency } from '../utils/currency';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(
    () => localStorage.getItem('currency') || 'USD'
  );

  const changeCurrency = (c) => {
    setCurrency(c);
    localStorage.setItem('currency', c);
  };

  const format = (usdAmount) => formatCurrency(usdAmount, currency);

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, format }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
