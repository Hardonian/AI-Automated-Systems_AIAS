import dynamic from "next/dynamic";

import { KeyboardNavEnhancement } from "@/components/accessibility/keyboard-nav";
import { ContentDrivenFAQ } from "@/components/content/ContentDrivenFAQ";
import { ContentDrivenFeatures } from "@/components/content/ContentDrivenFeatures";
import { ContentDrivenHero } from "@/components/content/ContentDrivenHero";
import { ContentDrivenTestimonials } from "@/components/content/ContentDrivenTestimonials";
import { SocialProofBanner } from "@/components/gen-z/social-proof-banner";
import { ConversionCTA } from "@/components/home/conversion-cta";
import { CTAEnhanced } from "@/components/home/cta-enhanced";
import { EnhancedHero } from "@/components/home/enhanced-hero";
import { Features } from "@/components/home/features";
import { SettlerShowcase } from "@/components/home/settler-showcase";
import { StatsSection } from "@/components/home/stats-section";
import { TrustBadges } from "@/components/home/trust-badges";
import { WhoWeHelp } from "@/components/home/who-we-help";
import { SoftwareApplicationSchema , FAQSchema, ProfessionalServiceSchema } from "@/components/seo/structured-data";
import { loadAIASContent } from "@/lib/content/loader";


// Lazy load below-the-fold components for performance
const Testimonials = dynamic(() => import("@/components/home/testimonials").then(mod => ({ default: mod.Testimonials })), {
  loading: () => <div aria-label="Loading testimonials" className="py-16" />,
});
const ROICalculator = dynamic(() => import("@/components/home/roi-calculator").then(mod => ({ default: mod.ROICalculator })), {
  loading: () => <div aria-label="Loading ROI calculator" className="py-16" />,
});
const CaseStudyPreview = dynamic(() => import("@/components/home/case-study-preview").then(mod => ({ default: mod.CaseStudyPreview })), {
  loading: () => <div aria-label="Loading case studies" className="py-16" />,
});
const FAQ = dynamic(() => import("@/components/home/faq").then(mod => ({ default: mod.FAQ })), {
  loading: () => <div aria-label="Loading FAQ" className="py-16" />,
});

export default async function HomePage() {
  // Load content from config (with defaults if file doesn't exist)
  let content;
  try {
    content = await loadAIASContent();
  } catch (error) {
    // Fallback to defaults if loading fails
    // Use server logger for server-side rendering
    const { serverLogger } = await import("@/lib/utils/logger");
    serverLogger.error("Error loading content, using defaults", error as Error);
    content = null;
  }

  // Extract FAQs for schema
  const homepageFAQs = content?.faq?.categories.flatMap(cat => 
    cat.questions.map(q => ({ question: q.question, answer: q.answer }))
  ) || [];

  return (
    <>
      <KeyboardNavEnhancement />
      <SocialProofBanner />
      <SoftwareApplicationSchema />
      <ProfessionalServiceSchema />
      <FAQSchema faqs={homepageFAQs} />
      {content ? (
        <ContentDrivenHero content={content.hero} />
      ) : (
        <EnhancedHero />
      )}
      <StatsSection />
      <TrustBadges />
      <WhoWeHelp />
      <CaseStudyPreview />
      <SettlerShowcase />
      <ROICalculator />
      {content ? (
        <ContentDrivenFeatures content={content.features} />
      ) : (
        <Features />
      )}
      {content ? (
        <ContentDrivenTestimonials content={content.testimonials} />
      ) : (
        <Testimonials />
      )}
      {content ? (
        <ContentDrivenFAQ content={content.faq} />
      ) : (
        <FAQ />
      )}
      <ConversionCTA />
      {/* Enhanced CTA with urgency and social proof */}
      <div className="py-16">
        <CTAEnhanced showSocialProof showUrgency urgency="high" />
      </div>
    </>
  );
}
