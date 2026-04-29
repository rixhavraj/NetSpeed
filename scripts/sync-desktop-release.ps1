param(
    [string]$Version = "1.0.0"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$WorkspaceRoot = Split-Path -Parent $Root
$DesktopExe = Join-Path $WorkspaceRoot "net-speed\build\bin\NetSpeedWidget.exe"

if (-not (Test-Path $DesktopExe)) {
    throw "Desktop executable not found: $DesktopExe. Build net-speed first."
}

$FileName = "net-speed-v$Version.exe"
$BackendDownloads = Join-Path $Root "backend\src\main\resources\static\downloads"
$FrontendPublic = Join-Path $Root "frontend\public"

New-Item -ItemType Directory -Force -Path $BackendDownloads | Out-Null
New-Item -ItemType Directory -Force -Path $FrontendPublic | Out-Null

Copy-Item -LiteralPath $DesktopExe -Destination (Join-Path $BackendDownloads $FileName) -Force
Copy-Item -LiteralPath $DesktopExe -Destination (Join-Path $FrontendPublic $FileName) -Force

$SizeKb = [Math]::Ceiling((Get-Item $DesktopExe).Length / 1KB)

Write-Host "Synced $FileName"
Write-Host "Backend:  $BackendDownloads"
Write-Host "Frontend: $FrontendPublic"
Write-Host "Set APP_FILE_SIZE=${SizeKb}KB and APP_FILE_NAME=$FileName in production."
