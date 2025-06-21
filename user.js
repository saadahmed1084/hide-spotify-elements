// ==UserScript==
// @name         Hide Spotify User Profile
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Visually hides a specific user profile from Spotify Web UI (followers, following, sidebars, etc.)
// @author       ChatGPT
// @match        https://open.spotify.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Replace with the target user's display name or ID
    const blockedUsernames = ['id1', 'id2'];  // open.spotify.com/user/ID

    function hideUserProfileElements() {
        const userLinks = document.querySelectorAll('a[href*="/user/"], a[href*="/users/"]');
        const textElements = document.querySelectorAll('div[dir="auto"], span');

        userLinks.forEach(link => {
            blockedUsernames.forEach(username => {
                if (link.href.includes(username)) {
                    const parent = link.closest('div[data-testid], div[class*="EntityRow"], li, div[class*="sidebar"]');
                    if (parent) parent.style.display = 'none';
                }
            });
        });

        textElements.forEach(el => {
            const name = el.textContent.trim().toLowerCase();
            blockedUsernames.forEach(username => {
                if (name.includes(username.toLowerCase())) {
                    const parent = el.closest('div[data-testid], div[class*="EntityRow"], li, div[class*="sidebar"]');
                    if (parent) parent.style.display = 'none';
                }
            });
        });
    }

    // Keep checking — Spotify loads UI dynamically
    setInterval(hideUserProfileElements, 1000);
})();
