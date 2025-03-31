import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Admin, Lab, Seat, Student, Reservation } from './models/models.js';

const SEATS_PER_LAB = 20;
const RESERVATION_SETS = 10;

const seedAdmins = async () => {
    try {
        const admins = [
            { universityID: 90000000, firstName: "Test", lastName: "Admin", email: "test.admin@dlsu.edu.ph", password: "test.admin@dlsu.edu.ph" },
            { universityID: 90000001, firstName: "Venti", lastName: "Bunyi", email: "venti@dlsu.edu.ph", password: "venti@dlsu.edu.ph" },
            { universityID: 90000002, firstName: "Raiden Ei", lastName: "Bunyi", email: "raiden.ei@dlsu.edu.ph", password: "raiden.ei@dlsu.edu.ph" },
            { universityID: 90000003, firstName: "Nahida", lastName: "Bunyi", email: "nahida@dlsu.edu.ph", password: "nahida@dlsu.edu.ph" },
            { universityID: 90000004, firstName: "Furina", lastName: "Bunyi", email: "furina@dlsu.edu.ph", password: "furina@dlsu.edu.ph" },
            { universityID: 90000005, firstName: "Mavuika", lastName: "Bunyi", email: "mavuika@dlsu.edu.ph", password: "mavuika@dlsu.edu.ph" }
        ];

        return await Promise.all(admins.map(async (admin) => {
            return await Admin.model.findOneAndUpdate(
                { email: admin.email },
                {
                    universityID: admin.universityID,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    email: admin.email,
                    password: await bcrypt.hash(admin.password, 10),
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
        const students = [
            {
                universityID: "10000000",
                firstName: "Test",
                lastName: "Student",
                email: "test_student@dlsu.edu.ph",
                password: "test_student@dlsu.edu.ph",
                college: "College of Computer Science",
                course: "Coursera",
                bio: "Bioflu"
            },
            {
                universityID: "12300001",
                firstName: "Christian Joseph",
                lastName: "Bunyi",
                email: "christian_bunyi@dlsu.edu.ph",
                password: "christian_bunyi@dlsu.edu.ph",
                college: "College of Computer Science",
                course: "BS/MS in Computer Science",
                bio: "Passionate for Venti!"
            },
            {
                universityID: "12300002",
                firstName: "Enzo Rafael",
                lastName: "Chan",
                email: "enzo_rafael_chan@dlsu.edu.ph",
                password: "enzo_rafael_chan@dlsu.edu.ph",
                college: "College of Computer Science",
                course: "BS/MS in Computer Science",
                bio: "Passionate for Nahida!"
            },
            {
                universityID: "12300003",
                firstName: "Widenmar",
                lastName: "Embuscado",
                email: "widenmar_embuscado@dlsu.edu.ph",
                password: "widenmar_embuscado@dlsu.edu.ph",
                college: "College of Computer Science",
                course: "BS in Computer Science Major in Software Technology",
                bio: "Passionate for Raiden Ei!"
            },
            {
                universityID: "12300004",
                firstName: "Rovin Niño",
                lastName: "Montano",
                email: "rovin_montano@dlsu.edu.ph",
                password: "rovin_montano@dlsu.edu.ph",
                college: "College of Computer Science",
                course: "BS/MS in Computer Science",
                bio: "Passionate for Furina!"
            },
            {
                universityID: "12300005",
                firstName: "Ron Fourier",
                lastName: "Alonzo",
                email: "ron_alonzo@dlsu.edu.ph",
                password: "ron_alonzo@dlsu.edu.ph",
                college: "College of Computer Science",
                course: "BS in Information Technology",
                bio: "Passionate for Mavuika!"
            }
        ];

        return await Promise.all(students.map(async (student) => {
            return await Student.model.findOneAndUpdate(
                { email: student.email },
                {
                    ...student,
                    password: await bcrypt.hash(student.password, 10)
                },
                { upsert: true, new: true }
            );
        }));
    } catch (error) {
        console.error("Error seeding students:", error);
        return [];
    }
};

const seedLabs = async () => {
    try {
        const labs = [
            { building: 'AG', room: '601', daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], openingTime: new Date('2025-01-01T07:00:00Z'), closingTime: new Date('2025-01-01T19:00:00Z'), status: 'Open' },
            { building: 'GK', room: '602', daysOpen: ['Tue', 'Wed', 'Thu', 'Fri'], openingTime: new Date('2025-01-01T08:00:00Z'), closingTime: new Date('2025-01-01T20:00:00Z'), status: 'Open' },
            { building: 'LS', room: '603', daysOpen: ['Wed', 'Thu', 'Fri'], openingTime: new Date('2025-01-01T09:00:00Z'), closingTime: new Date('2025-01-01T21:00:00Z'), status: 'Open' },
            { building: 'SJ', room: '604', daysOpen: ['Thu', 'Fri', 'Sat', 'Sun'], openingTime: new Date('2025-01-01T10:00:00Z'), closingTime: new Date('2025-01-01T22:00:00Z'), status: 'Open' },
            { building: 'VL', room: '605', daysOpen: ['Fri', 'Sat', 'Sun', 'Mon', 'Tue'], openingTime: new Date('2025-01-01T11:00:00Z'), closingTime: new Date('2025-01-01T23:00:00Z'), status: 'Open' }
        ];

        return await Promise.all(labs.map(async (lab) => {
            return await Lab.model.findOneAndUpdate(
                { building: lab.building, room: lab.room },
                lab,
                { upsert: true, new: true }
            );
        }));
    } catch (error) {
        console.error("Error seeding labs:", error);
        return [];
    }
};

const seedSeats = async (labs) => {
    try {
        let seats = [];
        for (const lab of labs) {
            for (let i = 1; i <= SEATS_PER_LAB; i++) {
                const seat = await Seat.model.findOneAndUpdate(
                    { labID: lab._id, seatNumber: i },
                    { labID: lab._id, seatNumber: i, status: 'Available' },
                    { upsert: true, new: true }
                );
                seats.push(seat);
            }
        }
        return seats;
    } catch (error) {
        console.error("Error seeding seats:", error);
        return [];
    }
};

const seedReservations = async (students, labs, seats) => {
    try {
        const reservationData = [
            { students: [students[0], students[1]], labIndex: 0, time: '2025-04-02T12:00:00Z', purpose: 'venti appreciation', isAnonymous: false },
            { students: [students[1], students[2]], labIndex: 1, time: '2025-04-02T13:00:00Z', purpose: 'raiden ei appreciation', isAnonymous: true },
            { students: [students[2], students[3]], labIndex: 2, time: '2025-04-02T14:00:00Z', purpose: 'nahida appreciation', isAnonymous: false },
            { students: [students[3], students[4]], labIndex: 3, time: '2025-04-03T15:00:00Z', purpose: 'furina appreciation', isAnonymous: true },
            { students: [students[4], students[0]], labIndex: 4, time: '2025-04-04T16:00:00Z', purpose: 'mavuika appreciation', isAnonymous: false }
        ];

        let reservations = [];
        for (let i = 0; i < RESERVATION_SETS; i++) {
            for (const data of reservationData) {
                const startDateTime = new Date(data.time);
                startDateTime.setDate(startDateTime.getDate() + i * 7);
                const endDateTime = new Date(startDateTime);
                endDateTime.setHours(endDateTime.getHours() + 1);
                
                const labSeats = seats.filter(seat => seat.labID.equals(labs[data.labIndex]._id)).slice(0, 2);
                
                const seatIDs = labSeats.map(seat => seat._id);
                const creditedStudentIDs = data.students.map(student => student._id);
                
                const reservation = await Reservation.model.create({
                    seatIDs: seatIDs,
                    startDateTime: startDateTime,
                    endDateTime: endDateTime,
                    creditedStudentIDs: creditedStudentIDs,
                    purpose: data.purpose,
                    status: 'Reserved',
                    isAnonymous: data.isAnonymous
                });
                reservations.push(reservation);
            }
        }
        return reservations;
    } catch (error) {
        return [];
    }
};

export const seedDatabase = async () => {
    console.log('\n====================');
    console.log('Seeding database...');
    console.log('====================\n');
    
    console.log('\n--- Seeding Admins ---\n');
    const admins = await seedAdmins();
    console.log(`Seeded ${admins.length} admins`);
    
    console.log('\n--- Seeding Students ---\n');
    const students = await seedStudents();
    console.log(`Seeded ${students.length} students`);
    
    console.log('\n--- Seeding Labs ---\n');
    const labs = await seedLabs();
    console.log(`Seeded ${labs.length} labs`);
    
    console.log('\n--- Seeding Seats ---\n');
    const seats = await seedSeats(labs);
    console.log(`Seeded ${seats.length} seats`);
    
    console.log('\n--- Seeding Reservations ---\n');
    const reservations = await seedReservations(students, labs, seats);
    console.log(`Seeded ${reservations.length} reservations`);
    
    console.log('\nDatabase seeding complete!\n');
    mongoose.connection.close();
};
