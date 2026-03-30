"use client"

import Image from "next/image"
import { ShoppingBag, Menu, X } from "lucide-react"
import { useState } from "react"
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
    <header className="sticky top-0 z-50 border-b border-gray-200 backdrop-blur-md bg-white/90">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* LOGO GIGANTE SIN EMPUJAR LA BARRA */}
        <button
          onClick={() => onNavigate("inicio")}
          className="relative flex items-center group h-16 w-40 sm:w-56"
          aria-label="Ir al inicio"
        >
          <Image
            src="/images/logo-libano-solo.png"
            alt="Líbano Barbería"
            fill
            className="object-contain object-left scale-[1.6] sm:scale-[2.0] origin-left group-hover:scale-[1.65] sm:group-hover:scale-[2.05] transition-transform duration-300"
            priority
          />
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
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
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
            className="relative p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 transition-all"
            aria-label={`Carrito, ${cartCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú móvil"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-1 shadow-md">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileOpen(false) }}
              className={cn(
                "text-left px-4 py-2.5 rounded-md text-sm font-medium transition-all",
                activeSection === item.id
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:text-black hover:bg-gray-100"
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