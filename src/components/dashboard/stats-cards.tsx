'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { DashboardStats } from '@/lib/api'
import { TASK_STATUS_LABELS } from '@/lib/constants'
import type { TaskStatus } from '@/lib/validators'

type StatsCardsProps = {
  stats: DashboardStats | undefined
  loading: boolean
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
    )
  }

  const cards = [
    { title: 'Open tasks', value: stats?.totalOpen ?? 0 },
    { title: 'Overdue', value: stats?.overdue ?? 0 },
    { title: 'Completed this week', value: stats?.completedThisWeek ?? 0 },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{card.value}</div>
          </CardContent>
        </Card>
      ))}

      <Card className="md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Tasks by status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {(stats?.byStatus ?? []).map((item) => (
            <div
              key={item.status}
              className="rounded-lg border px-4 py-3 text-sm"
            >
              <div className="text-muted-foreground">
                {TASK_STATUS_LABELS[item.status as TaskStatus]}
              </div>
              <div className="mt-1 text-2xl font-semibold">{item.count}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
