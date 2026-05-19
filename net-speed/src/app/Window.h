#pragma once

#include <string>

#include "core/Config.h"
#include "monitor/NetworkMonitor.h"
#include "monitor/SpeedCalculator.h"
#include "ui/TrayIcon.h"
#include "ui/WidgetRenderer.h"

#include <windows.h>

class Window {
public:
    explicit Window(HINSTANCE instance);
    ~Window();

    bool Create(int showCommand);

private:
    static constexpr UINT_PTR kTimerId = 1001;
    static constexpr UINT kTimerIntervalMs = 1000;

    static LRESULT CALLBACK StaticWndProc(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam);
    LRESULT WndProc(UINT message, WPARAM wParam, LPARAM lParam);

    void OnPaint();
    void OnTimer();
    void OnCommand(UINT commandId);
    void TogglePaused();
    void ToggleCompact();
    void ToggleStartup();
    void ApplyModeSize();
    void SavePosition();
    void PositionDefault();
    void MoveHorizontally(int screenX);

    HINSTANCE instance_{};
    HWND hwnd_{};
    Config config_;
    NetworkMonitor monitor_;
    SpeedCalculator calculator_;
    WidgetRenderer renderer_;
    TrayIcon tray_;
    SpeedSample currentSpeed_{};
    bool paused_{false};
    bool horizontalDrag_{false};
    int dragOffsetX_{0};
};
