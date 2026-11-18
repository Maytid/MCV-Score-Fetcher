/*
 * Copyright (C) 2026 Maytid
 * 
 * This program is free software: you can redistribute it and/or modify 
 * it under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, version 3.
 */

chrome.storage.local.get(['courses', 'lastUpdate'], (data) => {
    if (data.courses) {
        render(data.courses);
        let dateTime = new Date(data.lastUpdate).toLocaleString([], {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('timestamp').innerText = `Updated: ${dateTime}`;
    }
});

document.getElementById('fetchBtn').onclick = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let out = document.getElementById('results');
    
    if (!tab?.url?.includes("mycourseville.com")) {
        out.innerHTML = '<div class="error-text">Please open MyCourseVille first.</div>';
        return;
    }

    let btn = document.getElementById('fetchBtn');
    let txt = document.getElementById('btnText');
    
    btn.disabled = true;
    txt.innerText = "Fetching...";

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            let idEl = document.querySelector('.student-id');
            if (!idEl) return { err: "Couldn't find Student ID. Go to dashboard." };
            
            let sId = idEl.innerText.trim();
            let cards = Array.from(document.querySelectorAll('.course-container')); 

            let getScore = (url) => new Promise((res) => {
                let f = document.createElement('iframe');
                f.style.display = 'none';
                f.src = url;
                f.onload = () => {
                    setTimeout(() => {
                        let score = 0;
                        try {
                            let doc = f.contentDocument || f.contentWindow.document;
                            let row = doc.querySelector('.courseville-point-table-total-row');
                            if (row) {
                                let earned = parseFloat(row.children[1].textContent.trim());
                                let max = parseFloat(row.children[2].textContent.replace('/', '').trim());
                                if (!isNaN(earned) && !isNaN(max) && max > 0) score = (earned / max) * 100;
                            }
                        } catch (e) {}
                        f.remove(); 
                        res(score);
                    }, 2500); 
                };
                document.body.appendChild(f);
            });

            return Promise.all(cards.map(async (c) => {
                if (!c.id) return null;
                
                let rawId = c.querySelector('.course-content div:first-child')?.innerText || "";
                let match = rawId.match(/\b\d{7}\b/); 
                let link = `https://www.mycourseville.com/?q=courseville/course/${c.id}/portfolio-${sId}`;
                let img = c.querySelector('.image-wrapper img');

                return { 
                    id: match ? match[0] : "???", 
                    name: c.querySelector('.course-title')?.innerText.trim() || "Unknown", 
                    score: await getScore(link), 
                    url: link, 
                    img: img ? img.src : '' 
                };
            })).then(arr => arr.filter(x => x));
        }
    }, (res) => {
        btn.disabled = false;
        txt.innerText = "Get Scores";

        let data = res?.[0]?.result;
        if (data?.err) {
            out.innerHTML = `<div class="error-text">${data.err}</div>`;
        } else if (data) {
            chrome.storage.local.set({ courses: data, lastUpdate: Date.now() });
            render(data);
            let time = new Date().toLocaleString([], {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            document.getElementById('timestamp').innerText = `Updated: ${time}`;
        }
    });
};

function render(data) {
    let div = document.getElementById('results');
    div.innerHTML = ""; 

    if (!data || !data.length) {
        div.innerHTML = '<div class="empty-text">No courses found.</div>';
        return;
    }

    data.forEach(c => {
        let el = document.createElement('div');
        el.className = 'course-card';
        el.innerHTML = `
            <img src="${c.img || ''}" class="course-icon" style="display: ${c.img ? 'block' : 'none'}">
            <div class="course-details">
                <div class="course-id">${c.id}</div>
                <div class="course-name">${c.name}</div>
                <div class="score">${c.score.toFixed(2)} / 100</div>
            </div>
        `;
        el.onclick = () => chrome.tabs.create({ url: c.url, active: true });
        div.appendChild(el);
    });
}