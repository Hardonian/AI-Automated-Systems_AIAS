/**
 * Edge AI Storage Integration
 * Handles file uploads and downloads for Edge AI models and artifacts
 */

import { createClient } from '@supabase/supabase-js';

import type { EdgeAIModelFormat } from './types';

import { env } from '@/lib/env';
import { logger } from '@/lib/logging/structured-logger';
import { deleteFileSecure } from '@/lib/security/file-upload';

const supabase = createClient(env.supabase.url, env.supabase.serviceRoleKey);

// Storage bucket names
const EDGE_AI_BUCKETS = {
  models: 'edge-ai-models',
  artifacts: 'edge-ai-artifacts',
  datasets: 'edge-ai-datasets',
} as const;

/**
 * Initialize Edge AI storage buckets
 * Call this during setup/migration
 */
export async function initializeEdgeAIStorage(): Promise<void> {
  try {
    // Check if buckets exist, create if not
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketNames = buckets?.map(b => b.name) || [];

    for (const [key, bucketName] of Object.entries(EDGE_AI_BUCKETS)) {
      if (!bucketNames.includes(bucketName)) {
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: false, // Private buckets for security
          fileSizeLimit: key === 'models' ? 2147483648 : 1073741824, // 2GB for models, 1GB for artifacts
          allowedMimeTypes: key === 'models' 
            ? [
                'application/octet-stream',
                'application/x-onnx',
                'application/x-tflite',
                'application/x-gguf',
                'application/x-coreml',
                'application/x-tensorrt',
              ]
            : null, // Allow all for artifacts
        });

        if (error) {
          logger.error(`Failed to create bucket ${bucketName}`, error);
        } else {
          logger.info(`Created storage bucket: ${bucketName}`);
        }
      }
    }
  } catch (error) {
    logger.error('Failed to initialize Edge AI storage', error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

/**
 * Upload model file to storage
 */
export async function uploadModelFile(
  file: File | Buffer,
  filename: string,
  userId: string,
  modelId: string,
  format: EdgeAIModelFormat
): Promise<{ success: boolean; filePath?: string; fileUrl?: string; error?: string }> {
  try {
    // Determine MIME type based on format
    const mimeTypes: Record<EdgeAIModelFormat, string> = {
      onnx: 'application/x-onnx',
      tflite: 'application/x-tflite',
      gguf: 'application/x-gguf',
      coreml: 'application/x-coreml',
      tensorrt: 'application/x-tensorrt',
      openvino: 'application/xml',
      ncnn: 'application/octet-stream',
      other: 'application/octet-stream',
    };

    const mimeType = mimeTypes[format] || 'application/octet-stream';

    // Sanitize filename
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const fileExtension = sanitizedFilename.substring(sanitizedFilename.lastIndexOf('.'));
    const uniqueFilename = `${modelId}-${timestamp}${fileExtension}`;

    // Build storage path
    const storagePath = `models/${userId}/${uniqueFilename}`;

    // Convert File to Buffer if needed
    let fileBuffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      fileBuffer = file;
    }

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(EDGE_AI_BUCKETS.models)
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: false,
        cacheControl: '3600',
      });

    if (error) {
      logger.error('Model file upload failed', error, {
        filename,
        storagePath,
        userId,
        modelId,
      });
      return {
        success: false,
        error: `Upload failed: ${error.message}`,
      };
    }

    // Generate signed URL (valid for 1 hour, extendable)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(EDGE_AI_BUCKETS.models)
      .createSignedUrl(storagePath, 3600); // 1 hour

    if (urlError) {
      logger.warn('Failed to generate signed URL', urlError);
    }

    logger.info('Model file uploaded successfully', {
      filename,
      storagePath,
      userId,
      modelId,
      size: fileBuffer.length,
    });

    return {
      success: true,
      filePath: storagePath,
      fileUrl: urlData?.signedUrl,
    };
  } catch (error) {
    logger.error('Model file upload error', error instanceof Error ? error : new Error(String(error)), {
      filename,
      userId,
      modelId,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Upload artifact to storage
 */
export async function uploadArtifact(
  file: File | Buffer,
  filename: string,
  userId: string,
  artifactId: string,
  artifactType: string
): Promise<{ success: boolean; filePath?: string; fileUrl?: string; error?: string }> {
  try {
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const fileExtension = sanitizedFilename.substring(sanitizedFilename.lastIndexOf('.'));
    const uniqueFilename = `${artifactId}-${timestamp}${fileExtension}`;

    // Build storage path based on artifact type
    const storagePath = `artifacts/${userId}/${artifactType}/${uniqueFilename}`;

    let fileBuffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    } else {
      fileBuffer = file;
    }

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(EDGE_AI_BUCKETS.artifacts)
      .upload(storagePath, fileBuffer, {
        contentType: 'application/octet-stream',
        upsert: false,
        cacheControl: '3600',
      });

    if (error) {
      logger.error('Artifact upload failed', error, {
        filename,
        storagePath,
        userId,
        artifactId,
      });
      return {
        success: false,
        error: `Upload failed: ${error.message}`,
      };
    }

    // Generate signed URL (valid for 7 days for artifacts)
    const { data: urlData, error: urlError } = await supabase.storage
      .from(EDGE_AI_BUCKETS.artifacts)
      .createSignedUrl(storagePath, 604800); // 7 days

    if (urlError) {
      logger.warn('Failed to generate signed URL', urlError);
    }

    logger.info('Artifact uploaded successfully', {
      filename,
      storagePath,
      userId,
      artifactId,
      size: fileBuffer.length,
    });

    return {
      success: true,
      filePath: storagePath,
      fileUrl: urlData?.signedUrl,
    };
  } catch (error) {
    logger.error('Artifact upload error', error instanceof Error ? error : new Error(String(error)), {
      filename,
      userId,
      artifactId,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Generate signed download URL for model file
 */
export async function getModelDownloadUrl(
  filePath: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(EDGE_AI_BUCKETS.models)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      logger.error('Failed to generate model download URL', error, { filePath });
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      url: data.signedUrl,
    };
  } catch (error) {
    logger.error('Error generating model download URL', error instanceof Error ? error : new Error(String(error)), {
      filePath,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Generate signed download URL for artifact
 */
export async function getArtifactDownloadUrl(
  filePath: string,
  expiresIn: number = 604800 // 7 days default
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.storage
      .from(EDGE_AI_BUCKETS.artifacts)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      logger.error('Failed to generate artifact download URL', error, { filePath });
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      url: data.signedUrl,
    };
  } catch (error) {
    logger.error('Error generating artifact download URL', error instanceof Error ? error : new Error(String(error)), {
      filePath,
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Delete model file from storage
 */
export async function deleteModelFile(filePath: string): Promise<{ success: boolean; error?: string }> {
  return deleteFileSecure(filePath, EDGE_AI_BUCKETS.models);
}

/**
 * Delete artifact from storage
 */
export async function deleteArtifact(filePath: string): Promise<{ success: boolean; error?: string }> {
  return deleteFileSecure(filePath, EDGE_AI_BUCKETS.artifacts);
}

/**
 * Get file size from storage
 */
export async function getFileSize(filePath: string, bucket: keyof typeof EDGE_AI_BUCKETS): Promise<number | null> {
  try {
    const { data, error } = await supabase.storage
      .from(EDGE_AI_BUCKETS[bucket])
      .list(filePath.substring(0, filePath.lastIndexOf('/')), {
        search: filePath.substring(filePath.lastIndexOf('/') + 1),
      });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data[0]?.metadata?.size || null;
  } catch (error) {
    logger.error('Error getting file size', error instanceof Error ? error : new Error(String(error)), { filePath });
    return null;
  }
}
