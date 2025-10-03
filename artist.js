// ==UserScript==
// @name         Hide & Block Specific Spotify Artists
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Hides specified artist profiles in Spotify UI and blocks direct navigation to their pages.
// @author       ChatGPT
// @match        https://open.spotify.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // --- PUT ARTIST IDS HERE (open.spotify.com/artist/artistid) ---
    const blockedArtistIds = [ 'artist1', 'artist2' ];

    const normalize = s => (s || '').trim().toLowerCase();

    // --- REDIRECT HANDLER ---
    function checkAndRedirect() {
        const url = location.href.toLowerCase();
        for (const id of blockedArtistIds) {
            if (url.includes(`/artist/${normalize(id)}`)) {
                console.log('[SpotifyBlocker] Redirected from blocked artist:', id);
                window.location.replace('https://open.spotify.com/'); // redirect to Home
                return true;
            }
        }
        return false;
    }

    // Run on load + history changes
    checkAndRedirect();
    const pushState = history.pushState;
    history.pushState = function () {
        pushState.apply(this, arguments);
        setTimeout(checkAndRedirect, 50);
    };
    window.addEventListener('popstate', checkAndRedirect);
    window.addEventListener('hashchange', checkAndRedirect);

    // --- HIDE UI ITEMS ---
    const hiddenNodes = new WeakSet();

    function hideNode(node) {
        if (!node || hiddenNodes.has(node)) return;
        node.style.transition = 'opacity .12s ease';
        node.style.opacity = '0';
        setTimeout(() => { node.style.display = 'none'; }, 120);
        hiddenNodes.add(node);
    }

    function tryHideArtistLink(link) {
        const href = normalize(link.href || '');
        for (const id of blockedArtistIds) {
            if (href.includes(`/artist/${normalize(id)}`)) {
                // Hide closest row/card/list item
                const container = link.closest(
                    '[data-testid="entity-row"], [data-testid="entityRow"], div[class*="EntityRow"], ' +
                    'div[class*="gridCard"], div[data-testid*="card"], div[role="listitem"], li, section, article'
                ) || link;
                hideNode(container);
                return;
            }
        }
    }

    function scanAndHideAll() {
        const links = document.querySelectorAll('a[href*="/artist/"]');
        for (const link of links) tryHideArtistLink(link);
    }

    const observer = new MutationObserver(scanAndHideAll);
    observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

    scanAndHideAll();
})();
