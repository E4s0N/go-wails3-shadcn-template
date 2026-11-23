import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/ThemeProvider"
import { WindowBehaviorSettings } from "@/components/WindowBehaviorSettings"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const themes = [
  { value: "system", label: "跟随系统", icon: Monitor },
  { value: "light", label: "浅色", icon: Sun },
  { value: "dark", label: "深色", icon: Moon },
] as const

export function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>外观</CardTitle>
          <CardDescription>选择应用的颜色主题。</CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleGroup
            aria-label="颜色主题"
            variant="outline"
            value={[theme]}
            onValueChange={([value]) => {
              const next = themes.find((option) => option.value === value)
              if (next) setTheme(next.value)
            }}
          >
            {themes.map(({ value, label, icon: Icon }) => (
              <ToggleGroupItem key={value} value={value}>
                <Icon data-icon="inline-start" />
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </CardContent>
      </Card>
      <WindowBehaviorSettings />
    </div>
  )
}
