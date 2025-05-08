// src/context/MyContext.js
import React, { createContext, useState, useEffect } from 'react';

export const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [value, setValue] = useState('initial value');

  useEffect(() => {
    // Effect to run whenever 'value' changes
    console.log('Value changed:', value);
    // You can add any side effects here
  }, [value]);

  return (
    <MyContext.Provider value={{ value, setValue }}>
      {children}
    </MyContext.Provider>
  );
};
