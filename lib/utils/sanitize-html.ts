import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
// DOMPurify expects a specific type here, but runtime execution works correctly with the JSDOM window
const purify = DOMPurify(window as any);

export function sanitizeHTMLServer(html: string): string {
    return purify.sanitize(html);
}
