// content.js
let settings = {
    enabled: true,
    swearingFilter: true,
    sensitivityLevel: 'moderate'
};

// Your AI analysis API URL (replace with the actual endpoint)
const AI_ANALYSIS_API_URL = "https://https://api.textrazor.com/"; // Replace this with your AI API endpoint

// Load settings
browser.storage.sync.get({
    enabled: true,
    swearingFilter: true,
    sensitivityLevel: 'moderate'
}).then(items => {
    settings = items;
    initializeContentFilter();
});

// Listen for settings updates
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'updateSettings') {
        browser.storage.sync.get({
            enabled: true,
            swearingFilter: true,
            sensitivityLevel: 'moderate'
        }).then(items => {
            settings = items;
            initializeContentFilter();
        });
    }
});

function initializeContentFilter() {
    if (!settings.enabled) return;

    const currentHost = window.location.hostname;

    // Select appropriate selectors based on the platform
    const selectors = getPlatformSelectors(currentHost);

    // Initialize observer
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                analyzeAndFilterContent(mutation.addedNodes, selectors);
            }
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial scan
    analyzeAndFilterContent(document.body.children, selectors);
}

function getPlatformSelectors(host) {
    const selectors = {
        'instagram.com': {
            posts: 'article[role="presentation"]',
            comments: 'ul[role="menu"] > li'
        },
        'x.com': {
            posts: 'article[data-testid="tweet"]',
            comments: 'article[data-testid="tweet"]'
        },
        'reddit.com': {
            posts: 'div[data-testid="post-container"]',
            comments: 'div[data-testid="comment"]'
        }
    };

    return selectors[host.replace('www.', '')] || {};
}

async function analyzeAndFilterContent(nodes, selectors) {
    for (const node of nodes) {
        if (!(node instanceof Element)) continue;

        // Find relevant content elements
        const contentElements = [...node.querySelectorAll
