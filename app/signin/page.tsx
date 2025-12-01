import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In — AI Automated Systems",
  description: "Sign in to your AIAS Platform account. Access your workflows, agents, and automation tools.",
};

export default function SignInPage() {
  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Sign In
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Welcome back to AIAS Platform
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Access Your Account</CardTitle>
            <CardDescription>
              Sign in to continue managing your workflows and automations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button size="lg" className="w-full" asChild>
              <Link href="/api/auth/login">Sign In</Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Start your free trial
              </Link>
            </p>
            <div className="pt-4 border-t">
              <Link 
                href="/help" 
                className="text-sm text-muted-foreground hover:text-foreground block text-center"
              >
                Need help? Visit our Help Center
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
