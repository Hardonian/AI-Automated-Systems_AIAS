/**
 * Image Component with Fallback
 * Accessible image component with loading states and error handling
 */

"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  fill?: boolean;
  sizes?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = "/placeholder.svg",
  priority = false,
  loading = "lazy",
  fill = false,
  sizes,
  objectFit = "cover",
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const imageProps = fill
    ? {
        fill: true,
        sizes: sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
        className: cn(
          className,
          isLoading && "opacity-0",
          "transition-opacity duration-300",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill",
          objectFit === "none" && "object-none",
          objectFit === "scale-down" && "object-scale-down"
        ),
      }
    : {
        width: width || 800,
        height: height || 600,
        className: cn(
          className,
          isLoading && "opacity-0",
          "transition-opacity duration-300",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill",
          objectFit === "none" && "object-none",
          objectFit === "scale-down" && "object-scale-down"
        ),
      };

  return (
    <div className="relative overflow-hidden">
      <Image
        {...imageProps}
        src={imgSrc}
        alt={alt}
        priority={priority}
        loading={loading}
        onError={handleError}
        onLoad={handleLoad}
        aria-label={alt}
      />
      {isLoading && (
        <div
          className="absolute inset-0 bg-muted animate-pulse"
          aria-hidden="true"
        />
      )}
      {hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground"
          aria-label="Image failed to load"
        >
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
