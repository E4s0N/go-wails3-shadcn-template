import { useSyncExternalStore } from "react"
import { Minus, Square, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { desktopWindow } from "@/services/window"

export function WindowControls() {
  const desktop = useSyncExternalStore(
    desktopWindow.subscribe,
    desktopWindow.isDesktop,
  )
  if (!desktop) return null

  return (
    <div className="flex h-full shrink-0">
      {[
        { label: "最小化", icon: Minus, action: desktopWindow.minimise },
        {
          label: "最大化或还原",
          icon: Square,
          action: desktopWindow.toggleMaximise,
        },
        { label: "关闭", icon: X, action: desktopWindow.close },
      ].map(({ label, icon: Icon, action }) => (
        <Button
          key={label}
          variant="ghost"
          size="icon"
          className="h-full w-10 rounded-none"
          aria-label={label}
          title={label}
          onClick={action}
        >
          <Icon aria-hidden="true" />
        </Button>
      ))}
    </div>
  )
}
