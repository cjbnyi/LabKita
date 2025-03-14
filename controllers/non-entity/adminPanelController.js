import { Reservation } from '../../database/models/models.js';

const formatDate = (date) => new Date(date).toLocaleString(); 

const getAdminPanel = async (req, res) => {
    try {
        const currentDate = new Date();
        console.log("Current Date for Filtering:", currentDate);

        // Fetch upcoming reservations (status: Reserved)
        let upcomingReservations = await Reservation.getReservations({
            status: "Reserved"
        }); // Ensure it returns plain objects

        // Fetch past reservations (status: Completed or Cancelled)
        let allReservations = await Reservation.getReservations();

        console.log("Fetched Upcoming Reservations:", upcomingReservations.length);
        console.log("Fetched Past Reservations:", allReservations.length);

        // Helper function to format reservation data
        const formatReservation = (reservation) => ({
            id: reservation._id.toString(),
            lab_name: reservation.labID
                ? `${reservation.labID.building} ${reservation.labID.room}`
                : "N/A",
            slots: reservation.seatIDs?.length || 1,
            start_datetime: formatDate(reservation.startDateTime),
            end_datetime: formatDate(reservation.endDateTime),
            requester_name: reservation.requestingStudentID
                ? `${reservation.requestingStudentID.firstName} ${reservation.requestingStudentID.lastName}`
                : "N/A",
            reservers: reservation.creditedStudentIDs?.length
                ? reservation.creditedStudentIDs.map((r) => `${r.firstName} ${r.lastName}`).join(", ")
                : "N/A",
            purpose: reservation.purpose || "N/A",
            status: reservation.status || "N/A",
        });

        res.render("admin", {
            upcomingReservations: upcomingReservations.map(formatReservation),
            allReservations: allReservations.map(formatReservation),
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ error: "Error fetching reservations", details: error.message });
    }
};

export default {
    getAdminPanel
};
