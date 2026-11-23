import { LayoutGrid } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function WorkspacePage() {
  return (
    <Card className="min-h-64 justify-center">
      <CardHeader className="justify-items-center text-center">
        <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <LayoutGrid aria-hidden="true" className="size-5" />
        </span>
        <CardTitle>暂无内容</CardTitle>
        <CardDescription>在工作区添加你的应用页面。</CardDescription>
      </CardHeader>
      <CardContent className="text-center text-xs text-muted-foreground">
        frontend/src/pages
      </CardContent>
    </Card>
  )
}
