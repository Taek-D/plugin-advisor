type EventName =
  | "landing_view"
  | "analysis_start"
  | "analysis_complete"
  | "script_copy"
  | "onboarding_start"
  | "onboarding_complete"
  | "favorite_save"
  | "plugin_detail_view"
  | "preset_select"
  | "preflight_checked"
  | "install_complete"
  | "lead_submit"
  | "service_cta_click"
  | "guide_view"
  | "plugin_suggestion_open"
  | "plugin_suggestion_submit";

type EventPayload = Record<string, string | number | boolean>;

const STORAGE_KEY = "plugin-advisor-events";
const MAX_STORED = 200;

function getStoredEvents(): Array<{ event: EventName; payload: EventPayload; ts: number }> {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function trackEvent(event: EventName, payload: EventPayload = {}): void {
  if (typeof window === "undefined") return;

  const entry = { event, payload, ts: Date.now() };

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event, payload);
  }

  try {
    const events = getStoredEvents();
    events.push(entry);
    // Keep only the most recent events
    const trimmed = events.slice(-MAX_STORED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage full or unavailable — silently skip
  }
}

export function getEventStats(): { total: number; byEvent: Record<string, number> } {
  const events = getStoredEvents();
  const byEvent: Record<string, number> = {};
  for (const e of events) {
    byEvent[e.event] = (byEvent[e.event] ?? 0) + 1;
  }
  return { total: events.length, byEvent };
}
