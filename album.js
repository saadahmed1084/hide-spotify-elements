// ==UserScript==
// @name         Hide Spotify Album
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hides specific albums by their Spotify IDs from Spotify Web UI, including Home, Search, etc.
// @author       ChatGPT
// @match        https://open.spotify.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Replace with one or more album IDs
    const albumIdsToHide = ['id1', 'id2']; // open.spotify.com/album/ID

    function hideAlbums() {
        const albumLinks = document.querySelectorAll('a[href*="/album/"]');

        albumLinks.forEach(link => {
            const href = link.href.toLowerCase();
            albumIdsToHide.forEach(albumId => {
                if (href.includes(`/album/${albumId.toLowerCase()}`)) {
                    const parent = link.closest('div[data-testid], div[class*="EntityRow"], section');
                    if (parent) {
                        parent.style.display = 'none';
                    } else {
                        link.style.display = 'none';
                    }
                }
            });
        });
    }

    // Run regularly to catch dynamically loaded elements
    setInterval(hideAlbums, 1000);
})();
