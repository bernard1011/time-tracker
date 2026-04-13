"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ColorPicker } from "./ColorPicker"
import type { Project } from "@/lib/types"

interface ProjectFormProps {
  project?: Project
  onSubmit: (data: { name: string; color: string }) => Promise<void>
  onCancel: () => void
}

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [name, setName] = useState(project?.name ?? "")
  const [color, setColor] = useState(project?.color ?? "#3B82F6")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({ name: name.trim(), color })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Project Name
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter project name"
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Color</label>
        <ColorPicker value={color} onChange={setColor} />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim() || isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : project
              ? "Update Project"
              : "Create Project"}
        </Button>
      </div>
    </form>
  )
}
