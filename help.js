import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBcXpYb1oHpqBkPS0KknlD7WigJ7F_9XLc",
  authDomain: "yerpdash.firebaseapp.com",
  projectId: "yerpdash",
  storageBucket: "yerpdash.firebasestorage.app",
  messagingSenderId: "295324745946",
  appId: "1:295324745946:web:af4121c1600ce13ca7a5e3"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

const OWNER        = "Cuber432";
const loggedInUser = sessionStorage.getItem("loggedInUser") || "";

if (loggedInUser === OWNER) {
  document.getElementById("createPostBtn").style.display = "block";
}

async function renderPosts() {
  const list = document.getElementById("postsList");
  list.innerHTML = `<div style="color:#888;font-size:13px;text-align:center;padding:24px 0;">Loading posts...</div>`;

  const q      = query(collection(db, "helpPosts"), orderBy("timestamp", "desc"));
  const snap   = await getDocs(q);

  if (snap.empty) {
    list.innerHTML = `<div style="color:#888;font-size:13px;text-align:center;padding:24px 0;">No posts yet.</div>`;
    return;
  }

  list.innerHTML = "";
  snap.forEach(docSnap => {
    const p   = docSnap.data();
    const div = document.createElement("div");
    div.className = "help-post";
    div.innerHTML = `
      <div class="help-post-header">
        <span class="help-post-title">${p.title}</span>
        <span class="help-post-date">${p.date}</span>
      </div>
      <div class="help-post-body">${p.content}</div>
      ${loggedInUser === OWNER ? `<button class="delete-post-btn" onclick="deletePost('${docSnap.id}')">🗑 Delete</button>` : ""}
    `;
    list.appendChild(div);
  });
}

window.openPostModal = function() {
  document.getElementById("modalBg").classList.add("open");
}

window.closeModal = function(e) {
  if (!e || e.target === document.getElementById("modalBg")) {
    document.getElementById("modalBg").classList.remove("open");
  }
}

window.submitPost = async function() {
  const title   = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  if (!title || !content) return;

  await addDoc(collection(db, "helpPosts"), {
    title,
    content,
    date: new Date().toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" }),
    timestamp: Date.now()
  });

  document.getElementById("postTitle").value   = "";
  document.getElementById("postContent").value = "";
  window.closeModal();
  renderPosts();
}

window.deletePost = async function(id) {
  await deleteDoc(doc(db, "helpPosts", id));
  renderPosts();
}

renderPosts();
