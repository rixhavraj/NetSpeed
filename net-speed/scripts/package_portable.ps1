param(
    [ValidateSet("Debug", "Release", "RelWithDebInfo", "MinSizeRel")]
    [string]$Configuration = "Release"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$Exe = Join-Path $Root "build\bin\NetSpeedWidget.exe"

if (-not (Test-Path $Exe)) {
    & (Join-Path $PSScriptRoot "build.ps1") -Configuration $Configuration
}

$PortableDir = Join-Path $Root "dist\portable"
$ZipPath = Join-Path $Root "dist\NetSpeedWidget-portable.zip"
New-Item -ItemType Directory -Force -Path $PortableDir | Out-Null
Copy-Item -LiteralPath $Exe -Destination $PortableDir -Force

@"
NetSpeedWidget Portable

Run NetSpeedWidget.exe.
Settings are stored in HKCU\Software\NetSpeedWidget.
Use the tray menu to exit, pause monitoring, and toggle Windows startup.
"@ | Set-Content -Path (Join-Path $PortableDir "README.txt") -Encoding UTF8

if (Test-Path $ZipPath) {
    Remove-Item -LiteralPath $ZipPath -Force
}

Compress-Archive -Path (Join-Path $PortableDir "*") -DestinationPath $ZipPath -Force

Write-Host "Portable package: $PortableDir"
Write-Host "Website download zip: $ZipPath"
