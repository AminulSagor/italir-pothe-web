import type { MetadataRoute } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://italirpothe.com"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/courses",
    "/books",
    "/webinars",
    "/certificates/verify",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/account-deletion",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
