import { Reservation } from '../../database/models/models.js';
import { getStudentByID } from "../../utils/userUtils.js";

const renderViewProfile = (req, res) => {
    res.status(200).render('view-profile', { title : "Profile" });
}

const renderEditProfile = (req, res) => {
    res.status(200).render('edit-profile', { title : "Edit Profile" });
}

const renderPrivacySettings = (req, res) => {
    res.status(200).render('privacy-settings', { title : "Privacy Settings" });
}

const showProfile = async (req, res) => {
    try {
        const { universityId } = req.params;
        
        // Find the student by universityId
        const student = await getStudentByID(universityId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        
        // Fetch upcoming and past reservations
        const now = new Date();
        const reservations = await Reservation.model.find({ "reservers.universityId": universityId });
        
        const upcomingReservations = reservations.filter(res => new Date(res.startDateTime) > now);
        const pastReservations = reservations.filter(res => new Date(res.startDateTime) <= now);

        res.render("view-other-profile", {
            profile: {
                firstName: student.firstName,
                lastName: student.lastName,
                role: "Student",
                universityId: student.universityID,
                email: student.email,
                department: student.college,
                bio: student.bio,
                profilePicture: student.profilePicture,
            },
            reservations: {
                upcoming: upcomingReservations,
                past: pastReservations,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export default {
    renderViewProfile,
    renderEditProfile,
    renderPrivacySettings,
    showProfile
};