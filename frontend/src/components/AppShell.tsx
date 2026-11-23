import { useRef, useState, type ReactNode } from "react"
import {
  Layers,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react"
import { NavLink } from "react-router"
import { Button } from "@/components/ui/button"
import { WindowControls } from "@/components/WindowControls"
import { cn } from "@/lib/utils"

type NavigationItem = { to: string; label: string; icon: LucideIcon }

export function AppShell({
  title,
  navigation,
  children,
}: {
  title: string
  navigation: readonly NavigationItem[]
  children: ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const main = useRef<HTMLElement>(null)
  const sidebarAction = collapsed ? "展开侧栏" : "折叠侧栏"
  const SidebarIcon = collapsed ? PanelLeftOpen : PanelLeftClose

  return (
    <div className="flex h-full min-w-0 overflow-hidden bg-background">
      <Button
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-2 focus-visible:z-10"
        onClick={() => main.current?.focus()}
      >
        跳到内容
      </Button>
      <aside
        className={cn(
          "flex shrink-0 flex-col gap-3 overflow-hidden border-r border-sidebar-border bg-sidebar px-2 py-2 text-sidebar-foreground",
          collapsed ? "w-14" : "w-48",
        )}
      >
        <div className="flex h-8 items-center gap-2 pl-1">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Layers aria-hidden="true" className="size-4" />
          </span>
          {!collapsed && (
            <span className="truncate text-sm font-semibold">
              Desktop Template
            </span>
          )}
        </div>
        <nav
          id="app-navigation"
          aria-label="主导航"
          className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto"
        >
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              aria-label={label}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                cn(
                  "flex h-9 shrink-0 items-center gap-2.5 rounded-md px-3 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-inset focus-visible:outline-none",
                  isActive &&
                    "bg-sidebar-accent font-medium text-sidebar-accent-foreground",
                )
              }
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>
        <Button
          variant="ghost"
          aria-controls="app-navigation"
          aria-expanded={!collapsed}
          aria-label={sidebarAction}
          title={sidebarAction}
          className="justify-start px-3"
          onClick={() => setCollapsed(!collapsed)}
        >
          <SidebarIcon data-icon="inline-start" />
          {!collapsed && <span>{sidebarAction}</span>}
        </Button>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="window-titlebar flex h-11 shrink-0 items-center justify-between gap-3 border-b px-4 select-none">
          <h1 id="page-title" className="truncate text-sm font-semibold">
            {title}
          </h1>
          <WindowControls />
        </header>
        <main
          ref={main}
          id="main-content"
          tabIndex={-1}
          aria-labelledby="page-title"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:p-6"
        >
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
