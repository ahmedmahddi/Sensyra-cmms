"use client";

import { useWorkOrders } from "@/hooks/use-work-orders";
import { useAssets } from "@/hooks/use-assets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Box, AlertTriangle, CheckCircle } from "lucide-react";

export default function DashboardPage() {
  const { data: workOrders } = useWorkOrders();
  const { data: assets } = useAssets();

  const openWOs = workOrders?.filter(wo => wo.status === "OPEN").length || 0;
  const inProgressWOs = workOrders?.filter(wo => wo.status === "IN_PROGRESS").length || 0;
  const completedWOs = workOrders?.filter(wo => wo.status === "COMPLETED").length || 0;
  const totalAssets = assets?.length || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your maintenance operations.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Work Orders</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openWOs}</div>
            <p className="text-xs text-muted-foreground">Awaiting assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <ClipboardList className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressWOs}</div>
            <p className="text-xs text-muted-foreground">Being worked on</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedWOs}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Box className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <p className="text-xs text-muted-foreground">Registered equipment</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {workOrders && workOrders.length > 0 ? (
              <ul className="space-y-2">
                {workOrders.slice(0, 5).map((wo) => (
                  <li key={wo.id} className="flex justify-between items-center text-sm">
                    <span>{wo.title}</span>
                    <span className="text-muted-foreground">{wo.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No work orders yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {assets && assets.length > 0 ? (
              <ul className="space-y-2">
                {assets.slice(0, 5).map((asset) => (
                  <li key={asset.id} className="flex justify-between items-center text-sm">
                    <span>{asset.name}</span>
                    <span className="text-muted-foreground">{asset.status}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No assets registered.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
