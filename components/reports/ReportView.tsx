"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Download, BarChart3 } from "lucide-react"
import { useEntries } from "@/hooks/useEntries"
import { ReportFilters } from "./ReportFilters"
import { ReportSummary } from "./ReportSummary"
import { ReportChart } from "./ReportChart"
import { ReportTable } from "./ReportTable"
import { getDateRange } from "@/lib/utils/time"
import { exportToCSV } from "@/lib/utils/csv"
import type { DateFilter } from "@/lib/types"

export function ReportView() {
  const [filter, setFilter] = useState<DateFilter>("week")

  const { start, end } = useMemo(() => getDateRange(filter), [filter])

  const { entries, groupedEntries, totalDuration, isLoading } = useEntries(
    start.toISOString(),
    end.toISOString()
  )

  const uniqueProjects = new Set(
    entries.filter((e) => e.projectId).map((e) => e.projectId)
  ).size

  const handleExport = () => {
    const dateStr = filter === "day" ? "today" : `this-${filter}`
    exportToCSV(entries, `time-report-${dateStr}.csv`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="mt-1 text-muted-foreground">
            Analyze your time tracking data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ReportFilters filter={filter} onChange={setFilter} />
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={entries.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <BarChart3 className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium text-foreground">No data yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Start tracking time to see your reports here
          </p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <ReportSummary
            totalDuration={totalDuration}
            totalProjects={uniqueProjects}
            totalEntries={entries.length}
          />

          {/* Chart */}
          <ReportChart groupedEntries={groupedEntries} />

          {/* Table */}
          <ReportTable entries={entries} />
        </>
      )}
    </div>
  )
}
