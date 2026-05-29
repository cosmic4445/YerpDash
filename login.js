import { login } from "./auth.js";

async function doLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error    = document.getElementById("error");

  error.textContent = "";

  if (!username || !password) {
    error.textContent = "Enter your username and password.";
    return;
  }

  error.textContent = "Logging in...";
  error.style.color = "#888";

  const account = await login(username, password);

  if (account) {
    sessionStorage.setItem("loggedInUser", username);
    sessionStorage.setItem("userAbilities", JSON.stringify(account.abilities || {}));
    const emailSaved = localStorage.getItem("email_" + username);
    window.location.href = emailSaved ? "dashboard.html" : "setup.html";
  } else {
    error.style.color = "";
    error.textContent = "Incorrect username or password.";
  }
}

// Make doLogin callable from onclick
window.login = doLogin;
