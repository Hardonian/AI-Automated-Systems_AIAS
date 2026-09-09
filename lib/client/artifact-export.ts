const downloadBlob = (name: string, blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const downloadText = (name: string, content: string, type: string) =>
  downloadBlob(name, new Blob([content], { type }));

const pdfEscape = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[^\x20-\x7E\n]/g, "")
    .replace(/([\\()])/g, "\\$1");

export function createTextPdf(title: string, body: string): Blob {
  const lines = [title, "", ...body.split("\n")].slice(0, 42);
  const commands = lines
    .map(
      (line, index) =>
        `BT /F1 ${index === 0 ? 18 : 10} Tf 54 ${750 - index * 16} Td (${pdfEscape(line).slice(0, 92)}) Tj ET`,
    )
    .join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >> endobj\n",
    `4 0 obj << /Length ${commands.length} >> stream\n${commands}\nendstream endobj\n`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Courier >> endobj\n",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const object of objects) {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += object;
  }
  const xrefOffset = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`)
    .join("");
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

export const downloadPdf = (name: string, title: string, body: string) =>
  downloadBlob(name, createTextPdf(title, body));

export const architectureSvg = (nodes: string[]) => {
  const width = Math.max(720, nodes.length * 180);
  const boxes = nodes
    .map((node, index) => {
      const x = 30 + index * 180;
      const connector =
        index < nodes.length - 1
          ? `<path d="M${x + 140} 80 H${x + 180}" stroke="#ff4d1a" stroke-width="4"/>`
          : "";
      return `<g><rect x="${x}" y="45" width="140" height="70" fill="#09090b" stroke="#ff4d1a" stroke-width="3"/><text x="${x + 70}" y="85" text-anchor="middle" fill="#fafafa" font-family="monospace" font-size="13">${node}</text>${connector}</g>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="160" viewBox="0 0 ${width} 160"><rect width="100%" height="100%" fill="#020617"/>${boxes}</svg>`;
};

export async function downloadArchitecturePng(nodes: string[]) {
  const svg = architectureSvg(nodes);
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(new Error("Unable to render architecture image"));
      image.src = url;
    });
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    canvas.getContext("2d")?.drawImage(image, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (blob) downloadBlob("aias-architecture.png", blob);
  } finally {
    URL.revokeObjectURL(url);
  }
}
