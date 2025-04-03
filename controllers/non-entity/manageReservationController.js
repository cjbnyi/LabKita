import { Lab, Seat, Reservation } from '../../database/models/models.js';
import { formatDate } from '../../utils/generalUtils.js';

const getEditReservationPage = async (req, res) => {
    try {
        const { reservationId } = req.params;
        console.log("Fetching reservation with ID:", reservationId);

        const reservation = await Reservation.model.findById(reservationId)
            .populate({
                path: "seatIDs",
                populate: { path: "labID" }
            })
            .populate("creditedStudentIDs");

        if (!reservation) {
            console.error("Reservation not found for ID:", reservationId);
            return res.status(404).json({ error: 'Reservation not found' });
        }

        console.log("Fetched Reservation:", reservation);

        // Get building and room from the first seat
        const firstSeat = reservation.seatIDs.length > 0 ? reservation.seatIDs[0] : null;
        const building = firstSeat?.labID?.building || "N/A";
        const room = firstSeat?.labID?.room || "N/A";

        // Format seat numbers
        const seatNumbers = reservation.seatIDs.map(seat => seat.seatNumber).join(', ') || "N/A";

        // Create an array of credited student names (with ids) instead of a concatenated string
        const creditedStudents = reservation.creditedStudentIDs.length > 0 
            ? reservation.creditedStudentIDs.map(student => ({
                universityID: student.universityID,
                fullName: `${student.firstName} ${student.lastName}`
            }))
            : [];

        console.log("Processed Reservation Data:", {
            _id: reservation._id,
            building,
            room,
            seats: seatNumbers,
            start_datetime: formatDate(reservation.startDateTime),
            end_datetime: formatDate(reservation.endDateTime),
            credited_students: creditedStudents,
            purpose: reservation.purpose,
            status: reservation.status,
            isAnonymous: reservation.isAnonymous
        });

        res.render('edit-reservations', {
            pageCSS: '/public/css/edit-reservations.css',
            reservation: {
                _id: reservation._id,
                building,
                room,
                seats: seatNumbers,
                start_datetime: formatDate(reservation.startDateTime),
                end_datetime: formatDate(reservation.endDateTime),
                credited_students: creditedStudents,  // Pass the array of students with id and full name
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
        console.log("Fetching reservations for user:", req.user.id);

        // Fetch upcoming reservations (status: Reserved) belonging to the user (unless admin)
        let upcomingReservations = await Reservation.model.find({ 
            status: "Reserved", 
            ...(req.user.role !== "admin" && { creditedStudentIDs: req.user.id }) 
        })
        .populate({ path: "seatIDs", populate: { path: "labID" } })
        .populate("creditedStudentIDs")
        .sort({ startDateTime: 1 });

        // Fetch past reservations (status: Completed or Cancelled) belonging to the user (unless admin)
        let pastReservations = await Reservation.model.find({ 
            status: { $in: ["Completed", "Cancelled"] }, 
            ...(req.user.role !== "admin" && { creditedStudentIDs: req.user.id }) 
        })
        .populate({ path: "seatIDs", populate: { path: "labID" } })
        .populate("creditedStudentIDs")
        .sort({ startDateTime: 1 });

        console.log("Fetched Upcoming Reservations:", upcomingReservations.length);
        console.log("Fetched Past Reservations:", pastReservations.length);

        // Helper function to format reservation data
        const formatReservation = (reservation) => {
            const firstSeat = reservation.seatIDs[0];
            const lab = firstSeat?.labID;

            return {
                id: reservation._id.toString(),
                building: lab?.building || "N/A",
                room: lab?.room || "N/A",
                seats: reservation.seatIDs.map(seat => seat.seatNumber).join(", "),
                start_datetime: formatDate(reservation.startDateTime),
                end_datetime: formatDate(reservation.endDateTime),
                creditedStudents: reservation.creditedStudentIDs.map((r) => ({
                    universityID: r.universityID,
                    fullName: `${r.firstName} ${r.lastName}`
                })),
                purpose: reservation.purpose || "N/A",
                status: reservation.status || "N/A",
                isAnonymous: reservation.isAnonymous
            };
        };

        res.render("manage-reservations", {
            upcomingReservations: upcomingReservations.map(formatReservation),
            pastReservations: pastReservations.map(formatReservation),
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ error: "Error fetching reservations", details: error.message });
    }
};

const getLiveReservations = async (req, res) => {
    try {
        console.log("Fetching live reservations for user:", req.user.id);

        // Fetch upcoming reservations (status: Reserved) belonging to the user (unless admin)
        let upcomingReservations = await Reservation.model.find({ 
            status: "Reserved", 
            ...(req.user.role !== "admin" && { creditedStudentIDs: req.user.id }) 
        })
        .populate({ path: "seatIDs", populate: { path: "labID" } })
        .populate("creditedStudentIDs")
        .sort({ startDateTime: 1 });

        // Fetch past reservations (status: Completed or Cancelled) belonging to the user (unless admin)
        let pastReservations = await Reservation.model.find({ 
            status: { $in: ["Completed", "Cancelled"] }, 
            ...(req.user.role !== "admin" && { creditedStudentIDs: req.user.id }) 
        })
        .populate({ path: "seatIDs", populate: { path: "labID" } })
        .populate("creditedStudentIDs")
        .sort({ startDateTime: 1 });

        console.log("Fetched Upcoming Reservations:", upcomingReservations.length);
        console.log("Fetched Past Reservations:", pastReservations.length);

        // Helper function to format reservation data
        const formatReservation = (reservation) => {
            const firstSeat = reservation.seatIDs[0];
            const lab = firstSeat?.labID;

            return {
                id: reservation._id.toString(),
                building: lab?.building || "N/A",
                room: lab?.room || "N/A",
                seats: reservation.seatIDs.map(seat => seat.seatNumber).join(", "),
                start_datetime: formatDate(reservation.startDateTime),
                end_datetime: formatDate(reservation.endDateTime),
                creditedStudents: reservation.creditedStudentIDs.map((r) => ({
                    universityID: r.universityID,
                    fullName: `${r.firstName} ${r.lastName}`
                })),
                purpose: reservation.purpose || "N/A",
                status: reservation.status || "N/A",
                isAnonymous: reservation.isAnonymous
            };
        };

        res.json({
            success: true,
            isAdmin: req.user.role === 'admin',
            upcomingReservations: upcomingReservations.map(formatReservation),
            pastReservations: pastReservations.map(formatReservation),
        });
    } catch (error) {
        console.error("Error fetching live reservations:", error);
        res.status(500).json({ success: false, error: "Failed to fetch reservations" });
    }
};

const getSpecificReservations = async (req, res) => {
    try {
        const { building, room, startDate, endDate } = req.query;

        console.log("API Request - Fetching specific reservations:", { building, room, startDate, endDate });

        // Find the lab that matches the selected building and room
        const lab = await Lab.model.findOne({ building, room }).exec();
        if (!lab) {
            return res.status(404).json({ message: "Lab not found" });
        }

        console.log("Found lab:", lab);

        // Find seat IDs for the lab
        const seatIDs = await Seat.model.find({ labID: lab._id }).distinct('_id');

        console.log("Lab seat IDs:", seatIDs);

        // Find reservations for seats in this lab that overlap with the selected time period
        const reservations = await Reservation.model.find({
            seatIDs: { $in: seatIDs },
            startDateTime: { $lt: new Date(endDate) },  
            endDateTime: { $gt: new Date(startDate) }   
        }).populate("seatIDs").exec();

        console.log("Reservations fetched:", reservations);
        res.json(reservations);
    } catch (error) {
        console.error("Error fetching specific reservations:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export default {
    getEditReservationPage,
    renderCreateReservation,
    getManageReservations,
    getLiveReservations,
    getSpecificReservations
};
