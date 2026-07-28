'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { CreateProjectInput } from '@/lib/validators'

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: api.getProjects,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateProjectInput) => api.createProject(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects })
    },
  })
}
