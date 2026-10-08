import { ThemeMode, darkColors, lightColors } from "@/app/constants/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const THEME_MODE_KEY = "themeMode";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    AsyncStorage.getItem(THEME_MODE_KEY).then(value => {
      if (value === "light" || value === "dark") setModeState(value);
    });
  }, []);

  const setMode = async (nextMode: ThemeMode) => {
    setModeState(nextMode);
    await AsyncStorage.setItem(THEME_MODE_KEY, nextMode);
  };

  return (
    <ThemeContext.Provider value={{ colors: mode === "dark" ? darkColors : lightColors, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
