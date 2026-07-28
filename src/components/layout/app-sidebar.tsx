import Link from 'next/link'
import { LayoutDashboard, ListTodo } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Tasks', icon: ListTodo },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

type AppSidebarProps = {
  pathname: string
}

export function AppSidebar({ pathname }: AppSidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r bg-muted/30">
      <div className="border-b px-6 py-5">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          FocusBoard
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">Personal task manager</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
