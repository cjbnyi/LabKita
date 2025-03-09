// TODO: Finalize!

import { Reservation } from '../../database/models/models.js';

const getAdminPanel = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.render('adminPanel', reservations);
    } catch (error) {
        res.status(500).json({ error: 'Error loading admin panel' });
    }
};

export default {
    getAdminPanel
};
