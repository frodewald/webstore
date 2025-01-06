<template>
  <div class="container">
    <div class="header">
      <h1>Produk Saya</h1>
      <router-link :to="{ name: 'create-product' }">
        <button class="create-button">Create Product</button>
      </router-link>
    </div>
    <div class="mb-4">
      <searchComponent v-model="searchInputUser" @selectedCriteriaInComp="handleSelectedCriteria" />
    </div>
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <ItemEdit 
          v-for="product in paginatedProducts"
          :key="product.id"
          :product="product"
          @product-deleted="removeProduct"
        />
      </tbody>
    </table>
    <pagination
      v-model="currentPage"
      :records="totalRecords"
      :per-page="itemsPerPage"
      @paginate="handlePageChange"
      :options="paginationOptions"
      class="pagination"
    />
  </div>
</template>
  
  <script>
  import axios from 'axios';
  import ItemEdit from '@/components/ItemEdit.vue';
  import { PRODUCT_API_ENDPOINTS } from '@/services/api';
  import SearchComponent from '@/components/searchComponent.vue';
  
  export default {
    components: {
      ItemEdit,
      SearchComponent
    },
    data() {
      return {
        products: [],
        currentPage: 1,
        itemsPerPage: 10,
        totalRecords: 0,
        paginationOptions: {
          theme: 'bootstrap4',
          edgeNavigation: true 
        },
        selectedCriteria: "",
        searchInputUser: "",
      }
    },
    // lifecycle hooknya vue (proses saat kita membuat component pada vue), jadi saat component berhasil kita buat, langkah selanjutnya akan melakukan proses di dalam created
    async created() {
      const result = await axios.get(PRODUCT_API_ENDPOINTS.getAllProduct)
      this.products = result.data
      this.totalRecords = this.products.length;
    },
    computed: {
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
        
        if(this.selectedCriteria === "") {
          filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(this.searchInputUser.toLowerCase())
          );
        }
        return filtered;
      },
      paginatedProducts() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredProducts.slice(start, end);
      },
    },
    methods: {
      removeProduct(deletedProductCode) {
        this.products = this.products.filter(product => product.code !== deletedProductCode);
      },
      handlePageChange(pageNum) {
        this.currentPage = pageNum;
      },
      handleSelectedCriteria(criteria) {
        this.selectedCriteria = criteria
      }
    },
    watch: {
      filteredProducts: {
        immediate: true,
        handler(newFilteredProducts) {
          this.totalRecords = newFilteredProducts.length;
        }
      },
    }
  }
</script>
  
<style scoped>
.container {
  width: 80%;
  margin-top: 3%;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5%;
}
.grid-wrap {
  display: flex;
  flex-direction: column;
  margin-top: 16px;
}
table {
  width: 100%;
  border-collapse: collapse;
  box-shadow: 0 0 2px rgb(199, 198, 198);
}

th, td {
  text-align: left;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}

.product-info {
  display: flex;
  align-items: center;
}

.product-info img {
  margin-right: 10px;
}

th:nth-child(1), td:nth-child(1) {
  width: 40%;
}

th:nth-child(2), td:nth-child(2) {
  width: 20%;
}

th:nth-child(3), td:nth-child(3) {
  width: 20%;
}

th:nth-child(4), td:nth-child(4) {
  width: 20%;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  text-align: center;
}

.search-product {
 width: fit-content;
}

.create-product:hover {
  background-color: aquamarine;
}
</style>