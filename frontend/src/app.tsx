import { LayoutGrid, Settings2 } from "lucide-react"
import { Navigate, Route, Routes, useLocation } from "react-router"
import { AppShell } from "@/components/AppShell"
import { SettingsPage } from "@/pages/SettingsPage"
import { WorkspacePage } from "@/pages/WorkspacePage"

const pages = [
  { to: "/", label: "工作区", icon: LayoutGrid, element: <WorkspacePage /> },
  {
    to: "/settings",
    label: "设置",
    icon: Settings2,
    element: <SettingsPage />,
  },
]

export function App() {
  const { pathname } = useLocation()
  const page = pages.find(({ to }) => to === pathname) ?? pages[0]

  return (
    <AppShell title={page.label} navigation={pages}>
      <Routes>
        {pages.map(({ to, element }) => (
          <Route key={to} path={to} element={element} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}
