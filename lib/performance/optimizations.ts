/**
 * Performance Optimizations
 * Bundle size, loading, and runtime optimizations
 */

import React from 'react';

/**
 * Lazy load heavy components
 */
export function lazyLoadComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(importFunc);
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string): void {
  if (typeof window === 'undefined') {return;}
  
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Prefetch next page
 */
export function prefetchPage(href: string): void {
  if (typeof window === 'undefined') {return;}
  
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function calls
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Image optimization helper
 */
export function optimizeImage(
  src: string,
  width?: number,
  quality: number = 80
): string {
  // Use Next.js Image Optimization API
  const params = new URLSearchParams();
  if (width) {params.set('w', width.toString());}
  params.set('q', quality.toString());
  
  return `${src}?${params.toString()}`;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') {return false;}
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Intersection Observer for lazy loading
 */
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }
  
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  });
}
