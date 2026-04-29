package com.app.service;

import com.app.config.DownloadProperties;
import com.app.model.AppVersion;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

@Service
public class DownloadService {

    private final AtomicInteger downloadCount = new AtomicInteger(0);
    private final DownloadProperties properties;

    public DownloadService(DownloadProperties properties) {
        this.properties = properties;
    }

    public AppVersion getLatestVersion() {
        return new AppVersion(
                properties.getVersion(),
                properties.getDownloadUrl(),
                properties.getFileSize(),
                properties.getChangelog()
        );
    }

    public void incrementDownloadCount() {
        downloadCount.incrementAndGet();
        System.out.println("Total downloads: " + downloadCount.get());
    }
}
