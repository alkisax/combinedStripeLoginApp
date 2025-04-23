const bcrypt = require('bcrypt')
const Admin = require('../models/admins.models')
// const authService = require('../services/auth.service')
const adminDAO = require('../daos/admin.dao')

exports.findAll = async (req,res) => {
  try {

    // add later when auth
    // if (!req.headers.authorization) {
    //   return res.status(401).json({ status: false, error: 'No token provided' });
    // }

    const admins = await adminDAO.findAllAdmins();
    res.status(200).json({ status: true, data: admins });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: 'Internal server error' });
  }
}

exports.create = async (req,res) => {
  let data = req.body

  const username = data.username
  const name = data.name
  const password = data.password
  const email = data.email
  const roles = data.roles

  const SaltOrRounds = 10
  const hashedPassword = await bcrypt.hash(password, SaltOrRounds)

  try {

    const newAdmin = await adminDAO.createAdmin({
      username,
      name,
      email,
      roles,
      hashedPassword
    });

    console.log(`Created new admin: ${username}`);
    res.status(201).json(newAdmin)
  } catch(error) {
    console.log(`Error creating admin: ${error.message}`);
    res.status(400).json({error: error.message})
  }
}

exports.deleteById = async (req, res) => {
  const adminId = req.params.id
  if (!adminId){
    return res.status(400).json({
      status: false,
      error: 'Admin ID is required OR not found'
    })
  }
  
  try {
    const deleteAdmin = await adminDAO.deleteAdminById(adminId) 

    if (!deleteAdmin){
      return res.status(404).json({
        status: false,
        error: 'Error deleting admin: not found'
      })
    } else {
      res.status(200).json({
        status: true,
        message: `Admin ${deleteAdmin.username} deleted successfully`,
      })
    }
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    })
  }
}