const db = require('../models')

const Checkout = db.checkouts
const mongoose = require('mongoose');

exports.getCheckoutByUserId = async (req, res) => {
  try {
    const userId = req.session.user_id;

    if (!userId) {
      return res.status(400).send({
        message: "User is not authenticated."
      });
    }

    const checkout = await Checkout.find({ user_id: userId })
      .populate("products.product_id", "name price imageUrl");
    if (!checkout) {
      return res.status(404).send({
        message: "Checkout not found for this user."
      });
    }

    res.status(200).send(checkout);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving the checkout."
    });
  }
};


exports.createCheckout = async (req, res) => {
  try {
    const userId = req.session.user_id;

    if (!userId) {
      return res.status(401).json({ message: "User tidak terautentikasi." });
    }

    const { products, total_pembayaran, metode_pembayaran, metode_pengiriman, biaya_pengiriman } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Produk harus diisi dan valid." });
    }

    if (!total_pembayaran) {
      return res.status(400).json({ message: "Total pembayaran harus diisi." });
    }

    if (!metode_pembayaran) {
      return res.status(400).json({ message: "Metode pembayaran harus diisi." });
    }

    const validMethods = ["transfer", "cod", "gopay", "ovo", "dana", "credit_card"];
    if (!validMethods.includes(metode_pembayaran)) {
      return res.status(400).json({ message: "Metode pembayaran tidak valid." });
    }

    for (const product of products) {
      if (!product.product_id || !product.quantity || product.quantity < 1) {
        return res.status(400).json({ message: "Produk harus memiliki id dan kuantitas minimal 1." });
      }
    }

    const checkout = new Checkout({
      user_id: mongoose.Types.ObjectId(userId),
      products: products.map(p => ({
        product_id: mongoose.Types.ObjectId(p.product_id),
        quantity: p.quantity,
      })),
      total_pembayaran,
      metode_pengiriman,
      biaya_pengiriman,
      metode_pembayaran,
    });

    const result = await checkout.save();

    return res.status(201).json({
      message: "Checkout berhasil dibuat.",
      data: result,
    });
  } catch (error) {
    console.error("Error saat membuat checkout:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};