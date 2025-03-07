import express from 'express';
import { validateMongoId, validateUserFields } from '../middleware/validationRules.js';
import checkValidation from '../middleware/validationMiddleware.js';
import adminController from '../controllers/adminController.js';

const router = express.Router();

// Assigned to CJ //

// GET
router.get('/',
    checkValidation,
    adminController.getAdmins
);

router.get('/:id',
    validateMongoId,
    checkValidation,
    adminController.getAdminById
);

// POST
router.post('/',
    ...validateUserFields(),
    checkValidation,
    adminController.createAdmin
);

// PUT
router.put('/:id',
    validateMongoId,
    ...validateUserFields(),
    checkValidation,
    adminController.updateAdmin
);

// DELETE
router.delete('/:id',
    validateMongoId,
    checkValidation,
    adminController.deleteAdmin
);

export default router;
