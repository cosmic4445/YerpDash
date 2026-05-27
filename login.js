const users = [
  { username: "Cuber432", password: "123" },
  { username: "Andro23",  password: "Yerp112@!" },
  { username: "Saturn2",  password: "Yerp314@3!" },
  { username: "Destroyer21",  password: "Yerp414@4!" },
  { username: "CSVR19",  password: "Yerp514@5!" },
  { username: "Dryice990",  password: "Yerp614@6!" },
  { username: "Lazerr",  password: "Yerp714@7!" },
  { username: "Meshew112",  password: "Yerp814@8!" },
  { username: "Paz21",  password: "Yerp914@9!" },
  { username: "Semi77",  password: "Yerp1014@10!" },
  { username: "Sk1lld22",  password: "Yerp1114@11!" },
  { username: "Soul",  password: "Yerp1214@12!" },
  { username: "Xboom16",  password: "Yerp1314@13!" },
  { username: "Skippy32",  password: "Yerp1414@!#" },
];
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error    = document.getElementById("error");
 
  const match = users.find(u => u.username === username && u.password === password);
 
  if (match) {
    sessionStorage.setItem("loggedInUser", username);
 
    const emailSaved = localStorage.getItem("email_" + username);
    window.location.href = emailSaved ? "dashboard.html" : "setup.html";
  } else {
    error.textContent = "Incorrect username or password.";
  }
}
 