const db = require('../models')

const Category = db.categories

exports.findAllCategory = (req, res) => {
    Category.find()
    .then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(409).send({
            message: err.message
        })
    })
}