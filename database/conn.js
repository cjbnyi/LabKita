import { MongoClient } from 'mongodb';

// MongoDB connection URI (modify this accordingly)
const mongoURI = process.env.MONGODB_URI;

// Create a MongoDB client instance
const client = new MongoClient(mongoURI, {
    useNewUrlParser: true, // Ensures compatibility with new MongoDB versions
    useUnifiedTopology: true // Enables the new Server Discovery and Monitoring engine
});

let isConnected = false; // Track connection state

/**
 * Connects to MongoDB and executes the provided callback.
 * @param {Function} callback - Function to execute after connection.
 */
export async function connectToMongo(callback) {
    try {
        await client.connect();
        isConnected = true;
        console.log("Successfully connected to MongoDB.");
        callback(); // Execute the callback function
    } catch (error) {
        console.error("MongoDB connection error:", error);
        callback(error); // Pass the error to the callback
    }
}

/**
 * Returns a database instance from the connected MongoDB client.
 * @param {string} dbName - Name of the database (default: "showcase").
 * @returns {object} The MongoDB database instance.
 */
export function getDb(dbName = process.env.DB_NAME) {
    if (!isConnected) {
        console.warn("Warning: Database requested before connection was established.");
    }
    return client.db(dbName);
}

/**
 * Handles cleanup and graceful shutdown of the MongoDB connection.
 */
async function signalHandler() {
    if (isConnected) {
        console.log("Closing MongoDB connection...");
        await client.close();
        console.log("MongoDB connection closed.");
    }
    process.exit(0);
}

// Listen for process termination signals to close MongoDB connection
process.on('SIGINT', signalHandler);  // Handle Ctrl+C
process.on('SIGTERM', signalHandler); // Handle termination signals
process.on('SIGQUIT', signalHandler); // Handle forced quit
