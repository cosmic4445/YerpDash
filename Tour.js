const loggedInUser = sessionStorage.getItem("loggedInUser") || "";
const accounts     = JSON.parse(localStorage.getItem("devAccounts") || "[]");
const myAccount    = accounts.find(a => a.username === loggedInUser) || {};
const abilities    = myAccount.abilities || {};

const TOUR_STEPS = [
  {
    title: "👋 Welcome to the Dashboard!",
    body:  `Hey <strong>${loggedInUser.replace(/[^a-zA-Z]/g, "")}</strong>, this is your admin hub. Here's a quick tour of what you can do.`
  },
  {
    title: "🛡️ Moderation",
    body:  `The Moderation tab lets you manage players in-game.<br><br>
            ${abilities["Can Ban"]  ? "✅ You can <strong>Ban</strong> players." : "❌ You don't have permission to <strong>Ban</strong>."}
            <br>
            ${abilities["Can Kick"] ? "✅ You can <strong>Kick</strong> players." : "❌ You don't have permission to <strong>Kick</strong>."}`
  },
  {
    title: "🎮 PlayFab",
    body:  `The PlayFab tab lets you manage player data.<br><br>
            ${abilities["Can Give Role"] ? "✅ You can <strong>Give Roles</strong> and manage items." : "❌ You don't have permission to manage items or roles."}`
  },
  {
    title: "📋 Activity Log",
    body:  abilities["Can View Activity Log"]
      ? "✅ You have access to the <strong>Activity Log</strong> — you can see what actions staff have taken."
      : "❌ You don't have access to the <strong>Activity Log</strong>."
  },
  {
    title: "⚙️ Settings",
    body:  "You can change your username or password from the <strong>Settings</strong> page. A request will be sent to the owner for approval."
  },
  {
    title: "✅ You're all set!",
    body:  "That's everything! Click <strong>Finish</strong> to get started. You can replay this tour anytime from Settings."
  }
];

let currentStep = 0;

function showTour() {
  currentStep = 0;
  document.getElementById("tourModal").style.display = "flex";
  renderStep();
}

function renderStep() {
  const step    = TOUR_STEPS[currentStep];
  const isLast  = currentStep === TOUR_STEPS.length - 1;
  const isFirst = currentStep === 0;

  document.getElementById("tourContent").innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
      <h3 style="font-size:15px;">${step.title}</h3>
      <span style="font-size:11px;color:#666;">${currentStep + 1} / ${TOUR_STEPS.length}</span>
    </div>
    <div style="font-size:13px;color:#aaa;line-height:1.7;margin-bottom:20px;">${step.body}</div>
    <div style="display:flex;gap:8px;justify-content:space-between;align-items:center;">
      <button onclick="skipTour()" style="background:none;border:none;color:#555;font-size:12px;cursor:pointer;padding:0;">Skip tour</button>
      <div style="display:flex;gap:8px;">
        ${!isFirst ? `<button onclick="prevStep()" style="padding:8px 16px;font-size:13px;border-radius:8px;">← Back</button>` : ""}
        <button onclick="${isLast ? 'finishTour()' : 'nextStep()'}" style="padding:8px 20px;font-size:13px;border-radius:8px;">
          ${isLast ? "Finish ✓" : "Next →"}
        </button>
      </div>
    </div>
    <div style="display:flex;gap:5px;justify-content:center;margin-top:14px;">
      ${TOUR_STEPS.map((_, i) => `<div style="width:6px;height:6px;border-radius:50%;background:${i === currentStep ? '#fff' : '#444'}"></div>`).join("")}
    </div>
  `;
}

function nextStep() { currentStep++; renderStep(); }
function prevStep() { currentStep--; renderStep(); }

function skipTour() {
  localStorage.setItem("tourDone_" + loggedInUser, "true");
  document.getElementById("tourModal").style.display = "none";
}

function finishTour() {
  localStorage.setItem("tourDone_" + loggedInUser, "true");
  document.getElementById("tourModal").style.display = "none";
}

// Auto-show on first login
const tourDone = localStorage.getItem("tourDone_" + loggedInUser);
if (!tourDone) showTour();

// Replay tour if redirected from settings
if (new URLSearchParams(window.location.search).get("tour") === "1") {
  localStorage.removeItem("tourDone_" + loggedInUser);
  showTour();
}