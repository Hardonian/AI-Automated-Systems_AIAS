import type { AIASContent, SettlerContent } from "./schemas";

/**
 * Default content for AIAS (AI Automated Systems) site
 */
export const defaultAIASContent: AIASContent = {
  hero: {
    title: "Custom AI Platforms",
    subtitle: "That Transform Your Business",
    description:
      "Save 10+ hours per week with AI automation. Connect your tools, automate workflows, and focus on what matters.",
    badgeText: "Custom AI Platforms Built by AI Automated Systems",
    primaryCta: {
      label: "Start 30-Day Free Trial",
      href: "/signup",
      variant: "default",
      visible: true,
    },
    secondaryCta: {
      label: "Book Free Demo",
      href: "/demo",
      variant: "outline",
      visible: true,
    },
    backgroundVariant: "gradient",
    socialProof: [
      { icon: "👥", text: "2,000+ Active Users" },
      { icon: "⭐", text: "4.9/5 Rating" },
      { icon: "🚀", text: "10+ Hours Saved/Week" },
      { icon: "💰", text: "40% ROI Increase" },
    ],
    trustBadges: [
      { icon: "shield", text: "PIPEDA Compliant", color: "text-blue-500" },
      { icon: "globe", text: "🇨🇦 Canadian Built", color: "text-red-500" },
      { icon: "check", text: "99.9% Uptime", color: "text-green-500" },
      { icon: "zap", text: "Enterprise Security", color: "text-purple-500" },
    ],
  },
  features: {
    sectionTitle: "Automate Your Workflows. Save Time. Grow Your Business.",
    sectionSubtitle:
      "Connect your tools, automate repetitive tasks, and get insights that help you make better decisions. No coding required. Start in minutes.",
    items: [
      {
        title: "No-Code AI Agents",
        description:
          "Build custom AI agents with drag-and-drop interface. No coding required. Deploy in 30 minutes.",
        icon: "sparkles",
        gradient: "from-blue-500 to-cyan-500",
        highlight: true,
      },
      {
        title: "Canadian Integrations",
        description:
          "20+ Canadian-first integrations: Shopify, Wave Accounting, Stripe CAD, RBC, TD, Interac. Built for Canadian businesses.",
        icon: "zap",
        gradient: "from-red-500 to-pink-500",
        highlight: false,
      },
      {
        title: "Save 10+ Hours/Week",
        description:
          "Automate repetitive tasks automatically. Reduce manual errors by 90%. Focus on high-value work.",
        icon: "zap",
        gradient: "from-green-500 to-emerald-500",
        highlight: false,
      },
      {
        title: "Affordable CAD Pricing",
        description:
          "CAD $49/month (vs. $150+ competitors). Transparent GST/HST. Annual discounts available. Cancel anytime.",
        icon: "dollar-sign",
        gradient: "from-yellow-500 to-orange-500",
        highlight: false,
      },
      {
        title: "PIPEDA Compliant",
        description:
          "Canadian data residency. PIPEDA-compliant privacy policy. Enterprise security. Your data stays in Canada.",
        icon: "lock",
        gradient: "from-purple-500 to-indigo-500",
        highlight: false,
      },
      {
        title: "50+ Pre-Built Templates",
        description:
          "E-commerce automation, customer support, invoice processing, lead qualification. Industry-specific templates.",
        icon: "file-text",
        gradient: "from-pink-500 to-rose-500",
        highlight: false,
      },
    ],
    layoutVariant: "bento",
  },
  testimonials: {
    sectionTitle: "Why Systems Thinking Makes the Difference",
    sectionSubtitle:
      "Systems thinking is THE critical skill for the AI age. It's what makes you stand out in the job market, succeed in business, and achieve optimal outcomes. See how it's transforming businesses worldwide.",
    items: [
      {
        quote:
          "AIAS Consultancy didn't just integrate TikTok—they built us a complete platform that thinks and optimizes on its own. The custom AI agents they developed have transformed how we manage TikTok campaigns. This is exactly the kind of custom build that showcases their expertise.",
        author: "Marketing Director",
        role: "Leading E-Commerce Brand",
        company: "TokPulse Client",
        flag: "🇨🇦",
        rating: 5,
        hasVideo: true,
        type: "consultancy",
      },
      {
        quote:
          "AIAS Consultancy built us an entire automation ecosystem, not just integrations. Their custom AI agents understand our business logic and make decisions autonomously. It's like having a team of experts working 24/7. This showcases what AIAS Consultancy can build.",
        author: "Operations Manager",
        role: "Multi-Channel E-Commerce Business",
        company: "Hardonia Suite Client",
        flag: "🇨🇦",
        rating: 5,
        hasVideo: true,
        type: "consultancy",
      },
      {
        quote:
          "Systems thinking is what sets AIAS apart. They didn't just automate my processes — they analyzed my entire system from multiple perspectives, found root causes, and designed a holistic solution. This is THE skill needed in the AI age, and it made all the difference.",
        author: "Emma Chen",
        role: "E-commerce Store Owner",
        company: "Chen's Boutique, Toronto, Canada",
        flag: "🇨🇦",
        rating: 5,
        hasVideo: false,
        type: "platform",
      },
    ],
  },
  faq: {
    sectionTitle: "Frequently Asked Questions",
    sectionSubtitle:
      "Everything you need to know about our consultancy services and custom AI platform development.",
    categories: [
      {
        category: "Consultancy Services",
        questions: [
          {
            question:
              "What's the difference between AIAS Consultancy and AIAS Platform?",
            answer:
              "AIAS Platform is ready-to-use automation software. Our consultancy builds custom platforms from scratch.",
          },
          {
            question: "How long does it take to build a custom AI platform?",
            answer:
              "Typically 8-16 weeks. We provide weekly demos so you see progress every step of the way.",
          },
          {
            question: "What technologies do you use?",
            answer:
              "Modern, scalable tech stacks tailored to your needs. We use Next.js, Node.js, Python, and leading AI frameworks.",
          },
          {
            question: "Do you provide ongoing support after launch?",
            answer:
              "Yes. We offer ongoing support including monitoring, optimization, and feature enhancements.",
          },
          {
            question: "What's included in a custom AI platform build?",
            answer:
              "Complete development from strategy to deployment: architecture, AI agents, analytics, infrastructure, security, training, and support.",
          },
        ],
      },
      {
        category: "Platform & Pricing",
        questions: [
          {
            question: "How much does a custom AI platform cost?",
            answer:
              "Custom projects range from $50K-$500K+ depending on scope. Schedule a strategy call for a custom quote.",
          },
          {
            question:
              "Can I try AIAS Platform before hiring consultancy services?",
            answer:
              "Absolutely. Start with our 30-day free trial. The platform is CAD $49/month for the Starter plan.",
          },
          {
            question: "Do you offer payment plans for consultancy projects?",
            answer:
              "Yes. We structure payments across project phases, aligning with deliverables.",
          },
        ],
      },
      {
        category: "Process & Timeline",
        questions: [
          {
            question:
              "How do you ensure projects stay on time and budget?",
            answer:
              "We use agile methodology with weekly demos and clear milestones. Scope is locked after discovery.",
          },
          {
            question: "What if I need changes during development?",
            answer:
              "We accommodate changes through formal change requests. Minor adjustments are usually included.",
          },
          {
            question: "Will my team be trained on the platform?",
            answer:
              "Yes. Training is included with comprehensive documentation and hands-on sessions.",
          },
        ],
      },
    ],
  },
};

/**
 * Default content for Settler.dev site
 */
export const defaultSettlerContent: SettlerContent = {
  hero: {
    title: "Settler",
    description:
      "Enterprise-grade settlement and payment processing platform. Built for scale, security, and seamless integration.",
    badgeText: "Enterprise Payment Platform",
    primaryCta: {
      label: "Schedule Demo",
      href: "/demo",
      variant: "default",
      visible: true,
    },
    secondaryCta: {
      label: "Explore Features",
      href: "#features",
      variant: "outline",
      visible: true,
    },
    backgroundVariant: "gradient",
    trustBadges: [
      { icon: "check", text: "Enterprise Ready" },
      { icon: "globe", text: "🇨🇦 Canadian Built" },
      { icon: "shield", text: "Bank-Grade Security" },
    ],
  },
  features: {
    sectionTitle: "Built for Enterprise Scale",
    sectionSubtitle:
      "Everything you need for high-volume payment processing, settlement, and financial operations.",
    items: [
      {
        title: "High-Volume Processing",
        description:
          "Handle millions of transactions with enterprise-grade infrastructure. Built for scale from day one.",
        icon: "zap",
        gradient: "text-blue-500",
      },
      {
        title: "Bank-Grade Security",
        description:
          "End-to-end encryption, PCI DSS compliance, fraud detection, and real-time monitoring.",
        icon: "shield",
        gradient: "text-green-500",
      },
      {
        title: "Real-Time Settlement",
        description:
          "Instant settlement capabilities with support for multiple payment methods and currencies.",
        icon: "database",
        gradient: "text-purple-500",
      },
      {
        title: "Developer-First API",
        description:
          "RESTful API with comprehensive documentation, webhooks, and SDK support for rapid integration.",
        icon: "code",
        gradient: "text-orange-500",
      },
      {
        title: "Compliance Ready",
        description:
          "Built for Canadian regulations (PIPEDA, FINTRAC) with audit trails and reporting built-in.",
        icon: "lock",
        gradient: "text-red-500",
      },
      {
        title: "Advanced Analytics",
        description:
          "Real-time dashboards, transaction insights, and customizable reporting for business intelligence.",
        icon: "trending-up",
        gradient: "text-cyan-500",
      },
    ],
    layoutVariant: "grid",
  },
  useCases: [
    {
      title: "Marketplace Platforms",
      description:
        "Split payments, escrow services, and automated payouts for multi-vendor marketplaces.",
    },
    {
      title: "SaaS Subscriptions",
      description:
        "Recurring billing, prorated charges, and subscription management with flexible pricing models.",
    },
    {
      title: "Financial Services",
      description:
        "Settlement for trading platforms, investment apps, and fintech services with regulatory compliance.",
    },
    {
      title: "E-Commerce",
      description:
        "Multi-currency support, international payments, and automated refund processing.",
    },
  ],
  partnership: {
    title: "Built by AI Automated Systems",
    description:
      "Settler is a product of AI Automated Systems, leveraging our expertise in enterprise platform development, payment systems, and financial technology.",
    whyItems: [
      { text: "Enterprise-grade infrastructure from day one" },
      { text: "Canadian compliance built-in (PIPEDA, FINTRAC)" },
      { text: "Developer-first API and documentation" },
    ],
    synergyItems: [
      { text: "Seamless integration with AIAS automation workflows" },
      { text: "Shared infrastructure and security standards" },
      { text: "Unified support and enterprise services" },
    ],
    ctas: [
      {
        label: "Schedule Settler Demo",
        href: "/demo",
        variant: "default",
        visible: true,
      },
      {
        label: "View All Services",
        href: "/services",
        variant: "outline",
        visible: true,
      },
    ],
  },
  cta: {
    title: "Ready to Scale Your Payment Operations?",
    description:
      "Get in touch to learn how Settler can transform your settlement and payment processing.",
    ctas: [
      {
        label: "Schedule Demo",
        href: "/demo",
        variant: "secondary",
        visible: true,
      },
      {
        label: "Contact Sales",
        href: "/contact",
        variant: "outline",
        visible: true,
      },
    ],
  },
};
