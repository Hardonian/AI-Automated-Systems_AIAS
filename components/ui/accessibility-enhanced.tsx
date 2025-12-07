/**
 * Enhanced Accessibility Components
 * WCAG 2.1 AA compliant UI components
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { trapFocus, announceToScreenReader } from '@/lib/accessibility/utils';

/**
 * Skip to main content link
 */
export function SkipLink({ targetId = 'main-content', label = 'Skip to main content' }: { targetId?: string; label?: string }) {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-fg focus:rounded-md focus:shadow-lg"
      onClick={(e) => {
        e.preventDefault();
        const target = document.getElementById(targetId);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      {label}
    </a>
  );
}

/**
 * Accessible modal with focus trap
 */
export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  ariaLabel,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Store previous focus
      previousFocusRef.current = document.activeElement as HTMLElement;
      
      // Focus modal
      const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
      
      // Trap focus
      const cleanup = trapFocus(modalRef.current!);
      
      // Announce to screen readers
      announceToScreenReader(`${title} dialog opened`);
      
      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        cleanup();
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
        previousFocusRef.current?.focus();
      };
    }
  }, [isOpen, onClose, title]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-label={ariaLabel}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={modalRef}
        className="bg-card text-card-foreground rounded-lg shadow-xl max-w-lg w-full mx-4 p-6"
      >
        <h2 id="modal-title" className="text-2xl font-bold mb-4">
          {title}
        </h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          aria-label="Close dialog"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
}

/**
 * Accessible button with loading and disabled states
 */
export function AccessibleButton({
  children,
  isLoading,
  disabled,
  onClick,
  'aria-label': ariaLabel,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
}) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-label={ariaLabel || (isLoading ? 'Loading...' : undefined)}
      aria-busy={isLoading}
      className={`${props.className || ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <>
          <span className="sr-only">Loading</span>
          <span aria-hidden="true">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

/**
 * Screen reader only text
 */
export function ScreenReaderOnly({ children }: { children: React.ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

/**
 * Live region for announcements
 */
export function LiveRegion({ priority = 'polite', children }: { priority?: 'polite' | 'assertive'; children: React.ReactNode }) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  );
}
