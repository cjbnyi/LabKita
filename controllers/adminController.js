import adminModel from '../database/models/Admin.js';

/* =============================== */
/* READ */
/* =============================== */
const getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.getAdmins();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching admins', details: error.message });
    }
};

const getAdminById = async (req, res) => {
    const { id } = req.params;
    try {
        const admin = await adminModel.getAdminById(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching admin by id', details: error.message });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createAdmin = async (req, res) => {
    try {
        const newAdmin = await adminModel.createAdmin(req.body);
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
        const updatedAdmin = await adminModel.updateAdmin(id, req.body);
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
        const deletedAdmin = await adminModel.deleteAdmin(id);
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
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin
};
