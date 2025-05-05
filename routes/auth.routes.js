const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login with username and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin123
 *               password:
 *                 type: string
 *                 example: MySecurePassword1!
 *     responses:
 *       200:
 *         description: Successful login
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
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     admin:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                           example: admin123
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: admin@example.com
 *                         roles:
 *                           type: array
 *                           items:
 *                             type: string
 *                           example: ["admin"]
 *                         id:
 *                           type: string
 *                           example: 609e12672f1b2c001f2b1234
 *       400:
 *         description: Missing credentials or other error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Username is required
 *       401:
 *         description: Invalid username or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid username or password
 */
router.post('/', authController.login)

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth login callback
 *     tags: [Auth]
 *     description: Handles the OAuth callback from Google. Redirects to frontend with token on success, or with an error on failure.
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: The authorization code returned from Google
 *     responses:
 *       302:
 *         description: Redirect to frontend with token and email on success
 *         headers:
 *           Location:
 *             description: Redirect URL including token and email query params
 *             schema:
 *               type: string
 *       400:
 *         description: Missing authorization code from Google
 *       401:
 *         description: Email not found in database (user not registered)
 */
router.get('/google/callback', authController.googleLogin)

module.exports = router


// https://accounts.google.com/o/oauth2/auth?client_id={apo_to_google}&redirect_uri={apo_to_google}&response_type={apo_to_auth.service}&scope=email%20profile&access_type=offline

// αυτό είναι του combined app
//https://accounts.google.com/o/oauth2/auth?client_id=37391548646-a2tj5o8cnvula4l29p8lodkmvu44sirh.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/login/google/callback&response_type=code&scope=email%20profile&access_type=offline
