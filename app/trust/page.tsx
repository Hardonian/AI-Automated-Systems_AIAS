// [STAKE+TRUST:BEGIN:trust_page]
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TrustCenter() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load feature flags
    fetch('/api/flags/trust')
      .then(r => r.json())
      .then(data => setFlags(data || {}))
      .catch(() => setFlags({}));
  }, []);

  return (
    <div className='container space-y-6 py-8'>
      <h1 className='text-3xl font-bold'>Trust & Transparency</h1>
      <p className='text-muted-foreground'>
        Your privacy and security are our top priorities. Explore our commitment
        to transparency and your rights.
      </p>

      <div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='space-y-4 rounded-lg border p-6'>
          <h2 className='text-xl font-semibold'>Privacy & Data</h2>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link className='text-primary hover:underline' href='/privacy'>
                Privacy Policy
              </Link>
            </li>
            {flags.export_portability && (
              <li>
                <Link
                  className='text-primary hover:underline'
                  href='/account/export'
                >
                  Export My Data
                </Link>
              </li>
            )}
            {flags.audit_log && (
              <li>
                <Link
                  className='text-primary hover:underline'
                  href='/account/audit-log'
                >
                  My Audit Log
                </Link>
              </li>
            )}
            {flags.data_retention_disclosure && (
              <li className='text-muted-foreground'>Data Retention Policy</li>
            )}
          </ul>
        </div>

        <div className='space-y-4 rounded-lg border p-6'>
          <h2 className='text-xl font-semibold'>Security & Compliance</h2>
          <ul className='space-y-2 text-sm'>
            <li>
              <Link
                className='text-primary hover:underline'
                href='/docs/trust/SECURITY.md'
              >
                Security Documentation
              </Link>
            </li>
            <li>
              <Link
                className='text-primary hover:underline'
                href='/docs/trust/TRUST.md'
              >
                Trust Documentation
              </Link>
            </li>
            {flags.slo_sla_docs && (
              <li>
                <Link
                  className='text-primary hover:underline'
                  href='/docs/trust/SLO_SLA.md'
                >
                  SLO/SLA Details
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className='space-y-4 rounded-lg border p-6'>
          <h2 className='text-xl font-semibold'>Service Status</h2>
          <ul className='space-y-2 text-sm'>
            {flags.status_page && (
              <li>
                <Link className='text-primary hover:underline' href='/status'>
                  Status & Uptime
                </Link>
              </li>
            )}
            {flags.incident_comms && (
              <li>
                <Link
                  className='text-primary hover:underline'
                  href='/docs/trust/STATUS.md'
                >
                  Incident Communication
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className='space-y-4 rounded-lg border p-6'>
          <h2 className='text-xl font-semibold'>Support & Resources</h2>
          <ul className='space-y-2 text-sm'>
            {flags.help_center && (
              <li>
                <Link className='text-primary hover:underline' href='/help'>
                  Help Center
                </Link>
              </li>
            )}
            <li className='text-muted-foreground'>
              Contact: support@example.com
            </li>
          </ul>
        </div>
      </div>

      <div className='mt-8 rounded-lg bg-muted p-6'>
        <h2 className='mb-4 text-xl font-semibold'>Your Rights</h2>
        <p className='mb-4 text-sm text-muted-foreground'>
          Under GDPR, PIPEDA, and similar regulations, you have the right to:
        </p>
        <ul className='list-disc space-y-2 pl-6 text-sm'>
          <li>Access your personal data</li>
          <li>Rectify inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Export your data in a machine-readable format</li>
          <li>Object to certain types of processing</li>
        </ul>
        <p className='mt-4 text-sm text-muted-foreground'>
          For data subject rights requests, contact:{' '}
          <a
            className='text-primary hover:underline'
            href='mailto:privacy@example.com'
          >
            privacy@example.com
          </a>
        </p>
      </div>
    </div>
  );
}
// [STAKE+TRUST:END:trust_page]
