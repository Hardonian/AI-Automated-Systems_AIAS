import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

interface StaticMetrics {
  generatedAt: string;
  htmlFiles: number;
  javascriptBytes: number;
  javascriptFiles: number;
}

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory()
        ? collectFiles(entryPath)
        : entry.isFile()
          ? [entryPath]
          : [];
    }),
  );

  return nested.flat();
}

async function getStaticMetrics(): Promise<StaticMetrics> {
  const outputDirectory = path.join(process.cwd(), "out");
  const files = await collectFiles(outputDirectory);
  const javascriptFiles = files.filter((file) => file.endsWith(".js"));
  const sizes = await Promise.all(javascriptFiles.map((file) => stat(file)));

  return {
    generatedAt: new Date().toISOString(),
    htmlFiles: files.filter((file) => file.endsWith(".html")).length,
    javascriptBytes: sizes.reduce((total, file) => total + file.size, 0),
    javascriptFiles: javascriptFiles.length,
  };
}

async function main(): Promise<void> {
  const destination = process.argv[2];
  const metrics = await getStaticMetrics();
  const serializedMetrics = `${JSON.stringify(metrics, null, 2)}\n`;

  if (destination) {
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, serializedMetrics, "utf8");
  } else {
    process.stdout.write(serializedMetrics);
  }
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
