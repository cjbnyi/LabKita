import {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent
} from '../database/models/Student.js';

/* =============================== */
/* READ */
/* =============================== */
const handleGetStudents = async (req, res) => {
    try {
        const students = await getStudents(req.query);
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching students', details: error.message });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const handleCreateStudent = async (req, res) => {
    try {
        const newStudent = await createStudent(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: 'Error creating student', details: error.message });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const handleUpdateStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedStudent = await updateStudent(id, req.body);
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
const handleDeleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStudent = await deleteStudent(id);
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting student', details: error.message });
    }
};

export default {
    handleGetStudents,
    handleCreateStudent,
    handleUpdateStudent,
    handleDeleteStudent
};
