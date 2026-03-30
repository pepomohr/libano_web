"use client"

import { Scissors, ShoppingBag, Menu, X } from "lucide-react"
import { useState } from "react"
import { SHOP_CONFIG } from "@/lib/barbershop-data"
import { cn } from "@/lib/utils"

type Section = "inicio" | "turnos" | "productos"

interface Props {
  activeSection: Section
  onNavigate: (s: Section) => void
  cartCount: number
}

const navItems: { label: string; id: Section }[] = [
  { label: "Inicio", id: "inicio" },
  { label: "Turnos", id: "turnos" },
  { label: "Productos", id: "productos" },
]

export default function ClientHeader({ activeSection, onNavigate, cartCount }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 backdrop-blur-md bg-background/90">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate("inicio")}
          className="flex items-center gap-2 group"
          aria-label="Ir al inicio"
        >
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Scissors className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <span className="font-serif text-base font-bold text-foreground leading-none block">
              {SHOP_CONFIG.name}
            </span>
            <span className="text-xs text-muted-foreground leading-none">{SHOP_CONFIG.tagline}</span>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Cart + mobile toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("productos")}
            className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            aria-label={`Carrito, ${cartCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú móvil"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border/40 bg-card px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false) }}
              className={cn(
                "text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  )
}
