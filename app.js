import 'dotenv/config';
import express from 'express';
import { create } from 'express-handlebars';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Import database functions
import { connectToMongo } from './database/conn.js';
import { seedDatabase } from './database/seed.js';

// Import routes
import {
    adminRoutes,
    authRoutes,
    publicRoutes,
    studentRoutes
} from './routes/routes.js';

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
app.use('/api/admins', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/students', studentRoutes);

// Connect to MongoDB and seed the database before starting the server
try {
    await connectToMongo();
    await seedDatabase();

    const PORT = process.env.WEB_PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("Error initializing server:", error);
    process.exit(1);
}


