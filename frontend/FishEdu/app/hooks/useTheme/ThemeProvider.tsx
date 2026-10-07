import { ReactNode, useEffect, useRef, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { darkColors, lightColors, ThemeMode } from "@/app/constants/theme";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const changedByUser = useRef(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem("themeMode")
      .then(savedMode => {
        if (active && !changedByUser.current && (savedMode === "light" || savedMode === "dark")) {
          setModeState(savedMode);
        }
      })
      .catch(error => console.error("Failed to load theme", error));
    return () => { active = false; };
  }, []);

  useEffect(() => {
    Appearance.setColorScheme(mode);
  }, [mode]);

  const setMode = async (nextMode: ThemeMode) => {
    changedByUser.current = true;
    setModeState(nextMode);
    try {
      await AsyncStorage.setItem("themeMode", nextMode);
    } catch (error) {
      console.error("Failed to save theme", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, colors: mode === "dark" ? darkColors : lightColors, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
