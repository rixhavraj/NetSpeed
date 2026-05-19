#pragma once

#include <cstdint>
#include <string>

class Formatter {
public:
    static std::wstring FormatBytesPerSecond(std::uint64_t bytesPerSecond);
};
