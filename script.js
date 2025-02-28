document.addEventListener('DOMContentLoaded', () => {
    // Window controls
    const close = document.querySelector('.close');
    const maximize = document.querySelector('.maximize');
    const minimize = document.querySelector('.minimize');
    const window = document.querySelector('.window');

    close.addEventListener('click', () => {
        window.style.display = 'none';
    });

    let isMaximized = false;
    maximize.addEventListener('click', () => {
        if (isMaximized) {
            window.style.width = '800px';
            window.style.height = '500px';
        } else {
            window.style.width = '100vw';
            window.style.height = '100vh';
        }
        isMaximized = !isMaximized;
    });

    minimize.addEventListener('click', () => {
        window.style.transform = 'scale(0)';
        setTimeout(() => {
            window.style.transform = 'scale(1)';
        }, 2000);
    });

    // System loading simulation
    const terminal = document.querySelector('.terminal');
    const apps = [
        { name: 'File Manager', icon: '📁' },
        { name: 'Text Editor', icon: '📝' },
        { name: 'Terminal', icon: '⌨️' },
        { name: 'Settings', icon: '⚙️' },
        { name: 'Browser', icon: '🌐' }
    ];

    function typeText(text, element, callback) {
        let i = 0;
        const interval = setInterval(() => {
            element.textContent += text[i];
            i++;
            if (i >= text.length) {
                clearInterval(interval);
                if (callback) callback();
            }
        }, 50);
    }

    function simulateLoading() {
        const stages = [
            'Initializing system core...',
            'Loading kernel modules...',
            'Starting system services...',
            'Mounting virtual drives...',
            'Launching desktop environment...'
        ];

        let currentStage = 0;
        
        function loadNextStage() {
            if (currentStage < stages.length) {
                const p = document.createElement('p');
                terminal.appendChild(p);
                typeText(stages[currentStage], p, () => {
                    setTimeout(() => {
                        p.innerHTML += ' <span style="color: #00ff00;">[ OK ]</span>';
                        currentStage++;
                        loadNextStage();
                    }, 200);
                });
            } else {
                setTimeout(loadDesktop, 500);
            }
        }

        loadNextStage();
    }

    function createWindow(title, content, width = '600px', height = '400px') {
        const newWindow = document.createElement('div');
        newWindow.className = 'window app-window';
        newWindow.style.width = width;
        newWindow.style.height = height;
        newWindow.style.position = 'absolute';
        newWindow.style.left = '50%';
        newWindow.style.top = '50%';
        newWindow.style.transform = 'translate(-50%, -50%)';
        
        newWindow.innerHTML = `
            <div class="titlebar">
                <div class="logo">ᥫ᭡</div>
                <div class="title">${title}</div>
                <div class="controls">
                    <span class="minimize">−</span>
                    <span class="maximize">□</span>
                    <span class="close">×</span>
                </div>
            </div>
            <div class="content">
                ${content}
            </div>
        `;

        document.body.appendChild(newWindow);
        
        // Add window controls
        const closeBtn = newWindow.querySelector('.close');
        const maxBtn = newWindow.querySelector('.maximize');
        const minBtn = newWindow.querySelector('.minimize');
        
        closeBtn.addEventListener('click', () => newWindow.remove());
        
        let isMax = false;
        maxBtn.addEventListener('click', () => {
            if (isMax) {
                newWindow.style.width = width;
                newWindow.style.height = height;
            } else {
                newWindow.style.width = '100vw';
                newWindow.style.height = '100vh';
            }
            isMax = !isMax;
        });
        
        minBtn.addEventListener('click', () => {
            newWindow.style.transform = 'translate(-50%, -50%) scale(0)';
            setTimeout(() => {
                newWindow.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 2000);
        });

        // Make window draggable
        const windowBar = newWindow.querySelector('.titlebar');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        windowBar.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);

        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            if (e.target === windowBar) {
                isDragging = true;
            }
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                xOffset = currentX;
                yOffset = currentY;
                newWindow.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        }

        function dragEnd() {
            isDragging = false;
        }

        // Add specific browser functionality if it's a browser window
        if (title === 'Debix Browser') {
            const urlBar = newWindow.querySelector('.url-bar');
            const backBtn = newWindow.querySelector('.nav-btn:nth-child(1)');
            const forwardBtn = newWindow.querySelector('.nav-btn:nth-child(2)');
            const refreshBtn = newWindow.querySelector('.nav-btn:nth-child(3)');
            const searchInput = newWindow.querySelector('.search-container input');
            const searchBtn = newWindow.querySelector('.search-container button');
            const browserContent = newWindow.querySelector('.browser-content');

            // Browser navigation history (simple mock)
            let browserHistory = ['https://debix.net'];
            let currentHistoryIndex = 0;

            // Disable buttons initially based on history
            backBtn.disabled = true;
            forwardBtn.disabled = true;

            // Update navigation button states
            function updateNavigationButtons() {
                backBtn.disabled = currentHistoryIndex <= 0;
                forwardBtn.disabled = currentHistoryIndex >= browserHistory.length - 1;
            }

            // Back button functionality
            backBtn.addEventListener('click', () => {
                if (currentHistoryIndex > 0) {
                    currentHistoryIndex--;
                    urlBar.value = browserHistory[currentHistoryIndex];
                    loadPage(browserHistory[currentHistoryIndex]);
                    updateNavigationButtons();
                }
            });

            // Forward button functionality
            forwardBtn.addEventListener('click', () => {
                if (currentHistoryIndex < browserHistory.length - 1) {
                    currentHistoryIndex++;
                    urlBar.value = browserHistory[currentHistoryIndex];
                    loadPage(browserHistory[currentHistoryIndex]);
                    updateNavigationButtons();
                }
            });

            // Refresh button functionality
            refreshBtn.addEventListener('click', () => {
                loadPage(urlBar.value);
            });

            // URL bar enter key handler
            urlBar.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    loadPage(urlBar.value);
                }
            });

            // Search functionality
            searchBtn.addEventListener('click', () => performSearch());
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });

            function performSearch() {
                const searchTerm = searchInput.value;
                const searchUrl = `https://debix.net/search?q=${encodeURIComponent(searchTerm)}`;
                urlBar.value = searchUrl;
                loadPage(searchUrl);
            }

            function loadPage(url) {
                // Simulate page loading
                browserContent.innerHTML = `
                    <div class="welcome-page">
                        <h2>Loading: ${url}</h2>
                        <p>Connecting to Debix Network...</p>
                    </div>
                `;

                // Add to history if it's a new URL
                if (browserHistory[currentHistoryIndex] !== url) {
                    // Remove any forward history
                    browserHistory = browserHistory.slice(0, currentHistoryIndex + 1);
                    browserHistory.push(url);
                    currentHistoryIndex = browserHistory.length - 1;
                }

                // Simulate page load with timeout
                setTimeout(() => {
                    browserContent.innerHTML = `
                        <div class="welcome-page">
                            <h1>Debix Network</h1>
                            <p>Loaded: ${url}</p>
                            <div class="quick-links">
                                <div class="quick-link">📰 News</div>
                                <div class="quick-link">🎵 Music</div>
                                <div class="quick-link">🎮 Games</div>
                            </div>
                        </div>
                    `;
                }, 1000);

                updateNavigationButtons();
            }

            // Initial navigation button setup
            updateNavigationButtons();
        }

        return newWindow;
    }

    function loadDesktop() {
        terminal.style.display = 'none';
        const desktop = document.createElement('div');
        desktop.className = 'desktop';
        document.querySelector('.content').appendChild(desktop);

        const appHandlers = {
            'File Manager': () => {
                createWindow('File Manager', `
                    <div class="file-manager">
                        <div class="folder">📁 Documents</div>
                        <div class="folder">📁 Pictures</div>
                        <div class="folder">📁 Downloads</div>
                        <div class="file">📄 readme.txt</div>
                    </div>
                `);
            },
            'Text Editor': () => {
                createWindow('Text Editor', `
                    <div class="text-editor">
                        <textarea placeholder="Start typing..."></textarea>
                    </div>
                `);
            },
            'Terminal': () => {
                createWindow('Terminal', `
                    <div class="terminal">
                        <p>Debix IB Terminal</p>
                        <p>$ <span class="cursor"></span></p>
                    </div>
                `);
            },
            'Settings': () => {
                createWindow('Settings', `
                    <div class="settings">
                        <div class="setting-item">
                            <h3>System Theme</h3>
                            <select>
                                <option>Dark</option>
                                <option>Light</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <h3>Language</h3>
                            <select>
                                <option>English</option>
                                <option>Spanish</option>
                            </select>
                        </div>
                    </div>
                `);
            },
            'Browser': () => {
                createWindow('Debix Browser', `
                    <div class="browser">
                        <div class="browser-toolbar">
                            <button class="nav-btn">←</button>
                            <button class="nav-btn">→</button>
                            <button class="nav-btn">↻</button>
                            <input type="text" class="url-bar" placeholder="Enter URL..." value="https://debix.net">
                        </div>
                        <div class="browser-content">
                            <div class="welcome-page">
                                <h1>Welcome to Debix Browser</h1>
                                <div class="search-container">
                                    <input type="text" placeholder="Search the web...">
                                    <button>Search</button>
                                </div>
                                <div class="quick-links">
                                    <div class="quick-link">📰 News</div>
                                    <div class="quick-link">📧 Mail</div>
                                    <div class="quick-link">🎵 Music</div>
                                    <div class="quick-link">🎮 Games</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `, '800px', '600px');
            }
        };

        apps.forEach(app => {
            const appIcon = document.createElement('div');
            appIcon.className = 'app';
            appIcon.innerHTML = `
                <div class="app-icon">${app.icon}</div>
                <div class="app-name">${app.name}</div>
            `;
            desktop.appendChild(appIcon);
            
            appIcon.addEventListener('click', () => {
                if (appHandlers[app.name]) {
                    appHandlers[app.name]();
                }
            });
        });
    }

    simulateLoading();
});
