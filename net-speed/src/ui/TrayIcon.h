#pragma once

#include "monitor/SpeedCalculator.h"

#include <windows.h>
#include <shellapi.h>

class TrayIcon {
public:
    static constexpr UINT kCallbackMessage = WM_APP + 42;

    enum Command : UINT {
        CommandPauseResume = 40001,
        CommandToggleStartup = 40002,
        CommandToggleCompact = 40003,
        CommandExit = 40004
    };

    explicit TrayIcon(HINSTANCE instance);
    ~TrayIcon();

    bool Add(HWND hwnd, bool paused, bool startupEnabled, bool compact);
    void Update(HWND hwnd, bool paused, bool startupEnabled, bool compact);
    void Update(HWND hwnd, bool paused, bool startupEnabled, bool compact, const SpeedSample& speed);
    void Remove();
    void ShowMenu(HWND hwnd, bool paused, bool startupEnabled, bool compact) const;

private:
    void FillData(HWND hwnd, bool paused, bool startupEnabled, bool compact, const SpeedSample* speed);

    HINSTANCE instance_{};
    NOTIFYICONDATAW data_{};
    bool added_{false};
};
