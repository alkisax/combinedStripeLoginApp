const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')
const { verifyToken, checkRole } = require('../middlewares/verification.middleware');

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Admin'
 *       500:
 *         description: Internal server error
 */
router.get ('/', verifyToken, checkRole('admin'), adminController.findAll)
// router.get ('/', adminController.findAll)

/**
 * @swagger
 * /admins:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, name, password, email, roles]
 *             properties:
 *               username:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Created admin
 *       400:
 *         description: Bad request
 */
router.post('/', adminController.create)

/**
 * @swagger
 * /admins/{id}:
 *   delete:
 *     summary: Delete admin by ID
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin deleted
 *       400:
 *         description: Missing or invalid ID
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', verifyToken, checkRole('admin'), adminController.deleteById)
// router.delete('/:id', adminController.deleteById)


module.exports = router