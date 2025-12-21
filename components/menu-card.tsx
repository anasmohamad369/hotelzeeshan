"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { MenuItem, CartItem } from "@/lib/menu-data"

interface MenuCardProps {
  item: MenuItem
  cart: CartItem[]
  onAdd: (item: Omit<CartItem, "quantity">) => void
  onRemove: (slug: string) => void
}

export default function MenuCard({ item, cart, onAdd, onRemove }: MenuCardProps) {
  const isVariant = "variants" in item && !!item.variants

  // State for selected variant slug, defaults to the first variant if available
  const [selectedVariantSlug, setSelectedVariantSlug] = useState<string>(
    isVariant ? item.variants![0].slug : ""
  )

  // Determine current display values
  const currentVariant = isVariant
    ? item.variants!.find((v) => v.slug === selectedVariantSlug) || item.variants![0]
    : null

  const displayPrice = isVariant ? currentVariant!.price : item.price!
  const displaySlug = isVariant ? currentVariant!.slug : item.slug!
  const displayName = isVariant ? currentVariant!.item : item.item

  // Find quantity in cart for the SPECIFIC slug
  const cartItem = cart.find((c) => c.slug === displaySlug)
  const quantity = cartItem?.quantity || 0

  // Total quantity for this product (all variants combined)
  const totalQuantity = isVariant
    ? item.variants!.reduce((acc, v) => acc + (cart.find((c) => c.slug === v.slug)?.quantity || 0), 0)
    : quantity

  const handleAdd = () => {
    onAdd({
      item: displayName,
      price: displayPrice,
      slug: displaySlug,
      image: item.image,
    })
  }

  return (
    <Card className="group overflow-hidden bg-card hover:shadow-xl transition-all duration-300 border-border/50">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.item}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {totalQuantity > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
            {totalQuantity} in cart
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-card-foreground capitalize text-lg leading-tight mb-2 truncate" title={item.item}>
          {item.item}
        </h3>

        {isVariant && (
          <div className="flex gap-2 mb-3 bg-muted/50 p-1 rounded-lg">
            {item.variants!.map((v) => (
              <button
                key={v.slug}
                className={`flex-1 text-xs font-medium py-1 rounded-md transition-colors ${selectedVariantSlug === v.slug
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-white/50"
                  }`}
                onClick={() => setSelectedVariantSlug(v.slug)}
              >
                {v.size}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <span className="text-xl font-bold text-secondary">₹{displayPrice}</span>

          {quantity === 0 ? (
            <Button size="sm" onClick={handleAdd} className="bg-secondary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 bg-transparent"
                onClick={() => onRemove(displaySlug)}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button size="icon" className="h-8 w-8 bg-primary" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
