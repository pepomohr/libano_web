import Link from "next/link"
import Image from "next/image" // Importamos Image para el logo de Líbano
import { Scissors, User, Calendar } from "lucide-react"

export default function HomePage() import Link from "next/link"
import Image from "next/image" 
import { User, Calendar } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        
        {/* LOGO DE LÍBANO - ÚNICO TÍTULO VISUAL */}
        <div className="w-56 h-auto mx-auto mb-10 hover:scale-105 transition-transform duration-300 cursor-pointer">
          {/* Este es el PNG transparente que recortaste con PhotoRoom */}
          <Image 
            src="/logo-libano-solo.png" 
            alt="Líbano Barbería" 
            width={224} // w-56 * 4
            height={80}  // Ajustá esto según la proporción de tu recorte
            className="object-contain"
            priority // Para que cargue rápido
          />
        </div>
        
        <p className="text-muted-foreground mb-16 font-medium tracking-wide uppercase text-xs">
          Barbería & Academia • Desde 2018
        </p>

        <div className="flex flex-col gap-5">
          <Link
            href="/cliente"
            className="flex items-center justify-center gap-3 px-8 py-5 bg-primary text-primary-foreground font-extrabold rounded-2xl hover:scale-[1.02] transition-all text-xl shadow-xl shadow-primary/30 uppercase tracking-tight"
          >
            <Calendar className="w-7 h-7" />
            Reservar Turno
          </Link>
          
          <Link
            href="/admin"
            className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-border text-foreground font-bold rounded-2xl hover:bg-secondary transition-all text-base uppercase tracking-tight"
          >
            <User className="w-5 h-5" />
            Acceso Personal
          </Link>
        </div>

        <div className="mt-16 p-5 bg-secondary/50 rounded-xl border border-border/50">
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1.5">
            Demo de acceso
          </p>
          <p className="text-sm text-foreground font-mono">
            user: <span className="text-primary">admin</span> / pass: <span className="text-primary">1234</span>
          </p>
        </div>
      </div>
    </main>
  )
}


