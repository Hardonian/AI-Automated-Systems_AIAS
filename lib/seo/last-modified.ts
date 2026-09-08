export interface LastModifiedSources {
  readGitTimestamp: (filePath: string) => string;
  fileExists: (filePath: string) => boolean;
  readFileTimestamp: (filePath: string) => Date;
}

export function resolveLastModified(
  filePath: string,
  fallback: Date,
  sources: LastModifiedSources,
): Date {
  try {
    const gitTimestamp = sources.readGitTimestamp(filePath).trim();
    const gitDate = new Date(gitTimestamp);

    if (gitTimestamp && !Number.isNaN(gitDate.getTime())) {
      return gitDate;
    }
  } catch {
    // Fall through to the filesystem timestamp.
  }

  try {
    if (sources.fileExists(filePath)) {
      return sources.readFileTimestamp(filePath);
    }
  } catch {
    // A file can disappear between the existence and stat checks.
  }

  return fallback;
}
