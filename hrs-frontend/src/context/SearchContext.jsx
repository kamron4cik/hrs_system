import React, { createContext, useState } from 'react';
import { addDays } from 'date-fns';

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({
    city: '',
    checkIn: new Date(),
    checkOut: addDays(new Date(), 1),
    guests: 1,
  });

  const updateSearch = (params) => {
    setSearchParams((prev) => ({ ...prev, ...params }));
  };

  return (
    <SearchContext.Provider value={{ searchParams, updateSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
