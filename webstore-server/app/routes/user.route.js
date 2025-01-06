module.exports = (app) => {
    const users = require('../controllers/user.controller')
    const router = require('express').Router()

    router.post('/login', users.login)
    router.post('/logout', users.logout)
    router.post('/register', users.register)
    router.get('/user/profile', users.getUser)
    router.get('/users', users.getAllUsers)
    router.post('/user/update/profile', users.updateUser)

    app.use('/api', router)
}