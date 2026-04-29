package com.app.controller;

import com.app.config.DownloadProperties;
import com.app.model.AppVersion;
import com.app.service.DownloadService;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;

@RestController
@RequestMapping("/api")
public class DownloadController {

    private final DownloadService downloadService;
    private final DownloadProperties properties;

    public DownloadController(DownloadService downloadService, DownloadProperties properties) {
        this.downloadService = downloadService;
        this.properties = properties;
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ok");
    }

    @GetMapping("/version")
    public ResponseEntity<AppVersion> getVersion() {
        return ResponseEntity.ok(downloadService.getLatestVersion());
    }

    @GetMapping("/downloads/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        try {
            if (!Paths.get(fileName).getFileName().toString().equals(fileName)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }

            Resource resource = resolveDownload(fileName);

            if (resource.exists()) {
                downloadService.incrementDownloadCount();
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType("application/octet-stream"))
                        .cacheControl(CacheControl.maxAge(Duration.ofHours(12)).cachePublic())
                        .header("X-Content-Type-Options", "nosniff")
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private Resource resolveDownload(String fileName) throws Exception {
        String downloadDir = properties.getDownloadDir();
        if (downloadDir != null && !downloadDir.isBlank()) {
            Path basePath = Paths.get(downloadDir).toAbsolutePath().normalize();
            Path filePath = basePath.resolve(fileName).normalize();
            if (!filePath.startsWith(basePath)) {
                throw new IllegalArgumentException("Invalid file path");
            }
            return new UrlResource(filePath.toUri());
        }

        return new ClassPathResource("static/downloads/" + fileName);
    }
}
