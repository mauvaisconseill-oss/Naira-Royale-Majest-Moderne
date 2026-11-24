const {
  createError,
  getStripeSecret,
  requireMethod,
  sendError,
  validateOrigin
} = require('../lib/payment');

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  try {
    validateOrigin(req);
    const sessionId = req.body && req.body.sessionId;
    if (typeof sessionId !== 'string' || !/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(sessionId)) {
      throw createError(400, 'La référence de paiement Stripe est invalide.');
    }
    const stripeSecret = getStripeSecret();

    let response;
    try {
      response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
        headers: { Authorization: `Bearer ${stripeSecret}` }
      });
    } catch {
      throw createError(502, 'Impossible de vérifier le paiement Stripe.');
    }

    const session = await response.json();
    if (!response.ok || session.mode !== 'payment') {
      throw createError(502, 'Impossible de vérifier le paiement Stripe.');
    }
    return res.status(200).json({ paid: session.payment_status === 'paid' });
  } catch (error) {
    return sendError(res, error, 'Impossible de vérifier le paiement Stripe.');
  }
};
