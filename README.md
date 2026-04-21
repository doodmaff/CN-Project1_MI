# CN Project2

## Overview
This project focuses on improving a website by adding security, performance, and monitoring features. The goal was to make the website more secure, faster, and able to track user activity, similar to how real-world production websites operate.

The website includes a dynamic guestbook, security protections against common attacks, and performance optimizations to improve user experience.

---

## Live Website
https://doodmaff.github.io/CN-Project1_MI/index.html

---

## Features

### Security Enhancements
- HTTPS enabled through GitHub Pages to encrypt all traffic
- Protection against XSS attacks using DOMPurify to sanitize user input
- Input validation on guestbook entries to prevent malicious scripts

---

### Database Integration
- Integrated Firebase Firestore to store and retrieve guestbook messages
- Users can submit messages which are saved and displayed dynamically
- Converts the website from static to dynamic content

---

### Performance Optimization
- Lazy loading images to improve page load speed
- Browser caching behavior observed using developer tools
- Optimized image usage across pages

---

### Deployment
- Website is deployed using GitHub Pages
- Publicly accessible and runs over HTTPS
- Uses GitHub infrastructure for reliability and scalability

---

### Monitoring & Analysis
- Google Analytics used to monitor website traffic and user behavior
- Tracks page visits and user interaction
- Helps identify performance trends and potential security concerns

---

## How to Run Locally
1. Clone the repository:
   git clone https://github.com/doodmaff/CN-Project1_MI.git

2. Open the project folder

3. Open index.html in your browser

4. (Optional) Use Live Server in VSCode for better experience

---

## Technologies Used
- HTML, CSS, JavaScript
- Firebase Firestore
- DOMPurify
- GitHub Pages
