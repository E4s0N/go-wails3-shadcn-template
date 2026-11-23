package main

import (
	"embed"
	"log"
	"runtime"
	"sync/atomic"

	"github.com/wailsapp/wails/v3/pkg/application"
	"github.com/wailsapp/wails/v3/pkg/events"
)

//go:embed all:frontend/dist
var assets embed.FS

const (
	appName = "Desktop Template"
	appID   = "app.desktop.template"
)

func main() {
	settings := loadWindowSettings()
	var mainWindow atomic.Pointer[application.WebviewWindow]
	restoreWindow := func() {
		if window := mainWindow.Load(); window != nil {
			window.Show()
			window.UnMinimise()
			window.Focus()
		}
	}
	options := application.Options{
		Name: appName,
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
		Services: []application.Service{application.NewService(settings)},
	}
	if runtime.GOOS == "windows" {
		options.SingleInstance = &application.SingleInstanceOptions{
			UniqueID: appID,
			OnSecondInstanceLaunch: func(application.SecondInstanceData) {
				restoreWindow()
			},
		}
	}
	app := application.New(options)

	window := app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:            appName,
		URL:              "/",
		Width:            1080,
		Height:           720,
		MinWidth:         600,
		MinHeight:        420,
		Frameless:        true,
		BackgroundColour: application.NewRGB(250, 250, 250),
	})
	mainWindow.Store(window)
	if runtime.GOOS == "windows" {
		tray := app.SystemTray.New()
		tray.SetTooltip(appName)
		menu := app.NewMenu()
		menu.Add("恢复窗口").OnClick(func(*application.Context) { restoreWindow() })
		menu.Add("退出").OnClick(func(*application.Context) { app.Quit() })
		tray.SetMenu(menu)
		tray.OnClick(restoreWindow)
		tray.OnDoubleClick(restoreWindow)

		window.RegisterHook(events.Common.WindowClosing, func(event *application.WindowEvent) {
			if settings.GetWindowBehavior().CloseToTray {
				event.Cancel()
				window.Hide()
			}
		})
	}

	if err := app.Run(); err != nil {
		log.Fatal(err)
	}
}
