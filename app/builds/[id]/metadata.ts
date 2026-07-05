import type { Metadata } from "next";
import { Build, Category, Role } from "@/app/data/build";

export function summarizeBuildDescription(description?: string | null): string {
  if (!description) {
    return "Explore this Bridgewatch build and see the recommended setup.";
  }

  const cleaned = description
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[>#*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.length > 160 ? `${cleaned.slice(0, 157)}...` : cleaned;
}

export function buildPageMetadata(build: Build | undefined, buildId?: number): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const normalizedSiteUrl = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
  const buildPath = buildId ? `/builds/${buildId}` : "/builds";

  const title = build
    ? `${build.name} | Bridgewatch Builds`
    : "Build Details | Bridgewatch";

  const roleLabel = build ? Role[build.role as keyof typeof Role] : "Build";
  const categoryLabel = build
    ? Category[build.category as keyof typeof Category][0]
    : "Build guide";

  const description = build
    ? `${roleLabel} • ${categoryLabel} • ${summarizeBuildDescription(build.description)}`
    : "View a Bridgewatch build guide and explore the recommended loadout.";

  return {
    title,
    description,
    metadataBase: new URL(normalizedSiteUrl),
    alternates: {
      canonical: `${normalizedSiteUrl.slice(0, -1)}${buildPath}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${normalizedSiteUrl.slice(0, -1)}${buildPath}`,
      siteName: "Bridgewatch",
      images: [
        {
          url: "/images/BridgewatchIcon.png",
          width: 512,
          height: 512,
          alt: "Bridgewatch logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/BridgewatchIcon.png"],
    },
  };
}
