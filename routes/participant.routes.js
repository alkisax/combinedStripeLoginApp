const express = require('express')
const router = express.Router()
const participantController = require('../controllers/participant.controller')
const { verifyToken, checkRole } = require('../middlewares/verification.middleware');

/**
 * @swagger
 * tags:
 *   name: Participants
 *   description: API for managing participants
 */

/**
 * @swagger
 * /participants:
 *   get:
 *     summary: Get all participants
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of participants
 *       401:
 *         description: Unauthorized - no token
 *       403:
 *         description: Forbidden - not admin
 */
router.get ('/', verifyToken, checkRole('admin'), participantController.findAll)

/**
 * @swagger
 * /participants:
 *   post:
 *     summary: Create a new participant
 *     tags: [Participants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - surname
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               transactions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Participant created
 *       400:
 *         description: Bad request
 */
router.post('/', participantController.create)

/**
 * @swagger
 * /participants/{id}:
 *   delete:
 *     summary: Delete a participant by ID
 *     tags: [Participants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the participant to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Participant deleted successfully
 *       404:
 *         description: Participant not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', verifyToken, checkRole('admin'), participantController.deleteById)

module.exports = router