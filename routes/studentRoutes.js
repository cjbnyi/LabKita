import express from 'express';
import studentController from '../controllers/studentController.js';

const router = express.Router();

// Assigned to CJ //

/* READ */
router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudentById);

/* CREATE */
router.post('/', studentController.createStudent);

/* UPDATE */
router.put('/:id', studentController.updateStudent);

/* DELETE */
router.delete('/:id', studentController.deleteStudent);

export default router;
