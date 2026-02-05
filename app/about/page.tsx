import type { Metadata } from 'next';

import { BentoGrid, BentoGridItem } from '@/components/ui/BentoGrid';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ParallaxBackground } from '@/components/ui/ParallaxBackground';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { TextReveal } from '@/components/ui/TextReveal';

export const metadata: Metadata = {
  title: 'About — AIAS Platform | Made in Canada',
  description:
    'AIAS Platform is built for Canadian businesses. Learn about our mission to make AI automation accessible to Canadian SMBs and solo operators.',
};

export default function AboutPage() {
  return (
    <ParallaxBackground className='container py-16'>
      <div className='mx-auto max-w-3xl space-y-12'>
        <div className='px-4 text-center'>
          <TextReveal
            as='h1'
            className='mb-6 block text-4xl font-bold md:text-5xl'
            delay={0.1}
            staggerDelay={0.03}
          >
            About AIAS Platform
          </TextReveal>
          <p className='mb-6 text-lg leading-relaxed text-muted-foreground md:text-xl'>
            Workflow design and automation tools built in Canada. We help
            organizations implement AI-assisted processes with appropriate
            governance.
          </p>
          <div className='mt-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary'>
            Built in Canada 🇨🇦 • Workflow Design • Human-in-the-Loop
          </div>
        </div>

        <section className='px-4'>
          <h2 className='mb-6 text-2xl font-bold md:text-3xl'>Our Approach</h2>
          <div className='mb-6 rounded-lg bg-primary/10 p-6 md:p-8'>
            <p className='mb-3 text-lg font-semibold leading-relaxed md:text-xl'>
              We design workflows that assist teams while maintaining human
              oversight.
            </p>
            <p className='text-base leading-relaxed text-muted-foreground'>
              Our methodology emphasizes understanding processes before
              automating them. AI assists with execution; humans retain decision
              authority.
            </p>
          </div>
          <p className='mb-5 text-base leading-relaxed text-muted-foreground'>
            AIAS Platform was founded in Canada. We support organizations across
            education, healthcare, technology, and business sectors. We
            understand that{' '}
            <strong>effective automation requires understanding context</strong>{' '}
            — not just connecting tools. Process analysis precedes automation
            design.
          </p>
          <p className='mb-5 text-base leading-relaxed text-muted-foreground'>
            Our mission is to make workflow automation accessible to
            organizations while ensuring appropriate governance. We believe that{' '}
            <strong>automation without oversight creates risk</strong> — which
            is why we build human-in-the-loop checkpoints into every workflow.
            Every solution we design includes review points, audit trails, and
            escalation paths.
          </p>
          <p className='mb-6 text-base leading-relaxed text-muted-foreground'>
            With experience in education and operations, we&apos;ve seen how{' '}
            <strong>process understanding</strong> improves outcomes across
            industries. Whether managing educational programs, healthcare
            operations, or business processes, workflow design benefits from
            analysis before implementation.
          </p>
        </section>

        <section className='px-4'>
          <h2 className='mb-6 text-2xl font-bold md:text-3xl'>
            Workflow Design Principles
          </h2>
          <div className='mb-6 rounded-lg bg-muted/50 p-6 md:p-8'>
            <h3 className='mb-4 text-lg font-semibold md:text-xl'>
              Human-AI Collaboration:
            </h3>
            <p className='mb-4 text-base leading-relaxed text-muted-foreground'>
              Effective automation combines AI assistance with human oversight.
              AI can process data and suggest actions; humans make decisions and
              handle exceptions.
            </p>
            <ul className='space-y-3 text-sm text-muted-foreground md:text-base'>
              <li>• AI processes routine tasks → Humans review exceptions</li>
              <li>• AI surfaces patterns → Humans interpret meaning</li>
              <li>• AI executes defined steps → Humans design workflows</li>
              <li>
                • AI scales execution → Humans set parameters and policies
              </li>
            </ul>
          </div>
          <p className='mb-5 text-base leading-relaxed text-muted-foreground'>
            Our Canadian operations follow privacy laws (PIPEDA) and emphasize
            transparent pricing and reliable service. We understand that{' '}
            <strong>
              process understanding precedes successful automation
            </strong>
            .
          </p>
          <p className='mb-5 text-base leading-relaxed text-muted-foreground'>
            AIAS Platform provides:
          </p>
          <ul className='mb-6 space-y-3 text-muted-foreground'>
            <li className='flex items-start gap-3 text-base leading-relaxed'>
              <span className='mt-1 text-primary'>✓</span>
              <span>
                <strong>Process Analysis:</strong> Multi-perspective workflow
                review before implementation
              </span>
            </li>
            <li className='flex items-start gap-3 text-base leading-relaxed'>
              <span className='mt-1 text-primary'>✓</span>
              <span>
                <strong>Assisted Automation:</strong> AI handles routine tasks;
                humans retain decision authority
              </span>
            </li>
            <li className='flex items-start gap-3 text-base leading-relaxed'>
              <span className='mt-1 text-primary'>✓</span>
              <span>
                <strong>Team Enablement:</strong> Knowledge transfer so your
                team operates independently
              </span>
            </li>
            <li className='flex items-start gap-3 text-base leading-relaxed'>
              <span className='mt-1 text-primary'>✓</span>
              <span>
                <strong>Governance Framework:</strong> Built-in checkpoints,
                audit trails, and escalation paths
              </span>
            </li>
            <li className='flex items-start gap-3 text-base leading-relaxed'>
              <span className='mt-1 text-primary'>✓</span>
              <span>
                <strong>Canadian Operations:</strong> Built in Canada with
                global reach. PIPEDA-aligned privacy practices
              </span>
            </li>
          </ul>
        </section>

        <section>
          <TextReveal
            as='h2'
            className='mb-4 text-2xl font-bold'
            delay={0.2}
            staggerDelay={0.02}
          >
            Our Values
          </TextReveal>
          <BentoGrid className='gap-4' columns={2}>
            <BentoGridItem colSpan={1} rowSpan={1}>
              <SpotlightCard>
                <Card className='h-full border-0 bg-transparent shadow-none'>
                  <CardHeader>
                    <CardTitle>Privacy First</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground'>
                      PIPEDA compliance, Canadian data residency, transparent
                      privacy policies.
                    </p>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </BentoGridItem>
            <BentoGridItem colSpan={1} rowSpan={1}>
              <SpotlightCard>
                <Card className='h-full border-0 bg-transparent shadow-none'>
                  <CardHeader>
                    <CardTitle>Multi-Currency Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground'>
                      Starting at $49/month (CAD/USD/EUR) — accessible globally
                      with transparent pricing in your local currency.
                    </p>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </BentoGridItem>
            <BentoGridItem colSpan={1} rowSpan={1}>
              <SpotlightCard>
                <Card className='h-full border-0 bg-transparent shadow-none'>
                  <CardHeader>
                    <CardTitle>No-Code First</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground'>
                      Build AI agents without coding. 30-minute setup. Deploy in
                      minutes.
                    </p>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </BentoGridItem>
            <BentoGridItem colSpan={1} rowSpan={1}>
              <SpotlightCard>
                <Card className='h-full border-0 bg-transparent shadow-none'>
                  <CardHeader>
                    <CardTitle>Global Perspective</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-muted-foreground'>
                      Built in Canada with global perspective. Serving
                      businesses across 40+ countries with multi-currency and
                      international integrations.
                    </p>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </BentoGridItem>
          </BentoGrid>
        </section>

        <section>
          <h2 className='mb-4 text-2xl font-bold'>Why We Built This</h2>
          <div className='mb-6 rounded-lg bg-primary/10 p-6'>
            <p className='mb-4 text-muted-foreground'>
              AIAS Platform was created to address a gap we observed: many small
              businesses spend significant time on repetitive tasks, but
              existing automation solutions are often priced beyond their reach
              or require technical expertise to implement.
            </p>
            <p className='mb-4 text-muted-foreground'>
              We experienced these constraints firsthand. Operating an
              e-commerce store required substantial manual effort for order
              processing, and available tools were either cost-prohibitive or
              limited in scope.
            </p>
            <p className='text-muted-foreground'>
              AIAS Platform provides workflow automation tools starting at
              $49/month, designed for Canadian SMBs. The platform includes
              Canadian integrations (Shopify, Wave Accounting), PIPEDA-aligned
              privacy practices, and a visual workflow builder. All artifacts
              and configurations remain with your organization.
            </p>
          </div>
        </section>

        <section>
          <h2 className='mb-4 text-2xl font-bold'>Our Team</h2>
          <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Scott Hardie</CardTitle>
                <CardDescription>Founder & CEO</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='mb-4 text-muted-foreground'>
                  Scott is building AIAS Platform to make automation accessible
                  to Canadian SMBs. Based in Toronto, he combines technical
                  execution with deep understanding of the Canadian market and
                  e-commerce operations.
                </p>
                <div className='space-y-2 text-sm'>
                  <p>
                    <strong>Location:</strong> Toronto, Canada
                  </p>
                  <p>
                    <strong>Background:</strong> Full-stack developer,
                    e-commerce operator (Hardonia.store), founder of Hardonian
                    Industries. Active open-source contributor with 40+ public
                    repositories.
                  </p>
                  <p>
                    <strong>LinkedIn:</strong>{' '}
                    <a
                      className='text-primary hover:underline'
                      href='https://www.linkedin.com/in/scottrmhardie'
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      scottrmhardie
                    </a>
                  </p>
                  <p>
                    <strong>GitHub:</strong>{' '}
                    <a
                      className='text-primary hover:underline'
                      href='https://github.com/shardie-github'
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      shardie-github
                    </a>
                  </p>
                  <p>
                    <strong>Why AIAS:</strong> Experienced firsthand the pain of
                    manual workflows running e-commerce operations. Built AIAS
                    Platform to solve this problem for Canadian SMBs who
                    can&apos;t afford expensive enterprise tools.
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Add more team members as needed */}
          </div>
        </section>

        <section>
          <h2 className='mb-4 text-2xl font-bold'>Contact Us</h2>
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className='space-y-2'>
              <p>
                <strong>Email:</strong>{' '}
                <a
                  className='text-primary hover:underline'
                  href='mailto:support@aiautomatedsystems.ca'
                >
                  support@aiautomatedsystems.ca
                </a>
              </p>
              <p>
                <strong>Sales:</strong>{' '}
                <a
                  className='text-primary hover:underline'
                  href='mailto:inquiries@aiautomatedsystems.ca'
                >
                  inquiries@aiautomatedsystems.ca
                </a>
              </p>
              <p>
                <strong>Support Hours:</strong> 24/7 global support (primary:
                Monday-Friday, 9 AM - 5 PM EST)
              </p>
              <p>
                <strong>Global Reach:</strong> Serving clients across North
                America, Europe, Asia-Pacific, and beyond
              </p>
              <p>
                <strong>Phone:</strong> 1-800-AIAS-HELP (toll-free Canada)
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </ParallaxBackground>
  );
}
