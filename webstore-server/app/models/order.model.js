module.exports = mongoose => {
    const schema = mongoose.Schema({
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        cart_items: [
            {
                code: { type: String, required: true },
                quantity: { type: Number, required: true }
            }
        ]
    })

    schema.method("toJSON", function() {
        const { __v, _id, ...object} = this.toObject()
        object.id = _id
        return object
    })

    const Order = mongoose.model("orders", schema)
    return Order
}