import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site-config";

export const revalidate = 86400;

export default function manifest(): MetadataRoute.Manifest {
  const shortcuts = siteConfig.nav.map((route) => ({
    name: route.label,
    url: route.href,
    description: `${siteConfig.meta.title} - ${route.label}`,
  }));

  return {
    id: siteConfig.profile.name,
    name: siteConfig.meta.title,
    short_name: siteConfig.profile.name,
    description: siteConfig.meta.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: [
      "window-controls-overlay",
      "standalone",
      "minimal-ui",
      "fullscreen",
      "browser",
    ],
    orientation: "any",
    dir: "ltr",
    theme_color: "#1a1a1a",
    background_color: "#1a1a1a",
    categories: ["portfolio", "blog", "other"],
    icons: [
      {
        src: siteConfig.meta.icon,
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: siteConfig.meta.icon,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: siteConfig.meta.icon,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts,
  };
}
