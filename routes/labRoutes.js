const router = require('express').Router();
const labController = require('../controllers/labController');

// Assigned to: 

/* READ */
router.get('/', labController.getLabs);
router.get('/:id', labController.getLabById);

/* CREATE */
router.post('/', labController.createLab);

/* UPDATE */
router.put('/:id', labController.updateLab);

/* DELETE */
router.delete('/:id', labController.deleteLab);

module.exports = router;
