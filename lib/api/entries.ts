import type {
  TimeEntry,
  CreateTimeEntryInput,
  UpdateTimeEntryInput,
} from "@/lib/types"

export async function fetchEntries(
  startDate?: string,
  endDate?: string
): Promise<TimeEntry[]> {
  const params = new URLSearchParams()
  if (startDate) params.set("startDate", startDate)
  if (endDate) params.set("endDate", endDate)

  const url = `/api/entries${params.toString() ? `?${params.toString()}` : ""}`
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch entries")
  return res.json()
}

export async function fetchActiveEntry(): Promise<TimeEntry | null> {
  const res = await fetch("/api/entries/active")
  if (!res.ok) throw new Error("Failed to fetch active entry")
  return res.json()
}

export async function fetchTaskNames(): Promise<string[]> {
  const res = await fetch("/api/entries/task-names")
  if (!res.ok) throw new Error("Failed to fetch task names")
  return res.json()
}

export async function createEntry(
  data: CreateTimeEntryInput
): Promise<TimeEntry> {
  const res = await fetch("/api/entries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create entry")
  return res.json()
}

export async function updateEntry(
  id: string,
  data: UpdateTimeEntryInput
): Promise<TimeEntry> {
  const res = await fetch(`/api/entries/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update entry")
  return res.json()
}

export async function deleteEntry(id: string): Promise<void> {
  const res = await fetch(`/api/entries/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete entry")
}

export async function stopEntry(
  id: string,
  endTime: string,
  duration: number
): Promise<TimeEntry> {
  return updateEntry(id, { endTime, duration })
}
