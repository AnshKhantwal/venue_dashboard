let venues = [];
const tabs = document.querySelectorAll('.tab-link');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
tab.addEventListener('click', () => {
tabs.forEach(t => t.classList.remove('active'));
contents.forEach(c => c.classList.remove('active'));
tab.classList.add('active');
const tabId = tab.dataset.tab;
document.getElementById(tabId).classList.add('active');

if (tabId === 'bookings') loadBookings();
if (tabId === 'manage') fetchVenues();
if (tabId === 'block') fetchVenues(); // update dropdown
});
});

const venueList = document.getElementById('venueList');
const venueDropdown = document.getElementById('venueDropdown');

document.getElementById('addVenueForm').addEventListener('submit', async function (e) {
e.preventDefault();

const formData = new FormData();
formData.append('name', document.getElementById('venueName').value);
formData.append('location', document.getElementById('venueLocation').value);
formData.append('capacity', document.getElementById('venueCapacity').value);
formData.append('description', document.getElementById('venueDescription').value);
formData.append('image', document.getElementById('venueImage').files[0]);

try {
const res = await fetch('http://localhost:5000/api/admin/venues', {
method: 'POST',
body: formData
});
const data = await res.json();

if (res.ok) {
  alert('Venue added successfully!');
  this.reset();
  fetchVenues();
} else {
  alert(data.message || 'Failed to add venue');
}
} catch (err) {
alert('Error: ' + err.message);
}
});

async function fetchVenues() {
try {
const res = await fetch('http://localhost:5000/api/admin/venues');
const data = await res.json();
venues = data; // this updates the global array
renderVenues();
updateDropdown();
} catch (err) {
console.error('Error fetching venues', err);
}
}

function renderVenues() {
  venueList.innerHTML = ''; // Clear existing list

  venues.forEach(venue => {
    const card = document.createElement('div');
    card.className = 'venue-card';

    card.innerHTML = `
      <div class="venue-img-wrap">
        <img src="http://localhost:5000/uploads/${venue.image}" alt="${venue.name}" width="100" style="border-radius:8px; margin-bottom:10px;" />
      </div>
      <input type="text" class="edit-name" value="${venue.name}" />
      <input type="text" class="edit-location" value="${venue.location}" />
      <input type="number" class="edit-capacity" value="${venue.capacity}" />
      <textarea class="edit-description">${venue.description}</textarea>
      <input type="file" class="edit-image" accept="image/*" />
      <div class="card-buttons">
        <button class="edit-btn">Save</button>
        <button class="delete-btn">Delete</button>
      </div>
    `;

    // Input fields
    const nameInput = card.querySelector('.edit-name');
    const locationInput = card.querySelector('.edit-location');
    const capacityInput = card.querySelector('.edit-capacity');
    const descInput = card.querySelector('.edit-description');
    const imageInput = card.querySelector('.edit-image');

    // Save button handler
    card.querySelector('.edit-btn').addEventListener('click', async () => {
      const formData = new FormData();
      formData.append('name', nameInput.value);
      formData.append('location', locationInput.value);
      formData.append('capacity', capacityInput.value);
      formData.append('description', descInput.value);

      if (imageInput.files && imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
      }

      try {
        const res = await fetch(`http://localhost:5000/api/admin/venues/${venue.id}`, {
          method: 'PUT',
          body: formData
        });
        const data = await res.json();
        alert(data.message || 'Venue updated');
        fetchVenues(); // Refresh list
      } catch (err) {
        console.error('Update error:', err);
        alert('Failed to update venue');
      }
    });

    // Delete button handler
    card.querySelector('.delete-btn').addEventListener('click', async () => {
      if (!confirm(`Are you sure you want to delete "${venue.name}"?`)) return;

      try {
        const res = await fetch(`http://localhost:5000/api/admin/venues/${venue.id}`, {
          method: 'DELETE'
        });
        const data = await res.json();
        alert(data.message || 'Venue deleted');
        fetchVenues(); // Refresh list
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete venue');
      }
    });

    venueList.appendChild(card);
  });
}


function updateDropdown() {
venueDropdown.innerHTML = '';
venues.forEach(v => {
const option = document.createElement('option');
option.value = v.name; // use name for blocking
option.textContent = v.name;
venueDropdown.appendChild(option);
});
}

document.getElementById('blockDateForm').addEventListener('submit', async function (e) {
e.preventDefault();
const venueName = document.getElementById('venueDropdown').value;
const start = document.getElementById('startDate').value;
const end = document.getElementById('endDate').value;

try {
const res = await fetch('http://localhost:5000/api/admin/block-dates', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ venue_name: venueName, start_date: start, end_date: end })
});
const data = await res.json();
alert(data.message || 'Blocked');
this.reset();
} catch (err) {
alert('Failed to block date');
}
});

document.getElementById('logoutBtn').addEventListener('click', function () {
alert("Logout Successfully!");
window.location.href = 'admin-login.html';
});

function loadBookings() {
const bookingList = document.getElementById("bookingList");
const stored = localStorage.getItem("bookings");
const bookings = stored ? JSON.parse(stored) : [];

bookingList.innerHTML = '';

if (bookings.length === 0) {
bookingList.innerHTML = '<p>No bookings found.</p>';
return;
}

bookings.forEach(b => {
const card = document.createElement('div');
card.className = "booking-card";
card.innerHTML = `<h3>${b.venue}</h3> <p><strong>Name:</strong> ${b.name}</p> <p><strong>Email:</strong> ${b.email}</p> <p><strong>Date:</strong> ${b.date}</p> <p><strong>Attendees:</strong> ${b.attendees}</p> `;
bookingList.appendChild(card);
});
}


// Load blocked dates from backend and display them
function loadBlockedDates() {
  fetch("http://localhost:5000/api/admin/blocked-dates")
    .then(res => res.json())
    .then(data => {
      const blockedList = document.getElementById("blockedList");
      if (!blockedList) return;

      blockedList.innerHTML = data.length === 0
        ? "<p>No blocked dates found.</p>"
        : data.map(block => `
          <div class="blocked-item">
            <strong>${block.venue_name}</strong><br>
            From: ${block.start_date} To: ${block.end_date}
            <button onclick="unblockDate(${block.id})">Unblock</button>
          </div>
        `).join('');
    })
    .catch(err => {
      console.error("Error loading blocked dates:", err);
    });
}

// Unblock a specific blocked date
function unblockDate(id) {
  fetch(`http://localhost:5000/api/admin/blocked-dates/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Date unblocked successfully!");
        loadBlockedDates(); // Refresh the list
      } else {
        alert("Failed to unblock date.");
      }
    })
    .catch(err => {
      console.error("Error unblocking date:", err);
    });
}

// Load on page load
document.addEventListener("DOMContentLoaded", () => {
  loadBlockedDates();
});


fetchVenues(); 