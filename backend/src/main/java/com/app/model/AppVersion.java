package com.app.model;

public class AppVersion {
    private String version;
    private String downloadUrl;
    private String size;
    private String changelog;

    public AppVersion() {}

    public AppVersion(String version, String downloadUrl, String size, String changelog) {
        this.version = version;
        this.downloadUrl = downloadUrl;
        this.size = size;
        this.changelog = changelog;
    }

    // Getters and setters
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getDownloadUrl() { return downloadUrl; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }

    public String getChangelog() { return changelog; }
    public void setChangelog(String changelog) { this.changelog = changelog; }
}
