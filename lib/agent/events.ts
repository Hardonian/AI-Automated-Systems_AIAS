export interface AgentEventPayload {
  type: string;
  path?: string;
  meta?: Record<string, unknown>;
  session_id?: string;
  app?: string;
}

export function track(userId: string, payload: AgentEventPayload) {
  try {
    const body = JSON.stringify({ user_id: userId, session_id: payload.session_id, app: payload.app || "web", type: payload.type, path: payload.path || location?.pathname, meta: payload.meta });
    navigator.sendBeacon?.("/api/ingest", body) || fetch("/api/ingest", { method:"POST", headers:{"content-type":"application/json"}, body });
  } catch {}
}
