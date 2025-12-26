import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export enum AssetStatus {
  OPERATIONAL = "OPERATIONAL",
  DOWN = "DOWN",
  MAINTENANCE = "MAINTENANCE",
  RETIRED = "RETIRED",
}

export interface Asset {
  id: string;
  name: string;
  description?: string;
  assetTag: string;
  category?: string;
  manufacturer?: string;
  model?: string;
  status: AssetStatus;
  location?: {
    id: string;
    name: string;
  };
  parentId?: string;
  children?: Asset[];
}

export function useAssets() {
  return useQuery<Asset[]>({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await api.get("/assets");
      return res.data;
    },
  });
}

export function useAsset(id: string) {
  return useQuery<Asset>({
    queryKey: ["assets", id],
    queryFn: async () => {
      const res = await api.get(`/assets/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}
