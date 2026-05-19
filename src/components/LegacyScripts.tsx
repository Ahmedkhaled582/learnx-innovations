"use client";

import { useEffect } from "react";

const SCRIPTS = [
  "/assets/js/lib/jquery-3.7.1.min.js",
  "/assets/js/lib/bootstrap.bundle.min.js",
  "/assets/js/lib/apexcharts.min.js",
  "/assets/js/lib/iconify-icon.min.js",
  "/assets/js/lib/dataTables.min.js",
  "/assets/js/lib/jquery-ui.min.js",
  "/assets/js/app.js",
];

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[data-legacy-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const el = document.createElement("script");
    el.src = src;
    el.async = false;
    el.dataset.legacySrc = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

export default function LegacyScripts() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        for (const src of SCRIPTS) {
          if (cancelled) return;
          await loadScript(src);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
