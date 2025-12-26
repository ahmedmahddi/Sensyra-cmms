import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export enum WorkOrderPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum WorkOrderStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  ON_HOLD = "ON_HOLD",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface WorkOrder {
  id: string;
  number: string;
  title: string;
  description?: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  asset?: {
    id: string;
    name: string;
    assetTag: string;
  };
  dueDate?: string;
  createdAt: string;
}

export function useWorkOrders() {
  return useQuery<WorkOrder[]>({
    queryKey: ["work-orders"],
    queryFn: async () => {
      const res = await api.get("/work-orders");
      return res.data;
    },
  });
}
