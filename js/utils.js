/* ============================================================
   utils.js
   Reusable modal + helper utilities
============================================================ */

export function showModal(title, message) {
    const overlay = document.createElement("div");
    overlay.className = "modal-container";

    const box = document.createElement("div");
    box.className = "modal-box";

    const t = document.createElement("div");
    t.className = "modal-title";
    t.textContent = title;

    const m = document.createElement("div");
    m.className = "modal-message";
    m.textContent = message;

    const btn = document.createElement("div");
    btn.className = "modal-close-btn";
    btn.textContent = "OK";

    btn.onclick = () => overlay.remove();

    box.appendChild(t);
    box.appendChild(m);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
}

/* Random number helper */
export function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

