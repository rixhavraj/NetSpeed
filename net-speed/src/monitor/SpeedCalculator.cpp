#include "monitor/SpeedCalculator.h"

#include <algorithm>

SpeedSample SpeedCalculator::Update(const NetworkSnapshot& snapshot)
{
    const auto now = std::chrono::high_resolution_clock::now();
    if (!hasPrevious_) {
        hasPrevious_ = true;
        previousSnapshot_ = snapshot;
        previousTime_ = now;
        return {};
    }

    const std::chrono::duration<double> elapsed = now - previousTime_;
    const double seconds = std::max(elapsed.count(), 0.001);

    const std::uint64_t currentRx = snapshot.bytesReceived;
    const std::uint64_t previousRx = previousSnapshot_.bytesReceived;
    const std::uint64_t receivedDelta = (currentRx >= previousRx) ? (currentRx - previousRx) : currentRx;

    const std::uint64_t currentTx = snapshot.bytesSent;
    const std::uint64_t previousTx = previousSnapshot_.bytesSent;
    const std::uint64_t sentDelta = (currentTx >= previousTx) ? (currentTx - previousTx) : currentTx;

    previousSnapshot_ = snapshot;
    previousTime_ = now;

    return {
        static_cast<std::uint64_t>(receivedDelta / seconds),
        static_cast<std::uint64_t>(sentDelta / seconds)
    };
}

void SpeedCalculator::Reset()
{
    hasPrevious_ = false;
    previousSnapshot_ = {};
    previousTime_ = {};
}
