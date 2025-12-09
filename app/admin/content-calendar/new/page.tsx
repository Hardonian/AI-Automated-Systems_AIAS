import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create New Post — Content Calendar | AIAS Platform",
  description: "Create a new content post in the content calendar.",
};

export default function NewContentPostPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <div className="mb-8">
        <Button asChild variant="ghost">
          <Link href="/admin/content-calendar">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Content Calendar
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>
            Create a new content post for your content calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Content creation form will be available here. For now, you can use the{" "}
            <Link className="text-primary hover:underline" href="/genai-content-engine">
              GenAI Content Engine
            </Link>{" "}
            to generate content.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/genai-content-engine">Use GenAI Content Engine</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/content-calendar">Back to Calendar</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
