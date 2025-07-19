// document.getElementById("adminLoginForm").addEventListener("submit", function (e) {
//   e.preventDefault();

//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value.trim();

//   // Simple validation
//   if (email === "" || password === "") {
//     alert("Please enter both email and password.");
//     return;
//   }

//   // You can later replace this with a real backend call
//   // For now, redirect to admin dashboard (mock)
//   window.location.href = "../admin-dashboard.html";
// });


// admin-login.js
document.addEventListener('DOMContentLoaded', () => {
const form = document.getElementById('loginForm');
if (form) {
form.addEventListener('submit', async e => {
e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('http://localhost:5000/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Login successful');
    window.location.href = 'admin-dashboard.html';
  } else {
    alert(data.message || 'Login Failed');
  }
});
}
});