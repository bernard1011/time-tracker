"use client"

import { useEntries } from "@/hooks/useEntries"
import { useProjects } from "@/hooks/useProjects"
import { TimeEntryItem } from "./TimeEntryItem"
import { formatDurationShort } from "@/lib/utils/time"
import { getStartOfDay, getEndOfDay } from "@/lib/utils/time"
import { Clock } from "lucide-react"

export function TimeEntryList() {
  const today = new Date()
  const startDate = getStartOfDay(today).toISOString()
  const endDate = getEndOfDay(today).toISOString()

  const { groupedEntries, totalDuration, editEntry, removeEntry, isLoading } =
    useEntries(startDate, endDate)
  const { projects } = useProjects()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (groupedEntries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="text-lg font-medium text-foreground">No entries today</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Start tracking your time to see entries here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with total */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Today&apos;s Entries
        </h2>
        <div className="text-sm text-muted-foreground">
          Total: <span className="font-medium text-foreground">{formatDurationShort(totalDuration)}</span>
        </div>
      </div>

      {/* Grouped entries */}
      <div className="space-y-4">
        {groupedEntries.map((group) => (
          <div
            key={group.project?.id ?? "no-project"}
            className="rounded-xl border border-border bg-card overflow-hidden"
          >
            {/* Project header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
              <div className="flex items-center gap-3">
                {group.project ? (
                  <>
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: group.project.color }}
                    />
                    <span className="font-medium text-foreground">
                      {group.project.name}
                    </span>
                  </>
                ) : (
                  <span className="text-muted-foreground">No Project</span>
                )}
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {formatDurationShort(group.totalDuration)}
              </span>
            </div>

            {/* Entries */}
            <div className="divide-y divide-border">
              {group.entries.map((entry) => (
                <TimeEntryItem
                  key={entry.id}
                  entry={entry}
                  projects={projects}
                  onUpdate={editEntry}
                  onDelete={removeEntry}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
