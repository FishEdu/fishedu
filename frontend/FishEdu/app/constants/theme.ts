export type ThemeMode = "light" | "dark";

export type AppColors = {
  background: {
    app: string;
    card: string;
    primarySoft: string;
    dangerSoft: string;
    secondarySoft: string;
    overlay: string;
  };
  border: {
    card: string;
    subtle: string;
  };
  text: {
    main: string;
    muted: string;
    onPrimary: string;
  };
  primary: string;
  secondary: string;
  danger: string;
  favorite: string;
  badges: {
    all: { background: string; text: string; border: string };
    beginner: { background: string; text: string; border: string };
    advanced: { background: string; text: string; border: string };
  };
};

export const lightColors: AppColors = {
  background: {
    app: "#f0f4f8",
    card: "#ffffff",
    primarySoft: "#e7f4fb",
    dangerSoft: "#fdecea",
    secondarySoft: "#e6f7f5",
    overlay: "rgba(26, 54, 93, 0.28)",
  },
  border: { card: "#e4e9f0", subtle: "#d9e2ec" },
  text: { main: "#1a365d", muted: "#627d98", onPrimary: "#ffffff" },
  primary: "#0e87cc",
  secondary: "#20b2aa",
  danger: "#e05345",
  favorite: "#f5b301",
  badges: {
    all: { background: "#f0f4f8", text: "#486581", border: "#d9e2ec" },
    beginner: { background: "#e6f4ea", text: "#2e7d32", border: "#c2e7ca" },
    advanced: { background: "#f0f0fa", text: "#5a67d8", border: "#d6d6f5" },
  },
};

export const darkColors: AppColors = {
  background: {
    app: "#10202d",
    card: "#172d3d",
    primarySoft: "#153d58",
    dangerSoft: "#472826",
    secondarySoft: "#173d3a",
    overlay: "rgba(0, 0, 0, 0.42)",
  },
  border: { card: "#29485c", subtle: "#3b5a6e" },
  text: { main: "#edf6fb", muted: "#b1c4d2", onPrimary: "#ffffff" },
  primary: "#3ca9e8",
  secondary: "#4bc8bb",
  danger: "#f17a70",
  favorite: "#f6c65b",
  badges: {
    all: { background: "#1c3547", text: "#c4d7e4", border: "#3b5a6e" },
    beginner: { background: "#1c3c32", text: "#9cdeb1", border: "#356751" },
    advanced: { background: "#2c304f", text: "#bdc4ff", border: "#555d91" },
  },
};
