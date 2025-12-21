"use client"

import { cn } from "@/lib/utils"
import { categories } from "@/lib/menu-data"

interface CategoryTabsProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-2xl transition-all",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-white text-black hover:bg-white/80",
              )}
            >
              <img src={category.icon} alt={category.label} className="w-6 h-6 rounded-full" />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
