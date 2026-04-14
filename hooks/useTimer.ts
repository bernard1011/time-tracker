"use client"

import { useState, useEffect, useCallback } from "react"
import { useActiveEntry, useEntries } from "./useEntries"
import { createEntry, stopEntry } from "@/lib/api/entries"

export function useTimer() {
  const { activeEntry, refresh: refreshActive } = useActiveEntry()
  const { refresh: refreshEntries } = useEntries()
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const isRunning = !!activeEntry

  useEffect(() => {
    if (!activeEntry) {
      setElapsedSeconds(0)
      return
    }

    const tick = () => {
      const startTime = new Date(activeEntry.startTime).getTime()
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000))
    }

    tick() // immediate update on mount / return from background
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [activeEntry])

  const start = useCallback(
    async (taskName: string, projectId?: string | null) => {
      if (!taskName.trim()) return
      await createEntry({
        taskName: taskName.trim(),
        projectId: projectId || null,
        startTime: new Date().toISOString(),
      })
      refreshActive()
      refreshEntries()
    },
    [refreshActive, refreshEntries]
  )

  const stop = useCallback(async () => {
    if (!activeEntry) return
    const endTime = new Date()
    const duration = Math.floor(
      (endTime.getTime() - new Date(activeEntry.startTime).getTime()) / 1000
    )
    await stopEntry(activeEntry.id, endTime.toISOString(), duration)
    refreshActive()
    refreshEntries()
  }, [activeEntry, refreshActive, refreshEntries])

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  return {
    isRunning,
    elapsedSeconds,
    formattedTime: formatTime(elapsedSeconds),
    activeEntry,
    start,
    stop,
    formatTime,
  }
}
