#pragma once

#include <cstdint>
#include <windows.h>

class Config {
public:
    void Load();
    void Save() const;

    bool HasPosition() const;
    int X() const;
    int Y() const;
    void SetPosition(int x, int y);

    bool IsCompact() const;
    void SetCompact(bool compact);

    bool IsPaused() const;
    void SetPaused(bool paused);

    bool IsLightTheme() const;
    void SetLightTheme(bool lightTheme);

    BYTE Opacity() const;

    bool IsStartupEnabled() const;
    bool SetStartupEnabled(bool enabled);

private:
    static constexpr int kUnsetPosition = -32000;

    bool ReadDword(HKEY key, const wchar_t* name, DWORD& value) const;
    void WriteDword(HKEY key, const wchar_t* name, DWORD value) const;

    int x_{kUnsetPosition};
    int y_{kUnsetPosition};
    bool compact_{true};
    bool paused_{false};
    bool lightTheme_{false};
    BYTE opacity_{226};
};
