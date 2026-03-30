"use client"

import { useState, useEffect, useMemo } from "react"
import { format, addDays, subDays, startOfToday, isSameDay } from "date-fns"
import { es } from "date-fns/locale"
import {
  ChevronLeft, ChevronRight, Phone, MessageCircle, Check,
  CalendarDays, Package, Clock, User, Scissors, AlertCircle
} from "lucide-react"
import {
  type Appointment, type ServiceId, SERVICES, INITIAL_PRODUCTS,
  formatPrice, getBookedSlots, generateTimeSlots, SHOP_CONFIG
} from "@/lib/barbershop-data"
import { cn } from "@/lib/utils"

// Seed some demo appointments so the admin has something to see
function getSeedAppointments(): Appointment[] {
  const today = format(startOfToday(), "yyyy-MM-dd")
  return [
    {
      id: "seed-1",
      date: today,
      time: "09:00",
      clientName: "Carlos Martínez",
      clientPhone: "1165432100",
      services: ["corte", "barba"],
      products: [{ productId: "polvo", name: "Polvo Voluminizador", price: 12000, qty: 1 }],
      total: 16000 + 12000,
      status: "pending",
    },
    {
      id: "seed-2",
      date: today,
      time: "10:00",
      clientName: "Lucas Fernández",
      clientPhone: "1198765432",
      services: ["corte", "cejas"],
      products: [],
      total: 15000,
      status: "done",
    },
    {
      id: "seed-3",
      date: today,
      time: "11:30",
      clientName: "Matías López",
      clientPhone: "1187654321",
      services: ["barba", "color"],
      products: [],
      total: 5000 + 10000,
      status: "pending",
    },
    {
      id: "seed-4",
      date: format(addDays(startOfToday(), 1), "yyyy-MM-dd"),
      time: "09:30",
      clientName: "Rodrigo García",
      clientPhone: "1176543210",
      services: ["corte", "barba", "cejas"],
      products: [{ productId: "crema", name: "Crema de Peinado", price: 8000, qty: 2 }],
      total: 16000 + 8000 * 2,
      status: "pending",
    },
  ]
}

const SERVICE_LABELS: Record<ServiceId, string> = {
  corte: "Corte",
  barba: "Barba",
  cejas: "Cejas",
  color: "Color",
}

export default function AppointmentsView() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday())
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    const stored: Appointment[] = JSON.parse(localStorage.getItem("appointments") || "[]")
    const seeds = getSeedAppointments()
    // Merge seeds (avoid duplicates by id)
    const ids = new Set(stored.map((a) => a.id))
    const merged = [...stored, ...seeds.filter((s) => !ids.has(s.id))]
    setAppointments(merged)
  }, [])

  const dateStr = format(selectedDate, "yyyy-MM-dd")

  const dayAppointments = useMemo(
    () =>
      appointments
        .filter((a) => a.date === dateStr)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [appointments, dateStr]
  )

  const pendingCount = dayAppointments.filter((a) => a.status === "pending").length
  const doneCount = dayAppointments.filter((a) => a.status === "done").length
  const revenue = dayAppointments
    .filter((a) => a.status === "done")
    .reduce((acc, a) => acc + a.total, 0)

  const markDone = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "done" } : a))
    )
    // Persist
    setAppointments((prev) => {
      localStorage.setItem("appointments", JSON.stringify(prev))
      return prev
    })
  }

  const isToday = isSameDay(selectedDate, startOfToday())
  const isTomorrow = isSameDay(selectedDate, addDays(startOfToday(), 1))

  return (
    <div>
      {/* Date selector */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            Agenda de Turnos
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {isToday ? "Hoy — " : isTomorrow ? "Mañana — " : ""}
            <span className="capitalize">
              {format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate((d) => subDays(d, 1))}
            className="p-2 rounded-md border border-border hover:bg-muted transition-all"
            aria-label="Día anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <input
            type="date"
            value={format(selectedDate, "yyyy-MM-dd")}
            onChange={(e) => {
              if (e.target.value) setSelectedDate(new Date(e.target.value + "T12:00:00"))
            }}
            className="px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Seleccionar fecha"
          />

          <button
            onClick={() => setSelectedDate((d) => addDays(d, 1))}
            className="p-2 rounded-md border border-border hover:bg-muted transition-all"
            aria-label="Día siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{dayAppointments.length}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Turnos totales</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">{pendingCount}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Pendientes</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{formatPrice(revenue)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">Facturado</p>
        </div>
      </div>

      {/* Appointments list */}
      {dayAppointments.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <CalendarDays className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-foreground font-medium mb-1">No hay turnos este día</p>
          <p className="text-sm text-muted-foreground">
            Los turnos reservados por los clientes aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {dayAppointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onMarkDone={() => markDone(appt.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function AppointmentCard({
  appointment: appt,
  onMarkDone,
}: {
  appointment: Appointment
  onMarkDone: () => void
}) {
  const isDone = appt.status === "done"
  const hasProducts = appt.products.length > 0

  return (
    <div className={cn(
      "bg-card border rounded-xl p-5 transition-all",
      isDone ? "border-border opacity-60" : "border-border hover:border-border/80 hover:shadow-md hover:shadow-black/10"
    )}>
      <div className="flex items-start justify-between gap-3 flex-wrap">
        {/* Left info */}
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
            isDone ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
          )}>
            <div className="text-center leading-none">
              <div className="text-base font-bold">{appt.time.split(":")[0]}</div>
              <div className="text-xs">{appt.time.split(":")[1]}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{appt.clientName}</h3>
              {isDone ? (
                <span className="text-[10px] font-bold bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">
                  Finalizado
                </span>
              ) : (
                <span className="text-[10px] font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                  Pendiente
                </span>
              )}
            </div>

            {/* Services */}
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <Scissors className="w-3 h-3 text-muted-foreground" />
              {appt.services.map((svc, i) => (
                <span key={svc} className="text-sm text-muted-foreground">
                  {SERVICE_LABELS[svc]}{i < appt.services.length - 1 ? " +" : ""}
                </span>
              ))}
            </div>

            {/* Products highlight */}
            {hasProducts && (
              <div className="mt-2 flex items-start gap-1.5 bg-primary/5 border border-primary/20 rounded-md px-2.5 py-1.5">
                <Package className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="text-primary font-medium">Pedido a retirar: </span>
                  {appt.products.map((p, i) => (
                    <span key={p.productId} className="text-foreground">
                      {p.qty}x {p.name}{i < appt.products.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right actions */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="font-bold text-primary text-lg">{formatPrice(appt.total)}</span>

          <div className="flex items-center gap-1.5">
            <a
              href={`tel:+54${appt.clientPhone}`}
              className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              aria-label={`Llamar a ${appt.clientName}`}
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
            <a
              href={`https://wa.me/54${appt.clientPhone}?text=Hola ${appt.clientName}, te recordamos tu turno en ${SHOP_CONFIG.name} para las ${appt.time}hs.`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md border border-border text-muted-foreground hover:text-green-500 hover:border-green-500/40 hover:bg-green-500/5 transition-all"
              aria-label={`WhatsApp a ${appt.clientName}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </a>
            {!isDone && (
              <button
                onClick={onMarkDone}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-500 border border-green-500/30 rounded-md text-xs font-semibold hover:bg-green-500/20 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                Finalizar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
