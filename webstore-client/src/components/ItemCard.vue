<template>
    <div class="product-container">
        <img :src="`http://localhost:8000${item.imageUrl}`" alt="" class="product-image">
        <div class="details-wrap">
          <h3>{{ item.name }}</h3>
          <p>{{ item.price * quantity | currencyFormat }}</p>
          <p>Stock: {{ item.stock }}</p>
        </div>
        <QtySelector v-model="quantity" :max="item.stock" class="qty-selector"/>
        <button 
          class="remove-button"
          @click="$emit('remove-item', item.code)"
        >Remove</button>
    </div>
</template>

<script>
import QtySelector from './QtySelector.vue';
import axios from 'axios';
import { ORDER_API_ENDPOINTS } from '@/services/api';
export default {
  components: {
    QtySelector
  },
  props: [
    "item"
  ],
  async created() {
    await this.$store.dispatch('fetchCartQty');
    this.isInitialized = true
  },
  data() {
    return {
      isInitialized: false, // Status untuk memeriksa apakah data sudah di-fetch
    };
  },
  watch: {
    quantity: {
      async handler(newVal) {
        if(this.isInitialized) {
          try {
            await axios.post(ORDER_API_ENDPOINTS.updateOrder, {
            product: [{ 
                code: this.item.code, 
                quantity: newVal 
              }]
            }, { withCredentials: true })
          } catch (error) {
            console.error("Failed to update cart:", error);
          }
        }
      },
      deep: true, // To watch for changes in array elements
      immediate: false
    }
  },
  computed: {
    quantity: {
      get() {
        return this.$store.getters.getItemQuantity(this.item.code);
      },
      set(newQuantity) {
        this.$store.dispatch('setItemQuantity', { code: this.item.code, quantity: newQuantity });
      }
    }
  },
  methods: {
    updateQuantity(newQuantity) {
      this.quantity = newQuantity;
      console.log(newQuantity)
    }
  }
}
</script>

<style scoped>
.product-container {
    align-items: 'center';
    border-bottom: 1px solid #ddd;
    display: flex;
    padding: 16px;
    width: 100%;
  }
  .product-image {
    flex: 1;
    height: 100px;
    max-width: 100px;
  }
  .qty-selector {
    padding: 0 16px;
    justify-content: center;
    align-content: center;
    margin: 0 !important;
    flex: 2;
  }
  .details-wrap {
    padding: 0 16px;
    flex: 2;
  }
  .remove-button {
    flex: 1;
    margin: auto;
  }
</style>