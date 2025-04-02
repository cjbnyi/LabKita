import { Student } from '../../database/models/models.js';

const getSearchUsersPage = async (req, res) => {
    try {
        const query = req.query.name;
        const students = await Student.model.find({
            $or: [
                { firstName: new RegExp(query, "i") },
                { lastName: new RegExp(query, "i") }
            ]
        }).lean();
        console.log("Search results:", students); // DEBUGGING
        res.render('search-users', { students });
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

        res.render('view-other-profile', { student });
    } catch (error) {
        res.status(500).json({ error: 'Error loading profile page' });
    }
};

export default {
    getSearchUsersPage,
    getProfilePage
};
