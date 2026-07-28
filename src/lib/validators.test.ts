import { describe, expect, it } from 'vitest'
import { createTaskSchema } from '@/lib/validators'

describe('createTaskSchema', () => {
  it('requires a title', () => {
    const result = createTaskSchema.safeParse({ title: '   ' })
    expect(result.success).toBe(false)
  })

  it('accepts a valid task payload', () => {
    const result = createTaskSchema.safeParse({
      title: 'Write tests',
      status: 'TODO',
      priority: 'HIGH',
    })

    expect(result.success).toBe(true)
  })

  it('rejects overly long titles', () => {
    const result = createTaskSchema.safeParse({
      title: 'x'.repeat(121),
    })

    expect(result.success).toBe(false)
  })
})
