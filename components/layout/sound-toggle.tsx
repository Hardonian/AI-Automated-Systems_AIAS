"use client";

import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, toggleSound } from "@/lib/audio/sound-fx";

export function SoundToggle({ className = "" }: { className?: string }) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isSoundEnabled());

    const handleSfxChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      if (customEvent.detail) {
        setEnabled(customEvent.detail.enabled);
      }
    };

    window.addEventListener("aias_sfx_change", handleSfxChange);
    return () => window.removeEventListener("aias_sfx_change", handleSfxChange);
  }, []);

  const handleToggle = () => {
    const next = toggleSound();
    setEnabled(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={enabled ? "Mute interface sound effects" : "Enable interface sound effects"}
      title={enabled ? "SFX: Enabled (Click to mute)" : "SFX: Muted (Click to enable)"}
      className={`group flex items-center gap-1.5 px-2.5 py-1.5 font-mono text-xs font-bold uppercase transition-all cursor-pointer border-2 ${
        enabled
          ? "border-primary/40 bg-primary/5 text-primary hover:border-primary hover:bg-primary/10"
          : "border-border bg-card text-muted-foreground hover:border-foreground/50 hover:text-foreground"
      } ${className}`}
    >
      {enabled ? (
        <Volume2 className="h-3.5 w-3.5 text-primary" />
      ) : (
        <VolumeX className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline tracking-wider text-[11px]">
        {enabled ? "SFX:ON" : "SFX:OFF"}
      </span>
    </button>
  );
}
