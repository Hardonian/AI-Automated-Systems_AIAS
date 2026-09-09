"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Accessibility,
  Download,
  Expand,
  FileWarning,
  Gauge,
  Radio,
  RotateCcw,
  Volume2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useLocalStorage } from "@/lib/utils/client-engines";

interface DisplayModes {
  amber: boolean;
  colorblind: boolean;
  dyslexic: boolean;
}

interface ClientError {
  message: string;
  time: string;
}

const subscribeOnline = (callback: () => void) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

const getOnline = () => navigator.onLine;
const getServerOnline = () => true;

export function ExperienceControls() {
  const online = useSyncExternalStore(
    subscribeOnline,
    getOnline,
    getServerOnline,
  );
  const [modes, setModes] = useLocalStorage<DisplayModes>(
    "aias_display_modes",
    {
      amber: false,
      colorblind: false,
      dyslexic: false,
    },
  );
  const [errors, setErrors] = useState<ClientError[]>([]);
  const [exitOpen, setExitOpen] = useState(false);
  const exitArmed = useRef(false);

  useEffect(() => {
    document.documentElement.classList.toggle("crt-amber", modes.amber);
    document.documentElement.classList.toggle(
      "colorblind-safe",
      modes.colorblind,
    );
    document.documentElement.classList.toggle("dyslexic-font", modes.dyslexic);
  }, [modes]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      exitArmed.current = true;
    }, 15_000);
    const onExit = (event: MouseEvent) => {
      if (
        event.clientY > 4 ||
        !exitArmed.current ||
        sessionStorage.getItem("aias_exit_drawer_seen")
      )
        return;
      sessionStorage.setItem("aias_exit_drawer_seen", "true");
      setExitOpen(true);
    };
    document.addEventListener("mouseout", onExit);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onExit);
    };
  }, []);

  useEffect(() => {
    const record = (message: string) => {
      const entry = {
        message: message.slice(0, 500),
        time: new Date().toISOString(),
      };
      setErrors((current) => [entry, ...current].slice(0, 20));
    };
    const onError = (event: ErrorEvent) =>
      record(event.message || "Unknown client error");
    const onRejection = (event: PromiseRejectionEvent) =>
      record(
        event.reason instanceof Error
          ? event.reason.message
          : String(event.reason),
      );
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    const onStart = (event: TouchEvent) => {
      startX = event.touches[0]?.clientX ?? 0;
      startY = event.touches[0]?.clientY ?? 0;
    };
    const onEnd = (event: TouchEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [data-no-swipe]")) return;
      const end = event.changedTouches[0];
      if (!end) return;
      const dx = end.clientX - startX;
      const dy = end.clientY - startY;
      if (startY < 70 && window.scrollY === 0 && dy > 120) {
        window.dispatchEvent(new CustomEvent("aias:telemetry-reset"));
      } else if (Math.abs(dx) > 100 && Math.abs(dy) < 55) {
        if (dx > 0) history.back();
        else history.forward();
      }
    };
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, []);

  const toggleMode = (key: keyof DisplayModes) =>
    setModes((current) => ({ ...current, [key]: !current[key] }));
  const speakPage = () => {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const text =
      document
        .querySelector("main")
        ?.textContent?.replace(/\s+/g, " ")
        .trim()
        .slice(0, 1_200) ?? "AIAS page";
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    speechSynthesis.speak(utterance);
  };
  const toggleFullscreen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen();
  };

  return (
    <>
      {!online ? (
        <div
          className="fixed inset-x-0 top-0 z-[90] bg-warning px-4 py-2 text-center font-mono text-xs font-black uppercase text-warning-foreground"
          role="status"
        >
          Offline mode · cached tools remain available
        </div>
      ) : null}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            aria-label="Open interface controls"
            className="fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full p-0 shadow-lg md:bottom-5"
            title="Interface controls"
          >
            <Accessibility className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="max-h-[85dvh] overflow-y-auto border-2 border-border sm:max-w-md"
          side="bottom"
        >
          <SheetHeader>
            <SheetTitle className="font-mono uppercase">
              Interface control deck
            </SheetTitle>
            <SheetDescription>
              Local accessibility, display, kiosk, voice, and diagnostics
              controls.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              aria-pressed={modes.amber}
              onClick={() => toggleMode("amber")}
              variant="outline"
            >
              <Gauge className="mr-2 h-4 w-4" />
              CRT amber
            </Button>
            <Button
              aria-pressed={modes.colorblind}
              onClick={() => toggleMode("colorblind")}
              variant="outline"
            >
              <Radio className="mr-2 h-4 w-4" />
              Color-safe
            </Button>
            <Button
              aria-pressed={modes.dyslexic}
              onClick={() => toggleMode("dyslexic")}
              variant="outline"
            >
              <Accessibility className="mr-2 h-4 w-4" />
              Dyslexic font
            </Button>
            <Button onClick={speakPage} variant="outline">
              <Volume2 className="mr-2 h-4 w-4" />
              Read page
            </Button>
            <Button onClick={toggleFullscreen} variant="outline">
              <Expand className="mr-2 h-4 w-4" />
              Kiosk mode
            </Button>
            <Button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("aias:telemetry-reset"))
              }
              variant="outline"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset telemetry
            </Button>
          </div>
          <div className="mt-6 border-t-2 border-border pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs font-black uppercase">
                <FileWarning className="mr-2 inline h-4 w-4" />
                Client error log
              </h3>
              <Button onClick={() => setErrors([])} size="sm" variant="ghost">
                Clear
              </Button>
            </div>
            {errors.length ? (
              <ol className="mt-3 max-h-40 space-y-2 overflow-auto font-mono text-[10px]">
                {errors.map((error) => (
                  <li
                    className="border border-border p-2"
                    key={`${error.time}-${error.message}`}
                  >
                    {error.time} · {error.message}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                No client errors captured in this session.
              </p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet onOpenChange={setExitOpen} open={exitOpen}>
        <SheetContent
          className="border-2 border-primary sm:max-w-lg"
          side="right"
        >
          <SheetHeader>
            <SheetTitle className="font-mono uppercase">
              Save the blueprint before you go
            </SheetTitle>
            <SheetDescription>
              Keep the governed intake router and continue offline—no email
              gate.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            <Button asChild className="w-full">
              <a download href="/blueprints/governed-intake-router.md">
                <Download className="mr-2 h-4 w-4" />
                Download blueprint
              </a>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/blueprints">Browse all blueprints</Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
