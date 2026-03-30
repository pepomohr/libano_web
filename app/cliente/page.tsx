"use client"

import { useState, useEffect } from "react"
import ClientHeader from "@/components/cliente/ClientHeader"
import HeroSection from "@/components/cliente/HeroSection"
import BookingSection from "@/components/cliente/BookingSection"
import ProductsSection from "@/components/cliente/ProductsSection"
import type { CartItem } from "@/lib/barbershop-data"

export default function ClientePage() {
  const [activeSection, setActiveSection] = useState<"inicio" | "turnos" | "productos">("inicio")
  const [productCart, setProductCart] = useState<CartItem[]>([])
  const [hasBooking, setHasBooking] = useState(false)

  useEffect(() => {
    if (activeSection === "inicio") {
      const timer = setTimeout(() => setActiveSection("turnos"), 3500)
      return () => clearTimeout(timer)
    }
  }, [activeSection])

  const addToCart = (item: CartItem) => {
    setProductCart((prev) => {
      const existing = prev.find((p) => p.productId === item.productId)
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId ? { ...p, qty: p.qty + 1 } : p
        )
      }
      return [...prev, item]
    })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ClientHeader
        activeSection={activeSection}
        onNavigate={setActiveSection}
        cartCount={productCart.reduce((a, p) => a + p.qty, 0)}
      />

      {activeSection === "inicio" && (
        <HeroSection onReservar={() => setActiveSection("turnos")} />
      )}

      {activeSection === "turnos" && (
        <BookingSection
          productCart={productCart}
          onBookingComplete={() => {
            setHasBooking(true)
            setProductCart([])
          }}
        />
      )}

      {activeSection === "productos" && (
        <ProductsSection
          cart={productCart}
          onAddToCart={addToCart}
          hasBooking={hasBooking}
        />
      )}
    </div>
  )
}
