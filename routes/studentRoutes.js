import express from 'express';
import { validateMongoId, validateUserFields } from '../middleware/validationRules.js';
import checkValidation from '../middleware/validationMiddleware.js';
import studentController from '../controllers/studentController.js';

const router = express.Router();

// Assigned to CJ //

// GET
router.get('/',
    checkValidation,
    studentController.getStudents
);

router.get('/:id',
    validateMongoId,
    checkValidation,
    studentController.getStudentById
);

// POST
router.post('/',
    ...validateUserFields(),
    checkValidation,
    studentController.createStudent
);

// PUT
router.put('/:id',
    validateMongoId,
    ...validateUserFields(),
    checkValidation,
    studentController.updateStudent
);

// DELETE
router.delete('/:id',
    validateMongoId,
    checkValidation,
    studentController.deleteStudent
);

export default router;
