
import express from 'express'
import Stripe from 'stripe'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config();

// import { fileURLToPath } from 'url'

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
const port = 3000

// const YOUR_DOMAIN = 'http://localhost:3000';
const YOUR_DOMAIN = 'https://stripebasic.onrender.com'


// const PRICE_ID_050 = 'price_1RGPe4EsaPshQGwV6vXbMrhE'
// const PRICE_ID_051 = 'price_1RGkyMEsaPshQGwV7rsnw60y'
const QUANTITY = '1'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
// app.get('/', (req, res) => {
//   // res.sendFile(path.resolve('dist/index.html'))
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'))
// })

app.post('/checkout/:price_id', async (req, res) => {
  const price_id = req.params.price_id

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price_id,
          quantity: `${QUANTITY}`,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success?success=true`,
      cancel_url: `${YOUR_DOMAIN}/cancel?canceled=true`,
    });

    return res.json(session)
  } catch (err) {
    console.error('Error creating checkout session:', err.message)
    res.status(500).json({ error: err.message })   
  }
})

// app.post('/checkout', async (req, res) => {
//   try {
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           // Provide the exact Price ID (for example, price_1234) of the product you want to sell
//           price: `${PRICE_ID_050}`,
//           quantity: `${QUANTITY}`,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${YOUR_DOMAIN}/success?success=true`,
//       cancel_url: `${YOUR_DOMAIN}/cancel?canceled=true`,
//     });

//     return res.json(session)
//   } catch (err) {
//     console.log(err);    
//   }
// })

app.get('/success', (req, res) => {
  return res.send('success!')
})

app.get('/cancel', (req, res) => {
  return res.send('canceled! :(')
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/`)
})