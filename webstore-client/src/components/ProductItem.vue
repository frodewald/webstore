<template>
  <div class="p-2">
    <div class="product-item card shadow-sm">
      <img 
        :src="`${BACKEND_URL}${product.imageUrl}`" 
        class="card-img-top"
        alt="Product Image"
      />
      <div class="card-body d-flex flex-column">
        <h5 class="card-title text-truncate">{{ product.name }}</h5>
        <p class="card-text text-success fw-bold">{{ product.price | currencyFormat }}</p>
        <p class="card-text text-muted">Stock: {{ product.stock }}</p>
        <div class="rating d-flex mb-3">
          <span 
            v-for="n in 5" 
            :key="n" 
            class="text-warning"
          >
            <i :class="n <= product.averageRating ? 'fas fa-star' : 'far fa-star'"></i>
          </span>
        </div>
        <router-link :to="{ name: 'product-detail', params: { id: product.code } }">
          <button class="btn btn-success w-100">View Details</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { BACKEND_URL } from '@/services/api';
export default {
  data() {
    return {
      BACKEND_URL
    };
  },
  props: ['product'],
}
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';

.product-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0;
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
  transition: opacity 0.3s; /* Animasi hover untuk gambar */
}

.card-img-top:hover {
  opacity: 0.9; /* Sedikit redup saat hover */
}

.card-title {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.card-text {
  font-size: 0.875rem;
}

.rating i {
  margin-right: 0.1rem;
}

@media (max-width: 768px) {
  .product-item {
    max-width: 100%; /* Ambil seluruh lebar layar pada perangkat kecil */
  }

  .card-img-top {
    height: 150px; /* Kurangi tinggi gambar pada layar kecil */
  }

  .card-title {
    font-size: 0.9rem; /* Kurangi ukuran font pada layar kecil */
  }

  .card-text {
    font-size: 0.8rem; /* Sesuaikan font untuk teks deskripsi */
  }
}

@media (max-width: 576px) {
  .product-item {
    margin-bottom: 1.5rem; /* Tambahkan ruang antar kartu */
  }

  .card-title {
    font-size: 0.85rem; /* Kurangi ukuran font lebih lanjut */
  }
}
</style>
