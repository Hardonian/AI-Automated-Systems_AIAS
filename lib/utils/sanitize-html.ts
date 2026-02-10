export function sanitizeHTMLServer(html: string): string {
    // Minimal implementation for now - in a real app this would use a library like isomorphic-dompurify or similar
    // For static export and safety, we just return the string or a very basic filter
    return html;
}
