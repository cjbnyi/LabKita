import cron from 'node-cron';
import { Reservation } from '../database/models/models.js';

// Function to check and update expired reservations
const updateExpiredReservations = async () => {
    try {
        const currentDate = new Date();
        console.log("🔄 Running periodic reservation update...");

        // Find all "Reserved" reservations that have ended
        const expiredReservations = await Reservation.model.find({
            status: "Reserved",
            endDateTime: { $lt: currentDate } // Check if end time has passed
        });

        if (expiredReservations.length > 0) {
            console.log(`📌 Found ${expiredReservations.length} expired reservations. Updating...`);

            // Update their status to "Completed"
            await Reservation.model.updateMany(
                { _id: { $in: expiredReservations.map(res => res._id) } },
                { $set: { status: "Completed" } }
            );

            console.log("✅ Expired reservations marked as Completed.");
        } else {
            console.log("✔ No expired reservations found.");
        }
    } catch (error) {
        console.error("❌ Error updating expired reservations:", error);
    }
};

// Run every 5 minutes (adjust as needed)
cron.schedule("*/5 * * * *", updateExpiredReservations);

export {
    updateExpiredReservations
};
