import { getAllAccounts, createAccount, updateAccount, deleteAccount } from "./auth.js";

const OWNER        = "Cuber432";
const loggedInUser = sessionStorage.getItem("loggedInUser") || "";

//if (loggedInUser !== OWNER) window.location.href = "dashboard.html";

const ABILITIES = ["Can Ban", "Can Kick", "Can Give Role", "Can View Activity Log"];

let accounts = [];

async function loadAccounts() {
  document.getElementById("accountsList").innerHTML = `<div style="color:#888;font-size:13px;text-align:center;padding:24px 0;">Loading accounts...</div>`;
  accounts = await getAllAccounts();
  renderAccounts();
}

function renderAccounts() {
  const list = document.getElementById("accountsList");
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
          <span style="font-size:10px;color:#555;font-family:monospace;display:block;margin-top:2px;">Password: [hashed 🔒]</span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="action-btn" onclick="window.togglePreview(${i})">👁 Preview</button>
          <button class="action-btn" onclick="window.openEditModal(${i})">✏️ Edit</button>
          ${a.username !== OWNER ? `<button class="action-btn ban-btn" onclick="window.removeAccount('${a.username}')">🗑 Delete</button>` : ''}
        </div>
      </div>
      <div class="abilities-row">
        ${ABILITIES.map(ab => `
          <div class="ability-tag ${a.abilities?.[ab] ? 'on' : 'off'}" onclick="window.toggleAbility(${i}, '${ab}')">
            ${ab} <span>${a.abilities?.[ab] ? '✓' : '✗'}</span>
          </div>
        `).join("")}
      </div>
      <div class="account-preview" id="preview_${i}" style="display:none;">
        <div class="preview-label">👁 Preview — what ${a.username} sees</div>
        <div class="preview-dashboard">
          <div class="preview-section">
            <div class="preview-title">Player Control</div>
            <div class="preview-fake-select">Select a player... ▾</div>
            <div class="preview-btns">
              <div class="preview-btn ${a.abilities?.['Can Give Role'] ? '' : 'preview-disabled'}">🎖️ Give Role</div>
              <div class="preview-btn ${a.abilities?.['Can Kick'] ? '' : 'preview-disabled'}">👢 Kick</div>
              <div class="preview-btn ${a.abilities?.['Can Ban'] ? 'preview-danger' : 'preview-disabled'}">🔨 Ban</div>
            </div>
          </div>
          ${a.abilities?.['Can View Activity Log'] ? `
          <div class="preview-section">
            <div class="preview-title">Activity Log</div>
            <div class="preview-log-entry">No activity yet</div>
          </div>` : `
          <div class="preview-section preview-locked">🔒 Activity Log — No access</div>`}
        </div>
      </div>
    </div>
  `).join("");
}

window.togglePreview = function(i) {
  const p = document.getElementById(`preview_${i}`);
  p.style.display = p.style.display === "none" ? "block" : "none";
};

window.toggleAbility = async function(i, ability) {
  accounts[i].abilities = accounts[i].abilities || {};
  accounts[i].abilities[ability] = !accounts[i].abilities[ability];
  await updateAccount(accounts[i].username, { abilities: accounts[i].abilities });
  renderAccounts();
};

window.removeAccount = async function(username) {
  await deleteAccount(username);
  await loadAccounts();
};

window.openEditModal = function(i) {
  const a = accounts[i];
  document.getElementById("modalBg").classList.add("open");
  document.getElementById("modalContent").innerHTML = `
    <h3>✏️ Edit Account</h3>
    <label>Username</label>
    <input type="text" id="editUsername" value="${a.username}" ${a.username === OWNER ? 'readonly style="opacity:0.5"' : ''}>
    <label>New Password <span style="color:#666;font-size:11px;">(leave blank to keep current)</span></label>
    <div style="display:flex;gap:6px;">
      <input type="password" id="editPassword" placeholder="New password..." style="flex:1">
      <button type="button" onclick="const i=document.getElementById('editPassword');i.type=i.type==='password'?'text':'password'" style="padding:0 10px;border-radius:6px;font-size:13px;background:#2a2a2a;border:1px solid #444;color:#ccc;cursor:pointer;">👁</button>
    </div>
    <label>Email</label>
    <input type="email" id="editEmail" value="${a.email || ''}">
    <div class="modal-actions">
      <button onclick="window.closeModal()">Cancel</button>
      <button onclick="window.saveEdit(${i})">Save</button>
    </div>
  `;
};

window.openCreateModal = function() {
  document.getElementById("modalBg").classList.add("open");
  document.getElementById("modalContent").innerHTML = `
    <h3>➕ New Account</h3>
    <label>Username</label>
    <input type="text" id="newUsername" placeholder="Username...">
    <label>Password</label>
    <div style="display:flex;gap:6px;">
      <input type="password" id="newPassword" placeholder="Password..." style="flex:1">
      <button type="button" onclick="const i=document.getElementById('newPassword');i.type=i.type==='password'?'text':'password'" style="padding:0 10px;border-radius:6px;font-size:13px;background:#2a2a2a;border:1px solid #444;color:#ccc;cursor:pointer;">👁</button>
    </div>
    <label>Email</label>
    <input type="email" id="newEmail" placeholder="Email...">
    <div class="modal-actions">
      <button onclick="window.closeModal()">Cancel</button>
      <button onclick="window.createAcc()">Create</button>
    </div>
  `;
};

window.saveEdit = async function(i) {
  const a        = accounts[i];
  const password = document.getElementById("editPassword").value.trim();
  const email    = document.getElementById("editEmail").value.trim();
  const fields   = { email };
  if (password) fields.password = password;
  await updateAccount(a.username, fields);
  if (email) localStorage.setItem("email_" + a.username, email);
  window.closeModal();
  await loadAccounts();
};

window.createAcc = async function() {
  const username = document.getElementById("newUsername").value.trim();
  const password = document.getElementById("newPassword").value.trim();
  const email    = document.getElementById("newEmail").value.trim();
  if (!username || !password) return;
  await createAccount(username, password, email, {
    "Can Ban": false, "Can Kick": false, "Can Give Role": false, "Can View Activity Log": false
  });
  if (email) localStorage.setItem("email_" + username, email);
  window.closeModal();
  await loadAccounts();
};

window.closeModal = function(e) {
  if (!e || e.target === document.getElementById("modalBg")) {
    document.getElementById("modalBg").classList.remove("open");
  }
};

loadAccounts();
