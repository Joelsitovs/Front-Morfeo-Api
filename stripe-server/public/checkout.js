// This is your test secret API key.
const stripe = Stripe("pk_test_51QRc80JWHbvf2wryew1VpDCWtsneGa7W0zzrdZaVnEJsQrve7dQUPlYhw64e8hP8lNSPgTwnTID0Rwfm3TYR9W8000E336CQjY");

initialize();

// Create a Checkout Session
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}