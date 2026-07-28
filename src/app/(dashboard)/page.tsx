'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { TaskFiltersBar } from '@/components/tasks/task-filters'
import { TaskFormDialog } from '@/components/tasks/task-form-dialog'
import { TaskList } from '@/components/tasks/task-list'
import { useProjects } from '@/hooks/use-projects'
import { useDeleteTask, useTasks } from '@/hooks/use-tasks'
import type { Task, TaskFilters } from '@/lib/api'

export default function TasksPage() {
  const [filters, setFilters] = useState<TaskFilters>({ sort: 'dueDate' })
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const debouncedFilters = useMemo(() => filters, [filters])

  const { data: projects = [] } = useProjects()
  const { data: tasks, isLoading, error, refetch } = useTasks(debouncedFilters)
  const deleteTask = useDeleteTask()

  const openCreateDialog = () => {
    setSelectedTask(null)
    setDialogOpen(true)
  }

  const openEditDialog = (task: Task) => {
    setSelectedTask(task)
    setDialogOpen(true)
  }

  const handleDelete = async (task: Task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return

    try {
      await deleteTask.mutateAsync(task.id)
      toast.success('Task deleted')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete task')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal tasks, filters, and priorities.
          </p>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="size-4" />
          New task
        </Button>
      </div>

      <TaskFiltersBar filters={filters} projects={projects} onChange={setFilters} />

      <TaskList
        tasks={tasks}
        loading={isLoading}
        error={error?.message ?? null}
        onEdit={openEditDialog}
        onDelete={handleDelete}
        onRetry={() => refetch()}
      />

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        projects={projects}
        task={selectedTask}
      />
    </div>
  )
}
