"use client";

import { useAssets, AssetStatus } from "@/hooks/use-assets";
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
import { Plus, QrCode } from "lucide-react";
import Link from "next/link";

const getStatusColor = (status: AssetStatus) => {
  switch (status) {
    case AssetStatus.OPERATIONAL:
      return "default"; // or green if available
    case AssetStatus.DOWN:
      return "destructive";
    case AssetStatus.MAINTENANCE:
      return "secondary"; // or orange
    case AssetStatus.RETIRED:
      return "outline";
    default:
      return "outline";
  }
};

export function AssetList() {
  const { data: assets, isLoading, isError } = useAssets();

  if (isLoading) return <div>Loading assets...</div>;
  if (isError) return <div className="text-destructive">Error loading assets.</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Assets</h2>
          <p className="text-muted-foreground">
            Track and manage your equipment and machinery.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <QrCode className="mr-2 h-4 w-4" /> Scan
          </Button>
          <Button asChild>
            <Link href="/assets/new">
              <Plus className="mr-2 h-4 w-4" /> Add Asset
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tag</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Model</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets && assets.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No assets found.
                </TableCell>
              </TableRow>
            )}
            {assets?.map((asset) => (
              <TableRow key={asset.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-mono text-xs">{asset.assetTag}</TableCell>
                <TableCell className="font-medium">{asset.name}</TableCell>
                <TableCell>{asset.category || "-"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(asset.status)}>
                    {asset.status}
                  </Badge>
                </TableCell>
                <TableCell>{asset.location?.name || "-"}</TableCell>
                <TableCell>{asset.model || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
