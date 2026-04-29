# Production Deployment Guide

This guide covers production deployment for both projects:

```text
net-speed/       Native Windows desktop app
net-speed-web/   Website frontend + Spring Boot backend
```

## Recommended Production Setup

Use this setup first:

```text
Windows app artifact: GitHub Releases or backend /api/downloads
Frontend website:     Vercel
Backend API:          Railway
Domain:               Your custom domain
```

Good starting deployment:

```text
https://netspeed.yourdomain.com        -> Vercel frontend
https://api-netspeed.yourdomain.com    -> Railway backend
```

Recommended long-term Windows distribution:

```text
Microsoft Store MSIX package
```

Microsoft Store MSIX distribution is the cleanest Windows path because Microsoft signs/re-signs Store MSIX packages after certification. For direct website downloads, sign the `.exe`, `.msi`, or `.msix` yourself to reduce SmartScreen warnings.

## What Was Made Production Ready

Backend changes:

- Environment-driven backend config.
- `PORT` support for cloud hosts.
- Restricted CORS through `APP_CORS_ALLOWED_ORIGINS`.
- `/api/health` endpoint for deploy health checks.
- Version metadata comes from environment variables.
- Download file serving works from packaged JAR resources or an external download directory.
- Safer filename validation for download requests.
- Download response headers include attachment and `X-Content-Type-Options: nosniff`.
- Dockerfile added for container deployment.

Frontend changes:

- `VITE_API_BASE_URL` support.
- Download section now reads backend version metadata.
- Download URL is no longer hardcoded to localhost.
- Vercel SPA rewrite and basic security headers added.
- Node engine requirement added.

Release tooling:

- `scripts/sync-desktop-release.ps1` copies the built Windows `.exe` into backend and frontend release folders.

## Build The Windows Desktop App

From:

```powershell
cd C:\Users\rixha\WorkSpace\FullStack\net-speed
```

Build:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\build.ps1 -Configuration Release
```

Output:

```text
net-speed\build\bin\NetSpeedWidget.exe
```

Optional portable ZIP:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package_portable.ps1 -Configuration Release
```

Output:

```text
net-speed\dist\NetSpeedWidget-portable.zip
```

## Sync Desktop App Into Website Backend

From:

```powershell
cd C:\Users\rixha\WorkSpace\FullStack\net-speed-web
```

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\sync-desktop-release.ps1 -Version 1.0.0
```

This copies:

```text
net-speed\build\bin\NetSpeedWidget.exe
```

to:

```text
net-speed-web\backend\src\main\resources\static\downloads\net-speed-v1.0.0.exe
net-speed-web\frontend\public\net-speed-v1.0.0.exe
```

## Backend Local Production Build

From:

```powershell
cd C:\Users\rixha\WorkSpace\FullStack\net-speed-web\backend
```

Build:

```powershell
$env:JAVA_HOME = "C:\Program Files\Java\jdk-23"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
cmd /c mvnw.cmd -DskipTests package
```

Run packaged JAR:

```powershell
java -jar target\backend-0.0.1-SNAPSHOT.jar
```

Health check:

```text
http://localhost:8080/api/health
```

Version endpoint:

```text
http://localhost:8080/api/version
```

Download endpoint:

```text
http://localhost:8080/api/downloads/net-speed-v1.0.0.exe
```

## Frontend Local Production Build

Use Node `22.13.0` or newer.

From:

```powershell
cd C:\Users\rixha\WorkSpace\FullStack\net-speed-web\frontend
```

Install and build:

```powershell
cmd /c npm install
cmd /c npm run build
```

Output:

```text
frontend\dist
```

## Backend Environment Variables

Set these in your backend host:

```text
PORT=8080
APP_VERSION=1.0.0
APP_DOWNLOAD_URL=/api/downloads/net-speed-v1.0.0.exe
APP_FILE_NAME=net-speed-v1.0.0.exe
APP_FILE_SIZE=54KB
APP_CHANGELOG=Initial release with real-time monitoring and lightweight performance.
APP_CORS_ALLOWED_ORIGINS=https://netspeed.yourdomain.com
APP_DOWNLOAD_DIR=
```

Leave `APP_DOWNLOAD_DIR` empty if the `.exe` is bundled inside the backend JAR at:

```text
src/main/resources/static/downloads/
```

Use `APP_DOWNLOAD_DIR` only if your server stores downloads in an external folder or mounted volume.

## Frontend Environment Variables

Set this in Vercel:

```text
VITE_API_BASE_URL=https://api-netspeed.yourdomain.com/api
```

For local development:

```text
VITE_API_BASE_URL=http://localhost:8080/api
```

## Deploy Frontend To Vercel

Recommended because the frontend is a static Vite app.

Steps:

1. Push repo to GitHub.
2. Open Vercel.
3. Import the GitHub repo.
4. Set root directory:

```text
net-speed-web/frontend
```

5. Set build command:

```text
npm run build
```

6. Set output directory:

```text
dist
```

7. Add environment variable:

```text
VITE_API_BASE_URL=https://api-netspeed.yourdomain.com/api
```

8. Deploy.
9. Add your custom frontend domain.

## Deploy Backend To Railway

Recommended first backend host because it has a direct Spring Boot deployment flow and supports Dockerfile deployment.

Steps:

1. Push repo to GitHub.
2. Open Railway.
3. Create a new project from GitHub.
4. Select the repository.
5. Set service root directory:

```text
net-speed-web/backend
```

6. Railway can deploy with the included Dockerfile.
7. Add environment variables:

```text
APP_CORS_ALLOWED_ORIGINS=https://netspeed.yourdomain.com
APP_VERSION=1.0.0
APP_DOWNLOAD_URL=/api/downloads/net-speed-v1.0.0.exe
APP_FILE_NAME=net-speed-v1.0.0.exe
APP_FILE_SIZE=54KB
APP_CHANGELOG=Initial release with real-time monitoring and lightweight performance.
```

8. Generate a public domain in Railway networking settings.
9. Test:

```text
https://your-railway-url/api/health
https://your-railway-url/api/version
```

10. Put the Railway URL into Vercel as `VITE_API_BASE_URL`.

## Deploy Backend To Render Alternative

Render is also suitable.

Use Web Service.

If using Docker:

```text
Root directory: net-speed-web/backend
Dockerfile:     backend/Dockerfile
```

If using native Java commands:

```text
Root directory: net-speed-web/backend
Build command:  ./mvnw -DskipTests package
Start command:  java -jar target/backend-0.0.1-SNAPSHOT.jar
```

Set the same environment variables as Railway.

## Deploy The Windows App Itself

You have three practical options.

### Option 1: Website Download

Use the backend endpoint:

```text
https://api-netspeed.yourdomain.com/api/downloads/net-speed-v1.0.0.exe
```

The frontend button already reads this from `/api/version`.

Best for early testing.

Production warning:

- Unsigned `.exe` downloads can trigger SmartScreen.
- Sign the executable before public release.

### Option 2: GitHub Releases

Upload:

```text
NetSpeedWidget-portable.zip
NetSpeedWidget.exe
NetSpeedWidgetSetup.msi
```

Then set:

```text
APP_DOWNLOAD_URL=https://github.com/YOUR_NAME/YOUR_REPO/releases/download/v1.0.0/NetSpeedWidget-portable.zip
```

Best for simple public releases.

### Option 3: Microsoft Store

Use MSIX for the long-term production channel.

Best for trust and Windows-native installation.

You already have MSIX starter files in:

```text
net-speed\packaging\msix
```

Before Store submission:

1. Replace package identity values.
2. Replace final artwork.
3. Build the app.
4. Create MSIX package.
5. Validate with Windows App Certification Kit.
6. Submit through Partner Center.

## Code Signing Checklist

For public website downloads:

1. Get a trusted code-signing certificate or use Microsoft's trusted signing option where available.
2. Sign `NetSpeedWidget.exe`.
3. Sign the MSI or MSIX package if distributing those directly.
4. Timestamp signatures.
5. Publish SHA-256 hashes.
6. Use HTTPS.

Example:

```powershell
signtool sign /fd SHA256 /tr http://timestamp.digicert.com /td SHA256 /a .\build\bin\NetSpeedWidget.exe
```

## Final Production Checklist

- Build `net-speed` Release.
- Sign the Windows executable.
- Sync the signed executable into `net-speed-web`.
- Build backend JAR.
- Build frontend.
- Deploy backend to Railway or Render.
- Deploy frontend to Vercel.
- Set `APP_CORS_ALLOWED_ORIGINS` to frontend domain.
- Set `VITE_API_BASE_URL` to backend API domain.
- Test `/api/health`.
- Test `/api/version`.
- Test download button from deployed website.
- Add custom domains.
- Add privacy policy and terms if publishing publicly.
- Move to Microsoft Store MSIX when ready for broad distribution.

## Official References Used

- Vercel Vite deployment docs: https://vercel.com/docs/frameworks/frontend/vite
- Vercel environment variables docs: https://vercel.com/docs/environment-variables
- Railway Spring Boot deployment docs: https://docs.railway.com/guides/spring-boot
- Render deploy docs: https://render.com/docs/deploys/
- Microsoft Windows code signing options: https://learn.microsoft.com/en-us/windows/apps/package-and-deploy/code-signing-options
