"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { Hero } from "@/lib/content/schemas";

interface ContentStudioHeroProps {
  content: Hero;
  onChange: (hero: Hero) => void;
}

export function ContentStudioHero({
  content,
  onChange,
}: ContentStudioHeroProps) {
  const updateField = <K extends keyof Hero>(key: K, value: Hero[K]) => {
    onChange({ ...content, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hero-title">Title</Label>
          <Input
            id="hero-title"
            value={content.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-subtitle">Subtitle (optional)</Label>
          <Input
            id="hero-subtitle"
            value={content.subtitle || ""}
            onChange={(e) =>
              updateField("subtitle", e.target.value || undefined)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-description">Description (optional)</Label>
          <Textarea
            id="hero-description"
            value={content.description || ""}
            onChange={(e) =>
              updateField("description", e.target.value || undefined)
            }
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-badge">Badge Text (optional)</Label>
          <Input
            id="hero-badge"
            value={content.badgeText || ""}
            onChange={(e) =>
              updateField("badgeText", e.target.value || undefined)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hero-image">Image URL (optional)</Label>
          <Input
            id="hero-image"
            type="url"
            value={content.imageUrl || ""}
            onChange={(e) =>
              updateField("imageUrl", e.target.value || undefined)
            }
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary CTA</Label>
            <div className="space-y-2">
              <Input
                placeholder="Label"
                value={content.primaryCta?.label || ""}
                onChange={(e) =>
                  updateField("primaryCta", {
                    ...content.primaryCta,
                    label: e.target.value,
                    href: content.primaryCta?.href || "/",
                    visible: content.primaryCta?.visible ?? true,
                  })
                }
              />
              <Input
                placeholder="URL"
                value={content.primaryCta?.href || ""}
                onChange={(e) =>
                  updateField("primaryCta", {
                    ...content.primaryCta,
                    label: content.primaryCta?.label || "",
                    href: e.target.value,
                    visible: content.primaryCta?.visible ?? true,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Secondary CTA</Label>
            <div className="space-y-2">
              <Input
                placeholder="Label"
                value={content.secondaryCta?.label || ""}
                onChange={(e) =>
                  updateField("secondaryCta", {
                    ...content.secondaryCta,
                    label: e.target.value,
                    href: content.secondaryCta?.href || "/",
                    visible: content.secondaryCta?.visible ?? true,
                  })
                }
              />
              <Input
                placeholder="URL"
                value={content.secondaryCta?.href || ""}
                onChange={(e) =>
                  updateField("secondaryCta", {
                    ...content.secondaryCta,
                    label: content.secondaryCta?.label || "",
                    href: e.target.value,
                    visible: content.secondaryCta?.visible ?? true,
                  })
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
