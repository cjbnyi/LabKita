const router = require('express').Router();
const adminController = require('../controllers/adminController');

// Assigned to: 

/* READ */
router.get('/', adminController.getAdmins);
router.get('/:id', adminController.getAdminById);

/* CREATE */
router.post('/', adminController.createAdmin);

/* UPDATE */
router.put('/:id', adminController.updateAdmin);

/* DELETE */
router.delete('/:id', adminController.deleteAdmin);

module.exports = router;
