/**
 * Beta Program Application Page
 */

"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function BetaApplyPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    companySize: "",
    useCase: "",
    currentTools: "",
    expectations: "",
    commitment: false,
    feedback: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Would submit to API
      // const response = await fetch('/api/beta/apply', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit application", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto py-16 px-4 max-w-2xl">
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Application Received!</h1>
            <p className="text-muted-foreground mb-6">
              Thank you for your interest in the AIAS Beta Program. We&apos;ll review your application and get back to you within 1-2 weeks.
            </p>
            <Button asChild>
              <a href="/">Return to Home</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Join the AIAS Beta Program</h1>
        <p className="text-xl text-muted-foreground">
          Get early access to intelligent automation and help shape the future of AIAS
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Beta Application</CardTitle>
          <CardDescription>
            Tell us about yourself and your automation needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                required
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                required
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company/Organization *</Label>
              <Input
                required
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your Role *</Label>
              <Input
                required
                id="role"
                placeholder="e.g., Operations Manager, Founder, CTO"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size *</Label>
              <Select
                required
                value={formData.companySize}
                onValueChange={(value) => setFormData({ ...formData, companySize: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-500">201-500 employees</SelectItem>
                  <SelectItem value="500+">500+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="useCase">Primary Use Case *</Label>
              <Textarea
                required
                id="useCase"
                placeholder="Describe your primary automation use case..."
                rows={4}
                value={formData.useCase}
                onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentTools">Current Tools/Systems</Label>
              <Textarea
                id="currentTools"
                placeholder="What tools or systems do you currently use?"
                rows={3}
                value={formData.currentTools}
                onChange={(e) => setFormData({ ...formData, currentTools: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectations">What are you hoping to achieve?</Label>
              <Textarea
                id="expectations"
                placeholder="What outcomes are you looking for from AIAS?"
                rows={3}
                value={formData.expectations}
                onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  checked={formData.commitment}
                  id="commitment"
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, commitment: checked === true })
                  }
                />
                <Label className="text-sm leading-relaxed" htmlFor="commitment">
                  I commit to using the platform regularly and providing feedback during the beta period *
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  checked={formData.feedback}
                  id="feedback"
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, feedback: checked === true })
                  }
                />
                <Label className="text-sm leading-relaxed" htmlFor="feedback">
                  I&apos;m willing to participate in feedback sessions and surveys
                </Label>
              </div>
            </div>

            <Button className="w-full" disabled={submitting || !formData.commitment} type="submit">
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Questions? Contact us at{" "}
          <a className="underline" href="mailto:beta@aiautomatedsystems.ca">
            beta@aiautomatedsystems.ca
          </a>
        </p>
      </div>
    </div>
  );
}
