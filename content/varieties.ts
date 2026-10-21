import type { ColorId, TulipType } from "./colors";

// Stock status is not stored here: it comes from the season source by color × type
export type Variety = {
  slug: string;
  name: string;
  color: ColorId;
  type: TulipType;
  photos: string[];
  stemLength?: number;
  vaseLife?: number;
};

// Placeholders until Tatiana sends the list of 46 varieties with color and type
export const VARIETIES: Variety[] = [
  { slug: "sort-1", name: "[СОРТ 1]", color: "red", type: "classic", photos: [] },
  { slug: "sort-2", name: "[СОРТ 2]", color: "red", type: "classic", photos: [] },
  { slug: "sort-3", name: "[СОРТ 3]", color: "white", type: "classic", photos: [] },
  { slug: "sort-4", name: "[СОРТ 4]", color: "pink", type: "classic", photos: [] },
  { slug: "sort-5", name: "[СОРТ 5]", color: "pink", type: "classic", photos: [] },
  { slug: "sort-6", name: "[СОРТ 6]", color: "yellow", type: "classic", photos: [] },
  { slug: "sort-7", name: "[СОРТ 7]", color: "purple", type: "classic", photos: [] },
  { slug: "sort-8", name: "[СОРТ 8]", color: "orange", type: "classic", photos: [] },
  { slug: "sort-9", name: "[СОРТ 9]", color: "pink", type: "double", photos: [] },
  { slug: "sort-10", name: "[СОРТ 10]", color: "white", type: "double", photos: [] },
];
