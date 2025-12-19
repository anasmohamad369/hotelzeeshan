"use client"

import MenuCard from "./menu-card"
import type { MenuItem, CartItem } from "@/lib/menu-data"

interface MenuSectionProps {
  title: string
  icon: string
  items: MenuItem[]
  cart: CartItem[]
  onAdd: (item: MenuItem) => void
  onRemove: (slug: string) => void
}

export default function MenuSection({ title, icon, items, cart, onAdd, onRemove }: MenuSectionProps) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">{icon}</span>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <div className="flex-1 h-px bg-border ml-4" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <MenuCard
            key={item.slug}
            item={item}
            cartItem={cart.find((c) => c.slug === item.slug)}
            onAdd={onAdd}
            onRemove={onRemove}
          />
        ))}
      </div>
    </section>
  )
}
