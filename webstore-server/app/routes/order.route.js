module.exports = (app) => {
    const orders = require('../controllers/order.controller')
    const router = require('express').Router()

    router.get('/user', orders.findOrder)
    router.post('/update/user', orders.addToCart)
    router.delete('/delete/user/product/:product', orders.removeFromCart)
    router.delete('/delete/user/all/product', orders.removeAllFromCart);

    app.use('/api/orders', router)
}