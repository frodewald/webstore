const db = require('../models')
const Product = db.products
const mongoose = require('mongoose');
const path = require('path')
const fs = require('fs')

exports.findAll = (req, res) => {
    Product.find()
    .then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(409).send({
            message: err.message
        })
    })
}

exports.findOne = (req, res) => {
    Product.findOne({
        code: req.params.id
    })
    .then((result) => {
        res.send(result)
    }).catch((err) => {
        res.status(500).send({
            message: err.message || "Some error while retrieving product"
        })
    })
}

exports.updateProduct = async (req, res) => {
  const codeFromParams = req.params.id;
  const { code, name, categoryId, price, description, stock, weight, dimensions } = req.body;
  const category_id = mongoose.Types.ObjectId(categoryId);
  const image = req.file; // File yang diunggah akan tersedia di req.file

  try {
    // cek apakah code dari update diubah-ubah oleh user, kalo iya kembalikan 404
    if(String(codeFromParams) !== String(code) ) {
      return res.status(403).json({ message: 'Code tidak boleh diubah' });
    }

    // Temukan produk berdasarkan kode
    const product = await Product.findOne({ code: codeFromParams });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Jika ada file yang diunggah, hapus gambar lama (jika ada) dan simpan gambar baru
    if (image) {
      // Hapus gambar lama jika ada
      if (product.imageUrl) {
        const oldImagePath = path.join(__dirname, '../../public', product.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error('Error deleting old image:', err);
          }
        });
      }

      // Simpan gambar baru
      product.imageUrl = `/img/${image.filename}`;
    }

    // Update data produk
    product.name = name;
    product.category_id = category_id;
    product.price = price;
    product.description = description;
    product.stock = stock;
    product.weight = weight;
    product.dimensions = dimensions;

    // Simpan perubahan
    await product.save();

    // Kirim data produk yang telah diperbarui sebagai respons
    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

exports.createProduct = async (req, res) => {
  const { code, name, categoryId, price, description, stock, weight, dimensions } = req.body;
  const category_id = mongoose.Types.ObjectId(categoryId);
  const image = req.file; // File yang diunggah akan tersedia di req.file

  try {
    // Buat object product baru
    const productData = {
      code,
      name,
      category_id,
      price,
      description,
      stock,
      weight,
      dimensions,
      imageUrl: image ? `/img/${image.filename}` : null, // Simpan gambar jika ada
    };

    // Simpan produk ke database
    const resultProduct = await Product.create(productData);

    res.status(201).send({
      message: 'Product Created successfully',
      product: resultProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

exports.deleteProduct = async (req, res) => {
  const productCode = req.params.id

  try {
    const product = await Product.findOne({ code: productCode });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Ekstrak nama file dari imageUrl
    const imageUrl = product.imageUrl; // Contoh: "/img/nama-file.jpg"

    // Hapus produk dari database
    const deleteProductByCode = await Product.deleteOne({ code: productCode });

    // Hapus file gambar dari folder penyimpanan
    const filePath = path.join(__dirname, '../../public', imageUrl); // Sesuaikan path ke folder gambar
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ message: 'Failed to delete file' });
      }

      console.log('File deleted successfully');
    });

    // Berikan respons sukses
    res.status(204).send({
      message: 'Product deleted successfully',
      product: deleteProductByCode
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Failed to create product' });
  }
}