// Function to extract game keys
function extractGameKeys() {
    const keyRedeemers = document.querySelectorAll(".key-redeemer");
    const gameKeys = [];
    const monthDetails = document.querySelector('title').textContent.trim().split(' ')?.slice(1,3);

    keyRedeemers.forEach(redeemer => {
        const gameTitle = redeemer.querySelector(".heading-text h4")?.textContent.trim();
        const keyValue = redeemer.querySelector(".keyfield-value")?.textContent.trim();

        if (gameTitle && keyValue) {
            gameKeys.push({ 
                gameTitle, 
                keyValue,
                steamPrice: null, // Will be populated later
                Month: monthDetails?.[0],
                Year: monthDetails?.[1]
            });
        }
    });

    return gameKeys;
}

// Function to extract game keys
function extractGameTitle() {
    const keyRedeemers = document.querySelectorAll(".content-choice");
    const gameKeys = [];
    const monthDetails = document.querySelector('title').textContent.trim().split(' ')?.slice(0,2);

    keyRedeemers.forEach(redeemer => {
        const gameTitle = redeemer.querySelector(".content-choice-title")?.textContent.trim();

        if (gameTitle) {
            gameKeys.push({ 
                gameTitle, 
                keyValue: "", 
                Month: monthDetails?.[0], 
                Year: monthDetails?.[1],
                steamPrice: null // Will be populated later
            });
        }
    });

    return gameKeys;
}

// Function to fetch Steam price using background script
async function fetchSteamPrice(gameName) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            { action: "fetchSteamPrice", gameName },
            response => resolve(response?.price || 'N/A')
        );
    });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "extractKeys") {
        console.log("Extracting game keys");
        const gameKeys = extractGameKeys();
        
        // Fetch Steam prices for all games
        Promise.all(gameKeys.map(async (game) => {
            game.steamPrice = await fetchSteamPrice(game.gameTitle);
            return game;
        })).then(updatedGameKeys => {
            sendResponse({ gameKeys: updatedGameKeys });
        });
        
        return true; // Keep the message channel open for async response
    }
    if (request.action === "extractGameTitle") {
        console.log("Extracting game title");
        const gameTitle = extractGameTitle();
        
        // Fetch Steam prices for all games
        Promise.all(gameTitle.map(async (game) => {
            game.steamPrice = await fetchSteamPrice(game.gameTitle);
            return game;
        })).then(updatedGameKeys => {
            sendResponse({ gameTitle: updatedGameKeys });
        });
        
        return true; // Keep the message channel open for async response
    }
}); 