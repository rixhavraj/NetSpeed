#include "ui/WidgetRenderer.h"

#include "utils/Formatter.h"

#include <string>

namespace {
COLORREF Rgb(int r, int g, int b)
{
    return RGB(r, g, b);
}

HFONT CreateFontForHeight(int height, int weight)
{
    return CreateFontW(
        -height,
        0,
        0,
        0,
        weight,
        FALSE,
        FALSE,
        FALSE,
        DEFAULT_CHARSET,
        OUT_DEFAULT_PRECIS,
        CLIP_DEFAULT_PRECIS,
        CLEARTYPE_QUALITY,
        DEFAULT_PITCH | FF_DONTCARE,
        L"Segoe UI");
}
}

void WidgetRenderer::SetLightTheme(bool enabled)
{
    lightTheme_ = enabled;
}

void WidgetRenderer::SetCompact(bool enabled)
{
    compact_ = enabled;
}

void WidgetRenderer::Render(HDC targetDc, const RECT& bounds, const SpeedSample& speed, bool paused)
{
    const int width = bounds.right - bounds.left;
    const int height = bounds.bottom - bounds.top;

    HDC memoryDc = CreateCompatibleDC(targetDc);
    HBITMAP bitmap = CreateCompatibleBitmap(targetDc, width, height);
    HGDIOBJ oldBitmap = SelectObject(memoryDc, bitmap);

    RECT local{ 0, 0, width, height };
    Draw(memoryDc, local, speed, paused);

    BitBlt(targetDc, 0, 0, width, height, memoryDc, 0, 0, SRCCOPY);

    SelectObject(memoryDc, oldBitmap);
    DeleteObject(bitmap);
    DeleteDC(memoryDc);
}

void WidgetRenderer::Draw(HDC dc, const RECT& bounds, const SpeedSample& speed, bool paused)
{
    const COLORREF background = lightTheme_ ? Rgb(245, 247, 250) : Rgb(20, 22, 26);
    const COLORREF muted = lightTheme_ ? Rgb(92, 99, 112) : Rgb(158, 166, 179);
    const COLORREF speedColor = lightTheme_ ? Rgb(16, 114, 79) : Rgb(104, 211, 145);

    HBRUSH brush = CreateSolidBrush(background);
    FillRect(dc, &bounds, brush);
    DeleteObject(brush);

    SetBkMode(dc, TRANSPARENT);

    HFONT valueFont = CreateFontForHeight(compact_ ? 13 : 17, FW_SEMIBOLD);
    HFONT labelFont = CreateFontForHeight(11, FW_NORMAL);

    if (paused) {
        HGDIOBJ oldFont = SelectObject(dc, valueFont);
        SetTextColor(dc, muted);
        RECT pausedRect = bounds;
        DrawTextW(dc, L"Paused", -1, &pausedRect, DT_CENTER | DT_VCENTER | DT_SINGLELINE);
        SelectObject(dc, oldFont);
        DeleteObject(valueFont);
        DeleteObject(labelFont);
        return;
    }

    const std::wstring speedText = Formatter::FormatBytesPerSecond(
        speed.downloadBytesPerSecond + speed.uploadBytesPerSecond);

    HGDIOBJ oldFont = SelectObject(dc, valueFont);
    SetTextColor(dc, speedColor);

    if (compact_) {
        RECT speedRect = bounds;
        speedRect.left += 4;
        speedRect.right -= 4;
        DrawTextW(dc, speedText.c_str(), -1, &speedRect, DT_CENTER | DT_VCENTER | DT_SINGLELINE | DT_END_ELLIPSIS);
    } else {
        SelectObject(dc, valueFont);
        RECT speedRect{ bounds.left + 8, bounds.top, bounds.right - 8, bounds.bottom };
        DrawTextW(dc, speedText.c_str(), -1, &speedRect, DT_CENTER | DT_SINGLELINE | DT_VCENTER | DT_END_ELLIPSIS);
    }

    SelectObject(dc, oldFont);
    DeleteObject(valueFont);
    DeleteObject(labelFont);
}
