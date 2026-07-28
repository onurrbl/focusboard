'use client'

import { format, isPast, isToday } from 'date-fns'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Task } from '@/lib/api'
import {
  STATUS_BADGE_VARIANT,
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from '@/lib/constants'

type TaskListProps = {
  tasks: Task[] | undefined
  loading: boolean
  error: string | null
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onRetry: () => void
}

function DueDateCell({ dueDate, status }: { dueDate: string | null; status: Task['status'] }) {
  if (!dueDate) return <span className="text-muted-foreground">No date</span>

  const date = new Date(dueDate)
  const overdue = status !== 'DONE' && isPast(date) && !isToday(date)

  return (
    <span className={overdue ? 'font-medium text-destructive' : undefined}>
      {format(date, 'MMM d, yyyy')}
    </span>
  )
}

export function TaskList({ tasks, loading, error, onEdit, onDelete, onRetry }: TaskListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button className="mt-4" variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  }

  if (!tasks?.length) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">No tasks yet. Create your first task to get started.</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>
                <div className="font-medium">{task.title}</div>
                {task.description && (
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{task.description}</p>
                )}
              </TableCell>
              <TableCell>
                {task.project ? (
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: task.project.color }}
                    />
                    {task.project.name}
                  </div>
                ) : (
                  <span className="text-muted-foreground">None</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_BADGE_VARIANT[task.status]}>
                  {TASK_STATUS_LABELS[task.status]}
                </Badge>
              </TableCell>
              <TableCell>{TASK_PRIORITY_LABELS[task.priority]}</TableCell>
              <TableCell>
                <DueDateCell dueDate={task.dueDate} status={task.status} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon-sm" aria-label="Task actions" />}
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Pencil className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => onDelete(task)}>
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
