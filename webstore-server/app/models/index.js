const dbConfig = require('../../config/db.config')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise

const db = {}
db.mongoose = mongoose
db.url = dbConfig.url
db.products = require('./product.model')(mongoose)
db.orders = require('./order.model')(mongoose)
db.categories = require('./category.model')(mongoose)
// ternyata cara diatas itu berfungsi agar mengisi parameter dari module exportsnya dengan data moongose yang sudah kita import disini
db.users = require('./user.model')(mongoose)
module.exports = db