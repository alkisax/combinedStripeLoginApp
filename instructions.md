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
# Δημιουργία back logger
#### logger/logger.js
```js
const { createLogger, format, transports } = require('winston');
require('winston-mongodb');

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.simple()
  ),
  transports: [
    new transports.Console(), // show logs in terminal

    // θα μπορούσα να επιλέξω να σωζει και σε αρχεί ή σε Mongo αλλα μιας και είμαι σε dev το αφήνω εκτών
    // new transports.File({      // save to file
    //   filename: 'logs/all.log'
    // }),

    // new transports.MongoDB({   // save to MongoDB
    //   db: process.env.MONGODB_URI || 'mongodb://localhost:27017/logsdb',
    //   collection: 'logs',
    //   level: 'info',  // logs info and above (warn, error)
    // })
  ]
});

module.exports = logger;
```
# Δημιουργεία swagger documentation
#### swagger.js
```js
const m2s = require('mongoose-to-swagger');
const Admin = require('./models/admins.models');
const Participant = require('./models/participant.models')
const Transaction = require('./models/transaction.models')
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      version: "1.0.0",
      title: "Stripe and Auth API",
      description: "A boilerplate for login and stripe checkout",
    },
    components: {
      schemas: {
        Admin: m2s(Admin),
        Participant: m2s(Participant),
        Transaction: m2s(Transaction),
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  // 👇 This is the critical part: tell swagger-jsdoc where to find your route/controller annotations
  apis: ['./routes/*.js', './controllers/*.js'], // adjust paths if needed
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
```

#### app.js
```js
const swaggerSpec = require('./swagger');
const swaggerUi = require('swagger-ui-express');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
const logger = require('../utils/logger')
const Admin = require('../models/admins.models')
const adminDAO = require('../daos/admin.dao')

exports.findAll = async (req,res) => {
  try {

    // add later when auth
    // if (!req.headers.authorization) {
    // logger.warn('Unauthorized access attempt to /admins (no token)');
    //   return res.status(401).json({ status: false, error: 'No token provided' });
    // }

    const admins = await adminDAO.findAllAdmins();
    logger.info('Fetched all admins');
    res.status(200).json({ status: true, data: admins });
  } catch (error) {
    logger.error(`Error fetching admins: ${error.message}`);
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
      logger.warn('Delete admin called without ID');
      return res.status(404).json({
        status: false,
        error: 'Error deleting admin: not found'
      })
    } else {
      logger.info(`Admin ${deleteAdmin.username} deleted successfully`);
      res.status(200).json({
        status: true,
        message: `Admin ${deleteAdmin.username} deleted successfully`,
      })
    }
  } catch (error) {
    logger.error(`Error deleting admin: ${error.message}`);
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
#### swagger για admin routes
```js
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
```

#### app.js
```js
const adminRoutes = require('./routes/admin.routes')

app.use('/api/admin', adminRoutes)
```
## jest testing for admin
#### package.json
**το script στο test είναι συμαντικο γιατί αλλιώς δεν τρέχουν δυο μαζί test αρχεία**
```json
  "scripts": {
    "test": "cross-env NODE_ENV=test jest --testTimeout=50000 --runInBand",
    "dev": "node --watch server.js"
  },
```
#### __test__/admin.test.js
```js
const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
const app = require("../app");
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Admin = require("../models/admins.models");
const adminDAO = require("../daos/admin.dao");

// Add this mock at the top of your test file to ensure it doesn't interact with the actual Stripe service during tests.
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    // Mock the methods you need, e.g., charge, paymentIntents, etc.
    charges: {
      create: jest.fn().mockResolvedValue({ success: true })
    }
  }));
});

const TEST_ADMIN = {
  username: "adminuser",
  name: "Admin User",
  email: "adminuser@example.com",
  password: "adminpassword",
  roles: ["admin"]
};

let adminToken;
let adminId;

beforeAll(async () => {
  const saltrounds = 10;
  const hashedPassword = await bcrypt.hash(TEST_ADMIN.password, saltrounds);

  await mongoose.connect(process.env.MONGODB_TEST_URI);
  console.log("Connected to MongoDB for testing");

  await Admin.deleteMany({});

  const newAdmin = await Admin.create({
    username: TEST_ADMIN.username,
    name: TEST_ADMIN.name,
    email: TEST_ADMIN.email,
    hashedPassword,
    roles: TEST_ADMIN.roles
  });

  // Simulate admin login to get token
  const res = await request(app)
    .post("/api/login")
    .send({
      username: TEST_ADMIN.username,
      password: TEST_ADMIN.password
    });
  
  adminToken = res.body.data.token;
  adminId = newAdmin._id;
  console.log("Admin token:", adminToken);
});

afterAll(async () => {
  await Admin.deleteMany({});
  await mongoose.connection.close();
});

describe('GET /api/admins', () => {
  it('should return 200 and list of admins when authorized and admin role', async () => {
    const res = await request(app)
      .get('/api/admin')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should return 401 when no token is provided', async () => {
    const res = await request(app)
      .get('/api/admin');

    expect(res.status).toBe(401);
    expect(res.body.status).toBe(false);
  });

  it('should return 403 for non-admin role', async () => {
    const nonAdminToken = 'some-fake-token-for-non-admin';
    const res = await request(app)
      .get('/api/admin')
      .set('Authorization', `Bearer ${nonAdminToken}`);

    expect(res.status).toBe(401);
    expect(res.body.status).toBe(false);
  });
});

describe('POST /api/admins', () => {
  it('should create a new admin and return 201', async () => {
    const newAdmin = {
      username: 'newadmin',
      name: 'New Admin',
      email: 'newadmin@example.com',
      password: 'newadminpassword',
      roles: ['admin']
    };

    const res = await request(app)
      .post('/api/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newAdmin);

    expect(res.status).toBe(201);
    expect(res.body.username).toBe(newAdmin.username);
    expect(res.body.name).toBe(newAdmin.name);
    expect(res.body.email).toBe(newAdmin.email);
    expect(res.body.roles).toEqual(newAdmin.roles);
  });

  it('should return 500 when fields are missing', async () => {
    const newAdmin = {
      username: 'newadmin'
      // Missing required fields like name, password, etc.
    };

    const res = await request(app)
      .post('/api/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newAdmin);

    expect(res.status).toBe(500); //errror coming from mongo
  });

  it('should return 400 when username already exists', async () => {
    const existingAdmin = {
      username: 'existingadmin',
      name: 'Existing Admin',
      email: 'existingadmin@example.com',
      password: 'existingpassword',
      roles: ['admin']
    };

    // First, create the admin
    await request(app)
      .post('/api/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(existingAdmin);

    // Try to create the same admin again
    const res = await request(app)
      .post('/api/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(existingAdmin);

    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/admin/:id', () => {
  it('should delete the admin and return 200', async () => {
    const res = await request(app)
      .delete(`/api/admin/${adminId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.message).toBe(`Admin ${TEST_ADMIN.username} deleted successfully`);
  });

  it('should return 404 when no admin id is provided', async () => {
    const res = await request(app)
      .delete('/api/admin/')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it('should return 404 when admin id is not found', async () => {
    const wrongId = '60d9e3f5b4c2b2d6b8a232c9'; // Invalid ID format
    const res = await request(app)
      .delete(`/api/admins/${wrongId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });
});
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
const logger = require('../utils/logger');
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
  // αυτόν τον code μου τον επιστρέφει το google μετά το login
  const code = req.query.code
  if (!code) {
    logger.warn('Google login failed: missing auth code');
    res.status(400).json({status: false, data: "auth code is missing"})
  } 

  // Μέσο στου σερβισ κάνω το google login
  const result = await authService.googleAuth(code);
    logger.info('Google Auth Result', { result });

  // απο τα αποτελέσματ ατου login βάζω σε δύο μεταβλητές το admin και tokens
  const { admin, tokens } = result;

  if (!admin || !admin.email) {
    logger.warn('Google login failed: no email returned');
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
    logger.info(`Redirecting to: ${frontendUrl}/google-success`);
  
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
#### swagger για auth routes
```js
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth:
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
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     username:
 *                       type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: string
 *       401:
 *         description: Invalid credentials
 */
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

#### __test__/auth.test
```js
const mongoose = require("mongoose");
const request = require("supertest");
const bcrypt = require("bcrypt");
require('dotenv').config();
const app = require("../app");

const Admin = require("../models/admins.models");

// Add this mock at the top of your test file to ensure it doesn't interact with the actual Stripe service during tests.
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    // Mock the methods you need, e.g., charge, paymentIntents, etc.
    charges: {
      create: jest.fn().mockResolvedValue({ success: true })
    }
  }));
});


const TEST_ADMIN_LOGIN = {
  username: "adminuser",
  name: "Admin User",
  email: "admin@example.com",
  password: "securepassword",
  roles: ["admin"]
};

beforeEach(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI);
  await Admin.deleteMany({});

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(TEST_ADMIN_LOGIN.password, saltRounds);

  await Admin.create({
    username: TEST_ADMIN_LOGIN.username,
    name: TEST_ADMIN_LOGIN.name,
    email: TEST_ADMIN_LOGIN.email,
    hashedPassword: hashedPassword,
    roles: TEST_ADMIN_LOGIN.roles
  });
});

afterAll(async () => {
  await Admin.deleteMany({});
  await mongoose.disconnect();
});

describe("POST /api/login", () => {
  it("should return token and admin data for valid credentials", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: TEST_ADMIN_LOGIN.username,
        password: TEST_ADMIN_LOGIN.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.admin).toMatchObject({
      username: TEST_ADMIN_LOGIN.username,
      email: TEST_ADMIN_LOGIN.email,
      roles: TEST_ADMIN_LOGIN.roles
    });
  });

  it("should fail with incorrect password", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: TEST_ADMIN_LOGIN.username,
        password: "wrongpassword"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Invalid username or password");
  });

  it("should fail with non-existent username", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: "ghostuser",
        password: "anyPassword"
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Invalid username or password or admin not found");
  });

  it("should fail if username is missing", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        password: TEST_ADMIN_LOGIN.password
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Username is required");
  });

  it("should fail if password is missing", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({
        username: TEST_ADMIN_LOGIN.username
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe(false);
    expect(res.body.message).toBe("Password is required");
  });
});
```
## front login
#### App.jsx
```jsx
const App = () => {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [users, setUsers] = useState([])
  const [admin, setAdmin] = useState(null)

  const navigate = useNavigate()
  
  //
  useEffect(() => {
    // παίρνω απο το lockalstorage το token και το roles για να δω αν έχει κάνει login και αν είναι admin
    const token = localStorage.getItem("token")
    const roles = JSON.parse(localStorage.getItem("roles"))
    const adminFromStorage = JSON.parse(localStorage.getItem("admin"))
    if (token && roles && roles.includes('admin') && adminFromStorage) {
      const userFromStorage = { token, roles }
      setAdmin(userFromStorage)
      setUserIsAdmin(true) 
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log("Submitting login...")

    try {
      const response = await axios.post(`${url}/login`, {
        "username": username,
        "password": password
      })
      console.log("Login successful", response.data)

      const { token, admin } = response.data.data
      setUser(admin)

      // αποθηκεύω στο lockalstorage για να παραμένει loged in μετα το refresh
      localStorage.setItem("token", token)
      localStorage.setItem("roles", JSON.stringify(admin.roles))

      setAdmin({ token, roles: admin.roles })
      localStorage.setItem("admin", JSON.stringify(admin));

      // η isAdmin είναι boolean και την χρησιμοποιώ με && στα διάφορα render που είναι να τα βλέπει μόνο ο admin
      const isAdmin = admin.roles.includes("admin")
      setUserIsAdmin(isAdmin)
      console.log("Is admin?", isAdmin)

    } catch (error) {
      console.log(error)     
    }
    
    // αυτό μπορούμε να το χρησιμοποιήσουμε γιατί έχουμε  const navigate = useNavigate() και μας οδηγεί στο home
    navigate("/")
  }

  const handleLogout = async () => {
    // καθαρίζουμε το localStorage και το State
    localStorage.removeItem("token")
    localStorage.removeItem("roles");
    localStorage.removeItem("admin");
    setAdmin(null)
    setUserIsAdmin(false)
    console.log("Logged out successfully")
    navigate("/")
  }

// το login route είναι για να με πάει στην φορμα του Login
// το admin route είναι για να με πάει στο login panel
// το Protected route  βεβαιώνει οτι δεν μπορουν να το δουν μη-admin ακομα και αν το γράψουν στο Url
  return (
    // το μενου παρακάτω 
      άλλο 
    <Appbar 
      admin={admin}
      handleLogout={handleLogout}
    />

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

        <Route path="/login" element={
          <>
            <LoginForm 
              username={username}
              password={password}
              setUsername={setUsername}
              setPassword={setPassword}
              handleLogin={handleLogin}
              url={url}
            />
          </>
        } />

        <Route path="/admin" element={
          <>
            // το πως γίνετε Protected route ακολουθεί αμέσος επόμενο
            <ProtectedRoute admin={admin} requiredRole="admin"></ProtectedRoute>
            <AdminPanel
              url={url}
              // handleDeleteParticipant={handleDeleteParticipant}
              // participants={participants}
              // setParticipants={setParticipants}
              // αυτά μόλλον είναι περιτα
              users={users}
              setUsers={setUsers}
            />
          </>
        } />  
    </Routes>
  )
}
export default App
```

#### ProtectedRoute.jsx
```jsx
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ admin , children, requiredRole }) => {
  if (!admin) {
    console.log("protected failed");    
    return <Navigate to="/" />;
  }

  if (requiredRole && !admin.roles.includes(requiredRole)) {
    console.log("protected passed"); 
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
```

#### Appbar.jsx
```jsx
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, Routes, Route } from 'react-router-dom';

const Appbar = ({ admin, handleLogout }) => {

  const padding = {
    paddingRight: 5,
  };

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">

          // έχει μέσα του διάφορα λινκ.
          <Nav.Link as={Link} to="/" style={padding}>
            Home
          </Nav.Link>

          <Nav.Link as={Link} to="/buymeacoffee" style={padding}>
            Buy me a coffee
          </Nav.Link>

          // turnary. αν αντμιν δειξε αν οχι μη δείξεις
          {admin ? (
            <div className="d-flex flex-column align-items-start ml-auto" style={{ padding }}>
              <em style={{ paddingRight: 10 }}>{admin.token ? 'Admin logged in' : 'Logged in'}</em>
              <Nav.Link as={Link} to="/admin" style={padding}>
                Admin Pannel
              </Nav.Link>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Nav.Link as={Link} to="/login" style={padding}>
              Admin Login
            </Nav.Link>
          )}

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </>
  )
}
export default Appbar
```

#### Home.jsx /
```jsx
import { useEffect, useRef } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'

const Home = ({ message, setMessage, url }) => {
  // // επειδή εδώ ξαναγυρνάμε και στο success ή fail του Stripe Checkout με url parms, εδώ ειναι η λογική που το διαχειρίζετε αυτό. Tο αφήνω εδώ αλλα θα το προσθέσω ξανα στην ώρα του
  // // επρεπε να γίνει γιατι καλούσε το success 2 φορες δημιουργώντας 2 transactions
  // // το useRef είναι σαν το state αλλα δεν προκαλει refresh
  // const hasCalledSuccessRef = useRef(false);

  // // παίρνει τα url parms
  // const [searchParams] = useSearchParams()
  // useEffect(() => {
  //   const canceled = searchParams.get('canceled'); 
  //   const success = searchParams.get('success')
  //   // added to manage to call stripe.controller.js handlesucces from frontend
  //   const sessionId = searchParams.get('session_id');
  //   console.log("sessionId", sessionId);
    

  //   if (success === 'true' && sessionId && !hasCalledSuccessRef.current){
  //     // επρεπε να φτιαξω μια νεα function γιατι το axios δεν δουλευε αλλιώς
  //     const fetchSuccess = async () => {
  //       try {
  //         // θα μας δημιουργήσει το transaction
  //         const result = await axios.get(`${url}/stripe/success?session_id=${sessionId}`)
  //         console.log("Success response:", result.data);
  //         // για να εμποδίσει επανάληψη της κλήσης
  //         hasCalledSuccessRef.current = true;
  //       } catch (error) {
  //         console.error ("Error handling success:", error)
  //       }
  //     }
  //     fetchSuccess()
  //     // το message του success δεν εχει timeout
  //     setMessage(`Payment successful! thank you! :)
  //                 you will soon receive an email with the details`)
  //   }

  //   if (canceled === 'true') {
  //     setMessage('Payment canceled! :(');
  //     setTimeout(() => {
  //       setMessage('');
  //     }, 7000); 
  //   }

  // }, [searchParams, setMessage, url]) // τρέχει οποτε αλλάξει κάποιο απο αυτά

  return (
    <>
      // {message && (
      //   <div className={`alert ${message.includes('canceled') ? 'alert-danger' : 'alert-success'} pb-3`} role="alert">
      //     {message}
      //   </div>
      // )}

      <h1>Donate APP</h1>
      <p>stripe + login app</p>
      <p className="text-center text-secondary small">to create an admin has to be done through backend with postman.
        post http://localhost:3000/api/admin
        {`{
          "username": "newadmin",
          "name": "New Admin",
          "email": "newadmin@example.com",
          "password": "password123",
          "roles": ["admin"] 
        }`}
        </p>
      {/* <Checkout /> */}
    </>
  )
}

export default Home
```

#### LoginForm.jsx /login
```jsx

const LoginForm = ({ username, password, setUsername, setPassword, handleLogin, url }) =>{

  // βάζω προκατασκευασμένο url
  const googleUrl = `https://accounts.google.com/o/oauth2/auth?client_id=37391548646-a2tj5o8cnvula4l29p8lodkmvu44sirh.apps.googleusercontent.com&redirect_uri=${url}/login/google/callback&response_type=code&scope=email%20profile&access_type=offline`;

  return (
    <>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type="text"
          id="username"
          value={username}
          name="username"
          onChange={({target}) => setUsername(target.value)}
          autoComplete="username"
          />
        </div>
        <div>
          password
          <input type="text"
          id="password"
          value={password}
          name="password"
          onChange={({target}) => setPassword(target.value)}
          autoComplete="password"
          />
        </div>
        <button id="loginBtn" type="submit">login</button>
      </form>

      <a href={googleUrl}>
        <button id="GoogleLoginBtn" type="button">Login with Google</button>
      </a>
    </>
  )
}
export default LoginForm
```

- AdminPanel.jsx /admin
- **πριν δουμε το AdminPanel** θα επιστρέψουμε στο back για να δημιουργήσουμε τον participant (model, dao, controller, routes, test)
## Participant Backend
#### participant.models.js
- name
- surname
- email
- transactions (συνδεδεμένο με transactions που θα φτιαχτεί αμέσος μετά)
```js
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
    type: mongoose.Schema.Types.ObjectId, // Each item here is an ObjectId pointing to a Transaction document
    ref: 'Transaction' // This tells Mongoose *which* collection/model to link (the 'Transaction' model)
  }],
},
{
  collection: 'participants',
  timestamps: true
})
module.exports = mongoose.model('Participant', participantSchema)
```

#### participant.dao.js
```js
const Participant = require('../models/participant.models');

const findAllParticipants = async () => {
  return await Participant.find().populate('transactions');
};

const findParticipantByEmail = async (email) => {
  return await Participant.findOne({ email }).populate('transactions');
};

const createParticipant = async (participantData) => {
  const participant = new Participant(participantData);
  return await participant.save();
};

const deleteParticipantById = async (participantId) => {
  return await Participant.findByIdAndDelete(participantId);
};

const addTransactionToParticipant = async (participantId, transactionId) => {
  return await Participant.findByIdAndUpdate(
    participantId,
    { $push: { transactions: transactionId } },
    { new: true }
  );
};

module.exports = {
  findAllParticipants,
  findParticipantByEmail,
  createParticipant,
  deleteParticipantById,
  addTransactionToParticipant
};
```

#### participant.controller.js
```js
const bcrypt = require("bcrypt")
const logger = require('../utils/logger')
const Participant = require('../models/participant.models')
const participantDao = require('../daos/participant.dao')

exports.findAll = async (req,res) => {
  try {
    // add later when auth
    if (!req.headers.authorization) {
      return res.status(401).json({ status: false, error: 'No token provided' });
    }

    const participants = await participantDao.findAllParticipants()
    logger.info("Fetched all participants");
    res.status(200).json({
      status: true,
      data: participants
    })

  } catch (error) {
    logger.error(`findAll error: ${error.message}`)
    console.error(error)
    res.status(500).json({
      status: false,
      error: 'find all paricipants error'
    })
  }
}

exports.create = async (req,res) => {
  let data = req.body

  const name = data.name
  const surname = data.surname
  const email = data.email
  const transactions = data.transactions

  try {

    const newParticipant = await participantDao.createParticipant({
      name,
      surname,
      email,
      transactions
    });

    logger.info(`Created new participant: ${email}`);
    res.status(201).json(newParticipant)
  } catch(error) {
    logger.error(`Error creating participant: ${error.message}`);
    res.status(400).json({error: error.message})
  }
}

exports.deleteById = async (req, res) => {
  const participantId = req.params.id
  if (!participantId){
    logger.warn("Delete attempt without ID");
    return res.status(400).json({
      status: false,
      error: 'participant ID is required OR not found'
    })
  }
  
  try {
    const deleteParticipant = await participantDao.deleteParticipantById(participantId) 

    if (!deleteParticipant){
      logger.warn(`Delete failed: participant ${participantId} not found`);
      return res.status(404).json({
        status: false,
        error: 'Error deleting participant: not found'
      })
    } else {
      logger.info(`Deleted participant ${deleteParticipant.username}`);
      res.status(200).json({
        status: true,
        message: `participant ${deleteParticipant.username} deleted successfully`,
      })
    }
  } catch (error) {
    logger.error(`Delete error: ${error.message}`);
    res.status(500).json({
      status: false,
      error: error.message
    })
  }
}
```

#### participant.routes.js
```js
const express = require('express')
const router = express.Router()
const participantController = require('../controllers/participant.controller')
const { verifyToken, checkRole } = require('../middlewares/verification.middleware');

router.get ('/', verifyToken, checkRole('admin'), participantController.findAll)
router.post('/', participantController.create)
router.delete('/:id', verifyToken, checkRole('admin'), participantController.deleteById)

module.exports = router
```
#### swagger documentation for paritcipant routes
```js
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
router.get('/', verifyToken, checkRole('admin'), participantController.findAll);

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
router.post('/', participantController.create);

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
```
#### app.js
```js
const participantRoutes = require('./routes/participant.routes')

app.use('/api/participant', participantRoutes)
```

## transaction Backend
#### transaction.models.js
```js
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
    type: mongoose.Schema.Types.ObjectId, // This stores a reference (ID) to a Participant document
    ref: 'Participant', // This tells Mongoose to link this field to the 'Participant' model
    required: true
  }
},
{
  collection: 'Transactions',
  timestamps: true
})
module.exports = mongoose.model('Transaction', transactionSchema)
```
#### transaction.dao.js
```js
const Transaction = require('../models/transaction.models');
const Participant = require('../models/participant.models')

// Find all transactions
const findAllTransactions = async () => {
  return await Transaction.find().populate('participant');
};

// Find transaction by ID
const findTransactionById = async (transactionId) => {
  return await Transaction.findById(transactionId).populate('participant');
};

// Create a new transaction
const createTransaction = async (transactionData) => {
  const transaction = new Transaction(transactionData);
  return await transaction.save();
};

// Delete a transaction by ID
const deleteTransactionById = async (transactionId) => {
  return await Transaction.findByIdAndDelete(transactionId);
};

// Update a transaction (for example, changing the amount)
const updateTransactionById = async (transactionId, updatedData) => {
  return await Transaction.findByIdAndUpdate(
    transactionId,
    updatedData,
    { new: true } // return the updated document
  );
};

const findTransactionsByProcessed = async (isProcessed) => {
  return await Transaction.find({ processed: isProcessed }).populate('participant');
};

const addTransactionToParticipant = async (participantId, transactionId) => {
  return await Participant.findByIdAndUpdate(
    participantId,
    { $push: { transactions: transactionId } },
    { new: true }
  ); //"Find the participant and push this new transactionId into their transactions array."
};

const findBySessionId = async (sessionId) => {
  return await Transaction.findOne({ sessionId });
};

module.exports = {
  findAllTransactions,
  findTransactionById,
  createTransaction,
  deleteTransactionById,
  updateTransactionById,
  findTransactionsByProcessed,
  findBySessionId
};
```
#### transactionController.js
```js
const bcrypt = require('bcrypt')
const logger = require('../utils/logger')
const Transaction = require('../models/transaction.models')
const transactionDAO = require('../daos/transaction.dao')
const participantDAO = require('../daos/participant.dao')
const axios = require('axios')
// const sendThnxEmail = require('../controllers/email.controller') // !!!

BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'

exports.findAll = async (req,res) => {
  try {

    // add later when auth
    if (!req.headers.authorization) {
      logger.warn('Unauthorized access attempt to findAll');
      return res.status(401).json({ status: false, error: 'No token provided' });
    }

    const transactions = await transactionDAO.findAllTransactions();
    logger.info('Fetched all transactions: %d found', transactions.length);
    res.status(200).json({ status: true, data: transactions });
  } catch (error) {
    console.error(error);
    logger.error('Error in findAll: %s', error.message);
    res.status(500).json({ status: false, error: 'Internal server error' });
  }
}

exports.findUnprocessed = async (req,res) => {
  
  try {
    // add later when auth
    if (!req.headers.authorization) {
      logger.warn('Unauthorized access attempt to findUnprocessed');
      return res.status(401).json({ status: false, error: 'No token provided' });
    }

    const unprocessed = await transactionDAO.findTransactionsByProcessed(false)
    logger.info('Fetched unprocessed transactions: %d found', unprocessed.length);
    res.status(200).json({
      status: true,
      data: unprocessed
    })

  } catch (error) {
    logger.error('Error in findUnprocessed: %s', error.message);
    res.status(500).json(error)
  }
}

exports.create = async (req,res) => {
  let data = req.body
  const amount = data.amount
  const processed = data.processed
  const participant = data.participant

  try {
    const newTransaction = await transactionDAO.createTransaction({
      amount,
      processed,
      participant
    });

    logger.info('Created transaction: %o', { amount, participant });
    await participantDAO.addTransactionToParticipant(participant, newTransaction._id);

    res.status(201).json(newTransaction)
  } catch(error) {
    logger.error(`Error creating transaction: ${error.message}`);
    res.status(400).json({error: error.message})
  }
}

// αυτή είναι σημαντική γιατί στέλνει αυτόματα το email
exports.toggleProcessed = async (req,res) => {
  const transactionId = req.params.id
  if (!transactionId){
    logger.warn('Missing transaction ID in toggleProcessed');
    return res.status(400).json({
      status: false,
      error: 'transaction ID is required OR not found'
    })
  }

  try {
    const transaction = await transactionDAO.findTransactionById(transactionId);

    if (!transaction) {
      logger.warn('Transaction not found with ID: %s', transactionId);
      return res.status(404).json({
        status: false,
        error: 'Transaction not found',
      });
    }

    const updatedData = {
      processed: !transaction.processed
    }

    const updatedTransaction = await transactionDAO.updateTransactionById(transactionId, updatedData)

    // εδώ στέλνουμε το email
    await axios.post(`${BACKEND_URL}/api/email/${transactionId}`)
    logger.info('Toggled processed status for transaction %s to %s', transactionId, updatedData.processed);
    res.status(200).json({ status: true, data: updatedTransaction})
  } catch (error) {
    logger.error('Error toggling transaction processed status: %s', error.message);
    res.status(500).json({
      status:false,
      error: error.message
    })
  }
}

exports.deleteById = async (req, res) => {
  const transactionId = req.params.id
  if (!transactionId){
    logger.warn('Missing transaction ID in deleteById');
    return res.status(400).json({
      status: false,
      error: 'transaction ID is required OR not found'
    })
  }
  
  try {
    const deleteTransaction = await transactionDAO.deleteTransactionById(transactionId) 

    if (!deleteTransaction){
      logger.warn('Transaction not found for deletion with ID: %s', transactionId);
      return res.status(404).json({
        status: false,
        error: 'Error deleting transaction: not found'
      })
    } else {
      logger.info('Deleted transaction with ID: %s', transactionId);
      res.status(200).json({
        status: true,
        message: `transaction deleted successfully`,
      })
    }
  } catch (error) {
    logger.error('Error deleting transaction: %s', error.message);
    res.status(500).json({
      status: false,
      error: error.message
    })
  }
}
```
#### transaction.routes.js
```js
const express = require('express')
const router = express.Router()
const transactionController = require('../controllers/transactionController')
const { verifyToken, checkRole } = require('../middlewares/verification.middleware')

// GET all transactions (admin only)
router.get('/', verifyToken, checkRole('admin'), transactionController.findAll)

// GET unprocessed transactions (admin only)
router.get('/unprocessed', verifyToken, checkRole('admin'), transactionController.findUnprocessed)

// POST create a new transaction (no auth yet)
router.post('/', transactionController.create);

// DELETE a transaction by ID (admin only)
router.delete('/:id', verifyToken, checkRole('admin'), transactionController.deleteById)

router.put('/toggle/:id', verifyToken, checkRole('admin'), transactionController.toggleProcessed)

module.exports = router;
```
#### transaction swagger documentation comments
```js
/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management routes
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions (admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of transactions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', verifyToken, checkRole('admin'), transactionController.findAll)

/**
 * @swagger
 * /api/transactions/unprocessed:
 *   get:
 *     summary: Get unprocessed transactions (admin only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of unprocessed transactions
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/unprocessed', verifyToken, checkRole('admin'), transactionController.findUnprocessed)

/**
 * @swagger
 * /api/transactions:
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
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', transactionController.create)

/**
 * @swagger
 * /api/transactions/{id}:
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
 *         description: Transaction deleted
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', verifyToken, checkRole('admin'), transactionController.deleteById)

/**
 * @swagger
 * /api/transactions/toggle/{id}:
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
 *         description: Transaction updated
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.put('/toggle/:id', verifyToken, checkRole('admin'), transactionController.toggleProcessed)
```
#### app.js
```js
const transactionRoutes = require('./routes/transaction.routes')

app.use('/api/transaction', transactionRoutes)
```
## Admin pannel Front ens
#### AdminPanel.jsx
```jsx
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect  } from "react"
import { Link } from 'react-router-dom'
import axios from 'axios'
import NewParticipantForm from './NewParticipantForm'
import Transactions from './Transactions'

const AdminPanel = ({url, handleDeleteParticipant, participants, setParticipants}) => {
  const [viewForm, setViewForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem("token"); 
        
        const response = await axios.get(`${url}/participant`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setParticipants(response.data.data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false); 
      }
    };

    fetchParticipants();
  }, [url]);

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Only admins can see this.</p>
      <Transactions url={url} />
      {loading && <p>Loading...</p>}
      {!loading && participants.length === 0 && <p>No participants found</p>}
      <ul>
        {!loading && participants.length !== 0 && 
          participants.map((participant) => {
            return (
              <li key={participant._id || `${participant.name}-${participant.email}`}>
                 <Link to={`/users/${participant._id}`}>
                  {participant.email}
                 </Link>
                 - {participant.name} - {participant.email} - {participant.surname}
                 <button id={`${participant.email}Btn`} onClick={() => handleDeleteParticipant(participant._id)}>Delete</button>
              </li>
            )
          })
        } 
      </ul>

      <button id="createParticipantBtn" onClick={() => setViewForm(!viewForm)}>create participant form</button>
      {viewForm && <NewParticipantForm users={participants} setUsers={setParticipants} url={url} />}

    </div>
  )
}

export default AdminPanel
```