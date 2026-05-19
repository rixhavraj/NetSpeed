# Build And Packaging

## Prerequisites

- Windows 10 or Windows 11.
- Visual Studio 2022 with Desktop development with C++ workload.
- CMake 3.21 or newer.
- Optional installer build: WiX Toolset v4.
- Optional MSIX build: Windows SDK tools such as `makeappx.exe` and `signtool.exe`.

## Visual Studio Build

1. Open Visual Studio.
2. Select **Open a local folder** and choose the `net-speed` folder.
3. Let CMake configure the project.
4. Select `x64-Release`.
5. Build `NetSpeedWidget`.

The executable will be available at `build\bin\NetSpeedWidget.exe` when using the default CMake output settings.

## CLI Build

Run from a Developer PowerShell for Visual Studio:

```powershell
cmake -S . -B build -A x64
cmake --build build --config Release
```

Or:

```powershell
.\scripts\build.ps1 -Configuration Release
```

## Run And Test

Run:

```powershell
.\build\bin\NetSpeedWidget.exe
```

Manual checks:

- The widget appears near the top-right of the primary screen.
- Download and upload values update once per second.
- Drag the widget with the left mouse button.
- Double-click the widget to toggle compact/expanded mode.
- Right-click the tray icon to pause/resume, toggle startup, toggle compact mode, or exit.
- Pause monitoring and verify values stop changing without high CPU usage.
- Open Task Manager and confirm CPU usage is near zero when idle.

## Portable Package

Build and create a portable folder:

```powershell
.\scripts\package_portable.ps1 -Configuration Release
```

Output:

```text
dist\portable\NetSpeedWidget.exe
dist\portable\README.txt
```

## WiX Installer

Install WiX Toolset v4 first:

```powershell
dotnet tool install --global wix
wix extension add WixToolset.UI.wixext
```

Build the app and installer:

```powershell
.\installer\scripts\build_installer.ps1 -Configuration Release
```

The MSI is produced under:

```text
installer\wix\bin\Release\
```

The installer writes the application to Program Files and adds a Start Menu shortcut. Startup is managed at runtime from the tray menu through the current user's Run registry key.

## MSIX Preparation

The `packaging\msix\AppxManifest.xml` file is a Store-ready starting point. For a production Microsoft Store package:

1. Build the Release executable.
2. Create real PNG logo assets in `packaging\msix\assets` matching the manifest names.
3. Copy `NetSpeedWidget.exe` beside `AppxManifest.xml` in a package staging directory.
4. Run `makeappx.exe pack`.
5. Sign with a trusted certificate using `signtool.exe`.
6. Validate with the Windows App Certification Kit.

Example:

```powershell
New-Item -ItemType Directory -Force dist\msix-stage
Copy-Item build\bin\NetSpeedWidget.exe dist\msix-stage\
Copy-Item packaging\msix\AppxManifest.xml dist\msix-stage\
Copy-Item packaging\msix\assets dist\msix-stage\assets -Recurse
makeappx.exe pack /d dist\msix-stage /p dist\NetSpeedWidget.msix
signtool.exe sign /fd SHA256 /a dist\NetSpeedWidget.msix
```

For Microsoft Store distribution, reserve the app name in Partner Center, update the identity publisher/name values, add final Store artwork, and upload the signed MSIX or MSIX upload package.
