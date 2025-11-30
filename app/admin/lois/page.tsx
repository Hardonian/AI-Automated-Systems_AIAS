import { Metadata } from "next";
import { LOIDashboard } from "@/components/sales/loi-dashboard";

export const metadata: Metadata = {
  title: "LOI Management — Admin | AIAS Platform",
  description: "Track and manage Letters of Intent for Seed Round fundraising",
};

export default function LOIPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Letters of Intent (LOIs)</h1>
        <p className="text-muted-foreground">
          Track LOIs for Seed Round fundraising. Target: 5 LOIs secured
        </p>
      </div>
      <LOIDashboard />
    </div>
  );
}
