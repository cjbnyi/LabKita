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

// Log requests to a file
// const accessLogStream = fs.createWriteStream(path.join(process.cwd(), 'access.log'), { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }));

// Middleware
app.use(express.json());

// Initialize the Handlebars view engine
const hbs = create({
    extname: 'hbs',
    defaultView: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Load static files
app.use(express.static('public'));

// Register routes
app.use('/api/admins', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/students', studentRoutes);

// CLI flags
const shouldSeed = process.argv.includes('--seed');

// Connect to MongoDB and seed the database before starting the server
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
