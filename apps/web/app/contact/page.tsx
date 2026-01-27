import { Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";

import { ContactForm } from "@/components/contact-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact Us — AIAS Consultancy",
  description: "Get in touch with AIAS Consultancy. Discuss your automation needs, ask questions, or request support.",
};

export default function ContactPage() {
  return (
    <div className="container py-16">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Have a question about our services or platform? We're here to help. 
            Fill out the form or reach out directly.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <p className="text-sm text-muted-foreground mb-1">General Inquiries</p>
                <a className="text-primary hover:underline" href="mailto:inquiries@aiautomatedsystems.ca">
                  inquiries@aiautomatedsystems.ca
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-sm text-muted-foreground">
                  Toronto, Ontario<br />
                  Canada
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-muted/50 rounded-lg border">
            <h3 className="font-semibold mb-2">Looking for a Strategy Call?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you're ready to discuss a specific project, booking a call is the fastest way to get started.
            </p>
            <a className="text-primary font-medium hover:underline" href="/demo">
              Book a Strategy Call →
            </a>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send a Message</CardTitle>
              <CardDescription>
                We typically respond within 1 business day.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
