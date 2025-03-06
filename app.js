import 'dotenv/config';
import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Import database functions
import { connectToMongo, getDb } from './database/conn.js';

// Import routes
import adminRoutes from './routes/adminRoutes.js';
import labRoutes from './routes/labRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

// Obtain __filename and __dirname in ES6 standard
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create the Express application
const app = express();

// Middleware
app.use(express.json()); // JSON body parsing

// Initialize the Handlebars view engine
const hbs = create({
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
});

app.engine('hbs', hbs.engine);

// Set the view engine
app.set('view engine', 'hbs');

// Load static files
app.use(express.static('public'));

// Register routes
app.use('/api/admins', adminRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/students', studentRoutes);

// Start the server after connecting to MongoDB
connectToMongo((err) => {
    if (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
    console.log("Connected to MongoDB server.");
    const db = getDb();

    const PORT = process.env.WEB_PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});
