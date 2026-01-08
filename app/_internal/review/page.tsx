import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getAdminUser } from "@/lib/auth/admin-auth";
import { getPublicRuntimeUiConfig } from "@/lib/runtime-ui/server";

import { ReviewClient } from "./review-client";

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

function getEnvLabel() {
  const vercelEnv = process.env.VERCEL_ENV; // 'production' | 'preview' | 'development'
  if (vercelEnv) {
    return `vercel:${vercelEnv}`;
  }
  return process.env.NODE_ENV ?? "unknown";
}

function isPreviewOrDev() {
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv === "preview" || vercelEnv === "development") {
    return true;
  }
  return process.env.NODE_ENV !== "production";
}

export default async function InternalReviewPage() {
  const envLabel = getEnvLabel();
  const previewOrDev = isPreviewOrDev();

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

  return <ReviewClient config={config} envLabel={envLabel} source={source} />;
}

