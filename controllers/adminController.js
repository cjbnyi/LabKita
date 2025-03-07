import adminModel from '../database/models/Admin.js';

// Assigned to CJ //

/* READ */
const getAdmins = async (req, res) => {
    try {
        const admins = await adminModel.getAll();
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching admins' });
    }
};

const getAdminById = async (req, res) => {
    const { id } = req.params;

    try {
        const admin = await adminModel.getById(id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching admin by id' });
    }
};

/* CREATE */
const createAdmin = async (req, res) => {
    const adminData = req.body;

    try {
        const newAdmin = await adminModel.create(adminData);
        res.status(201).json(newAdmin);
    } catch (error) {
        res.status(500).json({ error: 'Error creating admin' });
    }
};

/* UPDATE */
const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const adminData = req.body;

    try {
        const updatedAdmin = await adminModel.updateById(id, adminData);
        if (!updatedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ error: 'Error updating admin' });
    }
};

/* DELETE */
const deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAdmin = await adminModel.deleteById(id);
        if (!deletedAdmin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting admin' });
    }
};

export default {
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin
};
