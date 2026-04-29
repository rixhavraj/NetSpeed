# Net Speed Web Project Documentation

This project is a website and backend API for distributing the Windows NetSpeed widget application.

It has two main parts:

```text
net-speed-web/
+-- frontend/   React + Vite landing page
+-- backend/    Java Spring Boot download/version API
```

## What The Frontend Does

The frontend is inside:

```text
frontend/
```

It is a Vite React application. Its job is to show a polished website for the NetSpeed Windows app.

Main frontend responsibilities:

- Shows the landing page for NetSpeed.
- Displays marketing sections such as hero, features, preview, trust, and download.
- Provides a "Download for Windows" button.
- Shows Windows compatibility text.
- Shows basic safety/trust messaging.
- Can call the backend API to get version/download information.

Important frontend files:

```text
frontend/src/App.jsx
frontend/src/pages/Home.jsx
frontend/src/components/Hero.jsx
frontend/src/components/Features.jsx
frontend/src/components/Preview.jsx
frontend/src/components/Trust.jsx
frontend/src/components/Download.jsx
frontend/src/components/Footer.jsx
frontend/src/services/api.js
```

### Frontend Tech Stack

The frontend uses:

- React
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React icons

These dependencies are listed in:

```text
frontend/package.json
```

### Frontend Entry Flow

The app starts from:

```text
frontend/src/main.jsx
```

Then it renders:

```text
frontend/src/App.jsx
```

`App.jsx` loads:

```text
frontend/src/pages/Home.jsx
```

`Home.jsx` renders the complete page:

```text
Navbar
Hero
Features
Preview
Trust
Download
Footer
```

### Frontend API File

API helper file:

```text
frontend/src/services/api.js
```

It currently uses:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

That means the frontend expects the backend to run at:

```text
http://localhost:8080
```

The frontend has a function:

```javascript
getVersionInfo()
```

This calls:

```text
GET http://localhost:8080/api/version
```

If the backend is not running, it returns fallback version data.

## What The Backend Does

The backend is inside:

```text
backend/
```

It is a Java Spring Boot application. Its job is to provide app version information and serve the Windows `.exe` download file.

Main backend responsibilities:

- Starts a Spring Boot server.
- Runs on port `8080`.
- Provides an API endpoint for latest app version info.
- Provides an API endpoint to download the Windows `.exe`.
- Counts downloads in memory while the backend process is running.
- Serves the `.exe` file from the backend downloads folder.

Important backend files:

```text
backend/pom.xml
backend/src/main/resources/application.yml
backend/src/main/java/com/app/Application.java
backend/src/main/java/com/app/controller/DownloadController.java
backend/src/main/java/com/app/service/DownloadService.java
backend/src/main/java/com/app/model/AppVersion.java
backend/src/main/resources/static/downloads/net-speed-v1.0.0.exe
```

### Backend Tech Stack

The backend uses:

- Java 17
- Spring Boot 3.2.4
- Spring Web
- Maven

The backend dependencies are listed in:

```text
backend/pom.xml
```

### Backend Configuration

Backend config file:

```text
backend/src/main/resources/application.yml
```

Current configuration:

```yaml
server:
  port: 8080

spring:
  application:
    name: backend

  servlet:
    multipart:
      max-file-size: 50MB
      max-request-size: 50MB
```

This means the backend starts at:

```text
http://localhost:8080
```

## Backend API Endpoints

### Get Latest Version

Endpoint:

```text
GET /api/version
```

Full local URL:

```text
http://localhost:8080/api/version
```

It returns JSON like:

```json
{
  "version": "1.0.0",
  "downloadUrl": "/api/downloads/net-speed-v1.0.0.exe",
  "size": "5.2MB",
  "changelog": "Initial release with real-time monitoring and lightweight performance."
}
```

This data comes from:

```text
backend/src/main/java/com/app/service/DownloadService.java
```

Method:

```java
getLatestVersion()
```

### Download EXE

Endpoint:

```text
GET /api/downloads/{fileName}
```

Current local download URL:

```text
http://localhost:8080/api/downloads/net-speed-v1.0.0.exe
```

The backend looks for the file here:

```text
backend/src/main/resources/static/downloads/
```

Current file:

```text
backend/src/main/resources/static/downloads/net-speed-v1.0.0.exe
```

When a download succeeds, the backend increments an in-memory counter and prints the count in the backend console.

Important note:

The download count is not stored in a database. It resets when the backend restarts.

## How To Start The Backend

### Requirement

Install Java 17 or newer.

Check Java:

```powershell
java -version
```

You should see Java 17 or above.

### Recommended PowerShell Command

From the project root:

```powershell
cd C:\Users\rixha\WorkSpace\FullStack\net-speed-web\backend
.\mvnw.cmd spring-boot:run
```

This uses the included Maven wrapper, so you do not need to install Maven separately.

If PowerShell blocks script execution, use:

```powershell
cd C:\Users\rixha\WorkSpace\FullStack\net-speed-web\backend
cmd /c mvnw.cmd spring-boot:run
```

### Expected Output

When the backend starts correctly, it runs on:

```text
http://localhost:8080
```

Test it in the browser:

```text
http://localhost:8080/api/version
```

You should see JSON version information.

Test the download endpoint:

```text
http://localhost:8080/api/downloads/net-speed-v1.0.0.exe
```

The browser should download the `.exe` file.

## How To Start The Frontend

Requirement:

- Node.js
- npm

From the project root:

```powershell
cd C:\Users\rixha\WorkSpace\FullStack\net-speed-web\frontend
npm install
npm run dev
```

The frontend starts at:

```text
http://localhost:5173
```

Open this URL in your browser.

## Run Both Frontend And Backend

Use two terminals.

Terminal 1, backend:

```powershell
cd C:\Users\rixha\WorkSpace\FullStack\net-speed-web\backend
.\mvnw.cmd spring-boot:run
```

Terminal 2, frontend:

```powershell
cd C:\Users\rixha\WorkSpace\FullStack\net-speed-web\frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## How To Change The App Version

Open:

```text
backend/src/main/java/com/app/service/DownloadService.java
```

Change the values inside:

```java
getLatestVersion()
```

Example:

```java
return new AppVersion(
        "1.1.0",
        "/api/downloads/net-speed-v1.1.0.exe",
        "60KB",
        "Updated widget behavior and improved taskbar placement."
);
```

Then place the matching file here:

```text
backend/src/main/resources/static/downloads/net-speed-v1.1.0.exe
```

Restart the backend after changing Java code.

## Current Frontend Download Behavior

The current `Download.jsx` button points directly to:

```text
http://localhost:5173/net-speed-v1.0.0.exe
```

That means it downloads the `.exe` from the frontend `public` folder:

```text
frontend/public/net-speed-v1.0.0.exe
```

The backend also has a download endpoint:

```text
http://localhost:8080/api/downloads/net-speed-v1.0.0.exe
```

For production, choose one approach:

1. Serve downloads from the backend API.
2. Serve downloads as static files from the frontend/public hosting.
3. Serve downloads from cloud storage or GitHub Releases.

If you want backend download counting, use the backend API download URL.

## Production Notes

Before deploying:

- Change `API_BASE_URL` in `frontend/src/services/api.js` from localhost to your real backend URL.
- Change hardcoded download links in `Download.jsx` if needed.
- Replace the `.exe` with the latest signed release.
- Use HTTPS.
- Code-sign the Windows executable to reduce SmartScreen warnings.
- Consider storing download counts in a database if you need persistent analytics.

## Quick Backend Troubleshooting

### Port 8080 Already Used

If port `8080` is busy, change this file:

```text
backend/src/main/resources/application.yml
```

Example:

```yaml
server:
  port: 8081
```

Then update the frontend API URL accordingly:

```text
frontend/src/services/api.js
```

### Java Not Found

Install Java 17 or newer, then reopen the terminal.

Check:

```powershell
java -version
```

### Backend Starts But Download Fails

Make sure the `.exe` exists here:

```text
backend/src/main/resources/static/downloads/net-speed-v1.0.0.exe
```

Also make sure the filename matches the URL returned by `DownloadService.java`.

### Frontend Cannot Fetch Version

Make sure backend is running:

```text
http://localhost:8080/api/version
```

Also check:

```text
frontend/src/services/api.js
```

The API base URL must match the backend address.
