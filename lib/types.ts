export interface Project {
  id: string
  name: string
  color: string
  createdAt: string
  updatedAt: string
}

export interface TimeEntry {
  id: string
  taskName: string
  projectId: string | null
  project?: Project | null
  startTime: string
  endTime: string | null
  duration: number | null
  createdAt: string
  updatedAt: string
}

export interface CreateProjectInput {
  name: string
  color: string
}

export interface UpdateProjectInput {
  name?: string
  color?: string
}

export interface CreateTimeEntryInput {
  taskName: string
  projectId?: string | null
  startTime: string
  endTime?: string | null
  duration?: number | null
}

export interface UpdateTimeEntryInput {
  taskName?: string
  projectId?: string | null
  startTime?: string
  endTime?: string | null
  duration?: number | null
}

export interface TimeEntryGroup {
  project: Project | null
  entries: TimeEntry[]
  totalDuration: number
}

export type DateFilter = 'day' | 'week' | 'month'
