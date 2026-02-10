/**
 * Snapshot Command - Create database snapshot
 */

import { execSync } from 'child_process';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

export async function snapshot(options: {
  encrypt?: boolean;
  tables?: string;
}) {
  console.log('📸 Creating database snapshot...\n');

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const snapshotDir = path.join(process.cwd(), 'ops', 'snapshots');
  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
  }

  const snapshotFile = path.join(snapshotDir, `snapshot-${timestamp}.sql`);

  try {
    // Use pg_dump via Prisma
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      throw new Error('DATABASE_URL not set');
    }

    let tablesParam = '';
    if (options.tables) {
      const tableList = options.tables
        .split(',')
        .map(t => t.trim())
        .join(' ');
      tablesParam = `-t ${tableList}`;
    }

    // Create snapshot using pg_dump
    execSync(`pg_dump "${dbUrl}" ${tablesParam} > "${snapshotFile}"`, {
      stdio: 'inherit',
    });

    // Encrypt if requested
    if (options.encrypt) {
      const encryptionKey = process.env.ENCRYPTION_KEY;
      if (!encryptionKey) {
        console.warn('⚠️  ENCRYPTION_KEY not set, skipping encryption');
      } else {
        // Simple encryption using openssl (in production, use proper crypto)
        const encryptedFile = `${snapshotFile}.enc`;
        execSync(
          `openssl enc -aes-256-cbc -salt -in "${snapshotFile}" -out "${encryptedFile}" -pass pass:${encryptionKey}`,
          { stdio: 'inherit' }
        );
        fs.unlinkSync(snapshotFile); // Remove unencrypted version
        console.log(`✅ Encrypted snapshot created: ${encryptedFile}`);
        return;
      }
    }

    // Create metadata file
    const metadata = {
      timestamp: new Date().toISOString(),
      file: path.basename(snapshotFile),
      tables: options.tables
        ? options.tables.split(',').map(t => t.trim())
        : 'all',
      encrypted: options.encrypt || false,
      checksum: createHash('sha256')
        .update(fs.readFileSync(snapshotFile))
        .digest('hex'),
    };

    const metadataFile = snapshotFile.replace('.sql', '.meta.json');
    fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

    console.log(`✅ Snapshot created: ${snapshotFile}`);
    console.log(`📊 Metadata: ${metadataFile}`);
  } catch (error) {
    console.error('❌ Snapshot creation failed:', error);
    throw error;
  }
}
