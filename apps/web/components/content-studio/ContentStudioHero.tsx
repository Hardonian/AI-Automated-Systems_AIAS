"use client";

import { Plus } from "lucide-react";

import { AIAssistant } from "./AIAssistant";
import { DraggableList } from "./DraggableList";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Hero } from "@/lib/content/schemas";

interface ContentStudioHeroProps {
  content: Hero;
  onChange: (hero: Hero) => void;
  token: string;
}

export function ContentStudioHero({
  content,
  onChange,
  token,
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
          <AIAssistant
            context="AIAS platform hero section"
            currentContent={content.title}
            token={token}
            type="hero-title"
            onGenerate={(generated) => updateField("title", generated)}
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
          <RichTextEditor
            placeholder="Enter hero description..."
            rows={3}
            value={content.description || ""}
            onChange={(value) => updateField("description", value || undefined)}
          />
          <AIAssistant
            context="AIAS platform hero section"
            currentContent={content.description}
            token={token}
            type="hero-description"
            onGenerate={(generated) => updateField("description", generated)}
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

        <ImageUpload
          label="Hero Image (optional)"
          token={token}
          value={content.imageUrl}
          onChange={(url) => updateField("imageUrl", url || undefined)}
        />

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

        {content.socialProof && content.socialProof.length > 0 && (
          <div className="space-y-4">
            <Label>Social Proof Items</Label>
            <DraggableList
              items={content.socialProof}
              renderItem={(item, index) => (
                <div className="space-y-2">
                  <Input
                    placeholder="Icon (emoji)"
                    value={item.icon || ""}
                    onChange={(e) => {
                      const newItems = [...content.socialProof!];
                      newItems[index] = { ...item, icon: e.target.value || undefined };
                      updateField("socialProof", newItems);
                    }}
                  />
                  <Input
                    placeholder="Text"
                    value={item.text}
                    onChange={(e) => {
                      const newItems = [...content.socialProof!];
                      newItems[index] = { ...item, text: e.target.value };
                      updateField("socialProof", newItems);
                    }}
                  />
                </div>
              )}
              onRemove={(index) => {
                const newItems = content.socialProof!.filter((_, i) => i !== index);
                updateField("socialProof", newItems.length > 0 ? newItems : undefined);
              }}
              onReorder={(items) => updateField("socialProof", items)}
            />
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => {
                updateField("socialProof", [
                  ...(content.socialProof || []),
                  { text: "New item" },
                ]);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Social Proof Item
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
