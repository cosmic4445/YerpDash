import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// ── Hashing ───────────────────────────────────────────

async function hashPassword(password) {
  const encoded = new TextEncoder().encode(password);
  const hashBuf = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

// ── Auth ──────────────────────────────────────────────

async function login(username, password) {
  const hashed  = await hashPassword(password);
  const ref     = doc(db, "accounts", username);
  const snap    = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.passwordHash !== hashed) return null;
  return data;
}

// ── Account Management ────────────────────────────────

async function getAllAccounts() {
  const snap = await getDocs(collection(db, "accounts"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function createAccount(username, password, email, abilities) {
  const hashed = await hashPassword(password);
  await setDoc(doc(db, "accounts", username), {
    username,
    passwordHash: hashed,
    email,
    abilities
  });
}

async function updateAccount(username, fields) {
  const ref = doc(db, "accounts", username);
  if (fields.password) {
    fields.passwordHash = await hashPassword(fields.password);
    delete fields.password;
  }
  await updateDoc(ref, fields);
}

async function deleteAccount(username) {
  await deleteDoc(doc(db, "accounts", username));
}

export { login, getAllAccounts, createAccount, updateAccount, deleteAccount, hashPassword };
