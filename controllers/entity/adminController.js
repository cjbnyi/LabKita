import { Admin } from '../../database/models/models.js';

/* =============================== */
/* READ */
/* =============================== */
const getAdmins = async (req, res) => {
    try {
        const filter = req.query || {};
        const admins = await Admin.getAdmins(filter);
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching admins', details: error.message });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createAdmin = async (req, res) => {
    try {
        const newAdmin = await Admin.createAdmin(req.body);
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ error: 'Error creating admin', details: error.message });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedAdmin = await Admin.updateAdmin(id, req.body);
        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: 'Error updating admin', details: error.message });
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAdmin = await Admin.deleteAdmin(id);
        if (!deletedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting admin', details: error.message });
    }
};

export default {
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin
};
