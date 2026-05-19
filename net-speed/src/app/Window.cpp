#include "app/Window.h"

#include "core/Logger.h"

namespace {
constexpr wchar_t kWindowClassName[] = L"NetSpeedWidgetWindow";
constexpr int kExpandedWidth = 136;
constexpr int kExpandedHeight = 40;
constexpr int kCompactWidth = 96;
constexpr int kCompactHeight = 26;
constexpr int kTaskbarMargin = 8;

RECT WorkArea()
{
    RECT rect{};
    SystemParametersInfoW(SPI_GETWORKAREA, 0, &rect, 0);
    return rect;
}
}

Window::Window(HINSTANCE instance)
    : instance_(instance), tray_(instance)
{
}

Window::~Window()
{
    if (hwnd_) {
        KillTimer(hwnd_, kTimerId);
    }
}

bool Window::Create(int showCommand)
{
    config_.Load();
    paused_ = config_.IsPaused();
    renderer_.SetLightTheme(config_.IsLightTheme());
    renderer_.SetCompact(config_.IsCompact());

    WNDCLASSEXW wc{};
    wc.cbSize = sizeof(wc);
    wc.style = CS_DBLCLKS;
    wc.lpfnWndProc = StaticWndProc;
    wc.hInstance = instance_;
    wc.hCursor = LoadCursorW(nullptr, IDC_ARROW);
    wc.hbrBackground = nullptr;
    wc.lpszClassName = kWindowClassName;

    if (!RegisterClassExW(&wc)) {
        Logger::LastError(L"RegisterClassExW failed");
        return false;
    }

    const int width = config_.IsCompact() ? kCompactWidth : kExpandedWidth;
    const int height = config_.IsCompact() ? kCompactHeight : kExpandedHeight;
    const DWORD exStyle = WS_EX_TOPMOST | WS_EX_LAYERED | WS_EX_TOOLWINDOW;
    const DWORD style = WS_POPUP;

    hwnd_ = CreateWindowExW(
        exStyle,
        kWindowClassName,
        L"Net Speed Widget",
        style,
        config_.X(),
        config_.Y(),
        width,
        height,
        nullptr,
        nullptr,
        instance_,
        this);

    if (!hwnd_) {
        Logger::LastError(L"CreateWindowExW failed");
        return false;
    }

    SetLayeredWindowAttributes(hwnd_, 0, config_.Opacity(), LWA_ALPHA);

    PositionDefault();

    if (!tray_.Add(hwnd_, paused_, config_.IsStartupEnabled(), config_.IsCompact())) {
        Logger::LastError(L"Unable to add tray icon");
    }

    SetTimer(hwnd_, kTimerId, kTimerIntervalMs, nullptr);
    ShowWindow(hwnd_, showCommand);
    UpdateWindow(hwnd_);

    return true;
}

LRESULT CALLBACK Window::StaticWndProc(HWND hwnd, UINT message, WPARAM wParam, LPARAM lParam)
{
    Window* window = nullptr;
    if (message == WM_NCCREATE) {
        auto* createStruct = reinterpret_cast<CREATESTRUCTW*>(lParam);
        window = static_cast<Window*>(createStruct->lpCreateParams);
        window->hwnd_ = hwnd;
        SetWindowLongPtrW(hwnd, GWLP_USERDATA, reinterpret_cast<LONG_PTR>(window));
    } else {
        window = reinterpret_cast<Window*>(GetWindowLongPtrW(hwnd, GWLP_USERDATA));
    }

    if (window) {
        return window->WndProc(message, wParam, lParam);
    }

    return DefWindowProcW(hwnd, message, wParam, lParam);
}

LRESULT Window::WndProc(UINT message, WPARAM wParam, LPARAM lParam)
{
    switch (message) {
    case WM_ERASEBKGND:
        return 1;
    case WM_PAINT:
        OnPaint();
        return 0;
    case WM_TIMER:
        if (wParam == kTimerId) {
            OnTimer();
            return 0;
        }
        break;
    case WM_COMMAND:
        OnCommand(LOWORD(wParam));
        return 0;
    case WM_NCHITTEST:
        return HTCLIENT;
    case WM_LBUTTONDOWN: {
        POINT cursor{};
        GetCursorPos(&cursor);
        RECT rect{};
        GetWindowRect(hwnd_, &rect);
        dragOffsetX_ = cursor.x - rect.left;
        horizontalDrag_ = true;
        SetCapture(hwnd_);
        return 0;
    }
    case WM_MOUSEMOVE:
        if (horizontalDrag_) {
            POINT cursor{};
            GetCursorPos(&cursor);
            MoveHorizontally(cursor.x - dragOffsetX_);
            return 0;
        }
        break;
    case WM_LBUTTONUP:
    case WM_CAPTURECHANGED:
        if (horizontalDrag_) {
            horizontalDrag_ = false;
            ReleaseCapture();
            SavePosition();
            return 0;
        }
        break;
    case WM_LBUTTONDBLCLK:
    case WM_NCLBUTTONDBLCLK:
        ToggleCompact();
        return 0;
    case WM_DISPLAYCHANGE:
    case WM_SETTINGCHANGE:
        PositionDefault();
        return 0;
    case TrayIcon::kCallbackMessage:
        if (LOWORD(lParam) == WM_RBUTTONUP || LOWORD(lParam) == WM_CONTEXTMENU) {
            tray_.ShowMenu(hwnd_, paused_, config_.IsStartupEnabled(), config_.IsCompact());
        } else if (LOWORD(lParam) == WM_LBUTTONDBLCLK) {
            TogglePaused();
        }
        return 0;
    case WM_DESTROY:
        SavePosition();
        config_.Save();
        tray_.Remove();
        PostQuitMessage(0);
        return 0;
    default:
        break;
    }

    return DefWindowProcW(hwnd_, message, wParam, lParam);
}

void Window::OnPaint()
{
    PAINTSTRUCT paint{};
    HDC hdc = BeginPaint(hwnd_, &paint);
    RECT client{};
    GetClientRect(hwnd_, &client);
    renderer_.Render(hdc, client, currentSpeed_, paused_);
    EndPaint(hwnd_, &paint);
}

void Window::OnTimer()
{
    if (paused_) {
        return;
    }

    NetworkSnapshot snapshot{};
    if (!monitor_.ReadSnapshot(snapshot)) {
        return;
    }

    const SpeedSample nextSpeed = calculator_.Update(snapshot);
    if (nextSpeed.downloadBytesPerSecond != currentSpeed_.downloadBytesPerSecond ||
        nextSpeed.uploadBytesPerSecond != currentSpeed_.uploadBytesPerSecond) {
        currentSpeed_ = nextSpeed;
        tray_.Update(hwnd_, paused_, config_.IsStartupEnabled(), config_.IsCompact(), currentSpeed_);
        InvalidateRect(hwnd_, nullptr, FALSE);
    }
}

void Window::OnCommand(UINT commandId)
{
    switch (commandId) {
    case TrayIcon::CommandExit:
        DestroyWindow(hwnd_);
        break;
    case TrayIcon::CommandPauseResume:
        TogglePaused();
        break;
    case TrayIcon::CommandToggleStartup:
        ToggleStartup();
        break;
    case TrayIcon::CommandToggleCompact:
        ToggleCompact();
        break;
    default:
        break;
    }
}

void Window::TogglePaused()
{
    paused_ = !paused_;
    config_.SetPaused(paused_);
    calculator_.Reset();
    currentSpeed_ = {};
    tray_.Update(hwnd_, paused_, config_.IsStartupEnabled(), config_.IsCompact(), currentSpeed_);
    InvalidateRect(hwnd_, nullptr, FALSE);
}

void Window::ToggleCompact()
{
    config_.SetCompact(!config_.IsCompact());
    renderer_.SetCompact(config_.IsCompact());
    ApplyModeSize();
    PositionDefault();
    tray_.Update(hwnd_, paused_, config_.IsStartupEnabled(), config_.IsCompact(), currentSpeed_);
    InvalidateRect(hwnd_, nullptr, FALSE);
}

void Window::ToggleStartup()
{
    const bool enabled = !config_.IsStartupEnabled();
    if (config_.SetStartupEnabled(enabled)) {
        tray_.Update(hwnd_, paused_, config_.IsStartupEnabled(), config_.IsCompact(), currentSpeed_);
    }
}

void Window::ApplyModeSize()
{
    const int width = config_.IsCompact() ? kCompactWidth : kExpandedWidth;
    const int height = config_.IsCompact() ? kCompactHeight : kExpandedHeight;
    SetWindowPos(hwnd_, HWND_TOPMOST, 0, 0, width, height, SWP_NOMOVE | SWP_NOACTIVATE);
    PositionDefault();
}

void Window::SavePosition()
{
    if (!hwnd_) {
        return;
    }

    RECT rect{};
    if (GetWindowRect(hwnd_, &rect)) {
        config_.SetPosition(rect.left, rect.top);
    }
}

void Window::PositionDefault()
{
    const RECT workArea = WorkArea();
    RECT rect{};
    GetWindowRect(hwnd_, &rect);
    const int width = rect.right - rect.left;
    const int height = rect.bottom - rect.top;
    int x = config_.HasPosition() ? config_.X() : workArea.right - width - kTaskbarMargin;
    const int minX = workArea.left + kTaskbarMargin;
    const int maxX = workArea.right - width - kTaskbarMargin;
    if (x < minX) {
        x = minX;
    }
    if (x > maxX) {
        x = maxX;
    }
    const int y = workArea.bottom - height - kTaskbarMargin;
    SetWindowPos(hwnd_, HWND_TOPMOST, x, y, 0, 0, SWP_NOSIZE | SWP_NOACTIVATE);
    config_.SetPosition(x, y);
}

void Window::MoveHorizontally(int screenX)
{
    RECT rect{};
    if (!GetWindowRect(hwnd_, &rect)) {
        return;
    }

    const RECT workArea = WorkArea();
    const int width = rect.right - rect.left;
    const int height = rect.bottom - rect.top;
    const int minX = workArea.left + kTaskbarMargin;
    const int maxX = workArea.right - width - kTaskbarMargin;
    int x = screenX;
    if (x < minX) {
        x = minX;
    }
    if (x > maxX) {
        x = maxX;
    }

    const int y = workArea.bottom - height - kTaskbarMargin;
    SetWindowPos(hwnd_, HWND_TOPMOST, x, y, 0, 0, SWP_NOSIZE | SWP_NOACTIVATE);
    config_.SetPosition(x, y);
}
