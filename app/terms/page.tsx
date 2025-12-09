import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — AI Automated Systems",
  description: "Terms of Service for AI Automated Systems and AIAS Platform. Read our terms and conditions.",
};

export default function TermsPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using AI Automated Systems ("AIAS") services, including the AIAS Platform, 
            you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily use AIAS Platform for personal or commercial purposes. 
            This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained in AIAS Platform</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Service Availability</h2>
          <p>
            AIAS Platform is provided on an "as is" and "as available" basis. We strive for 99.9% uptime 
            but do not guarantee uninterrupted access. We reserve the right to modify, suspend, or 
            discontinue any part of the service at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for 
            all activities that occur under your account. You agree to notify us immediately of any 
            unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data and Privacy</h2>
          <p>
            Your use of AIAS Platform is also governed by our{" "}
            <Link className="text-primary hover:underline" href="/privacy">
              Privacy Policy
            </Link>
            . We are PIPEDA compliant and maintain Canadian data residency. You retain ownership of 
            your data and can export it at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Payment and Billing</h2>
          <p>
            Subscription fees are billed in advance on a monthly or annual basis. You can cancel your 
            subscription at any time. Refunds are provided on a prorated basis for annual subscriptions 
            cancelled within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
          <p>
            In no event shall AI Automated Systems or its suppliers be liable for any damages (including, 
            without limitation, damages for loss of data or profit, or due to business interruption) 
            arising out of the use or inability to use AIAS Platform.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at{" "}
            <a className="text-primary hover:underline" href="mailto:legal@aiautomatedsystems.ca">
              legal@aiautomatedsystems.ca
            </a>
            .
          </p>
        </section>
      </div>

      <div className="mt-12 pt-8 border-t">
        <Link className="text-primary hover:underline" href="/">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
