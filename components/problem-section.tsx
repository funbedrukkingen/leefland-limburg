export function ProblemSection() {
  return (
    <section id="probleem" aria-labelledby="probleem-heading" className="bg-background-alt">
      <div
        className="mx-auto max-w-7xl"
        style={{ paddingBlock: 'clamp(4rem, 9vw, 7rem)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
      >
        <div
          className="grid lg:grid-cols-[7fr_5fr] lg:items-start"
          style={{ gap: 'clamp(2rem, 6vw, 3rem)' }}
        >
          <div>
            <p className="eyebrow text-accent-nature">Dossier · POVI</p>
            <h2
              id="probleem-heading"
              className="mt-4 text-balance font-sans text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
            >
              Het probleem
            </h2>
            <div className="mt-6 max-w-2xl space-y-5 font-serif text-lg leading-relaxed text-foreground/90">
              <p>
                Jarenlang liepen ecologische en sociale wooninitiatieven in Limburg vast in trage procedures en
                verouderde bestemmingsplannen. De POVI biedt op papier ruimte voor verandering — in de praktijk
                beweegt er weinig.
              </p>
              <p>
                Aanvraag na aanvraag strandde niet op de inhoud, maar op een systeem dat niet was ingericht op deze
                manier van bouwen en samenleven.
              </p>
            </div>
          </div>

          <blockquote
            className="rotate-[-1.25deg] border-2 border-accent-action bg-paper p-8 transition-transform duration-[250ms] hover:rotate-0 focus-within:rotate-0 motion-reduce:rotate-0 lg:justify-self-end lg:mt-12"
            style={{ maxWidth: '22rem' }}
          >
            <p className="font-mono text-base leading-relaxed text-ink sm:text-lg">
              &ldquo;Wij vragen niet om uitzonderingen. Wij vragen om regels die passen bij de opgave van
              vandaag.&rdquo;
            </p>
            <footer className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60">
              — Betrokken initiatiefnemer, Leefland Limburg
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  )
}
