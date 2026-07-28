'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useCreateTask, useUpdateTask } from '@/hooks/use-tasks'
import type { Project, Task } from '@/lib/api'
import { TASK_PRIORITY_LABELS, TASK_STATUS_LABELS } from '@/lib/constants'
import {
  createTaskSchema,
  type CreateTaskInput,
  type TaskPriority,
  type TaskStatus,
} from '@/lib/validators'

type TaskFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects: Project[]
  task?: Task | null
}

export function TaskFormDialog({ open, onOpenChange, projects, task }: TaskFormDialogProps) {
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const isEditing = Boolean(task)

  const form = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: null,
      projectId: null,
    },
  })

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description ?? '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : null,
        projectId: task.projectId,
      })
    } else {
      form.reset({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
        projectId: null,
      })
    }
  }, [task, form, open])

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (isEditing && task) {
        await updateTask.mutateAsync({ id: task.id, data: values })
        toast.success('Task updated')
      } else {
        await createTask.mutateAsync(values)
        toast.success('Task created')
      }
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    }
  })

  const pending = createTask.isPending || updateTask.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit task' : 'New task'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update task details below.' : 'Add a task to your board.'}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...form.register('title')} />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={3} {...form.register('description')} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.watch('status')}
                onValueChange={(value) => form.setValue('status', value as TaskStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TASK_STATUS_LABELS) as TaskStatus[]).map((status) => (
                    <SelectItem key={status} value={status}>
                      {TASK_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={form.watch('priority')}
                onValueChange={(value) => form.setValue('priority', value as TaskPriority)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TASK_PRIORITY_LABELS) as TaskPriority[]).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {TASK_PRIORITY_LABELS[priority]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due date</Label>
              <Input id="dueDate" type="date" {...form.register('dueDate')} />
            </div>

            <div className="space-y-2">
              <Label>Project</Label>
              <Select
                value={form.watch('projectId') ?? 'NONE'}
                onValueChange={(value) =>
                  form.setValue('projectId', value === 'NONE' ? null : value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="No project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">No project</SelectItem>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving...' : isEditing ? 'Save changes' : 'Create task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
