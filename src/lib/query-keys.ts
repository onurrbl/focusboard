export const queryKeys = {
  tasks: (filters?: Record<string, string | undefined>) => ['tasks', filters] as const,
  task: (id: string) => ['tasks', id] as const,
  projects: ['projects'] as const,
  stats: ['stats'] as const,
}
