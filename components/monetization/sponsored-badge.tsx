"use client";
import { Badge } from "@/components/ui/badge";

interface SponsoredBadgeProps {
  sponsor?: string;
  variant?: "default" | "outline";
}

export function SponsoredBadge({ sponsor, variant = "outline" }: SponsoredBadgeProps) {
  return (
    <Badge variant={variant} className="bg-primary/10 text-primary border-primary/20">
      {sponsor ? `Sponsored by ${sponsor}` : "Sponsored"}
    </Badge>
  );
}
