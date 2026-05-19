#pragma once

#include "monitor/SpeedCalculator.h"

#include <windows.h>

class WidgetRenderer {
public:
    void SetLightTheme(bool enabled);
    void SetCompact(bool enabled);
    void Render(HDC targetDc, const RECT& bounds, const SpeedSample& speed, bool paused);

private:
    void Draw(HDC dc, const RECT& bounds, const SpeedSample& speed, bool paused);

    bool lightTheme_{false};
    bool compact_{false};
};
