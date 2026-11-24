const {
  getPayPalAccessToken,
  getSiteUrl,
  parseOrder,
  paypalRequest,
  requireMethod,
  sendError,
  validateOrigin
} = require('../lib/payment');

function amount(value) {
  return (value / 100).toFixed(2);
}

module.exports = async function handler(req, res) {
  if (!requireMethod(req, res, 'POST')) return;

  try {
    validateOrigin(req);
    const order = parseOrder(req.body);
    const siteUrl = getSiteUrl();
    const config = await getPayPalAccessToken();
    const data = await paypalRequest(config, '/v2/checkout/orders', {
      intent: 'CAPTURE',
      purchase_units: [{
        description: 'Commande Naira Royale',
        amount: {
          currency_code: 'EUR',
          value: amount(order.total),
          breakdown: {
            item_total: { currency_code: 'EUR', value: amount(order.subtotal) },
            shipping: { currency_code: 'EUR', value: amount(order.shipping) }
          }
        },
        items: order.items.map(item => ({
          name: `${item.name} — Taille ${item.size}`,
          sku: `${item.id}-${item.size}`,
          quantity: String(item.quantity),
          category: 'PHYSICAL_GOODS',
          unit_amount: { currency_code: 'EUR', value: amount(item.unitAmount) }
        }))
      }],
      application_context: {
        brand_name: 'Naira Royale',
        locale: 'fr-FR',
        shipping_preference: 'GET_FROM_FILE',
        user_action: 'PAY_NOW',
        return_url: `${siteUrl}/checkout.html?payment=paypal-return`,
        cancel_url: `${siteUrl}/checkout.html?payment=cancelled`
      }
    }, `naira-create-${Date.now()}`);

    const approvalLink = Array.isArray(data.links) ? data.links.find(link => link.rel === 'approve') : null;
    if (!data.id || !approvalLink || !approvalLink.href) {
      throw new Error('PayPal n’a pas fourni de lien d’approbation.');
    }
    return res.status(200).json({ orderId: data.id, approvalUrl: approvalLink.href });
  } catch (error) {
    return sendError(res, error, 'Impossible de démarrer le paiement PayPal.');
  }
};
