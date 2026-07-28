import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createProjectSchema } from '@/lib/validators'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { tasks: true } } },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error('GET /api/projects', error)
    return NextResponse.json({ message: 'Failed to load projects' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createProjectSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.errors[0]?.message ?? 'Invalid input' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({ data: parsed.data })
    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('POST /api/projects', error)
    return NextResponse.json({ message: 'Failed to create project' }, { status: 500 })
  }
}
