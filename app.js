import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import { create } from 'express-handlebars';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer'

// Import jobs
import { updateExpiredReservations } from './jobs/updateReservations.js';

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

import { setAuthLocals } from './middleware/setAuthLocals.js';

// Run jobs
updateExpiredReservations();

// Obtain __filename and __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});

// Create an Express application
const app = express();

// Enhance security
// app.use(limiter);
// app.use(helmet());

app.use(cookieParser());
app.use(setAuthLocals);

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
        eq: (a, b) => a === b,
        joinArray: (arr, separator = ', ') => Array.isArray(arr) ? arr.join(separator) : '',
        json: context => JSON.stringify(context),
        or: (a, b) => a || b,

        // Helper to check if an admin can cancel (only within 10 minutes after start time)
        adminCanCancel: (startDatetime) => {
            const now = new Date();
            const startTime = new Date(startDatetime);
            
            // Log for debugging purposes
            console.log('Current time:', now);
            console.log('Start time:', startTime);
            const diffMinutes = (startTime - now) / (1000 * 60);
            console.log('Time difference in minutes:', diffMinutes);
        
            // console.log('Admin can cancel:', diffMinutes >= 0 && diffMinutes <= 10);
            return diffMinutes >= 0 && diffMinutes <= 10;
        }        
    }
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
// app.use((req, res, next) => {
//     res.locals.isLoggedInAsStudent = req.session?.userType === "student";
//     res.locals.isLoggedInAsAdmin = req.session?.userType === "admin";
//     res.locals.user = req.session?.user || null;
//     next();
// });

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
    res.status(404).render('errors/page-dne', { title: 'Page Not Found | LabKita!' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// Database initialization & server start
const startServer = async () => {
    try {
        await connectToMongo();

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
