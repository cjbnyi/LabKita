import { Reservation } from '../../database/models/models.js';
import { getStudentByID } from "../../utils/userUtils.js";
import { formatDate } from '../../utils/generalUtils.js';

const renderProfile = async (req, res) => {
    try {
        let student;
        const isUser = !req.params.universityId;
        
        if (isUser) {
            // If no universityId in params, use the current user's info from res.locals.user
            student = await getStudentByID(res.locals.user.universityID);
        } else {
            // If there's a universityId in the URL params, it's another user profile
            const { universityId } = req.params;
            student = await getStudentByID(universityId);
            
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }
        }

        const reservations = await Reservation.model.find({
            creditedStudentIDs: student._id
        })
        .populate('creditedStudentIDs', 'universityID firstName lastName')
        .populate({
            path: 'seatIDs',
            populate: {
                path: 'labID',
                select: 'building room'
            }
        })
        .exec();

        const formattedReservations = reservations.map(res => {
            return {
                id: res._id,
                building: res.seatIDs.length && res.seatIDs[0].labID ? res.seatIDs[0].labID.building : "Unknown",
                room: res.seatIDs.length && res.seatIDs[0].labID ? res.seatIDs[0].labID.room : "Unknown",
                seats: res.seatIDs.map(seat => seat.seatNumber).join(', '),
                start_datetime: formatDate(new Date(res.startDateTime)),
                end_datetime: formatDate(new Date(res.endDateTime)),
                isAnonymous: res.isAnonymous,
                creditedStudents: res.creditedStudentIDs.map(student => ({
                    universityID: student.universityID,
                    fullName: `${student.firstName} ${student.lastName}`
                })),
                purpose: res.purpose,
                status: res.status
            };
        });        

        const upcomingReservations = formattedReservations.filter(res => 
            res.status === "Reserved" && !res.isAnonymous
        );

        const pastReservations = formattedReservations.filter(res => 
            res.status !== "Reserved" && !res.isAnonymous
        );
        
        res.render("view-profile", {
            isUser,
            isAdmin: res.locals.isLoggedInAsAdmin,
            profile: {
                firstName: student.firstName,
                lastName: student.lastName,
                universityId: student.universityID,
                email: student.email,
                bio: student.bio,
                profilePicture: student.profilePicture,
            },
            reservations: {
                upcomingReservations,
                pastReservations
            },
        });        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

const renderEditProfile = (req, res) => {
    res.status(200).render('edit-profile', { 
        title : "Edit Profile",
        user : res.locals.user
    });
}

const renderPrivacySettings = (req, res) => {
    res.status(200).render('privacy-settings', { title : "Privacy Settings" });
}

export default {
    renderProfile,
    renderEditProfile,
    renderPrivacySettings
};