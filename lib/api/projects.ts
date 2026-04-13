import type { Project, CreateProjectInput, UpdateProjectInput } from "@/lib/types"

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/api/projects")
  if (!res.ok) throw new Error("Failed to fetch projects")
  return res.json()
}

export async function fetchProject(id: string): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`)
  if (!res.ok) throw new Error("Failed to fetch project")
  return res.json()
}

export async function createProject(data: CreateProjectInput): Promise<Project> {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create project")
  return res.json()
}

export async function updateProject(
  id: string,
  data: UpdateProjectInput
): Promise<Project> {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to update project")
  return res.json()
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Failed to delete project")
}
