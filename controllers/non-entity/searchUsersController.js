// TODO: Finalize!

import { Student } from '../../database/models/models.js';

const getSearchUsersPage = async (req, res) => {
    try {
        const students = await Student.model.find();
        res.render('searchUsers', { students });
    } catch (error) {
        res.status(500).json({ error: 'Error loading search users page' });
    }
};

const getProfilePage = async (req, res) => {
    try {
        const { userId } = req.params;
        const student = await Student.model.findById(userId);

        if (!student) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.render('profile', { student });
    } catch (error) {
        res.status(500).json({ error: 'Error loading profile page' });
    }
};

export default {
    getSearchUsersPage,
    getProfilePage
};
