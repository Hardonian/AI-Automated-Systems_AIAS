export interface RouteIntent {
  id: string;
  buyerQuestion: string;
  owner: string;
  supporting: readonly string[];
  conversion: string;
}

export const ROUTE_INTENTS = [
  {
    id: "understand",
    buyerQuestion: "What does AIAS do and why is its approach different?",
    owner: "/what-aias-does",
    supporting: ["/about", "/point-of-view"],
    conversion: "/how-it-works",
  },
  {
    id: "delivery",
    buyerQuestion: "How does an engagement move from diagnosis to operation?",
    owner: "/how-it-works",
    supporting: ["/approach", "/process", "/methodology"],
    conversion: "/diagnostic",
  },
  {
    id: "engage",
    buyerQuestion: "Which commercial path fits the work?",
    owner: "/hire",
    supporting: ["/services", "/pricing", "/book", "/contact"],
    conversion: "/contact",
  },
  {
    id: "proof",
    buyerQuestion: "What evidence and operating measures support the work?",
    owner: "/case-studies",
    supporting: ["/metrics", "/what-we-measure", "/build-log"],
    conversion: "/contact?ref=proof",
  },
  {
    id: "evaluate",
    buyerQuestion: "Which system, blueprint, or tool matches the pressure?",
    owner: "/catalog",
    supporting: ["/tools", "/blueprints", "/docs"],
    conversion: "/contact?ref=catalog",
  },
] as const satisfies readonly RouteIntent[];
