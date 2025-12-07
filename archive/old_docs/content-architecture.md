# Content Architecture

## Overview

This document describes the content management architecture for the AIAS and Settler.dev websites. The system uses a file-based configuration approach that allows non-developers to edit marketing content without touching code.

## Current State

### AIAS Site (`/app/page.tsx`)

**Content Location:**
- Hero section: Uses `ContentDrivenHero` component with content from `/content/aias.json`
- Features: Currently uses hardcoded content (can be enhanced to use config)
- Testimonials: Currently uses hardcoded content (can be enhanced to use config)
- FAQ: Currently uses hardcoded content (can be enhanced to use config)

**Content File:** `/content/aias.json`

### Settler.dev Site (`/app/settler/page.tsx`)

**Content Location:**
- Hero section: Uses `ContentDrivenHero` component with content from `/content/settler.json`
- Features: Uses content from config with icon mapping
- Use Cases: Uses content from config
- Partnership: Uses content from config
- CTA: Uses content from config

**Content File:** `/content/settler.json`

## Content Model

### Storage Strategy

**File-based Configuration**
- Content is stored in JSON files in `/content/` directory
- Files are created automatically with defaults on first load
- Files are gitignored (user customizations are not committed)
- Default content is defined in code (`/lib/content/defaults.ts`)

### Schema Validation

All content is validated using Zod schemas defined in `/lib/content/schemas.ts`:

- `Hero` - Hero section content
- `FeatureSection` - Features list
- `TestimonialSection` - Testimonials
- `FAQSection` - FAQ categories and questions
- `AIASContent` - Complete AIAS site content
- `SettlerContent` - Complete Settler.dev site content

### Default Content

Default content is defined in `/lib/content/defaults.ts`:
- `defaultAIASContent` - Default AIAS content
- `defaultSettlerContent` - Default Settler content

These defaults ensure pages always render, even if config files are missing or invalid.

## Migration Plan

### Phase 1: Core Infrastructure ✅
- [x] Create content schemas
- [x] Create content loader utilities
- [x] Create API routes for read/write
- [x] Create Content Studio UI
- [x] Implement authentication

### Phase 2: Hero Sections ✅
- [x] Refactor AIAS hero to use content config
- [x] Refactor Settler hero to use content config

### Phase 3: Other Sections (In Progress)
- [x] Settler features, use cases, partnership, CTA
- [ ] AIAS features (partially done - component exists but not fully wired)
- [ ] AIAS testimonials (partially done - component exists but not fully wired)
- [ ] AIAS FAQ (partially done - component exists but not fully wired)

### Phase 4: Enhancements (Future)
- [ ] Image upload
- [ ] Rich text editor
- [ ] Drag-and-drop reordering
- [ ] Content versioning

## File Structure

```
/lib/content/
  schemas.ts          # Zod schemas for validation
  defaults.ts         # Default content definitions
  loader.ts           # Content loading/saving utilities

/app/api/content/
  aias/route.ts       # AIAS content API
  settler/route.ts    # Settler content API

/app/admin/content-studio/
  page.tsx            # Content Studio UI

/components/content-studio/
  ContentStudioHero.tsx
  ContentStudioFeatures.tsx
  ContentStudioTestimonials.tsx
  ContentStudioFAQ.tsx

/components/content/
  ContentDrivenHero.tsx  # Hero component that uses content config

/content/
  aias.json           # AIAS content (gitignored)
  settler.json        # Settler content (gitignored)
```

## API Endpoints

### GET `/api/content/aias`
Returns current AIAS content (public, no auth required for reading)

### POST `/api/content/aias`
Updates AIAS content (requires `Authorization: Bearer <token>` header)

### GET `/api/content/settler`
Returns current Settler content (public, no auth required for reading)

### POST `/api/content/settler`
Updates Settler content (requires `Authorization: Bearer <token>` header)

## Content Studio Access

- URL: `/admin/content-studio`
- Authentication: Token-based (set `CONTENT_STUDIO_TOKEN` env var)
- Features:
  - Edit hero, features, testimonials, FAQ
  - Save changes to JSON files
  - Preview changes
  - Reset unsaved changes

## Adding New Content Sections

See `/docs/content-studio.md` for detailed instructions on adding new fields or sections.

## Backward Compatibility

- All existing hardcoded content remains as fallback
- Pages gracefully degrade if content files are missing
- Default content ensures pages always render
- No breaking changes to existing functionality
