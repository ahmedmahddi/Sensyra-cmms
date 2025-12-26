import { CreateWorkOrderForm } from "@/components/work-orders/create-work-order-form";

export default function CreateWorkOrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Create Work Order</h3>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to create a new maintenance request.
        </p>
      </div>
      <CreateWorkOrderForm />
    </div>
  );
}
