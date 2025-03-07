import labModel from '../database/models/Lab.js';

/* =============================== */
/* READ */
/* =============================== */
const getLabs = async (req, res) => {
    try {
        const labs = await labModel.getAll();
        res.status(200).json(labs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching labs' });
    }
};

const getLabById = async (req, res) => {
    const { id } = req.params;

    try {
        const lab = await labModel.getById(id);
        if (!lab) {
            return res.status(404).json({ error: 'Lab not found' });
        }
        res.status(200).json(lab);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching lab by id' });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createLab = async (req, res) => {
    const labData = req.body;

    try {
        const newLab = await labModel.create(labData);
        res.status(201).json(newLab);
    } catch (error) {
        res.status(500).json({ error: 'Error creating lab' });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateLab = async (req, res) => {
    const { id } = req.params;
    const labData = req.body;

    try {
        const updatedLab = await labModel.updateById(id, labData);
        if (!updatedLab) {
            return res.status(404).json({ error: 'Lab not found' });
        }
        res.status(200).json(updatedLab);
    } catch (error) {
        res.status(500).json({ error: 'Error updating lab' });
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteLab = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLab = await labModel.deleteById(id);
        if (!deletedLab) {
            return res.status(404).json({ error: 'Lab not found' });
        }
        res.status(200).json({ message: 'Lab deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting lab' });
    }
};

export default {
    getLabs,
    getLabById,
    createLab,
    updateLab,
    deleteLab
};
