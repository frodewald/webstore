<template>
  <div id="cart-btn">
    <router-link :to="{ name: 'cart' }" id="cart-link">
        <button class="btn-success">Cart ({{ cartQty }})</button>
    </router-link> 
  </div>
</template>

<script>
export default {
    props: {
    cartQty: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
  #cart-btn {
  position: fixed;
  bottom: 20px; /* Posisi dari bawah */
  right: 20px; /* Posisi dari kanan */
}

#cart-link button {
  background-color: #28a745; /* Warna hijau untuk btn-success */
  color: white;
  padding: 10px 20px;
  border-radius: 12px; /* Border radius untuk membuatnya membulat */
  border: none;
  cursor: pointer;
  font-size: 16px;
}

#cart-link button:hover {
  background-color: #218838; /* Warna hijau yang lebih gelap saat di-hover */
}
</style>