import { useEffect } from "react";
import { useGetSettings } from "@workspace/api-client-react";

function hexToHsl(hex: string): string | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function ThemeApplier() {
  const { data: settings } = useGetSettings({ query: { staleTime: 60_000 } });

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;

    if (settings.primaryColor) {
      const hsl = hexToHsl(settings.primaryColor);
      if (hsl) {
        root.style.setProperty("--primary", hsl);
        root.style.setProperty("--ring", hsl);
        root.style.setProperty("--sidebar-primary", hsl);
        root.style.setProperty("--sidebar-ring", hsl);
        root.style.setProperty("--accent", hsl);
        root.style.setProperty("--chart-1", hsl);
      }
    }

    if (settings.secondaryColor) {
      const hsl = hexToHsl(settings.secondaryColor);
      if (hsl) {
        root.style.setProperty("--secondary", hsl);
        root.style.setProperty("--sidebar-accent", hsl);
        root.style.setProperty("--muted", hsl);
      }
    }

    if (settings.accentColor) {
      const hsl = hexToHsl(settings.accentColor);
      if (hsl) {
        root.style.setProperty("--card", hsl);
        root.style.setProperty("--popover", hsl);
      }
    }

    if (settings.darkMode === false) {
      root.classList.add("light-mode");
      root.classList.remove("dark-mode");
    } else {
      root.classList.remove("light-mode");
      root.classList.add("dark-mode");
    }
  }, [settings]);

  return null;
}
