import { createContext } from "react";
import { AppColors, ThemeMode } from "@/app/constants/theme";

export const ThemeContext = createContext<{
  mode: ThemeMode;
  colors: AppColors;
  setMode: (mode: ThemeMode) => Promise<void>;
} | undefined>(undefined);
