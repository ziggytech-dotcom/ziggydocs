import type { MetadataRoute } from "next";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ziggydocs.com";
  const now = new Date();
  const routes = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/features", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/pricing", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/agencies", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/contractors", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/real-estate", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/vs/docusign", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/vs/hellosign", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/vs/pandadoc", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/privacy", priority: 0.5, changeFrequency: "yearly" as const },
    { url: "/terms", priority: 0.5, changeFrequency: "yearly" as const },
  ];
  return routes.map((route) => ({ url: `${baseUrl}${route.url}`, lastModified: now, changeFrequency: route.changeFrequency, priority: route.priority }));
}
