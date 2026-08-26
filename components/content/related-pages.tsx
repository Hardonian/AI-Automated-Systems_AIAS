import Link from "next/link";

import { SurfaceCard } from "@/components/ui/section-primitives";

interface RelatedPageLink {
  label: string;
  href: string;
}

export function RelatedPages({
  links,
  headingClassName = "text-2xl font-bold",
  navAriaLabel,
  linkAriaLabelPrefix,
}: {
  links: RelatedPageLink[];
  headingClassName?: string;
  navAriaLabel?: string;
  linkAriaLabelPrefix?: string;
}) {
  return (
    <SurfaceCard>
      <h2 className={headingClassName}>Related pages</h2>
      <nav aria-label={navAriaLabel ?? "Related pages"} className="mt-4">
        <div className="flex flex-wrap gap-3 text-sm">
          {links.map((link, index) => {
            const ariaLabel = linkAriaLabelPrefix
              ? `${linkAriaLabelPrefix} ${index + 1}: ${link.label}`
              : undefined;

            return (
              <Link
                key={link.href}
                aria-label={ariaLabel}
                className="font-medium text-primary underline-offset-4 hover:underline"
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </SurfaceCard>
  );
}
