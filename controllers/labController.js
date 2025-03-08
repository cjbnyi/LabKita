import { Lab } from '../database/models/models.js';

/* =============================== */
/* READ */
/* =============================== */
const getLabs = async (req, res) => {
    try {
        const filter = req.query || {};
        const labs = await Lab.getAll(filter);
        res.status(200).json(labs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching labs', details: error.message });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createLab = async (req, res) => {
    try {
        const newLab = await Lab.create(req.body);
        res.status(201).json(newLab);
    } catch (error) {
        res.status(500).json({ error: 'Error creating lab', details: error.message });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateLab = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedLab = await Lab.updateById(id, req.body);
        if (!updatedLab) {
            return res.status(404).json({ error: 'Lab not found' });
        }
        res.status(200).json(updatedLab);
    } catch (error) {
        res.status(500).json({ error: 'Error updating lab', details: error.message });
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteLab = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLab = await Lab.deleteById(id);
        if (!deletedLab) {
            return res.status(404).json({ error: 'Lab not found' });
        }
        res.status(200).json({ message: 'Lab deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting lab', details: error.message });
    }
};

export default {
    getLabs,
    createLab,
    updateLab,
    deleteLab
};
