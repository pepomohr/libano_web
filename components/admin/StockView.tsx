"use client"

import { useState } from "react"
import Image from "next/image"
import { Save, Plus, Minus, CheckCircle, Package } from "lucide-react"
import { INITIAL_PRODUCTS, formatPrice, type Product } from "@/lib/barbershop-data"
import { cn } from "@/lib/utils"

export default function StockView() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
  const [saved, setSaved] = useState<string[]>([])

  const updateStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    )
  }

  const updatePrice = (id: string, value: string) => {
    const num = parseInt(value.replace(/\D/g, ""), 10)
    if (!isNaN(num)) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, price: num } : p))
      )
    }
  }

  const updateName = (id: string, value: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: value } : p))
    )
  }

  const handleSave = (id: string) => {
    setSaved((prev) => [...new Set([...prev, id])])
    setTimeout(() => setSaved((prev) => prev.filter((s) => s !== id)), 2000)
  }

  const lowStockCount = products.filter((p) => p.stock <= 3).length

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-3 flex-wrap">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
            Gestión de Stock
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Editá precios y cantidades de cada producto.
          </p>
        </div>

        {lowStockCount > 0 && (
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-md px-3 py-2 text-sm text-destructive">
            <Package className="w-4 h-4 shrink-0" />
            {lowStockCount} producto(s) con stock bajo
          </div>
        )}
      </div>

      {/* Products table — desktop */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">Producto</th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">Precio</th>
              <th className="text-center px-5 py-3 text-muted-foreground font-medium">Stock actual</th>
              <th className="text-right px-5 py-3 text-muted-foreground font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, idx) => {
              const isSaved = saved.includes(product.id)
              const isLow = product.stock <= 3
              return (
                <tr
                  key={product.id}
                  className={cn(
                    "border-b border-border/50 last:border-0",
                    idx % 2 === 0 ? "" : "bg-muted/20"
                  )}
                >
                  {/* Product name + image */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateName(product.id, e.target.value)}
                        className="bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none text-foreground font-medium py-0.5 transition-all"
                      />
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-5 py-4">
                    <div className="relative w-32">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">$</span>
                      <input
                        type="text"
                        value={product.price.toLocaleString("es-AR")}
                        onChange={(e) => updatePrice(product.id, e.target.value)}
                        className="w-full pl-6 pr-2 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring text-right"
                      />
                    </div>
                  </td>

                  {/* Stock stepper */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateStock(product.id, -1)}
                        disabled={product.stock === 0}
                        className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 transition-all"
                        aria-label="Reducir stock"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className={cn(
                        "w-10 text-center font-bold text-base",
                        product.stock === 0 ? "text-destructive" :
                        isLow ? "text-amber-500" : "text-foreground"
                      )}>
                        {product.stock}
                      </span>
                      <button
                        onClick={() => updateStock(product.id, 1)}
                        className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-all"
                        aria-label="Aumentar stock"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    {isLow && product.stock > 0 && (
                      <p className="text-center text-xs text-amber-500 mt-1">Stock bajo</p>
                    )}
                    {product.stock === 0 && (
                      <p className="text-center text-xs text-destructive mt-1">Sin stock</p>
                    )}
                  </td>

                  {/* Save button */}
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleSave(product.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-semibold transition-all ml-auto",
                        isSaved
                          ? "bg-green-500/20 text-green-500 border border-green-500/30"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                    >
                      {isSaved ? (
                        <><CheckCircle className="w-3.5 h-3.5" /> Guardado</>
                      ) : (
                        <><Save className="w-3.5 h-3.5" /> Guardar</>
                      )}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Products cards — mobile */}
      <div className="md:hidden space-y-4">
        {products.map((product) => {
          const isSaved = saved.includes(product.id)
          const isLow = product.stock <= 3

          return (
            <div key={product.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateName(product.id, e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none text-foreground font-semibold w-full py-0.5 transition-all"
                  />
                  <p className="text-primary font-bold">{formatPrice(product.price)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Precio ($)</label>
                  <input
                    type="text"
                    value={product.price.toLocaleString("es-AR")}
                    onChange={(e) => updatePrice(product.id, e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Stock</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateStock(product.id, -1)}
                      disabled={product.stock === 0}
                      className="w-8 h-9 rounded-md border border-border flex items-center justify-center hover:bg-muted disabled:opacity-30 transition-all shrink-0"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className={cn(
                      "flex-1 text-center font-bold",
                      product.stock === 0 ? "text-destructive" : isLow ? "text-amber-500" : "text-foreground"
                    )}>
                      {product.stock}
                    </span>
                    <button
                      onClick={() => updateStock(product.id, 1)}
                      className="w-8 h-9 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-all shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSave(product.id)}
                className={cn(
                  "mt-4 w-full flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-semibold transition-all",
                  isSaved
                    ? "bg-green-500/20 text-green-500 border border-green-500/30"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                {isSaved ? (
                  <><CheckCircle className="w-3.5 h-3.5" /> Guardado</>
                ) : (
                  <><Save className="w-3.5 h-3.5" /> Guardar Cambios</>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
