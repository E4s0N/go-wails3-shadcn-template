package main

import (
	"encoding/json"
	"errors"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"sync"
)

type WindowBehavior struct {
	CloseToTray   bool `json:"closeToTray"`
	TraySupported bool `json:"traySupported"`
}

type WindowSettings struct {
	mu          sync.RWMutex
	path        string
	closeToTray bool
}

func loadWindowSettings() *WindowSettings {
	settings := &WindowSettings{}
	dir, err := os.UserConfigDir()
	if err != nil {
		log.Printf("locate window settings: %v", err)
		return settings
	}
	settings.path = filepath.Join(dir, appID, "window-settings.json")
	content, err := os.ReadFile(settings.path)
	if errors.Is(err, os.ErrNotExist) {
		return settings
	}
	if err != nil {
		log.Printf("read window settings: %v", err)
		return settings
	}
	var saved struct {
		CloseToTray bool `json:"closeToTray"`
	}
	if err := json.Unmarshal(content, &saved); err != nil {
		log.Printf("parse window settings: %v", err)
		return settings
	}
	settings.closeToTray = saved.CloseToTray
	return settings
}

func (s *WindowSettings) GetWindowBehavior() WindowBehavior {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return WindowBehavior{
		CloseToTray:   s.closeToTray,
		TraySupported: runtime.GOOS == "windows",
	}
}

func (s *WindowSettings) SetCloseToTray(enabled bool) error {
	if runtime.GOOS != "windows" {
		return errors.New("the system tray setting is available on Windows")
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.closeToTray == enabled {
		return nil
	}
	if s.path == "" {
		return errors.New("window settings directory is unavailable")
	}
	dir := filepath.Dir(s.path)
	if err := os.MkdirAll(dir, 0o700); err != nil {
		return err
	}
	file, err := os.CreateTemp(dir, ".window-settings-*")
	if err != nil {
		return err
	}
	defer os.Remove(file.Name())
	payload := struct {
		CloseToTray bool `json:"closeToTray"`
	}{enabled}
	writeErr := json.NewEncoder(file).Encode(payload)
	closeErr := file.Close()
	if err := errors.Join(writeErr, closeErr); err != nil {
		return err
	}
	if err := os.Rename(file.Name(), s.path); err != nil {
		return err
	}
	s.closeToTray = enabled
	return nil
}
