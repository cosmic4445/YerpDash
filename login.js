const users = [
   { username: "Cuber432", password: "Yerp214@2!" },
   { username: "Androm2", password: "Yerp@235" },
   { username: "Tophat", password: "Yerp@#44" },
   { username: "Saturn", password: "Yerp@442 " },
   { username: "Destroyer", password: "Yerp@240 " },
   { username: "CSVR", password: "Yerp@845" },
   { username: "Dryice", password: "Yerp@!29" },
   { username: "Hoppaa", password: "Yerp@77#" },
   { username: "Lazerr", password: "Yerp@856 " },
   { username: "Meshew", password: "Yerp@866" },
   { username: "Semi", password: "Yerp@88%" },
   { username: "Soul", password: "Yerp@2@3" },
   { username: "Wraxo", password: "Yerp@%64" },
   { username: "Wisefish", password: "Yerp@0*#" },
   { username: "Breezxy", password: "Yerp@688" },
   { username: "Sk1lld", password: "Yerp@55@" },
   { username: "Suitte", password: "Yerp@2@*" },
   { username: "Xboom", password: "Yerp@25*" },
   { username: "Skippy", password: "Yerp@&57 " },
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
