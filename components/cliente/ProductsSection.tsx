"use client"

import Image from "next/image"
import { ShoppingBag, Plus, Minus, Check, PackageCheck, Store } from "lucide-react"
import { useState } from "react"
import { INITIAL_PRODUCTS, formatPrice, type CartItem, type Product } from "@/lib/barbershop-data"
import { cn } from "@/lib/utils"

interface Props {
  cart: CartItem[]
  onAddToCart: (item: CartItem) => void
  onRemoveFromCart: (productId: string) => void // Recibimos la nueva función
  hasBooking: boolean
}

export default function ProductsSection({ cart, onAddToCart, onRemoveFromCart, hasBooking }: Props) {
  const [added, setAdded] = useState<string[]>([])

  const getQty = (id: string) => {
    const found = cart.find((c) => c.productId === id)
    return found?.qty ?? 0
  }

  const handleAdd = (product: Product) => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      qty: 1,
    })
    setAdded((prev) => [...new Set([...prev, product.id])])
    setTimeout(() => setAdded((prev) => prev.filter((id) => id !== product.id)), 1800)
  }

  const handleRemove = (productId: string) => {
    onRemoveFromCart(productId)
  }

  const cartTotal = cart.reduce((a, c) => a + c.price * c.qty, 0)

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-black mb-2 text-balance">
          Productos
        </h2>
        <p className="text-gray-600">
          Llevate los mejores productos de peluquería profesional.
        </p>
      </div>

      {/* Cart summary */}
      {cart.length > 0 && (
        <div className="mb-6 bg-white shadow-sm border border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-black">
                {cart.reduce((a, c) => a + c.qty, 0)} producto(s) en tu pedido
              </p>
              <p className="text-xs text-gray-500">
                {hasBooking
                  ? "Se suman al total de tu turno"
                  : "Se retiran en el local al momento de tu visita"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Total productos</p>
            <p className="text-primary font-bold text-lg">{formatPrice(cartTotal)}</p>
          </div>
        </div>
      )}

      {/* Info banner */}
      {!hasBooking && (
        <div className="mb-6 flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-600">
          <Store className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
          <span>
            Si no tenés turno reservado, podés comprar los productos para{" "}
            <strong className="text-black">retirar en el local</strong>.
            O bien, <button className="text-primary underline underline-offset-2">reservá tu turno</button> para sumarlos a tu visita.
          </span>
        </div>
      )}

      {/* Products grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {INITIAL_PRODUCTS.map((product) => {
          const qty = getQty(product.id)
          const justAdded = added.includes(product.id)
          const outOfStock = product.stock === 0

          return (
            <article
              key={product.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-lg hover:shadow-black/5 transition-all group"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {outOfStock && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Sin stock
                    </span>
                  </div>
                )}
                {product.stock <= 3 && product.stock > 0 && (
                  <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm text-xs font-medium text-black px-2 py-1 rounded-full border border-gray-200">
                    Últimas {product.stock} unidades
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-black mb-1 text-balance">{product.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{product.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-primary font-bold text-xl">{formatPrice(product.price)}</span>
                    {!outOfStock && (
                      <span className="text-xs text-gray-400 ml-2">
                        Stock: {product.stock}
                      </span>
                    )}
                  </div>

                  {!outOfStock && (
                    <div className="flex items-center gap-2">
                      {qty > 0 ? (
                        <div className="flex items-center gap-2 bg-gray-50 rounded-md p-1 border border-gray-200">
                          <button
                            onClick={() => handleRemove(product.id)}
                            className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-red-500 hover:shadow-sm transition-all"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-4 text-center text-sm font-bold text-black">{qty}</span>
                          <button
                            onClick={() => handleAdd(product)}
                            className="p-1.5 hover:bg-white rounded text-gray-600 hover:text-primary hover:shadow-sm transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAdd(product)}
                          className={cn(
                            "flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-bold transition-all",
                            justAdded
                              ? "bg-green-500/10 text-green-600 border border-green-500/30"
                              : "bg-primary text-white hover:bg-primary/90 active:scale-95"
                          )}
                        >
                          {justAdded ? (
                            <>
                              <Check className="w-4 h-4" />
                              Agregado
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4" />
                              {hasBooking ? "Añadir al Turno" : "Añadir"}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {qty > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
                    <PackageCheck className="w-3.5 h-3.5 text-green-500" />
                    {hasBooking
                      ? "Incluido en tu turno"
                      : "Para retirar en el local"}
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}