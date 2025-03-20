// Function to extract game keys
function extractGameKeys() {
    const keyRedeemers = document.querySelectorAll(".key-redeemer");
    const gameKeys = [];

    keyRedeemers.forEach(redeemer => {
        const gameTitle = redeemer.querySelector(".heading-text h4")?.textContent.trim();
        const keyValue = redeemer.querySelector(".keyfield-value")?.textContent.trim();
        const monthDetails = document.querySelector('title').textContent.trim().split(' ')?.slice(1,3);

        if (gameTitle && keyValue) {
            gameKeys.push({ gameTitle, keyValue, Month: monthDetails?.[0], Year: monthDetails?.[1]});
        }
    });

    return gameKeys;
}

// Function to extract game keys
function extractGameTitle() {
    const keyRedeemers = document.querySelectorAll(".content-choice");
    const gameKeys = [];

    keyRedeemers.forEach(redeemer => {
        const gameTitle = redeemer.querySelector(".content-choice-title")?.textContent.trim();
        const monthDetails = document.querySelector('title').textContent.trim().split(' ')?.slice(0,2);

        if (gameTitle) {
            gameKeys.push({ gameTitle, keyValue: "", Month: monthDetails?.[0], Year: monthDetails?.[1]});
        }
    });

    return gameKeys;
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractKeys") {
        console.log("Extracting game keys");
        const gameKeys = extractGameKeys();
        sendResponse({ gameKeys });
        return true; // Keep the message channel open for async response
    }
    if (request.action === "extractGameTitle") {
        console.log("Extracting game title");
        const gameTitle = extractGameTitle();
        sendResponse({ gameTitle });
        return true; // Keep the message channel open for async response
    }
}); 