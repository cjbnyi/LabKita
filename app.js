import express from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Obtain __filename and __dirname in ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();

// Configure Handlebars as the view engine
app.engine("hbs", exphbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views")); // Ensure views directory is recognized

// Serve static files properly
app.use("/public", express.static(path.join(__dirname, 'public')));

// Middleware to log static file requests
app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}`);
    next();
});

// Root route to render index.hbs
app.get('/', (req, res) => {
    res.render('index', { title: 'LabKita!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
