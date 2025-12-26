import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api.get("/users");
      return res.data;
    },
  });
}
