import { ArrowUpRight } from 'lucide-react'
import { NewsletterForm } from '@/components/newsletter-form'

const footerLinks = [
  { href: '#top', label: 'Missie' },
  { href: '#probleem', label: 'Het probleem' },
  { href: '#initiatieven', label: 'Initiatieven' },
]

/** Conversiesectie; formulier praat met POST /api/subscribe via NewsletterForm. */
export function ConversionFooter() {
  return (
    <>
      <section id="doe-mee" aria-labelledby="doemee-heading" className="bg-ink text-paper">
        <div
          className="mx-auto text-center"
          style={{ maxWidth: '32rem', paddingBlock: 'clamp(5rem, 12vw, 9rem)', paddingInline: '1.5rem' }}
        >
          <h2
            id="doemee-heading"
            className="text-balance font-sans text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Sluit je aan bij de zienswijze.
          </h2>
          <p className="mt-4 font-serif text-base leading-relaxed text-paper/80">
            Blijf op de hoogte en voeg je stem toe aan de beweging voor leefbaar, ecologisch en sociaal wonen in
            Limburg.
          </p>

          <NewsletterForm />

          <a
            href="#doe-mee"
            style={
              {
                '--stamp-shadow': 'var(--color-paper)',
                fontSize: 'clamp(1.0625rem, 1.2vw, 1.25rem)',
              } as React.CSSProperties
            }
            className="stamp-hover mt-8 inline-flex items-center gap-2 bg-accent-action px-6 py-3.5 font-mono font-semibold uppercase tracking-[0.12em] text-paper"
          >
            Steun de zienswijze
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <footer className="border-t border-border-subtle bg-background">
        <div
          className="mx-auto flex max-w-7xl flex-col gap-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
          style={{ paddingBlock: '2rem', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
        >
          <p>© 2025 Leefland Limburg — coalitie van CPO&apos;s, VVE&apos;s en burgerinitiatieven in Limburg.</p>
          <nav aria-label="Footernavigatie" className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  )
}
