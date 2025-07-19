document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Scroll-to-top
  const scrollBtn = document.getElementById("scrollToTopBtn");
  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });
    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Highlight nav link on scroll
  const sections = document.querySelectorAll("section");
  const navLinksAll = document.querySelectorAll(".navbar-links a");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });
    navLinksAll.forEach(link => {
      link.classList.remove("active-link");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active-link");
      }
    });
  });

  // Testimonial slider
  const track = document.querySelector('.testimonial-track');
  const prevBtn = document.querySelector('.slider-btn.prev');
  const nextBtn = document.querySelector('.slider-btn.next');
  if (track && prevBtn && nextBtn) {
    let index = 0;
    const cardWidth = 320;
    nextBtn.addEventListener('click', () => {
      const totalCards = track.children.length;
      if (index < totalCards - 1) {
        index++;
        track.style.transform = `translateX(-${cardWidth * index}px)`;
      }
    });
    prevBtn.addEventListener('click', () => {
      if (index > 0) {
        index--;
        track.style.transform = `translateX(-${cardWidth * index}px)`;
      }
    });
  }
});

// Load venues and blocked dates
(async function loadVenues() {
  const venueContainer = document.getElementById("venueContainer");
  if (!venueContainer) return;

  try {
    const [venueRes, blockedRes] = await Promise.all([
      fetch("http://localhost:5000/api/admin/venues"),
      fetch("http://localhost:5000/api/admin/blocked-dates")
    ]);

    const venues = await venueRes.json();
    const blockedDates = await blockedRes.json();

    venueContainer.innerHTML = "";

    venues.forEach(v => {
      const card = document.createElement("div");
      card.className = "venue-card";
      card.innerHTML = `
        <img src="http://localhost:5000/uploads/${v.image}" alt="${v.name}" />
        <h3>${v.name}</h3>
        <p><strong>Location:</strong> ${v.location}</p>
        <p><strong>Capacity:</strong> ${v.capacity}</p>
        <p>${v.description}</p>
        <button class="book-btn">Book</button>
        <form class="booking-form" style="display:none;">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <input class="booking-date" type="text" required />
          <input type="number" placeholder="Attendees" required />
          <button type="submit">Submit</button>
        </form>
      `;
      venueContainer.appendChild(card);
    });

    setupBookingHandlers(blockedDates);
  } catch (err) {
    console.error("Error loading venues or blocked dates:", err);
    venueContainer.innerHTML = "<p>Failed to load venues.</p>";
  }
})();

function setupBookingHandlers(blockedDates = []) {
  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

  document.querySelectorAll(".venue-card").forEach(card => {
    const btn = card.querySelector(".book-btn");
    const form = card.querySelector(".booking-form");
    const dateInput = form.querySelector(".booking-date");
    const submitBtn = form.querySelector("button[type='submit']");
    const venueName = card.querySelector("h3").innerText;

    let isBlocked = false;

    // Filter blocked ranges for this venue
    const disabledRanges = blockedDates
      .filter(b => b.venue_name === venueName)
      .map(b => ({
        from: b.start_date,
        to: b.end_date
      }));

    // Initialize flatpickr
    flatpickr(dateInput, {
      dateFormat: "Y-m-d",
      disable: disabledRanges,
      onChange: function (selectedDates, dateStr) {
        isBlocked = disabledRanges.some(range => {
          const d = new Date(dateStr);
          return d >= new Date(range.from) && d <= new Date(range.to);
        });

        if (isBlocked) {
          alert(`Booking is blocked for "${venueName}" on this date.`);
          submitBtn.disabled = true;
          submitBtn.style.backgroundColor = "#ccc";
        } else {
          submitBtn.disabled = false;
          submitBtn.style.backgroundColor = "";
        }
      }
    });

    // Toggle booking form
    btn.addEventListener("click", () => {
      document.querySelectorAll(".booking-form").forEach(f => {
        if (f !== form) f.style.display = "none";
      });
      form.style.display = form.style.display === "block" ? "none" : "block";
    });

    // Handle submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (isBlocked) {
        alert("This date is blocked. Please choose another date.");
        return;
      }

      const name = form.querySelector("input[type='text']").value;
      const email = form.querySelector("input[type='email']").value;
      const date = dateInput.value;
      const attendees = form.querySelector("input[type='number']").value;

      bookings.push({ venue: venueName, name, email, date, attendees });
      localStorage.setItem("bookings", JSON.stringify(bookings));

      alert("Booking successful!");
      form.reset();
      form.style.display = "none";
    });
  });
}
