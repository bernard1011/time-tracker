"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Pencil, Trash2, Check, X } from "lucide-react"
import type { TimeEntry, Project } from "@/lib/types"
import {
  formatDurationForInput,
  parseDurationInput,
} from "@/lib/utils/time"

interface TimeEntryItemProps {
  entry: TimeEntry
  projects: Project[]
  onUpdate: (
    id: string,
    data: { taskName?: string; projectId?: string | null; duration?: number }
  ) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function TimeEntryItem({
  entry,
  projects,
  onUpdate,
  onDelete,
}: TimeEntryItemProps) {
  const isActive = !entry.endTime

  const [isEditing, setIsEditing] = useState(false)
  const [taskName, setTaskName] = useState(entry.taskName)
  const [projectId, setProjectId] = useState(entry.projectId ?? "none")
  const [durationInput, setDurationInput] = useState(
    formatDurationForInput(entry.duration ?? 0)
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [liveDuration, setLiveDuration] = useState(() =>
    isActive
      ? Math.floor((Date.now() - new Date(entry.startTime).getTime()) / 1000)
      : (entry.duration ?? 0)
  )

  // Live update for active entry
  useEffect(() => {
    if (!isActive) {
      setLiveDuration(entry.duration ?? 0)
      return
    }
    const interval = setInterval(() => {
      setLiveDuration(
        Math.floor((Date.now() - new Date(entry.startTime).getTime()) / 1000)
      )
    }, 1000)
    return () => clearInterval(interval)
  }, [isActive, entry.startTime, entry.duration])

  const handleSave = async () => {
    const duration = parseDurationInput(durationInput)
    if (duration === null) {
      alert("Invalid duration format. Use hh:mm")
      return
    }
    await onUpdate(entry.id, {
      taskName,
      projectId: projectId === "none" ? null : projectId,
      duration,
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTaskName(entry.taskName)
    setProjectId(entry.projectId ?? "none")
    setDurationInput(formatDurationForInput(entry.duration ?? 0))
    setIsEditing(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(entry.id)
  }

  const startTime = new Date(entry.startTime)
  const endTime = entry.endTime ? new Date(entry.endTime) : null

  const formatTimeOnly = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Task name"
            className="flex-1"
          />
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Project</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span>{p.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={durationInput}
            onChange={(e) => setDurationInput(e.target.value)}
            placeholder="hh:mm"
            className="w-full sm:w-24 font-mono"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Check className="mr-1 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-center gap-4 rounded-lg border border-transparent px-4 py-3 transition-colors hover:border-border hover:bg-muted/50">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{entry.taskName}</p>
        <p className="text-sm text-muted-foreground">
          {formatTimeOnly(startTime)}
          {endTime && ` - ${formatTimeOnly(endTime)}`}
          {isActive && " · running"}
        </p>
      </div>

      <div className="font-mono text-sm tabular-nums" style={{ color: isActive ? "var(--primary)" : undefined }}>
        {formatDurationForInput(liveDuration)}
      </div>

      <div className="flex gap-1 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8"
          disabled={isActive}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleDelete}
          disabled={isDeleting || isActive}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
