"use client"

import { useState, useEffect } from "react"
import { Menu, X, Globe } from "lucide-react"

const links = [
  { href: "#about", label: "Acerca de" },
  { href: "#committees", label: "Comisiones" },
  { href: "#timeline", label: "Cronograma" },
  { href: "#register", label: "Inscríbete" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#021f37]/90 backdrop-blur-lg border-b border-primary/20 shadow-lg shadow-primary/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded border border-primary flex items-center justify-center neon-glow group-hover:scale-110 transition-transform">
            <Globe className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display text-primary neon-text text-lg tracking-widest">
            MONUSGB<span className="text-foreground/60 font-sans font-light text-sm ml-1">2026</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Navegación principal">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <a
            href="/admin"
            className="text-xs border border-primary/40 text-primary px-3 py-1.5 rounded hover:border-primary hover:neon-glow transition-all duration-300"
          >
            Admin
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-primary p-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="md:hidden bg-[#021f37]/95 backdrop-blur-lg border-t border-primary/20 px-4 py-4 flex flex-col gap-3"
          aria-label="Menú móvil"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-muted-foreground hover:text-primary transition-colors duration-200 py-2 border-b border-primary/10"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/admin"
            className="text-primary text-sm mt-2"
            onClick={() => setOpen(false)}
          >
            Panel de Administración →
          </a>
        </nav>
      )}
    </header>
  )
}
