const API = "https://collinfreestone.onrender.com/api";
let token = localStorage.getItem("adminToken");

// 🔒 Redirect to login page if no token
if (!token && !window.location.href.includes("admin-login.html")) {
    alert("You must login first!");
    window.location.href = "admin-login.html";
}

/* ---------------------------------------------------
   🟢 ADMIN LOGIN
--------------------------------------------------- */
async function adminLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, loginAs: "admin" })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "Invalid admin login");
        return;
    }

    if (data.token) {
        localStorage.setItem("adminToken", data.token);
        window.location.href = "admin-dashboard.html";
    }
}


/* ---------------------------------------------------
   🟦 LOAD USERS IN ADMIN PANEL
--------------------------------------------------- */
async function loadUsers() {
    if (!document.querySelector("#users-table")) return; // Prevent errors

    try {
        const res = await fetch(`${API}/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const users = await res.json();
        const tbody = document.querySelector("#users-table tbody");
        tbody.innerHTML = "";

        users.forEach(u => {
            const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();

            tbody.innerHTML += `
                <tr>
                    <td>${fullName}</td>
                    <td>${u.email}</td>
                    <td>
                        <button class="delete-btn" onclick="deleteUser('${u._id}')">Delete</button>
                    </td>
                </tr>`;
        });
    } catch (err) {
        console.log("Error loading users:", err);
    }
}

/* ---------------------------------------------------
   🗑 DELETE USER
--------------------------------------------------- */
async function deleteUser(id) {
    try {
        await fetch(`${API}/admin/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        loadUsers();
    } catch (err) {
        alert("Error deleting user");
    }
}

/* ---------------------------------------------------
   🚪 LOGOUT
--------------------------------------------------- */
function adminLogout() {
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
}



/* ---------------------------------------------------
   📌 LOAD BOOKED EVENTS (ADMIN SIDE)
--------------------------------------------------- */
async function loadBookedEvents() {
    if (!document.querySelector("#events-table")) return;

    try {
        const res = await fetch(`${API}/events/all`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const bookings = await res.json();

        const tbody = document.querySelector("#events-table tbody");
        tbody.innerHTML = "";

        bookings.forEach(b => {
            // Safety check for events field
            let eventsShown = "";
            if (Array.isArray(b.events) && b.events.length > 0) {
                eventsShown = b.events.join(", ");
            } else if (b.eventTitle) {
                eventsShown = b.eventTitle;
            } else {
                eventsShown = "No acts specified";
            }

            tbody.innerHTML += `
                <tr>
                    <td>${b.name}</td>
                    <td>${b.email}</td>
                    <td>${eventsShown}</td>
                    <td>${new Date(b.createdAt).toLocaleString()}</td>
                </tr>
            `;
        });

    } catch (err) {
        console.log("Error loading bookings:", err);
    }
}

