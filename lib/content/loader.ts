import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";

import {
  defaultAIASContent,
  defaultSettlerContent,
} from "./defaults";
import type { AIASContent, SettlerContent } from "./schemas";
import {
  aiasContentSchema,
  settlerContentSchema,
} from "./schemas";

const CONTENT_DIR = join(process.cwd(), "content");
const AIAS_CONFIG_PATH = join(CONTENT_DIR, "aias.json");
const SETTLER_CONFIG_PATH = join(CONTENT_DIR, "settler.json");

/**
 * Ensure content directory exists
 */
async function ensureContentDir(): Promise<void> {
  try {
    await mkdir(CONTENT_DIR, { recursive: true });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && error.code !== "EEXIST") {
      throw error;
    }
  }
}

/**
 * Load AIAS content with validation and defaults
 */
export async function loadAIASContent(): Promise<AIASContent> {
  try {
    await ensureContentDir();
    const fileContent = await readFile(AIAS_CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(fileContent);
    const validated = aiasContentSchema.parse(parsed);
    return validated;
  } catch (error: unknown) {
    // If file doesn't exist or is invalid, return defaults
    const isFileNotFound = error && typeof error === 'object' && 'code' in error && error.code === "ENOENT";
    const isZodError = error && typeof error === 'object' && 'name' in error && error.name === "ZodError";
    if (isFileNotFound || isZodError) {
      // Write defaults to file for first-time setup
      await saveAIASContent(defaultAIASContent);
      return defaultAIASContent;
    }
    // For other errors, still return defaults but log the error
    console.error("Error loading AIAS content:", error);
    return defaultAIASContent;
  }
}

/**
 * Load Settler content with validation and defaults
 */
export async function loadSettlerContent(): Promise<SettlerContent> {
  try {
    await ensureContentDir();
    const fileContent = await readFile(SETTLER_CONFIG_PATH, "utf-8");
    const parsed = JSON.parse(fileContent);
    const validated = settlerContentSchema.parse(parsed);
    return validated;
  } catch (error: unknown) {
    // If file doesn't exist or is invalid, return defaults
    const isFileNotFound = error && typeof error === 'object' && 'code' in error && error.code === "ENOENT";
    const isZodError = error && typeof error === 'object' && 'name' in error && error.name === "ZodError";
    if (isFileNotFound || isZodError) {
      // Write defaults to file for first-time setup
      await saveSettlerContent(defaultSettlerContent);
      return defaultSettlerContent;
    }
    // For other errors, still return defaults but log the error
    console.error("Error loading Settler content:", error);
    return defaultSettlerContent;
  }
}

/**
 * Save AIAS content with validation
 */
export async function saveAIASContent(
  content: AIASContent
): Promise<void> {
  try {
    await ensureContentDir();
    // Validate before saving
    const validated = aiasContentSchema.parse(content);
    await writeFile(
      AIAS_CONFIG_PATH,
      JSON.stringify(validated, null, 2),
      "utf-8"
    );
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === "ZodError" && 'errors' in error && Array.isArray(error.errors)) {
      throw new Error(
        `Invalid content: ${error.errors.map((e: unknown) => e && typeof e === 'object' && 'message' in e ? String(e.message) : String(e)).join(", ")}`
      );
    }
    throw error;
  }
}

/**
 * Save Settler content with validation
 */
export async function saveSettlerContent(
  content: SettlerContent
): Promise<void> {
  try {
    await ensureContentDir();
    // Validate before saving
    const validated = settlerContentSchema.parse(content);
    await writeFile(
      SETTLER_CONFIG_PATH,
      JSON.stringify(validated, null, 2),
      "utf-8"
    );
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'name' in error && error.name === "ZodError" && 'errors' in error && Array.isArray(error.errors)) {
      throw new Error(
        `Invalid content: ${error.errors.map((e: unknown) => e && typeof e === 'object' && 'message' in e ? String(e.message) : String(e)).join(", ")}`
      );
    }
    throw error;
  }
}

/**
 * Client-side content loader (for use in React components)
 * This will fetch from API routes
 */
export async function fetchAIASContent(): Promise<AIASContent> {
  const response = await fetch("/api/content/aias");
  if (!response.ok) {
    throw new Error("Failed to load AIAS content");
  }
  return response.json();
}

export async function fetchSettlerContent(): Promise<SettlerContent> {
  const response = await fetch("/api/content/settler");
  if (!response.ok) {
    throw new Error("Failed to load Settler content");
  }
  return response.json();
}
