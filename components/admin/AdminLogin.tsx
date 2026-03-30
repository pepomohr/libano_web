"use client"

import { useState } from "react"
import { Scissors, Eye, EyeOff, AlertCircle } from "lucide-react"
import { SHOP_CONFIG } from "@/lib/barbershop-data"

interface Props {
  onLogin: () => void
}

export default function AdminLogin({ onLogin }: Props) {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (user === SHOP_CONFIG.adminUser && pass === SHOP_CONFIG.adminPassword) {
      onLogin()
    } else {
      setError("Usuario o contraseña incorrectos")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
            <Scissors className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-foreground">{SHOP_CONFIG.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">Panel de Administración</p>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-foreground mb-5">Iniciar Sesión</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Usuario</label>
              <input
                type="text"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="w-full px-3 py-2.5 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-3 py-2.5 pr-10 bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 active:scale-[0.98] transition-all mt-1"
            >
              Ingresar al Panel
            </button>
          </form>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Demo: usuario <strong>admin</strong> / contraseña <strong>1234</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
