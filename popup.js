document.addEventListener('DOMContentLoaded', async function() {
    const extractButton = document.getElementById('extractButton');
    const gameKeysDiv = document.getElementById('gameKeys');
    const extractGameTitleButton = document.getElementById('extractGameTitle');
    const gameTitleDiv = document.getElementById('gameTitle');

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if(tab.url.includes('humblebundle.com/membership')) {
        extractButton.hidden = true;
        extractGameTitleButton.hidden = false;
    } else {
        extractButton.hidden = false;
        extractGameTitleButton.hidden = true;
    }

    extractGameTitleButton.addEventListener('click', async () => {
        try {
            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('humblebundle.com')) {
                gameTitleDiv.innerHTML = '<p>Please navigate to a Humble Bundle page first.</p>';
                return;
            }

            // Show loading state
            gameTitleDiv.innerHTML = '<p>Loading game information...</p>';

            // Send message to content script
            chrome.tabs.sendMessage(tab.id, { action: "extractGameTitle" }, function(response) {
                if (chrome.runtime.lastError) {
                    gameTitleDiv.innerHTML = '<p>Error: Please refresh the page and try again.</p>';
                    console.error(chrome.runtime.lastError);
                    return;
                }

                if (response && response.gameTitle) {
                    displayGameKeys(response.gameTitle);
                } else {
                    gameTitleDiv.innerHTML = '<p>No game title found on this page.</p>';
                }
            }); 
        } catch (error) {
            gameTitleDiv.innerHTML = '<p>Error: Please refresh the page and try again.</p>';
            console.error(error);
        }
    });

    extractButton.addEventListener('click', async () => {
        try {
            // Get the active tab
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab.url.includes('humblebundle.com')) {
                gameKeysDiv.innerHTML = '<p>Please navigate to a Humble Bundle page first.</p>';
                return;
            }

            // Show loading state
            gameKeysDiv.innerHTML = '<p>Loading game information...</p>';

            // Send message to content script
            chrome.tabs.sendMessage(tab.id, { action: "extractKeys" }, function(response) {
                if (chrome.runtime.lastError) {
                    gameKeysDiv.innerHTML = '<p>Error: Please refresh the page and try again.</p>';
                    console.error(chrome.runtime.lastError);
                    return;
                }
                
                if (response && response.gameKeys) {
                    displayGameKeys(response.gameKeys);
                } else {
                    gameKeysDiv.innerHTML = '<p>No game keys found on this page.</p>';
                }
            });
        } catch (error) {
            gameKeysDiv.innerHTML = '<p>Error: Please refresh the page and try again.</p>';
            console.error(error);
        }
    });

    function displayGameKeys(gameKeys) {
        gameKeysDiv.innerHTML = '';
        
        if (gameKeys.length === 0) {
            gameKeysDiv.innerHTML = '<p>No game keys found on this page.</p>';
            return;
        }

        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Game Title</th>
                    <th>CD Key</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Steam Price (IDR)</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        gameKeys.forEach(({ gameTitle, keyValue, Month, Year, steamPrice }) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${gameTitle}</strong></td>
                <td><code>${keyValue || ''}</code></td>
                <td>${Month || 'N/A'}</td>
                <td>${Year || 'N/A'}</td>
                <td>${steamPrice || 'N/A'}</td>
            `;
            table.querySelector('tbody').appendChild(row);
        });

        gameKeysDiv.appendChild(table);
    }
}); 