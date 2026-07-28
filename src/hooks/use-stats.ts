'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'

export function useStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: api.getStats,
  })
}
