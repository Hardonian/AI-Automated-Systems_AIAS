import { Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign In — AI Automated Systems",
  description: "Sign in to your AIAS Platform account. Access your workflows, agents, and automation tools.",
};

export default function SignInPage() {
  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Sign In
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Welcome back to AIAS Platform
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl mb-2">Access Your Account</CardTitle>
            <CardDescription className="text-base">
              Sign in to continue managing your workflows and automations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <Button asChild className="w-full h-12 text-base font-semibold" size="lg">
              <Link href="/api/auth/login">Sign In</Link>
            </Button>
            <p className="text-center text-sm md:text-base text-muted-foreground">
              Don't have an account?{" "}
              <Link className="text-primary hover:underline font-medium" href="/signup">
                Start your free trial
              </Link>
            </p>
            <div className="pt-6 border-t">
              <Link 
                className="text-sm md:text-base text-muted-foreground hover:text-foreground block text-center" 
                href="/help"
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
