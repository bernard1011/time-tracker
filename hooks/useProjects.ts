"use client"

import useSWR from "swr"
import type { Project, CreateProjectInput, UpdateProjectInput } from "@/lib/types"
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/api/projects"

export function useProjects() {
  const { data, error, isLoading, mutate } = useSWR<Project[]>(
    "/api/projects",
    fetchProjects
  )

  const addProject = async (input: CreateProjectInput) => {
    const newProject = await createProject(input)
    mutate()
    return newProject
  }

  const editProject = async (id: string, input: UpdateProjectInput) => {
    const updated = await updateProject(id, input)
    mutate()
    return updated
  }

  const removeProject = async (id: string) => {
    await deleteProject(id)
    mutate()
  }

  return {
    projects: data ?? [],
    isLoading,
    error,
    addProject,
    editProject,
    removeProject,
    refresh: mutate,
  }
}
