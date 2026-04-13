import type { TimeEntry } from "@/lib/types"
import { formatDurationForInput } from "./time"

export function exportToCSV(entries: TimeEntry[], filename: string) {
  const headers = ["Task Name", "Project", "Start Time", "End Time", "Duration"]

  const rows = entries.map((entry) => [
    entry.taskName,
    entry.project?.name ?? "No Project",
    new Date(entry.startTime).toLocaleString(),
    entry.endTime ? new Date(entry.endTime).toLocaleString() : "",
    formatDurationForInput(entry.duration ?? 0),
  ])

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
