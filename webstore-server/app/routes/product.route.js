module.exports = (app) => {
    const products = require('../controllers/product.controller')
    const router = require('express').Router()
    const upload = require('../middleware/multer');

    router.get('/', products.findAll)
    router.get('/:id', products.findOne)
    router.get('/get/featured', products.featuredProducts)
    router.get('/category/:id', products.getProductsByCategoryId);
    router.get('/get/search', products.getProductsBySearch);
    router.post('/create',upload.single('image'), products.createProduct)
    router.put('/update/:id', upload.single('image'), products.updateProduct)
    router.delete('/delete/:id', products.deleteProduct)

    app.use('/api/products', router)
}