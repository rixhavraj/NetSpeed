#pragma once

#include "monitor/NetworkMonitor.h"

#include <chrono>
#include <cstdint>

struct SpeedSample {
    std::uint64_t downloadBytesPerSecond{};
    std::uint64_t uploadBytesPerSecond{};
};

class SpeedCalculator {
public:
    SpeedSample Update(const NetworkSnapshot& snapshot);
    void Reset();

private:
    bool hasPrevious_{false};
    NetworkSnapshot previousSnapshot_{};
    std::chrono::high_resolution_clock::time_point previousTime_{};
};
