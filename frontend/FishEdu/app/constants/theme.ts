export type ThemeMode = "light" | "dark";

export type AppColors = {
  background: {
    app: string;
    card: string;
    primarySoft: string;
    dangerSoft: string;
    secondarySoft: string;
    overlay: string;
    photoOverlay: string;
  };
  border: { card: string; subtle: string };
  text: { main: string; muted: string; onPrimary: string };
  primary: string;
  secondary: string;
  danger: string;
  favorite: string;
};

export const lightColors: AppColors = {
  background: {
    app: "#f0f4f8",
    card: "#ffffff",
    primarySoft: "#e7f4fb",
    dangerSoft: "#fdecea",
    secondarySoft: "#e6f7f5",
    overlay: "rgba(26, 54, 93, 0.28)",
    photoOverlay: "rgba(0, 0, 0, 0.65)",
  },
  border: { card: "#e4e9f0", subtle: "#d9e2ec" },
  text: { main: "#1a365d", muted: "#627d98", onPrimary: "#ffffff" },
  primary: "#0e87cc",
  secondary: "#20b2aa",
  danger: "#e05345",
  favorite: "#f5b301",
};

export const darkColors: AppColors = {
  background: {
    app: "#10202d",
    card: "#172d3d",
    primarySoft: "#153d58",
    dangerSoft: "#472826",
    secondarySoft: "#173d3a",
    overlay: "rgba(0, 0, 0, 0.42)",
    photoOverlay: "rgba(0, 0, 0, 0.65)",
  },
  border: { card: "#29485c", subtle: "#3b5a6e" },
  text: { main: "#edf6fb", muted: "#b1c4d2", onPrimary: "#ffffff" },
  primary: "#3ca9e8",
  secondary: "#4bc8bb",
  danger: "#f17a70",
  favorite: "#f6c65b",
};
