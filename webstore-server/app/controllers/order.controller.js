const db = require('../models')
const mongoose = require('mongoose');

const Order = db.orders

exports.findOrder = (req, res) => {
    const userId = req.session.user_id
    const id = mongoose.Types.ObjectId(userId);
    // menjoint 2 atau lebih collection dalam mongodb
    Order.aggregate([
    {
        // match itu seperti where dalam sql
        $match: {
            user_id: id
        }
    }, 
    {
        $unwind: "$cart_items" // Pecah array menjadi dokumen terpisah
    },
    {
        // fungsi lookup ini buat menggabungkan collection, dan as itu menaruhnya di mana
        $lookup: {
            from: "products",
            localField: "cart_items.code",
            foreignField: "code",
            as: "products"
        }
    },
    {
        $unwind: "$products"  // Pisahkan array product jika hasil lookup adalah array
    },
    {
        $group: {
            _id: "$user_id",
            cart_items: { $push: "$cart_items" }, // Kumpulkan kembali cart_items
            products: { $push: "$products" } // Kumpulkan produk
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
        const { code, quantity } = product; // Mengambil code dan quantity
        const isProductInCart = async (code) => {
            const order = await Order.findOne({ user_id: id, "cart_items.code": code })
            return !!order;
        }

        try {
            // Periksa apakah produk sudah ada di keranjang
            if (await isProductInCart(code)) {
                // Jika produk ada, update quantity
                await Order.updateOne(
                    { user_id: id, "cart_items.code": code }, // Mencari produk di cart_items
                    {
                        $set: { "cart_items.$.quantity": quantity } // Menambah quantity yang ada dengan nilai baru
                    }
                );
                res.send({ message: "Quantity produk diperbarui di keranjang." });
            } else {
                // Jika produk tidak ada, tambahkan produk ke cart_items
                const cartItem = { code, quantity };  // Buat object cartItem baru
                await Order.updateOne(
                    { user_id: id },
                    {
                        $addToSet: {
                            cart_items: cartItem  // Menambahkan produk baru
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