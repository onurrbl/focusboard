'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type TaskFilters } from '@/lib/api'
import { queryKeys } from '@/lib/query-keys'
import type { CreateTaskInput, UpdateTaskInput } from '@/lib/validators'

export function useTasks(filters: TaskFilters) {
  return useQuery({
    queryKey: queryKeys.tasks(filters),
    queryFn: () => api.getTasks(filters),
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTaskInput) => api.createTask(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskInput }) =>
      api.updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: queryKeys.stats })
    },
  })
}
