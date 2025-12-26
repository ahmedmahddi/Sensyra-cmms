"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InventoryStats } from "@/components/inventory/inventory-stats";
import { InventoryList } from "@/components/inventory/inventory-list";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Manage parts, tools, and consumables.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      <InventoryStats />
      
      <InventoryList />
    </div>
  );
}
