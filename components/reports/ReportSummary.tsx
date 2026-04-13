"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock, FolderKanban, ListTodo } from "lucide-react"
import { formatDurationShort } from "@/lib/utils/time"

interface ReportSummaryProps {
  totalDuration: number
  totalProjects: number
  totalEntries: number
}

export function ReportSummary({
  totalDuration,
  totalProjects,
  totalEntries,
}: ReportSummaryProps) {
  const stats = [
    {
      label: "Total Time",
      value: formatDurationShort(totalDuration),
      icon: Clock,
      color: "text-primary",
    },
    {
      label: "Projects",
      value: totalProjects.toString(),
      icon: FolderKanban,
      color: "text-emerald-500",
    },
    {
      label: "Entries",
      value: totalEntries.toString(),
      icon: ListTodo,
      color: "text-amber-500",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-lg bg-muted",
                stat.color
              )}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
