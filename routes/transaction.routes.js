const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const { verifyToken, checkRole } = require('../middlewares/verification.middleware')

// GET all transactions (admin only)
/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management routes
 */

/**
 * @swagger
 * /api/transaction:
 *   get:
 *     summary: Get all transactions (admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of transactions
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
 *                     $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', verifyToken, checkRole('admin'), transactionController.findAll)

// GET unprocessed transactions (admin only)
/**
 * @swagger
 * /api/transaction/unprocessed:
 *   get:
 *     summary: Get unprocessed transactions (admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unprocessed transactions
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
 *                     $ref: '#/components/schemas/Transaction'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/unprocessed', verifyToken, checkRole('admin'), transactionController.findUnprocessed)

// POST create a new transaction (no auth yet)
/**
 * @swagger
 * /api/transaction:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - participant
 *             properties:
 *               amount:
 *                 type: number
 *               processed:
 *                 type: boolean
 *               participant:
 *                 type: 681482bc65fc51183432885e
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 amount:
 *                   type: number
 *                 processed:
 *                   type: boolean
 *                 participant:
 *                   type: string
 *                 _id:
 *                   type: string
 *       400:
 *         description: Invalid input
 */
router.post('/', transactionController.create);

// DELETE a transaction by ID (admin only)
/**
 * @swagger
 * /api/transaction/{id}:
 *   delete:
 *     summary: Delete a transaction by ID (admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Transaction deleted successfully"
 *       404:
 *         description: Transaction not found
 *       400:
 *         description: Bad request (missing or invalid ID)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

router.delete('/:id', verifyToken, checkRole('admin'), transactionController.deleteById)

// αυτο είναι σημαντικό γιατι στέλνει το αυτόματο ημαιλ
/**
 * @swagger
 * /api/transaction/toggle/{id}:
 *   put:
 *     summary: Toggle the processed status of a transaction (admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The updated transaction object
 *       404:
 *         description: Transaction not found
 *       400:
 *         description: Bad request (missing or invalid ID)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 */
router.put('/toggle/:id', verifyToken, checkRole('admin'), transactionController.toggleProcessed)

module.exports = router;