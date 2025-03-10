const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const multer = require('multer'); // File upload middleware
const fs = require('fs');
const helpers = require('handlebars-helpers')(); // Load helpers
const app = express();

const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        json: function (context) {
            return JSON.stringify(context);
        }
    }
});


// Set up Handlebars as the templating engine
app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'public/uploads/');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Dummy profile data (Replace with a database later)
let userProfile = {
    first_name: "John",
    last_name: "Doe",
    department: "Computer Science",
    bio: "Tell us something about yourself...",
    profile_pic: "/assets/default-avatar-icon-of-social-media-user-vector.jpg"
};

// Route to render Edit Profile page
app.get('/edit-profile', (req, res) => {
    res.render('edit-profile', { profile: userProfile });
});

// API Endpoint to update profile (Handles text + image upload)
app.post('/api/profile/update', upload.single('profile_pic'), (req, res) => {
    const { first_name, last_name, department, bio } = req.body;

    if (!first_name || !last_name || !department || !bio) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    userProfile.first_name = first_name;
    userProfile.last_name = last_name;
    userProfile.department = department;
    userProfile.bio = bio;

    if (req.file) {
        userProfile.profile_pic = `/uploads/${req.file.filename}`;
    }

    res.json({ success: true, message: "Profile updated successfully!", profile: userProfile });
});

// Cancel a reservation
app.post('/api/reservations/cancel', (req, res) => {
    const reservationId = parseInt(req.body.id);
    const index = reservations.findIndex(r => r.id === reservationId);
    if (index === -1) {
        return res.status(404).json({ error: "Reservation not found" });
    }
    
    // Update the reservation status
    reservations[index].status = "Canceled";
    reservations[index].end_datetime = new Date().toISOString(); // Set end time to now

    console.log(`Reservation ${reservationId} moved to past reservations.`);
    res.json({ success: true });
});




// Dummy reservations (Replace with database later)
let reservations = [
    { id: 2, lab_name: "AG601", slots: "A1", start_datetime: "2025-03-01T13:00:00Z", end_datetime: "2025-03-08T14:00:00Z", requester_name: "Christian Bunyi", reservers: "Christian Bunyi", purpose: "maki nishikino appreciation", status: "Completed" },
    { id: 1, lab_name: "GK602", slots: "A1, B2", start_datetime: "2025-03-16T14:30:00Z", end_datetime: "2025-03-16T15:00:00Z", requester_name: "Enzo Rafael Chan", reservers: "Christian Bunyi, Enzo Rafael Chan", purpose: "ruan mei appreciation", status: "Reserved" },
    { id: 3, lab_name: "SJ603", slots: "A1, B2, C3", start_datetime: "2025-03-17T16:00:00Z", end_datetime: "2025-03-17T17:00:00Z", requester_name: "Widenmar Embuscado", reservers: "Christian Bunyi, Enzo Rafael Chan, Widenmar Embuscado", purpose: "(the) herta appreciation", status: "Reserved" }
];



// Define routes for all pages
app.get('/', (req, res) => {
    res.render("index", {
        index: '/',
        editProfile: '/edit-profile',
        manageReservations: '/manage-reservations',
        admin: '/admin',
        login: '/login',
        register: 'register',
        editReservations: '/edit-reservations'
    });
});

app.get('/login', (req, res) => {
    res.render('login', { index: '/' });
});

// Route to display all reservations
app.get('/manage-reservations', (req, res) => {
    const now = new Date();
    console.log(`Current Time: ${now.toISOString()}`);

    reservations.forEach(r => {
        const start = new Date(r.start_datetime);
        const end = new Date(r.end_datetime);
        console.log(`Reservation ID: ${r.id}`);
        console.log(`  Start Time: ${start.toISOString()} | Is Future? ${start > now}`);
        console.log(`  End Time: ${end.toISOString()} | Is Past? ${end < now}`);
    });

    const upcomingReservations = reservations.filter(r => r.status !== "Canceled" && new Date(r.start_datetime) > now);
    const pastReservations = reservations.filter(r => r.status === "Canceled" || new Date(r.end_datetime) <= now);    

    console.log("Final Upcoming Reservations:", upcomingReservations);
    console.log("Final Past Reservations:", pastReservations);

    res.render('manage-reservations', { upcomingReservations, pastReservations });
});



// Get all reservations for admin
app.get('/admin', (req, res) => {
    const now = new Date();
    const allRequesters = [...new Set(reservations.map(r => r.requester_name))];
    const upcomingReservations = reservations.filter(r => r.status !== "Canceled" && new Date(r.start_datetime) > now);
    res.render('admin', {
        allReservations: reservations,
        upcomingReservations,
        allRequesters
    });
});


// Cancel a reservation
app.post('/api/reservations/cancel', (req, res) => {
    const reservationId = parseInt(req.body.id);

    console.log("All Reservations BEFORE Cancellation:");
    console.log(reservations);

    const index = reservations.findIndex(r => r.id === reservationId);
    if (index === -1) {
        console.log(`Error: Reservation ${reservationId} not found for cancellation.`);
        return res.status(404).json({ error: "Reservation not found" });
    }

    console.log("Before Cancellation:", reservations[index]);

    // Update the reservation status
    reservations[index].status = "Canceled";
    reservations[index].end_datetime = new Date().toISOString(); // Set end time to now

    console.log("After Cancellation:", reservations[index]);

    console.log("All Reservations AFTER Cancellation:");
    console.log(reservations);

    res.json({ success: true });
});



// Edit specific reservation (same logic as edit-reservations.hbs)
app.post('/api/reservations/update', (req, res) => {
    const updatedReservation = req.body.reservation;

    if (!updatedReservation || !updatedReservation.id) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    const index = reservations.findIndex(r => r.id == updatedReservation.id);

    if (index === -1) {
        console.log(`Error: Reservation ${updatedReservation.id} not found for updating.`);
        return res.status(404).json({ error: "Reservation not found" });
    }

    console.log("Before Update:", reservations[index]);

    // Merge existing reservation with updates while keeping structure
    reservations[index] = {
        ...reservations[index],  // Preserve original fields
        ...updatedReservation    // Apply changes
    };

    console.log("After Update:", reservations[index]);

    res.json({ success: true, message: "Reservation updated successfully!", reservation: reservations[index] });
});




// Route to render Edit Reservations for all (Legacy)
app.get('/edit-reservations', (req, res) => {
    res.render('edit-reservations', { reservations });
});

// Route to render Edit Reservations for a single reservation
app.get('/edit-reservations/:id', (req, res) => {
    const reservationId = parseInt(req.params.id);
    const reservation = reservations.find(r => r.id === reservationId);

    if (!reservation) {
        return res.status(404).send("Reservation not found");
    }

    res.render('edit-reservations', { reservation });
});

// **API Endpoint to update a single reservation**
app.post('/api/reservations/update', (req, res) => {
    const updatedReservation = req.body.reservation;

    if (!updatedReservation || !updatedReservation.id) {
        return res.status(400).json({ error: "Invalid data format" });
    }

    // Find and update the reservation in memory
    const index = reservations.findIndex(r => r.id == updatedReservation.id);
    if (index !== -1) {
        reservations[index] = updatedReservation;
    }

    // Send back the updated reservation
    res.json({ success: true, message: "Reservation updated successfully!", reservation: reservations[index] });
});

app.post('/api/filter-reservations', (req, res) => {
    let { labs, statuses, start_date, end_date, requester_name, credited_individuals, purpose, upcoming_only } = req.body;

    console.log("\n✅ Received Filters from Frontend (RAW):", { labs, statuses, start_date, end_date, requester_name, credited_individuals, purpose, upcoming_only });

    let filteredReservations = reservations;

    const now = new Date();

    if (upcoming_only) {
        filteredReservations = filteredReservations.filter(r => new Date(r.start_datetime) > now && r.status !== "Canceled");
    }

    if (labs && labs.length) {
        filteredReservations = filteredReservations.filter(r => labs.includes(r.lab_name));
    }

    if (statuses && statuses.length) {
        filteredReservations = filteredReservations.filter(r => statuses.includes(r.status));
    }

    if (start_date) {
        console.log(`\n🔍 Filtering reservations with start date >= ${start_date} (RAW)`);
    
        filteredReservations = filteredReservations.filter(r => {
            return r.start_datetime.startsWith(start_date); // Compare raw string format
        });
    
        console.log("✅ After Start Date Filtering:", filteredReservations);
    }
    
    if (end_date) {
        console.log(`\n🔍 Filtering reservations with end date <= ${end_date} (RAW)`);
    
        filteredReservations = filteredReservations.filter(r => {
            return r.end_datetime.startsWith(end_date); // Compare raw string format
        });
    
        console.log("✅ After End Date Filtering:", filteredReservations);
    }
    
    console.log("📋 Final Filtered Reservations Sent to Frontend:", filteredReservations);

    res.json({ reservations: filteredReservations });
});







// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
