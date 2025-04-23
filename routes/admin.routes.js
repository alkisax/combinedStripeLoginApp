const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')
const { verifyToken, checkRole } = require('../middlewares/verification.middleware');

router.get ('/', verifyToken, checkRole('admin'), adminController.findAll)
// router.get ('/', adminController.findAll)
router.post('/', adminController.create)
router.delete('/:id', verifyToken, checkRole('admin'), adminController.deleteById)
// router.delete('/:id', adminController.deleteById)


module.exports = router