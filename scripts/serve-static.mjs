import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";

const root = resolve(process.argv[2] || "out");
const port = Number(process.argv[3] || 3000);

if (!existsSync(root) || !statSync(root).isDirectory()) {
  console.error(`Static directory does not exist: ${root}`);
  process.exit(1);
}

const contentTypes = {
  ".avif": "image/avif",
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

const fileFor = (pathname) => {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname).replaceAll("\\", "/");
  } catch {
    return undefined;
  }
  const relativePath = decoded.replace(/^\/+/, "");
  const base = resolve(root, relativePath);

  if (base !== root && !base.startsWith(`${root}${sep}`)) return undefined;

  const candidates = [base, `${base}.html`, resolve(base, "index.html")];

  return candidates.find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
  );
};

createServer((request, response) => {
  const pathname = new URL(request.url || "/", "http://localhost").pathname;
  const file = fileFor(pathname);

  if (!file) {
    const notFound = resolve(root, "404.html");
    response.writeHead(404, {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
    });
    if (existsSync(notFound)) createReadStream(notFound).pipe(response);
    else response.end("Not found");
    return;
  }

  const extension = extname(file).toLowerCase();
  response.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": contentTypes[extension] || "application/octet-stream",
  });
  createReadStream(file).pipe(response);
}).listen(port, "127.0.0.1", () => {
  console.log(`Static preview ready at http://127.0.0.1:${port}`);
});
