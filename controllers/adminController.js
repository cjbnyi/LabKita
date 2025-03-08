import {
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin
} from '../database/models/Admin.js';

/* =============================== */
/* READ */
/* =============================== */
const handleGetAdmins = async (req, res) => {
    try {
        const filter = req.query || {};
        const admins = await getAdmins(filter);
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching admins', details: error.message });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const handleCreateAdmin = async (req, res) => {
    try {
        const newAdmin = await createAdmin(req.body);
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ error: 'Error creating admin', details: error.message });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const handleUpdateAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedAdmin = await updateAdmin(id, req.body);
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
const handleDeleteAdmin = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedAdmin = await deleteAdmin(id);
        if (!deletedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting admin', details: error.message });
    }
};

export default {
    handleGetAdmins,
    handleCreateAdmin,
    handleUpdateAdmin,
    handleDeleteAdmin
};
