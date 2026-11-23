import { useEffect, useState, useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { desktopWindow } from "@/services/window"
import {
  getWindowBehavior,
  setCloseToTray,
  type WindowBehavior,
} from "@/services/window-settings"

export function WindowBehaviorSettings() {
  const desktop = useSyncExternalStore(
    desktopWindow.subscribe,
    desktopWindow.isDesktop,
  )
  const [behavior, setBehavior] = useState<WindowBehavior>()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    if (!desktop) return
    let disposed = false
    void getWindowBehavior().then(
      (next) => {
        if (!disposed) setBehavior(next)
      },
      () => {
        if (!disposed) setError("无法读取窗口设置。请重试。")
      },
    )
    return () => {
      disposed = true
    }
  }, [desktop, retry])

  async function update(enabled: boolean) {
    if (!behavior?.traySupported || saving) return
    setSaving(true)
    setError("")
    try {
      await setCloseToTray(enabled)
      setBehavior({ ...behavior, closeToTray: enabled })
    } catch {
      setError("无法保存窗口设置。请重试。")
    } finally {
      setSaving(false)
    }
  }

  const description =
    !desktop || behavior?.traySupported === false
      ? "此选项可在 Windows 桌面版使用。"
      : "开启后，关闭窗口会将应用隐藏到系统托盘。点击托盘图标可恢复窗口，右键选择「退出」可结束应用。"

  return (
    <Card>
      <CardHeader>
        <CardTitle>窗口</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p id="close-to-tray-label" className="font-medium">
              关闭窗口时最小化到托盘
            </p>
            <p
              id="close-to-tray-description"
              className="mt-1 text-sm text-muted-foreground"
            >
              {description}
            </p>
          </div>
          <Switch
            aria-labelledby="close-to-tray-label"
            aria-describedby="close-to-tray-description"
            checked={behavior?.closeToTray ?? false}
            disabled={!desktop || !behavior?.traySupported || saving}
            onCheckedChange={(enabled) => void update(enabled)}
          />
        </div>
        {error && (
          <div className="flex flex-wrap items-center gap-2">
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
            {!behavior && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setError("")
                  setRetry((value) => value + 1)
                }}
              >
                重新读取
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
