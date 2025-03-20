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
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';
        
        // Create header row
        const headerRow = document.createElement('tr');
        const gameHeader = document.createElement('th');
        gameHeader.textContent = 'Game';
        gameHeader.style.textAlign = 'left';
        gameHeader.style.padding = '8px';
        gameHeader.style.borderBottom = '1px solid #ddd';
        
        const keyHeader = document.createElement('th');
        keyHeader.textContent = 'Key';
        keyHeader.style.textAlign = 'left';
        keyHeader.style.padding = '8px';
        keyHeader.style.borderBottom = '1px solid #ddd';

        const monthHeader = document.createElement('th');
        monthHeader.textContent = 'Month';
        monthHeader.style.textAlign = 'left';
        monthHeader.style.padding = '8px';
        monthHeader.style.borderBottom = '1px solid #ddd';

        const yearHeader = document.createElement('th');
        yearHeader.textContent = 'Year';
        yearHeader.style.textAlign = 'left';
        yearHeader.style.padding = '8px';
        yearHeader.style.borderBottom = '1px solid #ddd';
        
        headerRow.appendChild(gameHeader);
        headerRow.appendChild(keyHeader);
        headerRow.appendChild(monthHeader);
        headerRow.appendChild(yearHeader);
        table.appendChild(headerRow);
        
        // Add game rows
        gameKeys.forEach(({ gameTitle, keyValue, Month, Year }) => {
            const row = document.createElement('tr');
            
            const gameCell = document.createElement('td');
            gameCell.textContent = gameTitle;
            gameCell.style.padding = '8px';
            gameCell.style.borderBottom = '1px solid #eee';
            
            const keyCell = document.createElement('td');
            const keyCode = document.createElement('code');
            keyCode.textContent = keyValue;
            keyCell.appendChild(keyCode);
            keyCell.style.padding = '8px';
            keyCell.style.borderBottom = '1px solid #eee';

            const monthCell = document.createElement('td');
            monthCell.textContent = Month;
            monthCell.style.padding = '8px';
            monthCell.style.borderBottom = '1px solid #eee';
            
            const yearCell = document.createElement('td');
            yearCell.textContent = Year;
            yearCell.style.padding = '8px';
            yearCell.style.borderBottom = '1px solid #eee'; 

            row.appendChild(gameCell);
            row.appendChild(keyCell);
            row.appendChild(monthCell);
            row.appendChild(yearCell);
            table.appendChild(row);
        });

        gameKeysDiv.appendChild(table);
    }
}); 