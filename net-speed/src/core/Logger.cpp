#include "core/Logger.h"

#include <windows.h>

#include <fstream>
#include <string>
#include <sstream>

namespace {
std::wstring LogPath()
{
    wchar_t tempPath[MAX_PATH]{};
    const DWORD length = GetTempPathW(MAX_PATH, tempPath);
    if (length == 0 || length >= MAX_PATH) {
        return L"NetSpeedWidget.log";
    }

    return std::wstring(tempPath) + L"NetSpeedWidget.log";
}

void AppendToFile(const std::wstring& message)
{
    std::wstring pathWide = LogPath();
    std::string path(pathWide.begin(), pathWide.end());
    std::wofstream file(path, std::ios::app);
    if (file) {
        file << message << L"\n";
    }
}
}

void Logger::Write(const std::wstring& message)
{
    OutputDebugStringW((message + L"\n").c_str());
    AppendToFile(message);
}

void Logger::LastError(const std::wstring& message)
{
    const DWORD error = GetLastError();
    std::wstringstream ss;
    ss << message << L" error=" << error;
    Write(ss.str());
}
