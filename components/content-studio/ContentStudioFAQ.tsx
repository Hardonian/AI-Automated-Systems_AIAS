"use client";

import { Plus, Trash2 } from "lucide-react";

import { AIAssistant } from "./AIAssistant";
import { RichTextEditor } from "./RichTextEditor";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FAQSection } from "@/lib/content/schemas";

interface ContentStudioFAQProps {
  content: FAQSection;
  onChange: (faq: FAQSection) => void;
  token: string;
}

export function ContentStudioFAQ({
  content,
  onChange,
  token,
}: ContentStudioFAQProps) {
  const updateField = <K extends keyof FAQSection>(
    key: K,
    value: FAQSection[K]
  ) => {
    onChange({ ...content, [key]: value });
  };

  const updateCategory = (categoryIndex: number, field: string, value: any) => {
    const newCategories = [...content.categories];
    const existingCategory = newCategories[categoryIndex];
    if (existingCategory) {
      newCategories[categoryIndex] = {
        ...existingCategory,
        [field]: value,
      };
      updateField("categories", newCategories);
    }
  };

  const updateQuestion = (
    categoryIndex: number,
    questionIndex: number,
    field: string,
    value: any
  ) => {
    const newCategories = [...content.categories];
    const category = newCategories[categoryIndex];
    if (!category) {return;}
    const questions = [...category.questions];
    const existingQuestion = questions[questionIndex];
    if (existingQuestion) {
      questions[questionIndex] = { ...existingQuestion, [field]: value };
      newCategories[categoryIndex] = {
        ...category,
        questions,
      };
      updateField("categories", newCategories);
    }
  };

  const addCategory = () => {
    updateField("categories", [
      ...content.categories,
      {
        category: "New Category",
        questions: [
          {
            question: "Question?",
            answer: "Answer.",
          },
        ],
      },
    ]);
  };

  const addQuestion = (categoryIndex: number) => {
    const newCategories = [...content.categories];
    const category = newCategories[categoryIndex];
    if (category) {
      category.questions.push({
        question: "New Question?",
        answer: "New Answer.",
      });
      updateField("categories", newCategories);
    }
  };

  const removeCategory = (categoryIndex: number) => {
    updateField(
      "categories",
      content.categories.filter((_, i) => i !== categoryIndex)
    );
  };

  const removeQuestion = (categoryIndex: number, questionIndex: number) => {
    const newCategories = [...content.categories];
    const category = newCategories[categoryIndex];
    if (category) {
      category.questions = category.questions.filter((_, i) => i !== questionIndex);
      updateField("categories", newCategories);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>FAQ Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="faq-title">Section Title (optional)</Label>
          <Input
            id="faq-title"
            value={content.sectionTitle || ""}
            onChange={(e) =>
              updateField("sectionTitle", e.target.value || undefined)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="faq-subtitle">Section Subtitle (optional)</Label>
          <Textarea
            id="faq-subtitle"
            rows={2}
            value={content.sectionSubtitle || ""}
            onChange={(e) =>
              updateField("sectionSubtitle", e.target.value || undefined)
            }
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>FAQ Categories</Label>
            <Button size="sm" type="button" onClick={addCategory}>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </div>

          {content.categories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Input
                    className="font-semibold"
                    value={category.category}
                    onChange={(e) =>
                      updateCategory(categoryIndex, "category", e.target.value)
                    }
                  />
                  <Button
                    size="sm"
                    type="button"
                    variant="ghost"
                    onClick={() => removeCategory(categoryIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Questions</Label>
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      onClick={() => addQuestion(categoryIndex)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Question
                    </Button>
                  </div>

                  {category.questions.map((faq, questionIndex) => (
                    <Card key={questionIndex} className="p-3 bg-muted/50">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Q{questionIndex + 1}
                          </span>
                          <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() =>
                              removeQuestion(categoryIndex, questionIndex)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <Input
                          placeholder="Question"
                          value={faq.question}
                          onChange={(e) =>
                            updateQuestion(
                              categoryIndex,
                              questionIndex,
                              "question",
                              e.target.value
                            )
                          }
                        />
                        <RichTextEditor
                          placeholder="Answer"
                          rows={3}
                          value={faq.answer}
                          onChange={(value) =>
                            updateQuestion(
                              categoryIndex,
                              questionIndex,
                              "answer",
                              value
                            )
                          }
                        />
                        <AIAssistant
                          context={`FAQ question: ${faq.question}`}
                          currentContent={faq.answer}
                          token={token}
                          type="faq-answer"
                          onGenerate={(generated) =>
                            updateQuestion(
                              categoryIndex,
                              questionIndex,
                              "answer",
                              generated
                            )
                          }
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
