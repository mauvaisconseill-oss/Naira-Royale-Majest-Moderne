const PRODUCTS = {
  1: { name: 'Robe Halter Bleu Océan', price: 18900, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  2: { name: 'Robe Halter Ambre Doré', price: 18900, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  3: { name: 'Robe Halter Fuchsia Sunset', price: 19900, sizes: ['S', 'M', 'L', 'XL'] },
  4: { name: 'Robe Halter Bleu Royal', price: 19500, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  5: { name: 'Robe Halter Terracotta', price: 18900, sizes: ['S', 'M', 'L', 'XL'] },
  6: { name: 'Robe Dos Nu Émeraude', price: 19900, sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  7: { name: 'Robe Halter Violet Rose', price: 19500, sizes: ['S', 'M', 'L', 'XL'] },
  8: { name: 'Robe Dos Nu Noir Cuivré', price: 20900, sizes: ['S', 'M', 'L', 'XL', 'XXL'] }
};

function createError(status, publicMessage) {
  const error = new Error(publicMessage);
  error.status = status;
  return error;
}

function sendError(res, error, fallbackMessage) {
  const status = Number.isInteger(error.status) ? error.status : 502;
  const message = error.status ? error.message : fallbackMessage;
  res.status(status).json({ error: message });
}

function requireMethod(req, res, method) {
  if (req.method === method) return true;
  res.setHeader('Allow', method);
  res.status(405).json({ error: 'Méthode non autorisée.' });
  return false;
}

function getSiteUrl() {
  const configuredUrl = process.env.PUBLIC_SITE_URL;
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const siteUrl = configuredUrl || (vercelHost ? `https://${vercelHost}` : '');
  if (!siteUrl) throw createError(503, 'Le domaine du site n’est pas configuré.');

  let parsedUrl;
  try {
    parsedUrl = new URL(siteUrl);
  } catch {
    throw createError(503, 'Le domaine du site est mal configuré.');
  }
  if (parsedUrl.protocol !== 'https:' || parsedUrl.username || parsedUrl.password) {
    throw createError(503, 'Le domaine du site doit être une adresse HTTPS valide.');
  }
  return parsedUrl.origin;
}

function validateOrigin(req) {
  const origin = req.headers.origin;
  if (origin && origin !== getSiteUrl()) {
    throw createError(403, 'Origine de requête non autorisée.');
  }
}

function parseOrder(body) {
  let data = body;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      throw createError(400, 'La commande envoyée est invalide.');
    }
  }

  if (!data || !Array.isArray(data.items) || data.items.length === 0 || data.items.length > 20) {
    throw createError(400, 'Le panier est vide ou invalide.');
  }

  const delivery = data.delivery;
  if (delivery !== 'domicile' && delivery !== 'relais') {
    throw createError(400, 'Choisissez un mode de livraison.');
  }

  const items = data.items.map(item => {
    if (!item || typeof item !== 'object') {
      throw createError(400, 'Un article du panier est invalide.');
    }
    const id = Number(item.id);
    const product = PRODUCTS[id];
    const size = typeof item.size === 'string' ? item.size : '';
    const quantity = Number(item.quantity);

    if (!product || !product.sizes.includes(size) || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      throw createError(400, 'Un article du panier est invalide.');
    }

    return {
      id,
      name: product.name,
      size,
      quantity,
      unitAmount: product.price
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);
  const shipping = subtotal >= 15000 ? 0 : delivery === 'relais' ? 390 : 590;
  return { items, delivery, subtotal, shipping, total: subtotal + shipping };
}

function getStripeSecret() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw createError(503, 'Stripe n’est pas encore configuré.');
  return secret;
}

function getPayPalConfig() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE;
  if (!clientId || !clientSecret) throw createError(503, 'PayPal n’est pas encore configuré.');
  if (mode !== 'sandbox' && mode !== 'live') {
    throw createError(503, 'Le mode PayPal doit être configuré sur sandbox ou live.');
  }
  return {
    clientId,
    clientSecret,
    baseUrl: mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com'
  };
}

async function readJsonResponse(response, errorMessage) {
  let data;
  try {
    data = await response.json();
  } catch {
    throw createError(502, errorMessage);
  }
  if (!response.ok) throw createError(502, errorMessage);
  return data;
}

async function getPayPalAccessToken() {
  const config = getPayPalConfig();
  let response;
  try {
    response = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });
  } catch {
    throw createError(502, 'PayPal ne répond pas. Réessayez dans quelques instants.');
  }

  const data = await readJsonResponse(response, 'Impossible de se connecter à PayPal.');
  if (!data.access_token) throw createError(502, 'PayPal n’a pas fourni de jeton de paiement.');
  return { ...config, accessToken: data.access_token };
}

async function paypalRequest(config, path, body, requestId) {
  let response;
  try {
    response = await fetch(`${config.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
        ...(requestId ? { 'PayPal-Request-Id': requestId } : {})
      },
      body: JSON.stringify(body)
    });
  } catch {
    throw createError(502, 'PayPal ne répond pas. Réessayez dans quelques instants.');
  }
  return readJsonResponse(response, 'PayPal n’a pas pu traiter la demande.');
}

module.exports = {
  createError,
  getPayPalAccessToken,
  getSiteUrl,
  getStripeSecret,
  parseOrder,
  paypalRequest,
  requireMethod,
  sendError,
  validateOrigin
};
