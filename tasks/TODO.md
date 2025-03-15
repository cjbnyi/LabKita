# ✅ CCAPDEV MCO Phase 3 TODO List

## 🛠 GENERAL (All Members)
- [ ] **Set up project repository on GitHub** and initialize with a `README.md`.  
- [ ] **Include setup & run instructions in `README.md`.**  
- [ ] **Follow Model-View-Controller (MVC) architecture.**  
- [ ] **Maintain a proper folder structure** (`models/`, `views/`, `controllers/`, `public/`, `routes/`).  
- [ ] **Install and document all required dependencies** (`package.json`).  
- [ ] **Configure `.env` file for database connection, session secrets, etc.**  

---

## 🌐 BACKEND TASKS
### 🗃 Database & Models (SQL/MongoDB)
- [ ] **Finalize database schema** (`models/User.js`, `models/Reservation.js`, `models/Lab.js`).  
- [ ] **Implement models using Mongoose/SQL.**  
- [ ] **Ensure relationships between Users, Labs, and Reservations are properly defined.**  
- [ ] **Seed database with at least 5 sample entries** per entity (Users, Labs, Reservations).  

### 🛠 Server & Routing (Express.js)
- [ ] **Set up Express server** and ensure it's running.  
- [ ] **Implement API routes for each feature:**  
  - [ ] `/auth/register` - Register new users  
  - [ ] `/auth/login` - Login  
  - [ ] `/auth/logout` - Logout  
  - [ ] `/users/:id` - View/Edit Profile  
  - [ ] `/labs/:id` - View lab details & seat availability  
  - [ ] `/reservations` - Manage reservations (CRUD)  
  - [ ] `/search` - Search users & free slots  
- [ ] **Connect server to database and verify CRUD operations.**  
- [ ] **Implement periodic updates for seat availability.**  
- [ ] **Ensure proper HTTP methods are used (GET, POST, PUT, DELETE).**  
- [ ] **Implement error handling and 404 page.**  

### 🔐 Authentication & Security
- [ ] **Implement user authentication (register, login, logout).**  
- [ ] **Session persistence until logout or window closure.**  
- [ ] **Implement "remember me" feature (extends session by 3 weeks).**  
- [ ] **Ensure role-based access control (Student, Lab Technician).**  
- [ ] **Hash passwords using bcrypt before storing in database.**  
- [ ] **Sanitize user inputs to prevent injection attacks.**  

---

## 🎨 FRONTEND TASKS
- [ ] **Set up front-end framework** (Handlebars, React, Vue).  
- [ ] **Ensure a cohesive UI design and intuitive navigation.**  
- [ ] **Implement necessary page views:**  
  - [ ] Home page (`index`)  
  - [ ] Login/Register page  
  - [ ] Lab reservation page (View availability, book seat)  
  - [ ] Profile page (Edit/View)  
  - [ ] Reservations page (See/Edit/Delete reservations)  
  - [ ] Search page (Find users/free slots)  
  - [ ] About page (List NPM packages used)  
- [ ] **Ensure user-friendly interactions (buttons, modals, alerts).**  
- [ ] **Style views using CSS framework (Bootstrap, Tailwind, or custom CSS).**  
- [ ] **Implement AJAX/WebSockets for live updates on seat availability.**  

---

## 📋 FORM VALIDATION (Front-End & Back-End)
- [ ] **Implement front-end validation** (required fields, valid input).  
- [ ] **Implement back-end validation** (sanitize input, prevent invalid requests).  
- [ ] **Ensure meaningful error messages for users.**  

---

## 🚀 DEPLOYMENT & FINALIZATION
- [ ] **Implement all feedback from Phase 2.**  
- [ ] **Ensure all required features are working properly.**  
- [ ] **Deploy the web application** (Heroku, Vercel, or recommended platform).  
- [ ] **Test deployment for bugs and security issues.**  
- [ ] **Ensure project documentation is up to date (`README.md`, deployment guide).**  
- [ ] **Prepare and submit final project deliverables.**  

---

## 📌 Optional Enhancements (Future Work)
- [ ] Implement a notification system for reservation reminders.  
- [ ] Enhance UI with animations and better UX.  
- [ ] Add analytics dashboard for lab usage statistics.  
- [ ] Implement two-factor authentication (2FA).  
- [ ] Improve accessibility for better usability.  
