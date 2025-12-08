/**
 * Server-only DOMPurify initialization
 * This file should only be imported on the server side
 * 
 * Using 'server-only' package would be ideal, but we'll use webpack config to exclude this
 */

import createDOMPurify from 'isomorphic-dompurify';
// @ts-ignore - jsdom types may not be available
import { JSDOM } from 'jsdom';

/**
 * Initialize DOMPurify for server-side use
 */
export function createServerDOMPurify() {
  const window = new JSDOM('').window;
  return createDOMPurify(window);
}
