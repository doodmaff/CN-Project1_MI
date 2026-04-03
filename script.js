// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBURLQ0kyhvnQSv56GGFsglTmrXaVrGdcY",
  authDomain: "reddevils-db.firebaseapp.com",
  projectId: "reddevils-db",
  storageBucket: "reddevils-db.firebasestorage.app",
  messagingSenderId: "707657666793",
  appId: "1:707657666793:web:81c0f594cb47ed675e2078",
  measurementId: "G-BPC8WVGQQN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchESPNTable() {
  const url = "https://site.api.espn.com/apis/v2/sports/soccer/eng.1/standings";
  const container = document.getElementById('pl-table-container');

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }
    const data = await response.json();
    const standings = data.children[0].standings.entries;

    let tableHTML = `
      <table class="pl-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Club</th>
            <th>MP</th>
            <th>GD</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
    `;

    standings.forEach(entry => {
      const team = entry.team;
      const stats = entry.stats;

      const rank = stats.find(s => s.type === "rank")?.displayValue;
      const gp = stats.find(s => s.type === "gamesplayed")?.displayValue;
      const gd = stats.find(s => s.type === "pointdifferential")?.displayValue;
      const pts = stats.find(s => s.type === "points")?.displayValue;

      const isUnited = team.id === "360";
      const rowClass = isUnited ? 'class="highlight-united"' : '';

      tableHTML += `
        <tr ${rowClass}>
          <td>${rank}</td>
          <td class="team-cell">
            <img src="${team.logos[0].href}" alt="" class="table-logo" loading="lazy">
            ${team.displayName}
          </td>
          <td>${gp}</td>
          <td>${gd}</td>
          <td>${pts}</td>
        </tr>
      `;
    });

    tableHTML += `</tbody></table>`;
    // Sanitize the generated HTML with DOMPurify before inserting it into the DOM to prevent XSS attacks.
    if (typeof DOMPurify !== 'undefined') {
      container.innerHTML = DOMPurify.sanitize(tableHTML);
    } else {
      throw new Error("DOMPurify failed to load.");
    }

  } catch (error) {
    console.error("API Error:", error);
    container.innerHTML = `<div class='loading'>Failed to load live data. <br><small style="color: var(--red);">Error: ${error.message}</small></div>`;
  }
}

function initGuestbook() {
  const guestbookForm = document.getElementById('guestbook-form');
  const messagesContainer = document.getElementById('guestbook-messages');

  if (!guestbookForm || !messagesContainer) return;

  // Real time listener to fetch and display messages
  const q = query(collection(db, "guestbook"), orderBy("createdAt", "desc"));
  onSnapshot(q, (snapshot) => {
    messagesContainer.innerHTML = '';
    snapshot.forEach((doc) => {
      const data = doc.data();
      const date = data.createdAt ? data.createdAt.toDate().toLocaleString() : 'Just now';
      const safeName = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(data.name) : data.name;
      const safeMsg = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(data.message) : data.message;

      messagesContainer.innerHTML += `
        <div class="gb-message-card">
          <div class="gb-name">${safeName}</div>
          <p class="gb-text">${safeMsg}</p>
          <div class="gb-date">${date}</div>
        </div>
      `;
    });
  }, (error) => {
    messagesContainer.innerHTML = `<div class="loading">Connect your Firebase database to see messages.</div>`;
  });

  // Add a new message when form is submitted
  guestbookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('gb-name');
    const messageInput = document.getElementById('gb-message');
    const submitBtn = document.getElementById('gb-submit');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';

    try {
      await addDoc(collection(db, "guestbook"), { name: nameInput.value, message: messageInput.value, createdAt: serverTimestamp() });
      nameInput.value = ''; messageInput.value = '';
    } catch (error) { alert("Failed to post message. Ensure your Firebase Config is pasted in script.js!"); } 
    finally { submitBtn.disabled = false; submitBtn.textContent = 'Post Message'; }
  });
}

document.addEventListener("DOMContentLoaded", () => { fetchESPNTable(); initGuestbook(); });
