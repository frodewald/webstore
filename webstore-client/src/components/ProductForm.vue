<template>
    <form @submit.prevent="submitProduct">
    <div class="mb-3">
        <label for="code" class="form-label">Code</label>
        <input
        type="text"
        name="code"
        class="form-control"
        v-model="Product.code"
        id="code"
        :disabled="isUpdate"
        :required="!isUpdate"
        />
    </div>
    <div class="mb-3">
        <label for="nama" class="form-label">Nama <span style="color: red;">*</span></label>
        <input type="text" name="nama" class="form-control" v-model="Product.nama" id="nama" required />
    </div>
    <div class="mb-3">
        <label for="category" class="form-label">Category</label>
        <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            {{ Product.selectedCategory ? Product.selectedCategory.name : 'Select a Category' }}
        </button>
        <ul class="dropdown-menu">
            <li v-for="category in categories" :key="category.id">
            <a class="dropdown-item" href="#" @click="selectCategory(category)">{{ category.name }}</a>
            </li>
        </ul>
        </div>
    </div>
    <div class="mb-3">
        <label for="harga" class="form-label">Harga <span style="color: red;">*</span></label>
        <input type="number" name="harga" class="form-control" v-model="Product.harga" id="harga" @wheel.prevent required />
    </div>
    <div class="mb-3">
        <label for="stok" class="form-label">Stok <span style="color: red;">*</span></label>
        <input type="number" name="stok" class="form-control" v-model="Product.stok" id="stok" @wheel.prevent required />
    </div>
    <div class="mb-3">
        <label for="berat" class="form-label">Berat <span style="color: red;">*</span></label>
        <input type="number" name="berat" class="form-control" v-model="Product.berat" id="berat" required />
    </div>
    <div class="mb-3">
        <label for="dimensi" class="form-label">Dimensi</label>
        <input type="text" name="dimensi" class="form-control" v-model="Product.dimensi" id="dimensi" />
    </div>
    <div class="mb-3">
        <label for="deskripsi" class="form-label">Deskripsi <span style="color: red;">*</span></label>
        <textarea name="deskripsi" class="form-control" id="deskripsi" rows="5" v-model="Product.deskripsi" required></textarea>
    </div>
    <div class="mb-3">
        <label for="image" class="form-label">Foto Produk <span style="color: red;">*</span></label>
        <div class="upload-img">
        <img v-if="Product.imgPreviewUrl || Product.imgUrl" :src="Product.imgPreviewUrl || `${BACKEND_URL}${Product.imgUrl}`" class="img-thumbnail" alt="">
        <div v-if="!Product.imgPreviewUrl && !Product.imgUrl" class="file-input-box">
            <input type="file" @change="onFileChange" class="custom-file-input" id="image-input" />
            <div class="icon-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z"/>
            </svg>
            </div>
        </div>
        <div v-if="Product.imgPreviewUrl || Product.imgUrl" class="delete-img" @click="deleteImage">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
            </svg>
        </div>
        </div>
    </div>
    <button type="submit" class="btn btn-primary w-100">{{ isUpdate ? 'Update' : 'Create' }} Product</button>
    </form>
  </template>
  
  <script>
  // eslint-disable-next-line no-unused-vars
  import { BACKEND_URL } from '@/services/api';
  export default {
    props: {
      isUpdate: {
        type: Boolean,
        default: false,
      },
      initialProduct: {
        type: Object,
        default: () => ({}),
      },
      categories: {
        type: Array,
        default: () => [],
      }
    },
    data() {
      return {
        Product: {...this.initialProduct},
        BACKEND_URL
      };
    },
    methods: {
      submitProduct() {
        this.$emit("submit", { ...this.Product });
      },
      selectCategory(category) {
        this.Product.selectedCategory = category;
      },
      onFileChange(e) {
        const file = e.target.files[0];
        if (file) {
          this.Product.imgPreviewUrl = URL.createObjectURL(file);
          this.Product.imgUrl = file;
        }
      },
      deleteImage() {
        this.Product.imgPreviewUrl = "";
        this.Product.imgUrl = "";
      },
    },
    watch: {
      initialProduct: {
        immediate: true,
        deep: true,  // Tambahkan deep untuk memantau perubahan properti di dalam objek
        handler(newValue) {
          this.Product = { ...newValue };
          console.log(newValue)
        },
      },
    },
  };
  </script>
  <style scoped>
  textarea#deskripsi {
    width: 100%;
    resize: none;
  }
  .upload-img {
    position: relative;
    width: 20%;
  } 
  .img-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .file-input-box {
    width: 100%;
    height: 116px;
    background-color: #f8f9fa;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed #ccc;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
  }
  .custom-file-input {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .icon-placeholder {
    text-align: center;
  }
  .delete-img {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(150, 148, 148, 0.5);
    padding: 5px;
    cursor: pointer;
  }
  </style>