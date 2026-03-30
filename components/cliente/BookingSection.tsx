"use client"

import { useState, useMemo } from "react"
import { format, addDays, startOfToday, isSameDay, isWeekend } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Check, Tag, Gift, AlertCircle, Phone, CalendarCheck } from "lucide-react"
import {
  SERVICES,
  calculatePricing,
  generateTimeSlots,
  getBookedSlots,
  formatPrice,
  SHOP_CONFIG,
  type ServiceId,
  type CartItem,
  type Appointment,
} from "@/lib/barbershop-data"
import { cn } from "@/lib/utils"

interface Props {
  productCart: CartItem[]
  onBookingComplete: () => void
}

type Step = 1 | 2 | 3

export default function BookingSection({ productCart, onBookingComplete }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedServices, setSelectedServices] = useState<ServiceId[]>([])
  const [calendarOffset, setCalendarOffset] = useState(0)
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const today = startOfToday()

  const availableDays = useMemo(() => {
    const days: Date[] = []
    let cursor = addDays(today, calendarOffset * 7)
    while (days.length < 14) {
      if (cursor.getDay() !== 0) days.push(cursor)
      cursor = addDays(cursor, 1)
    }
    return days
  }, [today, calendarOffset])

  const timeSlots = useMemo(() => generateTimeSlots(), [])
  const bookedSlots = useMemo(() =>
    selectedDate ? getBookedSlots(format(selectedDate, "yyyy-MM-dd")) : [],
    [selectedDate]
  )

  const productTotal = productCart.reduce((a, p) => a + p.price * p.qty, 0)
  const pricing = useMemo(() => calculatePricing(selectedServices, productTotal), [selectedServices, productTotal])

  const toggleService = (id: ServiceId) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleConfirm = () => {
    const newErrors: Record<string, string> = {}
    if (!clientName.trim()) newErrors.name = "El nombre es obligatorio"
    if (!clientPhone.trim()) newErrors.phone = "El celular es obligatorio"
    if (newErrors.name || newErrors.phone) { setErrors(newErrors); return }

    const appt: Appointment = {
      id: Date.now().toString(),
      date: format(selectedDate!, "yyyy-MM-dd"),
      time: selectedTime!,
      clientName,
      clientPhone,
      services: selectedServices,
      products: productCart,
      total: pricing.total,
      status: "pending",
    }

    const existing: Appointment[] = JSON.parse(localStorage.getItem("appointments") || "[]")
    localStorage.setItem("appointments", JSON.stringify([...existing, appt]))
    setConfirmed(true)
    onBookingComplete()
  }

  if (confirmed) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CalendarCheck className="w-10 h-10 text-primary" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-black mb-3">
          ¡Turno confirmado!
        </h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          Te esperamos el{" "}
          <strong className="text-black">
            {format(selectedDate!, "EEEE d 'de' MMMM", { locale: es })}
          </strong>{" "}
          a las <strong className="text-black">{selectedTime}</strong>hs.
          Recibirás un recordatorio por WhatsApp.
        </p>
        <div className="bg-white border border-gray-200 shadow-sm rounded-md p-4 text-left space-y-2 mb-6">
          {pricing.lines.map((l) => (
            <div key={l.label} className="flex justify-between text-sm">
              <span className="text-gray-600">{l.label}</span>
              <span className="text-black font-medium">{formatPrice(l.price)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
            <span className="text-black">Total</span>
            <span className="text-primary">{formatPrice(pricing.total)}</span>
          </div>
        </div>
        <button
          onClick={() => {
            setConfirmed(false); setStep(1); setSelectedDate(null)
            setSelectedTime(null); setSelectedServices([]); setClientName(""); setClientPhone("")
          }}
          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-all"
        >
          Hacer otra reserva
        </button>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-black mb-2 text-balance">
          Reserva tu Turno
        </h2>
        <p className="text-gray-600">Elegí fecha, servicios y confirmá en segundos.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {([1, 2, 3] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all",
              step === s ? "bg-primary text-white shadow-lg shadow-primary/30" :
                step > s ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-400"
            )}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            <span className={cn(
              "text-sm hidden sm:inline",
              step === s ? "text-black font-medium" : "text-gray-400"
            )}>
              {s === 1 ? "Fecha y Hora" : s === 2 ? "Servicios" : "Confirmación"}
            </span>
            {i < 2 && <div className={cn("flex-1 h-px w-8 sm:w-12", step > s ? "bg-primary/40" : "bg-gray-200")} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">

          {/* STEP 1 — Date & Time */}
          {step === 1 && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <h3 className="font-semibold text-black">Seleccionar Fecha</h3>
                  <span className="text-sm font-medium text-gray-500 capitalize">
                    {format(availableDays[0], "MMMM yyyy", { locale: es })}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCalendarOffset((o) => Math.max(0, o - 1))}
                    disabled={calendarOffset === 0}
                    className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-30 text-black transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCalendarOffset((o) => o + 1)}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-black transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
                {["L", "M", "Mi", "J", "V", "S", "D"].map(d => <div key={d}>{d}</div>)}
              </div>

              <DaysGrid
                days={availableDays}
                selectedDate={selectedDate}
                onSelect={(d) => { setSelectedDate(d); setSelectedTime(null) }}
              />

              {selectedDate && (
                <div>
                  <p className="text-sm font-medium text-black mb-3">
                    Horarios disponibles para el{" "}
                    <span className="text-primary">
                      {format(selectedDate, "EEEE d/MM", { locale: es })}
                    </span>
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {timeSlots.map((slot) => {
                      const booked = bookedSlots.includes(slot)
                      return (
                        <button
                          key={slot}
                          disabled={booked}
                          onClick={() => setSelectedTime(slot)}
                          className={cn(
                            "py-2 text-sm rounded-md font-bold transition-all border",
                            booked
                              ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed opacity-60"
                              : selectedTime === slot
                                ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                : "border-gray-200 hover:border-primary/50 hover:bg-gray-50 text-black"
                          )}
                        >
                          {slot}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep(2)}
                className="w-full py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Continuar
              </button>
            </div>
          )}

          {/* STEP 2 — Services */}
          {step === 2 && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-black">Elegí tus Servicios</h3>
                <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-black">
                  ← Cambiar fecha
                </button>
              </div>

              {selectedServices.includes("corte") && (
                <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-md px-3 py-2 text-sm text-primary">
                  <Tag className="w-3.5 h-3.5 shrink-0" />
                  Combo activo: Barba a $2.000 + Cejas GRATIS
                </div>
              )}

              <div className="space-y-3">
                {SERVICES.map((svc) => {
                  const checked = selectedServices.includes(svc.id)
                  const hasCorte = selectedServices.includes("corte")
                  const isBarbaCombo = svc.id === "barba" && hasCorte
                  const isCejasGift = svc.id === "cejas" && hasCorte

                  let displayPrice = svc.basePrice
                  if (isBarbaCombo) displayPrice = 2000
                  if (isCejasGift) displayPrice = 0

                  return (
                    <label
                      key={svc.id}
                      className={cn(
                        "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                        checked
                          ? "border-primary/60 bg-primary/5"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <div className={cn(
                        "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
                        checked ? "bg-primary border-primary" : "border-gray-300"
                      )}>
                        {checked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        onChange={() => toggleService(svc.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-black">{svc.name}</span>
                          {isBarbaCombo && (
                            <span className="text-[10px] font-bold bg-primary text-white px-1.5 py-0.5 rounded-full">
                              COMBO
                            </span>
                          )}
                          {isCejasGift && (
                            <span className="text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                              <Gift className="w-2.5 h-2.5" /> REGALO
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{svc.description}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {(isBarbaCombo || isCejasGift) && (
                          <span className="text-xs text-gray-400 line-through block">
                            {formatPrice(svc.basePrice)}
                          </span>
                        )}
                        <span className={cn(
                          "font-bold text-sm",
                          isCejasGift ? "text-green-500" : "text-primary"
                        )}>
                          {isCejasGift ? "GRATIS" : formatPrice(displayPrice)}
                        </span>
                      </div>
                    </label>
                  )
                })}
              </div>

              <button
                disabled={selectedServices.length === 0}
                onClick={() => setStep(3)}
                className="w-full py-3 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Continuar
              </button>
            </div>
          )}

          {/* STEP 3 — Confirm */}
          {step === 3 && (
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-black">Tus Datos</h3>
                <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-black">
                  ← Cambiar servicios
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej: Juan García"
                    className={cn(
                      "w-full px-3 py-2.5 bg-white border rounded-md text-black placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                      errors.name ? "border-red-500" : "border-gray-300"
                    )}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-1.5">
                    Celular (WhatsApp)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+54 9 11 1234-5678"
                      className={cn(
                        "w-full pl-9 pr-3 py-2.5 bg-white border rounded-md text-black placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary",
                        errors.phone ? "border-red-500" : "border-gray-300"
                      )}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handleConfirm}
                className="w-full py-3.5 bg-primary text-white font-bold rounded-md hover:bg-primary/90 active:scale-[0.98] transition-all text-base shadow-lg shadow-primary/20"
              >
                Confirmar Reserva
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Summary */}
        <aside className="lg:col-span-1">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 sticky top-24">
            <h3 className="font-semibold text-black mb-4">Resumen</h3>
            {selectedDate && selectedTime && (
              <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-md">
                <p className="text-xs text-gray-500">Turno seleccionado</p>
                <p className="text-black font-medium capitalize text-sm">
                  {format(selectedDate, "EEEE d/MM", { locale: es })} — {selectedTime}hs
                </p>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-bold text-black">Total a pagar</span>
              <span className="font-bold text-primary text-lg">{formatPrice(pricing.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

function DaysGrid({
  days,
  selectedDate,
  onSelect,
}: {
  days: Date[]
  selectedDate: Date | null
  onSelect: (d: Date) => void
}) {
  const today = startOfToday()
  const firstDay = days[0]
  const startDow = firstDay.getDay() === 0 ? 7 : firstDay.getDay()

  return (
    <div className="grid grid-cols-7 gap-1">
      {Array.from({ length: startDow - 1 }).map((_, i) => (
        <div key={`empty-${i}`} />
      ))}
      {days.map((day) => {
        const isSun = day.getDay() === 0
        const isSel = selectedDate ? isSameDay(day, selectedDate) : false
        const isToday = isSameDay(day, today)
        return (
          <button
            key={day.toISOString()}
            disabled={isSun}
            onClick={() => onSelect(day)}
            className={cn(
              "h-10 w-full rounded-md text-sm font-medium transition-all",
              isSun ? "opacity-20 cursor-not-allowed text-gray-400" :
                isSel ? "bg-primary text-white shadow-md shadow-primary/25" :
                  isToday ? "border border-primary/50 text-primary" :
                    "hover:bg-gray-100 text-black border border-transparent"
            )}
          >
            {format(day, "d")}
          </button>
        )
      })}
    </div>
  )
}