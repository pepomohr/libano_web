"use client"

import { useState } from "react"
import { Scissors, LogOut, CalendarDays, Package } from "lucide-react"
import { SHOP_CONFIG } from "@/lib/barbershop-data"
import { cn } from "@/lib/utils"
import AppointmentsView from "./AppointmentsView"
import StockView from "./StockView"

type Tab = "agenda" | "stock"

interface Props {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("agenda")

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <Scissors className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-none">{SHOP_CONFIG.name}</p>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">Panel Admin</p>
            </div>
          </div>

          {/* Tab nav */}
          <nav className="hidden sm:flex items-center gap-1" aria-label="Secciones del panel">
            <button
              onClick={() => setActiveTab("agenda")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === "agenda"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <CalendarDays className="w-4 h-4" />
              Agenda
            </button>
            <button
              onClick={() => setActiveTab("stock")}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all",
                activeTab === "stock"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Package className="w-4 h-4" />
              Stock
            </button>
          </nav>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>

        {/* Mobile tab nav */}
        <div className="sm:hidden flex border-t border-border/40">
          <button
            onClick={() => setActiveTab("agenda")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-all",
              activeTab === "agenda"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            )}
          >
            <CalendarDays className="w-4 h-4" />
            Agenda
          </button>
          <button
            onClick={() => setActiveTab("stock")}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-all",
              activeTab === "stock"
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground"
            )}
          >
            <Package className="w-4 h-4" />
            Stock
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "agenda" && <AppointmentsView />}
        {activeTab === "stock" && <StockView />}
      </div>
    </div>
  )
}
