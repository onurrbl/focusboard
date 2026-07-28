import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createTaskSchema } from '@/lib/validators'
import type { TaskPriority, TaskStatus } from '@/lib/validators'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim()
    const status = searchParams.get('status') as TaskStatus | null
    const projectId = searchParams.get('projectId')
    const sort = searchParams.get('sort') ?? 'dueDate'

    const tasks = await prisma.task.findMany({
      where: {
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
        ...(status ? { status } : {}),
        ...(projectId ? { projectId } : {}),
      },
      include: { project: true },
      orderBy:
        sort === 'priority'
          ? [{ priority: 'desc' }, { dueDate: 'asc' }]
          : [{ dueDate: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('GET /api/tasks', error)
    return NextResponse.json({ message: 'Failed to load tasks' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const { dueDate, ...rest } = parsed.data

    const task = await prisma.task.create({
      data: {
        ...rest,
        dueDate: dueDate ? new Date(`${dueDate}T12:00:00.000Z`) : null,
      },
      include: { project: true },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('POST /api/tasks', error)
    return NextResponse.json({ message: 'Failed to create task' }, { status: 500 })
  }
}
