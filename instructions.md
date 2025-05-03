# Οδηγίες δημιουργίας Combined Login Stripe Nodemailer App

# αρχικοποίηση του back  και του Front

### back

```bash
npm init
npm install express
npm install mongoose
npm install dotenv
npm install bcrypt
npm install jsonwebtoken
npm install swagger-ui-express
npm install mongoose-to-swagger
npm install swagger-jsdoc
npm install winston
npm install winston-daily-rotate-file
npm install winston-mongodb
npm install google-auth-library
npm install axios
npm install cors
npm install morgan
npm install express-async-errors
npm install --save-dev nodemon
npm install --save-dev supertest
npm install --save-dev cross-env
npm install prop-types
npm install --save-dev jest @babel/preset-env @babel/preset-react eslint-plugin-jest
npm install --save-dev deep-freeze
```

#### package.json
```js
{
  "name": "combinedstripeloginapp",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "node --watch server.js"
  },
  "author": "",
  "license": "ISC",
  "description": "",
  "dependencies": {
    "axios": "^1.8.4",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.5.0",
    "express": "^5.1.0",
    "google-auth-library": "^9.15.1",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.13.2",
    "mongoose-to-swagger": "^1.5.1",
    "morgan": "^1.10.0",
    "nodemailer": "^6.10.1",
    "prop-types": "^15.8.1",
    "stripe": "^18.0.0",
    "swagger-jsdoc": "^6.2.8",
    "swagger-ui-express": "^5.0.1",
    "winston": "^3.17.0",
    "winston-daily-rotate-file": "^5.0.0",
    "winston-mongodb": "^6.0.0"
  },
  "devDependencies": {
    "@babel/preset-env": "^7.26.9",
    "@babel/preset-react": "^7.26.3",
    "cross-env": "^7.0.3",
    "deep-freeze": "^0.0.1",
    "eslint-plugin-jest": "^28.11.0",
    "jest": "^29.7.0",
    "nodemon": "^3.1.10",
    "supertest": "^7.1.0"
  }
}
```

### Front
```bash
npm create vite@latest frontend -- --template react
npm install
npm install axios
npm install react-bootstrap
npm install react-router-dom
```
#### package.json
```js
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@stripe/stripe-js": "^7.2.0",
    "axios": "^1.8.4",
    "bootstrap": "^5.3.5",
    "react": "^19.0.0",
    "react-bootstrap": "^2.10.9",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.5.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.22.0",
    "@types/react": "^19.0.10",
    "@types/react-dom": "^19.0.4",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.22.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "vite": "^6.3.1"
  }
}
```

#### .env
```
MONGODB_URI = mongodb+srv://alkisax:{***}@cluster0.8ioq6.mongodb.net/combined?retryWrites=true&w=majority&appName=Cluster0
MONGODB_TEST_URI = mongodb+srv://alkisax:{***}@cluster0.8ioq6.mongodb.net/combined_TEST?retryWrites=true&w=majority&appName=Cluster0

BACK_END_PORT = 3001

SECRET = ***
JWT_SECRET=***

GOOGLE_CLIENT_ID=***
GOOGLE_CLIENT_SECRET=***
REDIRECT_URI=http://localhost:3001/api/login/google/callback

EMAIL_USER=alkisax@zohomail.eu
EMAIL_PASS_USER=***
EMAIL_PASS=***

APP_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001

STRIPE_SECRET_KEY=***
```

## βασικο boiler plate για back
#### server.js
```js
require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app'); 

const PORT = process.env.BACK_END_PORT || 3001

mongoose.set('strictQuery', false);
// συνδεση με την MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
    console.log('Routes setup complete. Starting server...');
// εδώ είναι το βασικό listen PORT μου
    app.listen(PORT, () => {
      // το εκανα σαν λινκ για να είναι clickable
      console.log(`Server running on port http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message);
  });
```

#### app.js
```js
// require('dotenv').config()
const express = require('express')
const cors = require('cors')
// θα προστεθούν πολλα τέτοια endpoints οπως προχωρά η εφαρμογη
const adminRoutes = require('./routes/admin.routes')

// αυτό ειναι κάτι που ίσως μου χρειαστεί στο deploy και δεν το καταλαβαίνω καλα. (και παρακάτω μαζί με αυτό)
// const path = require('path'); // requires explanation. added for rendering front page subpages

const app = express()
app.use(cors())
app.use(express.json());

// ενας logger για να καταγράφει το backend τις κλήσεις
app.use((req, res, next) => {
  console.log("Request reached Express!");
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// θα προστεθούν πολλα τέτοια endpoints οπως προχωρά η εφαρμογη
app.use('/api/admin', adminRoutes)

// για να σερβίρει τον φακελο dist του front μετα το npm run build
app.use(express.static('dist'))

// αυτό ειναι κάτι που ίσως μου χρειαστεί στο deploy
// app.get('/*', (req, res, next) => {
//   if (req.path.startsWith('/api')) {
//     return next(); // let the API routes handle it
//   }

//   res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

module.exports = app
```

## βασικό boilerplate για φροντ
#### main.jsx
```jsx
// το αφαίρεσα γιατί μου έκανε διπλές εγραφές
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// για να μπορώ να χρησιμοποιώ το router για να στέλνω σε διαφορετικές σελλιδες φτιαγμένες απο το front
import { BrowserRouter as Router } from 'react-router-dom' // bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx' // η βασική μου εφαρμογή

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Router>
      <App />
    </Router>
  // </StrictMode>,
)
```
#### App.jsx
```jsx
import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useNavigate
} from 'react-router-dom'
import { Container } from 'react-bootstrap'

const url = 'http://localhost:3001/api'

const App = () => {
  const [message, setMessage] = useState('')

  const navigate = useNavigate()
  
  return (
    <div className="bg-dark text-light  d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh'}}>
      {/* Routes here handle sub-pages like /admin */}
      <Routes>
        <Route path="/" element={
          <>
            <Home 
              message={message}
              setMessage={setMessage}
              url={url}
            />
          </>
        } /> 
      </Routes>
    </div>
  )
}

export default App
```

# Δημιουργια admin
## Back
#### admin.models.js
έχει
- username - required
- name
- roles
- email
- hashedPassword - required

```js
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
  hashedPassword:{
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
#### admin.dao.js
```js
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
#### admin.controller.js
```js
const bcrypt = require('bcrypt') // για να φτιάξω το hashed pass
const Admin = require('../models/admins.models')
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
```
#### admin.routes.js
```js
const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin.controller')
const { verifyToken, checkRole } = require('../middlewares/verification.middleware');


router.get ('/', adminController.findAll)
router.delete('/:id', adminController.deleteById)
router.post('/', adminController.create) // αυτό είναι βασικό και απο εδώ μπορώ να δημιουργισω έναν αντμιν χωρις να μου ζητάει κάποιο authentication
// αυτά θα αλλάξουν αργότερα που θα αποκτήσω και auth
// router.delete('/:id', verifyToken, checkRole('admin'), adminController.deleteById)
// router.get ('/', verifyToken, checkRole('admin'), adminController.findAll)

module.exports = router
```
#### app.js
```js
const adminRoutes = require('./routes/admin.routes')

app.use('/api/admin', adminRoutes)
```

*Τωρα που εφτιαξα τον αντμιν μου πρέπει να δημιουργήσω ένα Login για να μπορεί να συνδεθει*
# δημιουργία admin login
# *Το google login έχει προβληματα. Το βάζω εδω αλλα αργότερα θα αλαχθει* https://console.cloud.google.com/apis/credentials
#### auth.service.js
```js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { OAuth2Client } = require('google-auth-library')

// δημιουγια τοκεν sevice
generateAccessToken = (user) => {
  // μέσα στο τοκεν βρίσκονται αποθηκευμένες στο string του οι διάφορες πληροφορίες του payload
  const payload = {
    username: user.username,
    email: user.email,
    roles: user.roles,
    id: user._id
  }

  // χρειάζομαι ένα secret δικό μου που το αποθηκεύω στο .env
  const secret = process.env.SECRET
  // μέσα στο options μπορώ να βάλω πότε λίγει
  const options = {
    expiresIn: '1h'
  }
  // με .sign γίνετε η δημιουργία
  const token = jwt.sign(payload, secret, options)
  return token
}

const verifyPassword = async (password, hashedPassword) => {
  // ΠΡΟΣΟΧΗ αυτό είναι bcrypt και οχι JWT που χρησιμοποιώ κατα κύριο λογο και αυτό είναι για εσωτερική χρήση. Mε .compare και δίνοντας το δικό μου pass και το pass απο το input γινετε η επιβεβαίωση
  return await bcrypt.compare(password, hashedPassword)
}

// επιβεβαίωση τοκεν
const verifyAccessToken = (token) => {
  const secret = process.env.SECRET
  try {
    // JWT με .verify επιβεβαιώνει το τοκεν
    const payload = jwt.verify(token, secret)
    return { 
      verified: true, data: payload
    }
  } catch (error) {
    return { 
      verified: false, data: error.message
    }
  }
}

// μου γυρνάει το τοκεν ως αλφαρηθμιτικο
const getTokenFrom = (req) => {
  // το παίρνει απο τους header του request, θα ξεκινάει με bearer
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // γυρνάω το τοκεν χωρίς το bearer
    const token = authorization.replace('Bearer ', '')
    return token    
  }
  return null
}

const googleAuth = async (code) => {
  // αυτά τα παίρνω απο το https://console.cloud.google.com/apis/credentials
  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  // τα παιρνάω στη βιβλιοθήκη το google
  const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

  try {
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    // console.log("Step 1", tokens)
    oauth2Client.setCredentials(tokens)

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: CLIENT_ID
    });

    // console.log("Step 2")
    const userInfo = await ticket.getPayload();
    return {admin: userInfo, tokens}
  } catch (error) {
    console.log("Error in google authentication", error);
    return { error: "Failed to authenticate with google"}
  }
}

module.exports = {
  generateAccessToken,
  verifyPassword,
  verifyAccessToken,
  getTokenFrom,
  googleAuth
}
```
#### auth.controller.js
```js
// site με πληροφοριες για το πως να φτιαχτει
// https://github.com/mkarampatsis/coding-factory7-nodejs/blob/main/usersApp/controllers/auth.controller.js
// https://fullstackopen.com/en/part4/token_authentication
const bcrypt = require ('bcrypt')
const jwt = require('jsonwebtoken');
// καλώ πράγματα και απο το auth και απο τον admin
const Admin = require('../models/admins.models')
const authService = require('../services/auth.service')
const adminDAO = require('../daos/admin.dao')


exports.login = async (req,res) => {
  try {
    // μου έχει έρΘει (απο το postman) κάτι σαν object {} με username και password
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

    // Step 1: Find the admin by username
    const admin = await adminDAO.findAdminByUsername(req.body.username);

    if(!admin){
      console.log(`Failed login attempt with username: ${req.body.username}`);
      return res.status(401).json({
        status: false,
        message: 'Invalid username or password or admin not found'
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
        admin: {
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
  // αυτόν τον code μου τον επιστρέφει το google μετά το login
  const code = req.query.code
  if (!code) {
    console.log('Auth code is missing during Google login attempt');
    res.status(400).json({status: false, data: "auth code is missing"})
  } 

  // Μέσο στου σερβισ κάνω το google login
  const result = await authService.googleAuth(code);
  console.log('Google Auth Result:', result);

  // απο τα αποτελέσματ ατου login βάζω σε δύο μεταβλητές το admin και tokens
  const { admin, tokens } = result;

  if (!admin || !admin.email) {
    console.log('Google login failed or incomplete');
    return res.status(401).json({ status: false, data: "Google login failed" });
  }

  // 🔐 Create token for your app (JWT etc.)
  // δεν ξέρω τι κάνει TODO
  const dbUser = await Admin.findOneAndUpdate(
    { email: admin.email },
    { $setOnInsert: { email: admin.email, name: admin.name, roles: ['admin'] } },
    { upsert: true, new: true }
  );

  const payload = { id: dbUser._id, roles: dbUser.roles };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

  // το google χρειάζετε που να σε στείλει μετα το login αυτό πρέπει να είναι καταχωρημένο και στο console του google cloud
  const frontendUrl = process.env.FRONTEND_URL
  console.log(frontendUrl);
  
  return res.redirect(`${frontendUrl}/google-success?token=${token}&email=${dbUser.email}`);
}

```
#### middleware/verification.middleware.js
```js

const authService = require('../services/auth.service');

/**
 * Middleware to verify JWT token.
 * Attaches decoded user data to `req.user` if valid.
 */
const verifyToken = (req, res, next) => { // το next είναι που το κάνει middleware
  const token = authService.getTokenFrom(req);
  const verificationResult = authService.verifyAccessToken(token);

  if (!verificationResult.verified) {
    console.log(`Unauthorized access attempt with token: ${token}`);
    return res.status(401).json({
      status: false,
      error: verificationResult.data
    });
  }

  req.user = verificationResult.data;
  next();
};

/**
 * Middleware to check if user has required role.
 * Call after verifyToken middleware.
 */
const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.roles.includes(requiredRole)) {
      console.log(`Forbidden access by user: ${user?.username || 'unknown'}`);
      return res.status(403).json({
        status: false,
        error: 'Forbidden'
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
};
```
### auth.routes.js
```js
const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')

router.post('/', authController.login)
router.get('/google/callback', authController.googleLogin)

module.exports = router
```
*Εχω ένα ετοιμο φτιαγμένο λινκ για να δοκιμαζω το google auth χωρις να χρειάζομαι το front end*
```url
https://accounts.google.com/o/oauth2/auth?client_id={apo_to_google}&redirect_uri={apo_to_google}&response_type={apo_to_auth.service}&scope=email%20profile&access_type=offline

// αυτό είναι του combined app
https://accounts.google.com/o/oauth2/auth?client_id=37391548646-a2tj5o8cnvula4l29p8lodkmvu44sirh.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/login/google/callback&response_type=code&scope=email%20profile&access_type=offline
```

#### app.js
```js
const loginRoutes = require('./routes/auth.routes')

app.use('/api/login', loginRoutes)
```

#### με ποστμαν
- post στο http://localhost:3001/api/login
- με raw json
```
{
    "username":"alkisax",
    "password":"123"
}
```
- παιρνω πισω κάτι σαν
```html
{
    "status": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsa2lzYXgiLCJlbWFpbCI6ImFsa2lzYXhAZ21haWwuY29tIiwicm9sZXMiOlsiYWRtaW4iXSwiaWQiOiI2ODA5MjEwZWE3NDgxNTkwZTk3NTk4NjYiLCJpYXQiOjE3NDYyNjIzODYsImV4cCI6MTc0NjI2NTk4Nn0.AwJbBUDxPCGuDQhnfo41vAblA2fhv3RJ-CwMpgD759c",
        "admin": {
            "username": "alkisax",
            "email": "alkisax@gmail.com",
            "roles": [
                "admin"
            ],
            "id": "6809210ea7481590e9759866"
        }
    }
}
```

## front login