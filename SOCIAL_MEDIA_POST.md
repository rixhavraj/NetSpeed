# ⚡ Introducing NetSpeed: The Ultra-Lightweight Network Monitor

**Live Website:** [rixhavraj.github.io/NetSpeed](https://rixhavraj.github.io/NetSpeed/)
**GitHub Repository:** [github.com/rixhavraj/NetSpeed](https://github.com/rixhavraj/NetSpeed)

---

## 📌 TL;DR (Summary)
I was tired of bloated, resource-heavy system monitors, so I built **NetSpeed** — a beautifully minimal, native Windows desktop widget that tracks your real-time internet speed. It comes with a sleek glassmorphic landing page and a robust backend. The entire Windows app is a tiny **54KB nano-build** with **zero telemetry** and zero background bloat. 

---

## 📖 The Story (Why I Built This)
Have you ever wondered if your internet is actually lagging, or if it's just the game server? I did. 

I looked for tools to monitor my network speed, but most of them were packed with unnecessary features, heavy UI frameworks, or worse—background analytics that drain system resources. I didn't want a massive dashboard; I just wanted to see my current upload and download speeds at a glance.

So, I decided to build my own from scratch. The goal was simple: **Maximum performance, minimum footprint.**

## 🛠️ What is NetSpeed?
The NetSpeed project consists of three main parts:

### 1. The Windows Desktop App (The Core)
*   **Ultra-Lightweight:** Written in native C++ using the Win32 API. No heavy Electron frameworks, no bloated web-views.
*   **Tiny Footprint:** The entire compiled executable is only **54KB**. 
*   **Always-on-top Widget:** A sleek, transparent floating widget that seamlessly blends into your Windows desktop environment.
*   **Privacy First:** Absolutely zero telemetry, tracking, or background data collection.

### 2. The Landing Page (The Frontend)
*   A premium, modern web interface built with **React** and **Vite**.
*   Designed with deep dark-mode aesthetics, subtle glassmorphism (`backdrop-blur`), and dynamic micro-animations using **Framer Motion**.
*   Hosted entirely for free on **GitHub Pages** using automated GitHub Actions deployment.

### 3. The API (The Backend)
*   A robust **Java Spring Boot (Java 17)** backend server.
*   Handles version control, tracks total download counts, and serves the latest application files securely.
*   Dockerized and deployed on **Render** with seamless CORS integration to talk to the frontend.

---

## 🚀 The Tech Stack
Building a true full-stack project meant picking the right tool for the right job:
*   **Desktop App:** C++, CMake, Win32 API, Iphlpapi (for network metrics).
*   **Frontend:** React 19, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons.
*   **Backend:** Java 17, Spring Boot 3.2, Maven.
*   **DevOps:** Docker, GitHub Actions (CI/CD), Render, GitHub Pages.

---

## 💡 Lessons Learned
Building the Windows app taught me a lot about low-level memory management and interacting directly with the Windows networking APIs. On the web side, getting GitHub Actions to perfectly orchestrate the build process and inject environment variables for a Render backend was an incredibly rewarding DevOps challenge.

## 📥 Try it out!
If you are on Windows 10 or 11, you can download the widget right now directly from the website. Let me know what you think of the design and performance!

👉 **[Download NetSpeed Here](https://rixhavraj.github.io/NetSpeed/)**

*(Note: Since it's a brand new custom executable, Windows SmartScreen might give you a warning. Just click "More info" -> "Run anyway" to install it safely!)*
