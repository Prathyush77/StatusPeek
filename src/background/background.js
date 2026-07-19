console.log("🚀 StatusPeek Background Service Worker Started");

/**
 * Check the HTTP status of a website.
 * @param {chrome.tabs.Tab} tab
 */
async function checkWebsiteStatus(tab) {
    console.log("----------------------------------");
    console.log("Checking Website Status...");
    console.log(tab);

    // Ignore unsupported URLs
    if (
        !tab.url ||
        (
            !tab.url.startsWith("http://") &&
            !tab.url.startsWith("https://")
        )
    ) {
        console.log("❌ Unsupported URL");

        // Clear the badge
        await chrome.action.setBadgeText({
            text: ""
        });

        return;
    }

    try {
        const response = await fetch(tab.url);

        const status = response.status;
        const statusGroup = Math.floor(status / 100);

        // Show the status code
        await chrome.action.setBadgeText({
            text: status.toString()
        });

        // Set badge color based on status code family
        switch (statusGroup) {
            case 2:
                await chrome.action.setBadgeBackgroundColor({
                    color: "#16a34a" // Green
                });
                break;

            case 3:
                await chrome.action.setBadgeBackgroundColor({
                    color: "#2563eb" // Blue
                });
                break;

            case 4:
                await chrome.action.setBadgeBackgroundColor({
                    color: "#f97316" // Orange
                });
                break;

            case 5:
                await chrome.action.setBadgeBackgroundColor({
                    color: "#dc2626" // Red
                });
                break;

            default:
                await chrome.action.setBadgeBackgroundColor({
                    color: "#6b7280" // Gray
                });
        }

        console.log("🌐 URL:", tab.url);
        console.log("📄 Title:", tab.title);
        console.log("✅ HTTP Status:", status);

    } catch (error) {

        console.error("❌ Fetch Failed:", error);

        // Clear badge if request fails
        await chrome.action.setBadgeText({
            text: ""
        });
    }
}

/**
 * Fires when the active tab changes.
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        checkWebsiteStatus(tab);
    });
});

/**
 * Fires when a tab is updated.
 */
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    // Only check after the page has fully loaded
    if (changeInfo.status === "complete") {
        checkWebsiteStatus(tab);
    }

});