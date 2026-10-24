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

// A flower's real color: cream varieties are sold in the white line but filtered and labelled as cream
export type Shade = ColorId | "cream";
export const SHADE_HEX: Record<Shade, string> = { ...COLOR_HEX, cream: "#F2E3B3" };
export const SHADES: Shade[] = ["red", "white", "cream", "pink", "yellow", "purple", "orange"];
export const TULIP_TYPES: TulipType[] = ["classic", "double"];
