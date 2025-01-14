module.exports = mongoose => {
    const schema = mongoose.Schema(
      {
        name: {
          type: String,
          required: true,  // Nama kategori harus diisi
          unique: true     // Nama kategori harus unik
        },
        description: {
          type: String,
          default: ""      // Deskripsi kategori opsional, default adalah string kosong
        },
        slug: {
          type: String,
          required: true,  // Slug untuk URL
          unique: true,    // Slug harus unik
          lowercase: true  // Slug selalu dalam huruf kecil
        },
        iconUrl: {
          type: String,
          default: '/img/categories/placeholder.svg'
        },
        parentCategory: {
          type: mongoose.Schema.Types.ObjectId, // Referensi ke kategori lain (kategori induk)
          ref: "Category",                      // Referensi ke koleksi 'Category'
          default: null                         // Bisa null jika tidak ada kategori induk
        }
      },
      {
        timestamps: true,  // Buat otomatis createdAt dan updatedAt
      }
    );
  
    // Method untuk memformat output JSON
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;  // Ganti _id dengan id untuk kemudahan akses
      return object;
    });
  
    const Category = mongoose.model("Category", schema);
    return Category;
  };
  