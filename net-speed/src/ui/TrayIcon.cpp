#include "ui/TrayIcon.h"

#include "utils/Formatter.h"

#include <cwchar>

#include <string>

namespace {
constexpr UINT kTrayId = 1;

void AppendMenuItem(HMENU menu, UINT id, const wchar_t* text, bool checked = false)
{
    MENUITEMINFOW item{};
    item.cbSize = sizeof(item);
    item.fMask = MIIM_ID | MIIM_STRING | MIIM_STATE;
    item.wID = id;
    item.dwTypeData = const_cast<wchar_t*>(text);
    item.fState = checked ? MFS_CHECKED : MFS_UNCHECKED;
    InsertMenuItemW(menu, GetMenuItemCount(menu), TRUE, &item);
}
}

TrayIcon::TrayIcon(HINSTANCE instance)
    : instance_(instance)
{
}

TrayIcon::~TrayIcon()
{
    Remove();
}

bool TrayIcon::Add(HWND hwnd, bool paused, bool startupEnabled, bool compact)
{
    FillData(hwnd, paused, startupEnabled, compact, nullptr);
    added_ = Shell_NotifyIconW(NIM_ADD, &data_) == TRUE;
    if (added_) {
        data_.uVersion = NOTIFYICON_VERSION_4;
        Shell_NotifyIconW(NIM_SETVERSION, &data_);
    }
    return added_;
}

void TrayIcon::Update(HWND hwnd, bool paused, bool startupEnabled, bool compact)
{
    Update(hwnd, paused, startupEnabled, compact, {});
}

void TrayIcon::Update(HWND hwnd, bool paused, bool startupEnabled, bool compact, const SpeedSample& speed)
{
    if (!added_) {
        return;
    }

    FillData(hwnd, paused, startupEnabled, compact, &speed);
    Shell_NotifyIconW(NIM_MODIFY, &data_);
}

void TrayIcon::Remove()
{
    if (added_) {
        Shell_NotifyIconW(NIM_DELETE, &data_);
        added_ = false;
    }
}

void TrayIcon::ShowMenu(HWND hwnd, bool paused, bool startupEnabled, bool compact) const
{
    HMENU menu = CreatePopupMenu();
    if (!menu) {
        return;
    }

    AppendMenuItem(menu, CommandPauseResume, paused ? L"Resume monitoring" : L"Pause monitoring");
    AppendMenuItem(menu, CommandToggleCompact, compact ? L"Expanded mode" : L"Compact mode", compact);
    AppendMenuItem(menu, CommandToggleStartup, L"Start with Windows", startupEnabled);
    AppendMenuW(menu, MF_SEPARATOR, 0, nullptr);
    AppendMenuItem(menu, CommandExit, L"Exit");

    POINT point{};
    GetCursorPos(&point);
    SetForegroundWindow(hwnd);
    TrackPopupMenu(menu, TPM_RIGHTBUTTON | TPM_BOTTOMALIGN | TPM_LEFTALIGN, point.x, point.y, 0, hwnd, nullptr);
    DestroyMenu(menu);
}

void TrayIcon::FillData(HWND hwnd, bool paused, bool, bool, const SpeedSample* speed)
{
    ZeroMemory(&data_, sizeof(data_));
    data_.cbSize = sizeof(data_);
    data_.hWnd = hwnd;
    data_.uID = kTrayId;
    data_.uFlags = NIF_MESSAGE | NIF_ICON | NIF_TIP;
    data_.uCallbackMessage = kCallbackMessage;
    data_.hIcon = LoadIconW(nullptr, IDI_APPLICATION);

    std::wstring tip;
    if (paused) {
        tip = L"Paused";
    } else if (speed) {
        tip = Formatter::FormatBytesPerSecond(
            speed->downloadBytesPerSecond + speed->uploadBytesPerSecond);
    } else {
        tip = L"0 B/s";
    }

    const size_t maxSize = sizeof(data_.szTip) / sizeof(data_.szTip[0]);
    wcsncpy(data_.szTip, tip.c_str(), maxSize - 1);
    data_.szTip[maxSize - 1] = L'\0';
}
