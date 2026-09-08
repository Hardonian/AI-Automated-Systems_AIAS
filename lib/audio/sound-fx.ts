/**
 * Audio-Haptic Tactile Sound Synthesizer
 *
 * Uses native Web Audio API to synthesize subtle, high-tech mechanical clicks
 * and telemetry tones entirely on the client side.
 *
 * ZERO external sound files, 0KB network payload, 100% offline & static-friendly.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

// Initialize preference from localStorage if available
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem("aias_sfx_enabled");
    if (saved !== null) {
      soundEnabled = saved === "true";
    }
  } catch {
    // Ignore storage errors
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("aias_sfx_enabled", String(enabled));
      window.dispatchEvent(
        new CustomEvent("aias_sfx_change", { detail: { enabled } }),
      );
    } catch {
      // Ignore storage errors
    }
  }
}

export function toggleSound(): boolean {
  const next = !soundEnabled;
  setSoundEnabled(next);
  if (next) {
    playSuccess();
  }
  return next;
}

/**
 * Item 23: Haptic feedback via Vibration API
 * Fires alongside audio for a multi-sensory tactile experience.
 * Gracefully no-ops on devices/browsers without vibration support.
 */
function hapticPulse(pattern: number | number[]): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Vibration not supported or blocked — silent fallback
    }
  }
}

/**
 * Play an ultra-short, crisp tactile mechanical click (tactile switch feel)
 */
export function playClick(): void {
  if (!soundEnabled) return;
  hapticPulse(10); // Single 10ms tap
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  } catch {
    // Graceful silent fallback
  }
}

/**
 * Play a high-tech telemetry pulse tone (stage progression or data arrival)
 */
export function playTelemetryTone(): void {
  if (!soundEnabled) return;
  hapticPulse(15); // Single 15ms pulse
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1760, now + 0.05);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.065);
  } catch {
    // Graceful silent fallback
  }
}

/**
 * Play a low warning/intercept chirp (policy gate triggered)
 */
export function playWarning(): void {
  if (!soundEnabled) return;
  hapticPulse([20, 30, 20]); // Double-pulse warning tap
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(220, now + 0.08);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.095);
  } catch {
    // Graceful silent fallback
  }
}

/**
 * Play a confirmation success chime (pipeline completed)
 */
export function playSuccess(): void {
  if (!soundEnabled) return;
  hapticPulse([15, 20, 15, 20, 15]); // Triple-pulse confirmation
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = "sine";
    osc2.type = "sine";

    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.05); // E5

    osc2.frequency.setValueAtTime(1046.5, now + 0.05); // C6

    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.05);

    osc1.stop(now + 0.15);
    osc2.stop(now + 0.15);
  } catch {
    // Graceful silent fallback
  }
}
