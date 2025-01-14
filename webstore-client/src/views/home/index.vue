<template>
  <div class="home">
    <!-- Jumbotron Utama -->
    <section class="jumbotron text-white text-center d-flex align-items-center justify-content-center" style="background: url('/jumbotron-background.png') no-repeat center center / cover; height: 100vh;">
      <div class="container">
        <div class="text-background">
          <h1 class="display-4 font-weight-bold">Selamat Datang di Webstore Kami!</h1>
          <p class="lead">Temukan produk pilihan terbaik untuk kebutuhan Anda. Belanja sekarang dan nikmati berbagai penawaran menarik!</p>
        </div>
        <a href="/products" class="btn btn-lg btn-success mt-3">Belanja Sekarang</a>
      </div>
    </section>

    <!-- Produk Unggulan -->
    <section class="featured-products container my-5">
      <h3 class="text-center mb-4">Produk Unggulan</h3>
      <swiper-container 
        :slides-per-view="slidesPerView"
        speed="500" loop="true" css-mode="true" navigation="true" pagination="true">
        <swiper-slide v-for="(product, index) in featuredProducts" :key="index" class="px-2 pb-5">
          <div class="card shadow h-100 m-2">
            <img :src="`${BACKEND_URL}${product.image}`" class="card-img-top" :alt="product.name">
            <div class="card-body">
              <a :href="`/product/${product.code}`">
                <h5 class="card-title">{{ product.name }}</h5>
                <p class="card-text text-muted">{{ product.description }}</p>
                <p class="font-weight-bold">Rp {{ product.price }}</p>
              </a>
              <button class="btn btn-success w-100" @click="addToCart(product)">Tambah ke Keranjang</button>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
    </section>

    <!-- Kategori Utama -->
    <section class="categories bg-light py-5">
      <div class="container">
        <h3 class="mb-4 text-center">Kategori Utama</h3>
        <div class="d-flex justify-content-between align-items-center">
          <span></span>
          <a href="/categories" class="px-3 simple-link">Semua Kategori</a>
        </div>
        <swiper-container :slides-per-view="slidesPerView" speed="500" loop="true" css-mode="true" navigation="true" pagination="true">
          <swiper-slide v-for="(category, index) in categories" :key="index" class="px-2 pb-5">
            <div class="category-card shadow-sm p-3 d-flex flex-column align-items-center">
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
          </swiper-slide>
        </swiper-container>
      </div>
    </section>
  </div>
</template>

<script>
import { PRODUCT_API_ENDPOINTS, CATEGORY_API_ENDPOINTS, ORDER_API_ENDPOINTS } from '@/services/api';
import axios from 'axios';
import { BACKEND_URL } from '@/services/api';
export default {
  data() {
    return {
      featuredProducts: [],
      categories: [],
      BACKEND_URL,
      slidesPerView: 3,
    };
  },
  mounted() {
    this.fetchFeaturedProducts();
    this.fetchAllCategories();
    window.addEventListener('resize', this.updateSlidesPerView);
    this.updateSlidesPerView();
  },
  methods: {
    async fetchFeaturedProducts() {
      try {
        const response = await axios.get(PRODUCT_API_ENDPOINTS.getFeaturedProducts);
        this.featuredProducts = response.data.map(product => ({
          code: product.code,
          name: product.name,
          description: product.description,
          price: product.price.toLocaleString(), // Format harga dengan pemisah ribuan
          image: product.imageUrl,  // Pastikan nama key sesuai dengan response API
        }));
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    },
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
    async addToCart(product) {
      try{
        const response = await axios.post(ORDER_API_ENDPOINTS.updateOrder, {
          product: [{ // Mengirim produk dalam array
            code: product.code,
            quantity: 1
          }]
        }, { withCredentials: true });
          if (response.status === 200) {
            this.$swal.fire({
              title: "added!",
              text: "Your product has been added to cart.",
              icon: "success"
            });
          } else {
            throw new Error("Failed to add product");
          } 
        this.notif = true
        const result = await axios.get(ORDER_API_ENDPOINTS.getOrder, {
            withCredentials: true
        });
        let data = Object.assign({},
          ...(result.data.map(
            result => ({
              cart_items: result.products
            })
          ))
        )

        this.$emit('update-cart-qty', data.cart_items.length);
      } catch (error) {
        this.$swal.fire({
          title: "Error!",
          text: `Failed to add product: ${error.message}`,
          icon: "error"
        });
      }
    },
    updateSlidesPerView() {
      const width = window.innerWidth;
      if (width <= 576) {
        this.slidesPerView = 1;
      } else if (width <= 768) {
        this.slidesPerView = 2;
      } else {
        this.slidesPerView = 3;
      }
    }
  },
};
</script>

<style scoped>
/* Jumbotron */
.jumbotron {
  position: relative;
  background-color: #92C568;
  color: #333; 
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}
.jumbotron .text-background {
  background-color: rgba(181, 223, 141, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
.jumbotron .btn-success {
  background-color: #36986D;
  border: none;
  color: white;
  transition: background-color 0.3s ease;
}
.jumbotron .btn-success:hover {
  background-color: #267356;
}
.jumbotron .container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.jumbotron h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2B2B2B;
}
.jumbotron p {
  font-size: 1rem;
  color: #3D3D3D;
}

.simple-link {
  text-decoration: none;
  color: #36986d;
  font-size: 0.8rem;
  transition: 0.2s;
}

.simple-link:hover {
  text-decoration: dashed;
  color: #49d196;
}

/* Swiper */
.swiper {
  width: 100%;
  padding: 20px 0;
}

/* Produk Unggulan */
.card-body a {
  text-decoration: none;
  color: black;
}
.card {
  min-height: 400px;
}
.card img {
  height: 200px;
  object-fit: cover;
}

/* Kategori Utama */
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

/* Media Queries */
@media (max-width: 992px) {
  .jumbotron h1 {
    font-size: 2rem;
  }
  .jumbotron p {
    font-size: 0.9rem;
  }
  .swiper-container {
    padding: 10px 0;
  }
  .swiper-slide {
    padding: 10px;
  }
  .categories .category-card {
    min-height: 200px;
  }
}

@media (max-width: 768px) {
  .jumbotron {
    text-align: center;
    padding: 40px 20px;
  }
  .jumbotron h1 {
    font-size: 1.8rem;
  }
  .jumbotron p {
    font-size: 0.85rem;
  }
  .swiper-container {
    padding: 5px 0;
  }
  .swiper-slide {
    flex: 1 1 100%;
    padding: 5px;
  }
  .categories .category-card {
    min-height: 180px;
  }
  .card {
    min-height: 350px;
  }
  .card img {
    height: 150px;
  }
}

@media (max-width: 576px) {
  .jumbotron h1 {
    font-size: 1.5rem;
  }
  .jumbotron p {
    font-size: 0.75rem;
  }
  .btn-success {
    font-size: 0.8rem;
    padding: 0.4rem 1rem;
  }
  .swiper-slide {
    flex: 1 1 100%;
    padding: 5px;
  }
  .categories .category-card {
    min-height: 150px;
  }
  .card {
    min-height: 300px;
  }
  .card img {
    height: 120px;
  }
}
</style>