import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Premium Content — Systems Thinking + AI | AIAS Platform",
  description: "Get access to premium systems thinking frameworks, exclusive case studies, advanced GenAI content engine features, and premium RSS feed analysis.",
};

export default function PremiumPage() {
  return (
    <div className="container py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Premium Content & Features
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Unlock premium systems thinking frameworks, exclusive case studies, and advanced features. 
          Get deeper insights and exclusive content to accelerate your success.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Premium Tier */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Premium</CardTitle>
            <CardDescription className="text-lg">$9/month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Unlock all premium blog articles</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Premium RSS feed with deeper analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Advanced systems thinking frameworks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Exclusive case studies</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Monthly systems thinking newsletter</span>
              </li>
            </ul>
            <Button size="lg" className="w-full" asChild>
              <Link href="/pricing">Subscribe to Premium</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pro Tier */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl">Pro</CardTitle>
            <CardDescription className="text-lg">$19/month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Everything in Premium</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Exclusive systems thinking frameworks</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Early access to new features</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Access to private community</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Advanced GenAI Content Engine features</span>
              </li>
            </ul>
            <Button size="lg" className="w-full" asChild>
              <Link href="/pricing">Subscribe to Pro</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* What You Get */}
      <div className="max-w-4xl mx-auto space-y-8">
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">What's Included</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Premium Blog Articles</h3>
                <p className="text-sm text-muted-foreground">
                  Access to exclusive systems thinking articles, advanced frameworks, and in-depth case studies 
                  not available to free users.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Premium RSS Feed</h3>
                <p className="text-sm text-muted-foreground">
                  Get deeper systems thinking analysis on AI and tech news, with exclusive editorial takes 
                  and extended commentary.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Advanced Frameworks</h3>
                <p className="text-sm text-muted-foreground">
                  Access to exclusive systems thinking frameworks, templates, and tools used by consultants 
                  and business leaders.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Exclusive Case Studies</h3>
                <p className="text-sm text-muted-foreground">
                  Real-world case studies showing how systems thinking drives business success, with detailed 
                  analysis and actionable insights.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="text-center bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Unlock Premium Content?</h2>
          <p className="text-muted-foreground mb-6">
            Join premium subscribers and get exclusive access to systems thinking frameworks, 
            case studies, and advanced features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/pricing">View Pricing</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">View Free Content</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
