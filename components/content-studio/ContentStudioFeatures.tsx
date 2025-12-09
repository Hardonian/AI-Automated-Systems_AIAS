"use client";

import { Plus } from "lucide-react";

import { AIAssistant } from "./AIAssistant";
import { DraggableList } from "./DraggableList";
import { RichTextEditor } from "./RichTextEditor";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FeatureSection } from "@/lib/content/schemas";

interface ContentStudioFeaturesProps {
  content: FeatureSection;
  onChange: (features: FeatureSection) => void;
  token: string;
}

export function ContentStudioFeatures({
  content,
  onChange,
  token,
}: ContentStudioFeaturesProps) {
  const updateField = <K extends keyof FeatureSection>(
    key: K,
    value: FeatureSection[K]
  ) => {
    onChange({ ...content, [key]: value });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...content.items];
    const existingItem = newItems[index];
    if (existingItem) {
      newItems[index] = { ...existingItem, [field]: value };
    }
    updateField("items", newItems);
  };

  const addItem = () => {
    updateField("items", [
      ...content.items,
      {
        title: "New Feature",
        description: "Feature description",
        highlight: false,
      },
    ]);
  };

  const removeItem = (index: number) => {
    updateField(
      "items",
      content.items.filter((_, i) => i !== index)
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="features-title">Section Title (optional)</Label>
          <Input
            id="features-title"
            value={content.sectionTitle || ""}
            onChange={(e) =>
              updateField("sectionTitle", e.target.value || undefined)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="features-subtitle">Section Subtitle (optional)</Label>
          <Textarea
            id="features-subtitle"
            rows={2}
            value={content.sectionSubtitle || ""}
            onChange={(e) =>
              updateField("sectionSubtitle", e.target.value || undefined)
            }
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Feature Items (drag to reorder)</Label>
            <Button size="sm" type="button" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Feature
            </Button>
          </div>

          <DraggableList
            items={content.items}
            renderItem={(item, index) => (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem(index, "title", e.target.value)}
                  />
                  <AIAssistant
                    context="Feature title"
                    currentContent={item.title}
                    token={token}
                    type="hero-title"
                    onGenerate={(generated) => updateItem(index, "title", generated)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <RichTextEditor
                    rows={3}
                    value={item.description}
                    onChange={(value) => updateItem(index, "description", value)}
                  />
                  <AIAssistant
                    context="Feature description"
                    currentContent={item.description}
                    token={token}
                    type="feature-description"
                    onGenerate={(generated) => updateItem(index, "description", generated)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Icon (optional)</Label>
                    <Input
                      placeholder="sparkles, zap, etc."
                      value={item.icon || ""}
                      onChange={(e) =>
                        updateItem(index, "icon", e.target.value || undefined)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Gradient (optional)</Label>
                    <Input
                      placeholder="from-blue-500 to-cyan-500"
                      value={item.gradient || ""}
                      onChange={(e) =>
                        updateItem(
                          index,
                          "gradient",
                          e.target.value || undefined
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}
            onRemove={removeItem}
            onReorder={(items) => updateField("items", items)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
