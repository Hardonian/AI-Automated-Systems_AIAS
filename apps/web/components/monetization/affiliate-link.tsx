"use client";
import Link from "next/link";

import { getAffiliateLink, trackAffiliateClick } from "@/lib/monetization/affiliate";

interface AffiliateLinkProps {
  product: string;
  children: React.ReactNode;
  className?: string;
  showDisclosure?: boolean;
}

export function AffiliateLink({ product, children, className, showDisclosure = true }: AffiliateLinkProps) {
  const affiliate = getAffiliateLink(product);

  if (!affiliate) {
    return <span className={className}>{children}</span>;
  }

  const handleClick = () => {
    trackAffiliateClick(affiliate.id, affiliate.product);
  };

  return (
    <>
      <Link
        className={`${className || ""} affiliate-link`}
        data-affiliate-id={affiliate.id}
        data-product={affiliate.product}
        href={affiliate.url}
        rel="sponsored nofollow"
        target="_blank"
        onClick={handleClick}
      >
        {children}
      </Link>
      {showDisclosure && (
        <span
          className="text-xs text-muted-foreground ml-1"
          title="Affiliate link - we may earn a commission"
        >
          *
        </span>
      )}
    </>
  );
}
