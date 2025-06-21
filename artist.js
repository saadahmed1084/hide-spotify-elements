// ==UserScript==
// @name         Hide Spotify Artist Profile
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Visually hides specific artist profiles from Spotify Web UI and blocks their pages if opened directly (like user blocking script behavior). Works on search, following, sidebars, and direct profile URLs too.
// @author       You
// @match        https://open.spotify.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Replace with the target artist Spotify IDs
    const blockedArtistIds = ['id1', 'id2']; // open.spotify.com/artist/ID

    // Hides artist tiles/cards from UI
    function hideArtistProfileElements() {
        const artistLinks = document.querySelectorAll('a[href*="/artist/"]');
        const textElements = document.querySelectorAll('div[dir="auto"], span');

        artistLinks.forEach(link => {
            blockedArtistIds.forEach(artistId => {
                if (link.href.includes(`/artist/${artistId}`)) {
                    const parent = link.closest('div[data-testid], div[class*="EntityRow"], li, div[class*="sidebar"]');
                    if (parent) parent.style.display = 'none';
                }
            });
        });

        textElements.forEach(el => {
            const text = el.textContent.trim().toLowerCase();
            blockedArtistIds.forEach(artistId => {
                if (text.includes(artistId.toLowerCase())) {
                    const parent = el.closest('div[data-testid], div[class*="EntityRow"], li, div[class*="sidebar"]');
                    if (parent) parent.style.display = 'none';
                }
            });
        });
    }

    // Blocks the actual artist profile page if opened directly
    function blockArtistPageIfOpened() {
        const path = window.location.pathname.toLowerCase();

        blockedArtistIds.forEach(artistId => {
            if (path === `/artist/${artistId.toLowerCase()}`) {
                document.body.innerHTML = `
                    <div style="display:flex; align-items:center; justify-content:center; height:100vh; background:#121212; color:white; font-family:sans-serif;">
                        <div>
                            <h1 style="font-size:24px; margin-bottom:10px;">🚫 Blocked Artist</h1>
                            <p>You have hidden this artist’s profile from view.</p>
                        </div>
                    </div>
                `;
                document.title = 'Blocked Artist';
            }
        });
    }

    // Spotify is dynamically loaded — run checks repeatedly
    setInterval(() => {
        hideArtistProfileElements();
        blockArtistPageIfOpened();
    }, 1000);
})();
