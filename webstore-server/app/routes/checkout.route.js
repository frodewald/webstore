module.exports = (app) => {
  const checkouts = require('../controllers/checkout.controller')
  const router = require('express').Router()

  router.get('/', checkouts.getCheckoutByUserId);
  router.post('/create', checkouts.createCheckout);

  app.use('/api/checkouts', router)
}