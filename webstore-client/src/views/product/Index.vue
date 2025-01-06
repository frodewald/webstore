<template>
  <div>
    <!-- Wrapper untuk Halaman Produk -->
    <div id="page-wrap" class="container mt-4">
      <!-- Komponen Pencarian Produk -->
      <search-component
        v-model="searchInputUser"
        @selectedCriteriaInComp="handleSelectedCriteria"
        class="search-product w-50"
      />

      <!-- Grid untuk Menampilkan Produk -->
      <div class="row g-4">
        <ProductItem
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
          class="col-12 col-sm-6 col-md-4 col-lg-4"
        />
      </div>

      <!-- Komponen Pagination -->
      <div class="d-flex justify-content-center mt-4">
        <pagination
          v-model="currentPage"
          :records="totalRecords"
          :per-page="itemsPerPage"
          @paginate="handlePageChange"
          :options="paginationOptions"
          class="pagination"
        />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import ProductItem from '@/components/ProductItem.vue';
import searchComponent from '@/components/searchComponent.vue';
import { PRODUCT_API_ENDPOINTS } from '@/services/api';

export default {
  components: {
    ProductItem,
    searchComponent
  },
  data() {
    return {
      products: [],
      currentPage: 1, // Halaman saat ini
      itemsPerPage: 9, // Jumlah item per halaman
      totalRecords: 0, // Total jumlah produk
      paginationOptions: {
        theme: 'bootstrap4', // Gaya CSS
        edgeNavigation: true // Tampilkan navigasi untuk halaman pertama dan terakhir
      },
      selectedCriteria: "",
      searchInputUser: "",
    }
  },
  async created() {
    const result = await axios.get(PRODUCT_API_ENDPOINTS.getAllProduct);
    this.products = result.data;
    this.totalRecords = this.products.length; // Set total records
  },
  computed: {
    // Mendapatkan produk yang harus ditampilkan berdasarkan halaman saat ini
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    filteredProducts() {
      let filtered = this.products;

      if (this.searchInputUser && this.selectedCriteria) {
        if (this.selectedCriteria === "nama") {
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(this.searchInputUser.toLowerCase())
          );
        } else if (this.selectedCriteria === "rating") {
          filtered = filtered.filter(product =>
            product.averageRating >= parseFloat(this.searchInputUser)
          );
        }
      }

      if (this.selectedCriteria === "") {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(this.searchInputUser.toLowerCase())
        );
      }
      return filtered; // Return hasil pencarian yang sudah dipaginasi
    },
    isInputNumber() {
      return this.selectedCriteria === 'rating'; // Jika selectedCriteria adalah 'rating', maka input harus berupa angka
    },
  },
  methods: {
    handlePageChange(pageNum) {
      this.currentPage = pageNum; // Update halaman saat ini
    },
    handleSelectedCriteria(criteria) {
      this.selectedCriteria = criteria;
    }
  },
  watch: {
    filteredProducts: {
      immediate: true,
      handler(newFilteredProducts) {
        this.totalRecords = newFilteredProducts.length;
      },
    },
  },
}
</script>

<style scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem; /* Menambahkan jarak antar item */
}

.col-12, .col-sm-6, .col-md-4, .col-lg-4 {
  padding: 0.5rem; /* Pastikan ada jarak antar kolom */
}
/* Gaya untuk Wrapper Halaman */
#page-wrap {
  padding: 0 15px;
}

/* Gaya untuk Grid Produk */
.grid-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 16px;
}

/* Gaya untuk Pagination */
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  text-align: center;
}

/* Gaya untuk Pencarian */
.search-product {
  width: 100%;
  max-width: 400px;
  display: flex;
  margin: 0 auto;
  margin-bottom: 20px;
}

/* Responsif untuk Grid Produk */
@media (max-width: 768px) {
  .col-sm-6 {
    margin-bottom: 20px;
  }
}

@media (max-width: 576px) {
  .search-product {
    width: 100%;
    margin-right: 0;
  }
}
</style>