import 'dotenv/config';
import { connectToMongo, getDb } from './database/conn';
import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';

// Import routes
import sampleRoutes from './routes/sample.routes.js'; // Update with actual route file

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

// Declare routes
app.use('/', sampleRoutes);

connectToMongo((err) => {
    if (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }

    console.log("Connected to MongoDB server");
    const db = getDb();

    // Listen to the port
    const PORT = process.env.WEB_PORT || 3000;
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
});
