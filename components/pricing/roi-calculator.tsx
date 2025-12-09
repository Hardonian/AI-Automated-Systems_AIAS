"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ROICalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState<string>("10");
  const [hourlyRate, setHourlyRate] = useState<string>("50");
  const [plan, setPlan] = useState<"starter" | "pro">("starter");

  const hours = parseFloat(hoursPerWeek) || 0;
  const rate = parseFloat(hourlyRate) || 0;
  const planCost = plan === "starter" ? 49 : 149;

  const monthlyHoursSaved = hours * 4.33; // Average weeks per month
  const monthlyValue = monthlyHoursSaved * rate;
  const annualValue = monthlyValue * 12;
  const annualCost = planCost * 12;
  const netAnnualSavings = annualValue - annualCost;
  const roi = annualValue > 0 ? ((annualValue - annualCost) / annualCost) * 100 : 0;

  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle className="text-2xl">ROI Calculator</CardTitle>
        <CardDescription>
          Calculate how much time and money you'll save with AIAS Platform automation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="hours">Hours Saved Per Week</Label>
            <Input
              id="hours"
              max="40"
              min="1"
              placeholder="10"
              type="number"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              How many hours per week do you spend on repetitive tasks?
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">Your Hourly Rate (CAD)</Label>
            <Input
              id="rate"
              min="0"
              placeholder="50"
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              What's your hourly rate or the value of your time?
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Select Plan</Label>
          <div className="flex gap-4">
            <Button
              className="flex-1"
              variant={plan === "starter" ? "default" : "outline"}
              onClick={() => setPlan("starter")}
            >
              Starter ($49/month)
            </Button>
            <Button
              className="flex-1"
              variant={plan === "pro" ? "default" : "outline"}
              onClick={() => setPlan("pro")}
            >
              Pro ($149/month)
            </Button>
          </div>
        </div>

        {hours > 0 && rate > 0 && (
          <div className="p-6 bg-primary/5 rounded-lg space-y-4 border border-primary/20">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Time Saved</p>
                <p className="text-2xl font-bold">{monthlyHoursSaved.toFixed(1)} hours</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Value</p>
                <p className="text-2xl font-bold">${monthlyValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Value</p>
                <p className="text-2xl font-bold text-green-600">${annualValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Cost</p>
                <p className="text-2xl font-bold">${annualCost.toFixed(2)}</p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <p className="text-lg font-semibold">Net Annual Savings</p>
                <p className="text-3xl font-bold text-green-600">
                  ${netAnnualSavings.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">ROI</p>
                <p className="text-3xl font-bold text-green-600">
                  {roi > 0 ? `${roi.toFixed(0)}%` : "0%"}
                </p>
              </div>
            </div>

            {roi > 0 && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-900 dark:text-green-100">
                  <strong>Great news!</strong> You'll save ${netAnnualSavings.toFixed(2)} per year 
                  with a {roi.toFixed(0)}% ROI. That's like getting paid ${(netAnnualSavings / 12).toFixed(2)} 
                  extra every month just for automating your workflows.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-center">
          <Button asChild size="lg">
            <a href="/signup">Start Your Free Trial</a>
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            No credit card required • 30-day free trial
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
