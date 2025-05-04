// https://github.com/mkarampatsis/coding-factory7-nodejs/blob/main/usersApp/controllers/auth.controller.js
// https://fullstackopen.com/en/part4/token_authentication
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const Admin = require('../models/admins.models')
const authService = require('../services/auth.service')
const adminDAO = require('../daos/admin.dao')

const FRONTEND_URL = process.env.FRONTEND_URL
exports.login = async (req,res) => {
  try {

    const username = req.body.username
    const password = req.body.password

    if (!username) {
      logger.warn("Login attempt missing username");
      return res.status(400).json({
        status: false,
        message: "Username is required"
      });
    }
    
    if (!password) {
      logger.warn("Login attempt missing password");
      return res.status(400).json({
        status: false,
        message: "Password is required"
      });
    }

    // Step 1: Find the admin by username
    const admin = await adminDAO.findAdminByUsername(req.body.username);

    if(!admin){
      logger.warn(`Failed login attempt - user not found: ${username}`);
      return res.status(401).json({
        status: false,
        message: 'Invalid username or password or admin not found'
      })
    }

    // Step 2: Check the password
    const isMatch = await authService.verifyPassword (password, admin.hashedPassword)

    if(!isMatch){
      logger.warn(`Failed login attempt - incorrect password for user: ${username}`);
      return res.status(401).json({
        status: false,
        message: 'Invalid username or password'
      })
    }

    // Step 3: Generate the token
    const token = authService.generateAccessToken(admin)
    logger.info(`Admin ${admin.username} logged in successfully`);

    // Step 4: Return the token and user info
    res.status(200).json({
      status: true,
      data: {
        token: token,
        admin: {
          username: admin.username,
          email: admin.email,
          roles: admin.roles,
          id: admin._id
        }
      }
    })

  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(400).json({
      status: false,
      data: error.message
    })
  }
}

exports.googleLogin = async(req, res) => {
  const code = req.query.code
  if (!code) {
    logger.warn('Google login failed: missing auth code');
    res.status(400).json({status: false, data: "auth code is missing"})
  } 
  // const { admin, tokens } = await authService.googleAuth(code);
  const result = await authService.googleAuth(code);
  logger.info('Google Auth Result', { result });

  const { admin, tokens } = result;

  if (!admin || !admin.email) {
    logger.warn('Google login failed: no email returned');
    return res.status(401).json({ status: false, data: "Google login failed" });
  }

  // 🔐 Create token for your app (JWT etc.)
  // 🛑 Only use existing user
  const dbUser = await Admin.findOne(
    { email: admin.email }
  );

    // συμαντικό: εδω κάνουμε redirect στο front αν το login είναι μέν επιτυχημένο αλλα το μέηλ δεν είναι στα mail των admin
  if (!dbUser) {
    logger.warn(`Google login failed: user with email ${admin.email} not found in DB`);
    return res.redirect(`${FRONTEND_URL}/login?error=not_registered`).json({ status: false, data: "User not registered" });
  }

  const payload = { id: dbUser._id, roles: dbUser.roles };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

  // return res.redirect(`http://localhost:5173/google-success?token=${token}&email=${dbUser.email}`);
  // return res.redirect(`https://loginapp-tjlf.onrender.com/google-success?token=${token}&email=${dbUser.email}`);
  const frontendUrl = process.env.FRONTEND_URL
  logger.info(`Redirecting to: ${frontendUrl}/google-success`);
  
  return res.redirect(`${frontendUrl}/google-success?token=${token}&email=${dbUser.email}`);
  // return res.redirect(`${frontendUrl}/?token=${token}&email=${dbUser.email}`);
}

