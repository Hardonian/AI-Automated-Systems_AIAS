# AIAS Platform

Enterprise-grade AI automation platform for building custom AI agents, workflow automation, and intelligent business solutions.

## Overview

AIAS Platform is a multi-tenant SaaS application built with Next.js 15, TypeScript, and Supabase. It provides workflow automation, custom AI agents, analytics, and integrations for businesses seeking to automate operations and deploy AI solutions.

### Core Capabilities

- **Workflow Automation**: Visual workflow builder with pre-built templates and custom automation chains
- **AI Agents**: Custom AI agents for specific business needs with natural language interaction
- **Multi-Tenant Architecture**: Secure tenant isolation with row-level security (RLS)
- **Analytics & Insights**: Real-time dashboards, usage analytics, and performance metrics
- **Integrations**: Shopify, Wave Accounting, and custom API integrations

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.9 (strict mode)
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Authentication**: Supabase Auth (JWT-based)
- **Payments**: Stripe
- **Email**: Resend
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Validation**: Zod
- **Testing**: Vitest, Playwright

## Quick Start

### Prerequisites

- Node.js 20.18.0+ or 22.0.0+
- pnpm 8.15.0+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/shardie-github/aias.git
cd aias

# Install dependencies
pnpm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your values

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`.

### Required Environment Variables

See [`.env.local.example`](.env.local.example) for complete configuration.

**Minimum required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `DATABASE_URL` - PostgreSQL connection string

**Optional (for full features):**
- `STRIPE_SECRET_KEY` - Stripe secret key (billing)
- `RESEND_API_KEY` - Resend API key (email)
- `OPENAI_API_KEY` - OpenAI API key (AI features)

## Project Structure

```
├── app/                    # Next.js app directory (pages, API routes)
├── components/             # React components
├── lib/                    # Utilities and libraries
│   ├── api/               # API utilities and schemas
│   ├── security/          # Security utilities
│   ├── billing/           # Billing system
│   └── edge-ai/           # Edge AI foundations
├── docs/                   # Documentation
│   ├── architecture/      # Architecture documentation
│   ├── api/               # API documentation
│   └── operations/        # Operational runbooks
├── supabase/              # Supabase configuration
│   ├── functions/         # Edge functions
│   └── migrations/        # Database migrations
└── tests/                 # Test suite
```

## Development

### Common Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix linting issues
pnpm typecheck        # TypeScript type checking
pnpm format           # Format code with Prettier

# Testing
pnpm test             # Run unit tests
pnpm test:coverage    # Run tests with coverage
pnpm test:e2e         # Run E2E tests

# Database
pnpm db:push          # Push schema changes
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
```

## Architecture

The platform uses a multi-tier architecture:

1. **Client Layer**: Next.js App Router with React Server Components
2. **Edge Layer**: Vercel Edge middleware for security and rate limiting
3. **API Layer**: Next.js API routes with unified route handlers
4. **Backend**: Supabase (PostgreSQL, Auth, Storage, RLS)
5. **External Services**: Stripe, Resend, OpenAI

Multi-tenant isolation is enforced at multiple layers:
- Middleware validates tenant access
- Row-Level Security (RLS) policies filter data by tenant_id
- Cache keys prefixed with tenant_id
- Audit logs include tenant_id

See [Architecture Documentation](docs/architecture/ARCHITECTURE.md) for details.

## API Documentation

The platform provides a RESTful API for programmatic access:

- **Base URL**: `/api/v1`
- **Authentication**: Bearer token or cookie-based
- **Rate Limits**: Plan-based (Free: 100/hour, Pro: 5,000/hour)

See [API Documentation](docs/api/overview.md) for endpoints, authentication, and examples.

## Billing Model

The platform uses a subscription-based billing model:

- **Free**: Limited workflows, community support
- **Pro**: Unlimited workflows, priority support, advanced analytics
- **Enterprise**: Custom pricing, dedicated support, SLA

Billing is handled via Stripe. See [Billing Documentation](docs/billing.md) for details.

## Security

- **Multi-Layer Security**: Edge middleware, application validation, database RLS
- **Data Residency**: Canadian data centers (PIPEDA compliant)
- **Input Validation**: Zod schemas for all inputs
- **Output Sanitization**: XSS and SQL injection protection
- **Rate Limiting**: Redis-backed rate limiting
- **Audit Logging**: Comprehensive audit trails

See [Security Documentation](docs/security.md) for details.

## Deployment

### Vercel (Recommended)

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Deployment

```bash
# Build
pnpm build

# Deploy
vercel deploy --prod
```

See [Deployment Documentation](docs/operations/deployment.md) for details.

## Documentation

- [Architecture Guide](docs/architecture/ARCHITECTURE.md)
- [API Reference](docs/api/overview.md)
- [Getting Started](docs/getting-started.md)
- [Billing](docs/billing.md)
- [Security](docs/security.md)
- [Operations](docs/operations/)

## Contributing

We welcome contributions. Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/shardie-github/aias/issues)
- **Email**: support@aiautomatedsystems.ca

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ in Canada**
