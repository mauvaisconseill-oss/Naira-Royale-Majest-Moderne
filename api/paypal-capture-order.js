const {
  createError,
  getPayPalAccessToken,
  requireMethod,
  sendError,
  validateOrigin
} = require('../lib/payment');

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  try {
    validateOrigin(req);
    const orderId = req.body && req.body.orderId;
    if (typeof orderId !== 'string' || !/^[A-Z0-9-]{8,40}$/.test(orderId)) {
      throw createError(400, 'La référence de paiement PayPal est invalide.');
    }

    const config = await getPayPalAccessToken();
    let orderResponse;
    try {
      orderResponse = await fetch(`${config.baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}`, {
        headers: { Authorization: `Bearer ${config.accessToken}` }
      });
    } catch {
      throw createError(502, 'Impossible de vérifier la commande PayPal.');
    }
    const order = await orderResponse.json();
    if (!orderResponse.ok) throw createError(502, 'Impossible de vérifier la commande PayPal.');

    if (order.status === 'COMPLETED') return res.status(200).json({ paid: true });
    if (order.status !== 'APPROVED') throw createError(409, 'Le paiement PayPal n’a pas été approuvé.');

    let captureResponse;
    try {
      captureResponse = await fetch(`${config.baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
          'PayPal-Request-Id': `naira-capture-${orderId}`
        },
        body: '{}'
      });
    } catch {
      throw createError(502, 'PayPal ne répond pas. Réessayez dans quelques instants.');
    }

    const capture = await captureResponse.json();
    if (!captureResponse.ok || capture.status !== 'COMPLETED') {
      throw createError(502, 'PayPal n’a pas confirmé le paiement.');
    }
    return res.status(200).json({ paid: true });
  } catch (error) {
    return sendError(res, error, 'Impossible de confirmer le paiement PayPal.');
  }
};
