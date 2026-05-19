#pragma once

#include <string>

class Logger {
public:
    static void Write(const std::wstring& message);
    static void LastError(const std::wstring& message);
};
