// Background service worker
// Handles context menu and other background tasks

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "analyze-with-y4yes",
        title: "Analyze '%s' with y4yes",
        contexts: ["selection", "link"]
    });
});

chrome.contextMenus.onClicked.addListener((info, _tab) => {
    if (info.menuItemId === "analyze-with-y4yes") {
        const query = info.selectionText || info.linkUrl;
        if (query) {
            chrome.tabs.create({
                url: `http://localhost:3000/supertool?q=${encodeURIComponent(query)}`
            });
        }
    }
});
