import type { TaskPriority, TaskStatus } from '@/lib/validators'

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'To do',
  DOING: 'In progress',
  DONE: 'Done',
}

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
}

export const STATUS_BADGE_VARIANT: Record<TaskStatus, 'default' | 'secondary' | 'outline'> = {
  TODO: 'outline',
  DOING: 'secondary',
  DONE: 'default',
}
