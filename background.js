// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchSteamPrice") {
        fetchSteamPrice(request.gameName)
            .then(price => sendResponse({ price }))
            .catch(error => {
                console.error('Error fetching Steam price:', error);
                sendResponse({ price: 'N/A' });
            });
        return true; // Keep the message channel open for async response
    }
});

// Function to extract price from HTML string using regex
function extractPriceFromHTML(html, gameName) {
    try {
        console.log('Parsing HTML for:', gameName);
        
        // Create a regex pattern to match each game entry
        const matchPattern = /<a class="match[^>]*>.*?<div class="match_name">(.*?)<\/div>.*?<div class="match_price">(.*?)<\/div>.*?<\/a>/gs;
        const matches = [...html.matchAll(matchPattern)];
        
        console.log('Found matches:', matches.length);

        for (const match of matches) {
            const title = match[1].toLowerCase();
            const price = match[2].trim().split(' ').splice(1,2).join('');
            
            console.log('Checking match:', { title, price });

            // Skip if no title or price
            if (!title || !price) {
                console.log('Skipping: No title or price');
                continue;
            }

            // Skip if it's a demo, soundtrack, or DLC
            if (title.includes('demo') || 
                title.includes('soundtrack') || 
                title.includes('dlc') ||
                title.includes('content pack') ||
                title.includes('season pass') ||
                title.includes('upgrade') ||
                title.includes('bundle') ||
                title.includes('pack') ||
                price.toLowerCase().includes('free')) {
                console.log('Skipping:', title);
                continue;
            }

            console.log(`Found price for ${gameName}:`, price);
            return Number(price);
        }

        console.log('No suitable match found for:', gameName);
        return 'N/A';
    } catch (error) {
        console.error('Error parsing HTML:', error);
        return 'N/A';
    }
}

// Function to fetch Steam price
async function fetchSteamPrice(gameName) {
    try {
        console.log('Fetching price for:', gameName);
        const response = await fetch(
            `https://store.steampowered.com/search/suggest?term=${encodeURIComponent(gameName)}&f=games&cc=id&l=english`,
            {
                headers: {
                    'Accept': 'text/html',
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            }
        );
        
        const html = await response.text();
        console.log('Raw response:', html);
        return extractPriceFromHTML(html, gameName);
    } catch (error) {
        console.error('Error fetching Steam price:', error);
        return 'N/A';
    }
} 