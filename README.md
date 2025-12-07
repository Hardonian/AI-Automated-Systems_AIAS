# AI Automated Systems Platform

**Enterprise-grade AI consultancy platform showcasing custom AI agents, workflow automation, and intelligent business solutions**

[![CI Pipeline](https://github.com/shardie-github/aias/actions/workflows/ci.yml/badge.svg)](https://github.com/shardie-github/aias/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

## ✨ Features

### 🤖 AI Automation
- **Custom AI Platforms** - Not just integrations, full custom solutions
- **Workflow Automation** - Visual builder with pre-built templates
- **AI Agents** - Custom agents for specific business needs
- **Edge AI** - Browser-based inference and device acceleration

### 💼 Business Features
- **Three-Tier Pricing** - Free, Pro, Enterprise
- **Content Gating** - Premium features for paid users
- **Analytics Dashboard** - Real-time insights and metrics
- **Team Collaboration** - Work together on workflows

### 🔒 Security & Compliance
- **Canadian Data Residency** - PIPEDA compliant
- **Row-Level Security** - Comprehensive RLS policies
- **Input Sanitization** - XSS and SQL injection protection
- **Rate Limiting** - Redis-backed rate limiting

### 🎨 User Experience
- **WCAG 2.1 AA** - Full accessibility compliance
- **Mobile-First** - Responsive design
- **Performance Optimized** - Fast load times
- **SEO Optimized** - Comprehensive metadata

## 📁 Project Structure

```
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                   # Utilities and libraries
│   ├── api/               # API utilities and schemas
│   ├── security/          # Security utilities
│   ├── seo/               # SEO utilities
│   ├── cro/               # Conversion optimization
│   ├── pricing/           # Pricing system
│   └── edge-ai/           # Edge AI foundations
├── docs/                  # Documentation
│   ├── internal/          # Internal documentation
│   ├── external/          # External documentation
│   ├── operations/        # Operational runbooks
│   └── architecture/      # Architecture docs
├── supabase/              # Supabase configuration
│   ├── functions/         # Edge functions
│   └── migrations/       # Database migrations
└── tests/                 # Test suite
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **Email:** Resend
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Validation:** Zod
- **Testing:** Vitest, Playwright

## 📚 Documentation

- [API Documentation](/docs/architecture/api-endpoints.md)
- [Business Strategy](/docs/internal/business-strategy.md)
- [Product Overview](/docs/external/product-overview.md)
- [Operational Runbooks](/docs/operations/runbooks.md)
- [Architecture Guide](/docs/architecture/ARCHITECTURE.md)

## 🔐 Environment Variables

See [`.env.example`](.env.example) for all required environment variables.

Key variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `RESEND_API_KEY` - Resend API key

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run with coverage
pnpm test:coverage
```

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main

### Manual Deployment

```bash
# Build
pnpm build

# Deploy
vercel deploy --prod
```

## 📊 Performance

- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s

## 🔄 CI/CD

Automated CI/CD pipeline includes:
- TypeScript type checking
- ESLint linting
- Unit and integration tests
- E2E tests
- Security audits
- Accessibility checks
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🆘 Support

- **Email:** support@aiautomatedsystems.ca
- **Documentation:** [/docs](/docs)
- **Issues:** [GitHub Issues](https://github.com/shardie-github/aias/issues)

## 🎯 Roadmap

- [ ] Mobile apps (iOS/Android)
- [ ] Marketplace for workflows
- [ ] Advanced AI capabilities
- [ ] More integrations
- [ ] White-label solutions

---

**Built with ❤️ in Canada**
