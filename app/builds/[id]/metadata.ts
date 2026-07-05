import type { Metadata } from "next";
import { headers } from "next/headers";
import { Build, Category, Role } from "@/app/data/build";

function cleanText(value: string): string {
  return value
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[>#*_~`]/g, "")
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/\s+/g, " ")
    .replace(/\u00a0/g, " ")
    .trim();
}

export function summarizeBuildDescription(description?: string | null): string {
  if (!description) {
    return "Explore this Bridgewatch build and see the recommended setup.";
  }

  const cleaned = cleanText(description);

  return cleaned.length > 160 ? `${cleaned.slice(0, 157)}...` : cleaned;
}

export async function buildPageMetadata(build: Build | undefined, buildId?: number): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://www.bridgewatch.online`;
  const normalizedSiteUrl = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;
  const buildPath = buildId ? `/builds/${buildId}` : "/builds";
  const canonicalUrl = `${normalizedSiteUrl.slice(0, -1)}${buildPath}`;
  const ogImageUrl = new URL("/images/BridgewatchIcon.png", normalizedSiteUrl).toString();

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
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      siteName: "Bridgewatch",
      images: [
        {
          url: ogImageUrl,
          width: 512,
          height: 512,
          alt: "Bridgewatch logo",
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
