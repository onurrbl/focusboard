import type { TaskPriority, TaskStatus } from '@/lib/validators'

export type Project = {
  id: string
  name: string
  color: string
  createdAt: string
  updatedAt: string
  _count?: { tasks: number }
}

export type Task = {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  projectId: string | null
  project: Project | null
  createdAt: string
  updatedAt: string
}

export type TaskFilters = {
  search?: string
  status?: TaskStatus | ''
  projectId?: string
  sort?: 'dueDate' | 'priority'
}

export type DashboardStats = {
  totalOpen: number
  overdue: number
  completedThisWeek: number
  byStatus: { status: TaskStatus; count: number }[]
}

async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message ?? 'Request failed')
  }
  return data as T
}

function buildTaskQuery(filters: TaskFilters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.status) params.set('status', filters.status)
  if (filters.projectId) params.set('projectId', filters.projectId)
  if (filters.sort) params.set('sort', filters.sort)
  const query = params.toString()
  return query ? `?${query}` : ''
}

export const api = {
  getTasks: (filters?: TaskFilters) =>
    fetch(`/api/tasks${buildTaskQuery(filters)}`).then((res) => parseJson<Task[]>(res)),
  createTask: (payload: unknown) =>
    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<Task>(res)),
  updateTask: (id: string, payload: unknown) =>
    fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<Task>(res)),
  deleteTask: (id: string) =>
    fetch(`/api/tasks/${id}`, { method: 'DELETE' }).then((res) => parseJson<{ success: boolean }>(res)),
  getProjects: () => fetch('/api/projects').then((res) => parseJson<Project[]>(res)),
  createProject: (payload: unknown) =>
    fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((res) => parseJson<Project>(res)),
  getStats: () => fetch('/api/stats').then((res) => parseJson<DashboardStats>(res)),
}
