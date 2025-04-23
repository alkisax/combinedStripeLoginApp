- create back and front
- install dipendances
- add npm run dev to package
- δημιουργία φακέλων routes models controllers services
- δημιουργία admins.models.js, participant.models.js transaction.models.js

```javascript
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const adminSchema = new Schema({
  username:{
    type: String,
    required: [true, 'username is required'],
    unique:true
  },
  name:{
    type: String,
    required: false
  },
  roles:{
    type: [String],
    default: ['user']
  },
  email:{
    type: String,
    required: false,
    unique: true
  },
  password:{
    type: String,
    required: [true, 'password is required'],
  },
},
{
  collection: 'admins',
  timestamps: true
})
module.exports = mongoose.model('Admin', adminSchema)
```
```javascript
const mongoose = require("mongoose")

const Schema = mongoose.Schema
const transactionSchema = new Schema({
  amount:{
    type: Number,
    required: [true, 'amount is required'],
  },
  processed:{
    type: Boolean,
    default: false
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true
  }
},
{
  collection: 'Transactions',
  timestamps: true
})
module.exports = mongoose.model('Transaction', transactionSchema)
```
```javascript
const mongoose = require("mongoose")
const transactions = require('./transaction.models')

const Schema = mongoose.Schema
const participantSchema = new Schema({
  name:{
    type: String,
    required: false
  },
  surname:{
    type: String,
    required: false
  },
  email:{
    type: String,
    required: [true, 'email is required'],
    unique: true
  },
  transactions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction'
  }],
},
{
  collection: 'participants',
  timestamps: true
})
module.exports = mongoose.model('Participant', participantSchema)
```
- δημιουργεία server.js
``` javascript
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app'); // import the Express app from app.js

const PORT = process.env.BACK_END_PORT

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message);
  });
```
- δημιουργεία app.js
```javascript
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const adminRoutes = require('./routes/admin.routes')

// const path = require('path'); // requires explanation. added for rendering front page subpages

const app = express()
app.use(cors())
app.use(express.static('dist')) // να το δοκιμασω
app.use(express.json());

app.use('/api/admin', adminRoutes)

// app.get('/*', (req, res, next) => {
//   if (req.path.startsWith('/api')) {
//     return next(); // let the API routes handle it
//   }

//   res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

module.exports = app
```
- δημιουργεία .env
```
MONGODB_URI = mongodb+srv://alkisax:{password}@c

MONGODB_TEST_URI = mongodb+srv://alkisax:{password}@

BACK_END_PORT = 3000

SECRET = ******
JWT_SECRET=******

GOOGLE_CLIENT_ID=******
GOOGLE_CLIENT_SECRET=******
# REDIRECT_URI=http://localhost:3000/api/login/google/callback
REDIRECT_URI=https://loginapp-tjlf.onrender.com/api/login/google/callback

APP_URL=http://localhost:3000
FRONTEND_URL=https://loginapp-tjlf.onrender.com

STRIPE_SECRET_KEY=******
```

### τωρα θα φτιάξω τα routes, τον controller και το DAO του admin ωστε με το ποστμαν να μπορω να ελεξω αν δουλεύουν
## dao
```javascript
const Admin = require('../models/admins.models');

const findAllAdmins = async () => {
  return await Admin.find();
};

const findAdminByUsername = async (username) => {
  return await Admin.findOne({ username });
};

const findAdminByEmail = async (email) => {
  return await Admin.findOne({ email });
};

const createAdmin = async (adminData) => {
  const admin = new Admin(adminData);
  return await admin.save();
};

const deleteAdminById = async (adminId) => {
  return await Admin.findByIdAndDelete(adminId)
}

module.exports = {
  findAllAdmins,
  findAdminByUsername,
  findAdminByEmail,
  createAdmin,
  deleteAdminById
};

```
```javascript
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

    logger.info(`Created new admin: ${username}`);
    res.status(201).json(newAdmin)
  } catch(error) {
    logger.error(`Error creating admin: ${error.message}`);
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
```
```javascript
const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')
// const { verifyToken, checkRole } = require('../middlewares/verification.middleware');

// router.get ('/', verifyToken, checkRole('admin'), adminController.findAll)
router.get ('/', adminController.findAll)
router.post('/', adminController.create)
// router.delete('/:id', verifyToken, checkRole('admin'), adminController.deleteById)
router.delete('/:id', adminController.deleteById)

module.exports = router
```
## ξεκινάω την αντιγραφή του auth
### service controler routes middleware

