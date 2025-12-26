import { CreateAssetForm } from "@/components/assets/create-asset-form";

export default function CreateAssetPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Add New Asset</h3>
        <p className="text-sm text-muted-foreground">
          Register a new equipment or asset into the system.
        </p>
      </div>
      <CreateAssetForm />
    </div>
  );
}
