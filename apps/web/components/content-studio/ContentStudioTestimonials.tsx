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
import type { TestimonialSection } from "@/lib/content/schemas";

interface ContentStudioTestimonialsProps {
  content: TestimonialSection;
  onChange: (testimonials: TestimonialSection) => void;
  token: string;
}

export function ContentStudioTestimonials({
  content,
  onChange,
  token,
}: ContentStudioTestimonialsProps) {
  const updateField = <K extends keyof TestimonialSection>(
    key: K,
    value: TestimonialSection[K]
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
        quote: "Testimonial quote",
        author: "Author Name",
        rating: 5,
        hasVideo: false,
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
        <CardTitle>Testimonials Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="testimonials-title">Section Title (optional)</Label>
          <Input
            id="testimonials-title"
            value={content.sectionTitle || ""}
            onChange={(e) =>
              updateField("sectionTitle", e.target.value || undefined)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="testimonials-subtitle">
            Section Subtitle (optional)
          </Label>
          <Textarea
            id="testimonials-subtitle"
            rows={2}
            value={content.sectionSubtitle || ""}
            onChange={(e) =>
              updateField("sectionSubtitle", e.target.value || undefined)
            }
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Testimonials (drag to reorder)</Label>
            <Button size="sm" type="button" onClick={addItem}>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </div>

          <DraggableList
            items={content.items}
            renderItem={(item, index) => (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Quote</Label>
                  <RichTextEditor
                    rows={4}
                    value={item.quote}
                    onChange={(value) => updateItem(index, "quote", value)}
                  />
                  <AIAssistant
                    context="Customer testimonial"
                    currentContent={item.quote}
                    token={token}
                    type="testimonial"
                    onGenerate={(generated) => updateItem(index, "quote", generated)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Author</Label>
                    <Input
                      value={item.author}
                      onChange={(e) =>
                        updateItem(index, "author", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role (optional)</Label>
                    <Input
                      value={item.role || ""}
                      onChange={(e) =>
                        updateItem(index, "role", e.target.value || undefined)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Company (optional)</Label>
                    <Input
                      value={item.company || ""}
                      onChange={(e) =>
                        updateItem(index, "company", e.target.value || undefined)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Rating (1-5)</Label>
                    <Input
                      max="5"
                      min="1"
                      type="number"
                      value={item.rating}
                      onChange={(e) =>
                        updateItem(index, "rating", parseInt(e.target.value, 10) || 5)
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
