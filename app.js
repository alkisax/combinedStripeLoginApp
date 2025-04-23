require('dotenv').config()
const express = require('express')
const cors = require('cors')
const adminRoutes = require('./routes/admin.routes')
const loginRoutes = require('./routes/auth.routes')

// const path = require('path'); // requires explanation. added for rendering front page subpages

const app = express()
app.use(cors())
app.use(express.static('dist')) // να το δοκιμασω
app.use(express.json());

app.use('/api/admin', adminRoutes)
app.use('/api/login', loginRoutes)

// app.get('/*', (req, res, next) => {
//   if (req.path.startsWith('/api')) {
//     return next(); // let the API routes handle it
//   }

//   res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

module.exports = app