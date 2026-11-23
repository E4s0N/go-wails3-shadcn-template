import { System, Window } from "@wailsio/runtime"

export const desktopWindow = {
  isDesktop: () => System.IsDesktop(),
  subscribe(onChange: () => void) {
    window.addEventListener("wails:runtime-config-ready", onChange)
    return () =>
      window.removeEventListener("wails:runtime-config-ready", onChange)
  },
  minimise: () => void Window.Minimise().catch(console.error),
  toggleMaximise: () => void Window.ToggleMaximise().catch(console.error),
  close: () => void Window.Close().catch(console.error),
}
