import {
    Seat
} from '../../database/models/models.js';

const getViewLabsPage = async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/api/labs');
        const labs = await response.json();
        const buildings = [...new Set(labs.map(lab => lab.building))];

        res.render('view-labs', { title: "View Labs", labs, buildings });
    } catch (error) {
        res.status(500).json({ error: 'Error loading view labs page' });
    }
};

const getAvailableSeatsForm = async (req, res) => {
    try {
        const response = await fetch('http://localhost:3000/api/labs');
        const labs = await response.json();

        res.render('view-seats', { title: "View Labs", labs });
    } catch (error) {
        res.status(500).json({ error: 'Error loading available seats form' });
    }
};

const getAvailableSeatsPage = async (req, res) => {
    try {
        const seats = await Seat.find();
        res.render('availableSeats', { seats });
    } catch (error) {
        res.status(500).json({ error: 'Error loading available seats page' });
    }
};

export default {
    getViewLabsPage,
    getAvailableSeatsForm,
    getAvailableSeatsPage
};
