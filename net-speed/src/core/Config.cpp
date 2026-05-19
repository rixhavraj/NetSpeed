#include "core/Config.h"

#include "core/Logger.h"

#include <string>

namespace {
constexpr wchar_t kSettingsKey[] = L"Software\\NetSpeedWidget";
constexpr wchar_t kRunKey[] = L"Software\\Microsoft\\Windows\\CurrentVersion\\Run";
constexpr wchar_t kRunValue[] = L"NetSpeedWidget";

std::wstring CurrentExecutablePath()
{
    std::wstring path(MAX_PATH, L'\0');
    DWORD length = GetModuleFileNameW(nullptr, &path[0], static_cast<DWORD>(path.size()));
    while (length == path.size()) {
        path.resize(path.size() * 2);
        length = GetModuleFileNameW(nullptr, &path[0], static_cast<DWORD>(path.size()));
    }
    path.resize(length);
    return path;
}
}

void Config::Load()
{
    HKEY key{};
    if (RegOpenKeyExW(HKEY_CURRENT_USER, kSettingsKey, 0, KEY_READ, &key) != ERROR_SUCCESS) {
        return;
    }

    DWORD value{};
    if (ReadDword(key, L"X", value)) {
        x_ = static_cast<int>(value);
    }
    if (ReadDword(key, L"Y", value)) {
        y_ = static_cast<int>(value);
    }
    if (ReadDword(key, L"Compact", value)) {
        compact_ = value != 0;
    }
    if (ReadDword(key, L"Paused", value)) {
        paused_ = value != 0;
    }
    if (ReadDword(key, L"LightTheme", value)) {
        lightTheme_ = value != 0;
    }
    if (ReadDword(key, L"Opacity", value)) {
        opacity_ = static_cast<BYTE>(value < 80 ? 80 : (value > 255 ? 255 : value));
    }

    RegCloseKey(key);
}

void Config::Save() const
{
    HKEY key{};
    DWORD disposition{};
    if (RegCreateKeyExW(HKEY_CURRENT_USER, kSettingsKey, 0, nullptr, 0, KEY_WRITE, nullptr, &key, &disposition) != ERROR_SUCCESS) {
        Logger::LastError(L"Unable to open settings registry key");
        return;
    }

    WriteDword(key, L"X", static_cast<DWORD>(x_));
    WriteDword(key, L"Y", static_cast<DWORD>(y_));
    WriteDword(key, L"Compact", compact_ ? 1 : 0);
    WriteDword(key, L"Paused", paused_ ? 1 : 0);
    WriteDword(key, L"LightTheme", lightTheme_ ? 1 : 0);
    WriteDword(key, L"Opacity", opacity_);

    RegCloseKey(key);
}

bool Config::HasPosition() const
{
    return x_ != kUnsetPosition && y_ != kUnsetPosition;
}

int Config::X() const
{
    return HasPosition() ? x_ : CW_USEDEFAULT;
}

int Config::Y() const
{
    return HasPosition() ? y_ : CW_USEDEFAULT;
}

void Config::SetPosition(int x, int y)
{
    x_ = x;
    y_ = y;
}

bool Config::IsCompact() const
{
    return compact_;
}

void Config::SetCompact(bool compact)
{
    compact_ = compact;
}

bool Config::IsPaused() const
{
    return paused_;
}

void Config::SetPaused(bool paused)
{
    paused_ = paused;
}

bool Config::IsLightTheme() const
{
    return lightTheme_;
}

void Config::SetLightTheme(bool lightTheme)
{
    lightTheme_ = lightTheme;
}

BYTE Config::Opacity() const
{
    return opacity_;
}

bool Config::IsStartupEnabled() const
{
    HKEY key{};
    if (RegOpenKeyExW(HKEY_CURRENT_USER, kRunKey, 0, KEY_READ, &key) != ERROR_SUCCESS) {
        return false;
    }

    wchar_t value[MAX_PATH * 2]{};
    DWORD size = sizeof(value);
    const bool exists = RegQueryValueExW(key, kRunValue, nullptr, nullptr, reinterpret_cast<LPBYTE>(value), &size) == ERROR_SUCCESS;
    RegCloseKey(key);
    return exists;
}

bool Config::SetStartupEnabled(bool enabled)
{
    HKEY key{};
    DWORD disposition{};
    if (RegCreateKeyExW(HKEY_CURRENT_USER, kRunKey, 0, nullptr, 0, KEY_SET_VALUE, nullptr, &key, &disposition) != ERROR_SUCCESS) {
        Logger::LastError(L"Unable to open Run registry key");
        return false;
    }

    LONG result = ERROR_SUCCESS;
    if (enabled) {
        const std::wstring command = L"\"" + CurrentExecutablePath() + L"\"";
        result = RegSetValueExW(
            key,
            kRunValue,
            0,
            REG_SZ,
            reinterpret_cast<const BYTE*>(command.c_str()),
            static_cast<DWORD>((command.size() + 1) * sizeof(wchar_t)));
    } else {
        result = RegDeleteValueW(key, kRunValue);
        if (result == ERROR_FILE_NOT_FOUND) {
            result = ERROR_SUCCESS;
        }
    }

    RegCloseKey(key);
    return result == ERROR_SUCCESS;
}

bool Config::ReadDword(HKEY key, const wchar_t* name, DWORD& value) const
{
    DWORD type{};
    DWORD size = sizeof(value);
    return RegQueryValueExW(key, name, nullptr, &type, reinterpret_cast<LPBYTE>(&value), &size) == ERROR_SUCCESS &&
        type == REG_DWORD &&
        size == sizeof(value);
}

void Config::WriteDword(HKEY key, const wchar_t* name, DWORD value) const
{
    RegSetValueExW(key, name, 0, REG_DWORD, reinterpret_cast<const BYTE*>(&value), sizeof(value));
}
