# Website Distribution Guide

This guide explains how much storage NetSpeedWidget uses and how to make it downloadable from a website for Windows users.

## Current Storage Size

Current Release build size:

```text
build\bin\NetSpeedWidget.exe: about 54 KB
```

Current generated build folder size:

```text
build\: about 955 KB
```

The final size can change slightly depending on:

- MSVC version.
- Debug vs Release build.
- Static vs dynamic runtime settings.
- Whether the app is distributed as `.exe`, `.zip`, `.msi`, or `.msix`.
- Whether symbols, logs, or installer metadata are included.

Recommended public download format:

```text
NetSpeedWidget-portable.zip
```

The zip contains:

```text
NetSpeedWidget.exe
README.txt
```

## Can Users Download It From A Website?

Yes. Windows users can download the app from your website.

Recommended options:

1. Portable ZIP download.
2. MSI installer download.
3. MSIX package for advanced packaging or Microsoft Store distribution.

For a simple website download, use the portable ZIP first.

## Create The Website Download File

From the project root:

```powershell
cd C:\Users\rixha\WorkSpace\FullStack\net-speed
powershell -ExecutionPolicy Bypass -File .\scripts\package_portable.ps1 -Configuration Release
```

Output:

```text
dist\NetSpeedWidget-portable.zip
```

Upload this file to your website.

## Website Folder Example

On your website or hosting server:

```text
public/
+-- downloads/
    +-- NetSpeedWidget-portable.zip
```

Public download URL example:

```text
https://example.com/downloads/NetSpeedWidget-portable.zip
```

## HTML Download Button Example

Add this to your website:

```html
<a
  href="/downloads/NetSpeedWidget-portable.zip"
  download
  class="download-button"
>
  Download NetSpeedWidget for Windows
</a>
```

Plain HTML version:

```html
<a href="/downloads/NetSpeedWidget-portable.zip" download>
  Download for Windows
</a>
```

## Recommended Download Page Text

Use clear text so users know what they are downloading:

```text
NetSpeedWidget for Windows

Lightweight real-time internet speed widget for Windows 10 and Windows 11.

Download size: less than 1 MB
Format: Portable ZIP
Install required: No
Admin required: No

How to run:
1. Download the ZIP file.
2. Extract it.
3. Run NetSpeedWidget.exe.
```

## Web Server Configuration

Most web hosts automatically serve `.zip`, `.msi`, and `.msix` correctly. If your server requires manual MIME type configuration, use these:

```text
.zip   application/zip
.msi   application/octet-stream
.msix  application/msix
.appx  application/appx
```

## Nginx Configuration

Example:

```nginx
types {
    application/zip zip;
    application/octet-stream msi;
    application/msix msix;
    application/appx appx;
}

location /downloads/ {
    add_header X-Content-Type-Options nosniff;
    add_header Content-Disposition "attachment";
    try_files $uri =404;
}
```

## Apache Configuration

Example `.htaccess`:

```apache
AddType application/zip .zip
AddType application/octet-stream .msi
AddType application/msix .msix
AddType application/appx .appx

<FilesMatch "\.(zip|msi|msix|appx)$">
  Header set X-Content-Type-Options "nosniff"
</FilesMatch>
```

If the `Header` directive fails, enable Apache headers module:

```powershell
a2enmod headers
```

This command applies to Linux Apache servers. On managed hosting, use the host control panel if module control is not available.

## IIS Configuration

For Windows IIS, add MIME types in `web.config`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <staticContent>
      <mimeMap fileExtension=".zip" mimeType="application/zip" />
      <mimeMap fileExtension=".msi" mimeType="application/octet-stream" />
      <mimeMap fileExtension=".msix" mimeType="application/msix" />
      <mimeMap fileExtension=".appx" mimeType="application/appx" />
    </staticContent>
    <httpProtocol>
      <customHeaders>
        <add name="X-Content-Type-Options" value="nosniff" />
      </customHeaders>
    </httpProtocol>
  </system.webServer>
</configuration>
```

## Vercel Or Netlify

Place the zip in the public assets folder.

Vercel example:

```text
public/downloads/NetSpeedWidget-portable.zip
```

Download URL:

```text
https://your-domain.com/downloads/NetSpeedWidget-portable.zip
```

Netlify example:

```text
public/downloads/NetSpeedWidget-portable.zip
```

Optional `_headers` file:

```text
/downloads/*
  X-Content-Type-Options: nosniff
```

## GitHub Releases Option

You can also upload the ZIP to GitHub Releases and link to it from your website.

Recommended release assets:

```text
NetSpeedWidget-portable.zip
NetSpeedWidgetSetup.msi
```

Your website button can point to the GitHub release asset URL.

## Important Windows Security Notes

Unsigned `.exe`, `.zip`, or `.msi` files may show Microsoft Defender SmartScreen warnings.

For production distribution, strongly recommended:

- Buy or use a trusted code-signing certificate.
- Sign `NetSpeedWidget.exe`.
- Sign the MSI or MSIX package.
- Use HTTPS on your website.
- Provide a SHA-256 checksum on the download page.

## Generate SHA-256 Checksum

After creating the ZIP:

```powershell
Get-FileHash .\dist\NetSpeedWidget-portable.zip -Algorithm SHA256
```

Add the hash to your download page:

```text
SHA-256: <hash value>
```

This lets users verify the download was not modified.

## Code Signing

Example signing command:

```powershell
signtool sign /fd SHA256 /tr http://timestamp.digicert.com /td SHA256 /a .\build\bin\NetSpeedWidget.exe
```

Then rebuild the portable ZIP:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\package_portable.ps1 -Configuration Release
```

For MSI:

```powershell
signtool sign /fd SHA256 /tr http://timestamp.digicert.com /td SHA256 /a .\installer\wix\bin\Release\NetSpeedWidgetSetup.msi
```

## Recommended Production Release Flow

1. Build Release.
2. Sign `NetSpeedWidget.exe`.
3. Create portable ZIP.
4. Generate SHA-256 checksum.
5. Upload ZIP to website under `/downloads/`.
6. Add a download button.
7. Add version, size, checksum, and Windows compatibility text.
8. Test download in Microsoft Edge and Chrome.
9. Extract ZIP on a clean Windows machine.
10. Run `NetSpeedWidget.exe`.

## Example Website Download Section

```html
<section>
  <h2>Download NetSpeedWidget</h2>
  <p>Lightweight real-time internet speed widget for Windows 10 and Windows 11.</p>
  <p>Download size: less than 1 MB. No installer required.</p>
  <a href="/downloads/NetSpeedWidget-portable.zip" download>
    Download for Windows
  </a>
  <p>SHA-256: replace-this-with-your-generated-hash</p>
</section>
```

## User Instructions For The Download Page

Show these instructions near the button:

```text
1. Download the ZIP.
2. Right-click the ZIP and choose Extract All.
3. Open the extracted folder.
4. Double-click NetSpeedWidget.exe.
5. Use the tray icon menu to pause, exit, or enable startup.
```

## Storage Summary

Approximate storage usage:

```text
Executable only: ~54 KB
Portable ZIP: usually below 1 MB
Generated build folder: ~955 KB
Full source project with build files: size depends on local generated files
```

For website hosting, plan for less than 1 MB per downloadable portable release unless you add large assets, debug symbols, or extra documentation files.
