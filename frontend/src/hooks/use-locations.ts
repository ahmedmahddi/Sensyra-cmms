import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface Location {
  id: string;
  name: string;
  // Add other fields as needed
}

export function useLocations() {
  return useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await api.get("/locations");
      return res.data;
    },
  });
}
