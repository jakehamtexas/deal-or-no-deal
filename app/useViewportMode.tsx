"use client";

export type ViewportMode =
  | "mobile-portrait"
  | "mobile-landscape"
  | "tablet-landscape"
  | "tablet-portrait"
  | "desktop";

export function useViewportMode(): ViewportMode {
  // Detect the viewport mode

  if (typeof window === "undefined") {
    return "mobile-portrait";
  }

  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth < 1024;
  const isLandscape = window.innerWidth > window.innerHeight;

  if (isMobile) {
    return isLandscape ? "mobile-landscape" : "mobile-portrait";
  }

  if (isTablet) {
    return isLandscape ? "tablet-landscape" : "tablet-portrait";
  }

  return "desktop";
}
