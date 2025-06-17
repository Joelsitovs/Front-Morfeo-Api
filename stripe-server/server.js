// This is your test secret API key.
const stripe = require('stripe')(
  'sk_test_51QRc80JWHbvf2wry3mRrsh7TU5xWtV8XIk4xZiJvj1aGXyo4KKwDXCa7gfnwKMAvj0X5H817Fb74lu84PxQcorsq00kMd5K9kv'
);
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static('public'));
app.use(
  cors({
    origin: 'https://morfeo3d.es',
    credentials: true,
  })
);
app.use(bodyParser.json());

const YOUR_DOMAIN = 'https://api.morfeo3d.es';
app.post('/stripe/checkout', async (req, res) => {
  const items = req.body.items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    line_items: items,
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/canceled`,
    payment_intent_data: {
      metadata: {
        items: JSON.stringify(req.body.items),
      },
    },
  });

  res.json({ sessionId: session.id });
});

app.get('/stripe/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

app.listen(4242, () => console.log('Running on port 4242'));
