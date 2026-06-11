"use client";
import { useParams } from "next/navigation";
import { BuildDetail } from "./BuildDetail";

export default function BuildPage() {
  const { id } = useParams();
  return <BuildDetail id={parseInt((id as string)!)} />
}
