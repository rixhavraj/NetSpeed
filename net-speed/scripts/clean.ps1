$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot

foreach ($Path in @("build", "dist")) {
    $FullPath = Join-Path $Root $Path
    if (Test-Path $FullPath) {
        Remove-Item -LiteralPath $FullPath -Recurse -Force
        Write-Host "Removed $FullPath"
    }
}
