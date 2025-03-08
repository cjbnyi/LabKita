import {
    getLabs,
    createLab,
    updateLab,
    deleteLab
} from '../database/models/Lab.js';

/* =============================== */
/* READ */
/* =============================== */
const handleGetLabs = async (req, res) => {
    try {
        const filter = req.query || {};
        const labs = await getLabs(filter);
        res.status(200).json(labs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching labs', details: error.message });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const handleCreateLab = async (req, res) => {
    try {
        const newLab = await createLab(req.body);
        res.status(201).json(newLab);
    } catch (error) {
        res.status(500).json({ error: 'Error creating lab', details: error.message });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const handleUpdateLab = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedLab = await updateLab(id, req.body);
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
const handleDeleteLab = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLab = await deleteLab(id);
        if (!deletedLab) {
            return res.status(404).json({ error: 'Lab not found' });
        }
        res.status(200).json({ message: 'Lab deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting lab', details: error.message });
    }
};

export default {
    handleGetLabs,
    handleCreateLab,
    handleUpdateLab,
    handleDeleteLab
};
