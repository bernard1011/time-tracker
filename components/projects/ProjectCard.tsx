"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2 } from "lucide-react"
import { ProjectForm } from "./ProjectForm"
import type { Project } from "@/lib/types"

interface ProjectCardProps {
  project: Project
  onUpdate: (id: string, data: { name: string; color: string }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export function ProjectCard({ project, onUpdate, onDelete }: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const handleUpdate = async (data: { name: string; color: string }) => {
    await onUpdate(project.id, data)
    setIsEditing(false)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(project.id)
    } finally {
      setIsDeleting(false)
      setIsConfirmOpen(false)
    }
  }

  return (
    <>
      <Card className="group relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ backgroundColor: project.color }}
        />
        <CardContent className="flex items-center justify-between p-4 pt-5">
          <div className="flex items-center gap-3">
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <span className="font-medium text-foreground">{project.name}</span>
          </div>

          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsConfirmOpen(true)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <ProjectForm
            project={project}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{project.name}&quot;? This
              action cannot be undone. Time entries for this project will be
              kept but will no longer be associated with any project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
