const {
  createError,
  getSiteUrl,
  getStripeSecret,
  parseOrder,
  requireMethod,
  sendError,
  validateOrigin
} = require('../lib/payment');

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  try {
    validateOrigin(req);
    const order = parseOrder(req.body);
    const siteUrl = getSiteUrl();
    const params = new URLSearchParams();
    params.set('mode', 'payment');
    params.set('success_url', `${siteUrl}/checkout.html?payment=stripe-return&session_id={CHECKOUT_SESSION_ID}`);
    params.set('cancel_url', `${siteUrl}/checkout.html?payment=cancelled`);
    params.set('billing_address_collection', 'required');
    params.set('phone_number_collection[enabled]', 'true');
    const stripeSecret = getStripeSecret();
    ['FR', 'BE', 'CH', 'LU', 'CA'].forEach((country, index) => {
      params.set(`shipping_address_collection[allowed_countries][${index}]`, country);
    });

    order.items.forEach((item, index) => {
      params.set(`line_items[${index}][price_data][currency]`, 'eur');
      params.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount));
      params.set(`line_items[${index}][price_data][product_data][name]`, `${item.name} — Taille ${item.size}`);
      params.set(`line_items[${index}][quantity]`, String(item.quantity));
    });

    if (order.shipping > 0) {
      const index = order.items.length;
      params.set(`line_items[${index}][price_data][currency]`, 'eur');
      params.set(`line_items[${index}][price_data][unit_amount]`, String(order.shipping));
      params.set(`line_items[${index}][price_data][product_data][name]`, order.delivery === 'relais' ? 'Livraison en point relais' : 'Livraison à domicile');
      params.set(`line_items[${index}][quantity]`, '1');
    }

    let response;
    try {
      response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeSecret}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });
    } catch {
      throw createError(502, 'Stripe ne répond pas. Réessayez dans quelques instants.');
    }

    let data;
    try {
      data = await response.json();
    } catch {
      throw createError(502, 'Stripe a renvoyé une réponse invalide.');
    }
    if (!response.ok || !data.url) {
      throw createError(502, 'Stripe n’a pas pu créer la session de paiement.');
    }
    return res.status(200).json({ url: data.url });
  } catch (error) {
    return sendError(res, error, 'Impossible de démarrer le paiement Stripe.');
  }
};
