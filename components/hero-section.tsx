import { ArrowUpRight } from 'lucide-react'

export function HeroSection() {
  return (
    <section
      id="top"
      className="contour-lines relative border-b border-border-subtle"
      style={{ minHeight: 'clamp(28rem, 65vh, 44rem)' }}
    >
      <div
        className="relative mx-auto flex max-w-7xl flex-col justify-center"
        style={{
          minHeight: 'clamp(28rem, 65vh, 44rem)',
          paddingBlock: 'clamp(4rem, 10vw, 7rem)',
          paddingInline: 'clamp(1.5rem, 5vw, 4rem)',
        }}
      >
        <p className="eyebrow flex items-center gap-3 text-accent-nature">
          <span className="h-px w-8 bg-accent-nature" aria-hidden="true" />
          Een samenwerking voor het Limburgse buitengebied
        </p>

        <h1
          className="mt-5 max-w-3xl font-sans font-extrabold tracking-tight text-balance text-foreground"
          style={{ fontSize: 'clamp(2.25rem, calc(4.5vw + 1rem), 5rem)', lineHeight: 0.98 }}
        >
          <span className="block">Grond.</span>
          <span className="block">Gemeenschap.</span>
          <span className="block">Toekomst.</span>
        </h1>

        <p
          className="mt-7 text-pretty font-serif text-lg leading-relaxed text-foreground/85 sm:text-xl"
          style={{ maxWidth: '36rem' }}
        >
          Leefland Limburg is een samenwerkingsverband van ecologische en sociale wooninitiatieven — van CPO tot VVE
          — die samen bouwen aan een leefbare provincie, buiten de gebaande paden van de markt.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#doe-mee"
            className="stamp-hover inline-flex items-center gap-2 bg-accent-action px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-paper"
          >
            Sluit je aan
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
          <a
            href="#probleem"
            className="inline-flex items-center gap-2 border border-border-subtle px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-accent-action hover:text-accent-action"
          >
            Lees het dossier
          </a>
        </div>
      </div>
    </section>
  )
}
