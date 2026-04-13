"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import type { TimeEntryGroup } from "@/lib/types"

interface ReportChartProps {
  groupedEntries: TimeEntryGroup[]
}

export function ReportChart({ groupedEntries }: ReportChartProps) {
  const data = groupedEntries.map((group) => ({
    name: group.project?.name ?? "No Project",
    hours: Math.round((group.totalDuration / 3600) * 100) / 100,
    color: group.project?.color ?? "#94A3B8",
  }))

  if (data.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Time by Project</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <XAxis type="number" unit="h" fontSize={12} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                fontSize={12}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => [`${value}h`, "Time"]}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
