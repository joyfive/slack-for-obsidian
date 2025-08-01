// colorThemeMap.ts

export type ColorThemeKey = "yellow" | "cyan" | "fuchsia" | "emerald";

type ColorTheme = {
  groupBg: string;
  groupBorder: string;
  groupShadow: string;
  messageShadow: string;
  messageBg: string;
  cornerColor: string;
  tapeBg: string;
  tapeCorner: string;
};

export const colorThemeMap: Record<ColorThemeKey, ColorTheme> = {
  yellow: {
    groupBg: "bg-yellow-100",
    groupBorder: "border border-yellow-200",
    groupShadow: "shadow-yellow-200 shadow-md",
    messageShadow: "shadow-yellow-100 shadow-md",
    messageBg: "bg-yellow-50",
    cornerColor: "fold-note-yellow",
    tapeBg: "bg-yellow-300 bg-opacity-50",
    tapeCorner: "fold-note-yellow",
  },
  cyan: {
    groupBg: "bg-cyan-100",
    groupBorder: "border border-cyan-200",
    groupShadow: "shadow-cyan-200 shadow-md",
    messageShadow: "shadow-cyan-100 shadow-md",
    messageBg: "bg-cyan-50",
    cornerColor: "fold-note-cyan",
    tapeBg: "bg-cyan-300 bg-opacity-50",
    tapeCorner: "fold-note-cyan",
  },
  fuchsia: {
    groupBg: "bg-fuchsia-100",
    groupBorder: "border border-fuchsia-200",
    groupShadow: "shadow-fuchsia-200 shadow-md",
    messageShadow: "shadow-fuchsia-100 shadow-md",
    messageBg: "bg-fuchsia-50",
    cornerColor: "fold-note-fuchsia",
    tapeBg: "bg-fuchsia-300 bg-opacity-50",
    tapeCorner: "fold-note-fuchsia",
  },
  emerald: {
    groupBg: "bg-emerald-100",
    groupBorder: "border border-emerald-200",
    groupShadow: "shadow-emerald-200 shadow-md",
    messageShadow: "shadow-emerald-100 shadow-md",
    messageBg: "bg-emerald-50",
    cornerColor: "fold-note-emerald",
    tapeBg: "bg-emerald-300 bg-opacity-50",
    tapeCorner: "fold-note-emerald",
  },
};
