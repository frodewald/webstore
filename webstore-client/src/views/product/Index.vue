<template>
  <div>
    <!-- Wrapper untuk Halaman Produk -->
    <div id="page-wrap" class="container mt-4">
      <div class="row">
        <!-- Kolom Kategori -->
        <div class="col-12 col-md-3">
          <div class="categories-wrapper">
            <h5>Categories</h5>
            <ul class="list-group">
              <li class="list-group-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box2 me-2" viewBox="0 0 16 16">
                  <path d="M2.95.4a1 1 0 0 1 .8-.4h8.5a1 1 0 0 1 .8.4l2.85 3.8a.5.5 0 0 1 .1.3V15a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V4.5a.5.5 0 0 1 .1-.3zM7.5 1H3.75L1.5 4h6zm1 0v3h6l-2.25-3zM15 5H1v10h14z"/>
                </svg>
                <router-link to="/products" class="text-decoration-none">All Products</router-link>
              </li>
              <li class="list-group-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-list-task me-2" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M2 2.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V3a.5.5 0 0 0-.5-.5zM3 3H2v1h1z"/>
                  <path d="M5 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M5.5 7a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1zm0 4a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1z"/>
                  <path fill-rule="evenodd" d="M1.5 7a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5zM2 7h1v1H2zm0 3.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm1 .5H2v1h1z"/>
                </svg>
                <router-link to="/categories" class="text-decoration-none">All Categories</router-link>
              </li>
              <hr>
              <li
                v-for="(category, index) in visibleCategories"
                :key="index"
                class="list-group-item"
              >
              <router-link
                :to="{ path: '/products', query: { category: category.id } }"
                class="category-link"
              >
                {{ category.name }}
              </router-link>
              </li>
            </ul>
            <button
              v-if="hasMoreCategories"
              class="btn btn-link"
              @click="expandCategories"
            >
              {{ showMore ? 'Show Less' : 'Show More' }}
            </button>
          </div>
        </div>

        <!-- Kolom Produk -->
        <div class="col-12 col-md-9">
          <!-- Filter Produk -->
          <div class="d-flex align-items-center w-100 gap-3 p-3 filter-product">
            <p class="m-0">Urutkan</p>
            <button
              class="btn btn-outline-success btn-filter"
              :class="{ active: sortOption === 'newest' }"
              @click="changeSortOption('newest')"
            >
              Terbaru
            </button>
            <button
              class="btn btn-outline-success btn-filter"
              :class="{ active: sortOption === 'bestSelling' }"
              @click="changeSortOption('bestSelling')"
            >
              Terlaris
            </button>

            <!-- Dropdown untuk Harga -->
            <select
              class="form-select form-select-sm d-inline-block w-auto select-filter"
              v-model="sortOption"
              @change="applySorting"
            >
              <option value="newest" disabled hidden>Harga</option>
              <option value="bestSelling" disabled hidden>Harga</option>
              <option value="priceAsc">Harga: Terendah</option>
              <option value="priceDesc">Harga: Tertinggi</option>
            </select>
          </div>

          <!-- Grid untuk Menampilkan Produk -->
          <div class="row">
            <ProductItem
              v-for="product in paginatedProducts"
              :key="product.id"
              :product="product"
              class="col-12 col-sm-6 col-md-4 col-lg-3"
            />
            <Loading :isLoading="isLoading" :isFullPage="false" />
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ProductItem from "@/components/ProductItem.vue";
import { PRODUCT_API_ENDPOINTS, CATEGORY_API_ENDPOINTS } from "@/services/api";
import Loading from "@/components/Loading.vue";

export default {
  components: {
    ProductItem,
    Loading
  },
  data() {
    return {
      products: [],
      currentPage: 1,
      itemsPerPage: 12,
      totalRecords: 0,
      paginationOptions: {
        theme: "bootstrap4",
        edgeNavigation: true,
      },
      searchInputUser: "",
      categories: [],
      visibleCategoryCount: 5,
      showMore: false,
      sortOption: "newest",
      isLoading: false,
    };
  },
  async created() {
    await this.fetchProducts();
    await this.fetchAllCategories();
  },
  computed: {
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedProducts.slice(start, end);
    },
    sortedProducts() {
      if (this.sortOption === "newest") {
        return this.filteredProducts.slice().sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
      } else if (this.sortOption === "bestSelling") {
        return this.filteredProducts.slice().sort((a, b) => b.sales - a.sales);
      } else if (this.sortOption === "priceAsc") {
        return this.filteredProducts.slice().sort((a, b) => a.price - b.price);
      } else if (this.sortOption === "priceDesc") {
        return this.filteredProducts.slice().sort((a, b) => b.price - a.price);
      }
      return this.filteredProducts;
    },
    filteredProducts() {
      return this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchInputUser.toLowerCase())
      );
    },
    visibleCategories() {
      return this.showMore
        ? this.categories
        : this.categories.slice(0, this.visibleCategoryCount);
    },
    hasMoreCategories() {
      return this.categories.length > this.visibleCategoryCount;
    },
  },
  methods: {
    changeSortOption(option) {
      this.sortOption = option;
      this.applySorting();
    },
    async fetchProducts() {
      this.isLoading = true
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get("search");
      const categoryQuery = urlParams.get("category");

      let result;

      try {
        if (searchQuery) {
          result = await axios.get(
            PRODUCT_API_ENDPOINTS.getProductsBySearch(searchQuery)
          );
        } else if (categoryQuery) {
          result = await axios.get(
            PRODUCT_API_ENDPOINTS.getProductsByCategoryId(categoryQuery)
          );
        } else {
          result = await axios.get(PRODUCT_API_ENDPOINTS.getAllProduct);
        }

        this.products = result.data;
        this.totalRecords = this.products.length;
        this.isLoading = false
      } catch (error) {
        console.error("Failed to fetch products:", error);
        this.products = [];
        this.totalRecords = 0;
        this.isLoading = false
      }
    },
    handlePageChange(pageNum) {
      this.currentPage = pageNum;
    },
    expandCategories() {
      this.showMore = !this.showMore;
    },
    async fetchAllCategories() {
      try {
        const response = await axios.get(CATEGORY_API_ENDPOINTS.getAllCategory);
        this.categories = response.data.map((category) => ({
          id: category.id,
          name: category.name,
        }));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    applySorting() {
      this.currentPage = 1; // Reset to the first page whenever sorting is applied
    },
  },
  watch: {
    filteredProducts: {
      immediate: true,
      handler(newFilteredProducts) {
        this.totalRecords = newFilteredProducts.length;
      },
    },
    "$route.query": {
      immediate: true,
      handler() {
        this.fetchProducts(); // Refetch data when query changes
      },
    },
  },
};
</script>

<style scoped>
.categories-wrapper {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.categories-wrapper h5 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.list-group-item {
  border: none;
  padding: 0.5rem 1rem;
  display: flex;
  cursor: pointer;
  align-items: center;
  gap: 5;
}

.list-group-item a {
  text-decoration: none;
  color: black;
}

.list-group-item a:hover {
  color: #198754;
  text-decoration: underline;
}

.filter-product {
  background-color: #f9f9f9;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.btn-filter {
  border-radius: 0;
  padding: 4px 15px; /* Menyesuaikan padding agar lebih kecil */
  font-size: 13px; /* Ukuran font lebih kecil */
}

.select-filter {
  width: auto;
  max-width: 150px; /* Lebar maksimal dropdown lebih kecil */
  height: auto;
  font-size: 13px; /* Ukuran font lebih kecil */
}

.btn-link {
  color: #198754;
  font-size: 0.9rem;
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: underline;
}
@media (max-width: 768px) {
  .btn-filter {
    padding: 4px 15px;
    font-size: 12px;
  }

  .select-filter {
    width: auto;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .btn-filter {
    font-size: 12px;
    padding: 4px 12px;
  }

  .select-filter {
    font-size: 12px;
    max-width: 120px; /* Lebar dropdown diperkecil lebih lanjut */
  }
}
</style>