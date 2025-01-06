const { type } = require("express/lib/response")

module.exports = mongoose => {
    const schema = mongoose.Schema({
        username: {
            type: String,
            required: [true, 'Username is required'],
        },
        email: {
            type: String,
            required: [true, 'Username is required'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        alamat: {
            type: String,
        },
        telepon: {
            type: String
        },
        role: {
            type: String
        },
        wishlist: {
            type: String
        }
    })

    schema.method("toJSON", function() {
        const { __v, _id, ...object} = this.toObject()
        object.id = _id
        return object
    })

    const User = mongoose.model("users", schema)
    return User
}