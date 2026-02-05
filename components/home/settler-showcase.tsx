'use client';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, Zap, Shield, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

import { DashboardPreview } from '@/components/dashboard/dashboard-preview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function SettlerShowcase() {
  return (
    <section className='border-y border-border bg-muted/30 py-20'>
      <div className='container'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          {...({ className: 'max-w-6xl mx-auto' } as any)}
        >
          <Card className='border'>
            <CardHeader className='pb-6 text-center'>
              <div className='mb-4 flex items-center justify-center gap-3'>
                <Building2 className='h-8 w-8 text-primary' />
                <Badge className='text-sm' variant='secondary'>
                  Partner Product
                </Badge>
              </div>
              <CardTitle className='mb-4 text-3xl font-bold text-foreground md:text-4xl'>
                Settler — Enterprise Payment Platform
              </CardTitle>
              <CardDescription className='mx-auto max-w-2xl text-lg'>
                High-volume payment processing and settlement platform. Built by
                AI Automated Systems for marketplaces, SaaS platforms, and
                fintech companies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='flex items-start gap-3'>
                  <Zap className='mt-1 h-6 w-6 flex-shrink-0 text-primary' />
                  <div>
                    <h4 className='mb-1 font-semibold'>
                      High-Volume Processing
                    </h4>
                    <p className='text-sm text-muted-foreground'>
                      Handle millions of transactions with enterprise
                      infrastructure
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <Shield className='mt-1 h-6 w-6 flex-shrink-0 text-primary' />
                  <div>
                    <h4 className='mb-1 font-semibold'>Bank-Grade Security</h4>
                    <p className='text-sm text-muted-foreground'>
                      PCI DSS compliant with end-to-end encryption
                    </p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <CheckCircle2 className='mt-1 h-6 w-6 flex-shrink-0 text-primary' />
                  <div>
                    <h4 className='mb-1 font-semibold'>Canadian Compliance</h4>
                    <p className='text-sm text-muted-foreground'>
                      PIPEDA & FINTRAC ready with audit trails
                    </p>
                  </div>
                </div>
              </div>
              <div className='flex flex-col justify-center gap-4 border-t pt-4 sm:flex-row'>
                <Button asChild size='lg'>
                  <Link href='/settler'>
                    Explore Settler
                    <ArrowRight className='ml-2 h-5 w-5' />
                  </Link>
                </Button>
                <Button asChild size='lg' variant='outline'>
                  <Link href='/services'>View All Services</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dashboard Preview */}
      <div className='container mt-12'>
        <DashboardPreview
          description='Request access to view live transaction analytics and settlement insights'
          title='Settler Analytics Dashboard'
          variant='settler'
          onRequestPreview={() => {
            window.location.href = '/settler#demo-cta';
          }}
        />
      </div>
    </section>
  );
}
