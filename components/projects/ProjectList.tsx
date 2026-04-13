"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, FolderKanban } from "lucide-react"
import { useProjects } from "@/hooks/useProjects"
import { ProjectCard } from "./ProjectCard"
import { ProjectForm } from "./ProjectForm"

export function ProjectList() {
  const { projects, isLoading, addProject, editProject, removeProject } =
    useProjects()
  const [isCreating, setIsCreating] = useState(false)

  const handleCreate = async (data: { name: string; color: string }) => {
    await addProject(data)
    setIsCreating(false)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your projects and organize your time
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Project Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="text-lg font-medium text-foreground">No projects yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first project to start organizing your time
          </p>
          <Button onClick={() => setIsCreating(true)} className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onUpdate={editProject}
              onDelete={removeProject}
            />
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            onSubmit={handleCreate}
            onCancel={() => setIsCreating(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
