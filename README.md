# VenueBooker — Venue Booking System

A full-stack venue booking system where users can view available venues, see blocked dates, and make bookings. Admins can list, update, and delete venues, and block specific date ranges per venue.

## Tech Stack
### Frontend: HTML, CSS, JavaScript 
### Backend: Node.js, Express.js
### Database: MySQL
### UI Calendar: flatpickr.js
### Image Upload: multer (for admin venue image uploads)

## Features Implemented
### Admin:
Add new venue with name, image, description, location, capacity
Update and delete venues
Block booking dates for a venue (start_date to end_date)
View user bookings

### User:
View available venues (dynamically rendered)
Book a venue by selecting name, email, date, number of attendees
Date picker using flatpickr with disabled (blocked) dates per venue
Booking form auto-validates blocked dates
Successful bookings are saved in localStorage

## For local Setup:
### 1. Clone the repository
   git clone https://github.com/yourusername/venue-booker.git
   cd venue-booker

### 2. Install backend dependencies
   cd backend
   npm install

### 3. Setup MySQL Database
   Create a database (e.g., venue_booking)
   Import schema.sql to set up tables (venues, blocked_dates, bookings)

### 4. Configure database connection
   Edit backend/db.js:
   const pool = mysql.createPool({
   host: 'localhost',
   user: 'your_mysql_user',
   password: 'your_password',
   database: 'venue_booking'
   });

### 5. Start backend server
   node server.js


### 6. Open frontend/index.html in your browser

## Future Improvements:
Add user authentication
Admin login panel
Email confirmations for bookings
Filter venues by city, capacity
Search & sort venues
Image Gallery & Virtual Tours
Upload multiple images per venue
Integrate 360° views or virtual tours
Bundle services with venue bookings

### Analytics Dashboard (Admin)
   Total bookings by month
   Revenue tracking
   Most popular venues
   Feedback overview

## For database

CREATE DATABASE venue_booking;

USE venue_booking;

CREATE TABLE venues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    capacity INT,
    description TEXT,
    image VARCHAR(255)
    );

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venue_name VARCHAR(100),
    name VARCHAR(100),
    email VARCHAR(100),
    date DATE,
    attendees INT
    );

CREATE TABLE blocked_dates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venue_name VARCHAR(100),
    start_date DATE,
    end_date DATE
    );

CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    password VARCHAR(100)
);