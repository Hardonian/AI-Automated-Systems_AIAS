import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Download, Shield, FileJson } from "lucide-react";

export const metadata: Metadata = {
  title: "Export Your Data — AIAS Platform | Data Portability",
  description: "Export your data from AIAS Platform in a machine-readable format. PIPEDA compliant data portability.",
};

export default function ExportDataPage() {
  return (
    <div className="container py-16 max-w-3xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Download className="h-8 w-8 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold">
            Export Your Data
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Download your data in a machine-readable format
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data Export Options</CardTitle>
          <CardDescription>
            Choose what data you'd like to export
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <FileJson className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Complete Data Export</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Export all your account data including workflows, agents, settings, and activity logs in JSON format
              </p>
              <Button size="sm">Request Export</Button>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 border rounded-lg">
            <FileJson className="h-5 w-5 text-primary mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Workflows Only</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Export only your workflow configurations and templates
              </p>
              <Button size="sm" variant="outline">Request Export</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Your Data Rights</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Under PIPEDA and GDPR, you have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>Access your personal data</li>
            <li>Export your data in a machine-readable format</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
          </ul>
          <div className="mt-6">
            <Link href="/privacy" className="text-sm text-primary hover:underline">
              Learn more about our Privacy Policy →
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Link href="/account/audit-log" className="text-primary hover:underline">
          View Audit Log →
        </Link>
      </div>
    </div>
  );
}
