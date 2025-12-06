/* ================================
   DASHBOARD DATA (LocalStorage)
================================ */

let shows = JSON.parse(localStorage.getItem("shows")) || [];
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

let selectedShow = null;
let editMode = false;

// ------------------------------
// Save all data to LocalStorage
// ------------------------------
function saveAll() {
  localStorage.setItem("shows", JSON.stringify(shows));
  localStorage.setItem("bookings", JSON.stringify(bookings));
}

/* ================================
   SIDEBAR (Mobile Toggle)
================================ */
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  const main = document.querySelector(".dash-main");

  sidebar.classList.toggle("sidebar-open");
  overlay.classList.toggle("show");
  main.classList.toggle("shifted");
}

/* ================================
   DASHBOARD COUNTERS
================================ */
function refreshDashboard() {
  document.getElementById("totalShows").textContent = shows.length;
  document.getElementById("totalBookings").textContent = bookings.length;

  const today = new Date();
  const upcoming = shows.filter(s => new Date(s.date) >= today).length;

  document.getElementById("upcomingEvents").textContent = upcoming;
}

/* ================================
   RENDER SHOW LIST
================================ */
function renderShows() {
  const container = document.getElementById("showsContainer");
  container.innerHTML = "";

  if (shows.length === 0) {
    container.innerHTML = `<p style="opacity:.6;font-size:14px;">No shows added yet.</p>`;
    refreshDashboard();
    return;
  }

  shows.forEach((show, index) => {
    container.innerHTML += `
      <div class="show-card">
        <div>
          <h3>${show.name}</h3>
          <p>${show.date} • ${show.location}</p>
        </div>

        <div class="show-actions">
          <button class="green-btn" onclick="openBooking(${index})">Book</button>
          <button class="green-btn" onclick="editShow(${index})">Edit</button>
          <button class="close-btn" onclick="deleteShow(${index})">Delete</button>
        </div>
      </div>
    `;
  });

  refreshDashboard();
  saveAll();
}

/* ================================
   ADD + EDIT SHOW MODAL
================================ */
function openAddShow() {
  editMode = false;

  document.getElementById("modalTitle").textContent = "Add New Show";
  document.getElementById("showName").value = "";
  document.getElementById("showDate").value = "";
  document.getElementById("showLocation").value = "";

  document.getElementById("addShowModal").style.display = "flex";
}

function editShow(i) {
  editMode = true;
  selectedShow = i;

  const s = shows[i];

  document.getElementById("modalTitle").textContent = "Edit Show";
  document.getElementById("showName").value = s.name;
  document.getElementById("showDate").value = s.date;
  document.getElementById("showLocation").value = s.location;

  document.getElementById("addShowModal").style.display = "flex";
}

function closeAddShow() {
  document.getElementById("addShowModal").style.display = "none";
}

function saveShow() {
  const name = document.getElementById("showName").value;
  const date = document.getElementById("showDate").value;
  const loc = document.getElementById("showLocation").value;

  if (!name || !date || !loc) {
    alert("Please fill all fields.");
    return;
  }

  if (editMode) {
    shows[selectedShow] = { name, date, location: loc };
  } else {
    shows.push({ name, date, location: loc });
  }

  closeAddShow();
  renderShows();
}

/* ================================
   DELETE SHOW
================================ */
function deleteShow(i) {
  if (confirm("Remove this show?")) {
    shows.splice(i, 1);
    renderShows();
  }
}

/* ================================
   BOOKING MODAL
================================ */
function openBooking(i) {
  selectedShow = i;
  document.getElementById("bookModal").style.display = "flex";
}

function closeBooking() {
  document.getElementById("bookModal").style.display = "none";
}

function confirmBooking() {
  const name = document.getElementById("bookName").value;
  const email = document.getElementById("bookEmail").value;

  if (!name || !email) {
    alert("Enter all fields.");
    return;
  }

  bookings.push({
    show: shows[selectedShow].name,
    user: name,
    email: email,
  });

  closeBooking();
  saveAll();
  refreshDashboard();

  alert("Booking confirmed!");
}

/* ================================
   SORTING
================================ */
document.getElementById("sortShows").addEventListener("change", () => {
  const val = document.getElementById("sortShows").value;

  if (val === "newest") {
    shows.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (val === "oldest") {
    shows.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else if (val === "upcoming") {
    const today = new Date();
    shows.sort((a, b) => new Date(a.date) - new Date(b.date));
    shows = shows.filter(s => new Date(s.date) >= today);
  }

  renderShows();
});

/* ================================
   SEARCH SHOWS
================================ */
document.getElementById("searchShow").addEventListener("input", (e) => {
  const val = e.target.value.toLowerCase();
  const container = document.getElementById("showsContainer");

  container.innerHTML = "";

  shows
    .filter(show => show.name.toLowerCase().includes(val))
    .forEach((show, index) => {
      container.innerHTML += `
        <div class="show-card">
          <div>
            <h3>${show.name}</h3>
            <p>${show.date} • ${show.location}</p>
          </div>

          <div class="show-actions">
            <button class="green-btn" onclick="openBooking(${index})">Book</button>
            <button class="green-btn" onclick="editShow(${index})">Edit</button>
            <button class="close-btn" onclick="deleteShow(${index})">Delete</button>
          </div>
        </div>`;
    });

  if (container.innerHTML === "") {
    container.innerHTML = `<p style="opacity:.6;font-size:14px;">No matching shows.</p>`;
  }
});

/* ================================
   INITIAL LOAD
================================ */
document.addEventListener("DOMContentLoaded", () => {
  renderShows();
  refreshDashboard();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
    
    // Remove token or any stored user data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect back to main page
    window.location.href = "index.html";  
});
