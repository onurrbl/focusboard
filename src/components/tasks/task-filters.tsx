'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Project, TaskFilters } from '@/lib/api'
import { TASK_STATUS_LABELS } from '@/lib/constants'
import type { TaskStatus } from '@/lib/validators'

type TaskFiltersBarProps = {
  filters: TaskFilters
  projects: Project[]
  onChange: (filters: TaskFilters) => void
}

export function TaskFiltersBar({ filters, projects, onChange }: TaskFiltersBarProps) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Input
        placeholder="Search tasks..."
        value={filters.search ?? ''}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
      />

      <Select
        value={filters.status || 'ALL'}
        onValueChange={(value) =>
          onChange({
            ...filters,
            status: value === 'ALL' ? '' : (value as TaskStatus),
          })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All statuses</SelectItem>
          {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((status) => (
            <SelectItem key={status} value={status}>
              {TASK_STATUS_LABELS[status]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.projectId || 'ALL'}
        onValueChange={(value) =>
          onChange({
            ...filters,
            projectId: value && value !== 'ALL' ? value : undefined,
          })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All projects</SelectItem>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.sort ?? 'dueDate'}
        onValueChange={(value) =>
          onChange({
            ...filters,
            sort: value as TaskFilters['sort'],
          })
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dueDate">Due date</SelectItem>
          <SelectItem value="priority">Priority</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
