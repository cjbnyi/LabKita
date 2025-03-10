import { Student } from '../../database/models/models.js';

/* =============================== */
/* READ */
/* =============================== */
const getStudents = async (req, res) => {
    try {
        const students = await Student.getStudents(req.query);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching students', details: error.message });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createStudent = async (req, res) => {
    try {
        const newStudent = await Student.createStudent(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: 'Error creating student', details: error.message });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const updatedStudent = await Student.updateStudent(studentId, req.body);
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: 'Error updating student', details: error.message });
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteStudent = async (req, res) => {
    const { studentId } = req.params;

    try {
        const deletedStudent = await Student.deleteStudent(studentId);
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting student', details: error.message });
    }
};

export default {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent
};
