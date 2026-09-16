import { ConversionFooter } from '@/components/conversion-footer'
import { HeroSection } from '@/components/hero-section'
import { InitiativesSection } from '@/components/initiatives-section'
import { ProblemSection } from '@/components/problem-section'
import { SiteHeader } from '@/components/site-header'

export default function Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <InitiativesSection />
      </main>
      <ConversionFooter />
    </div>
  )
}