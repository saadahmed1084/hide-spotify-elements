// ==UserScript==
// @name         Hide Spotify Playlist
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Hides specific Spotify playlists from the UI and blocks their pages if accessed directly via link.
// @author       You
// @match        https://open.spotify.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 🎯 Playlist IDs to hide or block — only use the part after /playlist/
    const playlistIds = ['id1', 'id2']; // open.spotify.com/playlist/ID

    function normalize(str) {
        return str.trim().toLowerCase();
    }

    function hidePlaylistsInUI() {
        const links = document.querySelectorAll('a[href*="/playlist/"]');

        links.forEach(link => {
            const href = link.href.toLowerCase();
            playlistIds.forEach(id => {
                if (href.includes(`/playlist/${id.toLowerCase()}`)) {
                    const parent = link.closest('div[data-testid], section, li, div[class*="EntityRow"]');
                    if (parent) {
                        parent.style.display = 'none';
                    } else {
                        link.style.display = 'none';
                    }
                }
            });
        });
    }

    function blockDirectPlaylistPage() {
        const path = window.location.pathname.toLowerCase();
        const directMatch = playlistIds.find(id => path === `/playlist/${id.toLowerCase()}`);

        if (directMatch) {
            document.body.innerHTML = `
                <div style="display:flex; align-items:center; justify-content:center; height:100vh; background:#121212; color:white; font-family:sans-serif;">
                    <div>
                        <h1 style="font-size:24px; margin-bottom:10px;">🚫 Playlist Blocked</h1>
                        <p>This playlist (<code>${directMatch}</code>) has been hidden from your Spotify experience.</p>
                    </div>
                </div>
            `;
            document.title = 'Blocked Playlist';
        }
    }

    // Keep checking for dynamic Spotify page loads
    setInterval(() => {
        hidePlaylistsInUI();
        blockDirectPlaylistPage();
    }, 1000);
})();
