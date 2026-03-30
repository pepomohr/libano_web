// ============================================
// LÍBANO CONFIG — Personalización Real
// ============================================
export const SHOP_CONFIG = {
  name: "Líbano",
  tagline: "Barbería & Academia desde 2018",
  address: "Av. Vélez Sarsfield 352, Buenos Aires",
  phone: "+54 9 11 2649-6703",
  whatsapp: "5491126496703",
  workDays: [1, 2, 3, 4, 5, 6], // Lunes a Sábado
  openHour: 10,
  closeHour: 20,
  slotMinutes: 30,
  adminUser: "admin",
  adminPassword: "1234",
}

// ============================================
// PRICING & SERVICES — Datos Reales de la Foto
// ============================================
export type ServiceId = "corte" | "barba" | "reflejos" | "color_completo"

export interface Service {
  id: ServiceId
  name: string
  basePrice: number
  description: string
  duration: number
}

export const SERVICES: Service[] = [
  { id: "corte", name: "Corte", basePrice: 15000, description: "Corte profesional Líbano Style", duration: 30 },
  { id: "barba", name: "Barba", basePrice: 9000, description: "Perfilado y arreglo de barba", duration: 30 },
  { id: "reflejos", name: "Reflejos (Incluye Corte)", basePrice: 40000, description: "Iluminación + Corte incluido", duration: 90 },
  { id: "color_completo", name: "Color Completo (Incluye Corte)", basePrice: 50000, description: "Cambio de color total + Corte incluido", duration: 120 },
]

export interface PricingResult {
  lines: { label: string; price: number; original?: number; tag?: string }[]
  total: number
}

export function calculatePricing(selected: ServiceId[], productTotal: number = 0): PricingResult {
  const hasCorte = selected.includes("corte")
  const hasBarba = selected.includes("barba")
  const lines: PricingResult["lines"] = []

  // Lógica de COMBO CORTE Y BARBA ($17.000)
  if (hasCorte && hasBarba) {
    lines.push({ label: "Combo Corte y Barba", price: 17000, original: 24000, tag: "OFERTA" })
  } else {
    // Si no es combo, agregamos los servicios normales
    for (const svcId of selected) {
      const svc = SERVICES.find(s => s.id === svcId)
      if (svc) lines.push({ label: svc.name, price: svc.basePrice })
    }
  }

  if (productTotal > 0) {
    lines.push({ label: "Productos", price: productTotal })
  }

  const total = lines.reduce((acc, l) => acc + l.price, 0)
  return { lines, total }
}

// ============================================
// PRODUCTS — (Mantenemos o ajustamos luego)
// ============================================
export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image: string
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "pomada",
    name: "Pomada Líbano",
    description: "Fijación fuerte, efecto mate.",
    price: 8500,
    stock: 20,
    image: "/images/product-polvo.jpg", // Usamos el logo temporalmente
  }
]

// ============================================
// APPOINTMENTS & SLOTS (Sin cambios)
// ============================================
export interface CartItem {
  productId: string
  name: string
  price: number
  qty: number
}

export interface Appointment {
  id: string
  date: string
  time: string
  clientName: string
  clientPhone: string
  services: ServiceId[]
  products: CartItem[]
  total: number
  status: "pending" | "done" | "cancelled"
}

export function getBookedSlots(dateStr: string): string[] {
  const hash = dateStr.split("").reduce((a, c) => a + c.charCodeAt(0), 0)
  const allSlots = generateTimeSlots()
  return allSlots.filter((_, i) => (i + hash) % 4 === 0)
}

export function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = SHOP_CONFIG.openHour; h < SHOP_CONFIG.closeHour; h++) {
    for (let m = 0; m < 60; m += SHOP_CONFIG.slotMinutes) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`)
    }
  }
  return slots
}

export function formatPrice(n: number): string {
  return `$${n.toLocaleString("es-AR")}`
}
