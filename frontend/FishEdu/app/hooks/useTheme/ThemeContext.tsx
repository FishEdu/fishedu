import { AppColors, ThemeMode } from "@/app/constants/theme";
import { createContext } from "react";

export type ThemeContextType = {
  colors: AppColors;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => Promise<void>;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);
