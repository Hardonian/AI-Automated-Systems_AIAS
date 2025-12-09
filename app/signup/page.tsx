import { Check, Sparkles } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign Up — Start Your Free Trial | AI Automated Systems",
  description: "Start your 30-day free trial of AIAS Platform. No credit card required. Automate workflows, save 10+ hours/week. Canadian-built, PIPEDA compliant.",
};

export default function SignUpPage() {
  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Start Your Free Trial
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            No credit card required • 30-day free trial • Cancel anytime
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl mb-2">What You Get</CardTitle>
            <CardDescription className="text-base">
              Everything you need to start automating your business
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-base leading-relaxed">3 automation workflows</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-base leading-relaxed">100 automations per month</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-base leading-relaxed">Access to pre-built templates</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-base leading-relaxed">Community support and resources</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-base leading-relaxed">PIPEDA compliant • Canadian data residency</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Button asChild className="w-full h-12 text-base font-semibold" size="lg">
            <Link href="/api/auth/signup">Create Account</Link>
          </Button>
          <p className="text-center text-sm md:text-base text-muted-foreground">
            Already have an account?{" "}
            <Link className="text-primary hover:underline font-medium" href="/signin">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-10 p-6 md:p-8 bg-muted rounded-lg">
          <h3 className="font-semibold mb-3 text-lg">Trusted by Canadian Businesses</h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            🇨🇦 Built in Canada • 🔒 PIPEDA Compliant • 🛡️ Enterprise Security • ✅ 99.9% Uptime SLA
          </p>
        </div>
      </div>
    </div>
  );
}
