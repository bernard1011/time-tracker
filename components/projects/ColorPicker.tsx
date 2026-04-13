"use client"

import { cn } from "@/lib/utils"

const COLORS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#6366F1", // Indigo
  "#84CC16", // Lime
  "#F97316", // Orange
]

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            "h-8 w-8 rounded-full transition-all hover:scale-110",
            value === color && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  )
}
