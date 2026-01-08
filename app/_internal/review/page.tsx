import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReviewClient } from "./review-client";

import { getAdminUser } from "@/lib/auth/admin-auth";
import { getPublicRuntimeUiConfig } from "@/lib/runtime-ui/server";

export const metadata: Metadata = {
  title: "Internal Review",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-snippet": 0,
      "max-image-preview": "none",
      "max-video-preview": -1,
    },
  },
};

export default async function InternalReviewPage() {
  const vercelEnv = process.env.VERCEL_ENV; // 'production' | 'preview' | 'development'
  const envLabel = vercelEnv ? `vercel:${vercelEnv}` : (process.env.NODE_ENV ?? "unknown");
  const previewOrDev = vercelEnv === "preview" || vercelEnv === "development" || process.env.NODE_ENV !== "production";

  let adminUser = null;
  try {
    adminUser = await getAdminUser();
  } catch {
    adminUser = null;
  }

  // Production gating: only allow admins.
  // Preview/dev: allow for fast iteration during polish passes.
  if (!previewOrDev && !adminUser) {
    notFound();
  }

  const { config, source } = await getPublicRuntimeUiConfig();

  return <ReviewClient canEdit={!!adminUser} config={config} envLabel={envLabel} source={source} />;
}

