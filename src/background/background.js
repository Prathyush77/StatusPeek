console.log("🚀 StatusPeek Background Service Worker Started");

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, async (tab) => {

        console.log(tab);

        if (
            !tab.url ||
            (
                !tab.url.startsWith("http://") &&
                !tab.url.startsWith("https://")
            )
        ) {
            console.log("Unsupported URL");
            return;
        }

        try {
            const response = await fetch(tab.url);
            console.log("HTTP Status:", response.status);
        } catch (error) {
            console.error("Fetch Failed:", error);
        }

    });
});