import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

import { PrismaClient } from '../src/generated/prisma/client'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.task.deleteMany()
  await prisma.project.deleteMany()

  const [jobSearch, learning] = await Promise.all([
    prisma.project.create({
      data: { name: 'Job search', color: '#6366f1' },
    }),
    prisma.project.create({
      data: { name: 'Learning', color: '#10b981' },
    }),
  ])

  await prisma.task.createMany({
    data: [
      {
        title: 'Update portfolio README',
        description: 'Add screenshots and live demo links.',
        status: 'DOING',
        priority: 'HIGH',
        projectId: jobSearch.id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Complete FocusBoard dashboard',
        description: 'Build stats cards and filters.',
        status: 'TODO',
        priority: 'MEDIUM',
        projectId: learning.id,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Review TanStack Query docs',
        status: 'TODO',
        priority: 'LOW',
        projectId: learning.id,
      },
      {
        title: 'Ship filmlog improvements',
        status: 'DONE',
        priority: 'MEDIUM',
        projectId: jobSearch.id,
      },
    ],
  })

  console.log('Seed complete')
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
