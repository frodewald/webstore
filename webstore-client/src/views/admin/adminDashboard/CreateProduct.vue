<template>
    <div class="container mt-5">
      <h1 class="text-center mb-4">Create Item</h1>
      <ProductForm :isUpdate="false" :initialProduct="Product" :categories="categories" @submit="updateProductFromChild"/>
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
    },
    methods: {
      updateProductFromChild(productData) {
        this.Product = productData;
        this.createProduct();
      },
      async createProduct() {
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
          const response = await axios.post(PRODUCT_API_ENDPOINTS.createProduct, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          });
          if (response.status === 201) {
            this.$swal.fire({
              title: "Created!",
              text: "Your product has been created.",
              icon: "success"
            });
            setTimeout(() => {
              this.$router.push('/admin/dashboard');
            }, 2000);
          } else {
            throw new Error("Failed to create product");
          } 
        } catch (error) {
          this.$swal.fire({
            title: "Error!",
            text: `Failed to create product: ${error.message}`,
            icon: "error"
          });
          console.error('Error creating product:', error);
        }
      },
      async getCategory() {
        const { data } = await axios.get(CATEGORY_API_ENDPOINTS.getAllCategory)
        this.categories = data.map((data) => ({
          id: data.id,
          name: data.name
        }))
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
  