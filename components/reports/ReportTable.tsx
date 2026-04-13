"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TimeEntry } from "@/lib/types"
import { formatDurationForInput } from "@/lib/utils/time"

interface ReportTableProps {
  entries: TimeEntry[]
}

export function ReportTable({ entries }: ReportTableProps) {
  if (entries.length === 0) {
    return null
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">All Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead className="text-right">Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">
                    {entry.taskName}
                  </TableCell>
                  <TableCell>
                    {entry.project ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: entry.project.color }}
                        />
                        <span>{entry.project.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No Project</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(entry.startTime)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {entry.endTime ? formatDateTime(entry.endTime) : "-"}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatDurationForInput(entry.duration ?? 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
