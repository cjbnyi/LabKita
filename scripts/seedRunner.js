import { connectToMongo } from "../database/conn.js";
import { seedDatabase } from "../database/seed.js";

(async () => {
    try {
        await connectToMongo();
        await seedDatabase();
        console.log('Database has been successfully populated.');
    } catch (error) {
        console.error('Error during database seeding:', error);
        process.exit(1);
    }
})();
