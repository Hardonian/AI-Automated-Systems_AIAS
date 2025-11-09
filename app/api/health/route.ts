export const config = { runtime: "edge" };

export default function handler() {
  return new Response(
    JSON.stringify({
      ok: true,
      ts: Date.now(),
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
