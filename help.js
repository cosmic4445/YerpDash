const OWNER = "Cuber432";
const loggedInUser = sessionStorage.getItem("loggedInUser") || "";

// Posts stored in localStorage so they persist
let posts = JSON.parse(localStorage.getItem("helpPosts") || "[]");

// Show create button only for owner
if (loggedInUser === OWNER) {
  document.getElementById("createPostBtn").style.display = "block";
}

function renderPosts() {
  const list = document.getElementById("postsList");
  if (posts.length === 0) {
    list.innerHTML = `<div style="color:#888;font-size:13px;text-align:center;padding:24px 0;">No posts yet.</div>`;
    return;
  }
  list.innerHTML = posts.slice().reverse().map((p, i) => `
    <div class="help-post">
      <div class="help-post-header">
        <span class="help-post-title">${p.title}</span>
        <span class="help-post-date">${p.date}</span>
      </div>
      <div class="help-post-body">${p.content}</div>
      ${loggedInUser === OWNER ? `<button class="delete-post-btn" onclick="deletePost(${posts.length - 1 - i})">🗑 Delete</button>` : ""}
    </div>
  `).join("");
}

function openPostModal() {
  document.getElementById("modalBg").classList.add("open");
}

function closeModal(e) {
  if (!e || e.target === document.getElementById("modalBg")) {
    document.getElementById("modalBg").classList.remove("open");
  }
}

function submitPost() {
  const title   = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  if (!title || !content) return;

  posts.push({
    title,
    content,
    date: new Date().toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })
  });

  localStorage.setItem("helpPosts", JSON.stringify(posts));
  document.getElementById("postTitle").value   = "";
  document.getElementById("postContent").value = "";
  closeModal();
  renderPosts();
}

function deletePost(index) {
  posts.splice(index, 1);
  localStorage.setItem("helpPosts", JSON.stringify(posts));
  renderPosts();
}

renderPosts();