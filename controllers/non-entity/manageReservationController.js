import { Reservation } from '../../database/models/models.js';
import { formatDate } from '../../utils/generalUtils.js';

const getEditReservationPage = async (req, res) => {
    try {
        const { reservationId } = req.params;
        console.log("Fetching reservation with ID:", reservationId);

        const reservation = await Reservation.model.findById(reservationId)
            .populate("labID")
            .populate("seatIDs")
            .populate("requestingStudentID")
            .populate("creditedStudentIDs");

        if (!reservation) {
            console.error("Reservation not found for ID:", reservationId);
            return res.status(404).json({ error: 'Reservation not found' });
        }

        console.log("Fetched Reservation:", reservation);

        // Construct lab name
        const labName = reservation.labID ? `${reservation.labID.building} ${reservation.labID.room}` : "N/A";

        // Format seat numbers
        const seatNumbers = reservation.seatIDs && reservation.seatIDs.length > 0
            ? reservation.seatIDs.map(seat => seat.seatNumber).join(', ')
            : "N/A";

        // Ensure requester name is valid
        const requesterName = reservation.requestingStudentID 
            ? reservation.requestingStudentID.name 
            : "N/A";

        // Format credited student names
        const creditedNames = reservation.creditedStudentIDs && reservation.creditedStudentIDs.length > 0
            ? reservation.creditedStudentIDs.map(student => student.name).join(', ')
            : "N/A";

        console.log("Processed Reservation Data:", {
            _id: reservation._id,
            lab_name: labName,
            seats: seatNumbers,
            start_datetime: reservation.startDateTime.toISOString().slice(0, 16),
            end_datetime: reservation.endDateTime.toISOString().slice(0, 16),
            requester_name: requesterName,
            credited_names: creditedNames,
            purpose: reservation.purpose,
            status: reservation.status,
            isAnonymous: reservation.isAnonymous
        });

        res.render('edit-reservations', {
            pageCSS: '/public/css/edit-reservations.css',
            reservation: {
                _id: reservation._id,
                lab_name: labName, // Pass dynamically generated lab name
                seats: seatNumbers, // Seat numbers as a comma-separated string
                start_datetime: reservation.startDateTime.toISOString().slice(0, 16),
                end_datetime: reservation.endDateTime.toISOString().slice(0, 16),
                requester_name: requesterName,
                credited_names: creditedNames,
                purpose: reservation.purpose,
                status: reservation.status,
                isAnonymous: reservation.isAnonymous
            }
        });

    } catch (error) {
        console.error("Error fetching reservation:", error);
        res.status(500).json({ error: 'Error loading edit reservation page', details: error.message });
    }
};

const renderCreateReservation = async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/api/labs');
        const labs = await response.json();

        res.render('reserve-slot', { 
            title: "Reserve Slot",
            labsData: JSON.stringify(labs)
        });
    } catch (error) {
        console.error("Error fetching labs:", error);
        res.render('reserve-slot', { 
            title: "Reserve Slot",
            labsData: "[]"
        });
    }
};

const getManageReservations = async (req, res) => {
    try {
        const currentDate = new Date();
        console.log("Current Date for Filtering:", currentDate);

        // Fetch upcoming reservations (status: Reserved)
        let upcomingReservations = await Reservation.getReservations({
            status: "Reserved"
        }); // Ensure it returns plain objects

        // Fetch past reservations (status: Completed or Cancelled)
        let pastReservations = await Reservation.getReservations({
            status: { $in: ["Completed", "Cancelled"] }
        });

        console.log("Fetched Upcoming Reservations:", upcomingReservations.length);
        console.log("Fetched Past Reservations:", pastReservations.length);

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

        res.render("manage-reservations", {
            upcomingReservations: upcomingReservations.map(formatReservation),
            pastReservations: pastReservations.map(formatReservation),
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ error: "Error fetching reservations", details: error.message });
    }
};

export default {
    getEditReservationPage,
    renderCreateReservation,
    getManageReservations
};
