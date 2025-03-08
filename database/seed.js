import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin, Lab, Seat, Student, Reservation } from './models/models.js';

const NUM_ADMINS = 5;
const NUM_STUDENTS = 5;
const NUM_LABS = 5;
const NUM_SEATS_PER_LAB = 20;
const NUM_RESERVATIONS_PER_LAB = 10;

const seedAdmins = async () => {
    try {
        const adminEmails = Array.from({ length: NUM_ADMINS }, (_, i) => `admin${i + 1}@example.com`);

        return await Promise.all(adminEmails.map(async (email, index) => {
            return await Admin.findOneAndUpdate(
                { email },
                {
                    firstName: `Admin${index + 1}`,
                    lastName: 'User',
                    email,
                    password: await bcrypt.hash('password123', 10),
                    role: 'admin',
                    status: 'Active'
                },
                { upsert: true, new: true }
            );
        }));
    } catch (error) {
        console.error("Error seeding admins:", error);
        return [];
    }
};

const seedStudents = async () => {
    try {
        const studentEmails = Array.from({ length: NUM_STUDENTS }, (_, i) => `student${i + 1}@example.com`);

        return await Promise.all(
            studentEmails.map(async (email, index) => {
                return await Student.findOneAndUpdate(
                    { email },
                    {
                        universityID: `S100${index + 1}`,
                        firstName: `Student${index + 1}`,
                        lastName: 'User',
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
    } catch (error) {
        console.error("Error seeding students:", error);
        return [];
    }
};

const seedLabs = async () => {
    try {
        return await Promise.all(
            Array.from({ length: NUM_LABS }, (_, index) => 
                Lab.findOneAndUpdate(
                    { building: `Building ${index + 1}`, room: `Room ${index + 1}` },
                    {
                        building: `Building ${index + 1}`,
                        room: `Room ${index + 1}`,
                        daysOpen: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                        openingTime: '08:00 AM',
                        closingTime: '06:00 PM',
                        status: 'Open'
                    },
                    { upsert: true, new: true }
                )
            )
        );
    } catch (error) {
        console.error("Error seeding labs:", error);
        return [];
    }
};

const seedSeats = async (labs) => {
    try {
        const allSeats = await Promise.all(
            labs.flatMap(lab =>
                Array.from({ length: NUM_SEATS_PER_LAB }, async (_, i) => {
                    const seat = await Seat.findOneAndUpdate(
                        { labID: lab._id, seatNumber: i + 1 },
                        { labID: lab._id, seatNumber: i + 1, status: 'Available' },
                        { upsert: true, new: true, returnDocument: 'after' }
                    );
                    await Lab.findByIdAndUpdate(lab._id, { $addToSet: { seatIds: seat._id } });
                    return seat;
                })
            )
        );
        return allSeats;
    } catch (error) {
        console.error("Error seeding seats:", error);
        return [];
    }
};

const seedReservations = async (students, labs, seats) => {
    try {
        const reservations = [];
        for (const lab of labs) {
            for (let i = 0; i < NUM_RESERVATIONS_PER_LAB; i++) {
                const availableSeats = seats.filter(seat => seat.labID.equals(lab._id));
                if (i >= availableSeats.length) break;

                const randomSeat = availableSeats[i];
                const randomStudent = students[i % students.length];

                const reservation = await Reservation.findOneAndUpdate(
                    { requestingStudentID: randomStudent._id, labID: lab._id, seatID: randomSeat._id },
                    {
                        labID: lab._id,
                        seatID: randomSeat._id,
                        startDateTime: new Date(),
                        endDateTime: new Date(Date.now() + (2 + i) * 60 * 60 * 1000),
                        requestingStudentID: randomStudent._id,
                        creditedStudentIDs: [randomStudent._id],
                        purpose: `Reservation ${i + 1}`,
                        status: i % 3 === 0 ? 'Completed' : 'Reserved'
                    },
                    { upsert: true, new: true }
                );

                await Student.findByIdAndUpdate(randomStudent._id, { $addToSet: { reservationList: reservation._id } });
                await Seat.findByIdAndUpdate(randomSeat._id, { $addToSet: { reservations: reservation._id } });

                reservations.push(reservation);
            }
        }
        return reservations;
    } catch (error) {
        console.error("Error seeding reservations:", error);
        return [];
    }
};

export const seedDatabase = async () => {
    console.log('Seeding database...');
    
    const admins = await seedAdmins();
    console.log(`Seeded ${admins.length} admins`);
    
    const students = await seedStudents();
    console.log(`Seeded ${students.length} students`);
    
    const labs = await seedLabs();
    console.log(`Seeded ${labs.length} labs`);
    
    const seats = await seedSeats(labs);
    console.log(`Seeded ${seats.length} seats`);
    
    const reservations = await seedReservations(students, labs, seats);
    console.log(`Seeded ${reservations.length} reservations`);
    
    console.log('Database seeding complete!');
    mongoose.connection.close();
};
