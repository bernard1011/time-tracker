"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Play, Square } from "lucide-react"
import { useTimer } from "@/hooks/useTimer"
import { useProjects } from "@/hooks/useProjects"
import { useTaskNames } from "@/hooks/useEntries"
import { cn } from "@/lib/utils"

export function ActiveTimer() {
  const { isRunning, formattedTime, activeEntry, start, stop } = useTimer()
  const { projects } = useProjects()
  const { taskNames } = useTaskNames()

  const [taskName, setTaskName] = useState("")
  const [projectId, setProjectId] = useState<string>("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Sync form with active entry
  useEffect(() => {
    if (activeEntry) {
      setTaskName(activeEntry.taskName)
      setProjectId(activeEntry.projectId ?? "")
    }
  }, [activeEntry])

  // Filter suggestions
  const filteredSuggestions = taskNames.filter(
    (name) =>
      name.toLowerCase().includes(taskName.toLowerCase()) && name !== taskName
  )

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleStart = async () => {
    if (!taskName.trim()) return
    await start(taskName, projectId || null)
  }

  const handleStop = async () => {
    await stop()
    setTaskName("")
    setProjectId("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isRunning && taskName.trim()) {
      handleStart()
    }
  }

  const selectedProject = projects.find((p) => p.id === projectId)

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        {/* Task Input with Autocomplete */}
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="What are you working on?"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            disabled={isRunning}
            className="h-12 text-base"
          />

          {/* Autocomplete Suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && !isRunning && (
            <div
              ref={suggestionsRef}
              className="absolute top-full left-0 z-50 mt-1 w-full rounded-lg border border-border bg-popover shadow-lg"
            >
              {filteredSuggestions.slice(0, 5).map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                  onClick={() => {
                    setTaskName(suggestion)
                    setShowSuggestions(false)
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project Selector */}
        <Select
          value={projectId}
          onValueChange={setProjectId}
          disabled={isRunning}
        >
          <SelectTrigger className="h-12 w-full lg:w-48">
            <SelectValue placeholder="Select project">
              {selectedProject && (
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: selectedProject.color }}
                  />
                  <span>{selectedProject.name}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Project</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span>{project.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Timer Display */}
        <div
          className={cn(
            "text-center font-mono text-3xl font-bold tabular-nums lg:w-36",
            isRunning ? "text-primary" : "text-muted-foreground"
          )}
        >
          {formattedTime}
        </div>

        {/* Start/Stop Button */}
        {isRunning ? (
          <Button
            onClick={handleStop}
            size="lg"
            variant="destructive"
            className="h-12 w-full lg:w-auto"
          >
            <Square className="mr-2 h-4 w-4" />
            Stop
          </Button>
        ) : (
          <Button
            onClick={handleStart}
            size="lg"
            disabled={!taskName.trim()}
            className="h-12 w-full lg:w-auto"
          >
            <Play className="mr-2 h-4 w-4" />
            Start
          </Button>
        )}
      </div>
    </div>
  )
}
