export interface TelemetryPayload {
  type: string;
  path?: string;
  meta?: Record<string, unknown>;
  app?: string;
}

export function track(userId: string, payload: TelemetryPayload) {
  try{
    const body = JSON.stringify({ user_id:userId, app: payload.app||'web', type: payload.type, path: payload.path || (globalThis.location?.pathname ?? '/'), meta: payload.meta });
    const send=()=>fetch("/api/telemetry/ingest",{method:"POST",headers:{"content-type":"application/json"},body});
    if(typeof navigator!=='undefined' && 'sendBeacon' in navigator){ navigator.sendBeacon("/api/telemetry/ingest", body); } else { send(); }
  }catch{}
}
