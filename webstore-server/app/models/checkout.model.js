module.exports = mongoose => {
  const schema = mongoose.Schema(
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      products: [
        {
          product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      total_pembayaran: {
        type: Number,
        required: true,
      },
      metode_pengiriman: {
        type: String
      },
      biaya_pengiriman: {
        type: Number,
      },
      metode_pembayaran: {
        type: String,
        required: true,
        enum: ["transfer", "cod", "gopay", "ovo", "dana", "credit_card"],
      },
      status_pemesanan: {
        type: String,
        required: true,
        enum: ["pending", "confirmed", "shipped", "delivered", "canceled"],
        default: "pending",
      },
    },
    {
      timestamps: true,
    }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Checkout = mongoose.model("Checkout", schema);
  return Checkout;
};