"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data
const inventory = [
  { id: 1, name: "Air Filter Type A", sku: "FIL-001", quantity: 15, minQuantity: 5, price: 25.00, location: "Shelf A-1" },
  { id: 2, name: "Hydraulic Oil (5L)", sku: "OIL-050", quantity: 3, minQuantity: 5, price: 120.00, location: "Cabinet B" },
  { id: 3, name: "M6 Bolts (Pack of 100)", sku: "BLT-006", quantity: 50, minQuantity: 20, price: 15.50, location: "Bin C-3" },
  { id: 4, name: "V-Belt 500mm", sku: "BLT-500", quantity: 8, minQuantity: 3, price: 45.00, location: "Shelf A-2" },
  { id: 5, name: "Safety Gloves (L)", sku: "PPE-001", quantity: 2, minQuantity: 10, price: 8.50, location: "Cabinet D" },
];

export function InventoryList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>SKU</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Price (TND)</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventory.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.sku}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">
                {item.quantity <= item.minQuantity ? (
                  <Badge variant="destructive">Low Stock</Badge>
                ) : (
                  <Badge variant="secondary">In Stock</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
