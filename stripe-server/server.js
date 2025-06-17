// This is your test secret API key.
const stripe = require('stripe')(
  'sk_test_51QRc80JWHbvf2wry3mRrsh7TU5xWtV8XIk4xZiJvj1aGXyo4KKwDXCa7gfnwKMAvj0X5H817Fb74lu84PxQcorsq00kMd5K9kv'
);
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(express.static('public'));
app.use(
  cors({
    origin: 'https://morfeo3d.es',
    credentials: true
  })
);
app.use(bodyParser.json());
app.options('*', cors());
const endpointSecret = 'whsec_7c06b1c8f85b1cd30fc5909b38f17cb73d1f938a34b2cfa2b658e57ede7c5d50';
const YOUR_DOMAIN = 'https://morfeo3d.es';
app.post('/stripe/checkout', async (req, res) => {
  const items = req.body.items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [item.image]
      },
      unit_amount: Math.round(item.price * 100)
    },
    quantity: item.quantity
  }));

  const session = await stripe.checkout.sessions.create({
    line_items: items,
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/canceled`,
    payment_intent_data: {
      metadata: {
        items: JSON.stringify(req.body.items)
      }
    }
  });

  res.json({ sessionId: session.id });
});

app.get('/stripe/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Extraer metadata.items del payment_intent
    let metadataItems = [];
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
      metadataItems = JSON.parse(paymentIntent.metadata.items || '[]');
    } catch (e) {
      console.error('Error parsing metadata items:', e.message);
    }

    try {
      await axios.post('https://api.morfeo3d.es/api/orders', {
        session_id: session.id,
        customer_email: session.customer_details.email || 'no-email@stripe.com',
        amount_total: session.amount_total / 100,
        currency: session.currency,
        items: metadataItems,
      });
    } catch (err) {
      console.error('Error guardando en Laravel:', err.message);
    }
  }

  res.json({ received: true });
});


app.listen(4242, () => console.log('Running on port 4242'));
