import { FAQSchema } from '@/components/seo/structured-data';

interface FAQEntry {
  question: string;
  answer: string;
}

export function FAQSection({
  title,
  subtitle,
  entries,
}: {
  title: string;
  subtitle?: string;
  entries: FAQEntry[];
}) {
  return (
    <section aria-labelledby='faq-section-heading' className='container py-16' id='faq-section'>
      <FAQSchema faqs={entries} />
      <h2 className='text-3xl font-bold' id='faq-section-heading'>
        {title}
      </h2>
      {subtitle && <p className='mt-3 max-w-2xl text-muted-foreground'>{subtitle}</p>}
      <div className='mt-8 space-y-4'>
        {entries.map(entry => (
          <article key={entry.question} className='rounded-xl border bg-card p-5'>
            <h3 className='font-semibold'>{entry.question}</h3>
            <p className='mt-2 text-muted-foreground'>{entry.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
