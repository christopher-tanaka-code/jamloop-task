import type { Database } from "./database";

export type Campaign = Database["public"]["Tables"]["campaigns"]["Row"];
export type CampaignInsert =
  Database["public"]["Tables"]["campaigns"]["Insert"];
export type CampaignUpdate =
  Database["public"]["Tables"]["campaigns"]["Update"];

export type Gender = Database["public"]["Enums"]["gender"];
export type Screen = Database["public"]["Enums"]["screen"];
export type Publisher = Database["public"]["Enums"]["publisher"];

export type CampaignFormData = {
  name: string;
  budget_usd: number;
  start_date: string;
  end_date: string;
  age_min: number;
  age_max: number;
  gender: Gender;
  country: string;
  state: string;
  city: string;
  zip: string;
  inventory: Publisher[];
  screens: Screen[];
};

export type ListQuery = {
  page?: number;
  pageSize?: number;
  search?: string;
  from?: string;
  to?: string;
  screens?: string[];
  inventory?: string[];
};
