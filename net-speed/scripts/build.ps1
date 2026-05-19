param(
    [ValidateSet("Debug", "Release", "RelWithDebInfo", "MinSizeRel")]
    [string]$Configuration = "Release",
    [string]$Generator = "",
    [string]$Architecture = "x64"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$BuildDir = Join-Path $Root "build"

function Resolve-CMake {
    $Command = Get-Command cmake -ErrorAction SilentlyContinue
    if ($Command) {
        return $Command.Source
    }

    $CandidateRoots = @(
        "$env:ProgramFiles\Microsoft Visual Studio",
        "${env:ProgramFiles(x86)}\Microsoft Visual Studio",
        "$env:ProgramFiles\CMake\bin"
    )

    foreach ($CandidateRoot in $CandidateRoots) {
        if (-not $CandidateRoot -or -not (Test-Path $CandidateRoot)) {
            continue
        }

        $Candidate = Get-ChildItem -Path $CandidateRoot -Recurse -Filter cmake.exe -ErrorAction SilentlyContinue |
            Select-Object -First 1
        if ($Candidate) {
            return $Candidate.FullName
        }
    }

    return $null
}

$CMake = Resolve-CMake
if (-not $CMake) {
    throw @"
CMake was not found.

Install one of these, then run this script again:
  1. Visual Studio 2022 with "Desktop development with C++" and "C++ CMake tools for Windows"
  2. Standalone CMake: winget install Kitware.CMake

After installing, restart VS Code or open "Developer PowerShell for VS 2022".
"@
}

# Auto-detect generator if not explicitly provided
if (-not $Generator) {
    $VSWhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
    $HasVSCxx = $false
    if (Test-Path $VSWhere) {
        $VSInstance = & $VSWhere -latest -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
        if ($VSInstance) {
            $HasVSCxx = $true
        }
    }

    if ($HasVSCxx) {
        $Generator = "Visual Studio 18 2026"
    } else {
        $Generator = "MinGW Makefiles"
    }
}

Write-Host "Configuring and building using generator: $Generator"

if ($Generator -like "Visual Studio*") {
    & $CMake -S $Root -B $BuildDir -G $Generator -A $Architecture
} else {
    & $CMake -S $Root -B $BuildDir -G $Generator
}

if ($LASTEXITCODE -ne 0) {
    throw "CMake configure failed with exit code $LASTEXITCODE."
}

& $CMake --build $BuildDir --config $Configuration
if ($LASTEXITCODE -ne 0) {
    throw "Build failed with exit code $LASTEXITCODE."
}

Write-Host "Built: $BuildDir\bin\NetSpeedWidget.exe"
