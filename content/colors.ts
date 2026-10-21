export type ColorId = "red" | "white" | "pink" | "yellow" | "purple" | "orange";
export type TulipType = "classic" | "double";

// Labels live in the dictionaries (content/dict)
export const COLOR_HEX: Record<ColorId, string> = {
  red: "#D03A47",
  white: "#F2F2F2",
  pink: "#F08CA8",
  yellow: "#F2C53D",
  purple: "#7B4FA3",
  orange: "#F08A3C",
};

export const COLOR_IDS = Object.keys(COLOR_HEX) as ColorId[];
export const TULIP_TYPES: TulipType[] = ["classic", "double"];
