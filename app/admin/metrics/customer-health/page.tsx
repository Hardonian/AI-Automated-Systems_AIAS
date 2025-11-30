import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerHealthDashboard } from "@/components/metrics/customer-health-dashboard";

export const metadata: Metadata = {
  title: "Customer Health Dashboard — Admin | AIAS Platform",
  description: "Real-time customer health scores and retention metrics",
};

export default function CustomerHealthPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Customer Health Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor customer health scores, identify at-risk accounts, and track retention metrics
        </p>
      </div>
      <CustomerHealthDashboard />
    </div>
  );
}
