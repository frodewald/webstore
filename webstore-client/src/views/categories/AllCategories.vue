<template>
  <div class="categories bg-light py-5">
    <div class="container">
      <h3 class="text-center mb-4">Semua Kategori</h3>
      <div class="row">
        <div 
          v-for="(category, index) in categories" 
          :key="index" 
          class="col-md-4 mb-4 d-flex">
          <div class="category-card shadow-sm p-3 d-flex flex-column align-items-center w-100">
            <div class="category-icon mb-3">
              <img :src="`${BACKEND_URL}${category.icon}`" alt="Icon" class="img-fluid" />
            </div>
            <h5 class="category-title mb-2">{{ category.name }}</h5>
            <p class="category-description text-muted text-center">
              {{ category.description }}
            </p>
            <a :href="`/products?category=${category.id}`" class="btn btn-outline-primary mt-auto">
              Jelajahi Kategori
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CATEGORY_API_ENDPOINTS } from '@/services/api';
import axios from 'axios';
import { BACKEND_URL } from '@/services/api';

export default {
  data() {
    return {
      categories: [],
      BACKEND_URL
    };
  },
  mounted() {
    this.fetchAllCategories();
  },
  methods: {
    async fetchAllCategories() {
      try {
        const response = await axios.get(CATEGORY_API_ENDPOINTS.getAllCategory);
        this.categories = response.data.map((category) => ({
          id: category.id,
          name: category.name,
          description: category.description,
          icon: category.iconUrl,
        }));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
  },
};
</script>

<style scoped>
.categories .category-card {
  border: 1px solid #eaeaea;
  border-radius: 12px;
  background-color: #fff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 250px;
  height: 100%;
}

.categories .category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.categories .category-icon {
  width: 70px;
  border-radius: 50%;
  background-color: #f9f9f9;
  padding: 10px;
}

.categories .category-icon img {
  width: 50px;
}

.categories .category-title {
  font-weight: bold;
  font-size: 1.1rem;
  color: #333;
}

.categories .category-description {
  font-size: 0.9rem;
  line-height: 1.4;
}

.categories .btn-outline-primary {
  border-radius: 20px;
  font-weight: bold;
  padding: 0.4rem 1rem;
  color: #41b883;
  border: 1px solid #41b883;
}

.categories .btn-outline-primary:hover {
  background-color: #41b883;
  color: #fff;
}
</style>