<template>
  <div class="product-item card shadow-sm mb-4" style="width: 30%;">
  <img :src="`http://localhost:8000${product.imageUrl}`" class="card-img-top rounded-3" style="height: 200px; object-fit: cover;" />
  <div class="card-body d-flex flex-column">
    <h5 class="card-title text-truncate">{{ product.name }}</h5>
    <p class="card-text text-success fw-bold">{{ product.price | currencyFormat }}</p>
    <p class="card-text text-muted">Stock: {{ product.stock }}</p>
    <div class="d-flex mb-3">
      <span v-for="n in 5" :key="n" class="text-warning">
        <i :class="n <= product.averageRating ? 'fas fa-star' : 'far fa-star'"></i>
      </span>
    </div>
    <router-link :to="{ name: 'product-detail', params: { id: product.code } }">
      <button class="btn btn-success w-100">View Details</button>
    </router-link>
  </div>
</div>
</template>

<script>
export default {
  props: ['product'],
}
</script>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
</style>