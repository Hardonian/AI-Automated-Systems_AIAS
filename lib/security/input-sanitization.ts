/**
 * Comprehensive Input Sanitization
 * Protect against XSS, SQL injection, and other attacks
 */

import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content
 */
export function sanitizeHTML(html: string, options?: {
  allowTags?: string[];
  allowAttributes?: string[];
}): string {
  const config: any = {
    ALLOWED_TAGS: options?.allowTags || [
      'p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
    ],
    ALLOWED_ATTR: options?.allowAttributes || ['href', 'title', 'alt'],
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
  };

  return DOMPurify.sanitize(html, config) as unknown as string;
}

/**
 * Sanitize string input (remove dangerous characters)
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return String(input);
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');

  // Remove control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Normalize unicode
  sanitized = sanitized.normalize('NFKC');

  return sanitized;
}

/**
 * Sanitize object recursively
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as T;
  }

  if (typeof obj === 'object') {
    const sanitized = {} as T;
    for (const [key, value] of Object.entries(obj)) {
      const sanitizedKey = sanitizeString(key);
      (sanitized as any)[sanitizedKey] = sanitizeObject(value);
    }
    return sanitized;
  }

  return obj;
}

/**
 * Detect SQL injection patterns
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /(--|#|\/\*|\*\/)/,
    /(\b(UNION|OR|AND)\b.*\b(SELECT|INSERT|UPDATE|DELETE)\b)/i,
    /(;|\||&)/,
    /(\b(CHAR|CONCAT|CAST|CONVERT)\s*\(/i,
  ];

  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Detect XSS patterns
 */
export function detectXSS(input: string): boolean {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]*src[^>]*=.*javascript:/gi,
    /<svg[^>]*onload/gi,
  ];

  return xssPatterns.some(pattern => pattern.test(input));
}

/**
 * Detect command injection patterns
 */
export function detectCommandInjection(input: string): boolean {
  const commandPatterns = [
    /[;&|`$(){}[\]]/,
    /\b(cat|ls|pwd|whoami|id|uname|ps|kill|rm|mkdir|cd|chmod|chown)\b/i,
    /\$\(/,
    /`/,
  ];

  return commandPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate and sanitize input with multiple checks
 */
export function validateAndSanitize(input: unknown): {
  valid: boolean;
  sanitized: unknown;
  errors: string[];
} {
  const errors: string[] = [];

  if (typeof input === 'string') {
    // Check for SQL injection
    if (detectSQLInjection(input)) {
      errors.push('Potential SQL injection detected');
    }

    // Check for XSS
    if (detectXSS(input)) {
      errors.push('Potential XSS attack detected');
    }

    // Check for command injection
    if (detectCommandInjection(input)) {
      errors.push('Potential command injection detected');
    }

    // Sanitize
    const sanitized = sanitizeString(input);
    return {
      valid: errors.length === 0,
      sanitized,
      errors,
    };
  }

  if (typeof input === 'object' && input !== null) {
    const sanitized = sanitizeObject(input);
    return {
      valid: true,
      sanitized,
      errors: [],
    };
  }

  return {
    valid: true,
    sanitized: input,
    errors: [],
  };
}

/**
 * Sanitize file name
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path components
  let sanitized = fileName.replace(/[\/\\]/g, '');
  
  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*\x00-\x1F]/g, '');
  
  // Limit length
  sanitized = sanitized.substring(0, 255);
  
  // Remove trailing dots and spaces (Windows)
  sanitized = sanitized.replace(/[.\s]+$/, '');
  
  return sanitized || 'file';
}

/**
 * Sanitize URL
 */
export function sanitizeURL(url: string): string {
  try {
    const parsed = new URL(url);
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    
    // Remove javascript: and data: schemes
    if (parsed.href.toLowerCase().includes('javascript:') || 
        parsed.href.toLowerCase().includes('data:')) {
      throw new Error('Dangerous URL scheme');
    }
    
    return parsed.href;
  } catch {
    // Return safe default
    return '#';
  }
}
