"use client";
import { useEffect } from "react";

export function PWARegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("SW registered:", registration);
        })
        .catch((error) => {
          console.error("SW registration failed:", error);
        });
    }
  }, []);

  return null;
}
