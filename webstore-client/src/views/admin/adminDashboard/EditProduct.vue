<template>
    <div class="container mt-5">
      <h1 class="text-center mb-4">Update Item</h1>
      <ProductForm v-if="Product.code && categories.length" :isUpdate="true" :initialProduct="Product" :categories="categories" @submit="updateProductFromChild"/>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { PRODUCT_API_ENDPOINTS } from '@/services/api';
  import { CATEGORY_API_ENDPOINTS } from '@/services/api';
  import ProductForm from '@/components/ProductForm.vue';
  export default {
    components: {
      ProductForm
    },
    data() {
      return {
        Product: {
            code: "",
            nama: "",
            selectedCategory: null,
            harga: "",
            deskripsi: "",
            stok: "",
            berat: "",
            dimensi: "",
            imgUrl: "",
            imgPreviewUrl: "",
        },
        categories: [],
        notif: false
      };
    },
    async created() {
      await this.getCategory()
      await this.getProduct()
    },
    methods: {
      updateProductFromChild(productData) {
        this.Product = productData;
        this.updateProduct();
      },
      async updateProduct() {
        const code = this.$route.params.id
        const formData = new FormData();

         // Tambahkan data produk ke FormData
        formData.append('code', this.Product.code)
        formData.append('name', this.Product.nama);
        formData.append('categoryId', this.Product.selectedCategory.id);
        formData.append('price', this.Product.harga);
        formData.append('description', this.Product.deskripsi);
        formData.append('stock', this.Product.stok);
        formData.append('weight', this.Product.berat);
        formData.append('dimensions', this.Product.dimensi);

        // Tambahkan gambar jika ada
        if (this.Product.imgUrl) {
          formData.append('image', this.Product.imgUrl);
        }
        try {
          const response = await axios.put(PRODUCT_API_ENDPOINTS.updateProduct(code), formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          if (response.status === 200) {
            this.$swal.fire({
              title: "updated!",
              text: "Your product has been updated.",
              icon: "success"
            }).then(() => {
              // Fungsi ini akan dijalankan setelah pengguna menekan tombol "OK"
              this.getProduct(); // Panggil fungsi getProduct setelah redirect
              this.$router.push('/admin/dashboard');
            });
          } else {
            throw new Error("Failed to update product");
          } 
        } catch (error) {
          this.$swal.fire({
            title: "Error!",
            text: `Failed to update product: ${error.message}`,
            icon: "error"
          });
          console.error('Error updating product:', error);
        }
      },
      async getCategory() {
        const { data } = await axios.get(CATEGORY_API_ENDPOINTS.getAllCategory)
        this.categories = data.map((data) => ({
          id: data.id,
          name: data.name
        }))
        // console.log(data)
        console.log(this.categories)
      },
      async getProduct() {
        const code = this.$route.params.id
        const { data } = await axios.get(PRODUCT_API_ENDPOINTS.getProductById(code))
        console.log(data)

        this.Product.code = data.code
        this.Product.nama = data.name
        this.Product.harga = data.price
        this.Product.deskripsi = data.description
        this.Product.stok = data.stock
        this.Product.berat = data.weight
        this.Product.dimensi = data.dimensions
        this.Product.imgUrl = data.imageUrl

        const selectedCategory = this.categories.find(category => category.id === data.category_id);
        if (selectedCategory) {
          this.Product.selectedCategory = selectedCategory;
          console.log(this.Product.selectedCategory.id)
        }
      },
      
    },
  };
  </script>
  
  <style scoped>
  .notif {
    text-align: center;
    color: white;
    background-color: #41B883;
    padding: 3%;
    border-radius: 8px;
  }
  .container {
    max-width: 600px;
    margin-bottom: 10%;
  }
  </style>
  