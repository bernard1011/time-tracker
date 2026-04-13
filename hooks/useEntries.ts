"use client"

import useSWR from "swr"
import type {
  TimeEntry,
  TimeEntryGroup,
  CreateTimeEntryInput,
  UpdateTimeEntryInput,
} from "@/lib/types"
import {
  fetchEntries,
  fetchActiveEntry,
  fetchTaskNames,
  createEntry,
  updateEntry,
  deleteEntry,
  stopEntry,
} from "@/lib/api/entries"

export function useEntries(startDate?: string, endDate?: string) {
  const key = startDate && endDate
    ? `/api/entries?startDate=${startDate}&endDate=${endDate}`
    : "/api/entries"

  const { data, error, isLoading, mutate } = useSWR<TimeEntry[]>(
    key,
    () => fetchEntries(startDate, endDate),
    { refreshInterval: 2000 }
  )

  const addEntry = async (input: CreateTimeEntryInput) => {
    const newEntry = await createEntry(input)
    await mutate()
    return newEntry
  }

  const editEntry = async (id: string, input: UpdateTimeEntryInput) => {
    const updated = await updateEntry(id, input)
    await mutate()
    return updated
  }

  const removeEntry = async (id: string) => {
    await deleteEntry(id)
    await mutate()
  }

  const stop = async (id: string, endTime: string, duration: number) => {
    const updated = await stopEntry(id, endTime, duration)
    await mutate()
    return updated
  }

  const groupedEntries: TimeEntryGroup[] = (() => {
    if (!data) return []
    const groups: Map<string | null, TimeEntryGroup> = new Map()
    for (const entry of data) {
      const projectId = entry.projectId
      if (!groups.has(projectId)) {
        groups.set(projectId, {
          project: entry.project ?? null,
          entries: [],
          totalDuration: 0,
        })
      }
      const group = groups.get(projectId)!
      group.entries.push(entry)
      group.totalDuration += entry.duration ?? 0
    }
    return Array.from(groups.values()).sort((a, b) => {
      if (!a.project) return 1
      if (!b.project) return -1
      return a.project.name.localeCompare(b.project.name)
    })
  })()

  const totalDuration = data?.reduce((acc, e) => acc + (e.duration ?? 0), 0) ?? 0

  return {
    entries: data ?? [],
    groupedEntries,
    totalDuration,
    isLoading,
    error,
    addEntry,
    editEntry,
    removeEntry,
    stopEntry: stop,
    refresh: mutate,
  }
}

export function useActiveEntry() {
  const { data, error, isLoading, mutate } = useSWR<TimeEntry | null>(
    "/api/entries/active",
    fetchActiveEntry,
    { refreshInterval: 1000 }
  )
  return {
    activeEntry: data ?? null,
    isLoading,
    error,
    refresh: mutate,
  }
}

export function useTaskNames() {
  const { data, error, isLoading } = useSWR<string[]>(
    "/api/entries/task-names",
    fetchTaskNames
  )
  return {
    taskNames: data ?? [],
    isLoading,
    error,
  }
}
