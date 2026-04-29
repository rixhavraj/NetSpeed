const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BACKEND;

export const getVersionInfo = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/version`);
        if (!response.ok) {
            throw new Error('Failed to fetch version info');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching version:', error);
        return {
            version: "1.0.0",
            downloadUrl: "/net-speed-v1.0.0.exe",
            size: "54KB",
            changelog: "Initial release"
        }; // Fallback
    }
};

export const getDownloadUrl = (path) => {
    if (!path) {
        return '#';
    }

    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    if (path.startsWith('/api')) {
        return `${API_BASE_URL.replace(/\/api$/, '')}${path}`;
    }

    return path;
};
