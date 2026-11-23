# Go Wails 3 · shadcn 桌面模板

一个由 Wails 3、React、TypeScript、Vite、Tailwind CSS 4 和 shadcn/ui（Base UI）组成的桌面应用起点。应用壳包含可折叠侧栏、自定义标题栏、滚动内容区和浅色、深色及跟随系统主题。

## Windows 开发

需要 Go 1.26 或更新版本、Node.js 24、npm、WebView2 Runtime 和 Wails 3 CLI。

```powershell
wails3 task dev
```

开发模式会安装前端依赖、启动 Vite，并打开 Wails 桌面窗口。只预览前端布局时，可运行以下命令，然后打开 http://127.0.0.1:9250。

```powershell
npm --prefix frontend ci
npm --prefix frontend run dev
```

## 关闭到托盘

在 Windows 桌面版的「设置 → 窗口」开启「关闭窗口时最小化到托盘」。选项默认关闭，修改会保存到当前用户的应用配置目录。开启后点击右上角关闭按钮会隐藏窗口，点击托盘图标或再次启动程序可恢复窗口。托盘菜单的「退出」会结束进程。

## 构建与检查

```powershell
wails3 task check
wails3 build
.\bin\go-wails3-shadcn-template.exe
```

也可直接使用 Go 构建。先构建前端，供 Go 将 `frontend/dist` 嵌入可执行文件。

```powershell
npm --prefix frontend ci
npm --prefix frontend run build
go build -tags production -trimpath -ldflags="-H windowsgui" -o bin/go-wails3-shadcn-template.exe .
```

## 扩展位置

- `main.go` 创建原生窗口并嵌入前端资源。从这里注册自己的 Wails 服务。
- 用模板创建新应用时，请同步修改 `main.go` 的 `appID` 与 `build/config.yml` 的 `productIdentifier`，给新应用独立的配置目录和单实例标识。
- `window_settings.go` 保存窗口偏好。修改绑定方法后运行 `wails3 task bindings`。
- `frontend/src/app.tsx` 维护路由与侧栏入口。页面组件放在 `frontend/src/pages`。
- `frontend/src/components/AppShell.tsx` 是共享的窗口布局。`frontend/src/index.css` 定义主题变量。
- `frontend/components.json` 配置 shadcn CLI。在 `frontend` 内运行 `npx shadcn@latest add <component>` 添加组件。
