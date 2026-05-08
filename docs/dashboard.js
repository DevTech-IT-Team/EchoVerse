const API = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:") 
    ? "http://localhost:5000/api" 
    : "https://collinfreestone.onrender.com/api";

const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

// Redirect if not logged in
if (!token || !user) {
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("welcome-msg").textContent = `Welcome back, ${user.firstName}!`;
    document.getElementById("user-email").textContent = user.email;

    loadUpcomingShows();
    loadMyBookings();
});

/* ================================
   LOAD UPCOMING SHOWS
================================ */
async function loadUpcomingShows() {
    const container = document.getElementById("shows-container");
    try {
        const res = await fetch(`${API}/events/upcoming-shows`);
        const data = await res.json();
        const shows = data.upcoming || [];
        
        container.innerHTML = "";
        
        shows.forEach(show => {
            const card = document.createElement("div");
            card.className = "show-card";
            card.style.cursor = "pointer";
            card.onclick = () => openBookingModal(show.id, show.title, show.date, show.location);
            
            card.innerHTML = `
                <h3>${show.title}</h3>
                <p><i class="fas fa-calendar"></i> ${show.date}</p>
                <p><i class="fas fa-clock"></i> ${show.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${show.location}</p>
                <span class="btn-book">Book Now</span>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = "<p>Error loading shows.</p>";
    }
}

/* ================================
   LOAD MY BOOKINGS
================================ */
async function loadMyBookings() {
    const container = document.getElementById("bookings-container");
    try {
        const res = await fetch(`${API}/events/my-bookings/${user.email}`);
        const bookings = await res.json();
        
        container.innerHTML = "";
        
        if (bookings.length === 0) {
            container.innerHTML = '<tr><td colspan="4">You haven\'t booked any events yet.</td></tr>';
            return;
        }

        bookings.forEach(b => {
            const row = document.createElement("tr");
            
            // Check if it was a general inquiry or a specific show
            const eventName = (b.events && b.events.length > 0) ? b.events.join(", ") : (b.eventTitle || "Unknown Event");
            const eventDate = b.eventDate || "-";
            const eventLoc = b.eventLocation || "-";
            const status = b.status || "pending";

            row.innerHTML = `
                <td>${eventName}</td>
                <td>${eventDate}</td>
                <td>${eventLoc}</td>
                <td><span style="color: ${getStatusColor(status)}; font-weight: bold;">${status.toUpperCase()}</span></td>
            `;
            container.appendChild(row);
        });
    } catch (err) {
        container.innerHTML = '<tr><td colspan="4">Error loading bookings.</td></tr>';
    }
}

function getStatusColor(status) {
    switch (status.toLowerCase()) {
        case 'confirmed': return '#1DB954';
        case 'pending': return '#f39c12';
        case 'cancelled': return '#e74c3c';
        default: return '#fff';
    }
}

/* ================================
   BOOKING MODAL LOGIC
=============================== */
let currentShowData = null;

function openBookingModal(id, title, date, location) {
    currentShowData = { id, title, date, location };
    document.getElementById("modalShowTitle").textContent = `Book ${title}`;
    document.getElementById("modalShowName").value = title;
    document.getElementById("modalShowDate").value = date;
    document.getElementById("bookingModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("bookingModal").style.display = "none";
}

document.getElementById("bookingForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const bookingData = {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        eventType: 'upcoming-show',
        eventId: currentShowData.id,
        eventTitle: currentShowData.title,
        eventDate: currentShowData.date,
        eventLocation: currentShowData.location,
        numberOfGuests: document.getElementById("guests").value,
        specialRequests: document.getElementById("requests").value
    };

    try {
        const res = await fetch(`${API}/events/book`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bookingData)
        });

        if (res.ok) {
            alert("Booking submitted successfully!");
            closeModal();
            loadMyBookings(); // Refresh the list
        } else {
            alert("Failed to submit booking.");
        }
    } catch (err) {
        alert("Network error.");
    }
});

/* ================================
   LOGOUT
================================ */
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}
