/* ═══════════════════════════════════════════════
   CampusClub Manager — Frontend Application Logic
   ═══════════════════════════════════════════════ */

// ── API Base URLs ──
// Change these to your EC2 public IP when deploying:
//   e.g. "http://<EC2_PUBLIC_IP>:5001"
const API = {
    clubs:   "http://localhost:5001",
    members: "http://localhost:5002",
    events:  "http://localhost:5003",
};


// ══════════════════════════════════════════
//  Toast Notifications
// ══════════════════════════════════════════

function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "toastOut 0.3s ease-in forwards";
        toast.addEventListener("animationend", () => toast.remove());
    }, 3000);
}


// ══════════════════════════════════════════
//  Tab Switching
// ══════════════════════════════════════════

document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
        const tabName = btn.dataset.tab;

        // Update tab buttons
        document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        btn.classList.add("active");

        // Update panels
        document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active"));
        const target = document.getElementById(`panel-${tabName}`);
        if (target) {
            target.classList.add("active");
            // Re-trigger animation
            target.style.animation = "none";
            target.offsetHeight; // force reflow
            target.style.animation = "";
        }
    });
});


// ══════════════════════════════════════════
//  Health Check Polling
// ══════════════════════════════════════════

async function checkHealth() {
    const services = [
        { key: "club",   url: `${API.clubs}/health`,   el: "health-club"   },
        { key: "member", url: `${API.members}/health`,  el: "health-member" },
        { key: "event",  url: `${API.events}/health`,   el: "health-event"  },
    ];

    for (const svc of services) {
        const dot = document.getElementById(svc.el);
        try {
            const res = await fetch(svc.url, { signal: AbortSignal.timeout(3000) });
            if (res.ok) {
                dot.className = "health-dot online";
            } else {
                dot.className = "health-dot offline";
            }
        } catch {
            dot.className = "health-dot offline";
        }
    }
}

// Check health on load, then every 15 seconds
checkHealth();
setInterval(checkHealth, 15000);


// ══════════════════════════════════════════
//  SVG Icon Helpers
// ══════════════════════════════════════════

const icons = {
    tag: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
    clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    mail: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    link: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    desc: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>`,
};


// ══════════════════════════════════════════
//  CLUBS — CRUD
// ══════════════════════════════════════════

async function loadClubs() {
    try {
        const res = await fetch(`${API.clubs}/clubs`);
        const clubs = await res.json();
        renderClubs(clubs);
    } catch {
        document.getElementById("clubs-list").innerHTML =
            `<div class="empty-state"><p>⚠️ Could not connect to Club Service (port 5001)</p></div>`;
    }
}

function renderClubs(clubs) {
    const container = document.getElementById("clubs-list");
    document.getElementById("clubs-count").textContent = clubs.length;

    if (clubs.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <p>No clubs yet. Create your first club above!</p>
            </div>`;
        return;
    }

    container.innerHTML = clubs.map((c, i) => `
        <div class="data-card glass-card" style="animation-delay: ${i * 0.06}s">
            <div class="card-top">
                <span class="card-title">${escapeHtml(c.name)}</span>
                <span class="card-id">#${c.id}</span>
            </div>
            ${c.category ? `<span class="card-category cat-${c.category}">${c.category}</span>` : ""}
            <div class="card-meta">
                ${c.description ? `<span class="card-meta-item">${icons.desc} ${escapeHtml(c.description)}</span>` : ""}
                ${c.created_at ? `<span class="card-meta-item">${icons.clock} ${formatDate(c.created_at)}</span>` : ""}
            </div>
            <div class="card-actions">
                <button class="btn btn-danger" onclick="deleteClub(${c.id})">Delete</button>
            </div>
        </div>
    `).join("");
}

document.getElementById("form-club").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("club-name").value.trim();
    const category = document.getElementById("club-category").value;
    const description = document.getElementById("club-desc").value.trim();

    if (!name) {
        showToast("Club name is required", "error");
        return;
    }

    try {
        const res = await fetch(`${API.clubs}/clubs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, category, description }),
        });

        if (res.ok) {
            showToast("Club created successfully!");
            document.getElementById("form-club").reset();
            loadClubs();
        } else {
            const data = await res.json();
            showToast(data.error || "Failed to create club", "error");
        }
    } catch {
        showToast("Could not connect to Club Service", "error");
    }
});

async function deleteClub(id) {
    try {
        const res = await fetch(`${API.clubs}/clubs/${id}`, { method: "DELETE" });
        if (res.ok) {
            showToast("Club deleted");
            loadClubs();
        } else {
            showToast("Failed to delete club", "error");
        }
    } catch {
        showToast("Could not connect to Club Service", "error");
    }
}


// ══════════════════════════════════════════
//  MEMBERS — CRUD
// ══════════════════════════════════════════

async function loadMembers() {
    try {
        const res = await fetch(`${API.members}/members`);
        const members = await res.json();
        renderMembers(members);
    } catch {
        document.getElementById("members-list").innerHTML =
            `<div class="empty-state"><p>⚠️ Could not connect to Member Service (port 5002)</p></div>`;
    }
}

function renderMembers(members) {
    const container = document.getElementById("members-list");
    document.getElementById("members-count").textContent = members.length;

    if (members.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <p>No members yet. Add your first member above!</p>
            </div>`;
        return;
    }

    container.innerHTML = members.map((m, i) => `
        <div class="data-card glass-card" style="animation-delay: ${i * 0.06}s">
            <div class="card-top">
                <span class="card-title">${escapeHtml(m.name)}</span>
                <span class="card-id">#${m.id}</span>
            </div>
            <div class="card-meta">
                <span class="card-meta-item">${icons.mail} ${escapeHtml(m.email)}</span>
                ${m.club_id ? `<span class="card-meta-item">${icons.link} Club #${m.club_id}</span>` : ""}
                ${m.joined_at ? `<span class="card-meta-item">${icons.clock} Joined ${formatDate(m.joined_at)}</span>` : ""}
            </div>
            <div class="card-actions">
                <button class="btn btn-danger" onclick="deleteMember(${m.id})">Delete</button>
            </div>
        </div>
    `).join("");
}

document.getElementById("form-member").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("member-name").value.trim();
    const email = document.getElementById("member-email").value.trim();
    const club_id = document.getElementById("member-club").value || null;

    if (!name || !email) {
        showToast("Name and email are required", "error");
        return;
    }

    try {
        const res = await fetch(`${API.members}/members`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, club_id: club_id ? parseInt(club_id) : null }),
        });

        if (res.ok) {
            showToast("Member added successfully!");
            document.getElementById("form-member").reset();
            loadMembers();
        } else {
            const data = await res.json();
            showToast(data.error || "Failed to add member", "error");
        }
    } catch {
        showToast("Could not connect to Member Service", "error");
    }
});

async function deleteMember(id) {
    try {
        const res = await fetch(`${API.members}/members/${id}`, { method: "DELETE" });
        if (res.ok) {
            showToast("Member removed");
            loadMembers();
        } else {
            showToast("Failed to delete member", "error");
        }
    } catch {
        showToast("Could not connect to Member Service", "error");
    }
}


// ══════════════════════════════════════════
//  EVENTS — CRUD
// ══════════════════════════════════════════

async function loadEvents() {
    try {
        const res = await fetch(`${API.events}/events`);
        const events = await res.json();
        renderEvents(events);
    } catch {
        document.getElementById("events-list").innerHTML =
            `<div class="empty-state"><p>⚠️ Could not connect to Event Service (port 5003)</p></div>`;
    }
}

function renderEvents(events) {
    const container = document.getElementById("events-list");
    document.getElementById("events-count").textContent = events.length;

    if (events.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <p>No events yet. Create your first event above!</p>
            </div>`;
        return;
    }

    container.innerHTML = events.map((ev, i) => `
        <div class="data-card glass-card" style="animation-delay: ${i * 0.06}s">
            <div class="card-top">
                <span class="card-title">${escapeHtml(ev.title)}</span>
                <span class="card-id">#${ev.id}</span>
            </div>
            <div class="card-meta">
                ${ev.date ? `<span class="card-meta-item">${icons.calendar} ${ev.date}</span>` : ""}
                ${ev.description ? `<span class="card-meta-item">${icons.desc} ${escapeHtml(ev.description)}</span>` : ""}
                ${ev.club_id ? `<span class="card-meta-item">${icons.link} Club #${ev.club_id}</span>` : ""}
                ${ev.created_at ? `<span class="card-meta-item">${icons.clock} Created ${formatDate(ev.created_at)}</span>` : ""}
            </div>
            <div class="card-actions">
                <button class="btn btn-danger" onclick="deleteEvent(${ev.id})">Delete</button>
            </div>
        </div>
    `).join("");
}

document.getElementById("form-event").addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("event-title").value.trim();
    const date = document.getElementById("event-date").value;
    const club_id = document.getElementById("event-club").value || null;
    const description = document.getElementById("event-desc").value.trim();

    if (!title) {
        showToast("Event title is required", "error");
        return;
    }

    try {
        const res = await fetch(`${API.events}/events`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, date, description, club_id: club_id ? parseInt(club_id) : null }),
        });

        if (res.ok) {
            showToast("Event created successfully!");
            document.getElementById("form-event").reset();
            loadEvents();
        } else {
            const data = await res.json();
            showToast(data.error || "Failed to create event", "error");
        }
    } catch {
        showToast("Could not connect to Event Service", "error");
    }
});

async function deleteEvent(id) {
    try {
        const res = await fetch(`${API.events}/events/${id}`, { method: "DELETE" });
        if (res.ok) {
            showToast("Event deleted");
            loadEvents();
        } else {
            showToast("Failed to delete event", "error");
        }
    } catch {
        showToast("Could not connect to Event Service", "error");
    }
}


// ══════════════════════════════════════════
//  Utility Functions
// ══════════════════════════════════════════

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function formatDate(isoStr) {
    try {
        const d = new Date(isoStr);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    } catch {
        return isoStr;
    }
}


// ══════════════════════════════════════════
//  Initial Data Load
// ══════════════════════════════════════════

loadClubs();
loadMembers();
loadEvents();
