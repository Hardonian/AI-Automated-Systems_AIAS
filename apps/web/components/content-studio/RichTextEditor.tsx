"use client";

import { Bold, Italic, List, Link as LinkIcon } from "lucide-react";
import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder,
  rows = 4,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (command: string, value?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {return;}

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value || textarea.value.substring(start, end);
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    let formatted = "";
    switch (command) {
      case "bold":
        formatted = `**${selectedText}**`;
        break;
      case "italic":
        formatted = `*${selectedText}*`;
        break;
      case "list":
        formatted = selectedText
          .split("\n")
          .map((line) => `- ${line}`)
          .join("\n");
        break;
      case "link":
        formatted = `[${selectedText}](${value || "https://example.com"})`;
        break;
      default:
        formatted = selectedText;
    }

    const newValue = before + formatted + after;
    onChange(newValue);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start,
        start + formatted.length
      );
    }, 0);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="border rounded-lg">
        <div className="flex items-center gap-1 p-2 border-b bg-muted/50">
          <Button
            size="sm"
            title="Bold"
            type="button"
            variant="ghost"
            onClick={() => applyFormat("bold")}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            title="Italic"
            type="button"
            variant="ghost"
            onClick={() => applyFormat("italic")}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            title="Bullet List"
            type="button"
            variant="ghost"
            onClick={() => applyFormat("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            title="Add Link"
            type="button"
            variant="ghost"
            onClick={() => {
              const url = prompt("Enter URL:");
              if (url) {applyFormat("link", url);}
            }}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>
        <Textarea
          ref={textareaRef}
          className="border-0 focus-visible:ring-0 resize-none"
          placeholder={placeholder}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Supports Markdown: **bold**, *italic*, - lists, [links](url)
      </p>
    </div>
  );
}
