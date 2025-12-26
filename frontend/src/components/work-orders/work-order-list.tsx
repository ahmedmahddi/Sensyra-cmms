"use client";

import { useWorkOrders, WorkOrderPriority, WorkOrderStatus } from "@/hooks/use-work-orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const getPriorityColor = (priority: WorkOrderPriority) => {
  switch (priority) {
    case WorkOrderPriority.CRITICAL:
      return "destructive";
    case WorkOrderPriority.HIGH:
      return "destructive"; // Or maybe orange if we had it
    case WorkOrderPriority.MEDIUM:
      return "secondary"; // Blue-ish
    case WorkOrderPriority.LOW:
      return "outline";
    default:
      return "outline";
  }
};

const getStatusColor = (status: WorkOrderStatus) => {
  switch (status) {
    case WorkOrderStatus.COMPLETED:
      return "default"; // Black/Primary
    case WorkOrderStatus.IN_PROGRESS:
      return "secondary";
    case WorkOrderStatus.OPEN:
      return "outline";
    default:
      return "outline";
  }
};

export function WorkOrdersList() {
  const { data: workOrders, isLoading, isError } = useWorkOrders();

  if (isLoading) {
    return <div>Loading work orders...</div>;
  }

  if (isError) {
    return <div className="text-destructive">Error loading work orders.</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Work Orders</h2>
          <p className="text-muted-foreground">
            Manage your maintenance tasks and service requests.
          </p>
        </div>
        <Button asChild>
          <Link href="/work-orders/new">
            <Plus className="mr-2 h-4 w-4" /> Create Work Order
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>WO #</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders && workOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No work orders found.
                </TableCell>
              </TableRow>
            )}
            {workOrders?.map((wo) => (
              <TableRow key={wo.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{wo.number}</TableCell>
                <TableCell>{wo.title}</TableCell>
                <TableCell>
                  <Badge variant={getPriorityColor(wo.priority)}>
                    {wo.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(wo.status)}>
                    {wo.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>{wo.asset?.name || "-"}</TableCell>
                <TableCell>
                  {wo.assignedTo
                    ? `${wo.assignedTo.firstName} ${wo.assignedTo.lastName}`
                    : "Unassigned"}
                </TableCell>
                <TableCell>
                  {wo.dueDate ? format(new Date(wo.dueDate), "MMM d, yyyy") : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
