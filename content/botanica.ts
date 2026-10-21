// Structures for Botanica; filled with placeholders until Tatiana sends the price list and real projects
export type Segment = "private" | "office" | "horeca" | "designer";

export type Plant = {
  slug: string;
  name?: string;
  latinName?: string;
  photos: string[];
  size?: string;
  availability: "in_stock" | "to_order";
  leadDays: number;
  price?: number;
};

export type Project = {
  slug: string;
  title?: string;
  objectType: Exclude<Segment, "designer">;
  district?: string;
  photos: string[];
  plants: string[];
};

export const PLANTS: Plant[] = [
  { slug: "plant-1", photos: [], availability: "in_stock", leadDays: 0 },
  { slug: "plant-2", photos: [], availability: "in_stock", leadDays: 0 },
  { slug: "plant-3", photos: [], availability: "in_stock", leadDays: 0 },
  { slug: "plant-4", photos: [], availability: "to_order", leadDays: 21 },
  { slug: "plant-5", photos: [], availability: "to_order", leadDays: 21 },
  { slug: "plant-6", photos: [], availability: "to_order", leadDays: 21 },
];

export const PROJECTS: Project[] = [
  { slug: "project-1", objectType: "private", photos: [], plants: [] },
  { slug: "project-2", objectType: "office", photos: [], plants: [] },
  { slug: "project-3", objectType: "horeca", photos: [], plants: [] },
];
