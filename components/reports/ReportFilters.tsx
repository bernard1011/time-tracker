"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DateFilter } from "@/lib/types"

interface ReportFiltersProps {
  filter: DateFilter
  onChange: (filter: DateFilter) => void
}

const filters: { value: DateFilter; label: string }[] = [
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
]

export function ReportFilters({ filter, onChange }: ReportFiltersProps) {
  return (
    <div className="flex gap-2">
      {filters.map((f) => (
        <Button
          key={f.value}
          variant={filter === f.value ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(f.value)}
          className={cn(
            filter === f.value && "bg-primary text-primary-foreground"
          )}
        >
          {f.label}
        </Button>
      ))}
    </div>
  )
}
