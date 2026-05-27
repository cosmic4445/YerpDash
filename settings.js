const loggedInUser = sessionStorage.getItem("loggedInUser") || "";
const staffEmail   = localStorage.getItem("email_" + loggedInUser) || "";
const consoleLogs  = [];

function requestChange(type) {
  if (type === "username") {
    const val = document.getElementById("newUsername").value.trim();
    if (!val) { setSettingsStatus("Enter a new username.", "error"); return; }
    sendEmail(
      `Username Change Request from ${loggedInUser}`,
      `Staff member "${loggedInUser}" (${staffEmail}) has requested a username change to: "${val}"`
    );
    document.getElementById("newUsername").value = "";
  }

  if (type === "password") {
    const curr = document.getElementById("currentPassword").value;
    const next  = document.getElementById("newPassword").value;
    if (!curr || !next) { setSettingsStatus("Fill in both password fields.", "error"); return; }
    sendEmail(
      `Password Change Request from ${loggedInUser}`,
      `Staff member "${loggedInUser}" (${staffEmail}) has requested a password change.`
    );
    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value      = "";
  }
}

async function sendEmail(subject, message) {
  setSettingsStatus("Sending request...", "info");
  addConsoleLog(`[Email] Sending: ${subject}`);

  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id:  "service_n04qexg",
        template_id: "template_66bazne",
        user_id:     "bqG5dxtHHSiXuAnMN",
        template_params: {
          subject:    subject,
          message:    message,
          from_name:  loggedInUser,
          from_email: staffEmail
        }
      })
    });

    if (res.ok) {
      setSettingsStatus("Request sent to owner's email.", "success");
      addConsoleLog("[Email] Sent successfully");
    } else {
      const err = await res.text();
      addConsoleLog(`[Email] Failed: ${err}`);
      setSettingsStatus("Email failed: " + err, "error");
    }
  } catch(e) {
    setSettingsStatus("Email failed: " + e.message, "error");
    addConsoleLog(`[Email] Error: ${e.message}`);
  }
}

function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  document.getElementById("darkBtn").classList.toggle("active",  theme === "dark");
  document.getElementById("lightBtn").classList.toggle("active", theme === "light");
  addConsoleLog(`[Theme] Switched to ${theme} mode`);
}

function runCommand() {
  const input = document.getElementById("consoleInput");
  const cmd   = input.value.trim();
  if (!cmd) return;
  addConsoleLog(`> ${cmd}`);
  if      (cmd === "clear")  { consoleLogs.length = 0; renderConsole(); }
  else if (cmd === "whoami") addConsoleLog(loggedInUser);
  else if (cmd === "email")  addConsoleLog(staffEmail || "No email set");
  else if (cmd === "help")   addConsoleLog("Commands: clear, whoami, email, help");
  else                       addConsoleLog(`Unknown command: ${cmd}`);
  input.value = "";
}

function addConsoleLog(msg) {
  const time = new Date().toLocaleTimeString("en", { hour12: false });
  consoleLogs.push(`[${time}] ${msg}`);
  renderConsole();
}

function renderConsole() {
  const box = document.getElementById("consoleBox");
  box.innerHTML = consoleLogs.map(l => `<div class="console-line">${l}</div>`).join("");
  box.scrollTop = box.scrollHeight;
}

function setSettingsStatus(msg, type) {
  const el = document.getElementById("settingsStatus");
  el.textContent = msg;
  el.className   = "status-msg " + type;
}

// Init
const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);
addConsoleLog(`[System] Logged in as ${loggedInUser}`);
if (staffEmail) addConsoleLog(`[System] Email: ${staffEmail}`);