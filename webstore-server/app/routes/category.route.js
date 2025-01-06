module.exports = (app) => {
    const categories = require('../controllers/category.controller')
    const router = require('express').Router()

    router.get('/', categories.findAllCategory)

    app.use('/api/categories', router)
}