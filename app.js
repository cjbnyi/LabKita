import 'dotenv/config';
import { connectToMongo, getDb } from './database/conn';
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';

// Import routes
const adminRoutes = require('./routes/adminRoutes');
const labRoutes = require('./routes/labRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const seatRoutes = require('./routes/seatRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Create the Express application
const app = express();

// Initialize the Handlebars view engine
app.engine('hbs', exphbs({
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
}));

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

connectToMongo((err) => {
    if (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
    console.log("Connected to MongoDB server");
    const db = getDb();

    const PORT = process.env.WEB_PORT || 3000;
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
});
