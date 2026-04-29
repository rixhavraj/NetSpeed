# NetSpeed Downloader Website

A high-conversion, premium landing page and backend API for the NetSpeed Windows desktop application.

Detailed frontend/backend documentation and backend start commands are in `PROJECT_DOCUMENTATION.md`.

Production deployment instructions for `net-speed` and `net-speed-web` are in `PRODUCTION_DEPLOYMENT.md`.

## 🚀 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Java, Spring Boot
- **Design**: Dark theme, Glassmorphism, Minimalist

## 📂 Project Structure
- `/frontend` - Vite React App
- `/backend` - Spring Boot Java Application

---

## 🏃‍♂️ How to Run Locally

### 1. Run the Backend (Spring Boot)
Ensure you have Java 17+ installed.
```bash
cd backend
mvn spring-boot:run
```
*(The backend will start on `http://localhost:8080`)*

### 2. Run the Frontend (Vite)
Ensure you have Node.js installed.
```bash
cd frontend
npm install
npm run dev
```
*(The frontend will start on `http://localhost:5173`. Open this URL in your browser.)*

---

## 🔄 How to Update App Version & Replace `.exe`

### 1. Updating Version Info
To update the version, size, or changelog, open the following file:
`backend/src/main/java/com/app/service/DownloadService.java`

Update the values in the `getLatestVersion()` method:
```java
public AppVersion getLatestVersion() {
    return new AppVersion(
            "1.1.0", // New Version
            "/api/downloads/net-speed-v1.1.0.exe", // New URL
            "5.5MB", // New Size
            "Added new theme colors." // New Changelog
    );
}
```

### 2. Replacing the `.exe` File
Place the new `.exe` file into the backend's static directory:
`backend/src/main/resources/static/downloads/`

Example: If you set the download URL to `/api/downloads/net-speed-v1.1.0.exe`, ensure a file named `net-speed-v1.1.0.exe` exists in the `downloads` folder.

---

## 🌐 Deployment Steps

### Frontend Deployment (Vercel / Netlify)
1. Ensure your code is pushed to GitHub.
2. Go to Vercel or Netlify and "Add New Project".
3. Select your repository.
4. Set the **Root Directory** to `frontend`.
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click **Deploy**.

> **Note**: Update `API_BASE_URL` in `frontend/src/services/api.js` to point to your live backend URL before deploying!

### Backend Deployment (Render / Railway / VPS)
1. Push your code to GitHub.
2. Go to Render.com and create a new **Web Service**.
3. Select your repository.
4. Set the **Root Directory** to `backend`.
5. Environment: `Java` / `Maven`
6. Build command: `mvn clean package`
7. Start command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
8. Deploy!

### Alternative Cloud Storage for the `.exe`
If the `.exe` file becomes too large to store in the GitHub repo/Backend container:
1. Upload the `.exe` to an AWS S3 Bucket or GitHub Releases.
2. Update the `downloadUrl` in `DownloadService.java` to point directly to the S3 URL (e.g., `https://my-bucket.s3.amazonaws.com/net-speed.exe`).
