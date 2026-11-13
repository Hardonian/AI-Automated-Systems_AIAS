import type { Metadata } from "next";
import { ArrowRight, Cpu, Download, ExternalLink, Layers } from "lucide-react";

import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  PageCta,
  PageHero,
  PageSection,
  SurfaceCard,
} from "@/components/ui/section-primitives";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generateSEOMetadata({
  title: "ComfyUI Workflow Packs | AI Automated Systems",
  description:
    "Eight local-first ComfyUI packs — 24 production workflows for starter generation, blog visuals, thumbnails, podcast art, style transfer, product photos, social, and portraits. Buy once, run on your own GPU.",
  canonical: "/p/comfyui-workflow-pack",
});

interface PackSpec {
  readonly id: string;
  readonly name: string;
  readonly price: string;
  readonly blurb: string;
  readonly includes: readonly string[];
  readonly note: string;
}

const GUMROAD_BASE = "https://scottrmhardie.gumroad.com/l/";

const PACKS: readonly PackSpec[] = [
  {
    id: "uzruxe",
    name: "ComfyUI Starter Pack",
    price: "$19",
    blurb:
      "The foundation trio: text-to-image, image-to-image, and 4× upscaling with tuned sampler settings.",
    includes: [
      "txt2img_sdxl.json — text-to-image with SDXL at 1024×1024",
      "img2img_sdxl.json — image-to-image style transfer",
      "upscale_realesrgan.json — 4× AI upscaling with RealESRGAN",
    ],
    note: "Built-in ComfyUI nodes only · 8GB+ VRAM",
  },
  {
    id: "efmddb",
    name: "ComfyUI Blog Pack",
    price: "$19",
    blurb:
      "Three blog-optimized workflows sized for the placements publishers actually ship.",
    includes: [
      "Open Graph images at 1200×630",
      "Hero banners at 1920×1080",
      "Pinterest pins at 1000×1500",
    ],
    note: "SDXL-powered, zero custom nodes",
  },
  {
    id: "hxkxkq",
    name: "ComfyUI YouTube Thumbnail Pack",
    price: "$19",
    blurb:
      "Attention-grabbing thumbnails generated from text, enhanced in a bold dramatic style, and upscaled to crisp 4K.",
    includes: [
      "Thumbnail generation from text in native 1280×720 16:9",
      "Dramatic-style enhancement for existing frames",
      "4K upscaling pass",
    ],
    note: "Workflow JSONs, presets, and sample outputs included",
  },
  {
    id: "ioywbj",
    name: "ComfyUI Podcast Cover Pack",
    price: "$19",
    blurb:
      "Three podcast-specific workflows covering the art a show needs at launch and every episode after.",
    includes: ["Show cover art", "Episode thumbnails", "Social promo imagery"],
    note: "SDXL-powered, zero custom nodes",
  },
  {
    id: "kjchwm",
    name: "ComfyUI Style Transfer Pack",
    price: "$19",
    blurb:
      "Apply eight-plus artistic styles with adjustable intensity — and blend them subtly instead of all-or-nothing.",
    includes: [
      "Style transfer across oil, watercolor, cyberpunk, anime, pop art, and more",
      "Subtle style blending with intensity control",
      "Print-quality upscaling",
    ],
    note: "Workflow JSONs, presets, and sample outputs included",
  },
  {
    id: "phgof",
    name: "ComfyUI E-Commerce Product Photo Pack",
    price: "$29",
    blurb:
      "Professional product photography workflows for sellers who need clean listings without a studio booking.",
    includes: [
      "product_shot_sdxl.json — studio-quality shots from text",
      "background_remove_birefnet.json — transparent-PNG cutouts",
      "lifestyle_scene_sdxl.json — img2img lifestyle placement",
    ],
    note: "WAS Node Suite required for background removal · 8GB+ VRAM",
  },
  {
    id: "rpfbh",
    name: "ComfyUI Social Media Pack",
    price: "$19",
    blurb:
      "Platform-optimized visuals for the three formats that carry most social distribution.",
    includes: [
      "Instagram squares",
      "Stories / Reels verticals",
      "Twitter/X cards",
    ],
    note: "SDXL-powered, zero custom nodes",
  },
  {
    id: "wsomcz",
    name: "ComfyUI Portrait Studio Pack",
    price: "$29",
    blurb:
      "A private portrait pipeline: generate, retouch, and refine on your own hardware — no face data uploaded anywhere.",
    includes: [
      "Studio-quality portraits from text at 1024×1344",
      "Refine and retouch for existing photos",
      "Detail-enhancing upscale chain",
    ],
    note: "Workflow JSONs, presets, and sample outputs included",
  },
] as const;

const TOTAL_WORKFLOWS = PACKS.length * 3;

function packUrl(id: string) {
  return `${GUMROAD_BASE}${id}`;
}

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "ComfyUI Workflow Packs",
  description:
    "Local-first ComfyUI workflow packs delivered instantly via Gumroad.",
  numberOfItems: TOTAL_WORKFLOWS,
  itemListElement: PACKS.map((pack, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: pack.name,
    url: packUrl(pack.id),
  })),
};

export default function ComfyUiWorkflowPackPage() {
  return (
    <>
      {/* Static build-time JSON-LD from module constants only — no user input
          reaches this payload (same idiom as app/catalog/[slug]/page.tsx). */}
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        id="comfyui-packs-itemlist-schema"
        type="application/ld+json"
      />

      <div className="container pt-4">
        <Breadcrumbs
          items={[
            { href: "/pricing", label: "Pricing" },
            { label: "ComfyUI Workflow Packs" },
          ]}
        />
      </div>

      <PageHero
        description={`${TOTAL_WORKFLOWS} production-ready workflows across ${PACKS.length} focused packs — text-to-image, blog visuals, thumbnails, podcast art, style transfer, product photography, social, and portraits. One-time purchase, instant delivery, and everything runs on your own GPU.`}
        eyebrow="Digital Assets // Local-First Generation"
        title="ComfyUI Workflow Packs"
      />

      <PageSection>
        <div className="mb-10 border-l-2 border-primary bg-card px-5 py-4 text-sm leading-relaxed text-muted-foreground">
          <strong className="font-mono text-xs uppercase tracking-wider text-foreground">
            How buying works:
          </strong>{" "}
          Each pack is a one-time purchase delivered instantly by Gumroad as
          ready-to-load JSON workflow files. Load them into your own ComfyUI
          install — no subscriptions, no cloud API keys, and your prompts and
          outputs never leave your machine.
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {PACKS.map((pack) => (
            <SurfaceCard className="flex flex-col" key={pack.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Layers
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-primary"
                  />
                  <h2 className="font-mono text-sm font-bold uppercase tracking-wider">
                    {pack.name}
                  </h2>
                </div>
                <span className="shrink-0 border-2 border-primary px-2 py-0.5 font-mono text-xs font-bold text-primary">
                  {pack.price}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {pack.blurb}
              </p>

              <ul className="mt-4 flex-1 space-y-2 text-sm leading-relaxed text-muted-foreground">
                {pack.includes.map((item) => (
                  <li className="flex gap-2" key={item}>
                    <span
                      aria-hidden="true"
                      className="mt-0.5 select-none text-primary"
                    >
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                {pack.note}
              </p>

              <Button
                asChild
                className="mt-5 w-full sm:w-auto"
                variant="outline"
              >
                <a
                  href={packUrl(pack.id)}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Download aria-hidden="true" className="mr-2 h-4 w-4" />
                  Buy on Gumroad
                  <ExternalLink
                    aria-hidden="true"
                    className="ml-2 h-3.5 w-3.5"
                  />
                </a>
              </Button>
            </SurfaceCard>
          ))}
        </div>
      </PageSection>

      <PageSection background="muted">
        <div className="grid gap-8 md:grid-cols-3">
          <SurfaceCard>
            <Cpu aria-hidden="true" className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-mono text-sm font-bold uppercase tracking-wider">
              Runs on your hardware
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Every workflow targets ComfyUI 0.3.0+ with an SDXL base model on
              8GB+ VRAM. Most packs use built-in nodes only — no custom-node
              dependency maze.
            </p>
          </SurfaceCard>
          <SurfaceCard>
            <Download aria-hidden="true" className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-mono text-sm font-bold uppercase tracking-wider">
              Instant, permanent delivery
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Checkout runs through Gumroad and your files are available the
              moment payment clears. Buy once; the workflows keep working
              whether or not any vendor pivots later.
            </p>
          </SurfaceCard>
          <SurfaceCard>
            <Layers aria-hidden="true" className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-mono text-sm font-bold uppercase tracking-wider">
              Ship-ready formats
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Packs are sized for real placements: 1200×630 OG images, 1280×720
              thumbnails, 1000×1500 pins, 1024×1344 portraits, and 4K upscale
              chains.
            </p>
          </SurfaceCard>
        </div>
      </PageSection>

      <PageSection>
        <SurfaceCard className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">
              From the same lab
            </p>
            <h2 className="mt-2 text-lg font-bold">AI Ops Toolkit</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Battle-tested CLI scripts for managing a real multi-GPU AI
              inference lab — live GPU monitoring, VRAM usage, and operations
              tooling from the same hardware these packs were built on. $29,
              one-time on Gumroad.
            </p>
          </div>
          <Button asChild>
            <a
              href={`${GUMROAD_BASE}nreafn`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Get the AI Ops Toolkit
              <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </SurfaceCard>
      </PageSection>

      <PageCta
        description="Every pack ships with the same deterministic mindset we bring to client systems. If your team needs a workflow built to a custom spec — or a private GPU pipeline around it — start with the AI Clarity Diagnostic."
        primary={{
          href: "/diagnostic",
          label: "Run the AI Clarity Diagnostic",
        }}
        secondary={{ href: "/pricing", label: "Back to pricing" }}
        title="Need something the catalog does not cover?"
      />
    </>
  );
}
