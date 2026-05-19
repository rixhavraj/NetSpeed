param(
    [Parameter(Mandatory=$true)]
    [string]$Version,

    [Parameter(Mandatory=$true)]
    [string]$Changelog
)

$ErrorActionPreference = 'Stop'

# Determine workspace directories
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$WorkspaceDir = (Get-Item $ScriptDir).Parent.FullName
$NetSpeedWebDir = Join-Path $WorkspaceDir "net-speed-web"
$NetSpeedDir = Join-Path $WorkspaceDir "net-speed"

$ExeSource = Join-Path $NetSpeedDir "dist\portable\NetSpeedWidget.exe"
$ExeDest = Join-Path $NetSpeedWebDir "frontend\public\net-speed-v$Version.exe"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Publishing NetSpeed v$Version" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (-not (Test-Path $ExeSource)) {
    Write-Error "Could not find built executable at $ExeSource. Please build the app first."
    exit 1
}

# 1. Copy the executable to the website's public folder and backend resources
Write-Host "[1/5] Copying executable to website and backend..." -ForegroundColor Yellow
Copy-Item -Path $ExeSource -Destination $ExeDest -Force

$BackendDestDir = Join-Path $NetSpeedWebDir "backend\src\main\resources\static\downloads"
if (-not (Test-Path $BackendDestDir)) {
    New-Item -ItemType Directory -Path $BackendDestDir -Force | Out-Null
}
$BackendDest = Join-Path $BackendDestDir "net-speed-v$Version.exe"
Copy-Item -Path $ExeSource -Destination $BackendDest -Force

# Note: Cleanup of old versions is removed to support downloading older versions from history

# 2. Update React Frontend Configurations (versions.json)
Write-Host "[3/5] Updating frontend version configurations..." -ForegroundColor Yellow

$VersionsJsonPath = Join-Path $NetSpeedWebDir "frontend\src\data\versions.json"
$VersionsData = Get-Content $VersionsJsonPath -Raw | ConvertFrom-Json

$FileSize = (Get-Item $ExeDest).Length
$FileSizeKB = [math]::Round($FileSize / 1KB)

$NewVersion = [PSCustomObject]@{
    version = $Version
    date = (Get-Date).ToString("MMM dd, yyyy")
    changes = @($Changelog)
    downloadUrl = "/net-speed-v$Version.exe"
    size = "$FileSizeKB`KB"
}

# Prepend the new version to the array
$NewVersionsData = @($NewVersion) + $VersionsData
$NewVersionsData | ConvertTo-Json -Depth 5 | Set-Content -Path $VersionsJsonPath

# 3. Update Spring Boot Backend Configuration
Write-Host "[4/5] Updating backend version configurations..." -ForegroundColor Yellow
$AppYmlPath = Join-Path $NetSpeedWebDir "backend\src\main\resources\application.yml"
$AppYmlContent = Get-Content $AppYmlPath -Raw
$AppYmlContent = $AppYmlContent -replace 'version:\s*\$\{APP_VERSION:.*?\}', "version: `$`{APP_VERSION:$Version`}"
$AppYmlContent = $AppYmlContent -replace 'download-url:\s*\$\{APP_DOWNLOAD_URL:.*?\}', "download-url: `$`{APP_DOWNLOAD_URL:/api/downloads/net-speed-v$Version.exe`}"
$AppYmlContent = $AppYmlContent -replace 'file-name:\s*\$\{APP_FILE_NAME:.*?\}', "file-name: `$`{APP_FILE_NAME:net-speed-v$Version.exe`}"
$AppYmlContent = $AppYmlContent -replace 'changelog:\s*\$\{APP_CHANGELOG:.*?\}', "changelog: `$`{APP_CHANGELOG:$Changelog`}"
Set-Content -Path $AppYmlPath -Value $AppYmlContent -NoNewline

# 4. Commit and Push
Write-Host "[5/5] Committing and pushing to GitHub..." -ForegroundColor Yellow
Set-Location $NetSpeedWebDir
git add .
git commit -m "feat: release v$Version - $Changelog"
git push origin main
Set-Location $NetSpeedDir

Write-Host "========================================" -ForegroundColor Green
Write-Host " Successfully published v$Version! The website will now automatically deploy." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
