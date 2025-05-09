import 'dotenv/config';
import mongoose from 'mongoose';
import { Lab } from '../database/models/models.js';

const mongoDbURI = process.env.MONGODB_URI;
if (!mongoDbURI) {
    console.error("MONGODB_URI is not defined in .env");
    process.exit(1);
}

/**
 * Helper function that syncs schema indexes.
 */
const syncIndexes = async () => {
    await Lab.model.syncIndexes();
    console.log('Indexes synced');
};

/**
 * Connects to MongoDB using Mongoose.
 */
export async function connectToMongo() {
    if (mongoose.connection.readyState === 1) {
        console.log("Already connected to MongoDB.");
        return;
    }
    
    try {
        await mongoose.connect(mongoDbURI);
        await syncIndexes();
        console.log("Successfully connected to MongoDB.");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

/**
 * Returns the Mongoose connection instance.
 */
export function getDb() {
    return mongoose.connection;
}

/**
 * Handles cleanup and graceful shutdown of the MongoDB connection.
 */
async function signalHandler() {
    if (mongoose.connect.readyState === 1) {
        console.log("Closing MongoDB connection...");
        await mongoose.connection.close();
        console.log("MongoDB connection closed.");
    }
    process.exit(0);
}

// Listen for process termination signals to close MongoDB connection
process.on('SIGINT', signalHandler);  // Handle Ctrl+C
process.on('SIGTERM', signalHandler); // Handle termination signals
process.on('SIGQUIT', signalHandler); // Handle forced quit
