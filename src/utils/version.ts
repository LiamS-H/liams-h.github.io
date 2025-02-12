type BrowserRequirement = {
    version: number;
    requiresDev?: boolean;
};

type BrowserVersions = {
    [key: string]: BrowserRequirement;
};

const isOutdated = (): boolean => {
    // Example: chrome requires v88+, firefox needs nightly 120+
    const minimumVersions: BrowserVersions = {
        chrome: { version: 115 },
        firefox: { version: 0, requiresDev: true },
        safari: { version: 0, requiresDev: true },
        edge: { version: 115 },
        opera: { version: 101 },
    };

    const ua = navigator.userAgent;

    // Chrome and Chrome-based
    if (/Chrome/.test(ua) && !/Chromium|Edge/.test(ua)) {
        const req = minimumVersions.chrome;
        const versionMatch = ua.match(/Chrome\/([\d.]+)/)?.[1];
        const isDevBuild = versionMatch?.includes(".");

        if (req.requiresDev && !isDevBuild) {
            return true; // Outdated because we need a dev build
        }

        if (isDevBuild) {
            return false; // Dev build is considered up to date
        }

        return parseInt(versionMatch || "0") < req.version;
    }

    // Firefox
    if (/Firefox/.test(ua)) {
        const req = minimumVersions.firefox;
        const versionMatch = ua.match(/Firefox\/([\d.]+)/)?.[1];
        const isDevBuild =
            versionMatch?.includes(".") || /(a|b)/.test(versionMatch || "");

        if (req.requiresDev && !isDevBuild) {
            return true; // Outdated because we need a dev build
        }

        if (isDevBuild) {
            return false; // Dev build is considered up to date
        }

        return parseInt(versionMatch || "0") < req.version;
    }

    // Safari
    if (/Safari/.test(ua) && !/Chrome/.test(ua)) {
        const req = minimumVersions.safari;
        const versionMatch = ua.match(/Version\/([\d.]+)/)?.[1];
        const isDevBuild =
            versionMatch?.includes("Technology Preview") ||
            versionMatch?.includes(".");

        if (req.requiresDev && !isDevBuild) {
            return true; // Outdated because we need a dev build
        }

        if (isDevBuild) {
            return false; // Dev build is considered up to date
        }

        return parseInt(versionMatch || "0") < req.version;
    }

    // Edge
    if (/Edg/.test(ua)) {
        const req = minimumVersions.edge;
        const versionMatch = ua.match(/Edg\/([\d.]+)/)?.[1];
        const isDevBuild = versionMatch?.includes(".");

        if (req.requiresDev && !isDevBuild) {
            return true; // Outdated because we need a dev build
        }

        if (isDevBuild) {
            return false; // Dev build is considered up to date
        }

        return parseInt(versionMatch || "0") < req.version;
    }

    // Opera
    if (/OPR/.test(ua)) {
        const req = minimumVersions.opera;
        const versionMatch = ua.match(/OPR\/([\d.]+)/)?.[1];
        const isDevBuild = versionMatch?.includes(".");

        if (req.requiresDev && !isDevBuild) {
            return true; // Outdated because we need a dev build
        }

        if (isDevBuild) {
            return false; // Dev build is considered up to date
        }

        return parseInt(versionMatch || "0") < req.version;
    }

    return true; // Unknown browser - return true to be safe
};

export default isOutdated;
