const BASE_URL = "http://localhost:8080/playfab";
let currentUID = null;

// ── Shared ─────────────────────────────────────────────

function stripToName(username) {
  return username.replace(/[^a-zA-Z]/g, "");
}

function toggleDropdown() {
  document.getElementById("dropdownMenu").classList.toggle("open");
  document.getElementById("arrow").classList.toggle("open");
}

document.addEventListener("click", function(e) {
  const wrap = document.querySelector(".staff-dropdown-wrap");
  if (wrap && !wrap.contains(e.target)) {
    document.getElementById("dropdownMenu")?.classList.remove("open");
    document.getElementById("arrow")?.classList.remove("open");
  }
});

function logout() {
  sessionStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

const staffNameEl = document.getElementById("staffName");
if (staffNameEl) {
  const raw = sessionStorage.getItem("loggedInUser") || "Staff";
  staffNameEl.textContent = stripToName(raw);
}

// Apply saved theme
document.body.setAttribute("data-theme", localStorage.getItem("theme") || "dark");

// ── PlayFab API ────────────────────────────────────────

async function playfab(endpoint, body) {
  const res  = await fetch(BASE_URL + endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  return JSON.parse(text);
}

// ── Player Control (dashboard only) ───────────────────

async function loadPlayers() {
  const select = document.getElementById("playerSelect");
  if (!select) return;

  select.innerHTML = `<option value="">Loading players...</option>`;

  const segRes = await playfab("/Admin/GetAllSegments", {});
  if (segRes.code !== 200) {
    select.innerHTML = `<option value="">Failed to load</option>`;
    setStatus("Could not load segments.", "error");
    return;
  }

  const allSeg = segRes.data.Segments.find(s => s.Name === "All Players");
  if (!allSeg) { select.innerHTML = `<option value="">No segment found</option>`; return; }

  const playRes = await playfab("/Admin/GetPlayersInSegment", {
    SegmentId: allSeg.Id,
    MaxBatchSize: 100
  });

  if (!playRes.data || !playRes.data.PlayerProfiles || playRes.data.PlayerProfiles.length === 0) {
    select.innerHTML = `<option value="">No players yet</option>`;
    setStatus("No players in PlayFab yet.", "info");
    return;
  }

  const players = playRes.data.PlayerProfiles;
  select.innerHTML = `<option value="">Select a player...</option>`;
  players.forEach(p => {
    const option = document.createElement("option");
    option.value = p.PlayerId;
    option.textContent = (p.DisplayName || "Unknown") + "  —  " + p.PlayerId;
    select.appendChild(option);
  });

  setStatus(`Loaded ${players.length} player(s).`, "success");
}

function onPlayerSelected() {
  const select = document.getElementById("playerSelect");
  if (!select) return;
  const uid = select.value;
  if (!uid) { document.getElementById("playerInfo").style.display = "none"; return; }

  const text = select.options[select.selectedIndex].text;
  currentUID = uid;
  document.getElementById("playerDisplayName").textContent = text.split("  —  ")[0];
  document.getElementById("playerIDLabel").textContent     = uid;
  document.getElementById("playerInfo").style.display      = "block";
  setStatus("", "");
}

async function kickPlayer() {
  if (!currentUID) return;
  setStatus("Kicking player...", "info");
  const res = await playfab("/Admin/UpdateUserData", {
    PlayFabId: currentUID,
    Data: { "ForceKick": "true" },
    Permission: "Public"
  });
  if (res.code === 200) setStatus("Player kicked.", "success");
  else setStatus("Kick failed: " + (res.errorMessage || "Unknown error"), "error");
}

function openModal(type) {
  const bg = document.getElementById("modalBg");
  const mc = document.getElementById("modalContent");
  if (!bg || !mc) return;
  bg.classList.add("open");

  if (type === "ban") {
    mc.innerHTML = `
      <h3>🔨 Ban Player</h3>
      <label>Duration</label>
      <select id="banDuration">
        <option value="1">1 Hour</option>
        <option value="24">24 Hours</option>
        <option value="168">7 Days</option>
        <option value="720">30 Days</option>
        <option value="0">Permanent</option>
      </select>
      <label>Reason</label>
      <textarea id="banReason" placeholder="Reason for ban..."></textarea>
      <div class="modal-actions">
        <button onclick="closeModal()">Cancel</button>
        <button class="danger-btn" onclick="banPlayer()">Confirm Ban</button>
      </div>`;
  }

  if (type === "role") {
    mc.innerHTML = `
      <h3>🎖️ Give Role</h3>
      <label>Role</label>
      <select id="roleSelect">
        <option value="Moderator">Moderator</option>
        <option value="Admin">Admin</option>
        <option value="VIP">VIP</option>
        <option value="Tester">Tester</option>
      </select>
      <div class="modal-actions">
        <button onclick="closeModal()">Cancel</button>
        <button onclick="giveRole()">Give Role</button>
      </div>`;
  }
}

function closeModal(e) {
  if (!e || e.target === document.getElementById("modalBg")) {
    document.getElementById("modalBg")?.classList.remove("open");
  }
}

async function banPlayer() {
  if (!currentUID) return;
  const hours    = parseInt(document.getElementById("banDuration").value);
  const reason   = document.getElementById("banReason").value.trim();
  const banEntry = { PlayFabId: currentUID, Reason: reason };
  if (hours > 0) banEntry.DurationInHours = hours;
  closeModal();
  setStatus("Banning player...", "info");
  const res = await playfab("/Admin/BanUsers", { Bans: [banEntry] });
  if (res.code === 200) setStatus(`Player banned${hours > 0 ? ` for ${hours} hour(s)` : " permanently"}.`, "success");
  else setStatus("Ban failed: " + (res.errorMessage || "Unknown error"), "error");
}

async function giveRole() {
  if (!currentUID) return;
  const role = document.getElementById("roleSelect").value;
  closeModal();
  setStatus("Giving role...", "info");
  const res = await playfab("/Admin/UpdateUserData", {
    PlayFabId: currentUID,
    Data: { "Role": role },
    Permission: "Public"
  });
  if (res.code === 200) setStatus(`Role "${role}" given successfully.`, "success");
  else setStatus("Failed: " + (res.errorMessage || "Unknown error"), "error");
}

function setStatus(msg, type) {
  const el = document.getElementById("statusMsg");
  if (!el) return;
  el.textContent = msg;
  el.className   = "status-msg " + type;
}

if (document.getElementById("playerSelect")) loadPlayers();