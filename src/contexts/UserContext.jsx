import React, { createContext, useState } from 'react';

// Создаем контекст для пользователя
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Изначально пользователь не авторизован

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
