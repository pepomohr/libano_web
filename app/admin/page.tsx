"use client"

import { useState } from "react"
import Image from "next/image"
import {
  User, Lock, Eye, EyeOff, Calendar,
  Package, LogOut, ArrowUpRight, Plus, Minus, ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"

// --- COMPONENTE DE LOGIN ---
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [showPass, setShowPass] = useState(false)
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user === "admin" && pass === "1234") onLogin()
    else alert("Credenciales incorrectas")
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/images/IMG_4710.jpeg" alt="Fondo" fill className="object-cover grayscale opacity-5" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* BOTÓN VOLVER ATRÁS */}
        <div className="mb-6 flex justify-start">
          <a
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest group"
          >
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-primary transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
            Volver al inicio
          </a>
        </div>

        <div className="text-center mb-10">
          <Image src="/images/logo-libano-solo.png" alt="Líbano" width={300} height={110} className="object-contain mb-2 mx-auto" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Panel de Administración</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-xl rounded-3xl p-8 space-y-6">
          <div className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Usuario</label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-black focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="admin"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1 tracking-widest">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-black focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-primary text-white font-black rounded-2xl uppercase tracking-tight shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            Ingresar al Panel
          </button>
        </form>
      </div>
    </main>
  )
}

// --- PÁGINA PRINCIPAL ---
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeTab, setActiveTab] = useState<"agenda" | "stock">("agenda")

  const [turnos, setTurnos] = useState([
    { id: "1", hora: "10:00", cliente: "Nicolas Mohr", servicio: "CORTE + BARBA", total: 17000, estado: "Pendiente" },
    { id: "2", hora: "11:30", cliente: "Matias Fermin", servicio: "CORTE", total: 15000, estado: "Confirmado" },
    { id: "3", hora: "15:00", cliente: "Pedro Mohr", servicio: "BARBA", total: 9000, estado: "Pendiente" },
    { id: "4", hora: "17:30", cliente: "Tomas Gonzalez", servicio: "COLOR COMPLETO", total: 50000, estado: "Confirmado" },
  ])

  const [productos, setProductos] = useState([
    { id: "p1", nombre: "Pomada Líbano Classic", precio: 8500, stock: 24, imagen: "/images/product-crema.jpg" },
  ])

  const confirmarTurno = (id: string) => {
    setTurnos(turnos.map(t => t.id === id ? { ...t, estado: "Confirmado" } : t))
  }

  const ajustarStock = (id: string, cantidad: number) => {
    setProductos(productos.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + cantidad) } : p))
  }

  const agregarProducto = () => {
    const nuevo = {
      id: Date.now().toString(),
      nombre: "Nuevo Producto",
      precio: 0,
      stock: 0,
      imagen: "/images/logo-libano-solo.png"
    }
    setProductos([...productos, nuevo])
  }

  const totalVendido = turnos.filter(t => t.estado === "Confirmado").reduce((acc, curr) => acc + curr.total, 0)

  if (!isLoggedIn) return <AdminLogin onLogin={() => setIsLoggedIn(true)} />

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full flex items-center justify-between">
          <Image src="/images/logo-libano-solo.png" alt="Líbano" width={120} height={45} className="object-contain" />
          <nav className="flex items-center bg-gray-100 p-1 rounded-2xl">
            <button onClick={() => setActiveTab("agenda")} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all", activeTab === "agenda" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-black hover:bg-gray-200")}>
              <Calendar size={16} /> Agenda
            </button>
            <button onClick={() => setActiveTab("stock")} className={cn("flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all", activeTab === "stock" ? "bg-primary text-white shadow-sm" : "text-gray-500 hover:text-black hover:bg-gray-200")}>
              <Package size={16} /> Stock
            </button>
          </nav>
          <button onClick={() => setIsLoggedIn(false)} className="text-gray-400 hover:text-red-500 transition-colors"><LogOut size={20} /></button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 space-y-8">
        <section className="bg-white border border-gray-200 rounded-[2.5rem] p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black tracking-tighter uppercase">Dashboard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary text-white rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-primary/20">
              <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-1">Total Confirmado</p>
              <p className="text-4xl font-black tracking-tighter">${totalVendido.toLocaleString()}</p>
              <ArrowUpRight className="absolute right-4 top-4 text-white opacity-40" size={30} />
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Turnos</p>
              <p className="text-4xl font-black tracking-tighter text-primary">{turnos.length}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ticket Prom.</p>
              <p className="text-4xl font-black tracking-tighter text-primary">${(totalVendido / (turnos.filter(t => t.estado === "Confirmado").length || 1)).toFixed(0).toLocaleString()}</p>
            </div>
          </div>
        </section>

        {activeTab === "agenda" ? (
          <div className="space-y-4">
            <h3 className="text-xl font-black uppercase tracking-tighter px-2">Agenda</h3>
            <div className="grid gap-3">
              {turnos.map((t) => (
                <div key={t.id} className="bg-white border border-gray-200 p-5 rounded-[2rem] flex items-center justify-between hover:shadow-md transition-all">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 bg-gray-100 rounded-2xl flex flex-col items-center justify-center">
                      <span className="text-sm font-black">{t.hora}</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg text-black">{t.cliente}</p>
                      <p className="text-xs text-gray-500 font-bold uppercase">{t.servicio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-black text-lg text-black">${t.total.toLocaleString()}</p>
                      <button
                        onClick={() => t.estado === "Pendiente" && confirmarTurno(t.id)}
                        className={cn(
                          "text-[10px] font-black uppercase px-3 py-1 rounded-full transition-all",
                          t.estado === "Confirmado" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600 hover:bg-orange-200"
                        )}
                      >
                        {t.estado}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tighter">Inventario</h3>
              <button onClick={agregarProducto} className="bg-primary text-white px-6 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-md shadow-primary/20">
                <Plus size={14} /> Nuevo
              </button>
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-gray-50">
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td className="px-8 py-6 flex items-center gap-4">
                      <div className="h-12 w-12 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200">
                        <Image src={p.imagen} alt="Producto" fill className="object-cover" />
                      </div>
                      <span className="font-bold text-black">{p.nombre}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-4">
                        <button onClick={() => ajustarStock(p.id, -1)} className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"><Minus size={14} /></button>
                        <span className="font-black text-lg w-6 text-center">{p.stock}</span>
                        <button onClick={() => ajustarStock(p.id, 1)} className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"><Plus size={14} /></button>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right font-black text-xl text-primary">${p.precio.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}