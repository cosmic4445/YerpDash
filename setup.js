const loggedInUser = sessionStorage.getItem("loggedInUser");

// If not logged in, send back to login
if (!loggedInUser) window.location.href = "index.html";

// Strip numbers/special chars for display
const displayName = loggedInUser.replace(/[^a-zA-Z]/g, "");
document.getElementById("setupName").textContent = displayName;

function saveEmail() {
  const email = document.getElementById("setupEmail").value.trim();
  const error = document.getElementById("error");

  if (!email || !email.includes("@")) {
    error.textContent = "Enter a valid email address.";
    return;
  }

  // Save email tied to this username
  localStorage.setItem("email_" + loggedInUser, email);
  window.location.href = "dashboard.html";
}