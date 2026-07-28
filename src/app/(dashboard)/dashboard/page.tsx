'use client'

import { StatsCards } from '@/components/dashboard/stats-cards'
import { useStats } from '@/hooks/use-stats'

export default function DashboardPage() {
  const { data: stats, isLoading, error, refetch } = useStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of open work, overdue items, and weekly progress.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-dashed p-6 text-sm text-destructive">
          {error.message}
          <button className="ml-3 underline" type="button" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      )}

      <StatsCards stats={stats} loading={isLoading} />
    </div>
  )
}
