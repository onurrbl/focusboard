import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { updateTaskSchema } from '@/lib/validators'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const parsed = updateTaskSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const { dueDate, ...rest } = parsed.data

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...rest,
        ...(dueDate !== undefined
          ? { dueDate: dueDate ? new Date(`${dueDate}T12:00:00.000Z`) : null }
          : {}),
      },
      include: { project: true },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error('PATCH /api/tasks/[id]', error)
    return NextResponse.json({ message: 'Failed to update task' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/tasks/[id]', error)
    return NextResponse.json({ message: 'Failed to delete task' }, { status: 500 })
  }
}
