"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivationChartProps {
  data: Array<{
    date: string;
    activationRate: number;
    timeToActivation: number;
    day7Retention: number;
  }>;
}

export function ActivationChart({ data }: ActivationChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activation Metrics Over Time</CardTitle>
        <CardDescription>Track activation rate, time-to-activation, and retention</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer height={300} width="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              dataKey="activationRate"
              name="Activation Rate (%)"
              stroke="#8884d8"
              type="monotone"
            />
            <Line
              dataKey="day7Retention"
              name="Day 7 Retention (%)"
              stroke="#82ca9d"
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
