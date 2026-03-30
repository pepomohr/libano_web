"use client"

import Image from "next/image"
import { CalendarDays, Star, MessageCircle } from "lucide-react"
import { SHOP_CONFIG } from "@/lib/barbershop-data"

interface Props {
  onReservar: () => void
}

export default function HeroSection({ onReservar }: Props) {
  return (
    <main className="bg-background">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        
        {/* IMAGEN DE FONDO REAL (LA DE LÍBANO) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/IMG_4710.jpeg" // Tu screenshot de iPhone
            alt="Líbano Barbería Interior"
            fill
            priority
            className="object-cover grayscale opacity-5" // Efecto sutil en blanco y negro
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-center">
          
          {/* LOGO COMO TÍTULO PRINCIPAL */}
          <div className="w-64 md:w-80 h-auto mx-auto mb-8 animate-in fade-in zoom-in duration-700">
            <Image 
              src="/logo-libano-solo.png" // El logo que recortaste con PhotoRoom
              alt="Líbano" 
              width={320} 
              height={120} 
              className="object-contain mx-auto"
              priority 
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-6 opacity-80">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
            ))}
            <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-2">
              Excelencia en cada corte
            </span>
          </div>

          <h1 className="font-sans text-4xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tighter uppercase italic mb-6 text-balance">
            Tu estilo, <span className="text-primary">perfectamente</span> definido.
          </h1>

          <p className="text-base md:text-lg text-muted-foreground font-medium mb-10 max-w-lg mx-auto leading-relaxed">
            {SHOP_CONFIG.tagline}. Reserva tu turno en segundos y viví la experiencia Líbano.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={onReservar}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-primary text-primary-foreground font-extrabold rounded-2xl hover:scale-105 active:scale-95 transition-all text-lg shadow-2xl shadow-primary/40 uppercase tracking-tight"
            >
              <CalendarDays className="w-6 h-6" />
              Reservar Turno
            </button>
            
            <a
              href={`https://wa.me/${SHOP_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-secondary transition-all text-base uppercase tracking-tight"
            >
              <MessageCircle className="w-5 h-5 text-primary" />
              WhatsApp
            </a>
          </div>

          {/* STATS LÍBANO */}
          <div className="mt-20 grid grid-cols-3 gap-4 border-t border-border/50 pt-10">
            <div className="text-center">
              <span className="block text-foreground font-black text-xl md:text-2xl tracking-tighter">10:00</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Apertura</span>
            </div>
            <div className="text-center border-x border-border/50 px-2">
              <span className="block text-foreground font-black text-xl md:text-2xl tracking-tighter">100%</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Online</span>
            </div>
            <div className="text-center">
              <span className="block text-foreground font-black text-xl md:text-2xl tracking-tighter">30 min</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Bloques</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
