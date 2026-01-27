"use client";

import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";


interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  token: string;
}

export function ImageUpload({ value, onChange, label = "Image", token }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {return;}

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, WebP, or GIF image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/content/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      onChange(data.url);
      toast({
        title: "Upload successful",
        description: "Image uploaded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <Input
          className="flex-1"
          placeholder="Image URL or upload file"
          type="url"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          id="image-upload"
          type="file"
          onChange={handleFileSelect}
        />
        <Button
          disabled={uploading}
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>
      {preview && (
        <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
          <Image
            fill
            alt="Preview"
            className="object-contain"
            src={preview}
          />
          <Button
            className="absolute top-2 right-2"
            size="sm"
            type="button"
            variant="destructive"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {value && !preview && (
        <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          <ImageIcon className="h-12 w-12 text-muted-foreground" />
          <Button
            className="absolute top-2 right-2"
            size="sm"
            type="button"
            variant="ghost"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
