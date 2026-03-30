"use client"

import Image from "next/image"
import Link from "next/link"
import { CalendarDays, UserCircle, ShieldCheck } from "lucide-react"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* IMAGEN DE FONDO DE LÍBANO */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/IMG_4710.jpeg"
          alt="Líbano Barbería"
          fill
          priority
          className="object-cover grayscale opacity-20"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center">

        {/* LOGO GIGANTE - Subí el max-w y ajusté el margen superior */}
        <div className="w-full max-w-[420px] -mt-10 mb-2 animate-in fade-in zoom-in duration-700">
          <Image
            src="/images/logo-libano-solo.png"
            alt="Líbano Barbería"
            width={800}
            height={300}
            className="object-contain w-full h-auto"
            priority
          />
        </div>

        {/* SUBTÍTULO */}
        <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold text-gray-400 mb-12">
          BARBERÍA & ACADEMIA • DESDE 2018
        </p>

        {/* BOTONES PRINCIPALES */}
        <div className="w-full space-y-4 mb-16 relative z-10">
          <Link
            href="/cliente"
            className="group flex items-center justify-center gap-3 w-full py-5 bg-primary text-white font-extrabold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-lg uppercase tracking-tight"
          >
            <CalendarDays className="w-6 h-6" />
            Reservar Turno
          </Link>

          <Link
            href="/admin"
            className="flex items-center justify-center gap-3 w-full py-5 bg-white border-2 border-gray-200 text-gray-400 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 hover:text-black transition-all text-base uppercase tracking-tight"
          >
            <UserCircle className="w-5 h-5" />
            Acceso Personal
          </Link>
        </div>

        {/* CUADRO DE DEMO REFORMADO */}
        <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 animate-in slide-in-from-bottom duration-1000 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              Demo de Acceso
            </span>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <p className="text-gray-600">
              User: <span className="font-mono font-bold text-primary">admin</span>
            </p>
            <p className="text-gray-600">
              Pass: <span className="font-mono font-bold text-primary">1234</span>
            </p>
          </div>
        </div>

      </div>
    </main>
  )
}