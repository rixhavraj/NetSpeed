# NetSpeedWidget Application Documentation

## Overview

NetSpeedWidget is a lightweight native Windows desktop utility that shows the current real-time internet speed as a small taskbar-adjacent widget. It is written in C++17 using the Win32 API, GDI, CMake, and MSVC.

The app does not run an external internet speed test. It does not contact any web service. Instead, it reads Windows network interface byte counters once per second, compares the current byte count with the previous byte count, and displays the difference as a speed value.

Current display behavior:

- Shows one combined real-time speed value.
- Combined speed means `download bytes per second + upload bytes per second`.
- The widget stays above the Windows taskbar.
- The user can move it horizontally.
- The widget is clamped inside the Windows work area so it cannot go outside the screen.
- A notification-area tray icon is available for menu actions.

## Goals

The application is designed to be:

- Small and fast.
- Native to Windows.
- Easy to distribute as a portable executable, MSI installer, or future MSIX package.
- CPU-only.
- Low memory.
- Near-zero CPU usage while idle.
- Free of heavy UI frameworks such as Qt, Electron, Chromium, or .NET UI stacks.

## What The App Does

At runtime, NetSpeedWidget:

1. Starts as a normal Windows desktop executable.
2. Creates a frameless Win32 window.
3. Places the window near the bottom-right of the screen, just above the taskbar.
4. Adds a tray icon to the Windows notification area.
5. Starts a Win32 timer with a one-second interval.
6. On every timer tick, reads network interface byte counters from Windows.
7. Calculates the byte delta since the previous tick.
8. Converts the delta into a human-readable speed string.
9. Repaints the widget only when the displayed value changes.
10. Saves user preferences such as horizontal position and compact mode in the registry.

## What The App Does Not Do

The app intentionally does not:

- Run speed tests against remote servers.
- Use GPU acceleration.
- Use background polling loops.
- Use worker threads.
- Depend on Qt, Electron, Chromium, WinUI, WPF, or .NET.
- Capture packets.
- Inspect website traffic.
- Modify network settings.
- Require administrator rights.

## Runtime Dependencies

For normal users running the built app, the dependencies are minimal.

Required at runtime:

- Windows 10 or Windows 11.
- Standard Windows system DLLs that are already present on Windows.
- Microsoft Visual C++ runtime if the executable is built with dynamic MSVC runtime linking.

The app links against these Windows libraries:

- `user32.lib`: window creation, messages, timers, positioning.
- `gdi32.lib`: text drawing and double-buffered painting.
- `shell32.lib`: notification-area tray icon.
- `iphlpapi.lib`: network interface counters through IP Helper APIs.
- `ws2_32.lib`: socket/IP type definitions required by Windows networking headers.
- `advapi32.lib`: registry persistence and startup toggle.

No third-party runtime dependency is required.

## Build Dependencies

To build the app from source, install:

- Visual Studio 2022 Build Tools or Visual Studio 2022 Community.
- MSVC C++ compiler.
- Windows SDK.
- CMake 3.21 or newer.
- PowerShell.

Recommended Visual Studio components:

- `Microsoft.VisualStudio.Workload.VCTools`
- `Microsoft.VisualStudio.Component.VC.CMake.Project`
- Windows 10 or Windows 11 SDK

The app was built successfully with:

- MSVC 19.44
- Windows SDK 10.0.26100.0
- Visual Studio Build Tools 2022

## Optional Packaging Dependencies

For MSI installer packaging:

- WiX Toolset v4.
- .NET SDK or runtime capable of building WiX SDK-style projects.

For MSIX packaging:

- Windows SDK tools.
- `makeappx.exe`.
- `signtool.exe`.
- A code-signing certificate.
- Microsoft Partner Center account for Store distribution.

## Source Code Structure

```text
src/
├─ main.cpp
├─ app/
│  ├─ App.h
│  ├─ App.cpp
│  ├─ Window.h
│  └─ Window.cpp
├─ monitor/
│  ├─ NetworkMonitor.h
│  ├─ NetworkMonitor.cpp
│  ├─ SpeedCalculator.h
│  └─ SpeedCalculator.cpp
├─ ui/
│  ├─ WidgetRenderer.h
│  ├─ WidgetRenderer.cpp
│  ├─ TrayIcon.h
│  └─ TrayIcon.cpp
├─ core/
│  ├─ Config.h
│  ├─ Config.cpp
│  ├─ Logger.h
│  └─ Logger.cpp
└─ utils/
   ├─ Formatter.h
   └─ Formatter.cpp
```

## Main Components

### `main.cpp`

Entry point for the Windows desktop executable.

It calls:

```cpp
wWinMain(...)
```

The entry point creates an `App` object, initializes it, and starts the message loop.

### `App`

Files:

- `src/app/App.h`
- `src/app/App.cpp`

Responsibilities:

- Owns the top-level `Window`.
- Initializes the application.
- Runs the standard Win32 message loop with `GetMessageW`, `TranslateMessage`, and `DispatchMessageW`.

### `Window`

Files:

- `src/app/Window.h`
- `src/app/Window.cpp`

Responsibilities:

- Registers the window class.
- Creates the frameless widget window.
- Applies always-on-top and semi-transparent window styles.
- Handles Win32 messages.
- Owns the monitor, speed calculator, renderer, tray icon, and config.
- Starts the one-second timer.
- Keeps the widget positioned above the taskbar.
- Allows horizontal dragging.
- Prevents the widget from going outside the screen work area.

Important messages handled:

- `WM_PAINT`: draws the widget.
- `WM_TIMER`: updates network counters once per second.
- `WM_LBUTTONDOWN`: begins horizontal drag.
- `WM_MOUSEMOVE`: moves horizontally while dragging.
- `WM_LBUTTONUP`: ends drag and saves position.
- `WM_DISPLAYCHANGE`: repositions after display changes.
- `WM_SETTINGCHANGE`: repositions after taskbar/work-area changes.
- `WM_COMMAND`: handles tray menu commands.
- `WM_DESTROY`: saves config and exits.

### `NetworkMonitor`

Files:

- `src/monitor/NetworkMonitor.h`
- `src/monitor/NetworkMonitor.cpp`

Responsibilities:

- Calls `GetIfTable2`.
- Iterates over network interfaces.
- Ignores loopback and tunnel interfaces.
- Ignores adapters that are not operationally up.
- Adds received and sent byte counters across usable adapters.
- Returns a raw `NetworkSnapshot`.

The app uses these Windows fields from `MIB_IF_ROW2`:

- `InOctets`
- `OutOctets`
- `OperStatus`
- `Type`

This means the app measures actual interface byte movement reported by Windows, not a synthetic speed test.

### `SpeedCalculator`

Files:

- `src/monitor/SpeedCalculator.h`
- `src/monitor/SpeedCalculator.cpp`

Responsibilities:

- Stores the previous network snapshot.
- Stores the previous timestamp.
- Calculates elapsed time using `std::chrono::steady_clock`.
- Calculates bytes per second:

```text
speed = current_bytes - previous_bytes / elapsed_seconds
```

It calculates:

- Download bytes per second.
- Upload bytes per second.

The current UI combines them into one total internet speed value:

```text
total_speed = download_bytes_per_second + upload_bytes_per_second
```

### `WidgetRenderer`

Files:

- `src/ui/WidgetRenderer.h`
- `src/ui/WidgetRenderer.cpp`

Responsibilities:

- Draws the visible widget using GDI.
- Uses double buffering to reduce flicker.
- Draws a compact, simple speed value.
- Supports dark/light color choices internally.

Rendering APIs used:

- `CreateCompatibleDC`
- `CreateCompatibleBitmap`
- `FillRect`
- `DrawTextW`
- `BitBlt`
- `DeleteObject`
- `DeleteDC`

The widget currently displays only one string, such as:

```text
850.4 KB/s
```

### `TrayIcon`

Files:

- `src/ui/TrayIcon.h`
- `src/ui/TrayIcon.cpp`

Responsibilities:

- Adds a notification-area tray icon using `Shell_NotifyIconW`.
- Updates the tray tooltip with the current speed.
- Displays a right-click menu.
- Provides menu actions:
  - Pause/Resume monitoring.
  - Compact/Expanded mode.
  - Start with Windows.
  - Exit.

Important Windows APIs:

- `Shell_NotifyIconW`
- `CreatePopupMenu`
- `InsertMenuItemW`
- `TrackPopupMenu`

Windows limitation:

Normal desktop applications cannot place live custom text directly inside the far-right taskbar notification area. Windows only allows notification icons there. Because of that, this app uses:

- A tray icon in the notification area.
- A small widget above the taskbar for live speed text.

### `Config`

Files:

- `src/core/Config.h`
- `src/core/Config.cpp`

Responsibilities:

- Loads and saves user preferences.
- Stores settings in the current user's registry.
- Enables or disables startup with Windows.

Settings registry key:

```text
HKEY_CURRENT_USER\Software\NetSpeedWidget
```

Startup registry key:

```text
HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run
```

Stored preferences include:

- Horizontal position.
- Compact mode.
- Paused state.
- Light theme flag.
- Opacity.

### `Logger`

Files:

- `src/core/Logger.h`
- `src/core/Logger.cpp`

Responsibilities:

- Writes diagnostic messages to the Visual Studio debug output.
- Writes a simple log file to the user's temp folder.

Log path:

```text
%TEMP%\NetSpeedWidget.log
```

### `Formatter`

Files:

- `src/utils/Formatter.h`
- `src/utils/Formatter.cpp`

Responsibilities:

- Converts raw bytes-per-second values into readable strings.

Examples:

```text
512 B/s
92.4 KB/s
1.8 MB/s
```

## How Speed Calculation Works

The app does not measure internet speed by downloading a file. It measures current traffic passing through network adapters.

Every second:

1. `NetworkMonitor::ReadSnapshot()` reads total bytes received and total bytes sent.
2. `SpeedCalculator::Update()` compares the new values with the previous values.
3. The difference is divided by elapsed time.
4. The UI displays the combined total.

Example:

```text
Previous received: 1,000,000 bytes
Current received:  1,500,000 bytes
Delta:               500,000 bytes
Elapsed time:              1 second
Download speed:       500,000 B/s
```

If upload adds another `100,000 B/s`, the widget displays:

```text
600,000 B/s
```

Formatted:

```text
585.9 KB/s
```

## Timer Model

The app uses a Win32 timer:

```cpp
SetTimer(hwnd, timerId, 1000, nullptr);
```

This means:

- No busy loop.
- No constant polling.
- No background thread.
- Work happens once per second on the UI thread.

This is lightweight because reading network counters and repainting one small window once per second is very cheap.

## Window Behavior

The widget window is:

- Frameless.
- Always on top.
- Semi-transparent.
- Tool-window style, so it does not appear as a normal taskbar app button.
- Positioned above the taskbar.

Window styles:

- `WS_POPUP`
- `WS_EX_TOPMOST`
- `WS_EX_LAYERED`
- `WS_EX_TOOLWINDOW`

The widget uses the Windows work area from:

```cpp
SystemParametersInfoW(SPI_GETWORKAREA, ...)
```

The work area excludes the taskbar. This is how the app knows where it can safely place the widget.

## Horizontal Movement

Users can drag the widget horizontally.

The app:

- Captures the mouse on left-button down.
- Tracks horizontal mouse movement.
- Keeps the widget's Y position fixed above the taskbar.
- Clamps X position between the left and right work-area edges.
- Saves the final X position when dragging ends.

This prevents the widget from going outside the screen.

## Startup With Windows

Startup is controlled by the tray menu.

When enabled, the app writes the executable path to:

```text
HKCU\Software\Microsoft\Windows\CurrentVersion\Run\NetSpeedWidget
```

This starts the app when the current user signs in.

No administrator permission is required because this uses `HKCU`, not `HKLM`.

## Build System

The project uses CMake.

Root file:

```text
CMakeLists.txt
```

Important settings:

- C++17.
- MSVC warnings enabled with `/W4`.
- Unicode build enabled with `_UNICODE` and `UNICODE`.
- Output executable goes to `build/bin`.
- Links only standard Windows system libraries.
- Embeds `src/NetSpeedWidget.manifest`.

Build command:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1 -Configuration Release
```

Manual CMake build:

```powershell
cmake -S . -B build -A x64
cmake --build build --config Release
```

Output:

```text
build\bin\NetSpeedWidget.exe
```

## PowerShell Scripts

### `scripts/build.ps1`

Builds the app.

Features:

- Finds `cmake.exe` on PATH.
- Searches common Visual Studio/CMake install locations if CMake is not on PATH.
- Configures the CMake build directory.
- Builds the requested configuration.

Usage:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1 -Configuration Release
```

### `scripts/clean.ps1`

Removes generated build and distribution folders.

Usage:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\clean.ps1
```

### `scripts/package_portable.ps1`

Creates a portable app folder.

Usage:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package_portable.ps1 -Configuration Release
```

Output:

```text
dist\portable\
```

## Installer Packaging

Installer files:

```text
installer/
├─ scripts/
│  └─ build_installer.ps1
└─ wix/
   ├─ installer.wixproj
   └─ product.wxs
```

The WiX installer:

- Installs to Program Files.
- Adds a Start Menu shortcut.
- Uses a per-machine package scope.
- Leaves startup control to the app's tray menu.

Build installer:

```powershell
powershell -ExecutionPolicy Bypass -File .\installer\scripts\build_installer.ps1 -Configuration Release
```

## MSIX Packaging

MSIX files:

```text
packaging/
└─ msix/
   ├─ AppxManifest.xml
   └─ assets/
```

The manifest declares:

- Desktop target family.
- Full-trust desktop app entry point.
- App logos.
- `runFullTrust` capability.

For Microsoft Store distribution:

1. Reserve the app name in Partner Center.
2. Update package identity and publisher values.
3. Replace artwork with final production assets.
4. Build the Release executable.
5. Stage the executable, manifest, and assets.
6. Run `makeappx.exe`.
7. Sign the package with `signtool.exe`.
8. Validate with Windows App Certification Kit.
9. Upload to Partner Center.

## Security And Privacy

NetSpeedWidget is privacy-friendly by design.

It:

- Does not send telemetry.
- Does not call web APIs.
- Does not inspect packet contents.
- Does not require admin rights.
- Does not store browsing data.
- Does not collect personal information.

The only persistent data is app preference data stored in the current user's registry.

## Performance Notes

The app is lightweight because:

- It is native C++.
- It uses Win32 and GDI directly.
- It wakes once per second.
- It reads counters from Windows instead of performing network tests.
- It redraws a tiny window.
- It uses no GPU-specific APIs.
- It uses no background thread.

Expected runtime footprint:

- CPU: near zero while idle.
- Memory: small native process footprint.
- Disk: one small executable plus optional package files.

## Troubleshooting

### `cmake` is not recognized

Install Visual Studio Build Tools with CMake support or standalone CMake.

Recommended:

```powershell
winget install --id Microsoft.VisualStudio.2022.BuildTools -e
```

Include:

- C++ build tools.
- CMake tools for Windows.
- Windows SDK.

### PowerShell says scripts are disabled

Run scripts with a process-only bypass:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1 -Configuration Release
```

### App does not start

Check the log:

```text
%TEMP%\NetSpeedWidget.log
```

Also make sure:

- The app was built successfully.
- No old copy is still running.
- The executable exists at `build\bin\NetSpeedWidget.exe`.

### Widget is not visible

Check:

- It may be at the bottom-right above the taskbar.
- It may be behind a full-screen app.
- The tray icon may be hidden in the notification overflow menu.

### Speed shows `0 B/s`

This can happen when:

- There is no active internet traffic.
- The first timer sample has just been taken.
- All active adapters are virtual, loopback, tunnel, or down.

Open a browser or start a download and wait one or two seconds.

## Developer Notes

The code follows a simple separation of concerns:

- `Window` owns Win32 lifecycle and message handling.
- `NetworkMonitor` owns raw network counters.
- `SpeedCalculator` owns delta math.
- `WidgetRenderer` owns drawing.
- `TrayIcon` owns notification-area behavior.
- `Config` owns persistence.
- `Formatter` owns display formatting.

This makes future features easier to add, such as:

- Adapter selection.
- Theme switching UI.
- More compact tray-only mode.
- Signed installer.
- Store-ready MSIX pipeline.

## Current Limitations

- Windows does not allow live arbitrary text directly inside the far-right notification area, so the app uses a tray icon plus a small taskbar-adjacent widget.
- The displayed value is combined upload and download traffic, not a server-tested maximum speed.
- VPNs and virtual adapters may affect totals if Windows reports them as active usable adapters.
- Store distribution requires final identity values, signing, and certification steps.
