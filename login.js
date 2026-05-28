const users = [
   { username: "Cuber432", password: "Yerp214@2!" },
];
function getUsers() {
  const stored = localStorage.getItem("devAccounts");
  if (stored) return JSON.parse(stored);
  return defaultUsers;
}
 
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error    = document.getElementById("error");
 
  const users = getUsers();
  const match = users.find(u => u.username === username && u.password === password);
 
  if (match) {
    sessionStorage.setItem("loggedInUser", username);
    const emailSaved = localStorage.getItem("email_" + username);
    window.location.href = emailSaved ? "dashboard.html" : "setup.html";
  } else {
    error.textContent = "Incorrect username or password.";
  }
}
