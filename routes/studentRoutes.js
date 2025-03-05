const router = require('express').Router();
const studentController = require('../controllers/studentController');

// Assigned to: 

/* READ */
router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudentById);

/* CREATE */
router.post('/', studentController.createStudent);

/* UPDATE */
router.put('/:id', studentController.updateStudent);

/* DELETE */
router.delete('/:id', studentController.deleteStudent);

module.exports = router;
