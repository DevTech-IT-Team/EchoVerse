const API = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:") 
    ? "http://localhost:5000/api" 
    : "https://collinfreestone.onrender.com/api";

const showsList = document.getElementById('showsList');
const showModal = document.getElementById('showModal');
const showForm = document.getElementById('showForm');
let allShows = [];

// Fetch all shows on load
async function fetchShows() {
    try {
        const response = await fetch(`${API}/events/upcoming-shows`);
        const data = await response.json();
        // Combine upcoming and past shows for admin view
        allShows = [...(data.upcoming || []), ...(data.past || [])];
        renderShows();
    } catch (error) {
        console.error("Error fetching shows:", error);
        showsList.innerHTML = `<p style="color: #ff4d4d;">Error loading shows. Please check if backend is running.</p>`;
    }
}

function renderShows() {
    if (allShows.length === 0) {
        showsList.innerHTML = `<p style="color: var(--text-muted);">No shows found. Add your first show!</p>`;
        return;
    }

    showsList.innerHTML = allShows.map(show => `
        <div class="show-item">
            <div class="show-info">
                <h3>${show.title} ${show.isFeatured ? '<span style="color: var(--spotify-green); font-size: 10px; vertical-align: middle;">[FEATURED]</span>' : ''}</h3>
                <p><i class="fas fa-calendar"></i> ${show.date} | <i class="fas fa-clock"></i> ${show.time}</p>
                <p><i class="fas fa-map-marker-alt"></i> ${show.location}</p>
            </div>
            <div class="show-actions">
                <button class="btn btn-outline btn-small" onclick="editShow('${show._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-small" onclick="deleteShow('${show._id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openAddModal() {
    document.getElementById('modalTitle').innerText = "Add New Show";
    showForm.reset();
    document.getElementById('showId').value = "";
    showModal.style.display = 'flex';
}

function closeModal() {
    showModal.style.display = 'none';
}

function editShow(id) {
    const show = allShows.find(s => s._id === id);
    if (!show) return;

    document.getElementById('modalTitle').innerText = "Edit Show";
    document.getElementById('showId').value = show._id;
    document.getElementById('title').value = show.title;
    document.getElementById('date').value = show.date;
    document.getElementById('time').value = show.time;
    document.getElementById('location').value = show.location;
    document.getElementById('address').value = show.address || "";
    document.getElementById('type').value = show.type || "";
    document.getElementById('order').value = show.order || 0;
    document.getElementById('image').value = show.image || "assets/Freestone Keys flier .jpg";
    document.getElementById('description').value = show.description || "";
    document.getElementById('isFeatured').checked = show.isFeatured || false;

    showModal.style.display = 'flex';
}

async function deleteShow(id) {
    if (!confirm("Are you sure you want to delete this show?")) return;

    try {
        const response = await fetch(`${API}/events/delete-show/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            fetchShows();
        } else {
            alert("Failed to delete show");
        }
    } catch (error) {
        console.error("Delete error:", error);
    }
}

showForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('showId').value;
    const showData = {
        title: document.getElementById('title').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        location: document.getElementById('location').value,
        address: document.getElementById('address').value,
        type: document.getElementById('type').value,
        order: parseInt(document.getElementById('order').value),
        image: document.getElementById('image').value,
        description: document.getElementById('description').value,
        isFeatured: document.getElementById('isFeatured').checked
    };

    const url = id ? `${API}/events/update-show/${id}` : `${API}/events/add-show`;
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(showData)
        });

        if (response.ok) {
            const result = await response.json();
            const action = id ? 'updated' : 'added';
            const category = result.category || 'upcoming';
            
            alert(`Show ${action} successfully! Added to ${category} shows section.`);
            closeModal();
            fetchShows();
        } else {
            alert("Failed to save show");
        }
    } catch (error) {
        console.error("Save error:", error);
    }
});

// Initial fetch
fetchShows();
