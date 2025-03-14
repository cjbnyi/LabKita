import 'dotenv/config';
import express from 'express';
import { create } from 'express-handlebars';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Import database functions
import { connectToMongo } from './database/conn.js';
import { seedDatabase } from './database/seed.js';

// Import routes
import {
    adminPanelRoutes,
    authRoutes,
    entityRoutes,
    homepageRoutes,
    manageReservationsRoutes,
    profileRoutes,
    searchUsersRoutes,
    viewLabsRoutes
} from './routes/routes.js';

// Obtain __filename and __dirname in ES6 standard
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create an Express application
const app = express();

// Request logging (writes to access.log)
const accessLogStream = fs.createWriteStream(path.join(process.cwd(), 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));

// JSON parsing middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Initialize Handlebars as the view engine
const hbs = create({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
    helpers: {
        eq: (a, b) => a === b, // Checks if two values are equal
        joinArray: (arr, separator = ', ') => Array.isArray(arr) ? arr.join(separator) : '', // Joins an array into a string
        json: context => JSON.stringify(context)
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session?.userType === "student" || req.session?.userType === "admin";
    res.locals.user = req.session?.user || null;
    next();
});

// Serve static files properly
app.use("/public", express.static(path.join(__dirname, 'public')));

// Register routes
app.use('', homepageRoutes);
app.use('/api', adminPanelRoutes);
app.use('/api', authRoutes);
app.use('/api', entityRoutes);
app.use('/api', manageReservationsRoutes);
app.use('/api', profileRoutes);
app.use('/api', searchUsersRoutes);
app.use('/api', viewLabsRoutes);

// 404 error handler
app.use((req, res) => {
    res.status(404).send('Page not found :(');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// CLI flags
const shouldSeed = process.argv.includes('--seed');

// Database initialization & server start
const startServer = async () => {
    try {
        await connectToMongo();

        if (shouldSeed) {
            console.log('Starting database seeding...');
            await seedDatabase();
        }

        const PORT = process.env.WEB_PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error initializing server:", error);
        process.exit(1);
    }
};

// Start the server
startServer();
