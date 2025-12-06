# Content Studio – Lightweight CMS for AIAS & Settler.dev

## Overview

Content Studio is a simple, non-developer-friendly content management system that allows internal stakeholders to update key marketing and content sections on the AIAS website and Settler.dev site without needing to touch code, open Cursor, or understand React.

## Access

### URLs

- **AIAS Content Studio**: `/admin/content-studio` (select "AIAS Site" tab)
- **Settler.dev Content Studio**: `/admin/content-studio` (select "Settler.dev" tab)

### Authentication

Content Studio is protected by a password/token system. To access:

1. Set the `CONTENT_STUDIO_TOKEN` environment variable in your deployment (Vercel, local `.env.local`, etc.)
2. Navigate to `/admin/content-studio`
3. Enter the token when prompted

**Example `.env.local`:**
```bash
CONTENT_STUDIO_TOKEN=your-secure-random-token-here
```

**Security Note**: Never commit the token to git. Use environment variables only.

## What Can Be Edited

### AIAS Site

1. **Hero Section**
   - Title, subtitle, description
   - Badge text
   - Primary and secondary CTAs (labels, URLs, visibility)
   - Image URL
   - Social proof items
   - Trust badges

2. **Features Section**
   - Section title and subtitle
   - Feature items (title, description, icon, gradient, highlight flag)
   - Add/remove/reorder features

3. **Testimonials Section**
   - Section title and subtitle
   - Testimonial items (quote, author, role, company, rating, video flag)
   - Add/remove testimonials

4. **FAQ Section**
   - Section title and subtitle
   - FAQ categories
   - Questions and answers within each category
   - Add/remove categories and questions

### Settler.dev Site

1. **Hero Section** (same as AIAS)
2. **Features Section** (same as AIAS)
3. **Use Cases** (coming soon)
4. **Partnership Section** (coming soon)
5. **CTA Section** (coming soon)

## How to Use

1. **Navigate to Content Studio**
   - Go to `/admin/content-studio`
   - Authenticate with your token

2. **Select Site**
   - Choose "AIAS Site" or "Settler.dev" tab

3. **Edit Content**
   - Click on any section (Hero, Features, Testimonials, FAQ)
   - Edit fields directly in the form
   - For list items (features, testimonials, FAQs), use the "Add" and "Remove" buttons

4. **Save Changes**
   - Click "Save Changes" button in the top right
   - Wait for confirmation toast
   - Changes are immediately saved to the content config file

5. **Preview**
   - Click "Preview" button to open the live site in a new tab
   - Refresh the page to see your changes

6. **Reset**
   - Click "Reset" to discard unsaved changes and reload from file

## Content Storage

Content is stored in JSON files:

- **AIAS**: `/content/aias.json`
- **Settler**: `/content/settler.json`

These files are created automatically with defaults on first use. They are **not** committed to git by default (see `.gitignore`).

### File Structure

```json
{
  "hero": {
    "title": "Custom AI Platforms",
    "subtitle": "That Transform Your Business",
    "description": "...",
    "primaryCta": {
      "label": "Start 30-Day Free Trial",
      "href": "/signup",
      "visible": true
    },
    ...
  },
  "features": {
    "sectionTitle": "...",
    "items": [...]
  },
  ...
}
```

## Known Limitations

1. **Structural Changes**: Adding new sections or changing the page layout still requires a developer
2. **Images**: Image URLs must be publicly accessible (no file upload yet)
3. **Rich Text**: Currently supports plain text only (no markdown/HTML)
4. **Reordering**: List items can be added/removed but reordering UI is not yet implemented
5. **Validation**: Some validation happens, but complex validation may not catch all edge cases

## For Developers: Adding a New Field or Section

### Step 1: Update the Schema

Edit `/lib/content/schemas.ts`:

```typescript
export const heroSchema = z.object({
  // ... existing fields
  newField: z.string().optional(), // Add your new field
});
```

### Step 2: Update Defaults

Edit `/lib/content/defaults.ts`:

```typescript
export const defaultAIASContent: AIASContent = {
  hero: {
    // ... existing fields
    newField: "Default value",
  },
  // ...
};
```

### Step 3: Wire into Page Component

Update the page component (e.g., `/app/page.tsx` or `/app/settler/page.tsx`) to use the new field:

```typescript
{content.newField && <div>{content.newField}</div>}
```

### Step 4: Add to Content Studio UI

Create or update a section editor component in `/components/content-studio/`:

```typescript
<div className="space-y-2">
  <Label htmlFor="hero-newField">New Field</Label>
  <Input
    id="hero-newField"
    value={content.newField || ""}
    onChange={(e) => updateField("newField", e.target.value || undefined)}
  />
</div>
```

### Step 5: Test

1. Start the dev server
2. Navigate to Content Studio
3. Verify the new field appears and can be edited
4. Save and verify it appears on the live page

## Troubleshooting

### "Content Studio not configured"
- Set `CONTENT_STUDIO_TOKEN` in your environment variables

### "Failed to save content"
- Check that the token is correct
- Verify file permissions (the app needs write access to `/content/`)
- Check server logs for detailed error messages

### Changes not appearing on the page
- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Verify the content file was saved correctly
- Check that the page component is using the content config

### Content file missing
- The file is created automatically with defaults on first load
- If it's missing, check file permissions and ensure the `/content/` directory is writable

## Architecture

- **Storage**: File-based JSON configs (simple, version-controlled, no DB needed)
- **Validation**: Zod schemas ensure type safety and data integrity
- **Defaults**: Robust defaults ensure pages always render, even if config is missing
- **API Routes**: `/api/content/aias` and `/api/content/settler` handle read/write
- **UI**: React components in `/components/content-studio/` provide the editing interface

## Security

- Content Studio routes are protected by token authentication
- Tokens should be strong, random strings (use a password generator)
- Never commit tokens to git
- Consider adding IP whitelisting for production if needed
- The `/admin/content-studio` route should not be indexed by search engines (already handled by Next.js)

## Future Enhancements

- [ ] Image upload functionality
- [ ] Rich text editor for descriptions
- [ ] Drag-and-drop reordering for list items
- [ ] Content versioning/history
- [ ] Preview mode (see changes before saving)
- [ ] Bulk import/export
- [ ] Multi-language support

## Support

For issues or questions:
1. Check this documentation
2. Review server logs for errors
3. Contact the development team
