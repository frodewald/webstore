module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            code: {
                type: String,
                unique: true
            },
            name: String,
            price: Number,
            description: String,
            imageUrl: String,
            category_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category'  // Nama koleksi kategori yang direferensikan
            },
            stock: Number,
            weight: Number,
            dimensions: String,
            averageRating: {
                type: Number, // Ini akan menyimpan angka desimal
                default: 0,
                min: 0,
                max: 5 // Misalnya, batas rating antara 0 hingga 5
            },
            isFeatured: { type: Boolean, default: false },
            sale: { type: Number, default: 0 }
        },
        {
            timestamps: true,  // Buat otomatis createdAt dan updatedAt
        }
    )

    schema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id
        return object
    })

    const Product = mongoose.model("Product", schema)
    return Product
}