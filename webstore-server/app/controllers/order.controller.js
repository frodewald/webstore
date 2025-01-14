const db = require('../models')
const mongoose = require('mongoose');

const Order = db.orders

exports.findOrder = (req, res) => {
    const userId = req.session.user_id
    const id = mongoose.Types.ObjectId(userId);
    Order.aggregate([
    {
        $match: {
            user_id: id
        }
    }, 
    {
        $unwind: "$cart_items"
    },
    {
        $lookup: {
            from: "products",
            localField: "cart_items.code",
            foreignField: "code",
            as: "products"
        }
    },
    {
        $unwind: "$products" 
    },
    {
        $group: {
            _id: "$user_id",
            cart_items: { $push: "$cart_items" },
            products: { $push: "$products" }
        }
    }])
    .then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(409).send({
            message: err.message || "Some error while retrieving products."
        })
    })
}

exports.addToCart = (req, res) => {
    const userId = req.session.user_id
    const id = mongoose.Types.ObjectId(userId);
    const products = req.body.product;

    products.forEach(async (product) => {
        const { code, quantity } = product;
        const isProductInCart = async (code) => {
            const order = await Order.findOne({ user_id: id, "cart_items.code": code })
            return !!order;
        }

        try {
            if (await isProductInCart(code)) {
                await Order.updateOne(
                    { user_id: id, "cart_items.code": code },
                    {
                        $set: { "cart_items.$.quantity": quantity }
                    }
                );
                res.send({ message: "Quantity produk diperbarui di keranjang." });
            } else {
                const cartItem = { code, quantity };
                await Order.updateOne(
                    { user_id: id },
                    {
                        $addToSet: {
                            cart_items: cartItem
                        }
                    }
                );
                res.send({ message: "Produk baru ditambahkan ke keranjang." });
            }
        } catch (error) {
            res.status(409).send({
                message: error.message || "Terjadi kesalahan saat menambahkan produk ke keranjang."
            });
        }
    });
}

exports.removeFromCart = (req, res) => {
    const userId = req.session.user_id
    const id = mongoose.Types.ObjectId(userId);
    const productCode = String(req.params.product)

    Order.updateOne({
        user_id: id
    }, {
        $pull: {
            cart_items: { code: productCode }
        }
    })
    .then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(409).send({
            message: err.message
        })
    })
}

exports.removeAllFromCart = (req, res) => {
    const userId = req.session.user_id;
    const id = mongoose.Types.ObjectId(userId);

    Order.updateOne(
        { user_id: id },
        { $set: { cart_items: [] } }
    )
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        res.status(409).send({
            message: err.message
        });
    });
};
