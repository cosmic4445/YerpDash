const loggedInUser = sessionStorage.getItem("loggedInUser") || "";
const accounts     = JSON.parse(localStorage.getItem("devAccounts") || "[]");
const myAccount    = accounts.find(a => a.username === loggedInUser) || {};
const abilities    = myAccount.abilities || {};

// Hide sections based on abilities
if (!abilities["Can Ban"])  document.getElementById("banSection").style.display  = "none";
if (!abilities["Can Kick"]) document.getElementById("kickSection").style.display = "none";

let currentUID = null;

async function banPlayer() {
  if (!currentUID) { setStatus("Select a player first.", "error"); return; }
  const hours  = parseInt(document.getElementById("banDuration").value);
  const reason = document.getElementById("banReason").value.trim();
  const entry  = { PlayFabId: currentUID, Reason: reason };
  if (hours > 0) entry.DurationInHours = hours;
  setStatus("Banning...", "info");
  const res = await playfab("/Admin/BanUsers", { Bans: [entry] });
  if (res.code === 200) setStatus(`Player banned${hours > 0 ? ` for ${hours} hour(s)` : " permanently"}.`, "success");
  else setStatus("Ban failed: " + (res.errorMessage || "Unknown"), "error");
}

async function kickPlayer() {
  if (!currentUID) { setStatus("Select a player first.", "error"); return; }
  setStatus("Kicking...", "info");
  const res = await playfab("/Admin/UpdateUserData", {
    PlayFabId: currentUID,
    Data: { "ForceKick": "true" },
    Permission: "Public"
  });
  if (res.code === 200) setStatus("Player kicked.", "success");
  else setStatus("Kick failed: " + (res.errorMessage || "Unknown"), "error");
}

function onPlayerSelected() {
  const select = document.getElementById("playerSelect");
  const uid    = select.value;
  if (!uid) { document.getElementById("selectedPlayer").style.display = "none"; currentUID = null; return; }
  const text = select.options[select.selectedIndex].text;
  currentUID = uid;
  document.getElementById("playerDisplayName").textContent = text.split("  —  ")[0];
  document.getElementById("playerIDLabel").textContent     = uid;
  document.getElementById("selectedPlayer").style.display  = "block";
}

loadPlayers();