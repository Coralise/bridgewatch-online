import { notFound } from "next/navigation";
import { BuildDetail } from "./BuildDetail";
import { buildPageMetadata } from "./metadata";
import { Build } from "@/app/data/build";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const buildId = Number(id);
  const build = Number.isNaN(buildId) ? undefined : await Build.getBuild(buildId);

  return buildPageMetadata(build, buildId);
}

export default async function BuildPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const buildId = Number(id);

  if (Number.isNaN(buildId)) {
    notFound();
  }

  const build = await Build.getBuild(buildId);

  if (!build) {
    notFound();
  }

  return <BuildDetail id={buildId} />
}
