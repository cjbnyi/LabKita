import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin, Lab, Seat, Student, Reservation } from './models/models.js';

export const seedDatabase = async () => {
    console.log('Seeding data...');

    await Admin.findOneAndUpdate(
        { email: 'admin@example.com' },
        {
            firstName: 'System',
            lastName: 'Admin',
            email: 'admin@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'admin',
            status: 'Active'
        },
        { upsert: true, new: true }
    );

    const labs = await Promise.all(
        ['Engineering', 'Science', 'Computing'].map(async (building, index) => {
            return await Lab.findOneAndUpdate(
                { building, room: `Room ${index + 1}` },
                {
                    building,
                    room: `Room ${index + 1}`,
                    daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    openingTime: '08:00 AM',
                    closingTime: '06:00 PM',
                    status: 'Open'
                },
                { upsert: true, new: true }
            );
        })
    );

    const seats = [];
    for (const lab of labs) {
        for (let i = 1; i <= 10; i++) {
            const seat = await Seat.findOneAndUpdate(
                { labID: lab._id, seatNumber: i },
                {
                    labID: lab._id,
                    seatNumber: i,
                    status: 'Available'
                },
                { upsert: true, new: true }
            );
            seats.push(seat);
        }
    }

    const students = await Promise.all(
        ['john.doe@example.com', 'jane.smith@example.com'].map(async (email, index) => {
            return await Student.findOneAndUpdate(
                { email },
                {
                    universityID: `S1000${index + 1}`,
                    firstName: ['John', 'Jane'][index],
                    lastName: ['Doe', 'Smith'][index],
                    email,
                    password: await bcrypt.hash('student123', 10),
                    college: 'Engineering',
                    course: 'Computer Science',
                    status: 'Active'
                },
                { upsert: true, new: true }
            );
        })
    );

    for (const student of students) {
        const reservation = await Reservation.findOneAndUpdate(
            {
                requestingStudentID: student._id,
                labID: labs[0]._id,
                seatID: seats[0]._id
            },
            {
                labID: labs[0]._id,
                seatID: seats[0]._id,
                startDateTime: new Date(),
                endDateTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours later
                requestingStudentID: student._id,
                creditedStudentIDs: [student._id],
                purpose: 'Study session',
                status: 'Reserved'
            },
            { upsert: true, new: true }
        );
        await Student.findByIdAndUpdate(student._id, { $addToSet: { reservationList: reservation._id } });
        await Seat.findByIdAndUpdate(seats[0]._id, { $addToSet: { reservations: reservation._id } });
    }
    
    console.log('Database seeding complete!');
    mongoose.connection.close();
};
