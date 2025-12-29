document.addEventListener('DOMContentLoaded', () => {
    
    /* =========================================
       0. ASSET INJECTOR (Fixes Favicon Globally)
       ========================================= */
    const faviconLink = document.querySelector("link[rel~='icon']");
    if (faviconLink) {
        // Check if we are deep inside the 'calculators/' folder
        const isSubPage = window.location.pathname.includes('/calculators/');
        const pathPrefix = isSubPage ? '../' : '';
        
        // Redirect the broken .ico link to our new .svg
        faviconLink.href = `${pathPrefix}assets/images/favicon.svg`;
        faviconLink.type = "image/svg+xml";
    }

    /* =========================================
       1. THEME ENGINE
       ========================================= */
    const themeBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const iconMoon = document.querySelector('.icon-moon');
    const iconSun = document.querySelector('.icon-sun');

    // Load saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(systemDark ? 'dark' : 'light');
    }

    // Toggle Click Event
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const current = htmlEl.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });
    }

    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Toggle Icons
        if (iconMoon && iconSun) {
            if (theme === 'dark') {
                iconMoon.style.display = 'none';
                iconSun.style.display = 'block';
            } else {
                iconMoon.style.display = 'block';
                iconSun.style.display = 'none';
            }
        }
    }

    /* =========================================
       2. GLOBAL SEARCH ENGINE
       ========================================= */
    const searchInput = document.getElementById('global-search');
    const calcCards = document.querySelectorAll('.calc-card');
    const sections = document.querySelectorAll('.category-section');

    // A. Check for URL Query Param (Redirected from another page)
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    if (query && searchInput) {
        searchInput.value = query;
        // Small delay to ensure UI is ready
        setTimeout(() => filterCalculators(query), 100);
    }

    // B. Input Event Listener
    if (searchInput) {
        
        // Keyboard Shortcut (Cmd/Ctrl + K)
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });

        // Event: Typing
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.trim();
            
            // If we are on the homepage (cards exist), filter them
            if (calcCards.length > 0) {
                filterCalculators(term);
            }
        });

        // Event: Pressing Enter (for sub-pages)
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const term = searchInput.value.trim();
                
                // If NO cards exist (we are on a sub-page), redirect to home
                if (calcCards.length === 0 && term) {
                    // Check if we are in a subdirectory (like /calculators/)
                    const isSubDir = window.location.pathname.includes('/calculators/');
                    const path = isSubDir ? '../index.html' : 'index.html';
                    window.location.href = `${path}?q=${encodeURIComponent(term)}`;
                }
            }
        });
    }

    // Helper: Filtering Logic
    function filterCalculators(searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        let hasGlobalMatch = false;

        calcCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
            const match = title.includes(lowerTerm) || desc.includes(lowerTerm);

            card.style.display = match ? 'flex' : 'none';
            if (match) hasGlobalMatch = true;
        });

        // Hide empty categories
        sections.forEach(section => {
            const visibleCards = section.querySelectorAll('.calc-card[style="display: flex;"]');
            section.style.display = visibleCards.length > 0 ? 'block' : 'none';
        });
    }

});