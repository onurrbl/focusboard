import { z } from 'zod'

export const taskStatusSchema = z.enum(['TODO', 'DOING', 'DONE'])
export const taskPrioritySchema = z.enum(['LOW', 'MEDIUM', 'HIGH'])

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(120),
  description: z.string().trim().max(2000).optional(),
  status: taskStatusSchema.default('TODO'),
  priority: taskPrioritySchema.default('MEDIUM'),
  dueDate: z.string().optional().nullable(),
  projectId: z.string().cuid().optional().nullable(),
})

export const updateTaskSchema = createTaskSchema.partial()

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(80),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#6366f1'),
})

export type CreateTaskInput = z.input<typeof createTaskSchema>
export type CreateTaskOutput = z.output<typeof createTaskSchema>
export type UpdateTaskInput = z.input<typeof updateTaskSchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>

export type TaskStatus = z.infer<typeof taskStatusSchema>
export type TaskPriority = z.infer<typeof taskPrioritySchema>
