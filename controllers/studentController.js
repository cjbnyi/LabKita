import studentModel from '../database/models/Student.js';

/* =============================== */
/* READ */
/* =============================== */
const getStudents = async (req, res) => {
    try {
        const students = await studentModel.getAll();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching students' });
    }
};

const getStudentById = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await studentModel.getById(id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching student by id' });
    }
};

/* =============================== */
/* CREATE */
/* =============================== */
const createStudent = async (req, res) => {
    const studentData = req.body;

    try {
        const newStudent = await studentModel.create(studentData);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: 'Error creating student' });
    }
};

/* =============================== */
/* UPDATE */
/* =============================== */
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const studentData = req.body;

    try {
        const updatedStudent = await studentModel.updateById(id, studentData);
        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ error: 'Error updating student' });
    }
};

/* =============================== */
/* DELETE */
/* =============================== */
const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStudent = await studentModel.deleteById(id);
        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting student' });
    }
};

export default {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};
