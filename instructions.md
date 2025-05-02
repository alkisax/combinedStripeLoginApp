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

# postman test
postman test
post http://localhost:3000/api/login
{
    "username": "alkisax",
    "password": "123"
}
		"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsa2lzYXgiLCJlbWFpbCI6ImFsa2lzYXhAZ21haWwuY29tIiwicm9sZXMiOlsiYWRtaW4iXSwiaWQiOiI2ODA5MjEwZWE3NDgxNTkwZTk3NTk4NjYiLCJpYXQiOjE3NDU2ODExNTQsImV4cCI6MTc0NTY4NDc1NH0.Nxbnd0gqTey5e1zt9z3n2pH3IPazcEooGqew2jq7vlI",
get http://localhost:3000/api/participant
{
	"status": true,
	"data": []
}
post
{
    "name":"donator",
    "surname": "mr nice guy",
    "email":"samaritan@holymail.com"
}
{
	"name": "donator",
	"surname": "mr nice guy",
	"email": "samaritan@holymail.com",
	"transactions": [],
	"_id": "680cfc08a7a6419a9a1370ab",
	"createdAt": "2025-04-26T15:30:16.976Z",
	"updatedAt": "2025-04-26T15:30:16.976Z",
	"__v": 0
}
post http://localhost:3000/api/transaction
{
    "amount":50,
    "participant":"680cfc08a7a6419a9a1370ab"
}
{
	"amount": 50,
	"processed": false,
	"participant": "680cfc08a7a6419a9a1370ab",
	"_id": "680d06867f262158f31e367d",
	"createdAt": "2025-04-26T16:15:02.863Z",
	"updatedAt": "2025-04-26T16:15:02.863Z",
	"__v": 0
}
get http://localhost:3000/api/participant
{
	"status": true,
	"data": [
		{
			"_id": "680cfc08a7a6419a9a1370ab",
			"name": "donator",
			"surname": "mr nice guy",
			"email": "samaritan@holymail.com",
			"transactions": [
				{
					"_id": "680d06867f262158f31e367d",
					"amount": 50,
					"processed": false,
					"participant": "680cfc08a7a6419a9a1370ab",
					"createdAt": "2025-04-26T16:15:02.863Z",
					"updatedAt": "2025-04-26T16:15:02.863Z",
					"__v": 0
				}
			],
			"createdAt": "2025-04-26T15:30:16.976Z",
			"updatedAt": "2025-04-26T16:15:03.674Z",
			"__v": 0
		}
	]
}

# Stripe
this my stripe part now

```
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const adminRoutes = require('./routes/admin.routes')
const loginRoutes = require('./routes/auth.routes')
const participantRoutes = require('./routes/participant.routes')
const transactionRoutes = require('./routes/transaction.routes')
const stripeRoutes = require('./routes/stripe.routes')

// const path = require('path'); // requires explanation. added for rendering front page subpages

const app = express()
app.use(cors())
app.use(express.static('dist')) // να το δοκιμασω
app.use(express.json());

app.use('/api/admin', adminRoutes)
app.use('/api/login', loginRoutes)
app.use('/api/participant', participantRoutes)
app.use('/api/transaction', transactionRoutes)
app.use('/api/stripe', stripeRoutes)

// app.get('/*', (req, res, next) => {
//   if (req.path.startsWith('/api')) {
//     return next(); // let the API routes handle it
//   }

//   res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

module.exports = app

const express = require('express');
const router = express.Router();
const stripeController = require('../controllers/stripe.controller');

router.post('/checkout/:price_id', stripeController.createCheckoutSession);
router.get('/success', stripeController.handleSuccess);
router.get('/cancel', stripeController.handleCancel);

module.exports = router;
```
```
const stripeService = require('../services/stripe.service');
const transactionDAO = require('../daos/transaction.dao');
const participantDAO = require('../daos/participant.dao');

const createCheckoutSession = async (req, res) => {
  const price_id = req.params.price_id;

  try {
    const session = await stripeService.createCheckoutSession(price_id);
    res.json(session);
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    res.status(500).json({ error: error.message });
  }
};

const handleSuccess = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) {
      return res.status(400).send('Missing session ID.');
    }

    const session = await stripeService.retrieveSession(sessionId);

    const amountTotal = session.amount_total / 100; // Stripe returns cents
    const customerEmail = session.customer_details.email;

    console.log(`Payment success for: ${customerEmail}, amount: ${amountTotal}`);

    let participant = await participantDAO.findParticipantByEmail(customerEmail);

    if (!participant) {
      console.log('Participant not found, creating new one...');
      await participantDAO.createParticipant({ email: customerEmail, name: 'Anonymous', surname: 'Donator' });
    }

    participant = await participantDAO.findParticipantByEmail(customerEmail);

    await transactionDAO.createTransaction({
      amount: amountTotal,
      processed: true,
      participant: participant._id
    });

    return res.send('Success! Your donation was recorded. Thank you!');
  } catch (error) {
    console.error('Error processing success route:', error.message);
    return res.status(500).send('Something went wrong.');
  }
};

const handleCancel = (req, res) => {
  return res.send('Payment canceled! ');
};

module.exports = {
  createCheckoutSession,
  handleSuccess,
  handleCancel
};
```
```
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const QUANTITY = 1; // just number not string

const createCheckoutSession = async (price_id) => {
  const BACKEND_URL = process.env.YOUR_DOMAIN || 'http://localhost:3000';
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: price_id,
        quantity: QUANTITY,
      },
    ],
    mode: 'payment',
    success_url: `${BACKEND_URL}/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BACKEND_URL}/cancel?canceled=true`,
  });
};

const retrieveSession = async (sessionId) => {
  return await stripe.checkout.sessions.retrieve(sessionId);
};

module.exports = {
  createCheckoutSession,
  retrieveSession
};
```
# Note

does this now works?
user clicks buy me a coffee
          <Nav.Link as={Link} to="/buymeacoffee" style={padding}>
            Buy me a coffee
          </Nav.Link>
transfers to participantinfoform
        <Route path='/buymeacoffee' element={
          // <Checkout />
          <Participantinfoform 
            // newParticipant={newParticipant}
            setNewParticipant={setNewParticipant}
          />
        } />
there gives name surname and email and this are passed as url params to checkout
const ParticipantInfoForm = ({ setNewParticipant }) => {

  const navigate = useNavigate()

  const handleSubmitParticipant = async (event) => {
    const name = event.target.name.value
    const surname = event.target.surname.value
    const email = event.target.email.value

    if (!email) {
      alert('please enter your email')
    }

    setNewParticipant({
      name: name,
      surname: surname,
      email: email
    })

    // Create a query string from the newParticipant object
    const params = new URLSearchParams({
      name: name,
      surname: surname,
      email: email,
    }).toString()

    navigate(/checkout?${params})
  }


in chceckout added  (im not sure about this part)
import { useSearchParams } from 'react-router-dom'
  const [participantInfo] = useSearchParams()

participant info is added also to button
      <div className="row justify-content-center">
        {/* Card 1 */}
        <div className="col-12 col-sm-4 mb-4">
          <div className="card border border-white p-3 h-100">
            <img src={oneCoin} className="card-img-top" alt="Donate 0.50€" />
            <div className="card-body text-center">
              <h5 className="card-title">Donate 0.50€</h5>
              <p className="card-text">A small but mighty donation 🙏</p>
              <button className="btn btn-primary" onClick={() => handleCheckout(PRICE_ID_050, participantInfo)}>Donate 0.50€</button>
            </div>
          </div>
        </div>

when clicked
  const handleCheckout = async (price_id, participantInfo) => {
    try {
      // added participant info to be sent to back via url params
      const response = await axios.post(${BACKEND_URL}/api/stripe/checkout/${price_id}, { participantInfo })

      const { id } = response.data
  
      const stripe = await stripePromise
      await stripe.redirectToCheckout({ sessionId: id })
    } catch (error) {
      console.log(error)
    }
  }

this calls the back
router.post('/checkout/:price_id', stripeController.createCheckoutSession);

in the controller
const handleSuccess = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    const name = req.query.name;
    const surname = req.query.surname;
    const email = req.query.email;
    if (!sessionId || !email) {
      return res.status(400).send('Missing session ID.');
    }

    const session = await stripeService.retrieveSession(sessionId);

    const amountTotal = session.amount_total / 100; // Stripe returns cents

    console.log(Payment success for: ${email}, amount: ${amountTotal});

    let participant = await participantDAO.findParticipantByEmail(email);

    if (!participant) {
      console.log('Participant not found, creating new one...');
      await participantDAO.createParticipant({ email: email, name: name, surname: surname });
    }

    const newTransaction = await transactionDAO.createTransaction({
      amount: amountTotal,
      processed: true,
      participant: participant._id
    });

    await participantDAO.addTransactionToParticipant(participant._id, newTransaction._id);

    return res.send('Success! Your donation was recorded. Thank you!');
  } catch (error) {
    console.error('Error processing success route:', error.message);
    return res.status(500).send('Something went wrong.');
  }
};

which also use a service which passes to the controller as params the participant info to be used in the creation of the transaction

const createCheckoutSession = async (price_id) => {
  const BACKEND_URL = process.env.YOUR_DOMAIN || 'http://localhost:3000';
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://http://localhost:5173'
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: price_id,
        quantity: QUANTITY,
      },
    ],
    mode: 'payment',
    // added to get the participant info from front to be able to create a new transaction
    // success_url: ${BACKEND_URL}/success?success=true&session_id={CHECKOUT_SESSION_ID},
    success_url: ${BACKEND_URL}/success?success=true&session_id={CHECKOUT_SESSION_ID}&name=${participantInfo.name}&surname=${participantInfo.surname}&email=${participantInfo.email},
    cancel_url: ${FRONTEND_URL}/cancel?canceled=true,
    // added to get the participant info from front to be able to create a new transaction
    metadata: {
      name: participantInfo.name,
      surname: participantInfo.surname,
      email: participantInfo.email
    }
  });
};



Το ChatGPT είπε:
Yes, with the changes you’ve described, it looks like your donation flow should now work as expected, but let me summarize and point out any areas that might need further clarification or adjustments:

Flow Overview:
User Clicks "Buy Me A Coffee":

The user is navigated to the /buymeacoffee page where the ParticipantInfoForm component is rendered.

The participant fills in their name, surname, and email.

User Submits Form:

The form sends the participant information (name, surname, email) via the navigate() method, passing the data as URL query parameters to the /checkout route.

Checkout Page:

On the /checkout page, you retrieve the participant information using useSearchParams().

When the user clicks the "Donate 0.50€" button, the handleCheckout function is called, passing both the price ID and the participant’s info to the backend.

Backend:

The backend receives the price_id and participant information in the request.

The backend creates a Stripe checkout session, passing the participant information as metadata in the session creation.

The backend also generates a success URL, including the session ID and participant info as query parameters.

Stripe Checkout:

Stripe handles the payment, and upon success, the user is redirected back to your backend's /success route with the session ID and participant info.

Handle Success:

The backend uses the session ID and participant info (either from query params or session metadata) to find or create the participant in the database.

A new transaction is created for the participant based on the payment amount, and the transaction is linked to the participant.

The user is shown a success message.

Things to Verify:
Passing Participant Info to handleCheckout:

You are correctly passing the participantInfo to the handleCheckout function from the /checkout page. This info should then be sent to the backend correctly via the POST request.

Metadata in Stripe Checkout Session:

You are including the participant’s name, surname, and email in the metadata of the Stripe session. This will be useful for referencing the participant in the backend after the payment.

Potential issue: In your createCheckoutSession function, you are trying to use participantInfo in the session creation code, but participantInfo might not be available directly in that function. You should ensure that participantInfo is correctly passed as an argument to createCheckoutSession when it is called.

javascript
Αντιγραφή
Επεξεργασία
const createCheckoutSession = async (price_id, participantInfo) => {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: price_id,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${BACKEND_URL}/success?success=true&session_id={CHECKOUT_SESSION_ID}&name=${participantInfo.name}&surname=${participantInfo.surname}&email=${participantInfo.email}`,
    cancel_url: `${FRONTEND_URL}/cancel?canceled=true`,
    metadata: {
      name: participantInfo.name,
      surname: participantInfo.surname,
      email: participantInfo.email
    }
  });
};
When calling this function from the frontend, ensure that you're passing participantInfo like so:

javascript
Αντιγραφή
Επεξεργασία
const handleCheckout = async (price_id, participantInfo) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/stripe/checkout/${price_id}`, { participantInfo });
    const { id } = response.data;
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: id });
  } catch (error) {
    console.log(error);
  }
};
Query Parameters vs Metadata:

You are passing participant info both as URL parameters (name, surname, email) and as metadata in the Stripe session. This is fine, but you should decide which one you prefer to use for processing after the success. Query parameters are simple, but metadata is more secure because it's associated directly with the Stripe session.

Handling Success:

In the handleSuccess function, you're retrieving the participant information from query parameters (req.query.name, req.query.email, etc.). You also could retrieve it from the Stripe session metadata, which is a more reliable source if you're handling the info at the session creation step.

Here's how you could retrieve it from the session metadata (rather than query params):

javascript
Αντιγραφή
Επεξεργασία
const handleSuccess = async (req, res) => {
  try {
    const sessionId = req.query.session_id;
    if (!sessionId) {
      return res.status(400).send('Missing session ID.');
    }

    const session = await stripeService.retrieveSession(sessionId);
    const { name, surname, email } = session.metadata;  // From metadata, not query params

    const amountTotal = session.amount_total / 100; // Stripe returns cents

    console.log(`Payment success for: ${email}, amount: ${amountTotal}`);

    let participant = await participantDAO.findParticipantByEmail(email);

    if (!participant) {
      console.log('Participant not found, creating new one...');
      participant = await participantDAO.createParticipant({ email: email, name: name, surname: surname });
    }

    const newTransaction = await transactionDAO.createTransaction({
      amount: amountTotal,
      processed: true,
      participant: participant._id
    });

    await participantDAO.addTransactionToParticipant(participant._id, newTransaction._id);

    return res.send('Success! Your donation was recorded. Thank you!');
  } catch (error) {
    console.error('Error processing success route:', error.message);
    return res.status(500).send('Something went wrong.');
  }
};
Summary:
Ensure that participantInfo is correctly passed from the frontend to the backend when creating the Stripe session.

Handle both query parameters and metadata carefully. The metadata can be a more reliable source of participant info.

Consider using metadata to retrieve participant info on success, rather than passing it via query parameters.

With these clarifications and corrections, your flow should work as expected! Let me know if you have further questions or if something doesn't seem to work.

# new payment and new transaction

```
will thsi work now? im gona use real money again

front App.jsx
        <Route path="/cancel" element={
          <>
            <Home 
              message={message}
              setMessage={setMessage}
            />
          </>
        } />

        <Route path="/success" element={
          <>
            <Home 
              message={message}
              setMessage={setMessage}
            />
          </>
        } /> 

Home.jsx
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const Home = ({ message, setMessage }) => {

  const [searchParams] = useSearchParams()
  useEffect(() => {
    const canceled = searchParams.get('canceled'); 
    const success = searchParams.get('success')

    if (success === 'true'){
      setMessage(`Payment successful! thank you! :)
                  you will soon receive an email with the details`)
    }

    if (canceled === 'true') {
      setMessage('Payment canceled! :(');
      setTimeout(() => {
        setMessage('');
      }, 7000); 
    }

  }, [searchParams, setMessage])

ParticipantInfoForm.jsx
        <Form onSubmit={handleSubmitParticipant}>
[...}
  const handleSubmitParticipant = async (event) => {
    const name = event.target.name.value
    const surname = event.target.surname.value
    const email = event.target.email.value

    if (!email) {
      alert('please enter your email')
    }

    setNewParticipant({
      name: name,
      surname: surname,
      email: email
    })

    // Create a query string from the newParticipant object
    const params = new URLSearchParams({
      name: name,
      surname: surname,
      email: email,
    }).toString()

    navigate(`/checkout?${params}`)
  }

Checkout.jsx
        {/* Card 3 */}
        <div className="col-12 col-sm-4 mb-4">
          <div className="card border border-white p-3 h-100">
            <img src={threeCoins} className="card-img-top" alt="Donate 0.52€" />
            <div className="card-body text-center">
              <h5 className="card-title">Donate 0.52€</h5>
              <p className="card-text">Wow, you're a hero! 💪</p>
              <button className="btn btn-warning" onClick={() => handleCheckout(PRICE_ID_052)}>Donate 0.52€</button>
            </div>
          </div>
        </div>
      </div>
    </div>

[...}
  const handleCheckout = async (price_id) => {
    const participantInfo = { 
      name: searchParams.get('name'),
      surname: searchParams.get('surname'),  
      email: searchParams.get('email'),
    };
    console.log("participant info>>>", participantInfo);
    console.log(">>> button clicked, price_id =", price_id)

    try {
      // added participant info to be sent to back via url params
      const response = await axios.post(`${BACKEND_URL}/api/stripe/checkout/${price_id}`, { participantInfo })

      const { id } = response.data
  
      const stripe = await stripePromise
      await stripe.redirectToCheckout({ sessionId: id })
    } catch (error) {
      console.log(error)
    }
  }

stripe.routes.js
router.post('/checkout/:price_id', stripeController.createCheckoutSession);
router.get('/success', stripeController.handleSuccess);
router.get('/cancel', stripeController.handleCancel);

stripe controller.js
const createCheckoutSession = async (req, res) => {
  const price_id = req.params.price_id;
  // added to catch participant url params
  const participantInfo = req.body.participantInfo;


  try {
    // added to catch participant url params
    const session = await stripeService.createCheckoutSession(price_id, participantInfo);
    res.json(session);
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    res.status(500).json({ error: error.message });
  }
};

stripeService.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const express = require('express');

const QUANTITY = 1; // just number not string

const createCheckoutSession = async (price_id, participantInfo = {}) => {
  const BACKEND_URL = process.env.YOUR_DOMAIN || 'http://localhost:3000';
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://http://localhost:5173'

  // added to get the participant info from front to be able to create a new transaction
  const metadata = {
    name: participantInfo.name || '',
    surname: participantInfo.surname || '',
    email: participantInfo.email
  }
  console.log('Creating checkout session with metadata:', metadata);

  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: price_id,
        quantity: QUANTITY,
      },
    ],
    mode: 'payment',

    // success_url: `${BACKEND_URL}/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
    success_url: `${BACKEND_URL}/api/stripe/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FRONTEND_URL}/cancel?canceled=true`,
    metadata: metadata

  });
};

const retrieveSession = async (sessionId) => {
  return await stripe.checkout.sessions.retrieve(sessionId);
};

module.exports = {
  createCheckoutSession,
  retrieveSession
};

stripe.controller.js
const handleSuccess = async (req, res) => {
  try {
    // συλλέγω διάφορα δεδομένα του χρήστη απο το url του success
    const sessionId = req.query.session_id;
    if (!sessionId) {
      return res.status(400).send('Missing session ID.');
    }

    // δεν είμαι σιγουρος τι κανει. αλλα μάλλον κάνει await το response
    const session = await stripeService.retrieveSession(sessionId);

    const name = session.metadata.name
    const surname = session.metadata.surname
    const email  = session.metadata.email 

    // αυτα τα δυο είναι που είναι υπχρεωτικα
    if (!email) {
      return res.status(400).send('Missing session ID.');
    }

    // κάνω τα ευρώ σέντς
    const amountTotal = session.amount_total / 100; // Stripe returns cents

    console.log(`Payment success for: ${email}, amount: ${amountTotal}`);

    // ψαχνω τον participant απο το ημαιλ του για να τον ανανεώσω αν υπάρχει ή ν α τον δημιουργήσω
    let participant = await participantDAO.findParticipantByEmail(email);

    if (!participant) {
      console.log('Participant not found, creating new one...');
      // δημιουργία νεου participant
      await participantDAO.createParticipant({ email: email, name: name, surname: surname });
    }

    // δημιουργία transaction
    const newTransaction = await transactionDAO.createTransaction({
      amount: amountTotal,
      processed: true,
      participant: participant._id
    });
    console.log("new transaction>>>", newTransaction);
    

    return res.send('Success! Your donation was recorded. Thank you!');
  } catch (error) {
    console.error('Error processing success route:', error.message);
    return res.status(500).send('Something went wrong.');
  }
};
```
will this work? will this create me a new transaction?


```
lets see it again

i have this in  transactionController.js
this checks if transactionId is ok, finds the transaction by id. if it doesnt exists -> error, else updates it.

exports.toggleProcessed = async (req,res) => {
  const transactionId = req.params.id
  if (!transactionId){
    return res.status(400).json({
      status: false,
      error: 'transaction ID is required OR not found'
    })
  }

  try {
    const transaction = await transactionDAO.findTransactionById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        status: false,
        error: 'Transaction not found',
      });
    }

    const updatedData = {
      processed: !transaction.processed
    }

    const updatedTransaction = await transactionDAO.updateTransactionById(transactionId, updatedData)
    res.json({
      status: true,
      data: updatedTransaction,
    });

  } catch (error) {
    res.status(500).json({
      status:false,
      error: error.message
    })
  }
}

after that and inside this function an email functionality should be called TODO
in app.js added
const emailRoutes = require('./routes/email.routes')

app.use('/api/email', emailRoutes)

created routes/email.routes.js which calles for controller passing transaction id

const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email.controller');

router.post('/email/:transactionId', emailController.sendThnxEmail);

module.exports = router;

created email.controller.js
const emailDAO = require('../daos/email.dao')
const nodemailer = require("nodemailer");
const transactionDAO = require('../daos/transaction.dao')

exports.sendThnxEmail = async (req,res) => {
  try {

    const transactionId = req.params.id
    const transaction = await transactionDAO.findTransactionById(transactionId)
    const email= transaction.email

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Your Donation",
      text: `Dear ${name},\n\nThank you for your generous donation! We greatly appreciate your support.\n\nBest regards,\nThe Team`,
    };

    const emailRecipt = await transporter.sendMail(mailOptions);
    res.status(200).json({ status: true, data: emailRecipt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: 'Thnx email Internal server error' });
  }
}

this is the transactionDAO.findTransactionById
// Find transaction by ID
const findTransactionById = async (transactionId) => {
  return await Transaction.findById(transactionId).populate('participant');
};

so iguess my transactionController.js becomes
BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'

exports.toggleProcessed = async (req,res) => {
  const transactionId = req.params.id
  if (!transactionId){
    return res.status(400).json({
      status: false,
      error: 'transaction ID is required OR not found'
    })
  }

  try {
    const transaction = await transactionDAO.findTransactionById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        status: false,
        error: 'Transaction not found',
      });
    }

    const updatedData = {
      processed: !transaction.processed
    }

    const updatedTransaction = await transactionDAO.updateTransactionById(transactionId, updatedData)
    res.json({
      status: true,
      data: updatedTransaction,
    });

    try {
      const emailRecipt = await axios.post(`${BACKEND_URL}/api/email/${transactionId}`)
      res.status(200).json({ status: true, data: emailRecipt})
    } catch (error) {
      console.error(error)
      res.status(500).json({ status:false, error: 'thnx email internal server error'})
    }


  } catch (error) {
    res.status(500).json({
      status:false,
      error: error.message
    })
  }
} 
```