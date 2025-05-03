import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios' 

import oneCoin from '../assets/handsMoneyCrop.jpg'
import twoCoins from '../assets/two coins.jpg'
import threeCoins from '../assets/three_coins.svg.png'

// added to stripe boilerplate to extract new participant info from url
import { useSearchParams } from 'react-router-dom'

const PUBLIC_STRIPE_KEY = 'pk_live_51REuM3EsaPshQGwVZxSzQyBw2SJj4CnnSxuf6yWokbg5dRVAM0WpDFrIHnlF0sqQgykl4WVxCw5gA6bhDHWeyrFE00muoS3dkU'
const BACKEND_URL = 'http://localhost:3001';
const PRICE_ID_050 = 'price_1RGPe4EsaPshQGwV6vXbMrhE'
const PRICE_ID_051 = 'price_1RGkyMEsaPshQGwV7rsnw60y'
const PRICE_ID_052 = 'price_1RGlWzEsaPshQGwVGwpZ9TSb'

const stripePromise = loadStripe(`${PUBLIC_STRIPE_KEY}`)

const Checkout = () => {
  // added to stripe boilerplate to extract new participant info from url
  const [searchParams] = useSearchParams()

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

    // const handleCheckout = async (price_id) => {
    //   try {
    //     const response = await axios.post(`${BACKEND_URL}/api/stripe/checkout/${price_id}`)
    //     const { id } = response.data
    
    //     const stripe = await stripePromise
    //     await stripe.redirectToCheckout({ sessionId: id })
    //   } catch (error) {
    //     console.log(error)
    //   }
    // }

  return (
    <div className="container mt-5" style={{ backgroundColor: '#242424', color: 'white' }}>
      <h1 className="mb-4 text-center">Support this demo</h1>

      <div className="row justify-content-center">
        {/* Card 1 */}
        <div className="col-12 col-sm-4 mb-4">
          <div className="card border border-white p-3 h-100">
            <img src={oneCoin} className="card-img-top" alt="Donate 0.50€" />
            <div className="card-body text-center">
              <h5 className="card-title">Donate 0.50€</h5>
              <p className="card-text">A small but mighty donation 🙏</p>
              <button className="btn btn-primary" onClick={() => handleCheckout(PRICE_ID_050)}>Donate 0.50€</button>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-12 col-sm-4 mb-4">
          <div className="card border border-white p-3 h-100">
            <img src={twoCoins} className="card-img-top" alt="Donate 0.51€" />
            <div className="card-body text-center">
              <h5 className="card-title">Donate 0.51€</h5>
              <p className="card-text">Slightly more generous 😄</p>
              <button className="btn btn-success" onClick={() => handleCheckout(PRICE_ID_051)}>Donate 0.51€</button>
            </div>
          </div>
        </div>

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
  )
}

export default Checkout