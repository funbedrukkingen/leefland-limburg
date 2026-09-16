'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'

const navLinks = [
  { href: '#top', label: 'Missie' },
  { href: '#probleem', label: 'Het probleem' },
  { href: '#initiatieven', label: 'Initiatieven' },
]

function NavLink({ href, label, onClick }: { href: string; label: string; onClick?: () => void }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="relative py-1 font-mono text-sm text-foreground/80 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 hover:text-foreground hover:after:scale-x-100 focus-visible:text-foreground focus-visible:after:scale-x-100 motion-reduce:after:transition-none"
    >
      {label}
    </a>
  )
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-background/95 backdrop-blur-sm">
      <div
        className="mx-auto flex max-w-7xl items-center justify-between gap-4"
        style={{ height: 'clamp(4.5rem, 8vh, 6rem)', paddingInline: 'clamp(1.5rem, 5vw, 4rem)' }}
      >
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-sans text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            Leefland
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Limburg</span>
        </a>

        <nav
          aria-label="Hoofdnavigatie"
          className="hidden items-center md:flex"
          style={{ gap: 'clamp(1.25rem, 3vw, 2.5rem)' }}
        >
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground lg:inline-flex">
            <span className="size-1.5 rounded-full bg-accent-nature" aria-hidden="true" />
            Status: Actief
          </span>
          <ThemeToggle />
          <a
            href="#doe-mee"
            className="stamp-hover hidden bg-accent-action px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-paper sm:inline-flex"
          >
            Doe mee
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-flex size-9 items-center justify-center border border-border-subtle text-foreground md:hidden"
          >
            {menuOpen ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
            <span className="sr-only">{menuOpen ? 'Sluit menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobiele navigatie"
          className="border-t border-border-subtle bg-background px-6 py-6 md:hidden"
        >
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} label={link.label} onClick={() => setMenuOpen(false)} />
              </li>
            ))}
            <li>
              <a
                href="#doe-mee"
                onClick={() => setMenuOpen(false)}
                className="stamp-hover inline-flex bg-accent-action px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-paper"
              >
                Doe mee
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
