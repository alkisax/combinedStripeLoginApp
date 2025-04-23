// https://github.com/mkarampatsis/coding-factory7-nodejs/blob/main/usersApp/controllers/auth.controller.js
// https://fullstackopen.com/en/part4/token_authentication
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken');
const Admin = require('../models/admins.models')
const authService = require('../services/auth.service')
const adminDAO = require('../daos/admin.dao')


exports.login = async (req,res) => {
  try {

    const username = req.body.username
    const password = req.body.password

    if (!username) {
      console.log("Login attempt missing username");
      return res.status(400).json({
        status: false,
        message: "Username is required"
      });
    }
    
    if (!password) {
      console.log("Login attempt missing password");
      return res.status(400).json({
        status: false,
        message: "Password is required"
      });
    }

    // Step 1: Find the user by username
    // const user = await User.findOne({username: req.body.username})
    const admin = await adminDAO.findAdminByUsername(req.body.username);

    if(!admin){
      console.log(`Failed login attempt with username: ${req.body.username}`);
      return res.status(401).json({
        status: false,
        message: 'Invalid username or password'
      })
    }

    // Step 2: Check the password
    const isMatch = await authService.verifyPassword (password, admin.hashedPassword)

    if(!isMatch){
      console.log(`Failed login attempt with username: ${req.body.username}`);
      return res.status(401).json({
        status: false,
        message: 'Invalid username or password'
      })
    }

    // Step 3: Generate the token
    const token = authService.generateAccessToken(admin)
    console.log(`admin ${admin.username} logged in successfully`);

    // Step 4: Return the token and user info
    res.status(200).json({
      status: true,
      data: {
        token: token,
        user: {
          username: admin.username,
          email: admin.email,
          roles: admin.roles,
          id: admin._id
        }
      }
    })

  } catch (error) {
    console.log(`Login error: ${error.message}`);
    res.status(400).json({
      status: false,
      data: error.message
    })
  }
}

exports.googleLogin = async(req, res) => {
  const code = req.query.code
  if (!code) {
    console.log('Auth code is missing during Google login attempt');
    res.status(400).json({status: false, data: "auth code is missing"})
  } 
  // const { admin, tokens } = await authService.googleAuth(code);
  const result = await authService.googleAuth(code);
  console.log('Google Auth Result:', result);

  const { admin, tokens } = result;

  if (!admin || !admin.email) {
    console.log('Google login failed or incomplete');
    return res.status(401).json({ status: false, data: "Google login failed" });
  }

  // 🔐 Create token for your app (JWT etc.)
  const dbUser = await Admin.findOneAndUpdate(
    { email: admin.email },
    { $setOnInsert: { email: admin.email, name: admin.name, roles: ['admin'] } },
    { upsert: true, new: true }
  );

  const payload = { id: dbUser._id, roles: dbUser.roles };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

  // return res.redirect(`http://localhost:5173/google-success?token=${token}&email=${dbUser.email}`);
  // return res.redirect(`https://loginapp-tjlf.onrender.com/google-success?token=${token}&email=${dbUser.email}`);
  const frontendUrl = process.env.FRONTEND_URL
  console.log(frontendUrl);
  
  return res.redirect(`${frontendUrl}/google-success?token=${token}&email=${dbUser.email}`);
}

