"use client"

import Image from "next/image"
import { CalendarDays, Star } from "lucide-react"
import { SHOP_CONFIG } from "@/lib/barbershop-data"

interface Props {
  onReservar: () => void
}

export default function HeroSection({ onReservar }: Props) {
  return (
    <main className="bg-white text-black">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10">

        {/* IMAGEN DE FONDO REAL (LA DE LÍBANO) */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/IMG_4710.jpeg"
            alt="Líbano Barbería Interior"
            fill
            priority
            className="object-cover grayscale opacity-20"
            sizes="100vw"
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-4 text-center w-full flex flex-col items-center">

          {/* LOGO GIGANTE REORTADO POR CÓDIGO */}
          <div className="relative w-full max-w-[480px] md:max-w-[720px] lg:max-w-[850px] h-[120px] md:h-[180px] lg:h-[220px] mx-auto mb-6 animate-in fade-in zoom-in duration-700 z-0">
            <Image
              src="/images/logo-libano-solo.png"
              alt="Líbano"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* CONTENIDO TEXTUAL */}
          <div className="relative z-10 flex flex-col items-center w-full">
            <div className="flex items-center justify-center gap-1.5 mb-2 opacity-80">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
              ))}
              <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-2">
                Excelencia en cada corte
              </span>
            </div>

            <h1 className="font-sans text-3xl md:text-5xl lg:text-6xl font-black text-black leading-[1.1] tracking-tighter uppercase italic mb-4 text-balance">
              Tu estilo, <span className="text-primary">perfectamente</span> definido.
            </h1>

            <p className="text-sm md:text-base text-gray-600 font-medium mb-8 max-w-lg mx-auto leading-relaxed">
              {SHOP_CONFIG.tagline}. Reserva tu turno en segundos y viví la experiencia Líbano.
            </p>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full sm:w-auto">
              <button
                onClick={onReservar}
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-primary text-white font-extrabold rounded-2xl hover:scale-105 active:scale-95 transition-all text-lg shadow-xl shadow-primary/30 uppercase tracking-tight"
              >
                <CalendarDays className="w-6 h-6" />
                Reservar Turno
              </button>

              <a
                href={`https://wa.me/${SHOP_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 border-2 border-gray-300 text-black font-bold rounded-2xl hover:bg-gray-100 transition-all text-base uppercase tracking-tight"
              >
                {/* LOGO OFICIAL DE WHATSAPP SVG */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-[#25D366]"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>

            {/* STATS LÍBANO */}
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-gray-200 pt-8 w-full max-w-lg">
              <div className="text-center">
                <span className="block text-black font-black text-xl md:text-2xl tracking-tighter">10:00</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Apertura</span>
              </div>
              <div className="text-center border-x border-gray-200 px-2">
                <span className="block text-black font-black text-xl md:text-2xl tracking-tighter">100%</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Online</span>
              </div>
              <div className="text-center">
                <span className="block text-black font-black text-xl md:text-2xl tracking-tighter">30 min</span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Bloques</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}