#pragma once

#include <cstdint>

struct NetworkSnapshot {
    std::uint64_t bytesReceived{};
    std::uint64_t bytesSent{};
};

class NetworkMonitor {
public:
    bool ReadSnapshot(NetworkSnapshot& outSnapshot) const;
};
