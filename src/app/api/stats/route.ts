import { NextResponse } from 'next/server'
import { endOfWeek, startOfWeek } from 'date-fns'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

    const [totalOpen, overdue, completedThisWeek, byStatus] = await Promise.all([
      prisma.task.count({ where: { status: { not: 'DONE' } } }),
      prisma.task.count({
        where: {
          status: { not: 'DONE' },
          dueDate: { lt: now },
        },
      }),
      prisma.task.count({
        where: {
          status: 'DONE',
          updatedAt: { gte: weekStart, lte: weekEnd },
        },
      }),
      prisma.task.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
    ])

    return NextResponse.json({
      totalOpen,
      overdue,
      completedThisWeek,
      byStatus: byStatus.map((item) => ({
        status: item.status,
        count: item._count._all,
      })),
    })
  } catch (error) {
    console.error('GET /api/stats', error)
    return NextResponse.json({ message: 'Failed to load stats' }, { status: 500 })
  }
}
