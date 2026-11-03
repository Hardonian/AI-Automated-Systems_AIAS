import { SurfaceCard } from "@/components/ui/section-primitives";
import { siteContent } from "@/src/content/site";

export function InteractiveScheduler() {
  return (
    <SurfaceCard className="mx-auto max-w-3xl border-2 border-border p-8 text-center sm:p-10">
      <h2 className="text-xl font-black uppercase text-foreground">
        Online booking is currently unavailable
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        To request a strategy session, email us with your preferred times and a
        brief description of your needs. A session is not booked until we
        confirm it with you. Please do not include sensitive information in your
        email.
      </p>
      <a
        className="mt-6 inline-flex min-h-11 items-center justify-center border-2 border-primary bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary-foreground"
        href={`mailto:${siteContent.contact.email}`}
      >
        Email inquiries
      </a>
    </SurfaceCard>
  );
}
