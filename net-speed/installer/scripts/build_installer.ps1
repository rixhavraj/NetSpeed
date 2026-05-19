param(
    [ValidateSet("Debug", "Release", "RelWithDebInfo", "MinSizeRel")]
    [string]$Configuration = "Release"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$BuildScript = Join-Path $Root "scripts\build.ps1"
$WixProject = Join-Path $Root "installer\wix\installer.wixproj"
$Exe = Join-Path $Root "build\bin\NetSpeedWidget.exe"

if (-not (Test-Path $Exe)) {
    & $BuildScript -Configuration $Configuration
}

dotnet build $WixProject -c $Configuration /p:SourceDir="$Root\build\bin"

Write-Host "Installer output: $Root\installer\wix\bin\$Configuration"
