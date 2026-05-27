const OWNER        = "Cuber432";
const loggedInUser = sessionStorage.getItem("loggedInUser") || "";

if (loggedInUser !== OWNER) window.location.href = "dashboard.html";

const ABILITIES = ["Can Ban", "Can Kick", "Can Give Role", "Can View Activity Log"];

function getAccounts() {
  const stored = localStorage.getItem("devAccounts");
  if (stored) return JSON.parse(stored);

  const defaults = [
    {
      username: "Cuber432",
      password: "Yerp214@2!",
      email: localStorage.getItem("email_Cuber432") || "",
      abilities: { "Can Ban": true, "Can Kick": true, "Can Give Role": true, "Can View Activity Log": true }
    }
  ];
  saveAccounts(defaults);
  return defaults;
}

function saveAccounts(accounts) {
  localStorage.setItem("devAccounts", JSON.stringify(accounts));
}

function renderAccounts() {
  const list     = document.getElementById("accountsList");
  const accounts = getAccounts();

  if (accounts.length === 0) {
    list.innerHTML = `<div style="color:#888;font-size:13px;text-align:center;padding:24px 0;">No accounts.</div>`;
    return;
  }

  list.innerHTML = accounts.map((a, i) => `
    <div class="account-card" id="card_${i}">
      <div class="account-header">
        <div>
          <span class="account-name">${a.username}</span>
          ${a.username === OWNER ? '<span class="owner-badge">Owner</span>' : ''}
          <span class="account-email">${a.email || "No email set"}</span>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="action-btn" onclick="togglePreview(${i})">👁 Account View</button>
          <button class="action-btn" onclick="openEditModal(${i})">✏️ Edit</button>
          ${a.username !== OWNER ? `<button class="action-btn ban-btn" onclick="deleteAccount(${i})">🗑 Delete</button>` : ''}
        </div>
      </div>
      <div class="abilities-row">
        ${ABILITIES.map(ab => `
          <div class="ability-tag ${a.abilities[ab] ? 'on' : 'off'}" onclick="toggleAbility(${i}, '${ab}')">
            ${ab} <span>${a.abilities[ab] ? '✓' : '✗'}</span>
          </div>
        `).join("")}
      </div>
      <div class="account-preview" id="preview_${i}" style="display:none;">
        <div class="preview-label">👁 Preview — what ${a.username} sees</div>
        <div class="preview-dashboard">
          <div class="preview-section">
            <div class="preview-title">Player Control</div>
            <div class="preview-player-row">
              <div class="preview-fake-select">Select a player... ▾</div>
            </div>
            <div class="preview-btns">
              <div class="preview-btn ${a.abilities['Can Give Role'] ? '' : 'preview-disabled'}">🎖️ Give Role</div>
              <div class="preview-btn ${a.abilities['Can Kick'] ? '' : 'preview-disabled'}">👢 Kick</div>
              <div class="preview-btn ${a.abilities['Can Ban'] ? 'preview-danger' : 'preview-disabled'}">🔨 Ban</div>
            </div>
          </div>
          ${a.abilities['Can View Activity Log'] ? `
          <div class="preview-section">
            <div class="preview-title">Activity Log</div>
            <div class="preview-log-entry">No activity yet</div>
          </div>` : `
          <div class="preview-section preview-locked">
            🔒 Activity Log — No access
          </div>`}
        </div>
      </div>
    </div>
  `).join("");
}

function togglePreview(index) {
  const preview = document.getElementById(`preview_${index}`);
  preview.style.display = preview.style.display === "none" ? "block" : "none";
}

function toggleAbility(index, ability) {
  const accounts = getAccounts();
  accounts[index].abilities[ability] = !accounts[index].abilities[ability];
  saveAccounts(accounts);
  renderAccounts();
}

function deleteAccount(index) {
  const accounts = getAccounts();
  accounts.splice(index, 1);
  saveAccounts(accounts);
  renderAccounts();
}

function openEditModal(index) {
  const accounts = getAccounts();
  const a        = accounts[index];
  document.getElementById("modalBg").classList.add("open");
  document.getElementById("modalContent").innerHTML = `
    <h3>✏️ Edit Account</h3>
    <label>Username</label>
    <input type="text" id="editUsername" value="${a.username}" ${a.username === OWNER ? 'readonly style="opacity:0.5"' : ''}>
    <label>Password</label>
    <input type="password" id="editPassword" value="${a.password}">
    <label>Email</label>
    <input type="email" id="editEmail" value="${a.email}">
    <div class="modal-actions">
      <button onclick="closeModal()">Cancel</button>
      <button onclick="saveEdit(${index})">Save</button>
    </div>
  `;
}

function openCreateModal() {
  document.getElementById("modalBg").classList.add("open");
  document.getElementById("modalContent").innerHTML = `
    <h3>➕ New Account</h3>
    <label>Username</label>
    <input type="text" id="newUsername" placeholder="Username...">
    <label>Password</label>
    <input type="password" id="newPassword" placeholder="Password...">
    <label>Email</label>
    <input type="email" id="newEmail" placeholder="Email...">
    <div class="modal-actions">
      <button onclick="closeModal()">Cancel</button>
      <button onclick="createAccount()">Create</button>
    </div>
  `;
}

function saveEdit(index) {
  const accounts = getAccounts();
  const username = document.getElementById("editUsername").value.trim();
  const password = document.getElementById("editPassword").value.trim();
  const email    = document.getElementById("editEmail").value.trim();
  if (!username || !password) return;
  accounts[index].username = username;
  accounts[index].password = password;
  accounts[index].email    = email;
  localStorage.setItem("email_" + username, email);
  saveAccounts(accounts);
  closeModal();
  renderAccounts();
}

function createAccount() {
  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const email    = document.getElementById("newEmail").value.trim();
  if (!username || !password) return;
  const accounts = getAccounts();
  accounts.push({
    username, password, email,
    abilities: { "Can Ban": false, "Can Kick": false, "Can Give Role": false, "Can View Activity Log": false }
  });
  localStorage.setItem("email_" + username, email);
  saveAccounts(accounts);
  closeModal();
  renderAccounts();
}

function closeModal(e) {
  if (!e || e.target === document.getElementById("modalBg")) {
    document.getElementById("modalBg").classList.remove("open");
  }
}

renderAccounts();