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

function applyOrRemove(root: HTMLElement, props: string[], hex: string | null | undefined) {
  if (hex) {
    const hsl = hexToHsl(hex);
    if (hsl) {
      props.forEach(p => root.style.setProperty(p, hsl));
      return;
    }
  }
  // No custom color — remove inline overrides so the CSS file defaults take over
  props.forEach(p => root.style.removeProperty(p));
}

export function ThemeApplier() {
  const { data: settings } = useGetSettings({ query: { staleTime: 60_000 } });

  useEffect(() => {
    if (!settings) return;
    const root = document.documentElement;

    applyOrRemove(root, ["--primary", "--ring", "--sidebar-primary", "--sidebar-ring", "--chart-1"], settings.primaryColor);
    applyOrRemove(root, ["--secondary", "--sidebar-accent", "--muted"], settings.secondaryColor);
    applyOrRemove(root, ["--card", "--popover"], settings.accentColor);

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
