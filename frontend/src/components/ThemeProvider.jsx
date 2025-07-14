import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe ser usado dentro de un ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved
      ? JSON.parse(saved)
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem("highContrast");
    return saved ? JSON.parse(saved) : false;
  });

  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem("fontSize");
    return saved ? parseInt(saved) : 16;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    localStorage.setItem("highContrast", JSON.stringify(highContrast));
    localStorage.setItem("fontSize", fontSize.toString());

    // Aplicar tema al documento
    document.documentElement.setAttribute(
      "data-theme",
      isDarkMode ? "dark" : "light",
    );
    document.documentElement.setAttribute(
      "data-contrast",
      highContrast ? "high" : "normal",
    );
    document.documentElement.style.fontSize = `${fontSize}px`;

    // Aplicar variables CSS
    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty("--bg-primary", "#0F172A");
      root.style.setProperty("--bg-secondary", "#1E293B");
      root.style.setProperty("--text-primary", "#F8FAFC");
      root.style.setProperty("--text-secondary", "#94A3B8");
      root.style.setProperty("--border-color", "#334155");
      root.style.setProperty("--accent-color", "#3B82F6");
    } else {
      root.style.setProperty("--bg-primary", "#FFFFFF");
      root.style.setProperty("--bg-secondary", "#F1F5F9");
      root.style.setProperty("--text-primary", "#1E293B");
      root.style.setProperty("--text-secondary", "#64748B");
      root.style.setProperty("--border-color", "#E2E8F0");
      root.style.setProperty("--accent-color", "#3B82F6");
    }

    if (highContrast) {
      root.style.setProperty("--text-primary", "#000000");
      root.style.setProperty("--bg-primary", "#FFFFFF");
      root.style.setProperty("--accent-color", "#0000FF");
    }
  }, [isDarkMode, highContrast, fontSize]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleHighContrast = () => setHighContrast(!highContrast);
  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 24));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12));

  const value = {
    isDarkMode,
    highContrast,
    fontSize,
    toggleDarkMode,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
