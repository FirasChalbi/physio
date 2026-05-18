import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LifeDeal Yvelines",
    short_name: "LifeDeal",
    description: "Découvrez les meilleures offres locales en Yvelines",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#c0392b",
    icons: [
      {
        src: "/logo2.png",
        sizes: "any",
        type: "image/jpeg",
      },
      {
        src: "/logo2.png",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/logo2.png",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
