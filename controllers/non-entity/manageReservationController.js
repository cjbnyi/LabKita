// TODO: Finalize!

import { Reservation } from '../../database/models/models.js';

const viewManageReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.render('manageReservations', { reservations });
    } catch (error) {
        res.status(500).json({ error: 'Error loading reservations' });
    }
};

const getEditReservationPage = (req, res) => {
    try {
        res.render('editReservation');
    } catch (error) {
        res.status(500).json({ error: 'Error loading edit reservation page' });
    }
};

const getCreateReservationPage = (req, res) => {
    try {
        res.render('createReservation');
    } catch (error) {
        res.status(500).json({ error: 'Error loading create reservation page' });
    }
};

const getManageReservations = async (req, res) => {
    try {
        const currentDate = new Date();
        console.log("Current Date for Filtering:", currentDate);

        // Fetch upcoming and past reservations using Reservation.getReservations()
        const upcomingReservations = await Reservation.getReservations({ startDateTime: { $gte: currentDate } });
        const pastReservations = await Reservation.getReservations({ startDateTime: { $lt: currentDate } });

        console.log("Fetched Upcoming Reservations:", upcomingReservations.length);
        console.log("Fetched Past Reservations:", pastReservations.length);

        // Format reservations for Handlebars
        const formatReservations = (reservations) =>
            reservations.map((reservation) => ({
                id: reservation._id.toString(),
                lab_name: reservation.labID 
                    ? `${reservation.labID.building} ${reservation.labID.room}` 
                    : "N/A",
                slots: Array.isArray(reservation.seatIDs) ? reservation.seatIDs.length : 1,
                start_datetime: new Date(reservation.startDateTime).toLocaleString(),
                end_datetime: new Date(reservation.endDateTime).toLocaleString(),
                requester_name: reservation.requestingStudentID
                    ? `${reservation.requestingStudentID.firstName} ${reservation.requestingStudentID.lastName}`
                    : "N/A",
                reservers: Array.isArray(reservation.creditedStudentIDs) && reservation.creditedStudentIDs.length > 0
                    ? reservation.creditedStudentIDs.map((r) => `${r.firstName} ${r.lastName}`).join(", ")
                    : "N/A",
                purpose: reservation.purpose || "N/A",
                status: reservation.status || "N/A",
            }));

        res.render("manage-reservations", {
            upcomingReservations: formatReservations(upcomingReservations),
            pastReservations: formatReservations(pastReservations),
        });
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ error: "Error fetching reservations", details: error.message });
    }
};



export default {
    viewManageReservations,
    getEditReservationPage,
    getCreateReservationPage,
    getManageReservations
};
