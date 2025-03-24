# ✅ CCAPDEV MCO Phase 3 TODO List

## 🛠 GENERAL (All Members)
- [x] **Set up project repository on GitHub** and initialize with a `README.md`.  
- [x] **Include setup & run instructions in `README.md`.**  
- [x] **Follow Model-View-Controller (MVC) architecture.**  
- [x] **Install and document all required dependencies** (`package.json`).  
- [x] **Configure `.env` file for database connection, session secrets, etc.**  

---

## 🌐 BACKEND TASKS
### 🗃 Database & Models (SQL/MongoDB)
- [x] **Finalize database schema**.  
- [x] **Implement models using Mongoose/SQL.**  
- [x] **Ensure relationships between Users, Labs, and Reservations are properly defined.**  
- [x] **Seed database with at least 5 sample entries** per entity (Users, Labs, Reservations).  

### 🛠 Server & Routing (Express.js)
- [x] **Set up Express server** and ensure it's running.  
- [x] **Implement API routes for each feature.**  
- [x] **Connect server to database and verify CRUD operations.**  
- [x] **Implement periodic updates for seat availability.**  
- [x] **Ensure proper HTTP methods are used (GET, POST, PUT, DELETE).**  
- [x] **Implement error handling and 404 page.**  

### 🔐 Authentication & Security
- [ ] **Implement user authentication (register, login, logout).**  
- [ ] **Session persistence until logout or window closure.**  
- [ ] **Implement "remember me" feature (extends session by 3 weeks).**  
- [ ] **Ensure role-based access control (Student, Lab Technician).**  
- [x] **Hash passwords using bcrypt before storing in database.**  
- [ ] **Sanitize user inputs to prevent injection attacks.**  

---

## 🎨 FRONTEND TASKS
- [x] **Set up front-end framework** (e.g., Handlebars, React, Vue).  
- [ ] **Ensure a cohesive UI design and intuitive navigation.**  
- [ ] **Ensure user-friendly interactions (buttons, modals, alerts).**  
- [x] **Style views using CSS framework (Bootstrap, Tailwind, or custom CSS).**  
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
