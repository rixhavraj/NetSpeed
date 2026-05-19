# NetSpeedWidget

Lightweight native Windows internet speed widget built with C++17, Win32 API, GDI, CMake, and MSVC.

## Features

- Real-time combined internet speed from Windows network interface counters.
- One-second timer updates with no busy loop and no background worker thread.
- Frameless always-on-top semi-transparent widget fixed above the taskbar.
- Horizontal movement with screen-edge clamping.
- System tray menu: pause/resume, compact/expanded, toggle startup, exit.
- Registry-backed preferences under `HKCU\Software\NetSpeedWidget`.
- WiX installer scaffold and MSIX packaging manifest.

## Folder Structure

```text
net-speed/
+-- CMakeLists.txt
+-- README.md
+-- docs/
|   +-- APP_DOCUMENTATION.md
|   +-- BUILD_AND_PACKAGING.md
+-- installer/
|   +-- scripts/
|   |   +-- build_installer.ps1
|   +-- wix/
|       +-- installer.wixproj
|       +-- product.wxs
+-- packaging/
|   +-- msix/
|       +-- AppxManifest.xml
|       +-- assets/
+-- scripts/
|   +-- build.ps1
|   +-- clean.ps1
|   +-- package_portable.ps1
+-- src/
    +-- NetSpeedWidget.manifest
    +-- main.cpp
    +-- app/
    +-- core/
    +-- monitor/
    +-- ui/
    +-- utils/
```

## Build

From a Developer PowerShell for Visual Studio:

```powershell
cmake -S . -B build
cmake --build build --config Release
```

Or use:

```powershell
.\scripts\build.ps1 -Configuration Release
```

The executable is written to `build\bin\NetSpeedWidget.exe`.

Full app documentation is in [docs/APP_DOCUMENTATION.md](docs/APP_DOCUMENTATION.md).

Detailed build, packaging, installer, MSIX, and testing instructions are in [docs/BUILD_AND_PACKAGING.md](docs/BUILD_AND_PACKAGING.md).

Website download and hosting instructions are in [docs/WEBSITE_DISTRIBUTION.md](docs/WEBSITE_DISTRIBUTION.md).
