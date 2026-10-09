/**
 * MissIQ Security & Sanitization Service
 * Prevents Stored and DOM-based Cross-Site Scripting (XSS), script injection,
 * and malicious protocol URLs in parsed conversation transcripts and exports.
 */

const HTML_ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
};

/**
 * Escapes unsafe HTML characters to prevent XSS injection.
 */
export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') return '';
  return unsafe.replace(/[&<>"'`\/]/g, (match) => HTML_ENTITY_MAP[match] || match);
}

/**
 * Strips script tags, iframes, inline event handlers (onload, onerror), and javascript: URLs.
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    // Strip script and iframe tags
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, '')
    // Strip javascript: pseudo-protocols
    .replace(/javascript:[^"'\s]*/gi, '')
    // Strip inline event attributes like onload=, onerror=, onclick=
    .replace(/\s+on\w+\s*=\s*(['"]).*?\1/gi, '')
    .trim();
}

/**
 * Validates and limits payload string length to protect against memory exhaustion (DoS).
 */
export function validateInputPayload(text: string, maxLength: number = 5_000_000): { isValid: boolean; sanitized: string; error?: string } {
  if (!text || typeof text !== 'string') {
    return { isValid: false, sanitized: '', error: 'Input conversation text cannot be empty.' };
  }

  if (text.length > maxLength) {
    return { 
      isValid: false, 
      sanitized: '', 
      error: `Input text exceeds the maximum allowable length (${(maxLength / 1_000_000).toFixed(1)}MB). Please reduce your conversation snippet.` 
    };
  }

  return { isValid: true, sanitized: sanitizeText(text) };
}
