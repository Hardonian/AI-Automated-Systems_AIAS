export interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  backgroundVariant?: "gradient" | "plain";
  badgeText?: string;
  impactCardsLabel?: string;
  primaryCta?: {
    visible: boolean;
    label: string;
    href: string;
  };
  secondaryCta?: {
    visible: boolean;
    label: string;
    href: string;
  };
  socialProof?: Array<{
    icon: string;
    text: string;
  }>;
  trustBadges?: Array<{
    icon: string;
    text: string;
  }>;
}

export interface FAQContent {
  sectionTitle: string;
  sectionSubtitle: string;
  categories: Array<{
    category: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  }>;
}
