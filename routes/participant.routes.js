const express = require('express')
const router = express.Router()
const participantController = require('../controllers/participant.controller')
const { verifyToken, checkRole } = require('../middlewares/verification.middleware');

router.get ('/', verifyToken, checkRole('admin'), participantController.findAll)
router.post('/', participantController.create)
router.delete('/:id', verifyToken, checkRole('admin'), participantController.deleteById)

module.exports = router