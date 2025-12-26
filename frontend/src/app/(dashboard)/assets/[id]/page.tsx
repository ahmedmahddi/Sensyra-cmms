"use client";

import { useAsset, AssetStatus } from "@/hooks/use-assets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function AssetDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: asset, isLoading, isError } = useAsset(id);

  if (isLoading) return <div>Loading asset details...</div>;
  if (isError) return <div className="text-destructive">Error loading asset.</div>;
  if (!asset) return <div>Asset not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/assets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">{asset.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-mono text-sm">{asset.assetTag}</span>
            <span>•</span>
            <span>{asset.category}</span>
          </div>
        </div>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge variant={asset.status === AssetStatus.OPERATIONAL ? "default" : "secondary"}>
                  {asset.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Location</p>
                <p>{asset.location?.name || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Manufacturer</p>
                <p>{asset.manufacturer || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Model</p>
                <p>{asset.model || "-"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-gray-600">{asset.description || "No description provided."}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>Recent activity and work orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Work order history will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
