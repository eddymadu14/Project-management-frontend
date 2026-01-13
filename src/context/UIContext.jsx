import { createContext, useContext, useState } from "react";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <UIContext.Provider value={{ darkMode, setDarkMode, sidebarOpen, setSidebarOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);

